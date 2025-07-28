import { Instance } from "../../../instance";
import { DestinationQuery, FilteredResult, PluginType, RequisiteBitfield, ServiceRouterPlugin } from "../../../plugins";
import { RoutingRules } from "../../../rules";
import { Service } from "../../../service";
/** 匹配类型 */
export declare enum MatchType {
    /**
     * @description
     * 旁路此模块，不做 `Set` 路由
     */
    NoSet = 0,
    /**
     * @description
     * 匹配流程如下：
     *  1. 精确匹配，如存在实例（不考虑实例状态）则返回，并旁路就近路由
     *  2. 匹配其通配组，Set 组名为 "*"，如存在实例（不考虑实例状态）则返回，并旁路就近路由
     *  3. 如被调未启用 Set（被调不存在可以匹配上 `Set 名` 的实例）则旁路此模块
     */
    SourceSet = 1,
    /**
     * @description
     * 匹配流程如下：
     *  1. 精确匹配，如存在实例（不考虑实例状态）则返回，并旁路就近路由
     *  2. 匹配其通配组，Set 组名为 "*"，如存在实例（不考虑实例状态）则返回，并旁路就近路由
     */
    DestinationSet = 2
}
export interface SetInfo {
    /** Set 名 */
    name: string;
    /** Set 地区 */
    area: string;
    /** Set 组名 */
    group: string;
}
export interface SetArgs {
    /**
     * 匹配类型
     */
    match: MatchType;
    /**
     * 需匹配的 Set 信息
     */
    set: SetInfo;
    /**
     * 开启按 Set 就近访问
     */
    enableNearby?: boolean;
}
export declare class TRPCSetRouter implements ServiceRouterPlugin {
    readonly type = PluginType.ServiceRouter;
    readonly name: string;
    readonly requisite: RequisiteBitfield;
    query<AdditionalArgs = SetArgs>(callee: Service, rules?: RoutingRules[], caller?: Service, args?: AdditionalArgs): Generator<Partial<DestinationQuery>, void, void>;
    filter?<AdditionalArgs>(instances: Instance[], query: Partial<DestinationQuery>, args?: AdditionalArgs): FilteredResult;
}
