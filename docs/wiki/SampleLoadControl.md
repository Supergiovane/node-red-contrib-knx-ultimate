---
layout: wiki
title: "SampleLoadControl"
lang: en
permalink: /wiki/SampleLoadControl/
---
## LOAD CONTROL SAMPLE

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/LoadControlSimple.png" width="90%"><br/>

In this example, you can see how the Load Control works.<br/>
Just put a Load Control node and leave it work.

**Copy this code and paste it into your flow**

<details><summary>View code</summary>

> Adjust the nodes according to your setup

```javascript

[{"id":"a3a1f9a93681b9c1","type":"knxUltimateLoadControl","z":"6fb79a67cdb91157","server":"5e540685a6f45bf0","name":"Home Total Consumption","topic":"5/4/2","dpt":"14.056","wattLimit":"3000","sheddingCheckInterval":"15","sheddingRestoreDelay":"60","GA1":"0/1/1","DPT1":"1.001","Name1":"Washing machine","autoRestore1":false,"MonitorGA1":"5/4/3","MonitorDPT1":"14.056","MonitorName1":"Wh Washing machine","GA2":"0/1/8","DPT2":"1.001","Name2":"Oven","autoRestore2":true,"MonitorGA2":"5/4/4","MonitorDPT2":"14.056","MonitorName2":"Wh Oven","GA3":"0/1/9","DPT3":"1.001","Name3":"Thermal Inverter","autoRestore3":true,"MonitorGA3":"","MonitorDPT3":"1.001","MonitorName3":"","GA4":"","DPT4":"1.001","Name4":"","autoRestore4":false,"MonitorGA4":"","MonitorDPT4":"1.001","MonitorName4":"","GA5":"","DPT5":"1.001","Name5":"","autoRestore5":false,"MonitorGA5":"","MonitorDPT5":"1.001","MonitorName5":"","x":210,"y":120,"wires":[["57cc07b3164dacb3"]]},{"id":"57cc07b3164dacb3","type":"debug","z":"6fb79a67cdb91157","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":410,"y":120,"wires":[]},{"id":"52aed36938991e9a","type":"comment","z":"6fb79a67cdb91157","name":"Load control with shedding stages","info":"","x":230,"y":80,"wires":[]},{"id":"5e540685a6f45bf0","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","hostProtocol":"Multicast","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":true,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":false,"stopETSImportIfNoDatapoint":"stop","loglevel":"error","name":"KNX Gateway","localEchoInTunneling":true,"delaybetweentelegrams":"50","delaybetweentelegramsfurtherdelayREAD":"1","ignoreTelegramsWithRepeatedFlag":false,"keyringFileXML":"","autoReconnect":"yes"}]

```

</details>

<br/>
<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/LoadControl.png" width="90%"><br/>

In this example, you can see the external commands you can send to the node. These are totally OPTIONAL, as the node handles alle the load by itself.

**Copy this code and paste it into your flow**

<details><summary>View code</summary>

> Adjust the nodes according to your setup

```javascript

[{"id":"a3a1f9a93681b9c1","type":"knxUltimateLoadControl","z":"e2999439eaab99b3","server":"5e540685a6f45bf0","name":"Home Total Consumption","topic":"5/4/2","dpt":"14.056","wattLimit":"3000","sheddingCheckInterval":"15","sheddingRestoreDelay":"60","GA1":"0/1/1","DPT1":"1.001","Name1":"Washing machine","autoRestore1":false,"MonitorGA1":"5/4/3","MonitorDPT1":"14.056","MonitorName1":"Wh Washing machine","GA2":"0/1/8","DPT2":"1.001","Name2":"Oven","autoRestore2":true,"MonitorGA2":"5/4/4","MonitorDPT2":"14.056","MonitorName2":"Wh Oven","GA3":"0/1/9","DPT3":"1.001","Name3":"Thermal Inverter","autoRestore3":true,"MonitorGA3":"","MonitorDPT3":"1.001","MonitorName3":"","GA4":"","DPT4":"1.001","Name4":"","autoRestore4":false,"MonitorGA4":"","MonitorDPT4":"1.001","MonitorName4":"","GA5":"","DPT5":"1.001","Name5":"","autoRestore5":false,"MonitorGA5":"","MonitorDPT5":"1.001","MonitorName5":"","x":350,"y":180,"wires":[["57cc07b3164dacb3"]]},{"id":"57cc07b3164dacb3","type":"debug","z":"e2999439eaab99b3","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":550,"y":180,"wires":[]},{"id":"d0519ab4fdd98f9e","type":"inject","z":"e2999439eaab99b3","name":"Reset","props":[{"p":"reset","v":"true","vt":"bool"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":110,"y":140,"wires":[["a3a1f9a93681b9c1"]]},{"id":"c1484c7288602eb3","type":"inject","z":"e2999439eaab99b3","name":"Read Status","props":[{"p":"readstatus","v":"true","vt":"bool"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":130,"y":180,"wires":[["a3a1f9a93681b9c1"]]},{"id":"5c92c8f0b5f689ae","type":"inject","z":"e2999439eaab99b3","name":"Enable","props":[{"p":"enable","v":"true","vt":"bool"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":110,"y":220,"wires":[["a3a1f9a93681b9c1"]]},{"id":"8e692908ddf5eb12","type":"inject","z":"e2999439eaab99b3","name":"Disable","props":[{"p":"disable","v":"true","vt":"bool"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":110,"y":260,"wires":[["a3a1f9a93681b9c1"]]},{"id":"52aed36938991e9a","type":"comment","z":"e2999439eaab99b3","name":"Load control with shedding stages","info":"","x":190,"y":100,"wires":[]},{"id":"5e540685a6f45bf0","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","hostProtocol":"Multicast","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":true,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":false,"stopETSImportIfNoDatapoint":"stop","loglevel":"error","name":"KNX Gateway","localEchoInTunneling":true,"delaybetweentelegrams":"50","delaybetweentelegramsfurtherdelayREAD":"1","ignoreTelegramsWithRepeatedFlag":false,"keyringFileXML":"","autoReconnect":"yes"}]

```

</details>

<br/>
<br/>
<br/>
