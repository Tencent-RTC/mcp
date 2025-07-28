"use strict";
/* eslint-disable max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatingMode = exports.HealthCheckType = exports.RegistryCategory = exports.RequisiteBitfield = exports.RoutingAction = exports.RoutingCondition = exports.PluginType = void 0;
/**
 * 插件类型
 */
var PluginType;
(function (PluginType) {
    /** 服务发现 */
    PluginType[PluginType["NamingService"] = 1] = "NamingService";
    /** 本地名字服务 */
    PluginType[PluginType["LocalRegistry"] = 2] = "LocalRegistry";
    /** 服务路由 */
    PluginType[PluginType["ServiceRouter"] = 4] = "ServiceRouter";
    /** 负载均衡 */
    PluginType[PluginType["LoadBalancer"] = 8] = "LoadBalancer";
    /** 健康探测 */
    PluginType[PluginType["OutlierDetector"] = 16] = "OutlierDetector";
    /** 节点熔断 */
    PluginType[PluginType["CircuitBreaker"] = 32] = "CircuitBreaker";
    /** 动态权重调整 */
    PluginType[PluginType["WeightAdjuster"] = 64] = "WeightAdjuster";
    /** 统计上报 */
    PluginType[PluginType["StatReporter"] = 128] = "StatReporter";
    /** 日志跟踪 */
    PluginType[PluginType["TraceLogging"] = 256] = "TraceLogging";
    /** 限流服务 */
    PluginType[PluginType["RatelimitService"] = 512] = "RatelimitService";
    /** 流量整型 */
    PluginType[PluginType["TrafficShaping"] = 1024] = "TrafficShaping"; /** 1 << 10 */
})(PluginType = exports.PluginType || (exports.PluginType = {}));
/**
 * 路由条件
 */
var RoutingCondition;
(function (RoutingCondition) {
    RoutingCondition[RoutingCondition["Found"] = 0] = "Found";
    RoutingCondition[RoutingCondition["NotFound"] = 1] = "NotFound";
})(RoutingCondition = exports.RoutingCondition || (exports.RoutingCondition = {}));
/**
 * 路由行为
 */
var RoutingAction;
(function (RoutingAction) {
    /** 中断，不再查询本插件 */
    RoutingAction[RoutingAction["Break"] = 0] = "Break";
    /** 旁通，旁通路由链上特定插件（可包含本插件） */
    RoutingAction[RoutingAction["Bypass"] = 1] = "Bypass";
})(RoutingAction = exports.RoutingAction || (exports.RoutingAction = {}));
/**
 * 前置要求
 */
var RequisiteBitfield;
(function (RequisiteBitfield) {
    /** 无 */
    RequisiteBitfield[RequisiteBitfield["None"] = 0] = "None";
    /** 规则 */
    RequisiteBitfield[RequisiteBitfield["Rule"] = 1] = "Rule";
})(RequisiteBitfield = exports.RequisiteBitfield || (exports.RequisiteBitfield = {}));
/**
 * 数据存储类别
 */
var RegistryCategory;
(function (RegistryCategory) {
    /** 实例 */
    RegistryCategory["Instance"] = "Instance";
    /** 规则 */
    RegistryCategory["Rule"] = "Rule";
    /** 流控 */
    RegistryCategory["Ratelimit"] = "Ratelimit";
})(RegistryCategory = exports.RegistryCategory || (exports.RegistryCategory = {}));
/**
 * 健康检查类型
 */
var HealthCheckType;
(function (HealthCheckType) {
    HealthCheckType[HealthCheckType["UNKNOWN"] = 0] = "UNKNOWN";
    HealthCheckType[HealthCheckType["HEARTBEAT"] = 1] = "HEARTBEAT";
})(HealthCheckType = exports.HealthCheckType || (exports.HealthCheckType = {}));
/**
 * 运行模式
 */
var OperatingMode;
(function (OperatingMode) {
    /** 内部 */
    OperatingMode[OperatingMode["Internal"] = 0] = "Internal";
    /** 外部 */
    OperatingMode[OperatingMode["External"] = 1] = "External";
})(OperatingMode = exports.OperatingMode || (exports.OperatingMode = {}));
//# sourceMappingURL=plugins.js.map