"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleTraceLogging = void 0;
const debug_1 = require("debug");
const util_1 = require("util");
const logging_1 = require("../../logging");
const plugins_1 = require("../../plugins");
class ConsoleTraceLogging {
    constructor() {
        this.type = plugins_1.PluginType.TraceLogging;
        this.name = "ConsoleTraceLogging";
        this.tracers = Object.create(null); // 使用 `protected` 便于继承时重写
    }
    log(severity, prefix, message, ...optionalParams) {
        const logger = console[logging_1.LogVerbosity[severity].toLowerCase()];
        if (prefix !== undefined) {
            logger(prefix, message, ...optionalParams);
        }
        else {
            logger(message, ...optionalParams);
        }
    }
    trace(tracer, transaction, message, ...optionalParams) {
        let trace = this.tracers[tracer];
        if (!trace) {
            trace = (0, debug_1.default)(tracer);
            this.tracers[tracer] = trace;
        }
        if (transaction !== undefined) {
            trace((0, util_1.format)("<%s>", transaction), (0, util_1.format)(message, ...optionalParams));
        }
        else {
            trace(message, ...optionalParams);
        }
    }
}
exports.ConsoleTraceLogging = ConsoleTraceLogging;
//# sourceMappingURL=console.js.map