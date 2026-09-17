---
layout: wiki
title: "从第 7 版升级"
lang: zh-CN
permalink: /wiki/zh-CN-Migration-8
translation_key: "Migration-8"
---

# 从第 7 版升级

第 8 版移除了旧 HUE、Matter 和 AI 节点及其配置节点，也移除了独立的 KNX Utility 功能节点。请在 KNX Ultimate 7 仍然安装时完成迁移。

1. 备份整个 Node-RED 用户目录，包括流程、凭据、设置和 `knxultimatestorage`。仅导出流程 JSON 无法备份 Matter 配对。

2. 在 KNX Ultimate 7 中使用 **Migrate KNX** 或 KNX Utility 的转换按钮处理旧工具节点。检查所有流程和子流程，然后 Deploy。

3. 安装 `node-red-contrib-hue-ultimate` 和/或 `node-red-contrib-matter-ultimate`，重启 Node-RED 并确认迁移提示。HUE 同时支持旧独立节点和旧多功能 Controller 的转换。

4. 检查转换结果并 Deploy。工具会保留 ID 和配置引用。继续使用原用户目录，不要删除 `knxultimatestorage/matter`，其中保存着 Matter 配对身份和 fabric。

5. 升级前替换或移除 `knxUltimateAI` 和 `knxUltimateAIHomeAssistant`。Cerebrum Ultimate 是独立 AI 软件包，不提供 AI 自动转换。也要删除未使用的旧配置节点。

6. 确认设备正常工作后，安装 KNX Ultimate 8 并重启 Node-RED。使用 KNX 的 HUE 和 Matter 节点继续使用现有网关。

## 安装被阻止时

第 8 版安装时会检查已保存流程中的旧 HUE 和 Matter 节点，包括配置节点、已禁用流程和子流程。仅安装新软件包不够，必须先转换并 Deploy。检查无法覆盖所有自定义存储和编辑器中未保存的修改，因此仍需完成迁移步骤。

如果过早升级，请重新安装 KNX Ultimate 7 并重启 Node-RED，然后迁移。必要时恢复完整备份。不要删除未知节点或重置 Matter 配对。

## 文档

- [KNX Utility]({{ '/wiki/zh-CN-KNX-Utility' | relative_url }})
- [HUE Ultimate](https://supergiovane.github.io/node-red-contrib-hue-ultimate/zh-CN/index.html)
- [Matter Ultimate](https://supergiovane.github.io/node-red-contrib-matter-ultimate/zh-CN/index.html)
- [Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme)
