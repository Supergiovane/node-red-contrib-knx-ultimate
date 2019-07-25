## Datapoint Types

|DPT   	  | Description       | Value type  	| Example  	| Notes |
|---	    |---	                  |---	|---	|---	|
|DPT1   	| 1-bit control  	      | Boolean/Numeric	|  true/"true"/1 false/"false"/0 | |
|DPT2   	| 1-bit control w/prio  | Object  	| {priority: 0, data: 1}  	|   |
|DPT3   	| 4-bit dimming/blinds  | Object  	| {decr_incr: 1, data: 0}  	|   data: 3-bit (0..7)|
|DPT4   	| 8-bit character  	|   String	| "a"  	|   1st char must be ASCII	|
|DPT5   	| 8-bit unsigned int  | Numeric | 127  	|  0..255 	|
|DPT6   	| 8-bit signed int  	| Numeric | -12  	|  -128..127 	|
|DPT7   	| 16-bit unsigned int  | Numeric  |   	|  0..65535 	|
|DPT8   	| 16-bit signed integer | Numeric |   	|  -32768..32767 |
|DPT9   	| 16-bit floating point | Numeric |   	|   	|
|DPT10   	| 24-bit time 	|   Date	|  new Date() |   only the time part is used |
|DPT11   	| 24-bit date 	|   Date	|  new Date() |   only the date part is used |
|DPT12   	| 32-bit unsigned int | Numeric |   	|   	|
|DPT13   	| 32-bit signed int   | Numeric |   	|   	|
|DPT14   	| 32-bit floating point | Numeric |   	|  incomplete: subtypes |
|DPT15   	| 32-bit access control |  |   	|   incomplete|
|DPT16   	| ASCII string 	|  String |   	|   	|
|DPT17   	| Scene number 	|   	|   	|  incomplete|
|DPT18   	| Scene control 	|   	|   	|   incomplete|
|DPT19   	| 8-byte Date and Time 	|  Date | new Date() |   	|
|DPT20-255 | feel free to contribute! 	|   |  |   	|


When you add new DPT's, please ensure that you add the corresponding unit test
under the `test/dptlib` subdirectory. The unit tests come with a small helper
library that provides the boilerplate code to marshal and unlarshal your test cases.

Take for example the unit test for DPT5, which carries a single-byte payload.
Some of its subtypes (eg. 5.001 for percentages and 5.003 for angle degrees)
need to be scaled up or down, whereas other subtypes *must not* be scaled at all:

```js
// DPT5 without subtype: no scaling
commontest.do('DPT5', [
  { apdu_data: [0x00], jsval: 0},
  { apdu_data: [0x40], jsval: 64},
  { apdu_data: [0x41], jsval: 65},
  { apdu_data: [0x80], jsval: 128},
  { apdu_data: [0xff], jsval: 255}
]);
// 5.001 percentage (0=0..ff=100%)
commontest.do('DPT5.001', [
  { apdu_data: [0x00], jsval: 0 },
  { apdu_data: [0x80], jsval: 50},
  { apdu_data: [0xff], jsval: 100}
]);
// 5.003 angle (degrees 0=0, ff=360)
commontest.do('DPT5.003', [
  { apdu_data:  [0x00], jsval: 0 },
  { apdu_data:  [0x80], jsval: 181 },
  { apdu_data:  [0xff], jsval: 360 }
]);
```
