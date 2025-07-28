"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _Consumer_currentInstances, _Consumer_maxInstances;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consumer = exports.InternalConsumer = exports.SelectResponse = void 0;
const process_1 = require("process");
const errors_1 = require("../errors");
const plugins_1 = require("../plugins");
const polaris_1 = require("../plugins/breaker/polaris");
const wr_1 = require("../plugins/lb/wr");
const console_1 = require("../plugins/logging/console");
const memory_1 = require("../plugins/registry/memory");
const nearby_1 = require("../plugins/router/polaris/nearby");
const rule_1 = require("../plugins/router/polaris/rule");
const polaris_2 = require("../plugins/weight/polaris");
const registry_1 = require("../registry");
const skeleton_1 = require("../skeleton");
const utils_1 = require("../utils");
const health_1 = require("./health");
const monitor_1 = require("./monitor");
const selector_1 = require("./selector");
const kSelector = Symbol("kSelector");
const kMonitor = Symbol("kMonitor");
const kHealth = Symbol("kHealth");
const kRegistry = Symbol("kRegistry");
class SelectResponse {
    constructor(callee, instance, monitor) {
        this.callee = callee;
        this.instance = instance;
        this[kMonitor] = monitor;
    }
    /**
     * 上报调用结果
     * @param success 是否调用成功
     * @param cost 调用耗时（需大于等于 0，默认为 0）
     * @param code 返回码（可选）
     */
    update(success, cost = 0, code) {
        this[kMonitor].update(this.callee.namespace, this.callee.service, this.instance, success, cost, code);
    }
}
exports.SelectResponse = SelectResponse;
/**
 * For internal use only.
 * Use `Consumer` instead of `InternalConsumer`.
 */
class InternalConsumer extends skeleton_1.SkeletonClass {
    /**
     * Create Consumer
     * @param plugins 插件
     * @param options 配置参数（可选）
     * @param logger Logger 对象共享，如不传则会自动创建
     */
    constructor(plugins, options = {}, logger) {
        const pluginList = InternalConsumer.mergePluginList(plugins, options);
        super(pluginList, options, logger);
        const naming = pluginList[plugins_1.PluginType.NamingService];
        switch (naming.mode) {
            case plugins_1.OperatingMode.Internal: {
                this[kRegistry] = new registry_1.LocalRegistry(this[skeleton_1.kLogger], naming, this.plugins[plugins_1.PluginType.LocalRegistry], this.plugins[plugins_1.PluginType.StatReporter], undefined, options);
                this[kHealth] = new health_1.Health(this[skeleton_1.kLogger], this[kRegistry], this.plugins[plugins_1.PluginType.LoadBalancer], this.plugins[plugins_1.PluginType.OutlierDetector], this.plugins[plugins_1.PluginType.StatReporter], options);
                this[kRegistry].on("SyncInstanceStatus" /* SyncInstanceStatus */, (namespace, service, instance, status) => {
                    this[kHealth].changeStatus(namespace, service, instance, status, "[Registry], synchronized by naming");
                });
                this[kSelector] = new selector_1.InternalSelector(this[skeleton_1.kGlobal], this[skeleton_1.kLogger], this[kHealth], this[kRegistry], this.plugins[plugins_1.PluginType.ServiceRouter], this.plugins[plugins_1.PluginType.LoadBalancer], options);
                this[kMonitor] = new monitor_1.InternalMonitor(this[skeleton_1.kLogger], this[kHealth], this[kRegistry], this.plugins[plugins_1.PluginType.WeightAdjuster], this.plugins[plugins_1.PluginType.StatReporter], this.plugins[plugins_1.PluginType.CircuitBreaker], options);
                break;
            }
            case plugins_1.OperatingMode.External: {
                this[kSelector] = new selector_1.ExternalSelector(naming);
                this[kMonitor] = new monitor_1.ExternalMonitor(this[skeleton_1.kLogger], this.plugins[plugins_1.PluginType.StatReporter]);
                break;
            }
            default: {
                (0, utils_1.UNREACHABLE)();
            }
        }
    }
    static mergePluginList(plugins, options) {
        const pluginList = {
            [plugins_1.PluginType.NamingService]: plugins[plugins_1.PluginType.NamingService],
            [plugins_1.PluginType.LocalRegistry]: plugins[plugins_1.PluginType.LocalRegistry] || new memory_1.MemoryOnlyRegistry(),
            [plugins_1.PluginType.LoadBalancer]: plugins[plugins_1.PluginType.LoadBalancer] || new wr_1.WRLoadBalancer(),
            [plugins_1.PluginType.ServiceRouter]: plugins[plugins_1.PluginType.ServiceRouter] || [new rule_1.PolarisRuleRouter(), new nearby_1.PolarisNearbyRouter()],
            [plugins_1.PluginType.TraceLogging]: plugins[plugins_1.PluginType.TraceLogging] || [new console_1.ConsoleTraceLogging()],
            [plugins_1.PluginType.WeightAdjuster]: plugins[plugins_1.PluginType.WeightAdjuster] || [],
            [plugins_1.PluginType.OutlierDetector]: plugins[plugins_1.PluginType.OutlierDetector] || [],
            [plugins_1.PluginType.StatReporter]: plugins[plugins_1.PluginType.StatReporter] || [],
            [plugins_1.PluginType.CircuitBreaker]: plugins[plugins_1.PluginType.CircuitBreaker]
        };
        /**
         * 在某些特殊场景下，为了避免死循环与内存开销，
         * `NamingService` 与 `StatReporter` 插件实现在一个对象内
         */
        const naming = pluginList[plugins_1.PluginType.NamingService];
        if ((0, skeleton_1.isStatReporterPlugin)(naming)) {
            pluginList[plugins_1.PluginType.StatReporter].push(naming);
        }
        /**
         * `LoadBalancer` 插件不支持动态权重调整时，则不开启
         */
        if (pluginList[plugins_1.PluginType.LoadBalancer].supportedWeightType !== 0 /* Dynamic */) {
            options.enableDynamicWeights = false;
        }
        /**
         * 如启用动态权重调整，又未配置插件实现时，使用默认实现
         */
        if (options.enableDynamicWeights && pluginList[plugins_1.PluginType.WeightAdjuster].length === 0) {
            pluginList[plugins_1.PluginType.WeightAdjuster] = [new polaris_2.PolarisDynamicWeight()];
        }
        /**
         * 如启用节点熔断插件，又未配置插件实现时，使用默认实现
         */
        if ((!options.breakerSwitch || options.breakerSwitch.period || options.breakerSwitch.realtime)
            && !pluginList[plugins_1.PluginType.CircuitBreaker]) {
            pluginList[plugins_1.PluginType.CircuitBreaker] = new polaris_1.PolarisCircuitBreaker();
        }
        return pluginList;
    }
    /**
     * 销毁（释放）所占资源
     *
     * @description
     * dispose order:
     *  Monitor -> Health -> Selector -> Registry -> [plguins]
     *
     * @param sync 是否同步释放（可选）
     */
    dispose(sync = false) {
        var _b, _c;
        const { [skeleton_1.kLogger]: logger, [skeleton_1.kDisposed]: disposed } = this;
        if (disposed) {
            return;
        }
        logger.trace("Consumer" /* Consumer */, Consumer.name, "dispose", undefined, "started");
        this[kMonitor].dispose();
        this[kHealth].dispose();
        (_c = (_b = this[kSelector]).dispose) === null || _c === void 0 ? void 0 : _c.call(_b);
        this[kRegistry].dispose();
        super.dispose(sync);
        logger.trace("Consumer" /* Consumer */, Consumer.name, "dispose", undefined, "dispose completed");
    }
    async select(...args) {
        const startTime = (0, process_1.uptime)();
        let callee;
        let caller;
        let callArgs;
        if (typeof args[0] === "string" && typeof args[1] === "string") {
            const exactArgs = args;
            callee = {
                namespace: exactArgs[0],
                service: exactArgs[1],
                metadata: exactArgs[2]
            };
            const [, , metadata] = exactArgs;
            if (metadata) {
                caller = {
                    namespace: "",
                    service: "",
                    metadata
                };
            }
            [, , , callArgs] = exactArgs;
        }
        else {
            [callee, caller, callArgs] = args;
        }
        const { [skeleton_1.kLogger]: logger } = this;
        const { transaction } = logger;
        this[skeleton_1.kLogger].trace("Consumer" /* Consumer */, Consumer.name, "select", transaction, "caller is", caller, "callee is", callee, "with args:", callArgs);
        let instance = null;
        let err;
        try {
            this[skeleton_1.kMaybeAlreadyDisposed]();
            instance = await this[kSelector].select(callee, caller, callArgs);
        }
        catch (e) {
            err = e;
        }
        this[skeleton_1.kAPICollector]("Consumer.select", ((0, process_1.uptime)() - startTime) * utils_1.kSeconds, err);
        if (err) {
            logger.trace("Consumer" /* Consumer */, Consumer.name, "select", transaction, "exception", err);
            throw err;
        }
        if (instance === null) {
            logger.trace("Consumer" /* Consumer */, Consumer.name, "select", transaction, "not found matching instance");
            return null;
        }
        logger.trace("Consumer" /* Consumer */, Consumer.name, "select", transaction, "selected instance is", instance);
        return new SelectResponse(callee, instance, this[kMonitor]);
    }
    /**
     * 获取全部服务实例
     * @param namespace 服务名字空间
     * @param service 服务名
     */
    async list(namespace, service) {
        const startTime = (0, process_1.uptime)();
        const { [skeleton_1.kLogger]: logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Consumer" /* Consumer */, Consumer.name, "list", transaction, `list ${namespace}.${service} instances`);
        }
        let err;
        try {
            this[skeleton_1.kMaybeAlreadyDisposed]();
            const instances = await this[kSelector].list(namespace, service);
            logger.trace("Consumer" /* Consumer */, Consumer.name, "list", transaction, "all instances:", instances);
            return instances;
        }
        catch (e) {
            err = e;
        }
        finally {
            this[skeleton_1.kAPICollector]("Consumer.list", ((0, process_1.uptime)() - startTime) * utils_1.kSeconds, err);
        }
        logger.trace("Consumer" /* Consumer */, Consumer.name, "list", transaction, "exception", err);
        throw err;
    }
    /**
     * 获取服务规则路由
     * @param namespace 服务名字空间
     * @param service 服务名
     */
    async rules(namespace, service) {
        const startTime = (0, process_1.uptime)();
        const { [skeleton_1.kLogger]: logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Consumer" /* Consumer */, Consumer.name, "rules", transaction, `list ${namespace}.${service} rules`);
        }
        let err;
        try {
            this[skeleton_1.kMaybeAlreadyDisposed]();
            const rules = await this[kSelector].rules(namespace, service);
            logger.trace("Consumer" /* Consumer */, Consumer.name, "rules", transaction, "service rules:", rules);
            return rules;
        }
        catch (e) {
            err = e;
        }
        finally {
            this[skeleton_1.kAPICollector]("Consumer.rules", ((0, process_1.uptime)() - startTime) * utils_1.kSeconds, err);
        }
        logger.trace("Consumer" /* Consumer */, Consumer.name, "rules", transaction, "exception", err);
        throw err;
    }
    /**
     * 强制刷新缓存
     * @param namespace 服务名字空间
     * @param service 服务名
     * @param type 数据存储类别
     */
    async update(namespace, service, type) {
        const startTime = (0, process_1.uptime)();
        const { [skeleton_1.kLogger]: logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Consumer" /* Consumer */, Consumer.name, "update", transaction, `update ${namespace}.${service} ${type}`);
        }
        let err;
        try {
            this[skeleton_1.kMaybeAlreadyDisposed]();
            const hasUpdated = await this[kRegistry].update(type, namespace, service);
            logger.trace("Consumer" /* Consumer */, Consumer.name, "update", transaction, hasUpdated ? "no updates" : `updated ${type}`);
            return hasUpdated;
        }
        catch (e) {
            err = e;
        }
        finally {
            this[skeleton_1.kAPICollector]("Consumer.update", ((0, process_1.uptime)() - startTime) * utils_1.kSeconds, err);
        }
        logger.trace("Consumer" /* Consumer */, Consumer.name, "update", transaction, "exception", err);
        throw err;
    }
}
exports.InternalConsumer = InternalConsumer;
class Consumer extends InternalConsumer {
    /**
     * Create Consumer
     * @param plugins 插件
     * @param options 配置参数（可选）
     */
    constructor(plugins, options = {}) {
        var _b;
        super(plugins, options);
        __classPrivateFieldSet(_b = Consumer, _a, __classPrivateFieldGet(_b, _a, "f", _Consumer_currentInstances) + 1, "f", _Consumer_currentInstances);
        if (__classPrivateFieldGet(Consumer, _a, "f", _Consumer_currentInstances) >= __classPrivateFieldGet(Consumer, _a, "f", _Consumer_maxInstances)) {
            (0, skeleton_1.emitMaxInstancesExceededWarning)("Consumer", __classPrivateFieldGet(Consumer, _a, "f", _Consumer_maxInstances));
        }
    }
    /**
     * 当前可实例化的最大次数
     */
    static get maxInstances() {
        return __classPrivateFieldGet(Consumer, _a, "f", _Consumer_maxInstances);
    }
    /**
     * 设置可实例化的最大次数
     * @param n 最大次数
     */
    static setMaxInstances(n) {
        if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
            throw new errors_1.ArgumentError("|n| must be a non-negative number");
        }
        __classPrivateFieldSet(Consumer, _a, n, "f", _Consumer_maxInstances);
    }
    /**
     * 销毁（释放）所占资源
     * @param sync 是否同步释放（可选）
     */
    dispose(sync = false) {
        var _b;
        if (this[skeleton_1.kDisposed]) {
            return;
        }
        super.dispose(sync);
        __classPrivateFieldSet(_b = Consumer, _a, __classPrivateFieldGet(_b, _a, "f", _Consumer_currentInstances) - 1, "f", _Consumer_currentInstances);
        if (__classPrivateFieldGet(Consumer, _a, "f", _Consumer_currentInstances) < 0) {
            (0, utils_1.UNREACHABLE)();
        }
    }
}
exports.Consumer = Consumer;
_a = Consumer;
_Consumer_currentInstances = { value: 0 };
_Consumer_maxInstances = { value: void 0 };
(() => {
    let maxInstances = 10;
    const { POLARIS_CONSUMER_INSTANCE_LIMIT } = process.env;
    if (POLARIS_CONSUMER_INSTANCE_LIMIT !== undefined) {
        maxInstances = parseInt(POLARIS_CONSUMER_INSTANCE_LIMIT, 10);
        maxInstances = (maxInstances === 0 /** Unlimited */ ? Infinity : maxInstances);
    }
    _a.setMaxInstances(maxInstances);
})();
//# sourceMappingURL=index.js.map