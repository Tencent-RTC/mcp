import { TraceLoggingPlugin } from "./plugins";
export declare enum LogVerbosity {
    NONE = 0,
    ERROR = 1,
    INFO = 2,
    DEBUG = 3
}
export declare const enum TraceCategory {
    Plugins = "Plugins",
    Consumer = "Consumer",
    Provider = "Provider",
    Limiter = "Limiter"
}
/**
 * 1. background: 日志信息的获取与组装一般较为消耗性能。
 * 2. case: 在正式环境中，一般配置的日志级别较高（≥ ERROR），组装好的日志最终由于级别不足而未输出。
 * 3. optimization: 将耗时的处理过程（日志获取与组装）包装在闭包内，仅在最终确定需要输出（日志级别满足）时才执行，以优化性能。
 */
export declare type LoggingFunc = (logging: (message?: unknown, ...optionalParams: unknown[]) => void) => void;
declare const kDefaultOptions: {
    /**
     * 日志级别
     */
    logVerbosity: LogVerbosity;
    /**
     * 跟踪日志开关环境变量名
     */
    tracingEnv: string;
    /**
     * 日志级别环境变量名
     */
    verbosityEnv: string;
    /**
     * 日志前缀
     * 不影响跟踪日志
     */
    prefix: unknown;
};
export declare type LoggerOptions = typeof kDefaultOptions;
export declare type Logger = Required<DefaultLogger>;
export declare class DefaultLogger {
    private readonly loggers;
    tracingEnabled: boolean;
    private readonly options;
    private transactionId;
    constructor(loggers: TraceLoggingPlugin[], options?: Partial<LoggerOptions>);
    /**
     * 开启追踪日志
     */
    enableTracing(): void;
    /**
     * 关闭追踪日志
     */
    disableTracing(): void;
    /**
     * 跟踪 ID 生成器
     * 每次取值均不重复
     */
    get transaction(): string;
    /**
     * 跟踪日志
     * @param category 类别
     * @param klass 类名
     * @param method 方法名
     * @param transaction 跟踪 ID
     * @param message 日志内容（可选）
     * @param optionalParams 附加参数
     */
    trace(category: TraceCategory, klass: string, method: string, transaction?: unknown, message?: unknown, ...optionalParams: unknown[]): void;
    setVerbosity(verbosity: LogVerbosity): void;
    /**
     * 输出 debug 级别日志
     * @param logging 日志生成函数
     */
    debug(logging: LoggingFunc): void;
    /**
     * 输出 debug 级别日志
     * @param message 日志内容（可选）
     * @param optionalParams 附加参数
     */
    debug(message?: unknown, ...optionalParams: unknown[]): void;
    /**
     * 输出 info 级别日志
     * @param logging 日志生成函数
     */
    info(logging: LoggingFunc): void;
    /**
     * 输出 info 级别日志
     * @param message 日志内容（可选）
     * @param optionalParams 附加参数
     */
    info(message?: unknown, ...optionalParams: unknown[]): void;
    /**
     * 输出 error 级别日志
     * @param logging 日志生成函数
     */
    error(logging: LoggingFunc): void;
    /**
     * 输出 error 级别日志
     * @param message 日志内容（可选）
     * @param optionalParams 附加参数
     */
    error(message?: unknown, ...optionalParams: unknown[]): void;
    private log;
}
export {};
