---
sync_node_id: '161596927219888128'
nav_path:
  - "直播与语聊 SDK"
  - "Live 视频直播计费说明"
product: "live"
---
The Live video streaming solution supports millions of concurrent viewers and is suitable for large-scale single-room scenarios, such as e-commerce live streaming and entertainment streaming. 

The Live (Tencent RTC Live) video streaming component is available only after subscribing to the Live Monthly Package.This document outlines the duration-based billing rules and pricing for the Live video streaming component.

> **Note：**
> The billing rules described in this document apply only to customers using the Video Streaming Component. If the video streaming component is not used, the corresponding usage will still be billed in accordance with the Billing of Audio and Video Duration.
> 

### **Billing Formula**

#### **Single Anchor**

Video Live duration fee (single anchor) = Anchor duration fee + Audience duration fee
- Anchor duration fee = Live duration × Unit price of anchor audio duration

- Audience duration fee = Viewing duration × Unit price of the corresponding audience audio and video category

#### Multiple Anchors

Video Live duration fee (multiple anchors) = Anchor duration fee + Audience duration fee + Transcoding duration fee
- Anchor duration fee = Audio duration × Unit price of anchor audio duration + Video durations of different categories × Unit price of the corresponding anchor video category

- Audience duration fee = Viewing duration × Unit price of the corresponding audience audio and video category

- Transcoding duration fee = Audio transcoding fee + Video transcoding fee = Anchor audio input duration × Audio transcoding unit price + Anchor video input duration × Video transcoding unit price (determined by the aggregate resolution of input streams and encoding method for the output stream).

### **Pricing**

#### **Unit Price of Anchor Duration**

|Category|Unit Price (USD/1,000 Min)|Aggregate Resolution of User-subscribed Videos|
|---------|---------|---------|
|Audio|0.99|-|
|HD|3.99|Resolution ≤ 921,600 (1280 x 720)|
|FHD|8.99|921,600 (1280 x 720) < Resolution ≤ 2,073,600 (1920 x 1080)|
|Video 2K|15.99|2,073,600 (1920 x 1080) < Resolution ≤ 3,686,400 (2560 x 1440)|
|Video 4K|35.99|3,686,400 (2560 x 1440) < Resolution ≤ 8,847,360 (4096 x 2160)|

#### **Unit Price of Audience Duration**

|Category|Unit Price (USD/1,000 Min)|Aggregate Resolution of User-subscribed Videos|
|---------|---------|---------|
|Audio|0.5|-|
|HD|2.00|Resolution ≤ 921,600 (1280 x 720)|
|Full HD|4.50|921,600 (1280 x 720) < Resolution ≤ 2,073,600 (1920 x 1080)|
|Video 2K|8.00|2,073,600 (1920 x 1080) < Resolution ≤ 3,686,400 (2560 x 1440)|
|Video 4K|18.00|3,686,400 (2560 x 1440) < Resolution ≤ 8,847,360 (4096 x 2160)|

#### **Unit Price of Transcoding Duration (Not Billed for a Single Anchor and Only Billed for Multiple Anchors)**

No transcoding duration is billed in the single-anchor scenarios. Only when the number of anchors is greater than 1, the multi-anchor images will be subject to the On-Cloud MixTranscoding, thus generating transcoding duration fees.

Transcoding duration fee = Audio transcoding fee + Video transcoding fee = Anchor audio input duration × Audio transcoding unit price + Anchor video input duration × Video transcoding unit price (determined by the aggregate resolution of input streams and encoding method for the output stream).

|Codec|Billable Item|Unit Price (USD/1,000 Min)|
|---------|---------|---------|
|Audio transcoding|Transcoding - voice|1.99|
|H.264|Transcoding - H264 - HD|5.99|
|H.264|Transcoding - H264 - FHD|13.99|
|H.264|Transcoding - H264 - 2K|25.99|
|H.264|Transcoding - H264 - 4K|69.99|
|H.265|Transcoding - H265 - HD|17.99|
|H.265|Transcoding - H265 - FHD|37.99|
|H.265|Transcoding - H265 - 2K|69.99|
|H.265|Transcoding - H265 - 4K|189.99|

### Usage Statistics

#### Statistics of Anchor Duration and Audience Duration Usage

In the Video Live component, in the single-anchor scenarios, the anchor does not subscribe to audio and video streams, while the audience subscribes to the anchor's single audio and video stream. In the multiple-anchor scenarios, each anchor subscribes to all other anchors' audio and video streams in the live room, and the audience subscribes to the single audio and video stream output of the anchor after MixTranscoding. Anchor usage is counted according to anchor duration usage (including anchors going live and audience with mic on), and audience usage is counted according to audience duration usage. For details on statistics of anchor and audience duration usage, see [Statistics of Audio and Video Duration Usage](https://trtc.io/document/42734).

#### Statistics of Transcoding Duration Usage

During the use of the Video Live component, in case of multiple anchors, an on-cloud stream mixing task will be initiated by default to mix multiple anchor streams into one stream. Then all audience will only subscribe to this stream. The transcoding duration will be generated in this process. When you initiate a transcoding task to output multi-resolution videos, the transcoding duration will also be generated. For details on statistics of transcoding duration usage, see [Statistics of Transcoding Duration Usage](https://trtc.io/document/47631).

> **Note:**
> TRTC calculates the usage of transcoding services based on the **audio and video stream duration** input through MCU MixTranscoding of all applications under the same Tencent Cloud account. If you have multiple applications using Live or other products that generate Billing of On-Cloud MixTranscoding usage, the billing will be consolidated.
> 

### **Billing Instructions**
- Billing mode: Daily pay-as-you-go.

- Billing cycle: Billing occurs on a daily basis. The anchor duration fee, audience duration fee, and transcoding fee incurred each day will be deducted the following day at the time of billing. For the billing details and actual billing time, see [Billing Statement](https://console.tencentcloud.com/expense/bill/overview).

- After the Live Monthly Package is purchased, the audio and video duration usage given in the package can be used to deduct the anchor duration and audience duration usage generated by real-time interactive live streaming, and **transcoding duration usage cannot be deducted**. When service usage has no package to deduct or exceeds the remaining amount of the package, the pay-as-you-go mode will be adopted.

- When the audio and video duration given in the monthly package is used for deduction, the anchor duration of voice, HD, FHD, 2K, and 4K Video Live will be deducted at the ratio of **1 : 4 : 9 : 16 : 36** respectively, and the audience duration of voice, HD, FHD, 2K, and 4K Video Live will be deducted at the ratio of **0.5 : 2 : 4.5 : 8 : 18** respectively. For example, for 1 minute of anchor HD video duration, 4 minutes will be deducted from the package.

- If you initiate a transcoding task to output videos of different resolutions, the transcoding duration will also be billed according to this document.

### Billing Examples

#### Example 1: Single-anchor Scenarios

Anchor A conducts Video Live with a resolution of 1920 × 1080, lasting for 30 minutes; there are 100 audience throughout the process. The fee calculation during this period is as follows:

**Anchor duration fee**

Anchor duration fee = Live duration × Unit price of audio duration = 30 (minutes) × 0.99 (USD/1,000 minutes) = (30/1,000) × 0.99 USD = 0.0297 USD

**Audience duration fee**

The audio and video viewed by audience have a resolution of 1920 × 1080, with an aggregate resolution of 2,073,600, which belongs to the FHD category for audience, with a unit price of 4.495 USD/1,000 minutes.

Audience duration fee = Viewing duration × Unit price of the viewed audio and video category = 30 (minutes) × 100 (persons) × 4.495 (USD/1,000 minutes) = (30 × 100)/1,000 × 4.495 USD = 13.485 USD

**Total fee**

Total fee = Anchor duration fee + Audience duration fee = 0.0297 + 13.485 = 13.51 USD (rounded to two decimal places).

#### Example 2: Multi-anchor Scenarios

Anchor A conducts Video Live, with a resolution of 1920 × 1080. During the Video Live, audience B enters the live room and successfully applies for mic connection. B connects via video mic connection with a resolution of 1280 × 720. C connects via audio mic connection without enabling video. The mic-connected live streaming lasts for 60 minutes. There are always 1,000 audience viewing the live stream with the resolution of the video of 1280 × 720. The fee calculation during this period is as follows:

##### **Anchor Duration Fee**

In the Video Live scenario, the anchor going live, the audience who successfully connects via mic, and the users participating in PK are all defined as anchors. Hence, audience B and audience C who connect via mic are both anchors, referred to as Anchor B and Anchor C respectively.

|Anchor|Subscriber|Aggregate Video Resolution|Aggregate Video Resolution Category|Duration (Minutes)|
|---------|---------|---------|---------|---------|
|Anchor A|Video stream of Anchor B + audio stream of Anchor C|1280 × 720 = 921,600|HD|60|
|Anchor B|Video stream of Anchor A + audio stream of Anchor C|1920 × 1080 = 2,073,600|FHD|60|
|Anchor C|Video stream of Anchor A + video stream of Anchor B|1920 × 1080 + 1280 × 720 = 2,995,200|Video 2K|60|

The fee calculation of the above scenario is based on the formula: **Audio and video duration fee** = **Audio duration** × **Unit price of audio duration** + **Video durations of different categories** × **Unit price of the corresponding category**.
| Billable Item | Total Duration (Minutes) | Unit Price (USD/1,000 Min) | Fee by Category (USD) | Anchor Duration Fee (USD) |
| --- | --- | --- | --- | --- |
| HD | 60 × 1 = 60 | 3.99 | (60/1,000) × 3.99 = 0.2394 | 1.7382 |
| Full HD | 60 × 1 = 60 | 8.99 | (60/1,000) × 8.99 = 0.5394 |  |
| Video 2K | 60 × 1 = 60 | 15.99 | (60/1,000) × 15.99 = 0.9594 |  |

##### **Audience Duration Fee**

The audience fee is calculated based on the formula: **Audience duration fee = Viewing duration × Unit price of the viewed audio and video category.**

|Audience Viewing Resolution|Resolution Category|Unit Price (USD/1,000 Min)|Total Duration (Minutes)|Audience Duration Fee (USD)|
|---------|---------|---------|---------|---------|
|1280 × 720 = 921,600|HD|2.00|60 x 1,000 = 60000|60000 x 2.00/1,000 = 120.00|

##### **Transcoding Duration Fee**

The default codec for transcoding is H.264.

|Input Stream|Input Resolution|Input Video Resolution Category|Unit Price (USD/1,000 Min)|Duration (Minutes)|
|---------|---------|---------|---------|---------|
|Video stream of Anchor A + Video stream of Anchor B + Audio stream of Anchor C|1920 × 1080 + 1280 × 720 = 2,995,200|Transcoding - H264 - 2K|25.99|60|

Transcoding duration fee = Audio transcoding fee + Video transcoding fee = Anchor audio input duration × Audio transcoding unit price + Anchor video input duration × Video transcoding unit price (determined by the aggregate resolution of input streams and encoding method for the output stream) = 0 + 25.99 × 60/1,000 = 1.5594 USD

##### Total Fee

Video Live duration fee (multiple anchors) = Anchor duration fee + Audience duration fee + Transcoding duration fee = 1.7382 + 120.00 + 1.5594 = 123.30 USD (rounded to two decimal places)
