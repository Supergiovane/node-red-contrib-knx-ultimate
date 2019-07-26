# node-red-contrib-knx-ultimate (BETA)

CAUTION, THIS NODE WORKS BUT IT'S STILL IN BETA. EXPECTED STABLE RELEASE IN ABOUT 7 DAYS,

![Sample Node](img/sample.png) 

## DESCRIPTION
Knx-ultimate is a powerfull device node, all-in-one. It acts as input device as well as output device at the same time.<br />
Based on configuration and msg option, you can achieve all what you need.<br />
You can import your ETS csv file, containing all your group addresses and datapoint types and use it instead of manually create one node for each group address.<br />
Node's settings is divided in 3 parts: common settings, input settings (Node used as input device) and output settings (Node used as output device).

## CHANGELOG
* See <a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md">here the changelog</a>


<p>
Knx-ultimate is a powerfull device node, all-in-one. It acts as input device as well as output device at the same time.<br />
You can import your ETS csv file, containing all your group addresses and datapoint types and use it instead of manually create one node for each group address.<br />
Node's settings is divided in 3 parts: common settings, input settings (Node used as input device) and output settings (Node used as output device).
</p>
<p>
<h3>COMMON SETTINGS</h3>
<dl class="message-properties">
<dt>Gateway</dt>
<dd> Selected KNX gateway. </dd>

<dt>Group Address (topic)
<span class="property-type">Example 0/0/1</span>
</dt>
<dd> KNX Group address to read/write to. It's not mandatory if you import the ETS csv file and select <i>Listen to all Group Addresses (using ETS file)</i>. Please note that the Group Address will then transmitted to the flow as <code>msg.topic</code>. It can be overridden by <code>msg.knx.destination</code>.</dd>

<dt>Datapoint</dt>
<dd> KNX datapoint type (DPT). It's not mandatory if you import the ETS csv file and select <i>Listen to all Group Addresses (using ETS file)</i>. It can be overridden by <code>msg.knx.dpt</code>.</dd>

<dt>Listen to all Group Addresses (using ETS file)</dt>
<dd> The node will react to all group addresses when used as INPUT, and will notify a message containing a payload correctly decoded using the datapoints specified in the ETS csv file. When used as OUTPUT, it automatically decodes the payload using the right datapoint specified in the ETS csv file.</dd>
</dl>

<h3>OUTPUT (sends datagram to the KNX bus)</h3>
<dl class="message-properties">
<dt>Output Type</dt>
<dd>Write: the node will send the payload to the KNX bus as a 'write' message (standard).<br />
    Response: the node will send the payload to the KNX bus as a 'response' message (in case you wish to create your own 'response', in response to a read request).</dd>

<dt>Send a GroupValue read once on connection/reconnect</dt>
<dd>On connection/reconnection, the node will send a 'read' request to the group address specified on the <b>Group Address</b> or, if <i>Listen to all Group Addresses (using ETS file)</i> is selected, on all group addresses specified on the ETS csv file.</dd>
</dl>

<h3>INPUT (listen to datagram from the KNX bus)</h3>
<dl class="message-properties">
<dt>React to event GroupValue write</dt>
<dd>When checked, received writeRequests will be notified</dd>

<dt>React to event GroupValue response</dt>
<dd>When checked, received responses will be notified</dd>

<dt>React to event GroupValue read</dt>
<dd> When checked, received read requests will be notified, this can be used to create your own response with a <i>Output Type</i> set to 'Response'.
<strong>Attention:</strong> Messages for received read requests have a <code>msg.payload</code> and
<code>msg.knx.rawValue</code> with value <code>null</code>.
</dd>
</dl>
</p>


<p>
<h3>MSG FORMAT</h3>
The Node Device accepts input and output. Below, an explanation of the message's format to be sent to or trasmitted from the node.<br /><br />
<b>YOU CAN SEND THIS TO THE NODE</b><br />
<code>msg.readstatus=true</code>: Issues a read request to the KNX bus. You'll expect a 'response' from the bus. When you issue a 'read' request, you can only override the group address specified in the <b>Group Address</b>, with <code>msg.knx.destination</code>. If you've selected <i>Listen to all Group Addresses (using ETS file)</i>, the node will issue a 'read' request to ALL group addresses specified in the ETS csv file.<br />
<code>msg.payload</code>: issues a write or response (based on the options <b>Output Type</b> above) to the KNX bus.<br />
<code>msg.knx.event</code>: "GroupValue_Write" or "GroupValue_Response", overrides the option <b>Output Type</b> above.<br />
<code>msg.knx.destination</code>: for example "0/0/1", overrides the node's <b>Group Address</b>.<br />
<code>msg.knx.dpt</code>: for example "1.001", overrides the <b>Datapoint</b> option. (Datapoints can be sent as 9 , "9" , "9.001" or "DPT9.001")<br />
</p>

<p>
<b>THE NODE OUTPUTS THIS TO THE FLOW</b><br />
The node outputs a message with these data (if the node receives a WRITE telegram):
</p>
<pre>
msg = {
"topic": "1/1/1",
"payload": 0,
"knx": {
"event": "GroupValue_Write",
"dpt": "1.001",
"dptDetails": {
"name": "DPT_Switch",
"desc": "switch",
"use": "G"
},
"devicename": "Kitchen Lamp", --only if ETS csv file is used--
"source": "2.2.2",
"destination": "1/1/1",
"rawValue": [0]
}} </pre>
<p>
The node outputs a message with these data (if the node receives a RESPONSE telegram):
</p>
<pre>msg = {
"topic": "1/1/1",
"payload": 0,
"knx": {
"event": "GroupValue_Response",
"dpt":"1.001",
"dptDetails": {
"name": "DPT_Switch",
"desc": "switch",
"use": "G"
},
"devicename": "Kitchen Lamp", --only if ETS csv file is used--
"source": "2.2.2",
"destination": "1/1/1",
"rawValue": [0]
}} </pre>

The node outputs a message with these data (if the node receives a READ telegram):
<pre> msg = {
"topic": "1/1/1",
"payload": null,
"knx": {
"event": "GroupValue_Read",
"dpt":"1.001",
"dptDetails": {
"name": "DPT_Switch",
"desc": "switch",
"use": "G"
},
"source": "2.2.2",
"destination": "1/1/1",
"rawValue": null
}} </pre>

## SIMPLE SAMPLE: COPY/PASTE IN YOUR NODE-RED FLOW

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/simple.png" width="48">

In this example, this is the node config. AS you can see, the Group Address is 0/0/1 and Datapoint 1.001 (1 bit switch)
The message passed to the node is simple <code>{payload=true}</code> and <code>{payload=false}</code>

![Simple Sample](img/simple2.png) 

```js
[{"id":"7840249f.8ce8a4","type":"knxUltimate","z":"71ead01a.630ba","server":"d08a9721.b34f1","topic":"0/0/1","dpt":"1.001","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"listenallga":false,"name":"Kitchen Lamp","x":340,"y":100,"wires":[[]]},{"id":"d08a9721.b34f1","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","csv":"\"Group name\"\t\"Address\"\t\"Central\"\t\"Unfiltered\"\t\"Description\"\t\"DatapointType\"\t\"Security\"\n\"Attuatori luci\"\t\"0/-/-\"\t\"\"\t\"\"\t\"Attuatori luci\"\t\"\"\t\"Auto\"\n\"Luci primo piano\"\t\"0/0/-\"\t\"\"\t\"\"\t\"Luci primo piano\"\t\"\"\t\"Auto\"\n\"Camera da letto luce\"\t\"0/0/1\"\t\"\"\t\"\"\t\"Camera da letto luce\"\t\"DPST-1-8\"\t\"Auto\"\n\"Loggia camera da letto\"\t\"0/0/2\"\t\"\"\t\"\"\t\"Loggia camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera armadi luce\"\t\"0/0/3\"\t\"\"\t\"\"\t\"Camera armadi luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande luce\"\t\"0/0/4\"\t\"\"\t\"\"\t\"Bagno grande luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Loggia bagno grande\"\t\"0/0/5\"\t\"\"\t\"\"\t\"Loggia bagno grande\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande specchio (switch)\"\t\"0/0/6\"\t\"\"\t\"\"\t\"Bagno grande specchio switch\"\t\"DPST-1-1\"\t\"Auto\""}]
```

    


## SOME OVERRIDES + ETS CSV FILE (IN THE CONFIG NODE) SAMPLE: COPY/PASTE IN YOUR NODE-RED FLOW
```js
[{"id":"ae2d436e.44559","type":"function","z":"71ead01a.630ba","name":"Some overrides","func":"return ({\n      payload: msg.payload,\n      knx: {\n        destination: \"0/0/1\"}\n    });","outputs":1,"noerr":0,"x":260,"y":280,"wires":[["9ab841cd.048848"]]},{"id":"7134491f.e66e","type":"inject","z":"71ead01a.630ba","name":"Switch on","topic":"","payload":"true","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":100,"y":260,"wires":[["ae2d436e.44559"]]},{"id":"c49a1a48.5f7338","type":"inject","z":"71ead01a.630ba","name":"Switch off","topic":"","payload":"false","payloadType":"bool","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":100,"y":300,"wires":[["ae2d436e.44559"]]},{"id":"fab1778f.1b44e8","type":"debug","z":"71ead01a.630ba","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":530,"y":280,"wires":[]},{"id":"9ab841cd.048848","type":"knxUltimate","z":"71ead01a.630ba","server":"d08a9721.b34f1","topic":"","dpt":"1.001","initialread":false,"notifyreadrequest":false,"notifyresponse":false,"notifywrite":true,"listenallga":true,"name":"All","x":410,"y":280,"wires":[["fab1778f.1b44e8"]]},{"id":"d08a9721.b34f1","type":"knxUltimate-config","z":"","host":"224.0.23.12","port":"3671","csv":"\"Group name\"\t\"Address\"\t\"Central\"\t\"Unfiltered\"\t\"Description\"\t\"DatapointType\"\t\"Security\"\n\"Attuatori luci\"\t\"0/-/-\"\t\"\"\t\"\"\t\"Attuatori luci\"\t\"\"\t\"Auto\"\n\"Luci primo piano\"\t\"0/0/-\"\t\"\"\t\"\"\t\"Luci primo piano\"\t\"\"\t\"Auto\"\n\"Camera da letto luce\"\t\"0/0/1\"\t\"\"\t\"\"\t\"Camera da letto luce\"\t\"DPST-1-8\"\t\"Auto\"\n\"Loggia camera da letto\"\t\"0/0/2\"\t\"\"\t\"\"\t\"Loggia camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera armadi luce\"\t\"0/0/3\"\t\"\"\t\"\"\t\"Camera armadi luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande luce\"\t\"0/0/4\"\t\"\"\t\"\"\t\"Bagno grande luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Loggia bagno grande\"\t\"0/0/5\"\t\"\"\t\"\"\t\"Loggia bagno grande\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande specchio (switch)\"\t\"0/0/6\"\t\"\"\t\"\"\t\"Bagno grande specchio switch\"\t\"DPST-1-1\"\t\"Auto\""}]
```
