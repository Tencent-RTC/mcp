"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StickyLoadBalancer = void 0;
const __1 = require("../..");
const plugins_1 = require("../../plugins");
const utils_1 = require("../../utils");
const weak_1 = require("../../weak");
const kDefaultOptions = {
    /**
     * 过期时间
     * * 当值 ≤0 时：则不启用此插件
     * * 当值为 `Infinity` 时：不启用过期
     */
    expireTime: 10 * utils_1.kMinutes
};
/**
 * Sticky Load Balancer
 * The returned instance of each call is the same
 * until it is not appear in the instance list or exceed expiration time
 */
class StickyLoadBalancer {
    constructor(next, options) {
        this.next = next;
        this.name = "StickyLoadBalancer";
        this.type = plugins_1.PluginType.LoadBalancer;
        this.disposed = false;
        this.sessions = Object.create(null);
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
        this.supportedWeightType = next.supportedWeightType;
    }
    // #region dispose
    dispose() {
        if (!this.disposed) {
            Object.values(this.sessions).forEach((session) => {
                clearTimeout(session.timer);
            });
            this.disposed = true;
        }
    }
    get isDisposed() {
        return this.disposed;
    }
    // #endregion
    choose(namespace, service, instances, args) {
        if (this.disposed) {
            throw new __1.StateError("Already disposed");
        }
        if (this.options.expireTime <= 0) {
            return this.next.choose(namespace, service, instances, args);
        }
        const session = this.sessions[`${namespace}.${service}`];
        let stickiedInstance;
        if (session) {
            const { ref, timer } = session;
            stickiedInstance = ref.find(instances);
            if (stickiedInstance === undefined) {
                stickiedInstance = this.next.choose(namespace, service, instances, args);
                ref.reset(stickiedInstance);
                session.timer = this.buildOrRefreshTimer(namespace, service, timer);
            }
        }
        else {
            stickiedInstance = this.next.choose(namespace, service, instances, args);
            this.sessions[`${namespace}.${service}`] = {
                ref: new weak_1.WeakReference(stickiedInstance),
                timer: this.buildOrRefreshTimer(namespace, service)
            };
        }
        return stickiedInstance;
    }
    buildOrRefreshTimer(namespace, service, timer) {
        if (this.options.expireTime === Infinity) {
            return;
        }
        if (typeof (timer === null || timer === void 0 ? void 0 : timer.refresh) === "function") { /** Timeout.refresh() only available for Node.js 10.2.0 and higher */
            timer.refresh();
            return timer;
        }
        if (timer) {
            clearTimeout(timer);
        }
        return setTimeout(() => {
            delete this.sessions[`${namespace}.${service}`];
        }, this.options.expireTime).unref();
    }
}
exports.StickyLoadBalancer = StickyLoadBalancer;
//# sourceMappingURL=sticky.js.map