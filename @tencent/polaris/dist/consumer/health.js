"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Health = void 0;
const location_1 = require("../location");
const metadata_1 = require("../metadata");
const plugins_1 = require("../plugins");
const utils_1 = require("../utils");
const kDefaultOptions = {
    /**
     * 检查间隔
     *
     * 此值确定了，探活子系统的最小分辨率
     */
    detectInterval: 10 * utils_1.kSeconds,
    /**
     * 熔断超时时间
     *
     * 未配置任何探活模块时生效
     */
    fusingTimeout: 5 * utils_1.kSeconds,
    /**
     * 状态变更上报间隔
     */
    reportInterval: 5 * utils_1.kMinutes,
    /**
     * 状态变更上报阈值
     */
    reportThreshold: 10000
};
class Health {
    constructor(logger, registry, lb, detectors, reporters, options) {
        this.logger = logger;
        this.registry = registry;
        this.lb = lb;
        this.detectors = detectors;
        this.reporters = reporters;
        this.pending = new WeakSet();
        this.history = Object.create(null);
        this.countOfHistory = 0;
        this.disposed = false;
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
        this.needReport = reporters.some(report => typeof report.statusChangelog === "function");
        this.run();
    }
    dispose() {
        if (this.reportTimer) {
            clearTimeout(this.reportTimer);
            this.reportTimer = undefined;
        }
        if (this.detectTimer) {
            clearTimeout(this.detectTimer);
            this.detectTimer = undefined;
        }
        this.disposed = true;
    }
    /* eslint-enable max-len */
    changeStatus(namespace, service, ...args) {
        if (this.disposed) {
            return;
        }
        const statusLogger = this.needReport ? this.getServiceChangelog(namespace, service).status : undefined;
        if (args.length === 1) {
            args[0].forEach((change, instance) => {
                this.performStatusChange(namespace, service, instance, change.status, change.reason, statusLogger);
            });
        }
        else {
            this.performStatusChange(namespace, service, args[0], args[1], args[2], statusLogger);
        }
        if (this.needReport) {
            this.scheduleReport();
        }
    }
    recoverAll(namespace, service, instances) {
        if (this.disposed || !this.needReport) {
            return;
        }
        let intersection;
        instances.forEach((instance) => {
            if (instance.status !== 0 /* Normal */) {
                /**
                 * 计算实例相交的部分
                 */
                if (intersection === undefined) {
                    intersection = {
                        location: instance.location,
                        metadata: instance.metadata
                    };
                }
                else {
                    if (!(0, location_1.isEmptyLocation)(intersection.location)) {
                        intersection.location = (0, location_1.intersectionLocation)(intersection.location, instance.location);
                    }
                    if (!(0, metadata_1.isEmptyMetadata)(intersection.metadata)) {
                        intersection.metadata = (0, metadata_1.intersectionMetadata)(intersection.metadata, instance.metadata);
                    }
                }
            }
        });
        if (intersection !== undefined) {
            this.getServiceChangelog(namespace, service).recover.push({
                intersection,
                time: Date.now()
            });
            this.countOfHistory += 1;
            this.scheduleReport();
        }
    }
    scheduleReport() {
        if (this.countOfHistory >= this.options.reportThreshold) {
            if (this.reportTimer !== undefined) {
                clearTimeout(this.reportTimer);
                this.reportTimer = undefined;
            }
            this.report();
        }
        else if (this.reportTimer === undefined) {
            this.reportTimer = setTimeout(() => {
                this.reportTimer = undefined;
                this.report();
            }, this.options.reportInterval).unref();
        }
    }
    report() {
        const { history } = this;
        this.history = Object.create(null);
        this.countOfHistory = 0;
        Object.keys(history).forEach((namespace) => {
            const serviceHistory = history[namespace];
            Object.keys(serviceHistory).forEach((service) => {
                this.reporters.forEach((reporter) => {
                    var _a;
                    (_a = reporter.statusChangelog) === null || _a === void 0 ? void 0 : _a.call(reporter, namespace, service, serviceHistory[service]).catch(err => this.disposed || this.logger.error(`[${reporter.name}] [statusChangelog]`, err));
                });
            });
        });
    }
    getServiceChangelog(namespace, service) {
        let ns = this.history[namespace];
        if (!ns) {
            ns = Object.create(null);
            this.history[namespace] = ns;
        }
        let changelog = ns[service];
        if (!changelog) {
            changelog = {
                recover: [],
                status: new Map()
            };
            ns[service] = changelog;
        }
        return changelog;
    }
    performStatusChange(namespace, service, instance, status, reason, statusLogger) {
        var _a, _b;
        if (instance.status === status) {
            return;
        }
        const before = instance.status;
        if (statusLogger !== undefined) {
            let statusHistory = statusLogger.get(instance);
            if (statusHistory === undefined) {
                statusHistory = [];
                statusLogger.set(instance, statusHistory);
            }
            statusHistory.push({
                time: Date.now(),
                after: status,
                before,
                reason
            });
            this.countOfHistory += 1;
        }
        instance.status = status;
        (_b = (_a = this.lb).onStatusChange) === null || _b === void 0 ? void 0 : _b.call(_a, namespace, service, instance, before);
    }
    // #endregion
    // #region detector
    async detect() {
        const promises = [];
        const instanceStorage = this.registry.local(plugins_1.RegistryCategory.Instance);
        for (const namespace of Object.keys(instanceStorage)) {
            const namespaceInstance = instanceStorage[namespace];
            for (const service of Object.keys(namespaceInstance)) {
                const instances = namespaceInstance[service].data;
                for (const instance of instances) {
                    if (instance.status === 3 /* Fused */ && !this.pending.has(instance)) {
                        instance.dynamicWeight = 0;
                        promises.push(this.detectInstance(instance)
                            .then(result => this.procDetectResult(namespace, service, instance, result), err => this.logger.error("[health] [detect]", err)));
                    }
                }
            }
        }
        await Promise.all(promises);
    }
    procDetectResult(namespace, service, instance, result) {
        if (instance.status !== 3 /* Fused */) {
            return;
        }
        const totalDetectors = this.detectors.length;
        /**
         * 根据所有探活模块的探测结果切换当前实例状态：
         * * 成功：`Fused` ==(立即)==> `HalfOpen`
         * * 未知：`Fused` ==(fusingTimeout)==> `HalfOpen`
         * * 失败：保持当前实例状态，等待下次继续探测
         */
        switch (result) {
            case 0 /* Success */: {
                this.successfulDetection(namespace, service, instance, `[health] [detect], one of detectors(${totalDetectors}) successfully detected`);
                break;
            }
            case 2 /* Other */: {
                setTimeout(() => {
                    this.successfulDetection(namespace, service, instance, `[health] [detect], ${totalDetectors > 0 ? `one of detectors(${totalDetectors}) detected result is unknown, and ` : ""}has exceeded the fusing timeout(${this.options.fusingTimeout}ms)`);
                }, this.options.fusingTimeout).unref();
                break;
            }
            case 1 /* Failure */: {
                break;
            }
            default: {
                (0, utils_1.UNREACHABLE)();
            }
        }
    }
    successfulDetection(namespace, service, instance, reason) {
        /**
         * 由于为异步探活，实例状态可能已被其它模块修改，
         * 如果当前状态不为 `Fused` 则不进行切换。
         */
        if (instance.status === 3 /* Fused */) {
            this.changeStatus(namespace, service, instance, 1 /* HalfOpen */, reason);
        }
    }
    async detectInstance(instance) {
        const totalDetectors = this.detectors.length;
        for (let i = 0; i < totalDetectors; i += 1) {
            const result = await this.detectors[i].detect(instance);
            switch (result) {
                case 1 /* Failure */:
                case 2 /* Other */: {
                    return result;
                }
                case 0 /* Success */: {
                    break;
                }
                default: {
                    (0, utils_1.UNREACHABLE)();
                }
            }
        }
        if (totalDetectors > 0) {
            return 0 /* Success */;
        }
        return 2 /* Other */;
    }
    run() {
        if (this.detectTimer) {
            return;
        }
        /*
         * 为了性能考虑 `Health` 流程采用同一定时器驱动
         * tradeoff:
         *   在最坏的情况下（未配置任何探活模块时），
         *   由 `Fused` ---> `Normal` 至少需要等待 `detectInterval + fusingTimeout`
         *   而非 `fusingTimeout` 中指定的值。
         */
        this.detectTimer = setTimeout(() => {
            this.detect().then(() => {
                if (this.disposed) {
                    return;
                }
                this.detectTimer = undefined;
                this.run();
            }, () => {
                (0, utils_1.UNREACHABLE)();
            });
        }, this.options.detectInterval).unref();
    }
}
exports.Health = Health;
//# sourceMappingURL=health.js.map