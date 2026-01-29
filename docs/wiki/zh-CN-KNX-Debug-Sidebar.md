---
layout: wiki
title: "KNX-Debug-Sidebar"
lang: zh-CN
permalink: /wiki/zh-CN-KNX-Debug-Sidebar
---
左侧边栏的 **KNX Debug** 标签页会实时显示 KNX Ultimate 的内部调试日志。

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-debug.png" alt="KNX Debug sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## 用途

- 快速查看 KNX Ultimate 的运行情况（错误、警告、信息、调试）。
- 自动刷新 + 复制到剪贴板。

## 启用方式

由 Node-RED 插件提供：

- `package.json` → `node-red.plugins.knxUltimateMonitorSidebar`
- 文件：`nodes/plugins/knxUltimateMonitor-sidebar-plugin.html`
