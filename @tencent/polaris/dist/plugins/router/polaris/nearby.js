"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisNearbyRouter = exports.MatchMode = void 0;
const __1 = require("../../..");
const plugins_1 = require("../../../plugins");
const utils_1 = require("../../../utils");
/** 就近路由匹配模式 */
var MatchMode;
(function (MatchMode) {
    /** 不开启就近路由 */
    MatchMode[MatchMode["Off"] = 0] = "Off";
    /**
     * 根据实例元数据信息自动切换，
     * 如备选实例中存在任意一个未开启就近路由的实例，则不开启，
     * 否则开启
     */
    MatchMode[MatchMode["Auto"] = 1] = "Auto";
    /** 总是开启就近路由 */
    MatchMode[MatchMode["Always"] = 2] = "Always";
})(MatchMode = exports.MatchMode || (exports.MatchMode = {}));
const kDefaultOptions = {
    /**
     * 匹配模式
     */
    mode: MatchMode.Auto,
    /**
     * 就近路由最大查询范围
     */
    maxRange: 0 /* Region */,
    /**
     * 就近路由最小查询范围
     */
    minRange: 1 /* Zone */,
    /**
     * 不健康实例比例达到多少进行降级
     * 默认为 1，即全部不健康才降级
     */
    unhealthyDegrade: 1
};
/**
 * 北极星定义的就近路由策略
 * 优先匹配最小范围，失败则扩大一级范围重试，直到超过 `maxRange`
 */
class PolarisNearbyRouter {
    constructor(options) {
        this.type = plugins_1.PluginType.ServiceRouter;
        this.name = "PolarisNearbyRouter";
        this.requisite = plugins_1.RequisiteBitfield.None;
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
    }
    *query(callee, rules, caller, args) {
        switch (this.options.mode) {
            case MatchMode.Auto: {
                /** 预查询，检查是否有节点不开启就近路由 */
                yield {};
                break;
            }
            case MatchMode.Off: {
                yield {
                    controller: {
                        [plugins_1.RoutingCondition.Found]: {
                            [plugins_1.RoutingAction.Bypass]: [this.name]
                        },
                        [plugins_1.RoutingCondition.NotFound]: {
                            [plugins_1.RoutingAction.Bypass]: [this.name]
                        }
                    }
                };
                return;
            }
            case MatchMode.Always: {
                break;
            }
            default: {
                (0, utils_1.UNREACHABLE)();
            }
        }
        // #region 查询特定范围实例
        const { maxRange, minRange } = this.getRange(args);
        for (let level = minRange; level >= maxRange; level -= 1) {
            yield {
                destination: {
                    level
                }
            };
        }
        // #endregion
    }
    filter(instances, { destination }, args) {
        /** MatchMode.Auto */
        if (destination === undefined) {
            /** 如备选实例中存在任意一个未开启就近路由的实例，则不开启就近路由 */
            if (instances.some(instance => instance.metadata["internal-enable-nearby"] !== "true")) {
                return {
                    filtered: instances,
                    action: {
                        [plugins_1.RoutingAction.Bypass]: [this.name]
                    }
                };
            }
            /** 开启就近路由，进行实际查询 */
            return {
                filtered: []
            };
        }
        if (destination.level !== this.getRange(args).maxRange) { /** 还存在其它可能的查询迭代 */
            let unhealthyInstance = 0;
            const totalInstances = instances.length;
            for (let i = 0; i < totalInstances; i += 1) {
                if (!(0, __1.isChoosableInstance)(instances[i])) {
                    unhealthyInstance += 1;
                }
            }
            if (unhealthyInstance / totalInstances >= this.options.unhealthyDegrade) {
                return {
                    filtered: []
                };
            }
        }
        return {
            filtered: instances
        };
    }
    getRange(args) {
        const callArgs = args;
        const { maxRange: presetMax, minRange: presetMin } = this.options;
        let maxRange = presetMax;
        let minRange = presetMin;
        if (callArgs) {
            const { maxRange: requiredMax, minRange: requiredMin } = callArgs;
            if (requiredMax !== undefined) {
                maxRange = requiredMax;
            }
            if (requiredMin !== undefined) {
                minRange = requiredMin;
            }
        }
        if (maxRange > minRange) {
            throw new __1.ArgumentError(`|maxRange|(${maxRange}) must be larger than or equal to |minRange|(${minRange})`);
        }
        return { maxRange, minRange };
    }
}
exports.PolarisNearbyRouter = PolarisNearbyRouter;
//# sourceMappingURL=nearby.js.map