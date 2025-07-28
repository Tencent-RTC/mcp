import * as $protobuf from "protobufjs";
/** Namespace v1. */
export namespace v1 {

    /** Represents a RateLimitAPI */
    class RateLimitAPI extends $protobuf.rpc.Service {

        /**
         * Constructs a new RateLimitAPI service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Calls InitializeQuota.
         * @param request RateLimitRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and RateLimitResponse
         */
        public initializeQuota(request: v1.IRateLimitRequest, callback: v1.RateLimitAPI.InitializeQuotaCallback): void;

        /**
         * Calls InitializeQuota.
         * @param request RateLimitRequest message or plain object
         * @returns Promise
         */
        public initializeQuota(request: v1.IRateLimitRequest): Promise<v1.RateLimitResponse>;

        /**
         * Calls AcquireQuota.
         * @param request RateLimitRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and RateLimitResponse
         */
        public acquireQuota(request: v1.IRateLimitRequest, callback: v1.RateLimitAPI.AcquireQuotaCallback): void;

        /**
         * Calls AcquireQuota.
         * @param request RateLimitRequest message or plain object
         * @returns Promise
         */
        public acquireQuota(request: v1.IRateLimitRequest): Promise<v1.RateLimitResponse>;
    }

    namespace RateLimitAPI {

        /**
         * Callback as used by {@link v1.RateLimitAPI#initializeQuota}.
         * @param error Error, if any
         * @param [response] RateLimitResponse
         */
        type InitializeQuotaCallback = (error: (Error|null), response?: v1.RateLimitResponse) => void;

        /**
         * Callback as used by {@link v1.RateLimitAPI#acquireQuota}.
         * @param error Error, if any
         * @param [response] RateLimitResponse
         */
        type AcquireQuotaCallback = (error: (Error|null), response?: v1.RateLimitResponse) => void;
    }

    /** Properties of a RateLimitRequest. */
    interface IRateLimitRequest {

        /** RateLimitRequest key */
        key?: (google.protobuf.IStringValue|null);

        /** RateLimitRequest service */
        service?: (google.protobuf.IStringValue|null);

        /** RateLimitRequest namespace */
        namespace?: (google.protobuf.IStringValue|null);

        /** RateLimitRequest timestamp */
        timestamp?: (google.protobuf.IInt64Value|null);

        /** RateLimitRequest totals */
        totals?: (v1.ILimiter[]|null);

        /** RateLimitRequest useds */
        useds?: (v1.ILimiter[]|null);
    }

    /** Represents a RateLimitRequest. */
    class RateLimitRequest implements IRateLimitRequest {

        /**
         * Constructs a new RateLimitRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IRateLimitRequest);

        /** RateLimitRequest key. */
        public key?: (google.protobuf.IStringValue|null);

        /** RateLimitRequest service. */
        public service?: (google.protobuf.IStringValue|null);

        /** RateLimitRequest namespace. */
        public namespace?: (google.protobuf.IStringValue|null);

        /** RateLimitRequest timestamp. */
        public timestamp?: (google.protobuf.IInt64Value|null);

        /** RateLimitRequest totals. */
        public totals: v1.ILimiter[];

        /** RateLimitRequest useds. */
        public useds: v1.ILimiter[];
    }

    /** Properties of a RateLimitResponse. */
    interface IRateLimitResponse {

        /** RateLimitResponse code */
        code?: (google.protobuf.IUInt32Value|null);

        /** RateLimitResponse info */
        info?: (google.protobuf.IStringValue|null);

        /** RateLimitResponse key */
        key?: (google.protobuf.IStringValue|null);

        /** RateLimitResponse timestamp */
        timestamp?: (google.protobuf.IInt64Value|null);

        /** RateLimitResponse sum_useds */
        sum_useds?: (v1.ILimiter[]|null);
    }

    /** Represents a RateLimitResponse. */
    class RateLimitResponse implements IRateLimitResponse {

        /**
         * Constructs a new RateLimitResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IRateLimitResponse);

        /** RateLimitResponse code. */
        public code?: (google.protobuf.IUInt32Value|null);

        /** RateLimitResponse info. */
        public info?: (google.protobuf.IStringValue|null);

        /** RateLimitResponse key. */
        public key?: (google.protobuf.IStringValue|null);

        /** RateLimitResponse timestamp. */
        public timestamp?: (google.protobuf.IInt64Value|null);

        /** RateLimitResponse sum_useds. */
        public sum_useds: v1.ILimiter[];
    }

    /** Properties of a Limiter. */
    interface ILimiter {

        /** Limiter amount */
        amount?: (google.protobuf.IUInt32Value|null);

        /** Limiter duration */
        duration?: (google.protobuf.IDuration|null);
    }

    /** Represents a Limiter. */
    class Limiter implements ILimiter {

        /**
         * Constructs a new Limiter.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.ILimiter);

        /** Limiter amount. */
        public amount?: (google.protobuf.IUInt32Value|null);

        /** Limiter duration. */
        public duration?: (google.protobuf.IDuration|null);
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

        /** Properties of a Duration. */
        interface IDuration {

            /** Duration seconds */
            seconds?: (number|null);

            /** Duration nanos */
            nanos?: (number|null);
        }

        /** Represents a Duration. */
        class Duration implements IDuration {

            /**
             * Constructs a new Duration.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDuration);

            /** Duration seconds. */
            public seconds: number;

            /** Duration nanos. */
            public nanos: number;
        }
    }
}
