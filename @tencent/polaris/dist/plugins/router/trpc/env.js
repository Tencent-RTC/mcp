"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRPCEnvRouter = void 0;
const __1 = require("../../..");
const plugins_1 = require("../../../plugins");
class TRPCEnvRouter {
    constructor() {
        this.type = plugins_1.PluginType.ServiceRouter;
        this.name = "tRPCEnvRouter";
        this.requisite = plugins_1.RequisiteBitfield.None;
    }
    *query(callee, rules, caller, args) {
        if (!Array.isArray(args)) {
            throw new __1.ArgumentError("|args| must be an array");
        }
        for (let i = 0; i < args.length; i += 1) {
            yield {
                controller: {
                    [plugins_1.RoutingCondition.Found]: {
                        [plugins_1.RoutingAction.Break]: true
                    }
                },
                destination: {
                    service: "*",
                    metadata: {
                        env: args[i].toString()
                    }
                }
            };
        }
    }
}
exports.TRPCEnvRouter = TRPCEnvRouter;
//# sourceMappingURL=env.js.map