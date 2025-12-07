---
layout: wiki
title: "FAQ-Troubleshoot"
lang: zh-CN
permalink: /wiki/zh-CN-FAQ-Troubleshoot
---
---

# 常见问题与排障（FAQ & Troubleshoot）

感谢使用我的 Node-RED 节点！如果你遇到问题，别担心：按下面清单逐项检查即可。KNX-Ultimate 已被广泛使用且稳定可靠。

最低要求： **Node.js >= 16**

## 节点无法工作

- 是否已创建并正确配置了 [Gateway configuration 节点](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration)（指向你的 KNX/IP Router 或 Interface 的 IP/端口）？
- KNX/IP **Router ** ：**Host** 填 `224.0.23.12`，端口 `3671`。
- KNX/IP **Interface ** ：**Host** 填设备 IP（如 `192.168.1.22`），端口 `3671`。
- 存在 **多网卡 ** （以太网/无线）时，请在 Gateway 中指定要使用的网卡，或禁用 Wi-Fi。修改后务必**重启 Node-RED** 。
- 仅使用正规、认证的 KNX/IP Router 或 KNX/IP Interface，避免 "all-in-one / 代理类” 设备。
- 使用 Interface 时，可在 Gateway 中启用 "Suppress ACK request” 测试。
- 参见下文 "只能接收 / 不能发送”。
- 若在容器中运行，请稍微 **延迟启动 Node-RED** （有时网卡尚未就绪）。

## 运行一段时间后停止

- 参考上节 "节点无法工作”。
- 在交换机/路由器上临时 **关闭 DDOS/UDP Flood 防护** （可能会拦截 KNX 的 UDP 数据包）。
- 直接连接 KNX/IP 设备与 Node-RED 主机测试。
- 避免廉价或 all-in-one 接口，优先选用 **KNX/IP Router** 。
- 使用 Interface 时留意并发连接上限（见产品手册）。Router 通常无此限制。

## knxd 配置

- **knxd** 与 Node-RED 在同一主机时，接口建议使用 `127.0.0.1`。
- 检查过滤表（filter tables），相应调整 Config-Node 的物理地址。
- 在 Gateway（高级）中启用 "Echo sent message to all node with same Group Address”。

## ETS 能看到报文，但执行器无反应

可能与其它 KNX 插件冲突。

- 从 Node-RED Palette 移除其它 KNX 插件，仅保留 KNX-Ultimate（同时删除隐藏的 config-nodes）。
- 使用 Interface 时，在 Gateway 中开启 "Suppress ACK request” 测试。

## 只能接收，不能发送（或反之）

你的 Router/Interface 可能启用了过滤。

- 在 ETS 中允许 **Forwarding** ；或依据路由器的过滤表，调整 Config-Node 的物理地址。
- 使用 **knxd** 时请检查过滤表并相应调整物理地址。

## 数值错误

- 使用正确的 Datapoint（温度：`9.001`）。
- 在 Gateway 中导入 ETS CSV，可获得正确的 DPT。
- 避免两个节点使用 **相同 GA ** 却**不同 DPT** 的情况。

## 同一 GA 的节点之间不"互通”

常见于 Tunneling/Unicast（Interface、knxd）。

- 在 Gateway 中启用 "Echo sent message to all node with same Group Address”。

## Secure KNX Router/Interfaces

启用 Secure 模式时不支持；如允许非安全连接可正常工作。

- 关闭 Secure Routing 或允许不安全连接。
- 可选：为 Node-RED 增加一块直连 KNX Router 的专用网卡，并在 Gateway 设置 "Bind to local interface”。
- 未来可能支持 Secure 连接。

## Flood Protection（限流保护）

用于避免 UI 与总线过载：每个节点默认 1 秒窗口内最多接收 120 条消息。

- 使用 **delay** 节点分散消息。
- 使用 **RBE** 过滤重复值。
  [详情](/node-red-contrib-knx-ultimate/wiki/Protections)

## 导入 ETS 后出现 Datapoint 警告

- 在 ETS 中补齐 DPT（含子类型，如 `5.001`）。
- 或在导入时选择 "Import with a fake 1.001 datapoint (Not recommended)” 或跳过相关 GA。

## 循环引用保护

当两个节点用相同 GA 直接 Out→In 连接时，系统为防止回环会禁用之。

- 调整流程：拆分这两个节点，或在其中加入"调解/缓冲”节点。
- 启用 **RBE** 以避免回环。
  [详情](/node-red-contrib-knx-ultimate/wiki/Protections)

## 仍有问题？

- 建议在 [GitHub](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues) 提 Issue（优先）。
- 或在 [KNX-User-Forum](https://knx-user-forum.de) 给我发私信（用户：TheMax74；请用英文）。
