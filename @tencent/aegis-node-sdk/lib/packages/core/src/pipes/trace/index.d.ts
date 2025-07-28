export interface SWOptions {
    host: string;
    pathname: string;
}
export declare type TraceType = 'traceparent' | 'b3' | 'sw8' | 'sentry-trace';
/**
 * 根据用户配置的参数构建 trace 协议
 * 目前适配 opentelemetry，skywalking，sentry-trace，b3协议，后续可以自由扩展
 */
export declare class TraceRequestHeader {
    private traceType;
    private traceId;
    private ignoreUrls;
    private urls;
    private url;
    private traceFlag;
    constructor(traceType: TraceType, ignoreUrls: Array<string | RegExp>, urls?: Array<string | RegExp> | null, traceFlag?: boolean | number | unknown);
    generate(url: string, headers?: HeadersInit | any, options?: SWOptions): {
        name: TraceType;
        value: string;
    } | undefined;
    private createTraceparent;
    private createB3;
    private createSw8;
    private createSentryTrace;
    private isUrlIgnored;
    private isUrlInTraceUrls;
    private urlMatches;
}
export declare const isTraceHeader: (key: string) => boolean;
export declare const parseNormalTraceRequestHeader: (headers: HeadersInit | undefined) => string;
export * from './jwt';
export * from './ot-js';
export * from './uuid';
