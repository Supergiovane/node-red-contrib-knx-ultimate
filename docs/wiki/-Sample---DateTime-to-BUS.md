---
layout: wiki
title: "-Sample---DateTime-to-BUS"
lang: en
permalink: /wiki/-Sample---DateTime-to-BUS
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS)
# DATE / TIME TO THE KNX BUS

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/datetime.png" width="70%"><br/>

**Set KNX bus Date with Datapoint 11.001**

```javascript

// This sets the Date
msg.payload = new Date().toString();
return msg;

```

**Set KNX bus Time with Datapoint 10.001**

```javascript

// This sets the time
msg.payload = new Date().toString();
return msg;

```

**Set KNX bus Date/Time with Datapoint 19.001**

```javascript

// Setting date/time using DPT 19.001
// This sends both date and time to the KNX BUS
msg.payload = new Date();
return msg;

```
