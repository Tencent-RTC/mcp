"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisCircuitBreaker = void 0;
const plugins_1 = require("../../plugins");
const utils_1 = require("../../utils");
const kDefaultOptions = {
    /**
     * 连续失败统计周期
     */
    continuousWindow: 1 * utils_1.kMinutes,
    /**
     * 连续失败次数阈值
     */
    continuousErrors: 10,
    /**
     * 触发熔断的最低请求阈值
     */
    fuseThreshold: 10,
    /**
     * 熔断错误率阈值
     */
    fuseRate: 0.5,
    /**
     * 半开恢复 `HalfClose` ---> `Normal` 所需的最小成功请求数
     * 值不能大于探活任务的最大探测次数
     */
    halfClose2Normal: 2,
    /**
     * 半开熔断 `HalfClose` ---> `Fused` 所需的最小失败请求数
     * 值不能大于探活任务的最大探测次数
     */
    halfClose2Fused: 2
};
class PolarisCircuitBreaker {
    // #endregion
    constructor(options) {
        this.type = plugins_1.PluginType.CircuitBreaker;
        this.name = "PolarisCircuitBreaker";
        this.disposed = false;
        this.periodStat = new WeakMap();
        // #region realtime
        this.realtimeStat = new WeakMap();
        this.timer = null;
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
    }
    // #region dispose
    dispose() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.disposed = true;
    }
    get isDisposed() {
        return this.disposed;
    }
    // #endregion
    period(namespace, service, instances, stat) {
        const changeList = new Map();
        stat.summaryStat.forEach((computed, instance) => {
            let errCalls = 0;
            let succCalls = 0;
            computed.forEach(({ count }, { success }) => {
                if (success) {
                    succCalls += count;
                }
                else {
                    errCalls += count;
                }
            });
            switch (instance.status) {
                case 0 /* Normal */: {
                    const rspCalls = errCalls + succCalls;
                    if (rspCalls > this.options.fuseThreshold) {
                        /*
                         *  为防止用户漏报了调用结果导致计算的成功率为 0，
                         *  使用 `1 - errRate(k)` 作为成功率。
                         */
                        const succRate = 1 - (errCalls / rspCalls);
                        if (succRate <= this.options.fuseRate) {
                            /** `Normal` ---> `Fused` */
                            changeList.set(instance, {
                                status: 3 /* Fused */,
                                reason: `[${this.name}] [period], succRate(${succRate}) <= fuseRate(${this.options.fuseRate})`
                            });
                        }
                    }
                    break;
                }
                case 2 /* HalfClose */: {
                    let callStat = this.periodStat.get(instance);
                    if (!callStat) {
                        callStat = {
                            succCalls,
                            errCalls
                        };
                        this.periodStat.set(instance, callStat);
                    }
                    else {
                        callStat.succCalls += succCalls;
                        callStat.errCalls += errCalls;
                    }
                    if (callStat.succCalls >= this.options.halfClose2Normal) {
                        /** `HalfClose` ---> `Normal` */
                        changeList.set(instance, {
                            status: 0 /* Normal */,
                            reason: `[${this.name}] [period], succCalls(${callStat.succCalls}) >= halfClose2Normal(${this.options.halfClose2Normal})`
                        });
                        this.periodStat.delete(instance);
                    }
                    else if (callStat.errCalls >= this.options.halfClose2Fused) {
                        /** `HalfClose` ---> `Fused` */
                        changeList.set(instance, {
                            status: 3 /* Fused */,
                            reason: `[${this.name}] [period], errCalls(${callStat.errCalls}) >= halfClose2Fused(${this.options.halfClose2Fused})`
                        });
                        this.periodStat.delete(instance);
                    }
                    break;
                }
                case 1 /* HalfOpen */: {
                    break;
                }
                case 3 /* Fused */: // [[fallthrough]]
                default: {
                    (0, utils_1.UNREACHABLE)();
                }
            }
        });
        return changeList;
    }
    realtime(namespace, service, instance, success) {
        /**
         * 为了性能考虑所有实时熔断流程采用同一定时器驱动
         * tradeoff: 第一个统计周期中的统计数据可能是不精确的。
         */
        if (!this.timer) {
            this.timer = setTimeout(() => {
                this.realtimeStat = new WeakMap();
                this.timer = null;
            }, this.options.continuousWindow).unref();
        }
        let count = this.realtimeStat.get(instance);
        if (success) {
            if (count !== undefined) {
                this.realtimeStat.delete(instance);
            }
            return;
        }
        count = (count || 0) + 1;
        if (count >= this.options.continuousErrors) {
            this.realtimeStat.delete(instance);
            return {
                status: 3 /* Fused */,
                reason: `[${this.name}] [realtime], found ${count} times failed >= continuousErrors(${this.options.continuousErrors})`
            };
        }
        this.realtimeStat.set(instance, count);
    }
}
exports.PolarisCircuitBreaker = PolarisCircuitBreaker;
//# sourceMappingURL=polaris.js.map