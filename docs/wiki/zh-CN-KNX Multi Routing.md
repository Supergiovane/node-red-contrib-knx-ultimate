---
layout: wiki
title: "KNX Multi Routing"
lang: zh-CN
permalink: /wiki/zh-CN-KNX%20Multi%20Routing
---
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-multi-routing-filter.svg" width="95%"><br/>

此节点用于通过 Node-RED 的连线来**互联多个 KNX Ultimate 网关**（多个 `knxUltimate-config`）。

它会为所选网关的 KNX 总线上收到的每个电报输出一条包含**RAW 电报信息**（APDU + cEMI 十六进制 + 地址）的消息。
同时它也可以在输入端接收相同格式的 RAW 对象，并将其转发到所选网关的 KNX 总线。

## KNX/IP 服务器模式
将 **Mode** 设置为 **Server KNX/IP** 可启动一个内置的 KNXnet/IP tunneling（UDP）服务器。来自 tunneling 客户端的电报会以相同的 RAW 格式输出。
该节点也会在输入端接收 RAW 对象，并将其注入到已连接的 tunneling 客户端。

**重要（Advertise host）：** KNXnet/IP 客户端会把数据发送到服务器在 CONNECT_RESPONSE 中通告的 IP。如果客户端显示 *已连接* 但服务器收不到电报，请将 **Advertise host** 设为客户端可达的服务器 LAN IP（尤其是在 Docker/VM 中运行 Node-RED 或主机有多网卡时）。

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

## Routing counter (hop count)
MultiRouting 可使用 `knx.cemi.hex` 中的 KNX routing counter（hop count）来避免电报环路。
- **Respect routing counter (drop if 0)**：routing counter 为 `0` 的电报不会被转发。
- **Decrement routing counter when routing**：转发时递减 routing counter；若递减后到达 `0`，电报将被丢弃。

当前值会暴露为 `knx.routingCounter`（当 `knx.cemi` 为对象时，也会作为 `knx.cemi.hopCount` 提供）。

## 重写电报
如果你在 flow 中重写 `knx.source` / `knx.destination`，也必须保持 `knx.cemi.hex` 的一致性。建议：在 MultiRouting 节点之间放置 **KNX Router Filter**；它会在重写时自动同步 `knx.cemi.hex`。

## 注意
- 转发到其它网关时，**源物理地址会改变**（变为发送网关的物理地址）。可使用 `knx.source` 和/或 `knxMultiRouting.gateway` 来过滤环路。
- 选项 **“Drop messages already tagged for this gateway”** 可帮助在互联多个路由节点时避免简单环路。
