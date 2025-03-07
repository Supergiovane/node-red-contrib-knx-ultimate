![Sample Node](img/logo.png)

[![Donate via PayPal](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/CodiceQR.png)](https://www.paypal.com/donate/?hosted_button_id=S8SKPUBSPK758)

<br/>

# CHANGELOG

**Version 3.3.20** - March 2025<br/>
- Load control node: fixed a malfunction in the flow's msg.shedding procedure.<br/>

**Version 3.3.19** - March 2025<br/>
- HUE light nodes now have the colored status icon that follows the light status on/off. Blue fill dot is ON, blue ring is OFF<br/>

**Version 3.3.18** - March 2025<br/>
- For all HUE nodes, added both the HUE and KNX status in the node's status text.<br/>
- HUE engine: fixed a reconnection issue occurring sometimes, in some circumstances.<br/>
- KNX engine: speed up the connection, from 30 to 10 seconds.<br/>

**Version 3.3.16** - February 2025<br/>
- HUE config node: moved the connect directive after events declarations.<br/>
- HUE engine: optimized the disconnection detection procedure.<br/>

**Version 3.3.15** - February 2025<br/>
- Housekeeping and added some warnings on Watchdog node and configuration nodes.<br/>

**Version 3.3.14** - January 2025<br/>
- NEW: Added all subtypes to KNX Datapoint 20.x.<br/>

**Version 3.3.13** - January 2025<br/>
- NEW: Hue light now handles Hue Outlets as well.<br/>

**Version 3.3.9** - December 2024<br/>
- CHRISTMAS FIX: issue on iterable interfaces error in raspberry pi.<br/>

**Version 3.3.8** - December 2024<br/>
- HOT FIX: fixed compilation problem in the knx engine, causing the node to stop working.<br/>

**Version 3.3.7** - December 2024<br/>
- DPT18.x: fixed scene validation 1 to 64.<br/>

**Version 3.3.6** - December 2024<br/>
- KNX Alerter Node: read status after deploy even of a single node.<br/>

**Version 3.3.5** - December 2024<br/>
- KNX Alerter Node: now the node works even if no ETS file has been imported.<br/>

**Version 3.3.3** - November 2024<br/>
- KNX Config Node: Automatic KNX Gateway discover in the gateway node config window.<br/>
- KNX Engine: new: new telegram sequencer waiter, for more accurate timing in slow or sliggish computers.<br/>
- KNX Engine: bunp 4.0.0-beta.7 .<br/>

**Version 3.3.0** - November 2024<br/>
- KNX Engine: explicitly set the local port of the unicast socket on 3671 and the local IP of the multicast to 0.0.0.0.<br/>
- KNX Engine: many engine adaptation for the upcoming KNX-Secure implementation.<br/>

**Version 3.2.17** - October 2024<br/>
- Hue devices: globally check for boundary limits, when calculating brightness and colorYX from an RGB or HEX KNX input.<br/>

**Version 3.2.16** - October 2024<br/>
- Hue devices: fixed an issue with the ETS CSV file, when a HUE device's GA isn't contained in the CSV.<br/>
- Hue Light: fixed an issue in setting RGB to 255,255,255, caused by an out of boundary of the calculater brightness value.<br/>

**Version 3.2.15** - October 2024<br/>
- Hue Light: fixed an issue with old lightstrip causing an error in setting mirek.<br/>

**Version 3.2.14** - October 2024<br/>
- Workarouded bug in node-red 4.0.x not selecting the default server's node.<br/>

**Version 3.2.13** - October 2024<br/>
- Revert back from gathering the debug log. It doesn't like me.<br/>

**Version 3.2.12** - October 2024<br/>
- Bump knxultimate engine to v. 3.0.4.<br/>

**Version 3.2.11** - October 2024<br/>
- Fixed help texts in various nodes.<br/>
- When you open a node, the node red's site bar goes into the help panel. Then, it goes into the info panel once closed.<br/>
- Gather debug infos + log to be pasted into a new gitHub Issue. See the "Utility" TAB of the KNX Gateway config node. See DISCUSSIONS on gitHub.<br/>

**Version 3.2.10** - October 2024<br/>
- Fixed a race condition happening whenever FULL DEPLOY is pressed in the node-red interface, preventing the HUE bridge node to gracefully disconnect from the HUE Bridge.<br/>

**Version 3.2.9** - October 2024<br/>
- Maintenance release: added some log to better identify problems.<br/>

**Version 3.2.8** - October 2024<br/>
- KNX Node: fixed "read status at startup" field not showing up in very old versions.<br/>

**Version 3.2.7** - September 2024<br/>
- KNX Node: added "echoed" property to the flow's msg output. See help for further infos.<br/>

**Version 3.2.6** - September 2024<br/>
- KNXViewer: fixed an issue with the PIN3.<br/>

**Version 3.2.4** - September 2024<br/>
- KNX engine: fix oldest invalid KNX queue interval, by defaulting it to 25ms.<br/>

**Version 3.2.2** - September 2024<br/>
- KNX engine: Bump to 3.0.2: fixed an issue with the KNX queue.<br/>

**Version 3.2.1-beta.0** - September 2024<br/>
- Rewrote the logger engine and fixed some issues in the KNXUltimate package.<br/>
- KNX engine: implemented a new "limiter" package for better calculate the maximum numbers of telegrams accepted by the KNX BUS.<br/>

**Version 3.2.0** - September 2024<br/>
- Major Version.<br/>
- HUE engine: implemented a new "limiter" package for better calculate the maximum numbers of telegrams accepted by the HUE Bridge.<br/>


**Version 3.1.9** - September 2024<br/>
- HUE Bridge: you can now register to a bridge with your own credentials.<br/>
- HUE Bridge: you can reveal the encrypted bridge's credentials (there is a button for that).<br/>

**Version 3.1.8** - September 2024<br/>
- Wiki: completed the wiki for all nodes.<br/>
- Node-Red help panel: completed the help for all nodes.<br/>
- Logging: fixed the loglevel (was simply ignored before!).<br/>

**Version 3.1.7** - August 2024<br/>
- KNX Node: KNX Function: async/await caused some race condition issues, so the code is now sync.<br/>

**Version 3.1.6** - August 2024<br/>
- KNX Node: KNX Function: added "self", "toggle" and "setGAValue" function. See the help.<br/>
- KNX Node: KNX Function: the code runs now in async/await mode.<br/>
- The wiki has been revamped and will be implemented with HUE samples, in the upcoming release.<br/>

**Version 3.1.5** - August 2024<br/>
- KNX Node: fixed some UI glitches while switching from universal mode to 3-level group Group Address.<br/>
- KNX Function code editor: exited BETA.<br/>

**Version 3.1.4** - August 2024<br/>
- KNX Node: added a group address search helper in the KNX Function TAB.<br/>
- Updated documentation.<br/>

**Version 3.1.3** - August 2024<br/>
- KNX Node: now the property page opens directly on KNX Function tab, if js code is present. CAUTION, KNX FUNCTION IS STILL IN BETA AND SUBJECT TO CHANGES.<br/>
- KNX Node: Universal mode is now selectable in the dropdown list of GA Types.<br/>
- KNX Node: better UI controls placements.<br/>
- Updated documentation.<br/>

**Version 3.1.2** - August 2024<br/>
- NEW: KNX Function code editor: minor fixes. CAUTION, KNX FUNCTION IS STILL IN BETA AND SUBJECT TO CHANGES.<br/>

**Version 3.1.1** - August 2024<br/>
- NEW: KNX Function code editor in the device node: you can now write you own script to handle inbound and outboud KNX messages. Added "node" and "RED" object to the function's context. CAUTION, KNX FUNCTION IS STILL IN BETA AND SUBJECT TO CHANGES.<br/>

**Version 3.1.0** - August 2024<br/>
- NEW: KNX Function code editor in the device node: you can now write you own script to handle inbound and outboud KNX messages.<br/>

**Version 3.0.10** - August 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- KNX Auto Responder node (BETA): fixed issue with unused saved values. Please be aware that until the node exits beta, there can be breaking changes.<br/>

**Version 3.0.9** - August 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- KNX Auto Responder node (BETA): fixed issue with malformed responses. Please be aware that until the node exits beta, there can be breaking changes.<br/>

**Version 3.0.7** - August 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- KNX Auto Responder node (BETA): at start, it loads the last states saved in a persistent file. Please be aware that until the node exits beta, there can be breaking changes.<br/>

**Version 3.0.6** - August 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- KNX Auto Responder node (BETA): fixed some issues when the ETS file has not been imported. Please be aware that until the node exits beta, there can be breaking changes.<br/>

**Version 3.0.5** - August 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- KNX Auto Responder node (BETA): changed to JSON array instead of plain text and updated the help. Please be aware that until the node exits beta, there can be breaking changes.<br/>

**Version 3.0.4** - August 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- NEW: KNX Auto Responder node (BETA): The node will respond to read request coming from the KNX BUS, with the current GA value. Please be aware that until the node exits beta, there can be breaking changes.<br/>

**Version 3.0.3** - July 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- FIX: fix crash when no more KNX tunnels avaiable.<br/>

**Version 3.0.2** - July 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- HUE BRIDGE: added the message to DEPLOY the flow prior to proceed, when you're creating a new HUE CONFIG node.<br/>

**Version 3.0.1** - July 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- FEATURE: Due to multiple users not well knowing the KNX Protocol, by default new nodes have "Auto" in the protocol field. The node will automatically detect and apply the correct protocol. This is the real AI.<br/>

**Version 3.0.0** - July 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- FEATURE CAUTION: rewrote the KNX engine in Typescript. If you encounter problems, please open a gitub issue. You can revert by installing the older version 2.5.1 <br/>
- FEATURE: KNX Ultimate node: you can now set the group address from a global, flow or $env variable, beside the standard 3-level format. <br/>
- FEATURE: KNX Ultimate node: if you imported the ETS file, as soon as you click to any Group Address field selector, the list shows up immediately. <br/>
- FEATURE: KNX Ultimate node: msg.setConfig passed to the node, now can read the group address name and datapoint automatically, based on the group address (require the ETS file to be imported). <br/>
- FEATURE: KNX Ultimate node: the object property *gainfo* has been added to the msg output. Refer to the help panel for further infos. <br/>
- Chore: "betterized" the description for some captions in the KNX Device node. </br>
- NEW: KNX Viewer node: added an output PIN (third) you can use to monitor the KNX BUS congestion.</br>
- Chore: HUEEngine: reduced waiting time from 200 to 150ms and "awaited" the async function to send the hue commands in the send's loop. </br>
- NEW: Hue Node Software Update Status for the HUE devices. <br/>

**Version 3.0.0-beta3** - Juni 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- Chore: "betterized" the description for some captions in the KNX Device node. </br>
- NEW: KNX Viewer node: added an output PIN (third) you can use to monitor the KNX BUS congestion.</br>
- Chore: HUEEngine: reduced waiting time from 200 to 150ms and "awaited" the async function to send the hue commands in the send's loop. </br>

**Version 3.0.0-beta2** - Juni 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- NEW: Hue Node Software Update Status for the HUE devices. <br/>

**Version 3.0.0-beta1** - Juni 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- FEATURE CAUTION: rewrote the KNX engine in Typescript. If you encounter problems, please open a gitub issue. You can revert by installing the older version 2.5.1 <br/>
- FEATURE: KNX Ultimate node: you can now set the group address from a global, flow or $env variable, beside the standard 3-level format. <br/>
- FEATURE: KNX Ultimate node: if you imported the ETS file, as soon as you click to the Group Address field, the list shows up immediately. <br/>
- FEATURE: KNX Ultimate node: msg.setConfig passed to the node, now can read the group address name and datapoint automatically, based on the group address (require the ETS file to be imported). <br/>
- FEATURE: KNX Ultimate node: the object property *gainfo* has been added to the msg output. Refer to the help panel for further infos. <br/>


**Version 2.5.1** - Mai 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- NEW: HUE light node: you can now override the day/night mode by setting the day mode temporary, whenever you fast toggles the light switch on then off within 10 seconds. There are multiple choiches to select from. <br/>

**Version 2.5.0** - Mai 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- HUE light node: internally calculate the average color xy and temp in kelvin, for group_lights (not emitted by the HUE Bridge).<br/>
- KNOW ISSUE: HUE light node: grouped_lights: the status group address is updated multiple times, equals to the lights contained in the grouped_light. To avoid repeating the same telegram multiple times, simply enable the RBE filter on the KNX node. <br/>

**Version 2.4.27** - Mai 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- HUE light node: fixed status refresh of kelvin and brightness of a light belonging to a grouped_light.<br/>
- KNOW ISSUE: HUE light node: grouped_lights: the status group address is updated multiple times, equals to the lights contained in the grouped_light. To avoid repeating the same telegram multiple times, simply enable the RBE filter on the KNX node. <br/>

**Version 2.4.25** - Mai 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- HUE light node: fixed status sent to the KNX bus after issuing a read request for grouped_lights.<br/>
- KNOW ISSUE: HUE light node: grouped_lights: the status group address is updated multiple times, equals to the lights contained in the grouped_light. To avoid repeating the same telegram multiple times, simply enable the RBE filter on the KNX node. <br/>

**Version 2.4.24** - Mai 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- HUE light node: fixed kelvin temp status with datapoint 7.600, that sent wrong values to the bus.<br/>

**Version 2.4.23** - Mai 2024<br/>
- Warning: Node-Red version **equals or major than 3.1.1** is needed to run this node.<br/>
- HUE Scene node: fixed max scene count to 64.<br/>
 
**Version 2.4.22** - April 2024<br/>
- Warning: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- HUE button node: NEW: now you can select the value and the dim direction to be transmitted, when Toggle Status is set to unchecked. Thanks @cybersmart-eu for the suggestion.<br/>

**Version 2.4.21** - April 2024<br/>
- Warning: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- Home Assistant translator node: fixed an issue where user added translations does not work.<br/>

**Version 2.4.20** - April 2024<br/>
- Warning: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- DPT9: auto transform a string value, to a numeric value.<br/>

**Version 2.4.19** - April 2024<br/>
- Warning: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- Start adding youtube lessons and tutorials and linking it with the nodes.<br/>

**Version 2.4.18** - April 2024<br/>
- Warning: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- Fixed some backward compatibility glitches in the KNX-Device's UI.<br/>

**Version 2.4.16** - April 2024<br/>
- Warning: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- NEW: Home Assistant translator node: translates the HA input msg, to a KNX value. Comes with a built-in translation table, that's user editable.<br/>
- NEW: HUE Contact Sensor node.<br/>
- NEW: You can now get a list of all node's GA, to paste it into your KNX/IP routing table list. (See in the Gateway config window, TAB Utility.<br/>
- Updated KNX-Ultimate device node help.<br/>
- Minor KNX-Ultimate device node UI changes.<br/>
- Fixed an issue with the RBE Filters.<br/>

**Version 2.4.9** - March 2024<br/>
- WARNING: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- Fixed [this](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/338).<br/>

**Version 2.4.6** - Feb 2024<br/>
- WARNING: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- Changed the KNX Engine keep alive CONNECTIONSTATUS_REQUEST interval from 60 to 30 secs, to allow some KNX/IP interfaces (not strictly following the KNX standard) to work properly.<br/>

**Version 2.4.5** - Feb 2024<br/>
- WARNING: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- NEW: Added KNX Datapoint 275.100<br/>
- HUE Light: fixed https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/317<br/>
- HUE Light: corrected the 7.600 kelvin range https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/316<br/>
- HUE Light: blinking effect and color cyle are now stopped, whenever an FALSE KNX telegram is received by the light switching group address.<br/>
- HUE Light: when the light is off, the dim up sequence starts now with initial brightness = zero.<br/>
- KNX Engine: moved all HTTP calls to a single js file plugin, loaded at startup, to avoid multi KNX gateway or multi HUE bridges issues.<br/>
- HUE: Optimized color translation between xyBri and RGB.<br/>
- NEW: HUE Light node: added the HSV controls.<br/>
- HUE Light node: stopping the dim sequence, now clears also the HUE bridge queue commands, to allow stopping the dimmer quickly.<br/>
- HUE Light node: smoother dimming.<br/>
- Fix the listing of ethernet interfaces in the gateway config window.<br/>
- HUE: Fixed "read at startup" option, not working for some HUE nodes.<br/>
- NEW: HUE: added node Zigbee Connectivity.<br/>
- PLEASE TRY THIS VERSION AND GIVE ME ANY FEEDBACK ABOUT ISSUES YOU FIND. THANKS.<br/>

**Version 2.4.5-beta.4 PUBLIC BETA** - Feb 2024<br/>
- Maintenance release.<br/>

**Version 2.4.5-beta.3 PUBLIC BETA** - Feb 2024<br/>
- HUE: Fixed "read at startup" option, not working for some HUE nodes.<br/>
- NEW: HUE: added node Zigbee Connectivity.<br/>

**Version 2.4.5-beta.2 PUBLIC BETA** - Feb 2024<br/>
- Fix the listing of ethernet interfaces in the gateway config window.<br/>

**Version 2.4.5-beta.1 PUBLIC BETA** - Feb 2024<br/>
- WARNING: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- HUE: Optimized color translation between xyBri and RGB.<br/>
- NEW: HUE Light node: added the HSV controls.<br/>
- HUE Light node: stopping the dim sequence, now clears also the HUE bridge queue commands, to allow stopping the dimmer quickly.<br/>
- HUE Light node: smoother dimming.<br/>
- PLEASE TRY THIS VERSION AND GIVE ME ANY FEEDBACK ABOUT ISSUES YOU FIND. THANKS.<br/>

**Version 2.4.5-beta.0** - Jan 2024<br/>
- WARNING: this version uses the Node-Red plugin system; the  Node-Red version must be **equals or major than 3.1.1**<br/>
- NEW: Added KNX Datapoint 275.100<br/>
- HUE Light: fixed https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/317<br/>
- HUE Light: corrected the 7.600 kelvin range https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/316<br/>
- HUE Light: blinking effect and color cyle are now stopped, whenever an FALSE KNX telegram is received by the light switching group address.<br/>
- HUE Light: when the light is off, the dim up sequence starts now with initial brightness = zero.<br/>
- KNX Engine: moved all HTTP calls to a single js file plugin, loaded at startup, to avoid multi KNX gateway or multi HUE bridges issues.<br/>

**Version 2.4.4** - Jan 2024<br/>
- Transitional version.<br/>

**Version 2.4.0-beta.1** - Jan 2024<br/>
- This is a public installable beta.<br/>
- HUE Light: fixed https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/317<br/>
- HUE Light: corrected the 7.600 kelvin range https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/316<br/>
- HUE Light: blinking effect and color cyle are now stopped, whenever an FALSE KNX telegram is received by the light switching group address.<br/>
- HUE Light: when the light is off, the dim up sequence starts now with initial brightness = zero.<br/>
- KNX Engine: moved all HTTP calls to a single js file, loaded at startup, to avoid multi KNX gateway or multi HUE bridges issues.<br/>
- Minor fixes.<br/>

**Version 2.4.0-beta.0** - Jan 2024<br/>
- THIS IS A BETA VERSION. INSTALL ONLY IF YOU HAVE MANY HUE BRIDGES.<br/>
- HUE Light: fixed https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/317<br/>
- HUE Light: corrected the 7.600 kelvin range https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/316<br/>
- HUE Light: blinking effect and color cyle are now stopped, whenever an FALSE KNX telegram is received by the light switching group address.<br/>
- HUE Light: when the light is off, the dim up sequence starts now with initial brightness = zero.<br/>
- KNX Engine: moved all HTTP calls to a single js file, loaded at startup, to avoid multi KNX gateway or multi HUE bridges issues.<br/>

**Version 2.3.5** - Jan 2024<br/>
- HUE Light: fixed multi HUE Bridge GUI issue.<br/>

**Version 2.3.4** - Jan 2024<br/>
- HUE Light: fixex tab "DIM/Brightness" inaccessible, when "KNX Brightness Status" was set to use the default knx behaviour.<br/>

**Version 2.3.3** - Jan 2024<br/>
- HUE Light: added a warning if you double click a node, with the node still querying the HUE Bridge for the device.<br/>

**Version 2.3.2** - Jan 2024<br/>
- HUE Light: minor fixes.

**Version 2.3.0** - Jan 2024<br/>
- HUE Light: partially rewrote code to cloneDeep(oHUEDevice) not to duplicate the brightness status of a single ligh, at node-red restart. https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/312#issue-2064480332 <br/>

**Version 2.2.40** - Jan 2024<br/>
- HUE Light: fixed an issue with initial status read from HUE Bridge (on/off status was incorrectly set).<br/>

**Version 2.2.39** - Jan 2024<br/>
- Fixed DPT 9.001 issue when sending numbers having > 2 decimals.<br/>
- HUE Light node: fixed an issue in dimming, when the minimum dim level is set to the minimum level defined by the HUE bridge.<br/>

**Version 2.2.37** - December 2023<br/>
- HUE Light Node: you can now set the DIM direction for tunable white lights. Fixed some issues as well.<br/>

**Version 2.2.36** - December 2023<br/>
- HUE Light Node: Ensure at least one liht belonging to a group was on before switching to nighttime. Otherwise turn all lights on at daytime.<br/>

**Version 2.2.35** - December 2023<br/>
- NEW: HUE Light Node: now it resumes the old status of all lights belonging to the selected group.<br/>

**Version 2.2.34** - December 2023<br/>
- NEW: HUE Light Node: there is a new tab that auto-generates the light entity for Home Assistant.<br/>
- HUE Light: resuming the last daytime status after nighttime, if the switch on behaviour at daytime is set to None.<br/>
- The new HUE Scene node has exited the BETA status and is now considered safe to be used.<br/>

**Version 2.2.33** - December 2023<br/>
- Quickfix: HUE Light: fixed an issue in the conversion of tunable white from Datapint 7.600 to mired and vice versa.<br/>
- WARNING: the new HUE Scene node is to be considered **BETA (= in testing with user feedback)**.<br/>

**Version 2.2.32** - December 2023<br/>
- Quickfix: HUE Light: fixed an issue in the conversion of tunable white from Datapoint 9.002 to mired and vice versa.<br/>
- WARNING: the new HUE Scene node is to be considered **BETA (= in testing with user feedback)**.<br/>

**Version 2.2.31** - December 2023<br/>
- NEW: HUE Scene node: added the status GA and Datapoint, for the scene to send true/false if active/not active. This currently works only for "Single mode".<br/>
- WARNING: the new HUE Scene node is to be considered **BETA (= in testing with user feedback)**.<br/>


**Version 2.2.30** - December 2023<br/>
- NEW: HUE Scene node: added a "Multi scene" section, more powerful.<br/>
- HUE Scene: when selecting a group address for the scene, the scene number dropdown list doesn't show up.<br/>
- WARNING: the new HUE Light node is to be considered **RELEASED (= production ready, but please report anyway any issue)**.<br/>
- WARNING: the new HUE Scene node is to be considered **BETA (= in testing with user feedback)**.<br/>

**Version 2.2.29** - November 2023<br/>
This is an interim version, to quick fix some issues. Please report any issue with HUE Nodes, on gitHub.<br/>
- HUE Light: fixed an issue causing the node status to signal an error. Filtered the groupvalue_read from imbound KNX messages.<br/>
- WARNING: the new HUE Light options are to be considered **BETA (= in testing with user feedback)**.<br/>

**Version 2.2.28** - November 2023<br/>
This is an interim version, to quick fix some issues. Please report any issue with HUE Nodes, on gitHub.<br/>
- HUE Light: fixed an issue where dimming down with the light switched off, causes the brightness status to jump to 100%, thus the light remains off.<br/>
- HUE Light: Fixed some errors, if all devices belonging to a group, have only the dimming capability.<br/>
- WARNING: the new HUE Light options are to be considered **BETA (= in testing with user feedback)**.<br/>

**Version 2.2.27** - November 2023<br/>
This is an interim version, to quick fix some issues. Please report any issue with HUE Nodes, on gitHub.<br/>
- HUE Light: the UI now changes, to adapt to lamp type.<br/>
- HUE Light: "Get current" color button, now works for grouped light as well, by reading the first light belongin to the group.<br/>
- WARNING: the new HUE Light options are to be considered **BETA (= in testing with user feedback)**.<br/>

**Version 2.2.26** - November 2023<br/>
This is an interim version, to quick fix some issues. Please report any issue with HUE Nodes, on gitHub.<br/>
- HUE Light: fixed some spurious node status errors.<br/>
- HUE Light: now the brightness status is ever transmitted over the KNX bus, whenever the light is switched on.<br/>
- HUE Battery: the node can respond to KNX read request, by sending the stored value as response to the KNX bus.<br/>
- HUE light level: the node can respond to KNX read request, by sending the stored value as response to the KNX bus.<br/>
- HUE temperature sensor: the node can respond to KNX read request, by sending the stored value as response to the KNX bus.<br/>
- WARNING: the new HUE Light options are to be considered **BETA (= in testing with user feedback)**.<br/>

**Version 2.2.25** - November 2023<br/>
- HUE Light: fixed settings of some behaviour options.<br/>
- You can now query the HUE Light node stati, via a "read" telegram sent to the KNX stati group address. ("Status" is Latin, not English, so the plural is "stati" and not "statuses" nor "status"). Other HUE nodes will follow asap.<br/>
- Fixed some little bugs.<br/>
- Fixed an issue where in some circumstances, the HUE Light turn off by itself.<br/>
- WARNING: the new HUE Light options are to be considered **BETA (= in testing with user feedback)**.<br/>

**Version 2.2.24** - November 2023<br/>
- HUE Light: added DPT 9.002 for direct kelvin selection, with HUE range (2000K-6535K). There is another DPT 7.600 with the KNX scale (0K-6553K) avaiable.<br/>
- NEW: HUE Light: now you can choose the "switch on" behaviour between color and temperature (in Kelvin) + brightness.<br/>
- The fontawesome JS is now locally referenced.<br/>
- WARNING: the new HUE Light options are to be considered **BETA (= in testing with user feedback)**.<br/>

**Version 2.2.20** - November 2023<br/>
- Fixed a cross site js script loading, affecting the node running under HomeAssistant.<br/>

**Version 2.2.19** - November 2023<br/>
- HUE Bugfix.<br/>

**Version 2.2.18** - November 2023<br/>
- HUE Bugfix.<br/>
- New connection check for HUE bridge.<br/>

**Version 2.2.16** - November 2023<br/>
- NEW: Hue Light: you can now enable the input/output PINs and send/receive commands to/from the light, via the msg flow, like msg.on={"on":true}. The option is "Node Input/Output PINs".<br/>
- NEW: Hue Scene: you can now enable the input/output PINs and send/receive commands to/from the light, via the msg flow. The option is "Node Input/Output PINs".<br/>

**Version 2.2.9** - November 2023<br/>
- Fixed errors in Iobroker.<br/>
- HUE Light: NEW: color selection show now the temperature in kelvin.<br/>
- HUE Light: NEW: Tunable White: added control and status in kelvin (DPT 7.600). This is in BETA testing.<br/>
- Removed some options in button and scene nodes, because they are unnecessary.<br/>

**Version 2.2.6** - October 2023<br/>
- Fix: fixed HUE button sending a KNX telegram at startup. Fixed also other nodes.<br/>
- HUE Nodes: added the option to inizialize at startup or not.<br/>


**Version 2.2.5** - October 2023<br/>
- Fix: fixed some HUE nodes not able to register to the event notification service.<br/>
- Restyle GUI of KNX Device node.<br/>


**Version 2.2.4** - October 2023<br/>
- HUE Light: fixed some status hiccups and better handling of async hue bridge functions.<br/>

**Version 2.2.3** - October 2023<br/>
- HUE Light: Again, rewrite of the DIM function to get rid of the dimming_delta.<br/>


**Version 2.2.2** - October 2023<br/>
- NEW: HUE Motion: support HUE Camera motion events via the HUE Motion node.<br/>
- HUE Light: some tweaking to the GUI.<br/> - HUE Grouped Light: Fixed relative dimming function.<br/> - KNK Alerter node: <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/SampleAlerter">fixed the wiki sample page</a>.<br/> - KNX Viewer: added the help pane in Node-Red.<br/> 


**Version 2.2.1** - October 2023<br/>
- Massive rewrite of the DIM function, for brightness and for color temperature.<br/>
- NEW: HUE Light: Added dimming speed, minimum dim value and maximum dim value.<br/>
- NEW: HUE Light: Read of the lamp status at node-red start and after deploy of a new node.<br/>
- Security fix: patched a vulnerability in crypto.js.<br/>


**Version 2.1.63** - October 2023<br/>
- HUE Light: optimized the GUI in select color TAB.<br/>


**Version 2.1.62** - October 2023<br/>
- HUE Light: FIX: a typo error could prevent the light to switch on, if the light was set to specified RGB color at switch on.<br/>


**Version 2.1.61** - October 2023<br/>
- HUE Light: NEW color picker. A Color picker is shown in the right TABS of node-red, as soon as you open the light node. You can choose the color you want, and paste the RGB color into the HUE light node.<br/>
- HUE Light: the color getter is now not shown, whenever you select a grouped light. You can use the color picker instead.<br/>


**Version 2.1.58** - October 2023<br/>
- HUE Light: NEW color getter. Just click a button to automatically fill the node's "color" properties<br/>


**Version 2.1.57** - October 2023<br/>
- HUE Light: NEW Behaviour "KNX Brightness Status"<br/>
- HUE Light: the light now remembers the last brightness value after switch off<br/>


**Version 2.1.56** - October 2023<br/>
- HUE Scene: removed non existant scene 0.<br/>


**Version 2.1.54** - October 2023<br/>
- HUE Scene: NEW: you can now use also the Datapoint 18.001, to recall a scene via a KNX scene pushbutton.<br/>


**Version 2.1.52** - October 2023<br/>
- HUE Light node: fixed another possible switch on brightness issue.<br/>


**Version 2.1.51** - October 2023<br/>
- HUE Light node: fixed a possible switch on brightness issue.<br/>


**Version 2.1.50** - October 2023<br/>
- KNXUltimateViewer node: fixed too large text in custom template..<br/>

**Version 2.1.47** - September 2023<br/>
- HUE BRIDGE: fixed multiple HUE bridge handling.<br/>

**Version 2.1.46** - September 2023<br/>
- HUE BRIDGE: In case of https problems (certificate expired, etc...), the node will try to connect to the HUE BRIDGE in insecure http mode.<br/>


**Version 2.1.45** - August 2023<br/>
- HUE Light: now it correctly sets the KNX brightness if you turn on/off the light via HUE app.<br/>
- Fix a resource occupation while connecting to the HUE bridge and the bridge is not reachable for the first time.<br/>


**Version 2.1.43** - August 2023<br/>
- HUE Light: Moved some options to the "Behaviour" tab and fixed a race condition in the color setting, when some options are in conflict each other.<br/>


**Version 2.1.42** - August 2023<br/>
- Fixed some issues in getting the hue device's names, when using some non LTS versions of node.js.<br/>


**Version 2.1.41** - August 2023<br/>
- NEW: HUE Light: you can now control ALL GROUPED LIGHT together.<br/>
- HUE Light: fixed an issue with the "Link brightness to on/off switch" option, when a json color is selected at daylight or nighttime<br/>
- HUE Light: New: now you can use both DPT 5.001 and 3.007 in the color temperature, at the same time.<br/>


**Version 2.1.40** - August 2023<br/>
- HUE Light: Bugfix: color cycle continues to cycle color, even if a FALSE is sent from the group address.<br/>


**Version 2.1.39** - August 2023<br/>
- KNX-Ultimate Node: fixed an issue with the msg.topic sent to the flow.<br/>
- NEW: HUE Light: now you can set the color temperature, using datapoint 5.001 as well.<br/>
- NEW: HUE Light: the node will now disable parts of the UI, based on the capabilities of the HUE lamp.<br/>
- HUE nodes now wait 15 seconds before getting status and updating KNX devices, after node-red restart. <br/>


**Version 2.1.38** - August 2023<br/>
- Strenghten HUE eventsource resiliency.<br/>
- Implemented standard logging on all HUE nodes (there was temporary console.log statements).<br/>


**Version 2.1.37** - July 2023<br/>
- Load control: added msg.shedding to force shed/unshed.<br/>


**Version 2.1.36** - July 2023<br/>
- HUE Server bugfix: in some cases, the eventsource lost the connection while in idle for more than 15 minutes; fixed.<br/>


**Version 2.1.35** - July 2023<br/>
- Maintenance release. Added a youtube link with samples, into every HUE node configuration's window.<br/>


**Version 2.1.34** - July 2023<br/>
- NEW: Hue light node now supports the grouped lights.<br/>
- Tap Dial node: fixed an issue with datapoint 5.001.<br/>
- Full rewrite of the HUE engine, to reduce the http traffic with the HUE Bridge as much as possible.<br/>


**Version 2.1.33** - July 2023<br/>
- HUE Light: fix for lights not supporting GAMUT.<br/>


**Version 2.1.32** - July 2023<br/>
- NEW: Hue Battery Sensor: you can now get the battery level of all your battery powered HUE devices.<br/>
- The sensors now read the value at startup.<br/>
- Minor fixes.<br/>


**Version 2.1.31** - July 2023<br/>
- FIX: HUE Light: fixed wrong datapoint in the color cycle effect.<br/>


**Version 2.1.29** - July 2023<br/>
- FIX: HUE Light: fixed an issue involving brightness. The HUE HUB, randomly, sends a 0.39 dimming value as hue status. This cause an ON telegram to be sent to the KNX bus.<br/>


**Version 2.1.28** - July 2023<br/>
- HUE Light: fixed DIM behaviour.<br/>


**Version 2.1.27** - July 2023<br/>
- Trashed some old unuseful code and status options.<br/>
- Keep moving help to the help box of node-red.<br/>


**Version 2.1.26** - July 2023<br/>
- Hue Light:  fixed brightness states issue.<br/>


**Version 2.1.25** - July 2023<br/>
- Hue Light: added the option to update the KNX Brightness status when turn on/off the HUE light.<br/>


**Version 2.1.24** - July 2023<br/>
- Hue Light: fix brightness not sending true/false to the KNX switch status, if no brightness GA present. Set the RBE filter on that.<br/>


**Version 2.1.23** - July 2023<br/>
- Hue Light: Update KNX Switch Status on HUE brighness change, now is the default.<br/>


**Version 2.1.22** - July 2023<br/>
- NEW: Hue Light: UI optimization and allow to set the switch on light, even it Night Lighting is unselected.<br/>


**Version 2.1.20** - July 2023<br/>
- NEW: Hue Light: you can choose to enable/disable the day/night behaviour.<br/>
- NEW: Hue Light: you can now choose some options in the new Behaviours configuration tab.<br/>


**Version 2.1.19** - July 2023<br/>
- Hue light and Hue button optimization.<br/>



**Version 2.1.18** - July 2023<br/>
- Quick fix for MDT and Wienzler interfaces.<br/>


**Version 2.1.17** - July 2023<br/>
- Revamped UI of KNX-Ultimate device node.<br/>
- HUE light: added "invert" option to the Day/Night sensor.<br/>
- More verbose status for all nodes.<br/>


**Version 2.1.16** - June 2023<br/>
- NEW: Hue scene. You can now call a HUE scene.<br/>
- Bump dependencies versions.<br/>
- Increased TTL of dgram socket, from 128 to 250.<br/>
- Set max hop count in tunneling/broadcast, from 6 to 7.<br/>
- Enabled compatibility with KNX Virtual (BETA).<br/>
- Continue migrating the Help from gitHub to the standard Node-Red help box. You could find some discrepancies in help text. Sorry for that.<br/>
- **BREAKING CHANGE*** removed the emulation capability, because it's a complicated thing to mantain. If you don't know what it is, just don't care about that.<br/>


**Version 2.1.15** - June 2023<br/>
- Fix an issue with auto discovery of not registered HUE bridges. Now you must first set the IP, then click CONNECT.<br/>


**Version 2.1.14** - June 2023<br/>
- Hue Light node: added day/night behaviour.<br/>


**Version 2.1.13** - June 2023<br/>
- Hue Light node: fixed inversion in the color temp state.<br/>
- Hue Light node: switching on/off the light, now sets the DIM to 100%/0% as well.<br/>


**Version 2.1.12** - June 2023<br/>
- Hue Light node: added tunable white.<br/>


**Version 2.1.11** - June 2023<br/>
- KNX Global Context node: added the optional datastore to choose from.<br/>


**Version 2.1.10** - June 2023<br/>
- KNX Gateway Node: Migrated documentation to the standard node-red documentation box.<br/>
- KNXUltimate engine is now part of the published package https://www.npmjs.com/package/knxultimate.<br/>


**Version 2.1.9** - June 2023<br/>
- Start migrating documentation to the standard node-red documentation box.<br/>


**Version 2.1.8** - June 2023<br/>
- HUE event stream reader revamped.<br/>


**Version 2.1.7** - June 2023<br/>
- KNX nodes not correctly show status of JSON objects (like dimming, color, etc.).<br/>


**Version 2.1.6** - June 2023<br/>
- Several fixes for reading the correct GAMUT color.<br/>


**Version 2.1.4** - June 2023<br/>
- NEW: Hue light node: added random color cycle effect group address.<br/>
- Fixed destroying KNX nodes.<br/>
- Fixed destroying HUE nodes.<br/>
- Several HUE bugfixes.<br/>


**Version 2.1.3** - June 2023<br/>
- Bugfix.<br/>


**Version 2.1.2** - June 2023<br/>
- NEW: Hue Hue Light node, added BLINK option.<br/>


**Version 2.1.1** - June 2023<br/>
- NEW: Hue Tap Dial node: setting a color datapoint(232.600), the rotary dial will send a random color to the KNX group address.<br/>


**Version 2.1.0** - June 2023<br/>
- HUE nodes exited the BETA version. You can now start using HUE nodes.<br/>


**Version 2.0.21** - June 2023<br/>
- HUE: CAUTION POSSIBLE BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- Revamped hue clipv2 push event client.<br/>
- New service icons.<br/>


**Version 2.0.20** - June 2023<br/>
- HUE: CAUTION POSSIBLE BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- Fixed API issue, when no HUE bridges present.<br/>


**Version 2.0.19** - June 2023<br/>
- HUE: CAUTION POSSIBLE BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- Fixed reading initial state of hue lamps.<br/>


**Version 2.0.18** - June 2023<br/>
- HUE: CAUTION POSSIBLE BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- Fixed HUE telegram speed, according to the HUE Api V2 recommendation.<br/>


**Version 2.0.17** - June 2023<br/>
- HUE: CAUTION POSSIBLE BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- Fixed issues with async call to getlightstate aas soon as the light node is created.<br/>


**Version 2.0.16** - June 2023<br/>
- HUE: CAUTION POSSIBLE BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- Fixed issues with dimming in the hue button and hue tap dial nodes.<br/>


**Version 2.0.15** - June 2023<br/>
- HUE: CAUTION POSSIBLE BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- NEW: Temperature sensor.<br/>
- Changes to HUE Light node, to mime the ISE KNX CONNECT HUE beavior.<br/>


**Version 2.0.13** - June 2023<br/>
- HUE: CAUTION POSSIBLE BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- Hue Button node: fixed missing events in output msg.<br/>


**Version 2.0.12** - June 2023<br/>
- HUE: CAUTION BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- NEW: Hue light sensor node.<br/>


**Version 2.0.11** - June 2023<br/>
- HUE: CAUTION BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- Hotfix for Hue Button node, not retain property in config window.<br/>
- Removed "Double Tap" event, because it doesn't exists yet.<br/>


**Version 2.0.10** - June 2023<br/>
- HUE: CAUTION BREAKING CHANGES TO THE HUE NODES. PLEASE BE AWARE THAT HUE NODES ARE STILL IN BETA<br/>
- Hue Button node redesign.<br/>
- Other hue nodes fixes<br/>



**Version 2.0.9** - June 2023<br/>
- NEW: HUE Motion node<br/>
- NEW: HUE Tap Dial node<br/>


**Version 2.0.7** - June 2023<br/>
- HUE Button node: added an output PIN<br/>
- HUE Button node: added an option to emit a simplified msg


**Version 2.0.6** - June 2023<br/>
- NEW: HUE Button node. All HUE integrations are in BETA.<br/>
- Slowly integrating the help in the node-red help section.<br/>


**Version 2.0.1** - June 2023<br/>
- NEW: more KNX group addresses in the HUE Light node<br/>


**Version 2.0.0** - June 2023<br/>
- NEW Added HUE Light node. More HUE nodes to come. Please feel free to try it.<br/>
- Global context node: in the node name, only chas a-z are now allowed, to overcome syntax errors.<br/>
- As i spend 50% of my time to translate all documentation and node texts to 4 languages, i'll leave only English as main language, so you will see the UI only in English.<br/>

**Version 1.4.18** - Mai 2023<br/>
- NEW: Gateway Config Node: Starting from version 1.4.18, you can also simply enter the path to the ETS exported file (e.g.: /home/pi/mycsv.csv), instead of pasting it's content.<br/>


**Version 1.4.16** - Mai 2023<br/>
- FIX: fixed an issue when you have more than one Global Variable node.<br/>


**Version 1.4.15** - March 2023<br/>
- FIX: fidex an issue with unicode chars in the ESF imported file.<br/>
- NEW: Added Datapoint 235.001 Tariff. Please see the sample in the node window, appearing after you select the datapoint.<br/>


**Version 1.4.14** - March 2023<br/>
- NEW: Added Datapoint 29.xxx. Please see the sample in the node window, appearing after you select the datapoint.<br/>


**Version 1.4.13** - January 2023<br/>
- FIX: Fixed Datapoint 9. There was too many decimals.<br/>


**Version 1.4.12** - January 2023<br/>
- FIX: fixed scene controller issue.<br/>


**Version 1.4.11** - January 2023<br/>
- FIX: fixed RBE output filter, for those Datapoints (like PPM) that doesn't follow the KNX specifications. (https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/223) and when you use the "round, multiply, etc..." payload handling option in the node configuration.<br/>
- NEW: Added DPT28.001 UTF-8 string. Thanks @twod-davydemaegt.<br/>
- FIX: Fixed a mistake (old one) in the ESF file import. Thanks @twod-davydemaegt.<br/>


**Version 1.4.10** - December 2022<br/>
- Wellcome in: Company Can'nX from France is using KNX-Ultimate in his Kloud'nX product.<br/>
- Minor fixes and WIKI update.<br/>


**Version 1.4.9** - November 2022<br/>
- NEW: GlobalContext node: If you import your ETS file, the global variable now contains ALL group addresses included in the ETS file. <br/>
- Fixed incorrect links in the Node-Red's Help TAB for some nodes.<br/>


**Version 1.4.8** - November 2022<br/>
- NEW: added Datapoints 13.016, 13.1200, 13.1201.<br/>


**Version 1.4.7** - November 2022<br/>
- NEW: added "Griesser Object" Custom Datapoint 6001.001. Thanks @croghostrider<br/>


**Version 1.4.6** - November 2022<br/>
- NEW: added Airflow Datapoint 9.009.<br/>


**Version 1.4.5** - October 2022<br/>
- Now the Watchdog node sends same errors from other KNX-Ultimate nodes, only once. This avoids flooding node-red flow with unnecessary messages.<br/>


**Version 1.4.4** - October 2022<br/>
- FIX: fixed an issue accurring when you put a wrong IP/hostname in the configuration gateway. Leaving node-red running with such wrong configuration, after a month or so, all UDP channels remain occupied until reboot. Thanks to @tarag for reporting that.<br/>


**Version 1.4.3** - October 2022<br/>
- Changed view for JSON objects (will display the RAW value instead of the JSON) in the KNXUltimate Viewer node.<br/>
- Added the measure unit near the payload value.<br/>


**Version 1.4.2** - October 2022<br/>
- Added DPT 21.001.<br/>


**Version 1.4.1** - October 2022<br/>
- Added DPT 14.077.<br/>
- NEW: you can now set the ETS group address list at runtime, via the Watchdog Node. See here https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/7.-WatchDog-Configuration the "importCSV" property of the msg.setGatewayConfig.<br/>
- Updated the Wiki in all languages.<br/>


**Version 1.4.0** - September 2022<br/>
- Cleaned code and standardize things, thanks @croghostrider.<br/>
- Fixed DPT 13.002 description Flow Rate in m³/h<br/>


**Version 1.3.49** - August 2022<br/>
- Fixed name validation in the Viewer node.<br/>


**Version 1.3.48** - August 2022<br/>
- Fixed old "new Buffer" call. It's deprecated and may not work with new node.js versions.<br/>


**Version 1.3.47** - August 2022<br/>
- Temporary hide KNX Secure TAB from the config window. It will appear again when KNX Secure will be ready.<br/>


**Version 1.3.46** - July 2022<br/>
- NEW: Added hostname DNS resolution in Config Gateway IP. Now you can put an IP or an hostname in the IP gateway's field.<br />- NEW: Added Datapoint 1.024 Day/Night.<br />- Now the procol in the config node gateways is only suggested. You can choose the protocol by yourself.<br />


**Version 1.3.45** - June 2022<br/>
- NEW: pass msg.resetRBE = true to a device node, to reset both input and output RBE filter on that particular node.<br />


**Version 1.3.43** - Mai 2022<br/>
- NEW: Scene Controller: you can now specity the "wait" time also in seconds, minutes or hours.<br />


**Version 1.3.42** - Mai 2022<br/>
- Fixed an issue in the gateway config node UI. Corrected some UI spacing issues in low resolution monitor.<br />- Fixed an issue occurring in the detection of local IP in case of ETH interface without family property specified.<br />


**Version 1.3.41** - Mai 2022<br/>
- Fixed an issue in the gateway config node UI, where you manually set the IP interface name.<br />- Fixed an issue introduced by a breaking change in Node 18.<br />- Added more "trace" log in the ipAddressHelper function, to better track the ethernet interface details.<br />


**Version 1.3.40** - Mai 2022<br/>
- Fixed an issue in the GlobalContext node, preventing the node from searching for the DPT, if the CSV ETS file has been imported and you don't specify the DPT in the msg input. Thanks to @Sebastien-Posca for pointing me out that.<br />


**Version 1.3.39** - April 2022<br/>
- Fixed an empty text in the KNX Alerter config node, about the Read States at start.<br/>
- Fixed an improperly cleaned queue in the config node close function.<br/>
- Fixed a possible issue in case of multiple disconnection from the KNX Bus in a short timeframe.<br/>
- Fixed sending disconnection_request with a null connection_ID, in the KNX Engine.<br/>
- Fixed re-sending per KNX Standards, of not ACKnowledged telegrams, not always working in some circumstances.<br/>
- Protected some function with a try-catch.<br/>
- Now the telegram handler function stops whenever the connection is lost and restart from fresh on connection.<br />- Optimized the retain mechanism of the queue handling, in case of shorttimed disconnections.<br />


**Version 1.3.38** - April 2022<br/>
- Memory footprint decreased.<br/>
- Better handling of KNX nodes objects array, for flows with more than 250 nodes.<br/>


**Version 1.3.37** - April 2022<br/>
- Changed: the KNX Gateway Node don't care anymore for ROUTING_LOST_MESSAGE and ROUTING_BUSY. Previously, it was disconnecting. Now it only advises in LOG.<br/>
- Updated and beautifullyfied the WIKI.<br/>
- Totally rewrote the CIRCULAR REFERENCE PROTECTION and FLOOD PROTECTION wiki page, in all languages.<br/>


**Version 1.3.36** - February 2022<br/>
- Purged unused requires and bumped dependencies versions.<br/>


**Version 1.3.35** - March 2022<br/>
- Reset handlers by removing/adding every time the connection is set by "new" directive.<br/>
- Fixed an issue causing glitches, when the disconnection is requested by the KNX interface instead of KNX-Ultimate.<br/>
- Fixed an issue occurring when the disconnection is started from KNX-Ultimate by the DISCONNECT_REQUEST, but the KNX Interface fails to send the DISCONNECT_RESPONSE to confirm the disconnection.<br/>
- Updated knxUltimate-config.js to actively disconnect and close the socket when the disconnection is requested by the KNX Interface. All other cases (disconnection by ethernet cable, disconnection by unreachable KNX Interface, disconnection by temporary out of access, disconnection by means of user intervention, disconnection by Watchdog node etc...) are not affected by this issue.<br/>
- Optimized memory allocation to allow the garbage collector to get rid of unref variables.<br/>
- Scene controller: fixed node status issues.<br/>
- Load control: code revision.<br/>
- Logger: code revision.<br/>
- Watchdog: code revision.<br/>
- Device node: code revision.<br/>
- Global Context: code revision.<br/>
- Wiki: merged Global Context node sample, into one single page for better readability.<br/>
- FIX: fixed rounding of numbers in the device node.<br/>


**Version 1.3.32** - February 2022<br/>
- FIX Datapoint 16.001: fixed an issue with the ISO8859-1 encoding.<br/>


**Version 1.3.31** - February 2022<br/>
- KNX Viewer node: now the payload is formatted depending on value type.<br/>
- KNX Viewer node: now the list is ordered by group address.<br/>
- KNX Viewer node: added a second output pin, that emits an Array containing all group addresses.<br/>


**Version 1.3.30** - February 2022<br/>
- KNX Viewer node: changed the Datetime display to local time format.<br/>


**Version 1.3.29** - February 2022<br/>
- Load Control: the timer for shedding won't everytime obey to what you've set. Fixed. <br/>
- Load Control: Added pre-shedding yellow warning message in the node status.<br/>


**Version 1.3.28** - February 2022<br/>
- NEW: KNX Viewer: this node allow you to see all datapints and values in a dashboard wirget. https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer<br/>


**Version 1.3.27** - February 2022<br/>
- Load Control: minor fixes + issue a KNX read of Watt values, in case the GA doesn't automatically send a power value on change.<br/>


**Version 1.3.26** - February 2022<br/>
- FIX: fix a crash occurring it the KNX Gateway is set to "emulate" (that means, don't write to the bus).<br/>


**Version 1.3.25** - February 2022<br/>
- FIX: Load Control: measure unit was Wh. Corrected in W. Thank @Mauro of VivereSmart Facebook group https://www.facebook.com/groups/viveresmart<br/>
- Load Control: Added more info to the output message. Updated the online help.<br/>


**Version 1.3.24** - February 2022<br/>
- NEW: Load Control node: switch off your device if you're exceeding the Watt limit of your house.<br/>
- FIX: Alerter Node: fixed a KNX Address verification, in case you wrote your own string instead of a GA.<br/>
- FIX: Alerter Node: the node was sending a "read" request to all group addresses at start. Fixed.<br/>


**Version 1.3.22** - February 2022<br/>
- FIX: WriteRaw: some values wasn't sent to the bus due to an hex conversion issue.<br/>


**Version 1.3.21** - January 2022<br/>
- FIX: Node Logger wasn't correclty logging the bus traffic. Fixed.<br/>


**Version 1.3.20** - January 2022<br/>
- NEW: Telegram out queue TTL: as soon as KNX-Ultimate detects a connection loss, it will retain the telegrams sent to the BUS during the disconnection. After the reconnection, KNX-Ultimate will send the retained queue.<br/>


**Version 1.3.19** - January 2022<br/>
- NEW: Added Datapoint 14.058 Pressure (Pa).<br/>
- Added some more description while disconnecting from the BUS.<br/>


**Version 1.3.18** - January 2022<br/>
- FIX: Scene Controller: fixed an issue preventing the node to work if you haven't set the RECALL and SAVE group addresses.<br/>
- WIKI: updated the samples in the scene controller node.<br/>


**Version 1.3.16** - January 2022<br/>
- KNXEngine: there are some weird KNX gateways out there, either sending malformed header or CEMI messages. Now KNX-Ultimate will simply ignore these bad messages. Prior, it was disconnecting.<br/>
- KNXEngine: KNX-Secure packets are silently discarded for now, until KNX Secure will be ready.<br/>
- KNXEngine: added more logs to for troubleshooting pourposes.<br/>


**Version 1.3.15** - January 2022<br/>
- KNXEngine: better handling of disconnection in UDP mode, allowing very old grandpa KNX/IP interfaces enough time to understand what's happening, avoiding it to go crazy.<br/>
- KNXEngine: corrected Curve Crypto in KNX-Secure (KNX Secure is not enabled yet!).<br/>


**Version 1.3.14** - 26 December 2021<br/>
- KNXEngine: ACK management: the not acknowledged message will be re-transmitted once, then the connection will be dropped, as per KNX specs.<br/>
- KNXEngine: ACK management: the telegram's queue to be sent to the KNX BUS will be paused during the ACK waiting.<br/>
- KNXEngine: Routing: now the routing_busy and routing_lost_messages telegrams sent by the KNX/IP Router are  handled.<br/>


**Version 1.3.13** - 25 December 2021<br/>
- KNXEngine: when in tunneling and suppress ACK request is disabled, the error is raised only after 3° failed ACK reception instead of 1°.<br/>
- KNXEngine: at disconnection, delete all pending ACK requests timer.<br/>
- Warning: if you've suppressed the ACK requests, in some cases the node cannot detect the disconnection. In this case, please use the KNX Watchdog to detect the disconnecitons and reconnect.<br/>


**Version 1.3.12** - December 2021<br/>
- KNX-Ultimate DEVICE node: added the validation of Group Address while deploy, with support for modern addressing up to 31/7/255.<br/>


**Version 1.3.10** - December 2021<br/>
- FIX: fixed a stupid "Disconnected by Message length mismatch 8/16" error due to a dumb find/replace error in the code.<br/>
- Added some more log to help resolving issues.<br/>


**Version 1.3.5 - REMOVED FROM REPO due to "Disconnected by Message length mismatch 8/16" error** - December 2021<br/>
- New KNX Engine has been enabled again, after fixing some glitches.<br/>


**Version 1.3.4** - December 2021<br/>
- Temporary reverted to old API, due to some little glitches.<br/>


**Version 1.3.2** - December 2021<br/>
- NEW: config node: you can now gather debug info (there is a button for that) to be sent to the developer to help resolving your issue. Then, please paste the debug infos in your gitHub issue.<br/>


**Version 1.3.1** - December 2021<br/>
---- MAJOR VERSION WITH TOTALLY REWRITTEN KNX API, IN PURE JAVASCRIPT ----<br/>
---- IF YOU ENCOUNTER ISSUES, JUST INSTALL THE LAST OLD VERSION WITH: npm install node-red-contrib-knx-ultimate@1.2.57 ----<br/>
---- PLEASE BE AWARE THAT ALL PREVIOULSY KNX SECURE OPTIONS HAVE BEEN HIDDEN UNTIL READY TO BE RELEASED, TO AVOID CONFUSIONS ----<br/>
- KNX-Secure: not ready yet. I think not before the 1° quarter of 2022 because i'm learning the MANY cryptograhics algorithms of this Secure thing. Already done are the loading/checking against password of the ETS Keyring file, the new TCP stack (will come toghether with the already present UDP stack) and the first connection handshake between KNX-Ultimate and a KNX/IP Interface via TCP tunnel, using the DH Curve25519 algorythm. SOMEONE INTERESTED HELPING ME WITH THE DEVELOPMENT (FOR FREE)?<br/>
- NEW: new KNX API developed in these months. This new API is more speedy, more mantainable (get rid of the old "machina" framework) and ready to accomodate the natively supports KNX-Secure.<br/>
- NEW: ETS Logger: now the node logs the sent packets as well (previously, it was recording only the received ones).<br/>
- NEW: KNX-Ultimate now supports TCP connection as well (for KNX Secure tunneling). All protocols are now supported (UDP Routing and Tunneling, TCP).<br/>
- NEW: You can now choose the IP protocol to be used for the gateway.<br/>
- NEW: WatchDog node: You can now set the communication protocol (TunnelingUDP, Multicast) using msg.setGatewayConfig.Protocol. Updated the Wiki as well to reflect the change.<br/>
- FIX: Watchdog node's setConfig sat the wrong configuration in case of more than one node gateway simultaneously active on the same flow.<br/>
- FIX: Manually setting interface in a gateway node set to multicast address, resulting in the gateway bond to all interfaces, causing some issues in receiving datagrams on systems having more than one ethernet interface active at the same time.<br/>
- FIX: KNX-Device: if the node was set to react to "Read" requests and "Autorespond" was also enabled and "Autorespond with default value if no payload is present" was also active, in some circumstances the "response" telegram was sent to a wrong group address.<br/>
- FIX: Config gateway: the custom delay between Telegrams sent to the KNX BUS was locked to the safe mimimum of 40ms, even if you sat a lower value. Now is 30ms, but proceed with caution if you set a low value. 50ms should be the safe-default.<br/>
- FIX: Config gateway: suppress acknowledge telegram now work as expected, totally ignoring received Acknowledges and don't ask for any as well. Prior was only ignoring the received Acknowledges.<br/>


**Version 1.2.57** - November 2021<br/>
- Added following datapoints:<br/>
- 12.100 counter timesec (s)<br/>
- 12.101 counter timemin (min)<br/>
- 12.102 counter timehrs (h)<br/>
- 12.1200 volume liquid (l)<br/>


**Version 1.2.56** - November 2021<br/>
- FIX: hotfix echo in tunneling mode doesn't work since 1.2.55.<br/>


**Version 1.2.55** - November 2021<br/>
- Gateway servere node: recoding of some javascript parts, to increase speed to better accomodate the crypt/entrypt process of the upcoming KNX-Secure implementation.<br/>
- KNX-Secure: succesfully read ETS Keyring file and decrypt of Devices keys, Group Address keys, Backbone Key, Management Key and Auth Key.<br/>
- KNX-Secure: a shield icon near the Gateway name in the KNX Device node appears, if KNX-Secure gateway has been selected.<br/>
- KNX-Secure: node-red log now logs wether the gateway is secure or not, ETS Keyring project name, created By and ETS version.<br/>


**Version 1.2.54** - November 2021<br/>
- <font color="red">THIS VERSION TOUCHES MANY CONNECTIVITY POINTS.</font> It should handle all things better, but if you've trouble, you can always revert to the previous version by issuing **npm install node-red-contrib-knx-ultimate@1.2.53**<br/>
- Tunneling/Routing connection optimization: standardized delay in CONNECT_RESPONSE timeout and cleaned some code to better handling installations with more than 500 group addresses.<br/>
- In tunneling mode, the node now signal the disconnection after 3 KNX Interface's connection state response failed, as per KNX standard.<br/>
- Increased the socket telegram TTL (Time to Live) for Multicast as well as for Unicast, from 16 to 128 for better handling of multirouted packets.<br/>
- Added "[THE GATEWAY NODE HAS BEEN DISABLED]" node status message, if you've disabled the KNX Gateway.<br/>
- NEW: you can now choose to delay the connection to the KNX BUS at start. In some circumstances it's advisable to delay the connection to the BUS to allow the ethernet cards to be lifted up by the sysop. Thi happens often in VM environments.<br/>
- Changing the log level in the Gateway node doesn't require a node-red restart anymore.<br/>
- Because i'm flooded by user's queries, i removed a warning from the node status, if the persitent file has not yet been created.<br/>
- Wait for message acknowledge by the IP router: now waits for 5 failed message ACKs before firing the disconnection sequence.<br/>
- FIX: fixed a false "disconnection" node status, due to a glitch in the KNX API (after a connection request, the API was sending a false "disconnection" status). Chiamati in causa anche tutti i Santi, prima.<br/>
- Fixed some check-connection timers not stopping in time.<br/>
- Speed up the first KNX connection after node-red start/restart/deploy.<br/>
- Speed up the reconnection attempts in case of disconnections.<br/>


**Version 1.2.53** - November 2021<br/>
- Device node: as soon as you add a new node with "read from bus at start" option enabeld, it requests the value from the BUS also if you DEPLOY "modified nodes" only. Prior to that, you had to do a full DEPLOY.<br/>


**Version 1.2.52** - October 2021<br/>
- KNX Logger node: fixed some default fields.<br/>


**Version 1.2.51** - October 2021<br/>
- NEW: Logger node: you can now count telegrams per second (or any interval you want), for statistic pourposes. Thank @RicharddeCrep for proposing this ehnancement.<br/>
- WIKI: Updated the wiki in Deutsch, English, Italano and Chinese.<br/>
- Datapoint 10.001: fixed a little issue if the date of week is Sunday.<br/>
- Added the milliseconds indication in all logs (things happen fast!).<br/>


**Version 1.2.49** - October 2021<br/>
- Gateway connection: added more checks for connection resilience, in case of KNX Interface of particular manufacturer.<br/>
- Gateway connection: connection is now more speedy.<br/>
- NEW: Gateway connection has a new option to enable/disable the automatic connection to the KNX BUS at start. You can now choose not to connect to the BUS on boot.- Watchdog node: fixed an issue in changing the configuration via setConfig parameter, when an ethernet interface was manually selected in the config window.<br/>


**Version 1.2.48** - October 2021<br/>
- Watchdog node: fixed a misleading status color during the first KNX test performed.<br/>


**Version 1.2.47** - September 2021<br/>
- Added Datapoint 14.057 Power Factor.<br/>


**Version 1.2.46** - September 2021<br/>
- GlobalContext Node: you can now correctly pass the value to a group address even without setting the datapoint, if you import the CSV file.<br/>


**Version 1.2.45** - September 2021<br/>
- NEW: Chinese translation. Many thanks @songzh96 for the BIG work done in traslating the entire WIKI and the node config windows in Chinese!<br/>


**Version 1.2.44** - September 2021<br/>
- NEW: Scene Node: you can now add a pause in the command rule list (example, turn on light, wait 4000 milliseconds, turn off light). <br/>
- WIKI: better organization of help, with direct links "SEE ALSO" to other related pages. You find these links at the bottom of every each page.<br/>


**Version 1.2.43** - September 2021<br/>
- Watchdog Node: fixed the msg.connectGateway = true not actually reconnecting.<br/>


**Version 1.2.42** - August 2021<br/>
- FIX: if the config node is configured in EMULATION mode, knx-ultimate ouputs always the flow msg with the Group Address as topic, instead of a msg with the customized topic (if you have customizet it).<br/>


**Version 1.2.41** - August 2021<br/>
- Fixed a zero day bug: the loading of buffer value other than true/false from the peristent file (where all the values are persisted, stored and read upon restart if you selected that in the node config) fails. No error occurs nor other malfunctions, but the node emits a status error and the value is not read from this file.<br/>


**Version 1.2.40** - August 2021<br/>
- Great improvement of system resource.<br/>
- Fixed too many reconnection attempts in a short timeframe. Now it's more relaxed thus more responsive.<br/>
- I've successfully collected KNX Secure device to go ahead with the development. THANK YOU TO ALL PATREONS, SPECIALLY TO A COMPANY THAT WON'T BE MENTIONED HERE, HAVING SENT ME KNX SECURE DEVICES.<br/>


**Version 1.2.39** - August 2021<br/>
- I remember you that i'm still collecting money to buy a KNX Router for testing KNX-Secure. Should you help me, click "Donate via PayPal" above in this page.<br/>
- Optimized the fix in 1.2.38 by adding more in-depth checks.<br/>


**Version 1.2.38** - August 2021<br/>
- I remember you that i'm still collecting money to buy a KNX Router for testing KNX-Secure. Should you help me, click "Donate via PayPal" above in this page.<br/>
- Sometimes, with some KNX Interfaces, whenever you unplug the eth cable for a while, the gateway could'nt regain the connection. Fixed.<br/>
- Added a slight random delay before connecting to KNX BUS, to allow lazy ehternet adapters to come up after a reboot.<br/>
- Improvement: knx-ultimate nodes does have a persistent state after reboot (it saves the states to a json file). Now, if you have multiple gateways, it saves the states for each gateway in a different file.<br/>
- FIX: currently, knx-ultimate set to "auto respond with current value" and "if value unknown, respond with", responds with value selected by the user, if the current value is "" or undefined. Now it does so even if the value is null.<br/>


**Version 1.2.36** - July 2021<br/>
- Fixed a wrong help link in the gateway configuration node, in the italian language.<br/>
- Fix: on importing ETS Group Addresses file, the debug window won't show the import's warnings/error.<br/>
- NEW: starting implementation of KNX Secure (ETA END DECEMBER 2021). For now, the only thing working is keyring import and verification of his Hash against the password you set on the file while exporting keyring from ETS and decyphering of the Backbone key.<br/>
- Updated WIKI and help to reflect KNX Secure changes.<br/>


**Version 1.2.34** - June 2021<br/>
- Gateway configuration: added option Suppress repeated (R-Flag) telegrams fom BUS. When enabled, this option suppress the telegrams marked as "repeated" (with R-Flag) coming from the bus. See here: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Gateway-configuration<br/>


**Version 1.2.33** - May 2021<br/>
- Gateway configuration -> Advanced Options -> Node list in all flows: added more infos to each node in the list, to allow more control on the nodes overview. The options are: "No Initial Read, React to Write, React to Response, No React to Read, No Autorespond to Read Requests, Telegram type write, No RBE on Output to Bus, No RBE on Input from Bus"<br/>


**Version 1.2.32** - May 2021<br/>
- NEW Dattpoint 14.074 (Time in secs) and 14.076 (Volume in m3).<br/>


**Version 1.2.31** - May 2021<br/>
- Fixed an issue happening if whenever you change a KNX node's datapoint, while the persistent value saved to file has already been saved using the old datapoint.<br/>


**Version 1.2.30** - May 2021<br/>
- Datapoint 14.x: fixed a possible issue if the inpur message coming from the flow, is'nt a valid datapoint 14.x value.<br/>


**Version 1.2.29** - May 2021<br/>
- KNX Device: if "read on connection/reconnection" is selected, the gateway node will now read all values of all nodes in 2 steps: first from file (for the nodes set in this way), then from BUS (for the nodes set in this way). This allow nodes that are setup as virtual devices, to get their values from file before being asked to send the value as response to the bus, by other nodes. It's all clear? No? Sorry for that, i'm unable to better explain that.</br>- Watchdog node: NEW: you can force the selected gateway to disconnect from the KNX BUS and to STOP reconnection attempts. You can also force the selected gateway to connect to the KNX BUS and to ENABLE reconnection attempts. https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog<br/>


**Version 1.2.28** - May 2021<br/>
- KNX Device: if you send a boolean value to a node with datapoint 16.001 (Ascii string), all nodes goes to sleep and shows "Waiting" in the status. Fixed. Thanks to @Podler.


**Version 1.2.27** - April 2021<br/>
- Alerter node: fixed an issue related to the order of cycled msg output of alerted devices.- Alerter node: now you can read the value of all devices belonging to the list, on each connection/reconnection.<br/>
- Alerter node: now you can read the value of all devices belonging to the list, by massing *msg.readstatus = true* to the node.<br/>
- Updated Wiki, Help and SAMPLE to reflect this change.<br/>


**Version 1.2.26** - April 2021<br/>
- NEW: Alerter node: added a third output PIN containing the last alerted device (https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration).<br/>
- Updated Wiki, Help and SAMPLE to reflect this change.<br/>


**Version 1.2.25** - April 2021<br/>
- NEW: Alerter node: added a second output PIN containing all alerted devices at once (useful for Telegram, Alexa and so on) (https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration).<br/>
- NEW: Alerter node: now you can enter TWO device's descriptions, one short (MAX 14 CHARS, SUITABLE FOR DPT 16.x) and one long.<br/>
- Updated Wiki, Help and SAMPLE to reflect this change.<br/>


**Version 1.2.23** - April 2021<br/>
- Fix: Put some spaces in the device list window of Alerter and Scene node, to facilitate the fields editing.<br/>
- Alerter node: other than "write", the devices listed react to "response" telegrams as well (https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration).<br/>


**Version 1.2.22** - April 2021<br/>
- Fix: emulated mode in knx-ultimate set to "universal mode" has the topic always set to empty string.<br/>
- NEW: Alerter node (https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration).<br/>
- NEW: Alerter node HELP online with samples, in both italiano, english and deutsch.<br/>


**Version 1.2.21** - April 2021<br/>
- Increased the Multicast TTL from 1 to 16 (this should allow the multicast packet to be routed beyond the current subnet).<br/>


**Version 1.2.20** - April 2021<br/>
- The "Suppress ACK Request" in the gateway config window is now enabled by default on new installations. This prevent some issues with some IP Interfaces.<br/>


**Version 1.2.19** - April 2021<br/>
- NEW: Silent Mode for log. You can now chose to totally avoid logging, thanks to the new logging engine. This is useful for reducing I/O access to the disk. Thank to @Webbeh for the request.<br/>


**Version 1.2.18** - April 2021<br/>
- NEW: KNX-Ultimate node can retain it's value after reconnection to KNX bus and even after reboot of node-red.<br/>
- Update the WIKI to reflect the changes (https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/2.-Node-Configuration).<br/>
- NEW: begin to prepare KNX-Ultimate to support KNX Secure. Some changes to the underlying API where made.<br/>
- Done some checks on new datapoints coming from BUS to discard wrong telegrams lenght.<br/>


**Version 1.2.14** - March 2021<br/>
- NEW: KNX-Logger now logs telegrams sent by KNX-Ultimate nodes having an IP Interface as gateway. Previously, it worked only woth IP Routers.<br/>
- Begin refractoring of code for KNX Secure compatibility.<br/>


**Version 1.2.13** - March 2021<br/>
- Global Context Node: added the option to set the interval to write to the KNX bus.<br/>
- Global Context Node: fixed the help link, it was broken in italian language.<br/>
- Global Context Node: optimized the JavaScript samples.<br/>
- Global Context Node: fix the gateway description not showing in config window, in italian language.<br/>
- Global Context Node: added the configuration help page in the wiki for all languages (https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/GlobalVariable).<br/>
- NEW: Online node-red public test website: Point your browser here http://casacorte.myqnapcloud.com:2021 There is a node-red installation ready to be tested, with KNX-Ultimate fully set in "emulation" mode (you cannot do any damage, because the KNX backbone is simulated).<br/>
- Added proKNX to the list of KNX device manufacturers using KNX-Ultimate (at bottom of the README page).<br/>


**Version 1.2.11** - February 2021<br/>
- NEW: Gateway Simulation node. Put "EMULATE" instead of IP Address in the gateway node. The gateway will not write to the KNX BUS. Useful for simulation and classroom's lessons.<br/>
- NEW: Online node-red public test website... coming soon.



**Version 1.2.10** - February 2021<br/>
- Global Context Node: fixed translation issues and added a warning in the config window.


**Version 1.2.9** - February 2021<br/>
- NEW: LOBAL CONTEXT node: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode), exposes the group addresses to a Global Context variable, to be used in function nodes.<br/>
- NEW: Datapoint 19.001 DateTime<br/>
- Added sample in the config window of Datapoint 19.001 and updated the sample page in the wiki.


**Version 1.2.8** - January 2021<br/>
- NEW: you can now change the node configuration my input message. https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig<br/>
- Added msg.setConfig sample and updated the rest of the WIKI.


**Version 1.2.7** - January 2021<br/>
- NEW: Datapoint 237 DALI diags. https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237<br/>
- Added sample DPT 237.x in the Wiki


**Version 1.2.6** - January 2021<br/>
- NEW: Datapoint 213.x has been added.<br/>
- Added sample DPT 213.x in the Wiki


**Version 1.2.5** - January 2021<br/>
- FIX: nodes wasn't emitting a msg to the flow, when they've been set to respond to READ requests while the they haven't already received a value either from BUS or flow.<br/>
- NEW: you can now update the node's payload without sending the KNX Telegram to the bus. See the node input messages in the wiki and the Virtual Device sample.<br/>
- Updated the Help in various parts of the wiki.<br/>
- Updated Virtual Device sample, in the samples section.<br/>


**Version 1.2.4** - January 2021<br/>
- REMOVED: removed compatibility with KNX Virtual because it brokes some dockerized/pluginized node-red KNX connections.<br/>


**Version 1.2.3** - 31 December 2020<br/>
- FIX: last 2 bytes of 249.600 were swapped.<br/>
- FIX: last 2 bytes of 242.600 were swapped.<br/>


**Version 1.2.2** - 31 December 2020<br/>
- NEW: Datapoint 249.600 added msg.payload={transitionTime:100, colourTemperature:1000, absoluteBrightness:80, isTimePeriodValid:true, isAbsoluteColourTemperatureValid:true, isAbsoluteBrightnessValid:true};- FIX: validities bits of 242.600, that returns everytime true.<br/>


**Version 1.2.1** - December 2020<br/>
- FIX: fixed RBE filter not working for Datapoint 242.600<br/>
- Change: payload 242.600 must now be passed with color and brighness valididy booleans: msg.payload={x:500, y:500, brightness:80, isColorValid:true, isBrightnessValid:true};


**Version 1.2.0** - December 2020<br/>
- NEW: added compatibility with ETS KNX VIRTUAL.<br/>
- NEW: added node protection help in the german wiki.<br/>
- Updated the circular reference protection to be more intelligent thus more tollerant. Thanks @Christian for raising the request.<br/>
- Updated the circular reference sample in the wiki.<br/>
- Updated the msg input help in the wiki for all languages..<br/>


**Version 1.1.99** - December 2020<br/>
- FIX: RBE filter (from BUS and from flow) doesn't work if the payload is an object.<br/>
- Removed an unwanted debug log in dPT 242.600<br/>


**Version 1.1.98** - December 2020<br/>
- NEW: added Datapoint 242.600 Color xyY.<br/>


**Version 1.1.97** - December 2020<br/>
- NEW: added help links directly into the config windows and upon selection of datapoint as well.<br/>
- Cleaning of UI.<br/>


**Version 1.1.95** - December 2020<br/>
- Enhancement: you can now send a raw buffer directly to the KNX bus. See the Wiki, "message to the node" page.<br/>
- Updated the wiki accordingly.<br/>


**Version 1.1.93** - December 2020<br/>
- Enhancement: Check if the gateway's IP is a valid one, otherwise it avoids connection. Thanks @heleon for signaling this issue.<br/>
- Replaced some deprecated buffer calls.<br/>


**Version 1.1.92** - October 2020<br/>
- BUGFIX: RGB Color wasn't working. Now it's fixed.<br/>


**Version 1.1.91** - October 2020<br/>
- NEW: Datapoint 22.201 RCHH Status (for example, for MDT actuators)<br/>
- Added sample for Datapoint 22.x (https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22)<br/>
- Added sample for Datapoint 20.x<br/>


**Version 1.1.90** - October 2020<br/>
- Connection and queue handling optimization for big installations where knxd is used and where there is a near maximum (allowed by knx standards) of datagram per seconds traffic on the BUS. Thanks @Songzh<br/>
- FIX sample message not showing in the config window of knx-ultimate device, if the device is already presento on the flow. <br/>
- Added sample for Datapoint 2.*, 1 bit with priority. <br/>
- Added sample for Datapoint 6.x, value -128 to 127%. <br/>
- Added sample for Datapoint 7.x. <br/>
- Added sample for Datapoint 8.x. <br/>
- Added sample for Datapoint 9.x. <br/>
- Added sample for Datapoint 12.x. <br/>
- Added sample for Datapoint 13.x. <br/>
- Added sample for Datapoint 14.x. <br/>
- Added sample for switching on/off a POE port of Unifi Switch (https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE)


**Version 1.1.89** - September 2020<br/>
- Fix an issue, where the node stops connecting to the bus if you're using knxd, in some particular scenario. Thanks @Songzh<br/>


**Version 1.1.88** - September 2020<br/>
- FIX: Scene Controller. If disabled, it outputs now the correct values of recallscene and savescene properties (before, both was sentout as false, even if true). See here at bottom: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/SceneController-MSG-to-the-node<br/>


**Version 1.1.86** - September 2020<br/>
- NEW: Scene Controller, added the ability to disable the scene controller via msg.disabled = true. See here at bottom: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/SceneController-MSG-to-the-node<br/>


**Version 1.1.85** - September 2020<br/>
- FIX: The buffer of the ETS Logger is now cleared after every sendout. Thanks @Mil.<br/>


**Version 1.1.84** - September 2020<br/>
- The knx API is now part of knx-ultimate. External dependency has been removed. This allow to a more tight integration between KNX Bus and node-red.<br/>
- Update: Rewrite of all datapoint names, to adhere to ETS naming convenction. Updated some deprecated buffer initialization.<br/>
- NEW: Added Datapoint 6.020 Status with mode.<br/>
- NEW: Added Datapoint 8.012 Length in meter.<br/>
- NEW: Added Datapoint 9.029 Wind speed (km/h).<br/>
- NEW: Added Datapoint 9.030 Concentration (ug/m3).<br/>
- NEW: many people simply don't care about WIKI in Github, so i need to find a simpler and more direct way to access the huge documentation, without being flooded by questions about samples, that are already in the WIKI. Now KNX-Ultimate node displays a text box with sample on how to format input payload and a link to the relative help page, directly in the config window.<br/> 


**Version 1.1.83** - September 2020<br/>
- Update API to 2.3.24: Added Datapoint 222.100 and 222.201.<br/>
- NEW: Added Sample DPT 222 (See in the Wiki).<br/> 


**Version 1.1.82** - August 2020<br/>
- Update API to 2.3.23: Fixed a very old/why this?/odd issue with log in datapoints code, that instantiate a new instance of the logger instead of using the proper one. Thanks @heleon19 .<br/> 


**Version 1.1.81** - August 2020<br/>
- Update API to 2.3.22: Changed the log datetime from ISO to Local UTC. Added the prefix "KnUltimate-API to the log, to better undestand form where the log comes.<br/> - NEW: ADDED Datapoint 5.100 Fan Stage


**Version 1.1.80** - August 2020<br/>
- Update API to 2.3.21: changing the debug level now is applied immediately without restarting node-red. 


**Version 1.1.79** - August 2020<br/>
- NEW: The scene controller node can now save the current group address value via a msg input. See here: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/SceneController-MSG-to-the-node and the sample in the wiki as well..


**Version 1.1.76** - August 2020<br/>
- Fixed the ETS XML logger. Sometimes the files could contains an invalid CEMI telegram that was not properly discarded and that prevent ETS to load the log. Thanks @Namakemono93.<br/>
- Fixed a visual glitch in the KNX-Node config window (Telegram value format) for nodered 1.1.0 and above.


**Version 1.1.75** - June 2020<br/>
- NEW: Added Datapont 7.xxx with 7.600 as well.<br/>
- Adjusted italian node translation on "OUTPUT (invio datagrammi sul bus KNX)" selection properties. Adjusted the documentation consequently.<br/>


**Version 1.1.73** - Mai 2020<br/>
- FIX: fixed an issue in importing ETS file, preventing import if you have an improperly set knx-ultimate node, having no gateway selected. Thanks @enzensbs.<br/>


**Version 1.1.72** - Mai 2020<br/>
- Update knx api to 2.3.19<br/>
- FIX: fixed a problem when issuing a gateway ip change to a watchdog node, if you've a tunneling KNX Interface and node-red v. 0.20 or below.<br/>
- FIX: above related with connection status request if tunneling mode, sometime giving "timed out waiting for CONNECTIONSTATE_RESPONSE" errors.<br/>


**Version 1.1.71** - Mai 2020<br/>
- Update knx api to 2.3.18<br/>
- NEW: added Datapoint 251.600 RGBW<br/>
- State request to the BUS is now sent every 60 seconds instead of 10, for lowering the BUS traffic (see changelog for Version 1.1.68)<br/>
- More relaxed handling of errors coming from an query to a KNX/IP interface not always reponding to connection status (in case, for example, of some implementations of knxd)<br/>
- Watchdog: on "basic Ethernet check", switched to ping mode detection. With the introduction of "echo local telegrams" in unicast mode, since some versions ago, the watchdog must yet check for the KNX Interface using Ping, otherwise, the lost of connection is never trapped. Other than that, the "basic Ethernet check" works only with KNX Interfaces, because the router uses multicast and multicast is connectionless.<br/>


**Version 1.1.70** - Mai 2020<br/>
- NEW: Added the option to select the delay between each telegram and further delay multiplicator between only the **read** telegrams<br/>


**Version 1.1.69** - Mai 2020<br/>
- Update: knxultimate-api to 2.3.17.<br/>
- NEW: Added Datapoint 12.001 and 12.1201.<br/>


**Version 1.1.68** - April 2020<br/>
- Update: knxultimate-api to 2.3.16.<br/>
- FIX: fixed disconnection in tunneling mode by strictly adhere to KNX standard (sending state request to the BUS every 10 seconds). Thanks to Matthias of Timberwolf Server.<br/>
- Introduced some internal changes in preparation to the introduction of the new dashboard compatible visualization nodeset "visu-ultimate".<br/>


**Version 1.1.67** - April 2020<br/>
- Re-introduced selectable option for local echo if tunneling.<br/>
- Smarter restart maneuvering in case of Ethernet issues, while on tunneling connections.<br/>


**Version 1.1.65** - April 2020<br/>
- FIX: If the imported ETS file, contains a device name with a # character, strange things happens. Fixed.<br/>
- Forced local Echo for IP interfaces.<br/>


**Version 1.1.64** - April 2020<br/>
- NEW: Added Telegram type "Read", to issue a read by simply pass a payload to the node. Thanks @waldbaer for the suggestion.<br/>


**Version 1.1.63** - April 2020<br/>
- Informational nitification when datapoint RGB is selected, on how to pass into the payload.<br/>
- Removal selection of echoing the sent payload on all node, if the gateway is unicast. Now the echo is active everytime.<br/>


**Version 1.1.62** - April 2020 in Italy, we're crying our dead people.<br/>
- Better decriptive Multicast/Unicast gateway auto discovery.<br/>
- Definitive use of heavily modified knx-ultimate.js API instead of knx.js.<br/>


**Version 1.1.61** - April 2020 in Italy, deaths are increasing to 600 pro day.<br/>
- Fix error in ESF file import, if you set more than one Group Address in a single device property.<br/>


**Version 1.1.60** - April 2020 in Italy, deaths are decresing to 500 pro day.<br/>
- Fix error in gateway node translation, that disappeared.<br/>


**Version 1.1.59** - April 2020 in Italy, deaths are decresing to 500 pro day.<br/>
- Adjusted translations.<br/>
- NEW: added Datapoint 10 Bytes.<br/>


**Version 1.1.58** - April 2020 in Italy, continue lock down Coronavirus.<br/>
- Adjusted translations.<br/>
- Small bugfixes.<br/>
- Removed the deprecated setGatewayConfig from knx-ultimate. Use Watchdog node instead.<br/>


**Version 1.1.57** - April 2020 in Italy, continue lock down Coronavirus, but situation is better now.<br/>
- Datapoint 18.001 added. Now this datapoint for Scene is fully supported.<br/>
- Sample controlling datapoint 18.001.<br/>
- Scene node and knx-ultimate device node changed accordnlgy.<br/>


**Version 1.1.55** - March 2020 in Italy, continue lock down Coronavirus, but situation is better now.<br/>
- NEW: Added option to skip the import of the group address from the ETS file, if the datapoint is not set.<br/>


**Version 1.1.54** - March 2020 in Italy, continue lock down Coronavirus, but situation is better now.<br/>
- FIX: fixed status display of date/time. Yet if you uncheck the option not do display the date/time, it works.<br/>
- ENHANCEMENT: search for all words in the group address fields. You can now search, for example, for "licht wohnzimmer".<br/>
- Changed palette order to better view the service nodes, like Logger and Watchdog.<br/>
- Ongoning Deutch translation.<br/>


**Version 1.1.53** - March 2020 in Italy, continue lock down Coronavirus.<br/>
- NEW: msg passthrough option.<br/>


**Version 1.1.52** - March 2020 in Italy, continue lock down Coronavirus.<br/>
- FIX: import ETS csv and ESF files may had problem with languages other that english. Fixed.<br/>
- FIX: Scene Controller, fix trigger suggestion if datapoint trigger is set to DIM.<br/>
- FIX: WatchDog, fix autostart timer if no Group Address monitor is selected.<br/>
- NEW: Logger Node, a new node to hear all telegrams and to output an ETS bus monitor compatible file.<br/>
- Update underlying KNX api to 2.3.10, to extract CEMI telegram for the Logger Node.<br/>
- Minor bugfixes.<br/>
- Other translation work has been done.<br/>


**Version 1.1.50** - March 2020 in Italy, continue lock down Coronavirus. Cases 25.000<br/>
- FIX: Scene controller, the "save scene" datapoint was override by "recall scene" datapoint on each open of the config window.<br/>
- FIX: Scene Controller, without imported ETS file, the scene controller recall/save worked only with boolean values. Now it works correctly. Thanks @mthauth.<br/>
- FIX: Scene Controller, correct handling of dim commands (example {decr_incr:1,data:5}).<br/>
- Scene Controller now is called via javascript Promise to leverage the main thread.<br/>


**Version 1.1.48** - March 2020 in Italy, continue lock down Coronavirus. Milan index down 8%, Down Jons as well. Panic selling everywhere.<br/>
- FIX: When you copy/paste knx-ultimate or scene controller node, autofill of device names doesn't work.<br/>
- Scene Controller devices cosmetics adjustments.<br/>


**Version 1.1.47** - March 2020 in Italy, continue lock down. More people involved in Coronavirus<br/>
- FIX: In gateway config-node, fixed the "List of your nodes in all flows" (under Advanced Options) list, sometime not populated.<br/>
- ENHANCEMENT: Now knx-ultimate and scene controller display device list names for newly added nodes in the flow. Prior, you had to save the node first, to get the knx device list into the Group Address fields.<br/>


**Version 1.1.45** - March 2020 in Italy, we're locked down for Coronavirus<br/>
- Update knxultimate-api. Yet the nodes connected to an IP Interface, behaves like the nodes connected to an IP Router. See option **Echo sent message to all node with same Group Address** in the Gateway configuration wiki.<br/>
- I'm internationalizing the node **(Deutsch, Italiano, English)** with the help of **@svenflender**, so please be patient if some parts are still only in english. Internationalization is working with node-red version 1.0.3 and above. Versions below, does have issues in the i18n module, so knx-ultimate falls back to english. Please upgrade node-red.<br/>


**Version 1.1.43** - March 2020 in the middle of Coronavirus emergency in Italy<br/>
- NEW: Scene Controller node (see the Wiki).<br/>


**Version 1.1.40** - March 2020<br/>
- Better handling of telegrams, giving priority to the "write" and "response" telegram in the queue. Thanks @heleon19 for the suggestion.<br/>


**Version 1.1.39** - March 2020<br/>
- Fix a very low priority issue: a possible crash if you set the knx-ultimate node's output as "respond", while passing an object as payload to the input.<br/>


**Version 1.1.38** - March 2020<br/>
- Yet, if you import an ETS CSV file without datapoints, a fake datapoint 1.001 will be used (if you selected to force import the group address)<br/>
- Update help and wiki to reflect the change<br/>


**Version 1.1.37** - Feb 2020<br/>
- Fixed an issue where new knx-ultimate nodes, without a gateway config node, doesn't open the configuration window. Thanks @svenflender<br/>


**Version 1.1.36** - Feb 2020<br/>
- You can now import ESF group address format, beside CSV.<br/>
- Updated the Wiki.<br/>


**Version 1.1.34** - Feb 2020<br/>
- Fix an issue with RGB values.<br/>
- Added RGB sample in the Wiki.<br/>


**Version 1.1.33** - Feb 2020<br/>
- New: the Watchdog node now outputs a msg to the flow if you issued a setGatewayConfig<br/>
- Patched and switched to knxultimate-api (v. 2.3.8) underlying API. This should fix a very rare issue causing node-red to crash giving ERR_SOCKET_DGRAM_NOT_RUNNING error.<br/>


**Version 1.1.32** - Feb 2020<br/>
- New: in the knx-ultimate, added the option to <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/2.-Node-Configuration" target="_blank">format the msg.payload value</a>, if it's numeric.<br/>
- Switched to knx.js API 2.3.7<br/>
- Refractoring of some internal code to speed up things, whenever the node sends a "Read" request to the BUS.<br/>
- Fix a message warning in the config page, if you not imported the ETS csv file.<br/>
- Fix the "Universal Mode" setting wrongly reverting to false on newly added nodes, if you've not imported the ETS csv.<br/>
- Devicename msg property is now populated with the node name, if the node is in Universal Mode and the ETS CSV file has not been imported (previoulsy was set to empty string).<br/>
- Update the Wiki and node help, with the new "payload format" options.<br/>


**Version 1.1.31** - Feb 2020<br/>
- Rewritten the "Send a GrpValue read once on connection/reconnect" using the telegram queue.<br/>
- New: new underlying API set to knxultimate-api (v. 2.3.7) and patched with last API fixes. From now onwards, knx-ultimate node will switch between underlying **knx.js** API and his own **knxultimate-api**, to allow a quicker fix of possible problems with the API.<br/>
- Relocate nodes in a specific folder.<br/>


**Version 1.1.30** - Feb 2020<br/>
- New: the Watchdog node now signals if a knx-ultimate node throws errors as well. <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/8.-WatchDog-Messages-from-the-node" target="_blank">See here output message properties.</a><br/>


**Version 1.1.29** - Feb 2020<br/>
- Changed Node KNX Icon, logo and colors, thanks @svenflender <br/>
- New in config-node: copy/paste friendly text block, with a list of all KNX Nodes (for using, for example, in KNX Router line/zone filters).<br/>
- New: added subtype decoded value **payloadsubtypevalue** ( for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm ). <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype" target="_blank">See here an example</a><br/>


**Version 1.1.28** - Jan 2020<br/>
- New: Added topic property<br/>
- New: added page to wiki, explaining the node protection. <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Protections" target="_blank">Node Protections</a>.<br/>
- Updated Wiki to reflect the new changes.<br/>


**Version 1.1.27** - Jan 2020<br/>
- New: added payloadmeasureunit to the node's msg output (for example "W" or "%"), based on Datapoint type.<br/>
- New: added knx.dptdesc to the node's msg output (for example "Power" or "Humidity").<br/>
- New: added Loglevel option in config-node, for debugging pourpose only. Thanks Heleon19.<br/>


**Version 1.1.26** - Jan 2020<br/>
- New: Watchdog Node added. Please <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/7.-WatchDog-Configuration" target="_blank">consult the Wiki</a>.<br/>
- Changed category (the node's list on left panel of node-red) to "KnxUltimate", to accomodate the Watchdog node.<br/>


**Version 1.1.25** - Jan 2020<br/>
- New: ability to programmatically change the KNX/IP interface or router's IP, Port, Physical Address and reset local ETH Interface Binding.<br/>


**Version 1.1.24** - Jan 2020<br/>
- FIX: If the message has no payload and no readstatus, throw an error. If you requests a readstatus, there's no need to pass a payload. Previously, the node has gone in stop mode if the payload was null, thus having readstatus.<br/>
- Added Read Request sample in the Wiki.<br/>


**Version 1.1.22**<br/>
- Added msg.previouspayload that stores the previous node value<br/>
- Update Wiki accordlingy.<br/>


**Version 1.1.21**<br/>
- Fixed a possible crash if the payload is an object and the node is set to send a "response" telegram instead of a "write" telegram.<br/>
- Added an explanation about meaning of status colors, in the node info on the right panel and in the wiki.<br/>
- Updated node info and wiki to reflect the new UI changes.<br/>


**Version 1.1.20**<br/>
- Config node UI cleanup.<br/>
- During the ETS CSV file import, if a datapoint is not set, you can now select whether to abort the import or to skip the affected group address and continue.<br/>
- Added Homekit, Alexa and Google Assistant samples in the wiki.<br/>


**Version 1.1.19**<br/>
- More UI cleanup.


**Version 1.1.18**<br/>
- Removed the handling of the telegram queue's delay buffer from underlying KNX.js API, because it doesn't respect the telegram queue order.<br/>
- Added own message queue buffer with delay of 50 millisecs. Now the telegrams order is respected.<br/>
- In the node's configuration, added an advanced tab, that hides or shows the advanced options; now the configuration is much more clean. Advanced Options opens up automatically if the values have been changed from defaults.<br/>



**Version 1.1.17**<br/>
- Fixed autorespond to a read request.<br/>


**Version 1.1.16**<br/>
- Added a minimum delay of 60milliseconds between telegrams, when the node sends telegrams to the BUS, to avoid flooding the KNX BUS, causing a loss of telegrams. The KNX.org specs allows max 50 telegrams per seconds (max 1 telegram each 20milliseconds), but in real life, this is too much.<br/>


**Version 1.1.15**<br/>
- Updated underlying API to 2.3.6 with some bugfixes.<br/>
- Added FAQ and troubleshoot in the Wiki.<br/>


**Version 1.1.14**<br/>
- Fix issue with RBE Output due to code cleanup.<br/>


**Version 1.1.13**<br/>
- Code cleanup thanks @SystemKeeper<br/>


**Version 1.1.12**<br/>
- Universal mode optimizations<br/>
- Fix abnormal log iw universal mode receiver cannot find a suitable datapoint<br/>
- Added automatic discover for datapoint 14.056<br/>
- Added automatic discover for datapoint 16.001<br/>


**Version 1.1.12**<br/>
- Fixed a little issue where the status message is not displayed if the node has not well wrote group address (for example 1/5 instead of 1/5/1). Thanks @arsiesis.<br/>
- Cleaned up the layout of config window.<br/>
- Changed option **Listen to all Group Addresses** to a more comprensible **Universal mode (listen to all Group Addresses)**.<br/>
- The node can now be used as universal KNX sender/receiver without the need of the ETS CSV File.<br/>


**Version 1.1.10**<br/>
- Auto send node value as response to the KNX Bus. It works in conjunction with React to read telegrams. When checked, whenever the node receives a read request from bus, it sends a response to the KNX Bus with the stored payload value.<br/>
- Fixed an issue where if you have a node set to Universal mode (listen to all Group Addresses) (with ETS CSV File set) and you create a new node having a Group Addr. not in the ETS CSV file, an exception is raised but not caught and the nodes may not receive the values from KNX BUS.<br/>


**Version 1.1.9**<br/>
- Fixed visual glitch when create a new freshly Config Node.<br/>
- Added 3 options in the config-node to select what to display in the node status, for a cleaner flow or for a clearer flow.<br/>
- Fixed issue with IP Interfaces. On each deploy, the node doesn't lock tunnels anymore.<br/>


**Version 1.1.8**<br/>
- For new nodes, the rbe output filter is enabled by default. You can always turn it off in the options. This helps novice users avoiding loops.<br/>
- Fixed an issue where if the connection is in tunnel mode and the connection to the IP Interface or KNX Bus is lost, the node trows an unhandled exception. Thanks to User Maarten200.<br/>
- Added the word "knxUltimate" before any log, to identify that the log comes from the knx-ultimate node.<br/>


**Version 1.1.7**<br/>
- Fixed bind to ethernet. Now you can manually input the ethernet name as well. Thanks to user rotorman.<br/>


**Version 1.1.6**<br/>
- Fixed inport CSV from ETS where there is return carriages and parenthesis in the Group Address description. Thanks to user xrk.<br/>


**Version 1.1.4**<br/>
- Last changed status date/time shortened out<br/>


**Version 1.1.3**<br/>
- In node status, added the last changed status date/time.<br/>


**Version 1.1.2**<br/>
- When you asks for a read on a node having Listen All Group Addresses set to true, due to a low delay between each KNX telegram, some telegrams are discarded. Increased the delay between telegram to avoid that.<br/>
- Added RBE filter for the INPUT from KNX bus as well.<br/>
- Added the option to bind to local ethernet interface, in case you have more than one, for example, ethernet and wifi.<br/>
- Fixed option suppress_ack_ldatareq not retain after restart.<br/>
- In-Line help update to reflect new changes.<br/>


**Version 1.1.1**<br/>
- Disambigued misinterpretation of the "disconnect" status.<br/>
- In the autocomplete box of KNX device names, when you type in the group address or the device's name, it shows the main and subgroup name as well<br/>
- Cosmetic adjustment<br/>
- In-Line help additions<br/>


**Version 1.1.0 LTS (Long term stable)**<br/>
- Once disabled for loop or circular reference protection, the node can be re-enabled by simply click on deploy "modified nodes"<br/>
- When "Universal mode (listen to all Group Addresses)" is selected, the RBE filter is disabled.<br/>
- Cosmetic adjustment<br/>


**Version 1.0.19**<br/>
- Automatic loop protection<br/>


**Version 1.0.18**<br/>
- Added gateway options:<br/>
    KNX Physical Address<br/>
    Suppress ACK request<br/>
    This option help compatibility with old Siemens SWG1 148-1AB22 IP Interface <br/>
- Added RBE option to the input (Report by Exception node - only passes on data if the payload has changed)<br/>


**Version 1.0.16**<br/>
- Input message format has been CHANGED! please see the wiki!!!.<br/>
- Circular reference protection (when 2 nodes with same group address are link toghether, the protection avoids loops.).<br/>


**Version 1.0.15**<br/>
- Device Node outputs the name when ETS csv is not set too.<br/>


**Version 1.0.14**<br/>
- Fixed knx dependency<br/>


**Version 1.0.7**<br/>
- Check for invalid node's Group Addr.<br/>


**Version 1.0.5**<br/>
- Fixed the fix for the typo error causing a mess<br/>


**Version 1.0.5**<br/>
- Fixed a typo error causing a mess<br/>


**Version 1.0.4**<br/>
- Fixed possible issue with the csv ETS endpoint<br/>


**Version 1.0.3**<br/>
- If ETS csv file is set, when typing a group address in the node, a list of KNX devices will be shown and when selected, it set the Datapoint and the Devicename automatically.<br/>


**Version 1.0.2**<br/>
- Fixed minor glitches in node config ui<br/>


**Version 1.0.1 FIRST PUBLIC RELEASE**<br/>
- Fixed minor glitches<br/>
- Ended extensive testing<br/>
- Enhanced Wiki and Youtube Video about ETS CSV File


**Version 0.0.6 BETA**<br/>
- Fixed Telegram type unable to be set<br/>
- Added node status for response (blue) and read (grey)<br/>


**Version 0.0.5 BETA**<br/>
- Integration of Help documentation<br/>
- Readstatus fix<br/>


**Version 0.0.3 BETA**<br/>
- Added Help documentation<br/>
- Added samples on the Readme.md<br/>
- Better user's notifications handling of the ETS csv file checks.<br/>


**Version 0.0.2 BETA**<br/>
- Added BETA warnings.<br/>


**Version 0.0.1 BETA**<br/>
- Initial release<br/>

