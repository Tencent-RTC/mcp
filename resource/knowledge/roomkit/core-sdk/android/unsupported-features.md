# AtomicX Core Android unsupported features

This document summarizes features currently **unsupported** in `knowledge/roomkit/core-sdk/android/`.

## Usage policy

- If this document is retrieved, the answer should focus on **capability boundary**, not implementation steps.
- For alternatives, only reference capabilities that are already documented for Android.

## In-room chat / Room Chat / In-room IM Chat

**Unsupported.** Android Core currently has no `room-chat.md`.

- Do not reuse `MessageList`, `MessageInput`, `MessageStore`, or conversation bootstrap flow from other platforms.
- Do not treat preset `RoomMainView` capability as Android Core atomic capability.

**Alternative path**:
1. Build chat UI and message flow with Chat / IM Android SDK.
2. See `knowledge/chat/urls/sdk/android.md` for Android message API entries.

## Screen share / Screen Sharing

**Unsupported.** Android Core currently has no `screen-share.md`.

- Do not provide Android Core `startScreenShare`-style steps.
- Do not reuse screen-share flow from other platforms.

**Alternative path**:
1. Prefer preset room main page solution.
2. No documented Android Core atomic alternative currently.

## Virtual background

**Unsupported.** Android Core currently has no `virtual-background.md`.

- Do not output Android Core virtual-background initialization / resource-path / state-management steps.
- Do not reuse panel hooks from other platforms.

**Alternative path**:
1. Prefer preset UI path.
2. No Android Core atomic integration path currently.

## Room main view / video layout

**Unsupported.** Android Core currently has no `room-view.md`.

- Do not output Android Core `RoomView` component, layout template, or widget-slot steps.
- Do not treat `RoomMainView` preset page as `RoomView` atomic capability.

**Alternative path**:
1. If the goal is a full meeting page, prefer `RoomMainView` preset UI.
2. For atomic video-layout capability, no official Android Core doc currently.

## Device detection

**Unsupported.** Android Core currently has no `device-detection.md`.

- Do not output Android Core pre-join camera/mic/speaker test steps.
- Do not map test APIs from other platforms to Android Core.

**Alternative path**: no documented Android Core solution currently.

## Device state management

**Unsupported.** Android Core currently has no `device-state.md`.

- Do not output Android Core device-list switching, volume detection, mirror switching, or network panel steps.
- Do not treat device-state logic from other platforms as Android Core capability.

**Alternative path**: no documented Android Core solution currently.

## Basic beauty panel

**Unsupported.** Android Core currently has no `free-beauty-panel.md`.

- Do not output Android Core beauty-panel UI / parameter steps.
- Do not directly reuse beauty interaction from other platforms.

**Alternative path**: no documented Android Core solution currently.
