/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const knx = require('../..');
const test = require('tape');
const util = require('util');
const options = require('./wiredtest-options.js');

Error.stackTraceLimit = Infinity;

/*
           ==========                ==================
 this is a WIRED test and requires a real KNX IP router on the LAN
           ==========                ==================
 to run all tests: $ WIREDTEST=1 npm test
 to run one test : $ WIREDTEST=1 node test/wiredtests/<test>.js
*/
if (process.env.hasOwnProperty('WIREDTEST')) {
  test('KNX wired test - read multiple statuses from a consecutive GA range', function(t) {
    var readback = {};
    function setupDatapoint(groupadress, statusga) {
      var dp = new knx.Datapoint({
        ga: groupadress,
        status_ga: statusga,
        dpt: "DPT1.001",
        autoread: true
      }, connection);
      dp.on('change', (oldvalue, newvalue) => {
        console.log("**** %s current value: %j", groupadress, newvalue);
      });
      return dp;
    }
    function setupDatapoints() {
      var ctrl_ga_arr = options.readstorm_control_ga_start.split('/');
      var stat_ga_arr = options.readstorm_status_ga_start.split('/');
      for (i=0; i< options.readstorm_range; i++) {
        var ctrl_ga = [ctrl_ga_arr[0], ctrl_ga_arr[1], i+parseInt(ctrl_ga_arr[2])].join('/');
        var stat_ga = [stat_ga_arr[0], stat_ga_arr[1], i+parseInt(stat_ga_arr[2])].join('/');
        setupDatapoint(ctrl_ga, stat_ga);
      }
    }
    var connection = knx.Connection({
       loglevel: 'warn',
      //forceTunneling: true,
//      minimumDelay: 100,
      handlers: {
        connected: function() {
          setupDatapoints();
        },
        event: function (evt, src, dest, value) {
          if (evt == 'GroupValue_Response') {
            readback[dest] = [src, value];
            // have we got responses from all the read requests for all datapoints?
            if (Object.keys(readback).length == options.readstorm_range) {
              t.pass(util.format('readstorm: all %d datapoints accounted for', options.readstorm_range));
              t.end();
              process.exit(0);
            }
          }
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
    console.log('Exiting with timeout...');
    process.exit(2);
  }, 1500);
}
