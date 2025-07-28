import { InterfaceEventEmitter } from './util';
import { Config, LogType, Environment, SendOption, SendSuccess, SendFail, SpeedLog, BridgeLog, ReportTimeLog, SendType, EventLog } from './interface';
import Plugin from './plugin';
import { Pipe } from './pipes';
/**
 * Aegis 核心逻辑，所有平台的 Aegis 类都继承于 Core
 * 类似 linux 微内核的架构组织代码
 * 所有 Aegis 的功能都是基于 Core 实现
 * 1. 封装了 Aegis 的基本属性和方法
 * 2. 封装了 Aegis 的插件模型，Aegis 中所有数据采集的逻辑均基于插件体系实现
 * 3. 封装了 Aegis 的基础实例方法，包括 info report reportEvent 等，平台无需自己重复实现
 * 4. 封装了 Aegis 的生命周期，实现生命周期管理
 */
export default class Core {
    static version: string;
    static instances: Core[];
    static logType: typeof LogType;
    static environment: typeof Environment;
    static installedPlugins: Plugin[];
    /**
     * 使用插件
     * @param plugin
     */
    static use(plugin: Plugin): void;
    /**
     * 销毁插件
     * @param plugin
     */
    static unuse(plugin: Plugin): void;
    isGetSample: boolean;
    isHidden: boolean;
    config: Config;
    isWhiteList: boolean;
    lifeCycle: InterfaceEventEmitter;
    bean: {
        [key: string]: string | number | boolean;
    };
    sendNow: boolean;
    normalLogPipeline: import("./pipes").Pipeline<any, any>;
    eventPipeline: import("./pipes").Pipeline<any, any>;
    customTimePipeline: import("./pipes").Pipeline<any, any>;
    private timeMap;
    private failRequestCount;
    /**
     * 构造函数
     * @param config
     */
    constructor(config: Config);
    /**
     * 初始化方法，用于记录用户传入参数和初始化 SDK 所有插件
     * @param config
     */
    init(config: Config): void;
    /**
     * 销毁 Aegis 实例，清空 Aegis 实例属性和方法，销毁插件
     * @param force
     */
    destroy(force?: boolean): void;
    /**
     * 设置属性，这个方法也暴露给用户，方便用户动态修改 SDK 属性
     * @param config
     * @returns
     */
    setConfig(config: Partial<Config>): Config;
    extendBean(key: string, value: string | number): void;
    send(options: SendOption, success?: SendSuccess, fail?: SendFail): any;
    sendSDKError(err: Error): void;
    sendPipeline(pipes: Pipe[], type: SendType): import("./pipes").Pipeline<any, any>;
    info(...msg: any): void;
    infoAll(...msg: any): void;
    report(...msg: any): void;
    error(...msg: any): void;
    reportEvent(event: string | EventLog): void;
    reportT(obj: ReportTimeLog): void;
    reportTime(key: string | ReportTimeLog, duration?: number): void;
    time(key: string): void;
    timeEnd(key: string): void;
    ready(_options: SendOption, _success?: SendSuccess, _fail?: SendFail): void;
    request(_options: SendOption, _success?: SendSuccess, _fail?: SendFail): void;
    speedLogPipeline(_log?: SpeedLog | SpeedLog[] | BridgeLog | BridgeLog[]): void;
    get __version__(): string;
    get LogType(): typeof LogType;
    reportPv(id: number): void;
    private submitCustomTime;
}
