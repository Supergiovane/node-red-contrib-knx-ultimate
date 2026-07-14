/* eslint-disable max-len */
// Factory of the bridged Matter endpoints exposed by knxUltimateMatterBridge.
// Each KNX "virtual device" definition becomes a Matter endpoint under the aggregator.
import { Endpoint } from '@matter/main'
import { BridgedDeviceBasicInformationServer } from '@matter/main/behaviors/bridged-device-basic-information'
import { OnOffServer } from '@matter/main/behaviors/on-off'
import { LevelControlServer } from '@matter/main/behaviors/level-control'
import { OnOffLightDevice } from '@matter/main/devices/on-off-light'
import { DimmableLightDevice } from '@matter/main/devices/dimmable-light'
import { OnOffPlugInUnitDevice } from '@matter/main/devices/on-off-plug-in-unit'
import { TemperatureSensorDevice } from '@matter/main/devices/temperature-sensor'
import { HumiditySensorDevice } from '@matter/main/devices/humidity-sensor'
import { LightSensorDevice } from '@matter/main/devices/light-sensor'
import { OccupancySensorDevice } from '@matter/main/devices/occupancy-sensor'
import { OccupancySensingServer } from '@matter/main/behaviors/occupancy-sensing'
import { ContactSensorDevice } from '@matter/main/devices/contact-sensor'
import { WindowCoveringDevice } from '@matter/main/devices/window-covering'
import { MovementDirection, MovementType, WindowCoveringServer } from '@matter/main/behaviors/window-covering'
import { ThermostatDevice } from '@matter/main/devices/thermostat'
import { ThermostatServer } from '@matter/main/behaviors/thermostat'
import { ExtendedColorLightDevice } from '@matter/main/devices/extended-color-light'
import { ColorTemperatureLightDevice } from '@matter/main/devices/color-temperature-light'
import { ColorControlServer } from '@matter/main/behaviors/color-control'
import { SmokeCoAlarmDevice } from '@matter/main/devices/smoke-co-alarm'
import { SmokeCoAlarmServer } from '@matter/main/behaviors/smoke-co-alarm'
import { WaterLeakDetectorDevice } from '@matter/main/devices/water-leak-detector'
import { AirQualitySensorDevice } from '@matter/main/devices/air-quality-sensor'
import { AirQualityServer } from '@matter/main/behaviors/air-quality'
import { CarbonDioxideConcentrationMeasurementServer } from '@matter/main/behaviors/carbon-dioxide-concentration-measurement'
import { FanDevice } from '@matter/main/devices/fan'
import { RoboticVacuumCleanerDevice } from '@matter/main/devices/robotic-vacuum-cleaner'
import { RvcRunModeServer } from '@matter/main/behaviors/rvc-run-mode'
import { RvcOperationalStateServer } from '@matter/main/behaviors/rvc-operational-state'
import { ModeUtils } from '@matter/main/behaviors/mode-base'
import hueColorConverter from './colorManipulators/hueColorConverter.js'

const { ColorConverter } = hueColorConverter
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const truthy = (v) => v === true || v === 1 || v === '1' || v === 'true' || v === 'on'

// Catalog of the supported virtual device types.
// - functions: the abstract functions the KNX node can feed/receive ('onoff', 'level', 'temperature', ...)
// - commandFunctions: the subset that flows Matter -> KNX (commands from Alexa & Co.)
const BRIDGE_TYPES = {
  onofflight: { device: OnOffLightDevice, functions: ['onoff'], commandFunctions: ['onoff'] },
  onoffplug: { device: OnOffPlugInUnitDevice, functions: ['onoff'], commandFunctions: ['onoff'] },
  dimmablelight: { device: DimmableLightDevice, functions: ['onoff', 'level'], commandFunctions: ['onoff', 'level'] },
  temperaturesensor: { device: TemperatureSensorDevice, functions: ['temperature'], commandFunctions: [] },
  humiditysensor: { device: HumiditySensorDevice, functions: ['humidity'], commandFunctions: [] },
  lightsensor: { device: LightSensorDevice, functions: ['illuminance'], commandFunctions: [] },
  occupancysensor: { device: OccupancySensorDevice, functions: ['occupancy'], commandFunctions: [] },
  contactsensor: { device: ContactSensorDevice, functions: ['contact'], commandFunctions: [] },
  // Custom construction (dedicated server behaviors), handled in createBridgedEndpoint
  windowcovering: { device: null, functions: ['position'], commandFunctions: [] },
  thermostat: { device: null, functions: ['currenttemp', 'setpoint'], commandFunctions: [] },
  rgblight: { device: null, functions: ['onoff', 'level', 'rgb'], commandFunctions: ['onoff', 'level'] },
  colortemperaturelight: { device: null, functions: ['onoff', 'level', 'colortemp'], commandFunctions: ['onoff', 'level'] },
  smokecoalarm: { device: null, functions: ['smoke', 'co'], commandFunctions: [] },
  waterleakdetector: { device: WaterLeakDetectorDevice, functions: ['leak'], commandFunctions: [] },
  airqualitysensor: { device: null, functions: ['co2'], commandFunctions: [] },
  fan: { device: null, functions: ['fanspeed'], commandFunctions: [] },
  robotvacuum: { device: null, functions: ['rvcstate', 'rvcmode'], commandFunctions: [] } // Flow-only (node PINs)
}

// CO2 ppm -> Matter AirQuality classification (1 Good ... 6 ExtremelyPoor)
function co2ToAirQuality (ppm) {
  if (ppm < 800) return 1
  if (ppm < 1000) return 2
  if (ppm < 1400) return 3
  if (ppm < 2000) return 4
  if (ppm < 3000) return 5
  return 6
}

// RVC operational states (Matter enum values, incl. the RVC specific ones)
const RVC_OP_STATES = { stopped: 0, running: 1, paused: 2, error: 3, seekingcharger: 0x40, charging: 0x41, docked: 0x42 }

// KNX payload (decoded DPT value) -> Matter attribute patch for endpoint.set()
function knxValueToMatterPatch (def, fn, value) {
  switch (fn) {
    case 'position': {
      // KNX 5.001 position: 0% = open, 100% = closed (invert flag flips it).
      // Matter lift percent100ths: 0 = open, 10000 = closed.
      let percent = Number(value)
      if (Number.isNaN(percent)) return undefined
      if (def.invertPosition === true) percent = 100 - percent
      if (def.type === 'windowcovering' && def.coverExposeAsDimmableLight === true) {
        // Alexa compatibility mode: light brightness represents how open the cover is.
        // Keep the KNX convention at this boundary and invert only the Matter view.
        const openness = clamp(100 - percent, 0, 100)
        return {
          onOff: { onOff: openness > 0 },
          levelControl: { currentLevel: clamp(Math.round(openness * 254 / 100), 1, 254) }
        }
      }
      return { windowCovering: { currentPositionLiftPercent100ths: clamp(Math.round(percent * 100), 0, 10000) } }
    }
    case 'rgb': {
      // KNX DPT 232.600 payload: { red, green, blue } 0-255 -> Matter hue/saturation (0-254)
      if (value === null || typeof value !== 'object') return undefined
      const red = Number(value.red); const green = Number(value.green); const blue = Number(value.blue)
      if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) return undefined
      const hsv = ColorConverter.rgbToHsv(clamp(red, 0, 255), clamp(green, 0, 255), clamp(blue, 0, 255)) // h,s,v in percent 0-100
      return {
        colorControl: {
          currentHue: clamp(Math.round(hsv.h * 254 / 100), 0, 254),
          currentSaturation: clamp(Math.round(hsv.s * 254 / 100), 0, 254)
        }
      }
    }
    case 'colortemp': {
      // KNX DPT 7.600 carries Kelvin -> Matter mireds (accept mireds too for values < 1000)
      const numeric = Number(value)
      if (Number.isNaN(numeric) || numeric <= 0) return undefined
      const mireds = numeric >= 1000 ? Math.round(1000000 / numeric) : Math.round(numeric)
      return { colorControl: { colorTemperatureMireds: clamp(mireds, 153, 500) } }
    }
    case 'currenttemp': {
      const t = Number(value)
      if (Number.isNaN(t)) return undefined
      return { thermostat: { localTemperature: Math.round(t * 100) } }
    }
    case 'setpoint': {
      const t = Number(value)
      if (Number.isNaN(t)) return undefined
      return { thermostat: { occupiedHeatingSetpoint: clamp(Math.round(t * 100), 700, 3000) } }
    }
    case 'onoff':
      return { onOff: { onOff: truthy(value) } }
    case 'level': {
      const percent = Number(value)
      if (Number.isNaN(percent)) return undefined
      // KNX 0-100% -> Matter level 1-254 (0 is not a valid "on" level for lighting)
      const level = clamp(Math.round(percent * 254 / 100), 1, 254)
      return { levelControl: { currentLevel: level } }
    }
    case 'temperature': {
      const t = Number(value)
      if (Number.isNaN(t)) return undefined
      return { temperatureMeasurement: { measuredValue: Math.round(t * 100) } } // °C -> centi-°C
    }
    case 'humidity': {
      const h = Number(value)
      if (Number.isNaN(h)) return undefined
      return { relativeHumidityMeasurement: { measuredValue: clamp(Math.round(h * 100), 0, 10000) } }
    }
    case 'illuminance': {
      const lux = Number(value)
      if (Number.isNaN(lux)) return undefined
      // Matter: measuredValue = 10000 * log10(lux) + 1 (0 = "too low to measure")
      const measured = lux <= 0 ? 0 : clamp(Math.round(10000 * Math.log10(lux) + 1), 0, 65534)
      return { illuminanceMeasurement: { measuredValue: measured } }
    }
    case 'occupancy':
      return { occupancySensing: { occupancy: { occupied: truthy(value) } } }
    case 'contact':
      return { booleanState: { stateValue: truthy(value) } }
    case 'leak':
      return { booleanState: { stateValue: truthy(value) } } // true = leak detected
    case 'smoke': {
      const alarm = truthy(value)
      return { smokeCoAlarm: { smokeState: alarm ? 2 : 0, expressedState: alarm ? 1 : 0 } } // 2 = critical
    }
    case 'co': {
      const alarm = truthy(value)
      return { smokeCoAlarm: { coState: alarm ? 2 : 0, expressedState: alarm ? 2 : 0 } }
    }
    case 'co2': {
      const ppm = Number(value)
      if (Number.isNaN(ppm) || ppm < 0) return undefined
      return {
        carbonDioxideConcentrationMeasurement: { measuredValue: Math.round(ppm) },
        airQuality: { airQuality: co2ToAirQuality(ppm) }
      }
    }
    case 'fanspeed': {
      const percent = Number(value)
      if (Number.isNaN(percent)) return undefined
      const p = clamp(Math.round(percent), 0, 100)
      return { fanControl: { percentCurrent: p, percentSetting: p, fanMode: p > 0 ? 3 : 0 } } // 3 = High, 0 = Off
    }
    case 'rvcstate': {
      // 'docked' | 'charging' | 'running' | 'paused' | 'stopped' | 'seekingcharger' | 'error' (or the numeric Matter value)
      const key = value !== null && value !== undefined ? value.toString().toLowerCase().trim() : ''
      const state = RVC_OP_STATES[key] !== undefined ? RVC_OP_STATES[key] : Number(value)
      if (Number.isNaN(state)) return undefined
      return { rvcOperationalState: { operationalState: state } }
    }
    case 'rvcmode': {
      const key = value !== null && value !== undefined ? value.toString().toLowerCase().trim() : ''
      if (key !== 'idle' && key !== 'cleaning') return undefined
      return { rvcRunMode: { currentMode: key === 'cleaning' ? 1 : 0 } }
    }
    default:
      return undefined
  }
}

// Wires the ColorControl events of an RGB light and coalesces them into a single
// KNX RGB command. Controllers set the color as hue+saturation OR as X+Y (two separate
// attribute reports each): a short debounce merges them before computing the RGB value.
function attachColorTracker (endpoint, def, onCommand) {
  const tracker = { hue: 0, sat: 0, x: undefined, y: undefined, mode: 0, level: 254, timer: null }

  const flush = () => {
    tracker.timer = null
    try {
      const v01 = clamp((tracker.level === null || tracker.level === undefined ? 254 : Number(tracker.level)) / 254, 0, 1)
      let rgb
      if (tracker.mode === 1 && tracker.x !== undefined && tracker.y !== undefined) {
        // XY color mode (Matter x/y are 0..65536 for 0..1)
        rgb = ColorConverter.xyBriToRgb(tracker.x / 65536, tracker.y / 65536, Math.max(1, Math.round(v01 * 100)))
      } else {
        // Hue/Saturation mode (Matter 0..254 -> 0..1)
        rgb = ColorConverter.hsvToRgb(clamp(tracker.hue / 254, 0, 1), clamp(tracker.sat / 254, 0, 1), Math.max(0.01, v01))
      }
      if (!rgb) return
      onCommand({
        deviceId: def.id,
        fn: 'rgb',
        value: { red: clamp(Math.round(rgb.r), 0, 255), green: clamp(Math.round(rgb.g), 0, 255), blue: clamp(Math.round(rgb.b), 0, 255) }
      })
    } catch (error) { /* empty */ }
  }

  const schedule = () => {
    if (tracker.timer !== null) clearTimeout(tracker.timer)
    tracker.timer = setTimeout(flush, 250)
  }

  endpoint.events.colorControl.currentHue$Changed.on((value, oldValue, context) => {
    try {
      if (value === null || value === undefined) return
      tracker.hue = Number(value)
      if (context?.offline === true) return
      tracker.mode = 0
      schedule()
    } catch (error) { /* empty */ }
  })
  endpoint.events.colorControl.currentSaturation$Changed.on((value, oldValue, context) => {
    try {
      if (value === null || value === undefined) return
      tracker.sat = Number(value)
      if (context?.offline === true) return
      tracker.mode = 0
      schedule()
    } catch (error) { /* empty */ }
  })
  endpoint.events.colorControl.currentX$Changed.on((value, oldValue, context) => {
    try {
      if (value === null || value === undefined) return
      tracker.x = Number(value)
      if (context?.offline === true) return
      tracker.mode = 1
      schedule()
    } catch (error) { /* empty */ }
  })
  endpoint.events.colorControl.currentY$Changed.on((value, oldValue, context) => {
    try {
      if (value === null || value === undefined) return
      tracker.y = Number(value)
      if (context?.offline === true) return
      tracker.mode = 1
      schedule()
    } catch (error) { /* empty */ }
  })
  // Track the brightness (for the RGB computation only: the level command has its own GA)
  endpoint.events.levelControl.currentLevel$Changed.on((value) => {
    try {
      if (value !== null && value !== undefined) tracker.level = Number(value)
    } catch (error) { /* empty */ }
  })
}

/**
 * Creates the bridged Matter endpoint for a virtual device definition.
 * @param {object} def - { id, type, name }
 * @param {string} serialPrefix - stable prefix for serial numbers
 * @param {function} onCommand - callback({ deviceId, fn, value }) for commands coming from Matter controllers.
 *                               'value' is already KNX friendly (boolean for onoff, 0-100 for level).
 * @returns {Endpoint}
 */
function createBridgedEndpoint (def, serialPrefix, onCommand) {
  const typeInfo = BRIDGE_TYPES[def.type]
  if (typeInfo === undefined) throw new Error(`Unsupported Matter bridge device type: ${def.type}`)
  const name = (def.name || def.type).toString().slice(0, 32)

  const initialState = {
    id: `knx-${def.id}`.slice(0, 32),
    bridgedDeviceBasicInformation: {
      nodeLabel: name, // This is the name Alexa/Google/Apple show and use
      productName: name,
      productLabel: name,
      serialNumber: `${serialPrefix}-${def.id}`.slice(0, 32),
      reachable: true
    }
  }
  // Non nullable attributes need a sane initial value
  if (def.type === 'contactsensor') initialState.booleanState = { stateValue: false }
  if (def.type === 'occupancysensor') initialState.occupancySensing = { occupancy: { occupied: false } }
  // Although Matter permits an unknown (null) position, some controllers (including
  // Alexa) then expose only Open/Close instead of percentage positioning. Start with
  // a valid position; KNX or flow feedback replaces it as soon as it is available.
  if (def.type === 'windowcovering' && def.coverExposeAsDimmableLight !== true) {
    initialState.windowCovering = {
      currentPositionLiftPercent100ths: 0,
      targetPositionLiftPercent100ths: 0
    }
  }

  let endpoint

  // Emit controller commands at the command boundary instead of observing attribute
  // changes. This makes the node output truly raw: repeated commands (for example
  // Off while already off) are still forwarded exactly once.
  const RawOnOffBase = def.type === 'onoffplug' ? OnOffServer : OnOffServer.with('Lighting')
  class RawOnOffServer extends RawOnOffBase {
    async on () {
      await super.on()
      onCommand({ deviceId: def.id, fn: 'onoff', value: true, matterCommand: { cluster: 'OnOff', command: 'on' } })
    }

    async off () {
      await super.off()
      onCommand({ deviceId: def.id, fn: 'onoff', value: false, matterCommand: { cluster: 'OnOff', command: 'off' } })
    }
  }

  class RawLevelControlServer extends LevelControlServer.with('Lighting', 'OnOff') {
    async moveToLevel (request) {
      await super.moveToLevel(request)
      const value = clamp(Math.round(Number(request.level) * 100 / 254), 0, 100)
      onCommand({ deviceId: def.id, fn: 'level', value, matterCommand: { cluster: 'LevelControl', command: 'moveToLevel', request } })
    }

    async moveToLevelWithOnOff (request) {
      await super.moveToLevelWithOnOff(request)
      const value = clamp(Math.round(Number(request.level) * 100 / 254), 0, 100)
      onCommand({ deviceId: def.id, fn: 'level', value, matterCommand: { cluster: 'LevelControl', command: 'moveToLevelWithOnOff', request } })
    }
  }

  if (def.type === 'windowcovering' && def.coverExposeAsDimmableLight === true) {
    const invert = def.invertPosition === true
    const emitPosition = (matterPosition, command, request) => {
      let position = clamp(Math.round(matterPosition), 0, 100)
      if (invert) position = 100 - position
      onCommand({
        deviceId: def.id,
        fn: 'position',
        value: position,
        matterCommand: { cluster: command === 'on' || command === 'off' ? 'OnOff' : 'LevelControl', command, request },
        matterDiagnostic: { handler: 'coverAsDimmableLight', command }
      })
    }

    class CoverAsLightOnOffServer extends OnOffServer.with('Lighting') {
      async on () {
        await super.on()
        emitPosition(0, 'on')
      }

      async off () {
        await super.off()
        emitPosition(100, 'off')
      }
    }

    class CoverAsLightLevelServer extends LevelControlServer.with('Lighting', 'OnOff') {
      async moveToLevel (request) {
        await super.moveToLevel(request)
        emitPosition(100 - clamp(Number(request.level) * 100 / 254, 0, 100), 'moveToLevel', request)
      }

      async moveToLevelWithOnOff (request) {
        await super.moveToLevelWithOnOff(request)
        emitPosition(100 - clamp(Number(request.level) * 100 / 254, 0, 100), 'moveToLevelWithOnOff', request)
      }
    }

    endpoint = new Endpoint(DimmableLightDevice.with(CoverAsLightOnOffServer, CoverAsLightLevelServer, BridgedDeviceBasicInformationServer), initialState)
    return endpoint
  }

  if (def.type === 'windowcovering') {
    // The WindowCoveringServer requires the movement logic: we forward it to the KNX bus.
    // Position feedback comes back from the KNX status GA, so we do NOT call the default
    // implementation (which would fake the movement by jumping to the target).
    const invert = def.invertPosition === true
    class KnxCoverServer extends WindowCoveringServer.with('Lift', 'PositionAwareLift') {
      async handleMovement (type, reversed, direction, targetPercent100ths) {
        try {
          if (type !== MovementType.Lift) return
          const matterDiagnostic = {
            handler: 'handleMovement',
            movementType: type,
            reversed: reversed === true,
            direction,
            directionName: direction === MovementDirection.DefinedByPosition
              ? 'DefinedByPosition'
              : direction === MovementDirection.Open ? 'Open' : direction === MovementDirection.Close ? 'Close' : 'Unknown',
            targetPercent100ths: targetPercent100ths ?? null
          }
          if (direction === MovementDirection.DefinedByPosition && targetPercent100ths !== undefined && targetPercent100ths !== null) {
            let percent = Math.round(Number(targetPercent100ths) / 100)
            if (invert) percent = 100 - percent
            onCommand({ deviceId: def.id, fn: 'position', value: clamp(percent, 0, 100), matterDiagnostic })
          } else if (direction === MovementDirection.Open || direction === MovementDirection.Close) {
            // KNX DPT 1.008: 0 = up/open, 1 = down/close
            onCommand({ deviceId: def.id, fn: 'updown', value: direction === MovementDirection.Close, matterDiagnostic })
          }
        } catch (error) { /* empty */ }
      }

      async handleStopMovement () {
        try {
          onCommand({
            deviceId: def.id,
            fn: 'stop',
            value: true,
            matterDiagnostic: { handler: 'handleStopMovement' }
          })
        } catch (error) { /* empty */ }
        return super.handleStopMovement()
      }
    }
    endpoint = new Endpoint(WindowCoveringDevice.with(KnxCoverServer, BridgedDeviceBasicInformationServer), initialState)
    return endpoint
  }

  if (def.type === 'thermostat') {
    initialState.thermostat = {
      localTemperature: null,
      occupiedHeatingSetpoint: 2000, // 20°C
      controlSequenceOfOperation: 2, // HeatingOnly
      systemMode: 4 // Heat
    }
    endpoint = new Endpoint(ThermostatDevice.with(ThermostatServer.with('Heating'), BridgedDeviceBasicInformationServer), initialState)
    // Setpoint changes from a Matter controller (attribute write or setpointRaiseLower command)
    endpoint.events.thermostat.occupiedHeatingSetpoint$Changed.on((value, oldValue, context) => {
      try {
        if (context?.offline === true) return
        if (value === null || value === undefined) return
        onCommand({ deviceId: def.id, fn: 'setpoint', value: Math.round(Number(value)) / 100 }) // centi-°C -> °C
      } catch (error) { /* empty */ }
    })
    return endpoint
  }

  if (def.type === 'occupancysensor') {
    // The OccupancySensing cluster is not added by default: the sensor type must be chosen (we expose it as PIR)
    endpoint = new Endpoint(OccupancySensorDevice.with(OccupancySensingServer.with('PassiveInfrared'), BridgedDeviceBasicInformationServer), initialState)
  } else if (def.type === 'rgblight') {
    // colorMode/enhancedColorMode and the color attributes are mandatory initial values
    initialState.colorControl = {
      colorMode: 0, // CurrentHueAndCurrentSaturation
      enhancedColorMode: 0,
      currentHue: 0,
      currentSaturation: 0,
      currentX: Math.round(0.31 * 65536),
      currentY: Math.round(0.33 * 65536)
    }
    endpoint = new Endpoint(ExtendedColorLightDevice.with(RawOnOffServer, RawLevelControlServer, ColorControlServer.with('HueSaturation', 'Xy'), BridgedDeviceBasicInformationServer), initialState)
    attachColorTracker(endpoint, def, onCommand)
  } else if (def.type === 'colortemperaturelight') {
    initialState.colorControl = {
      colorMode: 2, // ColorTemperatureMireds
      enhancedColorMode: 2,
      colorTempPhysicalMinMireds: 153, // 6500 K
      colorTempPhysicalMaxMireds: 500, // 2000 K
      colorTemperatureMireds: 250,
      startUpColorTemperatureMireds: 250,
      coupleColorTempToLevelMinMireds: 153
    }
    endpoint = new Endpoint(ColorTemperatureLightDevice.with(RawOnOffServer, RawLevelControlServer, ColorControlServer.with('ColorTemperature'), BridgedDeviceBasicInformationServer), initialState)
    endpoint.events.colorControl.colorTemperatureMireds$Changed.on((value, oldValue, context) => {
      try {
        if (context?.offline === true) return
        if (value === null || value === undefined || Number(value) <= 0) return
        onCommand({ deviceId: def.id, fn: 'colortemp', value: Math.round(1000000 / Number(value)) }) // mireds -> Kelvin
      } catch (error) { /* empty */ }
    })
  } else if (def.type === 'smokecoalarm') {
    initialState.smokeCoAlarm = {
      expressedState: 0, // Normal
      smokeState: 0,
      coState: 0,
      batteryAlert: 0,
      testInProgress: false,
      hardwareFaultAlert: false,
      endOfServiceAlert: 0
    }
    endpoint = new Endpoint(SmokeCoAlarmDevice.with(SmokeCoAlarmServer.with('SmokeAlarm', 'CoAlarm'), BridgedDeviceBasicInformationServer), initialState)
  } else if (def.type === 'waterleakdetector') {
    initialState.booleanState = { stateValue: false }
    endpoint = new Endpoint(WaterLeakDetectorDevice.with(BridgedDeviceBasicInformationServer), initialState)
  } else if (def.type === 'airqualitysensor') {
    initialState.airQuality = { airQuality: 0 } // Unknown
    initialState.carbonDioxideConcentrationMeasurement = {
      measuredValue: null,
      minMeasuredValue: null,
      maxMeasuredValue: null,
      measurementUnit: 0, // PPM
      measurementMedium: 0 // Air
    }
    endpoint = new Endpoint(AirQualitySensorDevice.with(
      AirQualityServer.with('Fair', 'Moderate', 'VeryPoor', 'ExtremelyPoor'),
      CarbonDioxideConcentrationMeasurementServer.with('NumericMeasurement'),
      BridgedDeviceBasicInformationServer
    ), initialState)
  } else if (def.type === 'fan') {
    initialState.fanControl = {
      fanMode: 0, // Off
      fanModeSequence: 0, // Off/Low/Med/High (Auto requires the AUT feature)
      percentSetting: 0,
      percentCurrent: 0
    }
    endpoint = new Endpoint(FanDevice.with(BridgedDeviceBasicInformationServer), initialState)
    // Speed changes from the controller (percent write or fan mode change)
    endpoint.events.fanControl.percentSetting$Changed.on((value, oldValue, context) => {
      try {
        if (context?.offline === true) return
        if (value === null || value === undefined) return
        onCommand({ deviceId: def.id, fn: 'fanspeed', value: clamp(Math.round(Number(value)), 0, 100) })
      } catch (error) { /* empty */ }
    })
    endpoint.events.fanControl.fanMode$Changed.on((value, oldValue, context) => {
      try {
        if (context?.offline === true) return
        if (Number(value) === 0) onCommand({ deviceId: def.id, fn: 'fanspeed', value: 0 })
      } catch (error) { /* empty */ }
    })
  } else if (def.type === 'robotvacuum') {
    // Flow-only device: run mode changes and operational commands are forwarded to the flow
    // (node PINs); the flow reports the state back through the input PIN.
    class KnxRvcRunModeServer extends RvcRunModeServer {
      changeToMode ({ newMode }) {
        try {
          const result = ModeUtils.assertModeChange(this.state.supportedModes, this.state.currentMode, newMode)
          if (result.status !== 0) return result
          this.state.currentMode = newMode
          return result
        } catch (error) {
          return { status: 2, statusText: error.message } // GenericFailure
        }
      }
    }
    class KnxRvcOperationalStateServer extends RvcOperationalStateServer {
      async goHome () {
        try { onCommand({ deviceId: def.id, fn: 'rvccommand', value: 'gohome' }) } catch (error) { /* empty */ }
        return { commandResponseState: { errorStateId: 0 } }
      }

      async pause () {
        try { onCommand({ deviceId: def.id, fn: 'rvccommand', value: 'pause' }) } catch (error) { /* empty */ }
        return { commandResponseState: { errorStateId: 0 } }
      }

      async resume () {
        try { onCommand({ deviceId: def.id, fn: 'rvccommand', value: 'resume' }) } catch (error) { /* empty */ }
        return { commandResponseState: { errorStateId: 0 } }
      }
    }
    initialState.rvcRunMode = {
      supportedModes: [
        { label: 'Idle', mode: 0, modeTags: [{ value: 0x4000 }] }, // RvcRunMode.ModeTag.Idle
        { label: 'Cleaning', mode: 1, modeTags: [{ value: 0x4001 }] } // RvcRunMode.ModeTag.Cleaning
      ],
      currentMode: 0
    }
    initialState.rvcOperationalState = {
      operationalStateList: [
        { operationalStateId: RVC_OP_STATES.stopped },
        { operationalStateId: RVC_OP_STATES.running },
        { operationalStateId: RVC_OP_STATES.paused },
        { operationalStateId: RVC_OP_STATES.error },
        { operationalStateId: RVC_OP_STATES.seekingcharger },
        { operationalStateId: RVC_OP_STATES.charging },
        { operationalStateId: RVC_OP_STATES.docked }
      ],
      operationalState: RVC_OP_STATES.docked
    }
    endpoint = new Endpoint(RoboticVacuumCleanerDevice.with(KnxRvcRunModeServer, KnxRvcOperationalStateServer, BridgedDeviceBasicInformationServer), initialState)
    // Run mode changed by a controller ("Alexa, start cleaning")
    endpoint.events.rvcRunMode.currentMode$Changed.on((value, oldValue, context) => {
      try {
        if (context?.offline === true) return
        onCommand({ deviceId: def.id, fn: 'rvcmode', value: Number(value) === 1 ? 'cleaning' : 'idle' })
      } catch (error) { /* empty */ }
    })
  } else {
    let device = typeInfo.device
    if (typeInfo.commandFunctions.includes('onoff')) device = device.with(RawOnOffServer)
    if (typeInfo.commandFunctions.includes('level')) device = device.with(RawLevelControlServer)
    endpoint = new Endpoint(device.with(BridgedDeviceBasicInformationServer), initialState)
  }

  return endpoint
}

export { BRIDGE_TYPES, createBridgedEndpoint, knxValueToMatterPatch }
