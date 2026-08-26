# AtomicX Core Flutter unsupported features

This document summarizes features currently **unsupported** in `knowledge/roomkit/core-sdk/flutter/`.

## Usage policy

- If this document is retrieved, the answer should focus on **capability boundary**, not implementation steps.
- For alternatives, only reference capabilities that are already documented for Flutter.

## In-room chat / Room Chat / In-room IM Chat

**Unsupported.** Flutter Core currently has no `room-chat.md`.

- Do not reuse `MessageList`, `MessageInput`, `MessageStore`, or conversation bootstrap flow from other platforms.
- Do not treat preset `RoomMainWidget` capability as Flutter Core atomic capability.

**Alternative path**:
1. Build chat UI and message flow with Chat / IM Flutter SDK.
2. See `knowledge/chat/urls/sdk/flutter.md` for Flutter message API entries.

## Screen share / Screen Sharing

**Unsupported.** Flutter Core currently has no `screen-share.md`.

- Do not provide Flutter Core `startScreenShare`-style steps.
- Do not reuse screen-share flow from other platforms.

**Alternative path**:
1. Prefer preset room main page solution.
2. No documented Flutter Core atomic alternative currently.

## Virtual background

**Unsupported.** Flutter Core currently has no `virtual-background.md`.

- Do not output Flutter Core virtual-background initialization / resource-path / state-management steps.
- Do not reuse panel hooks from other platforms.

**Alternative path**:
1. Prefer preset UI path.
2. No Flutter Core atomic integration path currently.

## Room main view / video layout

**Unsupported.** Flutter Core currently has no `room-view.md`.

- Do not output Flutter Core `RoomView` component, layout template, or widget-slot steps.
- Do not treat `RoomMainWidget` preset page as `RoomView` atomic capability.

**Alternative path**:
1. If the goal is a full meeting page, prefer `RoomMainWidget` preset UI.
2. For atomic video-layout capability, no official Flutter Core doc currently.

## Device detection

**Unsupported.** Flutter Core currently has no `device-detection.md`.

- Do not output Flutter Core pre-join camera/mic/speaker test steps.
- Do not map test APIs from other platforms to Flutter Core.

**Alternative path**: no documented Flutter Core solution currently.

## Device state management

**Unsupported.** Flutter Core currently has no `device-state.md`.

- Do not output Flutter Core device-list switching, volume detection, mirror switching, or network panel steps.
- Do not treat device-state logic from other platforms as Flutter Core capability.

**Alternative path**: no documented Flutter Core solution currently.

## Basic beauty panel

**Unsupported.** Flutter Core currently has no `free-beauty-panel.md`.

- Do not output Flutter Core beauty-panel UI / parameter steps.
- Do not directly reuse beauty interaction from other platforms.

**Alternative path**: no documented Flutter Core solution currently.
