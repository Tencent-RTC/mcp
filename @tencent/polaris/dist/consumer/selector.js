"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalSelector = exports.InternalSelector = void 0;
const errors_1 = require("../errors");
const instance_1 = require("../instance");
const location_1 = require("../location");
const metadata_1 = require("../metadata");
const plugins_1 = require("../plugins");
const kDefaultOptions = {
    /**
     * 探活任务最大探测次数
     */
    maxProbes: 3,
    /**
     * 是否启用全死全活，当节点全部不健康时，是否返回
     */
    enableRecover: true
};
/**
 * @description
 * 实例选取规则：
 *  in ---> [Router Chain] ---> out
 */
class InternalSelector {
    constructor(global, logger, health, registry, routers, lb, options) {
        this.global = global;
        this.logger = logger;
        this.health = health;
        this.registry = registry;
        this.routers = routers;
        this.lb = lb;
        this.fuseStat = Object.create(null);
        this.requisite = plugins_1.RequisiteBitfield.None;
        this.disposed = false;
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
        /**
         * 合并全部路由插件所需的前置要求
         */
        this.requisite = this.routers.reduce((acc, cur) => acc | cur.requisite, plugins_1.RequisiteBitfield.None);
    }
    dispose() {
        this.disposed = true;
    }
    async select(callee, caller, args = {}) {
        if (this.disposed) {
            throw new errors_1.StateError("Already disposed");
        }
        const { logger } = this;
        const { transaction } = logger;
        let rules;
        // #region RequisiteBitfield.Rule
        if (this.requisite & plugins_1.RequisiteBitfield.Rule) {
            logger.trace("Consumer" /* Consumer */, InternalSelector.name, "select", transaction, "start fetch callee routing rule");
            const promises = [this.registry.fetch(plugins_1.RegistryCategory.Rule, callee.namespace, callee.service)];
            if (caller) {
                const { namespace, service } = caller;
                /**
                 * 主调 `namespace` 与 `service` 均填写才查询规则，
                 * 否则仅使用 `metadata` 与规则的 `sources.metadata` 进行匹配
                 */
                if (namespace && service) {
                    logger.trace("Consumer" /* Consumer */, InternalSelector.name, "select", transaction, "start fetch caller routing rule");
                    promises.push(this.registry.fetch(plugins_1.RegistryCategory.Rule, caller.namespace, caller.service));
                }
            }
            /**
             * 规则路由仅对一方生效
             * 入站规则 `in` 优先于出站规则 `out`
             */
            ({ in: rules } = await promises[0]);
            if (promises.length > 1) {
                if (rules.length === 0) {
                    ({ out: rules } = await promises[1]);
                }
                else {
                    promises[1].catch(() => { });
                }
            }
            logger.trace("Consumer" /* Consumer */, InternalSelector.name, "select", transaction, "combined callee and caller routing rule:", rules);
        }
        else {
            logger.trace("Consumer" /* Consumer */, InternalSelector.name, "select", transaction, "plugins do not require routing rule");
        }
        // #endregion
        const { filtered, recovered, service, transfer } = await this.routing(callee, rules, caller, args[plugins_1.PluginType.ServiceRouter]);
        /**
         * 如果存在 `transfer` 转发，
         * 则将 `transfer` 作为目标服务名，再次调用查询。
         * _当前查询作废（不再进行任何匹配），以新查询结果作为返回_
         */
        if (transfer) {
            logger.trace("Consumer" /* Consumer */, InternalSelector.name, "select", transaction, "transfer to service:", transfer);
            callee.service = transfer;
            return this.select(callee, caller, args);
        }
        logger.trace("Consumer" /* Consumer */, InternalSelector.name, "select", transaction, "routing plugins filtered instances is", filtered);
        if (filtered.length > 0) { /** hot path */
            if (recovered) {
                logger.trace("Consumer" /* Consumer */, InternalSelector.name, "select", transaction, "recovered all instances");
                /*
                 * note:
                 *  为了更快返回，这里采用异步上报
                 */
                setImmediate(() => {
                    this.health.recoverAll(callee.namespace, service, filtered);
                });
            }
            const instances = this.choose(callee.namespace, service, filtered, args[plugins_1.PluginType.LoadBalancer]);
            logger.trace("Consumer" /* Consumer */, InternalSelector.name, "select", transaction, "lb plugin choosen and method returned instance is", filtered);
            return instances;
        }
        return null;
    }
    async list(namespace, service) {
        if (this.disposed) {
            throw new errors_1.StateError("Already disposed");
        }
        return this.registry.fetch(plugins_1.RegistryCategory.Instance, namespace, service);
    }
    async rules(namespace, service) {
        if (this.disposed) {
            throw new errors_1.StateError("Already disposed");
        }
        return this.registry.fetch(plugins_1.RegistryCategory.Rule, namespace, service);
    }
    async executor(callee, destination, source, instances = []) {
        const { service, metadata, level } = destination;
        let requestedService = "";
        let pickedInstances = instances;
        // #region Step 1 - 当备选实例为空时，通过服务名获取服务所有实例
        if (instances.length === 0) {
            /**
             * `service` 不存在、为空或为 `"*""` 时，则认为可访问用户请求的目标服务
             */
            requestedService = !service || service === "*" ? callee.service : service;
            pickedInstances = await this.registry.fetch(plugins_1.RegistryCategory.Instance, callee.namespace, requestedService);
        }
        if (pickedInstances.length === 0) {
            return {
                instances: [],
                service: requestedService
            };
        }
        // #endregion
        // #region Step 2 - 匹配 `Metadata` 规则
        if (metadata) {
            pickedInstances = pickedInstances.filter(instance => { var _a; return (0, metadata_1.isMetadataMatch)(instance.metadata, metadata, this.global.globalVariables, (_a = source === null || source === void 0 ? void 0 : source.parameters) !== null && _a !== void 0 ? _a : {}); });
        }
        if (pickedInstances.length === 0) {
            return {
                instances: [],
                service: requestedService
            };
        }
        // #endregion
        // #region Step 3 - 匹配 `Location` 位置信息
        const { location } = this.registry;
        if (location && level !== undefined) {
            const nearbyInstances = pickedInstances.filter(instance => (0, location_1.isLocationMatch)(instance.location, location, level));
            if (nearbyInstances.length > 0 || level !== 0 /* Region */) {
                pickedInstances = nearbyInstances;
            }
        }
        // #endregion
        return {
            instances: pickedInstances,
            service: requestedService
        };
    }
    /* eslint-enable @typescript-eslint/unified-signatures */
    // eslint-disable-next-line max-lines-per-function
    async routing(callee, rules, caller, args, 
    // #region for recursive call only
    routers = this.routers, service = callee.service, filtered = []
    // #endregion
    ) {
        var _a;
        const { logger } = this;
        const { transaction } = logger;
        // #region 栈顶
        if (routers.length === 0) {
            let choosable = filtered.filter(instance => (0, instance_1.isChoosableInstance)(instance));
            let recovered = false;
            if (choosable.length === 0 && this.options.enableRecover) {
                choosable = filtered;
                recovered = true;
            }
            logger.trace("Consumer" /* Consumer */, InternalSelector.name, "routing", transaction, "reached the top of the stack, and returned instances is", choosable);
            return {
                filtered: choosable,
                service,
                recovered
            };
        }
        // #endregion
        const [router] = routers;
        let routingChain = routers.slice(1);
        let currentInstances = [];
        let currentService = "";
        let hasFound = false;
        let bypassThis = false;
        for (const queryCommand of router.query(callee, rules, caller, args === null || args === void 0 ? void 0 : args[router.name])) {
            const { source, destination, controller } = queryCommand;
            if (logger.tracingEnabled) {
                logger.trace("Consumer" /* Consumer */, InternalSelector.name, "routing", transaction, `destination query command generated by plugin ${router.name}:`, queryCommand);
            }
            if (destination === null || destination === void 0 ? void 0 : destination.transfer) {
                return {
                    filtered: [],
                    transfer: destination.transfer,
                    service
                };
            }
            const result = await this.executor(callee, destination !== null && destination !== void 0 ? destination : { service: "*" }, source, filtered);
            ({ instances: currentInstances, service: currentService } = result);
            logger.trace("Consumer" /* Consumer */, InternalSelector.name, "routing", transaction, "execute command and get instances is", currentInstances, "service is", currentService);
            hasFound || (hasFound = currentInstances.length > 0);
            let action;
            if (typeof router.filter === "function") {
                ({ filtered: currentInstances, action } = router.filter(currentInstances, queryCommand, args === null || args === void 0 ? void 0 : args[router.name]));
                if (logger.tracingEnabled) {
                    logger.trace("Consumer" /* Consumer */, InternalSelector.name, "routing", transaction, `plugin ${router.name} implemented filter method and get filtered instances is`, currentInstances);
                }
            }
            // #region Controller
            if (controller) {
                action || (action = controller[hasFound ? plugins_1.RoutingCondition.Found : plugins_1.RoutingCondition.NotFound]);
            }
            let needBreak = false;
            if (action) {
                logger.trace("Consumer" /* Consumer */, InternalSelector.name, "routing", transaction, "plugin output and override action is", action);
                // #region RoutingAction.Break
                needBreak = (_a = action[plugins_1.RoutingAction.Break]) !== null && _a !== void 0 ? _a : false;
                // #endregion
                // #region RoutingAction.Bypass
                const bypassedRouters = action[plugins_1.RoutingAction.Bypass];
                if (bypassedRouters) {
                    routingChain = routingChain.filter(node => bypassedRouters.indexOf(node.name) === -1);
                    if (bypassedRouters.indexOf(router.name) !== -1) {
                        logger.trace("Consumer" /* Consumer */, InternalSelector.name, "routing", transaction, "bypass current routing layer");
                        currentInstances = filtered;
                        bypassThis = true;
                    }
                }
                // #endregion
            }
            // #endregion
            if (needBreak || bypassThis || currentInstances.length > 0) {
                logger.trace("Consumer" /* Consumer */, InternalSelector.name, "routing", transaction, "stop query current plugin");
                break;
            }
        }
        currentService || (currentService = service);
        if (currentInstances.length > 0 || (bypassThis && filtered.length === 0)) {
            logger.trace("Consumer" /* Consumer */, InternalSelector.name, "routing", transaction, "call next routing layer");
            return this.routing(callee, rules, caller, args, routingChain, currentService, currentInstances);
        }
        logger.trace("Consumer" /* Consumer */, InternalSelector.name, "routing", transaction, "returned empty instances");
        return {
            filtered: [],
            service: currentService
        };
    }
    choose(namespace, service, instances, args) {
        const { logger } = this;
        const instance = this.lb.choose(namespace, service, instances, args);
        logger.trace("Consumer" /* Consumer */, InternalSelector.name, "choose", "plugin choosen and returned instance is", instance);
        /*
         * 如负载均衡插件选出的实例状态为 `HalfOpen`，则根据实例调用次数进行不同的处理：
         *  * 实例调用次数小于 `maxProbes` 时：返回此实例，并将 _调用次数 + 1_
         *  * 实例调用次数等于 `maxProbes` 时：
         *    * 设置实例状态为半关闭 `HalfClose`
         *    * 将调用次数重置为 0
         */
        if (instance.status === 1 /* HalfOpen */) {
            let fuseStat = this.fuseStat[`${namespace}.${service}`];
            if (!fuseStat) {
                fuseStat = new WeakMap();
                this.fuseStat[`${namespace}.${service}`] = fuseStat;
            }
            const totalCall = (fuseStat.get(instance) || 0) + 1;
            if (totalCall < this.options.maxProbes) {
                fuseStat.set(instance, totalCall);
            }
            else if (totalCall === this.options.maxProbes) {
                if (logger.tracingEnabled) {
                    logger.trace("Consumer" /* Consumer */, InternalSelector.name, "choose", "change instance status to HalfClose, because totalCall(${totalCall}) has reached maxProbes(${this.options.maxProbes})");
                }
                this.health.changeStatus(namespace, service, instance, 2 /* HalfClose */, `[selector] [choose], totalCall(${totalCall}) == maxProbes(${this.options.maxProbes})`);
                fuseStat.set(instance, 0);
            }
        }
        return instance;
    }
}
exports.InternalSelector = InternalSelector;
class ExternalSelector {
    constructor(naming) {
        this.naming = naming;
        /**
         * (empty function)
         */
    }
    async select(callee) {
        return this.naming.select(callee.namespace, callee.service, callee.metadata);
    }
    async list(namespace, service) {
        const { data: instances } = await this.naming.list(namespace, service);
        return instances;
    }
    async rules(namespace, service) {
        return (await this.naming.routingRules(namespace, service)).data;
    }
}
exports.ExternalSelector = ExternalSelector;
//# sourceMappingURL=selector.js.map