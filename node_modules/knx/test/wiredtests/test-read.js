/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const knx = require('../..');
const test = require('tape');
const util = require('util');
const options = require('./wiredtest-options.js');

/*
           ==========                ==================
 this is a WIRED test and requires a real KNX IP router on the LAN
           ==========                ==================
 to run all tests: $ WIREDTEST=1 npm test
 to run one test : $ WIREDTEST=1 node test/wiredtests/<test>.js
*/
if (process.env.hasOwnProperty('WIREDTEST')) {
  test('KNX wired test - read a temperature', function(t) {
    var connection = new knx.Connection({
      debug: true,
      physAddr: options.physAddr,
      handlers: {
        connected: function() {
          //  just define a temperature GA that should respond to a a GroupValue_Read request
          var temperature_in = new knx.Datapoint({
            ga: options.dpt9_temperature_status_ga,
            dpt: 'DPT9.001'
          }, connection);
          temperature_in.read(function(src, response) {
            console.log("KNX response from %s: %j", src, response);
            t.pass(util.format('read temperature:  %s', response));
            t.end();
            process.exit(0);
          });
        },
        error: function(connstatus) {
          console.log("%s **** ERROR: %j",
            new Date().toISOString().replace(/T/, ' ').replace(/Z$/, ''),
            connstatus);
          process.exit(1);
        }
      }
    });
  });

  setTimeout(function() {
    console.log('Exiting ...');
    process.exit(2);
  }, 1500);
}
