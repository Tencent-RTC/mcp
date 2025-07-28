"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitType = exports.LimitResource = void 0;
/**
 * 限流资源
 */
var LimitResource;
(function (LimitResource) {
    /** 针对 QPS 进行限流 */
    LimitResource[LimitResource["QPS"] = 0] = "QPS";
    /** 针对并发数进行限流 */
    LimitResource[LimitResource["Concurrency"] = 1] = "Concurrency";
})(LimitResource = exports.LimitResource || (exports.LimitResource = {}));
/**
 * 限流模式
 */
var LimitType;
(function (LimitType) {
    /** 全局限流 */
    LimitType[LimitType["Global"] = 0] = "Global";
    /** 本地限流 */
    LimitType[LimitType["Local"] = 1] = "Local";
})(LimitType = exports.LimitType || (exports.LimitType = {}));
//# sourceMappingURL=rules.js.map