"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deduction = void 0;
const deduction = (buckets, tokens, preroll) => {
    const isEnough = tokens > 0 ? buckets.every(bucket => bucket.consume(tokens, true)) : true;
    if (!isEnough || preroll) {
        return isEnough;
    }
    buckets.forEach((bucket) => {
        bucket.consume(tokens, false);
    });
    return true;
};
exports.deduction = deduction;
//# sourceMappingURL=base.js.map