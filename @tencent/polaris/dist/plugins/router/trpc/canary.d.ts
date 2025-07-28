import { PluginType, RequisiteBitfield, ServiceRouterPlugin } from "../../../plugins";
import { RoutingRules } from "../../../rules";
import { Service } from "../../../service";
export declare type CanaryArgs = string;
export declare class TRPCCanaryRouter implements ServiceRouterPlugin {
    readonly type = PluginType.ServiceRouter;
    readonly name: string;
    readonly requisite: RequisiteBitfield;
    query<AdditionalArgs = CanaryArgs>(callee: Service, rules?: RoutingRules[], caller?: Service, args?: AdditionalArgs): Generator<{
        controller?: undefined;
        destination?: undefined;
    } | {
        controller: {
            0: {
                0: boolean;
            };
        };
        destination: {
            service: string;
            metadata: {
                canary: string;
            };
        };
    }, void, unknown>;
}
