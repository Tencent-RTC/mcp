"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisDiscoverAdapter = void 0;
const util_1 = require("util");
const __1 = require("../../../..");
const location_1 = require("../../../../location");
const plugins_1 = require("../../../../plugins");
const utils_1 = require("../../../../utils");
const rules_1 = require("../rules");
const types_1 = require("../types");
const utils_2 = require("../utils");
const base_1 = require("./base");
const kDefaultRegisterOptions = {
    enableHealthCheck: true,
    healthCheckType: plugins_1.HealthCheckType.HEARTBEAT,
    healthCheckTTL: 5
};
class PolarisDiscoverAdapter extends base_1.PolarisBaseAdapter {
    async list(namespace, service, revision) {
        if (!this.initializeStatus.initialized) {
            const signal = this.waitForInitialized();
            const { polarisNamespace, discoverService } = this.options;
            /**
             * 当请求 `polarisNamespace.discoverService` 时，无需等待初始化完成
             */
            if (namespace !== polarisNamespace || service !== discoverService) {
                await signal;
            }
            else {
                signal.catch(() => {
                    /**
                     * (empty function)
                     *
                     * 仅当请求 `polarisNamespace.discoverService` 时才会使用此分支，
                     * 为了避免 `unhandledRejection`，__进行捕获__。
                     * 但由于如下两个原因，忽略捕获的异常：
                     * * 由用户直接发起的调用：初始化异常和调用返回的异常几乎相同。
                     * * 由初始化函数发起的调用：异常已经被上层处理函数捕获。
                     */
                });
            }
        }
        const { logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Plugins" /* Plugins */, this.name, "list", transaction, `request ${namespace}.${service}${(revision !== null && revision !== void 0 ? revision : "") && `@${revision}`}`);
        }
        const response = await this.requestBackend(types_1.ServiceType.Discover, this.options.discoverService, "discover", {
            type: types_1.DiscoverRequestType.INSTANCE,
            service: {
                namespace: this.box(namespace),
                name: this.box(service),
                revision: this.box(revision)
            }
        });
        this.tracingResponse(transaction, "list", response);
        this.maybeErrorResponse(response, namespace, service);
        if (!response.service) {
            (0, utils_1.UNREACHABLE)();
        }
        if (revision !== undefined && this.unbox(response.service.revision, "") === revision) {
            logger.trace("Plugins" /* Plugins */, this.name, "list", transaction, "revision is equal");
            return {
                data: [],
                revision
            };
        }
        logger.trace("Plugins" /* Plugins */, this.name, "list", transaction, "response instances length is", response.instances.length);
        const instances = this.procInstances(response);
        logger.trace("Plugins" /* Plugins */, this.name, "list", transaction, "returned instances is", instances);
        return {
            data: instances,
            revision: this.unbox(response.service.revision, "")
        };
    }
    async routingRules(namespace, service, revision) {
        if (!this.initializeStatus.initialized) {
            const signal = this.waitForInitialized();
            const { polarisNamespace, discoverService } = this.options;
            /**
             * 当请求 `polarisNamespace.discoverService` 时，无需等待初始化完成
             */
            if (namespace !== polarisNamespace || service !== discoverService) {
                await signal;
            }
            else {
                signal.catch(() => {
                    /**
                     * (empty function)
                     *
                     * 仅当请求 `polarisNamespace.discoverService` 时才会使用此分支，
                     * 为了避免 `unhandledRejection`，__进行捕获__。
                     * 但由于如下两个原因，忽略捕获的异常：
                     * * 由用户直接发起的调用：初始化异常和调用返回的异常几乎相同。
                     * * 由初始化函数发起的调用：异常已经被上层处理函数捕获。
                     */
                });
            }
        }
        const { logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Plugins" /* Plugins */, this.name, "routingRules", transaction, `request ${namespace}.${service}${(revision !== null && revision !== void 0 ? revision : "") && `@${revision}`}`);
        }
        const response = await this.requestBackend(types_1.ServiceType.Discover, this.options.discoverService, "discover", {
            type: types_1.DiscoverRequestType.ROUTING,
            service: {
                namespace: this.box(namespace),
                name: this.box(service)
            }
        });
        this.tracingResponse(transaction, "routingRules", response);
        this.maybeErrorResponse(response, namespace, service);
        const { routing } = response;
        if (!routing /** 当 `routing` 不存在时，认为 `routing` 为空不匹配。 */
            || (revision !== undefined && this.unbox(routing.revision, "") === revision)) {
            logger.trace("Plugins" /* Plugins */, this.name, "routingRules", transaction, "empty rule or revision is equal");
            return {
                data: {
                    in: [],
                    out: []
                },
                revision: routing ? (revision !== null && revision !== void 0 ? revision : "") : ""
            };
        }
        let { routingRuleProcessor } = this;
        if (routingRuleProcessor === undefined) {
            routingRuleProcessor = new rules_1.RuleProcessor(this.unbox.bind(this));
            this.routingRuleProcessor = routingRuleProcessor;
        }
        const rules = {
            in: Array.isArray(routing.inbounds) ? routingRuleProcessor.procRules(routing.inbounds) : [],
            out: Array.isArray(routing.outbounds) ? routingRuleProcessor.procRules(routing.outbounds) : []
        };
        logger.trace("Plugins" /* Plugins */, this.name, "routingRules", transaction, "returned rules is", rules);
        return {
            data: rules,
            revision: this.unbox(routing.revision, "")
        };
    }
    async register(namespace, service, token, instance, options) {
        if (!this.initializeStatus.initialized) {
            await this.waitForInitialized();
        }
        const opt = Object.assign(Object.assign({}, kDefaultRegisterOptions), options);
        const { logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Plugins" /* Plugins */, this.name, "register", transaction, `register ${instance.host}:${instance.port} to ${namespace}.${service} with options ${(0, util_1.inspect)(opt.enableHealthCheck)}}`);
        }
        const response = await this.requestBackend(types_1.ServiceType.Discover, this.options.discoverService, "registerInstance", {
            namespace: this.box(namespace),
            service: this.box(service),
            host: this.box(instance.host),
            port: this.box(instance.port),
            protocol: this.box(instance.protocol),
            weight: this.box(instance.staticWeight),
            metadata: instance.metadata,
            version: this.box(instance.version),
            healthy: this.box(instance.status === 0 /* Normal */),
            isolate: this.box(instance.status === 3 /* Fused */),
            enable_health_check: this.box(opt.enableHealthCheck),
            health_check: {
                type: opt.healthCheckType,
                heartbeat: {
                    ttl: this.box(opt.healthCheckTTL)
                }
            },
            service_token: this.box(token)
        });
        this.tracingResponse(transaction, "register", response);
        this.maybeErrorResponse(response, namespace, service);
        if (!response.instance) {
            (0, utils_1.UNREACHABLE)();
        }
        const id = this.unbox(response.instance.id, "");
        logger.trace("Plugins" /* Plugins */, this.name, "register", transaction, "registered instance id is", id);
        return id;
    }
    async unregister(...args) {
        if (!this.initializeStatus.initialized) {
            await this.waitForInitialized();
        }
        const { logger } = this;
        const { transaction } = logger;
        logger.trace("Plugins" /* Plugins */, this.name, "unregister", transaction, "unregister instance with args:", args);
        const request = this.instanceTupleToRequest(args);
        if (!request) {
            throw new __1.ArgumentError("Illegal parameter");
        }
        const response = await this.requestBackend(types_1.ServiceType.Discover, this.options.discoverService, "deregisterInstance", request);
        this.tracingResponse(transaction, "unregister", response);
        return this.isSuccessResponse(response);
    }
    async heartbeat(...args) {
        if (!this.initializeStatus.initialized) {
            await this.waitForInitialized();
        }
        const { logger } = this;
        const { transaction } = logger;
        logger.trace("Plugins" /* Plugins */, this.name, "unregister", transaction, "heartbeat instance with args:", args);
        const request = this.instanceTupleToRequest(args);
        if (!request) {
            throw new __1.ArgumentError("Illegal parameter");
        }
        if (!this.stickyConsumer) {
            this.buildStickyConsumer();
        }
        if (this.local === undefined) {
            (0, utils_1.UNREACHABLE)();
        }
        const response = await this.requestBackend(types_1.ServiceType.Discover, this.options.healthcheckService, "heartbeat", request, this.local.host);
        this.tracingResponse(transaction, "heartbeat", response);
        return this.isSuccessResponse(response);
    }
    instanceTupleToRequest(args) {
        if (args.length === 2) {
            const [id, serviceToken] = args;
            if (id && serviceToken) {
                return {
                    id: this.box(id),
                    service_token: this.box(serviceToken)
                };
            }
        }
        else if (args.length === 5) {
            const [namespace, service, host, port, serviceToken] = args;
            if (namespace && service && host && serviceToken && (0, utils_2.isValidPort)(port)) {
                return {
                    namespace: this.box(namespace),
                    service: this.box(service),
                    host: this.box(host),
                    port: this.box(port),
                    service_token: this.box(serviceToken)
                };
            }
        }
        return null;
    }
    procInstances(response) {
        const { isolateUnhealthy } = this.options;
        const instances = [];
        const { metadata: serviceMetadata } = response.service;
        for (let i = 0; i < response.instances.length; i += 1) { // eslint-disable-line @typescript-eslint/prefer-for-of
            const { host, port, id, metadata: instanceMetadata, priority, protocol, weight, healthy, isolate, location, version, logic_set: logicSet, vpc_id: vpcId } = response.instances[i];
            const instanceHost = this.unbox(host, "");
            const instancePort = this.unbox(port, 0);
            const instanceId = this.unbox(id, "");
            const instanceWeight = this.unbox(weight, 0);
            const instanceHealthy = this.unbox(healthy, false);
            if (instanceHost === "" || instancePort === 0 || instanceId === "") {
                throw new __1.InvalidInstance();
            }
            /** 过滤符合条件的实例 */
            if (instanceWeight > 0 /** 实例权重大于 0 */
                && !this.unbox(isolate, false) /** 实例没有被隔离 */
                && (!isolateUnhealthy || instanceHealthy) /** 如开启 `options.isolateUnhealthy`，则过滤出健康的实例 */) {
                const instance = {
                    id: instanceId,
                    host: instanceHost,
                    port: instancePort,
                    vpcId: this.unbox(vpcId, ""),
                    staticWeight: instanceWeight,
                    version: this.unbox(version, ""),
                    logicSet: this.unbox(logicSet, ""),
                    priority: this.unbox(priority, 9),
                    protocol: this.unbox(protocol, "unknown"),
                    status: this.unbox(healthy, false) ? 0 /* Normal */ : 3 /* Fused */,
                    dynamicWeight: 0,
                    location: Object.assign({}, location_1.blankLocation /** copy */),
                    metadata: Object.assign(Object.assign({}, serviceMetadata), instanceMetadata)
                };
                if (location) {
                    instance.location = {
                        region: this.unbox(location.region, ""),
                        zone: this.unbox(location.zone, ""),
                        campus: this.unbox(location.campus, "")
                    };
                }
                instances.push(instance);
            }
        }
        return instances;
    }
}
exports.PolarisDiscoverAdapter = PolarisDiscoverAdapter;
//# sourceMappingURL=discover.js.map