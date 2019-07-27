# node-red-contrib-knx-ultimate


![Sample Node](img/sample.png) 

## DESCRIPTION
Knx-ultimate is a powerfull device node, all-in-one. It acts as input device as well as output device at the same time.<br />
Based on configuration and msg option, you can achieve all what you need.<br />

### WORKING WITH THE ETS CSV FILE
Instead of create a knx-ultimate node for each Group Address to control, you can import your ETS csv group addresses file. 
Thanks to that, the knx-ultimate node where you selected **Listen to all Group Addresses**, becomes an universal input/output node, aware of all Datapoints, Group Addresses and Device's name (ex: Living Room Lamp). Just send the payload to the knx-ultimate node, and it'll encode it with the right datapoint and send it to the bus. Likewise, when the knx-ultimate node receives a telegram from the bus, it outputs a right decoded payload using the datapoint specified in the ETS file.
> You can work with a mix of knx-ultimate nodes, some with **Listen to all Group Addresses** checked and some not. You are absolutely free!


## CHANGELOG
* See <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md">here the changelog</a>

## WIKI
* See <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki">here the wiki with samples and documentation</a>

## EXAMPLES (Others are in the Wiki)

## -->> SET DATE/TIME FROM NODE-RED TO KNX BUS

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/datetime.png" width="50%"><br/>

To set the date and time, you'll use 2 separate devices. <br/>
Set the datapoint of the 'Date' device to 11.001<br/>
Set the datapoint of the 'Time' device to 10.001<br/>
To set the date, use this code in a function (adjust the locale (it-IT) and Timezone to match your country):<br/>
```js
return {payload:new Date().toLocaleDateString('it-IT',
        {year:"2-digit",
        month:"2-digit", 
        day:"2-digit",
        timeZone: 'Europe/Rome'})}
```
<br/>
To set the time, use this code in a function (adjust the locale (it-IT) and Timezone to match your country):<br/>

```js
return {payload:new Date().toLocaleTimeString('it-IT',
    {hour: '2-digit', hour12: false,
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Rome'})}
```


## -->> TURN ON AND OFF A LAMP

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/simple.png" width="50%">

In this example, this is the node config. AS you can see, the Group Address is 0/0/1 and Datapoint 1.001 (1 bit switch)
The message passed to the node is simple <code>{payload=true}</code> and <code>{payload=false}</code>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/simple2.png" width="40%">

```js
[{"id":"7840249f.8ce8a4","type":"knxUltimate","z":"71ead01a.630ba","server":"d08a9721.b34f1","topic":"0/0/1","dpt":"1.001","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"listenallga":false,"name":"Kitchen Lamp","x":340,"y":100,"wires":[[]]},{"id":"d08a9721.b34f1","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","csv":"\"Group name\"\t\"Address\"\t\"Central\"\t\"Unfiltered\"\t\"Description\"\t\"DatapointType\"\t\"Security\"\n\"Attuatori luci\"\t\"0/-/-\"\t\"\"\t\"\"\t\"Attuatori luci\"\t\"\"\t\"Auto\"\n\"Luci primo piano\"\t\"0/0/-\"\t\"\"\t\"\"\t\"Luci primo piano\"\t\"\"\t\"Auto\"\n\"Camera da letto luce\"\t\"0/0/1\"\t\"\"\t\"\"\t\"Camera da letto luce\"\t\"DPST-1-8\"\t\"Auto\"\n\"Loggia camera da letto\"\t\"0/0/2\"\t\"\"\t\"\"\t\"Loggia camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera armadi luce\"\t\"0/0/3\"\t\"\"\t\"\"\t\"Camera armadi luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande luce\"\t\"0/0/4\"\t\"\"\t\"\"\t\"Bagno grande luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Loggia bagno grande\"\t\"0/0/5\"\t\"\"\t\"\"\t\"Loggia bagno grande\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande specchio (switch)\"\t\"0/0/6\"\t\"\"\t\"\"\t\"Bagno grande specchio switch\"\t\"DPST-1-1\"\t\"Auto\""}]
```

    


## -->> TURN ON SAME LAMP, BUT USING ETS CSV FILE (IN THE CONFIG NODE)

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides.png" width="50%">

In this example, we selectet "Listen to all Group Address" in the configuration and we imported the ETS csv File.<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides3.png" width="40%">

The configuration Node<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides4.png" width="40%">


This is the message. Note that we do not have specified the datapoint, because the node uses the datapoint from the ETS csv file.<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides2.png" width="40%">

```js
[{"id":"ae2d436e.44559","type":"function","z":"71ead01a.630ba","name":"Some overrides","func":"return ({\n      payload: msg.payload,\n      knx: {\n        destination: \"0/0/1\"}\n    });","outputs":1,"noerr":0,"x":260,"y":280,"wires":[["9ab841cd.048848"]]},{"id":"7134491f.e66e","type":"inject","z":"71ead01a.630ba","name":"Switch on","topic":"","payload":"true","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":100,"y":260,"wires":[["ae2d436e.44559"]]},{"id":"c49a1a48.5f7338","type":"inject","z":"71ead01a.630ba","name":"Switch off","topic":"","payload":"false","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":100,"y":300,"wires":[["ae2d436e.44559"]]},{"id":"fab1778f.1b44e8","type":"debug","z":"71ead01a.630ba","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":530,"y":280,"wires":[]},{"id":"9ab841cd.048848","type":"knxUltimate","z":"71ead01a.630ba","server":"d08a9721.b34f1","topic":"","dpt":"1.001","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"listenallga":true,"name":"All","x":410,"y":280,"wires":[["fab1778f.1b44e8"]]},{"id":"d08a9721.b34f1","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","csv":"\"Group name\"\t\"Address\"\t\"Central\"\t\"Unfiltered\"\t\"Description\"\t\"DatapointType\"\t\"Security\"\n\"Attuatori luci\"\t\"0/-/-\"\t\"\"\t\"\"\t\"Attuatori luci\"\t\"\"\t\"Auto\"\n\"Luci primo piano\"\t\"0/0/-\"\t\"\"\t\"\"\t\"Luci primo piano\"\t\"\"\t\"Auto\"\n\"Camera da letto luce\"\t\"0/0/1\"\t\"\"\t\"\"\t\"Camera da letto luce\"\t\"DPST-1-8\"\t\"Auto\"\n\"Loggia camera da letto\"\t\"0/0/2\"\t\"\"\t\"\"\t\"Loggia camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera armadi luce\"\t\"0/0/3\"\t\"\"\t\"\"\t\"Camera armadi luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande luce\"\t\"0/0/4\"\t\"\"\t\"\"\t\"Bagno grande luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Loggia bagno grande\"\t\"0/0/5\"\t\"\"\t\"\"\t\"Loggia bagno grande\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande specchio (switch)\"\t\"0/0/6\"\t\"\"\t\"\"\t\"Bagno grande specchio switch\"\t\"DPST-1-1\"\t\"Auto\""}]
```


## -->> ISSUE A READ REQUEST TO A SPECIFIED GROUP ADDRESS, USING ETS CSV FILE (IN THE CONFIG NODE)

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/read.png" width="50%">

In this example, we selectet "Listen to all Group Address" in the configuration and we imported the ETS csv File.<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides3.png" width="40%">

The configuration Node<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides4.png" width="40%">


We now issue a 'read' request. Note that the node, can automatically issue a 'read' request if you set the parameter in the config page.<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/read2.png" width="40%">

```js
[{"id":"b1d17725.e39228","type":"function","z":"71ead01a.630ba","name":"Read Request","func":"return ({\n      readstatus: true,\n      knx: {\n        destination: \"0/0/1\"}\n    });","outputs":1,"noerr":0,"x":260,"y":640,"wires":[["348e7499.c50544"]]},{"id":"94a1fc7b.9a9288","type":"inject","z":"71ead01a.630ba","name":"Trigger","topic":"","payload":"true","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":90,"y":640,"wires":[["b1d17725.e39228"]]},{"id":"348e7499.c50544","type":"knxUltimate","z":"71ead01a.630ba","server":"d08a9721.b34f1","topic":"","dpt":"1.001","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"listenallga":true,"name":"All","x":420,"y":640,"wires":[["9d34ac1a.429de"]]},{"id":"9d34ac1a.429de","type":"debug","z":"71ead01a.630ba","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":550,"y":640,"wires":[]},{"id":"d08a9721.b34f1","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","csv":"\"Group name\"\t\"Address\"\t\"Central\"\t\"Unfiltered\"\t\"Description\"\t\"DatapointType\"\t\"Security\"\n\"Attuatori luci\"\t\"0/-/-\"\t\"\"\t\"\"\t\"Attuatori luci\"\t\"\"\t\"Auto\"\n\"Luci primo piano\"\t\"0/0/-\"\t\"\"\t\"\"\t\"Luci primo piano\"\t\"\"\t\"Auto\"\n\"Camera da letto luce\"\t\"0/0/1\"\t\"\"\t\"\"\t\"Camera da letto luce\"\t\"DPST-1-8\"\t\"Auto\"\n\"Loggia camera da letto\"\t\"0/0/2\"\t\"\"\t\"\"\t\"Loggia camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera armadi luce\"\t\"0/0/3\"\t\"\"\t\"\"\t\"Camera armadi luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande luce\"\t\"0/0/4\"\t\"\"\t\"\"\t\"Bagno grande luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Loggia bagno grande\"\t\"0/0/5\"\t\"\"\t\"\"\t\"Loggia bagno grande\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande specchio (switch)\"\t\"0/0/6\"\t\"\"\t\"\"\t\"Bagno grande specchio switch\"\t\"DPST-1-1\"\t\"Auto\""}]
```