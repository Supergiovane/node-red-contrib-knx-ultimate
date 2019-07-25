'use strict';
require('should');
var expect = require('expect.js');

var Writer = require('../lib/writer');


describe('writer', function () {
  it('should write some data', function () {
    var writer = new Writer();
    writer
    .UInt32BE(1)
    .UInt32BE(123)
    .UInt32BE(456)
    .UInt32BE(789)
    .tap(function () {
      this.buffer.length.should.equal(16);
    });
  });
});