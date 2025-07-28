import { QuotaConfig, RatelimitRule } from "../../../..";
import { DataWithRevision, RatelimitServicePlugin } from "../../../../plugins";
import { BaseAdapterOptions, PolarisBaseAdapter } from "./base";
export interface RatelimitAdapterOptions extends BaseAdapterOptions {
    /**
     * 流量控制后端服务名
     * __请勿随意修改此配置__
     */
    ratelimitService: string;
}
export declare abstract class PolarisRatelimitAdapter extends PolarisBaseAdapter implements RatelimitServicePlugin {
    protected readonly options: PolarisBaseAdapter["options"] & RatelimitAdapterOptions;
    private ratelimitRuleProcessor?;
    private ratelimitInfo?;
    ratelimitRules(namespace: string, service: string, revision?: string): Promise<DataWithRevision<RatelimitRule[]>>;
    acquireQuota(namespace: string, service: string, rule: RatelimitRule, used: QuotaConfig[]): Promise<QuotaConfig[]>;
    private procRatelimitRule;
    private amountToLimiter;
}
