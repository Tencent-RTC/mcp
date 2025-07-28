import { MetadataCondition } from "./metadata";
/**
 * 路由规则
 *
 * 如果匹配 `SourceRule` 规则，按照 `DestinationRule` 路由
 *
 * 多个 `sources` 之间的关系为或
 */
export interface RoutingRules {
    sources: SourceRule[];
    destinations: DestinationRule[];
}
/**
 * 源规则
 */
export interface SourceRule {
    /**
     * 主调方服务名
     */
    service: string;
    /**
     * 主调方元数据匹配条件
     */
    metadata?: MetadataCondition;
}
/**
 * 目标规则
 *
 * @description
 * 根据服务名和服务实例 `metadata` 筛选符合条件的服务实例子集
 *
 * 服务实例子集可以设置优先级和权重：
 * 1. 先按优先级路由，如果存在高优先级，不会使用低优先级
 * 2. 如果存在优先级相同的子集，再按权重分配
 *
 * 其中优先级和权重可以都不设置/设置一个/设置两个：
 *   * 如果没有设置优先级，认为没有设置的优先级为 9
 *   * 如果没有设置，认为没有设置的权重为 0
 */
export interface DestinationRule {
    /**
     * 被调方服务名
     */
    service: string;
    /**
     * 被调方元数据匹配条件
     */
    metadata?: MetadataCondition;
    /**
     * 优先级：范围[0, 9]，最高优先级为 0
     */
    priority: number;
    /**
     * 权重：范围[0, 1]
     */
    weight: number;
    /**
     * 将请求转发到代理服务
     */
    transfer?: string;
}
/**
 * 限流规则信息
 */
export interface RatelimitRule {
    /**
     * 限流规则唯一标识
     */
    readonly id: string;
    /**
     * 版本信息
     */
    revision: string;
    /**
     * 规则所属集群名
     */
    cluster: string;
    /**
     * 限流规则优先级，最高优先级为 0
     */
    priority: number;
    /**
     * 业务标签匹配条件
     * 按照元数据方式进行匹配，匹配到一个则使用该规则
     */
    labels: MetadataCondition;
    /**
     * 是否进行限流
     */
    enable: boolean;
    /**
     * 限流类型
     */
    type: LimitType;
    /**
     * 限流资源
     */
    resource: LimitResource;
    /**
     * 限流动作
     * 对应客户端的插件名
     */
    action: string;
    /**
     * 限流阈值
     * 可以有多个粒度的配置（比如同时针对秒级，分钟级，天级），匹配一个则进行限流
     * 全局限流模式下，该值为服务配额总量；单机限流模式下，该值为单个节点能处理的配额量
     */
    amounts: QuotaConfig[];
    /**
     * 配额上报
     * 支持按固定周期上报，以及达到配额后上报 2 种模式
     * 仅当 `LimitType.GLOBAL` 时生效
     */
    report?: QuotaReport;
}
/**
 * 限流阈值
 */
export interface QuotaConfig {
    /**
     * 时间周期内的配额数
     */
    amount: number;
    /**
     * 配额时间周期（ms）
     * 周期必须大于等于 1s(1000ms)
     */
    duration: number;
}
/**
 * 配额上报
 */
export interface QuotaReport {
    /**
     * 配额上报周期 (ms)
     * 需大于等于 1000ms
     */
    interval: number;
    /**
     * 使用了多少配额后启动一次上报（百分比）
     * (0, 1]
     */
    percent: number;
}
/**
 * 限流资源
 */
export declare enum LimitResource {
    /** 针对 QPS 进行限流 */
    QPS = 0,
    /** 针对并发数进行限流 */
    Concurrency = 1
}
/**
 * 限流模式
 */
export declare enum LimitType {
    /** 全局限流 */
    Global = 0,
    /** 本地限流 */
    Local = 1
}
