import { NormalLog, SpeedLog, BridgeLog } from '../interface';
export { EventEmitter, InterfaceEventEmitter, } from './event-emitter';
export declare const buildLogParam: (logs: NormalLog | NormalLog[]) => string;
/**
 * 将上报数据统一成 json 格式
 * @param logs
 * @returns
 */
export declare const buildLog2Json: (logs: NormalLog | NormalLog[]) => string;
interface P {
    [k: string]: any;
}
/**
 * 拼接上报请求 query 参数
 * @param url
 * @param param
 * @returns
 */
export declare const buildParam: (url: string, param: P) => string;
export declare const encodeOnce: (str: string) => string;
export declare enum ReportDefaultVal {
    number = -1,
    string = ""
}
export declare const getReportVal: <T>(rawVal?: T | undefined, isDefaultByString?: boolean | undefined) => T | ReportDefaultVal;
export declare const formatUrl: (url: string, isGetQuery?: boolean | undefined) => string;
export declare const shortUrl: (url: string, maxLength?: number) => string;
export declare const urlIsHttps: (url: string) => boolean;
export declare const isNative: (Ctor: any) => boolean;
export declare const isRequestAsset: (contentType?: string, url?: string) => boolean;
interface TryToGetRetCodeRsp {
    code: string;
    isErr: boolean;
}
interface TryToGetRetCodeParams {
    url?: string;
    ctx?: any;
    payload?: any;
}
export declare const tryToGetRetCodeAsync: (obj: any, api?: Record<string, any> | undefined, params?: TryToGetRetCodeParams | undefined, callback?: Function | undefined) => void;
export declare const tryToGetRetCode: (obj: any, api?: Record<string, any> | undefined, params?: TryToGetRetCodeParams | undefined) => TryToGetRetCodeRsp;
export declare const formatApiDetail: (data: any, invokeFunc: Function | undefined, params: {
    url?: string;
    ctx?: any;
}) => string;
export declare const stringifyPlus: (target: any) => string;
export declare const stringify: (target: any) => string;
export declare const stringifyObj: (obj: any, deep?: number) => string;
export declare const speedShim: (logs: SpeedLog | SpeedLog[] | BridgeLog | BridgeLog[], bean: any) => any;
export declare const completeLogs: (logs: any, keys: string[] | string) => any;
/**
 * 是否忽略当前 url
 * @param url
 * @returns boolean
 */
export declare const isIgnoreUrl: (url: string, hostUrl: string | undefined) => boolean;
declare type AnyObject = {
    [key: string]: any;
};
export declare const extendUrl: (url: string, obj: AnyObject, filterKeys?: string[] | undefined) => string;
