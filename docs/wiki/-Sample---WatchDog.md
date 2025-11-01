---
layout: wiki
title: "-Sample---WatchDog"
lang: en
permalink: /wiki/-Sample---WatchDog/
---
# WATCHDOG NODE

## Set the KNX/IP Settings on the fly, using setGatewayConfig, after node-red start

With **msg.setGatewayConfig** , you can change the IP, Port, Physical Address and so on of your KNX/IP Interface or Router, previously set in the Config-Node<br/>
The Config-Node will change the settings and reconnect with new parameters.<br/>
ALL parameters are OPTIONAL <br/>
Please use the **WatchDog** node for that.<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/setGatewayConfig_WatchDog.png" width="90%"><br/>

```javascript

// IP: IP of your KNX/IP Router or Interface
// Port: Port of your KNX/IP Router or Interface
// PhysicalAddress: Physical address your KNX/IP Router or Interface (this is not a Group Address, this is a physical address indicating the physical device in your KNX installation), Protocol.
// BindToEthernetInterface: "Auto" (for automatic detection) or the ethernet interface name, for example "en0".
// Protocol: "TunnelUDP" or "TunnelTCP" or "Multicast"
// All these parameters are optional

msg.setGatewayConfig={IP:"224.0.23.12",Port:3671,PhysicalAddress:"15.15.1",BindToEthernetInterface:"Auto", Protocol:"Multicast"};
return msg;

```

**Copy this code and paste it into your flow**

<details><summary>View code</summary>

> Adjust the nodes according to your setup

```javascript

[{"id":"39b1ef7.17d501","type":"inject","z":"9502b3c8.f19e3","name":"","topic":"","payload":"true","payloadType":"bool","repeat":"","crontab":"","once":true,"onceDelay":"30","x":130,"y":460,"wires":[["2ce4d708.ba5de8"]]},{"id":"2ce4d708.ba5de8","type":"function","z":"9502b3c8.f19e3","name":"","func":"// You can change the IP, Port, etc.. of the KNX/IP interface/router set in the config-node\n\n// IP: IP of your KNX/IP Router or Interface\n// Port: Port of your KNX/IP Router or Interface\n// PhysicalAddress: Physical address your KNX/IP Router or Interface (this is not a Group Address, this is a physical address indicating the physical device in your KNX installation)\n// BindToEthernetInterface: \"Auto\" (for automatic detection) or the ethernet interface name, for example \"en0\".\n// All parameters are OPTIONAL. If you don't change a parameter, it remain as originally set in the config-node.\n\nmsg.setGatewayConfig={IP:\"224.0.23.12\",Port:3671,PhysicalAddress:\"15.15.1\",BindToEthernetInterface:\"Auto\"};\nreturn msg;","outputs":1,"noerr":0,"x":250,"y":460,"wires":[["2e1e57a9.763a5"]]},{"id":"9b756bbc.46205","type":"comment","z":"9502b3c8.f19e3","name":"Change the configuration of the KNX/IP interface/router on the fly","info":"","x":290,"y":420,"wires":[]},{"id":"2e1e57a9.763a5","type":"knxUltimateWatchDog","z":"9502b3c8.f19e3","server":"d5e285cc.d63828","topic":"12/0/0","maxRetry":6,"retryInterval":"5","name":"","x":420,"y":460,"wires":[[]]},{"id":"d5e285cc.d63828","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","physAddr":"15.15.23","suppressACKRequest":false,"csv":"","KNXEthInterface":"en9","KNXEthInterfaceManuallyInput":"pera","statusDisplayLastUpdate":true,"statusDisplayDeviceNameWhenALL":false,"statusDisplayDataPoint":false}]

```

</details>

## Email Notification if the BUS connection is broken or knx-ultimate node throws an error

You can enjoy using wht WatchDog by notify you if a KNX Bus error occurs or whenever a knx-ultimate node throws an error. You can start/stop the watchdog manually, or you can switch to a backup KNX/IP Router in case the main fails.<br/>
Please read the WatchDog related Wiki (points 7, 8, and 9 on the right wiki navigation's panel).<br/>
In this sandbox example, you can learn how to manually start/stop the watchdog, how to manually change the knx-ultimate gateway configuration and how to send, for example, an email in case of KNX connection problem and how to, for example, change the KNX Gateway configuration to a backup Gateway.<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/setGatewayConfig_WatchDog2.png" width="90%"><br/>

**Copy this code and paste it into your flow**

<details><summary>View code</summary>

> Adjust the nodes according to your setup

```javascript

[{"id":"f7193941.94ac3","type":"switch","z":"f7852589.7dea","name":"","property":"type","propertyType":"msg","rules":[{"t":"eq","v":"BUSError","vt":"str"},{"t":"eq","v":"NodeError","vt":"str"}],"checkall":"true","repair":false,"outputs":2,"x":770,"y":480,"wires":[["da0b9a3f.389428"],["5cefd0bc.e63f28"]]},{"id":"9525149d.21b2b","type":"debug","z":"f7852589.7dea","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":770,"y":560,"wires":[]},{"id":"690518fc.5a41b","type":"inject","z":"f7852589.7dea","name":"Start Watchdog","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":120,"y":620,"wires":[["73647197.c81a08"]]},{"id":"67190026.063a88","type":"inject","z":"f7852589.7dea","name":"Switch to main","topic":"","payload":"true","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":"30","x":120,"y":480,"wires":[["84133587.af475"]]},{"id":"84133587.af475","type":"function","z":"f7852589.7dea","name":"Main KNX/IP Router","func":"// You can change the IP, Port, etc.. of the KNX/IP interface/router set in the config-node\n\n// IP: IP of your KNX/IP Router or Interface\n// Port: Port of your KNX/IP Router or Interface\n// PhysicalAddress: Physical address your KNX/IP Router or Interface (this is not a Group Address, this is a physical address indicating the physical device in your KNX installation)\n// BindToEthernetInterface: \"Auto\" (for automatic detection) or the ethernet interface name, for example \"en0\".\n// All parameters are OPTIONAL. If you don't change a parameter, it remain as originally set in the config-node.\n\nmsg.setGatewayConfig={IP:\"192.168.1.22\",Port:3671,PhysicalAddress:\"15.15.1\",BindToEthernetInterface:\"en0\"};\nreturn msg;","outputs":1,"noerr":0,"x":340,"y":480,"wires":[["3b2259e0.6a090e"]]},{"id":"1b9d80c.f5e4bff","type":"comment","z":"f7852589.7dea","name":"Adjust the KNX/IP params in the functions, manually switch KNX/IP Router and see what appens","info":"","x":350,"y":440,"wires":[]},{"id":"c18ab24.c009fd","type":"function","z":"f7852589.7dea","name":"Backup KNX/IP Router","func":"// You can change the IP, Port, etc.. of the KNX/IP interface/router set in the config-node\n\n// IP: IP of your KNX/IP Router or Interface\n// Port: Port of your KNX/IP Router or Interface\n// PhysicalAddress: Physical address your KNX/IP Router or Interface (this is not a Group Address, this is a physical address indicating the physical device in your KNX installation)\n// BindToEthernetInterface: If you've set the config node to bind to one of your local Ethernet cards, you can reset it to \"Auto\" select the ethernet interface.\n\n// All parameters are OPTIONAL. If you don't change a parameter, it remain as originally set in the config-node.\n// BindToEthernetInterface: Currently, you can only set it to \"Auto\".\nmsg.setGatewayConfig={IP:\"224.0.23.12\",Port:3671,PhysicalAddress:\"15.15.1\",BindToEthernetInterface:\"Auto\"};\nreturn msg;","outputs":1,"noerr":0,"x":340,"y":520,"wires":[["3b2259e0.6a090e"]]},{"id":"1752b50a.be899b","type":"inject","z":"f7852589.7dea","name":"Switch to backup","topic":"","payload":"true","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":"30","x":120,"y":520,"wires":[["c18ab24.c009fd"]]},{"id":"7d1e8b3b.63213c","type":"comment","z":"f7852589.7dea","name":"Manually Start/Stop the Watchdog. Enjoy.","info":"","x":180,"y":580,"wires":[]},{"id":"3b2259e0.6a090e","type":"knxUltimateWatchDog","z":"f7852589.7dea","server":"9a2eb248.18135","topic":"12/0/0","maxRetry":6,"retryInterval":"5","name":"","autoStart":true,"checkLevel":"Ethernet","x":600,"y":480,"wires":[["f7193941.94ac3","9525149d.21b2b"]]},{"id":"c009690e.a2cfd","type":"inject","z":"f7852589.7dea","name":"Stop Watchdog","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":120,"y":660,"wires":[["4be13cb7.426fac"]]},{"id":"73647197.c81a08","type":"function","z":"f7852589.7dea","name":"Start","func":"return {start:true};","outputs":1,"noerr":0,"x":390,"y":620,"wires":[["3b2259e0.6a090e"]]},{"id":"4be13cb7.426fac","type":"function","z":"f7852589.7dea","name":"Stop","func":"return {start:false};","outputs":1,"noerr":0,"x":390,"y":660,"wires":[["3b2259e0.6a090e"]]},{"id":"da0b9a3f.389428","type":"function","z":"f7852589.7dea","name":"Email for BUS Error","func":"// You can send an Email to your KNX installer\nreturn msg;","outputs":1,"noerr":0,"x":950,"y":480,"wires":[["facc44b5.042f18"]]},{"id":"5cefd0bc.e63f28","type":"function","z":"f7852589.7dea","name":"Email for Nodes Error","func":"// You land here if sone kns-ultimate nodes reports an error\n// You can send an Email to your KNX installer\nreturn msg;","outputs":1,"noerr":0,"x":960,"y":520,"wires":[[]]},{"id":"facc44b5.042f18","type":"function","z":"f7852589.7dea","name":"Switch to Backup KNX/IP Router","func":"// You can switch to a backup KNX/IP Router\nmsg.setGatewayConfig={IP:\"224.0.23.12\",Port:3671,PhysicalAddress:\"15.15.1\",BindToEthernetInterface:\"Auto\"};\nreturn msg;","outputs":1,"noerr":0,"x":1200,"y":480,"wires":[[]]},{"id":"9a2eb248.18135","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","physAddr":"15.15.23","suppressACKRequest":false,"csv":"","KNXEthInterface":"en9","KNXEthInterfaceManuallyInput":"pera","statusDisplayLastUpdate":true,"statusDisplayDeviceNameWhenALL":false,"statusDisplayDataPoint":false}]

```

</details>

<br/>
<br/>

## Force connection/disconnection of the selected gateway from the KNX BUS

You can force the selected gateway to disconnect from the KNX BUS and to STOP reconnection attempts.<br/>
You can also force the selected gateway to connect to the KNX BUS and to ENABLE reconnection attempts.<br/>

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/watchdogdisconnection.png" width="90%"><br/>

**Copy this code and paste it into your flow**

<details><summary>View code</summary>

> Adjust the nodes according to your setup

```javascript

[{"id":"4fbf11a5.d8caf","type":"knxUltimateWatchDog","z":"5d781580.f89214","server":"58f9cc39.6bb3d4","topic":"12/0/0","maxRetry":6,"retryInterval":10,"name":"","autoStart":true,"checkLevel":"Ethernet","x":400,"y":520,"wires":[["5fcf488.bfb2fb8"]]},{"id":"47621d6a.408eec","type":"inject","z":"5d781580.f89214","name":"Disconnect","props":[{"p":"connectGateway","v":"false","vt":"bool"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":150,"y":520,"wires":[["4fbf11a5.d8caf"]]},{"id":"49dea71e.2225b","type":"inject","z":"5d781580.f89214","name":"Connect","props":[{"p":"connectGateway","v":"true","vt":"bool"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":140,"y":560,"wires":[["4fbf11a5.d8caf"]]},{"id":"5fcf488.bfb2fb8","type":"debug","z":"5d781580.f89214","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":590,"y":520,"wires":[]},{"id":"e77def57.0ea33","type":"comment","z":"5d781580.f89214","name":"Force disconnection/connection from the KNX BUS, of the selected Gateway","info":"","x":350,"y":480,"wires":[]},{"id":"58f9cc39.6bb3d4","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"15.15.22","suppressACKRequest":true,"csv":"","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":true,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":false,"stopETSImportIfNoDatapoint":"stop","loglevel":"error","name":"Multicast KNX Gateway","localEchoInTunneling":true,"delaybetweentelegrams":"40","delaybetweentelegramsfurtherdelayREAD":"1"}]

```

</details>
