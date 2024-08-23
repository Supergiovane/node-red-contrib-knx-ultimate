# Home

![Logo](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/logo-big.png)

Control your KNX intallation via Node-Red! A bunch of KNX nodes, with integrated Philips HUE control and ETS group address importer. Easy to use and highly configurable.

> \[!TIP] I'm putting many effort, money and free time to this node, so please consider [making a little donation](https://www.paypal.me/techtoday) if you're using KNX-Ultimate. Thanks!

#### WORKING WITH THE ETS CSV FILE

Instead of create a knx device node for each Group Address to control, you can import your ETS csv group addresses file. Thanks to that, the knx device node where you selected **Listen to all Group Addresses**, becomes an universal input/output node, aware of all Datapoints, Group Addresses and Device's name (ex: Living Room Lamp). Just send the payload to the knx-ultimate node, and it'll encode it with the right datapoint and send it to the bus. Likewise, when the knx-ultimate node receives a telegram from the bus, it outputs a right decoded payload using the datapoint specified in the ETS file.

> You can work with a mix of knx-ultimate nodes, some with **Listen to all Group Addresses** checked and some not. You are absolutely free! See this youtube video,

[![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png)](https://youtu.be/egRbR\_KwP9I)
