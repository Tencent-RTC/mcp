/// <reference types="node" />
import { ClientDuplexStream } from "@grpc/grpc-js";
import { EventEmitter } from "events";
export declare const enum StreamCallerEvent {
    PushReceived = "PushReceived"
}
export declare enum PacketDirection {
    Request = 0,
    Response = 1
}
export interface KeyGenerator<RequestType, ResponseType> {
    (direction: PacketDirection.Request, request: RequestType): string;
    (direction: PacketDirection.Response, response: ResponseType): string;
}
export declare class StreamCaller<RequestType = unknown, ResponseType = unknown> extends EventEmitter {
    private readonly streamCreator;
    private readonly keyGenerator;
    private readonly timeout;
    private callStream;
    private activeRequests;
    constructor(streamCreator: () => ClientDuplexStream<RequestType, ResponseType>, keyGenerator: KeyGenerator<RequestType, ResponseType>, timeout: number);
    init(): void;
    request(request: RequestType): Promise<ResponseType>;
    close(e?: Error): void;
    private handleResponse;
}
