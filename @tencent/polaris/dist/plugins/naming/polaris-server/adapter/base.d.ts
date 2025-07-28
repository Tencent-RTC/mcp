import { Logger, InternalConsumer, SelectResponse } from "../../../..";
import { Location } from "../../../../location";
import { NamingServicePlugin, OperatingMode, PluginType } from "../../../../plugins";
import { RemoveNever } from "../../../../utils";
import type { Boxable, BoxType, DeconstructorWrappers, MonitorService, PolarisService, RatelimitService } from "..";
import { ClientPool, ClientPoolOptions, ClosableClient } from "../pool";
import { ServiceType } from "../types";
import { EndPoint, ProtobufFormat } from "../utils";
export interface BaseAdapterOptions {
    /**
     * 北极星后端节点连通性探测，最长超时时间
     * 单位 ms
     */
    detectionTimeout: number;
    /**
     * 北极星后端节点切换时长
     * 单位 ms
     */
    switchDuration: number;
    /**
     * 北极星后端命名空间
     * __请勿随意修改此配置__
     */
    polarisNamespace: string;
    /**
     * 服务发现后端服务名
     * __请勿随意修改此配置__
     */
    discoverService: string;
    /**
     * 预置实例上报后缀名
     * __请勿随意修改此配置__
     */
    presetSuffix: string;
    /**
     * 预置实例是否仅用于引导启动
     * __请勿随意修改此配置__
     */
    bootstrapOnly: boolean;
}
declare type ExtractServiceAPI<Service> = RemoveNever<{
    [P in keyof Service]: Service[P] extends (request: infer U) => Promise<infer K> ? K extends unknown ? U extends unknown ? (request: DeconstructorWrappers<U>) => Promise<DeconstructorWrappers<K>> : never : never : never;
}>;
export declare type DiscoverApi = ExtractServiceAPI<PolarisService.ServerAPI>;
export declare type MonitorApi = ExtractServiceAPI<MonitorService.MonitorApi>;
export declare type RatelimitApi = ExtractServiceAPI<RatelimitService.RateLimitAPI>;
export declare type PolarisApi = DiscoverApi & MonitorApi & RatelimitApi;
export declare type PolarisClient = PolarisApi & ClosableClient;
export declare type PolarisResponse = Awaited<ReturnType<PolarisApi[keyof PolarisApi]>>;
export declare type PolarisRequest = Awaited<ReturnType<PolarisApi[keyof PolarisApi]>>;
/**
 * 显式声明 `PolarisBaseAdapter` 扩展于 `NamingServicePlugin`，
 * 以便于共享当前插件实例
 */
export interface PolarisBaseAdapter extends NamingServicePlugin, Boxable {
}
/**
 * 由于 class ... implements ... 中 class 必须要实现 implements 中的接口，
 * 并且 `Mixin` 方法无法组合（继承）类型，故在此仅实现 `Boxable` 接口
 */
export declare abstract class PolarisBaseAdapter implements Boxable {
    private readonly remotes;
    readonly mode = OperatingMode.Internal;
    protected logger: Logger;
    protected readonly options: BaseAdapterOptions & ClientPoolOptions;
    protected readonly pool: ClientPool<PolarisClient>;
    protected stickyConsumer?: InternalConsumer;
    protected local?: EndPoint;
    protected disposeFuncs: Record<string, () => void>;
    protected disposed: boolean;
    protected initializeStatus: {
        promise: Promise<unknown> | null;
        initialized: boolean; /** fast case */
    };
    private mainConsumer?;
    private localRegistry?;
    private loc;
    readonly abstract type: PluginType;
    readonly abstract name: string;
    protected abstract readonly protocol: string;
    protected abstract readonly format: ProtobufFormat;
    constructor(remotes: readonly string[]);
    setLogger(logger: Logger): void;
    get location(): Location;
    dispose(): Promise<void>;
    get isDisposed(): boolean;
    /**
     * 由于 `stickyConsumer` 仅用于少数调用，
     * 故在一般情况下（如：仅使用 Consumer 时）不会被调用，
     * 在这里做延迟初始化以节省内存开销
     */
    protected buildStickyConsumer(): InternalConsumer;
    protected selectBackend(consumer: InternalConsumer, service: string, key?: string): Promise<SelectResponse>;
    /**
     * 此函数签名用于调用
     */
    protected requestBackend<MethodName extends keyof PolarisApi>(type: ServiceType, service: string, method: MethodName, payload: Parameters<PolarisApi[MethodName]>[0], key?: string): Promise<Awaited<ReturnType<PolarisApi[MethodName]>>>;
    /**
     * 追踪后端调用结果
     * @param transaction 追踪 ID
     * @param method 调用函数名
     * @param response 后端响应
     */
    protected tracingResponse(transaction: string, method: string, response: PolarisResponse): void;
    /**
     * 判断后端调用是否成功（不成功则抛出异常）
     * @param response 后端响应
     * @param namespace 命名空间
     * @param service 服务名
     */
    protected maybeErrorResponse(response: PolarisResponse, namespace: string, service: string): void;
    /**
     * 判断后端调用是否成功
     * @param response 后端响应
     * @param level 比较级别（默认为 `kErrorLevel`）
     */
    protected isSuccessResponse(response: PolarisResponse, level?: number): boolean;
    protected waitForInitialized(): Promise<void>;
    private bootstrap;
    abstract unbox<T>(value: BoxType<T> | T | null | undefined, defaultValue: T | (() => T)): T;
    abstract box<T>(value: T): BoxType<T> | T | null | undefined;
    protected abstract buildClient<T extends PolarisClient>(address: string, type: ServiceType): T;
}
export {};
