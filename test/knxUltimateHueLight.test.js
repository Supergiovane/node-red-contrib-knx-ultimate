const { expect } = require("chai");
const { ColorConverter } = require("../nodes/utils/colorManipulators/hueColorConverter");
const { dptlib } = require("knxultimate");

const debugLog = (...args) => {
  if (process.env.DEBUG_KNX_HUE_TEST === "1") {
    console.log("[knxHueTest]", ...args);
  }
};

function instantiateNode(overrides = {}) {
  const hueCommands = [];
  const knxTelegrams = [];
  const statuses = [];
  const hueQueueDeletes = [];
  const sentMessages = [];
  let registeredConstructor = null;

  const baseConfig = {
    server: "knx",
    serverHue: "hue",
    hueDevice: "test-light#light",
    GALightSwitch: "1/1/1",
    dptLightSwitch: "1.001",
    GADaylightSensor: "1/1/2",
    dptDaylightSensor: "1.001",
    specifySwitchOnBrightness: "no",
    specifySwitchOnBrightnessNightTime: "no",
    enableDayNightLighting: "no",
    colorAtSwitchOnDayTime: '{ "kelvin":3000, "brightness":55 }',
    colorAtSwitchOnNightTime: '{ "kelvin":2700, "brightness":25 }',
  };

  const config = { ...baseConfig, ...overrides };

  const knxServer = {
    sendKNXTelegramToKNXEngine: (frame) => {
      knxTelegrams.push(frame);
      debugLog("KNX telegram", frame);
    },
    addClient: () => {},
    removeClient: () => {},
  };

  const hueServer = {
    linkStatus: "connected",
    hueManager: {
      writeHueQueueAdd: (id, payload, command) => {
        hueCommands.push({ id, payload, command });
        debugLog("Hue command", { id, command, payload });
      },
      deleteHueQueue: (id) => {
        hueQueueDeletes.push(id);
        debugLog("Hue queue cleared", id);
      },
    },
    addClient: () => {},
    removeClient: () => {},
    getAllLightsBelongingToTheGroup: async () => [],
    getAverageColorsXYBrightnessAndTemperature: async (lights = []) => {
      if (!Array.isArray(lights) || lights.length === 0) return {};
      let sumX = 0;
      let sumY = 0;
      let sumMirek = 0;
      let sumBrightness = 0;
      let countXY = 0;
      let countMirek = 0;
      let countBrightness = 0;
      lights.forEach((light) => {
        if (light?.color?.xy) {
          sumX += Number(light.color.xy.x);
          sumY += Number(light.color.xy.y);
          countXY += 1;
        }
        if (light?.color_temperature?.mirek !== undefined) {
          sumMirek += Number(light.color_temperature.mirek);
          countMirek += 1;
        }
        if (light?.dimming?.brightness !== undefined) {
          sumBrightness += Number(light.dimming.brightness);
          countBrightness += 1;
        }
      });
      return {
        x: countXY > 0 ? sumX / countXY : undefined,
        y: countXY > 0 ? sumY / countXY : undefined,
        mirek: countMirek > 0 ? sumMirek / countMirek : undefined,
        brightness: countBrightness > 0 ? sumBrightness / countBrightness : undefined,
      };
    },
  };

  const RED = {
    nodes: {
      registerType: (_name, ctor) => { registeredConstructor = ctor; },
      createNode: (node) => {
        node.status = (status) => {
          statuses.push(status);
          debugLog("Status update", status);
        };
        node.on = (event, handler) => {
          node._handlers = node._handlers || {};
          node._handlers[event] = handler;
        };
        node.emit = (event, ...args) => {
          if (node._handlers?.[event]) node._handlers[event](...args);
        };
        node.context = () => ({ get: () => undefined, set: () => {} });
        node.send = (msg) => {
          sentMessages.push(msg);
          debugLog("Node send", msg);
        };
      },
      getNode: (id) => {
        if (id === config.server) return knxServer;
        if (id === config.serverHue) return hueServer;
        return undefined;
      },
    },
    util: {
      cloneMessage: (msg) => JSON.parse(JSON.stringify(msg)),
    },
    log: {
      debug: () => {},
      error: () => {},
    },
  };

  delete require.cache[require.resolve("../nodes/knxUltimateHueLight.js")];
  const nodeFactory = require("../nodes/knxUltimateHueLight.js");
  nodeFactory(RED);

  const node = new registeredConstructor(config);

  return {
    node,
    config,
    hueCommands,
    knxTelegrams,
    statuses,
    hueServer,
    knxServer,
    hueQueueDeletes,
    sentMessages,
  };
}

function withFakeTimers(testFn) {
  const originalSetInterval = global.setInterval;
  const originalClearInterval = global.clearInterval;
  const activeIntervals = [];

  global.setInterval = (fn, delay) => {
    const handle = { fn, delay };
    activeIntervals.push(handle);
    return fn;
  };

  global.clearInterval = (handle) => {
    const index = activeIntervals.findIndex((entry) => entry.fn === handle);
    if (index !== -1) activeIntervals.splice(index, 1);
  };

  const tick = (cycles = 1) => {
    for (let i = 0; i < cycles; i += 1) {
      activeIntervals.slice().forEach((entry) => {
        entry.fn();
      });
    }
  };

  try {
    return testFn({ tick, activeIntervals });
  } finally {
    global.setInterval = originalSetInterval;
    global.clearInterval = originalClearInterval;
  }
}

function createSwitchTelegram(destination, value = 1, event = "GroupValue_Write") {
  const rawValue = Buffer.isBuffer(value) ? value : Buffer.from([value]);
  return {
    knx: {
      event,
      destination,
      rawValue,
    },
  };
}

describe("knxUltimateHueLight KNX to HUE routing", () => {
  it("restores stored daytime state when no switch-on profile is configured", () => {
    const { node, config, hueCommands } = instantiateNode();

    node.currentHUEDevice = { color_temperature: {}, dimming: {}, on: { on: false } };
    node.DayTime = true;
    const storedState = {
      on: { on: true },
      dimming: { brightness: 70 },
      color: { xy: { x: 0.35, y: 0.35 } },
      color_temperature: { mirek: 250 },
    };
    node.HUEDeviceWhileDaytime = storedState;

    node.handleSend(createSwitchTelegram(config.GALightSwitch));

    expect(hueCommands).to.have.lengthOf(2);
    hueCommands.forEach((command) => {
      expect(command.id).to.equal("test-light");
      expect(command.command).to.equal("setLight");
      expect(command.payload).to.deep.equal(storedState);
    });
    expect(node.HUEDeviceWhileDaytime).to.equal(null);
  });

  it("applies daytime temperature preset when configured", () => {
    const { node, config, hueCommands } = instantiateNode({
      specifySwitchOnBrightness: "temperature",
    });

    node.currentHUEDevice = {
      color_temperature: {},
      dimming: { brightness: 10 },
      on: { on: false },
    };
    node.DayTime = true;

    const brightnessUpdates = [];
    node.updateKNXBrightnessState = (value) => { brightnessUpdates.push(value); };

    node.handleSend(createSwitchTelegram(config.GALightSwitch));

    expect(hueCommands).to.have.lengthOf(1);
    const command = hueCommands[0];
    expect(command.payload.on).to.deep.equal({ on: true });
    expect(command.payload.dimming).to.deep.equal({ brightness: config.colorAtSwitchOnDayTime.brightness });
    const expectedMirek = ColorConverter.kelvinToMirek(config.colorAtSwitchOnDayTime.kelvin);
    expect(command.payload.color_temperature).to.deep.equal({ mirek: expectedMirek });
    expect(brightnessUpdates).to.deep.equal([config.colorAtSwitchOnDayTime.brightness]);
    expect(node.currentHUEDevice.color_temperature.mirek).to.equal(expectedMirek);
    expect(node.currentHUEDevice.dimming.brightness).to.equal(config.colorAtSwitchOnDayTime.brightness);
  });

  it("stores a clone of the current device when entering night mode", () => {
    const { node, config } = instantiateNode();

    node.currentHUEDevice = {
      on: { on: true },
      dimming: { brightness: 80 },
      color_temperature: { mirek: 300 },
      color: { xy: { x: 0.4, y: 0.4 } },
    };
    node.DayTime = true;

    node.handleSend(createSwitchTelegram(config.GADaylightSensor, 0));

    expect(node.DayTime).to.equal(false);
    expect(node.HUEDeviceWhileDaytime).to.deep.equal(node.currentHUEDevice);
    expect(node.HUEDeviceWhileDaytime).to.not.equal(node.currentHUEDevice);
  });

  it("ignores KNX read requests", () => {
    const { node, config, hueCommands } = instantiateNode();
    node.currentHUEDevice = { color_temperature: {}, dimming: {}, on: { on: false } };

    node.handleSend(createSwitchTelegram(config.GALightSwitch, 1, "GroupValue_Read"));

    expect(hueCommands).to.have.lengthOf(0);
  });

  it("applies the night color preset when enabled", () => {
    const { node, config, hueCommands } = instantiateNode({
      enableDayNightLighting: "yes",
      colorAtSwitchOnNightTime: JSON.stringify({ red: 10, green: 40, blue: 200 }),
    });

    node.currentHUEDevice = {
      color: {
        gamut: {
          red: { x: 0.7, y: 0.298 },
          green: { x: 0.17, y: 0.7 },
          blue: { x: 0.15, y: 0.06 },
        },
        xy: { x: 0.1, y: 0.1 },
      },
      color_temperature: { mirek: 450 },
      dimming: { brightness: 25 },
      on: { on: false },
    };
    node.DayTime = false;

    node.handleSend(createSwitchTelegram(config.GALightSwitch));

    expect(hueCommands).to.have.lengthOf(1);
    const command = hueCommands[0];
    expect(command.command).to.equal("setLight");
    expect(command.payload.on).to.deep.equal({ on: true });
    expect(command.payload.color.xy).to.have.keys(["x", "y"]);
    expect(command.payload.color_temperature).to.equal(undefined);

    const expectedCommandBrightness = ColorConverter.getBrightnessFromRGBOrHex(10, 40, 200);
    expect(command.payload.dimming.brightness).to.equal(expectedCommandBrightness);
    expect(node.currentHUEDevice.dimming.brightness).to.equal(Math.round(expectedCommandBrightness));
  });

  it("restores each grouped light using the stored night snapshot", () => {
    const { node, config, hueCommands } = instantiateNode({
      hueDevice: "group-1#grouped_light",
    });

    node.currentHUEDevice = { on: { on: false }, dimming: {}, color: {} };
    node.DayTime = true;

    node.HUELightsBelongingToGroupWhileDaytime = [
      {
        light: [
          {
            id: "light-a",
            on: { on: true },
            dimming: { brightness: 60 },
            color: { xy: { x: 0.3, y: 0.3 } },
            color_temperature: { mirek: 300 },
          },
        ],
      },
      {
        light: [
          {
            id: "light-b",
            on: { on: false },
            dimming: { brightness: 45 },
            color: { xy: { x: 0.4, y: 0.4 } },
            color_temperature: { mirek: null },
          },
        ],
      },
    ];

    node.handleSend(createSwitchTelegram(config.GALightSwitch));

    expect(hueCommands).to.have.lengthOf(2);
    const ids = hueCommands.map((entry) => entry.id);
    expect(ids).to.have.members(["light-a", "light-b"]);

    const groupedState = hueCommands.find((entry) => entry.id === "light-b");
    expect(groupedState.payload.color_temperature).to.equal(undefined);
    expect(groupedState.command).to.equal("setLight");
    expect(node.HUELightsBelongingToGroupWhileDaytime).to.equal(null);
  });

  it("converts KNX RGB payloads into Hue XY commands", () => {
    const { node, config, hueCommands } = instantiateNode({
      GALightColor: "1/1/4",
      dptLightColor: "232.600",
    });

    node.currentHUEDevice = {
      on: { on: false },
      dimming: { brightness: 10 },
      color: {
        gamut: {
          red: { x: 0.7, y: 0.3 },
          green: { x: 0.17, y: 0.7 },
          blue: { x: 0.15, y: 0.06 },
        },
      },
    };

    const rgbBuffer = Buffer.from([10, 40, 200]);
    node.handleSend(createSwitchTelegram(config.GALightColor, rgbBuffer));

    expect(hueCommands).to.have.lengthOf(1);
    const command = hueCommands[0];
    expect(command.payload.on).to.deep.equal({ on: true });
    expect(command.payload.color.xy).to.have.keys(["x", "y"]);
    expect(command.payload.dimming.brightness).to.be.greaterThan(0);
  });

  it("turns Hue light off when KNX RGB payload carries zero brightness", () => {
    const { node, config, hueCommands } = instantiateNode({
      GALightColor: "1/1/4",
      dptLightColor: "232.600",
    });

    node.currentHUEDevice = {
      on: { on: true },
      dimming: { brightness: 50 },
      color: { gamut: null },
    };

    const rgbBuffer = Buffer.from([0, 0, 0]);
    node.handleSend(createSwitchTelegram(config.GALightColor, rgbBuffer));

    expect(hueCommands).to.have.lengthOf(1);
    const command = hueCommands[0];
    expect(command.payload.on).to.deep.equal({ on: false });
    expect(command.payload.dimming.brightness).to.equal(0);
  });

  it("clamps tunable white writes to Hue-supported kelvin range", () => {
    const { node, config, hueCommands } = instantiateNode({
      GALightKelvin: "1/1/6",
      dptLightKelvin: "7.600",
    });
    const kelvinDpt = dptlib.resolve("7.600");
    node.currentHUEDevice = { color_temperature: { mirek: 350 } };

    node.handleSend(createSwitchTelegram(
      config.GALightKelvin,
      kelvinDpt.formatAPDU(7000),
    ));

    expect(hueCommands).to.have.lengthOf(1);
    let command = hueCommands[0];
    const maxKelvinMirek = ColorConverter.kelvinToMirek(6535);
    expect(command.payload.color_temperature.mirek).to.equal(maxKelvinMirek);

    node.handleSend(createSwitchTelegram(
      config.GALightKelvin,
      kelvinDpt.formatAPDU(1500),
    ));

    expect(hueCommands).to.have.lengthOf(2);
    command = hueCommands[1];
    const minKelvinMirek = ColorConverter.kelvinToMirek(2000);
    expect(command.payload.color_temperature.mirek).to.equal(minKelvinMirek);
  });

  it("maps tunable white percentage writes to Hue mirek range", () => {
    const { node, config, hueCommands } = instantiateNode({
      GALightKelvinPercentage: "1/1/7",
      dptLightKelvinPercentage: "5.001",
      nameLightKelvinDIM: "preset",
    });
    node.currentHUEDevice = { color_temperature: { mirek: 320 } };

    node.handleSend(createSwitchTelegram(
      config.GALightKelvinPercentage,
      Buffer.from([0]),
    ));

    expect(hueCommands).to.have.lengthOf(1);
    let command = hueCommands[0];
    expect(command.payload.color_temperature.mirek).to.equal(500);

    node.handleSend(createSwitchTelegram(
      config.GALightKelvinPercentage,
      Buffer.from([255]),
    ));

    expect(hueCommands).to.have.lengthOf(2);
    command = hueCommands[1];
    expect(command.payload.color_temperature.mirek).to.equal(153);
  });

  it("forces Hue dimming and turns light on for positive brightness telegrams", () => {
    const { node, config, hueCommands } = instantiateNode({
      GALightBrightness: "1/1/3",
      dptLightBrightness: "5.001",
    });

    node.currentHUEDevice = { on: { on: false }, dimming: { brightness: 0 } };

    const fiftyPercent = Buffer.from([128]);
    node.handleSend(createSwitchTelegram(config.GALightBrightness, fiftyPercent));

    expect(hueCommands).to.have.lengthOf(1);
    const command = hueCommands[0];
    expect(command.payload.dimming).to.deep.equal({ brightness: 50 });
    expect(command.payload.on).to.deep.equal({ on: true });
    expect(command.command).to.equal("setLight");
  });

  it("forces Hue dimming off when brightness telegram is zero", () => {
    const { node, config, hueCommands } = instantiateNode({
      GALightBrightness: "1/1/3",
      dptLightBrightness: "5.001",
    });

    node.currentHUEDevice = { on: { on: true }, dimming: { brightness: 80 } };

    node.handleSend(createSwitchTelegram(config.GALightBrightness, Buffer.from([0])));

    expect(hueCommands).to.have.lengthOf(1);
    const command = hueCommands[0];
    expect(command.payload.dimming).to.deep.equal({ brightness: 0 });
    expect(command.payload.on).to.deep.equal({ on: false });
    expect(command.command).to.equal("setLight");
  });

  it("ignores malformed KNX brightness payloads without emitting Hue commands", () => {
    const { node, config, hueCommands, statuses } = instantiateNode({
      GALightBrightness: "1/1/3",
      dptLightBrightness: "5.001",
    });

    node.currentHUEDevice = { on: { on: true }, dimming: { brightness: 40 } };

    expect(() => node.handleSend(createSwitchTelegram(config.GALightBrightness, Buffer.alloc(0)))).to.not.throw();
    expect(hueCommands).to.have.lengthOf(0);
    expect(statuses.some((entry) => entry.fill === "red")).to.equal(true);
  });

  it("drops malformed KNX color payloads and keeps previous state untouched", () => {
    const { node, config, hueCommands, statuses } = instantiateNode({
      GALightColor: "1/1/4",
      dptLightColor: "232.600",
    });

    node.currentHUEDevice = {
      on: { on: true },
      dimming: { brightness: 55 },
      color: { gamut: null },
    };

    const originalError = console.error;
    console.error = () => {};
    try {
      expect(() => node.handleSend(createSwitchTelegram(config.GALightColor, Buffer.from([1, 2])))).to.not.throw();
    } finally {
      console.error = originalError;
    }
    expect(hueCommands).to.have.lengthOf(0);
    expect(statuses.some((entry) => entry.fill === "red")).to.equal(true);
  });
});

describe("knxUltimateHueLight HUE to KNX status updates", () => {
  it("publishes KNX brightness status frames", () => {
    const overrides = {
      GALightBrightnessState: "1/1/10",
      dptLightBrightnessState: "5.001",
    };
    const { node, knxTelegrams } = instantiateNode(overrides);

    node.updateKNXBrightnessState(42);

    expect(knxTelegrams).to.have.lengthOf(1);
    expect(knxTelegrams[0]).to.deep.equal({
      grpaddr: overrides.GALightBrightnessState,
      payload: 42,
      dpt: overrides.dptLightBrightnessState,
      outputtype: "write",
      nodecallerid: node.id,
    });
  });

  it("publishes KNX on/off status frames", () => {
    const overrides = {
      GALightState: "1/1/11",
      dptLightState: "1.001",
    };
    const { node, knxTelegrams } = instantiateNode(overrides);

    node.updateKNXLightState(true);

    expect(knxTelegrams).to.have.lengthOf(1);
    expect(knxTelegrams[0]).to.deep.equal({
      grpaddr: overrides.GALightState,
      payload: true,
      dpt: overrides.dptLightState,
      outputtype: "write",
      nodecallerid: node.id,
    });
  });

  it("publishes KNX color status frames with RGB conversion", () => {
    const overrides = {
      GALightColorState: "1/1/12",
      dptLightColorState: "232.600",
    };
    const { node, knxTelegrams } = instantiateNode(overrides);

    node.currentHUEDevice = { dimming: { brightness: 75 } };
    const xyValue = { xy: { x: 0.25, y: 0.35 } };
    node.updateKNXLightColorState(xyValue);

    expect(knxTelegrams).to.have.lengthOf(1);
    const frame = knxTelegrams[0];
    expect(frame.grpaddr).to.equal(overrides.GALightColorState);
    expect(frame.dpt).to.equal(overrides.dptLightColorState);
    expect(frame.outputtype).to.equal("write");
    expect(frame.nodecallerid).to.equal(node.id);

    const expectedRgb = ColorConverter.xyBriToRgb(
      xyValue.xy.x,
      xyValue.xy.y,
      100,
    );
    expect(frame.payload).to.deep.equal({
      red: expectedRgb.r,
      green: expectedRgb.g,
      blue: expectedRgb.b,
    });
  });
});

describe("knxUltimateHueLight dimming helpers", () => {
  it("respects configured minimum brightness limit while dimming down", () => {
    withFakeTimers(({ tick }) => {
      const { node, hueCommands } = instantiateNode({
        minDimLevelLight: "30",
        maxDimLevelLight: "80",
      });

      node.currentHUEDevice = {
        on: { on: true },
        dimming: { brightness: 35 },
        color_temperature: { mirek: 350 },
      };

      const brightnessUpdates = [];
      node.updateKNXBrightnessState = (value) => { brightnessUpdates.push(value); };

      node.hueDimming(0, 1, 1000);

      tick();

      expect(node.brightnessStep).to.equal(30);
      expect(hueCommands).to.have.lengthOf(1);
      expect(hueCommands[0].payload.dimming.brightness).to.equal(30);
      expect(brightnessUpdates[0]).to.equal(35);
    });
  });

  it("does not exceed configured maximum brightness while dimming up", () => {
    withFakeTimers(({ tick }) => {
      const { node, hueCommands } = instantiateNode({
        minDimLevelLight: "10",
        maxDimLevelLight: "50",
      });

      node.currentHUEDevice = {
        on: { on: true },
        dimming: { brightness: 48 },
        color_temperature: { mirek: 350 },
      };

      node.hueDimming(1, 1, 1000);

      tick();

      expect(node.brightnessStep).to.equal(50);
      expect(hueCommands).to.have.lengthOf(1);
      expect(hueCommands[0].payload.dimming.brightness).to.equal(50);
    });
  });

  it("dims up from off state and schedules Hue updates", () => {
    withFakeTimers(({ tick, activeIntervals }) => {
      const { node, hueCommands } = instantiateNode();

      node.currentHUEDevice = {
        on: { on: false },
        dimming: { brightness: 0 },
        color_temperature: { mirek: 370 },
      };
      const brightnessUpdates = [];
      node.updateKNXBrightnessState = (value) => { brightnessUpdates.push(value); };

      node.hueDimming(1, 1, 1000);

      expect(activeIntervals).to.have.lengthOf(1);
      expect(node.brightnessStep).to.equal(0);

      tick();

      expect(brightnessUpdates).to.deep.equal([0]);
      expect(hueCommands).to.have.lengthOf(1);
      const command = hueCommands[0];
      expect(command.payload.dimming.brightness).to.be.greaterThan(0);
      expect(command.payload.on).to.deep.equal({ on: true });
      expect(command.payload.color_temperature).to.deep.equal({ mirek: 370 });
      expect(node.brightnessStep).to.be.greaterThan(0);
    });
  });

  it("clears timers and queue when dimming stop telegram arrives", () => {
    withFakeTimers(({ tick, activeIntervals }) => {
      const { node, hueCommands, hueQueueDeletes } = instantiateNode();

      node.currentHUEDevice = {
        on: { on: true },
        dimming: { brightness: 60 },
      };
      node.hueDimming(1, 1, 1000);

      tick();
      hueCommands.length = 0;

      node.hueDimming(0, 0, 1000);

      expect(hueQueueDeletes).to.deep.equal(["test-light"]);
      expect(node.brightnessStep).to.equal(null);
      expect(activeIntervals).to.have.lengthOf(0);
      expect(hueCommands).to.have.lengthOf(0);
    });
  });

  it("dims HSV hue upwards, updates color state and turns light on", () => {
    withFakeTimers(({ tick, activeIntervals }) => {
      const { node, hueCommands, hueQueueDeletes } = instantiateNode();

      node.currentHUEDevice = {
        on: { on: false },
        dimming: { brightness: 30 },
        color: {
          xy: { x: 0.3, y: 0.3 },
          gamut: {
            red: { x: 0.7, y: 0.3 },
            green: { x: 0.17, y: 0.7 },
            blue: { x: 0.15, y: 0.06 },
          },
        },
      };
      const colorUpdates = [];
      node.updateKNXLightColorState = (value) => { colorUpdates.push(value.xy); };

      node.hueDimmingHSV_H(1, 1, 1000);

      expect(activeIntervals).to.have.lengthOf(1);

      tick();

      expect(hueQueueDeletes).to.include("test-light");
      expect(hueCommands).to.have.lengthOf(1);
      const command = hueCommands[0];
      expect(command.payload.color.xy).to.have.keys(["x", "y"]);
      expect(command.payload.on).to.deep.equal({ on: true });
      expect(colorUpdates).to.have.lengthOf(1);
      expect(node.brightnessStepHSV_H).to.be.greaterThan(30);
    });
  });

  it("stops HSV hue dimming when stop telegram arrives", () => {
    withFakeTimers(({ tick, activeIntervals }) => {
      const { node, hueCommands, hueQueueDeletes } = instantiateNode();

      node.currentHUEDevice = {
        on: { on: true },
        dimming: { brightness: 40 },
        color: {
          xy: { x: 0.25, y: 0.32 },
          gamut: {
            red: { x: 0.7, y: 0.3 },
            green: { x: 0.17, y: 0.7 },
            blue: { x: 0.15, y: 0.06 },
          },
        },
      };

      node.hueDimmingHSV_H(1, 1, 1000);
      tick();
      hueCommands.length = 0;

      node.hueDimmingHSV_H(0, 0, 1000);

      expect(hueQueueDeletes[hueQueueDeletes.length - 1]).to.equal("test-light");
      expect(activeIntervals).to.have.lengthOf(0);
      expect(hueCommands).to.have.lengthOf(0);
    });
  });

  it("dims HSV saturation down to minimum and updates color state", () => {
    withFakeTimers(({ tick }) => {
      const { node, hueCommands, hueQueueDeletes } = instantiateNode();

      node.currentHUEDevice = {
        on: { on: true },
        dimming: { brightness: 10 },
        color: {
          xy: { x: 0.4, y: 0.35 },
          gamut: {
            red: { x: 0.7, y: 0.3 },
            green: { x: 0.17, y: 0.7 },
            blue: { x: 0.15, y: 0.06 },
          },
        },
      };
      const colorUpdates = [];
      node.updateKNXLightColorState = (value) => { colorUpdates.push(value.xy); };

      node.hueDimmingHSV_S(0, 1, 1000);

      tick();

      expect(hueQueueDeletes).to.include("test-light");
      expect(hueCommands).to.have.lengthOf(1);
      const command = hueCommands[0];
      expect(command.payload.color.xy).to.have.keys(["x", "y"]);
      expect(command.payload.on).to.equal(undefined);
      expect(colorUpdates).to.have.lengthOf(1);
      expect(node.brightnessStepHSV_S).to.equal(1);
    });
  });

  it("dims tunable white upwards and turns light on when off", () => {
    withFakeTimers(({ tick, activeIntervals }) => {
      const { node, hueCommands, hueQueueDeletes } = instantiateNode();

      node.currentHUEDevice = {
        on: { on: false },
        dimming: { brightness: 40 },
        color_temperature: { mirek: 300 },
      };
      const kelvinUpdates = [];
      node.updateKNXLightKelvinPercentageState = (value) => { kelvinUpdates.push(value); };

      node.hueDimmingTunableWhite(1, 1, 1000);

      expect(activeIntervals).to.have.lengthOf(1);

      tick();

      expect(kelvinUpdates).to.deep.equal([300]);
      expect(hueCommands).to.have.lengthOf(1);
      const command = hueCommands[0];
      expect(command.payload.color_temperature.mirek).to.be.greaterThan(300);
      expect(command.payload.on).to.deep.equal({ on: true });
      expect(node.brightnessStepTunableWhite).to.be.greaterThan(300);
    });
  });

  it("inverts tunable white direction when configured", () => {
    withFakeTimers(({ tick }) => {
      const { node, hueCommands } = instantiateNode({ invertDimTunableWhiteDirection: true });

      node.currentHUEDevice = {
        on: { on: true },
        dimming: { brightness: 50 },
        color_temperature: { mirek: 400 },
      };

      node.hueDimmingTunableWhite(1, 1, 1000);

      tick();

      expect(hueCommands).to.have.lengthOf(1);
      const command = hueCommands[0];
      expect(command.payload.color_temperature.mirek).to.be.lessThan(400);
      expect(node.brightnessStepTunableWhite).to.be.lessThan(400);
      expect(command.payload.on).to.equal(undefined);
    });
  });

  it("clears queue and resets tunable white step on stop", () => {
    withFakeTimers(({ tick, activeIntervals }) => {
      const { node, hueCommands, hueQueueDeletes } = instantiateNode();

      node.currentHUEDevice = {
        on: { on: true },
        dimming: { brightness: 60 },
        color_temperature: { mirek: 350 },
      };

      node.hueDimmingTunableWhite(1, 1, 1000);
      tick();
      hueCommands.length = 0;

      node.hueDimmingTunableWhite(0, 0, 1000);

      expect(hueQueueDeletes).to.include("test-light");
      expect(activeIntervals).to.have.lengthOf(0);
      expect(node.brightnessStepTunableWhite).to.equal(null);
      expect(hueCommands).to.have.lengthOf(0);
    });
  });
});

describe("knxUltimateHueLight timer-driven effects", () => {
  it("toggles Hue commands while blink timer is active", () => {
    withFakeTimers(({ tick, activeIntervals }) => {
      const { node, config, hueCommands } = instantiateNode({
        GALightBlink: "1/1/8",
        dptLightBlink: "1.001",
      });

      node.currentHUEDevice = { on: { on: false } };

      node.handleSend(createSwitchTelegram(config.GALightBlink, Buffer.from([1])));

      expect(activeIntervals).to.have.lengthOf(1);

      tick();
      tick();

      expect(hueCommands).to.have.lengthOf(2);
      expect(hueCommands[0].payload.on).to.deep.equal({ on: false });
      expect(hueCommands[1].payload.on).to.deep.equal({ on: true });

      node.handleSend(createSwitchTelegram(config.GALightBlink, Buffer.from([0])));

      expect(activeIntervals).to.have.lengthOf(0);
      expect(hueCommands).to.have.lengthOf(3);
      expect(hueCommands[2].payload.on).to.deep.equal({ on: false });
    });
  });

  it("cycles random colors while color cycle is running", () => {
    withFakeTimers(({ tick, activeIntervals }) => {
      const { node, config, hueCommands } = instantiateNode({
        GALightColorCycle: "1/1/9",
        dptLightColorCycle: "1.001",
      });

      node.currentHUEDevice = {
        on: { on: false },
        color: {
          gamut: {
            red: { x: 0.7, y: 0.3 },
            green: { x: 0.17, y: 0.7 },
            blue: { x: 0.15, y: 0.06 },
          },
        },
      };

      const originalRandom = Math.random;
      let seed = 0;
      Math.random = () => {
        seed = (seed + 1) % 10;
        return seed / 10;
      };

      try {
        node.handleSend(createSwitchTelegram(config.GALightColorCycle, Buffer.from([1])));

        expect(activeIntervals).to.have.lengthOf(1);
        expect(hueCommands).to.have.lengthOf(1);

        tick();

        expect(hueCommands).to.have.lengthOf(2);
        const cycleCommand = hueCommands[1];
        expect(cycleCommand.payload.color.xy).to.have.keys(["x", "y"]);

        node.handleSend(createSwitchTelegram(config.GALightColorCycle, Buffer.from([0])));
        expect(activeIntervals).to.have.lengthOf(0);
      } finally {
        Math.random = originalRandom;
      }
    });
  });
});

describe("knxUltimateHueLight handleSendHUE events", () => {
  it("propagates Hue light state to KNX telemetry", async () => {
    const overrides = {
      GALightState: "1/1/11",
      dptLightState: "1.001",
      GALightBrightnessState: "1/1/10",
      dptLightBrightnessState: "5.001",
      GALightColorState: "1/1/12",
      dptLightColorState: "232.600",
      GALightKelvinState: "1/1/14",
      dptLightKelvinState: "7.600",
      GALightKelvinPercentageState: "1/1/15",
      dptLightKelvinPercentageState: "5.001",
    };
    const { node, knxTelegrams, sentMessages } = instantiateNode(overrides);

    node.currentHUEDevice = {
      on: { on: true },
      dimming: { brightness: 80 },
      color: { xy: { x: 0.3, y: 0.3 } },
      color_temperature: { mirek: 250, mirel_valid: true },
    };

    const hueEvent = {
      id: node.hueDevice,
      type: "light",
      on: { on: false },
      dimming: { brightness: 0 },
      color_temperature: { mirek: 330, mirel_valid: true },
      color: { xy: { x: 0.2, y: 0.25 } },
    };

    await node.handleSendHUE(hueEvent);

    expect(sentMessages).to.have.lengthOf(1);
    expect(sentMessages[0].id).to.equal(node.hueDevice);

    const framesByGa = Object.fromEntries(knxTelegrams.map((frame) => [frame.grpaddr, frame]));

    expect(framesByGa).to.have.property(overrides.GALightState);
    expect(framesByGa[overrides.GALightState]).to.deep.include({ payload: false, dpt: overrides.dptLightState });

    expect(framesByGa).to.have.property(overrides.GALightBrightnessState);
    expect(framesByGa[overrides.GALightBrightnessState]).to.deep.include({ payload: 0, dpt: overrides.dptLightBrightnessState });

    expect(framesByGa).to.have.property(overrides.GALightKelvinState);
    const kelvinFrame = framesByGa[overrides.GALightKelvinState];
    const expectedKelvin = ColorConverter.mirekToKelvin(330);
    expect(kelvinFrame).to.deep.include({ payload: expectedKelvin, dpt: overrides.dptLightKelvinState });

    if (overrides.GALightKelvinPercentageState && framesByGa[overrides.GALightKelvinPercentageState] !== undefined) {
      expect(framesByGa[overrides.GALightKelvinPercentageState]).to.deep.include({
        payload: expectedKelvin,
        dpt: overrides.dptLightKelvinPercentageState,
      });
    }

    expect(framesByGa).to.have.property(overrides.GALightColorState);
    const colorFrame = framesByGa[overrides.GALightColorState];
    const expectedRgb = ColorConverter.xyBriToRgb(hueEvent.color.xy.x, hueEvent.color.xy.y, 100);
    expect(colorFrame.payload).to.deep.equal({
      red: expectedRgb.r,
      green: expectedRgb.g,
      blue: expectedRgb.b,
    });

    expect(node.currentHUEDevice.on.on).to.equal(false);
    expect(node.currentHUEDevice.dimming.brightness).to.equal(80);
    expect(node.currentHUEDevice.color_temperature.mirek).to.equal(330);
  });

  it("averages grouped light data and updates KNX Kelvin state", async () => {
    const overrides = {
      hueDevice: "group-1#grouped_light",
      GALightKelvinState: "2/2/1",
      dptLightKelvinState: "7.600",
      GALightKelvinPercentageState: "2/2/2",
      dptLightKelvinPercentageState: "5.001",
    };
    const { node, knxTelegrams, hueServer, sentMessages } = instantiateNode(overrides);

    node.currentHUEDevice = {
      on: { on: true },
      dimming: { brightness: 70 },
      color: { xy: { x: 0.3, y: 0.3 } },
      color_temperature: { mirek: 300, mirel_valid: true },
    };

    const groupLights = [
      {
        id: "lamp-1",
        metadata: { name: "Lamp 1" },
        color_temperature: { mirek: 300, mirel_valid: true },
        dimming: { brightness: 60 },
      },
      {
        id: "lamp-2",
        metadata: { name: "Lamp 2" },
        color_temperature: { mirek: 320, mirel_valid: true },
        dimming: { brightness: 40 },
      },
    ];

    hueServer.getAllLightsBelongingToTheGroup = async () => groupLights;
    const averageMirek = 315;
    hueServer.getAverageColorsXYBrightnessAndTemperature = async () => ({ mirek: averageMirek });

    const hueEvent = {
      id: "lamp-1",
      type: "light",
      color_temperature: { mirek: 310, mirel_valid: true },
    };

    await node.handleSendHUE(hueEvent);

    expect(sentMessages).to.have.lengthOf(1);
    expect(sentMessages[0].lightName).to.equal("Lamp 1");

    const expectedKelvin = ColorConverter.mirekToKelvin(averageMirek);

    const framesByGa = Object.fromEntries(knxTelegrams.map((frame) => [frame.grpaddr, frame]));
    expect(framesByGa).to.have.property(overrides.GALightKelvinState);
    expect(framesByGa[overrides.GALightKelvinState]).to.deep.include({ payload: expectedKelvin });
    if (framesByGa[overrides.GALightKelvinPercentageState] !== undefined) {
      expect(framesByGa[overrides.GALightKelvinPercentageState]).to.deep.include({ payload: expectedKelvin });
    }

    expect(node.currentHUEDevice.color_temperature.mirek).to.equal(averageMirek);
  });

  it("averages grouped light colors when mirek is unavailable", async () => {
    const overrides = {
      hueDevice: "group-2#grouped_light",
      GALightColorState: "2/3/1",
      dptLightColorState: "232.600",
    };
    const { node, knxTelegrams, hueServer, sentMessages } = instantiateNode(overrides);

    node.currentHUEDevice = {
      on: { on: true },
      dimming: { brightness: 65 },
      color: { xy: { x: 0.28, y: 0.32 } },
      color_temperature: {},
    };

    const groupLights = [
      {
        id: "lamp-a",
        metadata: { name: "Lamp A" },
        color: { xy: { x: 0.4, y: 0.35 } },
        dimming: { brightness: 70 },
      },
      {
        id: "lamp-b",
        metadata: { name: "Lamp B" },
        color: { xy: { x: 0.2, y: 0.25 } },
        dimming: { brightness: 55 },
      },
    ];

    hueServer.getAllLightsBelongingToTheGroup = async () => groupLights;
    hueServer.getAverageColorsXYBrightnessAndTemperature = async () => ({
      x: 0.3,
      y: 0.3,
      brightness: 62.5,
    });

    const hueEvent = {
      id: "lamp-a",
      type: "light",
      color: { xy: { x: 0.41, y: 0.34 } },
    };

    await node.handleSendHUE(hueEvent);

    expect(sentMessages).to.have.lengthOf(1);
    expect(sentMessages[0].lightName).to.equal("Lamp A");

    const framesByGa = Object.fromEntries(knxTelegrams.map((frame) => [frame.grpaddr, frame]));
    expect(framesByGa).to.have.property(overrides.GALightColorState);
    const colorFrame = framesByGa[overrides.GALightColorState];
    const expectedRgb = ColorConverter.xyBriToRgb(0.3, 0.3, 100);
    expect(colorFrame.payload).to.deep.equal({
      red: expectedRgb.r,
      green: expectedRgb.g,
      blue: expectedRgb.b,
    });

    expect(node.currentHUEDevice.color.xy).to.deep.equal({ x: 0.3, y: 0.3 });
  });
});

describe("knxUltimateHueLight KNX read responses", () => {
  it("replies with the cached light state when a read request arrives", () => {
    const { node, config, knxTelegrams } = instantiateNode({
      GALightState: "1/1/11",
      dptLightState: "1.001",
    });

    node.currentHUEDevice = { on: { on: true }, dimming: { brightness: 45 } };

    const readMsg = createSwitchTelegram(config.GALightState, Buffer.from([0]), "GroupValue_Read");
    node.handleSend(readMsg);

    expect(knxTelegrams).to.have.lengthOf(1);
    expect(knxTelegrams[0]).to.deep.include({
      grpaddr: config.GALightState,
      payload: true,
      dpt: config.dptLightState,
      outputtype: "response",
    });
  });

  it("reports KNX brightness status after malformed KNX write attempt", () => {
    const { node, config, knxTelegrams, statuses } = instantiateNode({
      GALightBrightness: "1/1/3",
      dptLightBrightness: "5.001",
      GALightBrightnessState: "1/1/13",
      dptLightBrightnessState: "5.001",
    });

    node.currentHUEDevice = { on: { on: true }, dimming: { brightness: 60 } };

    const malformed = createSwitchTelegram(config.GALightBrightness, Buffer.alloc(0));
    expect(() => node.handleSend(malformed)).to.not.throw();

    expect(knxTelegrams).to.have.lengthOf(0);
    const lastStatus = statuses[statuses.length - 1] || {};
    expect(lastStatus.fill).to.equal("red");
  });

  it("forwards cached color state on KNX read even after failed color write", () => {
    const { node, config, knxTelegrams, statuses } = instantiateNode({
      GALightColor: "1/1/4",
      dptLightColor: "232.600",
      GALightColorState: "1/1/12",
      dptLightColorState: "232.600",
    });

    node.currentHUEDevice = {
      on: { on: true },
      dimming: { brightness: 70 },
      color: { gamut: null, xy: { x: 0.2, y: 0.3 } },
    };

    const originalError = console.error;
    console.error = () => {};
    try {
      const malformed = createSwitchTelegram(config.GALightColor, Buffer.from([1, 2]));
      expect(() => node.handleSend(malformed)).to.not.throw();
    } finally {
      console.error = originalError;
    }

    const readMsg = createSwitchTelegram(config.GALightColorState, Buffer.alloc(3), "GroupValue_Read");
    node.handleSend(readMsg);

    expect(knxTelegrams).to.have.lengthOf(1);
    const frame = knxTelegrams[0];
    expect(frame.grpaddr).to.equal(config.GALightColorState);
    expect(frame.outputtype).to.equal("response");
    const expectedRgb = ColorConverter.xyBriToRgb(
      node.currentHUEDevice.color.xy.x,
      node.currentHUEDevice.color.xy.y,
      100,
    );
    expect(frame.payload).to.deep.equal({
      red: expectedRgb.r,
      green: expectedRgb.g,
      blue: expectedRgb.b,
    });

    expect(statuses.some((entry) => entry.fill === "red")).to.equal(true);
  });
});
