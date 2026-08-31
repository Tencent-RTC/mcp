# Tencent RTC MCP Server

[中文（国内站）](./README.md) | [English (Global)](./README_en.md)

这是一个将腾讯 RTC（TRTC / IM / Call / Live / Room）文档与 API 能力开放给 AI Agent 的 MCP 服务。
可用于知识问答、集成指导和问题排查，帮助开发者更快完成接入。

## 能力清单（实时音视频 TRTC）

| 能力场景 | 能力说明 | 示例 |
| --- | --- | --- |
| 知识咨询 | 查询 Live / Room / Call 组件与 API 的使用方式 | “Vue3 TUIRoomKit 无 UI 和含 UI 方案怎么选？” |
| 知识咨询 | 查询 Live / Room / Call 无 UI SDK 的使用方式 | “语聊房管理员怎么上麦到 0 号麦位？” |
| 知识咨询 | 查询 WebRTC SDK、插件与 Native TRTC API 的能力 | “TRTC Web SDK 美颜插件 BasicBeauty 的使用方法？” |
| 代码集成 | 根据上下文识别 Vue3 / Android / iOS / Flutter / uni-app，生成开播页、观看页、连麦入口 | “帮我在 iOS 项目里集成 LiveKit 语聊房” |
| 代码集成 | 根据上下文识别 Vue3，生成会议入口页、会议房间页、路由注册，并支持屏幕共享 | “帮我在 Vue3 项目集成视频会议 RoomKit” |
| 代码集成 | 根据上下文识别 Vue3 / React / Android / iOS / Flutter，生成发起通话与来电处理页面 | “帮我在 Flutter 项目集成音视频通话 CallKit 组件” |
| 错误排查 | 诊断初始化失败、麦上用户无声、错误码等常见问题 | “iOS AtomicXCore 语聊房观众 joinLive 后听不到主播声音，怎么排查？” |

## 能力清单（即时通信 IM/Chat）

| 能力场景 | 能力说明 | 示例 |
| --- | --- | --- |
| 知识咨询 | 查询 UI 组件（ConversationList、MessageList 等）用法 | “Vue3 MessageList 组件如何渲染自定义消息卡片？” |
| 知识咨询 | 查询无 UI SDK API 用法 | “H5 集成 Web IM SDK 怎么发送语音消息？” |
| 知识咨询 | 查询 SDK 和服务端错误码含义与处理建议 | “Web IM SDK 登录时为什么会 2025 错误码？” |
| 知识咨询 | 查询服务端 REST API（导入账号、服务端发消息等）用法 | “REST API 怎么在群组中发送自定义消息？” |
| 知识咨询 | 查询 Webhook 配置与第三方回调对接方式 | “IM 回调 State.StateChange 状态变更回调的请求体字段格式是什么？” |
| 知识咨询 | 查询套餐价格、能力限制、多端登录配置与内网代理 | “Web IM SDK 怎么实现内网代理？” |
| 知识咨询 | 查询离线推送 Push 接入、厂商配置与注意事项 | “iOS 离线推送证书怎么配置？” |
| 代码集成 | 根据上下文识别 Vue3 / React 并生成 Chat UIKit 代码 | “帮我在 Vue3 项目中集成 Chat UIKit 完整功能。” |
| 代码集成 | 根据上下文识别 Android / iOS / Flutter 并生成 Chat UIKit 代码 | “帮我在 Flutter 项目接入完整 Chat UIKit 功能。” |
| 错误排查 | 结合报错诊断 UIKit 或 SDK 集成问题 | “安卓 App 报错：Fail to create more groups. This sdkappid has reached group amount max limit.” |

## 站点策略

- **国内站（中文）**：面向中文开发者
- **海外站（英文）**：面向国际开发者

## 包名映射

- **国内站（中文）**：[`@tencentcloud/sdk-mcp`](https://www.npmjs.com/package/@tencentcloud/sdk-mcp)
- **海外站（英文）**：[`@tencent-rtc/mcp`](https://www.npmjs.com/package/@tencent-rtc/mcp)

## 文档入口

- **国内站（中文）**：[`https://cloud.tencent.com/document/product/647/129285`](https://cloud.tencent.com/document/product/647/129285)
- **海外站（英文）**：[`https://trtc.io/document/78382`](https://trtc.io/document/78382)

## 能力概览

- 官方知识检索与回答
- 覆盖 TRTC / IM / Call / Live / Room
- 支持产品与平台意图路由
- 面向 Web / Android / iOS / Flutter 的集成指导
- 基于 stdio JSON-RPC，兼容 Cursor / Codex / Claude / CodeBuddy

## 环境要求

- Node.js >= 18
- npm
- 支持 MCP 的 IDE

## 快速开始

### 国内站包

```bash
npx -y @tencentcloud/sdk-mcp@latest
```

### 海外站包

```bash
npx -y @tencent-rtc/mcp@latest
```

## Cursor 配置示例

### 示例 A：国内站包（`@tencentcloud/sdk-mcp`）

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

### 示例 B：海外站包（`@tencent-rtc/mcp`）

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

## 版本更新

> 这里只保留最近版本，完整历史请查看 `CHANGELOG.md`。

## Version 1.7.4 @2026.08.31

### 新增
- 新增 CallKit Flutter 最佳实践文档 4 篇：Android 后台通话保活、iOS 后台音频保活、iOS 启动崩溃排查、后台来电无通知排查。
- 新增 CallKit Android 视频交友场景（VideoChat Demo）最佳实践文档，覆盖 Demo 跑通与组件快速集成。
- 新增 CallKit HarmonyOS 平台支持：含 UI 集成指南与 API 参考文档。
- 新增 CallKit 小程序 & uni-app 集成文档：含 UI 集成指南、API 参考、uni-app 打包指南。
- 新增 CallKit uni-app（Android/iOS）独立集成文档与 API 参考。
- 新增 Chat Vue3/React H5 移动端集成文档。

### 变更
- 优化 Chat 含 UI 检索标签：vue/react 的 framework 从单标签改为双标签（`['vue','web']` / `['react','web']`），使 `frameworks=['web']` 也能命中 Chat Web 端文档。

### Version 1.7.3 @2026.08.17

#### Added
- 新增 RoomKit 多端集成、录制、白板、网络代理、AI 降噪、字幕翻译等文档。
- 新增错误码、日志级别、自动停屏共享、小程序排障等最佳实践文档。
- 新增加性 rerank 模块（锚点选择与短语提取），提升检索排序准确率。

#### Changed
- BM25 索引改为无原型对象，提升稳定性。

#### Fixed
- 修复原型键污染导致的 BM25 评分异常与 NaN 问题。

### Version 1.7.1 @2026.08.11

#### Added
- 新增检索前 `product` / `frameworks` 真值归一化。

#### Changed
- 优化 `search_trtc_knowledge` 输出契约，返回完整综合答案。

#### Fixed
- 修复双产品/双平台误传在歧义问题中的纠偏缺失。
