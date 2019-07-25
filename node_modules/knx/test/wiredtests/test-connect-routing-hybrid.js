/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/
Error.stackTraceLimit = Infinity;

const knx = require('../..');
const address = require('../../src/Address.js');
const assert = require('assert');
const test = require('tape');

const options = require('./wiredtest-options.js');

/*
           ==========                ==================
 this is a WIRED test and requires a real KNX IP router on the LAN
           ==========                ==================
 to run all tests: $ WIREDTEST=1 npm test
 to run one test : $ WIREDTEST=1 node test/wiredtests/<test>.js
*/
if (process.env.hasOwnProperty('WIREDTEST')) {
  //
  test('KNX connect routing hybrid', function(t) {
    var connection = knx.Connection({
      loglevel: 'debug',
      forceTunneling: true,
      handlers: {
        connected: function() {
          t.pass('connected in hybrid mode');
          t.end();
          process.exit(0);
        },
        error: function(connstatus) {
          t.fail('error connecting: '+connstatus);
          t.end();
          process.exit(1);
        }
      }
    });
  });

  setTimeout(function() {
    console.log('Exiting with timeout...');
    process.exit(2);
  }, 1000);
}
