# Node SDK

TAM 整体架构 for 前端监控设计，node-sdk 只做简单的上报，服务端数据上报建议使用
[伽利略](https://j.woa.com)
[CLS](https://console.cloud.tencent.com/cls)
[智研日志汇](https://zhiyan.woa.com/)

## 安装
### NPM
在项目支持 NPM 时推荐使用 NPM 安装 Aegis SDK。
```bash
$ tnpm install --save @tencent/aegis-node-sdk
```
::: warning 注意 ⚠️
- 从 1.25.1 版本开始，SDK内部服务发现已经去掉了对L5的支持，默认使用北极星作为服务发现
- 如果用户使用electron进行的是客户端的数据上报或者本地开发的话，建议使用host模式，具体使用方式见[配置文档](#配置文档)里的`selector.type`配置项
- 如果用户是在devcloud机器上调用aegis接口上报的，建议先执行
```bash
unset http_proxy
unset https_proxy
```
:::

## 使用

### 初始化
使用非常简单，只需要新建一个 Aegis 实例，传入相应的配置即可：

```javascript
import Aegis from '@tencent/aegis-node-sdk';

const aegis = new Aegis({
    id: 'pGUVFTCZyewxxxxx', // 项目上报ID
    uin: 'xxx', // 用户唯一 ID（可选）
})
```

## 日志

Aegis SDK 会主动收集用户的一些性能和错误日志，开发者可以根据不同的参数来配置哪些日志需要上报，以及上报的日志具体信息。

### 日志类型

全部日志类型如下：

```javascript
{ logType: 'custom', name: '自定义测速' }
{ logType: 'event', name: '自定义事件' }
{ logType: 'log', name: '日志' }
{ logType: 'performance', name: '页面测速' }
{ logType: 'pv', name: '页面PV' }
{ logType: 'speed', name: '接口和静态资源测速' }
{ logType: 'vitals', name: 'web vitals' }
```


### 日志等级

全部日志等级如下：

```javascript
  { level: 1, name: '白名单日志' },
  { level: 2, name: '一般日志' },
  { level: 4, name: '错误日志' },
  { level: 8, name: 'Promise 错误' },
  { level: 16, name: 'Ajax 请求异常' },
  { level: 32, name: 'JS 加载异常' },
  { level: 64, name: '图片加载异常' },
  { level: 128, name: 'css 加载异常' },
  { level: 256, name: 'console.error' },
  { level: 512, name: '音视频资源异常' }
  { level: 1024, name: 'retcode 异常' }
  { level: 2048, name: 'aegis report' }
  { level: 4096, name: 'PV' }
  { level: 8192, name: '自定义事件' }
  { level: 16384, name: '小程序 页面不存在' }
  { level: 32768, name: 'websocket错误' }
  { level: 65536, name: 'js bridge错误' }
```


### 日志上报

创建完 Aegis 实例之后，就可以开心的上报日志啦 🥰，日志上报同样简单

```javascript
// info 可以上报任意字符串，数字，数组，对象，但是只有打开页面的用户在名单中才会上报
aegis.info('test');
aegis.info('test', 123, ['a', 'b', 'c', 1], {a: '123'});


// 也可以上报特定的对象，支持用户传ext参数和trace参数
// 注意这种 case 一定要传 msg 字段
aegis.info({
 msg: 'test',
 ext1: 'ext1',
 ext2: 'ext2',
 ext3: 'ext3',
 trace: 'trace',
});

// 不同于 info，infoAll 表示全量上报
aegis.infoAll({
 msg: 'test',
 ext1: 'ext1',
 ext2: 'ext2',
 ext3: 'ext3',
 trace: 'trace',
});


// error 用来表示 JS 错误日志，也是全量上报，一般用于开发者主动获取JS异常，然后进行上报
aegis.error({
 msg: 'test',
 ext1: 'ext1',
 ext2: 'ext2',
 ext3: 'ext3',
 trace: 'trace',
});
aegis.error(new Error('主动上报一个错误'));

// report 默认是 aegis.report 的日志类型，但是现在你可以传入任何日志类型了
aegis.report({ 
 msg: '这是一个ajax错误日志', 
 level: Aegis.logType.AJAX_ERROR, 
 ext1: 'ext1', 
 ext2: 'ext2', 
 ext3: 'ext3', 
 trace: 'trace',
});
```

## 实例方法
Aegis 实例暴露接口简单实用，目前 Aegis 实例有以下方法供您使用：  
`setConfig` 、 `info` 、 `infoAll` 、 `report` 、 `error` 、 `reportEvent` 、 `reportTime` 、 `time` 、 `timeEnd`、`destroy`

### setConfig
该方法用来修改实例配置，比如下面场景：  
在实例化 Aegis 时需要传入配置对象
```javascript
const aegis = new Aegis({
    id: 'pGUVFTCZyewxxxxx',
    uin: '777'
})
```
很多情况下，并不能一开始就获取到用户的 `uin`，而等获取到用户的 `uin` 才开始实例化 Aegis，如果这期间发生了错误 Aegis 将监听不到。`uin` 的设置可以在获取到用户的时候：
```javascript
const aegis = new Aegis({
    id: 'pGUVFTCZyewxxxxx'
})

// 拿到uin之后...
aegis.setConfig({
    uin: '888'
})
```

### info、infoAll、report
这三个方法是 Aegis 提供的主要上报手段。
```javascript
aegis.info('上报一条白名单日志，这两种情况这条日志才会报到后台：1、打开页面的用户在名单中；2、对应的页面发生了错误🤨');

aegis.infoAll('上报了一条日志，该上报与info唯一的不同就在于，所有用户都会上报');

aegis.report(new Error('上报一个错误'));
```

### reportEvent

该方法可用来上报自定义事件，平台将会自动统计上报事件的各项指标，诸如：PV、UV、平台分布等...

reportEvent 可以支持两种类型上报参数类型，一种是字符串类型

```javascript
aegis.reportEvent('XXX请求成功');
```

一种是对象类型，ext1 ext2 ext3 默认使用 new Aegis 的时候传入的参数，自定义事件上报的时候，可以覆盖默认值。

```javascript
aegis.reportEvent({
    name: 'XXX请求成功',
    ext1: '额外参数1',
    ext2: '额外参数2',
    ext3: '额外参数3',
})
```

注意，额外参数的三个 key 是固定的，目前只支持 ext1 ext2 ext3。

### reportTime

该方法可用来上报自定义测速，例如：

```javascript
// 假如‘onload’的时间是1s
aegis.reportTime('onload', 1000);
```

或者如果需要使用额外参数，可以传入对象类型参数，ext1，ext2，ext3 会覆盖默认值：

```javascript
aegis.reportTime({
    name: 'onload', // 自定义测速 name
    duration: 1000, // 自定义测速耗时(0 - 60000)
    ext1: 'test1',
    ext2: 'test2',
    ext3: 'test3',
});
```

> `onload` 可以修改为其他的命名。

### time、timeEnd

该方法同样可用来上报自定义测速，适用于两个时间点之间时长的计算并上报，例如：

```javascript
aegis.time('complexOperation');
/**
 * .
 * .
 * 做了很久的复杂操作之后。。。
 * .
 * .
 */
aegis.timeEnd('complexOperation'); /** 此时日志已经报上去了😄**/
```

> `complexOperation` 同样可以修改为其他的命名。
> 自定义测速是用户上报任意值，服务端对其进行统计和计算，因为服务端不能做脏数据处理，因此建议用户在上报端进行统计值限制，防止脏数据对整体产生影响。
> 目前 Aegis 只支持 0-60000 的数值计算，如果大于该值，建议进行合理改造。
> 高频率的自定义测速上报尽量使用 reportTime。time 和 timeEnd 上报会存在上报值覆盖的问题。比如 aegis.time(aaa), 在调用 aegis.timeEnd(aaa) 之前，又调用了一次 aegis.time(aaa), 则上报的时间为 timeEnd 时间 - 第二次 time 的时间。

### reportSpeedLog

该方法用来上报cgi测速功能，上报完可到开发者平台的 “CGI测速” 栏目看到数据，如下：

![cgi测速](https://nowpic.gtimg.com/feeds_pic/PiajxSqBRaEILjSDiaDdp9RXb4hNJVcxegBAsoqwibkicrpx98RNG98a1Q/)  

使用方法：

```javascript
aegis.reportSpeedLog({
    url: 'https://www.xxx.com/some/api/url',
    isHttps: true,
    method: 'get',
    duration: 900, // 耗时，单位：ms
    ret: 0, // retcode，默认为：unknown
    status: 200, // http status
})
```

### destroy

该方法用于销毁 sdk 实例，销毁后，不再进行数据上报

```javascript
aegis.destroy();
```

## 白名单

白名单功能是适用于开发者希望对某些特定的用户上报更多的日志，但是又不希望太多上报来影响到全部日志数据，并且减少用户的接口请求次数，因为 TAM 设定了白名单的逻辑。

1. 白名单用户会上报全部的 API 请求信息，包括接口请求和请求结果。
2. 白名单用户可以使用 info 接口信息数据上报。
3. info vs infoAll：在开发者实际体验过程中，白名单用户可以添加更多的日志，并且使用 info 进行上报。infoAll 会对所有用户无差别进行上报，因此可能导致日志量上报巨大。
4. 通过接口 whitelist 来判断当前用户是否是白名单用户，白名单用户的返回结果会绑定在 aegis 实例上 (aegis.isWhiteList) 用来给开发者使用。
5. 用了减少开发者使用负担，白名单用户是团队有效，可以在 [组织管理-白名单管理](https://tam.woa.com/role/group-whitelist-manage) 内创建白名单，则团队下全部项目都生效。


## 钩子函数


### onBeforeRequest

该钩子函数会在所有请求发出前调用，参数中会传入请求的所有内容，必须返回待发送内容。

```javascript
function changeURLArg(url,arg,arg_val) {
  var pattern=arg+' = ([^&]*)';
  var replaceText = arg+'='+arg_val;
  if (url.match(pattern)) {
    var tmp = '/('+ arg+'=)([^&]*)/gi';
    tmp = url.replace(eval(tmp),replaceText);
    return tmp;
  }
  return url;
}
const aegis = new Aegis({
  id: 'pGUVFTCZyewxxxxx',
  onBeforeRequest(log) {
    if (log.type === 'performance') {
      // 页面测速，此时可以修改log内容，如修改页面测速platform
      log.url = changeURLArg(log.url, 'platform', type)
    }
    return log
  }
});

// SEND_TYPE {
//   LOG = 'log',  // 日志
//   SPEED = 'speed', // 接口和静态资源测速
//   PERFORMANCE = 'performance', // 页面测速
//   OFFLINE = 'offline', // 离线日志上传
//   WHITE_LIST = 'whiteList', // 白名单
//   VITALS = 'vitals', // vitals
//   PV = 'pv', // 自定义pv
//   EVENT = 'event', // 自定义事件
//   CUSTOM = 'custom', // 自定义测速
//   SDK_ERROR = 'sdkError', // sdk报错
// }
```

### beforeReport

1. 该钩子将会在日志上报（对应上报接口为 /collect?）前执行，例如

```javascript
const aegis = new Aegis({
  id: 'pGUVFTCZyewxxxxx',
  beforeReport(log) {
    // 监听到下面抛出的错误
    console.log(log); // {level: "4", msg: "发生错误啦！！！！"}
    return log;
  }
});

throw new Error('发生错误啦！！！！');
```

2. 当该钩子返回 false 时，本条日志将不会进行上报，该功能可用来过滤某些不需要上报的错误，例如：

```javascript
const aegis = new Aegis({
  id: 'pGUVFTCZyewxxxxx',
  beforeReport(log) {
    if (log.level === '4' && log.msg && log.msg.indexOf('碍眼的错误') !== -1) {
      return false
    }
    return log;
  }
});
throw new Error('碍眼的错误'); // 该错误将不会被上报
```

上面例子中，当上报的错误内容包含 碍眼的错误 几个关键字时，将不会上报至前端监控后台中。


### beforeReportSpeed

1. 该钩子将会在测速数据上报前（/speed?）被执行，例如：

```javascript
const aegis = new Aegis({
  id: 'pGUVFTCZyewxxxxx',
  reportApiSpeed: true,
  reportAssetSpeed: true,
  beforeReportSpeed(msg) {
    console.log(msg); // {url: "https://localhost:3001/example.e31bb0bc.js", method: "get", duration: 7.4, status: 200, type: "static"}
    return msg
  }
});
```

上述 msg 将会有以下几个字段：

```sh
url: 该资源的请求地址；
type: 该资源的类型，目前有 fetch 、 static 两种，当为 fetch 时，Aegis 将会把该资源当成 API 请求进行上报，static 时则视为静态资源；
duration: 该资源请求耗时；
method: 请求该资源时使用的 http method；
status: 服务器返回状态码；
payload: 提供给开发人员的完整资源请求信息（此数据不上报到 Aegis 后台，用户可自行操作）
完整的数据结构如下：
payload.type - 表示该资源请求的类型，用于区分原始请求类型，可取值为：'fetch', 'xhr'
payload.sourceURL - 表示完整的 URL 请求连接
payload.status - 表示请求状态码
payload.headers - 包含所有的请求头，且 value 值都为字符串
payload.data - 表示完整的请求资源，用户可自定义操作（当请求类型为 fetch 时，表示 response 对象；当请求类型为 XHR 时，表示 XMLHttpRequest 对象）
```

上面的例子中，每当 Aegis 收集到一个资源的加载详情时，将会以该资源的加载情况（上面返回的 msg）作为参数调用 beforeReportSpeed 钩子。

2. 如果您配置了该钩子，Aegis 最终的上报内容将以钩子的执行结果为准。例如：

```javascript
const aegis = new Aegis({
  id: 'pGUVFTCZyewxxxxx',
  reportApiSpeed: true,
  reportAssetSpeed: true,
  beforeReportSpeed(msg) {
    msg.type = 'static';
    return msg;
  }
});
```

上面的代码中，将所有的 msg.type 设置为 static，这意味着所有的资源都将被当成静态资源进行上报，API 请求也将被报至静态资源中。

3. 使用该钩子，您可以校准 Aegis 类型判断错误的请求。

假如您有一条接口 https://example.com/api，该接口的响应头 Content-Type 为 text/html。正常情况下，RUM 会将该资源当成静态资源进行上报。但在您的业务中，该接口就必须视为 API 请求进行上报，您可以给 Aegis 配置如下钩子进行校正：


```javascript
const aegis = new Aegis({
  id: 'pGUVFTCZyewxxxxx',
  reportApiSpeed: true,
  reportAssetSpeed: true,
  beforeReportSpeed(msg) {
    if (msg.url === 'https://example.com/api') {
      msg.type = 'fetch';
    }
  }
});
```

4. 您还可以屏蔽某些资源的测速上报，例如：

```javascript
const aegis = new Aegis({
  id: 'pGUVFTCZyewxxxxx',
  reportApiSpeed: true,
  reportAssetSpeed: true,
  beforeReportSpeed(msg) {
    // 地址中包含‘https://example.com/api’的都不上报
    if (msg.url.indexOf('https://example.com/api') !== -1) {
      // 返回 ‘false’ 将阻止本条测速日志的上报
      return false
    }
  }
});
```

### beforeRequest

该钩子将会在日志上报前执行，例如：

```javascript
const aegis = new Aegis({
  id: "pGUVFTCZyewxxxxx",
  beforeRequest: function(msg) {
    //{logs: {…}, logType: "log"}
    console.log(msg); 
  }
});
```

其中，`msg` 将会有以下几个字段：  

> 1.`logs`: 上报的日志内容;  

> 2.`logType`: 日志类型，有以下值 custom：自定义测速，event：自定义事件，log：日志，pv：页面PV，speed：接口和静态资源测速

logType等于`custom`时，logs的值如下：

```sh
{name: "白屏时间", duration: 3015.7000000178814, ext1: '', ext2: '', ext3: '', from: ''}
```

logType等于`event`时，logs的值如下：

```sh
{name: "ios", ext1: "", ext2: "", ext3: ""}
```

logType等于`log`时，logs的值如下：

```sh
{ level: '1', msg: '接口请求日志（白名单日志）' } // 具体level信息参考日志等级
```

当该钩子返回 `false` 时，本条日志将不会进行上报，该功能可用来过滤某些不需要上报的错误，例如：

```javascript
const aegis = new Aegis({
    id: "pGUVFTCZyewxxxxx",
    beforeRequest: function(data) {
      // 入参 data 的数据结构：{logs: {…}, logType: "log"}
      if (data.logType === 'log' && data.logs.msg.indexOf('otheve.beacon.qq.com') > -1) {
        // 拦截：日志类型为 log，且内容包含 otheve.beacon.qq.com 的请求
        return false;
      }
      // 入参 data 数据结构：{logs: {}, logType: "speed"}
      if (data.logType === 'speed' && data.logs.url.indexOf('otheve.beacon.qq.com') > -1) {
        // 拦截：日志类型为 speed，并且接口 url 包含 otheve.beacon.qq.com 的请求
        return false;
      }
      if (data.logType === 'performance') {
        // 修改：将性能数据的首屏渲染时间改为2s
        data.logs.firstScreenTiming = 2000;
      }
      return data;
    }
  }
});
throw new Error('碍眼的错误'); // 该错误将不会被上报
```

上面例子中，当上报的错误内容包含 `碍眼的错误` 几个关键字时，将不会上报至 Aegis 后台中。

### afterRequest

该勾子将会在测速数据上报后被执行，例如：

```javascript
const aegis = new Aegis({
  id: "pGUVFTCZyewxxxxx",
  reportApiSpeed: true,
  reportAssetSpeed: true,
  afterRequest: function(msg) {
    // {isErr: false, result: Array(1), logType: "log", logs: Array(4)}
    console.log(msg);
  }
});
```

其中，`msg` 将会有以下几个字段：  

> 1.`isErr`: 请求上报接口是否错误；  

> 2.`result`: 上报接口的返回结果；  

> 3.`logs`: 上报的日志内容;

> 4.`logType`: 日志类型，有以下值speed：接口和静态资源测速，performance：页面测速，vitals：web vitals，event：自定义事件，custom：自定义测速;

## 配置文档
| 配置 | 描述 |
| -------- | -------- |
| id | 必须，string，默认 无。<br>开发者平台分配的项目上报ID |
| uin | 建议，string <br>业务定义的当前用户的唯一标识符，用来查找固定用户的日志。白名单上报时将根据该字段判定用户是否在白名单中，字段仅支持`字母数字@=._-`，正则表达式: `/^[@=.0-9a-zA-Z_-]{1,60}$/` |
| version | 可选，string，默认 sdk 版本号。<br>当前上报版本，当页面使用了pwa或者存在离线包时，可用来判断当前的上报是来自哪一个版本的代码，仅支持`字母数字.,:_-`，长度在 60 位以内 `/^[0-9a-zA-Z.,:_-]{1,60}$/` |
| delay | 可选，number，默认 1000 ms。<br>上报节流时间，在该时间段内的上报将会合并到一个上报请求中。 |
| repeat | 可选，number，默认 5。<br>重复上报次数，对于同一个错误超过多少次不上报。 |
| env | 可选，enum，默认 Aegis.environment.production。 <br> 当前项目运行所处的环境。｜
| hostUrl | 可选，默认是 `https://rumt-zh.com`。<br>影响全部上报数据的 host 地址，下面几个 url 地址设置后会覆盖对应的上报地址 ｜
| url | 可选，string，默认 'https://rumt-zh.com/collect'。<br>日志上报地址 |
| pvUrl | 可选，string, 默认 'https://rumt-zh.com/collect/pv' <br> pv 上报地址 ｜ 
| whiteListUrl | 可选，string，默认 'https://rumt-zh.com/collect/whitelist'。<br>白名单确认接口 <br>如果想要关闭白名单接口请求，可以传空字符串|
| offlineUrl | 可选，string，默认 'https://rumt-zh.com/collect/offline'。<br> 离线日志上报地址 |
| eventUrl | 可选，string，默认 'https://rumt-zh.com/collect/events'。<br> 自定义事件上报地址 |
| customTimeUrl | 可选，string，默认 'https://rumt-zh.com/speed/custom'。<br>自定义测速上报地址 |
| speedUrl | 可选，string，默认 'https://rumt-zh.com/speed'。<br>测速日志上报地址 |
| ext1 | 可选，string，自定义上报的额外维度，上报的时候可以被覆盖 |
| ext2 | 可选，string，自定义上报的额外维度，上报的时候可以被覆盖 |
| ext3 | 可选，string，自定义上报的额外维度，上报的时候可以被覆盖 |


在实例化 Aegis node sdk 时可传入额外配置：
| 配置 | 描述 |
| -------- | -------- |
|selector|可选, object 寻址相关配置，不传默认会使用北极星进行寻址|
|selector.type|必须, string 可选值：ip,host,polaris（北极星）|
|protocol|可选，string, selector.type=host 时，默认为https, 其他类型默认为http，未来会支持trpc协议|

## 注意事项
- 由于aegis实例是node应用初始时构造的，因此建议使用者将 uin/sessionId等直接打到 `aegis.info`接口中，在平台查询时直接使用关键字查询。


