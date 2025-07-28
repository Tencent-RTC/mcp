import { Instance } from "../../instance";
import { LoadBalancerPlugin, PluginType } from "../../plugins";
declare const kDefaultOptions: {
    /**
     * 过期时间
     * * 当值 ≤0 时：则不启用此插件
     * * 当值为 `Infinity` 时：不启用过期
     */
    expireTime: number;
};
export declare type StickyLoadBalancerOptions = typeof kDefaultOptions;
/**
 * Sticky Load Balancer
 * The returned instance of each call is the same
 * until it is not appear in the instance list or exceed expiration time
 */
export declare class StickyLoadBalancer implements LoadBalancerPlugin {
    private readonly next;
    readonly name = "StickyLoadBalancer";
    readonly type = PluginType.LoadBalancer;
    readonly supportedWeightType: import("../../plugins").WeightType;
    private disposed;
    private readonly options;
    private readonly sessions;
    constructor(next: LoadBalancerPlugin, options?: Partial<StickyLoadBalancerOptions>);
    dispose(): void;
    get isDisposed(): boolean;
    choose<CallArgsType>(namespace: string, service: string, instances: Instance[], args?: CallArgsType): Instance;
    private buildOrRefreshTimer;
}
export {};
