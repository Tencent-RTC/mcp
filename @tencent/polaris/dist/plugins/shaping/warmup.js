"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarmUpTrafficShaping = void 0;
const __1 = require("../..");
const plugins_1 = require("../../plugins");
const utils_1 = require("../../utils");
const kDefaultOptions = {
    /**
     * 预热时间 (s)
     */
    warmTime: 10,
    /**
     * 预警因子
     * 需大于等于 2
     */
    warnFactor: 3,
    /**
     * 空闲回收周期
     */
    idlePeriod: 3
};
/**
 *
 * 预热算法是一个另类的令牌桶算法，此算法实现（描述）了下述函数图像：
 *
 * ```
 *             ^ 1/QPS
 *             |
 *   1/coldQPS +                   /
 *             |                  / .
 *             |                 /  .
 *             |                /   .
 *             |               /    .
 *             |              /     .
 *             |             /      .
 *             |            /       .
 *             |           /        .
 * 1/stableQPS +----------/         .
 *             |          .  Warm   .  ← `warmTime` = `warningTokens` 与 `maxTokens` 之间的面积
 *             |          .  Time   .
 *             |          .         .
 *           0 +----------+---------+---------------→ currentTokens
 *             0   warningTokens maxTokens
 * ```
 *
 * 函数各变量满足如下关系：
 * * coldQPS = stableQPS/warnFactor
 * * (warningTokens/stableQPS)/(warmTime) = 1/(warnFactor-1)
 */
class WarmUpTrafficShaping {
    constructor(options) {
        this.type = plugins_1.PluginType.TrafficShaping;
        this.name = "warmup";
        this.buckets = new WeakMap();
        this.disposed = false;
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
    }
    // #region dispose
    dispose() {
        this.disposed = true;
    }
    get isDisposed() {
        return this.disposed;
    }
    // #endregion
    inFlow(rule, partition) {
        if (this.disposed) {
            return Promise.reject(new __1.StateError("Already disposed"));
        }
        let bucket = this.buckets.get(rule);
        if (typeof bucket === "undefined") {
            bucket = this.buildBucket(rule, partition);
            this.buckets.set(rule, bucket);
        }
        if (bucket.partition !== partition) { /** few case */
            const { maxTokens, remainingTokens, warningTokens, stableQPS, remainingQPS, coldQPS, slope } = this.buildBucket(rule, partition);
            bucket.maxTokens = maxTokens;
            bucket.warningTokens = warningTokens;
            bucket.stableQPS = stableQPS;
            bucket.coldQPS = coldQPS;
            bucket.slope = slope;
            bucket.remainingTokens = remainingTokens;
            bucket.remainingQPS = remainingQPS - bucket.usedQPS;
            if (bucket.remainingQPS < 0) {
                bucket.remainingQPS = 0;
                bucket.usedQPS = remainingQPS;
            }
            bucket.partition = partition;
        }
        if (bucket.timer === undefined) {
            bucket.timer = setInterval(() => {
                if (bucket === undefined) {
                    (0, utils_1.UNREACHABLE)();
                }
                if (this.disposed) {
                    clearInterval(bucket.timer);
                    bucket.timer = undefined;
                    return;
                }
                this.timerTask(bucket);
                /**
                 * 与初始状态相同时，可进入休眠
                 */
                if (bucket.remainingTokens === bucket.maxTokens) {
                    bucket.sleepPeriod += 1;
                }
                else {
                    bucket.sleepPeriod = 0;
                }
                if (bucket.sleepPeriod > this.options.idlePeriod) {
                    clearInterval(bucket.timer);
                    bucket.timer = undefined;
                }
            }, 1 * utils_1.kSeconds).unref();
        }
        if (bucket.remainingQPS >= 1) {
            bucket.remainingQPS -= 1;
            bucket.usedQPS += 1;
            return Promise.resolve();
        }
        return Promise.reject(new __1.StateError("[plugin] [warmup], quota is limited"));
    }
    timerTask(bucket) {
        const { remainingTokens, warningTokens, stableQPS, coldQPS, usedQPS, slope } = bucket;
        if (remainingTokens < warningTokens /** 服务实例处于 "热" 状态 */
            || (remainingTokens > warningTokens && usedQPS < coldQPS) /** 服务实例处于 "冷" 状态，并且当前一秒的 QPS 小于 `coldQPS` */) {
            // 增加 stableQPS 个 tokens，但总数不能超过 maxTokens
            bucket.remainingTokens += stableQPS;
            if (bucket.remainingTokens > bucket.maxTokens) {
                bucket.remainingTokens = bucket.maxTokens;
            }
        }
        bucket.remainingTokens -= usedQPS;
        bucket.usedQPS = 0;
        bucket.remainingQPS = this.calculateQPS(slope, warningTokens, bucket.remainingTokens, stableQPS);
    }
    calculateQPS(slope, warningTokens, remainingTokens, stableQPS) {
        if (remainingTokens <= warningTokens) {
            return stableQPS;
        }
        return stableQPS / (1 + (slope * stableQPS * (remainingTokens - warningTokens)));
    }
    buildBucket(rule, partition) {
        // 取 rules 中最小的 qps 作为 stableQPS
        const stableQPS = rule.amounts.reduce((acc, { amount, duration }) => {
            const qps = (amount / partition) / (duration / utils_1.kSeconds);
            if (qps < acc) {
                return qps;
            }
            return acc;
        }, Infinity);
        const coldQPS = stableQPS / this.options.warnFactor;
        const warningTokens = stableQPS * (this.options.warmTime / (this.options.warnFactor - 1));
        const maxTokens = warningTokens + ((2 * this.options.warmTime) / ((1 / stableQPS) + (1 / coldQPS)));
        const slope = ((1 / coldQPS) - (1 / stableQPS)) / (maxTokens - warningTokens);
        return {
            remainingTokens: maxTokens,
            warningTokens,
            maxTokens,
            remainingQPS: this.calculateQPS(slope, warningTokens, maxTokens, stableQPS),
            usedQPS: 0,
            coldQPS,
            stableQPS,
            slope,
            partition,
            sleepPeriod: 0
        };
    }
}
exports.WarmUpTrafficShaping = WarmUpTrafficShaping;
//# sourceMappingURL=warmup.js.map