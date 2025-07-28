_[English](README.md) | 简体中文_
# Tencent RTC MCP Server 使用说明

本仓库提供了一个基于命令行界面（CLI）的模型上下文协议（MCP）服务器，它能够将腾讯云软件开发工具包（SDK）文档和腾讯云 API 资源提供给基于大语言模型（LLM）的工具。这增强了 LLM 人工智能代理理解和与腾讯云 SDK 及 API 交互的能力，有助于将腾讯云服务无缝集成到应用程序中。



## 功能特性

- **MCP 服务器**：通过标准输入 / 输出（STDIN/STDOUT）上的 JSON-RPC 协议，提供与腾讯云交互的工具。
- **语言**：JavaScript、Java、Swift、Objective-C、Kotlin。
- **API 参考部分**：配置、调用函数。可借此获取代码示例、使用模式以及腾讯云 SDK 特性的详细说明。
- **腾讯云 TUICallKit SDK 文档获取**：可检索官方腾讯云 TUICallKit SDK 文档（从 HTML 转换为 Markdown 格式），涵盖以下内容：



## 示例提示词

- “使用 TUICallKit 编写一个支持音视频通话的 Android 应用程序。”
- “在我们的工程中，通过接入 TUICallKit 实现音视频通话功能”
- “获取 React TUICallKit 的 API 使用文档。”



## 先决条件

- Node.js（版本 >= 18）和 [npm](https://nodejs.org/)

- 支持 MCP 的 Cursor IDE

  

## 安装

在本地运行腾讯云 MCP 服务器或通过 npx 将其添加到 Cursor IDE 的推荐方式：
- 如果您的应用在腾讯云中国站，可以使用如下方案：

  ```
  npx -y @tencentcloud/sdk-mcp

  ```
- 如果您的应用在腾讯云国际站，可以使用如下方案：

  ```
  npx -y @tencent-rtc/mcp
  ```


## Cursor 配置

要使用 MCP 服务器，Cursor 必须处于代理模式（AGENT MODE），Cursor IDE 通过 JSON 配置文件发现 MCP 服务器。可全局或按项目配置腾讯云 MCP 服务器。

### 全局配置

编辑或创建~/.cursor/mcp.json文件：

- 如果您的应用在腾讯云中国站，可以使用如下方案：

```
{
  "mcpServers": {
​    "tencent-rtc": {
​      "command": "npx",
​      "args": ["-y", "@tencentcloud/sdk-mcp"],
​    }
  }
}
```
- 如果您的应用在腾讯云国际站，可以使用如下方案：

```
{
  "mcpServers": {
​    "tencent-rtc": {
​      "command": "npx",
​      "args": ["-y", "@tencent-rtc/mcp"],
​    }
  }
}
```


#### 项目配置

在项目目录中，创建.cursor/mcp.json文件：

- 如果您的应用在腾讯云中国站，可以使用如下方案：

```
{
  "mcpServers": {
​    "tencent-rtc": {
​      "command": "npx",
​      "args": ["-y", "@tencentcloud/sdk-mcp"],
​    }
  }
}
```
- 如果您的应用在腾讯云国际站，可以使用如下方案：

```
{
  "mcpServers": {
​    "tencent-rtc": {
​      "command": "npx",
​      "args": ["-y", "@tencent-rtc/mcp"],
​    }
  }
}
```
