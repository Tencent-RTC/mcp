"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisBaseAdapter = void 0;
const process_1 = require("process");
const __1 = require("../../../..");
const location_1 = require("../../../../location");
const plugins_1 = require("../../../../plugins");
const utils_1 = require("../../../../utils");
const pool_1 = require("../pool");
const types_1 = require("../types");
const utils_2 = require("../utils");
const kErrorLevel = 300000;
const kExceptionLevel = 500000;
const kServiceNotFoundLevel = 400000;
/**
 * 由于 class ... implements ... 中 class 必须要实现 implements 中的接口，
 * 并且 `Mixin` 方法无法组合（继承）类型，故在此仅实现 `Boxable` 接口
 */
class PolarisBaseAdapter {
    constructor(remotes) {
        this.remotes = remotes;
        this.mode = plugins_1.OperatingMode.Internal;
        this.pool = new pool_1.ClientPool(this.buildClient.bind(this), this.options);
        this.disposeFuncs = Object.create(null);
        this.disposed = false;
        this.initializeStatus = {
            promise: null,
            initialized: false /** fast case */
        };
        this.loc = Object.assign({}, location_1.blankLocation /** copy */);
        /**
         * (empty constructor)
         */
    }
    setLogger(logger) {
        this.logger || (this.logger = logger);
    }
    get location() {
        return this.loc;
    }
    // #region dispose
    async dispose() {
        var _a, _b;
        const { initializeStatus, logger } = this;
        /** 等待初始化完成后再销毁 */
        if (!initializeStatus.initialized && initializeStatus.promise) {
            try {
                await initializeStatus.promise;
            }
            catch (e) {
                /**
                 * 当初始化发生异常时，会回滚 `bootstrap()` 已创建对象，
                 * 由于 `mainConsumer` 复用了当前的插件实例，
                 * 从而导致当前实例的 `dispose` 方法也会被调用，而当前实例并不能被释放。
                 * 故初始化发生异常时，直接返回不做任何处理。
                 */
                return;
            }
        }
        logger.trace("Plugins" /* Plugins */, this.name, "dispose", undefined, "started");
        this.disposed = true;
        Object.values(this.disposeFuncs).forEach(func => func());
        this.pool.dispose();
        (_a = this.mainConsumer) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this.stickyConsumer) === null || _b === void 0 ? void 0 : _b.dispose();
        logger.trace("Plugins" /* Plugins */, this.name, "dispose", undefined, "dispose completed");
    }
    get isDisposed() {
        return this.disposed;
    }
    // #endregion
    // #region request
    /**
     * 由于 `stickyConsumer` 仅用于少数调用，
     * 故在一般情况下（如：仅使用 Consumer 时）不会被调用，
     * 在这里做延迟初始化以节省内存开销
     */
    buildStickyConsumer() {
        if (this.stickyConsumer === undefined) {
            this.stickyConsumer = new __1.InternalConsumer({
                [plugins_1.PluginType.NamingService]: this,
                [plugins_1.PluginType.LocalRegistry]: this.localRegistry,
                [plugins_1.PluginType.LoadBalancer]: new __1.HashRingLoadBalancer()
            }, undefined, this.logger);
        }
        return this.stickyConsumer;
    }
    async selectBackend(consumer, service, key) {
        if (this.disposed) {
            throw new __1.StateError("Already disposed");
        }
        const { protocol, logger } = this;
        const caller = {
            namespace: "",
            service: "",
            metadata: {
                protocol
            }
        };
        const callee = {
            namespace: this.options.polarisNamespace,
            service,
            metadata: {
                protocol
            }
        };
        const { transaction } = logger;
        logger.trace("Plugins" /* Plugins */, this.name, "selectBackend", transaction, "query service is", service);
        const response = await consumer.select(callee, caller, {
            [plugins_1.PluginType.LoadBalancer]: key
        });
        if (response) {
            if (logger.tracingEnabled) {
                const { instance: { host, port } } = response;
                logger.trace("Plugins" /* Plugins */, this.name, "selectBackend", transaction, `${service} backend is ${host}:${port}`);
            }
            return response;
        }
        logger.trace("Plugins" /* Plugins */, this.name, "selectBackend", transaction, `query ${service} failed`);
        /**
         * 在某些特定场景下，后端不一定实现了全量服务，故在此采用 ServiceNotFound 异常
         */
        throw new __1.ServiceNotFound(`${callee.namespace}.${service} not found`);
    }
    /**
     * 此函数签名用于实现
     *
     * @note
     *  TS 参数需满足双向协变要求，故需将 |payload| 由联合类型 (Union Type) 转为交集类型 (Intersection Type)，
     *  但由于 TS 所限，如使用泛型类型 `UnionToIntersection<T>` 转换，|payload| 会推导出 `unkown` 类型。
     *  鉴于上述问题，做出如下处理：
     *    * 在实现时，采用明确类型签名；
     *    * 在调用时，提供泛型签名；
     */
    async requestBackend(type, service, method, payload, key) {
        const calledInstances = [];
        let lastError;
        const { logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Plugins" /* Plugins */, this.name, "requestBackend", transaction, `request ${service}#${method} with`, payload, key ? `by ${key}` : "");
        }
        for (;;) {
            let comsumer = this.mainConsumer;
            if (typeof key === "string") {
                comsumer = this.buildStickyConsumer();
            }
            /**
             * 当在初始化过程中发生穿透调用（访问 `polarisNamespace.discoverService`）时，
             * `consumer` 有可能不存在（由于初始化失败被释放），
             * 则直接抛出上次调用异常，不再进行重试。
             */
            if (comsumer === undefined) {
                /**
                 * 当 `consumer` 不存在时，`lastError` 一定存在。
                 * _也就是说：至少有一次调用_
                 */
                if (lastError === undefined) {
                    (0, utils_1.UNREACHABLE)();
                }
                throw lastError;
            }
            const instanceResponse = await this.selectBackend(comsumer, service, key);
            const { instance, callee } = instanceResponse;
            if (calledInstances.includes(instance)) {
                throw new __1.NetworkError(lastError);
            }
            /**
             * 如目标实例为预置实例，则上报被调名增加特定后缀
             */
            if (instance.version === utils_2.kInstanceLocalVersion) {
                callee.service += this.options.presetSuffix;
            }
            calledInstances.push(instance);
            if (logger.tracingEnabled) {
                const { host, port } = instance;
                logger.trace("Plugins" /* Plugins */, this.name, "requestBackend", transaction, `call ${host}:${port}`);
            }
            const startTime = (0, process_1.uptime)();
            let callResponse;
            try {
                callResponse = await this.pool.getOrCreateClient(instance, type)[method](payload);
            }
            catch (e) {
                instanceResponse.update(false, ((0, process_1.uptime)() - startTime) * utils_1.kSeconds);
                const { host, port } = instance;
                logger.error(`[${this.name}] [requestBackend] call ${this.options.polarisNamespace}.${service}#${method}(${host}:${port}) exception`, e);
                logger.trace("Plugins" /* Plugins */, this.name, "requestBackend", transaction, "failed with err", e);
                lastError = e;
                continue;
            }
            const code = this.unbox(callResponse.code, NaN);
            instanceResponse.update(true, ((0, process_1.uptime)() - startTime) * utils_1.kSeconds, `${code || 0}`);
            logger.trace("Plugins" /* Plugins */, this.name, "requestBackend", transaction, "finished with code", code);
            return callResponse;
        }
    }
    /**
     * 追踪后端调用结果
     * @param transaction 追踪 ID
     * @param method 调用函数名
     * @param response 后端响应
     */
    tracingResponse(transaction, method, response) {
        const { logger } = this;
        if (logger.tracingEnabled) {
            const code = this.unbox(response.code, NaN);
            const info = this.unbox(response.info, "");
            logger.trace("Plugins" /* Plugins */, this.name, method, transaction, `response code is ${code} and with info: ${info}`);
        }
    }
    /**
     * 判断后端调用是否成功（不成功则抛出异常）
     * @param response 后端响应
     * @param namespace 命名空间
     * @param service 服务名
     */
    maybeErrorResponse(response, namespace, service) {
        const code = this.unbox(response.code, NaN);
        const info = this.unbox(response.info, "");
        if (Number.isNaN(code)) {
            throw new __1.InvalidResponse("Illegal response");
        }
        if (code >= kErrorLevel) {
            const message = `[${code}] [${namespace}.${service}] ${info}`;
            if (code >= kExceptionLevel) {
                throw new __1.ServerException(message);
            }
            if (code >= kServiceNotFoundLevel) {
                throw new __1.ServiceNotFound(message);
            }
            throw new __1.ServerError(message);
        }
    }
    /**
     * 判断后端调用是否成功
     * @param response 后端响应
     * @param level 比较级别（默认为 `kErrorLevel`）
     */
    isSuccessResponse(response, level = kErrorLevel) {
        return this.unbox(response.code, NaN) < level;
    }
    // #endregion
    // #region initialize
    async waitForInitialized() {
        const { initializeStatus, logger } = this;
        const { transaction } = logger;
        if (initializeStatus.promise === null) {
            /*
             * note:
             * 这里必须先创建 Promise {<pending>}，
             * 避免 `bootstrap()` 未返回时又进行调用造成死循环
             */
            let resolve;
            let reject;
            initializeStatus.promise = new Promise((...args) => {
                [resolve, reject] = args;
            });
            logger.trace("Plugins" /* Plugins */, this.name, "waitForInitialized", transaction, "start bootstrap");
            this.bootstrap().then(resolve, (err) => {
                var _a;
                /** 回滚 `bootstrap()` 已创建对象 */
                (_a = this.mainConsumer) === null || _a === void 0 ? void 0 : _a.dispose(true);
                initializeStatus.promise = null;
                this.localRegistry = undefined;
                this.local = undefined;
                this.loc = Object.assign({}, location_1.blankLocation);
                this.mainConsumer = undefined;
                reject(err);
            });
        }
        else {
            logger.trace("Plugins" /* Plugins */, this.name, "waitForInitialized", transaction, "waiting for latest bootstrap function execution complete");
        }
        try {
            await initializeStatus.promise;
        }
        catch (e) {
            logger.trace("Plugins" /* Plugins */, this.name, "waitForInitialized", transaction, "bootstrap with exception", e);
            throw e;
        }
        initializeStatus.initialized = true;
        logger.trace("Plugins" /* Plugins */, this.name, "waitForInitialized", transaction, "bootstrap success");
    }
    // eslint-disable-next-line max-lines-per-function
    async bootstrap() {
        const { logger, protocol, options: { polarisNamespace, discoverService, detectionTimeout, bootstrapOnly } } = this;
        const { transaction } = logger;
        // #region 构建 Consumer
        /*
         * 在启动时，通过配置（北极星实例与规则路由）打底缓存，断路调用链
         * _也就是说，启动时通过 `mainConsumer` 查询北极星远端实例，不再调用此插件_
         * 这样做归一化了启动流程，其它接口无需再做区分（是否为启动流程）
         */
        this.localRegistry = new __1.MemoryOnlyRegistry();
        this.localRegistry[plugins_1.RegistryCategory.Instance].set(polarisNamespace, discoverService, {
            revision: "",
            data: (0, utils_2.address2Instance)(this.remotes, this.protocol)
        });
        this.localRegistry[plugins_1.RegistryCategory.Rule].set(polarisNamespace, discoverService, {
            data: {
                in: [{
                        sources: [{ service: "*", metadata: { protocol } }],
                        destinations: [{ service: "*", priority: 0, weight: 1, metadata: { protocol } }]
                    }],
                out: []
            },
            revision: ""
        });
        logger.trace("Plugins" /* Plugins */, this.name, "bootstrap", transaction, "initialized LocalRegistryPlugin with address", this.remotes);
        const mainConsumer = new __1.InternalConsumer({
            [plugins_1.PluginType.NamingService]: this,
            [plugins_1.PluginType.LocalRegistry]: this.localRegistry,
            [plugins_1.PluginType.CircuitBreaker]: new __1.PolarisCircuitBreaker({
                continuousErrors: 1 /** 由于调用量低，故降低阈值，快速熔断 */
            }),
            [plugins_1.PluginType.LoadBalancer]: new __1.StickyLoadBalancer(new __1.WRLoadBalancer(), {
                expireTime: this.options.switchDuration
            })
        }, {
            /** 北极星后端变更极少，降低刷新时间，以优化后端压力 */
            refreshTime: {
                [plugins_1.RegistryCategory.Instance]: 1 * utils_1.kHours,
                [plugins_1.RegistryCategory.Ratelimit]: 1 * utils_1.kHours
            },
            /** 配置实例与规则的脏数据时间为无穷大，避免死循环 */
            dirtyTime: {
                [plugins_1.RegistryCategory.Instance]: Infinity,
                [plugins_1.RegistryCategory.Rule]: Infinity
            },
            recycleTime: Infinity
        }, logger);
        this.mainConsumer = mainConsumer;
        // #endregion
        // #region 更新 Discover Service 远端
        let parallelTask = [];
        if (bootstrapOnly) {
            logger.trace("Plugins" /* Plugins */, this.name, "bootstrap", transaction, "update discover remote");
            parallelTask = [
                mainConsumer.update(polarisNamespace, discoverService, plugins_1.RegistryCategory.Rule),
                mainConsumer.update(polarisNamespace, discoverService, plugins_1.RegistryCategory.Instance)
            ];
        }
        // #endregion
        // #region 获取本地对应的 IP 地址
        logger.trace("Plugins" /* Plugins */, this.name, "bootstrap", transaction, "fetch local address");
        parallelTask.push((0, utils_2.fastestRemote)(this.remotes.map(remote => (0, utils_2.address2Endpoint)(remote)), detectionTimeout));
        // #endregion
        // #region 等待所有异步任务完成
        const taskResult = await Promise.all(parallelTask);
        if (bootstrapOnly) {
            this.pool.truncate(); // 远端实例更新完成时，断开所有引导实例
            logger.trace("Plugins" /* Plugins */, this.name, "bootstrap", transaction, "discover remote update completed");
        }
        this.local = taskResult[taskResult.length - 1].local;
        logger.trace("Plugins" /* Plugins */, this.name, "bootstrap", transaction, "local adddress is", this.local.host);
        // #endregion
        // #region 获得客户端 `Location`
        logger.trace("Plugins" /* Plugins */, this.name, "bootstrap", transaction, "locate client location");
        let client;
        for (let i = 0; i < this.remotes.length; i += 1) { // eslint-disable-line @typescript-eslint/prefer-for-of
            logger.trace("Plugins" /* Plugins */, this.name, "bootstrap", transaction, "querying", this.remotes[i]);
            const response = await this.requestBackend(types_1.ServiceType.Discover, discoverService, "reportClient", {
                host: (0, utils_2.isAnyAddr)(this.local.host) ? null : this.box(this.local.host),
                version: this.box(utils_1.kModuleVersion),
                type: types_1.ClientType.SDK
            });
            if (this.isSuccessResponse(response)) {
                ({ client } = response);
            }
            if (this.isSuccessResponse(response, kExceptionLevel)) {
                break;
            }
            else if (logger.tracingEnabled) {
                logger.trace("Plugins" /* Plugins */, this.name, "bootstrap", transaction, "exception for locate location, response code is", this.unbox(response.code, NaN));
            }
        }
        logger.trace("Plugins" /* Plugins */, this.name, "bootstrap", transaction, "client location is", client === null || client === void 0 ? void 0 : client.location);
        /*
         * note:
         *  当得不到 `location` 信息时，不走就近调用相关逻辑
         */
        if (client === null || client === void 0 ? void 0 : client.location) {
            const { location: { campus, region, zone } } = client;
            this.loc = {
                campus: this.unbox(campus, ""),
                region: this.unbox(region, ""),
                zone: this.unbox(zone, "")
            };
        }
        else {
            logger.info(`[${this.name}] [bootstrap], client location not found`);
        }
        // #endregion
    }
}
exports.PolarisBaseAdapter = PolarisBaseAdapter;
//# sourceMappingURL=base.js.map