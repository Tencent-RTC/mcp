import { Instance, InstanceStatus } from "../instance";
import { Location } from "../location";
import { Logger } from "../logging";
import { Metadata } from "../metadata";
import { LoadBalancerPlugin, OutlierDetectorPlugin, StatReporterPlugin } from "../plugins";
import { LocalRegistry } from "../registry";
declare const kDefaultOptions: {
    /**
     * 检查间隔
     *
     * 此值确定了，探活子系统的最小分辨率
     */
    detectInterval: number;
    /**
     * 熔断超时时间
     *
     * 未配置任何探活模块时生效
     */
    fusingTimeout: number;
    /**
     * 状态变更上报间隔
     */
    reportInterval: number;
    /**
     * 状态变更上报阈值
     */
    reportThreshold: number;
};
export declare type HealthOptions = typeof kDefaultOptions;
/**
 * 实例集合的共同信息
 */
export interface IntersectionInstance {
    location: Location;
    metadata: Metadata;
}
/**
 * 状态变更历史
 */
export interface StatusChangelog {
    /**
     * 各实例状态变更历史
     */
    status: Map<Instance, StatusLog[]>;
    /**
     * 全局 `全死 ---> 全活` 变更历史
     */
    recover: RecoverLog[];
}
/**
 * 全死 ---> 全活变更记录
 */
export interface RecoverLog {
    /**
     * 发生时间 (ms)
     */
    time: number;
    /**
     * 实例集合的共同信息
     */
    intersection: IntersectionInstance;
}
/**
 * 实例状态变更请求
 */
export interface StatusChangeRequest {
    /**
     * 变更后（目标）状态
     */
    status: InstanceStatus;
    /**
     * 变更原因
     */
    reason: string;
}
/**
 * 实例状态变更记录
 */
export interface StatusLog {
    /**
     * 变更时间 (ms)
     */
    time: number;
    /**
     * 变更前（原）状态
     */
    before: InstanceStatus;
    /**
     * 变更后（目标）状态
     */
    after: InstanceStatus;
    /**
     * 变更原因
     */
    reason: string;
}
export declare class Health {
    private readonly logger;
    private readonly registry;
    private readonly lb;
    private readonly detectors;
    private readonly reporters;
    private detectTimer;
    private reportTimer;
    private readonly pending;
    private readonly options;
    private history;
    private countOfHistory;
    private readonly needReport;
    private disposed;
    constructor(logger: Logger, registry: LocalRegistry, lb: LoadBalancerPlugin, detectors: OutlierDetectorPlugin[], reporters: StatReporterPlugin[], options?: Partial<HealthOptions>);
    dispose(): void;
    changeStatus(namespace: string, service: string, collections: Map<Instance, StatusChangeRequest>): void; /** batch - for performance */
    changeStatus(namespace: string, service: string, instance: Instance, status: InstanceStatus, reason: string): void; /** single - for convenient */
    recoverAll(namespace: string, service: string, instances: Instance[]): void;
    private scheduleReport;
    private report;
    private getServiceChangelog;
    private performStatusChange;
    private detect;
    private procDetectResult;
    private successfulDetection;
    private detectInstance;
    private run;
}
export {};
