# node-red-contrib-knx-ultimate


## DESCRIPTION
Knx-ultimate is a powerfull device node, all-in-one. It acts as input device as well as output device at the same time.<br />
Based on configuration and msg option, you can achieve all what you need.<br />
You can import your ETS csv file, containing all your group addresses and datapoint types and use it instead of manually create one node for each group address.<br />
Node's settings is divided in 3 parts: common settings, input settings (Node used as input device) and output settings (Node used as output device).


<h3>COMMON SETTINGS</h3>
<dl class="message-properties">
<dt>Gateway</dt>
<dd> Selected KNX gateway. </dd>

<dt>Group Address
<span class="property-type">x/y/z</span>
</dt>
<dd> KNX Group address to read/write to. It's not mandatory if you import the ETS csv file and select <i>Listen to all Group Addresses (using ETS file)</i></dd>

<dt>Datapoint</dt>
<dd> KNX datapoint type (DPT). It's not mandatory if you import the ETS csv file and select <i>Listen to all Group Addresses (using ETS file)</i></dd>

<dt>Listen to all Group Addresses (using ETS file)</dt>
<dd> The node will react to all group addresses when used as INPUT, and will notify a message containing a payload correctly decoded using the datapoints specified in the ETS csv file. When used as OUTPUT, it automatically decodes the payload using the right datapoint specified in the ETS csv file.</dd>
</dl>

<h3>OUTPUT (sends datagram to the KNX bus)</h3>
<dl class="message-properties">
<dt>Output Type</dt>
<dd>Write: the node will send the payload to the KNX bus as a 'write' message (standard).<br />
Response: the node will send the payload to the KNX bus as a 'response' message (in case you wish to create your own 'response', in response to a read request).</dd>

<dt>Send a GroupValue read once on connection/reconnect</dt>
<dd>On connection/reconnection, the node will send a 'read' request to the group address specified on the topic or, if <i>Listen to all Group Addresses (using ETS file)</i> is selected, on all group addresses specified on the ETS csv file.</dd>
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




<b>Payload -->> Input Node</b><br />
<code>msg.payload="read"</code>: The world "read" is RESERVED. Issues a read request to the KNX bus.<br />
<code>msg.payload</code>: issues a write or response (based on the options above) to the KNX bus.<br />
You can override some configurations, or you can specify some parameters, like group address destination if, for example, you have selected <i>Listen to all Group Addresses (using ETS file)</i>.<br />
<code>msg.knx.event</code>: "GroupValue_Write" or "GroupValue_Response", overrides the option <b>Output Type</b> above.<br />
<code>msg.knx.destination</code>: for example "0/0/1", overrides the node's topic.<br />
<code>msg.knx.dpt</code>: for example "1.001", overrides the <b>Datapoint</b> option.<br />


<b>Examples:</b><br />
If you have selected a topic and a datapoint in the options above, you can simply write this in a function to dim a light:
<pre>return ({payload: 30});</pre>
Or, if you have selected <i>Listen to all Group Addresses (using ETS file)</i> (in this case, specifying <code>the msg.knx.destination</code> is mandatory), in a function, you can return a message to be send to the node, that sets the dim to 30%:
<pre>return ({
payload: 30,
knx: {
destination: "0/0/10"}
});</pre>



<b>Output Node -->> Payload</b><br />
The node outputs a message with these data (if the node receives a WRITE telegram):
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

The node outputs a message with these data (if the node receives a RESPONSE telegram):
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









The input and output nodes is used in a similar way as the built in mqtt nodes.

![Input and output node](readme/input_output.jpg) 



## Input node
Set Group-address and DPT in node config to subscribe to all messages with 
that destination and  msg.payload will contain the value you want.

Listen to values written to address 1/1/1:

![Input and output node](readme/input_properties.jpg)

You can also suscribe to GroupValue response and GroupValue read events,
this way you can create your own response and send it back to the bus with a knxUltimate-out node.

If you need more than the value, extended information is available in the message outputted:   
```
msg = 
    { "topic": "1/1/1"
    , "payload": 0
    , "knx": 
        { "event": "GroupValue_Write"
        , "dpt":"1.001"
        , "dptDetails": 
            { "name": "DPT_Switch"
            ,"desc": "switch"
            ,"use":"G"
            }
        , "source":"2.2.2"
        , "destination": "1/1/1"
        , "rawValue":[0]
        }
    }                        
```
(Read events will have payload and knx.rawValue of null)

## Output node
Set up group address and select DPT in node configuration.
Send your values using msg.payload
This makes it simple to connect the output node directly to a slider or a switch.
![Input and output node](readme/output_properties.jpg)

Output mode can be set to "Response" if you want to use a input-node to
listen for readRequests and make your own responses to the knx bus.

### Inputs
    
#### payload
Value to transmit


#### knx
The following parameters can be sent to override what is configured for the node:
```
{ "knx": { 
    "event": "GroupValue_Write",
     "dpt":"1.001",
     "destination": "1/1/1"
    }
}
```   
(DPTs can be sent as 9 , "9" , "9.001" or "DPT9.001")

Example: 
    If you only want to override destination you would send only that, eventType and dpt will be taken from node config:
```
{ "knx": { 
     "destination": "1/1/1"
    }
}
```