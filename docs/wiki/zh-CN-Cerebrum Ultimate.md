---
layout: wiki
title: "Cerebrum Ultimate"
lang: zh-CN
permalink: /wiki/zh-CN-Cerebrum-Ultimate
---

# Cerebrum Ultimate

此前随 KNX Ultimate 提供的 AI 节点已由独立软件包 **Cerebrum Ultimate** 取代。

Cerebrum Ultimate 将 KNX Ultimate 作为可选的兼容集成，与 Home Assistant、HUE、Matter、UniFi Protect 及其他已注册适配器处于同一层级。新安装应使用 [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate)。

从 **7.1.0-beta.0** 开始，KNX Ultimate 已移除 `knxUltimateAI`、`knxUltimateAIHomeAssistant` 及其网页界面。包含这些类型的现有流程将显示未知节点。升级前，请将这些流程迁移到独立的 Cerebrum Ultimate 软件包；目前不提供自动转换。已保存在磁盘上的 AI 数据会保留。

完整英文文档位于 [Cerebrum Ultimate README](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme)。
