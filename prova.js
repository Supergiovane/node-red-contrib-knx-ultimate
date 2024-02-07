const hueColorConverter = require("./nodes/utils/colorManipulators/hueColorConverter");

// 0 - INPUT Da HSV ricevuto da KNX (tutto in formato 0-100% perchè dpt 5.001), a XY di Hue
// PERFETTO!!!!!! 31/01/2023
const hsvInput = { h: 98.3287, s: 100, v: 71 }; // --->>> input da KNX 98 equivale all'angolo 353 dell' ISE comando: 182,0,20 HSV: 353°, 100%, 71%
const brightnessOriginale = hsvInput.v;
const oGamut = {
    "red": {
        "x": 0.675,
        "y": 0.322
    },
    "green": {
        "x": 0.409,
        "y": 0.518
    },
    "blue": {
        "x": 0.167,
        "y": 0.04
    }
}

console.log("gamut da JSON lampadina hue = " + JSON.stringify(oGamut));
console.log("INPUT hsv da KNX = " + JSON.stringify(hsvInput));

// // l'h mi arriva dal bus KNX sottoforma di percentuale 0-100%
// hsvInput.h = 353 // 353° per fare una prova
// hsvInput.h = hueColorConverter.ColorConverter.scale(hsvInput.h, [0, 359], [0, 100]);

// Scale
hsvInput.h = hueColorConverter.ColorConverter.scale(hsvInput.h, [0, 100], [0, 1]);
hsvInput.s = hueColorConverter.ColorConverter.scale(hsvInput.s, [0, 100], [0, 1]);
hsvInput.v = hueColorConverter.ColorConverter.scale(hsvInput.v, [0, 100], [0, 1]);
console.log("hsv scalata = " + JSON.stringify(hsvInput));

// Produco l'RGB
const hsvToRgb = hueColorConverter.ColorConverter.hsvToRgb(hsvInput.h, hsvInput.s, hsvInput.v);
console.log("hsvToRgb = " + JSON.stringify(hsvToRgb));

// Trasformo in XY
const calculateXYFromRGB = hueColorConverter.ColorConverter.calculateXYFromRGB(hsvToRgb.r, hsvToRgb.g, hsvToRgb.b, oGamut);
console.log("calculateXYFromRGB = " + JSON.stringify(calculateXYFromRGB));

// INVIO ALLA LUCE !!!
const sendToLamp = { "color": { "xy": { "x": calculateXYFromRGB.x, "y": calculateXYFromRGB.y } }, "dimming": { "brightness": brightnessOriginale } };
console.log("OUTPUT alla lampada = " + JSON.stringify(sendToLamp));












console.log("\n");
console.log("\n");
console.log("DA HUE A KNX");



// 1 INPUT da lampada Philips HUE in {"color":{"xy":{"x":0--,"y":--}},"dimming":{"brightness":--}} , in V Dimming (0-100%)
const JsonLampada = { "color": { "xy": { "x": 0.6749, "y": 0.322 } }, "dimming": { "brightness": 71.15 } } //sendToLamp;
console.log("INPUT XY da Lampada Hue = " + JSON.stringify(JsonLampada));

const xyBriToRgb = hueColorConverter.ColorConverter.xyBriToRgb(JsonLampada.color.xy.x, JsonLampada.color.xy.y, hueColorConverter.ColorConverter.scale(JsonLampada.dimming.brightness, [0, 100], [0, 1]));
console.log("xyBriToRgb = " + JSON.stringify(xyBriToRgb));
const rgbToHsv = hueColorConverter.ColorConverter.rgbToHsv(xyBriToRgb.r, xyBriToRgb.g, xyBriToRgb.b);
console.log("rgbToHsv = " + JSON.stringify(rgbToHsv));





console.log("\n");
console.log("\nBANANA ***************************************************************************");

// ISE comando: RGB: 182,0,20 HSV: 353°, 100%, 71%
// ISE Stato: > RGB: 182,48,0 HSV: 15°, 100%, 71% ->> postman get: "x": 0.6749,"y": 0.322,"brightness": 71.15
// Quindi c'è una bella discrepanza.

//const calcHSV = hueColorConverter.ColorConverter.rgbToHsv(calcRGB.r, calcRGB.g, calcRGB.b);
//console.log("calcHSV = " + JSON.stringify(calcHSV));

//const calcRGB = hueColorConverter.ColorConverter.xyBriToRgb(0.3116, 0.3256, hueColorConverter.ColorConverter.scale(21.74 / 4.5, [0, 100], [0, 1]), oGamut);
let bri = hueColorConverter.ColorConverter.scale(9.88, [0, 100], [0, 1]);
const calcRGB = hueColorConverter.ColorConverter.xyBriToRgb(0.6, 0.2, bri, oGamut);
console.log("calcRGB = " + JSON.stringify(calcRGB));
const calcHSV = hueColorConverter.ColorConverter.rgbToHsv(calcRGB.r, calcRGB.g, calcRGB.b);
console.log("calcHSV = " + JSON.stringify(calcHSV));














