### What should I do if I receive the error message "The package you purchased does not support this ability"?

If you encounter the error message above, it's because the Audio and Video Calling Capability Package of your current application has either expired or not been activated. Please refer to [Activate Service](https://trtc.io/document/59832) to claim or activate the audio and video calling capability, and continue to use the TUICallKit Component.

### How do I purchase a package?

Please follow the link [Purchase Official Version](https://trtc.io/document/59832).

### How can I generate a UserSig?

UserSig is a type of security signature designed by Tencent Cloud for its cloud services. It serves as a login credential, derived from the encrypted combination of information such as SDKAppID and SecretKey.
- **Method 1:** Accessing from the control panel, refer to [ How to Obtain a Temporary UserSig](https://console.trtc.io/usersig).

- **Method 2:** Deploying a temporary generation script.

   > **Warning:**
   >
   > This approach involves configuring the SecretKey within the front-end code. Regrettably, in this method, the SecretKey can be easily decrypted through reverse engineering. In the event of your key being exposed, attackers can usurp your Tencent Cloud traffic. Therefore,  **this method is only suitable for local functional debugging**. For a production environment, please refer to Method 3.
   >

   For easier initial debugging, `GenerateTestUserSig-es.js` in the `genTestUserSig(params)` function can be used temporarily to calculate userSig, for instance:

   ``` javascript
   import { genTestUserSig } from "./debug/GenerateTestUserSig-es.js";
   const { userSig } = genTestUserSig({ userID: "Alice", SDKAppID: 0, SecretKey: "YOUT_SECRETKEY" });
   ```
- **Method 3:**Use in official environment.

   The correct method of issuing UserSig is to integrate the calculation code of UserSig into your server-side, providing project-specific interfaces. When UserSig is needed, your project can launch requests to the business server to obtain dynamic UserSig. For detailed information, please see [Generating UserSig on Server-side](https://trtc.io/document/35166).

### How is the groupID generated in a group call?

The generation of groupID requires integration of the [@tencentcloud/chat](https://www.npmjs.com/package/@tencentcloud/chat) package. For specifics, refer to the [createGroup API](https://trtc.io/document/48465); below is an example of the code to generate groupID.
``` javascript
import Chat from "@tencentcloud/chat";   // npm i @tencentcloud/chat

const userIDList: string[] = ['user1', 'user2'];
async function createGroupID() {
  const chat = Chat.create({ SDKAppID });
  const memberList: any[] = userIDList.map(userId => ({ userID: userId }));
  const res = await chat.createGroup({
    type: Chat.TYPES.GRP_PUBLIC,
    name: 'WebSDK',
    memberList
  });
  return res.data.group.groupID;
}
```

### How do I create a userID?

**Unique identifier of the user,** `defined by you`**,** it is allowed to contain only upper and lower case letters (a-z, A-Z), numbers (0-9), underscores, and hyphens.
- Signing in once with userID and userSig will automatically create the user.

- Create and get through the [Tencent RTC Console](https://console.trtc.io/chat/account-management).

## Error <call>: failed Invalid sender or receiver identifier？

This error occurs because the userID you called does not exist; ensure the userID has signed in at least once. See [How do I create a userID](https://trtc.io/document/51024) for more details.

## Error [CallService]API<init>: sdkAppID is required？

- This error occurs because you did not fill in the SDKAppID information during [TUICallKitServer.init](https://trtc.io/document/51015#init)/ `GenerateTestUserSig.genTestUserSig`

- Please obtain and fill in from the [Tencent RTC Console](https://trtc.io/document/59832).

## npm install -g create-react-app error: errno -13？

If this error occurs, it is because the current user does not have permission to globally install scaffolding. Please use`sudo npm install -g create-react-app`**.**

## **npm install -g @vue/cli package error: errno -13？**

If this error occurs, it is because the current user does not have permission to globally install scaffolding. Please use `sudo npm install -g @vue/cli`**.**
