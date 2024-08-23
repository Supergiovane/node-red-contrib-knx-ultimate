# Samples

Assuming you send a message from a **function node**, to a knx-ultimate node with Group Address and Datapoint properties set.\


## RELATIVE DIMMING

To DIM a lamp or other devices, such as blind for example, you need to pass the direction of the dimming (increase/decrease) and the value of the dimming (the realative %)\
Create a knx-ultimate node with the Group Address to be dimmed, with the Datapooint set to 3.007.\
Please note that you need to uncheck **"Send payload to KNX only if changed (RBE filter)"** in the "OUTPUT (send datagram to the KNX BUS)" section of the knx-ultimate config advanced options. Then add a function node, and paste this code\


**Increase the light/open blind**

```javascript

// The parameter "data" indicates the relative amount of the dimming commmand (how much to dim).
// The parameter "data" can be any integer value from 0 to 7
// The parameter decr_incr:1 increases the light
// The parameter decr_incr:0 decreases the light
msg.payload={decr_incr: 1, data: 5};
return msg;

```

**Decrease the light/close blind**

```javascript

// The parameter "data" indicates the relative amount of the dimming commmand (how much to dim).
// The parameter "data" can be any integer value from 0 to 7
// The parameter decr_incr:1 increases the light
// The parameter decr_incr:0 decreases the light
msg.payload={decr_incr: 0, data: 5};
return msg;

```

## ABSOLUTE DIMMING

To set the absolute brightness value of a lamp or other devices, such as blind for example, you need to the absolute brightness value to the knx-ultimate node\
Create a knx-ultimate node with the Group Address and the Datapooint set to 5.001.\
Then add a function node, and paste this code\


**Set brightness of the light/set the position of the blind**

```javascript

msg.payload=50; // values from 0 to 100
return msg;

```
