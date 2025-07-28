import { ApiStatKey, ApiStatValue, CacheStat, ComputedStat, Logger, Instance, InstanceStatus, Location, LocationMatchLevel, LogVerbosity, Metadata, MetadataCondition, RatelimitRule, RoutingRules, Service, StatusChangelog, StatusChangeRequest } from ".";
import { QuotaConfig } from "./rules";
import { RequireKeys } from "./utils";
/**
 * 数据存储结构
 */
export declare type DataWithRevision<T> = T extends unknown ? {
    /**
     * 数据列表
     */
    data: T;
    /**
     * 当前列表版本号
     */
    revision: string;
} : never;
/**
 * 全量服务数据集合
 */
export declare type ServiceDataSet<T> = Partial<Record<string, Partial<Record<string, T>>>>;
/**
 * 插件类型
 */
export declare enum PluginType {
    /** 服务发现 */
    NamingService = 1,
    /** 本地名字服务 */
    LocalRegistry = 2,
    /** 服务路由 */
    ServiceRouter = 4,
    /** 负载均衡 */
    LoadBalancer = 8,
    /** 健康探测 */
    OutlierDetector = 16,
    /** 节点熔断 */
    CircuitBreaker = 32,
    /** 动态权重调整 */
    WeightAdjuster = 64,
    /** 统计上报 */
    StatReporter = 128,
    /** 日志跟踪 */
    TraceLogging = 256,
    /** 限流服务 */
    RatelimitService = 512,
    /** 流量整型 */
    TrafficShaping = 1024 /** 1 << 10 */
}
/**
 * 插件列表
 */
export interface PluginList {
    /** 服务发现 */
    [PluginType.NamingService]: NamingServicePlugin;
    /** 本地名字服务 */
    [PluginType.LocalRegistry]: LocalRegistryPlugin;
    /** 服务路由 */
    [PluginType.ServiceRouter]: ServiceRouterPlugin[];
    /** 负载均衡 */
    [PluginType.LoadBalancer]: LoadBalancerPlugin;
    /** 健康探测 */
    [PluginType.OutlierDetector]: OutlierDetectorPlugin[];
    /** 节点熔断 */
    [PluginType.CircuitBreaker]: CircuitBreakerPlugin;
    /** 动态权重调整 */
    [PluginType.WeightAdjuster]: WeightAdjusterPlugin[];
    /** 统计上报 */
    [PluginType.StatReporter]: StatReporterPlugin[];
    /** 日志跟踪 */
    [PluginType.TraceLogging]: TraceLoggingPlugin[];
    /** 限流服务 */
    [PluginType.RatelimitService]: RatelimitServicePlugin;
    /** 流量整型 */
    [PluginType.TrafficShaping]: TrafficShapingPlugin[];
}
/**
 * 插件
 */
export interface Plugin {
    /**
     * 插件类型
     * 此为 `PluginType` 组成的位域，
     * 允许单个实例实现多种不同类型插件
     */
    readonly type: number;
    /**
     * 插件名
     * 尽量避免插件重名
     */
    readonly name: string;
    /**
     * 是否已销毁（释放）
     */
    readonly isDisposed?: boolean;
    /**
     * 销毁（释放）所占资源
     * 被调用后插件不可重入
     */
    dispose?(): void;
    /**
     * 设置日志输出模块
     * @param logger 日志输出模块
     */
    setLogger?(logger: Logger): void;
    /**
     * 设置全局变量
     * @param variables 全局变量列表
     */
    setVariables?(variables: Record<string, string>): void;
    /**
     * 获取当前插件配置
     * 如插件无配置项，可不实现此接口
     * @returns 当前插件配置
     */
    getConfig?(): unknown;
}
/**
 * 统计上报接口
 */
export interface StatReporterPlugin extends Plugin {
    /**
     * 上报 API 调用统计
     * @param key 维度
     * @param value 指标
     * @returns 是否上报成功
     */
    apiStatistics?(key: ApiStatKey, value: ApiStatValue): Promise<boolean>;
    /**
     * 上报服务间调用统计信息
     * @param namespace 命名空间
     * @param service 服务名
     * @param stat 周期汇总统计信息
     * @returns 是否上报成功
     */
    serviceStatistics?(namespace: string, service: string, stat: ComputedStat): Promise<boolean>;
    /**
     * 上报本地仓库中服务状态
     * @param namespace 命名空间
     * @param service 服务名
     * @param stat 周期汇总服务信息
     * @returns 是否上报成功
     */
    registryCache?(namespace: string, service: string, stat: CacheStat): Promise<boolean>;
    /**
     * 上报当前系统配置信息
     * @param config 收集的配置信息
     * @returns 是否上报成功
     */
    systemConfig?(config: unknown): Promise<boolean>;
    /**
     * 上报实例状态变化情况
     * @param namespace 命名空间
     * @param service 服务名
     * @param stat 周期汇总状态变更信息
     * @returns 是否上报成功
     */
    statusChangelog?(namespace: string, service: string, stat: StatusChangelog): Promise<boolean>;
}
/**
 * 节点熔断插件
 */
export interface CircuitBreakerPlugin extends Plugin {
    /**
     * 周期熔断
     *
     * 统计周期结束时，判断节点熔断
     *
     * @param namespace 命名空间
     * @param service 服务名
     * @param instances 服务列表
     * @param stat 周期汇总统计信息
     * @returns 状态变更请求（只需包含需要变更状态的实例）
     */
    period(namespace: string, service: string, instances: Instance[], stat: ComputedStat): Map<Instance, StatusChangeRequest>;
    /**
     * 实时熔断
     *
     * 用户上报时，判断节点熔断
     *
     * @param namespace 命名空间
     * @param service 服务名
     * @param instance 当前实例
     * @param success 是否调用成功
     * @param code 返回码（可选）
     * @returns 状态变更请求（如需熔断）
     */
    realtime(namespace: string, service: string, instance: Instance, success: boolean, code?: string): StatusChangeRequest | undefined;
}
/**
 * 探测结果
 */
export declare const enum DetectResult {
    /** 成功 */
    Success = 0,
    /** 失败 */
    Failure = 1,
    /** 其他 */
    Other = 2
}
/**
 * 健康探测插件
 */
export interface OutlierDetectorPlugin extends Plugin {
    /**
     * 主动健康探测
     * @param instance 需探测的实例
     * @returns 探测结果
     */
    detect(instance: Instance): Promise<DetectResult>;
}
/**
 * 权重类型
 */
export declare const enum WeightType {
    /** 动态权重 */
    Dynamic = 0,
    /** 静态权重 */
    Static = 1,
    /** 无 */
    None = 2
}
/**
 * 负载均衡插件
 */
export interface LoadBalancerPlugin extends Plugin {
    /**
     * 支持的权重类型
     */
    supportedWeightType: WeightType;
    /**
     * 通过特定负载均衡规则选取一个特定实例
     * @param namespace 命名空间
     * @param service 服务名
     * @param instances 可选择的实例列表
     * @param args 本次调用附加参数（可选）
     * @returns 被选出的实例
     */
    choose<AdditionalArgs>(namespace: string, service: string, instances: Instance[], args?: AdditionalArgs): Instance;
    /**
     * 当实例状态发生改变时调用
     * @param namespace 命名空间
     * @param service 服务名
     * @param instance 发生状态改变的实例
     * @param prevStatus 实例前序状态
     */
    onStatusChange?(namespace: string, service: string, instance: Instance, prevStatus: InstanceStatus): void;
}
/**
 * 动态权重调整插件
 */
export interface WeightAdjusterPlugin extends Plugin {
    /**
     * 权重调整
     * @param namespace 命名空间
     * @param service 服务名
     * @param instances 实例列表
     * @param stat 周期统计信息
     */
    adjust(namespace: string, service: string, instances: Instance[], stat: ComputedStat): void;
}
/**
 * 路由条件
 */
export declare enum RoutingCondition {
    Found = 0,
    NotFound = 1
}
/**
 * 路由行为
 */
export declare enum RoutingAction {
    /** 中断，不再查询本插件 */
    Break = 0,
    /** 旁通，旁通路由链上特定插件（可包含本插件） */
    Bypass = 1
}
/** 中断行为 */
export declare type BreakAction = Record<RoutingAction.Break, boolean>;
/** 旁通行为 */
export declare type BypassAction = Record<RoutingAction.Bypass, string[]>;
/**
 * 目标查询规则
 */
export interface DestinationQuery {
    /**
     * 控制器，可根据匹配结果控制后续处理方式
     * 如不填则以缺省方式处理
     */
    controller: Partial<Record<RoutingCondition, Partial<BreakAction & BypassAction>>>;
    /**
     * 目标信息
     */
    destination: Partial<DestinationInfo>;
    /**
     * 源信息
     */
    source?: Partial<SourceInfo>;
}
export interface SourceInfo {
    /**
     * 主调方元数据所匹配出的参数列表
     */
    parameters: Record<string, string>;
}
/**
 * 目标信息
 */
export interface DestinationInfo {
    /**
     * 被转发服务名
     */
    transfer: string;
    /**
     * 被调方服务名
     */
    service: string;
    /**
     * 被调方元数据匹配条件
     */
    metadata: MetadataCondition;
    /**
     * 位置信息比较级别
     */
    level: LocationMatchLevel;
}
/**
 * 二次过滤结果
 */
export interface FilteredResult {
    /**
     * 匹配的实例
     */
    filtered: Instance[];
    /**
     * 路由行为（可选）
     */
    action?: Partial<BreakAction & BypassAction>;
}
/**
 * 前置要求
 */
export declare enum RequisiteBitfield {
    /** 无 */
    None = 0,
    /** 规则 */
    Rule = 1
}
/**
 * 路由插件
 */
export interface ServiceRouterPlugin extends Plugin {
    /**
     * 前置要求
     * 此为 `RequisiteBitfield` 组成的位域
     */
    requisite: number;
    /**
     * 通用查询
     * @param callee 被调方服务信息
     * @param rules 全量路由规则（可选）
     * @param caller 主调方服务信息（可选）
     * @param args 本次调用附加参数（可选）
     * @returns 目标查询规则
     */
    query<AdditionalArgs>(callee: Service, rules?: RoutingRules[], caller?: Service, args?: AdditionalArgs): Iterable<Partial<DestinationQuery>>;
    /**
     * 二次过滤
     * @description 通用查询的每个迭代均会调用此方法，用于通用查询给出的结果的二次过滤，以满足通用查询无法支持的特定需求
     * @param instances 待过滤的实例
     * @param query 目标查询规则
     * @param args 本次调用附加参数（可选）
     * @returns 过滤结果
     */
    filter?<AdditionalArgs>(instances: Instance[], query: Partial<DestinationQuery>, args?: AdditionalArgs): FilteredResult;
}
/**
 * 数据存取接口
 */
export interface RegistryData<T> {
    /**
     * 获取数据
     * @param namespace 命名空间
     * @param service 服务名
     * @returns 带版本号的数据（可为空）
     */
    get(namespace: string, service: string): DataWithRevision<T> | null;
    /**
     * 设置数据
     * @param namespace 命名空间
     * @param service 服务名
     * @param data 带版本号的数据
     */
    set(namespace: string, service: string, data: DataWithRevision<T>): void;
    /**
     * 删除数据
     * @param namespace 命名空间
     * @param service 服务名
     * @returns 删除是否成功（数据是否存在）
     */
    delete(namespace: string, service: string): boolean;
    /**
     * 获取全部数据
     * @returns 当前存储的全部数据，数据组织结构为：`namespace(命名空间)`.`service(服务名)` = DataWithRevision<T>
     */
    all(): ServiceDataSet<DataWithRevision<T>>;
}
/**
 * 数据存储类别
 */
export declare enum RegistryCategory {
    /** 实例 */
    Instance = "Instance",
    /** 规则 */
    Rule = "Rule",
    /** 流控 */
    Ratelimit = "Ratelimit"
}
/**
 * 本地名字服务插件
 */
export interface LocalRegistryPlugin extends Plugin {
    /**
     * 实例
     */
    [RegistryCategory.Instance]: RegistryData<Instance[]>;
    /**
     * 规则
     */
    [RegistryCategory.Rule]: RegistryData<ServiceRules>;
    /**
     * 流控
     */
    [RegistryCategory.Ratelimit]: RegistryData<RatelimitRule[]>;
}
/**
 * 健康检查类型
 */
export declare enum HealthCheckType {
    UNKNOWN = 0,
    HEARTBEAT = 1
}
/**
 * 注册选项
 */
export interface RegisterOptions {
    /**
     * 是否开启健康检查
     */
    enableHealthCheck: boolean;
    /**
     * 实例健康检查类型
     */
    healthCheckType: HealthCheckType;
    /**
     * 超时时间（秒）
     */
    healthCheckTTL: number;
}
/**
 * 服务规则
 */
export interface ServiceRules {
    /**
     * 入站规则
     */
    in: RoutingRules[];
    /**
     * 出站规则
     */
    out: RoutingRules[];
}
/**
 * 待服务注册的实例类型
 */
export declare type RegistrationInstance = RequireKeys<Partial<Omit<Instance, "dynamicWeight">>, "host" | "port">;
/**
 * 运行模式
 */
export declare enum OperatingMode {
    /** 内部 */
    Internal = 0,
    /** 外部 */
    External = 1
}
/**
 * 名字服务插件
 */
export interface NamingServicePlugin extends Plugin {
    /**
     * 运行模式
     */
    readonly mode: OperatingMode;
    /**
     * 客户端位置信息
     */
    readonly location?: Location;
    /**
     * 获取单个服务实例
     * @param namespace 命名空间
     * @param service 服务名
     * @param metadata 元数据信息，用于过滤服务实例，可选
     * @returns 选出的实例（可为空）
     */
    select?(namespace: string, service: string, metadata?: Metadata): Promise<Instance | null>;
    /**
     * 获取全部服务实例
     * @note 返回的每个实例中的字段 `id` | `host` | `port` | `staticWeight` | `status` 不能为假值
     * @param namespace 命名空间
     * @param service 服务名
     * @param revision 修订版本号
     * @returns 带版本号的实例列表
     */
    list(namespace: string, service: string, revision?: string): Promise<DataWithRevision<Instance[]>>;
    /**
     * 获取路由规则
     * @param namespace 命名空间
     * @param service 服务名
     * @param revision 修订版本号
     * @returns 服务规则
     */
    routingRules(namespace: string, service: string, revision?: string): Promise<DataWithRevision<ServiceRules>>;
    /**
     * 服务注册
     * @param namespace 命名空间
     * @param service 服务名
     * @param token 服务 Token 用来鉴权
     * @param instance 待注册的实例
     * @param options 注册选项
     * @returns 实例唯一 ID
     */
    register(namespace: string, service: string, token: string, instance: RegistrationInstance, options?: RegisterOptions): Promise<string>;
    /**
     * 服务注销
     * @param id 实例唯一 ID
     * @param token 服务 Token 用来鉴权
     * @returns 是否注销成功
     */
    unregister(id: string, token: string): Promise<boolean>;
    /**
     * 服务注销
     * @param namespace 命名空间
     * @param service 服务名
     * @param host 节点 IP 或者域名
     * @param port 节点端口号
     * @param token 服务 Token 用来鉴权
     * @returns 是否注销成功
     */
    unregister(namespace: string, service: string, host: string, port: number, token: string): Promise<boolean>;
    /**
     * 服务心跳上报
     * @param id 实例唯一 ID
     * @param token 服务 Token 用来鉴权
     * @returns 是否发送成功
     */
    heartbeat(id: string, token: string): Promise<boolean>;
    /**
     * 服务心跳上报
     * @param namespace 命名空间
     * @param service 服务名
     * @param host 节点 IP 或者域名
     * @param port 节点端口号
     * @param token 服务 Token 用来鉴权
     * @returns 是否发送成功
     */
    heartbeat(namespace: string, service: string, host: string, port: number, token: string): Promise<boolean>;
}
/**
 * 限流服务插件
 */
export interface RatelimitServicePlugin extends Plugin {
    /**
     * 获取限流规则
     * @param namespace 命名空间
     * @param service 服务名
     * @returns 限流规则
     */
    ratelimitRules(namespace: string, service: string, revision?: string): Promise<DataWithRevision<RatelimitRule[]>>;
    /**
     * 获取限流配额
     * @param namespace 命名空间
     * @param service 服务名
     * @param rule 限流规则
     * @param used 周期已使用的配额
     * @returns 当前周期所使用的配额总量
     */
    acquireQuota(namespace: string, service: string, rule: RatelimitRule, used: QuotaConfig[]): Promise<QuotaConfig[]>;
}
/**
 * 日志跟踪插件
 */
export interface TraceLoggingPlugin extends Omit<Plugin, "setLogger"> {
    /**
     * 输出普通日志
     * @param severity 日志级别
     * @param prefix 前缀（可选）
     * @param message 日志内容（可选）
     * @param optionalParams 附加参数
     */
    log(severity: LogVerbosity, prefix?: unknown, message?: unknown, ...optionalParams: unknown[]): void;
    /**
     * 输出跟踪日志
     * @param tracer 发起者
     * @param transaction 跟踪 ID（可选）
     * @param message 日志内容（可选）
     * @param optionalParams 附加参数
     */
    trace(tracer: string, transaction?: unknown, message?: unknown, ...optionalParams: unknown[]): void;
}
/**
 * 流量整型插件
 */
export interface TrafficShapingPlugin extends Plugin {
    /**
     * 流量控制
     * @param rule 限流规则
     * @param partition 当前限流规则分区数
     * @returns 返回当前申请配额的 {Promise} 对象
     */
    inFlow(rule: RatelimitRule, partition: number): Promise<void>;
}
