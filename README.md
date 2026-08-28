## Tencent RTC SDK MCP Server Guide

This repository provides a CLI-based Model Context Protocol (MCP) Server that exposes Tencent RTC SDK documentation and API resources to LLM tools, helping AI agents deliver more accurate implementation guidance and integration support.

## Features

- **Efficient retrieval**: Supports Tencent RTC documentation retrieval for fast access to official references and best practices.
- **Broad coverage**: Covers Chat (IM), Call, Live, Room, RTCEngine (TRTC SDK), and TIMPush domains.
- **Intelligent routing**: Supports product/platform intent disambiguation and prompts for missing platform/framework information when needed.
- **Integration-friendly**: In addition to documentation Q&A, provides integration entry points for Web / Android / iOS / Flutter, including UI-based integration directions.
- **Reliable source**: Grounded in official Tencent Cloud materials to improve answer reliability and implementation readiness.
- **Wide compatibility**: Exposes MCP capabilities over STDIN/STDOUT JSON-RPC, compatible with MCP clients such as Cursor / Codex / Claude / CodeBuddy.
- **Quick start**: Run with `npx` and get started with minimal setup.

## Requirements
- Node.js (>= 18) and npm
- An MCP-capable IDE

## Usage
### Standard setup flow

- Step1: In your Cursor project, create or edit `.cursor/mcp.json` or `~/.cursor/mcp.json` and add the following configuration.

```json
{
  "mcpServers": {
    "tencent-rtc": {
      "command": "npx",
      "args": ["-y", "@tencent-rtc/mcp@latest"],
      "env": {
        "SDKAPPID": "YOUR_SDKAPPID",
        "SECRETKEY": "YOUR_SECRET_KEY"
      }
    }
  }
}
```
After saving, a prompt appears. Click **Enable** in the prompt.

![mcp-server-prompt](https://web.sdk.qcloud.com/im/assets/images/mcp-server-prompt-en.png)

- Step2: Go to **Cursor Settings** (top-right gear icon) -> **MCP**, and make sure `tencent-rtc` is enabled.

![cursor-setting](https://web.sdk.qcloud.com/im/assets/images/cursor-setting-en.png)

- Step3: Describe your requirements directly in the IDE, and let the AI complete implementation or troubleshooting based on Tencent Cloud SDK documentation.

### Optional: global install

If you want quick global invocation locally, run:

```bash
npx -y @tencent-rtc/mcp
```

## Changelog

> Only recent updates are listed here. For full history, see `CHANGELOG.md`.

## Version 1.7.3 @2026.08.17

### Added
- Added knowledge base resources for RoomKit multi-platform integration, recording, whiteboard, network proxy, AI noise reduction, and subtitle translation, expanding coverage of the Room product domain.
- Added best-practice docs covering error codes, log levels, automatic screen-share stop, and WeChat Mini Program error troubleshooting.
- Added a generic additive rerank module with anchor selection and phrase extraction, integrated into the search reranking logic to improve recall ranking accuracy.

### Changed
- Optimized the BM25 index to use prototype-less objects, improving the isolation and stability of the index structure.

### Fixed
- Fixed BM25 scoring anomalies caused by prototype-key pollution by adding prototype-key guards, preventing score pollution and NaN issues.

## Version 1.7.1 @2026.08.11

### Added
- Added pre-search normalization: normalizes `product` / `frameworks` based on prompt truth, fixing retrieval bias caused by wrong agent inference.

### Changed
- Optimized the `search_trtc_knowledge` output contract: removed brevity wording such as "1-2 sentence per subsection", replaced with complete synthesized answers.

### Fixed
- Fixed the case where mis-passed dual product / dual frameworks (e.g., "安卓 Web TRTC") were not corrected according to the prompt truth.

### Version 1.7.0 @2026.08.02

#### Added
- Added and synchronized best-practice docs across product domains including Chat / Call / Live / Room to improve knowledge coverage.

#### Changed
- Continued refactoring of the bilingual retrieval pipeline, including query normalization, intent routing, candidate filtering, and exact-match strategies.
- Improved recall and ranking for best-practice and URL-based documents to increase answer usability and stability.
- Improved `search_trtc_knowledge` definitions and answer constraints for better readability and executability.

#### Fixed
- Fixed off-topic retrieval in some complex queries, reducing high-score false-positive hits.
