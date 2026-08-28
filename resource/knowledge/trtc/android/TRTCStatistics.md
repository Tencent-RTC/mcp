Copyright (c) 2021 Tencent. All rights reserved.

Module: TRTC audio/video metrics (read-only)

Function: the TRTC SDK reports to you the current real-time audio/video metrics (frame rate, bitrate, lag, etc.) once every two seconds

## StructType

|FuncList|DESC|
|---------|---------|
|TRTCLocalStatistics|Local audio/video metrics.|
|TRTCRemoteStatistics|Remote audio/video metrics.|
|TRTCStatistics|Network and performance metrics.|

## TRTCLocalStatistics

**Local audio/video metrics.**
| EnumType | DESC |
| --- | --- |
| audioBitrate | Field description: local audio bitrate in Kbps, i.e., how much audio data is generated per second |
| audioCaptureState | Field description:Audio equipment collection status(<br>0：Normal；1：Long silence detected；2：Broken sound detected；3：Abnormal intermittent sound detected;) |
| audioSampleRate | Field description: local audio sample rate (Hz) |
| frameRate | Field description: local video frame rate in fps, i.e., how many video frames there are per second |
| height | Field description: local video height in px |
| streamType | Field description: video stream type (HD big image \\| smooth small image \\| substream image) |
| videoBitrate | Field description: local video bitrate in Kbps, i.e., how much video data is generated per second |
| width | Field description: local video width in px |

## TRTCRemoteStatistics

**Remote audio/video metrics.**
| EnumType | DESC |
| --- | --- |
| audioBitrate | Field description: local audio bitrate (Kbps) |
| audioBlockRate | Field description: audio playback lag rate (%)<br>Audio playback lag rate (audioBlockRate) = cumulative audio playback lag duration (audioTotalBlockTime)/total audio playback duration |
| audioPacketLoss | Field description: total packet loss rate (%) of the audio stream<br><code>audioPacketLoss</code>  represents the packet loss rate eventually calculated on the audience side after the audio/video stream goes through the complete transfer linkage of "anchor -> cloud -> audience".<br>The smaller the  <code>audioPacketLoss</code> , the better. The packet loss rate of 0 indicates that all data of the audio stream has entirely reached the audience.<br>If  <code>downLoss</code>  is  <code>0</code>  but  <code>audioPacketLoss</code>  isn't, there is no packet loss on the linkage of "cloud -> audience" for the audiostream, but there are unrecoverable packet losses on the linkage of "anchor -> cloud". |
| audioSampleRate | Field description: local audio sample rate (Hz) |
| audioTotalBlockTime | Field description: cumulative audio playback lag duration (ms) |
| finalLoss | Field description: total packet loss rate (%) of the audio/video stream<br>Deprecated, please use audioPacketLoss and videoPacketLoss instead. |
| frameRate | Field description: remote video frame rate (fps) |
| height | Field description: remote video height in px |
| jitterBufferDelay | Field description: playback delay (ms)<br>In order to avoid audio/video lags caused by network jitters and network packet disorders, TRTC maintains a playback buffer on the playback side to organize the received network data packets.<br>The size of the buffer is adaptively adjusted according to the current network quality and converted to the length of time in milliseconds, i.e.,  <code>jitterBufferDelay</code> . |
| point2PointDelay | Field description: end-to-end delay (ms)<br><code>point2PointDelay</code>  represents the delay of "anchor -> cloud -> audience". To be more precise, it represents the delay of the entire linkage of "collection -> encoding -> network transfer -> receiving -> buffering -> decoding -> playback".<br><code>point2PointDelay</code>  works only if both the local and remote SDKs are on version 8.5 or above. If the remote SDK is on a version below 8.5, this value will always be 0 and thus meaningless. |
| remoteNetworkRTT | Field description: round-trip delay (ms) from the SDK to cloud<br>This value represents the total time it takes to send a network packet from the SDK to the cloud and then send a network packet back from the cloud to the SDK, i.e., the total time it takes for a network packet to go through the linkage of "SDK -> cloud -> SDK".<br>The smaller the value, the better. If  <code>remoteNetworkRTT</code>  is below 50 ms, it means a short audio/video call delay; if  <code>remoteNetworkRTT</code>  is above 200 ms, it means a long audio/video call delay.<br>It should be explained that  <code>remoteNetworkRTT</code>  represents the total time spent on the linkage of "SDK -> cloud -> SDK"; therefore, there is no need to distinguish between  <code>remoteNetworkUpRTT</code>  and  <code>remoteNetworkDownRTT</code> . |
| remoteNetworkUplinkLoss | Field description: upstream packet loss rate (%) from the SDK to cloud<br>The smaller the value, the better. If  <code>remoteNetworkUplinkLoss</code>  is  <code>0%</code> , the upstream network quality is very good, and the data packets uploaded to the cloud are basically not lost.<br>If  <code>remoteNetworkUplinkLoss</code>  is  <code>30%</code> , 30% of the audio/video data packets sent to the cloud by the SDK are lost on the transfer linkage. |
| streamType | Field description: video stream type (HD big image \\| smooth small image \\| substream image) |
| userId | Field description: user ID |
| videoBitrate | Field description: remote video bitrate (Kbps) |
| videoBlockRate | Field description: video playback lag rate (%)<br>Video playback lag rate (videoBlockRate) = cumulative video playback lag duration (videoTotalBlockTime)/total video playback duration |
| videoPacketLoss | Field description: total packet loss rate (%) of the video stream<br><code>videoPacketLoss</code>  represents the packet loss rate eventually calculated on the audience side after the audio/video stream goes through the complete transfer linkage of "anchor -> cloud -> audience".<br>The smaller the  <code>videoPacketLoss</code> , the better. The packet loss rate of 0 indicates that all data of the video stream has entirely reached the audience.<br>If  <code>downLoss</code>  is  <code>0</code>  but  <code>videoPacketLoss</code>  isn't, there is no packet loss on the linkage of "cloud -> audience" for the video stream, but there are unrecoverable packet losses on the linkage of "anchor -> cloud". |
| videoTotalBlockTime | Field description: cumulative video playback lag duration (ms) |
| width | Field description: remote video width in px |

## TRTCStatistics

**Network and performance metrics.**
| EnumType | DESC |
| --- | --- |
| appCpu | Field description: CPU utilization (%) of the current application, Android 8.0 and above systems are not supported |
| downLoss | Field description: downstream packet loss rate (%) from cloud to the SDK<br>The smaller the value, the better. If  <code>downLoss</code>  is  <code>0%</code> , the downstream network quality is very good, and the data packets received from the cloud are basically not lost.<br>If  <code>downLoss</code>  is  <code>30%</code> , 30% of the audio/video data packets sent to the SDK by the cloud are lost on the transfer linkage. |
| gatewayRtt | Field description: round-trip delay (ms) from the SDK to gateway<br>This value represents the total time it takes to send a network packet from the SDK to the gateway and then send a network packet back from the gateway to the SDK, i.e., the total time it takes for a network packet to go through the linkage of "SDK -> gateway -> SDK".<br>The smaller the value, the better. If  <code>gatewayRtt</code>  is below 50 ms, it means a short audio/video call delay; if  <code>gatewayRtt</code>  is above 200 ms, it means a long audio/video call delay.<br>It should be explained that  <code>gatewayRtt</code>  is invalid for cellular network. |
| localArray | Field description: local audio/video statistics<br>As there may be three local audio/video streams (i.e., HD big image, smooth small image, and substream image), the local audio/video statistics are an array. |
| receiveBytes | Field description: total number of received bytes (including signaling data and audio/video data) |
| remoteArray | Field description: remote audio/video statistics<br>As there may be multiple concurrent remote users, and each of them may have multiple concurrent audio/video streams (i.e., HD big image, smooth small image, and substream image), the remote audio/video statistics are an array. |
| rtt | Field description: round-trip delay (ms) from the SDK to cloud<br>This value represents the total time it takes to send a network packet from the SDK to the cloud and then send a network packet back from the cloud to the SDK, i.e., the total time it takes for a network packet to go through the linkage of "SDK -> cloud -> SDK".<br>The smaller the value, the better. If  <code>rtt</code>  is below 50 ms, it means a short audio/video call delay; if  <code>rtt</code>  is above 200 ms, it means a long audio/video call delay.<br>It should be explained that  <code>rtt</code>  represents the total time spent on the linkage of "SDK -> cloud -> SDK"; therefore, there is no need to distinguish between  <code>upRtt</code>  and  <code>downRtt</code> . |
| sendBytes | Field description: total number of sent bytes (including signaling data and audio/video data) |
| systemCpu | Field description: CPU utilization (%) of the current system, Android 8.0 and above systems are not supported |
| upLoss | Field description: upstream packet loss rate (%) from the SDK to cloud<br>The smaller the value, the better. If  <code>upLoss</code>  is  <code>0%</code> , the upstream network quality is very good, and the data packets uploaded to the cloud are basically not lost.<br>If  <code>upLoss</code>  is  <code>30%</code> , 30% of the audio/video data packets sent to the cloud by the SDK are lost on the transfer linkage. |
