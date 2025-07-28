"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersectionMetadata = exports.isEmptyMetadata = exports.isMetadataMatch = exports.MetadataDynamicValueSource = void 0;
const errors_1 = require("./errors");
const utils_1 = require("./utils");
// #region MedataCondition
/**
 * 元数据匹配条件，实际值来源
 */
var MetadataDynamicValueSource;
(function (MetadataDynamicValueSource) {
    /**
     * 来源于 `Payload` 字段
     */
    MetadataDynamicValueSource[MetadataDynamicValueSource["Payload"] = 0] = "Payload";
    /**
     * 来源于请求传入的值
     */
    MetadataDynamicValueSource[MetadataDynamicValueSource["Parameter"] = 1] = "Parameter";
    /**
     * 来源于配置或环境变量中获取的值
     */
    MetadataDynamicValueSource[MetadataDynamicValueSource["Variable"] = 2] = "Variable";
})(MetadataDynamicValueSource = exports.MetadataDynamicValueSource || (exports.MetadataDynamicValueSource = {}));
// #endregion
// #region isMetadataMatch
const isContainsPairs = (dict, key, value) => Object.keys(dict).some(name => key.test(name) && dict[name] === value);
function isMetadataMatch(val, cond, variables, parameters) {
    let matches;
    if (parameters === undefined) {
        matches = Object.create(null);
    }
    const result = Object.keys(cond).every((key) => {
        const value = val[key];
        const condition = cond[key];
        switch (typeof condition) {
            case "string": {
                return value === condition;
            }
            case "object": {
                if (condition instanceof RegExp) {
                    return condition.test(value);
                }
                switch (condition.source) {
                    case MetadataDynamicValueSource.Payload: {
                        const { payload } = condition;
                        if (typeof payload === "string") {
                            return value === payload;
                        }
                        if (payload instanceof RegExp) {
                            return payload.test(value);
                        }
                        break;
                    }
                    case MetadataDynamicValueSource.Parameter: {
                        if (parameters === undefined) {
                            if (value !== undefined) {
                                matches[key] = value;
                                return true;
                            }
                            return false;
                        }
                        return parameters[key] === value;
                    }
                    case MetadataDynamicValueSource.Variable: {
                        const { payload } = condition;
                        if (typeof payload === "string") {
                            return variables[payload] === value || process.env[payload] === value;
                        }
                        if (payload instanceof RegExp) {
                            return isContainsPairs(variables, payload, value) || isContainsPairs(process.env, payload, value);
                        }
                        break;
                    }
                    default: {
                        (0, utils_1.UNREACHABLE)();
                    }
                }
                throw new errors_1.ArgumentError(`|payload| fields expected [string|RegExp] type, but reveived ${typeof condition.payload}`);
            }
            default: {
                throw new errors_1.ArgumentError(`MetadataConditionValue expected [string|RegExp|object] type, but reveived ${typeof condition}`);
            }
        }
    });
    if (result && parameters === undefined) {
        return matches;
    }
    return result;
}
exports.isMetadataMatch = isMetadataMatch;
// #endregion
/**
 * 判断元数据是否为空
 * @param metadata 元数据
 */
function isEmptyMetadata(metadata) {
    return Object.keys(metadata).length === 0;
}
exports.isEmptyMetadata = isEmptyMetadata;
/**
 * 找到两个元数据相交的部分
 * @param a 元数据 A
 * @param b 元数据 B
 * @returns 交集
 */
function intersectionMetadata(a, b) {
    const intersection = {};
    Object.keys(a).forEach((key) => {
        const valueB = b[key];
        const valueA = a[key];
        if (valueA === valueB) {
            intersection[key] = valueA;
        }
    });
    return intersection;
}
exports.intersectionMetadata = intersectionMetadata;
//# sourceMappingURL=metadata.js.map