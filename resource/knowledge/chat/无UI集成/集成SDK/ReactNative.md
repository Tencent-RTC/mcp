---
sync_node_id: '131316130624786432'
nav_path:
  - "无 UI 集成"
  - "集成SDK"
  - "React Native"
product: "chat"
---
This document describes how to quickly integrate the Tencent Cloud Chat SDK into your React Native project.

> **Note:**
> - Integrating [@tencentcloud/chat](https://www.npmjs.com/package/@tencentcloud/chat) into your React Native project requires downloading version 3.4.3 or later.
> - Integrating [tim-upload-plugin](https://www.npmjs.com/package/tim-upload-plugin) into your React Native project requires downloading version 1.4.0 or later.

## Environment Requirements

|Platform|Version|
|---------|---------|
|React Native| v0.75.0 or later.|
|Android|Android Studio 3.5 or later. The app requires Android 4.1 or later devices.|
|iOS|Xcode 11.0 or later. For testing with a real device, make sure that your project has a valid developer signature.|
|Node|Version 18.0 or later.|

## Configuring the development environment

If this is your first time developing a React Native project, refer to the React Native official steps [set-up-your-environment](https://reactnative.dev/docs/set-up-your-environment) to configure the development environment.

If you encounter environment problems when creating or compiling the project, you can run `npx react-native doctor` for environment diagnostics.

## Create a project (can be skipped if you already have one)
``` bash
npx react-native@latest init MyChatApp
```

`npm react-native` creates projects with Android gradle version 8.8. If your Android gradle version is lower than 8.8, please open Android Studio to sync the gradle version.

## Integrate Chat SDK
- Integrate the Chat SDK into your React Native project using npm.

- You can integrate the upload plugin [tim-upload-plugin](https://www.npmjs.com/package/tim-upload-plugin) for faster and safer upload of rich media resources.

- Enhance the user experience in a poor network environment or during network switching by integrating [@react-native-community/netinfo](https://www.npmjs.com/package/@react-native-community/netinfo).

   ``` bash
   npm install @tencentcloud/chat tim-upload-plugin  @react-native-community/netinfo --save
   ```

## Initialization

You must have the correct `SDKAppID`to proceed with the initialization.
`SDKAppID`is the identifier for a Tencent Cloud Chat application. We recommend applying for a new `SDKAppID` for each independent app. Messages between different SDKAppIDs are inherently isolated and cannot be interoperated.

You can view all SDKAppIDs in the [Chat Console](https://console.trtc.io/). Click **Create application** to create a new application with a new `SDKAppID`.

Import the Chat SDK and initialize it in your project's App.tsx.
``` javascript
import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';
import NetInfo from '@react-native-community/netinfo';

let options = {
  SDKAppID: 0 // Replace 0 with the SDKAppID of your Chat application when connecting
};
// Create an SDK instance. The `TencentCloudChat.create()` method returns the same instance for the same `SDKAppID`
let chat = TencentCloudChat.create(options); // The SDK instance is usually referred to as chat

chat.setLogLevel(0); // Normal level, with a lot of logs; it's recommended for integration

// Register the Tencent Cloud Instant Messaging rich media resource upload plugin
chat.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});
// Register the network monitoring plugin
chat.registerPlugin({'chat-network-monitor': NetInfo});
```

## Listening on events

#### SDK_READY

This is triggered when the SDK enters the ready state. After the accessing side listens to this event, it can call SDK APIs to send messages or use other SDK features.
``` javascript
let onSdkReady = function(event) {
  // After listening to the SDK ready event, you can make API calls
};
chat.on(TencentCloudChat.EVENT.SDK_READY, onSdkReady);
```

#### SDK_NOT_READY

This is triggered when the SDK enters the not-ready state. At this time, the accessing side will not be able to use features like sending messages via the SDK. To resume usage, the accessing side needs to call the login interface and drive the SDK to enter the ready state.
``` javascript
let onSdkNotReady = function(event) {
  // chat.login({userID: 'your userID', userSig: 'your userSig'});
};
chat.on(TencentCloudChat.EVENT.SDK_NOT_READY, onSdkNotReady);
```

#### MESSAGE_RECEIVED

When the SDK receives new messages from one-on-one chat, group chat, group prompts, or group system notifications, the accessing side can traverse event.data to obtain the message list data and render it to the UI.
``` javascript
let onMessageReceived = function(event) {
  // event.data - An array that stores `Message` objects - [Message]
};
chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onMessageReceived);
```

#### CONVERSATION_LIST_UPDATED

The conversation list is updated. event.data is an array containing Conversation objects.
``` javascript
let onConversationListUpdated = function(event) {
  console.log(event.data); // Array that stores Conversation instances
};
chat.on(TencentCloudChat.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
```

> **Note:**
> If you need to learn more about SDK event notifications, please view the [SDK event list](https://trtc.io/document/33999).
> 

## Deinitialization

Terminate the SDK instance. The SDK will log out, disconnect the WebSocket persistent connection, and then release resources.
``` javascript
chat.destroy();
```

## Login

Log in requires providing information such as `userID` and `userSig`. Please log in to the [Chat console](https://console.trtc.io/) to obtain them.
- UserID. Log in to the **Chat >** [**Users**](https://console.trtc.io/chat/account-management), create 2–3 test accounts for experience in C2C chat and group chat capacities.

   

- `UserSig` can be generated in real-time using the development tools provided by the console. Please click [Chat console > Development Tools > UserSig Tools](https://console.trtc.io/usersig).

   

   ``` javascript
   let promise = chat.login({
     userID: 'your userID',
     userSig: 'your userSig',
   });
   promise.then(function(imResponse) {
     if (imResponse.data.repeatLogin === true) {
       // This indicates that the account is already logged in. This login attempt is a duplicate login.
       console.log(imResponse.data.errorInfo);
     }
   }).catch(function(imError) {
     // Information related to login failure
     console.warn('login error:', imError);
   });
   ```

## Compile and run the React Native application

To compile and run the project, you need to use a real device or an emulator. **A real device is recommended.** You can refer to the React Native official website [running-on-device](https://reactnative.dev/docs/running-on-device) to connect a real device for debugging.

【Android】
1. Enable Developer Mode on your phone, and turn on the **USB Debugging** switch.

2. Connect your phone via USB. It's recommended to select the **Transfer files** option, **do not choose the Charging only option**.

3. After confirming the successful connection of your phone, execute `npm run android` to compile and run the project.

``` bash
npm run android
```

【iOS】
1. Connect your mobile phone with a USB cable, and open the ios directory of the project using Xcode.

2. Configure the signing information according to the React Native official website [running-on-device](https://reactnative.dev/docs/running-on-device).

3. Go to the ios directory and install dependencies.

``` bash
cd ios
pod install
```
4. Go back to the root directory and execute `npm run ios` to compile and run the project.

``` bash
cd ../
npm run ios
```

## Integrate third-party module

If you need to implement features like sending **Images, Videos, Files, Voice**, it is recommended to use the third-party modules provided below.
- **Select Images and Videos, Take Photo, Shoot Video**, we recommend that you integrate [react-native-image-picker](https://www.npmjs.com/package/react-native-image-picker).

   ``` bash
   npm install react-native-image-picker --save
   ```

   

【Select Image】
``` javascript
import {launchImageLibrary} from 'react-native-image-picker';
 
// 1. Select an Image
launchImageLibrary({
  mediaType: 'photo',
  selectionLimit: 1,
}).then((result) => {
 const file = result.assets[0];
 // 2. Create a message instance. The instance returned by the interface can be displayed on the screen
 let message = chat.createImageMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: { file: file },
    // React Native does not support upload progress callback
    // onProgress: function(event) { console.log('file uploading:', event) }
  });
  // 3. Send Image
  let promise = chat.sendMessage(message);
  promise.then(function(imResponse) {
    // The message was successfully sent
    console.log(imResponse);
  }).catch(function(imError) {
    // The message failed to be sent
    console.warn('sendMessage error:', imError);
  });
});
```

【Take Photo】
``` javascript
import {launchCamera} from 'react-native-image-picker';
// 1. Take Photo
launchCamera({
  mediaType: 'photo',
  cameraType: 'back',
}).then((result) => {
 const file = result.assets[0];
 // 2. Create a message instance. The instance returned by the interface can be displayed on the screen
 let message = chat.createImageMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: { file: file },
    // React Native does not support upload progress callback
    // onProgress: function(event) { console.log('file uploading:', event) }
  });
  // 3. Send Image
  let promise = chat.sendMessage(message);
  promise.then(function(imResponse) {
    // The message was successfully sent
    console.log(imResponse);
  }).catch(function(imError) {
    // The message failed to be sent
    console.warn('sendMessage error:', imError);
  });
});
```

【Select Video】
``` javascript
import {launchImageLibrary} from 'react-native-image-picker';
 
// 1. Select a Video
launchImageLibrary({
  mediaType: 'video',
  selectionLimit: 1,
}).then((result) => {
 const file = result.assets[0];
 // 2. Create a message instance. The instance returned by the interface can be displayed on the screen
 let message = chat.createVideoMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: { file: file },
    // React Native does not support upload progress callback
    // onProgress: function(event) { console.log('file uploading:', event) }
  });
  // 3. Send Video
  let promise = chat.sendMessage(message);
  promise.then(function(imResponse) {
    // The message was successfully sent
    console.log(imResponse);
  }).catch(function(imError) {
    // The message failed to be sent
    console.warn('sendMessage error:', imError);
  });
});
```

【Record Video】
``` javascript
import {launchCamera} from 'react-native-image-picker';

// 1. Record Video
launchCamera({
  mediaType: 'video',
  cameraType: 'back',
}).then((result) => {
 const file = result.assets[0];
 // 2. Create a message instance. The instance returned by the interface can be displayed on the screen
 let message = chat.createVideoMessage({
    to: 'user1',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: { file: file },
    // React Native does not support upload progress callback
    // onProgress: function(event) { console.log('file uploading:', event) }
  });
  // 3. Send Video
  let promise = chat.sendMessage(message);
  promise.then(function(imResponse) {
    // The message was successfully sent
    console.log(imResponse);
  }).catch(function(imError) {
    // The message failed to be sent
    console.warn('sendMessage error:', imError);
  });
});
```

- **Select Files**, we recommend that you integrate [react-native-document-picker](https://www.npmjs.com/package/react-native-document-picker).

   ``` bash
   npm install react-native-document-picker --save
   ```

   ``` javascript
   import DocumentPicker from 'react-native-document-picker';
    
   // 1. Select File
   DocumentPicker.pick({
     type: [DocumentPicker.types.allFiles],
   }).then((result) => {
    const file = result[0];
    // 2. Create a message instance. The instance returned by the interface can be displayed on the screen
    let message = chat.createFileMessage({
       to: 'user1',
       conversationType: TencentCloudChat.TYPES.CONV_C2C,
       payload: { file: file },
       // React Native does not support upload progress callback
       // onProgress: function(event) { console.log('file uploading:', event) }
     });
     // 3. Send File
     let promise = chat.sendMessage(message);
     promise.then(function(imResponse) {
       // The message was successfully sent
       console.log(imResponse);
     }).catch(function(imError) {
       // The message failed to be sent
       console.warn('sendMessage error:', imError);
     });
   });
   ```
- **Record voice**, we recommend that you integrate [react-native-audio-recorder-player](https://www.npmjs.com/package/react-native-audio-recorder-player).

   ``` bash
   npm install react-native-audio-recorder-player --save
   ```

   ``` javascript
   import AudioRecorderPlayer, {AVEncodingOption} from 'react-native-audio-recorder-player';
    
   // Record recording duration
   let duration = 0;
   // Record recording file path
   let uri = '';
    
   // 1. Start recording
   const onStartRecord = async () => {
     await audioRecorderPlayer.startRecorder('test.aac',{
       VFormatIDKeyIOS: AVEncodingOption.aac,
     });
     audioRecorderPlayer.addRecordBackListener((e: any) => {
       duration = e.currentPosition;
     });
   };
   // 2. Stop recording
   const onStopRecord = async () => {
     uri = await audioRecorderPlayer.stopRecorder();
     audioRecorderPlayer.removeRecordBackListener();
   };
   // 3. Send voice
   const file = {
     uri: uri,
     duration: duration,
   };
   let message = chat.createAudioMessage({
     to: 'user1',
     conversationType: 'C2C',
     payload: {
       file: file,
     },
     // React Native does not support upload progress callback
     // onProgress: function(event) { console.log('file uploading:', event) }
   });
   let promise = chat.sendMessage(message);
   promise.then(function(imResponse) {
     // The message was successfully sent
     console.log(imResponse);
   }).catch(function(imError) {
     // The message failed to be sent
     console.warn('sendMessage error:', imError);
   });
   ```

   > **Note:**
   > 
   > To enable `VoiceMessage` to play across all platforms, packaging the iOS app requires specifying VFormatIDKeyIOS as AVEncodingOption.aac for voice recording.
   > 

   To use the album, camera, and microphone, you need to configure the corresponding permissions. After configuring, you need to recompile and run the project to ensure effectiveness.

   

【Android】

In the android directory, find `app/src/main/AndroidManifest.xml` and add the following permissions:
``` bash
 <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
 <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
 <uses-permission android:name="android.permission.RECORD_AUDIO" />
```

【iOS】

In the ios directory, find `Info.plist` and add the following permissions:
``` bash
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your album to select photos</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone to record audio</string>
```

## Custom Definition Rich Media Message File Structure

If you choose other third-party plugins to select pictures, videos, files, and record voice, please assemble the file according to the following structure:

【Image】

`uri,fileName,type,width,height` is required, `fileSize`is optional if not available. 
``` javascript
const file = {
  uri: 'xxx',
  fileName: 'xxx',
  fileSize: 1,
  type: 'xxx',
  width: 1,
  height: 1,
};
```

【Video】

`uri,fileName,type` are required, and the `type`format must be ****/***. `fileSize`and `duration`are optional if not available. 
``` javascript
const file = {
  uri: 'xxx',
  fileName: 'xxx',
  fileSize: 1,
  type: 'xxx',
  duration: 0,
};
```

【File】

`uri,size,name` are required, and `size`must be greater than 0. 
``` javascript
const file = {
  uri: 'xxx',
  name: 'xxx',
  size: 1,
};
```

【Voice】

`uri,fileName,duration` are required. `duration`is measured in milliseconds (ms). `fileSize`is optional if not available. 
``` javascript
const file = {
  uri: 'xxx',
  fileName: 'xxx',
  fileSize: 1,
  duration: 0,
};
```

## FAQs

   

   ``` bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
2. If executing the Build command in Xcode prompts an issue with the node environment variables, please proceed as follows:

   

   ``` bash
   cd ios
   echo export NODE_BINARY=$(command -v node) > .xcode.env
   ```

## Documentation
- For more information on Chat SDK APIs, please refer to the [Client API](https://trtc.io/document/33999).
