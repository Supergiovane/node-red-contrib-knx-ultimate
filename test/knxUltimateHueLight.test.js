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
      expect(prepared.specifySwitchOnBrightness).to.equal("temperature");
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
