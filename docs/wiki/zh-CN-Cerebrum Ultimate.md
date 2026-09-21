---
layout: wiki
title: "Cerebrum Ultimate"
lang: zh-CN
permalink: /wiki/zh-CN-Cerebrum-Ultimate
---
### 升级到 KNX Ultimate 8

版本 7 会在此编辑器顶部显示一个小型的 **升级到 v8** 按钮。它会下载流程备份、安装所需的 HUE/Matter 软件包、转换兼容节点、执行完整部署、验证已保存的流程并安装版本 8。出现提示后必须重启 Node-RED 服务；仅重新加载浏览器并不足够。旧版 KNX AI 节点会停止自动操作。

[完整升级指南](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Upgrade-to-v8)

<br/>

# Cerebrum Ultimate

此前随 KNX Ultimate 提供的 AI 节点已由独立软件包 **Cerebrum Ultimate** 取代。

Cerebrum Ultimate 将 KNX Ultimate 作为可选的兼容集成，与 Home Assistant、HUE、Matter、UniFi Protect 及其他已注册适配器处于同一层级。新安装应使用 [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate)。

从 **7.1.1** 开始，旧版 `knxUltimateAI`、`knxUltimateAIHomeAssistant` 节点及其网页界面已恢复，以保持现有流程的兼容性。这些节点在节点面板中隐藏，现有配置和已保存的 AI 数据仍受支持。迁移到独立的 Cerebrum Ultimate 软件包是可选的，目前不提供自动转换。

完整英文文档位于 [Cerebrum Ultimate README](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme)。
