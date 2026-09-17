---
layout: wiki
title: "GlobalVariable"
lang: en
permalink: /wiki/GlobalVariable
translation_key: "GlobalVariable"
---

> In version 8, use **KNX Utility** and select **Global Context**. The settings below describe this function. The old separate node is no longer included.
>
> [KNX Utility]({{ '/wiki/KNX-Utility' | relative_url }}) · [Upgrade from version 7]({{ '/wiki/Migration-8' | relative_url }})


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
| Variable Name (no spaces, only chars [a-z]) | Name of the global context. 2 variables with this name will be created, one with \_READ suffix (for reading group addresses) and the other with \_WRITE suffix (for writing group addresses). For example, if the variable name is "KNXGlobalContext", the 2 variables KNXGlobalContext\_READ and KNXGlobalContext\_WRITE are created. Since the global variable is visible from all nodes (even non-KNX-Ultimate ones), for security reasons, set a name other than the default one. Click the sample link at the bottom of the page. |
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

[Download JSON]({{ '/examples/Global%20Context%20-%20Expose%20KNX%20Values.json' | relative_url }})

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
