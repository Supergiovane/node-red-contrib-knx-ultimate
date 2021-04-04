/**
* knx.js - a KNX protocol stack in pure Javascript
* (C) 2016-2018 Elias Karakoulakis
*/

const util = require('util')
const DPTLib = require('./dptlib')
const KnxLog = require('./KnxLog')
const EventEmitter = require('events').EventEmitter

/*
 * A Datapoint is always bound to:
 * - a group address (eg. '1/2/3')
 * - (optionally) a datapoint type (defaults to DPT1.001)
 * You can also supply a valid connection to skip calling bind()
 */
function Datapoint (options, conn) {
  EventEmitter.call(this)

  if (options == null || options.ga == null) {
    throw Error('must supply at least { ga, dpt }!')
  }

  this.options = options
  this.dptid = options.dpt || 'DPT1.001'
  this.dpt = DPTLib.resolve(this.dptid)

  KnxLog.get().trace('resolved %s to %j', this.dptid, this.dpt)

  this.current_value = null

  if (conn) this.bind(conn)
}

util.inherits(Datapoint, EventEmitter)

/*
 * Bind the datapoint to a bus connection
 */
Datapoint.prototype.bind = function (conn) {
  let self = this

  if (!conn) throw Error('must supply a valid KNX connection to bind to')

  this.conn = conn

  // bind generic event handler for our group address
  let gaevent = util.format('event_%s', self.options.ga)

  conn.on(gaevent, function (evt, src, buf) {
    let jsvalue = buf
    // get the Javascript value from the raw buffer, if the DPT defines fromBuffer()
    switch (evt) {
      case 'GroupValue_Write':
      case 'GroupValue_Response':
        if (buf) {
          jsvalue = DPTLib.fromBuffer(buf, self.dpt)
          self.emit('event', evt, jsvalue)
          self.update(jsvalue) // update internal state
        }
        break
      default:
        self.emit('event', evt)
        // TODO: add default handler; maybe emit warning?
    }
  })

  if (this.options.autoread) {
    // issue a GroupValue_Read request to try to get the initial state from the bus (if any)
    if (conn.conntime) {
      // immediately or...
      this.read()
    } else {
      // ... when the connection is established
      conn.on('connected', function () {
        self.read()
      })
    }
  }
}

Datapoint.prototype.update = function (jsvalue) {
  if (this.current_value !== jsvalue) {
    let oldValue = this.current_value

    this.emit('change', this.current_value, jsvalue, this.options.ga)

    this.current_value = jsvalue
    let ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

    KnxLog.get().trace('%s **** %s DATAPOINT CHANGE (was: %j)', ts, this.toString(), oldValue)
  }
}

/* format a Javascript value into the APDU format dictated by the DPT
   and submit a GroupValue_Write to the connection */
Datapoint.prototype.write = function (value) {
  let self = this

  if (!this.conn) throw Error('must supply a valid KNX connection to bind to')

  if (this.dpt.hasOwnProperty('range')) {
    // check if value is in range
    let range = this.dpt.basetype.range
    if (value < range[0] || value > range[1]) {
      throw util.format('Value %j(%s) out of bounds(%j) for %s',
        value, (typeof value), range, this.dptid)
    }
  }

  this.conn.write(this.options.ga, value, this.dptid, function () {
    // once we've written to the bus, update internal state
    self.update(value)
  })
}

/*
 * Issue a GroupValue_Read request to the bus for this datapoint
 * use the optional callback() to get notified upon response
 */
Datapoint.prototype.read = function (callback) {
  let self = this

  if (!this.conn) throw Error('must supply a valid KNX connection to bind to')

  this.conn.read(this.options.ga, function (src, buf) {
    let jsvalue = DPTLib.fromBuffer(buf, self.dpt)

    if (typeof callback === 'function') {
      callback(src, jsvalue)
    }
  })
}

Datapoint.prototype.toString = function () {
  return util.format('(%s) %s %s',
    this.options.ga,
    this.current_value,
    this.dpt.subtype && this.dpt.subtype.unit ? this.dpt.subtype : ''
  )
}

module.exports = Datapoint
