import { Instance, InstanceStatus } from "../../..";
import type * as PolarisTypes from "./discover-pb/types";
import type * as MonitorTypes from "./monitor-pb/types";
import { DeconstructorWrappers, ServiceInfo, StatusChange } from "./types";
export interface EndPoint {
    host: string;
    port: number;
}
export interface LocalRemotePair {
    local: EndPoint;
    remote: EndPoint;
}
/**
 * 转换为可读地址
 * @param inputs `EndPoint` 类型地址
 */
export declare const inspectEndpoints: (inputs: EndPoint[]) => string;
/**
 * 判断端口号是否合法
 * @param input 端口号
 */
export declare const isValidPort: (input: number) => boolean;
/**
 * 地址类型转换
 * `string` ---> `EndPoint`
 * @param input `string` 类型地址
 * @returns `EndPoint` 类型地址
 */
export declare function address2Endpoint(input: string): EndPoint;
/**
 * 探测连接速度最快的远端节点
 * @param hosts 待探测远端节点列表
 * @param ms 最长探测时长
 * @returns 最快响应远端及其对应的本地节点 IP
 */
export declare function fastestRemote(hosts: EndPoint[] | string[], ms?: number): Promise<LocalRemotePair>;
/**
 * 判断特定 IP(4/6) 是否为任意地址 `INADDR_ANY`
 * @param ip IP 地址
 * @returns 判定结果
 */
export declare const isAnyAddr: (ip: string) => boolean;
/**
 * `protobuf` 时间类型
 */
declare type ProtobufTime = MonitorTypes.google.protobuf.ITimestamp | PolarisTypes.google.protobuf.IDuration;
/**
 * 毫秒转 `protobuf` 时间格式
 * @param ms 毫秒
 */
export declare function ms2protobuf(ms: number, format?: ProtobufFormat.Original): DeconstructorWrappers<ProtobufTime>;
/**
 * 毫秒转 `protobuf` 时间格式
 * @param ms 毫秒
 * @param format 时间格式
 */
export declare function ms2protobuf(ms: number, format: ProtobufFormat.JSON): string;
/**
 * 毫秒转 `protobuf` 时间格式
 * @param ms 毫秒
 * @param format 时间格式
 */
export declare function ms2protobuf(ms: number, format: ProtobufFormat): DeconstructorWrappers<ProtobufTime> | string;
/**
 * `protobuf` 时间格式转毫秒
 * @param time `protobuf` 时间格式
 */
export declare function protobuf2ms(time: string | DeconstructorWrappers<ProtobufTime>): number;
/**
 * 转换实例状态至熔断器变更类型
 * @description `StatusChange` 为熔断器变更类型而非实例的状态，_也就是说，这里所需输出的状态与实例状态相反_
 * @param before 前一状态
 * @param after 下一状态
 */
export declare const transformStatusChange: (before: InstanceStatus, after: InstanceStatus) => StatusChange;
/**
 * 本地实例版本号
 */
export declare const kInstanceLocalVersion = "local";
/**
 * 通过地址列表生成对应实例列表
 * @param input 地址列表
 * @param protocol 协议
 */
export declare const address2Instance: (input: readonly string[], protocol: string) => Instance[];
/**
 * `protobuf` 编码格式
 */
export declare enum ProtobufFormat {
    /** 原始格式 */
    Original = 0,
    /** JSON 格式 */
    JSON = 1
}
/**
 * Proto definition directory
 */
export declare const kProtoPath: ServiceInfo<string, string, string>;
export {};
