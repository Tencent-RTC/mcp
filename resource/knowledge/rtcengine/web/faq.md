# Handle Autoplay Restriction

## Introduction

In order to prevent web pages from automatically playing audio and video and causing interference to users, browsers have restricted the automatic playback function of audio and video: **before the user interacts with the web page (such as clicking, touching the page, etc.), the web page will be prohibited from playing media with sound. In iOS 10+, if low power mode is enabled, media without sound will also be prohibited from playing.**

Affected by the above browser autoplay policy, when using the TRTC Web SDK, there may be problems with playing silently. The most common scenario is: in your product design, support users to automatically enter the room and pull the stream for playback without the need for users to click after refreshing the page.

This article mainly introduces **how to solve the problem of playback failure caused by the restriction of autoplay policy**.

## Solution 1: Use the SDK's autoplay popup window

By default, when autoplay fails, the SDK will pop up to guide the user to interact with the page. After the interaction occurs, the SDK will actively call the interface to resume playback.

- **Advantages**: The business side does not need to do anything, simple and efficient.
- **Disadvantages**: The popup window provided by the SDK may not meet the design requirements of the business product. At this time, you can consider using Solution 2.

The popup window provided by the SDK is adapted to desktop and mobile browser, and the style is as follows:

- The SDK will switch the Chinese and English popup prompts according to the value of [navigator.language](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language).
- When the user clicks "OK", the SDK automatically calls the relevant interface to resume playback.
- In order to ensure that the popup window is displayed on the top layer as much as possible, its z-index value is 1500.

## Solution 2: Custom handling of autoplay restrictions

If you want to have complete control over the user experience when autoplay fails, you can follow these steps:

### Step 1: Disable SDK default popup

Set the `enableAutoPlayDialog` parameter to `false` when calling the [TRTC.enterRoom](./TRTC.html#enterRoom) interface:

```javascript
await trtc.enterRoom({
  // ... other parameters
  enableAutoPlayDialog: false
});
```

### Step 2: Listen for autoplay failure events (Required)

Listen to the [AUTOPLAY_FAILED](./module-EVENT.html#.AUTOPLAY_FAILED) event to handle autoplay failures. The SDK will automatically monitor user click events and resume playback after the user clicks.

```javascript
trtc.on(TRTC.EVENT.AUTOPLAY_FAILED, event => {
  // Add your custom handling logic here
  // For example: display a custom prompt to guide users to click on the page
});
```

### Step 3: Actively resume playback (Optional)

> Supported from version 5.9.0

In some special scenarios (such as in iframes or when using specific frontend frameworks), you may need to actively call the resume playback method. In this case, you can use the `resume` method provided in the event:

```javascript
trtc.on(TRTC.EVENT.AUTOPLAY_FAILED, (event) => {
  showCustomDialog(event);
});

function showCustomDialog(event) {
  const { userId, resume } = event;
  // The restricted user id is userId, resume is the function to resume playback for this user
  // Need to display a custom button, prompt that userId playback is restricted, and call 'resume()' in the button click callback
}
```

### Important Notes

1. Some browsers may check user interaction status before each playback, so autoplay failure events may be triggered multiple times.

2. Special requirements in iOS WeChat browser and mini-program webview:
   - When playing remote streams for the first time, you must call the playback interface directly in the user click event callback
   - You cannot use asynchronous methods like setTimeout to call the playback interface, otherwise playback will fail

## Disable Autoplay Policy in Webview

The default autoplay policy in Android and iOS Webview may be different to the browser. You can .

- **Android Webview**: Call [setMediaPlaybackRequiresUserGesture(false)](https://developer.android.com/reference/android/webkit/WebSettings#setMediaPlaybackRequiresUserGesture(boolean)).
- **iOS Webview**: Set [mediaTypesRequiringUserActionForPlayback](https://developer.apple.com/documentation/webkit/wkwebviewconfiguration/1851524-mediatypesrequiringuseractionfor) to WKAudiovisualMediaTypeNone.

---

# Handle Firewall Restriction

## Function Description

This article mainly introduces the best practices for dealing with firewall restrictions. For example, in a network environment with a firewall such as an enterprise intranet, TRTC Web SDK cannot be used normally due to firewall restrictions. In this case, there are two solutions:

- Solution 1: Listen for SDK errors and guide users to change networks or configure firewall whitelists.
- Solution 2: Use the Nginx + coturn proxy solution.

> The TRTC Web SDK uses UDP to communicate with the TRTC server by default, and has a built-in Turn Server that supports relaying media data through UDP or TCP.
> In the public network, users do not need to set up any proxies, as the SDK will attempt to establish media connections in the order of direct connection, Turn Server UDP, and Turn Server TCP.
> If it is known that the user will be using the SDK within an internal network firewall, it may not be possible to establish a media connection, and a proxy will need to be set up.

## Prerequisites

- Solution 2 requires the deployment of two servers, Nginx + Turn Server. You can contact your company's operations and maintenance colleagues to assist in building. The Nginx proxy server is used to proxy and forward the Websocket signaling data packets of TRTC Web SDK; the Turn Server is used to forward audio and video data packets.

## Implementation Process

### Solution 1

> This solution is suitable for: You cannot confirm whether the user's network will be restricted by the firewall. At this time, you can listen for SDK errors, guide users to change networks or check firewalls.

When you call APIs such as startLocalVideo, startLocalAudio, startRemoteVideo, etc., the SDK will establish a media connection channel internally for transmitting audio and video data. When encountering firewall restrictions, the SDK may fail to establish a connection, and the SDK will throw a firewall-restricted error and continue to retry.

You can refer to the following code example to listen for this error and guide users to change networks or check network firewalls and whitelist the domains and ports used by TRTC Web SDK. Reference: [TRTC Web SDK Domain and Port Whitelist](https://trtc.io/document/59667?platform=web&product=rtcengine&menulabel=coresdk).

```javascript
trtc.on(TRTC.EVENT.ERROR, error => {
  // User network firewall restrictions may cause audio and video calls to fail.
  // At this time, guide users to change networks or check network firewall settings.
  if (error.code === TRTC.ERROR_CODE.OPERATION_FAILED && error.extraCode === 5501) {
  }
});
```

### Solution 2

> This solution is suitable for: You confirm that the user's network is restricted by the firewall, and you need to set up a proxy server to solve the problem.

| Solution | Applicable scenarios | Network requirements |
|----------|---------------------|---------------------|
| A | Users can access a specific external proxy server on the network | The proxy server is deployed on the external network, and the internal network firewall needs to open a whitelist to allow internal network users to access the external proxy server. |
| B | Users can only access an internal proxy server on the network | The proxy server is deployed on the internal network, and the internal network firewall needs to open a whitelist to allow the internal proxy server to access the external network. |

*Example of Solution 2-A*

*Example of Solution 2-B*

### Setting up a proxy server

After you have set up Nginx and Turn server, you can .

```javascript
const trtc = TRTC.create();
await trtc.enterRoom({
  ...,
  proxy: {
    // Set up a Websocket proxy to relay signaling data packets between the SDK and the TRTC backend.
    websocketProxy: 'wss://proxy.example.com/ws/',
    // Set up a turn server to relay media data packets between the SDK and the TRTC backend. 14.3.3.3:3478 is the IP address and port of the turn server.
    turnServer: { url: '14.3.3.3:3478', username: 'turn', credential: 'turn', credentialType: 'password' },
    // By default, the SDK will connect to trtc server directly, if connection failed, then SDK will try to connect the TURN server to relay the media data. You can set 'relay' to force the connection through the TURN server.
    iceTransportPolicy: 'all',
    // By default, the SDK reports logs to the yun.tim.qq.com domain name. If this domain name cannot be accessed in your internal network, you need to whitelist the domain name or configure the following log proxy.
    // Set up a log reporting proxy. Logs are key data for troubleshooting, so be sure to set up this proxy.
    loggerProxy: 'https://proxy.example.com/logger/',
  }
})
```

### Solution 2-A

#### Setting up Nginx server

1. **Deploy Nginx server**

 . If the enterprise has already deployed the Nginx service, it can be configured directly.

2. **Configure Nginx server**

   ```sh
   vi /etc/nginx/nginx.conf
   ```

   ```nginx
   http {
     server {
       # The access domain name of the Nginx server
       server_name proxy.example.com;
       # The access port of the Nginx server
       listen 443;
       ssl on;
       location /ws/ { # Corresponding to the websocketProxy parameter in setProxyServer
         proxy_pass https://signaling.rtc.qq.com/; # TRTC server
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection "upgrade";
       }
       location /logger/ { # Corresponding to the loggerProxy parameter in setProxyServer
         proxy_pass https://yun.tim.qq.com/;
       }
       # SSL certificate corresponding to the domain name, used for HTTPS, users need to apply for it themselves
       ssl_certificate ./crt/1_proxy.trtcapi.com_bundle.crt;
       ssl_certificate_key ./crt/2_proxy.trtcapi.com.key;
     }
   }
   ```

3. **Reload Nginx**

   ```sh
   sudo nginx -s reload
   ```

4. Confirm that the company's firewall allows access to the Nginx server IP and port.

#### Setting up Turn server

You can search for turn server setup tutorials on the Internet for setup, or you can use the following script to set up a turn server in `Centos`.

1. **Create a script file `turn.sh` in the Linux server, and the script content is as follows:**

   ```sh
   #!/usr/bin/env bash
   # current file name is turn.sh
   # ref:
   # https://gabrieltanner.org/blog/turn-server    STEP 3 testing turn server
   # https://medium.com/av-transcode/what-is-webrtc-and-how-to-setup-stun-turn-server-for-webrtc-communication-63314728b9d0
   # as super-user
   # usage:  current_program <external-ip>
   set -x
   set -e
   ip a
   pwd
   whoami
   display_usage() {
           echo "This script must be run with super-user privileges."
           echo -e "\nUsage: $0 <external-ip> \ne.g. $0 154.8.246.205"
   }
   # if less than two arguments supplied, display usage
   if [ $# -lt 1 ]
   then
           display_usage
           exit 1
   fi
   if [[ $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
     echo "get external ip $1"
   else
     echo "wrong external ip $1 , must not have whitespace, tab and other char"
     exit 2
   fi
   yum install -y coturn
   # $1 is <external-ip>
   cat <<EOF > /etc/coturn/turnserver.conf
   external-ip=$1
   listening-port=3478
   lt-cred-mech
   max-port=65535
   min-port=20000
   no-dtls
   no-tls
   realm=tencent
   user=turn:turn
   verbose
   EOF
   ```

2. **Add executable permission**

   ```sh
   chmod +x turn.sh
   ```

3. **Execute the script as root, `sudo ./turn.sh <server public IP>`, for example:**

   ```sh
   sudo ./turn.sh 14.3.3.3
   ```

4. **Start the turn server**

   ```sh
   systemctl start coturn
   # Check if turn is started successfully
   ps aux | grep coturn
   # If you want to restart the service, execute
   service coturn restart
   ```

5. **Configure the firewall for the turn server, open inbound port 3478 (TCP & UDP), and outbound ports (UDP) between min and max ports in the configuration above.**

6. **Configure the company's internal network firewall to allow access to the turn server's IP and open outbound port 3478 (TCP & UDP).**

7. **Test the turn server**

### Solution 2-B

Solution B builds the Nginx proxy in the same way as Scenario A. There are two main differences:

1. When building a turn server, the external-ip field in the configuration file must be filled in with the address of the server on your corporate intranet.

   ```sh
   # The start script in option A is the server's external address, e.g. 14.3.3.3
   sudo . /turn.sh 14.3.3.3
   # In option B, the start script fills in the server's intranet address, e.g. 10.0.0.4 for the intranet
   sudo . /turn.sh 10.0.0.4
   ```

2. Firewall configuration:

   - For the Nginx server, the domain name whitelist needs to be configured in the company's intranet firewall to allow the Nginx server to access TRTC's related domain names. Refer to: [TRTC Web SDK domain and port whitelist](https://trtc.io/document/59667?platform=web&product=rtcengine&menulabel=coresdk)
   - For the Turn Server, allow the Turn Server to access the external network.
