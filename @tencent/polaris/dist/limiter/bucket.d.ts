export interface InternalBucketOptions {
    /**
     * 令牌桶空闲回收，判定周期数
     */
    idlePeriod: number;
}
/**
 * 基础令牌桶
 * 桶内剩余可用令牌，不会增加
 */
export declare class BasicBucket {
    protected total: number;
    protected partition: number;
    private overflow;
    protected remains: number;
    protected capacity: number;
    constructor(total: number, partition: number, overflow?: boolean);
    get partitionTokens(): number;
    get remainingTokens(): number;
    setPartition(partition: number): void;
    consume(tokens: number, preroll: boolean): boolean;
    drain(): number;
    private recalculate;
}
/**
 * 内部令牌桶
 * 桶内剩余可用令牌，由内部新增
 */
export declare class InternalBucket extends BasicBucket {
    private duration;
    private options;
    private isAccessed;
    private idlePeriods;
    private period;
    private timer;
    private sleepTime?;
    constructor(total: number, partition: number, overflow: boolean | undefined, duration: number, options: InternalBucketOptions);
    get currentPeriod(): number;
    consume(tokens: number, preroll: boolean): boolean;
    private onWakUp;
    private wake;
    private sleep;
    private onTimeout;
}
/**
 * 外部令牌桶
 * 桶内剩余可用令牌，由外部调整
 */
export declare class ExternalBucket extends BasicBucket {
    update(value: number): void;
}
