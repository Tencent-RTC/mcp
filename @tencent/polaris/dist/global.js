"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGlobalOptions = void 0;
const kDefaultOptions = {
    /**
     * 全局变量
     */
    globalVariables: Object.create(null),
    /**
     * 开启状态上报
     */
    enableReporter: process.env.POLARIS_ENABLE_REPORTER !== "0"
};
function createGlobalOptions(options) {
    return Object.assign(Object.assign({}, kDefaultOptions), options);
}
exports.createGlobalOptions = createGlobalOptions;
//# sourceMappingURL=global.js.map