_English | [简体中文](README-zh_CN.md)_

# Tencent RTC MCP Server User Guide

This repository provides a Model Context Protocol (MCP) server based on the Command Line Interface (CLI). It delivers Tencent Cloud SDK documentation and API resources to Large Language Model (LLM) based tools. This enhances the ability of LLM AI agents to understand and interact with Tencent Cloud SDKs and APIs, facilitating seamless integration of Tencent Cloud services into applications.

## Features

- **MCP Server**: Provides tools for interacting with Tencent Cloud via the JSON-RPC protocol over STDIN/STDOUT.
- **Languages**: JavaScript, Java, Swift, Objective-C, Kotlin.
- **API Reference Section**: Configuration, function invocation. Access code examples, usage patterns, and detailed explanations of Tencent Cloud SDK features.
- **Tencent Cloud TUICallKit SDK Documentation Retrieval**: Retrieve official Tencent Cloud TUICallKit SDK documentation (converted from HTML to Markdown format), covering the following:

## Example Prompts

- "Develop an Android application that supports audio and video calls using TUICallKit."
- "Implement audio and video call functionality in our project by integrating TUICallKit."
- "Retrieve the API usage documentation for React TUICallKit."

## Prerequisites

- Node.js (version >= 18) and [npm](https://nodejs.org/)
- Cursor IDE with MCP support

## Installation

To run the Tencent Cloud MCP server locally or add it to Cursor IDE via npx:

```
npx -y @tencent-rtc/mcp
```

## Cursor Configuration

To use the MCP server, Cursor must be in AGENT MODE. The Cursor IDE discovers MCP servers through a JSON configuration file. You can configure the Tencent Cloud MCP server globally or per project.

### Global Configuration

Edit or create the file ~/.cursor/mcp.json:

```
{
  "mcpServers": {
    "tencent-rtc": {
      "command": "npx",
      "args": ["-y", "@tencent-rtc/mcp"],
    }
  }
}
```

### Project Configuration

In the project directory, create .cursor/mcp.json:

```
{
  "mcpServers": {
    "tencent-rtc": {
      "command": "npx",
      "args": ["-y", "@tencent-rtc/mcp"],
    }
  }
}
```