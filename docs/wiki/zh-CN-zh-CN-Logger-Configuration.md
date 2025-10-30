---
layout: wiki
title: "zh-CN-Logger-Configuration"
lang: zh-CN
permalink: /wiki/zh-CN-zh-CN-Logger-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration)
---


# Logger（日志）

Logger 节点会记录所有报文，并输出一份与 ETS Bus Monitor 兼容的 XML 文件。

你可以用 file 节点将其保存到磁盘，或发送到 FTP 等。该文件可在 ETS 中用于诊断或回放报文。
该节点还可统计报文数量（每秒或自定义间隔）。<br/> <a href="/node-red-contrib-knx-ultimate/wiki/Logger-Sample" target="_blank">示例在此</a>

## 设置

|属性|说明|
|--|--|
| Gateway | KNX 网关。|
| Topic | 节点的 topic。|
| Name | 节点名称。|

## ETS 兼容的总线诊断文件

|属性|说明|
|--|--|
| Auto start timer | 在部署或启动时自动启动定时器。|
| Output new XML every (in minutes) | 多少分钟输出一次 ETS 兼容的 XML。|
| Max number of rows in XML (0 = no limit) | XML 在该时间窗口内的最大行数；0 表示不限制。|

## KNX 报文计数器

|属性|说明|
|--|--|
| Auto start timer | 在部署或启动时自动启动定时器。|
| Count interval (in seconds) | 以秒为单位向流程输出计数的间隔。|

---

# 节点输出

**PIN 1：ETS 兼容的 XML**

使用 file 节点保存 `msg.payload`，或发送至 FTP 等。```javascript
msg = {
  topic: "MyLogger",
  payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." // XML 字符串
}
``` **PIN 2：KNX 报文计数**

每个计数周期输出：```javascript
msg = {
  topic: "",
  payload: 10,
  countIntervalInSeconds: 5,
  currentTime: "25/10/2021, 11:11:44"
}
```---

# 输入消息（INPUT）

ETS 兼容 XML 控制

**启动计时器** ```javascript
msg.etsstarttimer = true; return msg;
``` **停止计时器** ```javascript
msg.etsstarttimer = false; return msg;
``` **立即输出 XML** ```javascript
// 立刻输出 XML；若计时器在运行，则一并重启
msg.etsoutputnow = true; return msg;
```报文计数器控制

**启动计时器** ```javascript
msg.telegramcounterstarttimer = true; return msg;
``` **停止计时器** ```javascript
msg.telegramcounterstarttimer = false; return msg;
``` **立即输出计数** ```javascript
msg.telegramcounteroutputnow = true; return msg;
```## 参见

- [Sample Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
