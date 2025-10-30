---
layout: wiki
title: "zh-CN-SceneController-Configuration"
lang: zh-CN
permalink: /wiki/zh-CN-zh-CN-SceneController-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-SceneController-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-SceneController-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration)
---

# Scene Controller（场景控制器）

该节点与 KNX 场景控制器一致：可以保存和召回场景。

## 节点设置

| 属性 | 说明 |
|--|--|
| Gateway | 选择的 KNX 网关。|
| Scene Recall | **Datapoint ** 与**Trigger Value** 。用于召回场景的组地址（如 `0/0/1`）。节点在此 GA 收到报文即召回场景。DPT 为召回 GA 的类型；Trigger Value 为触发召回所需的数值。提示：若用 DIM 方式触发，请设置正确的调光对象值（`{decr_incr:1,data:5}` 上调、`{decr_incr:0,data:5}` 下调）。|
| Scene Save | **Datapoint ** 与**Trigger Value** 。用于保存场景的组地址（如 `0/0/2`）。节点在收到报文时，保存场景内所有设备的当前值（非易失存储）。DPT 为保存 GA 的类型；Trigger Value 触发保存（DIM 同上）。|
| Node name | 节点名称（可写"Recall: … / Save: …”）。|
| Topic | 节点的 topic。|

## 场景配置

像真实 KNX 场景控制器一样，为场景添加设备；每行表示一个设备。

一旦从总线接收到新值，节点会自动记录该场景内执行器的最新值。

| 属性 | 说明 |
|--|--|
| ADD 按钮 | 新增一行。|
| 行字段 | 1）组地址 2）Datapoint 3）默认场景值（可被 Scene Save 覆盖）。下方为设备名。<br/> 插入暂停：在第一列填 **wait ** ，最后一列填时长（毫秒），如 `2000`。<br/>**wait** 也支持秒/分/小时：`12s`、`5m`、`1h`。|
| Remove | 移除该设备行。|

## 节点输出```javascript
msg = {
  topic: "Scene Controller",
  recallscene: true|false,
  savescene: true|false,
  savevalue: true|false,
  disabled: true|false
}
```---

## 输入消息（INPUT）

节点主要依靠 KNX 报文进行场景的召回/保存；也可通过消息进行控制。可禁用来自总线的命令，仅接受流程消息。

**召回场景** ```javascript
msg.recallscene = true; return msg;
``` **保存场景** ```javascript
msg.savescene = true; return msg;
``` **保存某条 GA 的当前值**

虽然场景会自动跟踪执行器的数值，但在某些情况下需要以"真实场景值”记录另一条 GA（如状态而非命令）的当前值。

例如卷帘：绝对高度的状态 GA 才能反映准确位置。可用该状态 GA 去更新场景内相关执行器的命令 GA。```javascript
msg.savevalue = true;
msg.topic = "0/1/1"; // GA
msg.payload = 70; // 要保存的值
return msg;
``` **禁用 Scene Controller**

禁用来自 KNX 总线的命令（仍接受流程消息）。例如夜间不希望从实体按钮召回/保存场景时很有用。```javascript
msg.disabled = true; // false 重新启用
return msg;
```## 参见

[Sample Scene Controller](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)
