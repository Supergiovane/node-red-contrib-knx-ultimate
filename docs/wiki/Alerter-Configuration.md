🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Alerter-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Alerter-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Alerter-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Alerter-Configuration)
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
# ALERTER NODE CONFIGURATION
With the Alerter node you can signal to a display or to the node-red-contrib-tts-ultimate node (audio feedback) if the selected devices are alerted, i.e. they have payload **true** .
The node issues messages at specified intervals (one message at a time) containing the details of each alerted device. For example, the node can tell you how many and which windows are open. <br/>
The node receives the values of the devices directly from the KNX BUS. Furthermore, you can send personalized messages to the node, not linked to KNX devices. <br/>
The example page explains how to use the node. <br/>
- **Gateway**
> KNX gateway selected. It is also possible not to select any gateway; in this case, only incoming messages to the node will be considered.
- **Name**
> Node name.
- **Alerting cycle start type**
> Here you can select the event that will skip the start of sending messages from alerted devices.
- **Interval between each MSG (in seconds)**
> Interval between each outgoing message from the node.
## DEVICES TO MONITOR
Here you can add devices to monitor. <br/>
Enter the device name or its group address. <br/>
- **Read value of each device on connection/reconnect**
> On connection/reconnection, the node will send a 'read' request each device belonging to the list.
- **ADD button**
> Add a row to the list.
- **Device's rows ** > The first field is the group address (but you can also enter any text, which you can use with inbound messages, see the example page), the second is the device name**(MAX 14 CHARS)** , the third is the long device name.
- **DELETE button**
> Removes a device from the list.
<br/>
<br/>
## MESSAGE OUT OF THE NODE
PIN1: The node emits a message for each alerted device, at selectable intervals.<br/>
PIN2: The node emits a unique message containing all alerted devices.<br/>
PIN3: The node emits a message containing only the last alerted device.<br/>
**PIN1**
```javascript
msg = {
    "topic":"0/1/12",
    "count":3, // TOTAL number of alerted devices
    "devicename":"Bedroom window",
    "longdevicename":"Bedroom main window",
    "payload":true
}
```
**PIN2**
```javascript
msg = {
    "topic":"door, 0/0/11, 0/1/2, 0/0/9",
    "devicename":"Main Door, Applique soggiorno, Applique taverna, Luce studio",
    "longdevicename":"Main entry Door, Applique sinistra soggiorno, Applique destra taverna, Luce soffitto studio",
    "count":4,
    "payload":true
    }
```
**PIN3**
```javascript
msg = {
    "topic":"0/1/12",
    "count":3, // TOTAL number of alerted devices
    "devicename":"Bedroom window",
    "longdevicename":"Bedroom main window",
    "payload":true
}
```
Outgoing message when all devices are at rest
**PIN1, PIN2, PIN3**
```javascript
msg = {
    "topic":"",
    "count":0,
    "devicename":"",
    "longdevicename":"",
    "payload":false
}
```
<br/>
<br/>
## MESSAGE INTO THE NODE
```javascript
msg.readstatus = true
```
Read the value of each device belonging to the list.
```javascript
msg.start = true
```
The sending cycle of all alerted devices begins. The cycle ends with the last alerted device. To repeat the cycle, send this inbound message again.
<br/>
**Custom device alert** <br/>
To update the true/false value of a custom device, you can send this inbound message
```javascript
msg = {
    "topic":"door",
    "payload":true // Or false to reset the alert for this device
}
```
<br/>
## SAMPLE
<a href="/node-red-contrib-knx-ultimate/wiki/SampleAlerter">CLICK HERE FOR THE EXAMPLE</a>
<br/>
<br/>
<br/>
