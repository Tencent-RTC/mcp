"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatelessLoadBalancer = void 0;
const plugins_1 = require("../../plugins");
const kDefaultOptions = {
    /**
     * 是否开启动态权重
     */
    dynamicWeight: true
};
class StatelessLoadBalancer {
    constructor(options) {
        this.type = plugins_1.PluginType.LoadBalancer;
        this.supportedWeightType = 0 /* Dynamic */;
        this.options = Object.assign(Object.assign({}, kDefaultOptions), options);
    }
    instanceWeight(instance) {
        return instance.staticWeight + (this.options.dynamicWeight ? instance.dynamicWeight : 0);
    }
    /**
     * 随机 `choose` 多次，
     * 避免请求顺序固定导致的后端访问不均衡
     */
    randomChoose(namespace, service, instances, args) {
        const chooseCount = ~~(Math.random() * instances.length);
        for (let i = 0; i < chooseCount; i += 1) {
            this.choose(namespace, service, instances, args);
        }
    }
}
exports.StatelessLoadBalancer = StatelessLoadBalancer;
//# sourceMappingURL=base.js.map