"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPolarisHTTPClient = exports.isPolarisGRPCClient = exports.PolarisServerClient = exports.kProtoPath = exports.PolarisServerAdapter = void 0;
const grpc_1 = require("./connector/grpc");
const http_1 = require("./connector/http");
__exportStar(require("./connector/grpc"), exports);
__exportStar(require("./connector/http"), exports);
__exportStar(require("./types"), exports);
var adapter_1 = require("./adapter");
Object.defineProperty(exports, "PolarisServerAdapter", { enumerable: true, get: function () { return adapter_1.PolarisServerAdapter; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "kProtoPath", { enumerable: true, get: function () { return utils_1.kProtoPath; } });
/**
 * @description
 * Inheritance hierarchy:
 *  - |PolarisBaseAdapter|
 *    - |PolarisDiscoverAdapter| |PolarisMonitorAdapter| |PolarisRatelimitAdapter|
 *      - |PolarisServerAdapter|
 *        - |PolarisGRPCClient|
 *        - |PolarisHTTPClient|
 *
 * According to the current environment, automatically select suitable client as |PolarisServerClient|
 * Select Priority:
 *  |PolarisGRPCClient| --> |PolarisHTTPClient|
 */
exports.PolarisServerClient = [grpc_1.PolarisGRPCClient].find(client => client.isSupported()) || http_1.PolarisHTTPClient;
/**
 * Is equal or inherit from |PolarisGRPCClient|
 */
const isPolarisGRPCClient = (klass) => (klass === grpc_1.PolarisGRPCClient || klass.prototype instanceof grpc_1.PolarisGRPCClient);
exports.isPolarisGRPCClient = isPolarisGRPCClient;
/**
 * Is equal or inherit from |PolarisHTTPClient|
 */
const isPolarisHTTPClient = (klass) => (klass === exports.isPolarisHTTPClient || klass.prototype instanceof exports.isPolarisHTTPClient);
exports.isPolarisHTTPClient = isPolarisHTTPClient;
//# sourceMappingURL=index.js.map