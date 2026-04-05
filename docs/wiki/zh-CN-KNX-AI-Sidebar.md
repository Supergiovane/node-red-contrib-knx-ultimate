---
layout: wiki
title: "KNX-AI-Sidebar"
lang: zh-CN
permalink: /wiki/zh-CN-KNX-AI-Sidebar
---
**KNX AI 仪表板**可以让你用更简单的方式查看 KNX 系统状态。
你可以快速看到系统是否正常、哪里异常、如何测试，以及直接向 AI 提问。
本页保留历史名称 `KNX-AI-Sidebar`，用于兼容旧链接。

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## 你可以做什么

- 一眼查看系统状态。
- 找出最活跃的组地址。
- 在 AI 帮助下创建和管理区域。
- 执行引导式测试并查看清晰结果。
- 直接问助手“哪里有问题？”。

## 快速开始

1. 在 KNX AI 节点编辑器中点击 **Open Web Page**。
2. 在列表中选择你的 KNX AI 节点。
3. 需要时点击 **Refresh**。

## 主要页面（简单说明）

- **Overview**：实时摘要与活动。
- **Areas**：房间/区域及对应组地址。
- **Tests**：准备并执行检测。
- **Test Results**：pass/warn/fail 历史。
- **Ask**：用自然语言提问。
- **Settings**：节点选择与导入/导出。

## 推荐使用流程（首次）

1. 先看 **Overview**，确认系统是否稳定。
2. 打开 **Areas**，检查房间/区域是否合理。
3. 如有需要，使用 **Regenerate AI Areas** 重新生成建议。
4. 在 **Tests** 执行一次测试，再查看 **Test Results**。
5. 在 **Ask** 用一句话描述问题，并按建议逐步排查。

## 常用按钮

- **Refresh**：立即更新数据。
- **Regenerate AI Areas**：根据 ETS 地址重新生成 AI 区域建议。
- **Delete AI Areas**：一次删除所有 AI 生成区域。
- **New Area**：手动新建一个区域。

## AI 工作中会发生什么

当系统正在批量生成或删除区域时，会出现居中的等待层。
这是正常行为：页面会临时禁止点击，避免误操作和冲突。

## 要求

- 至少有一个已配置的 KNX AI 节点。
- 网关已连接并正常运行。
- 如需聊天回答：在 KNX AI 节点中启用 LLM，并配置 API key。
