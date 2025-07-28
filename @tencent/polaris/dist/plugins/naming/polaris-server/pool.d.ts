import { Instance } from "../../../instance";
import type { ServiceType } from "./types";
declare const kDefaultClientPoolOptions: {
    /**
     * 检查间隔
     */
    checkInterval: number;
    /**
     * 最长空闲时间
     */
    idleTime: number;
};
export declare type ClientPoolOptions = typeof kDefaultClientPoolOptions;
export interface ClosableClient {
    close?: () => void;
}
export declare class ClientPool<Client extends ClosableClient> {
    private readonly clientCreator;
    private readonly options;
    private timer;
    private disposed;
    private pool;
    constructor(clientCreator: (address: string, type: ServiceType) => Client, options?: Partial<ClientPoolOptions>);
    dispose(): void;
    truncate(): void;
    getOrCreateClient(instance: string | Instance, type: ServiceType): Client;
    private maintenance;
}
export {};
