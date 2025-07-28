"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisRuleRouter = void 0;
const metadata_1 = require("../../../metadata");
const plugins_1 = require("../../../plugins");
const utils_1 = require("../../../utils");
const kMaxPriority = 9;
const kEmptyObject = Object.freeze(Object.create(null));
class PolarisRuleRouter {
    constructor() {
        this.type = plugins_1.PluginType.ServiceRouter;
        this.name = "PolarisRuleRouter";
        this.requisite = plugins_1.RequisiteBitfield.Rule;
    }
    setVariables(variables) {
        this.variables = variables;
    }
    // eslint-disable-next-line max-lines-per-function
    *query(callee, rules, caller) {
        let service = "";
        let metadata;
        if (caller) {
            ({ service, metadata } = caller);
        }
        if (!rules) {
            (0, utils_1.UNREACHABLE)();
        }
        const len = rules.length;
        /**
         * 规则不存在，不走任何规则匹配，
         * 直接匹配被调服务名，查询被调全量实例
         */
        if (len === 0) {
            yield {
                destination: {
                    service: callee.service
                }
            };
            return;
        }
        /*
         * Step 1:
         *  规则列表由前往后匹配，越靠前优先级越高
         */
        for (let i = 0; i < len; i += 1) {
            let matches;
            const rule = rules[i];
            /*
             * Step 2:
             *  匹配 `sources` 源规则
             *
             * ```ts
             * [].every(() => {}) // true
             * [].some(() => {}) // false
             * ```
             */
            if (!rule.sources.every((source) => {
                /**
                 * `source.service` 为 "*" 时，匹配所有源 `service`
                 */
                if (source.service !== "*" && source.service !== service) {
                    return true;
                }
                if (source.metadata && metadata) {
                    const result = (0, metadata_1.isMetadataMatch)(metadata, source.metadata, this.variables);
                    if (result) {
                        matches = result;
                        return false;
                    }
                    return true;
                }
                if (source.metadata !== undefined || metadata !== undefined) {
                    return true;
                }
                return false;
            })) {
                /*
                 * Step 3:
                 *  依据目标规则优先级 `priority`，由前往后匹配目标规则
                 */
                for (let priority = 0; priority <= kMaxPriority;) {
                    const destinations = [];
                    let steps = 0;
                    rule.destinations.forEach((destination) => {
                        const delta = destination.priority - priority;
                        if (delta === 0) {
                            destinations.push(destination);
                        }
                        else if (delta > 0) {
                            /*
                             * note:
                             *  由于各目标规则优先级可能非连续，
                             *  故计算最接近的下一个优先级的步长 `steps`，
                             *  以减小循环次数，优化性能
                             */
                            if (steps === 0) {
                                steps = delta;
                            }
                            else {
                                steps = Math.min(delta, steps);
                            }
                        }
                    });
                    priority += steps;
                    /*
                     * Step 4:
                     *  在同优先级的目标规则中，根据规则权重 `weight` 进行分配
                     */
                    if (destinations.length === 1) { /** fast case */
                        yield {
                            controller: {
                                [plugins_1.RoutingCondition.Found]: {
                                    [plugins_1.RoutingAction.Break]: true
                                }
                            },
                            destination: destinations[0],
                            source: {
                                parameters: matches !== null && matches !== void 0 ? matches : kEmptyObject
                            }
                        };
                    }
                    else { /** slow case */
                        let totalWeight = destinations.reduce((acc, cur) => acc + cur.weight, 0);
                        /**
                         * 如果目标规则权重和为 0，则不采用
                         */
                        while (totalWeight > 0) {
                            /*
                             * 采用随机轮训的方式，选取目标规则
                             */
                            const selectedValue = Math.random() * totalWeight;
                            let beginValue = 0;
                            let endValue = 0;
                            for (let idx = 0; idx < destinations.length; idx += 1) {
                                const destination = destinations[idx];
                                endValue = beginValue + destination.weight;
                                if (selectedValue >= beginValue && selectedValue < endValue) {
                                    totalWeight -= destination.weight;
                                    destinations.splice(idx, 1);
                                    yield {
                                        controller: {
                                            [plugins_1.RoutingCondition.Found]: {
                                                [plugins_1.RoutingAction.Break]: true
                                            }
                                        },
                                        source: {
                                            parameters: matches !== null && matches !== void 0 ? matches : kEmptyObject
                                        },
                                        destination
                                    };
                                    break;
                                }
                                beginValue = endValue;
                            }
                        }
                    }
                    /**
                     * 所有优先级均已遍历完成
                     */
                    if (steps === 0) {
                        break;
                    }
                }
                /**
                 * 一旦命中了一个特定的源规则，
                 * 则不再匹配剩余规则
                 */
                break;
            }
        }
    }
}
exports.PolarisRuleRouter = PolarisRuleRouter;
//# sourceMappingURL=rule.js.map