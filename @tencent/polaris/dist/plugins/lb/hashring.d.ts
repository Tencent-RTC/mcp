/// <reference types="node" />
import * as HashRing from "hashring";
import { Instance } from "../../instance";
import { LoadBalancerPlugin, PluginType, WeightType } from "../../plugins";
export declare type HashRingCallArgs = string;
export declare type HashRingLoadBalancerOptions = HashRing.HashRingOptions & {
    /**
     * 哈希算法（可自定义实现），默认为 `md5`
     */
    "algorithm": string | ((key: string) => string | Buffer);
};
/**
 * Consistent Hash Load Balancer
 * Implemented by using a third-party [hashring](https://github.com/3rd-Eden/node-hashring) module
 */
export declare class HashRingLoadBalancer implements LoadBalancerPlugin {
    readonly name = "HashRingLoadBalancer";
    readonly type = PluginType.LoadBalancer;
    readonly supportedWeightType = WeightType.None;
    private readonly callStat;
    private readonly options;
    constructor(options?: Partial<HashRingLoadBalancerOptions>);
    choose<CallArgsType>(namespace: string, service: string, instances: Instance[], args: CallArgsType): Instance;
}
