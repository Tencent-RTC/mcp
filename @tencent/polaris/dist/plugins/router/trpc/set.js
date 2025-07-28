"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRPCSetRouter = exports.MatchType = void 0;
const plugins_1 = require("../../../plugins");
/** 匹配类型 */
var MatchType;
(function (MatchType) {
    /**
     * @description
     * 旁路此模块，不做 `Set` 路由
     */
    MatchType[MatchType["NoSet"] = 0] = "NoSet";
    /**
     * @description
     * 匹配流程如下：
     *  1. 精确匹配，如存在实例（不考虑实例状态）则返回，并旁路就近路由
     *  2. 匹配其通配组，Set 组名为 "*"，如存在实例（不考虑实例状态）则返回，并旁路就近路由
     *  3. 如被调未启用 Set（被调不存在可以匹配上 `Set 名` 的实例）则旁路此模块
     */
    MatchType[MatchType["SourceSet"] = 1] = "SourceSet";
    /**
     * @description
     * 匹配流程如下：
     *  1. 精确匹配，如存在实例（不考虑实例状态）则返回，并旁路就近路由
     *  2. 匹配其通配组，Set 组名为 "*"，如存在实例（不考虑实例状态）则返回，并旁路就近路由
     */
    MatchType[MatchType["DestinationSet"] = 2] = "DestinationSet";
})(MatchType = exports.MatchType || (exports.MatchType = {}));
/** 预置的旁路行为 */
const presetBypass = {
    Set: Object.freeze({
        [plugins_1.RoutingAction.Bypass]: ["tRPCSetRouter"]
    }),
    Nearby: Object.freeze({
        [plugins_1.RoutingAction.Bypass]: ["PolarisNearbyRouter"]
    })
};
class TRPCSetRouter {
    constructor() {
        this.type = plugins_1.PluginType.ServiceRouter;
        this.name = "tRPCSetRouter";
        this.requisite = plugins_1.RequisiteBitfield.None;
    }
    *query(callee, rules, caller, args) {
        const callArgs = args;
        if (callArgs === null || callArgs === void 0 ? void 0 : callArgs.match) { /** MatchType.NoSet === 0 */
            yield {
                destination: {
                    metadata: {
                        "internal-enable-set": "Y"
                    }
                }
            };
        }
        else {
            yield {};
        }
    }
    filter(instances, query, args) {
        const callArgs = args;
        if (!callArgs || callArgs.match === MatchType.NoSet) {
            return {
                filtered: instances,
                action: presetBypass.Set
            };
        }
        let enabledSet = false;
        const matchedInstances = [];
        const genericInstances = [];
        const { name, area, group } = callArgs.set;
        const exactArea = `${name}.${area}`;
        const exactGroup = `${name}.${area}.${group}`;
        const genericGroup = `${name}.${area}.*`;
        instances.forEach((instance) => {
            const instanceSet = instance.metadata["internal-set-name"];
            if (instanceSet.startsWith(name)) {
                /** 仅当 Set 名匹配时，才认为开启 Set 调用 */
                enabledSet = true;
                if ((group === "*" && instanceSet.startsWith(exactArea)) /** group 为 "*" 时匹配所有组 */
                    || instanceSet === exactGroup /** 精确匹配 */) {
                    matchedInstances.push(instance);
                }
                else if (instanceSet === genericGroup) { /** 通配组 */
                    genericInstances.push(instance);
                }
            }
        });
        const result = {
            filtered: matchedInstances.length > 0 ? matchedInstances : genericInstances
        };
        /**
         * 默认不按 set 开启就近访问，找到可用节点，就会忽略 NearBy 插件
         * enableNearby 参数可以开启按 Set 就近访问
         */
        if (result.filtered.length > 0 && !callArgs.enableNearby) {
            result.action = presetBypass.Nearby;
        }
        else if (!enabledSet && callArgs.match === MatchType.SourceSet) {
            result.action = presetBypass.Set;
            result.filtered = instances;
        }
        return result;
    }
}
exports.TRPCSetRouter = TRPCSetRouter;
//# sourceMappingURL=set.js.map