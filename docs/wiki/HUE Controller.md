---
layout: wiki
title: "HUE Controller"
lang: en
permalink: /wiki/HUE%20Controller
---
# HUE Controller

[**KNX-Ultimate video tutorials (YouTube playlist)**](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)

<div data-hue-controller-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 55%,#2a8dff 100%);box-shadow:0 14px 30px rgba(11,45,90,0.24);color:#f4f9ff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#cfe4ff;">Hue API v2 · KNX · Node-RED</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">One node. Fifteen Hue functions.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f4f9ff;">HUE Controller brings the complete feature set of the established dedicated Hue nodes into one maintained, self-contained node. Choose the function you need; the editor, KNX mappings, Hue resource selector and flow pins adapt to it.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">15</strong><span style="font-size:0.76rem;color:#e8f3ff;">device functions</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">Hue API v2</strong><span style="font-size:0.76rem;color:#e8f3ff;">native resources</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">KNX</strong><span style="font-size:0.76rem;color:#e8f3ff;">optional integration</span></div>
  </div>
</div>

## Everything available from one node

| Area | Functions | Main capabilities |
|---|---|---|
| **Lighting & power** | Light / grouped light, Plug | On/Off, relative and absolute dimming, tunable white, RGB/HSV, effects, day/night presets, locate, power control and bidirectional feedback. |
| **Scenes & controls** | Scene, Button, Tap dial | Single or numbered scene recall, DPT 1/18 mappings, short/long/repeat presses, toggle logic and rotary events. |
| **Presence & security** | Motion, Area motion, Camera motion, Contact | Motion and open/closed states, startup synchronisation, KNX publication and optional flow events. |
| **Environment** | Light level, Temperature, Humidity | Hue sensor readings mapped to their appropriate KNX datapoints. |
| **Device health** | Battery, Zigbee connectivity, Software update | Battery percentage, connectivity state and software-update availability on KNX or the Node-RED flow. |

## A consistent Controller experience

- Function-aware Hue resource autocomplete and refresh.
- Capability-aware light mappings: Dim, Tunable White, RGB/HSV and native effects follow the live `dimming`, `color_temperature`, `color` and `effects` properties of the selected Hue API v2 light resource.
- Bounded Light-editor readiness wait: a spinning hourglass is shown while the Hue Bridge loads its resources, polling every 500 ms and releasing the editor with a localized error after about 10 seconds. Save, close and function changes cancel the timer.
- Compact KNX mapping rows keep GA, DPT and Name on one line; DPT and Name controls use reduced widths, with Name allowed to contract on narrow editor trays without altering its stored value.
- Optional KNX gateway: use Group Addresses or imported ETS names; compatible datapoints come from the selected gateway.
- Profile-driven Node-RED pins for validated Hue API v2 input and Hue event output where supported.
- Startup state reads, Hue-to-KNX status synchronisation and loop protection inherited by each private profile.
- Fully local migration for all fifteen deprecated node types, followed by an editable usage email draft, a donation page in a new browser window, local review and manual Deploy.

## Start in four steps

1. Configure the **Hue Bridge** once.
2. Add **HUE Controller**, select the **Device function**, then choose or refresh the matching Hue resource.
3. Select a **KNX Gateway** and map the available commands/statuses, or leave it at `none` for flow-only use.
4. Set the function-specific behaviour and Node-RED pins, deploy, and verify the live node status.

> **No KNX gateway?** The Controller remains useful as a Hue-to-Node-RED integration. KNX fields are hidden and the flow options supported by the selected function remain available.

The sections below are the complete per-function reference consolidated from the former dedicated nodes.

## Convert legacy HUE nodes

The migration button appears only when the Node-RED editor detects at least one legacy HUE node in the current flows. The same orange button is available directly below the deprecation notice in every legacy HUE editor. The disclaimer confirms that no flow or node data leaves the browser.

Press **Convert legacy HUE nodes** and confirm. The browser performs the entire conversion locally and sends no flow, node, `hue-config`, `knxUltimate-config`, group-address, wiring, credential, name, position or node-ID data anywhere. After a successful conversion, it opens an editable email draft addressed to the author without navigating away from Node-RED and opens the donation page in a new browser window. The draft contains only the number of converted nodes and space for optional notes; you decide whether to send it, it is never sent automatically, and no flow data is added to the PayPal link.

Before starting, export a backup of your flows. The browser closes the current node editor and changes only the matched legacy HUE nodes into HUE Controller instances. All saved node properties, configuration references, positions, group membership and wiring remain unchanged. The workspace is marked dirty, but the tool never deploys it: review the result and click **Deploy** yourself. A changed node, locked flow or local conversion error leaves the workspace unchanged. **Safety check:** before Deploy, inspect every modified HUE node and verify its function, configuration references, input/output pins and wiring. When the process finishes, a fixed Node-RED message remains visible until you click **OK**.

Hue events remain status updates and do not become new Hue commands. HUE Controller contains private runtime, editor, template and translation profiles, so it does not depend on loading the deprecated node types. The original Hue Light node remains unchanged. Dedicated Hue nodes remain registered for existing flows, but are frozen and receive no new features or maintenance updates. Node-RED hides their special `deprecated` category from the palette; existing instances remain editable and deployable, use a lighter color than HUE Controller, are marked `(deprecated)` on the canvas, and show a migration notice at the top of their editor.

<!-- HUE_CONTROLLER_PROFILE_DOCS_START -->

## Device function

- [Light / grouped light (`light`)](#hue-controller-docs-light)
- [Plug / outlet (`plug`)](#hue-controller-docs-plug)
- [Button (`button`)](#hue-controller-docs-button)
- [Tap dial (`relative_rotary`)](#hue-controller-docs-relative_rotary)
- [Motion (`motion`)](#hue-controller-docs-motion)
- [Area motion (`area_motion`)](#hue-controller-docs-area_motion)
- [Camera motion (`camera_motion`)](#hue-controller-docs-camera_motion)
- [Contact (`contact`)](#hue-controller-docs-contact)
- [Light level (`light_level`)](#hue-controller-docs-light_level)
- [Temperature (`temperature`)](#hue-controller-docs-temperature)
- [Humidity (`humidity`)](#hue-controller-docs-humidity)
- [Scene (`scene`)](#hue-controller-docs-scene)
- [Battery (`device_power`)](#hue-controller-docs-device_power)
- [Zigbee connectivity (`zigbee_connectivity`)](#hue-controller-docs-zigbee_connectivity)
- [Device software update (`device_software_update`)](#hue-controller-docs-device_software_update)

<span id="hue-controller-docs-light" data-hue-controller-type="light"></span>

## Light / grouped light (`light`)

This node controls Philips Hue lights (single or grouped) and maps their commands/states to KNX.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Name | Hue light or grouped light to use (autocomplete while typing).|

**Locate device**

Use the `Locate` button (play icon) to start a Hue identify session for the selected resource. While the session is active the button switches to a stop icon and the bridge makes the light — or every light in the grouped resource — blink once per second. Press the button again to stop immediately; otherwise the session ends automatically after 10 minutes.

**OPTIONS**

Here you can link KNX Group Addresses to the available Hue commands/states.

Start typing in the GA field (name or Group Address); suggestions appear while you type.

**Switch**

|Property|Description|
|--|--|
| Control | This GA is used to turn on/off the Hue light via a boolean KNX value true/false|
| Status | Link this to the light's switch status group address|

**Dim**

|Property|Description|
|--|--|
| Control dim | Relative DIM of the Hue light. You can set the dimming speed in the **Behaviour** tab. |
| Control % | Changes the absolute Hue light's brightness (0-100%)|
| Status % | Link this to the light's brightness status KNX group address |
| Dim Speed (ms) | Dimming speed in milliseconds. Applies to both the light brightness and the tunable-white datapoints. Calculated over the 0%→100% range. |
| Min Dim brightness | Tha Minimum brightness that the lamp can reach. For example, if you are dimming the light down, the light will stop dimming at the specified brightness %. |
| Max Dim brightness | Tha Maximum brightness that the lamp can reach. For example, if you are dimming the light up, the light will stop dimming at the specified brightness %. |

**Tunable White**

|Property|Description|
|--|--|
| Control dim | Change white temperature using DPT 3.007 dimming. Speed is set in the **Behaviour** tab.|
| Control % | Change white temperature using DPT 5.001. 0 = full warm, 100 = full cold.|
| Status %| Temperature status GA. DPT 5.001 absolute value: 0 = full warm, 100 = full cold.|
| Control kelvin | **DPT 7.600: ** set temperature in Kelvin using the KNX range 2000-6535 (converted to Hue mirek).
**DPT 9.002:** set temperature using Hue range 2000-6535 K (Ambiance starts at 2200 K). Conversions may introduce small deviations.|
| Status kelvin | **DPT 7.600: ** read temperature in Kelvin using KNX range 2000-6535 (converted from Hue).
**DPT 9.002:** read temperature using Hue range 2000-6535 K (Ambiance starts at 2200 K). Conversions may introduce small deviations. |
| Invert dim direction | Inverts the DIM direction. |

**RGB/HSV**

|Property|Description|
|--|--|
| **RGB section** ||
| Control rgb| Change color using RGB triplet (r,g,b). Gamut correction is handled. Sending a color turns the light on and sets color/brightness (perceptual). Sending r,g,b = 0 turns the light off. |
| Status rgb | The light's color status group address. Accepted datapoint is RGB triplet (r,g,b)|
| **HSV section** ||
| Color H dim | Cycle through HSV hue using DPT 3.007 dimming. Speed is set in the **Behaviour** tab.|
| Status H %| Status of the HSV chromatic circle.|
| Control S dim | Changes the light's color saturation, using DPT 3.007 dimming. You can set the dimming speed in the **_Behaviour_** tab.|
| Status S %| The light color saturation status group address.|
| Dim Speed (ms) | The dimming speed, in Milliseconds, from bottom to top scale. |

For controlling the HSV "V” (brightness), use the standard controls under the **Dim** tab.

**Effects**

_Non-Hue basic effects_

|Property|Description|
|--|--|
| Blink | _true_ Blink the light, _false_ Stop blinking. Blinks the light on and off. Useful for signalling. Works with all Hue lights. |
| Color Cycle | _true_ start cycle, _false_ Stop cycle. Randomly changes the Hue light's color at regular interval. Works with all Hue lights having color capabilities. The color effect will start 10 seconds after set. |

_Hue native effects_

Use the **Hue native effects** table to map your KNX values to the effects supported by the selected light (for example `candle`, `fireplace`, `prism`). Each row links a KNX value (boolean, numeric or textual, depending on the datapoint you pick) with a Hue effect. On the KNX side you can:

- send the mapped value to activate that effect;
- optionally provide a status Group Address: the node emits the mapped value whenever the Hue bridge reports an effect change; if no mapping exists the raw effect name is sent (requires a textual DPT such as 16.xxx).

**Behaviour**

| Property | Description |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Read status at startup | Read the Hue light status at node-red's startup or node-red's full deploy, and send that status to the KNX BUS |
| KNX Brightness Status | Updates the KNX brightness group address status, whenever the Hue lamp is switched ON/OFF. The options are **When Hue light is Off send 0%. When Hue On, restore previous value (Default KNX behaviour) ** and**Leave as is (default Hue behaviour) ** . If you have KNX dimmer with brightness status, like MDT, the suggested option is _**When Hue light is Off send 0%. When Hue On, restore previous value (Default KNX behaviour)** _ |
| Update local cached Hue state from KNX bus writes | Advanced option, enabled by default. When enabled, writes arriving from the KNX bus also update the node's local cached Hue state immediately, without waiting for feedback/events from the Hue bridge. This gives faster local reactions and more consistent immediate KNX read responses, especially while the light or grouped light is OFF. Disable it if you prefer the cache to follow only real feedback/events from the Hue bridge. |
| Switch on behaviour | It sets the behaviour of your lights when switched on. You can choose from differents behaviours.
 **Select color: ** the light will be switched on with the color of your choice. To change color, just CLICK on the color selector (under the _Select color_ control).
**Select temperature and brightness: ** the light will be switched on with the temperature (Kelvin) and brightness (0-100) of your choice.
**None:** the light will retain its last status. In case you've enable the night lighting, after the night time ends, the lamp will resume the color/temperature/brightness state set at day time. |
| Night Lighting | It allows to set a particular light color/brightness at nighttime. The options are the same as the daytime. You could select either a temperature/brightness or color. A cozy temperature of 2700 Kelvin, with a brightness of 10% or 20%, is a good choice for bathroom's night light.|
| Day/Night | Select the group address used to set the day/night behaviour. The group address value is _true_ if daytime, _false_ if nighttime. |
| Invert day/night value | Invert the values of _Day/Night_ group address. Default value is **unchecked** . |
| Read status at startup | Read the status at startup and emit the event to the KNX bus at startup/reconnection. (Default "no")|
| Force day mode | You can force the day mode by manually switching the light as described here: **Switch to DAY mode by rapid switching the ligth off then on (This light only) ** does what described and acts only on this light.**Switch to DAY mode by rapid switching the ligth off then on (apply yo ALL light nodes)** acts to ALL Light nodes, by setting the Day/Night group address to Day mode. |
| Node Input/Output PINs | Hide or show the input/output PINs. Input/output PINS allow the node to accept msg input from the flow and send msg output to the flow. Input msg must follow the Hue API v.2 Standards. This is an example msg, that turns on the light: <code>msg.on = {"on":true}</code>. Please refer to the [official Hue Api page](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put) |

##### Note

The Dimming function works in **KNX mode `start` and`stop` ** . To start dimming, send only one "start" KNX telegram. To stop dimming, send a "stop" KNX telegram. Please**remember that** , when you set your wall swiches properties.

---

<span id="hue-controller-docs-plug" data-hue-controller-type="plug"></span>

## Plug / outlet (`plug`)

### Hue Plug / Outlet

#### Overview

The Hue Plug node links a Philips Hue smart plug (service `plug`) with KNX group addresses so you can control power and track the state directly from the BUS.

- Supports **on/off control** and **status feedback**.
- Optional mapping of the Hue `power_state` (on / standby).
- Can expose Node-RED input/output pins to forward Hue events to flows or send advanced API payloads.

#### Configuration

|Field|Description|
|--|--|
| KNX GW | KNX gateway used for telegrams |
| Hue Bridge | Configured Hue Bridge |
| Name | Select the Hue plug from the autocomplete list |
| Control | KNX GA for on/off commands (boolean DPT) |
| Status | GA for the on/off feedback coming from Hue |
| Power state | Optional GA mirroring Hue `power_state` (boolean/text) |
| Read status at startup | When enabled, the node emits the current plug state on deploy/connection |
| Node Input/Output PINs | Enable Node-RED input/output pins. Input expects Hue API payloads (e.g. `{ on: { on: true } }`). Output forwards every Hue event. |

#### KNX Mapping Tips

- Use a boolean datapoint (e.g. DPT 1.001) for both command and status.
- If you expose `power_state`, map it to a boolean GA (true = `on`, false = `standby`).
- For read requests (`GroupValue_Read`) the node returns the last cached Hue value.

#### Flow Integration

When _Node I/O pins_ are enabled:

- **Input:** send Hue v2 payloads to perform advanced actions (e.g. `msg.on = { on: true }`).
- **Output:** receive an event object `{ payload: boolean, on, power_state, rawEvent }` whenever Hue reports a change.

#### Hue API Reference

The node uses `/resource/plug/{id}` over HTTPS. Status changes are delivered via the Hue event stream and cached for KNX read responses.

---

<span id="hue-controller-docs-button" data-hue-controller-type="button"></span>

## Button (`button`)

The Hue Button node maps Hue button events to KNX group addresses and exposes the same events on its flow output via <code>button.button_report.event</code>.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue Button | Hue button to be used (autocomplete while typing) |

**Switch**

|Property|Description|
|--|--|
| Switch | GA triggered by <code>short\_release</code> (quick press/release). |
| Status GA | Optional feedback GA when <em>Toggle values</em> is enabled to keep the internal toggle state aligned with other actuators. |

**Dim**

|Property|Description|
|--|--|
| Dim | GA used during <code>long\_press</code>/<code>repeat</code> events for dimming (typically DPT 3.007). |

**Behaviour**

|Property|Description|
|--|--|
| Toggle values on each event | If enabled, the node alternates between <code>true/false</code> and up/down dimming payloads. |
| Switch payload | Payload sent to KNX/flow when Toggle values is disabled. |
| Dim payload | Direction sent to KNX/flow when Toggle values is disabled. |

##### Outputs

1. Standard output
   : `msg.payload` carries the boolean (or dim object) sent to KNX; `msg.event` is the Hue event string (e.g. `short_release`, `repeat`).

##### Details

`msg.event` mirrors `button.button_report.event`. The original Hue event is exposed in `msg.rawEvent`. Use the optional Status GA to keep the toggle state in sync with wall switches or other controllers.

---

<span id="hue-controller-docs-relative_rotary" data-hue-controller-type="relative_rotary"></span>

## Tap dial (`relative_rotary`)

The **Hue Tap Dial** node maps the rotary service of the Hue Tap Dial to KNX and forwards the raw Hue events to your flow. Use the refresh icon beside the device field after pairing a new dial on the bridge.

##### Tabs

- **Mapping** - select the KNX GA and DPT used for the rotation events. Supported datapoints: DPT 3.007 (relative dim), DPT 5.001 (absolute level 0-100 %) and DPT 232.600 (vendor colour control).
- **Behaviour** - show or hide the Node-RED output pin. When no KNX gateway is configured the output is kept enabled so Hue events still reach the flow.

##### General settings

|Property|Description|
|--|--|
| KNX GW | KNX gateway used for GA autocomplete. |
| Hue Bridge | Hue Bridge hosting the Tap Dial. |
| Hue Tap Dial | Rotary device to control (autocomplete; refresh button reloads the list). |

##### Mapping tab

|Property|Description|
|--|--|
| Rotate GA | KNX GA receiving rotation events (supports DPT 3.007, 5.001, 232.600). |
| Name | Friendly label for the GA. |

##### Outputs

|#|Port|Payload|
|--|--|--|
|1|Standard output|`msg.payload` (object) Raw Hue event emitted by the Tap Dial.|

> ℹ️ KNX-specific widgets appear only after selecting a KNX gateway; the Mapping tab stays hidden until both the bridge and the gateway are configured.

---

<span id="hue-controller-docs-motion" data-hue-controller-type="motion"></span>

## Motion (`motion`)

This node listens to a Hue motion sensor and mirrors the events to KNX and/or your Node-RED flow.

Start typing the KNX device name or Group Address in the GA field; suggestions appear while you type. Hit the refresh button next to "Hue sensor” to reload the device list from the bridge if you add new sensors.

**General**

|Property|Description|
|--|--|
| KNX GW | KNX gateway that receives the motion updates (required before KNX mapping fields appear). |
| Hue Bridge | Hue Bridge to query. |
| Hue motion sensor | Hue motion sensor (supports autocomplete and refresh). |

**Mapping**

|Property|Description|
|--|--|
| Motion | KNX GA that receives `true` when motion is detected and `false` when the area is clear. Recommended DPT: <b>1.001</b>. |

**Behaviour**

|Property|Description|
|--|--|
| Node output pin | Show or hide the Node-RED output. When no KNX gateway is selected the output pin stays enabled so Hue motion events still reach your flow. |

> ℹ️ KNX widgets remain hidden until you select a KNX gateway, making it easy to use the node purely as a Hue → Node-RED listener.

##### Output

1. Standard output — `msg.payload` (boolean)
   : `true` on motion, `false` when motion ends.

---

<span id="hue-controller-docs-area_motion" data-hue-controller-type="area_motion"></span>

## Area motion (`area_motion`)

The Hue Motion Area node listens to MotionAware area motion events (Hue Bridge Pro) and mirrors the aggregated detected/not detected state to KNX or your Node-RED flow.

Start typing in the GA field (name or Group Address) to link the KNX GA; suggestions appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used. |
| HUE Bridge | Select the Hue Bridge Pro to be used. |
| HUE Area | MotionAware area (convenience or security) to monitor (autocomplete while typing). |
| Read status at startup | On startup/reconnect, read the current value and send it to KNX (default: yes). |

**Mapping**

|Property|Description|
|--|--|
| Motion | KNX GA for the area motion state (boolean). Recommended DPT: <b>1.001</b>. |

**Behaviour**

|Property|Description|
|--|--|
| Node output pin | Show or hide the Node-RED output. When no KNX gateway is selected the output pin stays enabled so MotionAware events still reach your flow. |

##### Outputs

1. Standard output
   : `msg.payload` (boolean): `true` when motion is detected in the area, otherwise `false`.

##### Details

`msg.payload` carries the latest MotionAware area motion status (aggregated from the underlying sensors).

---

<span id="hue-controller-docs-camera_motion" data-hue-controller-type="camera_motion"></span>

## Camera motion (`camera_motion`)

The Hue Camera Motion node listens to Philips Hue camera motion services and mirrors the detected/not detected state to KNX.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue Camera Motion | Hue camera motion sensor (autocomplete while typing) |
| Read status at startup | On startup/reconnect, read the current value and send it to KNX (default: no) |

**Mapping**

|Property|Description|
|--|--|
| Motion | KNX GA for camera motion (boolean). Recommended DPT: <b>1.001</b> |

##### Outputs

1. Standard output
   : `msg.payload` (boolean): `true` when motion is detected; otherwise `false`

##### Details

`msg.payload` carries the latest motion status reported by the Hue camera service.

---

<span id="hue-controller-docs-contact" data-hue-controller-type="contact"></span>

## Contact (`contact`)

This node forwards events from a Hue contact sensor and maps them to KNX group addresses.

Start typing in the GA field, the name or group address of your KNX device, the avaiable devices start showing up while you're typing.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue Contact Sensor | Hue contact sensor to be used (autocomplete while typing).|

| Property | Description |
|--|--|
| Contact | When the contact opens/closes, send KNX value: _true_ on active/open, otherwise _false_. |

##### Outputs

1. Standard output
   : payload (boolean) : the standard output of the command.

##### Details

`msg.payload` carries the raw Hue event (boolean/object). Use it for custom logic if needed.

---

<span id="hue-controller-docs-light_level" data-hue-controller-type="light_level"></span>

## Light level (`light_level`)

This node reads lux events from a Hue Light Sensor and maps them to KNX.

It emits the ambient illuminance (lux) each time it changes. Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue Light Sensor | Hue Light Sensor to use (autocomplete while typing).|
| Read status at startup | Read the status at startup and emit the event to the KNX bus at startup/reconnection. (Default "no")|

**Mapping**

| Property | Description |
|--|--|
| Lux | KNX GA that receives the lux value. |

##### Outputs

1. Standard output
   : payload (number): current lux value.

##### Details

`msg.payload` carries the numeric lux value. Use it for custom logic if needed.

---

<span id="hue-controller-docs-temperature" data-hue-controller-type="temperature"></span>

## Temperature (`temperature`)

This node reads temperature (°C) from a Hue temperature sensor and maps it to KNX.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue temperature sensor | Hue temperature sensor (autocomplete while typing) |
| Read status at startup | On startup/reconnect, read current value and send it to KNX (default: no) |

**Mapping**

|Property|Description|
|--|--|
| Temp | KNX GA for temperature in Celsius. Recommended DPT: <b>9.001</b> |

##### Outputs

1. Standard output
   : `msg.payload` (number): current temperature in °C

##### Details

`msg.payload` carries the numeric temperature value.

---

<span id="hue-controller-docs-humidity" data-hue-controller-type="humidity"></span>

## Humidity (`humidity`)

This node reads relative humidity (%) from a Hue humidity sensor and maps it to KNX.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue Sensor | Hue humidity sensor (autocomplete while typing) |
| Read status at startup | On startup/reconnect, read current value and send it to KNX (default: no) |

**Mapping**

|Property|Description|
|--|--|
| Humidity | KNX GA for relative humidity %. Recommended DPT: <b>9.007</b> |

##### Outputs

1. Standard output
   : `msg.payload` (number): current relative humidity in %

##### Details

`msg.payload` carries the numeric humidity value (percentage).

---

<span id="hue-controller-docs-scene" data-hue-controller-type="scene"></span>

## Scene (`scene`)

The **Hue Scene** node exposes Hue scenes to KNX and can forward the raw Hue events to a Node-RED flow. The scene field supports autocomplete; use the refresh icon after adding scenes on the bridge so the list stays up to date.

##### Tabs at a glance

- **Mapping** - link KNX group addresses to the selected Hue scene. DPT 1.xxx performs boolean recall, while DPT 18.xxx sends a KNX scene number.
- **Multi scene** - build a rule list that associates KNX scene numbers with different Hue scenes and chooses whether each scene is recalled as _active_, _dynamic\_palette_ or _static_.
- **Behaviour** - toggle the Node-RED output pin. When no KNX gateway is configured the pin remains enabled so bridge events still reach the flow.

##### General settings

|Property|Description|
|--|--|
| KNX GW | KNX gateway supplying the address catalogue used for autocomplete. |
| Hue Bridge | Hue Bridge that hosts the scenes. |
| Hue Scene | Scene to recall (autocomplete; refresh button reloads the bridge catalogue). |

##### Mapping tab

|Property|Description|
|--|--|
| Recall | KNX group address that recalls the scene. Use DPT 1.xxx for boolean control or DPT 18.xxx to transmit a KNX scene number. |
| DPT | Datapoint used with the recall GA (1.xxx or 18.001). |
| Name | Friendly label for the recall GA. |
| # | Appears when a KNX scene DPT is chosen; select the KNX scene number to send. |
| Status GA | Optional boolean GA that mirrors whether the scene is currently active. |

##### Multi scene tab

|Property|Description|
|--|--|
| Recall | KNX GA (DPT 18.001) that selects scenes by number. |
| Scene selector | Editable list that maps KNX scene numbers to Hue scenes with the desired recall mode. Drag handles reorder entries. |

> ℹ️ KNX-specific widgets only appear after a KNX gateway is selected. The Mapping tabs remain hidden until both the bridge and the gateway are configured.

---

<span id="hue-controller-docs-device_power" data-hue-controller-type="device_power"></span>

## Battery (`device_power`)

This node exposes the battery level of a Hue device to KNX and raises an event whenever the value changes.

Start typing the KNX device name or Group Address in the GA field; matching entries appear while you type. Use the refresh icon next to <q>Hue sensor</q> to reload the list from the Hue bridge after adding new devices.

**General**

|Property|Description|
|--|--|
| KNX GW | KNX gateway used to publish the battery level (required before KNX mapping fields appear). |
| Hue Bridge | Hue Bridge that hosts the device. |
| Hue battery sensor | Hue device/sensor providing the battery level (supports autocomplete and refresh). |

**Mapping**

|Property|Description|
|--|--|
| Level | KNX GA for the battery percentage (0-100%). Recommended DPT: <b>5.001</b>. |

**Behaviour**

|Property|Description|
|--|--|
| Read status at startup | On deploy/reconnect read the current battery value and publish it to KNX. Default: "yes”. |
| Node output pin | Show or hide the Node-RED output. When no KNX gateway is selected the output stays enabled so Hue events continue to reach the flow. |

> ℹ️ KNX mapping widgets remain hidden until a KNX gateway is selected. This keeps the editor tidy when the node is used only to forward Hue events into Node-RED.

---

<span id="hue-controller-docs-zigbee_connectivity" data-hue-controller-type="zigbee_connectivity"></span>

## Zigbee connectivity (`zigbee_connectivity`)

This node retrieves the Zigbee connectivity status from a Hue device and exposes it to KNX.

Start typing the KNX device name or Group Address in the GA field; suggestions appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | KNX gateway used to publish the status. |
| Hue Bridge | Hue Bridge to query. |
| Hue zigbee connectivity | Hue sensor/device providing the Zigbee connectivity info. Autocomplete while typing. |

**Mapping**

|Property|Description|
|--|--|
| Status | KNX Group Address that reflects Zigbee connectivity. Becomes _true_ when connected, otherwise _false_. |
| Read status at startup | Reads current status at editor start/reconnection and emits to KNX. Default: "yes”. |

##### Outputs

1. Standard output
   : payload (boolean): connectivity state.

##### Details

`msg.payload` carries the boolean state (true/false).\
`msg.status` contains a textual status: one of **connected, disconnected, connectivity\_issue, unidirectional\_incoming** .

---

<span id="hue-controller-docs-device_software_update" data-hue-controller-type="device_software_update"></span>

## Device software update (`device_software_update`)

This node monitors whether a selected Hue device has a software update available and publishes the status to KNX.

Start typing the name or group address of your KNX device in the GA field, the avaiable devices start showing up while
you're typing.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue device | Hue device to monitor for software updates (autocomplete while typing).|

**Mapping**

| Property | Description |
|--|--|
| Status | KNX GA reflecting update status. _true_ if an update is available/ready/being installed, otherwise _false_. |
| Read status at startup | Read current status at startup/reconnection and emit to KNX (default "yes”). |

##### Outputs

1. Standard output
   : payload (boolean): update flag.
   : status (string): one of **no\_update, update\_pending, ready\_to\_install, installing** .

<!-- HUE_CONTROLLER_PROFILE_DOCS_END -->
