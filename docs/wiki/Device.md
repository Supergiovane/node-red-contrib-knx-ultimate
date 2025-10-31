---
layout: wiki
title: "Device"
lang: en
permalink: /wiki/Device
---
## KNX-ULTIMATE DEVICE NODE SETTINGS

This node lets you control a KNX Group Address, this is the most used node.  

[<i class="fa fa-code"></i> Here you'll find some samples](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-SamplesHome)

**Configuration**

|Property|Description|
|--|--|
| Gateway | Select the KNX gateway to be used |
| GA Type dropdown list | The group address type. **3-Levels ** is the default, where you can type the _3 level group address_ or the _group address name_ (if you've upload the ETS file), or**Global ** , for reading the GA at startup from a global variable, or**Flow ** that do the same as the _Global_, but at flow level. Select**$Env variable ** to read the group address from an environment variable. Select**Universal mode (listen to all Group Addresses)** to react to ALL group addresses.|
| Group Addr. | The KNX Group Address you want to control. If you've imported the ETS group addresses file, you can just start typing in your device name. You can leave it empty if you wish set it with _msg.setConfig_ input message. |
| Datapoint | The datapoint belonging to your node.|

### Manual command button

The editor can expose a per-node button that manually issues a KNX command without wiring an inject node.

|Property|Description|
|--|--|
| Show manual button | When enabled the small button appears on the node tile both in the palette and in the flow editor. |
| Button action | Choose what happens when you click the button. **Send KNX read** issues a standard read telegram. **Toggle boolean (write)** is available for datapoint type 1.x and alternates between _true_ and _false_ each time you click the button. **Write custom value** sends the value you provide (the value must be compatible with the configured datapoint). |
| Initial toggle state | (Boolean datapoints only) Sets the starting value used by the toggle action. The state automatically keeps in sync with telegrams that the node receives from KNX. |
| Custom value | The payload used by the custom value mode. You can enter any JSON literal: for example `42`, `true`, `"text"` or `{ "red": 255, "green": 0 }`. |

The button is only displayed when the option is enabled. If the node works in universal mode the read action is disabled because the target group address would be unknown.

## TAB Advanced options

|Property|Description|
|--|--|
|| **General properties** |
| Node name | Self explaining. |
| Topic | The msg output topic. Leave it blank to have it set to your Group Address. |
| Passthrough | If set, you can pass the input mgs to the output msg. |
|| **From node's INPUT PIN to KNX BUS** |
| Telegram type | _write_ to send write telegram (usually, you want that), otherwise you can choose the telegram's type to react to. |
| RBE filter | _Report by change_ filter. If set, only the msg input (from the Flow) having different values each time, will be sent to the KNX bus. If you intend to send everytime the same value, turn it off. If enabled, "rbe" indication will be added to node's name.|
|| **From KNX BUS to node's ouput PIN** |
| Read status on start | Read group address status, every time Node-Red starts and at every reconnection to the KNX Gateway. The node stores all group address values to a file, so you can choose wether to read from file or from the KNX bus. |
| RBE filter | _Report by change_ filter. If set, only the msg output (to KNX bus) having different values each time, will be sent to the msg output's flow. If you intend to send everytime the same value, leave it off. If enabled, "rbe" indication will be added to node's name. |
| React to write telegrams | The node will react (will send a msg to the flow) each time it receives a _write_ telegram from the KNX bus. Usually, you want that. |
| React to response telegrams | The node will react (will send a msg to the flow) each time it receives a _response_ telegram from the KNX bus. Usually, you want that for particular scenarios. |
| React to read telegrams | The node will react (will send a msg to the flow) each time it receives a _read_ telegram from the KNX bus. Usually, you want that if you're want to send a custom value to the KNX BUS. |
| Multiply | Multiplies or divides the payload value. Works only if the value is a number. |
| Decimals | Round or handle decimals in any way. Works only if the value is a number. |
| Negatives | Handles the negative values. Works only if the value is a number. |

## TAB KNX Function

You can use Javascript to modify the behaviour of the input msg coming from the flow and the output telegram sent to the KNX bus.\
The embedded code editor provides useful objects and functions to retrieve the value of all group addresses, both with the imported ETS file and without (specifying the datapoint).\
The script is called everytime the node receives a msg from the flow or a telegram from the KNX BUS.\
If enabled, "f(x)" indication will be added to node's name.

|Property|Description|
|--|--|
| Search GA | It's a helper only avaiable if the ETS file has been imported. Start typing and select the group address you wish to add to the code. Then copy the full field and paste it into the getGAValue function. 
 **getGAValue('0/0/1 table nord lamp')** |

### List of common object and functions you can use in the code

|Object or Function|Description|
|--|--|
| msg (object) | The current msg object received by the node. |
| getGAValue (string GA, optional string DPT) | Get the specified GA's value, for example **'1/0/1' ** , or also**'1/0/1 Bed table light' ** (All text after a blank space will be ignored by the function. This is useful if you want to add the GA name as a reminder. With the ETS file imported, you can also copy and paste the GA and GA Name directly from the**Search GA ** field.).**DPT** is optional if you've imported the ETS file, otherwise you must specify it, for example '1.001'. |
| setGAValue (string GA, any value, optional string DPT) | Set the specified GA's value. The GA con be wrote for example **'1/0/1' ** , or also**'1/0/1 Bed table light' ** (All text after a blank space will be ignored by the function. This is useful if you want to add the GA name as a reminder. With the ETS file imported, you can also copy and paste the GA and GA Name directly from the**Search GA ** field.). The**value ** is mandatory, can be a boolean or number or string,**DPT** is optional if you've imported the ETS file, otherwise you must specify it, for example '1.001'. |
| self (any value) | Set the currend node's value and sends the value to the KNX BUS as well. For example, _self(false)_. Caution using **self** function in the _From KNX BUS to node's OUTPUT PIN_ code, because the code will be executed everytime a KNX telegram is received, so you coud have recurrency loops. |
| toggle (nothing) | Toggle the currend node's value and sends the value to the KNX BUS as well. For example, _toggle()_. Caution using **toggle** function in the _From KNX BUS to node's OUTPUT PIN_ code, because the code will be executed everytime a KNX telegram is received, so you coud have recurrency loops. |
| node (object) | The node object. |
| RED (Node-Red object) | The Node-Red's RED object. |
| return (msg) | Mandatory `return msg;`, if you want to emit the message. Otherwise, using `return;` will not emit any message. |

### From KNX BUS to node's OUTPUT PIN

In this sample, we'll send the input msg to the KNX BUS only if another GA has opposite value.\
We'll turn on the light only if it's status GA is off, and vice versa.

```javascript
const statusGA = getGAValue('0/0/09','1.001');
if (msg.payload !== statusGA){ // "!==" means "not equal"
    return msg;
}else{
    // Both values are identical, so i don't send the msg.
    return;
}
```

Here, if someone switches on the light, we turn on another light 0/1/8 and after 2 seconds we switch off the lamp connected to the node.

```javascript
if (msg.payload){ 
    setGAValue('0/1/8',true)
    setTimeout(function() {
        self(off);
    }, 2000);
}
return msg;
```

### From KNX BUS to node's ouput PIN

In this sample, we'll emit the msg object to the flow, by appending the value of another GA to the output msg.\
The ouput msg to the flow will have also the external temp in the property `msg.externalTemperature`

```javascript
// The current msg contains the internal temperature in the "msg.payload" property, but we want to emit the external temperature as well.
msg.externalTemperature = getGAValue('0/0/10'); // In case the ETS file is missing, you must specify the dpt as well: getGAValue('0/0/10','9.001')
return msg;
```

In this other sample, we'll not emit a msg to the flow, in case msg.payload and another GA value are both false.

```javascript
if (msg.payload === false && getGAValue('0/0/11','1.001') === false){
    // Both false, don't emit the msg to the flow.
    return;
}else{
    // Ok, emit it.
    return msg;
}
```

## TAB Payload sample

|Property|Description|
|--|--|
| Sample | This will give it a hint on what to write in an external function node, if you want to control the node via a Node-Red function node. |

### Inputs

 **destination (string) ** : the destination group address, for example 1/1/0. Only 3-level is allowed. 
**payload (any) ** : the payload to be sent. Can be for example true or false, or an object. 
**event (string) ** : can be _GroupValue\_Write_ to write the telegram to the KNX BUS, _GroupValue\_Response_ to send a response telegram to the KNX BUS, _Update\_NoWrite_. _Update\_NoWrite_ sends nothings to the KNX BUS, just updates the internal value of the KNX-Ultimate node. This is useful if you wanna only store the value into the node and read it later with a read request. 
**readstatus (boolean) ** : issue a read request to the KNX bus. Pass _true_ everytime (msg.readstatus = true). 
**dpt (string) ** : For example "1.001". Sets the Datapoint. 
**writeraw (buffer) ** : is used to send a value to the KNX bus, as buffer. Use in conjunction with _bitlenght_. 
**bitlenght (int) ** : specifies the lenght of the _writeraw_ buffer. Use in conjunction with _writeraw_. 
**resetRBE (boolean) ** : resets the internal RBE filters (_use msg.resetRBE = true_). 
**setConfig (json)** : programmatically change the KNX-Ultimate Device node Group Address and Datapoint. See details.

### Details

`msg.setConfig`: It's possible to programmatically change the KNX-Ultimate node configuration, by sending msg.setConfig object to the node.
The new configuration will be retained until next msg.setConfig or until restart/redeploy.
All properties (_setGroupAddress_ and _setDPT_) **are mandatory** ..\
Use it like that, in a functon node:

**Set both GA and DPT**

```javascript
// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to **auto** , the datapoint will be read from the ETS file (if present).
var config= {
    setGroupAddress: "0/1/2",
    setDPT: "1.001"
};
msg.setConfig = config;
return msg;
```

**Set GA and read the datapoint from the ETS file**

```javascript
// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to "auto", the datapoint will be read from the ETS file (if present).
var config= {
    setGroupAddress: "0/1/2",
    setDPT: "auto"
};
msg.setConfig = config;
return msg;
```

### Outputs

1. Standard output
   : payload (string|number|object)\*\* : Pin 1 is the standard output of the command.

2. Errors
   : error (object)\*\* : Pin 2 Contains the detailed error message.

### Details

`msg.payload` is used as the payload of the group address (the group address value).
This is, instead, an example of the complete msg object.

```json
msg = {
    topic: "0/1/2" // (Contains the node's topic, for example "MyTopic". If the node's topic is not set, contains the Group Address, for example "0/1/2")
    payload: false 
    previouspayload: true // Previous node payload value.
    payloadmeasureunit: "%" // Payload's measure unit.
    payloadsubtypevalue: "Start" // Subtype's decoded value, for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm
    devicename: "Dinning table lamp" // If the node is in **universal mode** , it contains the full path (main, middle,name) of the group address name, otherwise, the node name.
    gainfo: { // Contains the details about the group address name and number. This object is only present if the node is set in **universal mode ** and with the**ETS file ** been imported. If something wrong, it contains the string**unknown** .
        maingroupname:"Light actuators"
        middlegroupname:"First flow lights"
        ganame:"Table Light"
        maingroupnumber:"1"
        middlegroupnumber:"1"
        ganumber:"0"
    },
    echoed:true, // True if the msg is coming from the input PIN, otherwise false if the msg is coming form the KNX BUS.
    knx: { // This is a representation of the KNX BUS telegram, coming from BUS
        event: "GroupValue_Write" // (or "GroupValue_Response", or "GroupValue_Read")
        dpt: "1.001"
        dptdesc: "Humidity" // Payload's measure unit description
        source: "15.15.22"
        destination: "0/1/2" // Contains the Group Address
        rawValue: buffer[1]raw // (or null, if "GroupValue_Read")
            0: 0x0 // (This is the RAW undecoded value)
    }
}
```

**Payload sample**

|Property|Description|
|--|--|
| Sample | This will give it a hint on what to write in an external function node, if you want to control the node via a Node-Red function node. |

### Inputs

: destination (string)\*\* : the destination group address, for example 1/1/0. Only 3-level is allowed.\
: payload (any)\*\* : the payload to be sent. Can be for example true or false, or an object.
: event (string)\*\* : can be _GroupValue\_Write_ to write the telegram to the KNX BUS, _GroupValue\_Response_ to send a response telegram to the KNX BUS, _Update\_NoWrite_. _Update\_NoWrite_ sends nothings to the KNX BUS, just updates the internal value of the KNX-Ultimate node. This is useful if you wanna only store the value into the node and read it later with a read request.
: readstatus (boolean)\*\* : issue a read request to the KNX bus. Pass _true_ everytime (msg.readstatus = true).
: dpt (string)\*\* : For example "1.001". Sets the Datapoint.
: writeraw (buffer): is used to send a value to the KNX bus, as buffer. Use in conjunction with _bitlenght_.
: bitlenght (int): specifies the lenght of the _writeraw_ buffer. Use in conjunction with _writeraw_.
: resetRBE (boolean)\*\* : resets the internal RBE filters (_use msg.resetRBE = true_).
: setConfig (json)\*\* : programmatically change the KNX-Ultimate Device node Group Address and Datapoint. See details.

### Details

`msg.setConfig`: It's possible to programmatically change the KNX-Ultimate node configuration, by sending msg.setConfig object to the node.
The new configuration will be retained until next msg.setConfig or until restart/redeploy.
All properties (_setGroupAddress_ and _setDPT_) **are mandatory** ..\
Use it like that, in a functon node:

**Set both GA and DPT**

```javascript
// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to **auto** , the datapoint will be read from the ETS file (if present).
var config= {
    setGroupAddress: "0/1/2",
    setDPT: "1.001"
};
msg.setConfig = config;
return msg;
```

**Set GA and read the datapoint from the ETS file**

```javascript
// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to "auto", the datapoint will be read from the ETS file (if present).
var config= {
    setGroupAddress: "0/1/2",
    setDPT: "auto"
};
msg.setConfig = config;
return msg;
```

### Outputs

1. Standard output
   : payload (string|number|object)\*\* : Pin 1 is the standard output of the command.

2. Errors
   : error (object)\*\* : Pin 2 Contains the detailed error message.

### Details

`msg.payload` is used as the payload of the group address (the group address value).
This is, instead, an example of the complete msg object.

```json
msg = {
    topic: "0/1/2" // (Contains the node's topic, for example "MyTopic". If the node's topic is not set, contains the Group Address, for example "0/1/2")
    payload: false 
    previouspayload: true // Previous node payload value.
    payloadmeasureunit: "%" // Payload's measure unit.
    payloadsubtypevalue: "Start" // Subtype's decoded value, for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm
    devicename: "Dinning table lamp" // If the node is in **universal mode** , it contains the full path (main, middle,name) of the group address name, otherwise, the node name.
    gainfo: { // Contains the details about the group address name and number. This object is only present if the node is set in **universal mode ** and with the**ETS file ** been imported. If something wrong, it contains the string**unknown** .
        maingroupname:"Light actuators"
        middlegroupname:"First flow lights"
        ganame:"Table Light"
        maingroupnumber:"1"
        middlegroupnumber:"1"
        ganumber:"0"
    }
    knx: { // This is a representation of the KNX BUS telegram, coming from BUS
        event: "GroupValue_Write" // (or "GroupValue_Response", or "GroupValue_Read")
        dpt: "1.001"
        dptdesc: "Humidity" // Payload's measure unit description
        source: "15.15.22"
        destination: "0/1/2" // Contains the Group Address
        rawValue: buffer[1]raw // (or null, if "GroupValue_Read")
            0: 0x0 // (This is the RAW undecoded value)
    }
}
```

## MESSAGE OUTPUT FROM THE NODE SET AS "Universal mode (listen to all Group Addresses)"

Here you have 2 options: import ETS cvs file or not. 

Importing your ETS file is the <b>aboslute suggested method</b>. If you import your ETS file, the node will do the datapoint decoding automatically and gives you the device name as well.

If you do not import the ETS, the node will output the RAW telegram and it tries to decode it as well.

```javascript

msg = {
    topic: "0/1/2" // (Contains the Group Address of the incoming telegram)
    payload: false // (Automatically decoded telegram. If you've <b>not imported the ETS file</b>, the node will try to decode the telegram <b>but you can obtain an erroneus value</b>)
    payloadmeasureunit: "%" // (payload's measure unit)
    payloadsubtypevalue: "Start" // (Subtype's decoded value, for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm.)
    devicename: "(First Floor->Dinning Room) Dinning table lamp" // (the node will output the complete path of your house, including the device name, or the node's name in case you've <b>not imported the ETS file</b> )) 
    knx: 
        event: "GroupValue_Write" // (or "GroupValue_Response", or "GroupValue_Read")
        dpt: "1.001" // (If you've <b>not imported the ETS file</b>, this represents the datapoint used to try to decode the telegram)
        dptdesc: "Humidity" // (payload's measure unit description)
        source: "15.15.22"
        destination: "0/1/2" // (Contains the Group Address of the incoming telegram, same as topic)
        rawValue: buffer[1]raw // (or null, if "GroupValue_Read")
            0: 0x0 // (This is the RAW undecoded value)
    }}
 
```

## OUTPUT MESSAGE IN VIRTUAL DEVICE

Here you'll find a sample of [Virtual Device](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device)

```javascript

 {
   topic: '5/0/1',
   payload: true,
   devicename: 'Light Status',
   event: 'Update_NoWrite',
   eventdesc: "The value has been updated from another node and hasn't been received from KNX BUS",
   previouspayload: true
 }
 
```

---

# INPUT FLOW MESSAGE

## CONTROLLING KNX DEVICES

The node accepts msg from the flow to be sent out to KNX bus and send out msg to the flow as soon KNX message arrive from the bus.

Supposing you provided a Group Address and a Datapoint to the node, either manually or with auto populating fields by selecting your device from the device's list after you've importet the ETS file.

You can also override one or more parameters set in the KNX-Ultimate config window.

All properties below are optional, except for the payload.

**msg.destination** 

For example, "0/0/1". Set the 3-level Group Address you wanna update.

**msg.payload** 

For example, true/false/21/"Hello". Set the payload you want to send to the KNX BUS.

**msg.event** 

"GroupValue\_Write": writes the telegram to the KNX BUS.

"GroupValue\_Response": sends a response telegram to the KNX BUS.

"Update\_NoWrite": sends nothings to the KNX BUS, just updates the internal value of the KNX-Ultimate node. This is useful if you wanna only store the value into the node and read it later with a read request.

CAUTION: in case of _msg.event = "Update\_NoWrite"_ all nodes with the same group address will emit to the flow a msg like this:

```javascript

{
  topic: '5/0/1',
  payload: true,
  devicename: 'Light Status',
  event: 'Update_NoWrite',
  eventdesc: "The value has been updated from another node and hasn't been received from KNX BUS",
  previouspayload: true
}

```

If you wish to issua a "read" command, please use "readstatus" instead (see below).

**msg.readstatus = true** 

Issue a "Read" command to the BUS.

**msg.dpt** 

For example "1.001". Sets the <b>Datapoint</b>. (You can write it in these formats: 9 , "9" , "9.001" or "DPT9.001")

**msg.writeraw ** 
**msg.bitlenght** 

Writes RAW data to the KNX BUS. Please see below an example.

**msg.resetRBE** 
 pass msg.resetRBE = true to a device node, to reset both input and output RBE filter on that particular node.

## PROGRAMMATICALLY CHANGE THE NODE CONFIGURATION VIA MSG

It's possible to programmatically change the KNX-Ultimate node configuration, by sending msg.setConfig object to the node.

[Please see here the sample page.](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig)

# QUICK HOW TO

You can more samples [here](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-SamplesHome)

**TURN ON A LAMP** 

```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.payload = true; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

**ABSOLUTE DIM A LAMP** 

```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.payload = 30; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

**SEND TEXT TO A DISPLAY** 

```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.payload = "Output Tem. 35°C"; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

**READ THE STATUS OF THE WASHING MACHINE** 

```javascript

// Example of a function that sends a read status message to the KNX-Ultimate
// Issues a read request to the KNX bus. You'll expect a 'response' from the bus. You need to select the **React to response telegrams** option.
// The node will react to the KNX Response telegram coming from the BUS.
msg.readstatus = true; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

**SEND RAW VALUE TO THE BUS** 

To send a RAW buffer value to the KNX bus, use the _ **writeraw ** _ and _**bitlenght** _ properties of the msg input.

In this case, the _Datapoint_ you set in the property window will be ignored.

Slap a function node in front of knx-ultimate and paste his code:

```javascript

// If you encode the values by yourself, you can write raw buffers with writeraw.
// The bitlenght is necessary for datapoint types where the bitlenght does not equal the buffers bytelenght * 8. This is the case for dpt 1 (bitlength 1), 2 (bitlenght 2) and 3 (bitlenght 4).
// Write raw buffer to a groupaddress with dpt 1 (e.g light on = value true = Buffer<01>) with a bitlength of 1
msg.writeraw = Buffer.from('01', 'hex'); // Put '00' instead of '01' to switch off the light.
msg.bitlenght = 1;
return msg;

// Temperature sample (uncomment below and comment above)
// Write raw buffer to a groupaddress with dpt 9 (e.g temperature 18.4 °C = Buffer<0730>) without bitlength
// msg.writeraw = Buffer.from('0730', 'hex');
// msg.bitlenght = 1;
// return msg;

```

**UPDATE THE NODE VALUE WITHOUT SENDING IT TO THE BUS** 

```javascript

msg.event = "Update_NoWrite";
msg.payload = true;
return msg;

```

## CONTROLLING KNX DEVICES WITH THE NODE SET TO "Universal mode (listen to all Group Addresses)"

Here you have 2 options: import ETS cvs file or not. 

Importing your ETS file is the <b>aboslute suggested method</b>. If you import your ETS file, you only need to set the payload to be transmitted. The node will do the datapoint encoding automatically.

If you do not import the ETS csv, you need to pass the datapoint type to the node as well.

**TURN OFF A LAMP <u>WITH</u> ETS FILE IMPORTED** 

```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.event = "GroupValue_Write";
msg.destination = "0/0/1"; // Set the destination 
msg.payload = false; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

**TURN OFF A LAMP <u>WITHOUT</u> ETS FILE IMPORTED** 

```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.event = "GroupValue_Write";
msg.destination = "0/0/1"; // Set the destination 
msg.dpt = "1.001"; 
msg.payload = false; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

**READ THE STATUS OF ALL KNX DEVICES <u>WITH</u> ETS FILE IMPORTED** 

You cannot issue a read request to all groups if you doesn't import your ETS file, because the node cannot know to wich devices to send the read request.

```javascript

// Example of a function that sends a read status message to the KNX-Ultimate
// Issues a read request to the KNX bus. You'll expect a 'response' from the bus. You need to select the **React to response telegrams** option.
// The node will react to the KNX Response telegram coming from the BUS.
msg.readstatus = true; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

## SEE ALSO

- [Gateway Configuration](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Gateway-configuration)
- [CIRCULAR REFERENCE PROTECTION and FLOOD PROTECTION](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections)
- _SAMPLES_
  - [Samples](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-SamplesHome)
