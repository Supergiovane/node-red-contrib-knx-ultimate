/**
* knxultimate-api
* (C) 2016-2019 Supergiovane
*/

const knxLog = require('./../KnxLog');

function hex2bin(hex) {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
}

//
// DPT249: 3-byte RGB xyY
// The info about validity of Colour and Brighness are omitted.
//
exports.formatAPDU = function (value) {
    if (!value) {
        knxLog.get().error("DPT249: cannot write null value");
    } else {
        var apdu_data;
        if (typeof value == 'object' &&
            value.hasOwnProperty('isTimePeriodValid') && value.hasOwnProperty('isAbsoluteColourTemperatureValid') && value.hasOwnProperty('isAbsoluteBrightnessValid') &&
            value.hasOwnProperty('transitionTime') &&
            value.hasOwnProperty('colourTemperature') && value.colourTemperature >= 0 && value.colourTemperature <= 65535 &&
            value.hasOwnProperty('absoluteBrightness') && value.absoluteBrightness >= 0 && value.absoluteBrightness <= 100) {
        } else {
            knxLog.get().error("DPT249: Must supply an value, for example {transitionTime:100, colourTemperature:1000, absoluteBrightness:80, isTimePeriodValid:true, isAbsoluteColourTemperatureValid:true, isAbsoluteBrightnessValid:true}");
        }

        const bufferTotal = Buffer.alloc(6);
        const transitionTime = Buffer.alloc(2);
        const colourTemperature = Buffer.alloc(2);
        const absoluteBrightness = Buffer.alloc(2);
        const isTimePeriodValid = value.isTimePeriodValid ? "1" : "0";
        const isAbsoluteColourTemperatureValid = value.isAbsoluteColourTemperatureValid ? "1" : "0";
        const isAbsoluteBrightnessValid = value.isAbsoluteBrightnessValid ? "1" : "0";
        transitionTime.writeUInt16BE(value.transitionTime); //buf.writeUInt16LE(number);
        colourTemperature.writeUInt16BE(value.colourTemperature);
        absoluteBrightness.writeUInt16BE(value.absoluteBrightness);
        absoluteBrightness[0] = parseInt("00000" + isTimePeriodValid + isAbsoluteColourTemperatureValid + isAbsoluteBrightnessValid, 2).toString(16); // these are Colour and Brighness validities
        bufferTotal[0] = transitionTime[0];
        bufferTotal[1] = transitionTime[1];
        bufferTotal[2] = colourTemperature[0];
        bufferTotal[3] = colourTemperature[1];
        bufferTotal[4] = absoluteBrightness[0];
        bufferTotal[5] = absoluteBrightness[1];
        return bufferTotal;
    }
}

exports.fromBuffer = function (buf) {

    let bufTotale = buf.toString('hex');
    let transitionTime = bufTotale.substring(0, 4);
    let colourTemperature = bufTotale.substring(4, 8);
    let CB = bufTotale.substring(8, 10);// This is 1 Byte of validities (3 bit) //00000111
    let absoluteBrightness = bufTotale.substring(10, 12);
    let isTimePeriodValid = hex2bin(CB).substring(5, 6) === "1" ? true : false;
    let isAbsoluteColourTemperatureValid = hex2bin(CB).substring(6, 7) === "1" ? true : false;
    let isAbsoluteBrightnessValid = hex2bin(CB).substring(7, 8) === "1" ? true : false;
    ret = { transitionTime: parseInt(transitionTime, 16), colourTemperature: parseInt(colourTemperature, 16), absoluteBrightness: parseInt(absoluteBrightness, 16), isTimePeriodValid: isTimePeriodValid, isAbsoluteColourTemperatureValid: isAbsoluteColourTemperatureValid, isAbsoluteBrightnessValid: isAbsoluteBrightnessValid };
    return ret;
}


exports.basetype = {
    "bitlength": (2 * 16) + (2 * 8),
    "valuetype": "basic",
    "desc": "PDT_GENERIC_06",
    "help":
        `// Brightness Colour Temperature Transition.
// Properties: transitionTime is in milliseconds, colourTemperature is Kelvin (0-65535 with resolution of 1K)
// absoluteBrightness in % (0-100), isTimePeriodValid (true/false), isAbsoluteColourTemperatureValid (true/false), isAbsoluteBrightnessValid (true/false)
msg.payload={transitionTime:100, colourTemperature:1000, absoluteBrightness:80, isTimePeriodValid:true, isAbsoluteColourTemperatureValid:true, isAbsoluteBrightnessValid:true};
return msg;`
}

exports.subtypes = {
    "600": {
        "desc": "DPT_Brightness_Colour_Temperature_Transition", "name": "Brightness Colour Temperature Transition",
        "unit": "", "scalar_range": [,],
        "range": [,]
    }
}
