<!-- <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/simple2.png" width="40%"><br/> -->
## LOAD CONTROL SETTINGS

With the Load Control node you can automatically manage the disconnection of loads (washing machine, oven, etc.) when the current consumption exceeds a certain threshold. <br/>
The devices are turned off intelligently, checking the possible consumption of the device to determine whether to turn it off together with others. <br/>
The node can automatically reactivate the loads. <br/>
The node turns off one device (or multiple devices) at a time, based on the order you have selected.<br/>


- **Gateway**

> KNX gateway selected. It is also possible not to select any gateway; in this case, only incoming messages to the node will be considered.


- **Monitor Wh**

> Here you have to enter the group address which represents the total consumption of your building.

- **Limit Wh**

> Here you have to enter the maximum threshold that your electricity meter can withstand. When this threshold is exceeded, the node starts to turn off the devices.

- **Delay switch off (s)**

> This value (expressed in seconds) indicates how often the node will evaluate consumption and switch off each device.


- **Delay switch on (s)**

> This value (expressed in seconds) indicates how often the node will evaluate consumption and turn on each device that was turned off.



## LOAD CONTROL

Here you can add devices to turn off in case of overload. <br/>

- **First row**
  
> Choose the device to turn off. Enter the device name or its group address. <br/>
 

- **Second row**
  
> Here you must enter any group address that indicates the consumption of the device chosen in the first line. ** This is an optional parameter **. If the device is consuming more than a certain number of Watts, it means that it is in use. If it consumes less, the device will be considered "not in use" and both this and the next will be turned off at once. <br/>


- **Automatic recovery**
 
> If enabled, the device is automatically reactivated when the "reset delay" expires.
 
<br/>
<br/>

## OUTPUT MSG


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

<br/>
<br/>

## INPUT MSG


```javascript
msg.readstatus = true
```

Forces the reading of the values from the KNX BUS of each device in the list. ***The node already does everything by itself***, but if necessary, it is possible to use this command to force a re-reading of the current values (Watt).


```javascript
msg.enable = true
```

Enables the node.


```javascript
msg.disable = true
```

Disables the node.


```javascript
msg.reset = true
```

Reset node states and turn all devices back on.

<br/>
<br/>


## SAMPLE

<a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/SampleLoadControl">CLICK HERE FOR THE EXAMPLE</a>

<br/>
<br/>
<br/>