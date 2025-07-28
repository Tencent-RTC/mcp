export declare enum LogType {
    INFO_ALL = "-1",
    API_RESPONSE = "1",
    INFO = "2",
    ERROR = "4",
    PROMISE_ERROR = "8",
    AJAX_ERROR = "16",
    SCRIPT_ERROR = "32",
    IMAGE_ERROR = "64",
    CSS_ERROR = "128",
    CONSOLE_ERROR = "256",
    MEDIA_ERROR = "512",
    RET_ERROR = "1024",
    PAGE_LOAD = "1025",
    SLOW_PAGE_LOAD = "1026",
    SLOW_NET_REQUEST = "1027",
    ASSERT_REQUEST = "1028",
    SLOW_ASSET_REQUEST = "1029",
    CLICK_EVENT = "1030",
    CONSOLE_LOG = "1031",
    REPORT = "2048",
    PV = "4096",
    EVENT = "8192",
    SPEED_EVENT = "8193",
    PAGE_NOT_FOUND_ERROR = "16384",
    WEBSOCKET_ERROR = "32768",
    BRIDGE_ERROR = "65536",
    LAZY_LOAD_ERROR = "131072"
}
export declare enum PlatTypeNum {
    android = 1,
    ios = 2,
    windows = 3,
    macos = 4,
    linux = 5,
    devtools = 6,
    other = 100
}
export declare enum NetworkTypeNum {
    unknown = 100,
    wifi = 1,
    net2g = 2,
    net3g = 3,
    net4g = 4,
    net5g = 5,
    net6g = 6
}
export interface NormalLog {
    msg: any;
    level: LogType;
    [key: string]: any;
}
export interface SpeedLog {
    url: string;
    isHttps: boolean;
    method: string;
    type: 'static' | 'fetch';
    duration?: number;
    nextHopProtocol?: string;
    ret?: string | number | 'unknown';
    status?: number;
    isErr?: number;
    payload?: any;
    [key: string]: any;
}
export interface BridgeLog {
    name: string;
    type: 'bridge';
    duration?: number;
    ret?: string | number | 'unknown';
    isErr?: number;
    [key: string]: any;
}
export interface PagePerformanceLog {
    dnsLookup: number;
    tcp: number;
    ssl: number;
    ttfb: number;
    contentDownload: number;
    domParse: number;
    resourceDownload: number;
    firstScreenTiming: number;
    [key: string]: any;
}
export interface PagePerformanceLogForHippy3 {
    nativeInit: number;
    jsEngineInit: number;
    runApplication: number;
    firstFrame: number;
    executeSource: number;
    loadSource: number;
    [key: string]: any;
}
export interface HippyPagePerformanceLog {
    engineInit: number;
    bundleLoad: number;
    firstScreenTiming: number;
    firstScreenRequest: number;
    loadEnd: number;
    [key: string]: any;
}
export interface StaticAssetsLog {
    url: string;
    isHttps: boolean;
    method: string;
    type: 'static' | 'fetch';
    duration?: number;
    nextHopProtocol?: string;
    ret?: string | 'unknown';
    status?: number;
    domainLookup: number;
    connectTime: number;
    urlQuery: string;
    transferSize?: number;
}
export interface ReportTimeLog {
    name: string;
    duration: number;
    ext1?: string;
    ext2?: string;
    ext3?: string;
    from?: string;
}
export interface EventLog {
    name: string;
    ext1?: string;
    ext2?: string;
    ext3?: string;
    from?: string;
}
