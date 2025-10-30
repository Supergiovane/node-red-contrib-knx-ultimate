🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-IoT-Bridge-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-IoT-Bridge-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-IoT-Bridge-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-IoT-Bridge-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-IoT-Bridge-Configuration)

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

# KNX ↔ IoT Bridge

Bridge 节点将 KNX 电报标准化为适用于 IoT 传输（MQTT、REST、Modbus）的结构化消息，并允许通过 Flow 输入写回 KNX 总线。本文概述配置要点以及推荐的第三方节点。

## 字段速览

| 字段 | 作用 | 备注 |
| -- | -- | -- |
| **Label** | 显示名称 | 展示在状态栏和 `msg.bridge.label` 中。 |
| **GA / DPT** | 组地址与数据点 | 可手动填写或使用 ETS 自动补全。 |
| **Direction** | KNX→IoT / IoT→KNX / 双向 | 决定启用的输出。 |
| **Channel type** | MQTT / REST / Modbus | 改变 `Target` 的意义。 |
| **Target** | 主题、基础 URL 或寄存器 | 留空时使用节点的 `outputtopic`。 |
| **Template** | 字符串模板 | 支持 `{{value}}`, `{{ga}}`, `{{type}}`, `{{target}}`, `{{label}}`, `{{isoTimestamp}}`。 |
| **Scale / Offset** | 数值转换 | 用于 KNX→IoT；IoT→KNX 使用逆变换。 |
| **Timeout / Retry** | 重试提示 | 下游节点可据此控制重新发送。 |

## 常见传输

### MQTT Broker

- **发布**：将输出 1 接到核心节点 `mqtt out`，桥接已填充主题和载荷。
- **订阅**：将 `mqtt in` 连接到桥接输入以把 MQTT 消息写入 KNX，第 2 输出提供确认。

### REST API

- 把输出 1 接入核心 `http request`（或如 [`node-red-contrib-http-request`](https://flows.nodered.org/node/node-red-contrib-http-request) 的贡献节点）。
- 桥接节点会把 `bridge.method` 复制到 `msg.method` 并将模板结果放入 payload，适合向 Webhook 推送 JSON。

### Modbus 寄存器

- 搭配 [`node-red-contrib-modbus`](https://flows.nodered.org/node/node-red-contrib-modbus) 使用（`modbus-flex-write` 等）。
- `Target` 表示寄存器；`msg.payload` 带有转换后的值。

## Flow 示例

### KNX 状态 → MQTT

```json
[
  {
    "id": "bridge1",
    "type": "knxUltimateIoTBridge",
    "z": "flow1",
    "server": "gateway1",
    "name": "灯光桥接",
    "emitOnChangeOnly": true,
    "readOnDeploy": true,
    "acceptFlowInput": true,
    "mappings": [
      {
        "id": "map-light",
        "enabled": true,
        "label": "客厅灯",
        "ga": "1/1/10",
        "dpt": "1.001",
        "direction": "bidirectional",
        "iotType": "mqtt",
        "target": "knx/light/living",
        "method": "POST",
        "modbusFunction": "writeHoldingRegister",
        "scale": 1,
        "offset": 0,
        "template": "{{value}}",
        "property": "",
        "timeout": 0,
        "retry": 0
      }
    ],
    "wires": [["mqttOut"],["debugAck"]]
  },
  {
    "id": "mqttOut",
    "type": "mqtt out",
    "name": "MQTT 状态",
    "topic": "",
    "qos": "0",
    "retain": "false",
    "broker": "mqttBroker",
    "x": 520,
    "y": 120,
    "wires": []
  },
  {
    "id": "debugAck",
    "type": "debug",
    "name": "KNX 回执",
    "active": true,
    "tosidebar": true,
    "complete": "true",
    "x": 520,
    "y": 180,
    "wires": []
  }
]
```

### MQTT 指令 → KNX

```json
[
  {
    "id": "mqttIn",
    "type": "mqtt in",
    "name": "MQTT 指令",
    "topic": "knx/light/living/set",
    "qos": "1",
    "datatype": "auto",
    "broker": "mqttBroker",
    "x": 140,
    "y": 200,
    "wires": [["bridge1"]]
  }
]
```

组合上述片段即可实现 KNX ↔ MQTT 循环并获得确认。

### REST 快照

```json
{
  "id": "bridge-rest",
  "type": "knxUltimateIoTBridge",
  "name": "功率桥接",
  "mappings": [
    {
      "label": "总有功功率",
      "ga": "2/1/20",
      "dpt": "9.024",
      "direction": "knx-to-iot",
      "iotType": "rest",
      "target": "https://example/api/knx/power",
      "method": "POST",
      "template": "{\"value\":{{value}},\"ga\":\"{{ga}}\",\"ts\":\"{{isoTimestamp}}\"}"
    }
  ]
}
```

将输出 1 引入 `http request` 并结合 `bridge.retry` 处理重试策略。

### Modbus 写入

1. 设置 `Target = 40010`、`Channel type = Modbus`、`Direction = Bidirectional`。
2. 将输出 1 连接到 `modbus-flex-write`，把 `msg.payload` 提供给其值输入。
3. 通过第 2 输出确认 KNX 是否已在寄存器更新后同步。

## 提示

- `Target` 留空时，多个映射可共享 `outputtopic`。
- `emitOnChangeOnly` 可降低高频传感器噪声；如需全部电报，可关闭。
- 第 2 输出始终带有 IoT 原始 payload 和 `bridge` 元数据，便于调试缩放。
- 若设备需要特定 Modbus 浮点格式，可插入 `function` 节点生成所需字节序。

祝你桥接顺利！

