---
layout: wiki
title: "Logger-Configuration"
lang: zh-CN
permalink: /wiki/zh-CN-Logger-Configuration
---
# Logger（日志）

Logger 节点会记录所有报文，并输出一份与 ETS Bus Monitor 兼容的 XML 文件。

你可以用 file 节点将其保存到磁盘，或发送到 FTP 等。该文件可在 ETS 中用于诊断或回放报文。
该节点还可统计报文数量（每秒或自定义间隔）。 
 <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample" target="_blank">示例在此</a>

## 设置

|属性|说明|
|--|--|
| 网关 | KNX 网关。|
| 主题名 | 节点的 topic。|
| 节点名称 | 节点名称。|

## ETS 兼容的总线诊断文件

|属性|说明|
|--|--|
| 自动启动定时器 | 在部署或启动时自动启动定时器。|
| 新的 payload 每 (分钟) | 用于控制 payload 输出和/或写入文件的间隔。当启用文件保存时，到达配置的最大行数后，文件会执行**轮换**，优先删除最早的行。|
| 最大行数 (0 = 没有限制) | XML 的最大行数；旧行会先被删除。0 表示不限制。当同时启用文件保存时，该值也表示文件允许的最大行数；达到限制后，文件会执行**轮换**，并逐步删除最早的行。|
| 操作 | 仅发送 payload，或发送并保存到文件。|
| 文件路径（绝对或相对） | 选择保存 XML 的路径（当启用保存时）。|

## KNX 报文计数器

|属性|说明|
|--|--|
| 自动启动定时器 | 在部署或启动时自动启动定时器。|
| 计数间隔（秒） | 以秒为单位向流程输出计数的间隔。|

---

# 节点输出

**PIN 1：ETS 兼容的 XML**

使用 file 节点保存 `msg.payload`，或发送至 FTP 等。

```javascript

msg = {
  topic: "MyLogger",
  payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." // XML 字符串
}
```

**PIN 2：KNX 报文计数**

每个计数周期输出：

```javascript

msg = {
  topic: "",
  payload: 10,
  countIntervalInSeconds: 5,
  currentTime: "25/10/2021, 11:11:44"
}
```

---

# 输入消息（INPUT）

ETS 兼容 XML 控制

**启动计时器**

```javascript

msg.etsstarttimer = true; return msg;
```

**停止计时器**

```javascript

msg.etsstarttimer = false; return msg;
```

**立即输出 XML**

```javascript

// 立刻输出 XML；若计时器在运行，则一并重启
msg.etsoutputnow = true; return msg;
```

报文计数器控制

**启动计时器**

```javascript

msg.telegramcounterstarttimer = true; return msg;
```

**停止计时器**

```javascript

msg.telegramcounterstarttimer = false; return msg;
```

**立即输出计数**

```javascript

msg.telegramcounteroutputnow = true; return msg;
```

## 参见

- [Sample Logger](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
