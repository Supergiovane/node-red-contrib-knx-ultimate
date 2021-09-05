/**
* knxultimate-api
* (C) 2016-2019 Supergiovane
*/

const knxLog = require('./../KnxLog');

function hex2bin(hex) {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

//
// DPT242: 3-byte RGB xyY
//
exports.formatAPDU = function (value) {
    if (!value) {
        knxLog.get().error("DPT242: cannot write null value");
    } else {
        var apdu_data;
        if (typeof value == 'object' &&
            value.hasOwnProperty('isColorValid') && value.hasOwnProperty('isBrightnessValid') &&
            value.hasOwnProperty('x') && value.x >= 0 && value.x <= 65535 &&
            value.hasOwnProperty('y') && value.y >= 0 && value.y <= 65535 &&
            value.hasOwnProperty('brightness') && value.brightness >= 0 && value.brightness <= 100) {
        } else {
            knxLog.get().error("DPT242: Must supply an value {x:0-65535, y:0-65535, brightness:0-100, isColorValid:true/false, isBrightnessValid:true/false}");
        }

        const bufferTotal = Buffer.alloc(6);
        const bufX = Buffer.alloc(2);
        const bufY = Buffer.alloc(2);
        const bufBrightness = Buffer.alloc(2);
        const isColorValid = value.isColorValid ? "1" : "0";
        const isBrightnessValid = value.isBrightnessValid ? "1" : "0";
        bufX.writeUInt16BE(value.x); //buf.writeUInt16LE(number);
        bufY.writeUInt16BE(value.y);
        bufBrightness.writeUInt16BE(value.brightness);
        bufBrightness[0] = parseInt("000000" + isColorValid + isBrightnessValid, 2).toString(16); // these are Colour and Brighness validities
        bufferTotal[0] = bufX[0];
        bufferTotal[1] = bufX[1];
        bufferTotal[2] = bufY[0];
        bufferTotal[3] = bufY[1];
        bufferTotal[4] = bufBrightness[1];
        bufferTotal[5] = bufBrightness[0];

        return bufferTotal;
    }
}

exports.fromBuffer = function (buf) {
    if (buf.length != 6) {
        knxLog.get().error("DPT242: Buffer should be 6 bytes long, got", buf.length);
        return null;
    }
    let bufTotale = buf.toString('hex');
    //console.log("bufTotale STRINGA: " + bufTotale);
    let x = bufTotale.substring(0, 4);
    let y = bufTotale.substring(4, 8);
    let brightness = bufTotale.substring(8, 10);// these are Colour and Brighness validities (2 bit) //00000011
    let CB = bufTotale.substring(10, 12);
    let isColorValid = hex2bin(CB).substring(6, 7) === "1" ? true : false;
    let isBrightnessValid = hex2bin(CB).substring(7, 8) === "1" ? true : false;
    ret = { x: parseInt(x, 16), y: parseInt(y, 16), brightness: parseInt(brightness, 16), isColorValid: isColorValid, isBrightnessValid: isBrightnessValid };
    return ret;
}


exports.basetype = {
    "bitlength": 3 * 16,
    "valuetype": "basic",
    "desc": "RGB xyY",
    "help":
        `// Each color in a range between 0 and 65535, brightness 0 and 100%, isColorValid true and isBrightnessValid true
msg.payload={x:500, y:500, brightness:80, isColorValid:true, isBrightnessValid:true};
return msg;`
}

exports.subtypes = {
    "600": {
        "desc": "RGB xyY", "name": "RGB color xyY",
        "unit": "", "scalar_range": [,],
        "range": [,]
    }
}
