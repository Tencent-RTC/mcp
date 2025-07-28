"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientType = exports.ServiceType = exports.RecoverAllStatus = exports.StatusChange = exports.ValueType = exports.MatchStringType = exports.DiscoverRequestType = void 0;
// #region enum mirrors
/**
 * Mirror of `PolarisService.DiscoverResponse.DiscoverResponseType`
 */
var DiscoverRequestType;
(function (DiscoverRequestType) {
    DiscoverRequestType[DiscoverRequestType["UNKNOWN"] = 0] = "UNKNOWN";
    DiscoverRequestType[DiscoverRequestType["INSTANCE"] = 1] = "INSTANCE";
    DiscoverRequestType[DiscoverRequestType["CLUSTER"] = 2] = "CLUSTER";
    DiscoverRequestType[DiscoverRequestType["ROUTING"] = 3] = "ROUTING";
    DiscoverRequestType[DiscoverRequestType["RATE_LIMIT"] = 4] = "RATE_LIMIT";
})(DiscoverRequestType = exports.DiscoverRequestType || (exports.DiscoverRequestType = {}));
/**
 * Mirror of `PolarisService.MatchString.MatchStringType`
 */
var MatchStringType;
(function (MatchStringType) {
    MatchStringType[MatchStringType["EXACT"] = 0] = "EXACT";
    MatchStringType[MatchStringType["REGEX"] = 1] = "REGEX";
})(MatchStringType = exports.MatchStringType || (exports.MatchStringType = {}));
/**
 * Mirror of `PolarisService.MatchString.ValueType`
 */
var ValueType;
(function (ValueType) {
    ValueType[ValueType["TEXT"] = 0] = "TEXT";
    ValueType[ValueType["PARAMETER"] = 1] = "PARAMETER";
    ValueType[ValueType["VARIABLE"] = 2] = "VARIABLE";
})(ValueType = exports.ValueType || (exports.ValueType = {}));
/**
 * Mirror of `MonitorService.StatusChange`
 */
var StatusChange;
(function (StatusChange) {
    StatusChange[StatusChange["Unknown"] = 0] = "Unknown";
    StatusChange[StatusChange["CloseToOpen"] = 1] = "CloseToOpen";
    StatusChange[StatusChange["OpenToHalfOpen"] = 2] = "OpenToHalfOpen";
    StatusChange[StatusChange["HalfOpenToOpen"] = 3] = "HalfOpenToOpen";
    StatusChange[StatusChange["HalfOpenToClose"] = 4] = "HalfOpenToClose";
})(StatusChange = exports.StatusChange || (exports.StatusChange = {}));
/**
 * Mirror of `MonitorService.RecoverAllStatus`
 */
var RecoverAllStatus;
(function (RecoverAllStatus) {
    RecoverAllStatus[RecoverAllStatus["Invalid"] = 0] = "Invalid";
    RecoverAllStatus[RecoverAllStatus["Start"] = 1] = "Start";
    RecoverAllStatus[RecoverAllStatus["End"] = 2] = "End";
})(RecoverAllStatus = exports.RecoverAllStatus || (exports.RecoverAllStatus = {}));
// #endregion
// #region Service
var ServiceType;
(function (ServiceType) {
    ServiceType[ServiceType["Discover"] = 0] = "Discover";
    ServiceType[ServiceType["Monitor"] = 1] = "Monitor";
    ServiceType[ServiceType["Ratelimit"] = 2] = "Ratelimit";
})(ServiceType = exports.ServiceType || (exports.ServiceType = {}));
// #endregion
var ClientType;
(function (ClientType) {
    ClientType[ClientType["SDK"] = 0] = "SDK";
    ClientType[ClientType["AGENT"] = 1] = "AGENT";
})(ClientType = exports.ClientType || (exports.ClientType = {}));
//# sourceMappingURL=types.js.map