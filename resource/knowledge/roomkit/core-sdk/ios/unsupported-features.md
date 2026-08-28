# AtomicX Core iOS unsupported features

This document summarizes features currently **unsupported** in `knowledge/roomkit/core-sdk/ios/`.

## Usage policy

- If this document is retrieved, the answer should focus on **capability boundary**, not implementation steps.
- For alternatives, only reference capabilities that are already documented for iOS.

## In-room chat / Room Chat / In-room IM Chat

**Unsupported.** iOS Core currently has no `room-chat.md`.

- Do not reuse `MessageList`, `MessageInput`, `MessageStore`, or conversation bootstrap flow from other platforms.
- Do not treat preset `RoomMainView` capability as iOS Core atomic capability.

**Alternative path**:
1. Build chat UI and message flow with Chat / IM iOS SDK.
2. See `knowledge/chat/urls/sdk/ios.md` for iOS message API entries.

## Screen share / Screen Sharing

**Unsupported.** iOS Core currently has no `screen-share.md`.

- Do not provide iOS Core `startScreenShare`-style steps.
- Do not reuse screen-share flow from other platforms.

**Alternative path**:
1. Prefer preset room main page solution.
2. No documented iOS Core atomic alternative currently.

## Virtual background

**Unsupported.** iOS Core currently has no `virtual-background.md`.

- Do not output iOS Core virtual-background initialization / resource-path / state-management steps.
- Do not reuse panel hooks from other platforms.

**Alternative path**:
1. Prefer preset UI path.
2. No iOS Core atomic integration path currently.

## Room main view / video layout

**Unsupported.** iOS Core currently has no `room-view.md`.

- Do not output iOS Core `RoomView` component, layout template, or widget-slot steps.
- Do not treat `RoomMainView` preset page as `RoomView` atomic capability.

**Alternative path**:
1. If the goal is a full meeting page, prefer `RoomMainView` preset UI.
2. For atomic video-layout capability, no official iOS Core doc currently.

## Device detection

**Unsupported.** iOS Core currently has no `device-detection.md`.

- Do not output iOS Core pre-join camera/mic/speaker test steps.
- Do not map test APIs from other platforms to iOS Core.

**Alternative path**: no documented iOS Core solution currently.

## Device state management

**Unsupported.** iOS Core currently has no `device-state.md`.

- Do not output iOS Core device-list switching, volume detection, mirror switching, or network panel steps.
- Do not treat device-state logic from other platforms as iOS Core capability.

**Alternative path**: no documented iOS Core solution currently.

## Basic beauty panel

**Unsupported.** iOS Core currently has no `free-beauty-panel.md`.

- Do not output iOS Core beauty-panel UI / parameter steps.
- Do not directly reuse beauty interaction from other platforms.

**Alternative path**: no documented iOS Core solution currently.
