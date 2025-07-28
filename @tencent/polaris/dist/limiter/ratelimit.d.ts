import { GlobalOptions } from "../global";
import { Logger } from "../logging";
import { Metadata } from "../metadata";
import { RatelimitServicePlugin, TrafficShapingPlugin } from "../plugins";
import { LocalRegistry } from "../registry";
import { RatelimitRule } from "../rules";
import { GlobalRatelimiterOptions, LocalRatelimiterOptions } from "./ratelimiter";
declare const kDefaultOptions: LocalRatelimiterOptions | GlobalRatelimiterOptions;
export declare type RatelimitOptions = typeof kDefaultOptions;
export declare type Quota = Promise<(() => Promise<void>) | void>;
export declare class Ratelimit {
    private readonly global;
    private readonly logger;
    private readonly registry;
    private readonly ratelimit;
    private readonly shaping;
    private readonly limiters;
    private readonly options;
    private disposed;
    constructor(global: GlobalOptions, logger: Logger, registry: LocalRegistry, ratelimit: RatelimitServicePlugin, shaping: TrafficShapingPlugin[], options?: Partial<RatelimitOptions>);
    dispose(): void;
    query(namespace: string, service: string, cluster: string | undefined, labels: Metadata, id?: string): Promise<RatelimitRule | undefined>;
    acquire(namespace: string, service: string, amount: number, rule?: RatelimitRule): Quota[];
    private allocation;
    private produce;
}
export {};
