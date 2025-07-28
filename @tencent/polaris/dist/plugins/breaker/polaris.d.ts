import { ComputedStat, StatusChangeRequest } from "../../consumer";
import { Instance } from "../../instance";
import { CircuitBreakerPlugin, PluginType } from "../../plugins";
declare const kDefaultOptions: {
    /**
     * 连续失败统计周期
     */
    continuousWindow: number;
    /**
     * 连续失败次数阈值
     */
    continuousErrors: number;
    /**
     * 触发熔断的最低请求阈值
     */
    fuseThreshold: number;
    /**
     * 熔断错误率阈值
     */
    fuseRate: number;
    /**
     * 半开恢复 `HalfClose` ---> `Normal` 所需的最小成功请求数
     * 值不能大于探活任务的最大探测次数
     */
    halfClose2Normal: number;
    /**
     * 半开熔断 `HalfClose` ---> `Fused` 所需的最小失败请求数
     * 值不能大于探活任务的最大探测次数
     */
    halfClose2Fused: number;
};
export declare type PolarisCircuitBreakerOptions = typeof kDefaultOptions;
export declare class PolarisCircuitBreaker implements CircuitBreakerPlugin {
    readonly type = PluginType.CircuitBreaker;
    readonly name: string;
    private readonly options;
    private disposed;
    private readonly periodStat;
    private realtimeStat;
    private timer;
    constructor(options?: Partial<PolarisCircuitBreakerOptions>);
    dispose(): void;
    get isDisposed(): boolean;
    period(namespace: string, service: string, instances: Instance[], stat: ComputedStat): Map<Instance, StatusChangeRequest>;
    realtime(namespace: string, service: string, instance: Instance, success: boolean): StatusChangeRequest | undefined;
}
export {};
