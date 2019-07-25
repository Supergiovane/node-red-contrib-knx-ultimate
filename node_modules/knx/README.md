## KNXnet/IP for Node.JS

**New:** [Join the Gitter.im chatroom!](https://gitter.im/knx-js/Lobby)

A feature-complete [KNXnet/IP protocol stack](https://www.knx.org/en-us/knx/technology/developing/devices/ip-devices/index.php) in pure Javascript, capable of talking multicast (routing) and unicast (tunneling). Adding KNX to your Node.JS applications is now finally easy as pie.

* Wide DPT (datapoint type) support (DPT1 - DPT20 supported)
* Extensible Device support (binary lights, dimmers, ...)
* You won't need to install a specialised eibd daemon with its arcane dependencies  and most importantly,
* If you got an IP router and a network that supports IP multicast, you can start talking to KNX within seconds!

## Installation

Make sure your machine has Node.JS (version 4.x or greater) and do:

`npm install knx`

## Usage

At last, here's a **reliable** KNX connection that simply works without any configs. To get a basic KNX monitor, you just need to run this in Node:

```js
var knx = require('knx');
var connection = knx.Connection({
 handlers: {
  connected: function() {
    console.log('Connected!');
  },
  event: function (evt, src, dest, value) {
  console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j",
    new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    evt, src, dest, value);
  }
 }
});
```

Ahhh, KNX telegrams, what a joy:

```
> 2016-09-24 05:34:07 **** KNX EVENT: "GroupValue_Write", src: "1.1.100", dest: "5/0/8", value: 1
2016-09-24 05:34:09 **** KNX EVENT: "GroupValue_Write", src: "1.1.100", dest: "5/1/15", value: 0
2016-09-24 05:34:09 **** KNX EVENT: "GroupValue_Write", src: "1.1.100", dest: "5/0/8", value: 0
2016-09-24 05:34:17 **** KNX EVENT: "GroupValue_Write", src: "1.1.100", dest: "5/1/15", value: 0
2016-09-24 05:34:17 **** KNX EVENT: "GroupValue_Write", src: "1.1.100", dest: "5/0/8", value: 1
```

## Development documentation

- [Basic API usage](../master/README-API.md)
- [List of supported datapoints](../master/README-datapoints.md)
- [List of supported events](../master/README-events.md)
- [eibd/knxd compatibility](../master/README-knxd.md)
- [On resilience](../master/README-resilience.md)
