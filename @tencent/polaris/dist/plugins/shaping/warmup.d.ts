import { PluginType, TrafficShapingPlugin } from "../../plugins";
import { RatelimitRule } from "../../rules";
declare const kDefaultOptions: {
    /**
     * 预热时间 (s)
     */
    warmTime: number;
    /**
     * 预警因子
     * 需大于等于 2
     */
    warnFactor: number;
    /**
     * 空闲回收周期
     */
    idlePeriod: number;
};
export declare type WarmUpTrafficShapingOptions = typeof kDefaultOptions;
/**
 *
 * 预热算法是一个另类的令牌桶算法，此算法实现（描述）了下述函数图像：
 *
 * ```
 *             ^ 1/QPS
 *             |
 *   1/coldQPS +                   /
 *             |                  / .
 *             |                 /  .
 *             |                /   .
 *             |               /    .
 *             |              /     .
 *             |             /      .
 *             |            /       .
 *             |           /        .
 * 1/stableQPS +----------/         .
 *             |          .  Warm   .  ← `warmTime` = `warningTokens` 与 `maxTokens` 之间的面积
 *             |          .  Time   .
 *             |          .         .
 *           0 +----------+---------+---------------→ currentTokens
 *             0   warningTokens maxTokens
 * ```
 *
 * 函数各变量满足如下关系：
 * * coldQPS = stableQPS/warnFactor
 * * (warningTokens/stableQPS)/(warmTime) = 1/(warnFactor-1)
 */
export declare class WarmUpTrafficShaping implements TrafficShapingPlugin {
    readonly type = PluginType.TrafficShaping;
    readonly name: string;
    private readonly options;
    private readonly buckets;
    private disposed;
    constructor(options?: Partial<WarmUpTrafficShapingOptions>);
    dispose(): void;
    get isDisposed(): boolean;
    inFlow(rule: RatelimitRule, partition: number): Promise<void>;
    private timerTask;
    private calculateQPS;
    private buildBucket;
}
export {};
