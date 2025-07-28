"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalMonitor = exports.InternalMonitor = exports.Monitor = void 0;
const errors_1 = require("../errors");
const plugins_1 = require("../plugins");
const utils_1 = require("../utils");
const kDefaultOptions = {
    /**
     * 统计周期
     *
     * 与统计单元数，共同确定了统计数据的计算间隔（监控子的系统最小分辨率）
     */
    statWindow: 1 * utils_1.kMinutes,
    /**
     * 统计单元数
     *
     * 与统计周期，共同确定了统计数据的计算间隔（监控子的系统最小分辨率）
     */
    bucketsCount: 12,
    /**
     * 是否开启动态权重
     *
     * 仅 `InternalMonitor` 有效
     */
    enableDynamicWeights: false,
    /**
     * 节点熔断插件开启状态
     *
     * 仅 `InternalMonitor` 有效
     */
    breakerSwitch: {
        /**
         * 实时熔断是否开启
         */
        realtime: true,
        /**
         * 周期熔断是否开启
         */
        period: true
    }
};
class StatStore {
    constructor() {
        this.store = Object.create(null);
    }
    get(namespace, service) {
        let ns = this.store[namespace];
        if (!ns) {
            ns = Object.create(null);
            this.store[namespace] = ns;
        }
        let svr = ns[service];
        if (!svr) {
            svr = new Map();
            ns[service] = svr;
        }
        return svr;
    }
}
class Monitor {
    constructor(requisite = 0 /* None */) {
        this.currentPeriod = 0;
        this.disposed = false;
        if (requisite & 1 /* Full */) {
            this.fullStat = new StatStore();
        }
        if (requisite & 2 /* Alive */) {
            this.aliveStat = new StatStore();
        }
    }
    dispose() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        this.disposed = true;
    }
    update(namespace, service, instance, success, cost, code) {
        if (this.disposed) {
            return;
        }
        if (!(cost >= 0)) {
            throw new errors_1.ArgumentError("|cost| must be a non-negative number");
        }
        this.performUpdate(namespace, service, instance, success, cost, code, this.fullStat);
        if (instance.status !== 3 /* Fused */) {
            this.performUpdate(namespace, service, instance, success, cost, code, this.aliveStat);
        }
        if (!this.timer && (this.fullStat || this.aliveStat)) {
            /**
             * 为了性能考虑 `Monitor` 流程采用同一定时器驱动
             * tradeoff: 第一个统计单元中的统计数据可能是不精确的。
             */
            this.timer = setInterval(() => {
                this.compute();
            }, this.options.statWindow / this.options.bucketsCount).unref();
        }
    }
    performUpdate(namespace, service, instance, success, cost, code, store) {
        if (store === undefined) {
            return;
        }
        const serviceStat = store.get(namespace, service);
        let stat = serviceStat.get(instance);
        if (!stat) {
            stat = [];
            serviceStat.set(instance, stat);
        }
        let bucket;
        if (stat.length > 0) {
            bucket = stat[stat.length - 1];
        }
        if (!bucket || bucket.period !== this.currentPeriod) {
            bucket = {
                period: this.currentPeriod,
                stat: {}
            };
            stat.push(bucket);
        }
        const bucketKey = `${success ? 1 : 0}${code || ""}`;
        let prop = bucket.stat[bucketKey];
        if (prop === undefined) {
            prop = {
                cost: 0,
                count: 0
            };
            bucket.stat[bucketKey] = prop;
        }
        prop.cost += cost;
        prop.count += 1;
    }
}
exports.Monitor = Monitor;
class InternalMonitor extends Monitor {
    constructor(logger, health, registry, adjusters, reporters, breaker, options) {
        const normalizedOptions = Object.assign(Object.assign({}, kDefaultOptions), options);
        const { breakerSwitch, enableDynamicWeights } = normalizedOptions;
        if (breaker === undefined && (breakerSwitch.realtime || breakerSwitch.period)) {
            (0, utils_1.UNREACHABLE)();
        }
        let requisite = 0 /* None */;
        if (reporters.length > 0) {
            requisite |= 1 /* Full */;
        }
        if (enableDynamicWeights || breakerSwitch.realtime || breakerSwitch.period) {
            requisite |= 2 /* Alive */;
        }
        super(requisite);
        this.logger = logger;
        this.health = health;
        this.registry = registry;
        this.breaker = breaker;
        this.adjusters = adjusters;
        this.reporters = reporters;
        this.options = normalizedOptions;
        if (this.aliveStat) {
            this.registry.on("SyncInstanceStatus" /* SyncInstanceStatus */, (namespace, service, instance, status) => {
                if (!this.disposed && status === 3 /* Fused */) {
                    this.aliveStat.get(namespace, service).delete(instance);
                }
            });
        }
    }
    update(namespace, service, instance, success, cost, code) {
        super.update(namespace, service, instance, success, cost, code);
        if (this.options.breakerSwitch.realtime) {
            const change = this.breaker.realtime(namespace, service, instance, success, code);
            if (change !== undefined) {
                this.health.changeStatus(namespace, service, instance, change.status, change.reason);
                if (change.status === 3 /* Fused */) {
                    this.aliveStat.get(namespace, service).delete(instance);
                }
            }
        }
    }
    performCompute({ store }, handle) {
        for (const namespace of Object.keys(store)) {
            const ns = store[namespace];
            for (const service of Object.keys(ns)) {
                // #region 滚动计算周期统计信息
                const summaryStat = new Map();
                const computed = {
                    summaryStat,
                    statWindow: this.options.statWindow
                };
                const stats = ns[service];
                /**
                 * 用于 `mergedStat` Key 索引
                 * 提高查询性能，O(n) --> O(1)
                 */
                const keyIndex = {};
                stats.forEach((buckets, instance) => {
                    const mergedStat = new Map();
                    let latestBuckets = buckets;
                    for (let i = latestBuckets.length - 1; i >= 0; i -= 1) {
                        const { period, stat } = latestBuckets[i];
                        /**
                         * 移除过期桶，由于 `buckets` 有序故可直接截断，以降低计算量
                         */
                        if (this.currentPeriod - period >= this.options.bucketsCount) {
                            latestBuckets = latestBuckets.slice(i + 1);
                            stats.set(instance, latestBuckets);
                            break;
                        }
                        Object.keys(stat).forEach((key) => {
                            let statKey = keyIndex[key];
                            if (statKey === undefined) {
                                statKey = {
                                    success: !key.startsWith("0"),
                                    code: key.slice(1)
                                };
                                keyIndex[key] = statKey;
                            }
                            const statProp = mergedStat.get(statKey);
                            const { cost, count } = stat[key];
                            if (statProp === undefined) {
                                mergedStat.set(statKey, { cost, count });
                            }
                            else {
                                statProp.cost += cost;
                                statProp.count += count;
                            }
                        });
                    }
                    /**
                     * 最早的有效桶与当前周期的间隔，如不足统计单元数，则不进行处理
                     * _也就是说，实际间隔时间必须要满足一个统计周期 `statWindow` 才进行处理_
                     */
                    if (latestBuckets.length > 0
                        && this.currentPeriod - latestBuckets[0].period === this.options.bucketsCount - 1) {
                        summaryStat.set(instance, mergedStat);
                    }
                });
                // #endregion
                if (summaryStat.size === 0) {
                    continue;
                }
                handle.call(this, namespace, service, computed);
            }
        }
    }
    compute() {
        if (this.fullStat) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            this.performCompute(this.fullStat, this.performFullStat);
        }
        if (this.aliveStat) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            this.performCompute(this.aliveStat, this.performAliveStat);
        }
        this.currentPeriod += 1;
    }
    performFullStat(namespace, service, computed) {
        /** StatReporterPlugin */
        if ((this.currentPeriod + 1) % this.options.bucketsCount === 0) { /** 达到一个完整的上报周期 */
            this.reporters.forEach((reporter) => {
                var _a;
                (_a = reporter.serviceStatistics) === null || _a === void 0 ? void 0 : _a.call(reporter, namespace, service, computed).catch(err => this.disposed || this.logger.error(`[${reporter.name}] [serviceStatistics]`, err));
            });
        }
    }
    performAliveStat(namespace, service, computed) {
        // #region 获取服务实例列表
        const serviceInstance = this.registry.local(plugins_1.RegistryCategory.Instance, namespace, service);
        let instances = [];
        if (serviceInstance) {
            instances = serviceInstance.data;
        }
        // #endregion
        /** CircuitBreakerPlugin */
        if (this.options.breakerSwitch.period) {
            const changeList = this.breaker.period(namespace, service, instances, computed);
            this.health.changeStatus(namespace, service, changeList);
            changeList.forEach((change, instance) => {
                if (change.status === 3 /* Fused */) {
                    computed.summaryStat.delete(instance);
                    /** 当熔断时，需清除当前 `aliveStat` 中对应的统计单元 */
                    this.aliveStat.get(namespace, service).delete(instance);
                }
            });
        }
        /** WeightAdjusterPlugin */
        if (this.options.enableDynamicWeights) {
            this.adjusters.forEach(adjuster => adjuster.adjust(namespace, service, instances, computed));
        }
    }
}
exports.InternalMonitor = InternalMonitor;
class ExternalMonitor extends Monitor {
    constructor(logger, reporters, options) {
        let requisite = 0 /* None */;
        if (reporters.length > 0) {
            requisite |= 1 /* Full */;
        }
        super(requisite);
        this.logger = logger;
        this.reporters = reporters;
        this.nowPeriod = 0;
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
    }
    async compute() {
        if (this.aliveStat === undefined) {
            return;
        }
        const { aliveStat: { store } } = this;
        this.aliveStat = new StatStore();
        this.nowPeriod += 1;
        if (this.nowPeriod % this.options.bucketsCount === 0) { /** 达到一个完整的上报周期 */
            for (const namespace of Object.keys(store)) {
                const ns = store[namespace];
                for (const service of Object.keys(ns)) {
                    const summaryStat = new Map();
                    const computed = {
                        summaryStat,
                        statWindow: this.options.statWindow
                    };
                    ns[service].forEach((buckets, instance) => {
                        const computedStat = new Map();
                        /**
                         * 由于 `currentPeriod = 0` 且不变化，
                         * 故只需将第一个桶内值取出即可
                         */
                        const [{ stat }] = buckets;
                        Object.keys(stat).forEach((key) => {
                            const { cost, count } = stat[key];
                            computedStat.set({
                                success: !key.startsWith("0"),
                                code: key.slice(1)
                            }, { cost, count });
                        });
                        summaryStat.set(instance, computedStat);
                    });
                    this.reporters.forEach((reporter) => {
                        var _a;
                        (_a = reporter.serviceStatistics) === null || _a === void 0 ? void 0 : _a.call(reporter, namespace, service, computed).catch(err => this.disposed || this.logger.error(`[${reporter.name}] [serviceStatistics]`, err));
                    });
                }
            }
        }
    }
}
exports.ExternalMonitor = ExternalMonitor;
//# sourceMappingURL=monitor.js.map