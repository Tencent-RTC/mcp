"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleProcessor = void 0;
const __1 = require("../../..");
const utils_1 = require("../../../utils");
const types_1 = require("./types");
class RuleProcessor {
    constructor(unbox) {
        this.unbox = unbox;
        /**
         * (empty function)
         */
    }
    procRules(rules) {
        const result = [];
        rules.forEach(({ sources, destinations }) => {
            if (sources && destinations) {
                result.push({
                    sources: this.procSourceRules(sources),
                    destinations: this.procDestinationRules(destinations)
                });
            }
        });
        return result;
    }
    produceMetadata(metadata) {
        const destMetadata = Object.create(null);
        if (metadata) {
            Object.keys(metadata).forEach((key) => {
                const matchString = metadata[key];
                if (matchString.value_type !== types_1.ValueType.PARAMETER && !matchString.value) {
                    return;
                }
                let payload;
                switch (matchString.type) {
                    case types_1.MatchStringType.EXACT: {
                        payload = this.unbox(matchString.value, "");
                        break;
                    }
                    case types_1.MatchStringType.REGEX: {
                        payload = new RegExp(this.unbox(matchString.value, ""));
                        break;
                    }
                    default: {
                        (0, utils_1.UNREACHABLE)();
                    }
                }
                switch (matchString.value_type) {
                    case types_1.ValueType.PARAMETER: {
                        destMetadata[key] = {
                            source: __1.MetadataDynamicValueSource.Parameter
                        };
                        break;
                    }
                    case types_1.ValueType.VARIABLE: {
                        destMetadata[key] = {
                            source: __1.MetadataDynamicValueSource.Variable,
                            payload
                        };
                        break;
                    }
                    case types_1.ValueType.TEXT: {
                        destMetadata[key] = {
                            source: __1.MetadataDynamicValueSource.Payload,
                            payload
                        };
                        break;
                    }
                    default: {
                        (0, utils_1.UNREACHABLE)();
                    }
                }
            });
        }
        return destMetadata;
    }
    procSourceRules(rules) {
        const result = [];
        rules.forEach(({ service, metadata }) => {
            const serviceName = this.unbox(service, "");
            if (serviceName) {
                const source = {
                    service: serviceName
                };
                if (metadata) {
                    source.metadata = this.produceMetadata(metadata);
                }
                result.push(source);
            }
        });
        return result;
    }
    procDestinationRules(rules) {
        const result = [];
        rules.forEach(({ service, metadata, priority, transfer, weight }) => {
            const serviceName = this.unbox(service, "");
            if (serviceName) {
                const dest = {
                    service: serviceName,
                    priority: this.unbox(priority, 9),
                    weight: this.unbox(weight, 0)
                };
                if (transfer) {
                    dest.transfer = this.unbox(transfer, "");
                }
                if (metadata) {
                    dest.metadata = this.produceMetadata(metadata);
                }
                result.push(dest);
            }
        });
        return result;
    }
}
exports.RuleProcessor = RuleProcessor;
//# sourceMappingURL=rules.js.map