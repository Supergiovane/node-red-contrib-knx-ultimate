![Logo](img/logo-big.png)

<br/>

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads per month][npm-downloads-month-image]][npm-url]
[![NPM downloads total][npm-downloads-total-image]][npm-url]
[![MIT License][license-image]][license-url]
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Sample Node](img/readmemain.png)

**You can use it immediately!**
```javascript
payload=true // Turn light on
payload={red:255, green:200, blue:30} // Put some colors in our life
```

## DESCRIPTION

* **KNX-ULTIMATE node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/2.-Node-Configuration), allow you to control your *KNX installation* via Node-Red. You can control all your KNX devices as well as create a *Virtual Device* in Node-Red, to link external *non KNX* devices, and make it compatible with your KNX installation. I'ts very SIMPLE TO USE thus very customizable.  
* **SCENE CONTROLLER node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration), The scene controller node can act as a real scene controller, with recall and save of the current scene.
* **WATCHDOG node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/7.-WatchDog-Configuration), allows notification (Email, Twitter, Telegram, Alexa, Siri, Sonos -with sonospollytts node- and so on) of KNX Bus connection errors, automatic or manual switchover to a backup KNX/IP router if the primary fails and allows you to programmatically change the config-node directly from a msg flow.
* **LOGGER node** [here](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Logger-Configuration), creates an XML diagnostic file, compatible with ETS. You can open it with ETS for diagnostic pourposes.

[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square)](https://www.paypal.me/techtoday) and <a href="http://eepurl.com/gJm095" target="_blank">subscribe to my channel.</a> Only news about my nodes, no spam, no ads.<br/>
[![Buy a Sticker!](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/PoweredBySticker.png) Buy a die-cut sticker "powered by KNX-Ultimate" for your products](https://teespring.com/it/stores/knx-ultimate-support-store)

## CHANGELOG
* See <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md">here the changelog</a>

## INTERNATIONALIZATION
<a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Overview"><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/usa-today.png"/></a>
<a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/de-Overview"><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/germany.png"/></a>
<a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/it-Overview"><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/italy.png"/></a><br/>
*I'm internationalizing the node **(Deutsch, Italiano, English)** with the foundamental help of **@svenflender**, so please be patient if some parts are still only in english. Internationalization is working with node-red version 1.0.3 and above. Versions below, does have issues in the i18n module, so knx-ultimate falls back to english. Please upgrade node-red.*

## TROUBLESHOOT, WIKI, FAQ, BEST PRACTICES AND SAMPLES
* [Youtube video](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYpfy1Auz6CKDfXUusgMwOQr)
* [Overview](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki)
* [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md)
* [FAQ + Troubleshoot](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/5.-FAQ-Troubleshoot)
* [Security best practices](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/SECURITY)
* *SAMPLES*
  * [Sample Switch Light](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light)
  * [Sample Dimming](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming)
  * [Sample RGB color](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color)
  * [Sample RGBW color + White](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White)
  * [Sample Command a scene actuator](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator)
  * [Sample Datapoint 222.x Setpoint](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222)
  * [Sample Datetime to BUS](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS)
  * [Sample Read Status](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device)
  * [Sample Virtual Device](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device)
  * [Sample Subtype decoded](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype)
  * [Sample Scene Controller](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)
  * [Sample WatchDog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog)
<table>
  <tr>
    <td>Sample code for use with </td>
    <td valign="center" height="60"><a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit"><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/homekit.png" ></a></td>
    <td valign="center" height="60"><a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa"><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/alexa.png" ></a></td> 
    <td valign="center" height="60"><a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant"><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/googleassistant.png" ></a></td> 
  </tr>
 </table>


## Supported Datapoints:
<details><summary>List of supported Datapoints</summary>
1.002 (DPT_Bool)<br/>
1.003 (DPT_Enable)<br/>
1.004 (DPT_Ramp)<br/>
1.005 (DPT_Alarm)<br/>
1.006 (DPT_BinaryValue)<br/>
1.007 (DPT_Step)<br/>
1.008 (DPT_UpDown)<br/>
1.009 (DPT_OpenClose)<br/>
1.010 (DPT_Start)<br/>
1.011 (DPT_State)<br/>
1.012 (DPT_Invert)<br/>
1.013 (DPT_DimSendStyle)<br/>
1.014 (DPT_InputSource)<br/>
1.015 (DPT_Reset)<br/>
1.016 (DPT_Ack)<br/>
1.017 (DPT_Trigger)<br/>
1.018 (DPT_Occupancy)<br/>
1.019 (DPT_WindowDoor)<br/>
1.021 (DPT_LogicalFunction)<br/>
1.022 (DPT_Scene_AB)<br/>
1.023 (DPT_ShutterBlinds_Mode)<br/>
1.100 (DPT_Heat/Cool)<br/>
2.001 (DPT_Switch_Control)<br/>
2.002 (DPT_Bool_Control)<br/>
2.003 (DPT_Emable_Control)<br/>
2.004 (DPT_Ramp_Control)<br/>
2.005 (DPT_Alarm_Control)<br/>
2.006 (DPT_BinaryValue_Control)<br/>
2.007 (DPT_Step_Control)<br/>
2.008 (DPT_Direction1_Control)<br/>
2.009 (DPT_Direction2_Control)<br/>
3.007 (DPT_Control_Dimming [payload:{decr_incr:1 (1 to increase or 0 to decrease), data: 5}])<br/>
3.008 (DPT_Control_Blinds)<br/>
4.001 (DPT_Char_ASCII)<br/>
4.002 (DPT_Char_8859_1)<br/>
5.001 (DPT_Scaling)<br/>
5.003 (DPT_Angle)<br/>
5.004 (DPT_Percent_U8)<br/>
5.005 (DPT_DecimalFactor)<br/>
5.006 (DPT_Tariff)<br/>
5.010 (DPT_Counter_Pulses)<br/>
5.100 (DPT_Fan_Stage)<br/>
6.001 (DPT_Switch)<br/>
6.010 (DPT_Bool)<br/>
7.001 (DPT_Value_2_Ucount)<br/>
7.002 (DPT_TimePeriodMsec)<br/>
7.003 (DPT_TimePeriod10Msec)<br/>
7.004 (DPT_TimePeriod100Msec)<br/>
7.005 (DPT_TimePeriodSec)<br/>
7.006 (DPT_TimePeriodMin)<br/>
7.007 (DPT_TimePeriodHrs)<br/>
7.010 (DPT_PropDataType)<br/>
7.011 (DPT_Length_mm)<br/>
7.012 (DPT_UEICurrentmA)<br/>
7.013 (DPT_Brightness)<br/>
7.600 (DPT_Absolute_Colour_Temperature)<br/>
8.001 (DPT_Value_2_Count)<br/>
8.002 (DPT_DeltaTimeMsec)<br/>
8.003 (DPT_DeltaTime10Msec)<br/>
8.004 (DPT_DeltaTime100Msec)<br/>
8.005 (DPT_DeltaTimeSec)<br/>
8.006 (DPT_DeltaTimeMin)<br/>
8.007 (DPT_DeltaTimeHrs)<br/>
8.010 (DPT_Percent_V16)<br/>
8.011 (DPT_RotationAngle)<br/>
9.001 (DPT_Value_Temp)<br/>
9.002 (DPT_Value_Tempd)<br/>
9.003 (DPT_Value_Tempa)<br/>
9.004 (DPT_Value_Lux)<br/>
9.005 (DPT_Value_Wsp)<br/>
9.006 (DPT_Value_Pres)<br/>
9.007 (DPT_Value_Humidity)<br/>
9.008 (DPT_Value_AirQuality)<br/>
9.010 (DPT_Value_Time1)<br/>
9.011 (DPT_Value_Time2)<br/>
9.020 (DPT_Value_Volt)<br/>
9.021 (DPT_Value_Curr)<br/>
9.022 (DPT_PowerDensity)<br/>
9.023 (DPT_KelvinPerPercent)<br/>
9.024 (DPT_Power)<br/>
9.025 (DPT_Value_Volume_Flow)<br/>
9.026 (DPT_Rain_Amount)<br/>
9.027 (DPT_Value_Temp_F)<br/>
9.028 (DPT_Value_Wsp_kmh)<br/>
10.001 (DPT_TimeOfDay)<br/>
11.001 (DPT_Date)<br/>
12.001 (DPT_Value_4_Ucount)<br/>
12.1201 (DPT_Value_Volume_m3)<br/>
13.001 (DPT_Value_4_Count)<br/>
13.002 (DPT_Value_Activation_Energy)<br/>
13.010 (DPT_ActiveEnergy)<br/>
13.011 (DPT_ApparantEnergy)<br/>
13.012 (DPT_ReactiveEnergy)<br/>
13.013 (DPT_ActiveEnergy_kWh)<br/>
13.014 (DPT_ApparantEnergy_kVAh)<br/>
13.015 (DPT_ReactiveEnergy_kVARh)<br/>
13.100 (DPT_LongDeltaTimeSec)<br/>
14.007 (DPT_Value_AngleDeg°)<br/>
14.019 (DPT_Value_Electric_Current)<br/>
14.027 (DPT_Value_Electric_Potential)<br/>
14.028 (DPT_Value_Electric_PotentialDifference)<br/>
14.031 (DPT_Value_Energ)<br/>
14.032 (DPT_Value_Force)<br/>
14.033 (DPT_Value_Frequency)<br/>
14.036 (DPT_Value_Heat_FlowRate)<br/>
14.037 (DPT_Value_Heat_Quantity)<br/>
14.038 (DPT_Value_Impedance)<br/>
14.039 (DPT_Value_Length)<br/>
14.051 (DPT_Value_Mass)<br/>
14.056 (DPT_Value_Power)<br/>
14.065 (DPT_Value_Speed)<br/>
14.066 (DPT_Value_Stress)<br/>
14.067 (DPT_Value_Surface_Tension)<br/>
14.068 (DPT_Value_Common_Temperature)<br/>
14.069 (DPT_Value_Absolute_Temperature)<br/>
14.070 (DPT_Value_TemperatureDifference)<br/>
14.078 (DPT_Value_Weight)<br/>
14.079 (DPT_Value_Work)<br/>
15.000 (DPT_Access_Data)<br/>
16.000 (DPT_String_ASCII)<br/>
16.001 (DPT_String_8859_1)<br/>
17.001 (DPT_SceneNumber)<br/>
18.001 (DPT_SceneControl [payload:{'save_recall':0 (0 to recall or 1 to save), 'scenenumber':2}])<br/>
19.001 (DPT_DateTime)<br/>
20.102 (HVAC_Mode)<br/>
222.100 (3x16 Bit Setpoint [payload:{Comport:21, Standby:20, Economy:18}])<br/>
222.101 (3x16 Bit Setpoint Shift [payload:{Comport:1, Standby:1, Economy:3}])<br/>
232.600 (RGB [payload:{red:255, green:200, blue:30}])<br/>
238.003 (DPT_Angle)<br/>
238.004 (DPT_Percent_U8)<br/>
238.005 (DPT_DecimalFactor)<br/>
238.006 (DPT_Tariff)<br/>
238.010 (DPT_Value_1_Ucount)<br/>
238.102 (HVAC_Mode)<br/>
251.600 (RGBW [payload:{red:255, green:200, blue:30, white:50, mR:1, mG:1, mB:1, mW:1}])<br/>
999.001 (DPT_10Bytes_HEX [payload: '123400000000000000' or '$12 $34 $00 $00 $00 $00 $00 $00 $00'])<br/>
</details>

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
<details><summary>Double Personality</summary>

The node can act as a single device (for example having Group Address 0/0/1), or can be used as universal node, catching all messages coming from KNX Bus (in this case the node will output a comprehensive msg to the flow, containing group address, device name, automatic decoded payload and other useful infos). The node can act as universal KNX sender as well (you can pass a message to the node, containing the destination group address, the datapont type and the payload).

</details>
<details><summary>Emulate real KNX device</summary>

You can use the node to emulate a phisically non existent KNX device. The node will behave exactly as a normal KNX Device and will also respond to read requests coming from the KNX bus, by sending the current payload value to the KNX bus.

</details>
<details><summary>Customizable status display</summary>

You can select what to see in the status (the row below the node). For example, you can select to see the current payload value and the last time changed, or the device name as well.

</details>
<details><summary>Self protection</summary>

The Node protects you, from youself. [Node Protections](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Protections)

</details>
<details><summary>Built in RBE input/output filter</summary>

You can select to activate or deactivate it. If active, the node reacts only if payload from KNX Bus or from input msg is changed.

</details>
<details><summary>Automatic KNX interface type</summary>

Full support for IP Interfaces as well for IP Routers. It's recommended the use of IP Routers because of simple setup and stability in a large environment.

</details>


## WORKING WITH THE ETS CSV FILE OR WITH ESF FILE

Instead of create a knx-ultimate node for each Group Address to control, you can import your ETS csv or esf group addresses file.  
Thanks to that, the knx-ultimate node where you selected **Universal mode (listen to all Group Addresses)**, becomes an universal input/output node, aware of all Datapoints, Group Addresses and Device's name (ex: Living Room Lamp). Just send the payload to the knx-ultimate node, and it'll encode it with the right datapoint and send it to the bus. Likewise, when the knx-ultimate node receives a telegram from the bus, it outputs a right decoded payload using the datapoint specified in the ETS file.

<details><summary>Sample ETS csv file to paste into the ETS field of your config node.</summary>

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


<details><summary>Sample ETS esf file to paste into the ETS field of your config node.</summary>

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

> You can work with a mix of knx-ultimate nodes, some with **Universal mode (listen to all Group Addresses)** checked and some not. You are absolutely free! See this youtube video,

<a href="https://youtu.be/egRbR_KwP9I" target="_blank"><img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png' width='60%'></a>

<br/>


# <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki">Click here for comprehensive samples</a>
**Turn on/off a Lamp**
```javascript
return {payload:true}
```
```javascript
return {payload:false}
```

**Increase the light/open blind**
```javascript
// The parameter "data" indicates the relative amount of the dimming commmand (how much to dim).
// The parameter "data" can be any integer value from 0 to 7
// The parameter decr_incr:1 increases the light
// The parameter decr_incr:0 decreases the light
msg.payload={decr_incr: 1, data: 5};
return msg;
```

**Set RGB color**
```javascript
// Each color in a range between 0 and 255
msg.payload={red:255, green:200, blue:30};
return msg;
```

[MORE Samples and documentation....](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki)

![Logo](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/flags/madeinitaly.png)

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/master/LICENSE
[npm-url]: https://npmjs.org/package/node-red-contrib-knx-ultimate
[npm-version-image]: https://img.shields.io/npm/v/node-red-contrib-knx-ultimate.svg
[npm-downloads-month-image]: https://img.shields.io/npm/dm/node-red-contrib-knx-ultimate.svg
[npm-downloads-total-image]: https://img.shields.io/npm/dt/node-red-contrib-knx-ultimate.svg
