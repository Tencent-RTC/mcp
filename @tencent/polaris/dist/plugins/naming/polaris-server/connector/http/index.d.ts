/// <reference types="node" />
import { AxiosRequestConfig } from "axios";
import * as http from "http";
import type { BoxType, PolarisClient } from "../.."; /** only import type */
import { PolarisServerAdapter, ServerAdapterOptions } from "../../adapter";
import { ServiceType } from "../../types";
import { ProtobufFormat } from "../../utils";
declare const kDefaultOptions: {
    /**
     * 是否复用连接
     */
    keepAlive: boolean;
    /**
     * axios 配置项
     */
    axios: AxiosRequestConfig<any>;
};
export declare type PolarisHTTPClientOptions = typeof kDefaultOptions & ServerAdapterOptions;
export declare class PolarisHTTPClient extends PolarisServerAdapter {
    static readonly protocol = "http";
    static readonly port = 8080;
    readonly name = "PolarisHTTPClient";
    readonly protocol = "http";
    readonly format = ProtobufFormat.JSON;
    protected readonly options: PolarisHTTPClientOptions;
    private sequence;
    constructor(remotes: string[], options?: Partial<PolarisHTTPClientOptions>);
    box<T>(value: T): BoxType<T> | T | null | undefined;
    unbox<T>(value: BoxType<T> | T | null | undefined, defaultValue: T | (() => T)): T;
    /**
     * 获取 axios.AxiosRequestConfig 配置，可重载此方法实现差异化配置
     * @param address 远端地址
     * @param name 远端类型
     * @param httpAgent http.Agent
     */
    protected getRequestConfig(address: string, name: string, httpAgent: http.Agent): AxiosRequestConfig;
    protected buildClient<T extends PolarisClient>(address: string, type: ServiceType): T;
}
export {};
