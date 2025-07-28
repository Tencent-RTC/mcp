"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashRingLoadBalancer = void 0;
const HashRing = require("hashring");
const plugins_1 = require("../../plugins");
const utils_1 = require("../../utils");
const isHashRingCallArgs = (args) => {
    return typeof args === "string";
};
/**
 * Consistent Hash Load Balancer
 * Implemented by using a third-party [hashring](https://github.com/3rd-Eden/node-hashring) module
 */
class HashRingLoadBalancer {
    constructor(options) {
        this.name = "HashRingLoadBalancer";
        this.type = plugins_1.PluginType.LoadBalancer;
        this.supportedWeightType = 2 /* None */;
        this.callStat = Object.create(null);
        this.options = options || {};
    }
    choose(namespace, service, instances, args) {
        let callArgs;
        if (isHashRingCallArgs(args)) {
            callArgs = args;
        }
        else {
            throw new Error("Illegal parameter");
        }
        const sign = instances.map(instance => instance.id).join("|");
        let callStat = this.callStat[`${namespace}.${service}`];
        if (!callStat || callStat.sign !== sign) {
            if (callStat && callStat.sign !== sign) {
                callStat.ring.end();
            }
            callStat = {
                sign,
                ring: new HashRing(instances.map(instance => `${instance.host}:${instance.port}`), this.options.algorithm || "md5", this.options)
            };
            this.callStat[`${namespace}.${service}`] = callStat;
        }
        const address = callStat.ring.get(callArgs);
        for (let i = 0; i < instances.length; i += 1) { // eslint-disable-line @typescript-eslint/prefer-for-of
            const instance = instances[i];
            if (address === `${instance.host}:${instance.port}`) {
                return instance;
            }
        }
        (0, utils_1.UNREACHABLE)();
    }
}
exports.HashRingLoadBalancer = HashRingLoadBalancer;
//# sourceMappingURL=hashring.js.map