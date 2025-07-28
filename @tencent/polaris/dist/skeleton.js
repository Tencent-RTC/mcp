"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkeletonClass = exports.kGlobal = exports.kMaybeAlreadyDisposed = exports.kDisposed = exports.emitMaxInstancesExceededWarning = exports.isStatReporterPlugin = exports.ResultType = exports.kAPIReport = exports.kAPICollector = exports.kCollector = exports.kLogger = void 0;
const errors_1 = require("./errors");
const global_1 = require("./global");
const logging_1 = require("./logging");
const plugins_1 = require("./plugins");
const utils_1 = require("./utils");
exports.kLogger = Symbol("kLogger");
const kInitializePlugin = Symbol("kInitializePlugin");
// #region collector
exports.kCollector = Symbol("kCollector");
exports.kAPICollector = Symbol("kAPICollector");
exports.kAPIReport = Symbol("kAPIReport");
const kReportTimer = Symbol("kReportTimer");
const kNeedAPICollector = Symbol("kNeedAPICollector");
var ResultType;
(function (ResultType) {
    /** 未知 */
    ResultType[ResultType["Unknown"] = 0] = "Unknown";
    /** 用户调用成功 */
    ResultType[ResultType["Success"] = 1] = "Success";
    /** 由于用户的原因，如参数错误导致的调用错误 */
    ResultType[ResultType["UserFail"] = 2] = "UserFail";
    /** 由于系统原因（SDK 或者 Server）导致用户调用失败 */
    ResultType[ResultType["SystemFail"] = 3] = "SystemFail";
})(ResultType = exports.ResultType || (exports.ResultType = {}));
const kSep = "|";
const classifyCost = (cost) => {
    if (cost < 50) {
        return "[0ms,50ms)";
    }
    if (cost >= 50 && cost < 100) {
        return "[50ms,100ms)";
    }
    if (cost >= 100 && cost < 150) {
        return "[100ms,150ms)";
    }
    if (cost >= 150 && cost < 200) {
        return "[150ms,200ms)";
    }
    return "[200ms,)";
};
// #endregion
// #region config
const pickConfig = (plugins, result = Object.create(null)) => {
    Object.values(plugins).forEach((plugin) => {
        var _d;
        if (plugin === undefined) {
            if (plugin === plugins[plugins_1.PluginType.CircuitBreaker]) {
                return;
            }
            (0, utils_1.UNREACHABLE)();
        }
        if (Array.isArray(plugin)) {
            return pickConfig(plugin, result);
        }
        const config = (_d = plugin.getConfig) === null || _d === void 0 ? void 0 : _d.call(plugin);
        if (config !== undefined) {
            result[plugin.name] = config;
        }
    });
    return result;
};
// #endregion
exports.isStatReporterPlugin = ((plugin) => (plugin.type & plugins_1.PluginType.StatReporter) !== 0);
const emitMaxInstancesExceededWarning = (type, count) => {
    /**
     * 由于 `process.emitWarning` 实现中判断了传入的 `err instanceof Error`，
     * 而在某些场景下（如 Mock 时） `Error` 对象会被用户代码修改（替换），
     * 而 Node.js 所判断的对象（表达式右值）为原始 `Error` 对象（不受用户代码影响），
     * 导致调用时抛出 [ERR_INVALID_ARG_TYPE] 异常，
     * 故在这里使用 `PrimordialsError`，也就是 Node.js 原始 `Error` 对象。
     */
    const warning = new errors_1.PrimordialsError("Possible multiple useless instantiations detected. "
        + `Current ${type} is instantiated ${count} times. `
        + "Call setMaxInstances(n) to increase limit, "
        + "or explicit call dispose() to release instance.");
    warning.name = "MaxInstancesExceededWarning";
    warning.type = type;
    warning.count = count;
    process.emitWarning(warning);
};
exports.emitMaxInstancesExceededWarning = emitMaxInstancesExceededWarning;
const isUserFail = (code) => code === errors_1.ErrorCodes.InvalidArgument
    || code === errors_1.ErrorCodes.InvalidConfig
    || code === errors_1.ErrorCodes.ServiceNotFound
    || code === errors_1.ErrorCodes.StateError
    || code === errors_1.ErrorCodes.ServerError /** 非 `ServerException` 均属于用户异常 */;
// #region dispose
exports.kDisposed = Symbol("kDisposed");
exports.kMaybeAlreadyDisposed = Symbol("kMaybeAlreadyDisposed");
const performDispose = (plugin) => {
    if (!plugin.isDisposed) {
        plugin.dispose();
    }
};
const disposePlugin = (plugin, sync) => {
    if (typeof plugin.dispose === "function") {
        if (sync) {
            performDispose(plugin);
        }
        else {
            process.nextTick(performDispose, plugin);
        }
    }
};
// #endregion
exports.kGlobal = Symbol("kGlobal");
/**
 * API 骨架类，用于 `Consumer` | `Provider` | `Limiter`
 */
class SkeletonClass {
    constructor(plugins, options, logger) {
        this[_a] = false;
        this[_b] = Object.create(null);
        this[_c] = false;
        this.plugins = plugins;
        this[exports.kLogger] = logger !== null && logger !== void 0 ? logger : new logging_1.DefaultLogger(this.plugins[plugins_1.PluginType.TraceLogging], options);
        this[exports.kGlobal] = (0, global_1.createGlobalOptions)(options);
        this[kInitializePlugin]();
        let config;
        this.plugins[plugins_1.PluginType.StatReporter].forEach((reporter) => {
            var _d;
            (_d = reporter.systemConfig) === null || _d === void 0 ? void 0 : _d.call(reporter, config !== null && config !== void 0 ? config : (config = {
                system: options,
                plugins: pickConfig(Object.values(this.plugins))
            })).catch(err => this[exports.kDisposed] || this[exports.kLogger].error(`[${reporter.name}] [systemConfig]`, err));
            this[kNeedAPICollector] || (this[kNeedAPICollector] = typeof reporter.apiStatistics === "function");
        });
    }
    // #region dispose
    [(_a = exports.kDisposed, _b = exports.kCollector, _c = kNeedAPICollector, exports.kMaybeAlreadyDisposed)]() {
        if (this[exports.kDisposed]) {
            throw new errors_1.StateError("Already disposed");
        }
    }
    /**
     * @description
     * dispose order:
     *  ... [plugins] ... -> TraceLogging
     *
     * @param sync 是否同步释放
     */
    dispose(sync) {
        if (this[exports.kDisposed]) {
            return;
        }
        this[exports.kDisposed] = true;
        const logging = this.plugins[plugins_1.PluginType.TraceLogging];
        const plugins = Object.values(this.plugins);
        const { length } = plugins;
        for (let i = 0; i <= length; i += 1) {
            const val = i === length ? logging : plugins[i];
            if (i !== length && val === logging) {
                continue;
            }
            if (Array.isArray(val)) {
                val.forEach((plugin) => disposePlugin(plugin, sync));
            }
            else {
                disposePlugin(val, sync);
            }
        }
    }
    // #endregion
    // #region logger & trace
    setVerbosity(verbosity) {
        this[exports.kLogger].setVerbosity(verbosity);
    }
    enableTracing() {
        this[exports.kLogger].enableTracing();
    }
    disableTracing() {
        this[exports.kLogger].disableTracing();
    }
    // #endregion
    [kInitializePlugin]() {
        const { globalVariables, enableReporter } = this[exports.kGlobal];
        if (!enableReporter) {
            const pluginSet = new Set();
            Object.entries(this.plugins).forEach(([key, val]) => {
                if (key !== `${plugins_1.PluginType.StatReporter}`) {
                    if (Array.isArray(val)) {
                        val.forEach(plugin => pluginSet.add(plugin));
                    }
                    else {
                        pluginSet.add(val);
                    }
                }
            });
            this.plugins[plugins_1.PluginType.StatReporter].forEach(
            /**
             * 由于 `StatReporter` 插件可能与其它插件（如：`NamingService`）实现在一个对象内，
             * 故需要判断对象的全局唯一性，再调用 dispose 方法
             */
            plugin => !pluginSet.has(plugin) && disposePlugin(plugin, false));
            this.plugins[plugins_1.PluginType.StatReporter] = [];
        }
        const logging = this.plugins[plugins_1.PluginType.TraceLogging];
        const logger = this[exports.kLogger];
        Object.values(this.plugins).forEach((val) => {
            var _d, _e;
            // fix TypeScript 4.3.2 bug
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (val) {
                if (Array.isArray(val)) {
                    if (val !== logging) {
                        val.forEach((plugin) => {
                            var _d, _e;
                            (_d = plugin.setLogger) === null || _d === void 0 ? void 0 : _d.call(plugin, logger);
                            (_e = plugin.setVariables) === null || _e === void 0 ? void 0 : _e.call(plugin, globalVariables);
                        });
                    }
                }
                else {
                    (_d = val.setLogger) === null || _d === void 0 ? void 0 : _d.call(val, logger);
                    (_e = val.setVariables) === null || _e === void 0 ? void 0 : _e.call(val, globalVariables);
                }
            }
        });
    }
    // #region API
    [exports.kAPICollector](api, cost, err) {
        if (!this[kNeedAPICollector]) {
            return;
        }
        let code = "0";
        if (typeof err !== "undefined") {
            if ((0, errors_1.isPolarisError)(err)) {
                code = err[errors_1.kErrorCode];
            }
            else {
                code = errors_1.ErrorCodes.InternalError;
            }
        }
        const key = api + kSep + classifyCost(cost) + kSep + code;
        const collector = this[exports.kCollector];
        if (collector[key] === undefined) {
            collector[key] = 1;
        }
        else {
            collector[key] += 1;
        }
        if (this[kReportTimer] === undefined) {
            this[kReportTimer] = setTimeout(() => {
                this[exports.kAPIReport]();
                this[kReportTimer] = undefined;
            }, 1 * utils_1.kMinutes).unref(); /** 上报的指标值单位为每分钟 */
        }
    }
    [exports.kAPIReport]() {
        const collector = this[exports.kCollector];
        this[exports.kCollector] = Object.create(null);
        Object.keys(collector).forEach((key) => {
            const [api, delay, code] = key.split(kSep);
            const statKey = {
                api,
                delay,
                code,
                result: ResultType.Unknown
            };
            if (code === "0") {
                statKey.result = ResultType.Success;
            }
            else if (isUserFail(code)) {
                statKey.result = ResultType.UserFail;
            }
            else {
                statKey.result = ResultType.SystemFail;
            }
            const statValue = collector[key];
            this.plugins[plugins_1.PluginType.StatReporter].forEach((reporter) => {
                var _d;
                (_d = reporter.apiStatistics) === null || _d === void 0 ? void 0 : _d.call(reporter, statKey, statValue).catch(err => this[exports.kDisposed] || this[exports.kLogger].error(`[${reporter.name}] [apiStatistics]`, err));
            });
        });
    }
}
exports.SkeletonClass = SkeletonClass;
//# sourceMappingURL=skeleton.js.map