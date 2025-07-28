/**
 * 配置Interface
 */
export declare type CoreApiConfig = {
    apiDetail?: boolean;
    reportRequest?: boolean;
    resourceTypeHandler?: Function | undefined;
    retCodeHandler?: Function | undefined;
    reqParamHandler?: Function | undefined;
    resBodyHandler?: Function | undefined;
    resHeaders?: Array<string>;
    reqHeaders?: Array<string>;
};
export interface Config {
    id?: string;
    uin?: number | string;
    aid?: boolean | string;
    onError?: boolean;
    device?: boolean;
    env?: string;
    version?: number | string;
    delay?: number;
    repeat?: number | object;
    random?: number;
    speedSample?: boolean;
    hostUrl?: string;
    url?: string;
    maxLength?: number;
    customTimeUrl?: string;
    whiteListUrl?: string;
    offlineUrl?: string;
    pvUrl?: string;
    speedUrl?: string;
    performanceUrl?: string;
    performanceUrlForHippy?: string;
    eventUrl?: string;
    webVitalsUrl?: string;
    setDataReportUrl?: string;
    pageUrl?: string;
    getNetworkType?: Function;
    websocketHack?: boolean;
    beforeReport?: Function;
    logCreated?: Function;
    onReport?: Function;
    onWhitelist?: Function;
    api?: CoreApiConfig;
    beforeReportSpeed?: Function;
    reportAssetSpeed?: boolean | object;
    beforeRequest?: Function;
    afterRequest?: Function;
    urlHandler?: Function;
    ext1?: string;
    ext2?: string;
    ext3?: string;
    destroy?: Function;
    pagePerformance?: boolean | PagePerformanceStruct;
    [key: string]: any;
}
export interface PagePerformanceStruct {
    firstScreenInfo?: false;
    urlHandler?: () => string;
}
