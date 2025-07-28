"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalRatelimiter = void 0;
const errors_1 = require("../../errors");
const rules_1 = require("../../rules");
const utils_1 = require("../../utils");
const bucket_1 = require("../bucket");
const base_1 = require("./base");
/**
 * 本地限流
 * 对应 `LimitType.Local`
 */
class LocalRatelimiter {
    constructor(rule, options) {
        this.options = options;
        this.buckets = Object.create(null);
        this.indexes = [];
        let Bucket; // eslint-disable-line @typescript-eslint/naming-convention
        switch (rule.resource) {
            case rules_1.LimitResource.Concurrency: {
                Bucket = bucket_1.BasicBucket;
                break;
            }
            case rules_1.LimitResource.QPS: {
                Bucket = bucket_1.InternalBucket;
                break;
            }
            default: {
                (0, utils_1.UNREACHABLE)();
            }
        }
        if (rule.amounts.length === 0) {
            throw new errors_1.ArgumentError("no valid |QuotaConfig|");
        }
        rule.amounts.forEach(({ amount, duration }) => {
            const bucket = new Bucket(amount, 1, false, duration, this.options);
            this.buckets[duration] = bucket;
            this.indexes.push(bucket);
        });
    }
    async consume(preroll = false) {
        return (0, base_1.deduction)(this.indexes, 1, preroll);
    }
    async return() {
        (0, base_1.deduction)(this.indexes, -1, false);
    }
    async getPartition() {
        return 1;
    }
}
exports.LocalRatelimiter = LocalRatelimiter;
//# sourceMappingURL=local.js.map