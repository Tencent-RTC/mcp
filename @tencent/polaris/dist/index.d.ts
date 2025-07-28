import { Consumer as PolarisMeshConsumer, OptionalConsumerPluginList, ConsumerOptions, Provider as PolarisMeshProvider, OptionalProviderPluginList, ProviderOptions, Limiter as PolarisMeshLimiter, OptionalLimiterPluginList, LimiterOptions, PolarisGRPCClient as PolarisMeshGRPCClient, PolarisHTTPClient as PolarisMeshHTTPClient, PolarisHTTPClientOptions } from "./polaris";
export * from "./polaris";
export declare const getEmbeddedDiscoverHosts: (port?: number | undefined) => string[];
export declare class PolarisHTTPClient extends PolarisMeshHTTPClient {
    constructor(remotes?: string[], options?: Partial<PolarisHTTPClientOptions>);
    /**
     * HTTP 后端默认没有部署上报模块，故移除相关实现
     * @returns always `false`
     */
    serviceStatistics(): Promise<boolean>;
    /**
     * HTTP 后端默认没有部署上报模块，故移除相关实现
     * @returns always `false`
     */
    registryCache(): Promise<boolean>;
    /**
     * HTTP 后端默认没有部署上报模块，故移除相关实现
     * @returns always `false`
     */
    apiStatistics(): Promise<boolean>;
    /**
     * HTTP 后端默认没有部署上报模块，故移除相关实现
     * @returns always `false`
     */
    systemConfig(): Promise<boolean>;
    /**
     * HTTP 后端默认没有部署上报模块，故移除相关实现
     * @returns always `false`
     */
    statusChangelog(): Promise<boolean>;
}
export declare class PolarisGRPCClient extends PolarisMeshGRPCClient {
    constructor(remotes?: string[], options?: ConstructorParameters<typeof PolarisMeshGRPCClient>[1]);
}
export declare const PolarisServerClient: typeof PolarisHTTPClient | typeof PolarisGRPCClient;
export declare type ConsumerPluginList = Required<OptionalConsumerPluginList>;
export declare class Consumer extends PolarisMeshConsumer {
    /**
     * Create Consumer
     * @param plugins 插件（可选）
     * @param options 配置参数（可选）
     */
    constructor(plugins?: Partial<ConsumerPluginList>, options?: Partial<ConsumerOptions>);
}
export declare type ProviderPluginList = Required<OptionalProviderPluginList>;
export declare class Provider extends PolarisMeshProvider {
    /**
     * Create Provider
     * @param plugins 插件（可选）
     * @param options 配置参数（可选）
     */
    constructor(plugins?: Partial<ProviderPluginList>, options?: Partial<ProviderOptions>);
}
export declare type LimiterPluginList = Required<OptionalLimiterPluginList>;
export declare class Limiter extends PolarisMeshLimiter {
    /**
     * Create Limiter
     * @param plugins 插件（可选）
     * @param options 配置参数（可选）
     */
    constructor(plugins?: Partial<LimiterPluginList>, options?: Partial<LimiterOptions>);
}
