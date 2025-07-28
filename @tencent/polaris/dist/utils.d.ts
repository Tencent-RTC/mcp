export declare const kModuleVersion: string;
export declare const kModuleName: string;
export declare const kNanos = 1000;
export declare const kMillisecond = 1;
export declare const kSeconds: number;
export declare const kMinutes: number;
export declare const kHours: number;
export declare const kDays: number;
/**
 * 求最大公约数
 * @param values 数值
 */
export declare function GreatestCommonDivisor(...values: number[]): number;
/**
 * 判断开关是否开启
 * @param it 开关字符串
 */
export declare function on(it?: string): boolean;
/**
 * UNREACHABLE CODE
 */
export declare function UNREACHABLE(): never;
/**
 * UNIMPLEMENTED
 */
export declare function UNIMPLEMENTED(): never;
export declare type PartialSubset<T, U extends keyof T = never> = {
    [P in keyof T]: P extends U ? Partial<T[P]> : T[P];
};
export declare type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export declare type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export declare type RemoveNever<T> = Pick<T, {
    [K in keyof T]: T[K] extends never ? never : K;
}[keyof T]>;
export declare type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export declare type PromiseConstructorParameters = Parameters<ConstructorParameters<typeof Promise>[0]>;
