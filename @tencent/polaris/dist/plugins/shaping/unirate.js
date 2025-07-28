"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnirateTrafficShaping = void 0;
const __1 = require("../..");
const plugins_1 = require("../../plugins");
const kDefaultOptions = {
    /**
     * 最长等待时间 (ms)
     */
    maxWaitingTime: Infinity,
    /**
     * 空闲回收周期
     */
    idlePeriod: 3
};
/**
 * Leaky bucket
 * (https://en.wikipedia.org/wiki/Leaky_bucket)
 */
class UnirateTrafficShaping {
    constructor(options) {
        this.type = plugins_1.PluginType.TrafficShaping;
        this.name = "unirate";
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
        if (bucket.partition !== partition) {
            const { capacity, interval, rate } = this.buildBucket(rule, partition);
            bucket.capacity = capacity;
            bucket.interval = interval;
            bucket.rate = rate;
            bucket.partition = partition;
            if (bucket.timer !== undefined) {
                clearInterval(bucket.timer);
                bucket.timer = undefined;
            }
        }
        if (bucket.queue.length === bucket.capacity) {
            return Promise.reject(new __1.StateError(`[plugin] [unirate], timeout(${this.options.maxWaitingTime}ms)`));
        }
        const quota = new Promise((...args) => {
            bucket.queue.push(args);
        });
        if (bucket.timer === undefined) {
            this.allocate(bucket);
            bucket.timer = setInterval(() => {
                if (this.disposed) {
                    bucket.queue.forEach(([, reject]) => process.nextTick(reject, new __1.StateError("Already disposed")));
                    bucket.queue = [];
                    clearInterval(bucket.timer);
                    bucket.timer = undefined;
                    bucket.sleepPeriod = 0;
                    return;
                }
                if (!this.allocate(bucket)) {
                    bucket.sleepPeriod += 1;
                }
                else {
                    bucket.sleepPeriod = 0;
                }
                if (bucket.sleepPeriod > this.options.idlePeriod) {
                    clearInterval(bucket.timer);
                    bucket.timer = undefined;
                }
            }, bucket.interval).unref();
        }
        return quota;
    }
    allocate(bucket) {
        const { queue, rate } = bucket;
        const hasRequest = queue.length > 0;
        /*
         * note:
         *  这里在下一个 tick 内调用 `resolve`，以避免用户代码异常造成流程中断
         */
        queue.splice(0, rate).forEach(([reslove]) => process.nextTick(reslove));
        return hasRequest;
    }
    buildBucket(rule, partition) {
        let interval = rule.amounts.reduce((acc, { amount, duration }) => {
            const rate = duration / (amount / partition);
            if (rate > acc) {
                return rate;
            }
            return acc;
        }, 0);
        let rate = 1;
        if (interval < 1) {
            rate = ~~(1 / interval);
            interval = 1;
        }
        else {
            interval = Math.floor(interval);
        }
        return {
            queue: [],
            interval,
            rate,
            capacity: Math.floor(rate * Math.floor(this.options.maxWaitingTime / interval)),
            sleepPeriod: 0,
            partition
        };
    }
}
exports.UnirateTrafficShaping = UnirateTrafficShaping;
//# sourceMappingURL=unirate.js.map