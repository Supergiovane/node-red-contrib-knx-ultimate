# ETS Logger configuration

## Logger

**What does it do?**

The Logger node records all telegrams and outputs it in an ETS bus monitor XML compatible file.\
You can save the file on disk or send it to an FTP server, for example. The file can be then read by your ETS, for example for diagnostic or for a replay of the telegrams.\
The node can also count telegrams per second (or any interval you want).\
[Examples are here.](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Logger-Sample)

### SETTINGS

* **Gateway**

> Selected KNX gateway.

* **Topic**

> The topic of the node.

* **Name**

> Node's name.

### ETS compatible BUS Diagnostic File

* **Auto start timer**

> Starts the timer automatically on deploy or on node-red start.

* **Output new XML every (in minutes)**

> The time, in minutes, which the Logger will output the ETS XML bus monitor compatible file.

* **Max number of rows in XML (0 = no limit)**

> This represents the maximum number of line, that the XML file can contain in the interval specified above. Put 0 not to limit the number of rows in the file.

\
\


### KNX Telegram Counter

***

* **Auto start timer**

> Starts the timer automatically on deploy or on node-red start.

* **Count interval (in seconds)**

> How often emit a msg to the flow, containing the KNX telegrams count. In Seconds.

\
\


***

## MESSAGE OUTPUT FROM THE LOGGER

**PIN 1: XML ETS bus monitor compatible file File**

You can use a file node to save the payload to the filesystem, or you can send it, for example, to an FTP server.

```javascript

msg = {
        topic:"MyLogger" 
        payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." (A String containing the XML file)
    } 

```

\
\


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

\


***

## INPUT FLOW MESSAGE

You can control the Logger in some ways.

### ETS XML compatible BUS monitor file

**START TIMER**\


```javascript

// Start the timer
msg.etsstarttimer = true;
return msg;

```

**STOP TIMER**\


```javascript

// Start the timer
msg.etsstarttimer = false;
return msg;

```

**IMMEDIATELY OUTPUT A PAYLOAD WITH THE ETS FILE**\


```javascript

// Output payload. Restart timer as well (in case the timer was active)
msg.etsoutputnow = true;
return msg;

```

### KNX TELEGRAM COUNTER

**START TIMER**\


```javascript

// Start the timer
msg.telegramcounterstarttimer = true;
return msg;

```

**STOP TIMER**\


```javascript

// Start the timer
msg.telegramcounterstarttimer = false;
return msg;

```

**IMMEDIATELY OUTPUT TELEGRAM COUNT MESSAGE**\


```javascript

// Output payload. 
msg.telegramcounteroutputnow = true;
return msg;

```

### SEE ALSO

* _SAMPLES_
  * [Sample Logger](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
