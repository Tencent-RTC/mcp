import { RatelimitRule } from "../../rules";
import { InternalBucketOptions } from "../bucket";
import { Ratelimiter } from "./base";
export declare type LocalRatelimiterOptions = InternalBucketOptions;
/**
 * 本地限流
 * 对应 `LimitType.Local`
 */
export declare class LocalRatelimiter implements Ratelimiter {
    private readonly options;
    private readonly buckets;
    private readonly indexes;
    constructor(rule: RatelimitRule, options: LocalRatelimiterOptions);
    consume(preroll?: boolean): Promise<boolean>;
    return(): Promise<void>;
    getPartition(): Promise<number>;
}
