# node-red-contrib-knx-ultimate

![Sample Node](img/logo.png) 


[![NPM version][npm-version-image]][npm-url]
[![NPM downloads per month][npm-downloads-month-image]][npm-url]
[![NPM downloads total][npm-downloads-total-image]][npm-url]
[![MIT License][license-image]][license-url]
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square)](https://www.paypal.me/techtoday) 

![Sample Node](img/readmemain.png) 

## DESCRIPTION
Knx-ultimate is a powerfull device node, all-in-one. It acts as input device as well as output device at the same time. I'ts very SIMPLE TO USE thus very customizable.<br />
If you're here, you probably already have tried other knx nodes from npm. I hope you enjoy this one, because i've put big effort to do what i really needed, a copy/paste friendly node, with many functions and the possibility to use the ETS csv exported Group Addresses. <br/> Deutche Freunde sind willkommen und koennen mir auf knx-user-forum.de als "TheMax74", oder auf community.home-assistant.io als "Supergiovane" finden.

<a href="http://eepurl.com/gJm095" target="_blank">Subscribe to my channel.</a> Only news about my nodes, no spam, no ads. I'm a github developer, not a merchant.


## CHANGELOG
* See <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md">here the changelog</a>

## WIKI (ALWAYS UPDATED, YOUR PRIMARY REFERENCE)
* See <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki">here the wiki with samples and documentation</a>
* See it in action at <a href="https://www.youtube.com/channel/UCA9RsLps1IthT7fDSeUbRZw">my Youtube channel.</a> 

## DETAILS
* **STAND ALONE OR WITH ETS GROUP ADDRESS LIST** >You can set you own group address, datapoint and device name, or you can import the ETS Group Address list and have datapoint and device name auto populated while typing in the group address.

* **AUTOMATIC DISPLAY OF ALL YOUR KNX DEVICES** >If you import your ETS CSV file, just begin typing the group address or the device name in the Group Address textbox and a list of possible matches will appear. Just select an item in the list it and have datapoint and device name auto populated. You can then accept the auto populated fields or change it.

* **AUTOMATIC ENCODING/DECONDING OF TELEGRAM** >Just pass a normal payload to the node (true, false, a string or any nymber) and just receive a normal payload (true, false, a string or any nymber) to use in your flow.

* **DOUBLE PERSONALITY** >The node can act as a single device (for example having Group Address 0/0/1), or can be used as universal node, catching all messages coming from KNX Bus (in this case the node will output a comprehensive msg to the flow, containing group address, device name, automatic decoded payload and other useful infos). The node can act as universal KNX sender as well (you can pass a message to the node, containing the destination group address, the datapont type and the payload).

* **EMULATE REAL KNX DEVICE** >You can use the node to emulate a phisically non existent KNX device. The node will behave exactly as a normal KNX Device and will also respond to read requests coming from the KNX bus, by sending the current payload value to the KNX bus.

* **ADJUSTABLE STATUS DISPLAY** >You can select what to see in the status (the row below the node). For example, you can select to see the current payload value and the last time changed, or the device name as well.

* **CIRCULAR REFERENCE PROTECTION** >The Node has a circular reference protection. If 2 nodes with same group address are linked toghether, the protection avoids loops by stopping the message transmitted to the KNX BUS. <a href="https://youtu.be/I32_qG7yhFc" target="_blank"><img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/Loop.png' width='15%'></a>

* **AUTOMATIC LOOP PROTECTION** >Protect the flow form being flooded by KNX telegram, in case of mistaken in the flow design, by DISABLING the affected node.

* **BUILT IN RBE INPUT FILTER** >You can select to activate or deactivate it. If active, the node reacts only if payload from KNX Bus is changed.

* **BUILT IN RBE OUTPUT FILTER** >You can select to activate or deactivate it. If active, the node will send the payload to the KNX Bus, only if changed.

* **WORKS WITH IP INTERFACES AS WELL AS IP ROUTERS** >Full support for IP Interfaces as well for IP Routers. It's recommended the use of IP Routers because of simple setup and stability in a large environment.

* **SUPPRESS ACK REQUEST** >This option help compatibility with very old IP Interfaces, like the Siemens SWG1 148-1AB22 IP Interface firmware.

* **VERY GRANULAR OPTIONS** >The node is very simple to use "out of the box", but you can plasmate it to achieve any goal you want.

* **ACTIVE DEVELOPED** >I personally use my node at home, so i put a lot of effort to develop it and i respond to your "github issues" very quickly.



### WORKING WITH THE ETS CSV FILE
Instead of create a knx-ultimate node for each Group Address to control, you can import your ETS csv group addresses file. 
Thanks to that, the knx-ultimate node where you selected **Universal mode (listen to all Group Addresses)**, becomes an universal input/output node, aware of all Datapoints, Group Addresses and Device's name (ex: Living Room Lamp). Just send the payload to the knx-ultimate node, and it'll encode it with the right datapoint and send it to the bus. Likewise, when the knx-ultimate node receives a telegram from the bus, it outputs a right decoded payload using the datapoint specified in the ETS file.
> You can work with a mix of knx-ultimate nodes, some with **Universal mode (listen to all Group Addresses)** checked and some not. You are absolutely free! See this youtube video,

<a href="https://youtu.be/I32_qG7yhFc" target="_blank"><img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png' width='100%'></a>

**Sample ETS csv file to paste into your config for testing pourposes**
> Copy/Paste this into your configuration node.

```js
"Group name"	"Address"	"Central"	"Unfiltered"	"Description"	"DatapointType"	"Security"
"Attuatori luci"	"0/-/-"	""	""	"Attuatori luci"	""	"Auto"
"Luci primo piano"	"0/0/-"	""	""	"Luci primo piano"	""	"Auto"
"Camera da letto luce"	"0/0/1"	""	""	"Camera da letto luce"	"DPST-1-8"	"Auto"
"Loggia camera da letto"	"0/0/2"	""	""	"Loggia camera da letto"	"DPST-1-1"	"Auto"
"Camera armadi luce"	"0/0/3"	""	""	"Camera armadi luce"	"DPST-1-1"	"Auto"
"Bagno grande luce"	"0/0/4"	""	""	"Bagno grande luce"	"DPST-1-1"	"Auto"
"Loggia bagno grande"	"0/0/5"	""	""	"Loggia bagno grande"	"DPST-1-1"	"Auto"
"Bagno grande specchio (switch)"	"0/0/6"	""	""	"Bagno grande specchio switch"	"DPST-1-1"	"Auto"
"Lavanderia luce"	"0/0/7"	""	""	"Lavanderia luce"	"DPST-1-1"	"Auto"
"Lavanderia specchio (switch)"	"0/0/8"	""	""	"Lavanderia specchio switch"	"DPST-1-1"	"Auto"
"Studio luce"	"0/0/9"	""	""	"Studio luce"	"DPST-1-1"	"Auto"
"Soggiorno luce (switch)"	"0/0/10"	""	""	"Soggiorno luce switch"	"DPST-1-1"	"Auto"
"Soggiorno aplique (switch)"	"0/0/11"	""	""	"Soggiorno aplique switch"	"DPST-1-1"	"Auto"
"Loggia soggiorno cucina"	"0/0/12"	""	""	"Loggia soggiorno-cucina"	"DPST-1-1"	"Auto"
"Cucina luce"	"0/0/13"	""	""	"Cucina luce"	"DPT-1"	"Auto"
"Cucina luce pensili"	"0/0/14"	""	""	"Cucina luce pensili"	"DPT-1"	"Auto"
"Corridoio luce"	"0/0/15"	""	""	"Corridoio luce"	"DPST-1-1"	"Auto"
"Scala LED"	"0/0/16"	""	""	"Scala LED"	"DPST-1-1"	"Auto"
"Soggiorno aplique brighness value"	"0/0/17"	""	""	""	"DPST-5-1"	"Auto"
"Bagno grande specchio (dim)"	"0/0/18"	""	""	"Bagno grande specchio dim"	"DPST-3-7"	"Auto"
"Soggiorno luce brighness value"	"0/0/19"	""	""	""	"DPST-5-1"	"Auto"
"Lavanderia specchio (dim)"	"0/0/20"	""	""	"Lavanderia specchio dim"	"DPST-3-7"	"Auto"
"Scala LED cambiacolori RGB"	"0/0/21"	""	""	""	"DPST-1-1"	"Auto"
"Bagno grande specchio brightness value"	"0/0/22"	""	""	""	"DPST-5-1"	"Auto"
"Soggiorno luce (dim)"	"0/0/23"	""	""	"Soggiorno luce dim"	"DPST-3-7"	"Auto"
```


<br/>

### WIKI PAGES TO START FROM FRESH

> GATEWAY CONFIGURATION: <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/1.-Gateway-configuration" target="_blank"> click here.</a>
>
> NODE CONFIGURATION: <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/2.-Node-Configuration" target="_blank"> click here.</a>
>
> MESSAGES FROM THE NODE: <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/3.-Messages-from-the-node" target="_blank"> click here.</a>
>
> MESSAGES TO THE NODE: <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/4.-Messages-to-the-node" target="_blank"> click here.</a>
>
> SAMPLES: <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/5.-Samples" target="_blank"> click here.</a>

<br/>
<br/>
<br/>
<br/>


## BRIEF TOUR (Samples are in the <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki">Wiki</a>)


### TURN ON AND OFF A LAMP

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/simple.png" width="50%">

In this example, this is the node config. AS you can see, the Group Address is 0/0/1 and Datapoint 1.001 (1 bit switch)
The message passed to the node is simple <code>{payload=true}</code> and <code>{payload=false}</code>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/simple2.png" width="60%">

```js
[{"id":"7840249f.8ce8a4","type":"knxUltimate","z":"71ead01a.630ba","server":"d08a9721.b34f1","topic":"0/0/1","dpt":"1.001","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"listenallga":false,"name":"Kitchen Lamp","x":340,"y":100,"wires":[[]]},{"id":"d08a9721.b34f1","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","csv":"\"Group name\"\t\"Address\"\t\"Central\"\t\"Unfiltered\"\t\"Description\"\t\"DatapointType\"\t\"Security\"\n\"Attuatori luci\"\t\"0/-/-\"\t\"\"\t\"\"\t\"Attuatori luci\"\t\"\"\t\"Auto\"\n\"Luci primo piano\"\t\"0/0/-\"\t\"\"\t\"\"\t\"Luci primo piano\"\t\"\"\t\"Auto\"\n\"Camera da letto luce\"\t\"0/0/1\"\t\"\"\t\"\"\t\"Camera da letto luce\"\t\"DPST-1-8\"\t\"Auto\"\n\"Loggia camera da letto\"\t\"0/0/2\"\t\"\"\t\"\"\t\"Loggia camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera armadi luce\"\t\"0/0/3\"\t\"\"\t\"\"\t\"Camera armadi luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande luce\"\t\"0/0/4\"\t\"\"\t\"\"\t\"Bagno grande luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Loggia bagno grande\"\t\"0/0/5\"\t\"\"\t\"\"\t\"Loggia bagno grande\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande specchio (switch)\"\t\"0/0/6\"\t\"\"\t\"\"\t\"Bagno grande specchio switch\"\t\"DPST-1-1\"\t\"Auto\""}]
```

    


### TURN ON SAME LAMP, BUT USING ETS CSV FILE (IN THE CONFIG NODE)

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides.png" width="50%">

In this example, we selectet "Listen to all Group Address" in the configuration and we imported the ETS csv File.<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides3.png" width="40%">

The configuration Node<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides4.png" width="40%">

```js
node.send ({payload: true, destination: "0/0/1", dpt: "1.001"});
```
dpt can be omitted (it's auto detected if you've set the ETS csv file), so simply
```js
node.send ({payload: true, destination: "0/0/1"});
```

```js
[{"id":"ae2d436e.44559","type":"function","z":"71ead01a.630ba","name":"Some overrides","func":"return ({\n      payload: msg.payload,\n      destination: \"0/0/1\"\n    });","outputs":1,"noerr":0,"x":260,"y":280,"wires":[["9ab841cd.048848"]]},{"id":"7134491f.e66e","type":"inject","z":"71ead01a.630ba","name":"Switch on","topic":"","payload":"true","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":100,"y":260,"wires":[["ae2d436e.44559"]]},{"id":"c49a1a48.5f7338","type":"inject","z":"71ead01a.630ba","name":"Switch off","topic":"","payload":"false","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":100,"y":300,"wires":[["ae2d436e.44559"]]},{"id":"fab1778f.1b44e8","type":"debug","z":"71ead01a.630ba","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":530,"y":280,"wires":[]},{"id":"9ab841cd.048848","type":"knxUltimate","z":"71ead01a.630ba","server":"d08a9721.b34f1","topic":"","dpt":"1.001","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"listenallga":true,"name":"All","x":410,"y":280,"wires":[["fab1778f.1b44e8"]]},{"id":"d08a9721.b34f1","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","csv":"\"Group name\"\t\"Address\"\t\"Central\"\t\"Unfiltered\"\t\"Description\"\t\"DatapointType\"\t\"Security\"\n\"Attuatori luci\"\t\"0/-/-\"\t\"\"\t\"\"\t\"Attuatori luci\"\t\"\"\t\"Auto\"\n\"Luci primo piano\"\t\"0/0/-\"\t\"\"\t\"\"\t\"Luci primo piano\"\t\"\"\t\"Auto\"\n\"Camera da letto luce\"\t\"0/0/1\"\t\"\"\t\"\"\t\"Camera da letto luce\"\t\"DPST-1-8\"\t\"Auto\"\n\"Loggia camera da letto\"\t\"0/0/2\"\t\"\"\t\"\"\t\"Loggia camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera armadi luce\"\t\"0/0/3\"\t\"\"\t\"\"\t\"Camera armadi luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande luce\"\t\"0/0/4\"\t\"\"\t\"\"\t\"Bagno grande luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Loggia bagno grande\"\t\"0/0/5\"\t\"\"\t\"\"\t\"Loggia bagno grande\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande specchio (switch)\"\t\"0/0/6\"\t\"\"\t\"\"\t\"Bagno grande specchio switch\"\t\"DPST-1-1\"\t\"Auto\""}]
```


### ISSUE A READ REQUEST TO A SPECIFIED GROUP ADDRESS, USING ETS CSV FILE (IN THE CONFIG NODE)

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/read.png" width="50%">

In this example, we selectet "Listen to all Group Address" in the configuration and we imported the ETS csv File.<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides3.png" width="40%">

The configuration Node<br/>
<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/overrides4.png" width="40%">
```js
return ({readstatus: true});
```

```js
[{"id":"b1d17725.e39228","type":"function","z":"71ead01a.630ba","name":"Read Request","func":"return ({\n      readstatus: true,\n      knx: {\n        destination: \"0/0/1\"}\n    });","outputs":1,"noerr":0,"x":260,"y":640,"wires":[["348e7499.c50544"]]},{"id":"94a1fc7b.9a9288","type":"inject","z":"71ead01a.630ba","name":"Trigger","topic":"","payload":"true","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":90,"y":640,"wires":[["b1d17725.e39228"]]},{"id":"348e7499.c50544","type":"knxUltimate","z":"71ead01a.630ba","server":"d08a9721.b34f1","topic":"","dpt":"1.001","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"listenallga":true,"name":"All","x":420,"y":640,"wires":[["9d34ac1a.429de"]]},{"id":"9d34ac1a.429de","type":"debug","z":"71ead01a.630ba","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":550,"y":640,"wires":[]},{"id":"d08a9721.b34f1","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","csv":"\"Group name\"\t\"Address\"\t\"Central\"\t\"Unfiltered\"\t\"Description\"\t\"DatapointType\"\t\"Security\"\n\"Attuatori luci\"\t\"0/-/-\"\t\"\"\t\"\"\t\"Attuatori luci\"\t\"\"\t\"Auto\"\n\"Luci primo piano\"\t\"0/0/-\"\t\"\"\t\"\"\t\"Luci primo piano\"\t\"\"\t\"Auto\"\n\"Camera da letto luce\"\t\"0/0/1\"\t\"\"\t\"\"\t\"Camera da letto luce\"\t\"DPST-1-8\"\t\"Auto\"\n\"Loggia camera da letto\"\t\"0/0/2\"\t\"\"\t\"\"\t\"Loggia camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera armadi luce\"\t\"0/0/3\"\t\"\"\t\"\"\t\"Camera armadi luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande luce\"\t\"0/0/4\"\t\"\"\t\"\"\t\"Bagno grande luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Loggia bagno grande\"\t\"0/0/5\"\t\"\"\t\"\"\t\"Loggia bagno grande\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande specchio (switch)\"\t\"0/0/6\"\t\"\"\t\"\"\t\"Bagno grande specchio switch\"\t\"DPST-1-1\"\t\"Auto\""}]
```

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/master/LICENSE
[npm-url]: https://npmjs.org/package/node-red-contrib-knx-ultimate
[npm-version-image]: https://img.shields.io/npm/v/node-red-contrib-knx-ultimate.svg
[npm-downloads-month-image]: https://img.shields.io/npm/dm/node-red-contrib-knx-ultimate.svg
[npm-downloads-total-image]: https://img.shields.io/npm/dt/node-red-contrib-knx-ultimate.svg
