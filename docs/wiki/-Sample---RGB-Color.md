---
layout: wiki
title: "-Sample---RGB-Color"
lang: en
permalink: /wiki/-Sample---RGB-Color/
---
# Samples

Assuming you send a message from a **function node** , to a knx-ultimate node with Group Address and Datapoint properties set.<br/>

## Overview

To colorize a lamp that support colors, like Philips HUE, you can pass the colors in red, green and blue values.<br/>
Create a function node and paste this code.<br/>

**Set RGB color, Datpoint 232.600**

```javascript

// Each color in a range between 0 and 255
msg.payload={red:255, green:200, blue:30};
return msg;

```
