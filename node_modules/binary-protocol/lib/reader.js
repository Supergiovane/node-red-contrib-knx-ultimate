'use strict';

function ProtocolReader (buffer, offset) {
  this.buffer = buffer;
  this.offset = offset || 0;
  this.ops = [];
  this.stack = [{}];
  this.originalOps = [];
  this.readers = [];
  this.final = [];
}

module.exports = ProtocolReader;

ProtocolReader.AWAIT_NEXT = {AWAIT_NEXT: true};
ProtocolReader.DONE = {DONE: true};

/**
 * Define a data type.
 *
 * @param  {String}         name   The name of the data type.
 * @param  {Object}         config The configuration.
 * @return {Function}              The current constructor.
 */
ProtocolReader.define = function (name, config) {
  this.prototype[name] = function () {
    config.read.apply(this, arguments);
    return this;
  };
  return this;
};

/**
 * Clone the reader object.
 *
 * @return {Function} The cloned reader.
 */
ProtocolReader.clone = function () {
  var self = this;
  function CustomProtocolReader (buffer, offset) {
    if (!(this instanceof CustomProtocolReader)) {
      return new CustomProtocolReader(buffer, offset);
    }
    self.call(this, buffer, offset);
  }

  var keys = Object.keys(this),
      length = keys.length,
      key, i;
  for (i = 0; i < length; i++) {
    key = keys[i];
    CustomProtocolReader[key] = this[key];
  }

  CustomProtocolReader.prototype = Object.create(self.prototype);
  CustomProtocolReader.prototype.constructor = CustomProtocolReader;

  return CustomProtocolReader;
};



/**
 * Demand a certain number of bytes before continuing.
 *
 * @param  {int}            howMany The number of bytes to demand.
 * @return {ProtocolReader}         The current object.
 */
ProtocolReader.prototype.demand = function ProtocolReader$demand (howMany) {
  return this.enqueue('demand', howMany);
};

/**
 * Tap into the current results, to allow conditional logic.
 *
 * @param  {Function}       fn The function to execute, receives the current data as first argument.
 * @return {ProtocolReader}    The current object.
 */
ProtocolReader.prototype.tap = function ProtocolReader$tap (fn) {
  return this.enqueue('tap', fn);
};

/**
 * Enqueue an operation.
 *
 * @param  {String}         name The name of the operation to execute.
 * @param  {mixed}          arg1 The first argument for the operation, optional.
 * @param  {mixed}          arg2 The second argument for the operation, optional.
 * @return {ProtocolReader}      The current object.
 */
ProtocolReader.prototype.enqueue = function ProtocolReader$enqueue (name, arg1, arg2) {
  this.ops.push([name, arg1, arg2]);
  return this;
};

/**
 * Prepend a number of operations to the start of the queue.
 * Accepts a function which may result in many operations, these
 * operations will be executed before the rest of the items in the queue.
 *
 * @param  {Function}       fn   The function containing the operations to prepend.
 * @param  {mixed}          arg1 The argument for the function, if any.
 * @return {ProtocolReader}      The current object.
 */
ProtocolReader.prototype.prepend = function ProtocolReader$prepend (fn, arg1) {
  var ops = this.ops;
  this.ops = [];
  fn.call(this, arg1);
  this.ops = this.ops.concat(ops);
  return this;
};

/**
 * Push an item onto the stack.
 *
 * @param  {mixed}          item The item to push.
 * @return {ProtocolReader}      The current object.
 */
ProtocolReader.prototype.pushStack = function ProtocolReader$pushStack (item) {
  return this.enqueue('pushStack', item || {});
};

/**
 * Pop an item off the stack.
 *
 * @param  {String}         propertyName The name of the property to inject the popped item into, optional.
 * @param  {Function}       fn           The collector function, optional.
 * @return {ProtocolReader}              The current object.
 */
ProtocolReader.prototype.popStack = function ProtocolReader$popStack (propertyName, fn) {
  return this.enqueue('popStack', propertyName, fn);
};

/**
 * Collect data from the current stack.
 *
 * @param  {String}         propertyName The name of the property to inject the collected data into.
 * @param  {Function}       fn           The collector function.
 * @return {ProtocolReader}              The current object.
 */
ProtocolReader.prototype.collect = function ProtocolReader$collect (propertyName, fn) {
  return this.enqueue('collect', propertyName, fn);
};

/**
 * Execute some operations in a loop.
 *
 * > Note: This creates a new `ProtocolReader` object, you should call
 *
 * @param  {String}         propertyName The name of the property to inject the results of the loop into.
 * @param  {Function}       fn           The looper function.
 * @return {ProtocolReader}              The current object.
 */
ProtocolReader.prototype.loop = function ProtocolReader$loop (propertyName, fn) {
  return this.enqueue('loop', propertyName, fn);
};

/**
 * End the current reader.
 *
 * @param  {Function}       fn           The ender function, optional.
 * @return {ProtocolReader}              The current object.
 */
ProtocolReader.prototype.end = function ProtocolReader$end (fn) {
  return this.enqueue('end', fn);
};

ProtocolReader.prototype.finally = function ProtocolReader$finally (fn) {
  this.final.push(fn);
  return this;
};

/**
 * Reset the reader and start reading again from the start.
 *
 * @return {ProtocolReader} The current object.
 */
ProtocolReader.prototype.reset = function ProtocolReader$reset () {
  return this.enqueue('reset');
};


/**
 * Read a number of raw bytes
 *
 * @param  {String} propertyName The property name to read the buffer into, if any.
 * @param  {int}    length       The number of bytes to read.
 * @return {ProtocolReader}      The current object.
 */
ProtocolReader.prototype.raw = function ProtocolReader$raw (propertyName, length) {
  length = length || 1;
  return this
  .demand(length)
  .collect(propertyName, function () {
    var value = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return value;
  });
};

/**
 * Read the next value.
 *
 * @return {mixed} The value read from the stream, or `AWAIT_NEXT` if the reader requires more data.
 */
ProtocolReader.prototype.next = function ProtocolReader$next (chunk) {
  var totalReaders = this.readers.length,
      reader, result;
  if (!this.originalOps.length) {
    this.originalOps = this.ops.slice();
  }

  if (totalReaders) {
    reader = this.readers[totalReaders - 1];
    if (chunk) {
      reader.buffer = Buffer.concat([
        reader.buffer.slice(reader.offset),
        chunk
      ]);
      reader.offset = 0;
    }
    result = reader.next();
  }
  else {
    if (chunk) {
      if (this.buffer) {
        this.buffer = Buffer.concat([this.buffer.slice(this.offset), chunk]);
      }
      else {
        this.buffer = chunk;
      }
      this.offset = 0;
    }
    result = this.process();
  }

  if (result === ProtocolReader.AWAIT_NEXT) {
    return ProtocolReader.AWAIT_NEXT;
  }
  else if (result === ProtocolReader.DONE) {
    if (totalReaders) {
      this.readers.pop();
      return this.next();
    }
    else {
      return this.stack[0];
    }
  }
  else if (result instanceof ProtocolReader) {
    this.readers.push(result);
    return this.next();
  }
  else if (totalReaders) {
    this.readers.pop();
    return this.next();
  }
  else {
    return result;
  }
};

/**
 * Process the operation queue until either the operations or the buffer are exhausted.
 *
 * @return {mixed} The processed result.
 */
ProtocolReader.prototype.process = function ProtocolReader$process () {
  var self = this,
      item, op, arg1, arg2, result, i, reader;

  while ((item = this.ops.shift())) {
    op = item[0];
    arg1 = item[1];
    arg2 = item[2];
    switch (op) {
    case 'pushStack':
      this.stack.push(arg1);
      break;
    case 'popStack':
      if (arg2) {
        result = arg2.call(this, this.stack.pop());
      }
      else {
        result = this.stack.pop();
      }
      if (arg1) {
        this.stack[this.stack.length - 1][arg1] = result;
      }
      break;
    case 'demand':
      if (this.buffer.length < this.offset + (arg1 || 1)) {
        this.ops.unshift(item); // try again on next chunk.
        return ProtocolReader.AWAIT_NEXT;
      }
      break;
    case 'collect':
      if (typeof arg1 === 'function') {
        this.stack[this.stack.length - 1] = arg1.call(this, this.stack[this.stack.length - 1]) ||
                                            this.stack[this.stack.length - 1];
      }
      else if (typeof arg1 === 'undefined' && typeof arg2 === 'function') {
        this.stack[this.stack.length - 1] = arg2.call(this, this.stack[this.stack.length - 1]) ||
                                            this.stack[this.stack.length - 1];
      }
      else {
        this.stack[this.stack.length - 1][arg1] = arg2.call(this, this.stack[this.stack.length - 1]);
      }
      break;
    case 'tap':
      this.prepend(arg1, this.stack[this.stack.length - 1]);
      break;
    case 'loop':
      return this.createLooper(arg1, arg2);
    case 'reset':
      this.readers = [];
      this.stack = [{}];
      this.ops = this.originalOps.slice();
      break;
    case 'end':
      if (arg1) {
        result = arg1.call(this, this.stack[0]);
      }
      else {
        result = this.stack[0];
      }
      if (this.final.length) {
        return this.final.reduce(function (prev, final) {
          var result = final(prev);
          return result !== undefined ? result : prev;
        }, result);
      }
      else {
        return result;
      }
    }
  }
  return ProtocolReader.DONE;
};

/**
 * Create a reader which can read input in a loop until it is ended.
 *
 * @param  {String}   propertyName  The name of the property to read the values into.
 * @param  {Function} fn            The function containing the looped body.
 * @return {ProtocolReader}         The child reader, which will return the final result when ended.
 */
ProtocolReader.prototype.createLooper = function ProtocolReader$createLooper (propertyName, fn) {
  var reader = new this.constructor(this.buffer, this.offset),
      self = this,
      context = this.stack[this.stack.length - 1];

  context[propertyName] = [];

  function reloop () {
    fn.call(reader, context);
    return reader.tap(function (data) {
      context[propertyName].push(data);
      reader.stack = [{}];
      reader.readers = [];
      return reloop();
    });
  }

  return reloop()
  .finally(function () {
    self.buffer = reader.buffer;
    self.offset = reader.offset;
    return context[propertyName];
  });
};

