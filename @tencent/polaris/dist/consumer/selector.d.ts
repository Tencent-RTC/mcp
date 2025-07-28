import { GlobalOptions } from "../global";
import { Instance } from "../instance";
import { Logger } from "../logging";
import { LoadBalancerPlugin, NamingServicePlugin, PluginType, ServiceRouterPlugin, ServiceRules } from "../plugins";
import { LocalRegistry } from "../registry";
import { Service } from "../service";
import { Health } from "./health";
declare const kDefaultOptions: {
    /**
     * 探活任务最大探测次数
     */
    maxProbes: number;
    /**
     * 是否启用全死全活，当节点全部不健康时，是否返回
     */
    enableRecover: boolean;
};
export declare type SelectorOptions = typeof kDefaultOptions;
export declare type CombinatedArgs<T = unknown> = Record<string, T>;
export interface CallArgsType<ServiceRouterArgs extends CombinatedArgs, LoadBalancerArgs> {
    [PluginType.ServiceRouter]?: ServiceRouterArgs;
    [PluginType.LoadBalancer]?: LoadBalancerArgs;
}
export interface Selector {
    select<ServiceRouterArgs extends CombinatedArgs, LoadBalancerArgs>(callee: Service, caller?: Service, args?: CallArgsType<ServiceRouterArgs, LoadBalancerArgs>): Promise<Instance | null>;
    list(namespace: string, service: string): Promise<Instance[]>;
    rules(namespace: string, service: string): Promise<ServiceRules>;
    dispose?(): void;
}
/**
 * @description
 * 实例选取规则：
 *  in ---> [Router Chain] ---> out
 */
export declare class InternalSelector implements Selector {
    private readonly global;
    private readonly logger;
    private readonly health;
    private readonly registry;
    private readonly routers;
    private readonly lb;
    private readonly fuseStat;
    private readonly options;
    private readonly requisite;
    private disposed;
    constructor(global: GlobalOptions, logger: Logger, health: Health, registry: LocalRegistry, routers: ServiceRouterPlugin[], lb: LoadBalancerPlugin, options?: Partial<SelectorOptions>);
    dispose(): void;
    select<ServiceRouterArgs extends CombinatedArgs, LoadBalancerArgs>(callee: Service, caller?: Service, args?: CallArgsType<ServiceRouterArgs, LoadBalancerArgs>): Promise<Instance | null>;
    list(namespace: string, service: string): Promise<Instance[]>;
    rules(namespace: string, service: string): Promise<ServiceRules>;
    private executor;
    /**
     * ```
     *                +-------------------------+
     *                |                         |
     * ... [+----+---->  Service Router Plugin  +----+---->] ... <routing chain> ...
     *           |    |                         |    |
     *           |    +-------------------------+    |
     *           |                                   |
     *           +-----------------------------------+
     * ```
     */
    private routing;
    private choose;
}
export declare class ExternalSelector implements Selector {
    private readonly naming;
    constructor(naming: NamingServicePlugin);
    select(callee: Service): Promise<Instance | null>;
    list(namespace: string, service: string): Promise<Instance[]>;
    rules(namespace: string, service: string): Promise<ServiceRules>;
}
export {};
