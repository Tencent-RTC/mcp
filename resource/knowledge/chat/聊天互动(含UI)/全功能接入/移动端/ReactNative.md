---
sync_node_id: '120097781430042624'
nav_path:
  - "聊天互动（含 UI）"
  - "全功能接入"
  - "移动端"
  - "React Native"
product: "chat"
---
TUIKit is a React Native UI component library based on Tencent Cloud Chat SDK, providing common UI components such as session, chat, and group features. With these well-designed UI components, you can quickly build elegant, reliable, and scalable chat applications. The UI style developed based on React Native is more in line with the habits of overseas users and supports internationalization. You are welcome to integrate it.

The interface effect of TUIKit is shown below:

<style>
.vsdk-survey-card * {
  box-sizing: border-box;
}

.vsdk-survey-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 22px;
  margin: 16px 0;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%);
  border: 1px solid #D7E8FF;
  box-shadow: 0 4px 16px rgba(0,110,255,.05);
  transition: all .25s ease;
}

.vsdk-survey-card::before{
  content:"";
  position:absolute;
  right:-60px;
  top:-60px;
  width:180px;
  height:180px;
  background:radial-gradient(circle,
      rgba(0,110,255,.16) 0%,
      rgba(0,110,255,.08) 45%,
      transparent 75%);
  pointer-events:none;
}

.vsdk-survey-card::after{
  content:"";
  position:absolute;
  left:-40px;
  bottom:-60px;
  width:120px;
  height:120px;
  background:radial-gradient(circle,
      rgba(76,169,255,.08),
      transparent 70%);
  pointer-events:none;
}

.vsdk-survey-card:hover{
  border-color:#006EFF;
  box-shadow:
      0 10px 28px rgba(0,110,255,.10),
      0 0 36px rgba(0,110,255,.08);
  transform:translateY(-2px);
}

.vsdk-card-left{
  display:flex;
  align-items:center;
  gap:14px;
  flex:1;
  min-width:0;
  position:relative;
  z-index:1;
}

.vsdk-ico{
  width:46px;
  height:46px;
  flex:0 0 46px;
  border-radius:12px;
  background:linear-gradient(180deg,#EDF5FF,#DCEBFF);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:22px;
  box-shadow:
      inset 0 1px 0 rgba(255,255,255,.8),
      0 6px 18px rgba(0,110,255,.12);
}

.vsdk-text{
  min-width:0;
}

.vsdk-title{
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
  font-size:18px;
  font-weight:600;
  color:#1F2329;
  line-height:1.4;
}

.vsdk-badge{
  padding:2px 8px;
  border-radius:999px;
  background:#EAF3FF;
  color:#006EFF;
  font-size:11px;
  font-weight:600;
}

.vsdk-desc{
  margin-top:6px;
  font-size:13px;
  line-height:1.7;
  color:#4E5969;
}

.vsdk-card-right{
  flex-shrink:0;
  position:relative;
  z-index:1;
}

.vsdk-cta{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:112px;
  height:40px;
  padding:0 22px;
  border-radius:8px;
  background:#006EFF;
  color:#FFFFFF;
  text-decoration:none;
  font-size:14px;
  font-weight:600;
  box-shadow:0 8px 20px rgba(0,110,255,.25);
  transition:all .2s ease;
}

.vsdk-cta:hover{
  background:#0052D9;
  box-shadow:0 10px 24px rgba(0,110,255,.35);
}

@media (max-width:768px){

.vsdk-survey-card{
    flex-direction:column;
    align-items:flex-start;
}

.vsdk-card-left{
    width:100%;
    align-items:flex-start;
}

.vsdk-title{
    font-size:16px;
}

.vsdk-desc{
    font-size:12px;
}

.vsdk-card-right{
    width:100%;
    margin-top:14px;
}

.vsdk-cta{
    width:100%;
}

}
</style>

<div class="vsdk-survey-card">

<div class="vsdk-card-left">

<div class="vsdk-ico">💡</div>

<div class="vsdk-text">

<div class="vsdk-title">
Access point available? Feedback within 30 seconds.
<span class="vsdk-badge">All fields are optional.</span>
</div>

<div class="vsdk-desc">
Are you currently exploring or evaluating Chat UIKit? If you encounter any obstacles regarding the UI, features, or integration, please feel free to provide your feedback.
</div>

</div>

</div>

<div class="vsdk-card-right">
<a class="vsdk-cta" href="https://wj.qq.com/s2/27631368/gkal/" target="_blank">
Provide feedback
</a>
</div>

</div>

## Prerequisites
- **React Native version：** ≥  0.85.3

- [**Node.js**](https://nodejs.org/en/) **version：** ≥  22

- **iOS version：**≥  iOS 16.0

- **Android version：**≥  24

## Installation and Setup

### Step 1: Create a project (this example creates a project using Expo.)

【shell】
``` bash
npx create-expo-app@latest my-app --template blank-typescript
```

### Step 2. Integrate TUIKit
1. **Install UIkit**: Download [chat-uikit-react-native](https://www.npmjs.com/package/@tencentcloud/chat-uikit-react-native) via npm/yarn and use it in the project. 

   

【npm】
``` bash
npm install @tencentcloud/chat-uikit-react-native tuikit-atomicx-react-native
```

【yarn】
``` bash
yarn add @tencentcloud/chat-uikit-react-native tuikit-atomicx-react-native
```

2. **To install third-party dependencies**: TUIKit relies on **native modules** for features such as voice recording, image selection, and internationalization, which require manual installation.

   

【npm】
``` bash

npm install react-i18next i18next react-native-nitro-modules react-native-nitro-sound react-native-video react-native-create-thumbnail react-native-image-picker @react-native-documents/picker @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens
```

【yarn】
``` java
yarn add react-i18next i18next react-native-nitro-modules react-native-nitro-sound react-native-video react-native-create-thumbnail react-native-image-picker @react-native-documents/picker @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens
```

3. **Set up navigation**. Screens within TUIKit use `@react-navigation/native` for route management.

   ``` java
   npx expo install @react-navigation/native @react-navigation/native-stack
   ```

### Step 3: Permission Configuration

Configure the relevant **Android** and **iOS** permissions in `app.json`.
``` java

{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "You need to use the camera to take photos and send images and videos.",
        "NSPhotoLibraryUsageDescription": "Access to your photo library is required to select and send photos and videos.",
        "NSPhotoLibraryAddUsageDescription": "Need to save the image to the photo album.",
        "NSMicrophoneUsageDescription": "Microphone access is required to record voice messages.",
        "NSDocumentsFolderUsageDescription": "File access is required to select a document to send."
      }
    },
    "android": {
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_VIDEO",
        "READ_MEDIA_AUDIO",
        "ACCESS_NETWORK_STATE",
        "ACCESS_WIFI_STATE",
        "VIBRATE",
        "WAKE_LOCK"
      ]
    }
  }
}

```

### Step 4. Import TUIKit
1. **Integrating the UIKit**: Copy `@tencentcloud/chat-uikit-react-native/src/screens` to `./src/screens` (to facilitate customization, route adjustments, etc.).

   

【Mac】
``` bash
cp -R node_modules/@tencentcloud/chat-uikit-react-native/src/screens ./src/screens/
```

【Windows】
``` bash
xcopy /E /I /Y "node_modules\@tencentcloud\chat-uikit-react-native\src\screens" ".\src\screens"
```

2. **Configure page routing**: Replace the contents of `app.tsx` with the following.

   > **Note：**
   > 
   > The routing in the example uses `@react-navigation/native`; if you wish to replace it, you will also need to update the corresponding routing in `./src/screens`.
   > 

   ``` javascript
   import React, { useState } from 'react'
   import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native'
   import { SafeAreaProvider } from 'react-native-safe-area-context'
   import { NavigationContainer } from '@react-navigation/native'
   import { createNativeStackNavigator } from '@react-navigation/native-stack'
   import {
     LoginScreen,
     ChatScreen,
     ChatSettingScreen,
     ConversationListScreen,
     ContactListScreen,
     SearchScreen,
     AddFriendScreen,
     AddGroupScreen,
     ApplicationVerifyScreen,
     BlackListScreen,
     ContactInfoScreen,
     FriendApplicationListScreen,
     GroupApplicationListScreen,
     GroupListScreen,
     SetRemarkScreen,
     GroupManagementScreen,
     GroupMemberListScreen,
     GroupTypeInfoScreen,
     CreateGroupScreen,
     SearchInConversationScreen,
     UserFilterScreen,
     UserPickerScreen,
     BottomTabBar,
     type BottomTabKey,
   } from './src/screens'
   
   import { ToastRoot } from '@tencentcloud/chat-uikit-react-native'
   
   const Stack = createNativeStackNavigator()
   
   const MainScreen: React.FC = () => {
     const [activeTab, setActiveTab] = useState<BottomTabKey>('message')
     return (
       <View style={styles.mainScreen}>
         {activeTab === 'message' ? (
           <ConversationListScreen />
         ) : (
           <ContactListScreen />
         )}
         <BottomTabBar current={activeTab} onChange={setActiveTab} />
       </View>
     )
   }
   
   function App(): React.JSX.Element {
     const isDarkMode = useColorScheme() === 'dark'
   
     return (
       <SafeAreaProvider>
         <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
         <ToastRoot />
         <NavigationContainer>
           <Stack.Navigator
             initialRouteName="Login"
             screenOptions={{ headerShown: false }}
           >
             <Stack.Screen name="Login" component={LoginScreen} />
             <Stack.Screen name="Main" component={MainScreen} options={{ freezeOnBlur: true }} />
             <Stack.Screen name="Chat" component={ChatScreen} />
             <Stack.Screen name="Search" component={SearchScreen} />
             <Stack.Screen name="ChatSetting" component={ChatSettingScreen} options={{ freezeOnBlur: true }} />
             <Stack.Screen name="AddFriend" component={AddFriendScreen} />
             <Stack.Screen name="AddGroup" component={AddGroupScreen} />
             <Stack.Screen name="ApplicationVerify" component={ApplicationVerifyScreen} />
             <Stack.Screen name="BlackList" component={BlackListScreen} />
             <Stack.Screen name="ContactInfo" component={ContactInfoScreen} />
             <Stack.Screen name="FriendApplicationList" component={FriendApplicationListScreen} />
             <Stack.Screen name="GroupApplicationList" component={GroupApplicationListScreen} />
             <Stack.Screen name="GroupList" component={GroupListScreen} />
             <Stack.Screen name="SetRemark" component={SetRemarkScreen} />
             <Stack.Screen name="GroupManagement" component={GroupManagementScreen} />
             <Stack.Screen name="GroupMemberList" component={GroupMemberListScreen} />
             <Stack.Screen name="GroupTypeInfo" component={GroupTypeInfoScreen} />
             <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
             <Stack.Screen name="SearchInConversation" component={SearchInConversationScreen} />
             <Stack.Screen name="UserFilter" component={UserFilterScreen} />
             <Stack.Screen name="UserPicker" component={UserPickerScreen} />
           </Stack.Navigator>
         </NavigationContainer>
       </SafeAreaProvider>
     )
   }
   
   const styles = StyleSheet.create({
     mainScreen: {
       flex: 1,
       backgroundColor: '#F5F5F5',
     },
   })
   
   export default App
   
   ```

## Execution and Testing
1. Log in `src/screens/LoginScreen.tsx`, enter the `SDKAppID`, `userID`, and `SecretKey`, then click **Log In**.

| Parameter | Type | Description |
| --- | --- | --- |
| SDKAppID | Number | SDKAppID. can be obtained through the <a href="https://console.trtc.io/chat/detail"><strong>Chat Product Details</strong></a>. |
| SecretKey | String | The SecretKey is the key for the instant messaging Chat client application. You can obtain it from the <a href="https://console.trtc.io/chat/detail"><strong>Chat Product Details</strong></a>.<br><strong>Safety Notice：</strong><br>- The sample supports generating <code>userSig</code> via the <code>genTestUserSig</code> function. However, the <code>SecretKey</code> used in this method is vulnerable to reverse engineering; if the key is compromised, attackers could hijack your Tencent Cloud traffic. This method is suitable only for local functional debugging. For the correct way to issue <code>UserSig</code>, please refer to <a href="https://trtc.io/document/34385?product=chat">"Generating UserSig on the Server."</a><br>- Sensitive information (such as <code>SecretKey</code>) is intended solely for demo testing and must not be committed to code repositories or used in production environments. |
| userID | String | A unique user identifier defined by you; it may only contain uppercase and lowercase letters (a-z, A-Z), numbers (0-9), underscores, and hyphens. |

   ``` typescript
   import React, { useEffect, useState } from 'react'
   import { useNavigation } from '@react-navigation/native'
   import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
   import { useLoginState } from 'tuikit-atomicx-react-native'
   import { genTestUserSig } from './debug/GenerateTestUserSig'
   
   type RootStackParamList = {
     Login: undefined
     Main: undefined
   }
   
   type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>
   
   export const LoginScreen: React.FC = () => {
     const navigation = useNavigation<Nav>()
     const [loading, setLoading] = useState(false)
     const { login, logout, loginStatus, loginUserInfo } = useLoginState()
     
     const [userID, setUserID] = useState('') // userID
     const SDKAppID = 0 // SDKAppID
     const SecretKey = '' // SecretKey
     
     
     useEffect((): void => {
       if (loading && loginStatus === 1) {
         navigation.reset({ index: 0, routes: [{ name: 'Main' }] })
       }
     }, [loading, loginStatus, navigation])
   
     const doLogin = async (): Promise<void> => {
       setLoading(true)
       try {
         await login({
           sdkAppID: Number(SDKAppID),
           userID: userID.trim(),
           userSig: genTestUserSig({
             SDKAppID: SDKAppID,
             userID: userID.trim(),
             SecretKey: SecretKey
           }).userSig,
         })
       } catch (error: any) {
         console.error(error)
       } finally {
         setLoading(false)
       }
     }
   
     return /* UI */;
   }
   ```
2. Compile and run the project**：**To compile and run the project, you need to use a real device or an emulator. It is recommended to use a real device. You can refer to the React Native official website [running-on-device](https://reactnative.dev/docs/running-on-device) for connecting a real device for debugging.

   

【Android】
1. Enable Developer Mode on the phone and turn on the **USB Debugging** switch.

2. Connect the phone with a USB cable, it is recommended to choose the **Transfering File** option, **do not choose the Charge Only option**.

3. After confirming the phone is successfully connected, execute `npm run android` to compile and run the project.

``` bash
npm run start
```

【iOS】
1. Connect the phone with a USB cable and open the project ios directory with Xcode.

2. Configure the signing information according to the [running-on-device](https://reactnative.dev/docs/running-on-device) section on the React Native official website.

3. Go to the ios directory and install dependencies.

``` bash
cd ios
pod install
```
4. Go back to the root directory and execute npm run ios to compile and run the project.

``` bash
cd ../
npm run start
```

## Exchange and Feedback

## FAQs

### What to do when there is a runtime environment error?

You can run the following command for environmental diagnosis.
``` bash
npx react-native doctor 
```
