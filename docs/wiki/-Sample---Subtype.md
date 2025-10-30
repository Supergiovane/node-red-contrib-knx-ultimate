---
layout: wiki
title: "-Sample---Subtype"
lang: en
permalink: /wiki/-Sample---Subtype
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype)
# Subtype Value Sample

KNX-Ultimate outputs a subtype decoded value, based on datapoint subtype. You can use this to, for example, send a readable message to a LCD display.<br/>

## Subtype value

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/subtypevalue.png" width="90%"><br/>

**Copy this code and paste it into your flow**

<details><summary>View code</summary>

> Adjust the nodes according to your setup

```javascript

[{"id":"243c2d0c.7797ea","type":"knxUltimate","z":"9c542773.7c176","server":"123ea2c2.4a920d","topic":"12/1/1","outputtopic":"","dpt":"1.005","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"notifyreadrequestalsorespondtobus":false,"notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized":"","listenallga":false,"name":"Alarm","outputtype":"write","outputRBE":false,"inputRBE":false,"x":250,"y":140,"wires":[["43158f37.7603e"]]},{"id":"e8145922.6e3ea","type":"debug","z":"9c542773.7c176","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","x":550,"y":200,"wires":[]},{"id":"2f917bef.280694","type":"knxUltimate","z":"9c542773.7c176","server":"123ea2c2.4a920d","topic":"12/1/1","outputtopic":"","dpt":"1.009","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"notifyreadrequestalsorespondtobus":false,"notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized":"","listenallga":false,"name":"Garage","outputtype":"write","outputRBE":false,"inputRBE":false,"x":240,"y":200,"wires":[["43158f37.7603e"]]},{"id":"318b3259.13822e","type":"knxUltimate","z":"9c542773.7c176","server":"123ea2c2.4a920d","topic":"12/1/1","outputtopic":"","dpt":"1.018","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"notifyreadrequestalsorespondtobus":false,"notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized":"","listenallga":false,"name":"Briefing room","outputtype":"write","outputRBE":false,"inputRBE":false,"x":220,"y":260,"wires":[["43158f37.7603e"]]},{"id":"43efb43a.a30964","type":"inject","z":"9c542773.7c176","name":"","topic":"","payload":"false","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":90,"y":80,"wires":[["c3c88eb8.a898b"]]},{"id":"c3c88eb8.a898b","type":"knxUltimate","z":"9c542773.7c176","server":"123ea2c2.4a920d","topic":"12/1/1","outputtopic":"","dpt":"1.005","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"notifyreadrequestalsorespondtobus":false,"notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized":"","listenallga":false,"name":"Dummy","outputtype":"write","outputRBE":false,"inputRBE":false,"x":240,"y":80,"wires":[[]]},{"id":"43158f37.7603e","type":"function","z":"9c542773.7c176","name":"Msg","func":"return {payload:\"The state of \" + msg.devicename + \", is \" + msg.payloadsubtypevalue};","outputs":1,"noerr":0,"x":410,"y":200,"wires":[["e8145922.6e3ea"]]},{"id":"71e3ef4b.79c128","type":"comment","z":"9c542773.7c176","name":"Sample of using the subtype decoded value","info":"","x":190,"y":40,"wires":[]},{"id":"123ea2c2.4a920d","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":false,"statusDisplayDeviceNameWhenALL":false,"statusDisplayDataPoint":false}]

```

</details>
