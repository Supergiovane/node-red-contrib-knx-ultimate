---
layout: wiki
title: "KNX AI"
lang: zh-CN
permalink: /wiki/zh-CN-KNX%20AI
---
此节点会监听所选 KNX Ultimate 网关上的**所有 KNX 电报**，生成统计信息、检测简单异常，并且（可选）可调用 LLM 输出更便于阅读的分析结果。

## 功能
- 在内存中保存一段滚动窗口的 KNX 电报历史（由 KNX Ultimate 解码）。
- 定时或按需输出**流量摘要**（Top 组地址、事件类型、速率）。
- 输出**异常事件**（总线速率过高、某 GA 过度刷屏、频繁抖动/翻转）。
- 可选：通过 `ask` 命令向 LLM 提问。

## 输出
1. **摘要/统计**（`msg.payload` 为 JSON）
2. **异常**（`msg.payload` 为 JSON，描述异常）
3. **AI 助手**（`msg.payload` 为文本；包含 `msg.summary`）

## 命令（输入引脚）
发送带 `msg.topic` 的消息：
- `summary`（或空）：立即输出摘要
- `reset`：清空内部历史与计数器
- `ask`：使用摘要 + 最近流量向 LLM 提问

对于 `ask`，请将问题放在 `msg.prompt`（推荐）或 `msg.payload`（字符串）里。

## 注意
- 启用 LLM 后，会把总线信息发送到所配置的接口地址。若希望本地化处理，请使用本地 provider。
- 对于 OpenAI，请仅粘贴 API Key（以 `sk-` 开头）。不要粘贴 `Bearer ...` 或完整的 `Authorization: ...`。
