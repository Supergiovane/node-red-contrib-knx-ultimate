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
  test('KNX wired test - control a DPT9 timer', function(t) {
    let connection = new knx.Connection( {
      //debug: true,
      handlers: {
        connected: () => {
          var timer_control = new knx.Datapoint({ga: options.dpt9_timer_control_ga, dpt: 'DPT9.001', autoread: true}, connection);
          var timer_status  = new knx.Datapoint({ga: options.dpt9_timer_status_ga, dpt: 'DPT9.001', autoread: true}, connection);
          timer_control.on('change', function(oldvalue, newvalue) {
            t.pass(util.format("**** Timer control changed from: %j to: %j", oldvalue, newvalue));
          });
          timer_status.read(function(src, response) {
            t.pass(util.format("**** Timer status response: %j", response));
            t.end();
            process.exit(0);
          });
          timer_control.write(12);
        }
      }
    });
  });

  setTimeout(function () {
    process.exit(1);
  }, 1000);
}
