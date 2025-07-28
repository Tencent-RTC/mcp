import { DestinationQuery, PluginType, RequisiteBitfield, ServiceRouterPlugin } from "../../../plugins";
import { RoutingRules } from "../../../rules";
import { Service } from "../../../service";
export declare class PolarisRuleRouter implements ServiceRouterPlugin {
    readonly type = PluginType.ServiceRouter;
    readonly name: string;
    readonly requisite: RequisiteBitfield;
    private variables?;
    setVariables(variables: Record<string, string>): void;
    query(callee: Service, rules?: RoutingRules[], caller?: Service): Generator<Partial<DestinationQuery>, void, void>;
}
