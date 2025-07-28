import { GlobalOptions } from "../global";
import { LoggerOptions } from "../logging";
import { PluginList, PluginType, RegisterOptions, RegistrationInstance } from "../plugins";
import { SkeletonClass } from "../skeleton";
import { RequireKeys } from "../utils";
declare const kProvider: unique symbol;
declare const kServiceToken: unique symbol;
declare class RegisterResponse {
    readonly id: string;
    private readonly [kProvider];
    private readonly [kServiceToken];
    constructor(id: string, token: string, provider: Provider);
    /**
     * 服务注销
     * @returns 是否注销成功
     */
    unregister(): Promise<boolean>;
    /**
     * 服务心跳上报
     * @returns 是否上报成功
     */
    heartbeat(): Promise<boolean>;
}
export declare type ProviderOptions = GlobalOptions & LoggerOptions;
declare type ProviderPluginList = Pick<PluginList, PluginType.NamingService | PluginType.TraceLogging | PluginType.StatReporter>;
export declare type OptionalProviderPluginList = RequireKeys<Partial<ProviderPluginList>, PluginType.NamingService>;
declare const kCurrentInstances: unique symbol;
declare const KMaxInstances: unique symbol;
export declare class Provider extends SkeletonClass<ProviderPluginList> {
    /**
     * note:
     * 由于类包含专用标识符时，`super` 调用必须是构造函数中的第一个语句。
     * 所以这里采用 `Symbol` 来实现 __私有静态属性__
     */
    private static [kCurrentInstances];
    private static [KMaxInstances];
    /**
     * 当前可实例化的最大次数
     */
    static get maxInstances(): number;
    /**
     * 设置可实例化的最大次数
     * @param n 最大次数
     */
    static setMaxInstances(n: number): void;
    /**
     * Create Provider
     * @param plugins 插件
     * @param options 配置参数（可选）
     */
    constructor(plugins: OptionalProviderPluginList, options?: Partial<ProviderOptions>);
    /**
     * 销毁（释放）所占资源
     * @param sync 是否同步释放（可选）
     */
    dispose(sync?: boolean): void;
    /**
     * 服务注册
     * @param namespace 命名空间
     * @param service 服务名
     * @param token 服务 Token 用来鉴权
     * @param instance 待注册的实例
     * @param options 注册选项
     * @returns 可操作的实例对象（包含注册的实例 `id`）
     */
    register(namespace: string, service: string, token: string, instance: RegistrationInstance, options?: RegisterOptions): Promise<RegisterResponse>;
    /**
     * 服务注销
     * @param id 实例 ID
     * @param token 服务 Token 用来鉴权
     * @returns 是否注销成功
     */
    unregister(id: string, token: string): Promise<boolean>;
    /**
     * 服务注销
     * @param namespace 命名空间
     * @param service 服务名
     * @param host 节点 IP 或者域名
     * @param port 节点端口号
     * @param token 服务 Token 用来鉴权
     * @returns 是否注销成功
     */
    unregister(namespace: string, service: string, host: string, port: number, token: string): Promise<boolean>;
    /**
     * 服务心跳上报
     * @param id 实例唯一 ID
     * @param token 服务 Token 用来鉴权
     * @returns 是否发送成功
     */
    heartbeat(id: string, token: string): Promise<boolean>;
    /**
     * 服务心跳上报
     * @param namespace 命名空间
     * @param service 服务名
     * @param host 节点 IP 或者域名
     * @param port 节点端口号
     * @param token 服务 Token 用来鉴权
     * @returns 是否发送成功
     */
    heartbeat(namespace: string, service: string, host: string, port: number, token: string): Promise<boolean>;
}
export {};
