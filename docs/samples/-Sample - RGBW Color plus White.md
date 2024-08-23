# Samples

Assuming you send a message from a **function node**, to a knx-ultimate node with Group Address and Datapoint properties set.<br/>

## Overview
To colorize a lamp with colors with full RGBW support, you can pass the colors in red, green, blue and white values, including validity bits for each.<br/>
Create a function node and paste this code.<br/>

**Set RGBW, Datapoint 251.600**

```javascript

// Each color + white in a range between 0 and 255, the latest 4 bits in range 0 to 1
// red:0-255, green:0-255, blue:0-255, white:0-255, mR:0-1, mG:0-1, mB:0-1, mW:0-1
msg.payload={red:90, green:200, blue:30, white:120, mR:1, mG:1, mB:1, mW:1};
return msg;

```
