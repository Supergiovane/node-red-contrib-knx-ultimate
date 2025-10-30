🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) | [IT](/node-red-contrib-knx-ultimate/wiki/it-FAQ-Troubleshoot) | [DE](/node-red-contrib-knx-ultimate/wiki/de-FAQ-Troubleshoot) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-FAQ-Troubleshoot) | [ES](/node-red-contrib-knx-ultimate/wiki/es-FAQ-Troubleshoot) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-FAQ-Troubleshoot)
<!-- NAV START -->
导航: [首页](/node-red-contrib-knx-ultimate/wiki/zh-CN-Home)  
概览: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [常见问题](/node-red-contrib-knx-ultimate/wiki/zh-CN-FAQ-Troubleshoot) • [安全](/node-red-contrib-knx-ultimate/wiki/zh-CN-SECURITY) • [文档：语言栏](/node-red-contrib-knx-ultimate/wiki/zh-CN-Docs-Language-Bar)  
KNX 设备: [网关](/node-red-contrib-knx-ultimate/wiki/zh-CN-Gateway-configuration) • [设备](/node-red-contrib-knx-ultimate/wiki/zh-CN-Device) • [节点保护](/node-red-contrib-knx-ultimate/wiki/zh-CN-Protections)  
其他 KNX 节点: [场景控制器](/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration) • [看门狗](/node-red-contrib-knx-ultimate/wiki/zh-CN-WatchDog-Configuration) • [日志节点](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration) • [全局上下文](/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable) • [告警器](/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration) • [负载控制](/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration) • [查看器](/node-red-contrib-knx-ultimate/wiki/zh-CN-knxUltimateViewer) • [自动响应](/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder) • [HA 翻译器](/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator) • [物联网桥接](/node-red-contrib-knx-ultimate/wiki/zh-CN-IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Bridge+configuration) • [灯](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Light) • [电池](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Battery) • [按钮](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Button) • [接触](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Contact+sensor) • [设备软件更新](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Device+software+update) • [光照传感器](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Light+sensor) • [运动](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Motion) • [场景](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Tapdial) • [温度](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Temperature+sensor) • [Zigbee 连接](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Zigbee+connectivity)  
示例: [日志](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/zh-CN-Manage-Wiki)
<!-- NAV END -->
---

# 常见问题与排障（FAQ & Troubleshoot）

感谢使用我的 Node‑RED 节点！如果你遇到问题，别担心：按下面清单逐项检查即可。KNX‑Ultimate 已被广泛使用且稳定可靠。

最低要求： **Node.js >= 16**

## 节点无法工作

- 是否已创建并正确配置了 [Gateway configuration 节点](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration)（指向你的 KNX/IP Router 或 Interface 的 IP/端口）？
- KNX/IP **Router ** ：**Host** 填 `224.0.23.12`，端口 `3671`。
- KNX/IP **Interface ** ：**Host** 填设备 IP（如 `192.168.1.22`），端口 `3671`。
- 存在 **多网卡 ** （以太网/无线）时，请在 Gateway 中指定要使用的网卡，或禁用 Wi‑Fi。修改后务必**重启 Node‑RED** 。
- 仅使用正规、认证的 KNX/IP Router 或 KNX/IP Interface，避免 "all‑in‑one / 代理类” 设备。
- 使用 Interface 时，可在 Gateway 中启用 "Suppress ACK request” 测试。
- 参见下文 "只能接收 / 不能发送”。
- 若在容器中运行，请稍微 **延迟启动 Node‑RED** （有时网卡尚未就绪）。

## 运行一段时间后停止

- 参考上节 "节点无法工作”。
- 在交换机/路由器上临时 **关闭 DDOS/UDP Flood 防护** （可能会拦截 KNX 的 UDP 数据包）。
- 直接连接 KNX/IP 设备与 Node‑RED 主机测试。
- 避免廉价或 all‑in‑one 接口，优先选用 **KNX/IP Router** 。
- 使用 Interface 时留意并发连接上限（见产品手册）。Router 通常无此限制。

## knxd 配置

- **knxd** 与 Node‑RED 在同一主机时，接口建议使用 `127.0.0.1`。
- 检查过滤表（filter tables），相应调整 Config‑Node 的物理地址。
- 在 Gateway（高级）中启用 "Echo sent message to all node with same Group Address”。

## ETS 能看到报文，但执行器无反应

可能与其它 KNX 插件冲突。

- 从 Node‑RED Palette 移除其它 KNX 插件，仅保留 KNX‑Ultimate（同时删除隐藏的 config‑nodes）。
- 使用 Interface 时，在 Gateway 中开启 "Suppress ACK request” 测试。

## 只能接收，不能发送（或反之）

你的 Router/Interface 可能启用了过滤。

- 在 ETS 中允许 **Forwarding** ；或依据路由器的过滤表，调整 Config‑Node 的物理地址。
- 使用 **knxd** 时请检查过滤表并相应调整物理地址。

## 数值错误

- 使用正确的 Datapoint（温度：`9.001`）。
- 在 Gateway 中导入 ETS CSV，可获得正确的 DPT。
- 避免两个节点使用 **相同​​ GA ** 却**不同 DPT** 的情况。

## 同一 GA 的节点之间不"互通”

常见于 Tunneling/Unicast（Interface、knxd）。

- 在 Gateway 中启用 "Echo sent message to all node with same Group Address”。

## Secure KNX Router/Interfaces

启用 Secure 模式时不支持；如允许非安全连接可正常工作。

- 关闭 Secure Routing 或允许不安全连接。
- 可选：为 Node‑RED 增加一块直连 KNX Router 的专用网卡，并在 Gateway 设置 "Bind to local interface”。
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
- 或在 [KNX‑User‑Forum](https://knx-user-forum.de) 给我发私信（用户：TheMax74；请用英文）。