import { PluginType, TrafficShapingPlugin } from "../../plugins";
import { RatelimitRule } from "../../rules";
declare const kDefaultOptions: {
    /**
     * 最长等待时间 (ms)
     */
    maxWaitingTime: number;
    /**
     * 空闲回收周期
     */
    idlePeriod: number;
};
export declare type UnirateTrafficShapingOptions = typeof kDefaultOptions;
/**
 * Leaky bucket
 * (https://en.wikipedia.org/wiki/Leaky_bucket)
 */
export declare class UnirateTrafficShaping implements TrafficShapingPlugin {
    readonly type = PluginType.TrafficShaping;
    readonly name: string;
    private readonly options;
    private readonly buckets;
    private disposed;
    constructor(options?: Partial<UnirateTrafficShapingOptions>);
    dispose(): void;
    get isDisposed(): boolean;
    inFlow(rule: RatelimitRule, partition: number): Promise<void>;
    private allocate;
    private buildBucket;
}
export {};
