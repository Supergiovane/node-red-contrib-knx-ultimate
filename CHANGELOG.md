# node-red-contrib-knx-ultimate

![Sample Node](img/logo.png) 

[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square)](https://www.paypal.me/techtoday) 

<a href="http://eepurl.com/gJm095" target="_blank">Subscribe to my channel.</a> Only news about my nodes, no spam, no ads. I'm a github developer, not a merchant.

<p>
<b>Version 1.1.13</b><br/>
- Code cleanup thanks @SystemKeeper<br/>
- If you send a null payload, the node will display a status warning. Thanks @metaneutrons<br/>
</p>
<p>
<b>Version 1.1.12</b><br/>
- Universal mode optimizations<br/>
- Fix abnormal log if universal mode receiver cannot find a suitable datapoint<br/>
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
- Fixed an issue where if you have a node set to Universal mode (listen to all Group Addresses) (with ETS CSV File set) and you create a new node having a Group Address (topic) not in the ETS CSV file, an exception is raised but not caught and the nodes may not receive the values from KNX BUS.<br/>
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
- Check for invalid node's group address (topic)<br/>
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