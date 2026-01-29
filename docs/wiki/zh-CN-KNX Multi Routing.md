---
layout: wiki
title: "KNX Multi Routing"
lang: zh-CN
permalink: /wiki/zh-CN-KNX%20Multi%20Routing
---
此节点用于通过 Node-RED 的连线来**互联多个 KNX Ultimate 网关**（多个 `knxUltimate-config`）。

它会为所选网关的 KNX 总线上收到的每个电报输出一条包含**RAW 电报信息**（APDU + cEMI 十六进制 + 地址）的消息。
同时它也可以在输入端接收相同格式的 RAW 对象，并将其转发到所选网关的 KNX 总线。

## 输出消息格式
`msg.payload` 包含：
- `knx.event`：`GroupValue_Write` / `GroupValue_Response` / `GroupValue_Read`
- `knx.source`：物理地址（例如 `1.1.10`）
- `knx.destination`：组地址（例如 `0/0/1`）
- `knx.apdu.data`：APDU 原始数据 `Buffer`（仅 Write/Response）
- `knx.apdu.bitlength`：数据位长度（`<=6` 表示编码在 APCI 低位）
- `knx.cemi.hex`：完整 cEMI 十六进制（ETS 风格）
- `knx.echoed`：若被网关回显则为 `true`
- `knxMultiRouting.gateway`：网关元信息（`id`, `name`, `physAddr`）

## 注意
- 转发到其它网关时，**源物理地址会改变**（变为发送网关的物理地址）。可使用 `knx.source` 和/或 `knxMultiRouting.gateway` 来过滤环路。
- 选项 **“Drop messages already tagged for this gateway”** 可帮助在互联多个路由节点时避免简单环路。
