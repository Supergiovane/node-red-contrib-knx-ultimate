'use strict';

var Promise = require('bluebird');

function Commander (options) {
  if (!(this instanceof Commander)) {
    return new Commander(options);
  }
  this.protocol = options.protocol || this.constructor.protocol;
  this.readStream = options.readStream || this.createReadStream();
  this.writeStream = options.writeStream || this.createWriteStream();
}

module.exports = Commander;

Commander.protocol = null;

/**
 * Define a data type.
 *
 * @param  {String}         name   The name of the data type.
 * @param  {Object}         config The configuration.
 * @return {Function}              The current constructor.
 */
Commander.define = function Commander$define (name, config) {
  this.prototype[name] = function (value, cb) {
    var deferred = Promise.defer();
    this.readStream.expect([name, undefined, value], deferred);
    if (config.write) {
      this.writeStream.write([name, value]);
    }
    return deferred.promise.nodeify(cb);
  };
  return this;
};

/**
 * Clone the commander object.
 *
 * @return {Function} The cloned commander.
 */
Commander.clone = function Commander$clone () {
  var self = this;
  function CustomCommander (options) {
    if (!(this instanceof CustomCommander)) {
      return new CustomCommander(options);
    }
    self.call(this, options);
  }
  CustomCommander.prototype = Object.create(self.prototype);
  CustomCommander.prototype.constructor = CustomCommander;
  var keys = Object.keys(this),
      length = keys.length,
      key, i;
  for (i = 0; i < length; i++) {
    key = keys[i];
    CustomCommander[key] = this[key];
  }
  return CustomCommander;
};


Commander.prototype.createReadStream = function (options) {
  return new this.protocol.ReadStream(options);
};

Commander.prototype.createWriteStream = function (options) {
  return new this.protocol.WriteStream(options);
};