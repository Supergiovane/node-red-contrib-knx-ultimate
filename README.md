![Logo](img/logo-big.png)

<br/>

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads per month][npm-downloads-month-image]][npm-url]
[![NPM downloads total][npm-downloads-total-image]][npm-url]
[![MIT License][license-image]][license-url]
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Youtube][youtube-image]][youtube-url]
[![Donate via PayPal](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/CodiceQR.png)](https://www.paypal.com/donate/?hosted_button_id=S8SKPUBSPK758) 


![Sample Node](img/readmemain.png)


<p align='center'>
<img width="110px" src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/KNX_CERTI_MARK_RGB.jpg" ></br>
<span style="font-size:0.7em;color:grey;">Authorized KNX logo by KNX Association*</span>
</p>

</br>

**You can use it immediately!**

```javascript

msg.payload = true // Turn light on
msg.payload = {red:255, green:200, blue:30} // Put some colors in our life

```

<br/>

> [!TIP]
> I'm putting many effort, money and free time to this node, so please consider [MAKING A LITTLE DONATION](https://www.paypal.com/donate/?hosted_button_id=S8SKPUBSPK758) if you're using KNX-Ultimate. Thanks!

<br/>

## YOUTUBE CHANNEL

<a href="https://www.youtube.com/playlist?list=PL9Yh1bjbLAYpfy1Auz6CKDfXUusgMwOQr" target="_blank"><br/>
<img width="200px" src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/youtube-logo.jpeg" ></a>

Please subscribe to the [Youtube channel](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYpfy1Auz6CKDfXUusgMwOQr) and watch the node in action. 

<br/>
<br/>

## NODE'S LIST

* **KNX-ULTIMATE node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/2.-Node-Configuration), allow you to control your *KNX installation* via Node-Red. You can control all your KNX devices as well as create a *Virtual Device* in Node-Red, to link external *non KNX* devices, and make it compatible with your KNX installation. I'ts very SIMPLE TO USE thus very customizable.  
* **SCENE CONTROLLER node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration), The scene controller node can act as a real scene controller, with recall and save of the current scene.
* **WATCHDOG node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/7.-WatchDog-Configuration), allows notification (Email, Twitter, Telegram, Alexa, Siri, Sonos -with sonospollytts node- and so on) of KNX Bus connection errors, automatic or manual switchover to a backup KNX/IP router if the primary fails and allows you to programmatically change the config-node directly from a msg flow. It also can force the disconnection and connection of the selected Gateway from the KNX BUS.
* **LOGGER node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Logger-Configuration), creates an XML diagnostic file, compatible with ETS. You can open it with ETS for diagnostic pourposes. Node: the Logger currently doesn't record the telegrams coming from KNX-Ultimate if you use a **KNX/IP Interface**. 
* **GLOBAL CONTEXT node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/GlobalVariable), exposes the group addresses to a Global Context variable, to be used in function nodes.
* **ALERTER node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration). With the Alerter node you can signal to a display or to the node-red-contrib-tts-ultimate node (audio feedback), whenever the selected devices are alerted, i.e. they have payload **true**.
* **LOAD CONTROL node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration). Control your loads (Oven, Washing machine, etc..) and avoit shutting down the main voltage due to too high power consumption.
* **VIEWER node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer). View all Group Addresses and values of your KNX BUS, in the Node-Red Dashboard.
* **AUTO RESPONDER node** responds to read requests coming from the bus. Used mainly for virtual group addresses.
* **PHILIPS HUE nodeset** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/en-hue-configuration). Link HUE devices to KNX in a simple way.
* **HOME ASSISTANT translator node** translates the HA input msg, to a KNX value. Comes with a built-in translation table, that's user editable.

<br>

## CHANGELOG

* See <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md">here the changelog</a>


## SUPPORTED TECHNOLOGIES

|Technology|Supported|
|--|--|
| KNX Tunnelling | ![](https://placehold.co/200x20/green/white?text=YES) |
| KNX Routing | ![](https://placehold.co/200x20/green/white?text=YES) |
| Philips Hue v2 | ![](https://placehold.co/200x20/green/white?text=YES) |
| KNX Secure Tunnelling | ![](https://placehold.co/200x20/orange/white?text=UNDER+DEVELOPMENT) |
| KNX Secure Routing | ![](https://placehold.co/200x20/red/white?text=NO) |
| KNX 3rd PARTY IOT API client | ![](https://placehold.co/200x20/red/white?text=DELAYED) |
| Matter | ![](https://placehold.co/200x20/blue/white?text=UNDER+BRAINSTORMING) |

<br/>


## DOCUMENTATION

* [Wiki and Help](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki)
* [FAQ + Troubleshoot](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/5.-FAQ-Troubleshoot)
* [Security best practices](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/SECURITY)



## Highlights

If you're here, you probably already have tried other knx nodes from npm. I hope you enjoy this one, because i've put big effort to do what i really needed, a copy/paste friendly node, with many functions and the possibility to use the ETS csv exported Group Addresses.<br />

<details><summary>Stand alone or with ETS exported file</summary>

You can set you own group address, datapoint and device name, or you can import the ETS Group Address list and have datapoint and device name auto populated while typing in the group address.

</details>
<details><summary>Filling helpers</summary>

If you import your ETS CSV or ESF file, just begin typing the group address or the device name in the Group Address textbox and a list of possible matches will appear. Just select an item in the list it and have datapoint and device name auto populated. You can then accept the auto populated fields or change it.

</details>
<details><summary>Automatic encoding/deconding of KNX datagrams</summary>

Just pass a normal payload to the node (true, false, a string or any nymber) and just receive a normal payload (true, false, a string or any nymber) to use in your flow.

</details>
<details><summary>As single device, as Universal node.</summary>

The node can act as a single device (for example having Group Address 0/0/1), or can be used as universal node, catching all messages coming from KNX Bus (in this case the node will output a comprehensive msg to the flow, containing group address, device name, automatic decoded payload and other useful infos). The node can act as universal KNX sender as well (you can pass a message to the node, containing the destination group address, the datapont type and the payload).

</details>
<details><summary>Contextual help for formatting input messages</summary>

There is samples. There is huge documentation about settings and properties. If this is not enough for you, whenever you change the datapoint type, a textblock with a sample msg input (expecially, for tricky datapoints, like RGBW, 10Bytes, Relative Dimming, 3 Bytes setpoint etc...) appears. Just copy/paste it in a function and you're done.

</details>
<details><summary>Huge amount of Datapoints are supported</summary>

It supports a huge amount of datapoints. If you need more, just open a GitHub issue.

</details>
<details><summary>Self protection</summary>

The Node protects you, from mistakes you can do. [Node Protections](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Protections)

</details>
<details><summary>Built in RBE input/output filter</summary>

You can select to activate or deactivate it. If active, the node reacts only if payload from KNX Bus or from input msg is changed.

</details>
<details><summary>RAW message directly to the BUS</summary>

You can send RAW buffers directly to the bus.

</details>



## WORKING WITH THE ETS CSV FILE OR WITH ESF FILE

Instead of create a knx-ultimate node for each Group Address to control, you can import your ETS csv or esf group addresses file.  
Thanks to that, the knx-ultimate node where you selected **Universal mode (listen to all Group Addresses)**, becomes an universal input/output node, aware of all Datapoints, Group Addresses and Device's name (ex: Living Room Lamp). Just send the payload to the knx-ultimate node, and it'll encode it with the right datapoint and send it to the bus. Likewise, when the knx-ultimate node receives a telegram from the bus, it outputs a right decoded payload using the datapoint specified in the ETS file.  


<details><summary>Click here for a sample ETS csv file to paste into the ETS field of your config node.</summary>

> Copy/Paste this into your configuration node.


```javascript

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

</details>


<details><summary>Click here for a sample ETS esf file to paste into the ETS field of your config node.</summary>

> Copy/Paste this into your configuration node.


```javascript

My beautiful home
Attuatori luci.Luci primo piano.0/0/1	Luce camera da letto	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/2	Luce loggia camera da letto	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/3	Luce camera armadi	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/4	Luce bagno grande	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/5	Luce loggia bagno grande	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/6	Luce specchio bagno grande (switch)	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/7	Luce lavanderia	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/8	Luce specchio lavanderia (switch)	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/9	Luce studio	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/10	Plafoniera soggiorno (switch)	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/11	Applique soggiorno (switch)	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/12	Luce loggia soggiorno cucina	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/13	Luce cucina	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/14	Pensili cucina	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/15	Luce corridoio	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/16	LED scala	EIS 1 'Switching' (1 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/18	Luce specchio bagno grande(dim)	EIS 2 'Dimming - control' (4 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/20	Luce specchio lavanderia (dim)	EIS 2 'Dimming - control' (4 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/23	Plafoniera soggiorno (dim)	EIS 2 'Dimming - control' (4 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/24	Applique soggiorno (dim)	EIS 2 'Dimming - control' (4 Bit)	Low	
Attuatori luci.Luci primo piano.0/0/17	Applique soggiorno brighness value	Uncertain (1 Byte)	Low	
Attuatori luci.Luci primo piano.0/0/19	Plafoniera soggiorno brighness value	Uncertain (1 Byte)	Low	
Attuatori luci.Luci primo piano.0/0/21	LED cambiacolori RGB scala	EIS 1 'Switching' (1 Bit)	Low	

```

</details>

<br/>

<a href="https://youtu.be/egRbR_KwP9I" target="_blank"><img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png' width='60%'></a>

<br/>




## COMMERCIAL COMPANIES USING KNX-ULTIMATE
List of commercial companies, which have given us permission to be mentioned on this page. Want to be listed here? Email to maxsupergiovane@icloud.com

<br/>

<table> 
<tr> 
<td style="valign:center; border: 0px; padding: 15px;">


</td> 

<td style="valign:center; border: 0px; padding: 15px;">

[![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/tervis.png)](https://www.tervis.it)
</td> 
<td style="valign:center; border: 0px; padding: 15px;"> 

[![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/knxsardegna.png)](http://www.knxsardegna.com)
</td> 
<td style="valign:center; border: 0px; padding: 15px;"> 

[![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/agata.png)](https://www.agatastore.it)
</td>
<td style="valign:center; border: 0px; padding: 15px;">

[![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/proKNX.png)](https://proknx.com)
</td> 

<td style="valign:center; border: 0px; padding: 15px;">

[![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/altis.png)](https://altis.swiss)
</td> 

<td style="valign:center; border: 0px; padding: 15px;">

[![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/cannx.png)](https://can-nx.com/kloudnx-routeur-knx-iot-connecte-a-un-cloud-securise/)
</td> 

</tr> 
</table> 


<br/>

* [Tervis - Alarm System Manufacturer](https://www.tervis.it)
* [KNX Sardegna - Gianmarco Sitzia, Certified KNX Partner](http://www.knxsardegna.com)
* [Agata Store - Professional store and Certified KNX Partner](https://www.agatastore.it)
* [ProKNX - KNX Device Manufacturer](https://proknx.com)
* [Altis - Energy and utilities provider](https://altis.swiss)
* [Can'nX France - KNX Device Manufacturer and integrator](https://can-nx.com)

<br/>

## FRIENDLY COMMUNITIES AROUND THE WORLD

**Italy**
* [![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/viveresmart.png)](https://www.facebook.com/groups/viveresmart)
* [VivereSmart TV](https://www.youtube.com/channel/UC6GlFhcbNuoSEejZ_HlCynA)

**Germany**
* [![](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/c/knxuserforum.png)](https://knx-user-forum.de/forum/öffentlicher-bereich/knx-eib-forum/1389088-knx-node-for-node-red) 

**China**
* [QQ group: 837579219 （加群需要备注 "来自github"](tencent://groupwpa/?subcmd=all&param=7b2267726f757055696e223a3833373537393231392c2274696d655374616d70223a313633303934363639312c22617574684b6579223a22762b72482b466f4a496a75613033794e4a30744a6970756c55753639424f4d55724f464c4a6c474b77346a30326b7a4f7a3338535536517844684d7756414d62222c2261757468223a22227d&jump_from=)



<br/>
<br/>


## ARE YOU A NODEJS DEV? DO YOU KNOW THERE IS AN API FOR NODEJS?
Many users requested me to "extract" the baseline KNX API and make it accessible via npmjs. Here is it.<br/>
The API is named **KNXUltimate**. In the README page is well documented and there are also samples for unsecure and secure KNX connections.
* <a href="https://github.com/Supergiovane/KNXUltimate#readme">KNXUltimate API</a>

<br/>
<br/>

<br/>

A big THANK YOU to [@svenflender](https://github.com/svenflender) for the logo and icon graphics!
<br/>
We support [GitBook](https://www.gitbook.com)

![Logo](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/madeinitaly.png)
<p align='left'>
<img width="110px" src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/KNX_CERTI_MARK_RGB.jpg" ></br>
Authorized KNX logo by KNX Association</br>
*<i>The author <b>Massimo Saccani</b> has been authorized to use the KNX logo.
<br/>Forks of the knx-ultimate node are not implicitly allowed to use the KNX logo.</i>
</p>

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/master/LICENSE
[npm-url]: https://npmjs.org/package/node-red-contrib-knx-ultimate
[npm-version-image]: https://img.shields.io/npm/v/node-red-contrib-knx-ultimate.svg
[npm-downloads-month-image]: https://img.shields.io/npm/dm/node-red-contrib-knx-ultimate.svg
[npm-downloads-total-image]: https://img.shields.io/npm/dt/node-red-contrib-knx-ultimate.svg
[youtube-image]: https://img.shields.io/badge/Visit%20me-Youtube-red
[youtube-url]: https://www.youtube.com/channel/UCA9RsLps1IthT7fDSeUbRZw/playlists