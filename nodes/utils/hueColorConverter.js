// Part of this code, thanks to https://github.com/Shnoo/js-CIE-1931-rgb-color-converter
class ColorConverter {
  // static getBrightnessFromRGBOrHex(red, green, blue) {
  //   const hsv = convert.rgb.hsv(red, green, blue);
  //   const brightness = hsv[2];
  //   return brightness;
  // }


  static getBrightnessFromRGBOrHex(Rint, Gint, Bint) { // takes sRGB channels as 8 bit integers

    var Rlin = (Rint / 255.0) ** 2.218;   // Convert int to decimal 0-1 and linearize
    var Glin = (Gint / 255.0) ** 2.218;   // ** is the exponentiation operator, older JS needs Math.pow() instead
    var Blin = (Bint / 255.0) ** 2.218;   // 2.218 Gamma for sRGB linearization. 2.218 sets unity with the piecewise sRGB at #777 .... 2.2 or 2.223 could be used instead

    var Ylum = Rlin * 0.2126 + Glin * 0.7156 + Blin * 0.0722;   // convert to Luminance Y

    return Math.pow(Ylum, 0.43) * 100;  // Convert to lightness (0 to 100)
  }

  static convert_1_255_ToPercentage(number) {
    const percentage = (number / 255) * 100;
    return percentage;
  }

  static kelvinToMirek(_kelvin) {
    return Math.round(1000000 / _kelvin, 0);
  }

  static mirekToKelvin(_mirek) {
    return Math.round(1000000 / _mirek, 0);
  }

  // Linear interpolation of input y given starting and ending ranges
  static scale(y, range1 = [0, 100], range2 = [0, 255]) {
    const [xMin, xMax] = range2;
    const [yMin, yMax] = range1;
    const percent = (y - yMin) / (yMax - yMin);
    const ans = percent * (xMax - xMin) + xMin;
    return Math.round(ans);
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
          return Math.min(Number.parseFloat(value) * max / 100, max);
        }

        return Math.min(Number.parseFloat(value), max);
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
      alpha = Number.parseFloat(alpha);
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

  static getGamutRanges() {
    const gamutA = {
      red: [0.704, 0.296],
      green: [0.2151, 0.7106],
      blue: [0.138, 0.08],
    };

    const gamutB = {
      red: [0.675, 0.322],
      green: [0.409, 0.518],
      blue: [0.167, 0.04],
    };

    const gamutC = {
      red: [0.692, 0.308],
      green: [0.17, 0.7],
      blue: [0.153, 0.048],
    };

    const defaultGamut = {
      red: [1.0, 0],
      green: [0.0, 1.0],
      blue: [0.0, 0.0],
    };

    return {
      gamutA, gamutB, gamutC, default: defaultGamut,
    };
  }

  static getLightColorGamutRange(modelId = null) {
    const ranges = ColorConverter.getGamutRanges();
    const { gamutA } = ranges;
    const { gamutB } = ranges;
    const { gamutC } = ranges;

    const philipsModels = {
      LST001: gamutA,
      LLC010: gamutA,
      LLC011: gamutA,
      LLC012: gamutA,
      LLC006: gamutA,
      LLC005: gamutA,
      LLC007: gamutA,
      LLC014: gamutA,
      LLC013: gamutA,

      LCT001: gamutB,
      LCT007: gamutB,
      LCT002: gamutB,
      LCT003: gamutB,
      LLM001: gamutB,

      LCT010: gamutC,
      LCT014: gamutC,
      LCT015: gamutC,
      LCT016: gamutC,
      LCT011: gamutC,
      LLC020: gamutC,
      LST002: gamutC,
      LCT012: gamutC,
    };

    if (philipsModels[modelId]) {
      return philipsModels[modelId];
    }

    return ranges.default;
  }

  static rgbToXy(red, green, blue, modelId = null) {
    function getGammaCorrectedValue(value) {
      return (value > 0.04045) ? ((value + 0.055) / (1.0 + 0.055)) ** 2.4 : (value / 12.92);
    }

    const colorGamut = ColorConverter.getLightColorGamutRange(modelId);

    red = parseFloat(red / 255);
    green = parseFloat(green / 255);
    blue = parseFloat(blue / 255);

    red = getGammaCorrectedValue(red);
    green = getGammaCorrectedValue(green);
    blue = getGammaCorrectedValue(blue);

    const x = red * 0.649926 + green * 0.103455 + blue * 0.197109;
    const y = red * 0.234327 + green * 0.743075 + blue * 0.022598;
    const z = red * 0.0000000 + green * 0.053077 + blue * 1.035763;

    let xy = {
      x: x / (x + y + z),
      y: y / (x + y + z),
    };

    if (!ColorConverter.xyIsInGamutRange(xy, colorGamut)) {
      xy = ColorConverter.getClosestColor(xy, colorGamut);
    }

    return xy;
  }

  static xyIsInGamutRange(xy, gamut) {
    gamut = gamut || ColorConverter.getGamutRanges().gamutC;
    if (Array.isArray(xy)) {
      xy = {
        x: xy[0],
        y: xy[1],
      };
    }

    const v0 = [gamut.blue[0] - gamut.red[0], gamut.blue[1] - gamut.red[1]];
    const v1 = [gamut.green[0] - gamut.red[0], gamut.green[1] - gamut.red[1]];
    const v2 = [xy.x - gamut.red[0], xy.y - gamut.red[1]];

    const dot00 = (v0[0] * v0[0]) + (v0[1] * v0[1]);
    const dot01 = (v0[0] * v1[0]) + (v0[1] * v1[1]);
    const dot02 = (v0[0] * v2[0]) + (v0[1] * v2[1]);
    const dot11 = (v1[0] * v1[0]) + (v1[1] * v1[1]);
    const dot12 = (v1[0] * v2[0]) + (v1[1] * v2[1]);

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return ((u >= 0) && (v >= 0) && (u + v < 1));
  }

  static getClosestColor(xy, gamut) {
    function getLineDistance(pointA, pointB) {
      return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);
    }

    function getClosestPoint(xy, pointA, pointB) {
      const xy2a = [xy.x - pointA.x, xy.y - pointA.y];
      const a2b = [pointB.x - pointA.x, pointB.y - pointA.y];
      const a2bSqr = a2b[0] ** 2 + a2b[1] ** 2;
      const xy2a_dot_a2b = xy2a[0] * a2b[0] + xy2a[1] * a2b[1];
      const t = xy2a_dot_a2b / a2bSqr;

      return {
        x: pointA.x + a2b[0] * t,
        y: pointA.y + a2b[1] * t,
      };
    }

    const greenBlue = {
      a: {
        x: gamut.green[0],
        y: gamut.green[1],
      },
      b: {
        x: gamut.blue[0],
        y: gamut.blue[1],
      },
    };

    const greenRed = {
      a: {
        x: gamut.green[0],
        y: gamut.green[1],
      },
      b: {
        x: gamut.red[0],
        y: gamut.red[1],
      },
    };

    const blueRed = {
      a: {
        x: gamut.red[0],
        y: gamut.red[1],
      },
      b: {
        x: gamut.blue[0],
        y: gamut.blue[1],
      },
    };

    const closestColorPoints = {
      greenBlue: getClosestPoint(xy, greenBlue.a, greenBlue.b),
      greenRed: getClosestPoint(xy, greenRed.a, greenRed.b),
      blueRed: getClosestPoint(xy, blueRed.a, blueRed.b),
    };

    const distance = {
      greenBlue: getLineDistance(xy, closestColorPoints.greenBlue),
      greenRed: getLineDistance(xy, closestColorPoints.greenRed),
      blueRed: getLineDistance(xy, closestColorPoints.blueRed),
    };

    let closestDistance;
    let closestColor;
    for (const i in distance) {
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

  static xyBriToRgb(x, y, bri) {
    function getReversedGammaCorrectedValue(value) {
      return value <= 0.0031308 ? 12.92 * value : (1.0 + 0.055) * value ** (1.0 / 2.4) - 0.055;
    }

    const z = 1.0 - x - y;
    const Y = bri / 255;
    const X = (Y / y) * x;
    const Z = (Y / y) * z;
    let r = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
    let g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
    let b = X * 0.051713 - Y * 0.121364 + Z * 1.011530;

    r = getReversedGammaCorrectedValue(r);
    g = getReversedGammaCorrectedValue(g);
    b = getReversedGammaCorrectedValue(b);

    // Bring all negative components to zero
    r = Math.max(r, 0);
    g = Math.max(g, 0);
    b = Math.max(b, 0);

    // If one component is greater than 1, weight components by that value
    const max = Math.max(r, g, b);
    if (max > 1) {
      r /= max;
      g /= max;
      b /= max;
    }

    return {
      r: Math.floor(r * 255),
      g: Math.floor(g * 255),
      b: Math.floor(b * 255),
    };
  }
}
exports.ColorConverter = ColorConverter;
