TUIRoomKit has a built-in AI meeting assistant that provides intelligent AI assistance for online meetings. The meeting UI provides an AI meeting assistant entry button by default, through which users can use the following core features:
- **AI real-time captions:** During a meeting, the spoken discussion is converted into text captions in real time and displayed on the screen, assisting communication and understanding.

- **AI real-time translation:** After AI real-time captions are enabled, real-time translation is enabled synchronously by default. The room owner can set the translation language and the specific supported languages.

- **AI real-time meeting minutes:** During a meeting, the spoken discussion is continuously transcribed into text minutes, making it easy to organize and review after the meeting.

## Prerequisites

### 1. Enable the intelligent speech service

Using AI features incurs costs. For billing rules.

### 2. Basic environment integration

Refer to [Quick Integration](https://cloud.tencent.com/document/product/647/81962) to integrate `@tencentcloud/roomkit-web-vue3` into your project, and make sure the version is `≥ 5.1.2`.

## Showing or hiding the AI meeting assistant

The AI meeting assistant entry button is displayed on the meeting UI by default and can be used without any extra configuration. To hide or re-display the button, you can call the `conference.setWidgetVisible` interface to control the visibility of the `AIToolsWidget` component.

> **Note:**
> Showing the entry button does not automatically start a transcription task. The AI transcription task is started internally only after the room owner actively clicks "AI real-time captions" or "AI real-time meeting minutes".
>

``` typescript
<template>
  <ConferenceMainView />
</template>

<script setup lang="ts">
import { conference, BuiltinWidget } from '@tencentcloud/roomkit-web-vue3';

// The AI meeting assistant entry button is displayed by default; to hide it, set its visibility to false
conference.setWidgetVisible({ [BuiltinWidget.AIToolsWidget]: false });
</script>
```

## Disabling the AI meeting assistant

When using the **AI meeting assistant** component, developers do not need to manually stop the AI transcription task. The component has an automatic cleanup mechanism built in:
- **When exiting the room**: The AI transcription task is stopped automatically.

- **Resource release**: Related memory resources are cleaned up automatically.

## Development notes
- **Version dependency**: The AI meeting assistant feature requires `@tencentcloud/roomkit-web-vue3` version ≥ 5.1.2. Make sure you have installed a version that meets the requirement.

- **Call timing:** The entry button is displayed by default and requires no extra configuration. If you need to adjust the button's display state through `conference.setWidgetVisible`, make sure the code runs before `ConferenceMainView` is loaded.

- **Billing logic:** The AI transcription task is actively started by the room owner. It is billed only once per room, and ordinary members using it will not be billed repeatedly.

- **Network requirements:** AI recognition relies on a stable uplink network. Network jitter may cause captions to be delayed or lost.

## FAQs

### The "AI meeting assistant" button does not appear on the meeting UI?

**Problem description:** TUIRoomKit is integrated, but the "AI meeting assistant" button does not appear on the meeting UI.

**Solution:** The AI meeting assistant entry button is displayed by default. If it does not appear, check the following in order: 1. Whether `conference.setWidgetVisible` was called to set `AIToolsWidget` to `false`; 2. Whether the current room is a live (Webinar) room, in which case the button is not shown; 3. Whether the `@tencentcloud/roomkit-web-vue3` version meets the requirement.

### Can all members in the room use AI features?

**Feature description**: Only the room owner can start a transcription task. After the room owner clicks to start an AI transcription task, all members in the room can use AI real-time captions and meeting minutes.

### Will AI features incur duplicate billing?

**Billing description**: No duplicate billing occurs. A transcription task is started only once by the room owner, so each meeting room is billed only once. If the room owner does not start a transcription task, no transcription is started and no related cost is incurred.
