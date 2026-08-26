Copyright (c) 2021 Tencent. All rights reserved.

Module: management class for background music, short audio effects, and voice effects

Description: sets background music, short audio effects, and voice effects

## ITXMusicPreloadObserver

|FuncList|DESC|
|---------|---------|
|onLoadProgress|Background music preload progress.|
|onLoadError|Background music preload error.|

## ITXMusicPlayObserver

|FuncList|DESC|
|---------|---------|
|onStart|Background music started.|
|onPlayProgress|Playback progress of background music.|
|onComplete|Background music ended.|

## ITXAudioEffectManager

|FuncList|DESC|
|---------|---------|
|enableVoiceEarMonitor|Enabling in-ear monitoring.|
|setVoiceEarMonitorVolume|Setting in-ear monitoring volume.|
|setVoiceReverbType|Setting voice reverb effects.|
|setVoiceChangerType|Setting voice changing effects.|
|setVoiceCaptureVolume|Setting speech volume.|
|setVoicePitch|Setting speech pitch.|
|setMusicObserver|Setting the background music callback.|
|startPlayMusic|Starting background music.|
|stopPlayMusic|Stopping background music.|
|pausePlayMusic|Pausing background music.|
|resumePlayMusic|Resuming background music.|
|setAllMusicVolume|Setting the local and remote playback volume of background music.|
|setMusicPublishVolume|Setting the remote playback volume of a specific music track.|
|setMusicPlayoutVolume|Setting the local playback volume of a specific music track.|
|setMusicPitch|Adjusting the pitch of background music.|
|setMusicSpeedRate|Changing the speed of background music.|
|getMusicCurrentPosInMS|Getting the playback progress (ms) of background music.|
|getMusicDurationInMS|Getting the total length (ms) of background music.|
|seekMusicToPosInTime|Setting the playback progress (ms) of background music.|
|setMusicScratchSpeedRate|Adjust the speed change effect of the scratch disc.|
|setPreloadObserver|Setting music preload callback.|
|preloadMusic|Preload background music.|
|getMusicTrackCount|Get the number of tracks of background music.|
|setMusicTrack|Specify the playback track of background music.|

## StructType

|FuncList|DESC|
|---------|---------|
|AudioMusicParam|Background music playback information.|

## EnumType

|EnumType|DESC|
|---------|---------|
|TXVoiceReverbType|Reverb effects.|
|TXVoiceChangerType|Voice changing effects.|

## onLoadProgress

**Background music preload progress.**

## onLoadError

**Background music preload error.**

|Param|DESC|
|---------|---------|
|errorCode|-4001: Failed to open the file, such as invalid data found when processing input, ffmpeg protocol not found, etc; -4002: Decoding failure, such as audio file corruption, inaccessible network audio file server, etc; -4003: The number of preloads exceeded the limit，Please call stopPlayMusic first to release the useless preload；-4005: Invalid path, Please check whether the path you passed points to a legal music file；-4006: Invalid URL, Please use a browser to check whether the URL address you passed in can download the desired music file；-4007: No audio stream, Please confirm whether the file you passed is a legal audio file and whether the file is damaged；-4008: Unsupported format, Please confirm whether the file format you passed is a supported file format. The mobile version supports [mp3, aac, m4a, wav, ogg, mp4, mkv], and the desktop version supports [mp3, aac, m4a, wav, mp4, mkv].|

## onStart

**Background music started.**

Called after the background music starts.

|Param|DESC|
|---------|---------|
|errCode|0: Start playing successfully; -4001: Failed to open the file, such as invalid data found when processing input, ffmpeg protocol not found, etc; -4005: Invalid path, Please check whether the path you passed points to a legal music file；-4006: Invalid URL, Please use a browser to check whether the URL address you passed in can download the desired music file. If the operating system is iOS or MacOS, please ensure the use of HTTPS links；-4007: No audio stream, Please confirm whether the file you passed is a legal audio file and whether the file is damaged；-4008: Unsupported format, Please confirm whether the file format you passed is a supported file format. The mobile version supports [mp3, aac, m4a, wav, ogg, mp4, mkv], and the desktop version supports [mp3, aac, m4a, wav, mp4, mkv]; -4009: The number of concurrent BGM playbacks has exceeded the limit. This error occurs when more than 10 BGMs are playing simultaneously. Please check the number of concurrent BGM playbacks.|
|id|music ID.|

## onPlayProgress

**Playback progress of background music.**

## onComplete

**Background music ended.**

Called when the background music playback ends or an error occurs.

|Param|DESC|
|---------|---------|
|errCode|0: End of play; -4002: Decoding failure, such as audio file corruption, inaccessible network audio file server, etc.|
|id|music ID.|

## enableVoiceEarMonitor

**Enabling in-ear monitoring.**

After enabling in-ear monitoring, anchors can hear in earphones their own voice captured by the mic. This is designed for singing scenarios.

In-ear monitoring cannot be enabled for Bluetooth earphones. This is because Bluetooth earphones have high latency. Please ask anchors to use wired earphones via a UI reminder.

Given that not all phones deliver excellent in-ear monitoring effects, we have blocked this feature on some phones.

|Param|DESC|
|---------|---------|
|enable| `true:`  enable;  `false` : disable|

> **Note**
> In-ear monitoring can be enabled only when earphones are used. Please remind anchors to use wired earphones.
>

## setVoiceEarMonitorVolume

**Setting in-ear monitoring volume.**

This API is used to set the volume of in-ear monitoring.

|Param|DESC|
|---------|---------|
|volume|Volume. Value range: [0, 150]; default: 100|

> **Note**
> The volume of the ear monitor is one of the most important factors affecting the user experience. Considering that different users have different sensitivities to volume, it is strongly recommended to provide a ear monitor volume adjustment slider on the UI interface. The recommended adjustment range is between 0 and 150. The gain effect of 100-150 is very helpful for some Android phones with low recording volume.
>

## setVoiceReverbType

**Setting voice reverb effects.**

This API is used to set reverb effects for human voice. For the effects supported, please see TXVoiceReverbType.

> **Note**
> Effects become invalid after room exit. If you want to use the same effect after you enter the room again, you need to set the effect again using this API.
>

## setVoiceChangerType

**Setting voice changing effects.**

This API is used to set voice changing effects. For the effects supported, please see TXVoiceChangeType.

> **Note**
> Effects become invalid after room exit. If you want to use the same effect after you enter the room again, you need to set the effect again using this API.
>

## setVoiceCaptureVolume

**Setting speech volume.**

This API is used to set the volume of speech. It is often used together with the music volume setting API setAllMusicVolume to balance between the volume of music and speech.

|Param|DESC|
|---------|---------|
|volume|Volume. Value range: [0, 150]; default: 100|

> **Note**
> If 100 is still not loud enough for you, you can set the volume to up to 150, but there may be side effects.
>

## setVoicePitch

**Setting speech pitch.**

This API is used to set the pitch of speech.

|Param|DESC|
|---------|---------|
|pitch|Ptich，Value range: [-1.0f, 1.0f]; default: 0.0f。|

## setMusicObserver

**Setting the background music callback.**

Before playing background music, please use this API to set the music callback, which can inform you of the playback progress.

|Param|DESC|
|---------|---------|
|musicId|Music ID|
|observer|For more information, please see the APIs defined in  `ITXMusicPlayObserver` .|

> **Note**
> 1. If the ID does not need to be used, the observer can be set to NULL to release it completely.
>

## startPlayMusic

**Starting background music.**

You must assign an ID to each music track so that you can start, stop, or set the volume of music tracks by ID.

|Param|DESC|
|---------|---------|
|musicParam|Music parameter|

> **Note**
> 1. If you play the same music track multiple times, please use the same ID instead of a separate ID for each playback.
>
> 2. If you want to play different music tracks at the same time, use different IDs for them.
>
> 3. If you use the same ID to play a music track different from the current one, the SDK will stop the current one before playing the new one.
>

## stopPlayMusic

**Stopping background music.**

|Param|DESC|
|---------|---------|
|id|Music ID|

## pausePlayMusic

**Pausing background music.**

|Param|DESC|
|---------|---------|
|id|Music ID|

## resumePlayMusic

**Resuming background music.**

|Param|DESC|
|---------|---------|
|id|Music ID|

## setAllMusicVolume

**Setting the local and remote playback volume of background music.**

This API is used to set the local and remote playback volume of background music.
-  Local volume: the volume of music heard by anchors

-  Remote volume: the volume of music heard by audience

|Param|DESC|
|---------|---------|
|volume|Volume. Value range: [0, 150]; default: 60|

> **Note**
> If 100 is still not loud enough for you, you can set the volume to up to 150, but there may be side effects.
>

## setMusicPublishVolume

**Setting the remote playback volume of a specific music track.**

This API is used to control the remote playback volume (the volume heard by audience) of a specific music track.

|Param|DESC|
|---------|---------|
|id|Music ID|
|volume|Volume. Value range: [0, 150]; default: 60|

> **Note**
> If 100 is still not loud enough for you, you can set the volume to up to 150, but there may be side effects.
>

## setMusicPlayoutVolume

**Setting the local playback volume of a specific music track.**

This API is used to control the local playback volume (the volume heard by anchors) of a specific music track.

|Param|DESC|
|---------|---------|
|id|Music ID|
|volume|Volume. Value range: [0, 150]. default: 60|

> **Note**
> If 100 is still not loud enough for you, you can set the volume to up to 150, but there may be side effects.
>

## setMusicPitch

**Adjusting the pitch of background music.**

|Param|DESC|
|---------|---------|
|id|Music ID|
|pitch|Pitch. Value range: floating point numbers in the range of [-1, 1]; default: 0.0f|

## setMusicSpeedRate

**Changing the speed of background music.**

|Param|DESC|
|---------|---------|
|id|Music ID|
|speedRate|Music speed. Value range: floating point numbers in the range of [0.5, 2]; default: 1.0f|

## getMusicCurrentPosInMS

**Getting the playback progress (ms) of background music.**

|Param|DESC|
|---------|---------|
|id|Music ID|
**Return Desc:**

The milliseconds that have passed since playback started. -1 indicates failure to get the the playback progress.

## getMusicDurationInMS

**Getting the total length (ms) of background music.**

|Param|DESC|
|---------|---------|
|path|Path of the music file.|
**Return Desc:**

The length of the specified music file is returned. -1 indicates failure to get the length.

## seekMusicToPosInTime

**Setting the playback progress (ms) of background music.**

|Param|DESC|
|---------|---------|
|id|Music ID|
|pts|Unit: millisecond|

> **Note**
> Do not call this API frequently as the music file may be read and written to each time the API is called, which can be time-consuming.
>
> Wait till users finish dragging the progress bar before you call this API.
>
> The progress bar controller on the UI tends to update the progress at a high frequency as users drag the progress bar. This will result in poor user experience unless you limit the frequency.
>

## setMusicScratchSpeedRate

**Adjust the speed change effect of the scratch disc.**

|Param|DESC|
|---------|---------|
|id|Music ID|
|scratchSpeedRate|Scratch disc speed, the default value is 1.0f, the range is: a floating point number between [-12.0 ~ 12.0], the positive/negative speed value indicates the direction is positive/negative, and the absolute value indicates the speed.|

> **Note**
> Precondition preloadMusic succeeds.
>

## setPreloadObserver

**Setting music preload callback.**

Before preload music, please use this API to set the preload callback, which can inform you of the preload status.

|Param|DESC|
|---------|---------|
|observer|For more information, please see the APIs defined in TXMusicPreloadObserver.|

## preloadMusic

**Preload background music.**

You must assign an ID to each music track so that you can start, stop, or set the volume of music tracks by ID.

|Param|DESC|
|---------|---------|
|musicParam|Music parameter|

> **Note**
> 1. Preload supports up to 2 preloads with different IDs at the same time, and the preload time does not exceed 10 minutes,you need to call stopPlayMusic API after use, otherwise the memory will not be released.
>
> 2. If the music corresponding to the ID is being played, the preloading fails, and stopPlayMusic must be called first.
>
> 3. When the  `musicParam`  passed to startPlayMusic is exactly the same, preloading works.
>

## getMusicTrackCount

**Get the number of tracks of background music.**

|Param|DESC|
|---------|---------|
|id|Music ID|

## setMusicTrack

**Specify the playback track of background music.**

|Param|DESC|
|---------|---------|
|id|Music ID|
|index|Specify which track to play (the first track is played by default). Value range 0, total number of tracks).|

> **Note**
> The total number of tracks can be obtained through the [getMusicTrackCount interface.
>

## TXVoiceReverbType

**Reverb effects.**

Reverb effects can be applied to human voice. Based on acoustic algorithms, they can mimic voice in different environments. The following effects are supported currently:

0: original; 1: karaoke; 2: room; 3: hall; 4: low and deep; 5: resonant; 6: metal; 7: husky; 8: ethereal; 9: studio; 10: melodious; 11: studio2;

|Enum|Value|DESC|
|---------|---------|---------|
|TXLiveVoiceReverbType_0|0|disable|
|TXLiveVoiceReverbType_1|1|KTV|
|TXLiveVoiceReverbType_2|2|small room|
|TXLiveVoiceReverbType_3|3|great hall|
|TXLiveVoiceReverbType_4|4|deep voice|
|TXLiveVoiceReverbType_5|5|loud voice|
|TXLiveVoiceReverbType_6|6|metallic sound|
|TXLiveVoiceReverbType_7|7|magnetic sound|
|TXLiveVoiceReverbType_8|8|ethereal|
|TXLiveVoiceReverbType_9|9|studio|
|TXLiveVoiceReverbType_10|10|melodious|
|TXLiveVoiceReverbType_11|11|studio2|

## TXVoiceChangeType

**Voice changing effects.**

Voice changing effects can be applied to human voice. Based on acoustic algorithms, they change the tone of voice. The following effects are supported currently:

0: original; 1: child; 2: little girl; 3: middle-aged man; 4: metal; 5: nasal; 6: foreign accent; 7: trapped beast; 8: otaku; 9: electric; 10: robot; 11: ethereal; 12: pig king; 13: hulk

|Enum|Value|DESC|
|---------|---------|---------|
|TXVoiceChangerType_0|0|disable|
|TXVoiceChangerType_1|1|naughty kid|
|TXVoiceChangerType_2|2|Lolita|
|TXVoiceChangerType_3|3|uncle|
|TXVoiceChangerType_4|4|heavy metal|
|TXVoiceChangerType_5|5|catch cold|
|TXVoiceChangerType_6|6|foreign accent|
|TXVoiceChangerType_7|7|caged animal trapped beast|
|TXVoiceChangerType_8|8|indoorsman|
|TXVoiceChangerType_9|9|strong current|
|TXVoiceChangerType_10|10|heavy machinery|
|TXVoiceChangerType_11|11|intangible|
|TXVoiceChangerType_12|12|pig king|
|TXVoiceChangerType_13|13|hulk|

## TXAudioMusicParam

**Background music playback information.**

The information, including playback ID, file path, and loop times, is passed in the startPlayMusic API.

1. If you play the same music track multiple times, please use the same ID instead of a separate ID for each playback.

2. If you want to play different music tracks at the same time, use different IDs for them.

3. If you use the same ID to play a music track different from the current one, the SDK will stop the current one before playing the new one.
| EnumType | DESC |
| --- | --- |
| endTimeMS | <code>Field description:</code>  the point in time in milliseconds for ending music playback. 0 indicates that playback continues till the end of the music track. |
| id | <code>Field description:</code>  music ID<br><strong>Note</strong><br>the SDK supports playing multiple music tracks. IDs are used to distinguish different music tracks and control their start, end, volume, etc. |
| isShortFile | <code>Field description:</code>  whether the music played is a short music track<br><code>Valid values:</code>  <code>true</code> : short music track that needs to be looped;  <code>false</code>  (default): normal-length music track |
| loopCount | <code>Field description:</code>  number of times the music track is looped<br><code>Valid values:</code> 0 or any positive integer. 0 (default) indicates that the music is played once, 1 twice, and so on. |
| path | <code>Field description:</code>  absolute path of the music file or url.the mp3,aac,m4a,wav supported. |
| publish | <code>Field description:</code>  whether to send the music to remote users<br><code>Valid values:</code>  <code>true</code> : remote users can hear the music played locally;  <code>false</code>  (default): only the local user can hear the music. |
| startTimeMS | <code>Field description:</code>  the point in time in milliseconds for starting music playback |
