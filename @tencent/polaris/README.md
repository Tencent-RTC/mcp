# Polaris SDK

[![build status](http://badge.orange-ci.woa.com/polaris/polaris-nodejs.svg)](http://orange-ci.oa.com/build/log/latest?slug=polaris/polaris-nodejs) [![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Polaris（北极星）是名字服务协同团队合力研发的服务治理组件，具备服务注册、健康检查、服务发现、服务路由、负载均衡、故障节点熔断、动态权重调整与服务限流等功能。

Polaris Node.js SDK 采用微内核(Microkernel) + 插件(Plugins) 设计，可支持替换 11 种不同类型插件。

项目（包括依赖部分） 100% 由 TypeScript(JavaScript) 编写，不含任何 C/C++ 代码。

## 目录

- [安装](#安装)
- [例子](#例子)
- [使用](#使用)
  - [运行模式](#运行模式)
  - [公共类型](#公共类型)
    - [实例](#实例)
    - [位置](#位置)
    - [元数据](#元数据)
  - [Consumer API](#consumer-api)
  - [Provider API](#provider-api)
  - [Limiter API](#limiter-api)
- [插件](#插件)
  - [列表](#列表)
  - [使用插件](#使用插件)
- [贡献](#贡献)

## 安装

tnpm

``` console
$ tnpm install @tencent/polaris
```

yarn

``` console
$ yarn add @tencent/polaris --registry=https://mirrors.tencent.com/npm/
```

## 例子

查询被调服务特定地址：

``` ts
import { Consumer } from "@tencent/polaris";
const consumer = new Consumer();
const response = await (consumer.select("namespace", "service"));
if (response) {
  const { instance: { host, port }} = response;
  /**
   * 通过 host, port 进行调用，
   * 并调用 `update` 上报调用结果
   */
  response.update(success, cost, code);
}
```

## 使用

### 运行模式

模块支持 `Server` 与 `Agent`（暂未上线） 两种运行模式。

| 模式 | 优势 | 权衡
|---------|------------|-----------
| Server(default) | 不需要部署 Agent<br />可替换不同类型插件<br />拥有更多配置<br />更好的性能 | 不能跨进程统计调用状态
| Agent           | 逻辑简单<br />支持跨进程统计调用状态 | 需要部署 Agent<br />可配置项较少

> 我应该如何选择运行模式？
>
> __在绝大多数情况下，直接使用默认的 `Server` 模式即可。__
>
> 由于模块只统计当前进程内的调用状态，如果服务调用量极少而又启动了 _多进程_ 负载均衡时，
> 存在无法及时对实例进行调整（如屏蔽熔断）的可能，此时如果服务关心调用成功率，可以使用 `Agent` 模式。

具体切换方式可详见 [名字服务插件](./plugins#名字服务插件) 。

### 公共类型

为了便于描述（表达）北极星组件的调用与返回结构，模块定义了如下几种数据类型：

- [实例](#实例)
- [位置](#位置)
- [元数据](#元数据)

#### 实例

实例 `Instance` 类型描述了服务节点详细信息，信息由静态与动态成员组成：

* 静态部分：
  * id: 唯一 ID
  * vpc_id: 腾讯云 VPC Id
  * host: IP 或域名
  * port: 端口号
  * protocol: 协议信息
  * staticWeight: 静态权重值, 取值 ∈ [0-1000]
  * metadata: 元数据信息
  * priority: 优先级
  * version: 版本号
  * logicSet: 逻辑区域
  * location: 地理位置
* 动态部分：
  * dynamicWeight: 动态权重值
  * status: 当前状态

两个实例对象在进行比较时，直接比较 `Instance.id` 是否相同。_也就是说，相同实例的 `id` 必须相同_。

##### 实例状态

实例状态 `InstanceStatus` 描述了实例当前所处的状态：

* Normal: 正常
* HalfOpen: 半打开，各周期只选出极少次，负责探活
* HalfClose: 半关闭，不在任何模块中被选出，但计算调用结果
* Fused: 熔断，不在任何模块中被选出

各状态间迁移关系，可查看插件节 - [实例状态迁移](#实例状态迁移)

#### 位置

位置 `Location` 描述了一个特定的（地理）位置信息，其中包含：

* region
* zone
* campus(idc)

两个位置在比较时，按照范围由小至大进行匹配，`campus` --> `zone` --> `region`

一般用于就近调用等要求匹配位置的场景。

#### 元数据

元数据 `Metadata` 以 {[key: string]: string} 形式存储特定对象（如实例对象）的描述信息。

一般用于规则路由等需进行对象筛选的场景。

### Consumer API

``` ts
import { Consumer } from "@tencent/polaris"
```

供服务调用方使用。

通过提供的主调（可选）与被调服务信息，按规则选出被调服务的一个特定实例或返回所有被调服务实例。

#### new Consumer(service, plugins, options)

构造 `Consumer` 对象，用于获取被调方特定实例。

* service: 主调方服务信息或服务名（可选）
* plugins: 插件列表（可选）
* options: 配置参数（可选）

__请注意：不要每次调用都构造一个 `Consumer` 对象，这样不仅会造成性能损耗，同时会导致无法按预期逻辑处理。如果你不得不这样做，请在使用完 `Consumer` 对象后调用 `dispose()` 接口将其释放。__

#### select(...)

获取被调服务中的一个特定实例，并返回上报对象。

``` ts
const response = await consumer.select(namespace, service, metadata, args);
```

或

``` ts
const response = await consumer.select(service, metadata, args);
```

* namespace: 被调服务名字空间（可选）
* service: 被调服务名
* metadata: 主调方服务元数据（可选）
* args: 本次调用附加参数（可选），在特定负载均衡（如一致性哈希）插件中使用。

`response.instance` 即为选出的被调服务的特定实例。

请保留 `select(...)` 接口返回的 `response` 对象，以便在调用完成后进行结果上报：

``` ts
response.update(success, cost, code);
```

* success: 是否调用成功
* cost: 调用耗时（可选，默认为 0，单位为毫秒）
* code: 返回码（可选）

__请注意：无论是否调用成功，在调用完成后一定要上报调用结果，否则模块将无法对实例进行动态调整。__

#### list(...)

获取被调方全部服务实例。

``` ts
const instances = await consumer.list(namespace, service);
```

或

``` ts
const instances = await consumer.list(service);
```

* namespace: 被调服务名字空间（可选）
* service: 被调服务名

`instances` 即为被调方全部服务实例。

#### update(...)

强制刷新缓存。

``` ts
const hasUpdated = await consumer.update(namespace, service, type);
```

* namespace: 被调服务名字空间
* service: 被调服务名
* type: 数据存储类别，为 RegistryCategory 枚举

如存在更新，则调用结果为 `true`

_请留意：一般情况下，请同时更新 `RegistryCategory.Instance` 与 `RegistryCategory.Rule`。_

#### dispose()

释放掉 `Consumer` 对象，在内部会释放掉相关的缓存和 socket 连接。

__请注意：调用 `dispose()` 后，再调用 `Consumer` 对象的其他方法会抛出异常。__

### Provider API

供服务提供方使用。

提供服务注册（注销）、心跳上报等能力。

#### new Provider(plugins)

构造 `Provider` 对象，用于获取被调方特定实例。

* plugins: 插件列表（可选）

__请注意：不要每次调用都构造一个 `Provider` 对象，这样会造成性能损耗。__

#### 服务注册

``` ts
const response = await provider.register(namespace, service, token, instance, options);
```

* namespace: 命名空间
* service: 服务名
* token: 服务 Token 用来鉴权
* instance: 待注册的实例
* options: 注册选项（可选）

可通过 `response` 对注册的服务进行操作： 

* id: 获取注册的实例 `id`
* unregister(): 服务注销
* heartbeat(): 心跳上报

#### 服务注销

``` ts
const success = await provider.unregister(id, token);
```

* id: 实例 ID
* token: 服务 Token 用来鉴权

或

``` ts
const success = await provider.unregister(namespace, service, host, port, token);
```

* namespace: 命名空间
* service: 服务名
* host: 节点 IP 或者域名
* port: 节点端口号
* token: 服务 Token 用来鉴权

可通过 `success` 判断注册是否成功。

#### 心跳上报

``` ts
const success = await provider.heartbeat(id, token);
```

* id: 实例唯一 ID
* token: 服务 Token 用来鉴权

或

``` ts
const success = await provider.heartbeat(namespace, service, host, port, token)
```

* namespace: 命名空间
* service: 服务名
* host: 节点 IP 或者域名
* port: 节点端口号
* token: 服务 Token 用来鉴权

可通过 `success` 判断注册是否成功。

### Limiter API

提供流量控制（整形）能力。

#### new Limiter(plugins, options)

构造 `Limiter` 对象。

* plugins: 插件列表（可选）
* options: 配置参数（可选）

__请注意：不要每次调用都构造一个 `Limiter` 对象，这样不仅会造成性能损耗，同时会导致无法按预期逻辑处理。__

#### 配额申请

``` ts
const response = await limiter.acquire(namespace, service, amount, cluster, labels, id)
```

* namespace: 命名空间
* service: 服务名
* amount: 申请配额的数量
* cluster: 集群名（可选）
* labels: 标签集合（可选）
* id: 上次调用返回 ID（对应 `response.id`），用于二次获取配额时提升性能（可选）

`response.quotas` 即为申请的配额列表，而配额是否申请成功需等待其状态变更：

``` ts
response.quotas[i].then((release) => { /** 配额申请成功 */ }, (err) => { /** 配额申请失败 */ });
```

当针对并发数进行限流时，在配额使用完成后，需调用 `release()` 方法释放对于配额的占用。

## 插件

### 列表

- [名字服务插件](./PLUGINS.md#名字服务插件)
  - [Polaris Server](./PLUGINS.md#polaris-server)
  - [Local Server](./PLUGINS.md#local-server)
- [本地仓库插件](./PLUGINS.md#本地仓库插件)
  - [Memory Only](./PLUGINS.md#memory-only)
- [服务路由插件](./PLUGINS.md#服务路由插件)
  - [Polaris Rule Router](./PLUGINS.md#polaris-rule-router)
  - [Polaris Nearby Router](./PLUGINS.md#polaris-nearby-router)
  - [tRPC Env Router](./PLUGINS.md#trpc-env-router)
  - [tRPC Set Router](./PLUGINS.md#trpc-set-router)
  - [tRPC Canary Router](./PLUGINS.md#trpc-canary-router)
- [负载均衡插件](./PLUGINS.md#负载均衡插件)
  - [最早截止时间优先](./PLUGINS.md#earliest-deadline-first-round-robin)
  - [平滑加权轮询](./PLUGINS.md#smooth-weighted-round-robin)
  - [简单权重轮询](./PLUGINS.md#weighted-round-robin)
  - [权重随机](./PLUGINS.md#weight-random)
  - [一致性哈希](./PLUGINS.md#consistent-hash)
  - [粘性策略](./PLUGINS.md#sticky)
- [节点熔断插件](./PLUGINS.md#节点熔断插件)
  - [Polaris Breaker](./PLUGINS.md#polaris-breaker)
- [权重调整插件](./PLUGINS.md#权重调整插件)
  - [Polaris Adjuster](./PLUGINS.md#polaris-adjuster)
- [健康探测插件](./PLUGINS.md#健康探测插件)
- [限流服务插件](./PLUGINS.md#限流服务插件)
- [流量整形插件](./PLUGINS.md#流量整形插件)
  - [Unirate Shaping](./PLUGINS.md#unirate-shaping)
  - [Warm Up Shaping](./PLUGINS.md#warm-up-shaping)
- [统计上报插件](./PLUGINS.md#统计上报插件)
- [日志跟踪插件](./PLUGINS.md#日志跟踪插件)
  - [Console Tracer](./PLUGINS.md#console-tracer)

### 使用插件

所有的内置插件被定义为实现了特定插件接口的 `class`。**缺省情况下，`new Consumer()` 时构造函数内部会使用默认参数实例化一系列插件实例**。如果需要替换掉默认的插件或其实例化的参数，可以在 `new Consumer()` 时直接传入特定插件的实例。部分插件支持调用时参数，可以在调用 `select()` 方法时传入。

以负载均衡（一致性哈希）为例，其初始化和传参方法如下：

```ts
import { Consumer, HashRingLoadBalancer, plugins } from  "@tencent/polaris";

const consumer = new Consumer({
  [plugins.PluginType.LoadBalancer]: new HashRingLoadBalancer({
    algorithm: 'md5'
  })
});

(async () => {
  await consumer.select("namespace", "service", metadata, {
    [plugins.PluginType.LoadBalancer]: 'group/project'
  })
})();
```

详情请看 [插件](./PLUGINS.md)

## 贡献

我们十分期待您的贡献，更多详情请参考 [CONTRIBUTING.md](./CONTRIBUTING.md)
