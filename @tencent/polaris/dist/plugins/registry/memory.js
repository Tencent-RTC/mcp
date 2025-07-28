"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryOnlyRegistry = void 0;
const plugins_1 = require("../../plugins");
class MemoryStorage {
    constructor() {
        this.storage = Object.create(null);
    }
    get(namespace, service) {
        var _d, _e;
        return (_e = (_d = this.storage[namespace]) === null || _d === void 0 ? void 0 : _d[service]) !== null && _e !== void 0 ? _e : null;
    }
    set(namespace, service, data) {
        const list = this.storage[namespace];
        if (list) {
            list[service] = data;
        }
        else {
            this.storage[namespace] = {
                [service]: data
            };
        }
    }
    delete(namespace, service) {
        if (this.get(namespace, service) === null) {
            return false;
        }
        delete this.storage[namespace][service];
        if (Object.keys(this.storage[namespace]).length === 0) {
            delete this.storage[namespace];
        }
        return true;
    }
    all() {
        return this.storage;
    }
}
class MemoryOnlyRegistry {
    constructor() {
        this.name = "MemoryOnlyRegistry";
        this.type = plugins_1.PluginType.LocalRegistry;
        this[_a] = new MemoryStorage();
        this[_b] = new MemoryStorage();
        this[_c] = new MemoryStorage();
    }
}
exports.MemoryOnlyRegistry = MemoryOnlyRegistry;
_a = plugins_1.RegistryCategory.Instance, _b = plugins_1.RegistryCategory.Rule, _c = plugins_1.RegistryCategory.Ratelimit;
//# sourceMappingURL=memory.js.map