import { ComputedStat } from "../../consumer";
import { Instance } from "../../instance";
import { PluginType, WeightAdjusterPlugin } from "../../plugins";
declare const kDefaultOptions: {
    /**
     * 成功率倍率
     */
    okRatio: number;
    /**
     * 延迟倍率
     */
    delayRatio: number;
};
export declare type PolarisDynamicWeightOptions = typeof kDefaultOptions;
export declare class PolarisDynamicWeight implements WeightAdjusterPlugin {
    readonly type = PluginType.WeightAdjuster;
    readonly name: string;
    private previous;
    private readonly options;
    constructor(options?: Partial<PolarisDynamicWeightOptions>);
    adjust(namespace: string, service: string, instances: Instance[], { statWindow, summaryStat }: ComputedStat): void;
}
export {};
