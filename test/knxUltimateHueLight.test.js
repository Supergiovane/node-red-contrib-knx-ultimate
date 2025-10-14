const { expect } = require("chai");

const hueLightModule = require("../nodes/knxUltimateHueLight.js");

const {
  safeJSONParse,
  hydrateSwitchColor,
  normalizeRuleKey,
  normalizeIncomingValue,
  convertRuleValueForStatus,
  buildEffectLookups,
  prepareHueLightConfig,
  clampBrightness,
  normalizeKelvin,
  normalizeChannel,
  normalizeColorConfig,
  extractTemperatureSettings,
  buildColorSwitchState,
  buildTemperatureSwitchState,
} = hueLightModule.__test__;

describe("knxUltimateHueLight helper utilities", () => {
  describe("safeJSONParse", () => {
    it("returns a cloned fallback when value is empty", () => {
      const fallback = { foo: ["bar"] };
      const result = safeJSONParse(undefined, fallback);
      expect(result).to.deep.equal(fallback);
      expect(result).to.not.equal(fallback);
    });

    it("returns fallback clone on invalid JSON strings", () => {
      const fallback = { baz: 42 };
      const result = safeJSONParse("not-json", fallback);
      expect(result).to.deep.equal(fallback);
      expect(result).to.not.equal(fallback);
    });

    it("parses valid JSON strings", () => {
      const input = '{"answer":42}';
      const result = safeJSONParse(input, {});
      expect(result).to.deep.equal({ answer: 42 });
    });
  });

  describe("clampBrightness", () => {
    it("clamps values within 0-100", () => {
      expect(clampBrightness(-10)).to.equal(0);
      expect(clampBrightness(50)).to.equal(50);
      expect(clampBrightness(150)).to.equal(100);
    });

    it("returns undefined for invalid inputs", () => {
      expect(clampBrightness(undefined)).to.equal(undefined);
      expect(clampBrightness("")).to.equal(undefined);
      expect(clampBrightness("abc")).to.equal(undefined);
    });
  });

  describe("normalize helpers", () => {
    it("normalizes kelvin and RGB channels", () => {
      expect(normalizeKelvin("3000")).to.equal(3000);
      expect(normalizeKelvin(-1)).to.equal(undefined);
      expect(normalizeChannel(400)).to.equal(255);
      expect(normalizeChannel("12")).to.equal(12);
    });

    it("normalizes color configuration objects", () => {
      expect(normalizeColorConfig({ red: "255", green: "128", blue: 0 })).to.deep.equal({ red: 255, green: 128, blue: 0 });
      expect(normalizeColorConfig({ red: 10, green: 20, blue: 30, brightness: "75" })).to.deep.equal({ red: 10, green: 20, blue: 30, brightness: 75 });
      expect(normalizeColorConfig({ red: 10, blue: 10 })).to.equal(undefined);
    });

    it("extracts temperature settings with clamped brightness", () => {
      expect(extractTemperatureSettings({ kelvin: "2700", brightness: "120" })).to.deep.equal({ kelvin: 2700, brightness: 100 });
      expect(extractTemperatureSettings(null)).to.deep.equal({ kelvin: undefined, brightness: undefined });
    });
  });

  describe("buildColorSwitchState", () => {
    const baseGamut = { red: { x: 0.7, y: 0.298 }, green: { x: 0.17, y: 0.7 }, blue: { x: 0.15, y: 0.06 } };

    it("builds consistent state for single lights", () => {
      const currentDevice = { color: { gamut: baseGamut }, color_temperature: {}, dimming: { brightness: 30 } };
      const result = buildColorSwitchState({
        colorConfig: { red: 255, green: 0, blue: 0 },
        currentDevice,
        defaultGamut: baseGamut,
        isGroupedLight: false,
      });
      expect(result).to.not.equal(null);
      expect(result.baseState.on).to.deep.equal({ on: true });
      expect(result.baseState.color.xy).to.have.keys(["x", "y"]);
      expect(result.baseState.color_temperature).to.deep.equal({ mirek: null });
      expect(result.brightness).to.be.within(0, 100);
      const memberState = result.buildMemberState({ color: { gamut: baseGamut } });
      expect(memberState.color.xy).to.have.keys(["x", "y"]);
      expect(memberState.dimming.brightness).to.equal(result.brightness);
    });

    it("omits color temperature reset for grouped lights", () => {
      const result = buildColorSwitchState({
        colorConfig: { red: 10, green: 20, blue: 30 },
        currentDevice: { color: { gamut: baseGamut } },
        defaultGamut: baseGamut,
        isGroupedLight: true,
      });
      expect(result.baseState.color_temperature).to.equal(undefined);
    });

    it("honours brightness overrides when provided", () => {
      const currentDevice = { color: { gamut: baseGamut }, color_temperature: {} };
      const result = buildColorSwitchState({
        colorConfig: { red: 120, green: 80, blue: 40, brightness: 25 },
        currentDevice,
        defaultGamut: baseGamut,
        isGroupedLight: false,
      });
      expect(result.brightness).to.equal(25);
      expect(result.baseState.dimming.brightness).to.equal(25);
    });
  });

  describe("buildTemperatureSwitchState", () => {
    it("builds base and member states respecting schemas", () => {
      const currentDevice = { color_temperature: { mirek: 400 }, dimming: { brightness: 35 } };
      const result = buildTemperatureSwitchState({
        kelvin: 3000,
        brightness: undefined,
        fallbackBrightness: undefined,
        lastKnownBrightness: 55,
        currentDevice,
        isGroupedLight: true,
      });
      expect(result.baseState.on).to.deep.equal({ on: true });
      expect(result.baseState.color_temperature.mirek).to.equal(333);
      expect(result.brightness).to.equal(55);

      const schemaLight = {
        color_temperature: {
          mirek_schema: { mirek_minimum: 200, mirek_maximum: 500 },
        },
      };
      const memberState = result.buildMemberState(schemaLight);
      expect(memberState.color_temperature.mirek).to.equal(333);
      expect(memberState.dimming.brightness).to.equal(55);
    });

    it("omits color temperature for single lights without capability", () => {
      const result = buildTemperatureSwitchState({
        kelvin: 2700,
        brightness: 40,
        fallbackBrightness: undefined,
        lastKnownBrightness: undefined,
        currentDevice: { dimming: { brightness: 10 } },
        isGroupedLight: false,
      });
      expect(result.baseState.color_temperature).to.equal(undefined);
      expect(result.brightness).to.equal(40);
    });
  });

  describe("hydrateSwitchColor", () => {
    it("converts hex strings to RGB objects", () => {
      const fallback = { kelvin: 3000, brightness: 50 };
      const result = hydrateSwitchColor("#ff0000", fallback);
      expect(result).to.include({ red: 255, green: 0, blue: 0 });
      expect(result.alpha).to.equal(1);
    });

    it("returns cloned objects when input is already an object", () => {
      const original = { kelvin: 2700, brightness: 20 };
      const result = hydrateSwitchColor(original, { kelvin: 3000, brightness: 50 });
      expect(result).to.deep.equal(original);
      expect(result).to.not.equal(original);
    });

    it("parses JSON strings and replaces invalid content with fallback", () => {
      const fallback = { kelvin: 2700, brightness: 20 };
      const result = hydrateSwitchColor('{"kelvin":3500,"brightness":80}', fallback);
      expect(result).to.deep.equal({ kelvin: 3500, brightness: 80 });
    });
  });

  describe("normalizeRuleKey", () => {
    it("normalizes boolean like values for binary DPTs", () => {
      expect(normalizeRuleKey(" true ", "1.001")).to.equal("true");
      expect(normalizeRuleKey("0", "1.001")).to.equal("false");
      expect(normalizeRuleKey("FALSE", "2.003")).to.equal("false");
    });

    it("normalizes numeric values for numeric DPTs", () => {
      expect(normalizeRuleKey("001", "9.001")).to.equal("1");
      expect(normalizeRuleKey("12.5", "14.019")).to.equal("12.5");
    });
  });

  describe("normalizeIncomingValue", () => {
    it("handles primitives and booleans", () => {
      expect(normalizeIncomingValue(true, "1.001")).to.equal("true");
      expect(normalizeIncomingValue(10, "9.001")).to.equal("10");
    });

    it("extracts useful values from KNX payload-style objects", () => {
      expect(normalizeIncomingValue({ value: 5 }, "5.001")).to.equal("5");
      expect(normalizeIncomingValue({ scene_number: "7" }, "18.001")).to.equal("7");
    });
  });

  describe("convertRuleValueForStatus", () => {
    it("returns booleans for binary DPTs", () => {
      expect(convertRuleValueForStatus("true", "1.001")).to.equal(true);
      expect(convertRuleValueForStatus("0", "2.001")).to.equal(false);
      expect(convertRuleValueForStatus("maybe", "1.001")).to.equal(undefined);
    });

    it("returns numbers for numeric DPTs", () => {
      expect(convertRuleValueForStatus("42", "9.001")).to.equal(42);
      expect(convertRuleValueForStatus("invalid", "9.001")).to.equal(undefined);
    });
  });

  describe("buildEffectLookups", () => {
    it("builds lookup maps with normalized keys and status values", () => {
      const rules = [
        { knxValue: "TRUE", hueEffect: "candle" },
        { knxValue: "true", hueEffect: "candle" }, // duplicate KNX value ignored
        { knxValue: "21", hueEffect: "sparkle" },
        { knxValue: "", hueEffect: "   " }, // blank effect ignored
        null,
      ];

      const { byKnxValue, byEffect } = buildEffectLookups(rules, "1.001", "1.001");

      expect(byKnxValue.get("true")).to.equal("candle");
      expect(byKnxValue.get("21")).to.equal("sparkle");
      expect(byEffect.get("candle")).to.deep.include({ knxValue: "TRUE", statusValue: true });
      expect(byEffect.get("sparkle")).to.deep.include({ knxValue: "21" });
      expect(byEffect.get("sparkle").statusValue).to.equal(undefined);
      expect(byEffect.has("")).to.equal(false);
    });
  });

  describe("prepareHueLightConfig", () => {
    it("fills legacy fields, defaults and normalizes effect rules", () => {
      const input = {
        nameLightHSV: "HSV name",
        GALightHSV: "1/2/3",
        dptLightHSV: "5.001",
        nameLightHSVPercentage: "HSV percentage",
        GALightHSVPercentage: "1/2/4",
        dptLightHSVPercentage: "5.001",
        nameLightHSVState: "HSV state",
        GALightHSVState: "1/2/5",
        dptLightHSVState: "5.001",
        readStatusAtStartup: "no",
        specifySwitchOnBrightness: "",
        specifySwitchOnBrightnessNightTime: "",
        colorAtSwitchOnDayTime: '{"kelvin":3500,"brightness":80}',
        colorAtSwitchOnNightTime: "",
        dimSpeed: "",
        HSVDimSpeed: "",
        invertDimTunableWhiteDirection: undefined,
        restoreDayMode: undefined,
        invertDayNight: undefined,
        effectRules: JSON.stringify([
          { knxValue: 1, hueEffect: "candle" },
          { knxValue: null, hueEffect: "" },
        ]),
      };

      const prepared = prepareHueLightConfig(input);

      expect(prepared.nameLightKelvinDIM).to.equal("HSV name");
      expect(prepared.GALightKelvinPercentageState).to.equal("1/2/5");
      expect(prepared.initializingAtStart).to.equal(false);
      expect(prepared.specifySwitchOnBrightness).to.equal("no");
      expect(prepared.specifySwitchOnBrightnessNightTime).to.equal("no");
      expect(prepared.colorAtSwitchOnDayTime).to.deep.equal({ kelvin: 3500, brightness: 80 });
      expect(prepared.colorAtSwitchOnNightTime).to.deep.equal({ kelvin: 2700, brightness: 20 });
      expect(prepared.dimSpeed).to.equal(5000);
      expect(prepared.HSVDimSpeed).to.equal(5000);
      expect(prepared.invertDimTunableWhiteDirection).to.equal(false);
      expect(prepared.restoreDayMode).to.equal("no");
      expect(prepared.invertDayNight).to.equal(false);
      expect(prepared.effectRules).to.deep.equal([
        { knxValue: "1", hueEffect: "candle" },
        { knxValue: "", hueEffect: "" },
      ]);
    });
  });
});
