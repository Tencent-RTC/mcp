import { PolarisGRPCClient } from "./connector/grpc";
import { PolarisHTTPClient } from "./connector/http";
export * from "./connector/grpc";
export * from "./connector/http";
export * from "./types";
export { PolarisServerAdapter, ServerAdapterOptions, DiscoverApi, MonitorApi, RatelimitApi, PolarisApi, PolarisClient, PolarisRequest, PolarisResponse } from "./adapter";
export { kProtoPath } from "./utils";
export type { v1 as PolarisService, google } from "./discover-pb/types";
export type { v1 as MonitorService } from "./monitor-pb/types";
export type { v1 as RatelimitService } from "./ratelimit-pb/types";
/**
 * @description
 * Inheritance hierarchy:
 *  - |PolarisBaseAdapter|
 *    - |PolarisDiscoverAdapter| |PolarisMonitorAdapter| |PolarisRatelimitAdapter|
 *      - |PolarisServerAdapter|
 *        - |PolarisGRPCClient|
 *        - |PolarisHTTPClient|
 *
 * According to the current environment, automatically select suitable client as |PolarisServerClient|
 * Select Priority:
 *  |PolarisGRPCClient| --> |PolarisHTTPClient|
 */
export declare const PolarisServerClient: typeof PolarisGRPCClient | typeof PolarisHTTPClient;
/**
 * Is equal or inherit from |PolarisGRPCClient|
 */
export declare const isPolarisGRPCClient: (klass: {
    prototype: unknown;
}) => klass is typeof PolarisGRPCClient;
/**
 * Is equal or inherit from |PolarisHTTPClient|
 */
export declare const isPolarisHTTPClient: (klass: {
    prototype: unknown;
}) => klass is typeof PolarisHTTPClient;
