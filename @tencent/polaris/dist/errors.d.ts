/// <reference types="node" />
import { AssertionError } from "assert";
export declare enum ErrorCodes {
    /** 接口参数错误 */
    InvalidArgument = "ErrCodeAPIInvalidArgument",
    /** 配置参数校验失败 */
    InvalidConfig = "ErrCodeAPIInvalidConfig",
    /** 插件调用异常 */
    PluginError = "ErrCodePluginError",
    /** 调用超时 */
    TimeoutError = "ErrCodeAPITimeoutError",
    /** 状态错误 */
    StateError = "ErrCodeInvalidStateError",
    /** 后端服务错误 */
    ServerError = "ErrCodeServerError",
    /** 网络异常 */
    NetworkError = "ErrCodeNetworkError",
    /** 服务熔断发生错误 */
    CircuitBreakerError = "ErrCodeCircuitBreakerError",
    /** 实例信息不合法 */
    InvalidInstance = "ErrCodeInstanceInfoError",
    /** 负载均衡、服务路由时，传入的服务没有实例信息 */
    InstanceNotFound = "ErrCodeAPIInstanceNotFound",
    /** 路由规则不合法 */
    InvalidRouteRule = "ErrCodeInvalidRouteRule",
    /** 路由规则无法匹配 */
    RouteRuleNotMatch = "ErrCodeRouteRuleNotMatch",
    /** 后端返回无效 */
    InvalidResponse = "ErrCodeInvalidResponse",
    /** 内部错误 */
    InternalError = "ErrCodeInternalError",
    /** 服务不存在 */
    ServiceNotFound = "ErrCodeServiceNotFound",
    /** 后端服务异常 */
    ServerException = "ErrCodeServerException",
    /** 获取位置信息失败 */
    LocationNotFound = "ErrCodeLocationNotFound"
}
export declare const kErrorCode: unique symbol;
export interface PolarisError extends Error {
    readonly [kErrorCode]: ErrorCodes;
}
export declare const isPolarisError: (err: unknown) => err is PolarisError;
/** Node.js internal primordials Error */
export declare const PrimordialsError: ErrorConstructor;
export declare class FatalError extends AssertionError implements PolarisError {
    constructor(message: string, fn?: CallableFunction);
    get [kErrorCode](): ErrorCodes;
}
declare const ArgumentError_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class ArgumentError extends ArgumentError_base {
}
declare const ConfigError_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class ConfigError extends ConfigError_base {
}
declare const PluginError_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class PluginError extends PluginError_base {
}
declare const TimeoutError_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class TimeoutError extends TimeoutError_base {
}
declare const StateError_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class StateError extends StateError_base {
}
declare const ServerError_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class ServerError extends ServerError_base {
}
declare const NetworkError_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class NetworkError extends NetworkError_base {
}
declare const CircuitBreakerError_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class CircuitBreakerError extends CircuitBreakerError_base {
}
declare const InvalidInstance_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class InvalidInstance extends InvalidInstance_base {
}
declare const ServiceNotFound_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class ServiceNotFound extends ServiceNotFound_base {
}
declare const LocationNotFound_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class LocationNotFound extends LocationNotFound_base {
}
declare const InvalidRouteRule_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class InvalidRouteRule extends InvalidRouteRule_base {
}
declare const InstanceNotFound_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class InstanceNotFound extends InstanceNotFound_base {
}
declare const RouteRuleNotMatch_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class RouteRuleNotMatch extends RouteRuleNotMatch_base {
}
declare const InvalidResponse_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class InvalidResponse extends InvalidResponse_base {
}
declare const ServerException_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class ServerException extends ServerException_base {
}
declare const InternalError_base: {
    new (err?: Error | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    new (message?: string | undefined): {
        [kErrorCode]: ErrorCodes;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare class InternalError extends InternalError_base {
}
export {};
