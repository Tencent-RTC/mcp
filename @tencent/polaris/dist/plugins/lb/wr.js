"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WRLoadBalancer = void 0;
const utils_1 = require("../../utils");
const base_1 = require("./base");
/**
 * Weight Random Load Balancer
 *
 * @description
 * Algorithm:
 *  1. `S` = {S0, S1, S2, ..., Sn}, `W(Si)` = Si.weight
 *  2. selected_value = random_value % Sum(W(S))
 *  3. Sx = Pick(selected_value ∈ [Sum(W(S0)...W(Si-1)), Sum(W(S0)...W(Si))))
 *  4. return Sx
 */
class WRLoadBalancer extends base_1.StatelessLoadBalancer {
    constructor() {
        super(...arguments);
        this.name = "WRLoadBalancer";
    }
    choose(namespace, service, instances) {
        // #region Round 1
        /*
         * Round 1:
         *  计算各节点实际权重
         */
        let totalWeight = 0;
        const weights = instances.map((instance) => {
            const weight = ~~this.instanceWeight(instance);
            totalWeight += weight;
            return weight;
        });
        // #endregion
        // #region Round 2
        const selectedValue = Math.random() * totalWeight;
        let begin = 0;
        let end = 0;
        for (let i = 0; i < weights.length; i += 1) {
            end = begin + weights[i];
            if (selectedValue >= begin && selectedValue < end) {
                return instances[i];
            }
            begin = end;
        }
        // #endregion
        (0, utils_1.UNREACHABLE)();
    }
}
exports.WRLoadBalancer = WRLoadBalancer;
//# sourceMappingURL=wr.js.map