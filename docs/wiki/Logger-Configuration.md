🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration)
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
# Logger
<p>The Logger node records all telegrams and outputs it in an ETS bus monitor XML compatible file.</p>
<br/>
You can save the file on disk or send it to an FTP server, for example. The file can be then read by your ETS, for example for diagnostic or for a replay of the telegrams.
<br/>
The node can also count telegrams per second (or any interval you want).
<br/> <a href="/node-red-contrib-knx-ultimate/wiki/Logger-Sample" target="_blank">Examples are here.</a>
<br/>
## SETTINGS
|Property|Description|
|--|--|
| Gateway | The KNX gateway. |
| Topic | The topic of the node. |
| Name | Node name. |
## ETS compatible BUS Diagnostic File
|Property|Description|
|--|--|
| Auto start timer | Starts the timer automatically on deploy or on node-red start. |
| Output new XML every (in minutes) | The time, in minutes, which the Logger will output the ETS XML bus monitor compatible file. |
| Max number of rows in XML (0 = no limit) | Starts the timer automatically on deploy or on node-red start. |
| Auto start timer | This represents the maximum number of line, that the XML file can contain in the interval specified above. Put 0 not to limit the number of rows in the file. |
| Max number of rows in XML (0 = no limit) | This represents the maximum number of line, that the XML file can contain in the interval specified above. Put 0 not to limit the number of rows in the file. |
<br/>
## KNX Telegram Counter
|Property|Description|
|--|--|
| Auto start timer | Starts the timer automatically on deploy or on node-red start. |
| Count interval (in seconds) | How often emit a msg to the flow, containing the KNX telegrams count. In Seconds. |
<br/>
---
# MESSAGE OUTPUT FROM THE LOGGER
**PIN 1: XML ETS bus monitor compatible file File**
You can use a file node to save the payload to the filesystem, or you can send it, for example, to an FTP server.
```javascript
msg = {
        topic:"MyLogger"
        payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." (A String containing the XML file)
    }
```
<br/><br/>
**PIN 2: KNX Telegram Counter**
Each count, the node will emit a telegram like this:
```javascript
msg = {
        topic:"",
        payload:10,
        countIntervalInSeconds:5,
        currentTime:"25/10/2021, 11:11:44"
    }
```
<br/>
---
# INPUT FLOW MESSAGE
You can control the Logger in some ways.
## ETS XML compatible BUS monitor file
**START TIMER** <br/>
```javascript
// Start the timer
msg.etsstarttimer = true;
return msg;
```
**STOP TIMER** <br/>
```javascript
// Start the timer
msg.etsstarttimer = false;
return msg;
```
**IMMEDIATELY OUTPUT A PAYLOAD WITH THE ETS FILE** <br/>
```javascript
// Output payload. Restart timer as well (in case the timer was active)
msg.etsoutputnow = true;
return msg;
```
## KNX TELEGRAM COUNTER
**START TIMER** <br/>
```javascript
// Start the timer
msg.telegramcounterstarttimer = true;
return msg;
```
**STOP TIMER** <br/>
```javascript
// Start the timer
msg.telegramcounterstarttimer = false;
return msg;
```
**IMMEDIATELY OUTPUT TELEGRAM COUNT MESSAGE** <br/>
```javascript
// Output payload.
msg.telegramcounteroutputnow = true;
return msg;
```
## SEE ALSO
- _SAMPLES_
  - [Sample Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
