# node-red-contrib-knx-ultimate

![Sample Node](img/logo.png) 

[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square)](https://www.paypal.me/techtoday) 

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
- When "listen to all group addresses" is selected, the RBE filter is disabled.<br/>
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