## 腾讯云 SDK MCP Server

[中文（国内站）](./README.md) | [English (Global)](./README_en.md)

腾讯云 SDK MCP Server 通过 MCP（Model Context Protocol）向 AI 助手提供官方文档检索、套餐选型与代码集成能力，帮助你更快完成腾讯云实时音视频相关开发与选型（Chat/Call/Live/Room/RTCEngine/TIMPush/IoT）。

## 功能概览

- **官方资料检索**：快速定位产品文档、集成指引与最佳实践。
- **套餐选型与购买**：按场景、能力需求与预算推荐套餐，输出价格、底座依赖与购买入口。
- **智能分流**：按产品、平台、框架进行语义路由，降低检索噪声。
- **代码集成能力**：支持 Web / Android / iOS / Flutter 等主流端侧集成入口。
- **MCP 兼容**：可接入 Cursor、CodeBuddy、Codex、Claude 等 MCP 客户端。

## 环境要求

- Node.js >= 18
- npm
- 任一支持 MCP 的 IDE / AI 客户端

## 30 秒快速开始（免控制台创建应用试用）

### 1) 配置 MCP Server（试用模式）

以 Cursor 为例，在项目 `.cursor/mcp.json`（或 `~/.cursor/mcp.json`）中添加：

```json
{
  "mcpServers": {
    "tencentcloud-sdk-mcp": {
      "command": "npx",
      "args": ["-y", "@tencentcloud/sdk-mcp@latest"],
      "env": {
        "SDKAPPID": "",
        "SECRETKEY": ""
      }
    }
  }
}
```

### 2) 确认服务已连接

在 MCP 面板确认 `tencentcloud-sdk-mcp` 状态为 **Connected**。

### 3) 用前缀显式激活工具

建议在问题前加 `@tencentcloud-sdk-mcp`，提升工具命中率与回答稳定性。

示例：

```text
@tencentcloud-sdk-mcp H5 集成 Web IM SDK 怎么发送语音消息？
```

## 完整配置（需要在控制台创建应用）

```json
{
  "mcpServers": {
    "tencentcloud-sdk-mcp": {
      "command": "npx",
      "args": ["-y", "@tencentcloud/sdk-mcp@latest"],
      "env": {
        "SDKAPPID": "YOUR_SDKAPPID",
        "SECRETKEY": "YOUR_SECRET_KEY"
      }
    }
  }
}
```

控制台入口：
- 即时通信 IM 控制台：`https://console.cloud.tencent.com/im`
- 音视频 TRTC 控制台：`https://console.cloud.tencent.com/trtc`

## 接入准备说明

- **无账号/未创建应用也可先试用**：可先体验文档检索与知识咨询能力。
- `SDKAPPID`：你的 IM/TRTC 应用 ID（控制台获取）。
- `SECRETKEY`：用于测试生成 `userSig`。
- **生产环境要求**：`userSig` 必须由服务端签发，不建议长期使用本地测试签发方式。

## 常见问题

- **连接失败/工具未激活**：检查 MCP 配置是否生效，确认服务状态为 Connected。
- **`npx` 异常**：可清理 `npx` 缓存后重试：`rm -rf ~/.npm/_npx && npm cache verify`。
- **`userSig` 无效**：重新调用 `get_usersig` 生成。

## 更新记录

> 仅展示最近更新，完整历史请查看 `CHANGELOG.md`。

## Version 1.9.0 @2026.11.10

### 新增
- 新增套餐/计费结构化查询：基于确定性套餐知识矩阵，对套餐选型、版本价格、能力清单、计费规则、组件共存等问题直接返回结构化答案（精确价格 + 能力 + 版本限制 + 官方购买/开通链接），替代"检索文档 + 大模型抠数字"。基于 700+ 的真实工单问题测试：召回率 97.2%、精确价格命中率 86.2%。
- 支持 CallKit/LiveKit/RoomKit 组件与 TRTC/Chat 底座的套餐选型（场景 + 能力 + 预算）、版本点查、计费规则 FAQ、组件共存约束查询。
