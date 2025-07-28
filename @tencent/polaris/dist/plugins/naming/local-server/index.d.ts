import { Instance } from "../../../instance";
import { Location } from "../../../location";
import { DataWithRevision, NamingServicePlugin, OperatingMode, PluginType, ServiceRules } from "../../../plugins";
export declare type DatabaseType = Partial<Record<string, {
    instances?: DataWithRevision<Instance[]>;
    rules?: DataWithRevision<ServiceRules>;
}>>;
export declare class LocalServerClient implements NamingServicePlugin {
    private database;
    location?: Location | undefined;
    readonly type = PluginType.NamingService;
    readonly name = "LocalServerClient";
    readonly mode = OperatingMode.Internal;
    constructor(database?: Partial<Record<string, {
        instances?: {
            data: Instance[];
            revision: string;
        } | undefined;
        rules?: {
            data: ServiceRules;
            revision: string;
        } | undefined;
    }>>, location?: Location | undefined);
    setInstances(namespace: string, service: string, instances: DataWithRevision<Instance[]>): void;
    setRules(namespace: string, service: string, rules: DataWithRevision<ServiceRules>): void;
    list(namespace: string, service: string, revision?: string): Promise<DataWithRevision<Instance[]>>;
    routingRules(namespace: string, service: string, revision?: string): Promise<DataWithRevision<ServiceRules>>;
    register(): Promise<string>;
    unregister(): Promise<boolean>;
    heartbeat(): Promise<boolean>;
    private getService;
}
