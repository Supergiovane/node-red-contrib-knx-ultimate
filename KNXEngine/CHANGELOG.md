![Sample Node](img/logo.png)

[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square)](https://www.paypal.me/techtoday) 

<br/>

# CHANGELOG

<p>
<b>Version 1.0.45</b> - January 2024<br/>
- NEW: added DPT 275.100.<br/>
</p>
<p>
<b>Version 1.0.44</b> - December 2023<br/>
- Fixed DPT 9.001 issue when sending numberso having > 2 decimals.<br/>
</p>
<p>
<b>Version 1.0.43</b> - October 2023<br/>
- Added help description for DPT 3.001 DIMMING stop telegram.<br/>
</p>
<p>
<b>Version 1.0.42</b> - July 2023<br/>
- Quick fix for MDT and Wienzler interfaces.<br/>
</p>
<p>
<b>Version 1.0.41</b> - July 2023<br/>
- Enabled compatibility with KNX Virtual software (BETA).<br/>
</p>
<p>
<b>Version 1.0.39</b> - June 2023<br/>
- Bump dependencies versions.<br/>
- Increased TTL of dgram socket, from 128 to 250.<br/>
- Set max hop count in tunneling/broadcast, from 6 to 7.<br/>
</p>
<p>
<b>Version 1.0.37</b> - June 2023<br/>
- Dependencies versions bump.<br/>
</p>
<p>
<b>Version 1.0.36</b> - June 2023<br/>
- Some internal changes due to integration with NOde-Red node.<br/>
</p>
<p>
<b>Version 1.0.34</b> - March 2023<br/>
- NEW: Added Datapoint 235.001 Tariff.<br/>
</p>
<p>
<b>Version 1.0.33</b> - March 2023<br/>
- NEW: Added Datapoint 29.xxx.<br/>
</p>
<p>
<b>Version 1.0.32</b> - January 2023<br/>
- FIX: Fixed Datapoint 9. There was too many decimals.<br/>
</p>
<p>
<b>Version 1.0.31</b> - January 2023<br/>
- NEW: added Datapoint 28.001: ASCII string (variable length) UTF-8<br/>
</p>
<p>
<b>Version 1.0.30</b> - November 2022<br/>
- NEW: added Datapoints 13.016, 13.1200, 13.1201.<br/>
</p>
<p>
<b>Version 1.0.29</b> - November 2022<br/>
- NEW: added Griesser Datpoint Custom 6001.001.<br/>
</p>
<p>
<b>Version 1.0.28</b> - November 2022<br/>
- NEW: added datapoint 9.009 Airflow.<br/>
</p>
<p>
<b>Version 1.0.27</b> - October 2022<br/>
- FIX: fixed an issue accurring when you put a wrong IP/hostname in the configuration of the gateway. Leaving node running with such wrong configuration, after a month or so, all UDP channels remain occupied until reboot. Thanks to @tarag for reporting that.<br/>
</p>
<p>
<b>Version 1.0.25</b> - September 2022<br/>
- Standardized code.<br/>
</p>
<p>
<b>Version 1.0.24</b> - August 2022<br/>
- Fixed old "new Buffer" syntax, due to future unsupported call.<br/>
</p>
<p>
<b>Version 1.0.23</b> - Juli 2022<br/>
-NEW: Added datapoint 1.024 for Day/Night<br/>
</p>
<p>
<b>Version 1.0.22</b> - June 2022<br/>
- KNX-Secure: completed the Secure_Session_Request and working on Secure_Session_Response.<br/>
</p>
<p>
<b>Version 1.0.21</b> - Mai 2022<br/>
- Fixed an issue in retrieving the local IP, in case of ETH interface not having the "family" property set.<br/>
</p>
<p>
<b>Version 1.0.20</b> - Mai 2022<br/>
- Fixed a compatibility issue introducted in Node 18.<br/>
</p>
<p>
<b>Version 1.0.19</b> - April 2022<br/>
- Protected some functions to avoid issues in case of misuse.<br/>
- The ACK of received telegrams is now called befor the "indication" event is emitted to the client.<br/>
- Fixed some issues in the disconnection mechanism.<br/>
</p>
<p>
<b>Version 1.0.18</b> - April 2022<br/>
- NEW: new event has been added. The ackReceived event is triggered every time a telegram is sent over TunnelUDP or TunnelTCP, after it has been acknowledged or not acknowledged. Please see the full featured sample.js file.<br/>
</p>
<p>
<b>Version 1.0.16</b> - April 2022<br/>
- Changed: the KNX Gateway don't care anymore for ROUTING_LOST_MESSAGE and ROUTING_BUSY. Previously, it was disconnecting. Now it only advises in LOG.<br/>
- Added sample on how to decode incoming datagram's values<br/>
- Updated README and samples.<br/>
</p>
<p>
<b>Version 1.0.15</b> - March 2022<br/>
- Further optimization for the garbage collector.<br/>
</p>
<p>
<b>Version 1.0.14</b> - March 2022<br/>
- Optimized memory allocation to allow the garbage collector to get rid of unref variables.<br/>
</p>
<p>
<b>Version 1.0.13</b> - March 2022<br/>
- Updated samples and fixed disconnection issues is some circumstaces, where the KNX IP Interface doesn't send the DISCONNECT_RESPONSE datagram to confirm the disconnection.<br/>
</p>
<p>
<b>Version 1.0.12</b> - February 2022<br/>
- FIX Datapoint 16.001: fixed an issue with the ISO8859-1 encoding.<br/>
</p>
<p>
<b>Version 1.0.11</b> - February 2022<br/>
- Added the property containing the decoded Keyring file, accessible by all modules referencing the "index.js".<br/>
- Updated the secure sample code.<br/>
</p>
<p>
<b>Version 1.0.10</b> - February 2022<br/>
- Added secure connection sample code.<br/>
</p>
<p>
<b>Version 1.0.9</b> - February 2022<br/>
- Fixed a file not found issue.<br/>
</p>
<p>
<b>Version 1.0.6</b> - February 2022<br/>
- More samples and property specification in the README.<br/>
</p>
<p>
<b>Version 1.0.3</b> - February 2022<br/>
- Added sample in the readme.<br/>
</p>
<p>
<b>Version 1.0.2</b> - February 2022<br/>
- First version.<br/>
</p>
