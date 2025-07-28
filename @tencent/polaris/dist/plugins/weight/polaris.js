"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisDynamicWeight = void 0;
const plugins_1 = require("../../plugins");
const utils_1 = require("../../utils");
const kMaxEstCalls = 2000;
const kDefaultOptions = {
    /**
     * 成功率倍率
     */
    okRatio: 7,
    /**
     * 延迟倍率
     */
    delayRatio: 3
};
const mergeDimensions = (computed) => {
    const mergedStat = new Map();
    computed.forEach((stat, instance) => {
        let errCalls = 0;
        let succCalls = 0;
        let succDelay = 0;
        stat.forEach(({ cost, count }, { success }) => {
            if (success) {
                succCalls += count;
                succDelay += cost;
            }
            else {
                errCalls += count;
            }
        });
        mergedStat.set(instance, { errCalls, succCalls, succDelay });
    });
    return mergedStat;
};
class PolarisDynamicWeight {
    constructor(options) {
        this.type = plugins_1.PluginType.WeightAdjuster;
        this.name = "PolarisDynamicWeight";
        this.previous = Object.create(null);
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
    }
    adjust(namespace, service, instances, { statWindow, summaryStat }) {
        let minDelay = Infinity;
        let maxRate = 0;
        let maxWeight = 0;
        let sumLoad = 0;
        let minWeight = Infinity;
        const secondsRatio = statWindow / utils_1.kSeconds;
        /**
         * 无法计算权重的实例（没有至少一次的成功调用）
         */
        const skippedInstances = [];
        /**
         * 合并后的调用数据（合并未使用维度）
         */
        const mergedStat = mergeDimensions(summaryStat);
        // #region Round 1
        /*
         * Round 1:
         *  找到服务下各节点的元数据：
         *    * `minDelay`: 最小延迟
         *    * `maxRate`: 最大成功率
         *    * `maxWeight`: 最大静态权重
         */
        mergedStat.forEach((stat, instance) => {
            const { errCalls, succCalls, succDelay } = stat;
            if (!(succCalls > 0)) {
                skippedInstances.push(instance);
                return;
            }
            const avgDelay = succDelay / succCalls;
            if (avgDelay < minDelay) {
                minDelay = avgDelay;
            }
            const okRate = succCalls / (succCalls + errCalls);
            if (okRate > maxRate) {
                maxRate = okRate;
            }
            if (instance.staticWeight > maxWeight) {
                maxWeight = instance.staticWeight;
            }
        });
        // #endregion
        // #region Round 2
        /*
         * Round 2:
         *  通过各节点的元数据，计算负载值 `load(k)`
         */
        const loadInfo = new Map();
        mergedStat.forEach((stat, instance) => {
            const { errCalls, succCalls, succDelay } = stat;
            if (!(succCalls > 0)) {
                return;
            }
            const okRate = succCalls / (succCalls + errCalls);
            const delayLoad = ((succDelay / succCalls) / minDelay) || 0 /** NaN ===> 0 */;
            const okLoad = maxRate / okRate;
            const weightLoad = maxWeight / instance.staticWeight;
            const load = ((delayLoad * this.options.delayRatio) + (okLoad * this.options.okRatio)) * weightLoad;
            sumLoad += 1 / load;
            loadInfo.set(instance, load);
        });
        // #endregion
        // #region Round 3
        /*
         * Round 3:
         *  通过负载值 `load(k)` 与 `estCalls` 计算各节点动态权重，并统计最小权重 `minWeight`
         *  `estCalls` ∈ [有效节点数, `kMaxEstCalls`]
         */
        const latestStat = new WeakMap();
        const prevStat = this.previous[`${namespace}.${service}`];
        mergedStat.forEach((stat, instance) => {
            const { errCalls, succCalls } = stat;
            if (!(succCalls > 0)) {
                return;
            }
            let prevCalls;
            if (prevStat) {
                prevCalls = prevStat.get(instance) || 0;
            }
            else {
                prevCalls = instances.length;
            }
            const currCalls = succCalls + errCalls;
            let nextCalls = (2 * currCalls) - prevCalls; /** est_call_num(t+1) = call_num(t) + (call_num(t)-call_num(t-1)) */
            if (nextCalls > kMaxEstCalls) {
                nextCalls = kMaxEstCalls;
            }
            else if (nextCalls < instances.length) {
                nextCalls = instances.length;
            }
            const callsPerSecond = nextCalls / secondsRatio;
            let dynamicWeight = Math.floor((callsPerSecond * (1 / loadInfo.get(instance) / sumLoad)) + 0.5);
            /**
             * 如动态权重计算结果为无穷数，则设置动态权重为最大静态权重
             */
            dynamicWeight = Number.isFinite(dynamicWeight) ? dynamicWeight : maxWeight;
            instance.dynamicWeight = dynamicWeight;
            if (dynamicWeight < minWeight) {
                minWeight = dynamicWeight;
            }
            latestStat.set(instance, currCalls);
        });
        this.previous[`${namespace}.${service}`] = latestStat;
        // #endregion
        // #region Round 4
        /*
         * Round 4:
         *  设置 _无法计算权重的实例_ 的动态权重为：`min(min_weight, 实例当前动态权重值)`;
         */
        skippedInstances.forEach((instance) => {
            instance.dynamicWeight = Math.min(minWeight, instance.dynamicWeight);
        });
        // #endregion
    }
}
exports.PolarisDynamicWeight = PolarisDynamicWeight;
//# sourceMappingURL=polaris.js.map