"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Limiter = void 0;
const process_1 = require("process");
const errors_1 = require("../errors");
const plugins_1 = require("../plugins");
const console_1 = require("../plugins/logging/console");
const memory_1 = require("../plugins/registry/memory");
const unirate_1 = require("../plugins/shaping/unirate");
const warmup_1 = require("../plugins/shaping/warmup");
const registry_1 = require("../registry");
const skeleton_1 = require("../skeleton");
const utils_1 = require("../utils");
const ratelimit_1 = require("./ratelimit");
const isRatelimitServicePlugin = ((plugin) => (plugin.type & plugins_1.PluginType.RatelimitService) !== 0);
const kRatelimit = Symbol("kRatelimit");
const kRegistry = Symbol("kRegistry");
const kCurrentInstances = Symbol("kCurrentInstances");
const KMaxInstances = Symbol("KMaxInstances");
class Limiter extends skeleton_1.SkeletonClass {
    /**
     * Create Limiter
     * @param plugins 插件
     * @param options 配置参数（可选）
     */
    constructor(plugins, options = {}) {
        Limiter[kCurrentInstances] += 1;
        if (Limiter[kCurrentInstances] >= Limiter[KMaxInstances]) {
            (0, skeleton_1.emitMaxInstancesExceededWarning)("Consumer", Limiter[KMaxInstances]);
        }
        // #region plugins
        const pluginList = {
            [plugins_1.PluginType.RatelimitService]: plugins[plugins_1.PluginType.RatelimitService],
            [plugins_1.PluginType.TrafficShaping]: (plugins[plugins_1.PluginType.TrafficShaping] || []).concat(new unirate_1.UnirateTrafficShaping(), new warmup_1.WarmUpTrafficShaping()),
            [plugins_1.PluginType.NamingService]: plugins[plugins_1.PluginType.NamingService],
            [plugins_1.PluginType.LocalRegistry]: plugins[plugins_1.PluginType.LocalRegistry] || new memory_1.MemoryOnlyRegistry(),
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
        /**
         * 在 `RatelimitService`（为空）没有配置情况下，
         * 查找 `NamingService` 插件是否实现此功能
         */
        if (typeof pluginList[plugins_1.PluginType.RatelimitService] === "undefined") {
            if (isRatelimitServicePlugin(naming)) {
                pluginList[plugins_1.PluginType.RatelimitService] = naming;
            }
            else {
                throw new errors_1.ConfigError("RatelimitService plugin not provided");
            }
        }
        super(pluginList, options);
        // #endregion
        this[kRegistry] = new registry_1.LocalRegistry(this[skeleton_1.kLogger], naming, this.plugins[plugins_1.PluginType.LocalRegistry], this.plugins[plugins_1.PluginType.StatReporter], this.plugins[plugins_1.PluginType.RatelimitService], options);
        this[kRatelimit] = new ratelimit_1.Ratelimit(this[skeleton_1.kGlobal], this[skeleton_1.kLogger], this[kRegistry], this.plugins[plugins_1.PluginType.RatelimitService], this.plugins[plugins_1.PluginType.TrafficShaping], options);
    }
    /**
     * 当前可实例化的最大次数
     */
    static get maxInstances() {
        return Limiter[KMaxInstances];
    }
    /**
     * 设置可实例化的最大次数
     * @param n 最大次数
     */
    static setMaxInstances(n) {
        if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
            throw new errors_1.ArgumentError("|n| must be a non-negative number");
        }
        Limiter[KMaxInstances] = n;
    }
    /**
     * 销毁（释放）所占资源
     *
     * @description
     * dispose order:
     *  Ratelimit -> Registry -> [plguins]
     *
     * @param sync 是否同步释放（可选）
     */
    dispose(sync = false) {
        if (this[skeleton_1.kDisposed]) {
            return;
        }
        this[kRatelimit].dispose();
        this[kRegistry].dispose();
        super.dispose(sync);
        Limiter[kCurrentInstances] -= 1;
        if (Limiter[kCurrentInstances] < 0) {
            (0, utils_1.UNREACHABLE)();
        }
    }
    /**
     * 通过条件获取配额分配对象
     * @param namespace 命名空间
     * @param service 服务名
     * @param amount 请求的配额数
     * @param cluster 集群名（可选）
     * @param labels 标签集合（可选）
     * @param id 唯一 ID（可选）
     */
    async acquire(namespace, service, amount, cluster = "", labels = {}, id) {
        const startTime = (0, process_1.uptime)();
        let err;
        try {
            this[skeleton_1.kMaybeAlreadyDisposed]();
            const rule = await this[kRatelimit].query(namespace, service, cluster, labels, id);
            return {
                quotas: this[kRatelimit].acquire(namespace, service, amount, rule),
                id: rule === null || rule === void 0 ? void 0 : rule.id
            };
        }
        catch (e) {
            err = e;
        }
        finally {
            this[skeleton_1.kAPICollector]("Limiter.acquire", ((0, process_1.uptime)() - startTime) * utils_1.kSeconds, err);
        }
        throw err;
    }
}
exports.Limiter = Limiter;
_a = Limiter, _b = kCurrentInstances;
/**
 * note:
 * 由于类包含专用标识符时，`super` 调用必须是构造函数中的第一个语句。
 * 所以这里采用 `Symbol` 来实现 __私有静态属性__
 */
Limiter[_b] = 0;
(() => {
    let maxInstances = 3;
    const { POLARIS_LIMITER_INSTANCE_LIMIT } = process.env;
    if (POLARIS_LIMITER_INSTANCE_LIMIT !== undefined) {
        maxInstances = parseInt(POLARIS_LIMITER_INSTANCE_LIMIT, 10);
        maxInstances = (maxInstances === 0 /** Unlimited */ ? Infinity : maxInstances);
    }
    _a.setMaxInstances(maxInstances);
})();
//# sourceMappingURL=index.js.map