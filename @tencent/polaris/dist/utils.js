"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNIMPLEMENTED = exports.UNREACHABLE = exports.on = exports.GreatestCommonDivisor = exports.kDays = exports.kHours = exports.kMinutes = exports.kSeconds = exports.kMillisecond = exports.kNanos = exports.kModuleName = exports.kModuleVersion = void 0;
const errors_1 = require("./errors");
// #region Module Info
/* eslint-disable @typescript-eslint/naming-convention */
/*
 * note:
 *  由于这里引用了 `src` 外文件，导致在构建时输出目录不正确
 *  所以这里使用 require(...) 来代替 import ...
 */
const pkg = require("../package.json"); // eslint-disable-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
exports.kModuleVersion = pkg.version;
exports.kModuleName = pkg.name;
/* eslint-enable @typescript-eslint/naming-convention */
// #endregion
// #region Time Constant
/* eslint-disable @typescript-eslint/naming-convention */
exports.kNanos = 1000;
exports.kMillisecond = 1;
exports.kSeconds = 1000 * exports.kMillisecond;
exports.kMinutes = 60 * exports.kSeconds;
exports.kHours = 60 * exports.kMinutes;
exports.kDays = 24 * exports.kHours;
/* eslint-enable @typescript-eslint/naming-convention */
// #endregion
// #region Functions
/**
 * 求最大公约数
 * @param values 数值
 */
function GreatestCommonDivisor(...values) {
    const len = values.length;
    while (values.some(value => value !== values[0])) {
        values.sort((a, b) => b - a);
        for (let i = 0; i < len - 1; i++) {
            const remains = values[i] % values[i + 1];
            if (remains === 0) {
                values[i] = values[i + 1];
            }
            else {
                values[i] = remains;
            }
        }
    }
    return values[0] || NaN;
}
exports.GreatestCommonDivisor = GreatestCommonDivisor;
/**
 * 判断开关是否开启
 * @param it 开关字符串
 */
function on(it) {
    return !!it && it !== "0" && it !== "false" && it !== "off";
}
exports.on = on;
// #endregion
// #region Assert Method
/**
 * UNREACHABLE CODE
 */
function UNREACHABLE() {
    throw new errors_1.FatalError("UNREACHABLE CODE", UNREACHABLE);
}
exports.UNREACHABLE = UNREACHABLE;
/**
 * UNIMPLEMENTED
 */
function UNIMPLEMENTED() {
    throw new errors_1.FatalError("UNIMPLEMENTED", UNIMPLEMENTED);
}
exports.UNIMPLEMENTED = UNIMPLEMENTED;
// #endregion
//# sourceMappingURL=utils.js.map