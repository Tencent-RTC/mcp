"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisMonitorAdapter = void 0;
const uuid_1 = require("uuid");
const plugins_1 = require("../../../../plugins");
const utils_1 = require("../../../../utils");
const types_1 = require("../types");
const utils_2 = require("../utils");
const base_1 = require("./base");
const kClientName = "polaris-nodejs";
class PolarisMonitorAdapter extends base_1.PolarisBaseAdapter {
    async serviceStatistics(namespace, service, stat) {
        if (!this.initializeStatus.initialized) {
            await this.waitForInitialized();
        }
        if (this.local === undefined) {
            (0, utils_1.UNREACHABLE)();
        }
        const { logger } = this;
        const { transaction: mainTransaction } = logger;
        const { monitorService } = this.options;
        const promises = [];
        const minutesRatio = stat.statWindow / utils_1.kMinutes;
        stat.summaryStat.forEach((computed, instance) => {
            computed.forEach(({ cost, count }, { code, success }) => {
                if (count > 0) {
                    /* eslint-disable @typescript-eslint/naming-convention */
                    const total_delay_per_minute = ~~(cost / minutesRatio);
                    const total_request_per_minute = ~~(count / minutesRatio);
                    /* eslint-enable @typescript-eslint/naming-convention */
                    const { transaction: subTransaction } = logger;
                    if (logger.tracingEnabled) {
                        const request = {
                            key: {
                                namespace,
                                service,
                                success,
                                code,
                                instance_host: `${instance.host}:${instance.port}`,
                                caller_host: this.local.host
                            },
                            value: {
                                total_delay_per_minute,
                                total_request_per_minute
                            }
                        };
                        logger.trace("Plugins" /* Plugins */, this.name, "serviceStatistics", subTransaction, "report with args:", request);
                    }
                    promises.push(this.requestBackend(types_1.ServiceType.Monitor, monitorService, "collectServiceStatistics", {
                        id: this.box((0, uuid_1.v4)()),
                        key: {
                            namespace: this.box(namespace),
                            service: this.box(service),
                            instance_host: this.box(`${instance.host}:${instance.port}`),
                            caller_host: this.box(this.local.host),
                            success: this.box(success),
                            res_code_string: this.box(code)
                        },
                        /**
                         * 上报的时间窗大小固定为 1min，需根据实际统计时间窗做缩放
                         */
                        value: {
                            total_delay_per_minute: this.box(total_delay_per_minute),
                            total_request_per_minute: this.box(total_request_per_minute)
                        }
                    }).then((response) => {
                        this.tracingResponse(subTransaction, "serviceStatistics", response);
                        return this.isSuccessResponse(response);
                    }));
                }
            });
        });
        const isSuccess = (await Promise.all(promises)).every(result => !!result); /** 所有子上报成功才属于成功 */
        logger.trace("Plugins" /* Plugins */, this.name, "serviceStatistics", mainTransaction, "result is", isSuccess);
        return isSuccess;
    }
    async registryCache(namespace, service, stat) {
        if (!this.initializeStatus.initialized) {
            await this.waitForInitialized();
        }
        const { logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Plugins" /* Plugins */, this.name, "registryCache", transaction, `report ${namespace}.${service} with args:`, stat);
        }
        const response = await this.requestBackend(types_1.ServiceType.Monitor, this.options.monitorService, "collectSdkCache", {
            id: (0, uuid_1.v4)(),
            namespace,
            service,
            sdk_token: this.SDKToken,
            instance_eliminated: stat[plugins_1.RegistryCategory.Instance].eliminated,
            instances_history: this.procRegistryChangelog(stat[plugins_1.RegistryCategory.Instance].history, "instances_history"),
            routing_eliminated: stat[plugins_1.RegistryCategory.Rule].eliminated,
            routing_history: this.procRegistryChangelog(stat[plugins_1.RegistryCategory.Rule].history, "routing_history")
        });
        this.tracingResponse(transaction, "registryCache", response);
        return this.isSuccessResponse(response);
    }
    async apiStatistics(key, value) {
        if (!this.initializeStatus.initialized) {
            await this.waitForInitialized();
        }
        if (this.local === undefined) {
            (0, utils_1.UNREACHABLE)();
        }
        const { logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Plugins" /* Plugins */, this.name, "apiStatistics", transaction, "api state:", key, `occurs ${value} times in a minute`);
        }
        const response = await this.requestBackend(types_1.ServiceType.Monitor, this.options.monitorService, "collectSdkapiStatistics", {
            id: this.box((0, uuid_1.v4)()),
            key: {
                client_host: this.box(this.local.host),
                client_type: this.box(kClientName),
                client_version: this.box(utils_1.kModuleVersion),
                delay_range: this.box(key.delay),
                res_code: this.box(key.code),
                result: key.result,
                sdk_api: this.box(key.api),
                success: this.box(key.code === "0")
            },
            value: {
                total_request_per_minute: this.box(value)
            }
        });
        this.tracingResponse(transaction, "apiStatistics", response);
        return this.isSuccessResponse(response);
    }
    async systemConfig(config, now = Date.now()) {
        if (!this.initializeStatus.initialized) {
            await this.waitForInitialized();
        }
        const { monitorService, monitorInterval } = this.options;
        const { logger } = this;
        const { transaction } = logger;
        logger.trace("Plugins" /* Plugins */, this.name, "systemConfig", transaction, "report config with:", config);
        const response = await this.requestBackend(types_1.ServiceType.Monitor, monitorService, "collectSdkConfiguration", {
            token: this.SDKToken,
            config: JSON.stringify(config),
            take_effect_time: {
                seconds: now / utils_1.kSeconds,
                nanos: (now % utils_1.kSeconds) * utils_1.kSeconds * utils_1.kNanos
            },
            location: JSON.stringify(this.location),
            version: utils_1.kModuleVersion,
            client: kClientName
        });
        this.tracingResponse(transaction, "systemConfig", response);
        /**
         * 此上报在 Polaris Monitor 中作为心跳，
         * 需定时调用上报
         */
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.timer = undefined;
            this.systemConfig(config, now).catch(err => this.disposed || logger.error(`[${this.name}] [systemConfig]`, err));
        }, monitorInterval).unref();
        this.disposeFuncs.monitor = () => {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = undefined;
            }
        };
        return this.isSuccessResponse(response);
    }
    async statusChangelog(namespace, service, stat) {
        if (!this.initializeStatus.initialized) {
            await this.waitForInitialized();
        }
        const circuitbreak = [];
        stat.status.forEach((changes, { host, port, vpcId }) => {
            circuitbreak.push({
                port,
                ip: host,
                vpc_id: vpcId,
                changes: changes.map(({ after, before, reason, time }) => ({
                    time: (0, utils_2.ms2protobuf)(time),
                    change_seq: this.getSeq("CircuitbreakChange"),
                    change: (0, utils_2.transformStatusChange)(before, after),
                    reason
                }))
            });
        });
        const { logger } = this;
        const { transaction } = logger;
        if (logger.tracingEnabled) {
            logger.trace("Plugins" /* Plugins */, this.name, "statusChangelog", transaction, "report with args:", {
                namespace,
                service,
                instance_circuitbreak: circuitbreak,
                recover_all: stat.recover
            });
        }
        const response = await this.requestBackend(types_1.ServiceType.Monitor, this.options.monitorService, "collectCircuitBreak", {
            id: (0, uuid_1.v4)(),
            namespace,
            service,
            sdk_token: this.SDKToken,
            instance_circuitbreak: circuitbreak,
            recover_all: stat.recover.map(({ intersection, time }) => ({
                time: (0, utils_2.ms2protobuf)(time),
                change: types_1.RecoverAllStatus.End,
                instance_info: JSON.stringify(intersection)
            }))
        });
        this.tracingResponse(transaction, "statusChangelog", response);
        return this.isSuccessResponse(response);
    }
    get SDKToken() {
        if (this.token !== undefined) {
            return this.token;
        }
        if (this.local === undefined) {
            (0, utils_1.UNREACHABLE)();
        }
        const token = {
            ip: this.local.host,
            pid: process.pid,
            uid: (0, uuid_1.v4)()
        };
        this.token = token;
        return token;
    }
    getSeq(key) {
        let { seq } = this;
        if (seq === undefined) {
            seq = Object.create(null);
            this.seq = seq;
        }
        if (seq[key] === undefined) {
            seq[key] = 1; /** seq 由 1 开始 */
        }
        return seq[key]++; // eslint-disable-line no-plusplus
    }
    procRegistryChangelog(changelog, key) {
        return {
            revision: changelog.map(({ time, revision }) => ({
                time: (0, utils_2.ms2protobuf)(time),
                revision,
                change_seq: this.getSeq(key)
            }))
        };
    }
}
exports.PolarisMonitorAdapter = PolarisMonitorAdapter;
//# sourceMappingURL=monitor.js.map