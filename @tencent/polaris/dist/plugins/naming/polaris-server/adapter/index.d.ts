import type { ClientPoolOptions } from "../pool";
import { BaseAdapterOptions, PolarisBaseAdapter } from "./base";
import { DiscoverAdapterOptions, PolarisDiscoverAdapter } from "./discover";
import { MonitorAdapterOptions, PolarisMonitorAdapter } from "./monitor";
import { PolarisRatelimitAdapter, RatelimitAdapterOptions } from "./ratelimit";
export type { BaseAdapterOptions, DiscoverApi, MonitorApi, PolarisApi, PolarisBaseAdapter, PolarisClient, RatelimitApi, PolarisRequest, PolarisResponse } from "./base";
declare const kDefaultOptions: RatelimitAdapterOptions & MonitorAdapterOptions & DiscoverAdapterOptions;
export declare type ServerAdapterOptions = typeof kDefaultOptions & BaseAdapterOptions & ClientPoolOptions;
export interface PolarisServerAdapter extends PolarisDiscoverAdapter, PolarisMonitorAdapter, PolarisRatelimitAdapter {
}
export declare abstract class PolarisServerAdapter extends PolarisBaseAdapter {
    readonly type: number;
    protected readonly options: ServerAdapterOptions;
    constructor(remotes: readonly string[], options?: Partial<ServerAdapterOptions>);
}
