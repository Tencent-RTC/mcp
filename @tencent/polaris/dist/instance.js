"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChoosableInstance = exports.instanceCopy = void 0;
/**
 * 所需拷贝的静态属性值
 * note：这里不拷贝 `status` 与 `dynamicWeight`，以 `id` 进行关联
 */
const kStaticProps = [
    "vpcId",
    "host",
    "port",
    "metadata",
    "protocol",
    "staticWeight",
    "priority",
    "version",
    "logicSet",
    "location"
];
/**
 * 实例静态拷贝
 * @param from 源实例
 * @param to 目标实例
 */
const instanceCopy = (from, to) => {
    kStaticProps.forEach((key) => {
        to[key] = from[key];
    });
};
exports.instanceCopy = instanceCopy;
/**
 * 判断实例是否可被选取
 * @param instance 实例
 * @returns 是否可选取
 */
const isChoosableInstance = (instance) => (instance.status === 1 /* HalfOpen */ || instance.status === 0 /* Normal */);
exports.isChoosableInstance = isChoosableInstance;
//# sourceMappingURL=instance.js.map