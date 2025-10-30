🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-SceneController-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-SceneController-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-SceneController-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-SceneController-Configuration)
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
<p>The scene controllre node, behaves exactly as a scene controller KNX device. It's capable of saving and recalling a scene.</p>
# SCENE CONTROLLER NODE SETTINGS
| Property | Description |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| Gateway | Selected KNX gateway. |
| Scene Recall | **Datapoint ** and**Trigger Value ** . Group Address for scene recall. Example 0/0/1. The scene controller will react to telegrams coming from this group address, to recall the scene. The datapoint is the datapoint type (DPT) of the _scene recall_ group address. The Trigger Value is the value that must be reveived, to trigger the scene recall.**Remember ** : to trigger a scene or save a scene via a DIM command, put in the scene recall or scene save**trigger value** , the correct object for dimming ({decr\_incr:1,data:5} for dim increase, {decr\_incr:0,data:5} for dim decrease) |
| Scene Save | **Datapoint ** and**Trigger Value ** . Group Address for saving a scene. Example 0/0/2. The scene controller will react to telegrams coming from this group address, by saving all the current values of all devices in the scene, that can be recalled later. Every time you press, or long press a real knx pushbutton in your building, the scene controller will read the values of all devices in the scene and save it in a non volatile storage. The datapoint is the datapoint type (DPT) of the _scene save_ group address. The Trigger Value is the value that must be reveived, to trigger the scene saving.**Remember ** : to trigger a scene or save a scene via a DIM command, put in the scene recall or scene save**trigger value** , the correct object for dimming ({decr\_incr:1,data:5} for dim increase, {decr\_incr:0,data:5} for dim decrease) |
| Node name | Node name, in the format "Recall: device name used to recall the scene / Save: device name for saving the scene". But you can set whatever name you want. |
| Topic | Node's topic. |
## SCENE CONFIGURATION
You need to add devices to the scene, like a standard real scene controller knx device. This is a list, each row represents a device.
_ **The scene node automatically saves the updated values of all actuators belonging to the scene, whenever it receives a new value from the BUS.** _
| Property | Description |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| ADD button | Add a row to the list. |
| Row's field | First field is the group address, second is the datapoint, third is the default value for this device in the scene (this can be overridden by the _scene save_ function). Below, is the device name.<br/> To insert a _pause_, type **wait ** in the first field and a number in the last field, that represents the time (in milliseconds) of the pause, for example**2000 ** <br/><br>The**wait ** command accept also values indicating seconds, minutes or hours.<br>To set a value in seconds, add**s ** after the numeric value, for example (**12s ** )<br>To set a value in minutes, add**m ** after the numeric value, for example (**5m ** )<br>To set a value in hours, add**h ** after the numeric value, for example (**1h** ) |
| Remove button | Remove a device from the list. |
# MESSAGE OUTPUT FROM THE SCENE CONTROLLER NODE
```javascript
msg = {
    topic: "Scene Controller" <i>(Contains the node's topic, for example "MyTopic").</i>
    recallscene: <i>(<b>true</b> if a scene has been recalled, otherwise <b>false</b>).</i>
    savescene: <i>(<b>true</b> if a scene has been saved, otherwise <b>false</b>).</i>
    savevalue: <i>(<b>true</b> if a group address value belonging to an actuator in the scene, has been manually saved by a msg input, otherwise <b>false</b>).</i>
    disabled: <i>(<b>true</b> if the scene controller has been disabled via input message msg.disabled = true, otherwise <b>false</b>).</i>
}
```
---
# INPUT FLOW MESSAGE
The Scene Controller node reacts primarly to KNX telegrams and rely to that to recall and save scenes.
You can, however, recall and save scenes by sending a msg to the node. The scene controller can be disabled to inhibite the commands coming from the KNX Bus.
**RECALL A SCENE**
```javascript
// Example of a function that recall the scene
msg.recallscene = true;
return msg;
```
**SAVE A SCENE**
```javascript
// Example of a function that saves the scene
msg.savescene = true;
return msg;
```
**SAVE CURRENT VALUE OF A GROUP ADDRESS ** _**The scene node already saves the updated values of all actuators belonging to the scene.** _
Sometimes it is useful to be able to save the current value of a group address that is different from the one entered in the scene, as the real value of the scene actuator.
For example, a shutter actuator usually has a command group address and a status one.
The node saves the scene by taking command group address values, which may not be aligned with the true state value.
However, you can work around this by manually updating the command group address value, taking it from the status group address.
Think this: if you have a blind actuator, having a group address for move, a group address for step, a group address for absolute height etc... the only group address knowing the exact position of the blind, is the **absolute height value status** group address. <br/>
With this status group address, you can update the command group addresses of the blind actuators belonging to the scene. Please see the sample in the wiki.
```javascript
// Example of a function that saves the status of a blind actuator, belongind to the scene.
msg.savevalue = true;
msg.topic = "0/1/1";
msg.payload = 70;
return msg;
```
**DISABLE SCENE CONTROLLER**
You can disable the scene controller (it disables the reception of telegram from KNX BUS but the node still accept the input msg from the flow instead). Sometime is advisable to disable the recall and save of a scene, for example, when it's night and you call, from a KNX Pushbutton, a "TV Scene" that raises or lowers a blind, the scene won't be recalled or saved. Instead, you can enable another scene, just for night, for example to dim a series of lights.
```javascript
// Example of disabling the scene controller. The commands coming from KNX BUS will be disabled. The node still accept the input msg from the flow instead!
msg.disabled = true; // Otherwise "msg.disabled = false" to re-enable the node.
return msg;
```
## SEE ALSO
[Sample Scene Controller](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)
