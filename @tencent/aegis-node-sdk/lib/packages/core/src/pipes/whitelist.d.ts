import { Pipe } from './index';
import Core from '../core';
/**
 * 白名单请求的 pipeline
 * 白名单接口主要有三个作用
 *  1. 判断当前用户是否是白名单
 *  2. 获取当前应用的抽样率
 *  3. 判断当前上报是否合法（参数不对，上报id不对，当前应用已经停止上报，用户欠费等）
 * @param aegis
 * @returns
 */
export declare const createWhitelistPipe: (aegis: Core) => Pipe;
