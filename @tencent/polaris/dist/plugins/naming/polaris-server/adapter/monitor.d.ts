import { ApiStatKey, ApiStatValue, CacheStat, ComputedStat, StatusChangelog } from "../../../..";
import { StatReporterPlugin } from "../../../../plugins";
import { BaseAdapterOptions, PolarisBaseAdapter } from "./base";
export interface MonitorAdapterOptions extends BaseAdapterOptions {
    /**
     * 监控上报后端服务名
     * __请勿随意修改此配置__
     */
    monitorService: string;
    /**
     * 监控上报间隔
     */
    monitorInterval: number;
}
export declare abstract class PolarisMonitorAdapter extends PolarisBaseAdapter implements StatReporterPlugin {
    protected readonly options: PolarisBaseAdapter["options"] & MonitorAdapterOptions;
    private token?;
    private seq?;
    private timer;
    serviceStatistics(namespace: string, service: string, stat: ComputedStat): Promise<boolean>;
    registryCache(namespace: string, service: string, stat: CacheStat): Promise<boolean>;
    apiStatistics(key: ApiStatKey, value: ApiStatValue): Promise<boolean>;
    systemConfig(config: unknown, now?: number): Promise<boolean>;
    statusChangelog(namespace: string, service: string, stat: StatusChangelog): Promise<boolean>;
    private get SDKToken();
    private getSeq;
    private procRegistryChangelog;
}
