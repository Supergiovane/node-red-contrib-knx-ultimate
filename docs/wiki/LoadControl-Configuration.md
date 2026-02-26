---
layout: wiki
title: "LoadControl-Configuration"
lang: en
permalink: /wiki/LoadControl-Configuration
---
# KNX LOAD CONTROL NODE

With the Load Control node you can automatically manage the disconnection of loads (washing machine, oven, etc.) when the current consumption exceeds a certain threshold.  

The devices are turned off intelligently, checking the possible consumption of the device to determine whether to turn it off together with others. 

The node can automatically reactivate the loads. 

The node turns off one device (or multiple devices) at a time, based on the order you have selected.

**General**

|Property|Description|
|--|--|
| Gateway | KNX gateway. It is also possible not to select any gateway; in this case, only incoming messages to the node will be considered. |
| Mode | Select _Automatic (internal)_ to use Monitor W/threshold/timers. Select _Manual (msg.shedding)_ to disable the internal logic and use only `msg.shedding` commands (`shed`/`unshed`). |
| Monitor W | Group address representing the total consumption of your building. |
| Limit W | Maximum threshold that your electricity meter can withstand. When this threshold is exceeded, the node starts to turn off the devices. |
| Delay switch off (s) | Expressed in seconds, indicates how often the node will evaluate consumption and switch off each device. |
| Delay switch on (s) | Expressed in seconds, indicates how often the node will evaluate consumption and turn on each device that was turned off. |

**LOAD CONTROL**

Here you can add devices to turn off in case of overload. 

Choose the device to turn off. Enter the device name or its group address. 

Enter any group address that indicates the consumption of the device chosen in the first line. **This is an optional parameter** . If the device is consuming more than a certain number of Watts, it means that it is in use. If it consumes less, the device will be considered "not in use" and both this and the next will be turned off at once.

If _Automatic recovery_ is enabled, the device is automatically reactivated when the "reset delay" expires.

## Inputs

|Property|Description|
|--|--|
| `msg.readstatus = true` | Force the reading of the values from the KNX BUS of each device in the list. _ **The node already does everything by itself** _, but if necessary, it is possible to use this command to force a re-reading of the current values in watt.|
| `msg.enable = true` | Enable the load control.|
| `msg.disable = true` | Disable the load control.|
| `msg.reset = true` | Reset node states and turn all devices back on.|
| `msg.shedding` | String. In _Manual_ mode: `shed` switches off the next load, `unshed` restores the previous one. In _Automatic_ mode: `shed`/`unshed` forces the internal logic; `auto` restores normal monitoring. |

## Outputs

1. Standard output
   : payload (string|object) : the standard output of the command.

## Details

```javascript

msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}

```

# Sample

<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleLoadControl">CLICK HERE FOR THE EXAMPLE</a>
