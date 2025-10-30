# Datapoint 2

Assuming you send a message from a **function node** , to a knx-ultimate node with Group Address and Datapoint properties set.<br/>

## Overview

You can set a value true/false with priority.<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/DPT2.png" width="90%"><br/>

**Setpoint, Datpoint 2.x 1 bit with priority**

```javascript

// Send a true/false with priority
// priority = true or false
// data = true or false
msg.payload = {priority:false, data:true};
return msg;

```

<details><summary>View code</summary>

> Adjust the nodes according to your setup

```javascript

[{"id":"44230f28.9a3d2","type":"inject","z":"b814d990.9a268","name":"","topic":"","payload":"true","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":90,"y":300,"wires":[["ed48e945.4baf48"]]},{"id":"d6bb4e6e.903d4","type":"inject","z":"b814d990.9a268","name":"","topic":"","payload":"false","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":90,"y":340,"wires":[["ed48e945.4baf48"]]},{"id":"69058175.b0288","type":"knxUltimate","z":"b814d990.9a268","server":"be65063d.13f6d","topic":"12/0/1","outputtopic":"","dpt":"2.001","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"notifyreadrequestalsorespondtobus":false,"notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized":"0","listenallga":false,"name":"Plafoniera soggiorno [switch]","outputtype":"write","outputRBE":false,"inputRBE":false,"formatmultiplyvalue":1,"formatnegativevalue":"leave","formatdecimalsvalue":999,"passthrough":"no","x":400,"y":300,"wires":[["32fd9263.0fff0e"]]},{"id":"32fd9263.0fff0e","type":"debug","z":"b814d990.9a268","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"payload","targetType":"msg","x":630,"y":300,"wires":[]},{"id":"ed48e945.4baf48","type":"function","z":"b814d990.9a268","name":"","func":"// Send a true/false with priority\n// priority = true or false\n// data = true or false\nmsg.payload = {priority:false, data:msg.payload};\nreturn msg;","outputs":1,"noerr":0,"x":210,"y":300,"wires":[["69058175.b0288"]]},{"id":"9e9f0ab2.df5b78","type":"comment","z":"b814d990.9a268","name":"DPT 2.* 1 bit controlled (wito priority)","info":"","x":160,"y":260,"wires":[]},{"id":"be65063d.13f6d","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":true,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":false,"stopETSImportIfNoDatapoint":"stop","loglevel":"debug","name":"Multicast KNX Gateway","localEchoInTunneling":true,"delaybetweentelegrams":"50","delaybetweentelegramsfurtherdelayREAD":"1"}]

```

</details>
