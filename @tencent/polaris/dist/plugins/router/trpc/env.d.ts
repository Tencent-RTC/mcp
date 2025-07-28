import { DestinationQuery, PluginType, RequisiteBitfield, ServiceRouterPlugin } from "../../../plugins";
import { RoutingRules } from "../../../rules";
import { Service } from "../../../service";
export declare type EnvArgs = string[];
export declare class TRPCEnvRouter implements ServiceRouterPlugin {
    readonly type = PluginType.ServiceRouter;
    readonly name: string;
    readonly requisite: RequisiteBitfield;
    query<AdditionalArgs = EnvArgs>(callee: Service, rules?: RoutingRules[], caller?: Service, args?: AdditionalArgs): Generator<Partial<DestinationQuery>, void, void>;
}
