# Binary Protocol

[![Build Status](https://travis-ci.org/codemix/binary-protocol.svg?branch=master)](https://travis-ci.org/codemix/binary-protocol)

Easy, fast, writers and readers for implementing custom binary protocols in node.js.

# Installation

Via [npm](https://npmjs.org/package/binary-protocol):

    npm install --save binary-protocol


# Usage


### Defining a protocol

```js
var BinaryProtocol = require('binary-protocol');

var protocol = new BinaryProtocol();

// define a type called 'Bytes', which is simply
// a series of raw bytes prefixed by length.
protocol.define('Bytes', {
  read: function (propertyName) {
    this
    .pushStack({length: null, value: null}) // allocate a new object to read the data into.
    .Int32BE('length') // read a 32 bit integer into the `length` property.
    .tap(function (data) {
      if (data.length === -1) {
        // if the length is -1, then there are no bytes and the value is null.
        data.value = null;
        return;
      }
      this.raw('value', data.length); // read N bytes into a property called `value`
    })
    .popStack(propertyName, function (data) {
      // pop the interim value off the stack and insert the real value into `propertyName`
      return data.value;
    });
  },
  write: function (value) {
    if (value === null) {
      this.Int32BE(-1); // a length of -1 indicates a null value.
    }
    else {
      // value is a buffer
      this
      .Int32BE(value.length) // write the buffer length
      .raw(value); // write the raw buffer
    }
  }
});

// define a type called `String`, which is encoded as a length
// prefixed series of bytes.
protocol.define('String', {
  read: function (propertyName) {
    this
    .Bytes(propertyName) // read `Bytes` into the property name.
    .collect(function (data) {
      // collect the final data to return
      if (data[propertyName] !== null) {
        data[propertyName] = data[propertyName].toString('utf8');
      }
      return data;
    });
  },
  write: function (value) {
    this.Bytes(new Buffer(value, 'utf8'));
  }
});
```

### Writing data

```js

var writer = protocol.createWriter();

writer
.Int32BE(100) // op code
.String('admin') // user name
.String('password'); // password

var buffer = writer.buffer;

someWritableStream.write(buffer);

```

### Reading data

```js
var reader = protocol.createReader(buffer);

reader
.Int32BE('opCode')
.String('username')
.String('password');

console.log(reader.next()); // {opCode: 100, username: 'admin', password: 'password'}

```

### Request / Response

You can also define aggregate commands which represent a request / response

protocol.define('Login', {
  write: function (data) {
    this
    .Int32BE(100) // op code
    .String(data.username)
    .String(data.password);
  },
  read: function () {
    this
    .Int32BE('status')
    .tap(function (data) {
      if (data.status === 0) {
        return this.String('error');
      }
      else {
        return this
        .String('nickname')
        .Int32BE('totalUnreadMessages');
      }
    });
  }
});

var net = require('net'),
    client = net.createClient('localhost', 3030),
    commander = protocol.createCommander(client);

var details = {
  username: 'admin',
  password: 'password'
};

commander.Login(details).then(function (response) {
  console.log(response);
});

# Running the tests

First, `npm install`, then `npm test`. Code coverage generated with `npm run coverage`.


# License

MIT, see [LICENSE.md](LICENSE.md).

