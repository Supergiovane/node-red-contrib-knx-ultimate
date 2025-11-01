---
layout: wiki
title: "Gateway-configuration"
lang: zh-CN
permalink: /wiki/zh-CN-Gateway-configuration/
---
# KNX Gateway 配置

该节点用于连接你的 KNX/IP 网关。

**常规**

|属性|说明|
|--|--|
| Name | 节点名称。|
| IP/Hostname | ETH/KNX 路由器的组播地址，或 KNX/IP 接口的单播 IP。若为接口，请填写设备 IP（如 192.168.1.22）；若为路由器，请填写组播 `224.0.23.12`。也可填写 **Hostname** 。|

**配置**

|属性|说明|
|--|--|
| IP Port | 端口，默认 `3671`。|
| IP Protocol | `Tunnel UDP` 适用于 KNX/IP 接口，`Multicast UDP` 适用于 KNX/IP 路由器。 **Auto** 为自动检测（默认）。|
| KNX Physical Address | 物理地址，如 `1.1.200`。默认 `15.15.22`。|
| Bind to local interface | 使用的本地网络接口。"Auto" 自动选择。若有多网卡（以太网/无线），建议手动指定，避免 UDP 丢包。|
| Automatically connect to KNX BUS at start | 启动时自动连接总线。默认 "Yes"。|
| Secure credentials source | 选择如何提供 KNX Secure 数据： **ETS 密钥环文件 ** （Data Secure 密钥及（若存在）隧道凭据来自密钥环）、**手动凭据 ** （仅启用 KNX IP 安全隧道，手动输入用户）或**密钥环 + 手动隧道密码** （Data Secure 由密钥环提供，隧道用户/密码手动输入）。注意：KNX Data Secure 报文始终需要密钥环文件。|
| Tunnel interface individual address | 当所选模式包含手动凭据时显示（手动凭据或密钥环 + 手动隧道密码）。可选的安全隧道 KNX 个人地址（如 `1.1.1`）；留空则由 KNX Ultimate 自动协商。|
| Tunnel user ID | 启用手动凭据时显示。可选的 KNX Secure 隧道用户 ID（在 ETS 中配置）。|
| Tunnel user password | 启用手动凭据时显示。输入 ETS 中配置的 KNX Secure 隧道用户密码。|

> **KNX Secure 概览** \
> • _KNX Data Secure_ 用于保护组地址报文， **始终** 需要包含组密钥的密钥环文件。\
> • _KNX IP Tunnelling Secure_ 通过调试密码保护连接握手，密码可根据模式从密钥环读取或在界面中手动输入。

**高级**

|属性|说明|
|--|--|
| Echo sent message to all node with same Group Address | 将来自流程的输入消息，转发给所有相同 GA 的节点，仿佛来自总线。在 KNX 模拟或未连总线时有用。 **该选项将来会废弃并默认启用。** |
| Suppress repeated (R-Flag) telegrams fom BUS | 忽略来自总线的重复报文（R 标志）。|
| Suppress ACK request in tunneling mode | 适用于非常老的 KNX/IP 网关：忽略 ACK 流程并接受所有报文。|
| Delay between each telegram (ms) | KNX 规范最多 50 报文/秒。一般 25-50ms 合适；若经慢速网络远程连接，建议提高到 200-500ms。|
| Loglevel | 日志级别（调试用）。默认 "Error"。|
| 节点状态节流 | 设置状态徽章的刷新频率。启用延时后，中间状态会被丢弃，只在所选间隔后显示最后一次状态。选择 **立即** 可以保持实时显示。|

**ETS 文件导入**

|属性|说明|
|--|--|
| If Group Address has no Datapoint | 当某组地址无 DPT 时：停止导入、跳过该 GA，或使用占位 DPT `1.001` 继续。|
| ETS group address list | 在此粘贴 ETS 导出的 CSV/ESF 内容，或填写文件路径（如 `/home/pi/mycsv.csv`）。详见帮助链接。|

**工具**

|属性|说明|
|--|--|
| Gather debug info for troubleshoot | 点击按钮收集信息并附在 GitHub issue 中，便于排查。|
| Get all used GA for KNX routing filter | 点击 READ 获取此网关在各流程中使用的全部 GA 列表，用于配置路由器过滤表。|

# 使用 ETS CSV 或 ESF 文件

与其为每个 GA 建一个节点，不如导入 ETS 组地址：推荐 CSV；ESF（v1.1.35 起）也支持（如 ETS Inside）。支持 ETS 4+。

自 v1.4.18 起，可直接在字段中填写文件路径（如 `/home/pi/mycsv.csv`）。

启用 **Universal mode (listen to all Group Addresses)** 后，该节点成为通用 I/O：了解 DPT、GA 与设备名。向节点发送 `payload` 时，它按正确 DPT 编码并发送；从总线接收时，按 ETS 中的 DPT 解码输出。

自 v1.1.11 起，即使没有 ETS 也可使用通用模式：通过消息提供 DPT 和数值。收到总线报文时，同时输出 RAW，并尝试在未知 DPT 下解码。

注意：CSV 含精确 DPT 及子类型；ESF 不含子类型。若两者皆可，请优先 CSV；ESF 可能导致数值错误。导入 ESF 后请校对 DPT。自 v1.4.1 起可通过 WatchDog 在运行时导入。

视频：<a href="https://youtu.be/egRbR_KwP9I"><img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png'></a>

### 导入 ETS CSV 组地址列表

**注意。** 组地址名称中不能包含制表符。如果 ETS 中某个 GA 没有配置 DPT，可选择停止导入、跳过该地址，或临时使用 `1.001` 的假 DPT 继续。

**从 ETS 导出 CSV**

1. 在 ETS 中打开 *组地址* 视图，右键列表并选择 **导出组地址**。
2. 在导出窗口设置：
   - **Output format：** CSV
   - **CSV format：** 1/1 Name/Address
   - **Export with header line：** 勾选
   - **CSV separator：** Tabulator
3. 导出后，将文件内容粘贴到 **ETS group address list** 字段（或直接提供文件路径）。

**导入时会发生什么**

- CSV 必须为每个组地址提供 DPT。
- 网关会解析文件，并在 Node-RED 的调试面板显示结果：
  - **ERROR** – 缺少 DPT，导入终止。
  - **WARNING** – 缺少子类型，系统会填充默认值，但建议手动检查（子类型是 DPT 中小数点后的数字，例如 `5.001`）。
- 字段应使用引号包裹，例如：

  

```

"Attuatori luci"	"0/-/-"	""	""	""	""	"Auto"
  

```

### 导入 ETS ESF 组地址列表

1. 在 ETS 项目页面点击导出图标（向上箭头），选择 **ESF** 格式（而非 `.knxprod`）。
2. 将导出的文件内容粘贴到网关的 **ETS group address list** 字段，或提供该文件的路径。

    <table style="font-size:12px">
        <tr><th colspan="2" style="font-size:14px">节点状态颜色说明</th></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greendot.png"></td><td>响应写报文</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greenring.png"></td><td>循环引用保护（<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki" target="_blank">查看页面</a>）</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluedot.png"></td><td>响应应答报文</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluering.png"></td><td>自动将节点值作为应答发送（<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device" target="_blank">Virtual Device</a>）</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greudot.png"></td><td>响应读报文</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greyring.png"></td><td>RBE 过滤：未发送报文</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/reddot.png"></td><td>错误或已断开</td></tr>
        <tr><td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/redring.png"></td><td>因循环引用而禁用（<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki" target="_blank">查看页面</a>）</td></tr>
    </table>
