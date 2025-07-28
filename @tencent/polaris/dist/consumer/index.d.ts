import { GlobalOptions } from "../global";
import { Instance } from "../instance";
import { Logger, LoggerOptions } from "../logging";
import { Metadata } from "../metadata";
import { PluginList, PluginType, RegistryCategory, ServiceRules } from "../plugins";
import { LocalRegistryOptions } from "../registry";
import { Service } from "../service";
import { SkeletonClass } from "../skeleton";
import { PartialKeys, RequireKeys } from "../utils";
import { HealthOptions } from "./health";
import { Monitor, MonitorOptions } from "./monitor";
import { CallArgsType, CombinatedArgs, SelectorOptions } from "./selector";
export { CallArgsType } from "./selector";
export { ComputedStat, ComputeStatKey, StatProp } from "./monitor";
export { StatusChangelog, StatusChangeRequest } from "./health";
declare const kSelector: unique symbol;
declare const kMonitor: unique symbol;
declare const kHealth: unique symbol;
declare const kRegistry: unique symbol;
export declare class SelectResponse {
    readonly callee: Service;
    readonly instance: Instance;
    private readonly [kMonitor];
    constructor(callee: Service, instance: Instance, monitor: Monitor);
    /**
     * 上报调用结果
     * @param success 是否调用成功
     * @param cost 调用耗时（需大于等于 0，默认为 0）
     * @param code 返回码（可选）
     */
    update(success: boolean, cost?: number, code?: string): void;
}
export declare type ConsumerOptions = GlobalOptions & MonitorOptions & HealthOptions & SelectorOptions & LoggerOptions & LocalRegistryOptions;
declare type ConsumerPluginList = PartialKeys<Omit<PluginList, PluginType.RatelimitService | PluginType.TrafficShaping>, PluginType.CircuitBreaker>;
export declare type OptionalConsumerPluginList = RequireKeys<Partial<ConsumerPluginList>, PluginType.NamingService>;
/**
 * For internal use only.
 * Use `Consumer` instead of `InternalConsumer`.
 */
export declare class InternalConsumer extends SkeletonClass<ConsumerPluginList> {
    private static mergePluginList;
    private readonly [kSelector];
    private readonly [kMonitor];
    private readonly [kHealth];
    private readonly [kRegistry];
    /**
     * Create Consumer
     * @param plugins 插件
     * @param options 配置参数（可选）
     * @param logger Logger 对象共享，如不传则会自动创建
     */
    constructor(plugins: OptionalConsumerPluginList, options?: Partial<ConsumerOptions>, logger?: Logger);
    /**
     * 销毁（释放）所占资源
     *
     * @description
     * dispose order:
     *  Monitor -> Health -> Selector -> Registry -> [plguins]
     *
     * @param sync 是否同步释放（可选）
     */
    dispose(sync?: boolean): void;
    /**
     * 获取单个服务实例
     * @param namespace 被调方名字空间
     * @param service 被调方服务名
     * @param metadata 主调方服务元数据（可选）
     * @param args 本次调用附加参数（可选）
     */
    select<ServiceRouterArgs extends CombinatedArgs, LoadBalancerArgs = unknown>(namespace: string, service: string, metadata?: Metadata, args?: CallArgsType<ServiceRouterArgs, LoadBalancerArgs>): Promise<SelectResponse | null>;
    /**
     * 获取单个服务实例
     * @param callee 被调方服务信息
     * @param caller 主调方服务信息（可选）
     * @param args 本次调用附加参数（可选）
     */
    select<ServiceRouterArgs extends CombinatedArgs, LoadBalancerArgs = unknown>(callee: Service, caller?: Service, args?: CallArgsType<ServiceRouterArgs, LoadBalancerArgs>): Promise<SelectResponse | null>;
    /**
     * 获取全部服务实例
     * @param namespace 服务名字空间
     * @param service 服务名
     */
    list(namespace: string, service: string): Promise<Instance[]>;
    /**
     * 获取服务规则路由
     * @param namespace 服务名字空间
     * @param service 服务名
     */
    rules(namespace: string, service: string): Promise<ServiceRules>;
    /**
     * 强制刷新缓存
     * @param namespace 服务名字空间
     * @param service 服务名
     * @param type 数据存储类别
     */
    update(namespace: string, service: string, type: RegistryCategory): Promise<boolean>;
}
export declare class Consumer extends InternalConsumer {
    #private;
    /**
     * 当前可实例化的最大次数
     */
    static get maxInstances(): number;
    /**
     * 设置可实例化的最大次数
     * @param n 最大次数
     */
    static setMaxInstances(n: number): void;
    /**
     * Create Consumer
     * @param plugins 插件
     * @param options 配置参数（可选）
     */
    constructor(plugins: OptionalConsumerPluginList, options?: Partial<ConsumerOptions>);
    /**
     * 销毁（释放）所占资源
     * @param sync 是否同步释放（可选）
     */
    dispose(sync?: boolean): void;
}
