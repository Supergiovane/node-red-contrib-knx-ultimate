---
layout: wiki
title: "-Sample---DPT237"
lang: en
permalink: /wiki/-Sample---DPT237
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237)
# Datapoint 237

Assuming you send a message from a **function node** , to a knx-ultimate node with Group Address and Datapoint properties set.<br/>

## Overview

ALI control gear diagnostic.<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/DPT237.png" width="90%"><br/>

**Sample**

```javascript

// DALI control gear diagnostic. Properties explanation:
// readResponse: true/false (FALSE means Response or spontaneus sending, TRUE means Read)
// addressIndicator: true/false (Indicates the type of DALI address. FALSE means Device Address, FALSE means Group Address)
// daliAddress: the DALI address
// lampFailure: true/false, ballastFailure: true/false , convertorError: true/false 
msg.payload={readResponse:false, addressIndicator:false, daliAddress:8, lampFailure:false, ballastFailure:false, convertorError:false};
return msg;

```

<details><summary>View code</summary>

> Adjust the nodes according to your setup

```javascript

[{"id":"4cc234cb.eb9b4c","type":"knxUltimate","z":"60f6999e.76232","server":"b60c0d73.1c02b","topic":"5/0/2","outputtopic":"","dpt":"237.600","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"notifyreadrequestalsorespondtobus":false,"notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized":"0","listenallga":false,"name":"DALI","outputtype":"write","outputRBE":false,"inputRBE":false,"formatmultiplyvalue":1,"formatnegativevalue":"leave","formatdecimalsvalue":999,"passthrough":"no","x":350,"y":120,"wires":[["4b2e57d9.334228"]]},{"id":"4b2e57d9.334228","type":"debug","z":"60f6999e.76232","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":490,"y":120,"wires":[]},{"id":"3e4ef226.f429ae","type":"function","z":"60f6999e.76232","name":"MSG","func":"// DALI control gear diagnostic. Properties explanation:\n// readResponse: true/false (FALSE means Response or spontaneus sending, TRUE means Read)\n// addressIndicator: true/false (Indicates the type of DALI address. FALSE means Device Address, FALSE means Group Address)\n// daliAddress: the DALI address\n// lampFailure: true/false, ballastFailure: true/false , convertorError: true/false \nmsg.payload={readResponse:false, addressIndicator:false, daliAddress:8, lampFailure:false, ballastFailure:false, convertorError:false};\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","x":230,"y":120,"wires":[["4cc234cb.eb9b4c"]]},{"id":"ef69c0a8.b88ba8","type":"inject","z":"60f6999e.76232","name":"Go","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":110,"y":120,"wires":[["3e4ef226.f429ae"]]},{"id":"e6acb1cb.d010f","type":"comment","z":"60f6999e.76232","name":" DALI control gear diagnostic","info":"","x":160,"y":80,"wires":[]},{"id":"b60c0d73.1c02b","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":false,"statusDisplayDeviceNameWhenALL":false,"statusDisplayDataPoint":false,"stopETSImportIfNoDatapoint":"stop","loglevel":"error","name":"Multicast","localEchoInTunneling":false,"delaybetweentelegrams":"","delaybetweentelegramsfurtherdelayREAD":""}]

```

</details>
