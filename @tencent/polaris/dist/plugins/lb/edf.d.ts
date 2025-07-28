import { Instance, InstanceStatus } from "../../instance";
import { StatelessLoadBalancer } from "./base";
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
export declare class EDFLoadBalancer extends StatelessLoadBalancer {
    readonly name: string;
    private readonly callStat;
    /**
     * 1. 选取拥有最小 `deadline` 的实例
     * 2. 将当前时间 `currentTime` 置为选取实例的 `deadline`
     * 3. 将选取实例的 `deadline` 增加一个 `step`
     */
    choose(namespace: string, service: string, instances: Instance[]): Instance;
    onStatusChange(namespace: string, service: string, instance: Instance, prevStatus: InstanceStatus): void;
}
