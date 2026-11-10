---
sync_node_id: '131316112564113408'
nav_path:
  - "无 UI 集成"
  - "集成SDK"
  - "Flutter"
product: "chat"
---
This document describes how to quickly integrate the Tencent Cloud Chat SDK into your Flutter project.

## Environment Requirements

|Platform|Version|
|---------|---------|
|Flutter|3.0.0 or later|
|Android|Android Studio 3.5 or later; devices with Android 4.1 or later for apps|
|iOS|Xcode 11.0 or later. For testing with a real device, ensure that your project has a valid developer signature.|

## Supported Platforms

We are committed to building a set of Chat SDK and TUIKit for all Flutter platforms, allowing you to run one set of code across all platforms.

|Platform|Support or Not|
|---------|---------|
|iOS|Supported|
|Android|Supported|
|HarmonyOS NEXT|Supported from v8.5.6864+4|
|macOS|Supported from v4.1.9|
|Windows|Supported from v4.1.9|
|Web|Supported from v4.1.1+2|
|[Hybrid development](https://www.tencentcloud.com/document/product/1047/51456) (Adding SDK for Flutter to existing native applications)|Supported from v5.0.0|

> **Note: **
> For HarmonyOS and web, you need to perform a few extra steps for SDK integration. For details, see Support for the HarmonyOS NEXT and [Support for the Flutter for Web](#web) in this document.
> 

## Trying Out Demos

Before integration, you can try out our demos to quickly understand the capabilities of the Tencent Cloud Chat cross-platform SDK and TUIKit for Flutter.

**All of the following demos are packaged by the same Flutter project.**
| Mobile App | Web - HTML5 |
| --- | --- |
| iOS/Android app | Scan the QR code with your mobile phone to try out |

## Integrating the Chat SDK

You can directly integrate the Chat SDK for Flutter through pub add, or write the Chat SDK into `pubspec.yaml`.

### Installing the Chat SDK via `flutter pub add`

Enter the following command in the terminal window (the Flutter environment is ready):
``` bash
flutter pub add tencent_cloud_chat_sdk
```

### Writing the Chat SDK into `pubspec.yaml`
``` yaml
dependencies:
# You can check the latest version of the Chat SDK for Flutter on https://pub.dev/packages/tencent_cloud_chat_sdk
  tencent_cloud_chat_sdk: "Latest version"
```

Here, your editor may automatically run `flutter pub get`. If not, enter the command `flutter pub get`.

## Support for the Flutter for HarmonyOS NEXT

The UI-less SDK (tencent_cloud_chat_sdk) version 8.5.6864+4 and later now supports HarmonyOS NEXT. This implementation is developed based on [the HarmonyOS-adapted Flutter 3.22 version](https://gitee.com/harmonycommando_flutter/flutter).

As HarmonyOS has adapted many Flutter third-party libraries, and the tencent_cloud_chat_sdk only utilizes the path_provider third-party library, you need to add dependency overrides for the HarmonyOS-adapted version of path_provider in your project's root directory pubspec.yaml file.
``` yaml
dependency_overrides:
  path_provider:
    git:
      url: "https://gitee.com/openharmony-sig/flutter_packages.git"
      path: "packages/path_provider/path_provider"
```

## Support for the Flutter for Web

Chat SDK (tencent_cloud_chat_sdk) 4.1.1+2 or later provides full compatibility with web.

To enable support for web, you need to perform the following extra steps, compared with the steps to enable support for Android and iOS:

### Upgrading to Flutter 3.x

Flutter 3.x has been dramatically optimized for web performance and is highly recommended for Flutter web project development.

### Importing JS

> **Note: **
> If your existing Flutter project does not support web, run `flutter create .` in the root directory of the project to add web support.
> 

Go to the `web/` directory of your project and use npm or Yarn to install related JS dependencies. To initialize the project, follow the on-screen instructions.
``` shell
cd web

npm init

npm i tim-js-sdk

npm i tim-upload-plugin
```

Open `web/index.html` and import the JS files in `<head> </head>`.
``` html
<script src="./node_modules/tim-upload-plugin/index.js"></script>
<script src="./node_modules/tim-js-sdk/tim-js-friendship.js"></script>
```

## FAQs

### What should I do if `flutter pub get/add` fails?

Configure Flutter to use a mirror site as instructed in [Flutter](https://flutter.cn/community/china).
