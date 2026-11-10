---
sync_node_id: '133688426865418240'
nav_path:
  - "视频通话 SDK"
  - "快速接入"
  - "uniapp（Android&iOS）"
product: "call"
---
This article will guide you through the quick integration of the TUICallKit component. You will complete several key steps within 10 minutes, ultimately obtaining a video call feature with a complete UI interface.

## TUICallKit Demo Experience
- TUICallKit Plugin Address: [TUICallKit Plugin Link ](https://ext.dcloud.net.cn/plugin).

- If you want to quickly run a new project, please read [uni-app Demo Quick Start](https://github.com/tencentyun/TUICallKit/tree/main/uni-app/TUICallKit-app) directly.

## Environment Requirements
- HbuilderX version requirement: HbuilderX version ≥ 3.94.

- Plugin Debugging Notes: Native plugins do not currently support simulator debugging.

- iOS Device Requirements: iOS system ≥ 9.0, supports audio and video calls on actual devices.

- Android Device Requirements: Android system ≥ 5.0 (SDK API Level 21), supports audio and video calls on actual devices, [Allow USB Debugging](https://zh.uniapp.dcloud.io/tutorial/run/run-app-faq.html#check).

## Step 1. Activate the service

Before using the Audio and Video Services provided by Tencent Cloud, you need to go to the Console and activate the service for your application. For detailed steps.

## Step 2: Create a uni-app Project

Open HBuilderX development tool, click to create a new uni-app project: Project Name (TUICallKit-Demo).

## Step 3: Download and import the TUICallKit Plugin
1. Create project, generate uin-app Application ID (AppID)

   Open HbuilderX, click the bottom left corner to login to your uni-app account (if you don't have an account, please register first). After logging in, click manifest.json file of the project to generate the uni-app AppID.

   

2. Visit [TencentCloud-TUICallKit Plugin](https://ext.dcloud.net.cn/plugin), purchase the plugin on the plugin detail page, and select the corresponding AppID, ensuring the package name is correct.

   

3. Import the plugin in the `TUICallKit-Demo project`.

   

## Step 4: Use the TUICallKit Plugin
1. Import the following code in `TUICallKit-Demo/pages/index/index.vue` .

   ``` javascript
   <template>
   	<view class="container">
   		<input type="text" v-model="inputID" :placeholder=" isLogin ? 'please enter a caller userID' : 'please enter your login userID' " />
   		<text v-show="isLogin"> your userID: {{ userID }} </text>
   		<button v-show="!isLogin" @click="handleLogin"> Login </button>
   		<button v-show="isLogin" @click="handleCall"> start call </button>
   	</view>
   </template>
   <script>
   	const TUICallKit = uni.requireNativePlugin('TencentCloud-TUICallKit'); //【1】import TUICallKit plugin
   	uni.$TUICallKit = TUICallKit;
   	import { genTestUserSig } from '../../debug/GenerateTestUserSig.js'
   	export default {
   		data() {
   			return {
   				inputID: '',
   				isLogin: false,
   				userID: '',
   			}
   		},
   		methods: {
   			handleLogin() {
   				this.userID = this.inputID;
   				const { userSig, sdkAppID: SDKAppID } = genTestUserSig(this.userID);
   				const loginParams = { SDKAppID, userID: this.userID, userSig };   // apply SDKAppID、userSig
                   //【2】Login
   				uni.$TUICallKit.login( loginParams, res => {
   						if (res.code === 0) {
   							this.isLogin = true;
   							this.inputID = '';
   							console.log('[TUICallKit] login success.');
   						} else { 
                               console.error('[TUICallKit] login failed, failed message = ', res.msg, params);
   						}
   					}
   				);	
   			},
   			handleCall() {
   				try {
   					const callParams = {
   						userIDList: [this.inputID],
   						callMediaType: 2,   // 1 -- audio call，2 -- video call
   						callParams: { roomID: 234, strRoomID: '2323423', timeout:30 },
   					};
                       //【3】start 1v1 video call
   					uni.$TUICallKit.calls( callParams, res => {
   							console.log('[TUICallKit] call params: ', JSON.stringify(res));
   						}
   					);
   					this.inputID = '';
   				} catch (error) {
   					console.log('[TUICallKit] call error: ', error);
   				}
   			}
   		}
   	}
   </script>
   <style>
   .container {
   	margin: 30px;
   }
   .container input {
   	height: 50px;
   	border: 1px solid;
   }
   .container button {
   	margin-top: 30px;
   }
   </style>
   ```
2. Enter the SDKAppID, SDKSecretKey, and userSig parameters.

   

【Client-side userSig generation】

Due to the time sensitivity of UserSig, **in a testing environment, it is recommended to use this method**.

2. Fill in the `TUICallKit-Demo/debug/GenerateTestUserSig.js` file with `SDKAppID` and `SDKSecretKey` (refer to [Activate Service](#step1))

【Console-generated userSig】

If you want to quickly experience TUICallKit, you can generate a temporary UserSig available through the [**Auxiliary Tools**](https://console.cloud.tencent.com/im/tool-usersig) in the console.

If you are using **Console Generation**, you will need to assign the `SDKAppID, userSig` values in the `TUICallKit-Demo/pages/index/index.vue` file.

## Step Five: Make your first phone call
1. To create a custom debugging base, please use the **Traditional Packaging** method.

   

2. After successfully creating the custom debugging base, **run the project Using Custom Base**.

   

3. The specific effect of making a 1v1 video call is shown in the figure.

   

## Additional Features
- Setting Nickname, Avatar

- Group Call

- Floating Window

- Custom Definition Ringtone

- Call Status Monitoring

## Related Case - Online Customer Service Scenario

We provide the source code related to the **Online Customer Service Scenario**. We recommend you [download the Online Customer Service Scenario](https://github.com/TencentCloud/chat-uikit-uniapp) and integrate it for the experience. This scenario provides a basic template with sample customer groups + sample friends, featuring:
- Support for sending text messages, image messages, Voice Message Service, and video messages.

- Supports two-person voice and video call features.

- Supports creating group chat sessions, group member management, etc.

   

## Technical Consultation

If you have any requirements or feedback, you can contact: info_rtc@tencent.com.
