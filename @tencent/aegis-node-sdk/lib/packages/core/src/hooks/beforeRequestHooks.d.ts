import Core from '../core';
import { SendType } from '../interface';
import { Pipe } from '../pipes';
/**
 * beforeRequest 是 Aegis SDK 中最重要的 hook，可以拦截和修改所有的上报
 * 当 beforeRequest 返回 false 的时候，这条日志就不会上报
 * 当 beforeRequest 返回正常的log结构体的时候，Aegis 会按照返回值里面的数据，自动上报相应的数据
 */
export declare const beforeRequestHooks: (aegis: Core, logType: SendType | undefined) => Pipe;
