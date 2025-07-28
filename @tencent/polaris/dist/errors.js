"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.ServerException = exports.InvalidResponse = exports.RouteRuleNotMatch = exports.InstanceNotFound = exports.InvalidRouteRule = exports.LocationNotFound = exports.ServiceNotFound = exports.InvalidInstance = exports.CircuitBreakerError = exports.NetworkError = exports.ServerError = exports.StateError = exports.TimeoutError = exports.PluginError = exports.ConfigError = exports.ArgumentError = exports.FatalError = exports.PrimordialsError = exports.isPolarisError = exports.kErrorCode = exports.ErrorCodes = void 0;
const assert_1 = require("assert");
const util_1 = require("util");
var ErrorCodes;
(function (ErrorCodes) {
    /** 接口参数错误 */
    ErrorCodes["InvalidArgument"] = "ErrCodeAPIInvalidArgument";
    /** 配置参数校验失败 */
    ErrorCodes["InvalidConfig"] = "ErrCodeAPIInvalidConfig";
    /** 插件调用异常 */
    ErrorCodes["PluginError"] = "ErrCodePluginError";
    /** 调用超时 */
    ErrorCodes["TimeoutError"] = "ErrCodeAPITimeoutError";
    /** 状态错误 */
    ErrorCodes["StateError"] = "ErrCodeInvalidStateError";
    /** 后端服务错误 */
    ErrorCodes["ServerError"] = "ErrCodeServerError";
    /** 网络异常 */
    ErrorCodes["NetworkError"] = "ErrCodeNetworkError";
    /** 服务熔断发生错误 */
    ErrorCodes["CircuitBreakerError"] = "ErrCodeCircuitBreakerError";
    /** 实例信息不合法 */
    ErrorCodes["InvalidInstance"] = "ErrCodeInstanceInfoError";
    /** 负载均衡、服务路由时，传入的服务没有实例信息 */
    ErrorCodes["InstanceNotFound"] = "ErrCodeAPIInstanceNotFound";
    /** 路由规则不合法 */
    ErrorCodes["InvalidRouteRule"] = "ErrCodeInvalidRouteRule";
    /** 路由规则无法匹配 */
    ErrorCodes["RouteRuleNotMatch"] = "ErrCodeRouteRuleNotMatch";
    /** 后端返回无效 */
    ErrorCodes["InvalidResponse"] = "ErrCodeInvalidResponse";
    /** 内部错误 */
    ErrorCodes["InternalError"] = "ErrCodeInternalError";
    /** 服务不存在 */
    ErrorCodes["ServiceNotFound"] = "ErrCodeServiceNotFound";
    /** 后端服务异常 */
    ErrorCodes["ServerException"] = "ErrCodeServerException";
    /** 获取位置信息失败 */
    ErrorCodes["LocationNotFound"] = "ErrCodeLocationNotFound";
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
exports.kErrorCode = Symbol("kErrorCode");
const defineProperties = (err, code) => Object.defineProperties(err, {
    [exports.kErrorCode]: {
        get() {
            return code;
        }
    },
    [util_1.inspect.custom]: {
        value(recurseTimes, ctx) {
            return (0, util_1.inspect)(this, Object.assign(Object.assign({}, ctx), { getters: true, customInspect: false }));
        },
        writable: false,
        configurable: false,
        enumerable: false
    },
    [Symbol.toStringTag]: {
        value() {
            return `${this.name} [${this[exports.kErrorCode]}]: ${this.message}`;
        },
        writable: false,
        configurable: false,
        enumerable: false
    }
});
const addCodeToName = (err, code) => {
    err.name = `${err.name} [${code}]`;
    /** 访问 `stack` 属性，强制其生成的错误消息 */
    const _ = err.stack; // eslint-disable-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
    /** 重置 `name` 为真实值 */
    delete err.name;
};
exports.isPolarisError = ((err) => Object.prototype.hasOwnProperty.call(err, exports.kErrorCode));
const makePolarisError = (code, BaseError) => (class extends BaseError {
    constructor(arg) {
        if (arg instanceof Error) {
            if ((0, exports.isPolarisError)(arg)) {
                return arg;
            }
            return defineProperties(arg, code);
        }
        super(arg);
        defineProperties(this, code);
        addCodeToName(this, code);
    }
});
/** Node.js internal primordials Error */
exports.PrimordialsError = Reflect.getPrototypeOf(assert_1.AssertionError);
class FatalError extends assert_1.AssertionError {
    constructor(message, fn) {
        super({
            message,
            stackStartFn: fn || FatalError,
            stackStartFunction: fn || FatalError // 兼容老版本的 Node.js
        });
    }
    get [exports.kErrorCode]() {
        return ErrorCodes.InternalError;
    }
}
exports.FatalError = FatalError;
class ArgumentError extends makePolarisError(ErrorCodes.InvalidArgument, TypeError) {
}
exports.ArgumentError = ArgumentError;
class ConfigError extends makePolarisError(ErrorCodes.InvalidConfig, TypeError) {
}
exports.ConfigError = ConfigError;
class PluginError extends makePolarisError(ErrorCodes.PluginError, Error) {
}
exports.PluginError = PluginError;
class TimeoutError extends makePolarisError(ErrorCodes.TimeoutError, Error) {
}
exports.TimeoutError = TimeoutError;
class StateError extends makePolarisError(ErrorCodes.StateError, Error) {
}
exports.StateError = StateError;
class ServerError extends makePolarisError(ErrorCodes.ServerError, Error) {
}
exports.ServerError = ServerError;
class NetworkError extends makePolarisError(ErrorCodes.NetworkError, Error) {
}
exports.NetworkError = NetworkError;
class CircuitBreakerError extends makePolarisError(ErrorCodes.CircuitBreakerError, Error) {
}
exports.CircuitBreakerError = CircuitBreakerError;
class InvalidInstance extends makePolarisError(ErrorCodes.InvalidInstance, TypeError) {
}
exports.InvalidInstance = InvalidInstance;
class ServiceNotFound extends makePolarisError(ErrorCodes.ServiceNotFound, Error) {
}
exports.ServiceNotFound = ServiceNotFound;
class LocationNotFound extends makePolarisError(ErrorCodes.LocationNotFound, Error) {
}
exports.LocationNotFound = LocationNotFound;
class InvalidRouteRule extends makePolarisError(ErrorCodes.InvalidRouteRule, Error) {
}
exports.InvalidRouteRule = InvalidRouteRule;
class InstanceNotFound extends makePolarisError(ErrorCodes.InstanceNotFound, Error) {
}
exports.InstanceNotFound = InstanceNotFound;
class RouteRuleNotMatch extends makePolarisError(ErrorCodes.RouteRuleNotMatch, Error) {
}
exports.RouteRuleNotMatch = RouteRuleNotMatch;
class InvalidResponse extends makePolarisError(ErrorCodes.InvalidResponse, Error) {
}
exports.InvalidResponse = InvalidResponse;
class ServerException extends makePolarisError(ErrorCodes.ServerException, Error) {
}
exports.ServerException = ServerException;
class InternalError extends makePolarisError(ErrorCodes.InternalError, Error) {
}
exports.InternalError = InternalError;
//# sourceMappingURL=errors.js.map