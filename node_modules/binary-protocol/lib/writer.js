'use strict';

function ProtocolWriter (buffer, offset) {
  this.buffer = buffer || null;
  this.offset = offset || 0;
}

module.exports = ProtocolWriter;


/**
 * Define a data type.
 *
 * @param  {String}         name   The name of the data type.
 * @param  {Object}         config The configuration.
 * @return {Function}              The current constructor.
 */
ProtocolWriter.define = function (name, config) {
  this.prototype[name] = function () {
    config.write.apply(this, arguments);
    return this;
  };
  return this;
};

/**
 * Clone the writer object.
 *
 * @return {Function} The cloned writer.
 */
ProtocolWriter.clone = function () {
  var self = this;
  function CustomProtocolWriter (buffer, offset) {
    if (!(this instanceof CustomProtocolWriter)) {
      return new CustomProtocolWriter(buffer, offset);
    }
    self.call(this, buffer, offset);
  }
  CustomProtocolWriter.prototype = Object.create(self.prototype);
  CustomProtocolWriter.prototype.constructor = CustomProtocolWriter;
  var keys = Object.keys(this),
      length = keys.length,
      key, i;
  for (i = 0; i < length; i++) {
    key = keys[i];
    CustomProtocolWriter[key] = this[key];
  }
  return CustomProtocolWriter;
};

/**
 * Allocate a number of bytes.
 *
 * @param  {int}            howMany The number of bytes to allocate.
 * @return {ProtocolWriter}         The current object.
 */
ProtocolWriter.prototype.allocate = function ProtocolWriter$allocate (howMany) {
  if (!this.buffer) {
    this.buffer = new Buffer(howMany);
  }
  else if (((this.buffer.length  - 1) - this.offset) < howMany) {
    this.buffer = Buffer.concat([this.buffer, new Buffer(howMany)]);
  }
  return this;
};

/**
 * Write a raw buffer.
 *
 * @param  {Buffer}         buffer The buffer to write.
 * @return {ProtocolWriter}        The current object.
 */
ProtocolWriter.prototype.raw = function ProtocolWriter$raw (buffer) {
  this.buffer = Buffer.concat([this.buffer.slice(0, this.offset), buffer]);
  this.offset = this.buffer.length;
  return this;
};

/**
 * Advance the offset by a number of bytes.
 *
 * @param  {int}            howMany The number of bytes to advance by.
 * @return {ProtocolWriter}         The current object.
 */
ProtocolWriter.prototype.forward = function ProtocolWriter$forward (howMany) {
  this.offset += howMany;
  return this;
};

/**
 * Tap into the current chain.
 *
 * @param  {Function}        fn The tapper function.
 * @return {ProtocolWriter}     The current object.
 */
ProtocolWriter.prototype.tap = function ProtocolWriter$tap (fn) {
  fn.call(this);
  return this;
};
