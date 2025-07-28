import { GlobalOptions } from "./global";
import { Logger, LogVerbosity } from "./logging";
import { Plugin, PluginList, PluginType, StatReporterPlugin } from "./plugins";
import { RequireKeys } from "./utils";
export declare const kLogger: unique symbol;
declare const kInitializePlugin: unique symbol;
export declare const kCollector: unique symbol;
export declare const kAPICollector: unique symbol;
export declare const kAPIReport: unique symbol;
declare const kReportTimer: unique symbol;
declare const kNeedAPICollector: unique symbol;
export declare enum ResultType {
    /** 未知 */
    Unknown = 0,
    /** 用户调用成功 */
    Success = 1,
    /** 由于用户的原因，如参数错误导致的调用错误 */
    UserFail = 2,
    /** 由于系统原因（SDK 或者 Server）导致用户调用失败 */
    SystemFail = 3
}
/**
 * API 调用状态（维度）
 */
export interface ApiStatKey {
    /**
     * 被调用的 API
     */
    api: string;
    /**
     * 调用结果码
     * 如果有错误，那么就是具体的错误码，否则为 0，表示成功
     */
    code: string;
    /**
     * 返回类型
     */
    result: ResultType;
    /**
     * 延迟范围
     * 分为 5 个区间：
     * * [0ms,50ms)
     * * [50ms,100ms)
     * * [100ms,150ms)
     * * [150ms,200ms)
     * * [200ms,)
     */
    delay: string;
}
/**
 * API 调用状态（指标）
 */
export declare type ApiStatValue = number;
export declare const isStatReporterPlugin: (plugin: Plugin) => plugin is StatReporterPlugin;
export declare const emitMaxInstancesExceededWarning: (type: string, count: number) => void;
export declare const kDisposed: unique symbol;
export declare const kMaybeAlreadyDisposed: unique symbol;
export declare const kGlobal: unique symbol;
/**
 * API 骨架类，用于 `Consumer` | `Provider` | `Limiter`
 */
export declare abstract class SkeletonClass<Plugins extends RequireKeys<Partial<PluginList>, PluginType.TraceLogging | PluginType.StatReporter>> {
    protected [kLogger]: Logger;
    protected [kGlobal]: GlobalOptions;
    protected readonly plugins: Plugins;
    protected [kDisposed]: boolean;
    private [kCollector];
    private [kReportTimer];
    private [kNeedAPICollector];
    constructor(plugins: Plugins, options: Record<string, unknown>, logger?: Logger);
    [kMaybeAlreadyDisposed](): void;
    /**
     * @description
     * dispose order:
     *  ... [plugins] ... -> TraceLogging
     *
     * @param sync 是否同步释放
     */
    dispose(sync: boolean): void;
    setVerbosity(verbosity: LogVerbosity): void;
    enableTracing(): void;
    disableTracing(): void;
    protected [kInitializePlugin](): void;
    protected [kAPICollector](api: string, cost: number, err?: Error): void;
    private [kAPIReport];
}
export {};
