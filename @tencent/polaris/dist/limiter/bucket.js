"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalBucket = exports.InternalBucket = exports.BasicBucket = void 0;
const process_1 = require("process");
const utils_1 = require("../utils");
/**
 * 基础令牌桶
 * 桶内剩余可用令牌，不会增加
 */
class BasicBucket {
    constructor(total, partition, overflow = false) {
        this.total = total;
        this.partition = partition;
        this.overflow = overflow;
        this.capacity = ~~(this.total / this.partition);
        this.remains = this.capacity;
    }
    get partitionTokens() {
        return this.capacity;
    }
    get remainingTokens() {
        return this.remains;
    }
    setPartition(partition) {
        this.recalculate(partition);
        this.partition = partition;
        this.capacity = ~~(this.total / this.partition);
    }
    consume(tokens, preroll) {
        if (!(this.remains >= tokens)) {
            return false;
        }
        if (!preroll) {
            this.remains -= tokens;
            /*
             * note:
             *  由于 `tokens` 可能为负值，
             *  导致计算出的 `remains` 超过总值 `capacity`
             */
            if (!this.overflow && this.remains > this.capacity) {
                this.remains = this.capacity;
            }
        }
        return true;
    }
    drain() {
        const { remains } = this;
        this.remains = 0;
        return remains;
    }
    recalculate(partition) {
        let remains = ~~(this.total / partition) - (this.capacity - this.remains);
        if (remains < 0) {
            remains = 0;
        }
        this.remains = remains;
    }
}
exports.BasicBucket = BasicBucket;
/**
 * 内部令牌桶
 * 桶内剩余可用令牌，由内部新增
 */
class InternalBucket extends BasicBucket {
    constructor(total, partition, overflow = false, duration, options) {
        super(total, partition, overflow);
        this.duration = duration;
        this.options = options;
        this.isAccessed = false;
        this.idlePeriods = 0;
        this.period = 0;
        this.onWakUp(false);
    }
    get currentPeriod() {
        return this.period;
    }
    consume(tokens, preroll) {
        this.isAccessed = true;
        this.wake();
        return super.consume(tokens, preroll);
    }
    // #region Wake-sleep
    onWakUp(immediate) {
        if (immediate) {
            this.onTimeout();
        }
        this.timer = setInterval(() => this.onTimeout.bind(this), this.duration).unref();
    }
    wake() {
        if (this.timer === undefined) {
            if (this.sleepTime === undefined) {
                (0, utils_1.UNREACHABLE)();
            }
            const elapsedTime = Math.floor(((0, process_1.uptime)() - this.sleepTime) * utils_1.kSeconds);
            this.period += Math.floor(elapsedTime / this.duration);
            const interval = elapsedTime % this.duration;
            if (interval === 0) {
                this.onWakUp(false);
            }
            else {
                this.timer = setTimeout(this.onWakUp.bind(this, true), interval).unref();
            }
        }
    }
    sleep() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        this.sleepTime = (0, process_1.uptime)();
        this.idlePeriods = 0;
        this.isAccessed = false;
    }
    // #endregion
    onTimeout() {
        this.period += 1;
        this.remains = this.capacity;
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
exports.InternalBucket = InternalBucket;
/**
 * 外部令牌桶
 * 桶内剩余可用令牌，由外部调整
 */
class ExternalBucket extends BasicBucket {
    update(value) {
        let remains = ~~((this.total - value) / this.partition);
        if (remains < 0) {
            remains = 0;
        }
        this.remains = remains;
    }
}
exports.ExternalBucket = ExternalBucket;
//# sourceMappingURL=bucket.js.map