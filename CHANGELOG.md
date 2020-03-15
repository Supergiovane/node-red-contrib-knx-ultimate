![Sample Node](img/logo.png)

[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square)](https://www.paypal.me/techtoday) and <a href="http://eepurl.com/gJm095" target="_blank">subscribe to my channel </a> for latest news about my nodes.

<br/>

<p>
<b>Version 1.1.46</b> - March 2020 in Italy, continue lock down. More people involved in Coronavirus<br/>
- FIX: In gateway config-node, fixed the "List of your nodes in all flows" (under Advanced Options) list, sometime not populated.<br/>
- ENHANCEMENT: Now knx-ultimate and scene controller display device list names for newly added nodes in the flow. Prior, you had to save the node first, to get the knx device list into the Group Address fields.<br/>
</p>
<p>
<b>Version 1.1.45</b> - March 2020 in Italy, we're locked down for Coronavirus<br/>
- Update knxultimate-api. Yet the nodes connected to an IP Interface, behaves like the nodes connected to an IP Router. See option <b>Echo sent message to all node with same Group Address</b> in the Gateway configuration wiki.<br/>
- I'm internationalizing the node <b>(Deutsch, Italiano, English)</b> with the help of <b>@svenflender</b>, so please be patient if some parts are still only in english. Internationalization is working with node-red version 1.0.3 and above. Versions below, does have issues in the i18n module, so knx-ultimate falls back to english. Please upgrade node-red.<br/>
</p>
<p>
<b>Version 1.1.43</b> - March 2020 in the middle of Coronavirus emergency in Italy<br/>
- NEW: Scene Controller node (see the Wiki).<br/>
</p>
<p>
<b>Version 1.1.40</b> - March 2020<br/>
- Better handling of telegrams, giving priority to the "write" and "response" telegram in the queue. Thanks @heleon19 for the suggestion.<br/>
</p>
<p>
<b>Version 1.1.39</b> - March 2020<br/>
- Fix a very low priority issue: a possible crash if you set the knx-ultimate node's output as "respond", while passing an object as payload to the input.<br/>
</p>
<p>
<b>Version 1.1.38</b> - March 2020<br/>
- Yet, if you import an ETS CSV file without datapoints, a fake datapoint 1.001 will be used (if you selected to force import the group address)<br/>
- Update help and wiki to reflect the change<br/>
</p>
<p>
<b>Version 1.1.37</b> - Feb 2020<br/>
- Fixed an issue where new knx-ultimate nodes, without a gateway config node, doesn't open the configuration window. Thanks @svenflender<br/>
</p>
<p>
<b>Version 1.1.36</b> - Feb 2020<br/>
- You can now import ESF group address format, beside CSV.<br/>
- Updated the Wiki.<br/>
</p>
<p>
<b>Version 1.1.34</b> - Feb 2020<br/>
- Fix an issue with RGB values.<br/>
- Added RGB sample in the Wiki.<br/>
</p>
<p>
<b>Version 1.1.33</b> - Feb 2020<br/>
- New: the Watchdog node now outputs a msg to the flow if you issued a setGatewayConfig<br/>
- Patched and switched to knxultimate-api (v. 2.3.8) underlying API. This should fix a very rare issue causing node-red to crash giving ERR_SOCKET_DGRAM_NOT_RUNNING error.<br/>
</p>
<p>
<b>Version 1.1.32</b> - Feb 2020<br/>
- New: in the knx-ultimate, added the option to <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/2.-Node-Configuration" target="_blank">format the msg.payload value</a>, if it's numeric.<br/>
- Switched to knx.js API 2.3.7<br/>
- Refractoring of some internal code to speed up things, whenever the node sends a "Read" request to the BUS.<br/>
- Fix a message warning in the config page, if you not imported the ETS csv file.<br/>
- Fix the "Universal Mode" setting wrongly reverting to false on newly added nodes, if you've not imported the ETS csv.<br/>
- Devicename msg property is now populated with the node name, if the node is in Universal Mode and the ETS CSV file has not been imported (previoulsy was set to empty string).<br/>
- Update the Wiki and node help, with the new "payload format" options.<br/>
</p>
<p>
<b>Version 1.1.31</b> - Feb 2020<br/>
- Rewritten the "Send a GrpValue read once on connection/reconnect" using the telegram queue.<br/>
- New: new underlying API set to knxultimate-api (v. 2.3.7) and patched with last API fixes. From now onwards, knx-ultimate node will switch between underlying <b>knx.js</b> API and his own <b>knxultimate-api</b>, to allow a quicker fix of possible problems with the API.<br/>
- Relocate nodes in a specific folder.<br/>
</p>
<p>
<b>Version 1.1.30</b> - Feb 2020<br/>
- New: the Watchdog node now signals if a knx-ultimate node throws errors as well. <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/8.-WatchDog-Messages-from-the-node" target="_blank">See here output message properties.</a><br/>
</p>
<p>
<b>Version 1.1.29</b> - Feb 2020<br/>
- Changed Node KNX Icon, logo and colors, thanks @svenflender <br/>
- New in config-node: copy/paste friendly text block, with a list of all KNX Nodes (for using, for example, in KNX Router line/zone filters).<br/>
- New: added subtype decoded value **payloadsubtypevalue** ( for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm ). <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype" target="_blank">See here an example</a><br/>
</p>
<p>
<b>Version 1.1.28</b> - Jan 2020<br/>
- New: Added topic property<br/>
- New: added page to wiki, explaining the node protection. <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Protections" target="_blank">Node Protections</a>.<br/>
- Updated Wiki to reflect the new changes.<br/>
</p>
<p>
<b>Version 1.1.27</b> - Jan 2020<br/>
- New: added payloadmeasureunit to the node's msg output (for example "W" or "%"), based on Datapoint type.<br/>
- New: added knx.dptdesc to the node's msg output (for example "Power" or "Humidity").<br/>
- New: added Loglevel option in config-node, for debugging pourpose only. Thanks Heleon19.<br/>
</p>
<p>
<b>Version 1.1.26</b> - Jan 2020<br/>
- New: Watchdog Node added. Please <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/7.-WatchDog-Configuration" target="_blank">consult the Wiki</a>.<br/>
- Changed category (the node's list on left panel of node-red) to "KnxUltimate", to accomodate the Watchdog node.<br/>
</p>
<p>
<b>Version 1.1.25</b> - Jan 2020<br/>
- New: ability to programmatically change the KNX/IP interface or router's IP, Port, Physical Address and reset local ETH Interface Binding.<br/>
</p>
<p>
<b>Version 1.1.24</b> - Jan 2020<br/>
- FIX: If the message has no payload and no readstatus, throw an error. If you requests a readstatus, there's no need to pass a payload. Previously, the node has gone in stop mode if the payload was null, thus having readstatus.<br/>
- Added Read Request sample in the Wiki.<br/>
</p>
<p>
<b>Version 1.1.22</b><br/>
- Added msg.previouspayload that stores the previous node value<br/>
- Update Wiki accordlingy.<br/>
</p>
<p>
<b>Version 1.1.21</b><br/>
- Fixed a possible crash if the payload is an object and the node is set to send a "response" telegram instead of a "write" telegram.<br/>
- Added an explanation about meaning of status colors, in the node info on the right panel and in the wiki.<br/>
- Updated node info and wiki to reflect the new UI changes.<br/>
</p>
<p>
<b>Version 1.1.20</b><br/>
- Config node UI cleanup.<br/>
- During the ETS CSV file import, if a datapoint is not set, you can now select whether to abort the import or to skip the affected group address and continue.<br/>
- Added Homekit, Alexa and Google Assistant samples in the wiki.<br/>
</p>
<p>
<b>Version 1.1.19</b><br/>
- More UI cleanup.
</p>
<p>
<b>Version 1.1.18</b><br/>
- Removed the handling of the telegram queue's delay buffer from underlying KNX.js API, because it doesn't respect the telegram queue order.<br/>
- Added own message queue buffer with delay of 50 millisecs. Now the telegrams order is respected.<br/>
- In the node's configuration, added an advanced tab, that hides or shows the advanced options; now the configuration is much more clean. Advanced Options opens up automatically if the values have been changed from defaults.<br/>
</p>
<p>
<p>
<b>Version 1.1.17</b><br/>
- Fixed autorespond to a read request.<br/>
</p>
<p>
<b>Version 1.1.16</b><br/>
- Added a minimum delay of 60milliseconds between telegrams, when the node sends telegrams to the BUS, to avoid flooding the KNX BUS, causing a loss of telegrams. The KNX.org specs allows max 50 telegrams per seconds (max 1 telegram each 20milliseconds), but in real life, this is too much.<br/>
</p>
<p>
<b>Version 1.1.15</b><br/>
- Updated underlying API to 2.3.6 with some bugfixes.<br/>
- Added FAQ and troubleshoot in the Wiki.<br/>
</p>
<p>
<b>Version 1.1.14</b><br/>
- Fix issue with RBE Output due to code cleanup.<br/>
</p>
<p>
<b>Version 1.1.13</b><br/>
- Code cleanup thanks @SystemKeeper<br/>
</p>
<p>
<b>Version 1.1.12</b><br/>
- Universal mode optimizations<br/>
- Fix abnormal log iw universal mode receiver cannot find a suitable datapoint<br/>
- Added automatic discover for datapoint 14.056<br/>
- Added automatic discover for datapoint 16.001<br/>
</p>
<p>
<b>Version 1.1.12</b><br/>
- Fixed a little issue where the status message is not displayed if the node has not well wrote group address (for example 1/5 instead of 1/5/1). Thanks @arsiesis.<br/>
- Cleaned up the layout of config window.<br/>
- Changed option <b>Listen to all Group Addresses</b> to a more comprensible <b>Universal mode (listen to all Group Addresses)</b>.<br/>
- The node can now be used as universal KNX sender/receiver without the need of the ETS CSV File.<br/>
</p>
<p>
<b>Version 1.1.10</b><br/>
- Auto send node value as response to the KNX Bus. It works in conjunction with React to event GroupValue read. When checked, whenever the node receives a read request from bus, it sends a response to the KNX Bus with the stored payload value.<br/>
- Fixed an issue where if you have a node set to Universal mode (listen to all Group Addresses) (with ETS CSV File set) and you create a new node having a Group Addr. not in the ETS CSV file, an exception is raised but not caught and the nodes may not receive the values from KNX BUS.<br/>
</p>
<p>
<b>Version 1.1.9</b><br/>
- Fixed visual glitch when create a new freshly Config Node.<br/>
- Added 3 options in the config-node to select what to display in the node status, for a cleaner flow or for a clearer flow.<br/>
- Fixed issue with IP Interfaces. On each deploy, the node doesn't lock tunnels anymore.<br/>
</p>
<p>
<b>Version 1.1.8</b><br/>
- For new nodes, the rbe output filter is enabled by default. You can always turn it off in the options. This helps novice users avoiding loops.<br/>
- Fixed an issue where if the connection is in tunnel mode and the connection to the IP Interface or KNX Bus is lost, the node trows an unhandled exception. Thanks to User Maarten200.<br/>
- Added the word "knxUltimate" before any log, to identify that the log comes from the knx-ultimate node.<br/>
</p>
<p>
<b>Version 1.1.7</b><br/>
- Fixed bind to ethernet. Now you can manually input the ethernet name as well. Thanks to user rotorman.<br/>
</p>
<p>
<b>Version 1.1.6</b><br/>
- Fixed inport CSV from ETS where there is return carriages and parenthesis in the Group Address description. Thanks to user xrk.<br/>
</p>
<p>
<b>Version 1.1.4</b><br/>
- Last changed status date/time shortened out<br/>
</p>
<p>
<b>Version 1.1.3</b><br/>
- In node status, added the last changed status date/time.<br/>
</p>
<p>
<b>Version 1.1.2</b><br/>
- When you asks for a read on a node having Listen All Group Addresses set to true, due to a low delay between each KNX telegram, some telegrams are discarded. Increased the delay between telegram to avoid that.<br/>
- Added RBE filter for the INPUT from KNX bus as well.<br/>
- Added the option to bind to local ethernet interface, in case you have more than one, for example, ethernet and wifi.<br/>
- Fixed option suppress_ack_ldatareq not retain after restart.<br/>
- In-Line help update to reflect new changes.<br/>
</p>
<p>
<b>Version 1.1.1</b><br/>
- Disambigued misinterpretation of the "disconnect" status.<br/>
- In the autocomplete box of KNX device names, when you type in the group address or the device's name, it shows the main and subgroup name as well<br/>
- Cosmetic adjustment<br/>
- In-Line help additions<br/>
</p>
<p>
<b>Version 1.1.0 LTS (Long term stable)</b><br/>
- Once disabled for loop or circular reference protection, the node can be re-enabled by simply click on deploy "modified nodes"<br/>
- When "Universal mode (listen to all Group Addresses)" is selected, the RBE filter is disabled.<br/>
- Cosmetic adjustment<br/>
</p>
<p>
<b>Version 1.0.19</b><br/>
- Automatic loop protection<br/>
</p>
<p>
<b>Version 1.0.18</b><br/>
- Added gateway options:<br/>
    KNX Physical Address<br/>
    Suppress ACK request<br/>
    This option help compatibility with old Siemens SWG1 148-1AB22 IP Interface <br/>
- Added RBE option to the input (Report by Exception node - only passes on data if the payload has changed)<br/>
</p>
<p>
<b>Version 1.0.16</b><br/>
- Input message format has been CHANGED! please see the wiki!!!.<br/>
- Circular reference protection (when 2 nodes with same group address are link toghether, the protection avoids loops.).<br/>
</p>
<p>
<b>Version 1.0.15</b><br/>
- Device Node outputs the name when ETS csv is not set too.<br/>
</p>
<p>
<b>Version 1.0.14</b><br/>
- Fixed knx dependency<br/>
</p>
<p>
<b>Version 1.0.7</b><br/>
- Check for invalid node's Group Addr.<br/>
</p>
<p>
<b>Version 1.0.5</b><br/>
- Fixed the fix for the typo error causing a mess<br/>
</p>
<p>
<b>Version 1.0.5</b><br/>
- Fixed a typo error causing a mess<br/>
</p>
<p>
<b>Version 1.0.4</b><br/>
- Fixed possible issue with the csv ETS endpoint<br/>
</p>
<p>
<b>Version 1.0.3</b><br/>
- If ETS csv file is set, when typing a group address in the node, a list of KNX devices will be shown and when selected, it set the Datapoint and the Devicename automatically.<br/>
</p>
<p>
<b>Version 1.0.2</b><br/>
- Fixed minor glitches in node config ui<br/>
</p>
<p>
<b>Version 1.0.1 FIRST PUBLIC RELEASE</b><br/>
- Fixed minor glitches<br/>
- Ended extensive testing<br/>
- Enhanced Wiki and Youtube Video about ETS CSV File
</p>
<p>
<b>Version 0.0.6 BETA</b><br/>
- Fixed Output Type unable to be set<br/>
- Added node status for response (blue) and read (grey)<br/>
</p>
<p>
<b>Version 0.0.5 BETA</b><br/>
- Integration of Help documentation<br/>
- Readstatus fix<br/>
</p>
<p>
<b>Version 0.0.3 BETA</b><br/>
- Added Help documentation<br/>
- Added samples on the Readme.md<br/>
- Better user's notifications handling of the ETS csv file checks.<br/>
</p>
<p>
<b>Version 0.0.2 BETA</b><br/>
- Added BETA warnings.<br/>
</p>
<p>
<b>Version 0.0.1 BETA</b><br/>
- Initial release<br/>
</p>
