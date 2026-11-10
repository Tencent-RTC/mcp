---
sync_node_id: '108053192389468160'
nav_path:
  - "服务端 API"
  - "生成 UserSig"
product: "chat"
---
UserSig (User Signature) is a security credential used by TRTC to authenticate user identities. When using TRTC services, such as initializing the SDK or logging in, you must provide a UserSig. TRTC uses this credential to verify the authenticity of the user and prevent malicious actors from hijacking your cloud service traffic. This document explains how to generate a UserSig.

The diagram below illustrates the authentication flow for generating a UserSig on the server in a production environment:

## Prerequisites

Before you begin, ensure you have followed the Activate the Service guide to create an application and obtained the following information from the console:
- `SDKAppID`: The unique identifier for your application

- `SDKSecretKey`: The secret key for your application

## Generating UserSig

You can generate a UserSig using one of the following three methods:
- Via Console: Quickly generate a UserSig using your `SDKAppID` and `UserID` via the console. This method is intended for **local testing and debugging only**.

- Client-side Generation: Use the open-source `GenerateTestUserSig` module provided by TRTC to generate a UserSig directly on the client. This allows for UserID customization and integration with your account system. This method is intended for **local testing and debugging only**.

- Server-side Generation **(Recommended for Production)**: Deploy the UserSig generation code on your backend server. Your app requests a dynamically generated UserSig from your server whenever needed. This is **the most secure method and is required for production environments**.

### Console Generation

To quickly try out the product demo, generating a UserSig in the console is the most convenient approach:
1. Log in to the [Chat console > Development Tools > UserSig Tools](https://console.trtc.io/usersig).

2. Select the `SDKAppID` of the application you want to test and enter the `UserID`.

3. Click **Generate** to create the corresponding UserSig.

   

### Client-side Generation

TRTC provides open-source code on GitHub for the following programming languages to generate a UserSig. You can download and integrate the source code into your client, fill in your `SDKAppID`, `SDKSecretKey`, and set the validity period for the `UserSig` (`EXPIRETIME`) to generate a UserSig.

|Programming Language|Platform|Source Code|
|---------|---------|---------|
|Java|Android|[GitHub](https://github.com/tencentyun/TIMSDK/blob/master/Android/Demo/app/src/main/java/com/tencent/qcloud/tim/demo/signature/GenerateTestUserSig.java)    [Gitee](https://gitee.com/cloudtencent/TIMSDK/blob/master/Android/Demo/app/src/main/java/com/tencent/qcloud/tim/demo/signature/GenerateTestUserSig.java)|
|Objective-C|iOS|[GitHub](https://github.com/tencentyun/TIMSDK/blob/master/iOS/Demo/TUIKitDemo/Private/GenerateTestUserSig.h)    [Gitee](https://gitee.com/cloudtencent/TIMSDK/blob/master/iOS/Demo/TUIKitDemo/Private/GenerateTestUserSig.h)|
|Objective-C|Mac|[GitHub](https://github.com/tencentyun/TIMSDK/blob/master/Mac/Demo/TUIKitDemo/Debug/GenerateTestUserSig.h)    [Gitee](https://gitee.com/cloudtencent/TIMSDK/blob/master/Mac/Demo/TUIKitDemo/Debug/GenerateTestUserSig.h)|
|C++|Windows|[GitHub](https://github.com/tencentyun/TIMSDK/blob/master/Windows/Demo/IMApp/GenerateTestUserSig.h)    [Gitee](https://gitee.com/cloudtencent/TIMSDK/blob/master/Windows/Demo/IMApp/GenerateTestUserSig.h)|
|Dart|Flutter|[GitHub](https://github.com/TencentCloud/chat-demo-flutter/blob/main/lib/utils/GenerateTestUserSig.dart)    [Gitee](https://gitee.com/hitszwangsheng/chat-demo-flutter/blob/main/lib/utils/GenerateTestUserSig.dart)|

> **Caution：**
> - The `SECRETKEY` in this method can be easily reverse-engineered or decompiled. If your secret key is exposed, attackers can hijack your TRTC traffic. Therefore, **this method is only suitable for local demo testing and feature debugging**.
> - In a production environment, you must integrate the UserSig generation code into your business server and provide an API for your app. When the app needs a UserSig, it should request it from the server to obtain a dynamically generated UserSig. For details, see Server-side Generation.

### Server-side Generation

Server-side generation ensures the security of your SecretKey. You can download the source code for your preferred language below and integrate it into your backend server.

The generation logic uses the standard **HMAC-SHA256** algorithm.

|Programming Language|Download Link|
|---------|---------|
|Java|[GitHub](https://github.com/tencentyun/tls-sig-api-v2-java/tree/master)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-v2-java)|
|Go|[GitHub](https://github.com/tencentyun/tls-sig-api-v2-golang/tree/master)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-v2-golang)|
|PHP|[GitHub](https://github.com/tencentyun/tls-sig-api-v2-php/tree/master)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-v2-php)|
|Node.js|[GitHub](https://github.com/tencentyun/tls-sig-api-v2-node/tree/master)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-v2-node)|
|Python|[GitHub](https://github.com/tencentyun/tls-sig-api-v2-python/tree/master)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-v2-python)|
|C#|[GitHub](https://github.com/tencentyun/tls-sig-api-v2-cs/tree/master)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-v2-cs)|
|C++|[GitHub](https://github.com/tencentyun/tls-sig-api-v2-cpp)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-v2-cpp)|

Using Go as an example, the function for generating UserSig requires the following parameters:
- `sdkappid`: Application ID, the unique identifier for your application.

- `userId`: User ID, up to 32 bytes. Only uppercase and lowercase letters (a-zA-Z), numbers (0-9), underscores, and hyphens are allowed.

- `expire`: The validity period of the UserSig, in seconds.

- `userbuf`: This parameter is set to `null` by default. In certain real-time audio and video scenarios, you may need to use an interface with `userbuf`, such as when joining a room. For details, see [Room Entry Permission Protection](https://trtc.io/document/35157).

- `key`: The secret key for your application.

**Go Example: Building a UserSig Generator**

> **Note:** 
> - The code examples below are for local testing and verification only. **Do not use** this code directly in a production environment.
> - For production, integrate the UserSig generation logic into your backend server. Your client application should request the signature from your server via an API (e.g., HTTP).

Follow the steps below to create a UserSig generator using Go.
1. Create a directory named `usersig-test` and create a `main.go` file inside it.

2. Copy and paste the following sample code into the `main.go` file, replacing `sdkAppID` and `key` with your actual credentials:

``` go
package main

import (
    "fmt"
    "github.com/tencentyun/tls-sig-api-v2-golang/tencentyun"
)

const (
    sdkAppID = 1400000000              // Replace with your SDKAppID
    key      = "YOUR_SDKSECRETKEY"     // Replace with your SDKSecretKey
    userID   = "testuser"              // User ID
    expire   = 86400 * 180             // UserSig validity period (seconds), example: 180 days
)

func main() {
    // Generate UserSig
    sig, err := tencentyun.GenUserSig(sdkAppID, key, userID, expire)
    if err != nil {
        fmt.Println("Failed to generate UserSig:", err)
        return
    }
    
    fmt.Printf("UserID: %s\n", userID)
    fmt.Printf("UserSig: %s\n", sig)
}
```
3. Open your terminal, navigate to the usersig-test directory, and run the following command to create the `go.mod` file:

``` bash
$ go mod init usersig-test
```
4. Run the following command to install dependencies:

``` bash
$ go get github.com/tencentyun/tls-sig-api-v2-golang/tencentyun
```
5. Run the following command to start the UserSig generator:

``` bash
$ go run main.go
```
6. Upon successful execution, the terminal will print the UserSig generated based on your `SDKAppID` and `SecretKey`. You can now use this UserSig for functional testing.

## Legacy Algorithm

To simplify the signature calculation, TRTC upgraded its signature algorithm from **ECDSA-SHA256** to **HMAC-SHA256** on **July 19, 2019**.
- **New Applications**: All SDKAppIDs created after July 19, 2019, automatically use the new HMAC-SHA256 algorithm.

- **Existing Applications**: If your application was created before this date, we recommend upgrading to the HMAC-SHA256 algorithm. This upgrade will not affect your live services.

   If you prefer to continue using the legacy signature algorithm. Source code download links are as follows:

   |Programming Language|Download Link|
   |---------|---------|
   |Java|[GitHub](https://github.com/tencentyun/tls-sig-api-java)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-java)|
   |Go|[GitHub](https://github.com/tencentyun/tls-sig-api-golang)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-golang)|
   |PHP|[GitHub](https://github.com/tencentyun/tls-sig-api-php)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-php)|
   |Node.js|[GitHub](https://github.com/tencentyun/tls-sig-api-node)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-node)|
   |Python|[GitHub](https://github.com/tencentyun/tls-sig-api-python)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-python)|
   |C#|[GitHub](https://github.com/tencentyun/tls-sig-api-cs)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api-cs)|
   |C++|[GitHub](https://github.com/tencentyun/tls-sig-api)    [Gitee](https://gitee.com/mirrors_tencentyun/tls-sig-api)|
