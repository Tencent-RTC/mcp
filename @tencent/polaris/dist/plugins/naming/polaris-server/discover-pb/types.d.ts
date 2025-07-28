import * as $protobuf from "protobufjs";
/** Namespace v1. */
export namespace v1 {

    /** Represents a ServerAPI */
    class ServerAPI extends $protobuf.rpc.Service {

        /**
         * Constructs a new ServerAPI service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Calls ReportClient.
         * @param request Client message or plain object
         * @param callback Node-style callback called with the error, if any, and Response
         */
        public reportClient(request: v1.IClient, callback: v1.ServerAPI.ReportClientCallback): void;

        /**
         * Calls ReportClient.
         * @param request Client message or plain object
         * @returns Promise
         */
        public reportClient(request: v1.IClient): Promise<v1.Response>;

        /**
         * Calls RegisterInstance.
         * @param request Instance message or plain object
         * @param callback Node-style callback called with the error, if any, and Response
         */
        public registerInstance(request: v1.IInstance, callback: v1.ServerAPI.RegisterInstanceCallback): void;

        /**
         * Calls RegisterInstance.
         * @param request Instance message or plain object
         * @returns Promise
         */
        public registerInstance(request: v1.IInstance): Promise<v1.Response>;

        /**
         * Calls DeregisterInstance.
         * @param request Instance message or plain object
         * @param callback Node-style callback called with the error, if any, and Response
         */
        public deregisterInstance(request: v1.IInstance, callback: v1.ServerAPI.DeregisterInstanceCallback): void;

        /**
         * Calls DeregisterInstance.
         * @param request Instance message or plain object
         * @returns Promise
         */
        public deregisterInstance(request: v1.IInstance): Promise<v1.Response>;

        /**
         * Calls Discover.
         * @param request DiscoverRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and DiscoverResponse
         */
        public discover(request: v1.IDiscoverRequest, callback: v1.ServerAPI.DiscoverCallback): void;

        /**
         * Calls Discover.
         * @param request DiscoverRequest message or plain object
         * @returns Promise
         */
        public discover(request: v1.IDiscoverRequest): Promise<v1.DiscoverResponse>;

        /**
         * Calls Heartbeat.
         * @param request Instance message or plain object
         * @param callback Node-style callback called with the error, if any, and Response
         */
        public heartbeat(request: v1.IInstance, callback: v1.ServerAPI.HeartbeatCallback): void;

        /**
         * Calls Heartbeat.
         * @param request Instance message or plain object
         * @returns Promise
         */
        public heartbeat(request: v1.IInstance): Promise<v1.Response>;
    }

    namespace ServerAPI {

        /**
         * Callback as used by {@link v1.ServerAPI#reportClient}.
         * @param error Error, if any
         * @param [response] Response
         */
        type ReportClientCallback = (error: (Error|null), response?: v1.Response) => void;

        /**
         * Callback as used by {@link v1.ServerAPI#registerInstance}.
         * @param error Error, if any
         * @param [response] Response
         */
        type RegisterInstanceCallback = (error: (Error|null), response?: v1.Response) => void;

        /**
         * Callback as used by {@link v1.ServerAPI#deregisterInstance}.
         * @param error Error, if any
         * @param [response] Response
         */
        type DeregisterInstanceCallback = (error: (Error|null), response?: v1.Response) => void;

        /**
         * Callback as used by {@link v1.ServerAPI#discover}.
         * @param error Error, if any
         * @param [response] DiscoverResponse
         */
        type DiscoverCallback = (error: (Error|null), response?: v1.DiscoverResponse) => void;

        /**
         * Callback as used by {@link v1.ServerAPI#heartbeat}.
         * @param error Error, if any
         * @param [response] Response
         */
        type HeartbeatCallback = (error: (Error|null), response?: v1.Response) => void;
    }

    /** Properties of a Client. */
    interface IClient {

        /** Client host */
        host?: (google.protobuf.IStringValue|null);

        /** Client type */
        type?: (v1.Client.ClientType|null);

        /** Client version */
        version?: (google.protobuf.IStringValue|null);

        /** Client location */
        location?: (v1.ILocation|null);
    }

    /** Represents a Client. */
    class Client implements IClient {

        /**
         * Constructs a new Client.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IClient);

        /** Client host. */
        public host?: (google.protobuf.IStringValue|null);

        /** Client type. */
        public type: v1.Client.ClientType;

        /** Client version. */
        public version?: (google.protobuf.IStringValue|null);

        /** Client location. */
        public location?: (v1.ILocation|null);
    }

    namespace Client {

        /** ClientType enum. */
        enum ClientType {
            UNKNOWN = 0,
            SDK = 1,
            AGENT = 2
        }
    }

    /** Properties of a Location. */
    interface ILocation {

        /** Location region */
        region?: (google.protobuf.IStringValue|null);

        /** Location zone */
        zone?: (google.protobuf.IStringValue|null);

        /** Location campus */
        campus?: (google.protobuf.IStringValue|null);
    }

    /** Represents a Location. */
    class Location implements ILocation {

        /**
         * Constructs a new Location.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.ILocation);

        /** Location region. */
        public region?: (google.protobuf.IStringValue|null);

        /** Location zone. */
        public zone?: (google.protobuf.IStringValue|null);

        /** Location campus. */
        public campus?: (google.protobuf.IStringValue|null);
    }

    /** Properties of a MatchString. */
    interface IMatchString {

        /** MatchString type */
        type?: (v1.MatchString.MatchStringType|null);

        /** MatchString value */
        value?: (google.protobuf.IStringValue|null);

        /** MatchString value_type */
        value_type?: (v1.MatchString.ValueType|null);
    }

    /** Represents a MatchString. */
    class MatchString implements IMatchString {

        /**
         * Constructs a new MatchString.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IMatchString);

        /** MatchString type. */
        public type: v1.MatchString.MatchStringType;

        /** MatchString value. */
        public value?: (google.protobuf.IStringValue|null);

        /** MatchString value_type. */
        public value_type: v1.MatchString.ValueType;
    }

    namespace MatchString {

        /** MatchStringType enum. */
        enum MatchStringType {
            EXACT = 0,
            REGEX = 1
        }

        /** ValueType enum. */
        enum ValueType {
            TEXT = 0,
            PARAMETER = 1,
            VARIABLE = 2
        }
    }

    /** Properties of a Namespace. */
    interface INamespace {

        /** Namespace name */
        name?: (google.protobuf.IStringValue|null);

        /** Namespace comment */
        comment?: (google.protobuf.IStringValue|null);

        /** Namespace owners */
        owners?: (google.protobuf.IStringValue|null);

        /** Namespace token */
        token?: (google.protobuf.IStringValue|null);

        /** Namespace ctime */
        ctime?: (google.protobuf.IStringValue|null);

        /** Namespace mtime */
        mtime?: (google.protobuf.IStringValue|null);
    }

    /** Represents a Namespace. */
    class Namespace implements INamespace {

        /**
         * Constructs a new Namespace.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.INamespace);

        /** Namespace name. */
        public name?: (google.protobuf.IStringValue|null);

        /** Namespace comment. */
        public comment?: (google.protobuf.IStringValue|null);

        /** Namespace owners. */
        public owners?: (google.protobuf.IStringValue|null);

        /** Namespace token. */
        public token?: (google.protobuf.IStringValue|null);

        /** Namespace ctime. */
        public ctime?: (google.protobuf.IStringValue|null);

        /** Namespace mtime. */
        public mtime?: (google.protobuf.IStringValue|null);
    }

    /** Properties of a Service. */
    interface IService {

        /** Service name */
        name?: (google.protobuf.IStringValue|null);

        /** Service namespace */
        namespace?: (google.protobuf.IStringValue|null);

        /** Service metadata */
        metadata?: ({ [k: string]: string }|null);

        /** Service ports */
        ports?: (google.protobuf.IStringValue|null);

        /** Service business */
        business?: (google.protobuf.IStringValue|null);

        /** Service department */
        department?: (google.protobuf.IStringValue|null);

        /** Service cmdb_mod1 */
        cmdb_mod1?: (google.protobuf.IStringValue|null);

        /** Service cmdb_mod2 */
        cmdb_mod2?: (google.protobuf.IStringValue|null);

        /** Service cmdb_mod3 */
        cmdb_mod3?: (google.protobuf.IStringValue|null);

        /** Service comment */
        comment?: (google.protobuf.IStringValue|null);

        /** Service owners */
        owners?: (google.protobuf.IStringValue|null);

        /** Service token */
        token?: (google.protobuf.IStringValue|null);

        /** Service ctime */
        ctime?: (google.protobuf.IStringValue|null);

        /** Service mtime */
        mtime?: (google.protobuf.IStringValue|null);

        /** Service revision */
        revision?: (google.protobuf.IStringValue|null);
    }

    /** Represents a Service. */
    class Service implements IService {

        /**
         * Constructs a new Service.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IService);

        /** Service name. */
        public name?: (google.protobuf.IStringValue|null);

        /** Service namespace. */
        public namespace?: (google.protobuf.IStringValue|null);

        /** Service metadata. */
        public metadata: { [k: string]: string };

        /** Service ports. */
        public ports?: (google.protobuf.IStringValue|null);

        /** Service business. */
        public business?: (google.protobuf.IStringValue|null);

        /** Service department. */
        public department?: (google.protobuf.IStringValue|null);

        /** Service cmdb_mod1. */
        public cmdb_mod1?: (google.protobuf.IStringValue|null);

        /** Service cmdb_mod2. */
        public cmdb_mod2?: (google.protobuf.IStringValue|null);

        /** Service cmdb_mod3. */
        public cmdb_mod3?: (google.protobuf.IStringValue|null);

        /** Service comment. */
        public comment?: (google.protobuf.IStringValue|null);

        /** Service owners. */
        public owners?: (google.protobuf.IStringValue|null);

        /** Service token. */
        public token?: (google.protobuf.IStringValue|null);

        /** Service ctime. */
        public ctime?: (google.protobuf.IStringValue|null);

        /** Service mtime. */
        public mtime?: (google.protobuf.IStringValue|null);

        /** Service revision. */
        public revision?: (google.protobuf.IStringValue|null);
    }

    /** AliasType enum. */
    enum AliasType {
        DEFAULT = 0,
        CL5SID = 1
    }

    /** Properties of a ServiceAlias. */
    interface IServiceAlias {

        /** ServiceAlias service */
        service?: (google.protobuf.IStringValue|null);

        /** ServiceAlias namespace */
        namespace?: (google.protobuf.IStringValue|null);

        /** ServiceAlias alias */
        alias?: (google.protobuf.IStringValue|null);

        /** ServiceAlias type */
        type?: (v1.AliasType|null);

        /** ServiceAlias owners */
        owners?: (google.protobuf.IStringValue|null);

        /** ServiceAlias service_token */
        service_token?: (google.protobuf.IStringValue|null);

        /** ServiceAlias ctime */
        ctime?: (google.protobuf.IStringValue|null);

        /** ServiceAlias mtime */
        mtime?: (google.protobuf.IStringValue|null);
    }

    /** Represents a ServiceAlias. */
    class ServiceAlias implements IServiceAlias {

        /**
         * Constructs a new ServiceAlias.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IServiceAlias);

        /** ServiceAlias service. */
        public service?: (google.protobuf.IStringValue|null);

        /** ServiceAlias namespace. */
        public namespace?: (google.protobuf.IStringValue|null);

        /** ServiceAlias alias. */
        public alias?: (google.protobuf.IStringValue|null);

        /** ServiceAlias type. */
        public type: v1.AliasType;

        /** ServiceAlias owners. */
        public owners?: (google.protobuf.IStringValue|null);

        /** ServiceAlias service_token. */
        public service_token?: (google.protobuf.IStringValue|null);

        /** ServiceAlias ctime. */
        public ctime?: (google.protobuf.IStringValue|null);

        /** ServiceAlias mtime. */
        public mtime?: (google.protobuf.IStringValue|null);
    }

    /** Properties of an Instance. */
    interface IInstance {

        /** Instance id */
        id?: (google.protobuf.IStringValue|null);

        /** Instance service */
        service?: (google.protobuf.IStringValue|null);

        /** Instance namespace */
        namespace?: (google.protobuf.IStringValue|null);

        /** Instance vpc_id */
        vpc_id?: (google.protobuf.IStringValue|null);

        /** Instance host */
        host?: (google.protobuf.IStringValue|null);

        /** Instance port */
        port?: (google.protobuf.IUInt32Value|null);

        /** Instance protocol */
        protocol?: (google.protobuf.IStringValue|null);

        /** Instance version */
        version?: (google.protobuf.IStringValue|null);

        /** Instance priority */
        priority?: (google.protobuf.IUInt32Value|null);

        /** Instance weight */
        weight?: (google.protobuf.IUInt32Value|null);

        /** Instance enable_health_check */
        enable_health_check?: (google.protobuf.IBoolValue|null);

        /** Instance health_check */
        health_check?: (v1.IHealthCheck|null);

        /** Instance healthy */
        healthy?: (google.protobuf.IBoolValue|null);

        /** Instance isolate */
        isolate?: (google.protobuf.IBoolValue|null);

        /** Instance location */
        location?: (v1.ILocation|null);

        /** Instance metadata */
        metadata?: ({ [k: string]: string }|null);

        /** Instance logic_set */
        logic_set?: (google.protobuf.IStringValue|null);

        /** Instance ctime */
        ctime?: (google.protobuf.IStringValue|null);

        /** Instance mtime */
        mtime?: (google.protobuf.IStringValue|null);

        /** Instance revision */
        revision?: (google.protobuf.IStringValue|null);

        /** Instance service_token */
        service_token?: (google.protobuf.IStringValue|null);
    }

    /** Represents an Instance. */
    class Instance implements IInstance {

        /**
         * Constructs a new Instance.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IInstance);

        /** Instance id. */
        public id?: (google.protobuf.IStringValue|null);

        /** Instance service. */
        public service?: (google.protobuf.IStringValue|null);

        /** Instance namespace. */
        public namespace?: (google.protobuf.IStringValue|null);

        /** Instance vpc_id. */
        public vpc_id?: (google.protobuf.IStringValue|null);

        /** Instance host. */
        public host?: (google.protobuf.IStringValue|null);

        /** Instance port. */
        public port?: (google.protobuf.IUInt32Value|null);

        /** Instance protocol. */
        public protocol?: (google.protobuf.IStringValue|null);

        /** Instance version. */
        public version?: (google.protobuf.IStringValue|null);

        /** Instance priority. */
        public priority?: (google.protobuf.IUInt32Value|null);

        /** Instance weight. */
        public weight?: (google.protobuf.IUInt32Value|null);

        /** Instance enable_health_check. */
        public enable_health_check?: (google.protobuf.IBoolValue|null);

        /** Instance health_check. */
        public health_check?: (v1.IHealthCheck|null);

        /** Instance healthy. */
        public healthy?: (google.protobuf.IBoolValue|null);

        /** Instance isolate. */
        public isolate?: (google.protobuf.IBoolValue|null);

        /** Instance location. */
        public location?: (v1.ILocation|null);

        /** Instance metadata. */
        public metadata: { [k: string]: string };

        /** Instance logic_set. */
        public logic_set?: (google.protobuf.IStringValue|null);

        /** Instance ctime. */
        public ctime?: (google.protobuf.IStringValue|null);

        /** Instance mtime. */
        public mtime?: (google.protobuf.IStringValue|null);

        /** Instance revision. */
        public revision?: (google.protobuf.IStringValue|null);

        /** Instance service_token. */
        public service_token?: (google.protobuf.IStringValue|null);
    }

    /** Properties of a HealthCheck. */
    interface IHealthCheck {

        /** HealthCheck type */
        type?: (v1.HealthCheck.HealthCheckType|null);

        /** HealthCheck heartbeat */
        heartbeat?: (v1.IHeartbeatHealthCheck|null);
    }

    /** Represents a HealthCheck. */
    class HealthCheck implements IHealthCheck {

        /**
         * Constructs a new HealthCheck.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IHealthCheck);

        /** HealthCheck type. */
        public type: v1.HealthCheck.HealthCheckType;

        /** HealthCheck heartbeat. */
        public heartbeat?: (v1.IHeartbeatHealthCheck|null);
    }

    namespace HealthCheck {

        /** HealthCheckType enum. */
        enum HealthCheckType {
            UNKNOWN = 0,
            HEARTBEAT = 1
        }
    }

    /** Properties of a HeartbeatHealthCheck. */
    interface IHeartbeatHealthCheck {

        /** HeartbeatHealthCheck ttl */
        ttl?: (google.protobuf.IUInt32Value|null);
    }

    /** Represents a HeartbeatHealthCheck. */
    class HeartbeatHealthCheck implements IHeartbeatHealthCheck {

        /**
         * Constructs a new HeartbeatHealthCheck.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IHeartbeatHealthCheck);

        /** HeartbeatHealthCheck ttl. */
        public ttl?: (google.protobuf.IUInt32Value|null);
    }

    /** Properties of a DiscoverRequest. */
    interface IDiscoverRequest {

        /** DiscoverRequest type */
        type?: (v1.DiscoverRequest.DiscoverRequestType|null);

        /** DiscoverRequest service */
        service?: (v1.IService|null);
    }

    /** Represents a DiscoverRequest. */
    class DiscoverRequest implements IDiscoverRequest {

        /**
         * Constructs a new DiscoverRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IDiscoverRequest);

        /** DiscoverRequest type. */
        public type: v1.DiscoverRequest.DiscoverRequestType;

        /** DiscoverRequest service. */
        public service?: (v1.IService|null);
    }

    namespace DiscoverRequest {

        /** DiscoverRequestType enum. */
        enum DiscoverRequestType {
            UNKNOWN = 0,
            INSTANCE = 1,
            CLUSTER = 2,
            ROUTING = 3,
            RATE_LIMIT = 4
        }
    }

    /** Properties of a SimpleResponse. */
    interface ISimpleResponse {

        /** SimpleResponse code */
        code?: (google.protobuf.IUInt32Value|null);

        /** SimpleResponse info */
        info?: (google.protobuf.IStringValue|null);
    }

    /** Represents a SimpleResponse. */
    class SimpleResponse implements ISimpleResponse {

        /**
         * Constructs a new SimpleResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.ISimpleResponse);

        /** SimpleResponse code. */
        public code?: (google.protobuf.IUInt32Value|null);

        /** SimpleResponse info. */
        public info?: (google.protobuf.IStringValue|null);
    }

    /** Properties of a Response. */
    interface IResponse {

        /** Response code */
        code?: (google.protobuf.IUInt32Value|null);

        /** Response info */
        info?: (google.protobuf.IStringValue|null);

        /** Response client */
        client?: (v1.IClient|null);

        /** Response namespace */
        namespace?: (v1.INamespace|null);

        /** Response service */
        service?: (v1.IService|null);

        /** Response instance */
        instance?: (v1.IInstance|null);

        /** Response routing */
        routing?: (v1.IRouting|null);

        /** Response alias */
        alias?: (v1.IServiceAlias|null);

        /** Response rateLimit */
        rateLimit?: (v1.IRule|null);
    }

    /** Represents a Response. */
    class Response implements IResponse {

        /**
         * Constructs a new Response.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IResponse);

        /** Response code. */
        public code?: (google.protobuf.IUInt32Value|null);

        /** Response info. */
        public info?: (google.protobuf.IStringValue|null);

        /** Response client. */
        public client?: (v1.IClient|null);

        /** Response namespace. */
        public namespace?: (v1.INamespace|null);

        /** Response service. */
        public service?: (v1.IService|null);

        /** Response instance. */
        public instance?: (v1.IInstance|null);

        /** Response routing. */
        public routing?: (v1.IRouting|null);

        /** Response alias. */
        public alias?: (v1.IServiceAlias|null);

        /** Response rateLimit. */
        public rateLimit?: (v1.IRule|null);
    }

    /** Properties of a BatchWriteResponse. */
    interface IBatchWriteResponse {

        /** BatchWriteResponse code */
        code?: (google.protobuf.IUInt32Value|null);

        /** BatchWriteResponse info */
        info?: (google.protobuf.IStringValue|null);

        /** BatchWriteResponse size */
        size?: (google.protobuf.IUInt32Value|null);

        /** BatchWriteResponse responses */
        responses?: (v1.IResponse[]|null);
    }

    /** Represents a BatchWriteResponse. */
    class BatchWriteResponse implements IBatchWriteResponse {

        /**
         * Constructs a new BatchWriteResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IBatchWriteResponse);

        /** BatchWriteResponse code. */
        public code?: (google.protobuf.IUInt32Value|null);

        /** BatchWriteResponse info. */
        public info?: (google.protobuf.IStringValue|null);

        /** BatchWriteResponse size. */
        public size?: (google.protobuf.IUInt32Value|null);

        /** BatchWriteResponse responses. */
        public responses: v1.IResponse[];
    }

    /** Properties of a BatchQueryResponse. */
    interface IBatchQueryResponse {

        /** BatchQueryResponse code */
        code?: (google.protobuf.IUInt32Value|null);

        /** BatchQueryResponse info */
        info?: (google.protobuf.IStringValue|null);

        /** BatchQueryResponse amount */
        amount?: (google.protobuf.IUInt32Value|null);

        /** BatchQueryResponse size */
        size?: (google.protobuf.IUInt32Value|null);

        /** BatchQueryResponse namespaces */
        namespaces?: (v1.INamespace[]|null);

        /** BatchQueryResponse services */
        services?: (v1.IService[]|null);

        /** BatchQueryResponse instances */
        instances?: (v1.IInstance[]|null);

        /** BatchQueryResponse routings */
        routings?: (v1.IRouting[]|null);

        /** BatchQueryResponse aliases */
        aliases?: (v1.IServiceAlias[]|null);

        /** BatchQueryResponse rateLimits */
        rateLimits?: (v1.IRule[]|null);
    }

    /** Represents a BatchQueryResponse. */
    class BatchQueryResponse implements IBatchQueryResponse {

        /**
         * Constructs a new BatchQueryResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IBatchQueryResponse);

        /** BatchQueryResponse code. */
        public code?: (google.protobuf.IUInt32Value|null);

        /** BatchQueryResponse info. */
        public info?: (google.protobuf.IStringValue|null);

        /** BatchQueryResponse amount. */
        public amount?: (google.protobuf.IUInt32Value|null);

        /** BatchQueryResponse size. */
        public size?: (google.protobuf.IUInt32Value|null);

        /** BatchQueryResponse namespaces. */
        public namespaces: v1.INamespace[];

        /** BatchQueryResponse services. */
        public services: v1.IService[];

        /** BatchQueryResponse instances. */
        public instances: v1.IInstance[];

        /** BatchQueryResponse routings. */
        public routings: v1.IRouting[];

        /** BatchQueryResponse aliases. */
        public aliases: v1.IServiceAlias[];

        /** BatchQueryResponse rateLimits. */
        public rateLimits: v1.IRule[];
    }

    /** Properties of a DiscoverResponse. */
    interface IDiscoverResponse {

        /** DiscoverResponse code */
        code?: (google.protobuf.IUInt32Value|null);

        /** DiscoverResponse info */
        info?: (google.protobuf.IStringValue|null);

        /** DiscoverResponse type */
        type?: (v1.DiscoverResponse.DiscoverResponseType|null);

        /** DiscoverResponse service */
        service?: (v1.IService|null);

        /** DiscoverResponse instances */
        instances?: (v1.IInstance[]|null);

        /** DiscoverResponse routing */
        routing?: (v1.IRouting|null);

        /** DiscoverResponse rateLimit */
        rateLimit?: (v1.IRateLimit|null);
    }

    /** Represents a DiscoverResponse. */
    class DiscoverResponse implements IDiscoverResponse {

        /**
         * Constructs a new DiscoverResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IDiscoverResponse);

        /** DiscoverResponse code. */
        public code?: (google.protobuf.IUInt32Value|null);

        /** DiscoverResponse info. */
        public info?: (google.protobuf.IStringValue|null);

        /** DiscoverResponse type. */
        public type: v1.DiscoverResponse.DiscoverResponseType;

        /** DiscoverResponse service. */
        public service?: (v1.IService|null);

        /** DiscoverResponse instances. */
        public instances: v1.IInstance[];

        /** DiscoverResponse routing. */
        public routing?: (v1.IRouting|null);

        /** DiscoverResponse rateLimit. */
        public rateLimit?: (v1.IRateLimit|null);
    }

    namespace DiscoverResponse {

        /** DiscoverResponseType enum. */
        enum DiscoverResponseType {
            UNKNOWN = 0,
            INSTANCE = 1,
            CLUSTER = 2,
            ROUTING = 3,
            RATE_LIMIT = 4
        }
    }

    /** Properties of a Routing. */
    interface IRouting {

        /** Routing service */
        service?: (google.protobuf.IStringValue|null);

        /** Routing namespace */
        namespace?: (google.protobuf.IStringValue|null);

        /** Routing inbounds */
        inbounds?: (v1.IRoute[]|null);

        /** Routing outbounds */
        outbounds?: (v1.IRoute[]|null);

        /** Routing ctime */
        ctime?: (google.protobuf.IStringValue|null);

        /** Routing mtime */
        mtime?: (google.protobuf.IStringValue|null);

        /** Routing revision */
        revision?: (google.protobuf.IStringValue|null);

        /** Routing service_token */
        service_token?: (google.protobuf.IStringValue|null);
    }

    /** Represents a Routing. */
    class Routing implements IRouting {

        /**
         * Constructs a new Routing.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IRouting);

        /** Routing service. */
        public service?: (google.protobuf.IStringValue|null);

        /** Routing namespace. */
        public namespace?: (google.protobuf.IStringValue|null);

        /** Routing inbounds. */
        public inbounds: v1.IRoute[];

        /** Routing outbounds. */
        public outbounds: v1.IRoute[];

        /** Routing ctime. */
        public ctime?: (google.protobuf.IStringValue|null);

        /** Routing mtime. */
        public mtime?: (google.protobuf.IStringValue|null);

        /** Routing revision. */
        public revision?: (google.protobuf.IStringValue|null);

        /** Routing service_token. */
        public service_token?: (google.protobuf.IStringValue|null);
    }

    /** Properties of a Route. */
    interface IRoute {

        /** Route sources */
        sources?: (v1.ISource[]|null);

        /** Route destinations */
        destinations?: (v1.IDestination[]|null);
    }

    /** Represents a Route. */
    class Route implements IRoute {

        /**
         * Constructs a new Route.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IRoute);

        /** Route sources. */
        public sources: v1.ISource[];

        /** Route destinations. */
        public destinations: v1.IDestination[];
    }

    /** Properties of a Source. */
    interface ISource {

        /** Source service */
        service?: (google.protobuf.IStringValue|null);

        /** Source namespace */
        namespace?: (google.protobuf.IStringValue|null);

        /** Source metadata */
        metadata?: ({ [k: string]: v1.IMatchString }|null);
    }

    /** Represents a Source. */
    class Source implements ISource {

        /**
         * Constructs a new Source.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.ISource);

        /** Source service. */
        public service?: (google.protobuf.IStringValue|null);

        /** Source namespace. */
        public namespace?: (google.protobuf.IStringValue|null);

        /** Source metadata. */
        public metadata: { [k: string]: v1.IMatchString };
    }

    /** Properties of a Destination. */
    interface IDestination {

        /** Destination service */
        service?: (google.protobuf.IStringValue|null);

        /** Destination namespace */
        namespace?: (google.protobuf.IStringValue|null);

        /** Destination metadata */
        metadata?: ({ [k: string]: v1.IMatchString }|null);

        /** Destination priority */
        priority?: (google.protobuf.IUInt32Value|null);

        /** Destination weight */
        weight?: (google.protobuf.IUInt32Value|null);

        /** Destination transfer */
        transfer?: (google.protobuf.IStringValue|null);
    }

    /** Represents a Destination. */
    class Destination implements IDestination {

        /**
         * Constructs a new Destination.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IDestination);

        /** Destination service. */
        public service?: (google.protobuf.IStringValue|null);

        /** Destination namespace. */
        public namespace?: (google.protobuf.IStringValue|null);

        /** Destination metadata. */
        public metadata: { [k: string]: v1.IMatchString };

        /** Destination priority. */
        public priority?: (google.protobuf.IUInt32Value|null);

        /** Destination weight. */
        public weight?: (google.protobuf.IUInt32Value|null);

        /** Destination transfer. */
        public transfer?: (google.protobuf.IStringValue|null);
    }

    /** Properties of a RateLimit. */
    interface IRateLimit {

        /** RateLimit rules */
        rules?: (v1.IRule[]|null);

        /** RateLimit revision */
        revision?: (google.protobuf.IStringValue|null);
    }

    /** Represents a RateLimit. */
    class RateLimit implements IRateLimit {

        /**
         * Constructs a new RateLimit.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IRateLimit);

        /** RateLimit rules. */
        public rules: v1.IRule[];

        /** RateLimit revision. */
        public revision?: (google.protobuf.IStringValue|null);
    }

    /** Properties of a Rule. */
    interface IRule {

        /** Rule id */
        id?: (google.protobuf.IStringValue|null);

        /** Rule service */
        service?: (google.protobuf.IStringValue|null);

        /** Rule namespace */
        namespace?: (google.protobuf.IStringValue|null);

        /** Rule cluster */
        cluster?: (google.protobuf.IStringValue|null);

        /** Rule priority */
        priority?: (google.protobuf.IUInt32Value|null);

        /** Rule resource */
        resource?: (v1.Rule.Resource|null);

        /** Rule type */
        type?: (v1.Rule.Type|null);

        /** Rule labels */
        labels?: ({ [k: string]: v1.IMatchString }|null);

        /** Rule amounts */
        amounts?: (v1.IAmount[]|null);

        /** Rule action */
        action?: (google.protobuf.IStringValue|null);

        /** Rule disable */
        disable?: (google.protobuf.IBoolValue|null);

        /** Rule report */
        report?: (v1.IReport|null);

        /** Rule ctime */
        ctime?: (google.protobuf.IStringValue|null);

        /** Rule mtime */
        mtime?: (google.protobuf.IStringValue|null);

        /** Rule revision */
        revision?: (google.protobuf.IStringValue|null);

        /** Rule service_token */
        service_token?: (google.protobuf.IStringValue|null);
    }

    /** Represents a Rule. */
    class Rule implements IRule {

        /**
         * Constructs a new Rule.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IRule);

        /** Rule id. */
        public id?: (google.protobuf.IStringValue|null);

        /** Rule service. */
        public service?: (google.protobuf.IStringValue|null);

        /** Rule namespace. */
        public namespace?: (google.protobuf.IStringValue|null);

        /** Rule cluster. */
        public cluster?: (google.protobuf.IStringValue|null);

        /** Rule priority. */
        public priority?: (google.protobuf.IUInt32Value|null);

        /** Rule resource. */
        public resource: v1.Rule.Resource;

        /** Rule type. */
        public type: v1.Rule.Type;

        /** Rule labels. */
        public labels: { [k: string]: v1.IMatchString };

        /** Rule amounts. */
        public amounts: v1.IAmount[];

        /** Rule action. */
        public action?: (google.protobuf.IStringValue|null);

        /** Rule disable. */
        public disable?: (google.protobuf.IBoolValue|null);

        /** Rule report. */
        public report?: (v1.IReport|null);

        /** Rule ctime. */
        public ctime?: (google.protobuf.IStringValue|null);

        /** Rule mtime. */
        public mtime?: (google.protobuf.IStringValue|null);

        /** Rule revision. */
        public revision?: (google.protobuf.IStringValue|null);

        /** Rule service_token. */
        public service_token?: (google.protobuf.IStringValue|null);
    }

    namespace Rule {

        /** Resource enum. */
        enum Resource {
            QPS = 0,
            CONCURRENCY = 1
        }

        /** Type enum. */
        enum Type {
            GLOBAL = 0,
            LOCAL = 1
        }
    }

    /** Properties of an Amount. */
    interface IAmount {

        /** Amount maxAmount */
        maxAmount?: (google.protobuf.IUInt32Value|null);

        /** Amount validDuration */
        validDuration?: (google.protobuf.IDuration|null);
    }

    /** Represents an Amount. */
    class Amount implements IAmount {

        /**
         * Constructs a new Amount.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IAmount);

        /** Amount maxAmount. */
        public maxAmount?: (google.protobuf.IUInt32Value|null);

        /** Amount validDuration. */
        public validDuration?: (google.protobuf.IDuration|null);
    }

    /** Properties of a Report. */
    interface IReport {

        /** Report interval */
        interval?: (google.protobuf.IDuration|null);

        /** Report amountPercent */
        amountPercent?: (google.protobuf.IUInt32Value|null);
    }

    /** Represents a Report. */
    class Report implements IReport {

        /**
         * Constructs a new Report.
         * @param [properties] Properties to set
         */
        constructor(properties?: v1.IReport);

        /** Report interval. */
        public interval?: (google.protobuf.IDuration|null);

        /** Report amountPercent. */
        public amountPercent?: (google.protobuf.IUInt32Value|null);
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
