import { Logger } from "../../logging";
import { RatelimitServicePlugin } from "../../plugins";
import { LocalRegistry } from "../../registry";
import { RatelimitRule } from "../../rules";
import { Ratelimiter } from "./base";
export interface GlobalRatelimiterOptions {
    /**
     * 远端令牌桶，过期判定周期数
     */
    outdatedPeriod: number;
    /**
     * 令牌桶空闲回收，判定周期数
     */
    idlePeriod: number;
    /**
     * 实例数更新时间 (ms)
     */
    instanceUpdateTime: number;
    /**
     * 使用了百分之多少配额后，启动一次实时上报
     * 范围 (0,1]
     */
    updatePercent: number;
}
/**
 * 全局令牌桶
 * 对应 `LimitType.Global` 全局限流
 */
export declare class GlobalRatelimiter implements Ratelimiter {
    private readonly namespace;
    private readonly service;
    private readonly rule;
    private readonly logger;
    private readonly registry;
    private readonly backend;
    private readonly options;
    private readonly buckets;
    private readonly taskInfo;
    private indexes?;
    private wakePromise;
    private partition;
    private idlePeriods;
    private isAccessed;
    private maxDuration;
    private status;
    private readonly updateConfig;
    constructor(namespace: string, service: string, rule: RatelimitRule, logger: Logger, registry: LocalRegistry, backend: RatelimitServicePlugin, options: GlobalRatelimiterOptions);
    consume(preroll?: boolean): Promise<boolean>;
    return(): Promise<void>;
    getPartition(): Promise<number>;
    private dispose;
    private wake;
    private sleep;
    private scheduleTask;
    private updatePartition;
    private syncQuota;
    private checkOutdated;
    private shouldSleep;
}
