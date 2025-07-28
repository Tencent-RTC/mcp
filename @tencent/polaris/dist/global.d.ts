declare const kDefaultOptions: {
    /**
     * 全局变量
     */
    globalVariables: Record<string, string>;
    /**
     * 开启状态上报
     */
    enableReporter: boolean;
};
export declare type GlobalOptions = typeof kDefaultOptions;
export declare function createGlobalOptions(options?: Partial<GlobalOptions>): {
    globalVariables: Record<string, string>;
    enableReporter: boolean;
};
export {};
