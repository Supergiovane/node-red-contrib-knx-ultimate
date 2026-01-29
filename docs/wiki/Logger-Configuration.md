---
layout: wiki
title: "Logger-Configuration"
lang: en
permalink: /wiki/Logger-Configuration
---
# Logger

The Logger node records all telegrams and outputs it in an ETS bus monitor XML compatible file.

 

You can save the file on disk or send it to an FTP server, for example. The file can be then read by your ETS, for example for diagnostic or for a replay of the telegrams.

The node can also count telegrams per second (or any interval you want).

 <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample" target="_blank">Examples are here.</a>

## SETTINGS

|Property|Description|
|--|--|
| Gateway | The KNX gateway. |
| Topic | The topic of the node. |
| Node Name | Node name. |

## ETS compatible BUS Diagnostic File

|Property|Description|
|--|--|
| Auto start timer | Starts the timer automatically on deploy or on node-red start. |
| New payload every (in minutes) | Interval for emitting the payload and/or saving to file. When saving to file, once the configured row limit is reached, the file is **rotated**, removing the oldest rows first. |
| Max number of rows (0 = no limit) | This represents the maximum number of lines the XML file can contain (older lines are dropped first). Put 0 not to limit the number of rows in the file. When file saving is enabled, this value also represents the maximum number of rows in the file; when the limit is reached, the file is **rotated**, removing older rows over time. |
| Action | `Emit payload only` or `Emit payload and save to file`. |
| File path (absolute or relative) | Where to save the XML when action is set to save. |

## KNX Telegram Counter

|Property|Description|
|--|--|
| Auto start timer | Starts the timer automatically on deploy or on node-red start. |
| Count interval (in seconds) | How often emit a msg to the flow, containing the KNX telegrams count. In Seconds. |

---

# MESSAGE OUTPUT FROM THE LOGGER

**PIN 1: XML ETS bus monitor compatible file File**

You can use a file node to save the payload to the filesystem, or you can send it, for example, to an FTP server.

```javascript

msg = {
        topic:"MyLogger" 
        payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." (A String containing the XML file)
    } 

```

**PIN 2: KNX Telegram Counter**

Each count, the node will emit a telegram like this:

```javascript

msg = {
        topic:"",
        payload:10,
        countIntervalInSeconds:5,
        currentTime:"25/10/2021, 11:11:44"
    } 

```

---

# INPUT FLOW MESSAGE

You can control the Logger in some ways.

## ETS XML compatible BUS monitor file

**START TIMER** 

```javascript

// Start the timer
msg.etsstarttimer = true;
return msg;

```

**STOP TIMER** 

```javascript

// Start the timer
msg.etsstarttimer = false;
return msg;

```

**IMMEDIATELY OUTPUT A PAYLOAD WITH THE ETS FILE** 

```javascript

// Output payload. Restart timer as well (in case the timer was active)
msg.etsoutputnow = true;
return msg;

```

## KNX TELEGRAM COUNTER

**START TIMER** 

```javascript

// Start the timer
msg.telegramcounterstarttimer = true;
return msg;

```

**STOP TIMER** 

```javascript

// Start the timer
msg.telegramcounterstarttimer = false;
return msg;

```

**IMMEDIATELY OUTPUT TELEGRAM COUNT MESSAGE** 

```javascript

// Output payload. 
msg.telegramcounteroutputnow = true;
return msg;

```

## SEE ALSO

- _SAMPLES_
  - [Sample Logger](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
