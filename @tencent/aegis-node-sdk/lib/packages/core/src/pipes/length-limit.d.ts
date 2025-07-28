import { Pipe } from './index';
import Core from '../core';
/**
 * 限制每条日志的长度，解决上报日志过大的问题
 * @param aegis
 * @returns
 */
export declare const createLimitLengthPipe: (aegis: Core) => Pipe;
