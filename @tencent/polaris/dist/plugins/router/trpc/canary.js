"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRPCCanaryRouter = void 0;
const plugins_1 = require("../../../plugins");
class TRPCCanaryRouter {
    constructor() {
        this.type = plugins_1.PluginType.ServiceRouter;
        this.name = "tRPCCanaryRouter";
        this.requisite = plugins_1.RequisiteBitfield.None;
    }
    *query(callee, rules, caller, args) {
        // 没有传金丝雀的标签时，不作过滤
        if (typeof args === "undefined") {
            yield {};
            return;
        }
        // 查找金丝雀标签匹配的实例
        yield {
            controller: {
                [plugins_1.RoutingCondition.Found]: {
                    [plugins_1.RoutingAction.Break]: true
                }
            },
            destination: {
                service: "*",
                metadata: {
                    canary: String(args)
                }
            }
        };
        // 金丝雀标签未匹配，则不作过滤
        yield {};
    }
}
exports.TRPCCanaryRouter = TRPCCanaryRouter;
//# sourceMappingURL=canary.js.map