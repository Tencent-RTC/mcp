"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kProtoPath = exports.ProtobufFormat = exports.address2Instance = exports.kInstanceLocalVersion = exports.transformStatusChange = exports.protobuf2ms = exports.ms2protobuf = exports.isAnyAddr = exports.fastestRemote = exports.address2Endpoint = exports.isValidPort = exports.inspectEndpoints = void 0;
const net = require("net");
const path = require("path");
const __1 = require("../../..");
const utils_1 = require("../../../utils");
const types_1 = require("./types");
// #region Network
const kAnyAddrRegex = /^(0|[^0-9a-z])+$/i;
const kDetectionTimeout = 1 * utils_1.kSeconds;
/**
 * 转换为可读地址
 * @param inputs `EndPoint` 类型地址
 */
const inspectEndpoints = (inputs) => inputs.map(({ host, port }) => `${host}:${port}`).join(", ");
exports.inspectEndpoints = inspectEndpoints;
/**
 * 判断端口号是否合法
 * @param input 端口号
 */
const isValidPort = (input) => Number.isInteger(input) && input >= 0 && input <= (2 ** 16) - 1;
exports.isValidPort = isValidPort;
/**
 * 地址类型转换
 * `string` ---> `EndPoint`
 * @param input `string` 类型地址
 * @returns `EndPoint` 类型地址
 */
function address2Endpoint(input) {
    const [host, port] = input.split(":");
    const normalizedPort = Number.parseInt(port, 10);
    if (!(0, exports.isValidPort)(normalizedPort)) {
        throw new __1.ArgumentError("invalid port");
    }
    return {
        host,
        port: normalizedPort
    };
}
exports.address2Endpoint = address2Endpoint;
/**
 * 探测连接速度最快的远端节点
 * @param hosts 待探测远端节点列表
 * @param ms 最长探测时长
 * @returns 最快响应远端及其对应的本地节点 IP
 */
async function fastestRemote(hosts, ms = kDetectionTimeout) {
    const normalized = [];
    hosts.forEach((host) => {
        switch (typeof host) {
            case "string": {
                normalized.push(address2Endpoint(host));
                break;
            }
            case "object": {
                normalized.push(host);
                break;
            }
            default: {
                throw new __1.ArgumentError("invalid hosts");
            }
        }
    });
    return new Promise((resolve, reject) => {
        let isResolved = false;
        let rejectCount = 0;
        normalized.forEach((host) => {
            const socket = net.connect(Object.assign(Object.assign({}, host), { timeout: ms }))
                .once("connect", () => {
                if (!isResolved) {
                    const { localAddress, localPort } = socket;
                    if (localAddress && localPort && localPort > 0) {
                        isResolved = true;
                        resolve({
                            local: {
                                host: localAddress,
                                port: localPort
                            },
                            remote: host
                        });
                    }
                    else {
                        rejectCount += 1;
                        if (rejectCount === hosts.length) {
                            reject(new __1.NetworkError(`all remote hosts(${(0, exports.inspectEndpoints)(normalized)}) dead`));
                        }
                    }
                }
                socket.destroy();
            })
                .once("error", () => {
                if (!isResolved) {
                    rejectCount += 1;
                    if (rejectCount === hosts.length) {
                        reject(new __1.NetworkError(`all remote hosts(${(0, exports.inspectEndpoints)(normalized)}) dead`));
                    }
                }
            })
                .unref();
        });
    });
}
exports.fastestRemote = fastestRemote;
/**
 * 判断特定 IP(4/6) 是否为任意地址 `INADDR_ANY`
 * @param ip IP 地址
 * @returns 判定结果
 */
const isAnyAddr = (ip) => kAnyAddrRegex.test(ip);
exports.isAnyAddr = isAnyAddr;
function ms2protobuf(ms, format = ProtobufFormat.Original) {
    switch (format) {
        case ProtobufFormat.Original: {
            return {
                seconds: ms / utils_1.kSeconds,
                nanos: (ms % utils_1.kSeconds) * utils_1.kSeconds * utils_1.kNanos
            };
        }
        case ProtobufFormat.JSON: {
            return `${ms / utils_1.kSeconds}s`;
        }
        default: {
            (0, utils_1.UNREACHABLE)();
        }
    }
    (0, utils_1.UNREACHABLE)(); /** Stub */
}
exports.ms2protobuf = ms2protobuf;
/**
 * `protobuf` 时间格式转毫秒
 * @param time `protobuf` 时间格式
 */
function protobuf2ms(time) {
    switch (typeof time) {
        case "string": { /** ProtobufFormat.JSON */
            if (!time.endsWith("s")) {
                return NaN;
            }
            return parseFloat(time) * utils_1.kSeconds;
        }
        case "object": {
            const { seconds, nanos } = time;
            if (typeof seconds !== "number" || typeof nanos !== "number") {
                return NaN;
            }
            return Math.floor((seconds * utils_1.kSeconds) + (nanos / utils_1.kNanos));
        }
        default: {
            return NaN;
        }
    }
    (0, utils_1.UNREACHABLE)(); /** Stub */
}
exports.protobuf2ms = protobuf2ms;
// #endregion
/**
 * 转换实例状态至熔断器变更类型
 * @description `StatusChange` 为熔断器变更类型而非实例的状态，_也就是说，这里所需输出的状态与实例状态相反_
 * @param before 前一状态
 * @param after 下一状态
 */
const transformStatusChange = (before, after) => {
    if (before === 0 /* Normal */ && after === 3 /* Fused */) {
        return types_1.StatusChange.CloseToOpen;
    }
    if (before === 2 /* HalfClose */ || before === 1 /* HalfOpen */) {
        if (after === 0 /* Normal */) {
            return types_1.StatusChange.HalfOpenToClose;
        }
        if (after === 3 /* Fused */) {
            return types_1.StatusChange.HalfOpenToOpen;
        }
    }
    else if (before === 3 /* Fused */
        && (after === 2 /* HalfClose */ || after === 1 /* HalfOpen */)) {
        return types_1.StatusChange.OpenToHalfOpen;
    }
    return types_1.StatusChange.Unknown;
};
exports.transformStatusChange = transformStatusChange;
/**
 * 本地实例版本号
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
exports.kInstanceLocalVersion = "local";
/**
 * 通过地址列表生成对应实例列表
 * @param input 地址列表
 * @param protocol 协议
 */
const address2Instance = (input, protocol) => input.map((address) => {
    const endpoint = address2Endpoint(address);
    return Object.assign({ dynamicWeight: 0, logicSet: "", priority: 9, status: 0 /* Normal */, staticWeight: 100, protocol, version: exports.kInstanceLocalVersion, metadata: {
            protocol
        }, location: Object.assign({}, __1.blankLocation /** copy */), vpcId: "", id: `${endpoint.host}:${endpoint.port}` }, endpoint);
});
exports.address2Instance = address2Instance;
/**
 * `protobuf` 编码格式
 */
var ProtobufFormat;
(function (ProtobufFormat) {
    /** 原始格式 */
    ProtobufFormat[ProtobufFormat["Original"] = 0] = "Original";
    /** JSON 格式 */
    ProtobufFormat[ProtobufFormat["JSON"] = 1] = "JSON";
})(ProtobufFormat = exports.ProtobufFormat || (exports.ProtobufFormat = {}));
/**
 * Proto definition directory
 */
exports.kProtoPath = Object.freeze({
    [types_1.ServiceType.Discover]: path.join(__dirname, "discover-pb"),
    [types_1.ServiceType.Monitor]: path.join(__dirname, "monitor-pb"),
    [types_1.ServiceType.Ratelimit]: path.join(__dirname, "ratelimit-pb")
});
//# sourceMappingURL=utils.js.map