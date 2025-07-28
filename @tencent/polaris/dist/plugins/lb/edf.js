"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDFLoadBalancer = void 0;
const utils_1 = require("../../utils");
const base_1 = require("./base");
/**
 * Earliest Deadline First (EDF) Load Balancer
 * (https://en.wikipedia.org/wiki/Earliest_deadline_first_scheduling)
 *
 * @description
 * Algorithm:
 *  1. `S` = {S0, S1, S2, ..., Sn}, `W(Si)` = Si.weight, `D(Si)` = Si.deadline
 *  2. Sx = Pick(Min(D(Si)))
 *  3. D(Sx) = D(Sx) + 1 / W(Sx)
 *  4. return Sx
 */
class EDFLoadBalancer extends base_1.StatelessLoadBalancer {
    constructor() {
        super(...arguments);
        this.name = "EDFLoadBalancer";
        this.callStat = Object.create(null);
    }
    /**
     * 1. 选取拥有最小 `deadline` 的实例
     * 2. 将当前时间 `currentTime` 置为选取实例的 `deadline`
     * 3. 将选取实例的 `deadline` 增加一个 `step`
     */
    choose(namespace, service, instances) {
        let callStat = this.callStat[`${namespace}.${service}`];
        if (!callStat) {
            callStat = {
                currentTime: 0,
                instanceDeadline: new WeakMap()
            };
            this.callStat[`${namespace}.${service}`] = callStat;
            this.randomChoose(namespace, service, instances);
        }
        let earliestDeadline = Infinity;
        let selectedInstance;
        for (let i = 0; i < instances.length; i += 1) { // eslint-disable-line @typescript-eslint/prefer-for-of
            const instance = instances[i];
            let deadline = callStat.instanceDeadline.get(instance);
            // 正常情况下 `deadline` 应大于当前时间; 但是由于某些前置的条件，导致某 `instance` 不在 `instances` 中
            // 则此 `instance` 的 `deadline` 有可能滞后于 `currentTime`，需要为其重置 `deadline`
            if (typeof deadline === "undefined" || deadline < callStat.currentTime) {
                deadline = callStat.currentTime + (1 / this.instanceWeight(instance));
                callStat.instanceDeadline.set(instance, deadline);
            }
            if (deadline < earliestDeadline) {
                earliestDeadline = deadline;
                selectedInstance = instance;
            }
        }
        if (selectedInstance) {
            callStat.instanceDeadline.set(selectedInstance, earliestDeadline + (1 / this.instanceWeight(selectedInstance)));
            callStat.currentTime = earliestDeadline;
            return selectedInstance;
        }
        (0, utils_1.UNREACHABLE)();
    }
    onStatusChange(namespace, service, instance, prevStatus) {
        // 发生以下两种状态转移时，不希望实例被太早选出，因此重置其 deadline
        if (
        /* eslint-disable max-len */
        (instance.status === 2 /* HalfClose */ && prevStatus === 1 /* HalfOpen */) /** `HalfOpen` ---> `HalfClose` */
            || (instance.status === 0 /* Normal */ && prevStatus === 3 /* Fused */) /** `Fused` ---> `Normal` */
        /* eslint-enable max-len */
        ) {
            const callStat = this.callStat[`${namespace}.${service}`];
            if (callStat) {
                callStat.instanceDeadline.delete(instance);
            }
        }
    }
}
exports.EDFLoadBalancer = EDFLoadBalancer;
//# sourceMappingURL=edf.js.map