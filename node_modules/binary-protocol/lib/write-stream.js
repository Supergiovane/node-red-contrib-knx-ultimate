'use strict';

var Stream = require('stream'),
    Transform = Stream.Transform,
    util = require('util');

function WriteStream (options) {
  options = options || {};
  Transform.call(this, options);
  this._writableState.objectMode = true;
  this._readableState.objectMode = false;
  if (options.Writer) {
    this.Writer = options.Writer;
  }
}
util.inherits(WriteStream, Transform);

WriteStream.prototype._transform = function WriteStream$transform (op, encoding, done) {
  var writer = this.createWriter();
  writer[op[0]](op[1]);
  this.push(writer.buffer);
  done();
};

WriteStream.prototype.createWriter = function WriteStream$createWriter () {
  return new this.Writer();
};


module.exports = WriteStream;