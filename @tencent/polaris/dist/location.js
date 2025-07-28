"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersectionLocation = exports.blankLocation = exports.isEmptyLocation = exports.isLocationMatch = void 0;
const utils_1 = require("./utils");
/**
 * 判断两个位置信息是否匹配
 * @param a 位置信息 A
 * @param b 位置信息 B
 * @param level 比较级别
 */
const isLocationMatch = (a, b, level) => {
    switch (level) {
        case 2 /* Campus */: {
            return a.campus === b.campus && a.zone === b.zone && a.region === b.region;
        }
        case 1 /* Zone */: {
            return a.zone === b.zone && a.region === b.region;
        }
        case 0 /* Region */: {
            return a.region === b.region;
        }
        case 3 /* None */: {
            return false;
        }
        default: {
            (0, utils_1.UNREACHABLE)();
        }
    }
};
exports.isLocationMatch = isLocationMatch;
/**
 * 判断位置信息是否为空
 * @param loc 位置信息
 */
const isEmptyLocation = (loc) => {
    if (!loc) {
        return true;
    }
    return loc.campus === "" && loc.region === "" && loc.zone === "";
};
exports.isEmptyLocation = isEmptyLocation;
/**
 * 空白位置信息
 */
exports.blankLocation = Object.freeze({
    campus: "",
    region: "",
    zone: ""
});
/**
 * 找到两个位置信息相交的部分
 * @param a 位置信息 A
 * @param b 位置信息 B
 */
const intersectionLocation = (a, b) => {
    const intersection = Object.assign({}, exports.blankLocation);
    Object.keys(exports.blankLocation).forEach((key) => {
        const valueB = b[key];
        const valueA = a[key];
        if (valueA === valueB && valueA !== undefined) {
            intersection[key] = valueA;
        }
    });
    return intersection;
};
exports.intersectionLocation = intersectionLocation;
//# sourceMappingURL=location.js.map