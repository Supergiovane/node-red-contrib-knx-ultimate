# Datapoint 213

Assuming you send a message from a **function node**, to a knx-ultimate node with Group Address and Datapoint properties set.<br/>

## Overview
You can set the Setpoint and Setpointshift with 3x16 bit Floating Point value.<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/DPT213.png" width="90%"><br/>

These 4 property names, are valid for 213.101, 213.102 etc... as well.<br/>
For example, for 213.101, LegioProtect is the "Comfort" property, Normal is "Standby", etc...

<details><summary>View code</summary>

> Adjust the nodes according to your setup


```javascript

[{"id":"4cc234cb.eb9b4c","type":"knxUltimate","z":"60f6999e.76232","server":"b60c0d73.1c02b","topic":"5/0/2","outputtopic":"","dpt":"213.100","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"notifyreadrequestalsorespondtobus":false,"notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized":"0","listenallga":false,"name":"HeatActuator","outputtype":"write","outputRBE":false,"inputRBE":false,"formatmultiplyvalue":1,"formatnegativevalue":"leave","formatdecimalsvalue":999,"passthrough":"no","x":430,"y":240,"wires":[["4b2e57d9.334228"]]},{"id":"4b2e57d9.334228","type":"debug","z":"60f6999e.76232","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":610,"y":240,"wires":[]},{"id":"3e4ef226.f429ae","type":"function","z":"60f6999e.76232","name":"4x Setpoints","func":"// Sample of 213.100.\n// Set the temperatures between -272°C and 655.34°C with 0,02°C of resolution.\n// These 4 property names, are valid for 213.101, 213.102 etc... as well.\n// For example, for 213.101, LegioProtect is the \"Comfort\" property, Normal is \"Standby\", etc...\nmsg.payload = {Comfort:21.4, Standby:20, Economy:18.2, BuildingProtection:-1};\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":270,"y":240,"wires":[["4cc234cb.eb9b4c"]]},{"id":"ef69c0a8.b88ba8","type":"inject","z":"60f6999e.76232","name":"Go","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":130,"y":240,"wires":[["3e4ef226.f429ae"]]},{"id":"e6acb1cb.d010f","type":"comment","z":"60f6999e.76232","name":"Set temperature with 4 x 16 bit, DPT213","info":"","x":220,"y":200,"wires":[]},{"id":"b60c0d73.1c02b","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":false,"statusDisplayDeviceNameWhenALL":false,"statusDisplayDataPoint":false,"stopETSImportIfNoDatapoint":"stop","loglevel":"error","name":"Multicast","localEchoInTunneling":false,"delaybetweentelegrams":"","delaybetweentelegramsfurtherdelayREAD":""}]

```
</details>