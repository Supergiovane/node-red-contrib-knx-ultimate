'use strict';

var Stream = require('stream'),
    Transform = Stream.Transform,
    util = require('util');

function ReadStream (options) {
  options = options || {};
  Transform.call(this, options);
  this._writableState.objectMode = false;
  this._readableState.objectMode = true;
  this.queue = [];
  this.buffer = null;
  if (options.Reader) {
    this.Reader = options.Reader;
  }
}

util.inherits(ReadStream, Transform);

module.exports = ReadStream;


ReadStream.prototype._transform = function (chunk, encoding, done) {
  var reader = this.queue[0];
  if (!reader) {
    if (this.buffer) {
      this.buffer = Buffer.concat([this.buffer, chunk]);
    }
    else {
      this.buffer = chunk;
    }
    return done();
  }
  if (this.buffer) {
    chunk = Buffer.concat([this.buffer, chunk]);
    this.buffer = null;
  }
  this.processBuffer(chunk);
  done();
};

ReadStream.prototype.processBuffer = function (chunk) {
  var reader = this.queue[0],
      result;
  while (reader && (result = reader[0].next(chunk))) {
    if (result === this.Reader.AWAIT_NEXT) {
      return;
    }
    else if (result !== this.Reader.DONE && result !== null) {
      this.push(result);
    }
    if (typeof reader[1] === 'function') {
      reader[1](null, result);
    }
    else if (reader[1] && typeof reader[1].resolve === 'function') {
      reader[1].resolve(result);
    }
    this.queue.shift();
    chunk = reader[0].buffer.slice(reader[0].offset);
    reader = this.queue[0];
  }
};

ReadStream.prototype.expect = function (op, cb) {
  var reader = this.createReader();
  if (typeof op === 'function') {
    op.call(reader);
  }
  else if (Array.isArray(op)) {
    reader[op[0]](op[1], op[2]);
  }
  else {
    reader[op]();
  }
  this.queue.push([reader, cb]);
  if (this.buffer) {
    this.processBuffer(this.buffer);
    this.buffer = null;
  }
  return this;
};

ReadStream.prototype.createReader = function () {
  return new this.Reader();
};