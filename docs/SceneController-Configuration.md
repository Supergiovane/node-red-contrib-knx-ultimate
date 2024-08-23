<!-- <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/simple2.png" width="40%"><br/> -->
## SCENE CONTROLLER NODE SETTINGS

- **Gateway**

  > Selected KNX gateway.

- **Scene Recall**, **Datapoint** and **Trigger Value**

  > Group Address for scene recall. Example 0/0/1. The scene controller will react to telegrams coming from this group address, to recall the scene. The datapoint is the datapoint type (DPT) of the *scene recall* group address. The Trigger Value is the value that must be reveived, to trigger the scene recall. **Remember**: to trigger a scene or save a scene via a DIM command, put in the scene recall or scene save **trigger value**, the correct object for dimming ({decr_incr:1,data:5} for dim increase, {decr_incr:0,data:5} for dim decrease)


- **Scene Save**, **Datapoint** and **Trigger Value**

  > Group Address for saving a scene. Example 0/0/2. The scene controller will react to telegrams coming from this group address, by saving all the current values of all devices in the scene, that can be recalled later. Every time you press, or long press a real knx pushbutton in your building, the scene controller will read the values of all devices in the scene and save it in a non volatile storage. The datapoint is the datapoint type (DPT) of the *scene save* group address. The Trigger Value is the value that must be reveived, to trigger the scene saving. **Remember**: to trigger a scene or save a scene via a DIM command, put in the scene recall or scene save **trigger value**, the correct object for dimming ({decr_incr:1,data:5} for dim increase, {decr_incr:0,data:5} for dim decrease)


- **Node name**

  > Node name, in the format "Recall: device name used to recall the scene / Save: device name for saving the scene". But you can set whatever name you want.

- **Topic**
  > Node's topic.

## SCENE CONFIGURATION

You need to add devices to the scene, like a standard real scene controller knx device. This is a list, each row represents a device.<br/>
***The scene node automatically saves the updated values of all actuators belonging to the scene, whenever it receives a new value from the BUS.***

- **ADD button**

  > Add a row to the list.

- **Row's field**

  > First field is the group address, second is the datapoint, third is the default value for this device in the scene (this can be overridden by the *scene save* function). Below, is the device name.<br/> To insert a *pause*, type **wait** in the first field and a number in the last field, that represents the time (in milliseconds) of the pause, for example **2000** <br/>
  > The **wait** command accept also values indicating seconds, minutes or hours.<br/>
  > To set a value in seconds, add **s** after the numeric value, for example (**12s**)<br/>
  > To set a value in minutes, add **m** after the numeric value, for example (**5m**)<br/>
  > To set a value in hours, add **h** after the numeric value, for example (**1h**)<br/>

- **Remove button**

  > Remove a device from the list.

<br/>
<br/>

---

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
<br/>

---

# INPUT FLOW MESSAGE

The Scene Controller node reacts primarly to KNX telegrams and rely to that to recall and save scenes.<br/>
You can, however, recall and save scenes by sending a msg to the node. The scene controller can be disabled to inhibite the commands coming from the KNX Bus.

**RECALL A SCENE** <br/>

```javascript

// Example of a function that recall the scene
msg.recallscene = true; 
return msg;

```

**SAVE A SCENE** <br/>

```javascript

// Example of a function that saves the scene
msg.savescene = true; 
return msg;

```

**SAVE CURRENT VALUE OF A GROUP ADDRESS** <br/>
***The scene node already saves the updated values of all actuators belonging to the scene.***
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

**DISABLE SCENE CONTROLLER** <br/>
You can disable the scene controller (it disables the reception of telegram from KNX BUS but the node still accept the input msg from the flow instead). Sometime is advisable to disable the recall and save of a scene, for example, when it's night and you call, from a KNX Pushbutton, a "TV Scene" that raises or lowers a blind, the scene won't be recalled or saved. Instead, you can enable another scene, just for night, for example to dim a series of lights.

```javascript

// Example of disabling the scene controller. The commands coming from KNX BUS will be disabled. The node still accept the input msg from the flow instead!
msg.disabled = true; // Otherwise "msg.disabled = false" to re-enable the node.
return msg;

```

## SEE ALSO
* *SAMPLES*
  * [Sample Scene Controller](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)