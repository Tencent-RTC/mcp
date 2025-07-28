/// <reference types="debug" />
import { LogVerbosity } from "../../logging";
import { PluginType, TraceLoggingPlugin } from "../../plugins";
export declare class ConsoleTraceLogging implements TraceLoggingPlugin {
    readonly type = PluginType.TraceLogging;
    readonly name = "ConsoleTraceLogging";
    protected readonly tracers: Partial<Record<string, import("debug").Debugger>>;
    log(severity: LogVerbosity, prefix?: unknown, message?: unknown, ...optionalParams: unknown[]): void;
    trace(tracer: string, transaction: unknown, message?: unknown, ...optionalParams: unknown[]): void;
}
