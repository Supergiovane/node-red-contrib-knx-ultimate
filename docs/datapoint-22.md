# Datapoint 22

Assuming you send a message from a **function node**, to a knx-ultimate node with Group Address and Datapoint properties set.\


## Overview

You can send to the BUS or receive from the BUS the RHCC Status.\
You can set all parameters you want. Every parameter is optional.\
Please respect the upper and lowercase letters.\
For the explanation of every single parameter, **please consult the KNX official documentation**

![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/DPT22.png)\


<details>

<summary>View code</summary>

Adjust the nodes according to your setup

```javascript

[{"id":"9dce5020.1120c","type":"debug","z":"79364100.31f758","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":530,"y":220,"wires":[]},{"id":"a0f2a0b7.e5b79","type":"knxUltimate","z":"79364100.31f758","server":"be65063d.13f6d","topic":"0/0/33","outputtopic":"","dpt":"22.101","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"notifyreadrequestalsorespondtobus":false,"notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized":"0","listenallga":false,"name":"22.101","outputtype":"write","outputRBE":false,"inputRBE":false,"formatmultiplyvalue":1,"formatnegativevalue":"leave","formatdecimalsvalue":999,"passthrough":"no","x":390,"y":220,"wires":[["9dce5020.1120c"]]},{"id":"49ee8550.ac5304","type":"function","z":"79364100.31f758","name":"Prepare object","func":"// You can set all parameters you want.\n// Every parameter is optional.\n// Please respect the upper and lowercase letters.\n// For help about meaning of each parameter, please see the sample in the Wiki\nvar s1={}; \n\ns1.Fault = true;\ns1.StatusEcoH = false;\ns1.TempFlowLimit = false;\ns1.TempReturnLimit = false;\ns1.StatusMorningBoostH = false;\ns1.StatusStartOptim = false;\ns1.StatusStopOptim = false;\ns1.HeatingDisabled = true;\ns1.HeatCoolMode = true;\ns1.StatusEcoC = false;\ns1.StatusPreCool = false;\ns1.CoolingDisabled = true;\ns1.DewPointStatus = false;\ns1.FrostAlarm = false;\ns1.OverheatAlarm = true;\n\nreturn {payload:s1};","outputs":1,"noerr":0,"x":240,"y":220,"wires":[["a0f2a0b7.e5b79"]]},{"id":"20340965.0ac3b6","type":"inject","z":"79364100.31f758","name":"","topic":"","payload":"true","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":90,"y":220,"wires":[["49ee8550.ac5304"]]},{"id":"2efbb2e3.6ccbfe","type":"comment","z":"79364100.31f758","name":"Set the DPT 22.101 status","info":"","x":130,"y":180,"wires":[]},{"id":"be65063d.13f6d","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":true,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":true,"stopETSImportIfNoDatapoint":"stop","loglevel":"error","name":"Multicast KNX Gateway","localEchoInTunneling":true,"delaybetweentelegrams":"50","delaybetweentelegramsfurtherdelayREAD":"1"}]

```

</details>

\
\


**Datapoint 22.101 RHCC Status**

```javascript

// You can set all parameters you want.
// Every parameter is optional.
// Please respect the upper and lowercase letters.
// For help about meaning of each parameter, please see the sample in the Wiki
var s1={}; 
s1.Fault = true;
s1.StatusEcoH = false;
s1.TempFlowLimit = false;
s1.TempReturnLimit = false;
s1.StatusMorningBoostH = false;
s1.StatusStartOptim = false;
s1.StatusStopOptim = false;
s1.HeatingDisabled = true;
s1.HeatCoolMode = true;
s1.StatusEcoC = false;
s1.StatusPreCool = false;
s1.CoolingDisabled = true;
s1.DewPointStatus = false;
s1.FrostAlarm = false;
s1.OverheatAlarm = true;
return {payload:s1};

```
