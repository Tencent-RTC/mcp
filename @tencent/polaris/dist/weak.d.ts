export interface WeakReference<T> {
    equal(value: T): boolean;
    find(values: T[]): T | undefined;
    reset(target: T): WeakReference<T>;
}
declare type WeakReferenceConstructor = new <T extends object>(target: T) => WeakReference<T>;
/**
 * `WeakReference` 提供 Weak 类型容器，用于兼容不支持 `WeakRef` 环境
 */
export declare const WeakReference: WeakReferenceConstructor;
export {};
