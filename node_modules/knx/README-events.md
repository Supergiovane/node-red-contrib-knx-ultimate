## Events

There's a ton of information being emitted by the library, so you can get full disclosure as to what's going on under the hood.

### Connection events

```js
// Generic groupwrite event: device with 'src' physical address wrote to 'dest' group address
connection.on('GroupValue_Write', function (src, dest, value) { ... });
// Generic groupread event: device with physical address 'src', is asking on the KNX
// bus the current value of group address 'dest'
connection.on('GroupValue_Read', function (src, dest) { ... });
// response event: device with physical address 'src', is responding to a
// read request that the current value of group address 'dest' is 'value'
connection.on('GroupValue_Response', function (src, dest, value) { ... });

// Specific group address event: device with 'src' physical address
// .. wrote to group address
connection.on('GroupValue_Write_1/2/3', function (src, value) { ... });
// .. or responded about current value
connection.on('GroupValue_Response_1/2/3', function (src, value) { ... });

// there's also the generic catch-all event which passes the event type
// as its 1st argument, along with all the other info
connection.on('event', function (evt, src, dest, value) { ... });)
// the generic catch-all event can also be used with group addresses
connection.on('event_1/2/3', function (evt, src, dest, value) { ... });)
```

Here's the full list of events emitted by the connection:
```
["GroupValue_Read", "GroupValue_Response", "GroupValue_Write",
"PhysicalAddress_Write",  "PhysicalAddress_Read", "PhysicalAddress_Response",
"ADC_Read", "ADC_Response", "Memory_Read", "Memory_Response", "Memory_Write",
"UserMemory", "DeviceDescriptor_Read", "DeviceDescriptor_Response",
"Restart", "OTHER"]
```

Other connection events:
```js
// an outgoing tunnelling request didn't get any acknowledgement
connection.on('unacknowledged', function (datagram) { ... });)
```

### Datapoint events

```js
// a datapoint has had its value changed
datapoint.on('change', function(oldvalue, newvalue){...});
```
