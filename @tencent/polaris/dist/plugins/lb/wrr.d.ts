import { Instance } from "../../instance";
import { StatelessLoadBalancer } from "./base";
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
export declare class WRRLoadBalancer extends StatelessLoadBalancer {
    readonly name: string;
    private readonly callStat;
    choose(namespace: string, service: string, instances: Instance[]): Instance;
}
