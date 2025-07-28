"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalServerClient = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const __1 = require("../../..");
const plugins_1 = require("../../../plugins");
class LocalServerClient {
    constructor(database = Object.create(null), location) {
        this.database = database;
        this.location = location;
        this.type = plugins_1.PluginType.NamingService;
        this.name = "LocalServerClient";
        this.mode = plugins_1.OperatingMode.Internal;
        /**
         * (empty function)
         */
    }
    setInstances(namespace, service, instances) {
        this.getService(namespace, service).instances = instances;
    }
    setRules(namespace, service, rules) {
        this.getService(namespace, service).rules = rules;
    }
    async list(namespace, service, revision) {
        const svr = this.database[`${namespace}.${service}`];
        if (!svr || !svr.instances) {
            throw new __1.ServiceNotFound(`[${namespace}.${service}] not found in local server`);
        }
        const { instances } = svr;
        if (revision && instances.revision === revision) {
            return {
                data: [],
                revision
            };
        }
        return instances;
    }
    async routingRules(namespace, service, revision) {
        const svr = this.database[`${namespace}.${service}`];
        if (!svr) {
            throw new __1.ServiceNotFound(`[${namespace}.${service}] not found in local server`);
        }
        const { rules } = svr;
        if (rules) {
            if (revision && rules.revision === revision) {
                return {
                    data: {
                        in: [],
                        out: []
                    },
                    revision
                };
            }
            return rules;
        }
        /**
         * 如果服务已配置，
         * 但规则没有配置则使用空规则
         */
        return {
            data: {
                in: [],
                out: []
            },
            revision: ""
        };
    }
    async register() {
        return (await (0, util_1.promisify)(crypto_1.randomBytes)(16)).toString("hex");
    }
    async unregister() {
        return true;
    }
    async heartbeat() {
        return true;
    }
    getService(namespace, service) {
        let svr = this.database[`${namespace}.${service}`];
        if (!svr) {
            svr = Object.create(null);
            this.database[`${namespace}.${service}`] = svr;
        }
        return svr;
    }
}
exports.LocalServerClient = LocalServerClient;
//# sourceMappingURL=index.js.map