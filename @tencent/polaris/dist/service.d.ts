import { Metadata } from "./metadata";
/**
 * 服务信息
 */
export interface Service {
    /**
     * 命名空间
     */
    namespace: string;
    /**
     * 服务名
     */
    service: string;
    /**
     * 元数据信息
     */
    metadata?: Metadata;
}
