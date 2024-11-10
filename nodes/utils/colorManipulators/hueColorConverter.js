// Part of this code, thanks to https://github.com/Shnoo/js-CIE-1931-rgb-color-converter
const XYFromRGB = require("./XYFromRGB_Supergiovane"); // Pick the specific hue color converter

class ColorConverter {
  // static getBrightnessFromRGBOrHex(red, green, blue) {
  //   const hsv = convert.rgb.hsv(red, green, blue);
  //   const brightness = hsv[2];
  //   return brightness;
  // }

  static getBrightnessFromRGBOrHex(Rint, Gint, Bint) { // takes sRGB channels as 8 bit integers
    const Rlin = (Rint / 255.0) ** 2.218; // Convert int to decimal 0-1 and linearize
    const Glin = (Gint / 255.0) ** 2.218; // ** is the exponentiation operator, older JS needs Math.pow() instead
    const Blin = (Bint / 255.0) ** 2.218; // 2.218 Gamma for sRGB linearization. 2.218 sets unity with the piecewise sRGB at #777 .... 2.2 or 2.223 could be used instead

    const Ylum = Rlin * 0.2126 + Glin * 0.7156 + Blin * 0.0722; // convert to Luminance Y

    let ret = Ylum ** 0.43 * 100;// Convert to lightness (0 to 100)

    // Boundary Check (min 0, max 100)
    ret = ret < 0 ? 0 : ret;
    ret = ret > 100 ? 100 : ret;

    return ret;
  }

  static convert_1_255_ToPercentage(number) {
    const percentage = (number / 255) * 100;
    return percentage;
  }

  static kelvinToMirek(_kelvin) {
    return Math.floor(1000000 / _kelvin);
  }

  static mirekToKelvin(_mirek) {
    return Math.floor(1000000 / _mirek);
  }

  // Linear interpolation of input y given starting and ending ranges
  static scale(y, range1 = [0, 100], range2 = [0, 255]) {
    const [xMin, xMax] = range2;
    const [yMin, yMax] = range1;
    const percent = (y - yMin) / (yMax - yMin);
    const ans = percent * (xMax - xMin) + xMin;
    //const roundedVal = Math.round((ans + Number.EPSILON) * 10000) / 10000;// Round by 4 decimals
    const roundedVal = ans;
    return roundedVal;
  }

  // Thanks to: https://github.com/sindresorhus/rgb-hex
  static rgbHex(red, green, blue, alpha) {
    const toHex = (red, green, blue, alpha) => ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1) + alpha;
    const parseCssRgbString = (input) => {
      const parts = input.replace(/rgba?\(([^)]+)\)/, '$1').split(/[,\s/]+/).filter(Boolean);
      if (parts.length < 3) {
        return;
      }

      const parseValue = (value, max) => {
        value = value.trim();

        if (value.endsWith('%')) {
          return Math.min(Number.parselet(value) * max / 100, max);
        }

        return Math.min(Number.parselet(value), max);
      };

      const red = parseValue(parts[0], 255);
      const green = parseValue(parts[1], 255);
      const blue = parseValue(parts[2], 255);
      let alpha;

      if (parts.length === 4) {
        alpha = parseValue(parts[3], 1);
      }

      return [red, green, blue, alpha];
    };

    let isPercent = (red + (alpha || '')).toString().includes('%');

    if (typeof red === 'string' && !green) { // Single string parameter.
      const parsed = parseCssRgbString(red);
      if (!parsed) {
        throw new TypeError('Invalid or unsupported color format.');
      }

      isPercent = false;
      [red, green, blue, alpha] = parsed;
    } else if (alpha !== undefined) {
      alpha = Number.parselet(alpha);
    }

    if (typeof red !== 'number'
      || typeof green !== 'number'
      || typeof blue !== 'number'
      || red > 255
      || green > 255
      || blue > 255
    ) {
      throw new TypeError('Expected three numbers below 256');
    }

    if (typeof alpha === 'number') {
      if (!isPercent && alpha >= 0 && alpha <= 1) {
        alpha = Math.round(255 * alpha);
      } else if (isPercent && alpha >= 0 && alpha <= 100) {
        alpha = Math.round(255 * alpha / 100);
      } else {
        throw new TypeError(`Expected alpha value (${alpha}) as a fraction or percentage`);
      }

      alpha = (alpha | 1 << 8).toString(16).slice(1); // eslint-disable-line no-mixed-operators
    } else {
      alpha = '';
    }

    return toHex(red, green, blue, alpha);
  }

  // Thanks to: https://github.com/sindresorhus/hex-rgb
  static hexRgb(hex, options = {}) {
    const hexCharacters = 'a-f\\d';
    const match3or4Hex = `#?[${hexCharacters}]{3}[${hexCharacters}]?`;
    const match6or8Hex = `#?[${hexCharacters}]{6}([${hexCharacters}]{2})?`;
    const nonHexChars = new RegExp(`[^#${hexCharacters}]`, 'gi');
    const validHexSize = new RegExp(`^${match3or4Hex}$|^${match6or8Hex}$`, 'i');

    if (typeof hex !== 'string' || nonHexChars.test(hex) || !validHexSize.test(hex)) {
      throw new TypeError('Expected a valid hex string');
    }

    hex = hex.replace(/^#/, '');
    let alphaFromHex = 1;

    if (hex.length === 8) {
      alphaFromHex = Number.parseInt(hex.slice(6, 8), 16) / 255;
      hex = hex.slice(0, 6);
    }

    if (hex.length === 4) {
      alphaFromHex = Number.parseInt(hex.slice(3, 4).repeat(2), 16) / 255;
      hex = hex.slice(0, 3);
    }

    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const number = Number.parseInt(hex, 16);
    const red = number >> 16;
    const green = (number >> 8) & 255;
    const blue = number & 255;
    const alpha = typeof options.alpha === 'number' ? options.alpha : alphaFromHex;

    if (options.format === 'array') {
      return [red, green, blue, alpha];
    }

    if (options.format === 'css') {
      const alphaString = alpha === 1 ? '' : ` / ${Number((alpha * 100).toFixed(2))}%`;
      return `rgb(${red} ${green} ${blue}${alphaString})`;
    }

    return {
      red, green, blue, alpha,
    };
  }

  /**
   * Checked 01/02/2024
   * PERFETTO 
  * Calculate XY color points for a given RGB value.
  * @param {number} red RGB red value (0-255)
  * @param {number} green RGB green value (0-255)
  * @param {number} blue RGB blue value (0-255)
  * @param {object} lampGamut Hue bulb gamut range (the lamp provides a gamut object red:{x:1,y:1}, etc)
  * @returns {number[]}
  */
  static calculateXYFromRGB(red, green, blue, lampGamut) {
    return XYFromRGB.calculateXYFromRGB(red, green, blue, lampGamut);
  }

  /**
   * Converts an XY + brightness color value to RGB. Conversion formula
   * Checked 01/02/2024
   * QUASI PERFETTO !!! Preso da qui: 
   * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
   * Assumes x, and y are contained in the set [0, 1] and bri [0,1]
   * returns a Json with r,g,b
   *
   * @param   Number  x       The x [0,1]
   * @param   Number  y       The y [0,1]
   * @param   Number  bri     The brightness [0,1]
   * @return  json           The r,g,b [0,255]
   */
  static xyBriToRgb(x, y, bri, colorGamut) {
    if (colorGamut !== null && colorGamut !== undefined) {
      if (!xyIsInGamutRange({ x, y }, colorGamut)) {
        const xy = getClosestColor({ x, y }, colorGamut);
        x = xy.x;
        y = xy.y;
      }
    }
    function getReversedGammaCorrectedValue(value) {
      return Math.abs(value) <= 0.0031308 ? 12.92 * value : (1.0 + 0.055) * Math.pow(value, (1.0 / 2.4)) - 0.055;
    }

    // To make RGB more similar to what ISE Connect HUE does, think to add here the row: bri = bri / 4.5
    let z = 1.0 - x - y;
    //let Y = bri / 4.5;
    let Y = Math.min(x, y) * bri;
    let X = (Y / y) * x;
    let Z = (Y / y) * z;

    // let r = 3.2404542 * X - 1.5371385 * Y - 0.4985314 * Z
    // let g = -0.9692660 * X + 1.8760108 * Y + 0.0415560 * Z
    // let b = 0.0556434 * X - 0.2040259 * Y + 1.0572252 * Z

    let r = X * 1.656492 + Y * -0.354851 + Z * -0.255038;
    let g = X * -0.707196 + Y * 1.655397 + Z * 0.036152;
    let b = X * 0.051713 + Y * -0.121364 + Z * 1.011530;

    // Correction for negative values is missing from Philips' documentation.
    let min = Math.min(r, Math.min(g, b));
    if (min < 0.0) {
      r -= min;
      g -= min;
      b -= min;
    }

    // Rescale
    let max = Math.max(r, Math.max(g, b));
    if (max > 1.0) {
      r /= max;
      g /= max;
      b /= max;
    }

    r = getReversedGammaCorrectedValue(r);
    g = getReversedGammaCorrectedValue(g);
    b = getReversedGammaCorrectedValue(b);

    // Rescale again
    max = Math.max(r, Math.max(g, b));
    if (max > 1.0) {
      r /= max;
      g /= max;
      b /= max;
    }

    // // Bring all negative components to zero
    // r = Math.max(r, 0);
    // g = Math.max(g, 0);
    // b = Math.max(b, 0);

    // // If one component is greater than 1, weight components by that value
    // let max = Math.max(r, g, b);
    // if (max > 1) {
    //   r = r / max;
    //   g = g / max;
    //   b = b / max;
    // }

    return {
      r: Math.floor(r * 255.0),
      g: Math.floor(g * 255.0),
      b: Math.floor(b * 255.0),
    };
  }

  /**
   * Converts an RGB color value to HSV. Conversion formula  
   * Checked 31/01/2024  
   * PERFETTO !!!!!!  
   * adapted from http://en.wikipedia.org/wiki/HSV_color_space.  
   * Assumes r, g, and b are contained in the set [0, 255] and  
   * returns the HSV representation {hPercent:0-100%, h:0-360°, s:0-100%, v(brightness):0-100%}
   *
   * @param   Number  r       The red color value
   * @param   Number  g       The green color value
   * @param   Number  b       The blue color value
   * @return  Object          The HSV representation {hPercent:0-100%, h:0-360°, s:0-100%, v(brightness):0-100%}
   */
  static rgbToHsv(r, g, b) {
    // Sample
    // ISE comando RGB: 182,0,20 HSV: 353°, 100%, 71% (HSV è stato calcolato da ETS automaticamente)
    // Questa funzione restituisce l'HSV preciso.

    r /= 255, g /= 255, b /= 255;

    const max = Math.max(r, g, b); const
      min = Math.min(r, g, b);
    let h;
    let s;
    const v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default:
      }

      h /= 6;
    }
    const hPercent_rounded = Math.round((h + Number.EPSILON) * 10000) / 100;
    const s_rounded = Math.round((s + Number.EPSILON) * 10000) / 100;
    const v_rounded = Math.round((v + Number.EPSILON) * 10000) / 100;
    //const hGrad_rounded = ColorConverter.scale(hPercent_rounded, [0, 100], [0, 360]);
    return { h: Math.floor(hPercent_rounded), s: Math.floor(s_rounded), v: Math.floor(v_rounded) };
  }

  /**
   * Converts an HSV color value to RGB. Conversion formula
   * Checked 30/01/2024
   * PERFETTO !!!!!!!!!!!!!  
   * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
   * Assumes h, s, and v are contained in the set [0, 1] and
   * returns r, g, and b in the set [0, 255].
   *
   * @param   Number  h       The hue
   * @param   Number  s       The saturation
   * @param   Number  v       The value
   * @return  Array           The RGB representation
   */
  static hsvToRgb(h, s, v) {
    let r;
    let g;
    let b;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
      default:
    }

    // Round!
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    if (r > 255) r = 255;
    if (r < 0) r = 0;
    if (g > 255) g = 255;
    if (g < 0) g = 0;
    if (b > 255) b = 255;
    if (b < 0) b = 0;

    return { r, g, b };
  }

  /**
   * Converts an HSV color value to XY Bri. Conversion formula  
   * adapted from http://en.wikipedia.org/wiki/HSV_color_space.  
   * returns h,s,v in object  
   *
   * @param   Object An object {h,s,v} in 0-100% values
   * @return  Object The JSON Object XYBri representation
   */
  static hsvToxyBrightness(_hsvInput, _oGamut) {
    // Get the XY from HSV
    try {
      const hsvInput = {};
      hsvInput.h = ColorConverter.scale(_hsvInput.h, [0, 100], [0, 1]);
      hsvInput.s = ColorConverter.scale(_hsvInput.s, [0, 100], [0, 1]);
      hsvInput.v = ColorConverter.scale(_hsvInput.v, [0, 100], [0, 1]);
      const hsvToRgb = ColorConverter.hsvToRgb(hsvInput.h, hsvInput.s, hsvInput.v);
      // Get the XY
      return ColorConverter.calculateXYFromRGB(hsvToRgb.r, hsvToRgb.g, hsvToRgb.b, _oGamut);
    } catch (error) { /* empty */ }
  }

  /**
   * Converts an XY and Brightness color value to XY. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
   * returns x, and y in the set [0, 1] and brightness [0, 1].
   *
   * @param   Number  x       The x (see _xyInScaleZeroUndred)
   * @param   Number  y       The y (see _xyInScaleZeroUndred)
   * @param   Number  brightness The brightness with scale 0-100%
  * @param   Boolean  _xyInScaleZeroUndred If true, the x and y will be scaled from 0-100 to 0-1, else, x and y remains as is (0-1)
  * @return  Object           The HSV {h,s,v} representation, all in 0-10
   */
  static xyBrightnessToHsv(x, y, brightness, _xyInScaleZeroUndred = true) {
    try {
      if (_xyInScaleZeroUndred) {
        x = ColorConverter.scale(x, [0, 100], [0, 1]);
        y = ColorConverter.scale(y, [0, 100], [0, 1]);
      }
      const rgb = ColorConverter.xyBriToRgb(x, y, brightness);
      const hsv = ColorConverter.rgbToHsv(rgb.r, rgb.g, rgb.b);
      return hsv;
    } catch (error) { }
  }
}
exports.ColorConverter = ColorConverter;

function xyIsInGamutRange(xy, gamut) {
  if (Array.isArray(xy)) {
    xy = {
      x: xy[0],
      y: xy[1]
    };
  }

  let v0 = [gamut.blue[0] - gamut.red[0], gamut.blue[1] - gamut.red[1]];
  let v1 = [gamut.green[0] - gamut.red[0], gamut.green[1] - gamut.red[1]];
  let v2 = [xy.x - gamut.red[0], xy.y - gamut.red[1]];

  let dot00 = (v0[0] * v0[0]) + (v0[1] * v0[1]);
  let dot01 = (v0[0] * v1[0]) + (v0[1] * v1[1]);
  let dot02 = (v0[0] * v2[0]) + (v0[1] * v2[1]);
  let dot11 = (v1[0] * v1[0]) + (v1[1] * v1[1]);
  let dot12 = (v1[0] * v2[0]) + (v1[1] * v2[1]);

  let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

  let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  return ((u >= 0) && (v >= 0) && (u + v < 1));
}

function getClosestColor(xy, gamut) {
  function getLineDistance(pointA, pointB) {
    return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);
  }

  function getClosestPoint(xy, pointA, pointB) {
    let xy2a = [xy.x - pointA.x, xy.y - pointA.y];
    let a2b = [pointB.x - pointA.x, pointB.y - pointA.y];
    let a2bSqr = Math.pow(a2b[0], 2) + Math.pow(a2b[1], 2);
    let xy2a_dot_a2b = xy2a[0] * a2b[0] + xy2a[1] * a2b[1];
    let t = xy2a_dot_a2b / a2bSqr;

    return {
      x: pointA.x + a2b[0] * t,
      y: pointA.y + a2b[1] * t
    }
  }

  let greenBlue = {
    a: {
      x: gamut.green.x,
      y: gamut.green.y
    },
    b: {
      x: gamut.blue.x,
      y: gamut.blue.y
    }
  };

  let greenRed = {
    a: {
      x: gamut.green.x,
      y: gamut.green.y
    },
    b: {
      x: gamut.red.x,
      y: gamut.red.y
    }
  };

  let blueRed = {
    a: {
      x: gamut.red.x,
      y: gamut.red.y
    },
    b: {
      x: gamut.blue.x,
      y: gamut.blue.y
    }
  };

  let closestColorPoints = {
    greenBlue: getClosestPoint(xy, greenBlue.a, greenBlue.b),
    greenRed: getClosestPoint(xy, greenRed.a, greenRed.b),
    blueRed: getClosestPoint(xy, blueRed.a, blueRed.b)
  };

  let distance = {
    greenBlue: getLineDistance(xy, closestColorPoints.greenBlue),
    greenRed: getLineDistance(xy, closestColorPoints.greenRed),
    blueRed: getLineDistance(xy, closestColorPoints.blueRed)
  };

  let closestDistance;
  let closestColor;
  for (let i in distance) {
    if (distance.hasOwnProperty(i)) {
      if (!closestDistance) {
        closestDistance = distance[i];
        closestColor = i;
      }

      if (closestDistance > distance[i]) {
        closestDistance = distance[i];
        closestColor = i;
      }
    }

  }
  return closestColorPoints[closestColor];
}
