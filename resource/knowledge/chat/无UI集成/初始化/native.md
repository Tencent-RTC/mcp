---
sync_node_id: '108053217718870016'
nav_path:
  - "无 UI 集成"
  - "初始化"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

You **must** initialize the SDK before using its features. In most scenarios, you need to initialize the SDK only once during the application lifecycle.

## Initialization

You can initialize the SDK in the following steps:
1. Prepare an `SDKAppID`.

2. Configure the `V2TIMSDKConfig` object.

3. Add an SDK event listener.

4. Call `initSDK` to initialize the SDK.

   The detailed steps are as follows.

### Preparing an SDKAppID

`SDKAppID` uniquely identifies an account. We recommend you apply for a new `SDKAppID` for each application. Messages are naturally isolated and cannot communicate between different `SDKAppID` values. To perform the initialization, you must have a correct `SDKAppID`.
In the [Chat Console](https://console.trtc.io/), you can view all your `SDKAppID` values, and you can click **Create Application** to create an `SDKAppID`.

### Configuring the `V2TIMSDKConfig`

Before initializing the SDK, you need to initialize the `V2TIMSDKConfig` object ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKConfig.html) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKConfig.html) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMSDKConfig.html) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMSDKConfig.html)), which is used to configure the SDK initially, such as setting the log level and log listening callback.

#### Setting the log level

The SDK supports the following log levels:

|Log Level|Log Output|
|---------|---------|
|V2TIM_LOG_NONE|No log is output.|
|V2TIM_LOG_DEBUG|Logs at the DEBUG, INFO, WARNING, and ERROR levels are output (default log levels).|
|V2TIM_LOG_INFO|Logs at the INFO, WARNING, and ERROR levels are output.|
|V2TIM_LOG_WARN|Logs at the WARNING and ERROR levels are output.|
|V2TIM_LOG_ERROR|Logs at the ERROR level are output.|

SDK log storage rules are as follows:
- Local SDK logs are retained for seven days by default, after which the logs will be automatically cleared during the SDK initialization.

- By default, SDK logs on Android are stored in the `/sdcard/tencent/imsdklogs/application package name` directory for versions earlier than v4.8.50 and in the `/sdcard/Android/data/package name/files/log/tencent/imsdk` directory for v4.8.50 or later.

- By default, SDK logs on iOS are stored in the `/Library/Caches/com_tencent_imsdk_log` directory.

- By default, SDK logs on Windows are stored in the program's running directory. For example, when the program is running in the `C:\App` directory, SDK will store logs in the `C:\App\com_tencent_imsdk_log` directory.

Starting from v4.7.1, the xlog module from WeChat is used to output SDK logs, which are compressed by default and must be decompressed by using the Python script.
- To obtain the script for decompression, click [Decode Log 27](https://imsdk-1252463788.cos.ap-guangzhou.myqcloud.com/tools/xlog_decoder_python27.py) (for Python 2.7) or [Decode Log 30](https://imsdk-1252463788.cos.ap-guangzhou.myqcloud.com/tools/xlog_decoder_python30.py) (for Python 3.0).

- In the Windows or macOS console, you can decompress log files by running the following command. After decompression, the file names end with "xlog.log", and you can use the text editor to open these files.

   ``` bash
   python decode_mars_nocrypt_log_file.py imsdk_yyyyMMdd.xlog
   ```

#### Setting a log listener

If you need to listen on SDK logs in real time, you can call `setLogListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKConfig.html#a5e8f7fa8dc56123e353a416d8742835b) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKConfig.html#v2timsdkconfig.loglistener) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMSDKConfig.html#aef1bb8224f845539ecb15cccfd07f82b) / [C++](https://im.sdk.qcloud.com/doc/en/structV2TIMSDKConfig.html#ac9d77ab98d5e412d413e412b398c9a2b)) to set a log listener.
After it is set, the SDK will throw log information through this callback in real time.

> **Note:**
> The callback is in the main thread. Log callbacks can be quite frequent, so be careful not to synchronize too many time-consuming tasks in the callback, which may block the main thread.
> 

The sample code of configuring `V2TIMSDKConfig` is as follows:

【Java】
``` java
// Initialize the `config` object
V2TIMSDKConfig config = new V2TIMSDKConfig();
// Specify the log output level
config.setLogLevel(V2TIMSDKConfig.V2TIM_LOG_INFO);
// Specify the log listener
config.setLogListener(new V2TIMLogListener() {
    @Override
    public void onLog(int logLevel, String logContent) {
        // `logContent` is the SDK log content
    }
});
```

【Swift】
``` swift
// Initialize the `config` object
let config = V2TIMSDKConfig()
// Specify the log output level
config.logLevel = .V2TIM_LOG_INFO
// Set the log listener
config.logListener = { logLevel, logContent in
       // `logContent` is the SDK log content
    print("Log Level: \(logLevel), Log Content: \(logContent)")
}
```

【Objective-C】
``` objectivec
// Initialize the `config` object
V2TIMSDKConfig *config = [[V2TIMSDKConfig alloc] init];
// Specify the log output level
config.logLevel = V2TIM_LOG_INFO;
// Set the log listener
config.logListener = ^(V2TIMLogLevel logLevel, NSString *logContent) {
    // `logContent` is the SDK log content
};
```

【C++】
``` cpp
class LogListener final : public V2TIMLogListener {
public:
    LogListener() = default;
    ~LogListener() override = default;
    void OnLog(V2TIMLogLevel logLevel, const V2TIMString& logContent) override {
        // `logContent` is the SDK log content
    }
};
// Note that `logListener` should not be released before the SDK is uninitialized,
// otherwise the log callback cannot be called.
LogListener logListener;

// Initialize the `config` object
V2TIMSDKConfig config;
// Specify the log output level
config.logLevel = V2TIMLogLevel::V2TIM_LOG_INFO;
// Specify the log listener
config.logListener = &logListener;
```

### Adding an SDK event listener

After the initialization, the SDK will report such events as connection status and login ticket expiration through `V2TIMSDKListener`.
We recommend you call the `addIMSDKListener` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a2f0297e96d365013e7923275ce2a5d4e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.addimsdklistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#ac569656a58908afba491710a8cb3c8d9) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a1982f2c3a698176ec3fb79ef3f945ed5)) to add an SDK event listener and perform logic processing in the corresponding callback.

`V2TIMSDKListener` callbacks are as follows:

|Event Callback|Description|Recommended Operation|
|---------|---------|---------|
|onConnecting|The SDK is connecting to the CVM instance.|Display the "connecting" status on the UI.|
|onConnectSuccess|The SDK is successfully connected to the CVM instance.|-|
|onConnectFailed|The SDK failed to connect to the CVM instance.|Notify the user that the network connection is currently unavailable.|
|onKickedOffline|The current user is kicked offline.|Display the "You are already logged in on another device. Are you sure you want to log in again?" message on the UI.|
|onUserSigExpired|The login ticket expired.|Log in with a new `UserSig`.|
|onSelfInfoUpdated|The current user's profile is updated.|Update the profile photo and nickname on the UI.|

> **Note:**
>  If you receive the `onUserSigExpired` callback, the `UserSig` that you use for login has expired. In this case, you need to use a new `UserSig` to log in again. If you continue to use the expired `UserSig`, the SDK will be in an infinite login loop.
> 

Sample code:

【Java】
``` java
// The `sdkListener` type is `V2TIMSDKListener`.
V2TIMManager.getInstance().addIMSDKListener(sdkListener);
```

【Swift】
``` swift
// The `self` type is id<V2TIMSDKListener>.
V2TIMManager.shared.addIMSDKListener(listener: self)
```

【Objective-C】
``` objectivec
// The `self` type is id<V2TIMSDKListener>.
[[V2TIMManager sharedInstance] addIMSDKListener:self];
```

【C++】
``` cpp
// `sdkListener` is an instance of V2TIMSDKListener.
V2TIMManager::GetInstance()->AddSDKListener(&sdkListener);
```

### Calling the initialization API

After performing the above steps, you can call `initSDK` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#aaad4f7139ba213f7e36da3e337c2f890) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.initsdk(sdkappid:config:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a2b417a8af0e974233baf1593ffa6c0f0) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#aecee922675b671cd979d68604a4be1bb)) to initialize the SDK.

Sample code:

【Java】
``` java
// 1. Get the `SDKAppID` from the IM console.
// 2. Initialize the `config` object.
V2TIMSDKConfig config = new V2TIMSDKConfig();
// 3. Specify the log output level.
config.setLogLevel(V2TIMSDKConfig.V2TIM_LOG_INFO);
// 4. Add the `V2TIMSDKListener` event listener. `sdkListener` is the implementation class of `V2TIMSDKListener`. If you don't need to listen to  SDK events, skip this step.
V2TIMManager.getInstance().addIMSDKListener(sdkListener);
// 5. Initialize the SDK. You can call the login API as soon as you call this API.
int  sdkAppID = 1400000000; // please set the sdkAppID of your own application
V2TIMManager.getInstance().initSDK(context, sdkAppID, config);
```

【Swift】
``` swift
// 1. Get the `SDKAppID` from the IM console.
// 2. Initialize the `config` object.
let config = V2TIMSDKConfig()
// 3. Specify the log output level.
config.logLevel = .V2TIM_LOG_INFO // Use enumeration values
// 4. Add the `V2TIMSDKListener` event listener. `self` is the implementation class of id<V2TIMSDKListener>. If you don't need to listen to SDK events, skip this step.
V2TIMManager.shared.addIMSDKListener(listener: self)
// 5. Initialize the SDK. You can call the login API as soon as you call this API.
V2TIMManager.shared.initSDK(sdkAppID: sdkAppID, config: config)
```

【Objective-C】
``` objectivec
// 1. Get the `SDKAppID` from the IM console.
// 2. Initialize the `config` object.
V2TIMSDKConfig *config = [[V2TIMSDKConfig alloc] init];
// 3. Specify the log output level.
config.logLevel = V2TIM_LOG_INFO;
// 4. Add the `V2TIMSDKListener` event listener. `self` is the implementation class of id<V2TIMSDKListener>. If you don't need to listen to SDK events, skip this step.
[[V2TIMManager sharedInstance] addIMSDKListener:self];
// 5. Initialize the SDK. You can call the login API as soon as you call this API.
int  sdkAppID = 1400000000; // please set the sdkAppID of your own application
[[V2TIMManager sharedInstance] initSDK:sdkAppID config:config];
```

【C++】
``` cpp
// 1. Get the `SDKAppID` from the IM console.
// 2. Initialize the `config` object.
V2TIMSDKConfig config;
// 3. Specify the log output level.
config.logLevel = V2TIMLogLevel::V2TIM_LOG_INFO;
// 4. Add the `V2TIMSDKListener` event listener. `sdkListener` is the implementation class of `V2TIMSDKListener`.
//    If you don't need to listen to SDK events, skip this step.
V2TIMManager::GetInstance()->AddSDKListener(&sdkListener);
// 5. Initialize the SDK. You can call the login API as soon as you call this API.
int  sdkAppID = 1400000000; // please set the sdkAppID of your own application
V2TIMManager::GetInstance()->InitSDK(sdkAppID, config);
```

### Uninitialization

Generally, if your application's lifecycle is the same as the SDK's lifecycle, you don't need to uninitialize the SDK before exiting the application.
However, you can uninitialize the SDK in special cases, for example, only after you enter a specific UI and no longer use it after exiting the UI.

Uninitialization requires two steps:
1. If you have called `addIMSDKListener` to add the SDK listener, call `removeIMSDKListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a9b98e6b9ac0f883f055ef82563467b43) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.removeimsdklistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a2e2a7e64bf51888c98636e5974a8aca7) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a0be850c20964cbbdceee33902cd2ed5d)) to remove it.

2. Call the `unInitSDK` uninitialization API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a8ac73b4f71f9d9a1ca01551c919d3cdd) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.uninitsdk()) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a286e5358ec4cd0a8f9c66f4d2d7d4544) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a6c88218989a1c714b4e989d1696439a0)).

   Sample code:

   

【Java】
``` java
// Remove the `V2TIMSDKListener` event listener. `sdkListener` is the implementation class of `V2TIMSDKListener`.
V2TIMManager.getInstance().removeIMSDKListener(sdkListener);
// Uninitialize the SDK
V2TIMManager.getInstance().unInitSDK();
```

【Swift】
``` swift
// `self` is the implementation class of id<V2TIMSDKListener>.
V2TIMManager.shared.removeIMSDKListener(listener: self)
// Uninitialize the SDK
V2TIMManager.shared.unInitSDK()
```

【Objective-C】
``` objectivec
// `self` is the implementation class of id<V2TIMSDKListener>.
[[V2TIMManager sharedInstance] removeIMSDKListener:self];
// Uninitialize the SDK
[[V2TIMManager sharedInstance] unInitSDK];
```

【C++】
``` cpp
// Remove the `V2TIMSDKListener` event listener. `sdkListener` is the instance of V2TIMSDKListener.
V2TIMManager::GetInstance()->RemoveSDKListener(&sdkListener);
// Uninitialize the SDK
V2TIMManager::GetInstance()->UnInitSDK();
```

## FAQs
1. **What should I do if error code 6013 is returned along with the description "not initialized" when I call the login or another API?**

   You must initialize the SDK before using the login, message, group, conversation, relationship chain and profile, and signaling features.
