"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Limiter = exports.Provider = exports.Consumer = exports.PolarisServerClient = exports.PolarisGRPCClient = exports.PolarisHTTPClient = exports.getEmbeddedDiscoverHosts = void 0;
const polaris_1 = require("./polaris");
__exportStar(require("./polaris"), exports);
// #region Embedded Host
var DiscoverBackend;
(function (DiscoverBackend) {
    /** 正式环境 */
    DiscoverBackend[DiscoverBackend["Formal"] = 0] = "Formal";
    /** 测试环境 */
    DiscoverBackend[DiscoverBackend["Debug"] = 1] = "Debug";
})(DiscoverBackend || (DiscoverBackend = {}));
const kDiscoverHosts = {
    [DiscoverBackend.Debug]: [
        "9.205.2.29",
        "9.205.2.123"
    ],
    [DiscoverBackend.Formal]: [
        "9.141.66.244",
        "9.146.202.27",
        "9.146.200.81",
        "9.146.202.35",
        "9.146.205.191",
        "9.146.200.61",
        "9.141.66.219",
        "9.141.65.110",
        "9.141.65.29",
        "9.141.121.7"
    ]
};
const getEmbeddedDiscoverHosts = (port) => {
    const hosts = kDiscoverHosts[process.env.POLARIS_NAMING_DISCOVER_DEBUG ? DiscoverBackend.Debug : DiscoverBackend.Formal];
    return port ? hosts.map(host => `${host}:${port}`) : hosts;
};
exports.getEmbeddedDiscoverHosts = getEmbeddedDiscoverHosts;
// #endregion
// #region AOP
// #region plugins.naming.PolarisServerClient
class PolarisHTTPClient extends polaris_1.PolarisHTTPClient {
    constructor(remotes = (0, exports.getEmbeddedDiscoverHosts)(polaris_1.PolarisHTTPClient.port), options) {
        super(remotes, options);
    }
    // #region Mock monitor
    /**
     * HTTP 后端默认没有部署上报模块，故移除相关实现
     * @returns always `false`
     */
    async serviceStatistics() {
        return false;
    }
    /**
     * HTTP 后端默认没有部署上报模块，故移除相关实现
     * @returns always `false`
     */
    async registryCache() {
        return false;
    }
    /**
     * HTTP 后端默认没有部署上报模块，故移除相关实现
     * @returns always `false`
     */
    async apiStatistics() {
        return false;
    }
    /**
     * HTTP 后端默认没有部署上报模块，故移除相关实现
     * @returns always `false`
     */
    async systemConfig() {
        return false;
    }
    /**
     * HTTP 后端默认没有部署上报模块，故移除相关实现
     * @returns always `false`
     */
    async statusChangelog() {
        return false;
    }
}
exports.PolarisHTTPClient = PolarisHTTPClient;
class PolarisGRPCClient extends polaris_1.PolarisGRPCClient {
    constructor(remotes = (0, exports.getEmbeddedDiscoverHosts)(polaris_1.PolarisGRPCClient.port), options) {
        super(remotes, options);
    }
}
exports.PolarisGRPCClient = PolarisGRPCClient;
exports.PolarisServerClient = [PolarisGRPCClient].find(client => client.isSupported()) || PolarisHTTPClient;
// #endregion
// #region API
const { NamingService: NamingServiceType } = polaris_1.plugins.PluginType;
class Consumer extends polaris_1.Consumer {
    /**
     * Create Consumer
     * @param plugins 插件（可选）
     * @param options 配置参数（可选）
     */
    constructor(plugins = {}, options = {}) {
        super(plugins[NamingServiceType]
            ? plugins : Object.assign(Object.assign({}, plugins), { [NamingServiceType]: new exports.PolarisServerClient() }), options);
    }
}
exports.Consumer = Consumer;
class Provider extends polaris_1.Provider {
    /**
     * Create Provider
     * @param plugins 插件（可选）
     * @param options 配置参数（可选）
     */
    constructor(plugins = {}, options = {}) {
        super(plugins[NamingServiceType]
            ? plugins : Object.assign(Object.assign({}, plugins), { [NamingServiceType]: new exports.PolarisServerClient() }), options);
    }
}
exports.Provider = Provider;
class Limiter extends polaris_1.Limiter {
    /**
     * Create Limiter
     * @param plugins 插件（可选）
     * @param options 配置参数（可选）
     */
    constructor(plugins = {}, options = {}) {
        super(plugins[NamingServiceType]
            ? plugins : Object.assign(Object.assign({}, plugins), { [NamingServiceType]: new exports.PolarisServerClient() }), options);
    }
}
exports.Limiter = Limiter;
// #endregion
// #endregion
// #endregion
//# sourceMappingURL=index.js.map