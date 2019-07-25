/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2017 Elias Karakoulakis
*/
Error.stackTraceLimit = Infinity;
var knx = require('knx');

if (process.argv.length < 2) {
  console.log('usage: %s <0/1> (off/on) to write to a set of binary switches', process.argv[1]);
  process.exit(1);
}

function setupSwitch(groupaddress, statusga) {
  var sw = new knx.Devices.BinarySwitch({ga: groupaddress, status_ga: statusga}, connection);
  sw.on('change', (oldvalue, newvalue, ga) => {
    console.log(" %s: **** %s current value: %j", Date.now(), ga, newvalue);
  });
  return sw;
}

var connection = knx.Connection({
  //debug: true,
  //minimumDelay: 10,
  handlers: {
    connected: function() {
      console.log('===========\nConnected! %s \n===========', Date.now());
      var v = parseInt(process.argv[2]);
      console.log('---- Writing %d ---', v);
      setupSwitch('1/1/0', '1/1/100').write(v);
      setupSwitch('1/1/1', '1/1/101').write(v);
      setupSwitch('1/1/2', '1/1/102').write(v);
      setupSwitch('1/1/3', '1/1/103').write(v);
      setupSwitch('1/1/4', '1/1/104').write(v);
      setupSwitch('1/1/5', '1/1/105').write(v);
      setupSwitch('1/1/6', '1/1/106').write(v);
      setupSwitch('1/1/7', '1/1/107').write(v);
      setupSwitch('1/1/8', '1/1/108').write(v);
    },
    error: function( errmsg ) {
      console.error(errmsg);
    }
  }
});
