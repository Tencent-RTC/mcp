import { GlobalOptions } from "../global";
import { LoggerOptions } from "../logging";
import { Metadata } from "../metadata";
import { PluginList, PluginType } from "../plugins";
import { LocalRegistryOptions } from "../registry";
import { SkeletonClass } from "../skeleton";
import { RequireKeys } from "../utils";
import { Quota, RatelimitOptions } from "./ratelimit";
declare type LimiterPluginList = Pick<PluginList, PluginType.LocalRegistry | PluginType.NamingService | PluginType.RatelimitService | PluginType.TrafficShaping | PluginType.TraceLogging | PluginType.StatReporter>;
export declare type OptionalLimiterPluginList = RequireKeys<Partial<LimiterPluginList>, PluginType.NamingService>;
export declare type LimiterOptions = GlobalOptions & RatelimitOptions & LoggerOptions & LocalRegistryOptions;
export interface AcquireResponse {
    /**
     * 唯一 ID
     * 用于优化下次查询性能
     */
    readonly id?: string;
    /**
     * 配额
     */
    readonly quotas: Quota[];
}
declare const kRatelimit: unique symbol;
declare const kRegistry: unique symbol;
declare const kCurrentInstances: unique symbol;
declare const KMaxInstances: unique symbol;
export declare class Limiter extends SkeletonClass<LimiterPluginList> {
    /**
     * note:
     * 由于类包含专用标识符时，`super` 调用必须是构造函数中的第一个语句。
     * 所以这里采用 `Symbol` 来实现 __私有静态属性__
     */
    private static [kCurrentInstances];
    private static [KMaxInstances];
    /**
     * 当前可实例化的最大次数
     */
    static get maxInstances(): number;
    /**
     * 设置可实例化的最大次数
     * @param n 最大次数
     */
    static setMaxInstances(n: number): void;
    private readonly [kRatelimit];
    private readonly [kRegistry];
    /**
     * Create Limiter
     * @param plugins 插件
     * @param options 配置参数（可选）
     */
    constructor(plugins: OptionalLimiterPluginList, options?: Partial<LimiterOptions>);
    /**
     * 销毁（释放）所占资源
     *
     * @description
     * dispose order:
     *  Ratelimit -> Registry -> [plguins]
     *
     * @param sync 是否同步释放（可选）
     */
    dispose(sync?: boolean): void;
    /**
     * 通过条件获取配额分配对象
     * @param namespace 命名空间
     * @param service 服务名
     * @param amount 请求的配额数
     * @param cluster 集群名（可选）
     * @param labels 标签集合（可选）
     * @param id 唯一 ID（可选）
     */
    acquire(namespace: string, service: string, amount: number, cluster?: string, labels?: Metadata, id?: string): Promise<AcquireResponse>;
}
export {};
