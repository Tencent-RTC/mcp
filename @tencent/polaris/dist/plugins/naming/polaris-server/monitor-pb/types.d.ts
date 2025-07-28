import * as $protobuf from "protobufjs";
/** Namespace v1. */
export namespace v1 {

    /** Represents a MonitorApi */
    class MonitorApi extends $protobuf.rpc.Service {

        /**
         * Constructs a new MonitorApi service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Calls CollectServerStatistics.
         * @param request ServerStatistics message or plain object
         * @param callback Node-style callback called with the error, if any, and StatResponse
         */
        public collectServerStatistics(request: v1.IServerStatistics, callback: v1.MonitorApi.CollectServerStatisticsCallback): void;

        /**
         * Calls CollectServerStatistics.
         * @param request ServerStatistics message or plain object
         * @returns Promise
         */
        public collectServerStatistics(request: v1.IServerStatistics): Promise<v1.StatResponse>;

        /**
         * Calls CollectSdkapiStatistics.
         * @param request SDKAPIStatistics message or plain object
         * @param callback Node-style callback called with the error, if any, and StatResponse
         */
        public collectSdkapiStatistics(request: v1.ISDKAPIStatistics, callback: v1.MonitorApi.CollectSdkapiStatisticsCallback): void;

        /**
         * Calls CollectSdkapiStatistics.
         * @param request SDKAPIStatistics message or plain object
         * @returns Promise
         */
        public collectSdkapiStatistics(request: v1.ISDKAPIStatistics): Promise<v1.StatResponse>;

        /**
         * Calls CollectServiceStatistics.
         * @param request ServiceStatistics message or plain object
         * @param callback Node-style callback called with the error, if any, and StatResponse
         */
        public collectServiceStatistics(request: v1.IServiceStatistics, callback: v1.MonitorApi.CollectServiceStatisticsCallback): void;

        /**
         * Calls CollectServiceStatistics.
         * @param request ServiceStatistics message or plain object
         * @returns Promise
         */
        public collectServiceStatistics(request: v1.IServiceStatistics): Promise<v1.StatResponse>;

        /**
         * Calls CollectSdkConfiguration.
         * @param request SDKConfig message or plain object
         * @param callback Node-style callback called with the error, if any, and StatResponse
         */
        public collectSdkConfiguration(request: v1.ISDKConfig, callback: v1.MonitorApi.CollectSdkConfigurationCallback): void;

        /**
         * Calls CollectSdkConfiguration.
         * @param request SDKConfig message or plain object
         * @returns Promise
         */
        public collectSdkConfiguration(request: v1.ISDKConfig): Promise<v1.StatResponse>;

        /**
         * Calls CollectSdkCache.
         * @param request ServiceInfo message or plain object
         * @param callback Node-style callback called with the error, if any, and StatResponse
         */
        public collectSdkCache(request: v1.IServiceInfo, callback: v1.MonitorApi.CollectSdkCacheCallback): void;

        /**
         * Calls CollectSdkCache.
         * @param request ServiceInfo message or plain object
         * @returns Promise
         */
        public collectSdkCache(request: v1.IServiceInfo): Promise<v1.StatResponse>;

        /**
         * Calls CollectCircuitBreak.
         * @param request ServiceCircuitbreak message or plain object
         * @param callback Node-style callback called with the error, if any, and StatResponse
         */
        public collectCircuitBreak(request: v1.IServiceCircuitbreak, callback: v1.MonitorApi.CollectCircuitBreakCallback): void;

        /**
         * Calls CollectCircuitBreak.
         * @param request ServiceCircuitbreak message or plain object
         * @returns Promise
         */
        public collectCircuitBreak(request: v1.IServiceCircuitbreak): Promise<v1.StatResponse>;
    }

    namespace MonitorApi {

        /**
         * Callback as used by {@link v1.MonitorApi#collectServerStatistics}.
         * @param error Error, if any
         * @param [response] StatResponse
         */
        type CollectServerStatisticsCallback = (error: (Error|null), response?: v1.StatResponse) => void;

        /**
         * Callback as used by {@link v1.MonitorApi#collectSdkapiStatistics}.
         * @param error Error, if any
         * @param [response] StatResponse
         */
        type CollectSdkapiStatisticsCallback = (error: (Error|null), response?: v1.StatResponse) => void;

        /**
         * Callback as used by {@link v1.MonitorApi#collectServiceStatistics}.
         * @param error Error, if any
         * @param [response] StatResponse
         */
        type CollectServiceStatisticsCallback = (error: (Error|null), response?: v1.StatResponse) => void;

        /**
         * Callback as used by {@link v1.MonitorApi#collectSdkConfiguration}.
         * @param error Error, if any
         * @param [response] StatResponse
         */
        type CollectSdkConfigurationCallback = (error: (Error|null), response?: v1.StatResponse) => void;

        /**
         * Callback as used by {@link v1.MonitorApi#collectSdkCache}.
         * @param error Error, if any
         * @param [response] StatResponse
         */
        type CollectSdkCacheCallback = (error: (Error|null), response?: v1.StatResponse) => void;

        /**
         * Callback as used by {@link v1.MonitorApi#collectCircuitBreak}.
         * @param error Error, if any
         * @param [response] StatResponse
         */
        type CollectCircuitBreakCallback = (error: (Error|null), response?: v1.StatResponse) => void;
    }

    /** Properties of a ServerStatistics. */
    interface IServerStatistics {

        /** ServerStatistics id */
        id?: (google.protobuf.IStringValue|null);

        /** ServerStatistics key */
        key?: (v1.IServerStatisticsKey|null);

        /** ServerStatistics value */
        value?: (v1.IIndicator|null);
    }

    /** Represents a ServerStatistics. */
    class ServerStatistics implements IServerStatistics {

        /**
         * Constructs a new ServerStatistics.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IServerStatistics);

        /** ServerStatistics id. */
        public id?: (google.protobuf.IStringValue|null);

        /** ServerStatistics key. */
        public key?: (v1.IServerStatisticsKey|null);

        /** ServerStatistics value. */
        public value?: (v1.IIndicator|null);
    }

    /** Properties of a ServerStatisticsKey. */
    interface IServerStatisticsKey {

        /** ServerStatisticsKey server_host */
        server_host?: (google.protobuf.IStringValue|null);

        /** ServerStatisticsKey resource */
        resource?: (google.protobuf.IStringValue|null);

        /** ServerStatisticsKey operation */
        operation?: (google.protobuf.IStringValue|null);

        /** ServerStatisticsKey code */
        code?: (google.protobuf.IStringValue|null);

        /** ServerStatisticsKey success */
        success?: (google.protobuf.IBoolValue|null);

        /** ServerStatisticsKey delay_range */
        delay_range?: (google.protobuf.IStringValue|null);
    }

    /** Represents a ServerStatisticsKey. */
    class ServerStatisticsKey implements IServerStatisticsKey {

        /**
         * Constructs a new ServerStatisticsKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IServerStatisticsKey);

        /** ServerStatisticsKey server_host. */
        public server_host?: (google.protobuf.IStringValue|null);

        /** ServerStatisticsKey resource. */
        public resource?: (google.protobuf.IStringValue|null);

        /** ServerStatisticsKey operation. */
        public operation?: (google.protobuf.IStringValue|null);

        /** ServerStatisticsKey code. */
        public code?: (google.protobuf.IStringValue|null);

        /** ServerStatisticsKey success. */
        public success?: (google.protobuf.IBoolValue|null);

        /** ServerStatisticsKey delay_range. */
        public delay_range?: (google.protobuf.IStringValue|null);
    }

    /** Properties of a SDKAPIStatistics. */
    interface ISDKAPIStatistics {

        /** SDKAPIStatistics id */
        id?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatistics key */
        key?: (v1.ISDKAPIStatisticsKey|null);

        /** SDKAPIStatistics value */
        value?: (v1.IIndicator|null);
    }

    /** Represents a SDKAPIStatistics. */
    class SDKAPIStatistics implements ISDKAPIStatistics {

        /**
         * Constructs a new SDKAPIStatistics.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.ISDKAPIStatistics);

        /** SDKAPIStatistics id. */
        public id?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatistics key. */
        public key?: (v1.ISDKAPIStatisticsKey|null);

        /** SDKAPIStatistics value. */
        public value?: (v1.IIndicator|null);
    }

    /** Properties of a SDKAPIStatisticsKey. */
    interface ISDKAPIStatisticsKey {

        /** SDKAPIStatisticsKey client_host */
        client_host?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey sdk_api */
        sdk_api?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey res_code */
        res_code?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey success */
        success?: (google.protobuf.IBoolValue|null);

        /** SDKAPIStatisticsKey delay_range */
        delay_range?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey client_version */
        client_version?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey client_type */
        client_type?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey result */
        result?: (v1.APIResultType|null);
    }

    /** Represents a SDKAPIStatisticsKey. */
    class SDKAPIStatisticsKey implements ISDKAPIStatisticsKey {

        /**
         * Constructs a new SDKAPIStatisticsKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.ISDKAPIStatisticsKey);

        /** SDKAPIStatisticsKey client_host. */
        public client_host?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey sdk_api. */
        public sdk_api?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey res_code. */
        public res_code?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey success. */
        public success?: (google.protobuf.IBoolValue|null);

        /** SDKAPIStatisticsKey delay_range. */
        public delay_range?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey client_version. */
        public client_version?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey client_type. */
        public client_type?: (google.protobuf.IStringValue|null);

        /** SDKAPIStatisticsKey result. */
        public result: v1.APIResultType;
    }

    /** Properties of an Indicator. */
    interface IIndicator {

        /** Indicator total_request_per_minute */
        total_request_per_minute?: (google.protobuf.IUInt32Value|null);
    }

    /** Represents an Indicator. */
    class Indicator implements IIndicator {

        /**
         * Constructs a new Indicator.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IIndicator);

        /** Indicator total_request_per_minute. */
        public total_request_per_minute?: (google.protobuf.IUInt32Value|null);
    }

    /** Properties of a ServiceStatistics. */
    interface IServiceStatistics {

        /** ServiceStatistics id */
        id?: (google.protobuf.IStringValue|null);

        /** ServiceStatistics key */
        key?: (v1.IServiceStatisticsKey|null);

        /** ServiceStatistics value */
        value?: (v1.IServiceIndicator|null);
    }

    /** Represents a ServiceStatistics. */
    class ServiceStatistics implements IServiceStatistics {

        /**
         * Constructs a new ServiceStatistics.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IServiceStatistics);

        /** ServiceStatistics id. */
        public id?: (google.protobuf.IStringValue|null);

        /** ServiceStatistics key. */
        public key?: (v1.IServiceStatisticsKey|null);

        /** ServiceStatistics value. */
        public value?: (v1.IServiceIndicator|null);
    }

    /** Properties of a ServiceStatisticsKey. */
    interface IServiceStatisticsKey {

        /** ServiceStatisticsKey caller_host */
        caller_host?: (google.protobuf.IStringValue|null);

        /** ServiceStatisticsKey namespace */
        namespace?: (google.protobuf.IStringValue|null);

        /** ServiceStatisticsKey service */
        service?: (google.protobuf.IStringValue|null);

        /** ServiceStatisticsKey instance_host */
        instance_host?: (google.protobuf.IStringValue|null);

        /** ServiceStatisticsKey success */
        success?: (google.protobuf.IBoolValue|null);

        /** ServiceStatisticsKey res_code_int32 */
        res_code_int32?: (number|null);

        /** ServiceStatisticsKey res_code_string */
        res_code_string?: (google.protobuf.IStringValue|null);
    }

    /** Represents a ServiceStatisticsKey. */
    class ServiceStatisticsKey implements IServiceStatisticsKey {

        /**
         * Constructs a new ServiceStatisticsKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IServiceStatisticsKey);

        /** ServiceStatisticsKey caller_host. */
        public caller_host?: (google.protobuf.IStringValue|null);

        /** ServiceStatisticsKey namespace. */
        public namespace?: (google.protobuf.IStringValue|null);

        /** ServiceStatisticsKey service. */
        public service?: (google.protobuf.IStringValue|null);

        /** ServiceStatisticsKey instance_host. */
        public instance_host?: (google.protobuf.IStringValue|null);

        /** ServiceStatisticsKey success. */
        public success?: (google.protobuf.IBoolValue|null);

        /** ServiceStatisticsKey res_code_int32. */
        public res_code_int32?: (number|null);

        /** ServiceStatisticsKey res_code_string. */
        public res_code_string?: (google.protobuf.IStringValue|null);

        /** ServiceStatisticsKey res_code. */
        public res_code?: ("res_code_int32"|"res_code_string");
    }

    /** Properties of a ServiceIndicator. */
    interface IServiceIndicator {

        /** ServiceIndicator total_request_per_minute */
        total_request_per_minute?: (google.protobuf.IUInt32Value|null);

        /** ServiceIndicator total_delay_per_minute */
        total_delay_per_minute?: (google.protobuf.IUInt64Value|null);
    }

    /** Represents a ServiceIndicator. */
    class ServiceIndicator implements IServiceIndicator {

        /**
         * Constructs a new ServiceIndicator.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IServiceIndicator);

        /** ServiceIndicator total_request_per_minute. */
        public total_request_per_minute?: (google.protobuf.IUInt32Value|null);

        /** ServiceIndicator total_delay_per_minute. */
        public total_delay_per_minute?: (google.protobuf.IUInt64Value|null);
    }

    /** APIResultType enum. */
    enum APIResultType {
        UnknownType = 0,
        Success = 1,
        UserFail = 2,
        PolarisFail = 3
    }

    /** Properties of a StatResponse. */
    interface IStatResponse {

        /** StatResponse id */
        id?: (google.protobuf.IStringValue|null);

        /** StatResponse code */
        code?: (google.protobuf.IUInt32Value|null);

        /** StatResponse info */
        info?: (google.protobuf.IStringValue|null);
    }

    /** Represents a StatResponse. */
    class StatResponse implements IStatResponse {

        /**
         * Constructs a new StatResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IStatResponse);

        /** StatResponse id. */
        public id?: (google.protobuf.IStringValue|null);

        /** StatResponse code. */
        public code?: (google.protobuf.IUInt32Value|null);

        /** StatResponse info. */
        public info?: (google.protobuf.IStringValue|null);
    }

    /** Properties of a SDKConfig. */
    interface ISDKConfig {

        /** SDKConfig token */
        token?: (v1.ISDKToken|null);

        /** SDKConfig config */
        config?: (string|null);

        /** SDKConfig take_effect_time */
        take_effect_time?: (google.protobuf.ITimestamp|null);

        /** SDKConfig location */
        location?: (string|null);

        /** SDKConfig version */
        version?: (string|null);

        /** SDKConfig client */
        client?: (string|null);
    }

    /** Represents a SDKConfig. */
    class SDKConfig implements ISDKConfig {

        /**
         * Constructs a new SDKConfig.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.ISDKConfig);

        /** SDKConfig token. */
        public token?: (v1.ISDKToken|null);

        /** SDKConfig config. */
        public config: string;

        /** SDKConfig take_effect_time. */
        public take_effect_time?: (google.protobuf.ITimestamp|null);

        /** SDKConfig location. */
        public location: string;

        /** SDKConfig version. */
        public version: string;

        /** SDKConfig client. */
        public client: string;
    }

    /** Properties of a SDKToken. */
    interface ISDKToken {

        /** SDKToken ip */
        ip?: (string|null);

        /** SDKToken pid */
        pid?: (number|null);

        /** SDKToken uid */
        uid?: (string|null);
    }

    /** Represents a SDKToken. */
    class SDKToken implements ISDKToken {

        /**
         * Constructs a new SDKToken.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.ISDKToken);

        /** SDKToken ip. */
        public ip: string;

        /** SDKToken pid. */
        public pid: number;

        /** SDKToken uid. */
        public uid: string;
    }

    /** Properties of a RevisionHistory. */
    interface IRevisionHistory {

        /** RevisionHistory time */
        time?: (google.protobuf.ITimestamp|null);

        /** RevisionHistory change_seq */
        change_seq?: (number|null);

        /** RevisionHistory revision */
        revision?: (string|null);
    }

    /** Represents a RevisionHistory. */
    class RevisionHistory implements IRevisionHistory {

        /**
         * Constructs a new RevisionHistory.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IRevisionHistory);

        /** RevisionHistory time. */
        public time?: (google.protobuf.ITimestamp|null);

        /** RevisionHistory change_seq. */
        public change_seq: number;

        /** RevisionHistory revision. */
        public revision: string;
    }

    /** Properties of a RoutingHistory. */
    interface IRoutingHistory {

        /** RoutingHistory revision */
        revision?: (v1.IRevisionHistory[]|null);
    }

    /** Represents a RoutingHistory. */
    class RoutingHistory implements IRoutingHistory {

        /**
         * Constructs a new RoutingHistory.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IRoutingHistory);

        /** RoutingHistory revision. */
        public revision: v1.IRevisionHistory[];
    }

    /** Properties of an InstancesHistory. */
    interface IInstancesHistory {

        /** InstancesHistory revision */
        revision?: (v1.IRevisionHistory[]|null);
    }

    /** Represents an InstancesHistory. */
    class InstancesHistory implements IInstancesHistory {

        /**
         * Constructs a new InstancesHistory.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IInstancesHistory);

        /** InstancesHistory revision. */
        public revision: v1.IRevisionHistory[];
    }

    /** Properties of a ServiceInfo. */
    interface IServiceInfo {

        /** ServiceInfo id */
        id?: (string|null);

        /** ServiceInfo sdk_token */
        sdk_token?: (v1.ISDKToken|null);

        /** ServiceInfo namespace */
        namespace?: (string|null);

        /** ServiceInfo service */
        service?: (string|null);

        /** ServiceInfo instances_history */
        instances_history?: (v1.IInstancesHistory|null);

        /** ServiceInfo instance_eliminated */
        instance_eliminated?: (boolean|null);

        /** ServiceInfo routing_history */
        routing_history?: (v1.IRoutingHistory|null);

        /** ServiceInfo routing_eliminated */
        routing_eliminated?: (boolean|null);
    }

    /** Represents a ServiceInfo. */
    class ServiceInfo implements IServiceInfo {

        /**
         * Constructs a new ServiceInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IServiceInfo);

        /** ServiceInfo id. */
        public id: string;

        /** ServiceInfo sdk_token. */
        public sdk_token?: (v1.ISDKToken|null);

        /** ServiceInfo namespace. */
        public namespace: string;

        /** ServiceInfo service. */
        public service: string;

        /** ServiceInfo instances_history. */
        public instances_history?: (v1.IInstancesHistory|null);

        /** ServiceInfo instance_eliminated. */
        public instance_eliminated: boolean;

        /** ServiceInfo routing_history. */
        public routing_history?: (v1.IRoutingHistory|null);

        /** ServiceInfo routing_eliminated. */
        public routing_eliminated: boolean;
    }

    /** StatusChange enum. */
    enum StatusChange {
        Unknown = 0,
        CloseToOpen = 1,
        OpenToHalfOpen = 2,
        HalfOpenToOpen = 3,
        HalfOpenToClose = 4
    }

    /** RecoverAllStatus enum. */
    enum RecoverAllStatus {
        Invalid = 0,
        Start = 1,
        End = 2
    }

    /** Properties of a CircuitbreakChange. */
    interface ICircuitbreakChange {

        /** CircuitbreakChange time */
        time?: (google.protobuf.ITimestamp|null);

        /** CircuitbreakChange change_seq */
        change_seq?: (number|null);

        /** CircuitbreakChange change */
        change?: (v1.StatusChange|null);

        /** CircuitbreakChange reason */
        reason?: (string|null);
    }

    /** Represents a CircuitbreakChange. */
    class CircuitbreakChange implements ICircuitbreakChange {

        /**
         * Constructs a new CircuitbreakChange.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.ICircuitbreakChange);

        /** CircuitbreakChange time. */
        public time?: (google.protobuf.ITimestamp|null);

        /** CircuitbreakChange change_seq. */
        public change_seq: number;

        /** CircuitbreakChange change. */
        public change: v1.StatusChange;

        /** CircuitbreakChange reason. */
        public reason: string;
    }

    /** Properties of a CircuitbreakHistory. */
    interface ICircuitbreakHistory {

        /** CircuitbreakHistory ip */
        ip?: (string|null);

        /** CircuitbreakHistory port */
        port?: (number|null);

        /** CircuitbreakHistory vpc_id */
        vpc_id?: (string|null);

        /** CircuitbreakHistory changes */
        changes?: (v1.ICircuitbreakChange[]|null);
    }

    /** Represents a CircuitbreakHistory. */
    class CircuitbreakHistory implements ICircuitbreakHistory {

        /**
         * Constructs a new CircuitbreakHistory.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.ICircuitbreakHistory);

        /** CircuitbreakHistory ip. */
        public ip: string;

        /** CircuitbreakHistory port. */
        public port: number;

        /** CircuitbreakHistory vpc_id. */
        public vpc_id: string;

        /** CircuitbreakHistory changes. */
        public changes: v1.ICircuitbreakChange[];
    }

    /** Properties of a RecoverAllChange. */
    interface IRecoverAllChange {

        /** RecoverAllChange time */
        time?: (google.protobuf.ITimestamp|null);

        /** RecoverAllChange instance_info */
        instance_info?: (string|null);

        /** RecoverAllChange change */
        change?: (v1.RecoverAllStatus|null);
    }

    /** Represents a RecoverAllChange. */
    class RecoverAllChange implements IRecoverAllChange {

        /**
         * Constructs a new RecoverAllChange.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IRecoverAllChange);

        /** RecoverAllChange time. */
        public time?: (google.protobuf.ITimestamp|null);

        /** RecoverAllChange instance_info. */
        public instance_info: string;

        /** RecoverAllChange change. */
        public change: v1.RecoverAllStatus;
    }

    /** Properties of a ServiceCircuitbreak. */
    interface IServiceCircuitbreak {

        /** ServiceCircuitbreak id */
        id?: (string|null);

        /** ServiceCircuitbreak sdk_token */
        sdk_token?: (v1.ISDKToken|null);

        /** ServiceCircuitbreak namespace */
        namespace?: (string|null);

        /** ServiceCircuitbreak service */
        service?: (string|null);

        /** ServiceCircuitbreak recover_all */
        recover_all?: (v1.IRecoverAllChange[]|null);

        /** ServiceCircuitbreak instance_circuitbreak */
        instance_circuitbreak?: (v1.ICircuitbreakHistory[]|null);
    }

    /** Represents a ServiceCircuitbreak. */
    class ServiceCircuitbreak implements IServiceCircuitbreak {

        /**
         * Constructs a new ServiceCircuitbreak.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IServiceCircuitbreak);

        /** ServiceCircuitbreak id. */
        public id: string;

        /** ServiceCircuitbreak sdk_token. */
        public sdk_token?: (v1.ISDKToken|null);

        /** ServiceCircuitbreak namespace. */
        public namespace: string;

        /** ServiceCircuitbreak service. */
        public service: string;

        /** ServiceCircuitbreak recover_all. */
        public recover_all: v1.IRecoverAllChange[];

        /** ServiceCircuitbreak instance_circuitbreak. */
        public instance_circuitbreak: v1.ICircuitbreakHistory[];
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a DoubleValue. */
        interface IDoubleValue {

            /** DoubleValue value */
            value?: (number|null);
        }

        /** Represents a DoubleValue. */
        class DoubleValue implements IDoubleValue {

            /**
             * Constructs a new DoubleValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDoubleValue);

            /** DoubleValue value. */
            public value: number;
        }

        /** Properties of a FloatValue. */
        interface IFloatValue {

            /** FloatValue value */
            value?: (number|null);
        }

        /** Represents a FloatValue. */
        class FloatValue implements IFloatValue {

            /**
             * Constructs a new FloatValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFloatValue);

            /** FloatValue value. */
            public value: number;
        }

        /** Properties of an Int64Value. */
        interface IInt64Value {

            /** Int64Value value */
            value?: (number|null);
        }

        /** Represents an Int64Value. */
        class Int64Value implements IInt64Value {

            /**
             * Constructs a new Int64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt64Value);

            /** Int64Value value. */
            public value: number;
        }

        /** Properties of a UInt64Value. */
        interface IUInt64Value {

            /** UInt64Value value */
            value?: (number|null);
        }

        /** Represents a UInt64Value. */
        class UInt64Value implements IUInt64Value {

            /**
             * Constructs a new UInt64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt64Value);

            /** UInt64Value value. */
            public value: number;
        }

        /** Properties of an Int32Value. */
        interface IInt32Value {

            /** Int32Value value */
            value?: (number|null);
        }

        /** Represents an Int32Value. */
        class Int32Value implements IInt32Value {

            /**
             * Constructs a new Int32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt32Value);

            /** Int32Value value. */
            public value: number;
        }

        /** Properties of a UInt32Value. */
        interface IUInt32Value {

            /** UInt32Value value */
            value?: (number|null);
        }

        /** Represents a UInt32Value. */
        class UInt32Value implements IUInt32Value {

            /**
             * Constructs a new UInt32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt32Value);

            /** UInt32Value value. */
            public value: number;
        }

        /** Properties of a BoolValue. */
        interface IBoolValue {

            /** BoolValue value */
            value?: (boolean|null);
        }

        /** Represents a BoolValue. */
        class BoolValue implements IBoolValue {

            /**
             * Constructs a new BoolValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBoolValue);

            /** BoolValue value. */
            public value: boolean;
        }

        /** Properties of a StringValue. */
        interface IStringValue {

            /** StringValue value */
            value?: (string|null);
        }

        /** Represents a StringValue. */
        class StringValue implements IStringValue {

            /**
             * Constructs a new StringValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IStringValue);

            /** StringValue value. */
            public value: string;
        }

        /** Properties of a BytesValue. */
        interface IBytesValue {

            /** BytesValue value */
            value?: (Uint8Array|null);
        }

        /** Represents a BytesValue. */
        class BytesValue implements IBytesValue {

            /**
             * Constructs a new BytesValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBytesValue);

            /** BytesValue value. */
            public value: Uint8Array;
        }

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: number;

            /** Timestamp nanos. */
            public nanos: number;
        }
    }
}
