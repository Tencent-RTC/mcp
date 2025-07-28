/**
 * Mirror of `PolarisService.DiscoverResponse.DiscoverResponseType`
 */
export declare enum DiscoverRequestType {
    UNKNOWN = 0,
    INSTANCE = 1,
    CLUSTER = 2,
    ROUTING = 3,
    RATE_LIMIT = 4
}
/**
 * Mirror of `PolarisService.MatchString.MatchStringType`
 */
export declare enum MatchStringType {
    EXACT = 0,
    REGEX = 1
}
/**
 * Mirror of `PolarisService.MatchString.ValueType`
 */
export declare enum ValueType {
    TEXT = 0,
    PARAMETER = 1,
    VARIABLE = 2
}
/**
 * Mirror of `MonitorService.StatusChange`
 */
export declare enum StatusChange {
    Unknown = 0,
    CloseToOpen = 1,
    OpenToHalfOpen = 2,
    HalfOpenToOpen = 3,
    HalfOpenToClose = 4
}
/**
 * Mirror of `MonitorService.RecoverAllStatus`
 */
export declare enum RecoverAllStatus {
    Invalid = 0,
    Start = 1,
    End = 2
}
export interface BoxType<T> {
    value?: T | null;
}
export interface Boxable {
    unbox<T>(value: BoxType<T> | T | null | undefined, defaultValue: T | (() => T)): T;
    box<T>(value: T): BoxType<T> | T | null | undefined;
}
export declare type DeconstructorWrappers<T> = {
    [P in keyof T]: NonNullable<T[P]> extends BoxType<unknown> ? keyof NonNullable<T[P]> extends "value" ? NonNullable<Extract<T[P], BoxType<unknown>>["value"]> | T[P] : DeconstructorWrappers<NonNullable<T[P]>> : DeconstructorWrappers<NonNullable<T[P]>>;
};
export declare enum ServiceType {
    Discover = 0,
    Monitor = 1,
    Ratelimit = 2
}
export interface ServiceInfo<DiscoverType, MonitorType, RatelimitType> {
    [ServiceType.Discover]: DiscoverType;
    [ServiceType.Monitor]: MonitorType;
    [ServiceType.Ratelimit]: RatelimitType;
}
export declare enum ClientType {
    SDK = 0,
    AGENT = 1
}
