import { Instance, LocationMatchLevel, RoutingRules, Service } from "../../..";
import { DestinationQuery, FilteredResult, PluginType, RequisiteBitfield, ServiceRouterPlugin } from "../../../plugins";
/** 就近路由匹配模式 */
export declare enum MatchMode {
    /** 不开启就近路由 */
    Off = 0,
    /**
     * 根据实例元数据信息自动切换，
     * 如备选实例中存在任意一个未开启就近路由的实例，则不开启，
     * 否则开启
     */
    Auto = 1,
    /** 总是开启就近路由 */
    Always = 2
}
declare const kDefaultOptions: {
    /**
     * 匹配模式
     */
    mode: MatchMode;
    /**
     * 就近路由最大查询范围
     */
    maxRange: LocationMatchLevel;
    /**
     * 就近路由最小查询范围
     */
    minRange: LocationMatchLevel;
    /**
     * 不健康实例比例达到多少进行降级
     * 默认为 1，即全部不健康才降级
     */
    unhealthyDegrade: number;
};
export declare type PolarisNearbyRouterOptions = typeof kDefaultOptions;
export declare type NearbyArgs = Partial<Pick<PolarisNearbyRouterOptions, "maxRange" | "minRange">>;
/**
 * 北极星定义的就近路由策略
 * 优先匹配最小范围，失败则扩大一级范围重试，直到超过 `maxRange`
 */
export declare class PolarisNearbyRouter implements ServiceRouterPlugin {
    readonly type = PluginType.ServiceRouter;
    readonly name: string;
    readonly requisite: RequisiteBitfield;
    private readonly options;
    constructor(options?: Partial<PolarisNearbyRouterOptions>);
    query<AdditionalArgs = NearbyArgs>(callee: Service, rules?: RoutingRules[], caller?: Service, args?: AdditionalArgs): Generator<Partial<DestinationQuery>, void, void>;
    filter<AdditionalArgs = NearbyArgs>(instances: Instance[], { destination }: Partial<DestinationQuery>, args?: AdditionalArgs): FilteredResult;
    private getRange;
}
export {};
