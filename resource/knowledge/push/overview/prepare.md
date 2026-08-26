Push Service is a fully managed, cross-platform messaging solution built for app developers. Skip the infrastructure overhead — Push handles reliable message delivery at scale so you can focus on your product.

Whether you're sending system notifications, running marketing campaigns, delivering content updates, re-engaging lapsed users, or triggering audio/video call alerts, Push ensures your messages get through — regardless of whether users are online or offline. The result: higher engagement, better retention, and a smoother end-user experience.

## Scenario Overview

Push Service integrates seamlessly with products such as TRTC Chat SDK, RTC Engine SDK, and Audio/Video Call SDK (TUICallKit), enabling a broad set of communication scenarios. The most common use cases include:

##### App Online & Offline Push

Send real-time messages to all users or targeted segments. Push delivers messages instantly to online users, and for offline users, it can wake up users who have been active within the past 30 days, ensuring no message is missed. This maximizes user engagement and retention. Typical scenarios include:

|Scenario Category|Specific Use Cases|
|---------|---------|
|System Notifications & Transaction Alerts|Platform announcements, order status updates, logistics updates, payment confirmations, and other system-level messages requiring timely delivery.|
|Social Interaction Alerts|Real-time notifications for new messages, likes, comments, follows, friend requests, and other social events.|
|Content & News Push|Personalized news, articles, videos, and content updates based on user interest tags.|
|Marketing & Campaign Operations|Targeted delivery for time-limited promotions, coupon distribution, event previews, and other campaign messages.|
|Game Operations|Event previews, tournament reminders, version update notifications, and custom in-game alerts.|
|Financial Services|Financial notifications with strict timeliness and security requirements, such as transaction updates, risk alerts, and account changes.|
|User Re-engagement|Send personalized re-engagement messages to inactive users, using tagging systems to increase return rates.|

##### Chat Message Push

Chat messages are delivered to users' devices as notification bar alerts. Tapping the notification takes users directly to the relevant conversation, automatically updating conversations, messages, and unread counts. Messages are received in real time while online, and offline users will receive push notifications upon their next login, ensuring no chat message is missed. **(Requires integration with the** [**Chat SDK**](https://trtc.io/sdkDownload)**)**

##### Audio and Video Call Invitations

Push supports both notification bar and VoIP push for audio and video call invitations between users. Regardless of whether the app is running in the background, closed, or killed, call invitations are delivered instantly via the offline push channel, ensuring calls are never missed or interrupted. **(Requires integration with the** [**Audio/Video Call SDK**](https://trtc.io/sdkDownload)**)**

## Product Advantages

### 3-Minute One-Click Integration
| <strong>Capability</strong> | <strong>Description</strong> |
| --- | --- |
| <strong>Full Platform Coverage</strong> | - <strong>Online Push</strong>: Compatible with all device models, including Samsung, ZTE, Transsion, Smartisan, Hisense, Sony, and more.<br>- <strong>Offline Push</strong>: Vendor support for Xiaomi, Huawei, Honor, OPPO, vivo, Meizu, APNs (including sub-brands such as OnePlus, realme, iQOO), and Google FCM for international users.<br>- <strong>Development Platforms</strong>: Supports Android, iOS, Flutter, React-Native, HarmonyOS, Unity, Unreal Engine. |
| <strong>Minimal Configuration</strong> | Download and import the JSON configuration file from the Chat Console for one-click setup of all vendor push channels. |
| <strong>End-to-End Automation</strong> | - <strong>Auto Registration</strong>: No manual push registration required.<br>- <strong>Auto Reporting</strong>: Token reporting and foreground/background state tracking are handled automatically.<br>- <strong>Auto Statistics</strong>: No need to manually add tracking points or manage reporting logic. |

### Millisecond-Level Push and Guaranteed Delivery Rate
| <strong>Capability</strong> | <strong>Description</strong> |
| --- | --- |
| <strong>Global Acceleration Network</strong> | - Nearly 3,000 acceleration nodes worldwide.<br>- Proprietary multi-level optimal routing algorithms.<br>- Comprehensive network scheduling to resolve overseas "first mile" transmission challenges. |
| <strong>High Performance Assurance</strong> | - Supports millisecond-level delivery.<br>- Service reliability exceeds 99.99%.<br>- Guarantees quality for audio and video calls, live streaming notifications, IoT device alerts, and more. |

### Persistent Connection for Enhanced Delivery Rate
| <strong>Capability</strong> | <strong>Description</strong> |
| --- | --- |
| <strong>Extensive Reach</strong> | - Supports delivery over self-built online channels and vendor offline channels.<br>- Reaches users active in the last 30 days. |
| <strong>Real Business Value</strong> | - App push is the first touchpoint for mobile users, making it a powerful tool for improving retention.<br>- Achieve 10%-60% growth in user retention rates.<br>- Build brand recognition, foster marketing opportunities, and significantly boost user engagement and participation. |

### Multi-Region Service Deployment and Robust Data Security

Our multi-region service deployment, supported by more than 3,000 global acceleration nodes, ensures reliable Message Push performance for users. Choose from data centers located in Southeast Asia (Singapore and Jakarta, Indonesia), Northeast Asia (Seoul, South Korea and Tokyo, Japan), Europe (Frankfurt), North America (Silicon Valley), and Saudi Arabia (Riyadh), each supporting global access.

If your app targets users outside China, select the appropriate overseas data center for optimal message delivery and compliance, ensuring your data security.

## Easy Integration

No complex development is required. Activate and integrate the Push SDK to access TRTC’s online channel and major vendor offline channels in just 3 minutes, enabling full-scenario message push with minimal setup.
