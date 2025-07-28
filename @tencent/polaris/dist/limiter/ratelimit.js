"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ratelimit = void 0;
const errors_1 = require("../errors");
const metadata_1 = require("../metadata");
const plugins_1 = require("../plugins");
const rules_1 = require("../rules");
const utils_1 = require("../utils");
const ratelimiter_1 = require("./ratelimiter");
const kDefaultOptions = {
    outdatedPeriod: 2,
    idlePeriod: 10,
    instanceUpdateTime: 5 * utils_1.kSeconds,
    updatePercent: 0.8
};
class Ratelimit {
    constructor(global, logger, registry, ratelimit, shaping, options) {
        this.global = global;
        this.logger = logger;
        this.registry = registry;
        this.ratelimit = ratelimit;
        this.shaping = shaping;
        this.limiters = new WeakMap();
        this.disposed = false;
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
    }
    dispose() {
        this.disposed = true;
    }
    async query(namespace, service, cluster = "", labels, id) {
        if (this.disposed) {
            throw new errors_1.StateError("Already disposed");
        }
        const rules = await this.registry.fetch(plugins_1.RegistryCategory.Ratelimit, namespace, service);
        let selectedRule;
        if (typeof id === "string" && id !== "") { /** fast case */
            selectedRule = rules.find(rule => rule.id === id);
        }
        if (typeof selectedRule === "undefined") {
            const { globalVariables } = this.global;
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < rules.length; i += 1) { /** slow case */
                const rule = rules[i];
                if (rule.cluster === cluster
                    && (0, metadata_1.isMetadataMatch)(labels, rule.labels, globalVariables)
                    && (selectedRule === undefined || rule.priority > selectedRule.priority)) {
                    selectedRule = rule;
                }
            }
        }
        return selectedRule;
    }
    acquire(namespace, service, amount, rule) {
        const quotas = [];
        if (this.disposed) {
            const err = new errors_1.StateError("Already disposed");
            for (let i = 0; i < amount; i += 1) {
                quotas.push(Promise.reject(err));
            }
            return quotas;
        }
        /**
         * 当规则不存在时，默认放通所有配额
         */
        if (typeof rule === "undefined") {
            for (let i = 0; i < amount; i += 1) {
                quotas.push(Promise.resolve());
            }
            return quotas;
        }
        let limiter;
        if (!this.limiters.has(rule)) {
            switch (rule.type) {
                case rules_1.LimitType.Local: {
                    limiter = new ratelimiter_1.LocalRatelimiter(rule, this.options);
                    break;
                }
                case rules_1.LimitType.Global: {
                    limiter = new ratelimiter_1.GlobalRatelimiter(namespace, service, rule, this.logger, this.registry, this.ratelimit, this.options);
                    break;
                }
                default: {
                    (0, utils_1.UNREACHABLE)();
                }
            }
            this.limiters.set(rule, limiter);
        }
        let shaping;
        if (rule.action !== "") {
            shaping = this.shaping.find(plugin => plugin.name === rule.action);
            if (typeof shaping === "undefined") {
                throw new errors_1.PluginError(`action(${rule.action}) implement not found`);
            }
        }
        for (let i = 0; i < amount; i += 1) {
            let quota = Promise.resolve();
            if (rule.enable) {
                if (typeof shaping !== "undefined") {
                    quota = quota
                        .then(() => limiter.getPartition())
                        .then(partition => shaping.inFlow(rule, partition));
                }
                quota = quota
                    .then(() => this.allocation(rule))
                    .then(result => this.produce(rule, result));
            }
            quotas.push(quota);
        }
        return quotas;
    }
    allocation(rule) {
        const limiter = this.limiters.get(rule);
        if (typeof limiter === "undefined") {
            throw new errors_1.StateError("current rate limit rule has been changed, all allocations are rejected");
        }
        return limiter.consume();
    }
    produce(rule, result) {
        if (!result) {
            throw new errors_1.StateError("no available quota");
        }
        if (rule.resource === rules_1.LimitResource.Concurrency) {
            return () => {
                const limiter = this.limiters.get(rule);
                if (typeof limiter === "undefined") {
                    throw new errors_1.StateError("current rate limit rule has been changed, all releases are rejected");
                }
                return limiter.return();
            };
        }
    }
}
exports.Ratelimit = Ratelimit;
//# sourceMappingURL=ratelimit.js.map