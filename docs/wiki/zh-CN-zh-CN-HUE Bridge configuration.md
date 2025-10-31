---
layout: wiki
title: "zh-CN-HUE Bridge configuration"
lang: zh-CN
permalink: /wiki/zh-CN-zh-CN-HUE%20Bridge%20configuration
---
---

<h1><p align='center'>PHILIPS HUE NODES</p></h1>
<br/>
<p align='center'>
<img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/huehub.jpg' width='40%'>
</p>

该节点用于向 HUE Bridge 注册。

设置 Bridge 的 IP，然后点击 **CONNECT** 。\
也可以手动填写凭据。

**常规**
|属性|说明|
|--|--|
| IP | HUE Bridge 的 IP（需固定）。|
| CONNECT | 开始与 HUE Bridge 的注册流程。点击 **CONNECT ** 后会自动读取 Bridge ID。之后可以选择注册新凭据，或**SET CREDENTIALS MANUALLY** 手工填写字段。|
| Name | HUE Bridge 的名称。|
| Reveal | 显示密钥对（Username 与 Client Key），便于复制到其他地方使用。|

![image.png](../img/hude-config.png)
