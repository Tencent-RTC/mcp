Copyright (c) 2021 Tencent. All rights reserved.

Module: beauty filter and image processing parameter configurations

Function: you can modify parameters such as beautification, filter, and green screen

## TXBeautyManager

|FuncList|DESC|
|---------|---------|
|setBeautyStyle:|Sets the beauty (skin smoothing) filter algorithm.|
|setBeautyLevel:|Sets the strength of the beauty filter.|
|setWhitenessLevel:|Sets the strength of the brightening filter.|
|enableSharpnessEnhancement:|Enables clarity enhancement.|
|setRuddyLevel:|Sets the strength of the rosy skin filter.|
|setFilter:|Sets color filter.|
|setFilterStrength:|Sets the strength of color filter.|
|setGreenScreenFile:|Sets green screen video.|
|setEyeScaleLevel:|Sets the strength of the eye enlarging filter.|
|setFaceSlimLevel:|Sets the strength of the face slimming filter.|
|setFaceVLevel:|Sets the strength of the chin slimming filter.|
|setChinLevel:|Sets the strength of the chin lengthening/shortening filter.|
|setFaceShortLevel:|Sets the strength of the face shortening filter.|
|setFaceNarrowLevel:|Sets the strength of the face narrowing filter.|
|setNoseSlimLevel:|Sets the strength of the nose slimming filter.|
|setEyeLightenLevel:|Sets the strength of the eye brightening filter.|
|setToothWhitenLevel:|Sets the strength of the teeth whitening filter.|
|setWrinkleRemoveLevel:|Sets the strength of the wrinkle removal filter.|
|setPounchRemoveLevel:|Sets the strength of the eye bag removal filter.|
|setSmileLinesRemoveLevel:|Sets the strength of the smile line removal filter.|
|setForeheadLevel:|Sets the strength of the hairline adjustment filter.|
|setEyeDistanceLevel:|Sets the strength of the eye distance adjustment filter.|
|setEyeAngleLevel:|Sets the strength of the eye corner adjustment filter.|
|setMouthShapeLevel:|Sets the strength of the mouth shape adjustment filter.|
|setNoseWingLevel:|Sets the strength of the nose wing narrowing filter.|
|setNosePositionLevel:|Sets the strength of the nose position adjustment filter.|
|setLipsThicknessLevel:|Sets the strength of the lip thickness adjustment filter.|
|setFaceBeautyLevel:|Sets the strength of the face shape adjustment filter.|
|setMotionTmpl:inDir:|Selects the AI animated effect pendant.|
|setMotionMute:|Sets whether to mute during animated effect playback.|

## EnumType

|EnumType|DESC|
|---------|---------|
|TXBeautyStyle|Beauty (skin smoothing) filter algorithm.|

## setBeautyStyle:

**Sets the beauty (skin smoothing) filter algorithm.**

TRTC has multiple built-in skin smoothing algorithms. You can select the one most suitable for your product needs:

|Param|DESC|
|---------|---------|
|beautyStyle|Beauty filter style.  `TXBeautyStyleSmooth` : smooth;  `TXBeautyStyleNature` : natural;  `TXBeautyStylePitu` : Pitu|

## setBeautyLevel:

**Sets the strength of the beauty filter.**

|Param|DESC|
|---------|---------|
|beautyLevel|Strength of the beauty filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|

## setWhitenessLevel:

**Sets the strength of the brightening filter.**

|Param|DESC|
|---------|---------|
|whitenessLevel|Strength of the brightening filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|

## enableSharpnessEnhancement:

**Enables clarity enhancement.**

## setRuddyLevel:

**Sets the strength of the rosy skin filter.**

|Param|DESC|
|---------|---------|
|ruddyLevel|Strength of the rosy skin filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|

## setFilter:

**Sets color filter.**

The color filter is a color lookup table image containing color mapping relationships. You can find several predefined filter images in the official demo we provide.

The SDK performs secondary processing on the original video image captured by the camera according to the mapping relationships in the lookup table to achieve the expected filter effect.

|Param|DESC|
|---------|---------|
|image|Color lookup table containing color mapping relationships. The image must be in PNG format.|

## setFilterStrength:

**Sets the strength of color filter.**

The larger this value, the more obvious the effect of the color filter, and the greater the color difference between the video image processed by the filter and the original video image.

The default strength is 0.5, and if it is not sufficient, it can be adjusted to a value above 0.5. The maximum value is 1.

|Param|DESC|
|---------|---------|
|strength|Value range: [0, 1]. The greater the value, the more obvious the effect. Default value: 0.5|

## setGreenScreenFile:

**Sets green screen video.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

The green screen feature enabled by this API is not capable of intelligent keying. It requires that there be a green screen behind the videoed person or object for further chroma keying.

|Param|DESC|
|---------|---------|
|path|Path of the video file in MP4 format. An empty value indicates to disable the effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setEyeScaleLevel:

**Sets the strength of the eye enlarging filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|eyeScaleLevel|Strength of the eye enlarging filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setFaceSlimLevel:

**Sets the strength of the face slimming filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|faceSlimLevel|Strength of the face slimming filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setFaceVLevel:

**Sets the strength of the chin slimming filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|faceVLevel|Strength of the chin slimming filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setChinLevel:

**Sets the strength of the chin lengthening/shortening filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|chinLevel|Strength of the chin lengthening/shortening filter. Value range: [-9, 9].  `0`  indicates to disable the filter, a value smaller than 0 indicates that the chin is shortened, and a value greater than 0 indicates that the chin is lengthened.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setFaceShortLevel:

**Sets the strength of the face shortening filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|faceShortLevel|Strength of the face shortening filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setFaceNarrowLevel:

**Sets the strength of the face narrowing filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|level|Strength of the face narrowing filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setNoseSlimLevel:

**Sets the strength of the nose slimming filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|noseSlimLevel|Strength of the nose slimming filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setEyeLightenLevel:

**Sets the strength of the eye brightening filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|eyeLightenLevel|Strength of the eye brightening filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setToothWhitenLevel:

**Sets the strength of the teeth whitening filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|toothWhitenLevel|Strength of the teeth whitening filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setWrinkleRemoveLevel:

**Sets the strength of the wrinkle removal filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|wrinkleRemoveLevel|Strength of the wrinkle removal filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setPounchRemoveLevel:

**Sets the strength of the eye bag removal filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|pounchRemoveLevel|Strength of the eye bag removal filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setSmileLinesRemoveLevel:

**Sets the strength of the smile line removal filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|smileLinesRemoveLevel|Strength of the smile line removal filter. Value range: [0, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setForeheadLevel:

**Sets the strength of the hairline adjustment filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|foreheadLevel|Strength of the hairline adjustment filter. Value range: [-9, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setEyeDistanceLevel:

**Sets the strength of the eye distance adjustment filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|eyeDistanceLevel|Strength of the eye distance adjustment filter. Value range: [-9, 9].  `0`  indicates to disable the filter, a value smaller than 0 indicates to widen, and a value greater than 0 indicates to narrow.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setEyeAngleLevel:

**Sets the strength of the eye corner adjustment filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|eyeAngleLevel|Strength of the eye corner adjustment filter. Value range: [-9, 9].  `0`  indicates to disable the filter, and  `9`  indicates the most obvious effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setMouthShapeLevel:

**Sets the strength of the mouth shape adjustment filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|mouthShapeLevel|Strength of the mouth shape adjustment filter. Value range: [-9, 9].  `0`  indicates to disable the filter, a value smaller than 0 indicates to widen, and a value greater than 0 indicates to narrow.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setNoseWingLevel:

**Sets the strength of the nose wing narrowing filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|noseWingLevel|Strength of the nose wing adjustment filter. Value range: [-9, 9].  `0`  indicates to disable the filter, a value smaller than 0 indicates to widen, and a value greater than 0 indicates to narrow.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setNosePositionLevel:

**Sets the strength of the nose position adjustment filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|nosePositionLevel|Strength of the nose position adjustment filter. Value range: [-9, 9].  `0`  indicates to disable the filter, a value smaller than 0 indicates to lift, and a value greater than 0 indicates to lower.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setLipsThicknessLevel:

**Sets the strength of the lip thickness adjustment filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|lipsThicknessLevel|Strength of the lip thickness adjustment filter. Value range: [-9, 9].  `0`  indicates to disable the filter, a value smaller than 0 indicates to thicken, and a value greater than 0 indicates to thin.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setFaceBeautyLevel:

**Sets the strength of the face shape adjustment filter.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|faceBeautyLevel|Strength of the face shape adjustment filter. Value range: [0, 9].  `0`  indicates to disable the filter, and the greater the value, the more obvious the effect.|
**Return Desc:**

0: Success; -5: feature of license not supported.

## setMotionTmpl:inDir:

**Selects the AI animated effect pendant.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect.

|Param|DESC|
|---------|---------|
|tmplDir|Directory of the animated effect material file|
|tmplName|Animated effect pendant name|

## setMotionMute:

**Sets whether to mute during animated effect playback.**

This interface is only available in the enterprise version SDK (the old version has been offline, if you need to use the advanced beauty function in the new version SDK, please refer to [Tencent Beauty Effect SDK](https://www.tencentcloud.com/document/product/1143/53942)) in effect. Some animated effects have audio effects, which can be disabled through this API when they are played back.

|Param|DESC|
|---------|---------|
|motionMute| `YES` : mute;  `NO` : unmute|

## TXBeautyStyle

**Beauty (skin smoothing) filter algorithm.**

TRTC has multiple built-in skin smoothing algorithms. You can select the one most suitable for your product needs.

|Enum|Value|DESC|
|---------|---------|---------|
|TXBeautyStyleSmooth|0|Smooth style, which uses a more radical algorithm for more obvious effect and is suitable for show live streaming.|
|TXBeautyStyleNature|1|Natural style, which retains more facial details for more natural effect and is suitable for most live streaming use cases.|
|TXBeautyStylePitu|2|Pitu style, which is provided by YouTu Lab. Its skin smoothing effect is between the smooth style and the natural style, that is, it retains more skin details than the smooth style and has a higher skin smoothing degree than the natural style.|
