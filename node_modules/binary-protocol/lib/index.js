'use strict';

function BinaryProtocol () {
  if (!(this instanceof BinaryProtocol)) {
    return new BinaryProtocol();
  }
  this.Reader = this.constructor.Reader.clone();
  this.Writer = this.constructor.Writer.clone();
  this.Commander = this.constructor.Commander.clone();
  this.ReadStream = this.constructor.ReadStream;
  this.WriteStream = this.constructor.WriteStream;
}

module.exports = BinaryProtocol;

/**
 * Define a data type.
 *
 * @param  {String}         name   The name of the data type.
 * @param  {Object}         config The configuration.
 * @return {BinaryProtocol}        The current object.
 */
BinaryProtocol.prototype.define = function BinaryProtocol$define (name, config) {
  if (name && typeof name === 'object') {
    var keys = Object.keys(name),
        length = keys.length,
        i, key;
    for (i = 0; i < length; i++) {
      key = keys[i];
      this.define(key, name[key]);
    }
    return this;
  }
  if (config.read) {
    this.Reader.define(name, config);
  }
  if (config.write) {
    this.Writer.define(name, config);
    this.Commander.define(name, config);
  }
  return this;
};

BinaryProtocol.prototype.createReader = function (buffer, offset) {
  return new this.Reader(buffer, offset);
};

BinaryProtocol.prototype.createWriter = function (buffer, offset) {
  return new this.Writer(buffer, offset);
};

BinaryProtocol.prototype.createCommander = function (duplex) {
  var commander = new this.Commander({
    protocol: this,
    readStream: this.createReadStream(),
    writeStream: this.createWriteStream()
  });

  if (duplex) {
    commander.writeStream.pipe(duplex).pipe(commander.readStream);
  }

  return commander;
};

BinaryProtocol.prototype.createReadStream = function (options) {
  options = options || {};
  options.Reader = options.Reader || this.Reader;
  return new this.ReadStream(options);
};

BinaryProtocol.prototype.createWriteStream = function (options) {
  options = options || {};
  options.Writer = options.Writer || this.Writer;
  return new this.WriteStream(options);
};

BinaryProtocol.Reader = require('./reader');
BinaryProtocol.Writer = require('./writer');
BinaryProtocol.Commander = require('./commander');

BinaryProtocol.ReadStream = require('./read-stream');
BinaryProtocol.WriteStream = require('./write-stream');



function declarePrimitive (name, length) {
  var readerName = 'read' + name;
  var writerName = 'write' + name;
  var config = {
    read: function (propertyName) {
      return this
      .enqueue('demand', length)
      .collect(propertyName, function () {
        var result = this.buffer[readerName](this.offset);
        this.offset += length;
        return result;
      });
    },
    write: function (value) {
      this.allocate(length);
      this.buffer[writerName](value, this.offset);
      this.offset += length;
      return this;
    }
  };
  BinaryProtocol.Reader.define(name, config);
  BinaryProtocol.Writer.define(name, config);
  BinaryProtocol.Commander.define(name, config);
}

declarePrimitive('Int8', 1);
declarePrimitive('UInt8', 1);
declarePrimitive('Int16LE', 2);
declarePrimitive('UInt16LE', 2);
declarePrimitive('Int16BE', 2);
declarePrimitive('UInt16BE', 2);
declarePrimitive('Int32LE', 4);
declarePrimitive('Int32BE', 4);
declarePrimitive('UInt32LE', 4);
declarePrimitive('UInt32BE', 4);
declarePrimitive('FloatLE', 4);
declarePrimitive('FloatBE', 4);
declarePrimitive('DoubleLE', 8);
declarePrimitive('DoubleBE', 8);

