import { Instance } from "../../../../instance";
import { DataWithRevision, NamingServicePlugin, RegisterOptions, RegistrationInstance, ServiceRules } from "../../../../plugins";
import { BaseAdapterOptions, PolarisBaseAdapter } from "./base";
export interface DiscoverAdapterOptions extends BaseAdapterOptions {
    /**
     * 心跳上报后端服务名
     * __请勿随意修改此配置__
     */
    healthcheckService: string;
    /**
     * 隔离（过滤掉）不健康实例
     */
    isolateUnhealthy: boolean;
}
export declare abstract class PolarisDiscoverAdapter extends PolarisBaseAdapter implements NamingServicePlugin {
    protected readonly options: PolarisBaseAdapter["options"] & DiscoverAdapterOptions;
    private routingRuleProcessor?;
    list(namespace: string, service: string, revision?: string): Promise<DataWithRevision<Instance[]>>;
    routingRules(namespace: string, service: string, revision?: string): Promise<DataWithRevision<ServiceRules>>;
    register(namespace: string, service: string, token: string, instance: RegistrationInstance, options?: RegisterOptions): Promise<string>;
    unregister(id: string, token: string): Promise<boolean>;
    unregister(namespace: string, service: string, host: string, port: number, token: string): Promise<boolean>;
    heartbeat(id: string, token: string): Promise<boolean>;
    heartbeat(namespace: string, service: string, host: string, port: number, token: string): Promise<boolean>;
    private instanceTupleToRequest;
    private procInstances;
}
