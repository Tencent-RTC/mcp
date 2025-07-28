import './polyfill';
import Core from './core';
import Plugin from './plugin';
export { Plugin };
export default Core;
export { LogType, NormalLog, SpeedLog, BridgeLog, StaticAssetsLog, PagePerformanceLog, PagePerformanceLogForHippy3, HippyPagePerformanceLog, Config, CoreApiConfig, SendOption, SendSuccess, SendFail, SendType, PlatTypeNum, NetworkTypeNum, PagePerformanceStruct, } from './interface';
export { getDefaultConfig, setConfigUrl, globalAny, REPORT_TIMEOUT, MAX_FROM_LENGTH, ERROR_MSG_IGNORE, URL_SPEED_IGNORE, RESOURCE_TYPE_FETCH, RESOURCE_TYPE_STATIC, UNKNOWN, RESOURCE_TYPE, MAX_PROMISE_ERROR_MSG_LENGTH, } from './constant';
export * from './pipes';
export * from './util';
