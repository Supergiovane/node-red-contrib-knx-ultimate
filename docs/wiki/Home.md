---
layout: wiki
title: "Home"
lang: en
permalink: /wiki/Home/
---
---
![Logo](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/logo-big.png)
Control your KNX intallation via Node-Red! A bunch of KNX nodes, with integrated Philips HUE control and ETS group address importer. Easy to use and highly configurable.
<br/>
> \[!TIP]
> I'm putting many effort, money and free time to this node, so please consider [MAKING A LITTLE DONATION](https://www.paypal.com/donate/?hosted_button_id=S8SKPUBSPK758) if you're using KNX-Ultimate. Thanks!
<br/>
<br/>
# YOUTUBE CHANNEL
<a href="https://www.youtube.com/playlist?list=PL9Yh1bjbLAYpfy1Auz6CKDfXUusgMwOQr" target="_blank"><br/> <img width="200px" src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/youtube-logo.jpeg"></a>
Please subscribe to the [Youtube channel](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYpfy1Auz6CKDfXUusgMwOQr) and watch the node in action.
<br/>
<br/>
# WORKING WITH THE ETS CSV FILE
Instead of create a knx device node for each Group Address to control, you can import your ETS csv group addresses file.
Thanks to that, the knx device node where you selected **Listen to all Group Addresses** , becomes an universal input/output node, aware of all Datapoints, Group Addresses and Device's name (ex: Living Room Lamp). Just send the payload to the knx-ultimate node, and it'll encode it with the right datapoint and send it to the bus. Likewise, when the knx-ultimate node receives a telegram from the bus, it outputs a right decoded payload using the datapoint specified in the ETS file.
> You can work with a mix of knx-ultimate nodes, some with **Listen to all Group Addresses** checked and some not. You are absolutely free! See this youtube video,
<a href="https://youtu.be/egRbR_KwP9I"><img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png' width='60%'></a>
---
# KNX Ultimate Node Overview
## knxUltimate-config
**Purpose**: centralise KNX/IP gateway parameters and share them with the suite.
**Key features**: tunnelling and KNX Secure, ETS CSV import with autocomplete, connectivity diagnostics and bus monitor.
**Setup**: enter host/port, pick the network interface, upload the ETS file and enable Secure or monitor options as required.
## hueConfig
**Purpose**: store Philips Hue bridge credentials and make them available to all Hue nodes.
**Key features**: guided pairing, persistent tokens, EventStream support, REST fallback, TLS and clock validation.
**Setup**: press the bridge link button, run the pairing wizard, choose EventStream or polling and save the configuration name.
## knxUltimate
**Purpose**: read and write KNX telegrams with on-the-fly DPT conversion.
**Key features**: GA autocomplete, ETS filters, priority handling, runtime stats, optional Node Pins.
**Setup**: select the gateway, assign the right DPT, tune ACK/retry behaviour and enable pins or filters for your flow.
## knxUltimateSceneController
**Purpose**: execute multi-step KNX scenes with conditional logic and manual override.
**Key features**: programmable steps, conditional triggers, scene memory, manual controls.
**Setup**: list the target scenes, configure delays/conditions and wire triggers through Node Pins.
## knxUltimateWatchDog
**Purpose**: supervise gateways, devices or GA and alert on timeouts.
**Key features**: cyclic pings, latency tracking, automatic recovery actions, health metrics.
**Setup**: declare the GA to watch, set intervals/timeouts and connect outputs to loggers or alerting nodes.
## knxUltimateLogger
**Purpose**: capture KNX telegrams and values for audit, troubleshooting or export.
**Key features**: circular buffer, GA/DPT filters, CSV/JSON export, context integration.
**Setup**: choose the output folder, configure retention and thresholds and enable the desired notifications or exports.
## knxUltimateGlobalContext
**Purpose**: synchronise KNX data with the Node-RED global context.
**Key features**: GA→context bindings, optional bidirectional sync, DPT filtering.
**Setup**: define the context key, choose the sync direction and configure Node Pins for external updates.
## knxUltimateAlerter
**Purpose**: raise alerts when KNX values meet thresholds or custom rules.
**Key features**: multiple comparators, hysteresis, auto reset, email/MQTT/log outputs.
**Setup**: describe the conditions, craft the messages and wire the outputs to your notification channels.
## knxUltimateLoadControl
**Purpose**: balance electrical loads and shed non-essential circuits on demand.
**Key features**: load groups, dynamic priorities, shed/restore cycles, event buffering.
**Setup**: map measurement GA, assign priorities to loads and configure shed/restore timing windows.
## knxUltimateViewer
**Purpose**: expose HTML/JSON dashboards for live KNX monitoring.
**Key features**: live tables, card layouts, JSON feeds, queue analysis.
**Setup**: select the GA to display, adjust labels and refresh cadence and publish the chosen dashboard.
## knxUltimateAutoResponder
**Purpose**: answer KNX read requests automatically with the last cached value.
**Key features**: value cache, multi-GA mapping, external updates via Node Pins, activity log.
**Setup**: configure listen/response GA, set cache retention and hook up external update inputs.
## knxUltimateStaircase
**Purpose**: drive staircase lighting timers with warnings, overrides and resets.
**Key features**: multi timers, prewarning pulses, manual override, start-up readback.
**Setup**: assign command/status GA, choose timer durations and configure override/reset pins as needed.
## knxUltimateGarage
**Purpose**: control sectional or tilt doors with impulse commands and safety logic.
**Key features**: impulse drive, state monitoring, safety lock, photocell handling, auto close.
**Setup**: map command/state/alarm GA, define travel times and tune locking or reopen behaviour.
## knxUltimateIoTBridge
**Purpose**: bridge KNX with MQTT/REST/Modbus in both directions.
**Key features**: table-based mapping, value scaling, custom acknowledgements, offline buffer.
**Setup**: fill the mapping table, configure external endpoints and define ack/retry strategies.
## KNX Monitor sidebar
**Purpose**: watch KNX traffic directly from the right-hand Node-RED sidebar tabs panel.
**Key features**: 1 s refresh, highlight of fresh telegrams, inline boolean toggles, optional reordering.
**Setup**: pick the gateway, toggle auto-refresh or sorting and apply filters for the GA you care about.
## KNX Debug sidebar
**Purpose**: inspect every KNX log line in real time from the sidebar without digging into server consoles.
**Key features**: rolling 5 000-line buffer, severity colours, auto/manual refresh controls, one-click copy to clipboard.
**Setup**: open the tab, keep auto refresh enabled (or click refresh when needed) and use the copy icon to export the current log snapshot.
## knxUltimateHATranslator
**Purpose**: translate KNX telegrams into Home Assistant payloads and vice versa.
**Key features**: DPT→entity mapping, discovery helpers, boolean/numeric normalisation, optional acknowledgements.
**Setup**: define target entities, configure conversions/templates and enable Node Pins for feedback paths.
## knxUltimateHueLight
**Purpose**: control Hue lights from KNX with on/off, dimming, colour and dynamic scenes.
**Key features**: multi-GA mapping, day/night profiles, state feedback, Node Pins.
**Setup**: assign switch/state/dimmer/colour GA, configure ramps and scene modes and enable EventStream on the bridge.
## knxUltimateHueButton
**Purpose**: map Hue button events to KNX telegrams.
**Key features**: short/long press detection, multi-resource support, DPT 1.xxx/18.xxx mapping, debounce controls.
**Setup**: select the Hue resource, attach GA per event and tune debounce and feedback outputs.
## knxUltimateHueMotion
**Purpose**: integrate Hue motion sensors into KNX automation.
**Key features**: boolean output, DPT filters, timing controls, configurable Node Pins.
**Setup**: choose motion/status GA, set optional timeout and manage pin visibility in the Behaviour tab.
## knxUltimateHueTapDial
**Purpose**: reuse the Hue Tap Dial as a KNX rotary controller or scene selector.
**Key features**: incremental/decremental steps, DPT 3.007/5.001/custom mapping, optional feedback.
**Setup**: bind the Hue device, specify target GA and sensitivity and enable the pins you need.
## knxUltimateHueLightSensor
**Purpose**: deliver Hue lux readings onto the KNX bus.
**Key features**: auto conversion to DPT 9.004, optional smoothing, start-up readback.
**Setup**: set the lux GA, apply filters or offsets and expose Node Pins when useful.
## knxUltimateHueTemperatureSensor
**Purpose**: publish Hue temperature data to KNX.
**Key features**: DPT 9.001 conversion, offset correction, start-up sync, Node Pins.
**Setup**: assign the temperature GA, apply corrections and enable outputs for downstream flows.
## knxUltimateHueScene
**Purpose**: trigger Hue scenes from single or multi-scene KNX events.
**Key features**: DPT 1.xxx/18.xxx support, multi-scene rule tab, optional status feedback.
**Setup**: select the Hue scenes, map trigger/status GA and add advanced mappings if required.
## knxUltimateHueBattery
**Purpose**: monitor Hue device battery levels inside KNX.
**Key features**: device_power→DPT 5.001 conversion, start-up read, threshold alerts, Node Pins.
**Setup**: define the percentage GA, configure alert thresholds and connect notifications or logs.
## knxUltimateHueZigbeeConnectivity
**Purpose**: surface Hue Zigbee connectivity health on KNX.
**Key features**: boolean mapping, start-up read, fallback strategies.
**Setup**: set the boolean GA/DPT, plan actions for link loss and wire alert outputs.
## knxUltimateHueCameraMotion
**Purpose**: expose Hue Secure camera motion events to KNX.
**Key features**: realtime EventStream, boolean mapping, false-positive mitigation, initial buffer.
**Setup**: choose the camera, configure GA/DPT, adjust filters and feed the outputs into security logic.
## knxUltimateContactSensor
**Purpose**: synchronise Hue contact sensors (open/close) with KNX addresses.
**Key features**: `contact` resource filter, DPT 1.019 mapping, optional logic inversion, ETS-friendly labels.
**Setup**: pick the sensor, map status/alarm GA and configure alerts or delays.
## knxUltimateHueHumiditySensor
**Purpose**: send Hue relative humidity measurements to KNX.
**Key features**: scaling to DPT 9.007, optional smoothing, start-up read, Node Pins.
**Setup**: assign the humidity GA, set filters or thresholds and route outputs where needed.
## knxUltimateHuePlug
**Purpose**: control Hue smart plugs and collect status/power feedback in KNX.
**Key features**: on/off commands, status and power channels, power availability flag, Node Pins.
**Setup**: map command/status/power GA, choose the appropriate DPT and enable start-up reads.
## knxUltimateHuedevice_software_update
**Purpose**: notify KNX flows about Hue firmware update availability.
**Key features**: interpretation of `up_to_date/available/required`, event logging, schedulable alerts.
**Setup**: configure the alert GA, define notification policy and connect dashboards or ticketing systems.
