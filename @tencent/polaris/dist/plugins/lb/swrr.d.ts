import { Instance, InstanceStatus } from "../../instance";
import { StatelessLoadBalancer } from "./base";
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
export declare class NginxLoadBalancer extends StatelessLoadBalancer {
    readonly name: string;
    private readonly callStat;
    /**
     * 1. 将各个实例的 `currentWeight` 增加 `effectiveWeight`
     * 2. 选取拥有最大 `currentWeight` 的实例
     * 3. 将选取实例的 `currentWeight` 减少 `totalEffectiveWeight`
     */
    choose(namespace: string, service: string, instances: Instance[]): Instance;
    onStatusChange(namespace: string, service: string, instance: Instance, prevStatus: InstanceStatus): void;
}
