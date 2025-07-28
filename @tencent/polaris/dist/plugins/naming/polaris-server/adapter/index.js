"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisServerAdapter = void 0;
const plugins_1 = require("../../../../plugins");
const utils_1 = require("../../../../utils");
const base_1 = require("./base");
const discover_1 = require("./discover");
const monitor_1 = require("./monitor");
const ratelimit_1 = require("./ratelimit");
const kDefaultOptions = {
    detectionTimeout: 1 * utils_1.kSeconds,
    switchDuration: 10 * utils_1.kMinutes,
    monitorInterval: 5 * utils_1.kMinutes,
    polarisNamespace: "Polaris",
    discoverService: "polaris.discover",
    healthcheckService: "polaris.healthcheck",
    monitorService: "polaris.monitor",
    ratelimitService: "polaris.ratelimit",
    presetSuffix: ".default",
    bootstrapOnly: true,
    isolateUnhealthy: true
};
const applyMixins = (derivedCtor, baseCtors) => {
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            const attributes = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
            if (attributes === undefined) {
                (0, utils_1.UNREACHABLE)();
            }
            Object.defineProperty(derivedCtor.prototype, name, attributes);
        });
    });
};
class PolarisServerAdapter extends base_1.PolarisBaseAdapter {
    constructor(remotes, options) {
        super(remotes);
        this.type = plugins_1.PluginType.NamingService | plugins_1.PluginType.StatReporter | plugins_1.PluginType.RatelimitService;
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
    }
}
exports.PolarisServerAdapter = PolarisServerAdapter;
applyMixins(PolarisServerAdapter, [discover_1.PolarisDiscoverAdapter, monitor_1.PolarisMonitorAdapter, ratelimit_1.PolarisRatelimitAdapter]);
//# sourceMappingURL=index.js.map