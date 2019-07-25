'use strict';
require('should');
var expect = require('expect.js');

var Reader = require('../lib/reader');


describe('reader', function () {
  it('should read some input', function () {
    var input = new Buffer(12);
    input.writeUInt32BE(2, 0);
    input.writeUInt32BE(123, 4);
    input.writeUInt32BE(456, 8);
    var reader = new Reader(input);
    var result = reader
    .raw('num1', 4)
    .raw('num2', 4)
    .raw('num3', 4)
    .tap(function (data) {
      data.num1 = data.num1.readUInt32BE(0);
      data.num2 = data.num2.readUInt32BE(0);
      data.num3 = data.num3.readUInt32BE(0);
    })
    .end(function (data) {
      return data;
    })
    .next();

    result.should.eql({
      num1: 2,
      num2: 123,
      num3: 456
    });
  });

  it('should read some input in a loop', function () {
    var input = new Buffer(12);
    input.writeUInt32BE(2, 0);
    input.writeUInt32BE(123, 4);
    input.writeUInt32BE(456, 8);
    var reader = new Reader(input);
    var result = reader
    .pushStack({i: 0})
    .UInt32BE('length')
    .loop('items', function (data) {
      if (data.i >= data.length) {
        return this.end();
      }
      data.i++;
      return this.UInt32BE();
    })
    .popStack('items', function (data) {
      return data.items;
    })
    .next();

    result.should.eql({
      items: [123, 456]
    });
  });

  it('should read some input in a loop, with chunks', function () {
    var input = new Buffer(12);
    input.writeUInt32BE(3, 0);
    input.writeUInt32BE(123, 4);
    input.writeUInt32BE(456, 8);

    var input2 = new Buffer(8);
    input2.writeUInt32BE(789, 0);
    input2.writeUInt32BE(1, 4);

    var reader = new Reader(input);
    var result = reader
    .pushStack({i: 0})
    .UInt32BE('length')
    .loop('items', function (data) {
      if (data.i >= data.length) {
        return this.end();
      }
      data.i++;
      return this.UInt32BE();
    })
    .popStack('items', function (data) {
      return data.items;
    })
    .UInt32BE('status')
    .next();

    result.should.equal(Reader.AWAIT_NEXT);

    result = reader.next(input2);
    result.should.eql({
      items: [123, 456, 789],
      status: 1
    });
  });
});