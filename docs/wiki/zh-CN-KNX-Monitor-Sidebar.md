---
layout: wiki
title: "KNX Monitor（侧边栏）"
lang: zh-CN
permalink: /wiki/zh-CN-KNX-Monitor-Sidebar
---

左侧边栏的 **KNX Monitor** 标签页会以表格方式实时展示 KNX 组地址及其当前值。

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-monitor.png" alt="KNX Monitor sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## 用途

- 实时监控数值变化。
- 可按 GA、设备名称或值进行筛选。
- 直接在表格中切换布尔值（当前值为布尔类型时）。

## 需要

- 当前 flow 中至少有一个 `knxUltimate-config` 节点（用于选择网关）。

## 启用方式

由 Node-RED 插件提供：

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- 文件：`nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`
