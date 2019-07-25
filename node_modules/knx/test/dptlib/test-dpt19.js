/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const test = require('tape');
const DPTLib = require('../../src/dptlib');

test('DPT19 datetime conversion', function(t) {

  var tests = ['1995-12-17T03:24:00', '1996-07-17T03:24:00'];

  Object.keys(tests).forEach(function(key) {
    var date = new Date(tests[key]);
    date.setMilliseconds(0);

    var day = (date.getDay() === 0) ? 7 : date.getDay();
    var buffer = new Buffer([
        date.getFullYear() - 1900,    // year with offset 1900
        date.getMonth() + 1,          // month from 1 - 12
        date.getDate(),               // day of month from 1 - 31
        (day << 5) + date.getHours(), // 3 bits: day of week (1-7), 5 bits: hour
        date.getMinutes(),
        date.getSeconds(),
        0,
        0
    ]);

    var name = 'DPT19';
    var dpt = DPTLib.resolve(name);

    // unmarshalling test (raw data to value)
    var converted = DPTLib.fromBuffer(buffer, dpt);
    t.equal(date.getTime(), converted.getTime(),
      `${name} fromBuffer value ${JSON.stringify(buffer)} => ${converted}`
    );

    // marshalling test (value to raw data)
    var apdu = {};
    DPTLib.populateAPDU(date, apdu, name);
    t.ok(Buffer.compare(buffer, apdu.data) === 0,
      `${name} formatAPDU value ${date} => ${JSON.stringify(apdu)}`
    );
  });

  t.end();
});
