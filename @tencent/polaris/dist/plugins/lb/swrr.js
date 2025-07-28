"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NginxLoadBalancer = void 0;
const utils_1 = require("../../utils");
const base_1 = require("./base");
/**
 * Smooth Weighted Round-Robin (SWRR) Load Balancer
 * (https://www.nginx.com/resources/glossary/round-robin-load-balancing/)
 *
 * @description
 * Algorithm:
 *  1. `S` = {S0, S1, S2, ..., Sn}, `EW(Si)` = Si.weight, `CW(Si)` = 0
 *  2. CW(Si) = CW(Si) + EW(Si)
 *  3. Sx = Pick(Max(CW(Si)))
 *  4. CW(Sx) = CW(Sx) - Sum(EW(S))
 *  5. return Sx
 */
class NginxLoadBalancer extends base_1.StatelessLoadBalancer {
    constructor() {
        super(...arguments);
        this.name = "NginxLoadBalancer";
        this.callStat = Object.create(null);
    }
    /**
     * 1. 将各个实例的 `currentWeight` 增加 `effectiveWeight`
     * 2. 选取拥有最大 `currentWeight` 的实例
     * 3. 将选取实例的 `currentWeight` 减少 `totalEffectiveWeight`
     */
    choose(namespace, service, instances) {
        let callStat = this.callStat[`${namespace}.${service}`];
        if (!callStat) {
            callStat = new WeakMap();
            this.callStat[`${namespace}.${service}`] = callStat;
            this.randomChoose(namespace, service, instances);
        }
        let totalEffectiveWeight = 0;
        let bestWeight = -Infinity;
        let selectedInstance;
        for (let i = 0; i < instances.length; i += 1) { // eslint-disable-line @typescript-eslint/prefer-for-of
            const instance = instances[i];
            const effectiveWeight = this.instanceWeight(instance);
            let currentWeight = callStat.get(instance) || 0;
            currentWeight += effectiveWeight;
            totalEffectiveWeight += effectiveWeight;
            if (!selectedInstance || bestWeight < currentWeight) {
                selectedInstance = instance;
                bestWeight = currentWeight;
            }
            callStat.set(instance, currentWeight);
        }
        if (selectedInstance) {
            callStat.set(selectedInstance, bestWeight - totalEffectiveWeight);
            return selectedInstance;
        }
        (0, utils_1.UNREACHABLE)();
    }
    onStatusChange(namespace, service, instance, prevStatus) {
        if (
        /* eslint-disable max-len */
        (instance.status === 2 /* HalfClose */ && prevStatus === 1 /* HalfOpen */) /** `HalfOpen` ---> `HalfClose` */
            || (instance.status === 0 /* Normal */ && prevStatus === 3 /* Fused */) /** `Fused` ---> `Normal` */
        /* eslint-enable max-len */
        ) {
            const callStat = this.callStat[`${namespace}.${service}`];
            if (callStat) {
                callStat.delete(instance);
            }
        }
    }
}
exports.NginxLoadBalancer = NginxLoadBalancer;
//# sourceMappingURL=swrr.js.map