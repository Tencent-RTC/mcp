"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarisGRPCClient = void 0;
const package_json_1 = require("@grpc/grpc-js/package.json");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const semver = require("semver");
const __1 = require("../../../../..");
const utils_1 = require("../../../../../utils");
const adapter_1 = require("../../adapter");
const types_1 = require("../../types");
const utils_2 = require("../../utils");
const bidi_1 = require("./bidi");
/**
 * `@grpc/grpc-js` 模块在导入时会校验当前环境是否满足其运行要求，
 * 如不满足直接抛出异常，由于 `import` 语法所限无法进行捕获，
 * 故在此采用 `require` 延迟加载。
 */
let grpcjs;
const kProtoFile = {
    [types_1.ServiceType.Discover]: path.join(__dirname, "pb", "discover.proto"),
    [types_1.ServiceType.Monitor]: path.join(__dirname, "pb", "monitor.proto"),
    [types_1.ServiceType.Ratelimit]: path.join(__dirname, "pb", "ratelimit.proto")
};
const kDefaultOptions = {
    /**
     * 调用超时时间
     */
    timeout: 10 * utils_1.kSeconds,
    /**
     * gRPC 配置项
     */
    grpc: {
        /**
         * gRPC CallOptions 配置项
         */
        call: {},
        /**
         * gRPC ChannelOptions 配置项
         */
        channel: {}
    }
};
const isIDiscoverRequest = (arg) => "type" in arg && "service" in arg;
const isIDiscoverResponse = (arg) => "type" in arg;
const isIdentifiablePacket = (arg) => Object.prototype.hasOwnProperty.call(arg, "id") || Object.prototype.hasOwnProperty.call(arg, "key");
const loadPackageDefinition = (type) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { emitWarning } = process;
    /*
     * note:
     *  由于 `@grpc/proto-loader` 在处理 options.includeDirs 时，
     *  对于 `import google/protobuf/*.proto` 会抛出不正确的异常，
     *  故在此屏蔽进行屏蔽，并在调用完 `loadSync` 后进行重置。
     */
    process.emitWarning = () => { };
    const packageDefinition = protoLoader.loadSync(kProtoFile[type], {
        defaults: true,
        keepCase: true,
        longs: Number,
        includeDirs: [utils_2.kProtoPath[type]]
    });
    process.emitWarning = emitWarning;
    return grpcjs.loadPackageDefinition(packageDefinition).v1;
};
class PolarisGRPCClient extends adapter_1.PolarisServerAdapter {
    constructor(remotes, options) {
        super(remotes, options);
        this.name = "PolarisGRPCClient";
        this.protocol = PolarisGRPCClient.protocol;
        this.format = utils_2.ProtobufFormat.Original;
        this.options = Object.assign(Object.assign(Object.assign(Object.assign({}, this.options), kDefaultOptions), options), { grpc: Object.assign(Object.assign(Object.assign({}, this.options.grpc), kDefaultOptions.grpc), options === null || options === void 0 ? void 0 : options.grpc) });
        if (!PolarisGRPCClient.isSupported()) {
            throw new __1.PluginError(`grpc client only works on Node ${package_json_1.engines.node}`);
        }
        if (!grpcjs) {
            grpcjs = require("@grpc/grpc-js"); // eslint-disable-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        }
        this.clientConstructor = {
            [types_1.ServiceType.Discover]: loadPackageDefinition(types_1.ServiceType.Discover).PolarisGRPC,
            [types_1.ServiceType.Monitor]: loadPackageDefinition(types_1.ServiceType.Monitor).GrpcAPI,
            [types_1.ServiceType.Ratelimit]: loadPackageDefinition(types_1.ServiceType.Ratelimit).RateLimitGRPC
        };
    }
    static isSupported() {
        return semver.satisfies(process.versions.node, package_json_1.engines.node);
    }
    box(value) {
        if (value === null || typeof value === "undefined") {
            return value;
        }
        return {
            value
        };
    }
    unbox(value, defaultValue) {
        const val = value;
        if (val && typeof val.value !== "undefined" && val.value !== null) {
            return val.value;
        }
        if (typeof defaultValue === "function") {
            return defaultValue();
        }
        return defaultValue;
    }
    // #region #AOP#
    /**
     * 实例化 Service Client，可重载此方法实现差异化配置
     * @param address 远端地址
     * @param type 远端类型
     * @param ServiceClient Service Client Class，函数必须返回它的实例
     * @param credentials grpc.credentials
     */
    instantiateServiceClient(address, type, ServiceClient, credentials) {
        return new ServiceClient(address, credentials.createInsecure(), this.options.grpc.channel);
    }
    /**
     * 获取 grpc.CallOptions 配置，可重载此方法实现差异化配置
     * @param address 远端地址
     * @param method 方法名
     * @param streaming 是否为 Bidi Stream
     */
    getCallOptions(address, method, streaming) {
        const { options: { timeout, grpc: { call: callOptions } } } = this;
        if (streaming) {
            return callOptions;
        }
        return Object.assign(Object.assign({}, callOptions), { deadline: Date.now() + timeout });
    }
    // #endregion
    buildClient(address, type) {
        const { logger, options: { timeout } } = this;
        const { transaction } = logger;
        logger.trace("Plugins" /* Plugins */, this.name, "buildClient", transaction, "remote address is", address, "and type is", type);
        const ServiceClient = this.clientConstructor[type]; // eslint-disable-line @typescript-eslint/naming-convention
        const grpcClient = this.instantiateServiceClient(address, type, ServiceClient, grpcjs.credentials);
        const client = Object.create(null);
        const bidi = [];
        for (const name of Object.keys(ServiceClient.service)) {
            const { requestStream, responseStream, originalName } = ServiceClient.service[name];
            const method = (originalName || name);
            if (!requestStream && !responseStream) {
                /* Unary */
                client[method] = ((request) => new Promise((resolve, reject) => {
                    grpcClient[name](request, this.getCallOptions(address, name, false), (err, value) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(value);
                        }
                    });
                }));
            }
            else if (requestStream && responseStream) {
                /* Bidi */
                const caller = new bidi_1.StreamCaller(grpcClient[name]
                    .bind(grpcClient, this.getCallOptions(address, name, true)), this.keyGenerator.bind(this), timeout);
                client[method] = ((request) => caller.request(request));
                bidi.push(caller);
            }
            else {
                (0, utils_1.UNREACHABLE)();
            }
        }
        client.close = () => {
            logger.trace("Plugins" /* Plugins */, this.name, "buildClient", transaction, "close all client");
            bidi.forEach(caller => caller.close());
            /*
             * avoid GRPC Error:
             *  14 UNAVAILABLE: No connection established
             */
            try {
                grpcClient.close();
            }
            catch (e) {
                logger.trace("Plugins" /* Plugins */, this.name, "buildClient", transaction, "close grpc client exception with", e);
                logger.error(`[${this.name}] [close]`, e);
            }
        };
        return client;
    }
    requestKeyGenerator(request) {
        var _a;
        if (isIDiscoverRequest(request) && request.service) {
            const { namespace, name } = request.service;
            return {
                keys: [namespace, name],
                type: request.type
            };
        }
        if (isIdentifiablePacket(request)) {
            return {
                keys: [(_a = request.id) !== null && _a !== void 0 ? _a : request.key],
                type: "*"
            };
        }
        (0, utils_1.UNREACHABLE)();
    }
    responseKeyGenerator(response) {
        var _a;
        if (isIDiscoverResponse(response)) {
            /** intentional convert */
            switch (response.type) {
                case types_1.DiscoverRequestType.INSTANCE: // [[fallthrough]]
                case types_1.DiscoverRequestType.ROUTING: // [[fallthrough]]
                case types_1.DiscoverRequestType.RATE_LIMIT: {
                    if (response.service) {
                        const { namespace, name } = response.service;
                        return {
                            keys: [namespace, name],
                            type: response.type
                        };
                    }
                    (0, utils_1.UNREACHABLE)();
                }
                case types_1.DiscoverRequestType.CLUSTER: // [[fallthrough]]
                case types_1.DiscoverRequestType.UNKNOWN: // [[fallthrough]]
                default: {
                    (0, utils_1.UNREACHABLE)();
                }
            }
            (0, utils_1.UNREACHABLE)(); /** Stub */
        }
        if (isIdentifiablePacket(response)) {
            return {
                keys: [(_a = response.id) !== null && _a !== void 0 ? _a : response.key],
                type: "*"
            };
        }
        (0, utils_1.UNREACHABLE)();
    }
    keyGenerator(direction, packet) {
        let type;
        let keys;
        switch (direction) {
            case bidi_1.PacketDirection.Request: {
                ({ keys, type } = this.requestKeyGenerator(packet));
                break;
            }
            case bidi_1.PacketDirection.Response: {
                ({ keys, type } = this.responseKeyGenerator(packet));
                break;
            }
            default: {
                (0, utils_1.UNREACHABLE)();
            }
        }
        keys = keys.map(key => this.unbox(key, typeof key === "string" ? key : ""));
        if (keys.every(key => key === "") || type === undefined) {
            (0, utils_1.UNREACHABLE)();
        }
        return `${type}.${keys.join(".")}`;
    }
}
exports.PolarisGRPCClient = PolarisGRPCClient;
PolarisGRPCClient.protocol = "grpc";
PolarisGRPCClient.port = 8081;
//# sourceMappingURL=index.js.map