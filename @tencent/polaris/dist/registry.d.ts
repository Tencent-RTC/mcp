/// <reference types="node" />
import { EventEmitter } from "events";
import { Instance } from "./instance";
import { Location } from "./location";
import { Logger } from "./logging";
import { DataWithRevision, LocalRegistryPlugin, NamingServicePlugin, RatelimitServicePlugin, RegistryCategory, ServiceDataSet, ServiceRules, StatReporterPlugin } from "./plugins";
import { RatelimitRule } from "./rules";
import { PartialSubset } from "./utils";
/**
 * 事件类型
 */
export declare const enum RegistryEventType {
    /** 同步实例状态事件 */
    SyncInstanceStatus = "SyncInstanceStatus"
}
declare const kDefaultOptions: {
    /**
     * 过期时间
     * 超过此时间，会 __异步__ 请求新数据
     * _也就是说，返回值可能为旧数据_
     */
    expireTime: {
        /** 实例过期时间 */
        Instance: number;
        /** 规则过期时间 */
        Rule: number;
        /** 限流规则过期时间 */
        Ratelimit: number;
    };
    /**
     * 刷新时间
     * 达到此时间，会自动更新数据（如数据已过期）
     * _数据刷新，并不影响资源回收策略_
     */
    refreshTime: {
        /** 实例刷新时间 */
        Instance: number;
        /** 规则刷新时间 */
        Rule: number;
        /** 限流规则刷新时间 */
        Ratelimit: number;
    };
    /**
     * 脏数据时间
     * 超过此时间，会 __同步__ 请求新数据
     * _也就是说，返回值一定为新数据_
     */
    dirtyTime: {
        /** 实例脏数据时间 */
        Instance: number;
        /** 规则脏数据时间 */
        Rule: number;
        /** 限流规则脏数据时间 */
        Ratelimit: number;
    };
    /**
     * 资源回收时间
     * 回收条件为：_至少_经历指定的间隔都没被访问
     * 小于或等于 0 则为不启用此特性
     */
    recycleTime: number;
    /**
     * 服务状态上报间隔
     */
    reportInterval: number;
    /**
     * 服务状态上报阈值
     */
    reportThreshold: number;
    /**
     * 请求池最大容量
     * 超过此大小，且无请求时，将会进行回收
     */
    maxRequestsCapacity: number; /** v8 对于 FastProperties Slot 的上限为 18 */
};
declare type LocalRegistryAssembleOptions = typeof kDefaultOptions & {
    /**
     * 基础位置信息
     * 如果 `Naming` 返回的位置信息为空，则使用此配置
     */
    baseLocation?: Location;
};
export declare type LocalRegistryOptions = PartialSubset<LocalRegistryAssembleOptions, "expireTime" | "refreshTime" | "dirtyTime">;
/**
 * 版本号变更记录
 */
export interface RevisionLog {
    /**
     * 变更时间 (ms)
     */
    time: number;
    /**
     * 变更后版本号
     */
    revision: string;
}
/** 服务变更历史 */
export declare type ServiceChangelog = Record<RegistryCategory, RevisionLog[]>;
/**
 * 服务状态
 */
export declare type CacheStat = Record<RegistryCategory, {
    /**
     * 变更历史
     */
    history: RevisionLog[];
    /**
     * 当前是否已删除（包括过期淘汰与Server删除）
     */
    eliminated: boolean;
}>;
export declare class LocalRegistry extends EventEmitter {
    private readonly logger;
    private readonly naming;
    private readonly registry;
    private readonly reporters;
    private readonly ratelimit?;
    private entriesMeta;
    private servicesMeta;
    private activeRequestsPool;
    private activeRequestsCapacity;
    private activeRequestsCount;
    private historyRecorder;
    private historyRecorderCount;
    private historyReporter;
    private readonly needReport;
    private readonly options;
    private disposed;
    constructor(logger: Logger, naming: NamingServicePlugin, registry: LocalRegistryPlugin, reporters: StatReporterPlugin[], ratelimit?: RatelimitServicePlugin | undefined, options?: Partial<LocalRegistryOptions>);
    get location(): Location | undefined;
    fetch(type: RegistryCategory.Instance, namespace: string, service: string): Promise<Instance[]>;
    fetch(type: RegistryCategory.Rule, namespace: string, service: string): Promise<ServiceRules>;
    fetch(type: RegistryCategory.Ratelimit, namespace: string, service: string): Promise<RatelimitRule[]>;
    fetch(type: RegistryCategory, namespace: string, service: string): Promise<ServiceRules | Instance[] | RatelimitRule[]>;
    local(type: RegistryCategory.Instance, namespace: string, service: string): DataWithRevision<Instance[]> | null;
    local(type: RegistryCategory.Rule, namespace: string, service: string): DataWithRevision<ServiceRules> | null;
    local(type: RegistryCategory.Ratelimit, namespace: string, service: string): DataWithRevision<RatelimitRule[]> | null;
    local(type: RegistryCategory, namespace: string, service: string): DataWithRevision<Instance[] | ServiceRules | RatelimitRule[]> | null;
    local(type: RegistryCategory.Instance): ServiceDataSet<DataWithRevision<Instance[]>>;
    local(type: RegistryCategory.Rule): ServiceDataSet<DataWithRevision<ServiceRules>>;
    local(type: RegistryCategory.Ratelimit): ServiceDataSet<DataWithRevision<RatelimitRule[]>>;
    local(type: RegistryCategory): ServiceDataSet<DataWithRevision<Instance[]>> | ServiceDataSet<DataWithRevision<ServiceRules>> | ServiceDataSet<DataWithRevision<RatelimitRule[]>>;
    dispose(): void;
    get isDisposed(): boolean;
    /** for external use only */
    update(type: RegistryCategory, namespace: string, service: string): Promise<boolean>;
    /** for internal use only */
    private performUpdate;
    private updateInstance;
    private updateRule;
    private updateRatelimit;
    /**
     * @note
     *  将相同的查询请求做合并（以最早发出为准）
     *  以减少本地名字服务无缓存情况下，对于 `Naming` 的调用压力。
     */
    private request;
    private pull;
    private report;
    private changelog;
    private cancelHistoryReporter;
    private accessService;
    private dropServiceMeta;
    private createServiceMeta;
    private dropService;
    private attachRefresherToEntryMeta;
    private attachUpdaterToEntryMeta;
    private releaseEntryMeta;
    private dropEntryMeta;
    private createEntries;
    private createEntryMeta;
    private getEntryMeta;
}
export {};
