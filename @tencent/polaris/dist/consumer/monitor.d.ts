/// <reference types="node" />
import { Instance } from "../instance";
import { Logger } from "../logging";
import { CircuitBreakerPlugin, StatReporterPlugin, WeightAdjusterPlugin } from "../plugins";
import { LocalRegistry } from "../registry";
import { Health } from "./health";
export interface StatProp {
    /**
     * 总调用量，其值可为 0
     */
    count: number;
    /**
     * 总耗时，其值可为 0
     */
    cost: number;
}
/**
 * 用于 `BucketStat` 索引
 *
 * 第一个字符代表调用是否成功（0 为失败，1 为成功），剩余部分代表返回状态码
 *
 * Background:
 * 由于 ECMAScript 没有办法重写对象 Key 的比较函数，
 * 所以这里将维度打平为字符串以提高查找性能，以减少额外开销
 */
declare type BucketStatKey = `${0 | 1}${string}`;
export interface ComputeStatKey {
    /**
     * 是否调用成功
     */
    success: boolean;
    /**
     * 返回码
     */
    code: string;
}
export interface ComputedStat {
    /**
     * 统计周期
     */
    statWindow: number;
    /**
     * 汇总统计值
     */
    summaryStat: Map<Instance, Map<ComputeStatKey, StatProp>>;
}
/**
 * 采用滑动窗口，分桶方式进行
 */
interface BucketStat {
    /**
     * 所在统计周期
     */
    period: number;
    /**
     * 统计值
     */
    stat: Record<BucketStatKey, StatProp>;
}
declare const kDefaultOptions: {
    /**
     * 统计周期
     *
     * 与统计单元数，共同确定了统计数据的计算间隔（监控子的系统最小分辨率）
     */
    statWindow: number;
    /**
     * 统计单元数
     *
     * 与统计周期，共同确定了统计数据的计算间隔（监控子的系统最小分辨率）
     */
    bucketsCount: number;
    /**
     * 是否开启动态权重
     *
     * 仅 `InternalMonitor` 有效
     */
    enableDynamicWeights: boolean;
    /**
     * 节点熔断插件开启状态
     *
     * 仅 `InternalMonitor` 有效
     */
    breakerSwitch: {
        /**
         * 实时熔断是否开启
         */
        realtime: boolean;
        /**
         * 周期熔断是否开启
         */
        period: boolean;
    };
};
export declare type MonitorOptions = typeof kDefaultOptions;
/** 统计要求 */
declare const enum StatisticalBitfield {
    /** 不做任何统计 */
    None = 0,
    /** 统计全量数据 */
    Full = 1,
    /** 仅统计存活数据，实例状态不为 `Fused` */
    Alive = 2
}
declare class StatStore {
    store: Partial<Record<string, Partial<Record<string, Map<Instance, BucketStat[]>>>>>;
    get(namespace: string, service: string): Map<Instance, BucketStat[]>;
}
export declare abstract class Monitor {
    protected currentPeriod: number;
    protected timer: NodeJS.Timeout | undefined;
    protected disposed: boolean;
    protected fullStat?: StatStore;
    protected aliveStat?: StatStore;
    protected abstract options: MonitorOptions;
    constructor(requisite?: StatisticalBitfield);
    dispose(): void;
    update(namespace: string, service: string, instance: Instance, success: boolean, cost: number, code?: string): void;
    private performUpdate;
    protected abstract compute(): void;
}
export declare class InternalMonitor extends Monitor {
    protected options: MonitorOptions;
    private readonly health;
    private readonly logger;
    private readonly registry;
    private readonly breaker?;
    private readonly adjusters;
    private readonly reporters;
    constructor(logger: Logger, health: Health, registry: LocalRegistry, adjusters: WeightAdjusterPlugin[], reporters: StatReporterPlugin[], breaker?: CircuitBreakerPlugin, options?: Partial<MonitorOptions>);
    update(namespace: string, service: string, instance: Instance, success: boolean, cost: number, code?: string): void;
    protected performCompute({ store }: StatStore, handle: (namespace: string, service: string, computed: ComputedStat) => void): void;
    protected compute(): void;
    private performFullStat;
    private performAliveStat;
}
export declare class ExternalMonitor extends Monitor {
    protected options: MonitorOptions;
    private readonly logger;
    private readonly reporters;
    private nowPeriod;
    constructor(logger: Logger, reporters: StatReporterPlugin[], options?: Partial<MonitorOptions>);
    compute(): Promise<void>;
}
export {};
