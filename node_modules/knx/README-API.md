## Connect to your KNX IP router

By default *you only need to specify a 'handlers' object* containing your functions to handle KNX events. All the other options have defaults that can be overridden according to your needs.


```js
var connection = new knx.Connection( {
  // ip address and port of the KNX router or interface
  ipAddr: '127.0.0.1', ipPort: 3671,
  // in case you need to specify the multicast interface (say if you have more than one)
  interface: 'eth0',
  // the KNX physical address we'd like to use
  physAddr: '15.15.15',
  // set the log level for messsages printed on the console. This can be 'error', 'warn', 'info' (default), 'debug', or 'trace'.
  loglevel: 'info',
  // do not automatically connect, but use connection.Connect() to establish connection
  manualConnect: true,  
  // use tunneling with multicast (router) - this is NOT supported by all routers! See README-resilience.md
  forceTunneling: true,
  // wait at least 10 millisec between each datagram
  minimumDelay: 10,
  // enable this option to suppress the acknowledge flag with outgoing L_Data.req requests. LoxOne needs this
  suppress_ack_ldatareq: false,
  // define your event handlers here:
  handlers: {
    // wait for connection establishment before sending anything!
    connected: function() {
      console.log('Hurray, I can talk KNX!');
      // WRITE an arbitrary boolean request to a DPT1 group address
      connection.write("1/0/0", 1);
      // you also WRITE to an explicit datapoint type, eg. DPT9.001 is temperature Celcius
      connection.write("2/1/0", 22.5, "DPT9.001");
      // you can also issue a READ request and pass a callback to capture the response
      connection.read("1/0/1", (src, responsevalue) => { ... });
    },
    // get notified for all KNX events:
    event: function(evt, src, dest, value) { console.log(
        "event: %s, src: %j, dest: %j, value: %j",
        evt, src, dest, value
      );
    },
    // get notified on connection errors
    error: function(connstatus) {
      console.log("**** ERROR: %j", connstatus);
    }
  }
});
```

**Important**: connection.write() will only accept *raw APDU payloads* and a DPT.
This practically means that for *reading and writing to anything other than a binary
switch* (eg. for dimmer controls) you'll need to declare one or more *datapoints*.

### Declare datapoints based on their DPT

Datapoints correlate an *endpoint* (identifed by a group address such as '1/2/3')
with a *DPT* (DataPoint Type), so that *serialization* of values to and from KNX
works correctly (eg. temperatures as 16bit floats), and values are being translated
to Javascript objects and back.

```js
// declare a simple binary control datapoint
var binary_control = new knx.Datapoint({ga: '1/0/1', dpt: 'DPT1.001'});
// bind it to the active connection
binary_control.bind(connection);
// write a new value to the bus
binary_control.write(true); // or false!
// send a read request, and fire the callback upon response
binary_control.read( function (response) {
    console.log("KNX response: %j", response);
  };
// or declare a dimmer control
var dimmer_control = new knx.Datapoint({ga: '1/2/33', dpt: 'DPT3.007'});
// declare a binary STATUS datapoint, which will automatically read off its value
var binary_status = new knx.Datapoint({ga: '1/0/1', dpt: 'DPT1.001', autoread: true});
```

Datapoints need to be bound to a connection. This can be done either at their
creation, *or* using their `bind()` call. Its important to highlight that before
you start defining datapoints (and devices as we'll see later), your code
*needs to ensure that the connection has been established*, usually by declaring them in the 'connected' handler:

```js
var connection = knx.Connection({
  handlers: {
    connected: function() {
      console.log('----------');
      console.log('Connected!');
      console.log('----------');
      var dp = new knx.Datapoint({ga: '1/1/1'}, connection);
      // Now send off a couple of requests:
      dp.read((src, value) => {
        console.log("**** RESPONSE %j reports current value: %j", src, value);
      });
      dp.write(1);
    }
  }
});
```

### Declare your devices

You can define a device (basically a set of GA's that are related to a
physical KNX device eg. a binary switch) so that you have higher level of control:

```js
var light = new knx.Devices.BinarySwitch({ga: '1/1/8', status_ga: '1/1/108'}, connection);
console.log("The current light status is %j", light.status.current_value);
light.control.on('change', function(oldvalue, newvalue) {
  console.log("**** LIGHT control changed from: %j to: %j", oldvalue, newvalue);
});
light.status.on('change', function(oldvalue, newvalue) {
  console.log("**** LIGHT status changed from: %j to: %j", oldvalue, newvalue);
});
light.switchOn(); // or switchOff();
```

This effectively creates a pair of datapoints typically associated with a binary
switch, one for controlling it and another for getting a status feedback (eg via
manual operation)

### Write raw buffers

If you encode the values by yourself, you can write raw buffers with `writeRaw(groupaddress: string, buffer: Buffer, bitlength?: Number, callback?: () => void)`.

The third (optional) parameter `bitlength` is necessary for datapoint types
where the bitlength does not equal the buffers bytelength * 8.
This is the case for dpt 1 (bitlength 1), 2 (bitlength 2) and 3 (bitlength 4).
For other dpts the paramter can be omitted.

```js
// Write raw buffer to a groupaddress with dpt 1 (e.g light on = value true = Buffer<01>) with a bitlength of 1
connection.writeRaw('1/0/0', Buffer.from('01', 'hex'), 1)
// Write raw buffer to a groupaddress with dpt 9 (e.g temperature 18.4 °C = Buffer<0730>) without bitlength
connection.writeRaw('1/0/0', Buffer.from('0730', 'hex'))
```
