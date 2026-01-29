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
- 在聊天中提问（答案以 Markdown 渲染），加速定位问题。

## 如何使用

1. 在下拉框中选择一个 `knxUltimateAI` 节点。
2. 点击 **Refresh Summary**（或开启 **Auto**）刷新摘要。
3. 在聊天中提问“原因是什么”以及“下一步该检查哪里”。

## 更多上下文（更好的回答）

在所选 `knxUltimateAI` 节点中，你可以在 LLM prompt 里加入更多上下文：

- **Flow 清单：** 让 AI “看到”你的 Node-RED flows 里有哪些 KNX Ultimate 节点（以及网关），从而把电报与逻辑关联起来。
- **文档片段：** 从内置 help/README/示例（以及在存在时的 `docs/wiki`）加入相关片段，帮助 AI 更准确解释节点行为并给出配置建议。

## 使用示例（场景）

- **环路/重复电报：** 询问可能原因，并如何隔离来源。
- **某 GA 很吵：** 询问为什么该 GA 最活跃，以及哪些源地址在写入。
- **部署后行为异常：** 询问最近几分钟发生了什么变化、出现了哪些模式。
- **网关间路由问题：** 询问如何过滤/重写以避免风暴或反馈环路。

## 可直接粘贴到聊天的问题示例

- “为什么 `2/4/2` 这么活跃？最可能的原因是什么？”
- “有没有看到两个组地址之间的环路模式？”
- “哪些物理地址在写入 `x/y/z`？频率是多少？”
- “Router Filter 应该怎么配才能挡住 spam 又不影响正常流量？”

## 要求

- 流程中至少有一个 `knxUltimateAI` 节点。
- 所选 `knxUltimateAI` 必须绑定 `knxUltimate-config` 网关。
- 如需 LLM 回答：在 `knxUltimateAI` 节点里启用 LLM，并在该节点中配置 API key。
