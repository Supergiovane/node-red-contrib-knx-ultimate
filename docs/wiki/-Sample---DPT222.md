---
layout: wiki
title: "-Sample---DPT222"
lang: en
permalink: /wiki/-Sample---DPT222
---
# Datapoint 222

Assuming you send a message from a **function node** , to a knx-ultimate node with Group Address and Datapoint properties set.<br/>

## Overview

You can set the Setpoint and Setpointshift with 3x16 bit Floating Point value.<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/DPT222.png" width="90%"><br/>

**Setpoint, Datpoint 222.100 or 222.101**

```javascript

msg.payload = {Comfort:21.44, Standby:20, Economy:18.22};
return msg;

```

<details><summary>View code</summary>

> Adjust the nodes according to your setup

```javascript

[{"id":"4cc234cb.eb9b4c","type":"knxUltimate","z":"340feb6f.0c0cec","server":"b60c0d73.1c02b","topic":"5/0/1","outputtopic":"","dpt":"222.100","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"notifyreadrequestalsorespondtobus":false,"notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized":"0","listenallga":false,"name":"Setpoint","outputtype":"write","outputRBE":false,"inputRBE":false,"formatmultiplyvalue":1,"formatnegativevalue":"leave","formatdecimalsvalue":999,"passthrough":"no","x":360,"y":120,"wires":[["4b2e57d9.334228"]]},{"id":"4b2e57d9.334228","type":"debug","z":"340feb6f.0c0cec","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":510,"y":120,"wires":[]},{"id":"3e4ef226.f429ae","type":"function","z":"340feb6f.0c0cec","name":"Setpoint","func":"msg.payload = {Comfort:21.44, Standby:20, Economy:18.22};\nreturn msg;","outputs":1,"noerr":0,"x":220,"y":120,"wires":[["4cc234cb.eb9b4c"]]},{"id":"ef69c0a8.b88ba8","type":"inject","z":"340feb6f.0c0cec","name":"Go","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":90,"y":120,"wires":[["3e4ef226.f429ae"]]},{"id":"e6acb1cb.d010f","type":"comment","z":"340feb6f.0c0cec","name":"Set temperature with 3 x 16 bit Float value DPT222.x","info":"","x":210,"y":80,"wires":[]},{"id":"b60c0d73.1c02b","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":false,"statusDisplayDeviceNameWhenALL":false,"statusDisplayDataPoint":false,"stopETSImportIfNoDatapoint":"stop","loglevel":"error","name":"Multicast","localEchoInTunneling":false,"delaybetweentelegrams":"","delaybetweentelegramsfurtherdelayREAD":""}]

```

</details>
