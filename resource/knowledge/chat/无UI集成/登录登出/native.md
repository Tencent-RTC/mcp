---
sync_node_id: '108053229218603008'
nav_path:
  - "无 UI 集成"
  - "登录登出"
  - "Android&iOS&Windows&Mac"
product: "chat"
---
## Feature Description

After initializing the SDK, you need to call the SDK login API to authenticate your account to get the permissions to use message, conversation, and other features.

> **Note：**
> 1. All SDK feature APIs can be called only after successful login, except the APIs to get the conversation list and pull historical messages. Therefore, **make sure that you have logged in successfully** before using other features.
> 2. You can call the APIs to get the conversation list and pull historical messages even if your login failed. In this case, the locally cached conversation list and historical messages will be returned and can be displayed when there is no network connection.

## Login

Your first login to an Chat account doesn't require signup, as Chat will automatically sign the account up after finding out that you are using a new account. You can call the `login` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a73fc0e14c5f2f5fc06a80081479fb416) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.login(userid:usersig:succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a38c42943046acdaf615915c9422af07c) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a6a9c19be21327ace77ab75657d2944b3)) to log in.

Key parameters of the `login` API are as follows:

|Parameter|Definition|Description|
|---------|---------|---------|
|UserID|Unique user ID|It can contain up to 32 bytes of letters (a-z and A-Z), digits (0-9), underscores (_), and hyphens (-).|
|UserSig|Login ticket|It is calculated by your business server to ensure security. For more information, see [Generating UserSig](https://intl.cloud.tencent.com/document/product/1047/34385).|

You can call the `login` API in the following scenarios:
- You use the features of the SDK for the first time after your application is started.

- Your ticket expires on login: The callback of the `login` API returns the `ERR_USER_SIG_EXPIRED (6206)` or `ERR_SVR_ACCOUNT_USERSIG_EXPIRED (70001)` error code. In this case, you need to generate a new `userSig` to log in again.

- Your ticket expires when the user is online: You may receive the `onUserSigExpired` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a55a5d5ee490850d28b7b8a17868c4833)  / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onusersigexpired()) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#a55a5d5ee490850d28b7b8a17868c4833) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#a65e7f5c8eb4c87df150048a969315e8e)) when users are online. In this case, you need to generate a new `userSig` to log in again.

- A user is kicked offline: When a user is kicked offline, the SDK will notify you through the `onKickedOffline` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a0f56352869133d50d43c060448e208e7) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onkickedoffline()) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#a0f56352869133d50d43c060448e208e7) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#a5eb8b0014c044296cf440a2e7a3c45ff)). In this case, you can prompt the user and call `login` to log in again.

- Kicked off while offline: If a user is kicked off while offline, they will log in successfully by default when they come back online. If you need to return the error code ERR_LOGIN_KICKED_OFF_BY_OTHER（6208）for being kicked off offline, you need to configure it separately in the console.

   

   You don't need to call the `login` API in the following scenarios:

- After the user's network is disconnected and then reconnected, you don't need to call the `login` function, as the SDK will automatically go online.

- The login process is running.

   > **Note：**
   > 
   > 1. After you call the SDK API and log in successfully, MAU calculation will start; therefore, call the login API as needed to avoid a high MAU.
   > 2. You cannot log in to multiple SDK accounts of the same application at the same time; otherwise, only the last logged in account will be online.

   Sample code:

   

【Java】
``` java
String userID = "your user id";
String userSig = "userSig from your server";
V2TIMManager.getInstance().login(userID, userSig, new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        // The following error codes indicate an expired `userSig`, and you need to generate a new one for login again.
        // 1. ERR_USER_SIG_EXPIRED (6206)
        // 2. ERR_SVR_ACCOUNT_USERSIG_EXPIRED (70001)
        // Note: Do not call the login API in case of other error codes; otherwise, the SDK may enter an infinite loop of login.
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
let userID = "your user id";
let userSig = "userSig from your server";
V2TIMManager.shared.login(userID: userID, userSig: userSig) {
    print("login succ")
} fail: { code, message in
    // The following error codes indicate an expired `userSig`, and you need to generate a new one for login again.
    // 1. ERR_USER_SIG_EXPIRED (6206)
    // 2. ERR_SVR_ACCOUNT_USERSIG_EXPIRED (70001)
    // Note: Do not call the login API in case of other error codes; otherwise, the SDK may enter an infinite loop of login.
    if code == 6206 || code == 70001 {
        print("UserSig expired, please get a new UserSig.")
    } else {
        print("Login failure, code: \(code), message: \(message)")
    }
}
```

【Objective-C】
``` objectivec
NSString *userID = @"your user id";
NSString *userSig = @"userSig from your server";
[[V2TIMManager sharedInstance] login:userID userSig:userSig succ:^{
    NSLog(@"success");
} fail:^(int code, NSString *desc) {
    // The following error codes indicate an expired `userSig`, and you need to generate a new one for login again.
    // 1. ERR_USER_SIG_EXPIRED (6206)
    // 2. ERR_SVR_ACCOUNT_USERSIG_EXPIRED (70001)
    // Note: Do not call the login API in case of other error codes; otherwise, the SDK may enter an infinite loop of login.
    NSLog(@"failure, code:%d, desc:%@", code, desc);
}];
```

【C++】
``` cpp
class LoginCallback final : public V2TIMCallback {
public:
    LoginCallback() = default;
    ~LoginCallback() override = default;

    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
    }
    void OnSuccess() override {
        if (success_callback_) {
            success_callback_();
        }
    }
    void OnError(int error_code, const V2TIMString& error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }
private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

V2TIMString userID = "your user id";
V2TIMString userSig = "userSig from your server";
auto callback = new LoginCallback;
callback->SetCallback(
    [=]() {
        std::cout << "success";
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
          // The following error codes indicate an expired `userSig`, and you need to generate a new one for login again.
       // 1. ERR_USER_SIG_EXPIRED (6206)
       // 2. ERR_SVR_ACCOUNT_USERSIG_EXPIRED (70001)
       // Note: Do not call the login API in case of other error codes; otherwise, the SDK may enter an infinite loop of login.
        std::cout << "failure, code:" << error_code << ", desc:" << error_message.CString();
        delete callback;
    });
V2TIMManager::GetInstance()->Login(userID, userSig, callback);
```

### Getting the UserID

After logging in successfully, call `getLoginUser` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#ad4b2e5a7df5e786ba369054ac582007f) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.getloginuser()) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a78ca7f39bca860e46620f8f766508fb0) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ad19e832506181f6ec955d9e0d2035797)) to get the `UserID`.
If the login fails, the `UserID` will be empty.

Sample code:

【Java】
``` java
// Get the `UserID` of the logged-in user
String loginUserID = V2TIMManager.getInstance().getLoginUser();
```

【Swift】
``` swift
// Get the `UserID` of the logged-in user
let loginUserID = V2TIMManager.shared.getLoginUser()
```

【Objective-C】
``` objectivec
// Get the `UserID` of the logged-in user
NSString *loginUserID = [[V2TIMManager sharedInstance] getLoginUser];
```

【C++】
``` cpp
// Get the `UserID` of the logged-in user
V2TIMString loginUserID = V2TIMManager::GetInstance()->GetLoginUser();
```

### Getting the login status

Call `getLoginStatus` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a1836146275265b2a120412f18961db95) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.getloginstatus()) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#acfd2f6366780badf80ebf66d95550f89) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#ad5888b2d240c2fcb076b060d298a2c22)) to get the login status. If a user is logged in or logging in, don't call the login API frequently. The SDK supports the following login statuses:

|Login Status|Description|
|---------|---------|
|V2TIM_STATUS_LOGINED|Logged in|
|V2TIM_STATUS_LOGINING|Logging in|
|V2TIM_STATUS_LOGOUT|Not logged in|

Sample code:

【Java】
``` java
int loginStatus = V2TIMManager.getInstance().getLoginStatus();
```

【Swift】
``` swift
let loginStatus = V2TIMManager.shared.getLoginStatus()
```

【Objective-C】
``` objectivec
V2TIMLoginStatus loginStatus = [[V2TIMManager sharedInstance] getLoginStatus];
```

【C++】
``` cpp
V2TIMLoginStatus loginStatus = V2TIMManager::GetInstance()->GetLoginStatus();
```

## Multi-Client Login and Kickout
- You can configure multi-client login policies for the SDK in the [Chat Console](https://console.trtc.io/).There are multiple multi-client login policies, such as **A user can be concurrently online on a mobile or desktop platform and the web platform** or **A user can be concurrently online on all platforms**.
For more information on the configuration, see [Feature Configuration](https://intl.cloud.tencent.com/document/product/1047/34419).

- You can configure the **Max Login Instances per User per Platform** for the SDK in the [Chat Console](https://console.trtc.io/), that is, the maximum number of instances on the same platform that can be concurrently online.This feature is only available for Pro edition、Pro Plus edition、Enterprise edition. The value for **Web** and **Android, iPhone, iPad, Windows, Mac** is 10 or 3 respectively. For more information on the configuration, see [Feature Configuration](https://intl.cloud.tencent.com/document/product/1047/34419).

- When you call the `login` API to log in, if the limit specified by the multi-client login policy for your account is exceeded, a newly logged in instance will kick out an earlier one. If you have called `addIMSDKListener` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a2f0297e96d365013e7923275ce2a5d4e) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.addimsdklistener(listener:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#ac569656a58908afba491710a8cb3c8d9) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a1982f2c3a698176ec3fb79ef3f945ed5)) during the initialization to add the SDK listener, an earlier login instance will receive the `onKickedOffline` callback ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMSDKListener.html#a0f56352869133d50d43c060448e208e7) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMSDKListener.html#v2timsdklistener.onkickedoffline()) / [Objective-C](https://im.sdk.qcloud.com/doc/en/protocolV2TIMSDKListener-p.html#a0f56352869133d50d43c060448e208e7) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMSDKListener.html#a5eb8b0014c044296cf440a2e7a3c45ff)).

## Logout

Generally, if your application's lifecycle is the same as the SDK's lifecycle, there is no need to log out before exiting the application.
In special cases, for example, if you use the SDK only after entering a specific UI and no longer use it after exiting the UI, you can call the `logout` API ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a0398924fa1b62a8f5cc9b51673273b48) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.logout(succ:fail:)) / [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a20b495d7f7a231ea33507ca4a79f811f)/ [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#abf4f7e18d22fe8f75b5212fcf82e7113)) to log out of the SDK, after which you will no longer receive new messages. Note that in this case, you also need to call `unInitSDK` ([Java](https://im.sdk.qcloud.com/doc/en/classcom_1_1tencent_1_1imsdk_1_1v2_1_1V2TIMManager.html#a8ac73b4f71f9d9a1ca01551c919d3cdd) / [Swift](https://im.sdk.qcloud.com/doc/en/swift_V2TIMManager.html#v2timmanager.uninitsdk()) /  [Objective-C](https://im.sdk.qcloud.com/doc/en/interfaceV2TIMManager.html#a286e5358ec4cd0a8f9c66f4d2d7d4544) / [C++](https://im.sdk.qcloud.com/doc/en/classV2TIMManager.html#a6c88218989a1c714b4e989d1696439a0)) after the logout to uninitialize the SDK.

Sample code:

【Java】
``` java
V2TIMManager.getInstance().logout(new V2TIMCallback() {
    @Override
    public void onSuccess() {
        Log.i("imsdk", "success");
    }

    @Override
    public void onError(int code, String desc) {
        Log.i("imsdk", "failure, code:" + code + ", desc:" + desc);
    }
});
```

【Swift】
``` swift
V2TIMManager.shared.logout(succ: {
    print("logout succ.")
}, fail: { code, desc in
    print("logout fail, code: \(code), desc: \(desc)")
})
```

【Objective-C】
``` objectivec
[[V2TIMManager sharedInstance] logout:^{
    NSLog(@"success");
} fail:^(int code, NSString *desc) {
    NSLog(@"failure, code:%d, desc:%@", code, desc);
}];
```

【C++】
``` cpp
class Callback final : public V2TIMCallback {
public:
    using SuccessCallback = std::function<void()>;
    using ErrorCallback = std::function<void(int, const V2TIMString&)>;

    Callback() = default;
    ~Callback() override = default;

    void SetCallback(SuccessCallback success_callback, ErrorCallback error_callback) {
        success_callback_ = std::move(success_callback);
        error_callback_ = std::move(error_callback);
    }

    void OnSuccess() override {
        if (success_callback_) {
            success_callback_();
        }
    }
    void OnError(int error_code, const V2TIMString& error_message) override {
        if (error_callback_) {
            error_callback_(error_code, error_message);
        }
    }

private:
    SuccessCallback success_callback_;
    ErrorCallback error_callback_;
};

V2TIMString userID = "your user id";
V2TIMString userSig = "userSig from your server";
auto callback = new Callback{};
callback->SetCallback(
    [=]() {
        std::cout << "success";
        delete callback;
    },
    [=](int error_code, const V2TIMString& error_message) {
        std::cout << "failure, code:" << error_code << ", desc:" << error_message.CString();
        delete callback;
    });
V2TIMManager::GetInstance()->Logout(callback);
```

## Account Switch

Call `login` to switch between accounts in the application.

For example, to switch the logged-in user from `alice` to `bob`, just log bob in. You don't need to explicitly call `logout alice`, as this operation will be handled automatically inside the SDK.
