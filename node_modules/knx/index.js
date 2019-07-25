/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2017 Elias Karakoulakis
*/

const fs = require('fs');
const path = require('path');
const util = require('util');
const log = require('log-driver').logger;

var knx_path = path.join(__dirname, 'package.json');
var pkginfo = JSON.parse(fs.readFileSync(knx_path));

log.info(util.format('Loading %s: %s, version: %s',
  pkginfo.name, pkginfo.description, pkginfo.version));

exports.Connection = require('./src/Connection.js');
exports.Datapoint = require('./src/Datapoint.js');
exports.Devices = require('./src/devices');
exports.Log = require('./src/KnxLog.js');
