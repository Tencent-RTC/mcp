"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisHTTPClient = void 0;
const axios_1 = require("axios");
const http = require("http");
const __1 = require("../../../../..");
const utils_1 = require("../../../../../utils");
const adapter_1 = require("../../adapter");
const types_1 = require("../../types");
const utils_2 = require("../../utils");
const kDefaultOptions = {
    /**
     * 是否复用连接
     */
    keepAlive: true,
    /**
     * axios 配置项
     */
    axios: {
        /**
         * 调用超时时间
         */
        timeout: 10 * utils_1.kSeconds
    }
};
const kUrlMapping = {
    [types_1.ServiceType.Monitor]: {
        collectServerStatistics: "/v1/CollectServerStatistics",
        collectServiceStatistics: "/v1/CollectServiceStatistics",
        collectCircuitBreak: "/v1/CollectCircuitBreak",
        collectSdkCache: "/v1/CollectSDKCache",
        collectSdkConfiguration: "/v1/collectSDKConfiguration",
        collectSdkapiStatistics: "/v1/CollectSDKAPIStatistics"
    },
    [types_1.ServiceType.Discover]: {
        discover: "/v1/Discover",
        registerInstance: "/v1/RegisterInstance",
        deregisterInstance: "/v1/DeregisterInstance",
        heartbeat: "/v1/Heartbeat",
        reportClient: "/v1/ReportClient"
    },
    [types_1.ServiceType.Ratelimit]: {
        acquireQuota: "/v1/AcquireQuota",
        initializeQuota: "/v1/InitializeQuota"
    }
};
const kUA = `${utils_1.kModuleName}/${utils_1.kModuleVersion} Node.js/${process.versions.node}`;
class PolarisHTTPClient extends adapter_1.PolarisServerAdapter {
    constructor(remotes, options) {
        super(remotes, options);
        this.name = "PolarisHTTPClient";
        this.protocol = PolarisHTTPClient.protocol;
        this.format = utils_2.ProtobufFormat.JSON;
        this.sequence = 0;
        this.options = Object.assign(Object.assign(Object.assign(Object.assign({}, this.options), kDefaultOptions), options), { axios: Object.assign(Object.assign(Object.assign({}, this.options.axios), kDefaultOptions.axios), options === null || options === void 0 ? void 0 : options.axios) });
    }
    box(value) {
        return value;
    }
    unbox(value, defaultValue) {
        const val = value;
        if (typeof val !== "undefined" && val !== null) {
            return val;
        }
        if (typeof defaultValue === "function") {
            return defaultValue();
        }
        return defaultValue;
    }
    // #region #AOP#
    /**
     * 获取 axios.AxiosRequestConfig 配置，可重载此方法实现差异化配置
     * @param address 远端地址
     * @param name 远端类型
     * @param httpAgent http.Agent
     */
    getRequestConfig(address, name, httpAgent) {
        const { options: { axios: axiosOptions } } = this;
        return Object.assign({ headers: Object.assign({ "User-Agent": kUA, "Request-Id": `${this.sequence++}` }, axiosOptions.headers), 
            /**
             * 由于后端接口为 `RESTful` 架构，
             * 故在在此放过所有 `StatusCode`，具体判断由业务层处理
             */
            validateStatus: () => true, httpAgent }, axiosOptions);
    }
    // #endregion
    buildClient(address, type) {
        const { logger } = this;
        const { transaction } = logger;
        logger.trace("Plugins" /* Plugins */, this.name, "buildClient", transaction, "remote address is", address, "and type is", type);
        const mapping = kUrlMapping[type];
        const client = Object.create(null);
        const httpAgent = new http.Agent({
            keepAlive: this.options.keepAlive
        });
        for (const name of Object.keys(mapping)) {
            client[name] = async (request) => {
                const { data } = await axios_1.default.post(`http://${address}${mapping[name]}`, request, this.getRequestConfig(address, name, httpAgent));
                if (!data || typeof data !== "object") {
                    throw new __1.InvalidResponse(`Parsing response data, expect object but received ${typeof data}`);
                }
                return data;
            };
        }
        client.close = () => {
            logger.trace("Plugins" /* Plugins */, this.name, "buildClient", transaction, "destroy http agent");
            httpAgent.destroy();
        };
        return client;
    }
}
exports.PolarisHTTPClient = PolarisHTTPClient;
PolarisHTTPClient.protocol = "http";
PolarisHTTPClient.port = 8080;
//# sourceMappingURL=index.js.map