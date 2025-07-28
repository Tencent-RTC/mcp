"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WRRLoadBalancer = void 0;
const utils_1 = require("../../utils");
const base_1 = require("./base");
/**
 * Weighted Round-Robin Load Balancer
 *
 * @description
 * Algorithm:
 *  1. `S` = {S0, S1, S2, ..., Sn}, `W(Si)` = Si.weight
 *  2. CW(Si) = W(Si) / GCD(W(S))
 *  3. remaining_value = total_calls % Sum(CW(S))
 *  4. Sx = Pick(remaining_value ∈ [Sum(CW(S0)...CW(Si-1)), Sum(CW(S0)...CW(Si))))
 *  5. total_calls = total_calls + 1
 *  6. return Sx
 */
class WRRLoadBalancer extends base_1.StatelessLoadBalancer {
    constructor() {
        super(...arguments);
        this.name = "WRRLoadBalancer";
        this.callStat = Object.create(null);
    }
    choose(namespace, service, instances) {
        // #region Round 1, 预处理
        /**
         * 当前服务被调用次数
         */
        let count = this.callStat[`${namespace}.${service}`];
        if (count >= 0) {
            count += 1;
        }
        else {
            count = 0;
            this.randomChoose(namespace, service, instances);
        }
        this.callStat[`${namespace}.${service}`] = count;
        /**
         * 各节点实际权重
         */
        let weights = instances.map(instance => ~~this.instanceWeight(instance));
        // #endregion
        // #region Round 2
        /*
         * Round 2:
         *  1. 计算所有权重的最大最大公约数 `gcd`
         *  2. 选取每个权重的互质数 `mpn` 作为新权重
         *  3. 计算新权重合
         */
        let totalWeight = 0;
        const gcd = (0, utils_1.GreatestCommonDivisor)(...weights.filter(weight => weight !== 0));
        if (!Number.isNaN(gcd)) {
            weights = weights.map((weight) => {
                const mpn = weight / gcd;
                totalWeight += mpn;
                return mpn;
            });
        }
        // #endregion
        // #region Round 3, 根据 WRR 算法选取目标节点
        if (!Number.isNaN(gcd)) {
            const remaining = count % totalWeight;
            for (let i = 0, effect = 0; i < weights.length; i += 1) {
                effect += weights[i];
                if (remaining < effect) {
                    return instances[i];
                }
            }
        }
        else {
            /**
             * 当所有权重均为 0(gcd = NaN) 时，退化为 RR
             */
            return instances[count % instances.length];
        }
        (0, utils_1.UNREACHABLE)();
        // #endregion
    }
}
exports.WRRLoadBalancer = WRRLoadBalancer;
//# sourceMappingURL=wrr.js.map