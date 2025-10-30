---
layout: wiki
title: "HUE Bridge configuration"
lang: zh-CN
permalink: /wiki/zh-CN-HUE%20Bridge%20configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Bridge%20configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Bridge%20configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Bridge%20configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Bridge%20configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Bridge%20configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Bridge%20configuration)

<h1>PHILIPS HUE NODES

</h1>

  <img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/huehub.jpg' width='40%'>

该节点负责将 Node-RED 注册到 Hue 网桥，并且现在会自动处理整个配对流程。

输入网桥的 IP（或从自动发现列表中选择一台）后点击 **CONNECT**。编辑器会持续轮询网桥，一旦按下实体配对按钮就会自动关闭等待窗口。如需取消等待并稍后再试，请点击 **CANCEL**。用户名和客户端密钥字段始终可编辑，方便在任何时候复制或粘贴凭据。

已经有凭据？点击 **我已有凭据**，即可立即显示这些字段并手动输入，无需等待网桥按钮。

**常规**

|属性|说明|
|--|--|
| IP | 输入 Hue 网桥的固定 IP，或从自动发现的列表中直接选择。|
| CONNECT | 启动注册并等待网桥的配对按钮。按下按钮后对话框会自动关闭；使用 **CANCEL** 可以终止等待。|
| Name | 注册成功后从 Hue 网桥读取的名称。|
| Username / Client Key | Hue 网桥在配对完成后返回的凭据。字段保持可编辑，便于复制、粘贴或手动输入。|

![image.png](../img/hude-config.png)
