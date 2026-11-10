---
sync_node_id: '131316112195014656'
nav_path:
  - "无 UI 集成"
  - "集成SDK"
  - "Unity"
product: "chat"
---
This document describes how to quickly integrate the Chat SDK for Unity to your projects. To configure and integrate the SDK, follow these steps.

## Environment Requirements

|Platform|Version|
|---------|---------|
|Unity|2019.4.15f1 or later|
|Android|Android Studio 3.5 or later; devices with Android 4.1 or later for apps|
|iOS|Xcode 11.0 or later. Ensure that your project has a valid developer signature.|

## UPM Integration (Recommended)
1. Find the `manifest.json` file:

2. Modify it as follows:

   ``` json
   {
     "dependencies":{
       "com.tencent.imsdk.unity":"https://github.com/TencentCloud/chat-sdk-unity.git#unity"
     }
   }
   ```
3. Open the project in the Unity Editor, wait until dependencies are loaded, and confirm the Tencent Cloud Chat is successfully loaded.

4. This is a test step. You can download [IM_Api_Example](https://github.com/TencentCloud/tc-chat-sdk-unity/tree/main/Assets/IM_Api_Example) and put it in your project after decompression.

   > **Note: **
   > 
   > IM_Api_Example is a demo used to test the callback data of the SDK's API. You can also call the API during early project development to manipulate your project.
   > 

    Drag all the scenes under the `IM_Api_Example/Assets` folder to `Build Settings`, and make sure that the `Main` scene is put at the first place.
 

    Double-click the `Main` scene under `IM_Api_Example/Assets` to start the demo. Here, you can select the language.

    Click  on the right of the header and enter the information.
 

    Click **InitSDK** and **Login** in **Base Module** for initialization and login. Then you can call the APIs available in IM_Api_Example.
 
