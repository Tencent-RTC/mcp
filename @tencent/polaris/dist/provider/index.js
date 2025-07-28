"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
const process_1 = require("process");
const errors_1 = require("../errors");
const plugins_1 = require("../plugins");
const console_1 = require("../plugins/logging/console");
const skeleton_1 = require("../skeleton");
const utils_1 = require("../utils");
const kProvider = Symbol("kProvider");
const kServiceToken = Symbol("kServiceToken");
class RegisterResponse {
    constructor(id, token, provider) {
        this.id = id;
        this[kServiceToken] = token;
        this[kProvider] = provider;
    }
    /**
     * 服务注销
     * @returns 是否注销成功
     */
    async unregister() {
        return this[kProvider].unregister(this.id, this[kServiceToken]);
    }
    /**
     * 服务心跳上报
     * @returns 是否上报成功
     */
    async heartbeat() {
        return this[kProvider].heartbeat(this.id, this[kServiceToken]);
    }
}
const kCurrentInstances = Symbol("kCurrentInstances");
const KMaxInstances = Symbol("KMaxInstances");
class Provider extends skeleton_1.SkeletonClass {
    /**
     * Create Provider
     * @param plugins 插件
     * @param options 配置参数（可选）
     */
    constructor(plugins, options = {}) {
        Provider[kCurrentInstances] += 1;
        if (Provider[kCurrentInstances] >= Provider[KMaxInstances]) {
            (0, skeleton_1.emitMaxInstancesExceededWarning)("Consumer", Provider[KMaxInstances]);
        }
        // #region plugin
        const pluginList = {
            [plugins_1.PluginType.NamingService]: plugins[plugins_1.PluginType.NamingService],
            [plugins_1.PluginType.TraceLogging]: plugins[plugins_1.PluginType.TraceLogging] || [new console_1.ConsoleTraceLogging()],
            [plugins_1.PluginType.StatReporter]: plugins[plugins_1.PluginType.StatReporter] || []
        };
        const naming = pluginList[plugins_1.PluginType.NamingService];
        /**
         * 在某些特殊场景下，为了避免死循环与内存开销，
         * `NamingService` 与 `StatReporter` 插件实现在一个对象内
         */
        if ((0, skeleton_1.isStatReporterPlugin)(naming)) {
            pluginList[plugins_1.PluginType.StatReporter].push(naming);
        }
        super(pluginList, options);
        // #endregion
    }
    /**
     * 当前可实例化的最大次数
     */
    static get maxInstances() {
        return Provider[KMaxInstances];
    }
    /**
     * 设置可实例化的最大次数
     * @param n 最大次数
     */
    static setMaxInstances(n) {
        if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
            throw new errors_1.ArgumentError("|n| must be a non-negative number");
        }
        Provider[KMaxInstances] = n;
    }
    /**
     * 销毁（释放）所占资源
     * @param sync 是否同步释放（可选）
     */
    dispose(sync = false) {
        if (this[skeleton_1.kDisposed]) {
            return;
        }
        super.dispose(sync);
        Provider[kCurrentInstances] -= 1;
        if (Provider[kCurrentInstances] < 0) {
            (0, utils_1.UNREACHABLE)();
        }
    }
    /**
     * 服务注册
     * @param namespace 命名空间
     * @param service 服务名
     * @param token 服务 Token 用来鉴权
     * @param instance 待注册的实例
     * @param options 注册选项
     * @returns 可操作的实例对象（包含注册的实例 `id`）
     */
    async register(namespace, service, token, instance, options) {
        const startTime = (0, process_1.uptime)();
        let id = "";
        let err;
        try {
            this[skeleton_1.kMaybeAlreadyDisposed]();
            id = await this.plugins[plugins_1.PluginType.NamingService].register(namespace, service, token, instance, options);
        }
        catch (e) {
            err = e;
        }
        this[skeleton_1.kAPICollector]("Provider.register", ((0, process_1.uptime)() - startTime) * utils_1.kSeconds, err);
        if (err) {
            throw err;
        }
        return new RegisterResponse(id, token, this);
    }
    async unregister(...args) {
        const startTime = (0, process_1.uptime)();
        let err;
        try {
            this[skeleton_1.kMaybeAlreadyDisposed]();
            return await this.plugins[plugins_1.PluginType.NamingService].unregister(...args);
        }
        catch (e) {
            err = e;
        }
        finally {
            this[skeleton_1.kAPICollector]("Provider.unregister", ((0, process_1.uptime)() - startTime) * utils_1.kSeconds, err);
        }
        throw err;
    }
    async heartbeat(...args) {
        const startTime = (0, process_1.uptime)();
        let err;
        try {
            this[skeleton_1.kMaybeAlreadyDisposed]();
            return await this.plugins[plugins_1.PluginType.NamingService].heartbeat(...args);
        }
        catch (e) {
            err = e;
        }
        finally {
            this[skeleton_1.kAPICollector]("Provider.heartbeat", ((0, process_1.uptime)() - startTime) * utils_1.kSeconds, err);
        }
        throw err;
    }
}
exports.Provider = Provider;
_a = Provider, _b = kCurrentInstances;
/**
 * note:
 * 由于类包含专用标识符时，`super` 调用必须是构造函数中的第一个语句。
 * 所以这里采用 `Symbol` 来实现 __私有静态属性__
 */
Provider[_b] = 0;
(() => {
    let maxInstances = 3;
    const { POLARIS_PROVIDER_INSTANCE_LIMIT } = process.env;
    if (POLARIS_PROVIDER_INSTANCE_LIMIT !== undefined) {
        maxInstances = parseInt(POLARIS_PROVIDER_INSTANCE_LIMIT, 10);
        maxInstances = (maxInstances === 0 /** Unlimited */ ? Infinity : maxInstances);
    }
    _a.setMaxInstances(maxInstances);
})();
//# sourceMappingURL=index.js.map