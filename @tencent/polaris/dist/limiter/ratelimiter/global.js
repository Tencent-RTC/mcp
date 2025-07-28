"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalRatelimiter = void 0;
const process_1 = require("process");
const errors_1 = require("../../errors");
const plugins_1 = require("../../plugins");
const rules_1 = require("../../rules");
const utils_1 = require("../../utils");
const bucket_1 = require("../bucket");
const base_1 = require("./base");
const friendlyTaskType = (task) => {
    switch (task) {
        case 3 /* CheckOutdated */:
            return "CheckOutdated";
        case 4 /* ShouldSleep */:
            return "ShouldSleep";
        case 2 /* SyncQuota */:
            return "SyncQuota";
        case 1 /* UpdatePartition */:
            return "UpdatePartition";
        default:
            (0, utils_1.UNREACHABLE)();
    }
};
var GlobalStatus;
(function (GlobalStatus) {
    /** 释放 */
    GlobalStatus[GlobalStatus["Dispose"] = 0] = "Dispose";
    /** 休眠 */
    GlobalStatus[GlobalStatus["Sleep"] = 1] = "Sleep";
    /** 正常 */
    GlobalStatus[GlobalStatus["Normal"] = 2] = "Normal";
    /** 已过期 */
    GlobalStatus[GlobalStatus["Outdated"] = 3] = "Outdated";
})(GlobalStatus || (GlobalStatus = {}));
/**
 * 全局令牌桶
 * 对应 `LimitType.Global` 全局限流
 */
class GlobalRatelimiter {
    constructor(namespace, service, rule, logger, registry, backend, options) {
        var _a, _b, _c, _d;
        this.namespace = namespace;
        this.service = service;
        this.rule = rule;
        this.logger = logger;
        this.registry = registry;
        this.backend = backend;
        this.options = options;
        this.buckets = Object.create(null);
        this.taskInfo = Object.create(null);
        this.partition = 0;
        this.idlePeriods = 0;
        this.isAccessed = false;
        this.status = GlobalStatus.Sleep;
        if (rule.amounts.length === 0) {
            throw new errors_1.ArgumentError("no valid |QuotaConfig|");
        }
        let durations = [];
        rule.amounts.forEach(({ duration }) => {
            if (!(duration >= 1 * utils_1.kSeconds)) {
                throw new errors_1.ArgumentError(`duration(${duration}ms) must be larger than or equal to 1s`);
            }
            durations.push(~~(duration / utils_1.kSeconds));
        });
        this.maxDuration = Math.max(...durations) * utils_1.kSeconds;
        let interval = (_b = (_a = this.rule.report) === null || _a === void 0 ? void 0 : _a.interval) !== null && _b !== void 0 ? _b : 0;
        if (interval > 0) {
            durations.push(~~(interval / utils_1.kSeconds));
        }
        durations = durations.filter(duration => duration > 0);
        if (durations.length === 0) {
            (0, utils_1.UNREACHABLE)();
        }
        interval = ((0, utils_1.GreatestCommonDivisor)(...durations) * utils_1.kSeconds) / 10;
        if (Number.isNaN(interval)) {
            (0, utils_1.UNREACHABLE)();
        }
        let percent = (_d = (_c = this.rule.report) === null || _c === void 0 ? void 0 : _c.percent) !== null && _d !== void 0 ? _d : 0;
        if (!(percent > 0)) {
            percent = this.options.updatePercent;
        }
        this.updateConfig = {
            interval,
            percent
        };
    }
    async consume(preroll = false) {
        if (this.status === GlobalStatus.Dispose) {
            return false;
        }
        this.isAccessed = true;
        if (this.status === GlobalStatus.Sleep) {
            if (typeof this.wakePromise === "undefined") {
                this.wakePromise = this.wake();
            }
            await this.wakePromise;
            return this.consume(preroll);
        }
        if (typeof this.indexes === "undefined") {
            (0, utils_1.UNREACHABLE)();
        }
        const { local, remote, allocated } = this.indexes;
        let result;
        switch (this.status) {
            case GlobalStatus.Normal: {
                result = (0, base_1.deduction)(remote, 1, true);
                break;
            }
            case GlobalStatus.Outdated: {
                result = (0, base_1.deduction)(local, 1, true);
                break;
            }
            default: {
                (0, utils_1.UNREACHABLE)();
            }
        }
        if (result && !preroll) {
            (0, base_1.deduction)(local, 1, false);
            (0, base_1.deduction)(remote, 1, false);
            (0, base_1.deduction)(allocated, -1, false);
            if (allocated.some(({ remainingTokens }, index) => {
                const { partitionTokens } = local[index];
                return (remainingTokens / partitionTokens) > this.updateConfig.percent;
            })) {
                /*
                 * note:
                 *  异步同步远端配额，主流程尽快返回给调用者
                 */
                // eslint-disable-next-line @typescript-eslint/unbound-method
                this.scheduleTask(2 /* SyncQuota */, this.syncQuota, this.updateConfig.interval, true)
                    .catch(err => this.logger.error("[GlobalRatelimiter] [consume], call SyncQuota task", err));
            }
        }
        return result;
    }
    async return() {
        if (this.status === GlobalStatus.Dispose) {
            return;
        }
        this.isAccessed = true;
        if (this.status === GlobalStatus.Sleep) {
            if (typeof this.wakePromise === "undefined") {
                this.wakePromise = this.wake();
            }
            await this.wakePromise;
            return this.return();
        }
        if (typeof this.indexes === "undefined") {
            (0, utils_1.UNREACHABLE)();
        }
        const { local, remote, allocated } = this.indexes;
        if (!(0, base_1.deduction)(allocated, 1, false)) {
            (0, utils_1.UNREACHABLE)();
        }
        (0, base_1.deduction)(local, -1, false);
        (0, base_1.deduction)(remote, -1, false);
    }
    async getPartition() {
        this.isAccessed = true;
        if (this.status === GlobalStatus.Sleep) {
            if (typeof this.wakePromise === "undefined") {
                this.wakePromise = this.wake();
            }
            await this.wakePromise;
            return this.getPartition();
        }
        return this.partition;
    }
    dispose() {
        this.sleep();
        this.status = GlobalStatus.Dispose;
    }
    // #region Wake-sleep
    async wake() {
        try {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            await this.scheduleTask(1 /* UpdatePartition */, this.updatePartition, this.options.instanceUpdateTime, true);
        }
        catch (e) {
            this.wakePromise = undefined;
            throw e;
        }
        /**
         * 仅当第一次调用（桶列表为空）时才构建，
         * 唤醒时直接使用现有桶
         */
        if (typeof this.indexes === "undefined") {
            const localIndex = [];
            const remoteIndex = [];
            const allocatedIndex = [];
            this.indexes = {
                local: localIndex,
                remote: remoteIndex,
                allocated: allocatedIndex
            };
            // eslint-disable-next-line @typescript-eslint/naming-convention
            let Bucket;
            switch (this.rule.resource) {
                case rules_1.LimitResource.Concurrency: {
                    Bucket = bucket_1.BasicBucket;
                    break;
                }
                case rules_1.LimitResource.QPS: {
                    Bucket = bucket_1.InternalBucket;
                    break;
                }
                default: {
                    (0, utils_1.UNREACHABLE)();
                }
            }
            this.rule.amounts.forEach(({ amount, duration }) => {
                const local = new Bucket(amount, this.partition, false, duration, this.options);
                const allocated = new Bucket(0, 1, true, duration, this.options);
                const remote = new bucket_1.ExternalBucket(amount, this.partition);
                this.buckets[duration] = { local, allocated, remote };
                localIndex.push(local);
                remoteIndex.push(remote);
                allocatedIndex.push(allocated);
            });
        }
        try {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            await this.scheduleTask(2 /* SyncQuota */, this.syncQuota, this.updateConfig.interval, true);
        }
        catch (e) {
            this.wakePromise = undefined;
            throw e;
        }
        this.scheduleTask(3 /* CheckOutdated */, this.checkOutdated, this.updateConfig.interval * this.options.outdatedPeriod);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.scheduleTask(4 /* ShouldSleep */, this.shouldSleep, this.maxDuration * this.options.idlePeriod);
        this.wakePromise = undefined;
        this.status = GlobalStatus.Normal;
    }
    sleep() {
        if (this.status === GlobalStatus.Sleep || this.status === GlobalStatus.Dispose) {
            return;
        }
        for (let i = 0 /* Begin */ + 1; i < 5 /* End */; i += 1) {
            const task = this.taskInfo[i];
            if (task.timer) {
                clearInterval(task.timer);
                task.timer = undefined;
            }
        }
        this.idlePeriods = 0;
        this.isAccessed = false;
        this.status = GlobalStatus.Sleep;
    }
    async scheduleTask(type, timeout, interval, immediate = false) {
        let task = this.taskInfo[type];
        if (typeof task === "undefined") {
            task = Object.create(null);
            this.taskInfo[type] = task;
        }
        if (task.timer) {
            clearInterval(task.timer);
            task.timer = undefined;
        }
        task.timer = setInterval(() => {
            if (task.isRunning) {
                return;
            }
            task.isRunning = true;
            const result = timeout.call(this, task);
            if (typeof result === "object") {
                void result.catch(err => this.logger.error(`[GlobalRatelimiter] [scheduleTask], call ${friendlyTaskType(type)} task`, err)).then(() => (task.isRunning = false));
            }
            else {
                task.isRunning = false;
            }
        }, interval).unref();
        if (immediate) {
            task.isRunning = true;
            try {
                await timeout.call(this, task);
            }
            finally {
                task.isRunning = false;
            }
        }
    }
    async updatePartition() {
        if (this.registry.isDisposed) {
            this.dispose();
            return;
        }
        const instances = await this.registry.fetch(plugins_1.RegistryCategory.Instance, this.namespace, this.service);
        let partition = 0;
        instances.forEach((instance) => {
            if (instance.status === 0 /* Normal */) { /** 仅计算健康状态的实例数 */
                partition += 1;
            }
        });
        if (partition !== this.partition) {
            this.logger.info(`[GlobalRatelimiter] [updatePartition], partitions(${this.partition}) has changed to ${partition}`);
            this.partition = partition;
            Object.values(this.buckets).forEach(({ local, remote }) => {
                local.setPartition(partition);
                remote.setPartition(partition);
            });
        }
    }
    async syncQuota(task) {
        if (this.backend.isDisposed) {
            this.dispose();
            return;
        }
        const allocated = Object.keys(this.buckets).map((duration) => {
            const bucket = this.buckets[duration].allocated;
            let amount;
            switch (this.rule.resource) {
                case rules_1.LimitResource.QPS: {
                    amount = bucket.drain();
                    break;
                }
                case rules_1.LimitResource.Concurrency: {
                    amount = bucket.remainingTokens;
                    break;
                }
                default: {
                    (0, utils_1.UNREACHABLE)();
                }
            }
            return {
                amount,
                duration: parseInt(duration, 10),
                period: bucket.currentPeriod
            };
        });
        let response;
        try {
            response = await this.backend.acquireQuota(this.namespace, this.service, this.rule, allocated);
        }
        catch (e) {
            if (this.rule.resource === rules_1.LimitResource.QPS) {
                /**
                 * 如上报失败且 `allocated` 令牌桶还在当前周期时，
                 * 将扣减数加回，下次继续上报
                 */
                allocated.forEach(({ amount, duration, period }) => {
                    const bucket = this.buckets[duration].allocated;
                    if (bucket.currentPeriod === period) {
                        bucket.consume(amount * -1, false);
                    }
                });
            }
            throw e;
        }
        response.forEach(({ amount, duration }) => {
            const bucket = this.buckets[duration];
            if (typeof bucket === "undefined") {
                (0, utils_1.UNREACHABLE)();
            }
            bucket.remote.update(amount);
        });
        /**
         * 仅当状态为 `GlobalStatus.Outdated` 才进行切换，
         * 避免状态竞争问题
         */
        if (this.status === GlobalStatus.Outdated) {
            this.status = GlobalStatus.Normal;
        }
        task.timestamp = (0, process_1.uptime)();
    }
    checkOutdated() {
        const updatedTime = this.taskInfo[2 /* SyncQuota */].timestamp;
        if (this.status === GlobalStatus.Normal /** 仅当状态为 `GlobalStatus.Normal` 才进行切换，避免状态竞争问题 */
            && updatedTime !== undefined
            && (0, process_1.uptime)() - updatedTime >= (this.updateConfig.interval * this.options.outdatedPeriod) / utils_1.kSeconds) {
            this.status = GlobalStatus.Outdated;
            this.logger.debug("[GlobalRatelimiter] [checkOutdated], status has changed to Outdated");
        }
    }
    shouldSleep() {
        if (this.isAccessed) {
            this.idlePeriods = 0;
        }
        else {
            this.idlePeriods += 1;
        }
        this.isAccessed = false;
        /*
         * 为了降低消耗，当超过 `this.options.idlePeriod` 周期没有访问时，
         * 自动进入休眠状态（停止一切定时器）
         *
         * note:
         *  如外部不再强引用（WeakMap 为弱引用）当前对象，当进入休眠状态后，当前对象会被自动回收
         */
        if (this.idlePeriods > this.options.idlePeriod) {
            this.sleep();
        }
    }
}
exports.GlobalRatelimiter = GlobalRatelimiter;
//# sourceMappingURL=global.js.map