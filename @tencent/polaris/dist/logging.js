"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLogger = exports.LogVerbosity = void 0;
const utils_1 = require("./utils");
var LogVerbosity;
(function (LogVerbosity) {
    LogVerbosity[LogVerbosity["NONE"] = 0] = "NONE";
    LogVerbosity[LogVerbosity["ERROR"] = 1] = "ERROR";
    LogVerbosity[LogVerbosity["INFO"] = 2] = "INFO";
    LogVerbosity[LogVerbosity["DEBUG"] = 3] = "DEBUG";
})(LogVerbosity = exports.LogVerbosity || (exports.LogVerbosity = {}));
const isLoggingFunc = (arg) => typeof arg === "function";
const kDefaultOptions = {
    /**
     * 日志级别
     */
    logVerbosity: LogVerbosity.ERROR,
    /**
     * 跟踪日志开关环境变量名
     */
    tracingEnv: "POLARIS_LOGGING_TRACING",
    /**
     * 日志级别环境变量名
     */
    verbosityEnv: "POLARIS_LOGGING_VERBOSITY",
    /**
     * 日志前缀
     * 不影响跟踪日志
     */
    prefix: `[${utils_1.kModuleName}@${utils_1.kModuleVersion}]`
};
class DefaultLogger {
    constructor(loggers, options) {
        this.loggers = loggers;
        this.tracingEnabled = false;
        this.transactionId = 0;
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
        /**
         * 配置优先级大于环境变量
         */
        if ((options === null || options === void 0 ? void 0 : options.logVerbosity) === undefined) {
            const verbosity = process.env[this.options.verbosityEnv];
            if (typeof verbosity === "string") {
                const severity = LogVerbosity[verbosity];
                switch (typeof severity) {
                    case "string": {
                        this.options.logVerbosity = LogVerbosity[severity];
                        break;
                    }
                    case "number": {
                        this.options.logVerbosity = severity;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
        if ((0, utils_1.on)(process.env[this.options.tracingEnv])) {
            this.tracingEnabled = true;
        }
    }
    // #region tracing
    /**
     * 开启追踪日志
     */
    enableTracing() {
        this.tracingEnabled = true;
    }
    /**
     * 关闭追踪日志
     */
    disableTracing() {
        this.tracingEnabled = false;
    }
    /**
     * 跟踪 ID 生成器
     * 每次取值均不重复
     */
    get transaction() {
        if (this.tracingEnabled) {
            return (this.transactionId++).toString(); // eslint-disable-line no-plusplus
        }
        return "";
    }
    /**
     * 跟踪日志
     * @param category 类别
     * @param klass 类名
     * @param method 方法名
     * @param transaction 跟踪 ID
     * @param message 日志内容（可选）
     * @param optionalParams 附加参数
     */
    trace(category, klass, method, transaction, message, ...optionalParams) {
        if (this.tracingEnabled) {
            const { loggers } = this;
            const tracer = `Polaris::${category}:${klass}.${method}`;
            loggers.forEach(logger => process.nextTick(logger.trace.bind(logger), tracer, transaction, message, ...optionalParams));
        }
    }
    // #endregion
    // #region log
    setVerbosity(verbosity) {
        this.options.logVerbosity = verbosity;
    }
    debug(message, ...optionalParams) {
        this.log(LogVerbosity.DEBUG, message, optionalParams);
    }
    info(message, ...optionalParams) {
        this.log(LogVerbosity.INFO, message, optionalParams);
    }
    error(message, ...optionalParams) {
        this.log(LogVerbosity.ERROR, message, optionalParams);
    }
    log(severity, message, ...optionalParams) {
        if (severity <= this.options.logVerbosity) {
            const { loggers, options: { prefix } } = this;
            if (optionalParams.length === 1 && isLoggingFunc(message)) {
                loggers.forEach(logger => process.nextTick(message, logger.log.bind(logger, severity, prefix)));
            }
            else {
                loggers.forEach(logger => process.nextTick(logger.log.bind(logger), severity, prefix, message, ...optionalParams));
            }
        }
    }
}
exports.DefaultLogger = DefaultLogger;
//# sourceMappingURL=logging.js.map