---
layout: wiki
title: "HUE Bridge configuration"
lang: en
permalink: /wiki/HUE%20Bridge%20configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Bridge%20configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Bridge%20configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Bridge%20configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Bridge%20configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Bridge%20configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Bridge%20configuration)

<H1>PHILIPS HUE NODES

</H1>

 <img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/huehub.jpg' width='40%'>

This node registers Node-RED with the Hue Bridge and now handles the pairing handshake automatically.

Enter the bridge IP (or pick one from the discovery list) and click **CONNECT**. The editor will keep polling the bridge and closes the waiting dialog as soon as you press the physical link button. Use **CANCEL** if you need to abort the pairing and try again later. The Username and Client Key fields stay editable so you can copy or paste credentials at any time.

Already have credentials? Click **I ALREADY HAVE THE CREDENTIALS** to immediately show the fields and enter them manually without waiting for the bridge button.

**General**

|Property|Description|
|--|--|
| IP | Enter the fixed IP of your Hue Bridge or choose one of the discovered bridges from the list. |
| CONNECT | Starts the registration and waits for the bridge link button. The dialog closes automatically once the button is pressed; use **CANCEL** to stop waiting. |
| Name | Bridge name that is read back from the Hue Bridge after a successful connection. |
| Username / Client Key | Credentials returned by the Hue Bridge after pairing. They remain editable so you can copy or paste values manually if needed. |

![image.png](../img/hude-config.png)
