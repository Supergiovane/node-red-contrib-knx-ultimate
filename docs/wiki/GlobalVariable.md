🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) | [IT](/node-red-contrib-knx-ultimate/wiki/it-GlobalVariable) | [DE](/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-GlobalVariable) | [ES](/node-red-contrib-knx-ultimate/wiki/es-GlobalVariable) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable)
<!-- NAV START -->
Navigation: [Home](/node-red-contrib-knx-ultimate/wiki/Home)  
Overview: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) • [Security](/node-red-contrib-knx-ultimate/wiki/SECURITY) • [Docs: Language bar](/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar)  
KNX Device: [Gateway](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) • [Device](/node-red-contrib-knx-ultimate/wiki/Device) • [Protections](/node-red-contrib-knx-ultimate/wiki/Protections)  
Other KNX Nodes: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) • [Load Control](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) • [HA Translator](/node-red-contrib-knx-ultimate/wiki/HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/HUE+Bridge+configuration) • [Light](/node-red-contrib-knx-ultimate/wiki/HUE+Light) • [Battery](/node-red-contrib-knx-ultimate/wiki/HUE+Battery) • [Button](/node-red-contrib-knx-ultimate/wiki/HUE+Button) • [Contact](/node-red-contrib-knx-ultimate/wiki/HUE+Contact+sensor) • [Device SW update](/node-red-contrib-knx-ultimate/wiki/HUE+Device+software+update) • [Light sensor](/node-red-contrib-knx-ultimate/wiki/HUE+Light+sensor) • [Motion](/node-red-contrib-knx-ultimate/wiki/HUE+Motion) • [Scene](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/HUE+Tapdial) • [Temperature](/node-red-contrib-knx-ultimate/wiki/HUE+Temperature+sensor) • [Zigbee connectivity](/node-red-contrib-knx-ultimate/wiki/HUE+Zigbee+connectivity)  
Samples: [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/Manage-Wiki)
<!-- NAV END -->
---
# KNX GLOBAL VARIABLE
This node exposes the group address received from the bus, to a **global variable** <br/>
You can write to the KNX BUS by simply update the global variable!<br/>
## Overview
Put a Global Context Node into the flow, then give it a name.<br/>
The name you give to the node, will become the global context variable's name.<br/>
That's all. For security reasons, please **change the default node name** <br/>
You can access the global variable by adding the suffix \_READ to the node's name.<br/>
You can enable/disable the global context variable, or enable READONLY or READ/WRITE in the configuration window.<br/>
You can issue a KNX BUS write command, by simply modify the global variable name with suffix \_WRITE. _ **After the commands have been executed, the global variable with suffix \_WRITE is automatically emptied, not to infinitely repeat the commands. ** _ <br/>**Settings**
|Property|Description|
|--|--|
| Gateway | The KNX Gateway. |
| Variable Name | Name of the global context. 2 variables with this name will be created, one with \_READ suffix (for reading group addresses) and the other with \_WRITE suffix (for writing group addresses). For example, if the variable name is "KNXGlobalContext", the 2 variables KNXGlobalContext\_READ and KNXGlobalContext\_WRITE are created. Since the global variable is visible from all nodes (even non-KNX-Ultimate ones), for security reasons, set a name other than the default one. Click the sample link at the bottom of the page. |
| Expose as Global variable | Choose if and how you want to expose the global variable. If you do not intend to write on the KNX BUS, for safety, leave "read only". |
| BUS write interval | The node checks the variable with \_WRITE suffix at regular intervals to write on the KNX bus. Choose the interval you prefer. |
## MSG PROPERTIES
```javascript
// Properties of the variable, both in reading and in writing
{
    address : "0/0/1",
    dpt: "1.001",
    payload: true,
    devicename:"Dinning Room->Table Light"
}
```
# USAGE
## Global Context Node Sample
This node exposes the group address received from the bus, to a **global variable** <br/>
You can write to the KNX BUS by simply update the global variable!<br/>
## Overview
Put a Global Context Node into the flow, then give it a name.<br/>
The name you give to the node, will become the global context variable's name.<br/>
That's all. For security reasons, please **change the default node name** <br/>
You can access the global variable by adding the suffix \_READ to the node's name.<br/>
You can enable/disable the global context variable, or enable READONLY or READ/WRITE in the configuration window.<br/>
You can issue a KNX BUS write command, by simply modify the global variable name with suffix \_WRITE. _ **After the commands have been executed, the global variable with suffix \_WRITE is automatically emptied, not to infinitely repeat the commands.** _<br/>
<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/globalcontextnode.png" width="90%"><br/>
<br/>
### View code
> Adjust the nodes according to your setup
```javascript
[{"id":"ababb834.9073","type":"knxUltimateGlobalContext","z":"5ed79f4a958a1f20","server":"b60c0d73.1c02b","name":"KNXContextBanana","exposeAsVariable":"exposeAsVariableREADWRITE","writeExecutionInterval":"1000","x":230,"y":200,"wires":[]},{"id":"2954e7ea.f53988","type":"function","z":"5ed79f4a958a1f20","name":"Write to the KNXContextBanana variable","func":"// This function writes some values to the KNX bus\nlet GroupAddresses = [];\nGroupAddresses.push ({address: \"0/0/10\", dpt:\"1.001\", payload:true});\nGroupAddresses.push({ address: \"0/0/11\", dpt: \"1.001\", payload: true });\nGroupAddresses.push({ address: \"0/0/12\", dpt: \"1.001\", payload: false });\n\n// You can also avoid setting datapoint.\n// This works gread if you have imported the ETS file, otherwise it'll guess the datapoint type by analyzing the payload\nGroupAddresses.push ({address: \"0/0/14\", payload:false});\nGroupAddresses.push({ address: \"0/0/15\", payload: 50 });\n\n// Remember: add the string \"_WRITE\" after the node name to write to the bus\nglobal.set(\"KNXContextBanana_WRITE\",GroupAddresses);\n","outputs":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":480,"y":300,"wires":[]},{"id":"bd4380e3.8c1ea","type":"inject","z":"5ed79f4a958a1f20","name":"Call the function","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":220,"y":300,"wires":[["2954e7ea.f53988"]]},{"id":"269bf86a.34e9f8","type":"comment","z":"5ed79f4a958a1f20","name":"Exposing the Group Addresses to the global context variable","info":"","x":360,"y":160,"wires":[]},{"id":"f9a6ff93.086a","type":"function","z":"5ed79f4a958a1f20","name":"Read the KNXContextBanana variable","func":"// This function reads the variable\n// Remember: add the string \"_READ\" after the node name to read the variable\nlet GroupAddresses = global.get(\"KNXContextBanana_READ\") || [];\n\n// Outputs the array, as example\nnode.send({payload:GroupAddresses});\n\n// Get the Group Address object, having address 0/0/10\nlet Ga = GroupAddresses.find(a => a.address === \"0/0/10\");\n\n// Outputs the object, as example\nnode.send({ Found: Ga });\n\n// Do some testing and output some stuffs.\nif (Ga.payload === true) return {payload : \"FOUND AND TRUE\"};\nif (Ga.payload === false) return {payload : \"FOUND AND FALSE\"};\n\n","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":410,"y":420,"wires":[["f4109aa5.270e08"]]},{"id":"64c9e0f0.b13178","type":"inject","z":"5ed79f4a958a1f20","name":"Read","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":190,"y":420,"wires":[["f9a6ff93.086a"]]},{"id":"f4109aa5.270e08","type":"debug","z":"5ed79f4a958a1f20","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":630,"y":420,"wires":[]},{"id":"bf16d5a9.073b6","type":"comment","z":"5ed79f4a958a1f20","name":"Check global variable and do some stuffs","info":"","x":300,"y":380,"wires":[]},{"id":"85c342f08c9c4705","type":"comment","z":"5ed79f4a958a1f20","name":"This function writes some values to the bus","info":"","x":310,"y":260,"wires":[]},{"id":"b60c0d73.1c02b","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":false,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":true,"stopETSImportIfNoDatapoint":"fake","loglevel":"error","name":"Multicast","localEchoInTunneling":true,"delaybetweentelegrams":"","delaybetweentelegramsfurtherdelayREAD":"","ignoreTelegramsWithRepeatedFlag":false,"keyringFileXML":""}]
```
<br/>
## Get the variable's value
```javascript
// This function reads the variable
// Remember: add the string "_READ" after the node name to read the variable
let GroupAddresses = global.get("KNXContextBanana_READ") || [];
// Outputs the array, as example
node.send({payload:GroupAddresses});
// Get the Group Address object, having address 0/0/10
let Ga = GroupAddresses.find(a => a.address === "0/0/10");
// Outputs the object, as example
node.send({ Found: Ga });
// Do some testing and output some stuffs.
if (Ga.payload === true) return {payload : "FOUND AND TRUE"};
if (Ga.payload === false) return {payload : "FOUND AND FALSE"};
```
## Send KNX telegram via global variable
```javascript
// This function writes the value to the KNX bus
let GroupAddressesSend = [];
GroupAddressesSend.push({address: "0/0/10", dpt:"1.001", payload:msg.payload});
// You can also avoid setting datapoint.
// This works gread if you have imported the ETS file, otherwise it'll guess the datapoint type by analyzing the payload
GroupAddressesSend.push({address: "0/0/11", payload:msg.payload});
// Remember: add the string "_WRITE" after the node name to write to the bus
global.set("KNXContextBanana_WRITE",GroupAddressesSend);
```
# SAMPLE
<a href="/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode" target="_blank"><i class="fa fa-info-circle"></i>See this Sample</a>
