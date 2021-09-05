/**
* knxultimate-api - a KNX protocol stack in pure Javascript based on knx.js (originally written by Elias Karakoulakis)
* 08/04/2020 Supergiovane
*/

//
// DPT18: 8-bit Scene Control
//

/*
    class DPT18_Frame < DPTFrame
        bit1  :exec_learn, {
            :display_name : "Execute=0, Learn = 1"
        }
        bit1  :pad, {
            :display_name : "Reserved bit"
        }
        bit6  :data, {
            :display_name : "Scene number"
        }
    end
*/

// TODO: implement fromBuffer, formatAPDU
const knxLog = require('./../KnxLog');

exports.formatAPDU = function (value) {
    if (!value) knxLog.get().warn("DPT18: cannot write null value");
    else {
        var apdu_data = new Buffer.alloc(1);
        if (typeof value == 'object' &&
            value.hasOwnProperty("save_recall") &&
            value.hasOwnProperty("scenenumber")) {
            if ((value.scenenumber - 1) > 64 || (value.scenenumber - 1) < 1) {
                knxLog.get().error("DPT18: scenenumber must between 1 and 64");
            } else {
                var sSceneNumberbinary = ((value.scenenumber - 1) >>> 0).toString(2);
                var sVal = value.save_recall + "0" + sSceneNumberbinary.padStart(6, "0");
                //console.log("BANANA SEND HEX " + sVal.toString("hex").toUpperCase())
                apdu_data[0] = parseInt(sVal, 2);// 0b10111111;
            }
        } else {
            knxLog.get().error("DPT18: Must supply a value object of {save_recall, scenenumber}");
        }
        return apdu_data;
    }
}

exports.fromBuffer = function (buf) {
    //console.log("BANANA BUFF RECEIVE HEX " + buf.toString("hex").toUpperCase())
    if (buf.length != 1) {
        knxLog.get().error("DP18: Buffer should be 1 byte long, got", buf.length);
        return null;
    } else {
        var sBit = (parseInt(buf.toString("hex").toUpperCase(), 16).toString(2)).padStart(8, '0'); // Get bit from hex
        //console.log("BANANA BUFF RECEIVE BIT " + sBit)
        return {
            save_recall: Number(sBit.substring(0, 1)),
            scenenumber: parseInt(sBit.substring(2), 2) + 1
        }
    };
}

// DPT18 basetype info
exports.basetype = {
    bitlength: 8,
    valuetype: 'composite',
    desc: "8-bit Scene Activate/Learn + number",
    "help":
`// To save and recall scene, use payload:{"save_recall":0, "scenenumber":2}
// save_recall = 0 recalls the scene
// save_recall = 1 saves the scene
// scenenumber is the number of the scene to be recalled or saved
return {payload:{"save_recall":0, "scenenumber":2}};`,
"helplink": "https://github.com/Supergiovane/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator"
}

// DPT18 subtypes
exports.subtypes = {
    // 18.001 DPT_SceneControl 
    "001": {
        "desc": "DPT_SceneControl", "name": "Scene control"
    }
}



/*
02/April/2020 Supergiovane
USE:
Input must be an object: {save_recall, scenenumber}
save_recall: 0 = recall scene, 1 = save scene
scenenumber: the scene number, example 1
Example: {save_recall=0, scenenumber=2}
*/

