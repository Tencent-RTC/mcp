import { Instance } from "../../instance";
import { StatelessLoadBalancer, StatelessLoadBalancerOptions } from "./base";
export declare type WRLoadBalancerOptions = StatelessLoadBalancerOptions;
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
export declare class WRLoadBalancer extends StatelessLoadBalancer {
    readonly name: string;
    choose(namespace: string, service: string, instances: Instance[]): Instance;
}
