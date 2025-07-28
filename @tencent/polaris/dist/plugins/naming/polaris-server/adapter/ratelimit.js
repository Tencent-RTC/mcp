"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisRatelimitAdapter = void 0;
const process_1 = require("process");
const __1 = require("../../../..");
const utils_1 = require("../../../../utils");
const rules_1 = require("../rules");
const types_1 = require("../types");
const utils_2 = require("../utils");
const base_1 = require("./base");
class PolarisRatelimitAdapter extends base_1.PolarisBaseAdapter {
    async ratelimitRules(namespace, service, revision) {
        if (!this.initializeStatus.initialized) {
            await this.waitForInitialized();
        }
        const { logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Plugins" /* Plugins */, this.name, "ratelimitRules", transaction, `request ${namespace}.${service}${(revision !== null && revision !== void 0 ? revision : "") && `@${revision}`}`);
        }
        const response = await this.requestBackend(types_1.ServiceType.Discover, this.options.discoverService, "discover", {
            type: types_1.DiscoverRequestType.RATE_LIMIT,
            service: {
                namespace: this.box(namespace),
                name: this.box(service)
            }
        });
        this.tracingResponse(transaction, "ratelimitRules", response);
        this.maybeErrorResponse(response, namespace, service);
        const { rateLimit } = response;
        if (!(rateLimit === null || rateLimit === void 0 ? void 0 : rateLimit.rules)
            || (revision !== undefined && this.unbox(rateLimit.revision, "") === revision)) {
            logger.trace("Plugins" /* Plugins */, this.name, "ratelimitRules", transaction, "empty rules or revision is equal");
            return {
                data: [],
                revision: (rateLimit === null || rateLimit === void 0 ? void 0 : rateLimit.rules) ? (revision !== null && revision !== void 0 ? revision : "") : ""
            };
        }
        let { ratelimitRuleProcessor } = this;
        if (ratelimitRuleProcessor === undefined) {
            ratelimitRuleProcessor = new rules_1.RuleProcessor(this.unbox.bind(this));
            this.ratelimitRuleProcessor = ratelimitRuleProcessor;
        }
        const { rules } = rateLimit;
        const data = [];
        for (let i = 0; i < rules.length; i += 1) { // eslint-disable-line @typescript-eslint/prefer-for-of
            const rule = this.procRatelimitRule(ratelimitRuleProcessor, rules[i]);
            if (rule) {
                data.push(rule);
            }
        }
        logger.trace("Plugins" /* Plugins */, this.name, "ratelimitRules", transaction, "returned rules is", data);
        return {
            data,
            revision: this.unbox(rateLimit.revision, "")
        };
    }
    // eslint-disable-next-line max-lines-per-function
    async acquireQuota(namespace, service, rule, used) {
        if (!this.initializeStatus.initialized) {
            await this.waitForInitialized();
        }
        const { logger } = this;
        const { transaction } = logger;
        const key = `${namespace}#${service}`;
        logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, "select backend with key:", key);
        const instanceResponse = await this.selectBackend(this.buildStickyConsumer(), this.options.ratelimitService, key);
        if (logger.tracingEnabled) {
            const { host, port } = instanceResponse.instance;
            logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, `selected backend is ${host}:${port}`);
        }
        let { ratelimitInfo } = this;
        if (ratelimitInfo === undefined) {
            ratelimitInfo = Object.create(null);
            this.ratelimitInfo = ratelimitInfo;
        }
        let info = ratelimitInfo[key];
        /**
         * 如当前选出的远端实例与上次访问实例不相同（如前一实例配熔断等），则重置全部状态
         */
        if (!info || info.backendInstance !== instanceResponse.instance) {
            logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, "current selected instance not equal to the last result, reset all status");
            info = {
                backendInstance: instanceResponse.instance,
                initializedStatus: new WeakMap(),
                diffTime: 0
            };
            ratelimitInfo[key] = info;
        }
        const request = {
            key: this.box(`${rule.id}#${rule.revision}`),
            namespace: this.box(namespace),
            service: this.box(service),
            /**
             * |server| = |local| + |diff|
             */
            timestamp: this.box(Math.floor(Date.now() + info.diffTime))
        };
        const initialized = info.initializedStatus.get(rule);
        let promise;
        let method;
        const prx = this.pool.getOrCreateClient(instanceResponse.instance, types_1.ServiceType.Ratelimit);
        const startTime = (0, process_1.uptime)();
        if (initialized === true) { /** 如当前限流规则已初始化完成 */
            request.useds = this.amountToLimiter(used);
            logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, "call backend acquireQuota with args:", request);
            promise = prx.acquireQuota(request);
            method = "Acquire";
        }
        else if (initialized === undefined) { /** 如当前限流规则在远端未初始化，则先进行初始化 */
            request.totals = this.amountToLimiter(rule.amounts);
            logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, "call backend initializeQuota with args:", request);
            promise = prx.initializeQuota(request);
            method = "Initialize";
            info.initializedStatus.set(rule, promise);
        }
        else { /** 当前限流规则正在初始化 */
            logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, "waiting for initialized");
            await initialized;
            logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, "initialize completed, Re-call");
            return this.acquireQuota(namespace, service, rule, used);
        }
        let response;
        try {
            response = await promise;
        }
        catch (e) {
            logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, "call backend exception with", e);
            instanceResponse.update(false, ((0, process_1.uptime)() - startTime) * utils_1.kSeconds);
            if (method === "Initialize") {
                info.initializedStatus.delete(rule);
            }
            throw e;
        }
        const code = this.unbox(response.code, NaN);
        this.tracingResponse(transaction, "acquireQuota", response);
        instanceResponse.update(true, ((0, process_1.uptime)() - startTime) * utils_1.kSeconds, `${code || 0}`);
        try {
            this.maybeErrorResponse(response, namespace, service);
        }
        catch (e) {
            if (method === "Initialize") {
                info.initializedStatus.delete(rule);
            }
            throw e;
        }
        const serverTime = this.unbox(response.timestamp, NaN);
        if (!Number.isNaN(serverTime)) {
            /**
             * |diff| = |server| + |TTL| - |local|
             */
            info.diffTime = serverTime + ((((0, process_1.uptime)() - startTime) / 2) * utils_1.kSeconds) - Date.now();
            logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, "recalculate diff time is", info.diffTime);
        }
        if (method === "Initialize") {
            info.initializedStatus.set(rule, true);
            logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, "initialize completed, Re-call");
            return this.acquireQuota(namespace, service, rule, used);
        }
        const result = [];
        response.sum_useds.forEach(({ amount, duration }) => {
            const globalAmount = this.unbox(amount, NaN);
            if (!Number.isNaN(globalAmount) && duration) {
                result.push({
                    amount: globalAmount,
                    duration: (0, utils_2.protobuf2ms)(duration)
                });
            }
            else {
                (0, utils_1.UNREACHABLE)();
            }
        });
        logger.trace("Plugins" /* Plugins */, this.name, "acquireQuota", transaction, "quota config is", result);
        return result;
    }
    procRatelimitRule(processor, rule) {
        const { id, amounts, action, cluster, labels, resource, priority, report: ruleReport, revision: ruleRevision, type, disable } = rule;
        const ruleId = this.unbox(id, "");
        const rulePriority = this.unbox(priority, NaN);
        if (ruleId !== "" && !Number.isNaN(rulePriority) && amounts) {
            const result = {
                resource: resource !== null && resource !== void 0 ? resource : __1.LimitResource.QPS,
                type: type !== null && type !== void 0 ? type : __1.LimitType.Global,
                id: ruleId,
                priority: rulePriority,
                revision: this.unbox(ruleRevision, ""),
                action: this.unbox(action, ""),
                cluster: this.unbox(cluster, ""),
                enable: !this.unbox(disable, false),
                labels: processor.produceMetadata(labels),
                amounts: amounts.map(({ maxAmount, validDuration }) => ({
                    amount: this.unbox(maxAmount, NaN),
                    duration: validDuration ? (0, utils_2.protobuf2ms)(validDuration) : NaN
                })).filter(({ amount, duration }) => amount >= 0 && duration >= 1 * utils_1.kSeconds /** 最小周期为 1s */)
            };
            if (result.type === __1.LimitType.Global) {
                const percent = this.unbox(ruleReport === null || ruleReport === void 0 ? void 0 : ruleReport.amountPercent, NaN) / 100;
                const interval = (ruleReport === null || ruleReport === void 0 ? void 0 : ruleReport.interval) ? (0, utils_2.protobuf2ms)(ruleReport.interval) : NaN;
                if (percent > 0 && percent <= 100 && Number.isNaN(interval)) {
                    result.report = {
                        percent,
                        interval
                    };
                }
            }
            if (result.amounts.length > 0) {
                return result;
            }
        }
    }
    amountToLimiter(amounts) {
        return amounts.map(({ amount, duration }) => ({
            amount: this.box(amount),
            /**
             * 在 `protobuf` 的 JSON format 中，`google.protobuf.Duration` 类型为 string，所以这里需要强制转换
             */
            duration: (0, utils_2.ms2protobuf)(duration, this.format)
        }));
    }
}
exports.PolarisRatelimitAdapter = PolarisRatelimitAdapter;
//# sourceMappingURL=ratelimit.js.map