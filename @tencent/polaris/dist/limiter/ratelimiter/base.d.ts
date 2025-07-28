import { BasicBucket } from "../bucket";
export declare const deduction: <T extends BasicBucket>(buckets: T[], tokens: number, preroll: boolean) => boolean;
export interface Ratelimiter {
    /**
     * 消费令牌
     * @param preroll 是否实际扣减
     */
    consume(preroll?: boolean): Promise<boolean>;
    /**
     * 放回令牌
     */
    return(): Promise<void>;
    /**
     * 获得当前分区数
     */
    getPartition(): Promise<number>;
}
