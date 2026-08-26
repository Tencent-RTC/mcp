## Operation Steps

### Step 1: TIMPush Integration
``` java
// For the version number "VERSION", please refer to .
// Configure the integration package in oh-package.json5
dependencies: {
    "@tencentcloud/timpush": "^VERSION",
    "@tencentcloud/imsdk": "^VERSION",
}
```

### Step 2: Register for Push Services

Call the API to push after registration is successful, and you can receive offline push notifications.
``` java
import { TIMPushListener, TIMPushManager, TIMPushMessage } from '@tencentcloud/timpush';

TIMPushManager.getInstance()
  .registerPush(context, your sdkAppId, "client secret", Chat console certificate ID)
  .then((result) => {
    HiLog("registerPush success:", result.message);
  })
  .catch((error: Error) => {
    HiLog("registerPush failed", error.code, error.message);
  })
```

### Step 3: Message Delivery Statistics Configuration

If you need statistics on reach data, complete the configuration as follows:

Receipt address: `https://api.im.qcloud.com/v3/offline_push_report/harmony`

### Step 4: Sending Push Notifications

For detailed API instructions, see RESTful APIs - Initiate Push to All Users/Tag Push.

### Step 5: Parsing Offline Push Messages

After receiving the push message and clicking the notification, the component will Webhook the click event and offline message pass-through.

> **Note:**
> - Register the callback timing in the oncreate() function of the application [UIAbility](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/uiability-lifecycle).
> - Console configuration click subsequent actions with the following configuration, select **open specified in-app page**, do not modify use default values.
>

``` java
let pushListener: TIMPushListener = {
  onNotificationClicked: (data) => {
    HiLog("onNotificationClicked", data);
  }
}

TIMPushManager.getInstance().addPushListener(pushListener);
```

Congratulations on completing the Push Plugin access. Remind you: **After trial or purchase expiry, the Push Plugin will automatically stop providing push service (including offline push for regular messages, Tag Push, etc.)**. To avoid affecting normal business operation, please [proceed to purchase](https://buy.tencentcloud.com/avc) or [renew](https://buy.tencentcloud.com/avc) in advance.

> **Note:**
> - Integration completed but not receiving push notifications? Please first use the [troubleshooting tool](https://cloud.tencent.com/document/product/269/100629) to check the reason. To view push metrics data, use [data statistics](https://cloud.tencent.com/document/product/269/100628) for querying.
> - For push notification feature to all users/Tag Push, please refer to: [RESTful APIs - Initiate Push to All Users/Tag Push](https://cloud.tencent.com/document/product/269/100634).
