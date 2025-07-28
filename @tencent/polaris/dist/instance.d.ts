import { Location } from "./location";
import { Metadata } from "./metadata";
/**
 * 实例状态
 *
 * ```
 *     STD:
 *      +---------------------------------------(`CircuitBreaker`)-----------------------------------------------+
 *      |                                                                                                        |
 *      v                                                                                                        +
 *    Fused +---(`OutlierDetector`)---> HalfOpen +---(`LoadBalancer`)---> HalfClose +---(`CircuitBreaker`)---> Normal
 *      ^                                                                     +
 *      |                                                                     |
 *      +------------------------(`CircuitBreaker`)---------------------------+
 * ```
 */
export declare const enum InstanceStatus {
    /**
     * 正常
     */
    Normal = 0,
    /**
     * 半打开
     *
     * 各周期只选出极少次，负责探活
     */
    HalfOpen = 1,
    /**
     * 半关闭
     *
     * 不在任何模块中被选出，但计算调用结果
     */
    HalfClose = 2,
    /**
     * 熔断
     *
     * 不在任何模块中被选出
     */
    Fused = 3
}
/**
 * 实例
 */
export interface Instance {
    /**
     * 唯一 ID
     */
    readonly id: string;
    /**
     * vpc_id
     */
    vpcId: string;
    /**
     * IP 或 域名
     */
    host: string;
    /**
     * 端口号
     */
    port: number;
    /**
     * 协议信息
     */
    protocol: string;
    /**
     * 静态权重值, 0-1000
     */
    staticWeight: number;
    /**
     * 动态权重值
     */
    dynamicWeight: number;
    /**
     * 当前状态
     */
    status: InstanceStatus;
    /**
     * 元数据信息
     */
    metadata: Metadata;
    /**
     * 优先级
     */
    priority: number;
    /**
     * 版本号
     */
    version: string;
    /**
     * 逻辑区域
     */
    logicSet: string;
    /**
     * 地理位置
     */
    location: Location;
}
/**
 * 实例静态拷贝
 * @param from 源实例
 * @param to 目标实例
 */
export declare const instanceCopy: (from: Instance, to: Instance) => void;
/**
 * 判断实例是否可被选取
 * @param instance 实例
 * @returns 是否可选取
 */
export declare const isChoosableInstance: (instance: Instance) => boolean;
