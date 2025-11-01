---
layout: wiki
title: "GlobalVariable"
lang: en
permalink: /wiki/GlobalVariable/
---
# KNX GLOBAL VARIABLE

This node exposes the group address received from the bus, to a **global variable** 

You can write to the KNX BUS by simply update the global variable!

## Overview

Put a Global Context Node into the flow, then give it a name.

The name you give to the node, will become the global context variable's name.

That's all. For security reasons, please **change the default node name** 

You can access the global variable by adding the suffix \_READ to the node's name.

You can enable/disable the global context variable, or enable READONLY or READ/WRITE in the configuration window.

You can issue a KNX BUS write command, by simply modify the global variable name with suffix \_WRITE. _ **After the commands have been executed, the global variable with suffix \_WRITE is automatically emptied, not to infinitely repeat the commands. ** _ 
**Settings**

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

This node exposes the group address received from the bus, to a **global variable** 

You can write to the KNX BUS by simply update the global variable!

## Overview

Put a Global Context Node into the flow, then give it a name.

The name you give to the node, will become the global context variable's name.

That's all. For security reasons, please **change the default node name** 

You can access the global variable by adding the suffix \_READ to the node's name.

You can enable/disable the global context variable, or enable READONLY or READ/WRITE in the configuration window.

You can issue a KNX BUS write command, by simply modify the global variable name with suffix \_WRITE. _ **After the commands have been executed, the global variable with suffix \_WRITE is automatically emptied, not to infinitely repeat the commands.** _

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/globalcontextnode.png" width="90%">

### View code

> Adjust the nodes according to your setup

```javascript

[{"id":"ababb834.9073","type":"knxUltimateGlobalContext","z":"5ed79f4a958a1f20","server":"b60c0d73.1c02b","name":"KNXContextBanana","exposeAsVariable":"exposeAsVariableREADWRITE","writeExecutionInterval":"1000","x":230,"y":200,"wires":[]},{"id":"2954e7ea.f53988","type":"function","z":"5ed79f4a958a1f20","name":"Write to the KNXContextBanana variable","func":"// This function writes some values to the KNX bus\nlet GroupAddresses = [];\nGroupAddresses.push ({address: \"0/0/10\", dpt:\"1.001\", payload:true});\nGroupAddresses.push({ address: \"0/0/11\", dpt: \"1.001\", payload: true });\nGroupAddresses.push({ address: \"0/0/12\", dpt: \"1.001\", payload: false });\n\n// You can also avoid setting datapoint.\n// This works gread if you have imported the ETS file, otherwise it'll guess the datapoint type by analyzing the payload\nGroupAddresses.push ({address: \"0/0/14\", payload:false});\nGroupAddresses.push({ address: \"0/0/15\", payload: 50 });\n\n// Remember: add the string \"_WRITE\" after the node name to write to the bus\nglobal.set(\"KNXContextBanana_WRITE\",GroupAddresses);\n","outputs":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":480,"y":300,"wires":[]},{"id":"bd4380e3.8c1ea","type":"inject","z":"5ed79f4a958a1f20","name":"Call the function","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":220,"y":300,"wires":[["2954e7ea.f53988"]]},{"id":"269bf86a.34e9f8","type":"comment","z":"5ed79f4a958a1f20","name":"Exposing the Group Addresses to the global context variable","info":"","x":360,"y":160,"wires":[]},{"id":"f9a6ff93.086a","type":"function","z":"5ed79f4a958a1f20","name":"Read the KNXContextBanana variable","func":"// This function reads the variable\n// Remember: add the string \"_READ\" after the node name to read the variable\nlet GroupAddresses = global.get(\"KNXContextBanana_READ\") || [];\n\n// Outputs the array, as example\nnode.send({payload:GroupAddresses});\n\n// Get the Group Address object, having address 0/0/10\nlet Ga = GroupAddresses.find(a => a.address === \"0/0/10\");\n\n// Outputs the object, as example\nnode.send({ Found: Ga });\n\n// Do some testing and output some stuffs.\nif (Ga.payload === true) return {payload : \"FOUND AND TRUE\"};\nif (Ga.payload === false) return {payload : \"FOUND AND FALSE\"};\n\n","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":410,"y":420,"wires":[["f4109aa5.270e08"]]},{"id":"64c9e0f0.b13178","type":"inject","z":"5ed79f4a958a1f20","name":"Read","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"true","payloadType":"bool","x":190,"y":420,"wires":[["f9a6ff93.086a"]]},{"id":"f4109aa5.270e08","type":"debug","z":"5ed79f4a958a1f20","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":630,"y":420,"wires":[]},{"id":"bf16d5a9.073b6","type":"comment","z":"5ed79f4a958a1f20","name":"Check global variable and do some stuffs","info":"","x":300,"y":380,"wires":[]},{"id":"85c342f08c9c4705","type":"comment","z":"5ed79f4a958a1f20","name":"This function writes some values to the bus","info":"","x":310,"y":260,"wires":[]},{"id":"b60c0d73.1c02b","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":false,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":false,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":true,"stopETSImportIfNoDatapoint":"fake","loglevel":"error","name":"Multicast","localEchoInTunneling":true,"delaybetweentelegrams":"","delaybetweentelegramsfurtherdelayREAD":"","ignoreTelegramsWithRepeatedFlag":false,"keyringFileXML":""}]

```

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

<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode" target="_blank"><i class="fa fa-info-circle"></i>See this Sample</a>
