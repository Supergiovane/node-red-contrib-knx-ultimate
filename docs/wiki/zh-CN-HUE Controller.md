---
layout: wiki
title: "HUE Controller"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Controller
---
# HUE Controller

[**KNX-Ultimate 视频教程（YouTube 播放列表）**](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)

<div data-hue-controller-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 55%,#2a8dff 100%);box-shadow:0 14px 30px rgba(11,45,90,0.24);color:#f4f9ff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#cfe4ff;">Hue API v2 · KNX · Node-RED</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">一个节点，十五种 Hue 功能。</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f4f9ff;">HUE Controller 将原有专用 Hue 节点中经过验证的全部功能整合到一个独立且持续维护的节点中。选择设备功能后，编辑器、KNX 映射、Hue 资源选择器和流程端口会自动适配。</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">15</strong><span style="font-size:0.76rem;color:#e8f3ff;">种设备功能</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">Hue API v2</strong><span style="font-size:0.76rem;color:#e8f3ff;">原生资源</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">KNX</strong><span style="font-size:0.76rem;color:#e8f3ff;">可选集成</span></div>
  </div>
</div>

## 一个节点提供全部功能

| 类别 | 功能 | 主要能力 |
|---|---|---|
| **照明与电源** | 灯 / 灯组、插座 | 开关、相对与绝对调光、可调白光、RGB/HSV、效果、日夜预设、定位、电源控制和双向反馈。 |
| **场景与控制器** | 场景、按钮、Tap dial | 单场景或编号场景调用、DPT 1/18 映射、短按/长按/重复、切换逻辑和旋转事件。 |
| **存在与安全** | 运动、区域运动、摄像机运动、接触传感器 | 运动及开关状态、启动同步、KNX 发布和可选流程事件。 |
| **环境** | 光照度、温度、湿度 | 将 Hue 传感器读数映射到适合的 KNX 数据点。 |
| **设备健康** | 电池、Zigbee 连接、软件更新 | 在 KNX 或 Node-RED 流程中提供电池百分比、连接状态和更新可用性。 |

## 一致的 Controller 使用体验

- 根据所选功能提供 Hue 资源自动完成和刷新。
- 灯具映射会根据能力显示：调光、可调白光、RGB/HSV 和原生效果遵循所选 Hue API v2 灯资源实时提供的 `dimming`、`color_temperature`、`color` 和 `effects` 属性。
- 灯光编辑器使用有界就绪等待：Hue Bridge 加载资源时显示旋转沙漏，每 500 毫秒检查一次，并在约 10 秒后解除等待并显示本地化错误。保存、关闭或切换功能都会取消计时器。
- 紧凑的 KNX 映射行会将 GA、DPT 和名称保持在同一行；DPT 与名称控件采用较小宽度，在较窄的编辑器中名称字段还可继续收缩，且不会改变已保存的值。选择器选项异步加载时，已保存的 DPT 值会被保留。
- KNX 网关可选：可使用组地址或导入的 ETS 名称；兼容的数据点来自所选网关。
- 按配置动态提供 Node-RED 端口，用于经过验证的 Hue API v2 输入及受支持的 Hue 事件输出。
- 每个私有配置都保留启动读取、Hue→KNX 状态同步和回路保护。
- 可完全在本地迁移全部十五种旧版节点类型；随后打开可编辑的邮件草稿、在浏览器新窗口中打开捐赠页面、在本地检查并手动 Deploy。

## 四步开始使用

1. 只需配置一次 **Hue Bridge**。
2. 添加 **HUE Controller**，选择**设备功能**，然后选择或刷新对应的 Hue 资源。
3. 选择 **KNX 网关**并映射命令/状态，或保留 `none` 仅用于流程。
4. 设置该功能的行为和端口，部署并检查节点实时状态。

> **没有 KNX 网关？** Controller 仍可作为 Hue–Node-RED 集成使用。KNX 字段会隐藏，所选功能支持的流程选项仍然可用。

下面各节是从原有专用节点整合而来的完整功能参考。

## 转换旧版 HUE 节点

仅当 Node-RED 编辑器在当前流程中检测到至少一个旧版 HUE 节点时，迁移按钮才会显示。每个旧版 HUE 编辑器的弃用提示下方也提供相同的橙色按钮。按钮下方的声明确认不会有任何流程或节点数据离开浏览器。

点击**转换旧版 HUE 节点**并确认。浏览器会在本地完成全部转换，不会发送任何流程、节点、`hue-config`、`knxUltimate-config`、组地址、连线、凭据、名称、位置或 ID 数据。转换成功后，它会打开一封发给作者的可编辑邮件草稿，而不会离开 Node-RED，并在浏览器新窗口中打开捐赠页面。草稿只包含已转换节点数量和可选备注空间；是否发送由你决定，绝不会自动发送，也不会向 PayPal 链接添加任何流程数据。

开始之前，请先导出流程备份。浏览器会关闭当前节点编辑器，并只把检测到的旧版 HUE 节点转换为 HUE Controller 实例。已保存的属性、配置引用、位置、分组和连线保持不变。工作区会标记为已修改，但工具绝不会自动部署：请检查结果并自行点击 **Deploy**。节点已变化、流程被锁定或发生本地转换错误时，工作区不会发生变化。**安全检查：**点击 Deploy 前，请逐一检查所有已修改 HUE 节点的功能、配置引用、输入/输出端口和连线。处理完成后，Node-RED 的固定消息会一直显示，直到点击**确定**。

Hue 事件仍然只是状态更新，不会变成新的 Hue 命令。HUE Controller 内置私有的运行时、编辑器、模板和翻译配置，因此不依赖加载已弃用的节点类型。原始 Hue Light 节点保持不变。原有专用 Hue 节点仍会注册以兼容现有流程，但这些节点现已冻结，不再获得新功能或维护更新。Node-RED 会从节点面板中隐藏其特殊的 `deprecated` 分类；现有实例仍可编辑和部署，颜色比 HUE Controller 更浅，会在画布上标记为 `(deprecated)`，编辑器顶部也会显示迁移提示。

<!-- HUE_CONTROLLER_PROFILE_DOCS_START -->

## 设备功能

- [灯 / 灯组 (`light`)](#hue-controller-docs-light)
- [插座 / 输出 (`plug`)](#hue-controller-docs-plug)
- [按钮 (`button`)](#hue-controller-docs-button)
- [Tap dial (`relative_rotary`)](#hue-controller-docs-relative_rotary)
- [运动 (`motion`)](#hue-controller-docs-motion)
- [区域运动 (`area_motion`)](#hue-controller-docs-area_motion)
- [摄像机运动 (`camera_motion`)](#hue-controller-docs-camera_motion)
- [接触传感器 (`contact`)](#hue-controller-docs-contact)
- [光照度 (`light_level`)](#hue-controller-docs-light_level)
- [温度 (`temperature`)](#hue-controller-docs-temperature)
- [湿度 (`humidity`)](#hue-controller-docs-humidity)
- [场景 (`scene`)](#hue-controller-docs-scene)
- [电池 (`device_power`)](#hue-controller-docs-device_power)
- [Zigbee 连接 (`zigbee_connectivity`)](#hue-controller-docs-zigbee_connectivity)
- [设备软件更新 (`device_software_update`)](#hue-controller-docs-device_software_update)

<span id="hue-controller-docs-light" data-hue-controller-type="light"></span>

## 灯 / 灯组 (`light`)

此节点使您可以控制飞利浦色调灯和分组的灯光，还可以将此灯的状态发送到KNX巴士。

**一般的**

|属性|描述|
| - | - |
|KNX 网关 |选择要使用的KNX门户|
|色相桥|选择要使用的色调桥|
|名称|色相灯或色相分组的光。您打字时可用的灯光和团体开始出现。 |

**定位设备**

`Locate` 按钮（播放图标）会为所选资源启动 Hue Identify 会话。会话激活期间，按钮会切换为停止图标，网桥每秒让该灯具——或分组中的所有灯具——闪烁一次。再次按下按钮可立即停止；否则会在 10 分钟后自动结束。

**选项**

在这里，您可以选择要链接到可用的色调灯/状态的KNX地址。

开始输入GA字段，KNX设备的名称或组地址，可用设备在输入时开始显示。

**转变**

|属性|描述|
| - | - |
|控制|此GA用于通过布尔值KNX值为TRUE/FALSE打开/关闭色调灯|
|状态|将其链接到灯的开关状态组地址|

**暗淡**

|属性|描述|
| - | - |
|控制DIM |相对变暗的色调光。您可以在\*\* _行为_ **选项卡中设置调光速度。|
|控制％|改变了绝对色调的亮度（0-100％）|
|状态％|将其链接到光的亮度状态KNX组地址|
|昏暗速度（MS）|微小的速度，以毫秒为单位。这适用于 ** light ** ，也适用于**可调的白色\*\*调度数据点。它从0％到100％计算。|
|最新昏暗的亮度|灯可以达到的最低亮度。例如，如果要调低灯光，则灯会停止在指定的亮度％处变暗。|
|最大昏暗的亮度|灯可以达到的最大亮度。例如，如果要调整灯光，则光将在指定的亮度％处停止变暗。|

**可调白**

|属性|描述|
| - | - |
|控制DIM |使用DPT 3.007调光更改色调灯的白色温度。您可以在\*\* _行为_ \*\*选项卡中设置调光速度。 |
| 控制 % | 使用 DPT 5.001 更改白光色温；0 为暖，100 为冷 |
| 状态 % | 白光色温状态组地址（DPT 5.001；0=暖，100=冷） |
| 控制开尔文 | **DPT 7.600： ** 按 KNX 范围 2000-6535 K 设置（转换为 HUE mirek）。
**DPT 9.002：** 按 HUE 范围 2000-6535 K 设置（Ambiance 自 2200 K 起）。转换可能带来轻微偏差 |
| 状态开尔文 | **DPT 7.600： ** 读取开尔文（KNX 2000-6535，转换）。
**DPT 9.002：** 读取 HUE 范围 2000-6535 K；转换可能存在轻微偏差 |
|反转昏暗的方向|颠倒昏暗的方向。|

\*\* RGB/HSV \*\*

|属性|描述|
| - | - |
| **RGB 部分** ||
| 控制 RGB | 使用 RGB 三元组 (r,g,b) 改变颜色，包含色域校正。发送颜色会点亮并设置颜色/亮度；r,g,b=0 关灯 |
|状态RGB |灯的颜色状态组地址。接受的数据点是RGB三胞胎（R，G，B）|
| **HSV 部分** ||
| 颜色 H 调光 | 使用 DPT 3.007 在 HSV 色相环上循环；速度在 **Behaviour** 设置 |
|状态h％|HSV色圆的状态。|
| 控制 S 调光 | 使用 DPT 3.007 改变饱和度；速度在 **Behaviour** 设置 |
|状态s％|浅色饱和状态组地址。 |
|昏暗速度（MS）|从底部到最高尺度的微小速度，以毫秒为单位。|

提示：HSV 的 "V”（亮度）请使用 **Dim** 选项卡的标准控件。

**效果**

_非 Hue 基础效果_

|属性|描述|
| - | - |
|眨眼|_true_ 闪烁灯光， _false_ 停止闪烁。交替开关，适用于提示。支持所有 HUE 灯。|
|色彩循环|_true_ 启动循环， _false_ 停止循环。按固定间隔随机改变颜色，仅适用于支持彩光的 HUE 灯。效果在发出命令约 10 秒后开始。|

_Hue 原生效果_

在 **Hue 原生效果** 表格中，把 KNX 值映射到灯具支持的效果（例如 `candle`、`fireplace`、`prism`）。每一行把一个 KNX 值（布尔、数值或文本，取决于所选数据点）与桥接器返回的某个效果关联。这样可以：

- 发送映射好的 KNX 值来触发对应的效果；
- （可选）配置一个状态组地址：当 Hue 桥上报效果变化时，节点会回写映射值；如果未找到映射，则发送原始效果名称（需要文本类 DPT，例如 16.xxx）。

**行为**

|属性|描述|
|----------------------------------------------------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|在启动时阅读状态|在Node-Red的启动或Node-Red的完整部署中阅读色相灯状态，然后将该状态发送到KNX总线|
|KNX亮度状态|每当打开/关闭色调灯时，都会更新KNX亮度组地址状态。选项是 **当色相关闭时发送0％。当色相打开时，还原以前的值（默认的KNX行为） ** 和**如IS（默认色调行为）** 。如果您具有具有亮度状态的KNX调光器，例如MDT，则建议的选项为\*\*\*，当Hue Light关闭时，请发送0％。色调打开时，还原以前的值（默认的KNX行为）\*\*\* |
|根据 KNX 总线写入更新本地缓存的 Hue 状态|高级选项，默认启用。启用后，来自 KNX 总线的写入会立即更新节点本地缓存的 Hue 状态，无需等待 Hue Bridge 的反馈或事件。这样本地响应会更快，KNX 的即时读回也会更一致，尤其是在灯或分组灯关闭时。如果你希望缓存只跟随 Hue Bridge 的真实反馈/事件，请关闭此选项。 |
|打开行为|打开时，它设置了灯的行为。您可以从不同的行为中进行选择。
 \*\*选择颜色：\*\*将使用您选择的颜色打开灯。要更改颜色，只需单击颜色选择器（&#x5728;_&#x9009;择颜&#x8272;_&#x63A7;制下）。
 \*\*选择温度和亮度： **您选择的温度（kelvin）和亮度（0-100）将打开灯。
 none：** 无：如果您启用夜间照明，夜间结束后，灯将恢复白天设置的颜色/温度/亮度状态。|
|夜照明|它允许在夜间设置特定的浅色/亮度。选项与白天相同。您可以选择温度/亮度或颜色。舒适的温度为2700开Kelvin，亮度为10％或20％，是浴室夜灯的不错选择。 |
|白天/夜|选择用于设置白天/夜行为的组地址。组地址值为\_true\_如果白天，\_false\_如果夜间。|
|折叠白天/夜值|倒\_日/夜间\_组地址的值。默认值 **未选中** 。|
|在启动时阅读状态|阅读启动时的状态，并在启动/重新连接时将事件发射到KNX总线上。（默认"否”）|
|强制日间模式|您可以通过在此处描述的手动切换灯来强制进入日间模式：\*\*通过快速关闭Ligth然后打开（仅此灯）\*\*按描述执行，仅作用于这盏灯。\*\*通过快速关闭Ligth然后打开（应用所有灯节点）\*\*将所有灯节点切换到日间模式，并把昼/夜组地址设置为日间。|
|节点输入/输出引脚|隐藏或显示输入/输出引脚。输入/输出引脚允许节点接受流量输入，并将MSG输出发送到流量。输入MSG必须遵循HUE API V.2标准。这是一个示例MSG，它打开光线：<code> msg.on = {" on”：true} </code>。请参阅\[官方HUE API页]（§URL0§）|

##### 笔记

调光功能在\*\* knx模式\`启动\`\`''''和st off' **中起作用。要开始调暗，只发送一个"启动” knx电报。要停止调暗，请发送"停止” KNX电报。请** 请记住\*\*，当您设置墙壁时，请记住。

---

<span id="hue-controller-docs-plug" data-hue-controller-type="plug"></span>

## 插座 / 输出 (`plug`)

### Hue 插座 / Plug

#### 概述

Hue Plug 节点将飞利浦 Hue 智能插座映射到 KNX 组地址，实现：

- 总线上的开/关控制；
- 来自 Hue 平台的状态反馈；
- 可选的 `power_state`（on/standby）监控。

#### 配置

|字段|说明|
|--|--|
| KNX 网关 | 使用的 KNX 网关 |
| Hue Bridge | 使用的 Hue Bridge |
| 名称 | 要控制的 Hue 插座（自动提示） |
| 控制 | 发送开/关的 KNX 组地址（布尔 DPT） |
| 状态 | Hue 报告的开/关状态接收地址 |
| 电源状态 | 映射 Hue `power_state` 的可选组地址 |
| 启动时读取状态 | 部署时立即发送当前状态 |
| 引脚 | 启用 Node-RED 输入/输出引脚，用于高级控制或事件转发 |

#### KNX 建议

- 控制与状态建议使用 DPT 1.xxx。
- `power_state` 可映射为布尔值（true=on, false=standby），或使用文本类 DPT 显示原始字符串。
- 接收到 KNX 读取 (`GroupValue_Read`) 时，节点返回缓存的 Hue 状态。

#### Flow 集成

当启用引脚时：

- **输入** ：发送 Hue v2 载荷（如 `{ on: { on: true } }`）。
- **输出** ：在每次 Hue 事件时输出 `{ payload, on, power_state, rawEvent }`。

#### Hue API

节点调用 `/resource/plug/{id}`。Hue 事件流用于捕获状态变化并同步到 KNX。

---

<span id="hue-controller-docs-button" data-hue-controller-type="button"></span>

## 按钮 (`button`)

Hue Button 节点利用 <code>button.button_report.event</code> 将 Hue 按钮事件映射到 KNX，并在流程输出中提供相同的事件。

在 GA 输入框（名称或组地址）中键入即可关联 KNX GA；输入时会显示匹配的设备。

**常规**

|属性|说明|
|--|--|
| KNX 网关 | 选择要使用的 KNX 网关 |
| Hue Bridge | 选择要使用的 Hue Bridge |
| Hue 按钮 | 要使用的 Hue 按钮（输入时自动补全） |

**开关**

|属性|说明|
|--|--|
| 开关 | 由 <code>short\_release</code>（短按释放）触发的 GA。 |
| 状态 GA | 启用"每次事件切换数值”时的可选反馈 GA，用于保持内部状态同步。 |

**调光**

|属性|说明|
|--|--|
| 调光 | <code>long\_press</code>/<code>repeat</code> 事件期间用于调光的 GA（通常为 DPT 3.007）。 |

**行为**

|属性|说明|
|--|--|
| 每次事件切换数值 | 启用后自动在 <code>true/false</code> 与调光方向之间切换。 |
| 开关负载 | 禁用切换时发送到 KNX/流程的固定负载。 |
| 调光负载 | 禁用切换时发送到 KNX/流程的固定调光方向。 |

##### 输出

1. 标准输出
   : `msg.payload` 为布尔值或调光对象；`msg.event` 为 Hue 事件字符串（例如 `short_release`, `repeat`）。

##### 详细信息

`msg.event` 对应 `button.button_report.event`，原始 Hue 事件包含在 `msg.rawEvent` 中。使用可选的状态 GA 可以让内部切换状态与墙壁开关等外部设备保持一致。

---

<span id="hue-controller-docs-relative_rotary" data-hue-controller-type="relative_rotary"></span>

## Tap dial (`relative_rotary`)

**Hue Tap Dial** 节点将 Tap Dial 的旋转服务映射到 KNX，并把原始 Hue 事件发送到 Node-RED 流程。配对新设备后，请点击设备字段旁的刷新图标。

##### 选项卡

- **映射** - 选择旋转事件对应的 KNX 组地址和 DPT，支持 DPT 3.007、5.001、232.600。
- **行为** - 控制是否显示 Node-RED 输出引脚。未配置 KNX 网关时，引脚仍保持启用，以便事件继续进入流程。

##### 常规设置

| 属性 | 描述 |
|--|--|
| KNX 网关 | 用于 GA 自动补全的 KNX 网关。 |
| Hue Bridge | 提供 Tap Dial 的 Hue Bridge。 |
| Hue Tap Dial | 旋钮设备（支持自动补全；刷新按钮重新获取列表）。 |

##### 映射选项卡

| 属性 | 描述 |
|--|--|
| 旋转 GA | 接收旋转事件的 KNX 组地址（支持 DPT 3.007、5.001、232.600）。 |
| 名称 | GA 的说明名称。 |

##### 输出

|#|端口|Payload|
|--|--|--|
|1|标准输出|`msg.payload`（对象）Tap Dial 产生的原始 Hue 事件。|

> ℹ️ 仅在选择 KNX 网关后才会显示 KNX 相关控件；在同时配置好 Hue 网桥和 KNX 网关之前，映射选项卡会保持隐藏。

---

<span id="hue-controller-docs-motion" data-hue-controller-type="motion"></span>

## 运动 (`motion`)

该节点订阅 Hue 运动传感器的事件，并将其同步到 KNX 以及 Node-RED 流程。

在 GA 字段输入 KNX 设备名称或组地址即可自动补全；"Hue 传感器”旁的刷新按钮可重新加载 Hue 设备列表。

**常规**

|属性|说明|
| - | - |
|KNX 网关 |接收运动状态的 KNX 网关（选择后才显示 KNX 设置）|
|Hue Bridge|使用的 Hue Bridge|
| Hue 人体传感器 | 要使用的 Hue 运动传感器（支持自动补全与刷新）|

**映射**

|属性|说明|
|--|--|
| 运动 | 对应的 KNX 组地址；检测到运动时发送 `true`，恢复空闲时发送 `false`（推荐 DPT：<b>1.001</b>）|

**行为**

|属性|说明|
|--|--|
| 节点输出引脚 | 显示或隐藏 Node-RED 输出；未选择 KNX 网关时会保持启用，确保 Hue 事件仍能进入流程 |

> ℹ️ 未选择 KNX 网关时，KNX 字段会自动隐藏，可将节点用作纯 Hue → Node-RED 监听器。

##### 输出

1. 标准输出 — `msg.payload` (boolean)
   : 侦测到运动为 `true`，运动结束为 `false`。

---

<span id="hue-controller-docs-area_motion" data-hue-controller-type="area_motion"></span>

## 区域运动 (`area_motion`)

Hue 区域人体传感器节点订阅 Hue Bridge Pro 上 MotionAware 区域的聚合运动事件，并将“有人 / 无人”的结果同步到 KNX 或 Node-RED 流程。

在 GA 字段输入 KNX 设备名称或组地址即可完成绑定；输入时会显示匹配的建议。

**常规**

|属性|说明|
|--|--|
| KNX GW | 接收区域运动状态的 KNX 网关。 |
| HUE Bridge | 要使用的 Hue Bridge Pro。 |
| HUE Area | 要监控的 MotionAware 区域（舒适/安防），支持自动补全。 |
| 启动时读取状态 | 在启动或重新连接时读取当前值并发送到 KNX（默认：是）。 |

**映射**

|属性|说明|
|--|--|
| 运动 | 对应区域运动状态的 KNX 组地址（布尔量）。推荐 DPT：<b>1.001</b>。 |

**行为**

|属性|说明|
|--|--|
| 节点输出引脚 | 显示或隐藏 Node-RED 输出；未选择 KNX 网关时会保持启用，以便 MotionAware 事件仍能进入流程。 |

##### 输出

1. 标准输出
   : `msg.payload` (boolean)：当区域检测到运动时为 `true`，否则为 `false`。

##### 详情

`msg.payload` 携带所选 MotionAware 区域的最新聚合运动状态。

---

<span id="hue-controller-docs-camera_motion" data-hue-controller-type="camera_motion"></span>

## 摄像机运动 (`camera_motion`)

Hue Camera Motion 节点监听 Philips Hue 摄像头的运动事件，并将检测到/未检测到的状态映射到 KNX。

在 GA 输入框（名称或组地址）中开始输入，即可关联 KNX GA；输入时会显示匹配的设备。

**常规**

|属性|说明|
|--|--|
| KNX 网关 | 选择要使用的 KNX 网关 |
| HUE Bridge | 选择要使用的 HUE Bridge |
| HUE 摄像头运动 | Hue 摄像头运动传感器（输入时自动补全） |
| 启动时读取状态 | 启动/重新连接时读取当前值并发送到 KNX（默认：否） |

**映射**

|属性|说明|
|--|--|
| 运动 | 摄像头运动的 KNX 组地址（布尔值）。推荐 DPT：<b>1.001</b> |

##### 输出

1. 标准输出
   : `msg.payload` (布尔值)：检测到运动时为 `true`，否则为 `false`

##### 详细信息

`msg.payload` 保存 Hue 摄像头服务上次报告的运动状态。

---

<span id="hue-controller-docs-contact" data-hue-controller-type="contact"></span>

## 接触传感器 (`contact`)

该节点将 HUE 接触传感器事件映射到 KNX 组地址。

开始输入GA字段，KNX设备的名称或组地址，可用设备在输入时开始显示。

**一般的**

|属性|描述|
| - | - |
|KNX 网关 |选择要使用的KNX门户|
|Hue Bridge|选择要使用的 Hue Bridge|
| Hue 接触传感器 | 要使用的 HUE 接触传感器（自动补全） |

|属性|描述|
|-------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 联系 | 传感器开/合时：发送 KNX 值 _true_（激活/打开），否则 _false_ |

##### 输出

1. 标准输出
   ：有效载荷（布尔值）：命令的标准输出。

##### 细节

`msg.payload` 为 HUE 事件（布尔/对象），可用于自定义逻辑。

---

<span id="hue-controller-docs-light_level" data-hue-controller-type="light_level"></span>

## 光照度 (`light_level`)

该节点从 HUE 光照传感器读取 Lux 事件并发布到 KNX。

每当环境光变化时会输出 Lux 值。在 GA 字段输入 KNX 设备名或组地址（自动补全）以进行关联。

**一般的**

|属性|描述|
| - | - |
|KNX 网关 |选择要使用的KNX门户|
|色相桥|选择要使用的色调桥|
| HUE Sensor | 要使用的 HUE 光照传感器（自动补全） |
|在启动时阅读状态|阅读启动时的状态，并在启动/重新连接时将事件发射到KNX总线上。（默认"否”）|

**映射**

|属性|说明|
|--|--|
| Lux | 接收 Lux 数值的 KNX 组地址 |

##### 输出

1. 标准输出
   : payload (number)：当前 Lux 数值

##### 细节

`msg.payload` 为数值型 Lux。

---

<span id="hue-controller-docs-temperature" data-hue-controller-type="temperature"></span>

## 温度 (`temperature`)

此节点读取 HUE 温度传感器的温度（°C），并将其映射到 KNX。

在 GA 字段（名称或组地址）中输入以关联 KNX GA；输入时会显示设备建议。

**一般的**

|属性|描述|
|--|--|
| KNX 网关 | 选择要使用的 KNX 网关 |
| Hue Bridge | 选择要使用的 Hue Bridge |
| Hue 温度传感器 | HUE 温度传感器（输入时自动补全） |
| 启动时读取状态 | 启动/重连时读取当前值并发送到 KNX（默认：否） |

**映射**

|属性|描述|
|--|--|
| 温度 | 温度（°C）的 KNX GA。推荐 DPT：<b>9.001</b> |

##### 输出

1. 标准输出
   : `msg.payload`（number）：当前温度（°C）

##### 详情

`msg.payload` 包含数值型温度。

---

<span id="hue-controller-docs-humidity" data-hue-controller-type="humidity"></span>

## 湿度 (`humidity`)

该节点从 HUE 湿度传感器读取相对湿度 (%) 并映射到 KNX。

在 GA 字段中开始输入（名称或组地址）以关联 KNX GA；输入时会显示匹配的设备。

**常规**

|属性|说明|
|--|--|
| KNX 网关 | 选择要使用的 KNX 网关 |
| HUE Bridge | 选择要使用的 HUE Bridge |
| HUE 传感器 | HUE 湿度传感器（输入时自动补全） |
| 启动时读取状态 | 启动/重新连接时读取当前值并发送到 KNX（默认：否） |

**映射**

|属性|说明|
|--|--|
| 湿度 | 相对湿度%的 KNX GA。推荐 DPT：<b>9.007</b> |

##### 输出

1. 标准输出
   : `msg.payload`（数字）：当前相对湿度 (%)

##### 详情

`msg.payload` 携带湿度的数值（百分比）。

---

<span id="hue-controller-docs-scene" data-hue-controller-type="scene"></span>

## 场景 (`scene`)

**Hue Scene** 节点将 Hue 场景发布到 KNX，并且可以把 Hue 的原始事件发送到 Node-RED 流程。场景字段支持自动补全；在网桥中新增场景后，请点击刷新图标更新列表。

##### 选项卡概览

- **映射** - 将 KNX 组地址与所选 Hue 场景关联。DPT 1.xxx 用于布尔控制，DPT 18.xxx 用于发送 KNX 场景号。
- **多场景** - 构建规则列表，将不同的 KNX 场景号映射到 Hue 场景，并选择 _active_ / _dynamic\_palette_ / _static_ 的调用方式。
- **行为** - 控制是否显示 Node-RED 输出引脚。未配置 KNX 网关时，引脚仍保持启用，以便桥接器事件继续进入流程。

##### 常规设置

| 属性 | 描述 |
|--|--|
| KNX 网关 | 提供自动补全地址目录的 KNX 网关。 |
| Hue Bridge | 承载场景的 Hue Bridge。 |
| HUE 场景 | 要调用的场景（支持自动补全；刷新按钮会重新获取列表）。 |

##### 映射选项卡

| 属性 | 描述 |
|--|--|
| 调用 | 调用场景的 KNX 组地址。使用 DPT 1.xxx 发送布尔值，或使用 DPT 18.xxx 发送 KNX 场景号。 |
| DPT | 与召回 GA 搭配使用的数据点类型（1.xxx 或 18.001）。 |
| 名称 | 召回 GA 的说明名称。 |
| # | 选择 KNX 场景 DPT 时显示，用于选择要发送的场景号。 |
| 状态 GA | 可选布尔 GA，用于反馈场景是否处于激活状态。 |

##### 多场景选项卡

| 属性 | 描述 |
|--|--|
| 调用 | 使用 DPT 18.001 的 GA，通过 KNX 场景号选择场景。 |
| 场景选择器 | 可编辑列表，将 KNX 场景号对应到 Hue 场景及其调用模式。拖动条可以重新排序。 |

> ℹ️ 只有在选择 KNX 网关后才会显示 KNX 相关控件；在同时配置好 Hue 网桥和 KNX 网关之前，映射选项卡会保持隐藏。

---

<span id="hue-controller-docs-device_power" data-hue-controller-type="device_power"></span>

## 电池 (`device_power`)

该节点会将 Hue 设备的电池电量同步到 KNX，并在数值变化时触发事件。

在 GA 字段输入 KNX 设备名称或组地址即可自动补全；点击"Hue 传感器”旁的刷新按钮可重新加载 Hue 设备列表。

**常规**

|属性|说明|
|--|--|
| KNX 网关 | 发布电量的 KNX 网关（选择后才会显示 KNX 映射设置）。|
| Hue Bridge | 使用的 Hue Bridge。|
| Hue 电池传感器 | 提供电量信息的 Hue 设备/传感器（支持自动补全与刷新）。|

**映射**

|属性|说明|
|--|--|
| 电量 | 电池百分比的 KNX 组地址（0-100%），推荐 DPT：<b>5.001</b>。|

**行为**

|属性|说明|
|--|--|
| 启动时读取状态 | 部署/重连时读取当前电量并发布到 KNX。默认值："是”。|
| 节点输出引脚 | 显示或隐藏 Node-RED 输出。当未选择 KNX 网关时，输出引脚会保持启用，确保 Hue 事件仍能进入流程。|

> ℹ️ 未选择 KNX 网关时，KNX 映射字段会自动隐藏，便于将节点作为纯 Hue → Node-RED 事件源使用。

---

<span id="hue-controller-docs-zigbee_connectivity" data-hue-controller-type="zigbee_connectivity"></span>

## Zigbee 连接 (`zigbee_connectivity`)

该节点从 HUE 设备读取 Zigbee 连接状态，并发布到 KNX。

在 GA 字段输入 KNX 设备名或组地址，输入时会自动联想。

**常规**

|属性|说明|
|--|--|
| KNX 网关 | 用于发布状态的 KNX 网关 |
| Hue Bridge | 要使用的 Hue Bridge |
| Hue Zigbee 连接 | 提供 Zigbee 连接信息的 HUE 传感器/设备（自动补全） |

**映射**

|属性|说明|
|--|--|
| 状态 | 映射 Zigbee 连接性的 KNX 组地址。连接时为 _true_，否则 _false_。|
| 启动时读取状态 | 在启动/重连时读取并发布至 KNX。默认："是”。|

##### 输出

1. 标准输出
   : payload (boolean)：连接状态。

##### 详情

`msg.payload` 为 true/false。\
`msg.status` 为文本： **connected, disconnected, connectivity\_issue, unidirectional\_incoming** 。

---

<span id="hue-controller-docs-device_software_update" data-hue-controller-type="device_software_update"></span>

## 设备软件更新 (`device_software_update`)

该节点监控 HUE 设备的软件更新状态，并发布到 KNX。

开始在GA字段中键入KNX设备的名称或组地址，可用的设备开始显示
您正在打字。

**一般的**

|属性|描述|
| - | - |
|KNX 网关 |选择要使用的KNX门户|
|色相桥|选择要使用的色调桥|
| Hue 设备 | 要监控的 HUE 设备（自动补全） |

**映射**

|属性|说明|
|--|--|
| 状态 | 映射软件更新的 KNX 组地址：可用/准备/安装中为 _true_，否则 _false_ |
| 启动时读取状态 | 启动/重连时读取并发布至 KNX（默认"是”） |

##### 输出

1. 标准输出
   : payload (boolean)：更新标志。
   : status (string)： **no\_update, update\_pending, ready\_to\_install, installing** 。

<!-- HUE_CONTROLLER_PROFILE_DOCS_END -->
