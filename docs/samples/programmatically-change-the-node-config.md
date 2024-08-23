# PROGRAMMATICALLY CHANGE THE NODE CONFIG

Assuming you send a message from a **function node**, to a knx-ultimate node with Group Address and Datapoint properties set.\


## Overview

It's possible to programmatically change the KNX-Ultimate node configuration, by sending msg.setConfig object to the node.\
The new configuration will be retained until next msg.setConfig or until restart/redeploy.\
All properties are optional, that means, you can change **only the properties you need**.

![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/setConfig.png)\


<details>

<summary>View code</summary>

Adjust the nodes according to your setup

```javascript

[{"id":"4cc234cb.eb9b4c","type":"knxUltimate","z":"60f6999e.76232","server":"b60c0d73.1c02b","topic":"5/0/2","outputtopic":"","dpt":"22.101","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"notifyreadrequestalsorespondtobus":false,"notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized":"0","listenallga":false,"name":"Light","outputtype":"write","outputRBE":false,"inputRBE":false,"formatmultiplyvalue":1,"formatnegativevalue":"leave","formatdecimalsvalue":999,"passthrough":"no","x":390,"y":120,"wires":[["4b2e57d9.334228"]]},{"id":"4b2e57d9.334228","type":"debug","z":"60f6999e.76232","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":530,"y":120,"wires":[]},{"id":"3e4ef226.f429ae","type":"function","z":"60f6999e.76232","name":"Set Config","func":"var config= {\n    setGroupAddress: \"0/1/2\",\n    setDPT: \"1.001\"\n};\nmsg.setConfig = config;\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":250,"y":120,"wires":[["4cc234cb.eb9b4c"]]},{"id":"ef69c0a8.b88ba8","type":"inject","z":"60f6999e.76232","name":"Go","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":110,"y":120,"wires":[["3e4ef226.f429ae"]]},{"id":"e6acb1cb.d010f","type":"comment","z":"60f6999e.76232","name":"Programmatically change the node config","info":"","x":200,"y":80,"wires":[]},{"id":"b60c0d73.1c02b","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":false,"statusDisplayDeviceNameWhenALL":false,"statusDisplayDataPoint":true,"stopETSImportIfNoDatapoint":"stop","loglevel":"error","name":"Multicast","localEchoInTunneling":true,"delaybetweentelegrams":"","delaybetweentelegramsfurtherdelayREAD":""}]

```

</details>

\


**Sample changing the properties**

```javascript

// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...)
var config= {
    setGroupAddress: "0/1/2",
    setDPT: "1.001"
};
msg.setConfig = config;
return msg;

```
