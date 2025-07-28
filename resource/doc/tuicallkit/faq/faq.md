### 1. Error message `[-100035]The package you purchased does not support this ability. Please purchase the package` appears during voice or video call？

To make voice or video calls, you need to subscribe to our Call Monthly Package. You can try it for free for 7 days. For more information on how to activate the service, please refer to: [Activate Service (TUICallKit)](https://www.tencentcloud.com/document/product/647/59832).

### 2. Invalid or non-existent UserID of message sender or receiver？

If the user you are calling has not logged in, the call will fail. Please try calling a user who has successfully logged in.

### 3. Error: inviteID is invalid or the invitation has been processed？

The inviteID may be invalid if it has been cancelled by the caller or if the invitation has already been accepted. In some cases, network bandwidth may also affect signaling, causing inviteID invalid errors.

### **4. How to get the call room number RoomId?**

After the call is connected, you can obtain the call room number (RoomId) through the [onCallBegin](https://www.tencentcloud.com/document/product/647/51007#onCallBegin) return roomid field.

### 5. Can TUICallKit be used without importing the Chat SDK?

**No**, all components of TUIKit use Tencent Cloud Chat SDK as the communication base service, including call signaling, busy line signaling, and other core logic. If you have already purchased another Chat product, you can also refer to the TUICallKit logic for adaptation.

### 6. in the TUIChat + TUICallKit Integrated Scenarios, after Upgrading the TUICallKit Version, New Version Calls Old Version and Old Version Is Unable to Receive Call Issues

Starting from TUICallKit version 3.1, in the TUIChat + TUICallKit integrated scenarios, initiating a call through the call button in TUIChat by default uses the new calls API. Therefore, if your business has already gone live, you can use the advanced API to switch the call interface to call or groupCall to maintain interconnectivity with users of the online edition.

You need to call an advanced API once after successful log-in. Specific use on all platforms is as follows:




【iOS(Swift)】
``` swift
let jsonParams: [String: Any] = ["api": "forceUseV2API",
                                 "params": ["enable": true,],]
guard let data = try? JSONSerialization.data(withJSONObject: jsonParams, options: JSONSerialization.WritingOptions(rawValue: 0)) else { return }
guard let paramsString = NSString(data: data, encoding: String.Encoding.utf8.rawValue) as? String else { return }

TUICallKit.createInstance().callExperimentalAPI(jsonStr: paramsString)
```


【iOS(Objective-C)】
``` cpp
NSDictionary *jsonParams = @{@"api": @"forceUseV2API",    
                             @"params": @{@"enable": @YES}};
NSError *error = nil;
NSData *data = [NSJSONSerialization dataWithJSONObject:jsonParams options:0 error:&error];
if (error || !data) { return; }
NSString *paramsString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
if (!paramsString) { return;}
[[TUICallKit createInstance] callExperimentalAPIWithJsonStr:paramsString];


```


【Android(java)】
``` java
 try {
    JSONObject params = new JSONObject();
    params.put("enable", true);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("api", "forceUseV2API");
    jsonObject.put("params", params);
    TUICallKit.createInstance(context).callExperimentalAPI(jsonObject.toString());
} catch (Exception e) {
    e.printStackTrace();
}

```


【Android(kotlin)】
``` java
try {
    val params = JSONObject()
    params.put("enable", true)

    val jsonObject = JSONObject()
    jsonObject.put("api", "forceUseV2API")
    jsonObject.put("params", params)
    TUICallKit.createInstance(context).callExperimentalAPI(jsonObject.toString())
} catch (e: Exception) {
    e.printStackTrace()
}

```


【Flutter(Dart)】
``` java
final jsonParams = {'api': 'forceUseV2API',    
                 'params': {'enable': true} };  
                 
try {    
    final jsonString = json.encode(jsonParams);    
    TUICallKit.instance.callExperimentalAPI(jsonStr: jsonString);  
} catch (e) {    
    return;  
}
```


【Web & Mini Programs】
``` javascript
const jsonObject = {
    api: "forceUseV2API",
    params: {
      enable: true,
    }
};
TUICallKitServer.getTUICallEngineInstance().callExperimentalAPI(JSON.stringfy(jsonObject));
```

### 

### 7.How to get the log files of each platform?

The current log file paths of each platform are as follows:


- iOS or Mac: In the sandbox Documents/log folder.

- Android: In the /sdcard/Android/data/[your application package name]/files/log/liteav/ folder.

- Windows: In the C:/Users/[system username]/AppData/Roaming/liteav/log, i.e. %APPDATA%/liteav/log folder.


