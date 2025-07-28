"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalRegistry = void 0;
const events_1 = require("events");
const process_1 = require("process");
const errors_1 = require("./errors");
const instance_1 = require("./instance");
const location_1 = require("./location");
const plugins_1 = require("./plugins");
const utils_1 = require("./utils");
var EntryStatus;
(function (EntryStatus) {
    /** 正常 */
    EntryStatus[EntryStatus["Normal"] = 0] = "Normal";
    /** 过期 */
    EntryStatus[EntryStatus["Outdated"] = 1] = "Outdated";
    /** 更新中 */
    EntryStatus[EntryStatus["Updating"] = 2] = "Updating";
    /** 已释放 */
    EntryStatus[EntryStatus["Released"] = 3] = "Released";
})(EntryStatus || (EntryStatus = {}));
const kDefaultOptions = {
    // #region Time
    /**
     * 过期时间
     * 超过此时间，会 __异步__ 请求新数据
     * _也就是说，返回值可能为旧数据_
     */
    expireTime: {
        /** 实例过期时间 */
        [plugins_1.RegistryCategory.Instance]: 2 * utils_1.kSeconds,
        /** 规则过期时间 */
        [plugins_1.RegistryCategory.Rule]: 2 * utils_1.kSeconds,
        /** 限流规则过期时间 */
        [plugins_1.RegistryCategory.Ratelimit]: 2 * utils_1.kSeconds
    },
    /**
     * 刷新时间
     * 达到此时间，会自动更新数据（如数据已过期）
     * _数据刷新，并不影响资源回收策略_
     */
    refreshTime: {
        /** 实例刷新时间 */
        [plugins_1.RegistryCategory.Instance]: 10 * utils_1.kSeconds,
        /** 规则刷新时间 */
        [plugins_1.RegistryCategory.Rule]: 10 * utils_1.kSeconds,
        /** 限流规则刷新时间 */
        [plugins_1.RegistryCategory.Ratelimit]: 10 * utils_1.kSeconds
    },
    /**
     * 脏数据时间
     * 超过此时间，会 __同步__ 请求新数据
     * _也就是说，返回值一定为新数据_
     */
    dirtyTime: {
        /** 实例脏数据时间 */
        [plugins_1.RegistryCategory.Instance]: 1 * utils_1.kMinutes,
        /** 规则脏数据时间 */
        [plugins_1.RegistryCategory.Rule]: 1 * utils_1.kMinutes,
        /** 限流规则脏数据时间 */
        [plugins_1.RegistryCategory.Ratelimit]: 1 * utils_1.kMinutes
    },
    /**
     * 资源回收时间
     * 回收条件为：_至少_经历指定的间隔都没被访问
     * 小于或等于 0 则为不启用此特性
     */
    recycleTime: 1 * utils_1.kDays,
    // #endregion
    // #region Report
    /**
     * 服务状态上报间隔
     */
    reportInterval: 3 * utils_1.kMinutes,
    /**
     * 服务状态上报阈值
     */
    reportThreshold: 10000,
    // #endregion
    /**
     * 请求池最大容量
     * 超过此大小，且无请求时，将会进行回收
     */
    maxRequestsCapacity: 18 /** v8 对于 FastProperties Slot 的上限为 18 */
};
// #endregion
class LocalRegistry extends events_1.EventEmitter {
    constructor(logger, naming, registry, reporters, ratelimit, options) {
        super();
        this.logger = logger;
        this.naming = naming;
        this.registry = registry;
        this.reporters = reporters;
        this.ratelimit = ratelimit;
        this.entriesMeta = this.createEntries();
        this.servicesMeta = Object.create(null);
        // #region request
        this.activeRequestsPool = Object.create(null);
        this.activeRequestsCapacity = 0;
        this.activeRequestsCount = 0;
        // #endregion
        // #region report
        this.historyRecorder = Object.create(null);
        this.historyRecorderCount = 0;
        this.needReport = false;
        this.disposed = false;
        this.options = Object.assign(Object.assign(Object.assign({}, kDefaultOptions), options), { expireTime: Object.assign(Object.assign({}, kDefaultOptions.expireTime), options === null || options === void 0 ? void 0 : options.expireTime), refreshTime: Object.assign(Object.assign({}, kDefaultOptions.refreshTime), options === null || options === void 0 ? void 0 : options.refreshTime), dirtyTime: Object.assign(Object.assign({}, kDefaultOptions.dirtyTime), options === null || options === void 0 ? void 0 : options.dirtyTime) });
        this.needReport = reporters.some(report => typeof report.registryCache === "function");
    }
    get location() {
        const { location } = this.naming;
        const { baseLocation } = this.options;
        if (baseLocation && (0, location_1.isEmptyLocation)(location)) {
            return baseLocation;
        }
        return location;
    }
    async fetch(type, namespace, service) {
        if (this.disposed) {
            throw new errors_1.StateError("Already disposed");
        }
        if (namespace === "" && service === "") {
            switch (type) {
                case plugins_1.RegistryCategory.Instance: {
                    return [];
                }
                case plugins_1.RegistryCategory.Rule: {
                    return {
                        in: [],
                        out: []
                    };
                }
                case plugins_1.RegistryCategory.Ratelimit: {
                    return [];
                }
                default: {
                    (0, utils_1.UNREACHABLE)();
                }
            }
        }
        /** 标记对 `namespace.service` 的访问 */
        this.accessService(namespace, service);
        const fromLocal = this.local(type, namespace, service);
        // #region remote
        if (fromLocal === null) {
            const fromNaming = await this.pull(type, namespace, service);
            if (fromNaming !== null) {
                return fromNaming;
            }
            /*
             * note:
             *  如果前一相同查询设置了数据，
             *  则重走标准逻辑获取数据。
             */
            return this.fetch(type, namespace, service);
        }
        // #endregion
        const entryMeta = this.getEntryMeta(type, namespace, service);
        switch (entryMeta.status) {
            case EntryStatus.Outdated: {
                /**
                 * `timeSpan` >= dirtyTime
                 * 删除本地所有缓存数据，重新获取
                 */
                if (entryMeta.outdatedTime === undefined) {
                    (0, utils_1.UNREACHABLE)();
                }
                if (((0, process_1.uptime)() - entryMeta.outdatedTime) * utils_1.kSeconds >= this.options.dirtyTime[type]) {
                    this.dropService([type], namespace, service);
                    return this.fetch(type, namespace, service);
                }
                /*
                * `timeSpan` < dirtyTime
                * 异步更新缓存数据
                *
                * note:
                *  更新机制为异步更新，
                *  避免缓存击穿，及在特定场景下死循环
                */
                this.performUpdate(type, namespace, service, fromLocal, entryMeta).catch(e => this.logger.error(`[Registry] [fetch], update ${type}`, e));
                break;
            }
            case EntryStatus.Normal: {
                if (entryMeta.statusUpdater === null) {
                    (0, utils_1.UNREACHABLE)();
                }
                break;
            }
            case EntryStatus.Updating: {
                break;
            }
            case EntryStatus.Released: // [[fallthrough]]
            default: {
                (0, utils_1.UNREACHABLE)();
            }
        }
        return fromLocal.data;
    }
    /* eslint-enable max-len */
    // #endregion
    local(type, namespace, service) {
        if (!namespace || !service) {
            return this.registry[type].all();
        }
        return this.registry[type].get(namespace, service);
    }
    // #endregion
    // #region dispose
    dispose() {
        this.cancelHistoryReporter();
        this.dropEntryMeta();
        this.dropServiceMeta();
        this.removeAllListeners();
        this.disposed = true;
    }
    get isDisposed() {
        return this.disposed;
    }
    // #endregion
    // #region update
    /** for external use only */
    async update(type, namespace, service) {
        /** 标记对 `namespace.service` 的访问 */
        this.accessService(namespace, service);
        return this.performUpdate(type, namespace, service);
    }
    async performUpdate(type, namespace, service, fromLocal = this.local(type, namespace, service), entryMeta) {
        if (fromLocal === null) {
            return (await this.pull(type, namespace, service)) !== null;
        }
        const localEntryMeta = entryMeta !== null && entryMeta !== void 0 ? entryMeta : this.getEntryMeta(type, namespace, service);
        switch (localEntryMeta.status) {
            case EntryStatus.Normal: // [[fallthrough]]
            case EntryStatus.Outdated: {
                break;
            }
            case EntryStatus.Updating: {
                return false;
            }
            case EntryStatus.Released: // [[fallthrough]]
            default: {
                (0, utils_1.UNREACHABLE)();
            }
        }
        localEntryMeta.status = EntryStatus.Updating;
        return Promise.resolve() /** 通过 Promise 切分同步执行代码，降低（同步）调用耗时 */
            .then(() => {
            switch (type) {
                case plugins_1.RegistryCategory.Instance: {
                    return this.updateInstance(namespace, service, fromLocal, localEntryMeta);
                }
                case plugins_1.RegistryCategory.Rule: {
                    return this.updateRule(namespace, service, fromLocal, localEntryMeta);
                }
                case plugins_1.RegistryCategory.Ratelimit: {
                    return this.updateRatelimit(namespace, service, fromLocal, localEntryMeta);
                }
                default: {
                    (0, utils_1.UNREACHABLE)();
                }
            }
        })
            .then((hasUpdated) => {
            if (localEntryMeta.status !== EntryStatus.Released) {
                localEntryMeta.status = EntryStatus.Normal;
                localEntryMeta.outdatedTime = undefined;
                this.attachUpdaterToEntryMeta(type, localEntryMeta);
            }
            return hasUpdated;
        }, (err) => {
            if (localEntryMeta.status !== EntryStatus.Released) {
                /** 当请求失败时，不更新过期时间戳 `outdatedTime` */
                localEntryMeta.status = EntryStatus.Outdated;
            }
            throw err;
        });
    }
    async updateInstance(namespace, service, fromLocal, entryMeta) {
        const fromNaming = await this.request(plugins_1.RegistryCategory.Instance, namespace, service, fromLocal.revision);
        if (entryMeta.status === EntryStatus.Released || fromNaming.revision === fromLocal.revision) {
            return false;
        }
        fromNaming.data.forEach((namingInstance) => {
            const exists = fromLocal.data.some((localInstance) => {
                if (namingInstance.id === localInstance.id) {
                    (0, instance_1.instanceCopy)(namingInstance, localInstance);
                    if (namingInstance.status !== localInstance.status) {
                        /** EventEmitter Synchronously calls each of the listeners */
                        this.emit("SyncInstanceStatus" /* SyncInstanceStatus */, namespace, service, localInstance, namingInstance.status);
                        localInstance.status = namingInstance.status;
                    }
                    return true;
                }
                return false;
            });
            if (!exists) {
                fromLocal.data.push(namingInstance);
            }
        });
        fromLocal.data = fromLocal.data.filter(localInstance => fromNaming.data.some(namingInstance => namingInstance.id === localInstance.id));
        fromLocal.revision = fromNaming.revision;
        this.registry[plugins_1.RegistryCategory.Instance].set(namespace, service, fromLocal);
        this.changelog(plugins_1.RegistryCategory.Instance, namespace, service, fromNaming.revision);
        return true;
    }
    async updateRule(namespace, service, fromLocal, entryMeta) {
        const fromNaming = await this.request(plugins_1.RegistryCategory.Rule, namespace, service, fromLocal.revision);
        if (entryMeta.status === EntryStatus.Released || fromNaming.revision === fromLocal.revision) {
            return false;
        }
        this.registry[plugins_1.RegistryCategory.Rule].set(namespace, service, fromNaming);
        this.changelog(plugins_1.RegistryCategory.Rule, namespace, service, fromNaming.revision);
        return true;
    }
    async updateRatelimit(namespace, service, fromLocal, entryMeta) {
        const fromNaming = await this.request(plugins_1.RegistryCategory.Ratelimit, namespace, service, fromLocal.revision);
        if (entryMeta.status === EntryStatus.Released || fromNaming.revision === fromLocal.revision) {
            return false;
        }
        fromNaming.data.forEach((namingRule) => {
            const localData = fromLocal.data;
            const { length } = localData;
            let index = 0;
            for (; index < length; index += 1) {
                const localRule = localData[index];
                if (namingRule.id === localRule.id) {
                    if (namingRule.revision !== localRule.revision) {
                        localData[index] = namingRule;
                    }
                    break;
                }
            }
            if (index === length) { /** not found */
                fromLocal.data.push(namingRule);
            }
        });
        fromLocal.data = fromLocal.data.filter(localRule => fromNaming.data.some(namingRule => namingRule.id === localRule.id));
        fromLocal.revision = fromNaming.revision;
        this.registry[plugins_1.RegistryCategory.Ratelimit].set(namespace, service, fromNaming);
        this.changelog(plugins_1.RegistryCategory.Ratelimit, namespace, service, fromNaming.revision);
        return true;
    }
    async request(type, namespace, service, revision) {
        const key = `${type}#${namespace}.${service}${revision ? `@${revision}` : ""}`;
        let activeRequest = this.activeRequestsPool[key];
        const performRequest = !activeRequest;
        if (performRequest) {
            /**
             * 当值为 `undefined` 时，说明对应（key）的槽未被使用，
             * 故存储对象容量大小增加 1 个槽位。
             */
            if (activeRequest === undefined) {
                this.activeRequestsCapacity += 1;
            }
            this.activeRequestsCount += 1;
            switch (type) {
                case plugins_1.RegistryCategory.Instance: {
                    activeRequest = this.naming.list(namespace, service, revision);
                    break;
                }
                case plugins_1.RegistryCategory.Rule: {
                    activeRequest = this.naming.routingRules(namespace, service, revision);
                    break;
                }
                case plugins_1.RegistryCategory.Ratelimit: {
                    if (!this.ratelimit) {
                        (0, utils_1.UNREACHABLE)();
                    }
                    activeRequest = this.ratelimit.ratelimitRules(namespace, service, revision);
                    break;
                }
                default: {
                    (0, utils_1.UNREACHABLE)();
                }
            }
            this.activeRequestsPool[key] = activeRequest;
        }
        let result;
        try {
            result = await activeRequest;
        }
        finally {
            if (performRequest) {
                this.activeRequestsCount -= 1;
            }
            /**
             * 回收机制：
             * 当超过最大容量且当前没有未完成的请求时，进行整体回收（重新创建）。
             * 这里为了性能考虑这里不使用 `delete` 删除对象属性，避免退化为字典模式。
             */
            if (this.activeRequestsCount === 0 && this.activeRequestsCapacity > this.options.maxRequestsCapacity) {
                this.activeRequestsPool = Object.create(null);
                this.activeRequestsCapacity = 0;
            }
            /**
             * 将使用过的槽设置成为 `null`，以便于复用时区分。
             */
            this.activeRequestsPool[key] = null;
        }
        return result;
    }
    async pull(type, namespace, service) {
        const { data: fromNaming, revision } = await this.request(type, namespace, service);
        if (this.local(type, namespace, service) === null) {
            this.registry[type].set(namespace, service, {
                data: fromNaming,
                revision
            });
            this.createEntryMeta(type, namespace, service, false);
            return fromNaming;
        }
        return null;
    }
    // #endregion
    // #region stat
    report() {
        const { historyRecorder } = this;
        this.historyRecorder = Object.create(null);
        this.historyRecorderCount = 0;
        Object.keys(historyRecorder).forEach((namespace) => {
            const serviceHistory = historyRecorder[namespace];
            Object.keys(serviceHistory).forEach((service) => {
                var _a, _b, _c;
                const changelog = serviceHistory[service];
                const rules = (_a = this.registry[plugins_1.RegistryCategory.Rule].get(namespace, service)) === null || _a === void 0 ? void 0 : _a.data;
                const stat = {
                    [plugins_1.RegistryCategory.Instance]: {
                        history: changelog[plugins_1.RegistryCategory.Instance],
                        /*
                         * 当前实例列表不存在或为空，则认为当前已删除
                         */
                        eliminated: (((_b = this.registry[plugins_1.RegistryCategory.Instance].get(namespace, service)) === null || _b === void 0 ? void 0 : _b.data.length) || 0) === 0
                    },
                    [plugins_1.RegistryCategory.Rule]: {
                        history: changelog[plugins_1.RegistryCategory.Rule],
                        /*
                         * 当前规则不存在或出入规则均为空，则认为当前已删除
                         */
                        eliminated: ((rules === null || rules === void 0 ? void 0 : rules.in.length) || 0) === 0 && ((rules === null || rules === void 0 ? void 0 : rules.out.length) || 0) === 0
                    },
                    [plugins_1.RegistryCategory.Ratelimit]: {
                        history: changelog[plugins_1.RegistryCategory.Ratelimit],
                        /*
                         * 当前限流规则不存在或为空，则认为当前已删除
                         */
                        eliminated: (((_c = this.registry[plugins_1.RegistryCategory.Ratelimit].get(namespace, service)) === null || _c === void 0 ? void 0 : _c.data.length) || 0) === 0
                    }
                };
                this.reporters.forEach((reporter) => {
                    var _a;
                    (_a = reporter.registryCache) === null || _a === void 0 ? void 0 : _a.call(reporter, namespace, service, stat).catch(err => this.disposed || this.logger.error(`[${reporter.name}] [registryCache]`, err));
                });
            });
        });
    }
    changelog(type, namespace, service, revision) {
        if (!this.needReport) {
            return;
        }
        const log = {
            time: Date.now(),
            revision
        };
        let ns = this.historyRecorder[namespace];
        if (!ns) {
            ns = Object.create(null);
            this.historyRecorder[namespace] = ns;
        }
        let svr = ns[service];
        if (!svr) {
            svr = {
                [plugins_1.RegistryCategory.Instance]: [],
                [plugins_1.RegistryCategory.Rule]: [],
                [plugins_1.RegistryCategory.Ratelimit]: []
            };
            ns[service] = svr;
        }
        svr[type].push(log);
        this.historyRecorderCount += 1;
        if (this.historyRecorderCount >= this.options.reportThreshold) {
            this.cancelHistoryReporter();
            this.report();
        }
        else if (this.historyReporter === undefined) {
            this.historyReporter = setTimeout(() => {
                this.report();
                this.historyReporter = undefined;
            }, this.options.reportInterval).unref();
        }
    }
    cancelHistoryReporter() {
        if (this.historyReporter) {
            clearTimeout(this.historyReporter);
            this.historyReporter = undefined;
        }
    }
    // #endregion
    // #region ServiceMeta
    accessService(namespace, service) {
        const { recycleTime } = this.options;
        if (!(recycleTime > 0) || recycleTime === Infinity) {
            return;
        }
        const serviceMeta = this.servicesMeta[`${namespace}.${service}`];
        if (serviceMeta === undefined) {
            this.createServiceMeta(namespace, service);
        }
        else {
            serviceMeta.accessed = true;
        }
    }
    dropServiceMeta(namespace, service) {
        if (namespace === undefined && service === undefined) {
            Object.values(this.servicesMeta)
                .forEach(({ garbageCollector }) => clearInterval(garbageCollector));
            return true;
        }
        if (namespace === undefined || service === undefined) {
            (0, utils_1.UNREACHABLE)();
        }
        const serviceMeta = this.servicesMeta[`${namespace}.${service}`];
        if (serviceMeta) {
            clearInterval(serviceMeta.garbageCollector);
            delete this.servicesMeta[`${namespace}.${service}`];
            return true;
        }
        return false;
    }
    createServiceMeta(namespace, service) {
        const { recycleTime } = this.options;
        const serviceMeta = {
            accessed: true,
            garbageCollector: setInterval(() => {
                if (serviceMeta.accessed) {
                    serviceMeta.accessed = false;
                }
                else {
                    this.dropServiceMeta(namespace, service);
                    this.dropService([plugins_1.RegistryCategory.Instance, plugins_1.RegistryCategory.Ratelimit, plugins_1.RegistryCategory.Rule], namespace, service);
                }
            }, recycleTime).unref()
        };
        this.servicesMeta[`${namespace}.${service}`] = serviceMeta;
        return serviceMeta;
    }
    dropService(types, namespace, service) {
        types.forEach((type) => {
            this.dropEntryMeta(type, namespace, service);
            this.registry[type].delete(namespace, service);
        });
    }
    // #endregion
    // #region EntryMeta
    attachRefresherToEntryMeta(type, entryMeta, namespace, service) {
        const interval = this.options.refreshTime[type];
        if (!(interval > 0) || interval === Infinity) {
            return;
        }
        entryMeta.contentRefresher = setInterval(() => {
            if (entryMeta.status === EntryStatus.Outdated) {
                this.performUpdate(type, namespace, service).catch(e => this.logger.error(`[Registry] [refresher], refresh ${namespace}.${service}#${type}`, e));
            }
        }, interval).unref();
    }
    attachUpdaterToEntryMeta(type, entryMeta) {
        const timeout = this.options.expireTime[type];
        if (!(timeout > 0) || timeout === Infinity) {
            return;
        }
        if (entryMeta.statusUpdater !== null) {
            clearTimeout(entryMeta.statusUpdater);
            entryMeta.statusUpdater = null;
        }
        entryMeta.statusUpdater = setTimeout(() => {
            entryMeta.statusUpdater = null;
            /*
             * note:
             *  请注意，这里必须要判断当前状态是否正常，
             *  否则会造成异步死循环问题
             */
            if (entryMeta.status === EntryStatus.Normal) {
                entryMeta.status = EntryStatus.Outdated;
                entryMeta.outdatedTime = (0, process_1.uptime)();
            }
        }, timeout).unref();
    }
    releaseEntryMeta(entryMeta) {
        entryMeta.status = EntryStatus.Released;
        entryMeta.outdatedTime = undefined;
        if (entryMeta.statusUpdater !== null) {
            clearTimeout(entryMeta.statusUpdater);
            entryMeta.statusUpdater = null;
        }
        if (entryMeta.contentRefresher !== null) {
            clearInterval(entryMeta.contentRefresher);
            entryMeta.contentRefresher = null;
        }
    }
    dropEntryMeta(type, namespace, service) {
        /** drop all */
        if (type === undefined && namespace === undefined && service === undefined) {
            Object.values(this.entriesMeta).forEach((entriesMeta) => {
                Object.values(entriesMeta).forEach((entryMeta) => {
                    this.releaseEntryMeta(entryMeta);
                });
            });
            this.entriesMeta = this.createEntries();
            return true;
        }
        /** drop one */
        const entryMeta = this.getEntryMeta(type, namespace, service, true);
        if (entryMeta !== undefined) {
            this.releaseEntryMeta(entryMeta);
            return true;
        }
        return false;
    }
    createEntries() {
        return {
            [plugins_1.RegistryCategory.Instance]: Object.create(null),
            [plugins_1.RegistryCategory.Rule]: Object.create(null),
            [plugins_1.RegistryCategory.Ratelimit]: Object.create(null)
        };
    }
    createEntryMeta(type, namespace, service, isOutdated) {
        const entryMeta = {
            status: isOutdated ? EntryStatus.Outdated : EntryStatus.Normal,
            statusUpdater: null,
            contentRefresher: null
        };
        if (isOutdated) {
            entryMeta.outdatedTime = (0, process_1.uptime)();
        }
        else {
            this.attachUpdaterToEntryMeta(type, entryMeta);
        }
        this.attachRefresherToEntryMeta(type, entryMeta, namespace, service);
        this.entriesMeta[type][`${namespace}.${service}`] = entryMeta;
        return entryMeta;
    }
    getEntryMeta(type, namespace, service, popup = false) {
        const entriesMeta = this.entriesMeta[type];
        let entryMeta = entriesMeta[`${namespace}.${service}`];
        if (entryMeta === undefined) {
            if (!popup) {
                /**
                 * 在本地名字服务插件中找得到的数据，并不一定有其对应的 `EntryMeta`，
                 * 故如查不到则创建，并标注为已过期 `EntryStatus.Outdated`，以便尽快更新
                 */
                entryMeta = this.createEntryMeta(type, namespace, service, true);
            }
        }
        else if (popup) {
            delete entriesMeta[`${namespace}.${service}`];
        }
        return entryMeta;
    }
}
exports.LocalRegistry = LocalRegistry;
//# sourceMappingURL=registry.js.map