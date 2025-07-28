import type * as grpc from "@grpc/grpc-js"; /** only import type */
import { PartialSubset } from "../../../../../utils";
import type { BoxType, PolarisClient } from "../.."; /** only import type */
import { PolarisServerAdapter, ServerAdapterOptions } from "../../adapter";
import { ServiceType } from "../../types";
import { ProtobufFormat } from "../../utils";
declare type ServiceClientCtor = ReturnType<typeof grpc.makeClientConstructor>;
declare const kDefaultOptions: {
    /**
     * 调用超时时间
     */
    timeout: number;
    /**
     * gRPC 配置项
     */
    grpc: {
        /**
         * gRPC CallOptions 配置项
         */
        call: Partial<Omit<grpc.CallOptions, "deadline">>;
        /**
         * gRPC ChannelOptions 配置项
         */
        channel: Partial<Partial<grpc.ChannelOptions>>;
    };
};
export declare type PolarisGRPCClientOptions = typeof kDefaultOptions & ServerAdapterOptions;
export declare class PolarisGRPCClient extends PolarisServerAdapter {
    static readonly protocol = "grpc";
    static readonly port = 8081;
    static isSupported(): boolean;
    readonly name = "PolarisGRPCClient";
    readonly protocol = "grpc";
    readonly format = ProtobufFormat.Original;
    protected readonly options: PolarisGRPCClientOptions;
    private readonly clientConstructor;
    constructor(remotes: string[], options?: Partial<PartialSubset<PolarisGRPCClientOptions, "grpc">>);
    box<T>(value: T): BoxType<T> | T | null | undefined;
    unbox<T>(value: BoxType<T> | T | null | undefined, defaultValue: T | (() => T)): T;
    /**
     * 实例化 Service Client，可重载此方法实现差异化配置
     * @param address 远端地址
     * @param type 远端类型
     * @param ServiceClient Service Client Class，函数必须返回它的实例
     * @param credentials grpc.credentials
     */
    protected instantiateServiceClient(address: string, type: ServiceType, ServiceClient: ServiceClientCtor, credentials: typeof grpc.credentials): InstanceType<ServiceClientCtor>;
    /**
     * 获取 grpc.CallOptions 配置，可重载此方法实现差异化配置
     * @param address 远端地址
     * @param method 方法名
     * @param streaming 是否为 Bidi Stream
     */
    protected getCallOptions(address: string, method: string, streaming: boolean): grpc.CallOptions;
    protected buildClient<T extends PolarisClient>(address: string, type: ServiceType): T;
    private requestKeyGenerator;
    private responseKeyGenerator;
    private keyGenerator;
}
export {};
