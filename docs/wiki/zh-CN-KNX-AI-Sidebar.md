---
layout: wiki
title: "KNX-AI-Sidebar"
lang: zh-CN
permalink: /wiki/zh-CN-KNX-AI-Sidebar
---
侧边栏标签页 **KNX AI** 用于实时查看你的 **KNX AI 节点**：摘要、异常，以及用于提问的聊天区域（Markdown 渲染）。

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## 用途

- 查看所选 `knxUltimateAI` 节点输出的摘要。
- 查看检测到的异常。
- 在聊天中提问（答案以 Markdown 渲染）。

## 要求

- 流程中至少有一个 `knxUltimateAI` 节点。
- 所选 `knxUltimateAI` 必须绑定 `knxUltimate-config` 网关。
- 如需 LLM 回答：在 `knxUltimateAI` 节点里启用 LLM，并在该节点中配置 API key。

## 由谁提供

该标签页由 Node-RED 插件提供：

- `package.json` → `node-red.plugins.knxUltimateAISidebar`
- 文件：`nodes/plugins/knxUltimateAI-sidebar-plugin.html`

