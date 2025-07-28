import { Instance } from "../../instance";
import { LoadBalancerPlugin, PluginType, WeightType } from "../../plugins";
declare const kDefaultOptions: {
    /**
     * 是否开启动态权重
     */
    dynamicWeight: boolean;
};
export declare type StatelessLoadBalancerOptions = typeof kDefaultOptions;
export declare abstract class StatelessLoadBalancer implements LoadBalancerPlugin {
    readonly type = PluginType.LoadBalancer;
    readonly supportedWeightType = WeightType.Dynamic;
    protected readonly options: StatelessLoadBalancerOptions;
    abstract readonly name: string;
    constructor(options?: Partial<StatelessLoadBalancerOptions>);
    instanceWeight(instance: Instance): number;
    /**
     * 随机 `choose` 多次，
     * 避免请求顺序固定导致的后端访问不均衡
     */
    protected randomChoose<CallArgsType>(namespace: string, service: string, instances: Instance[], args?: CallArgsType): void;
    abstract choose<CallArgsType>(namespace: string, service: string, instances: Instance[], args?: CallArgsType): Instance;
}
export {};
