'use strict';
require('should');
var expect = require('expect.js'),
    Promise = require('bluebird');

var Protocol = require('../lib');


describe('protocol', function () {
  var protocol = new Protocol();

  protocol.define({
    String: {
      read: function (propertyName) {
        this
        .pushStack({length: null, data: null})
        .UInt32BE('length')
        .tap(function (data) {
          if (data.length >= 0) {
            return this.raw('value', data.length);
          }
          else {
            data.value = null;
          }
        })
        .popStack(propertyName, function (data) {
          if (data.value) {
            return data.value.toString('utf8');
          }
          else {
            return data.value;
          }
        });
      },
      write: function (value) {
        if (value === null) {
          return this.UInt32BE(-1);
        }
        else {
          var buffer = new Buffer(value, 'utf8');
          return this
          .UInt32BE(buffer.length)
          .raw(buffer);
        }
      }
    }
  });

  it('should write and read some data', function () {
    var writer = protocol
    .createWriter()
    .UInt32BE(123)
    .UInt32BE(456)
    .String("Hello World");


    var reader = protocol
    .createReader(writer.buffer)
    .UInt32BE('id')
    .UInt32BE('ref')
    .String('greeting');
    reader.next().should.eql({
      id: 123,
      ref: 456,
      greeting: "Hello World"
    });
  });

  it('should create read streams', function (done) {
    var input = protocol
    .createWriter()
    .UInt32BE(123)
    .UInt32BE(456)
    .UInt32BE(789);

    var expected = [123, 456, 789], i = 0;

    var readStream = protocol.createReadStream();
    readStream
    .expect('UInt32BE')
    .expect('UInt32BE')
    .expect('UInt32BE')
    .on('data', function (data) {
      data.should.equal(expected[i++]);
      if (i === 3) {
        done();
      }
    });
    readStream.write(input.buffer);
  });

  it('should create write streams', function () {
    var writeStream = protocol.createWriteStream();
    writeStream.pipe(process.stdout);
    writeStream.write(['UInt32BE', 65]);
    writeStream.write(['UInt32BE', 66]);
    writeStream.write(['UInt32BE', 67]);
    writeStream.end();
  });

  it('should create a duplex stream', function () {
    var commander = protocol.createCommander();
    commander.writeStream.pipe(commander.readStream);
    return Promise.all([
      commander.UInt32BE(65),
      commander.UInt32BE(66),
      commander.UInt32BE(67)
    ])
    .then(function (results) {
      results.should.eql([65, 66, 67]);
    });
  });
});