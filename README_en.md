# Tencent RTC MCP Server

[中文（国内站）](./README.md) | [English (Global)](./README_en.md)

MCP server that exposes Tencent RTC documentation and APIs (TRTC / IM / Call / Live / Room) to AI agents.
It helps with product Q&A, integration guidance, and troubleshooting in real projects.

## Capability Matrix (TRTC)

| Scenario | What MCP can do | Example |
| --- | --- | --- |
| Knowledge Q&A | Explain how to use Live / Room / Call components and APIs | “How to choose between UI and UI-less integration for Vue3 TUIRoomKit?” |
| Knowledge Q&A | Explain how to use Live / Room / Call UI-less SDKs | “How can a voice-room admin move to seat 0?” |
| Knowledge Q&A | Explain WebRTC SDK, plugins, and Native TRTC API capabilities | “How to use BasicBeauty in TRTC Web SDK beauty plugin?” |
| Code Integration | Detect Vue3 / Android / iOS / Flutter / uni-app and scaffold broadcast, audience, and co-host entry pages | “Help me integrate LiveKit voice room in an iOS project.” |
| Code Integration | Detect Vue3 and scaffold meeting entry, room page, route registration, and screen sharing support | “Help me integrate RoomKit video meeting in a Vue3 project.” |
| Code Integration | Detect Vue3 / React / Android / iOS / Flutter and scaffold call launch + incoming call handling pages | “Help me integrate CallKit in a Flutter project.” |
| Troubleshooting | Diagnose init failures, no-audio-on-seat issues, and error-code related problems | “On iOS AtomicXCore voice room, audience cannot hear host after joinLive. How to debug?” |

## Capability Matrix (IM/Chat)

| Scenario | What MCP can do | Example |
| --- | --- | --- |
| Knowledge Q&A | Explain UI component usage (ConversationList, MessageList, etc.) | “How can I render custom message cards in Vue3 MessageList?” |
| Knowledge Q&A | Explain UI-less SDK API usage | “How to send voice messages with Web IM SDK in H5?” |
| Knowledge Q&A | Explain SDK/server error codes and troubleshooting suggestions | “Why do I get error code 2025 when logging in with Web IM SDK?” |
| Knowledge Q&A | Explain server REST API usage (account import, server-side messaging) | “How to send custom group messages via REST API?” |
| Knowledge Q&A | Explain Webhook config and third-party callback integration | “What is the request payload format for IM callback State.StateChange?” |
| Knowledge Q&A | Explain pricing, capability limits, multi-device login, and intranet proxy | “How can Web IM SDK work with intranet proxy?” |
| Knowledge Q&A | Explain offline push integration, vendor config, and key caveats | “How to configure iOS offline push certificates?” |
| Code Integration | Detect Vue3/React context and scaffold Chat UIKit code | “Help me integrate full Chat UIKit in a Vue3 project.” |
| Code Integration | Detect Android/iOS/Flutter context and scaffold Chat UIKit code | “Help me integrate full Chat UIKit in a Flutter project.” |
| Troubleshooting | Diagnose UIKit/SDK integration issues from error messages | “Android error: Fail to create more groups. This sdkappid has reached group amount max limit.” |

## Site Strategy

- **China site (Chinese)**: for Chinese developers
- **Global site (English)**: for global developers

## Packages

- **China site (Chinese)**: [`@tencentcloud/sdk-mcp`](https://www.npmjs.com/package/@tencentcloud/sdk-mcp)
- **Global site (English)**: [`@tencent-rtc/mcp`](https://www.npmjs.com/package/@tencent-rtc/mcp)

## Documentation

- **China docs (Chinese)**: [`https://cloud.tencent.com/document/product/647/129285`](https://cloud.tencent.com/document/product/647/129285)
- **Global docs (English)**: [`https://trtc.io/document/78382`](https://trtc.io/document/78382)

## Features

- Official Tencent RTC knowledge retrieval
- Coverage across TRTC / IM / Call / Live / Room
- Intent routing for product/framework questions
- Integration-oriented guidance for Web / Android / iOS / Flutter
- MCP over stdio JSON-RPC, compatible with Cursor / Codex / Claude / CodeBuddy

## Requirements

- Node.js >= 18
- npm
- Any MCP-capable IDE

## Quick Start

### China package

```bash
npx -y @tencentcloud/sdk-mcp@latest
```

### Global package

```bash
npx -y @tencent-rtc/mcp@latest
```

## Cursor Setup Examples

### Example A: China package (`@tencentcloud/sdk-mcp`)

```json
{
  "mcpServers": {
    "tencent-rtc": {
      "command": "npx",
      "args": ["-y", "@tencentcloud/sdk-mcp@latest"],
      "env": {
        "SDKAPPID": "YOUR_SDKAPPID"
      }
    }
  }
}
```

### Example B: Global package (`@tencent-rtc/mcp`)

```json
{
  "mcpServers": {
    "tencent-rtc": {
      "command": "npx",
      "args": ["-y", "@tencent-rtc/mcp@latest"],
      "env": {
        "SDKAPPID": "YOUR_SDKAPPID"
      }
    }
  }
}
```

## Changelog

> Only recent updates are listed here. For full history, see `CHANGELOG.md`.

### Version 1.7.3 @2026.08.17

#### Added
- Added RoomKit multi-platform integration resources, recording, whiteboard, network proxy, AI noise reduction, and subtitle translation docs.
- Added best-practice docs for error codes, log levels, automatic screen-share stop, and WeChat Mini Program troubleshooting.
- Added a generic additive rerank module with anchor selection and phrase extraction for better ranking quality.

#### Changed
- Optimized BM25 index with prototype-less objects for higher stability.

#### Fixed
- Fixed BM25 prototype-key pollution issues that could cause score anomalies and NaN.

### Version 1.7.1 @2026.08.11

#### Added
- Added pre-search normalization for `product` and `frameworks` based on prompt truth.

#### Changed
- Updated `search_trtc_knowledge` output contract to return complete synthesized answers.

#### Fixed
- Fixed incorrect dual product/framework pass-through in ambiguous prompts.

### Version 1.7.0 @2026.08.02

#### Added
- Added and synchronized best-practice docs across Chat / Call / Live / Room.

#### Changed
- Refactored bilingual retrieval pipeline, including query normalization, routing, filtering, and exact-match logic.
- Improved recall/ranking for best-practice and URL-based documents.
- Improved `search_trtc_knowledge` definitions and answer constraints.

#### Fixed
- Reduced high-score false-positive retrieval in complex queries.
