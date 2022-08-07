/**
* KNXEngine - a KNX protocol stack in Javascript
* (C) 2020-2022 Supergiovane
*/

const knxLog = require('./../KnxLog');

//
// DPT22: 2-byte RHCC status
//

function reverseString(str) {
    var newString = "";
    for (var i = str.length - 1; i >= 0; i--) {
        newString += str[i];
    }
    return newString;
}

exports.formatAPDU = function (value) {
    // Send to BUS
    var apdu_data = Buffer.alloc(2);
    if (!value) {
        knxLog.get().error("DPT232: cannot write null value");
    } else {
        if (typeof value == 'object') {
            if (!value.hasOwnProperty('Fault')) value.Fault = 0;
            if (!value.hasOwnProperty('StatusEcoH')) value.StatusEcoH = 0;
            if (!value.hasOwnProperty('TempFlowLimit')) value.TempFlowLimit = 0;
            if (!value.hasOwnProperty('TempReturnLimit')) value.TempReturnLimit = 0;
            if (!value.hasOwnProperty('StatusMorningBoostH')) value.StatusMorningBoostH = 0;
            if (!value.hasOwnProperty('StatusStartOptim')) value.StatusStartOptim = 0;
            if (!value.hasOwnProperty('StatusStopOptim')) value.StatusStopOptim = 0;
            if (!value.hasOwnProperty('HeatingDisabled')) value.HeatingDisabled = 0;
            if (!value.hasOwnProperty('HeatCoolMode')) value.HeatCoolMode = 0;
            if (!value.hasOwnProperty('StatusEcoC')) value.StatusEcoC = 0;
            if (!value.hasOwnProperty('StatusPreCool')) value.StatusPreCool = 0;
            if (!value.hasOwnProperty('CoolingDisabled')) value.CoolingDisabled = 0;
            if (!value.hasOwnProperty('DewPointStatus')) value.DewPointStatus = 0;
            if (!value.hasOwnProperty('FrostAlarm')) value.FrostAlarm = 0;
            if (!value.hasOwnProperty('OverheatAlarm')) value.OverheatAlarm = 0;
            if (!value.hasOwnProperty('reserved')) value.reserved = 1;

        } else {
            knxLog.get().error("DPT22: Must supply a correct payload. See wiki.");
        }
        var firstHex = "";
        var secondHex = "";
        firstHex = firstHex.concat(
            +value.Fault.toString(),
            +value.StatusEcoH.toString(),
            +value.TempFlowLimit.toString(),
            +value.TempReturnLimit.toString(),
            +value.StatusMorningBoostH.toString(),
            +value.StatusStartOptim.toString(),
            +value.StatusStopOptim.toString(),
            +value.HeatingDisabled.toString()
        );
        secondHex = secondHex.concat(
            +value.HeatCoolMode.toString(),
            +value.StatusEcoC.toString(),
            +value.StatusPreCool.toString(),
            +value.CoolingDisabled.toString(),
            +value.DewPointStatus.toString(),
            +value.FrostAlarm.toString(),
            +value.OverheatAlarm.toString(),
            +value.reserved.toString()
        );
        apdu_data[0] = parseInt(reverseString(secondHex), 2);
        apdu_data[1] = parseInt(reverseString(firstHex), 2);
        return apdu_data;
    }
}

exports.fromBuffer = function (buf) {
    // RX from BUS
    if (buf.length != 2) {
        knxLog.get().warn("DPT22: Buffer should be 2 bytes long, got", buf.length);
        return null;
    }
    var byte1 = reverseString(buf[1].toString(2).padStart(8, '0')).split("");
    var byte2 = reverseString(buf[0].toString(2).padStart(8, '0')).split("");
    //console.log("BANANA " + byte1 + " " + byte2 + " ____ " + byte1[0]);
    var value = {};
    value.Fault = byte1[0] === "1" ? true : false;
    value.StatusEcoH = byte1[1] === "1" ? true : false;
    value.TempFlowLimit = byte1[2] === "1" ? true : false;
    value.TempReturnLimit = byte1[3] === "1" ? true : false;
    value.StatusMorningBoostH = byte1[4] === "1" ? true : false;
    value.StatusStartOptim = byte1[5] === "1" ? true : false;
    value.StatusStopOptim = byte1[6] === "1" ? true : false;
    value.HeatingDisabled = byte1[7] === "1" ? true : false;
    
    value.HeatCoolMode = byte2[0] === "1" ? true : false;
    value.StatusEcoC = byte2[1] === "1" ? true : false;
    value.StatusPreCool = byte2[2] === "1" ? true : false;
    value.CoolingDisabled = byte2[3] === "1" ? true : false;
    value.DewPointStatus = byte2[4] === "1" ? true : false;
    value.FrostAlarm = byte2[5] === "1" ? true : false;
    value.OverheatAlarm = byte2[6] === "1" ? true : false;
    value.reserved = byte2[7] === "1" ? true : false;
    return value;
}


exports.basetype = {
    "bitlength": 16,
    "range": [,],
    "valuetype": "basic",
    "desc": "2-byte",
    "help":
`// You can set all parameters you want.
// Every parameter is optional.
// Please respect the upper and lowercase letters.
// For help about meaning of each parameter, please see the sample in the Wiki
var s1={}; 
s1.Fault = true;
s1.StatusEcoH = false;
s1.TempFlowLimit = false;
s1.TempReturnLimit = false;
s1.StatusMorningBoostH = false;
s1.StatusStartOptim = false;
s1.StatusStopOptim = false;
s1.HeatingDisabled = true;
s1.HeatCoolMode = true;
s1.StatusEcoC = false;
s1.StatusPreCool = false;
s1.CoolingDisabled = true;
s1.DewPointStatus = false;
s1.FrostAlarm = false;
s1.OverheatAlarm = true;
return {payload:s1};`,
    "helplink": ""
}

exports.subtypes = {
    // 22.101 DPT_StatusRHCC
    "101": {
        "name": "RHCC Status",
        "desc": "RHCC Status",
        "unit": "",
        "scalar_range": [,],
        "range": [,]
    }
}
