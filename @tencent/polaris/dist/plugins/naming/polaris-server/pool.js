"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPool = void 0;
const process_1 = require("process");
const errors_1 = require("../../../errors");
const utils_1 = require("../../../utils");
const kDefaultClientPoolOptions = {
    /**
     * 检查间隔
     */
    checkInterval: 1 * utils_1.kMinutes,
    /**
     * 最长空闲时间
     */
    idleTime: 1 * utils_1.kMinutes
};
class ClientPool {
    constructor(clientCreator, options) {
        this.clientCreator = clientCreator;
        this.disposed = false;
        this.pool = Object.create(null);
        this.options = Object.assign(Object.assign({}, kDefaultClientPoolOptions), options);
        this.timer = setInterval(() => {
            this.maintenance();
        }, this.options.checkInterval).unref();
    }
    dispose() {
        this.disposed = true;
        clearInterval(this.timer);
        this.truncate();
    }
    truncate() {
        Object.values(this.pool).forEach(({ client }) => {
            var _a;
            (_a = client.close) === null || _a === void 0 ? void 0 : _a.call(client);
        });
        this.pool = Object.create(null);
    }
    getOrCreateClient(instance, type) {
        if (this.disposed) {
            throw new errors_1.StateError("Already disposed");
        }
        let address;
        if (typeof instance === "string") {
            address = instance;
        }
        else {
            address = `${instance.host}:${instance.port}`;
        }
        const key = `${address}.${type}`;
        let clientObj = this.pool[key];
        if (!clientObj) {
            clientObj = {
                client: this.clientCreator(address, type),
                accessTime: (0, process_1.uptime)()
            };
            this.pool[key] = clientObj;
        }
        else {
            clientObj.accessTime = (0, process_1.uptime)();
        }
        return clientObj.client;
    }
    maintenance() {
        const now = (0, process_1.uptime)();
        Object.keys(this.pool).forEach((key) => {
            var _a;
            const { client, accessTime } = this.pool[key];
            if ((now - accessTime) * utils_1.kSeconds > this.options.idleTime) {
                delete this.pool[key];
                (_a = client.close) === null || _a === void 0 ? void 0 : _a.call(client);
            }
        });
    }
}
exports.ClientPool = ClientPool;
//# sourceMappingURL=pool.js.map