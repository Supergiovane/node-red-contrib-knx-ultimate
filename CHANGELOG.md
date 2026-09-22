![Sample Node](img/logo.png)

[![Donate via PayPal](https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/CodiceQR.png)](https://www.paypal.com/donate/?hosted_button_id=S8SKPUBSPK758)

<br/>

# CHANGELOG

**Version 8.0.5** - September 2026

- Added the KNX Ultimate 7-to-8 migration video to the package README, migration guide and all localized documentation pages.

**Version 8.0.4** - September 2026

- Automatic migration now validates only the HUE, Matter and KNX Utility nodes it converts. Invalid nodes from unrelated packages no longer block the upgrade.
- Unrelated invalid nodes are preserved unchanged while the converted flow is deployed and verified.
- Added regression coverage for the reported Alarm Ultimate flow with unconfigured Alarm State and Alarm Siren nodes.

**Version 8.0.3** - September 2026

- Allows incomplete legacy HUE and Matter nodes that belong to the active migration plan to be converted without weakening validation for unrelated invalid nodes.
- Adds an explicit **OK** button to persistent migration-error notifications so they can always be dismissed.
- Adds an end-to-end regression fixture for direct migration of the Alarm Ultimate flow reported by a user.

**Version 8.0.2** - September 2026

- Published version 8 on the stable `latest` channel for installations that only need the current KNX nodes.
- Includes the version 7 recovery bridge for direct upgrades that still contain legacy HUE, Matter, utility or AI nodes.
- Keeps the guided version 7.1.4 upgrade target available separately as `8.0.1-beta.0`.

**Version 8.0.1-beta.0** - September 2026

- Published under the `beta` dist-tag as the exact install target for the version 7 one-click upgrade.
- Made the version 7 migration warning and optional integration packages much more visible in the README.
- Keeps the version 7 one-click upgrade resource loadable while version 8 is waiting for the mandatory Node-RED restart.
- Added an editor recovery bridge and inert runtime placeholders for direct upgrades from older version 7 installations; compatible unknown nodes can be backed up, converted and deployed without reinstalling KNX Ultimate 8.
- Requires Matter Ultimate 1.0.3 when Matter nodes are migrated so protected door-lock PIN credentials remain registered across the Deploy.
- Treats `preinstall` as a read-only, best-effort diagnostic because modern Node-RED/npm installations may skip dependency lifecycle scripts; the editor bridge is the authoritative recovery path.

**Version 8.0.0** - September 2026

- The editor stays accessible after upgrading from version 7 and reminds you to restart Node-RED.
- KNX Ultimate 8 ships only the current KNX nodes.
- Installation checks saved flows and blocks the upgrade if old HUE or Matter nodes still need migration.
- HUE and Matter use their separate packages; old KNX utility nodes are replaced by KNX Utility.
- Removed the old AI nodes and unused dependencies. Migrate existing flows before upgrading: see [upgrade steps](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/main/MIGRATION.md).

**Version 7.1.2** - September 2026

- HUE Controller is available in the palette again.

**Version 7.1.1** - September 2026

- Restored the old KNX AI nodes and web page so existing flows keep working.
- HUE and Matter nodes are hidden from the palette, but existing flows still work.

**Version 7.1.0-beta.2** - September 2026

- Public beta available to everyone.

**Version 7.1.0-beta.1** - September 2026

- New KNX Utility node combines eleven functions and can convert the old nodes.
- Flows are backed up before KNX or HUE conversion.
- KNX Viewer shows telegrams from the last 24 hours, including after a restart.
- **Upgrade notice:** this beta removes the old KNX AI nodes. Existing AI flows require migration to Cerebrum Ultimate.

**Version 7.0.4** - September 2026

- Updated the KNX communication software.

**Version 7.0.3** - September 2026

- Corrected translations and updated the KNX communication software.

**Version 7.0.2** - September 2026

- KNX Device makes it easier to find ETS group addresses and see their names when writing functions.

**Version 7.0.1** - September 2026

- Corrected the status shown when answering a KNX read request.
- Added another way to request KNX values from a flow.

**Version 7.0.0** - September 2026

- New AI installations use the separate Cerebrum Ultimate package. Existing AI nodes remain supported but are hidden from the palette.
- Cerebrum adds Home Assistant integration, learns repeated home routines and asks before using them predictively.
- Improved the AI web page, memory backup and restore, and startup messages. Fixed a Telegram startup crash.

**Version 6.3.32** - August 2026

- Cerebrum chat uses the selected ETS addresses and their read/write permissions.

**Version 6.3.31** - August 2026

- Cerebrum works better with smaller local AI models and finds relevant ETS addresses more reliably.
- **After updating:** open the AI node, select the ETS addresses it may access, save and Deploy. No addresses are available until you do this.
- Web lookups now follow chat requests or schedules instead of fixed background checks.

**Version 6.3.30** - August 2026

- Cerebrum supports Telegram voice conversations through RedBot.

**Version 6.3.29** - August 2026

- Cerebrum can create reminders and scheduled home actions from chat, keeping them after a restart.
- Improved support for slower and local AI models, with more response settings and clearer errors.
- Simplified the setup checks and kept user instructions separate from learned information.
- Older separate instruction files are no longer used; keep user instructions in the node settings.

**Version 6.3.27** - August 2026

- Adjusted Cerebrum's default settings.

**Version 6.3.26** - August 2026

- Cerebrum can search the web when enabled and include source links in its answers.
- Added setup checks, clearer chat connections and Telegram voice conversations.
- Spoken announcements now use a dedicated output connected to TTS Ultimate. Update existing announcement connections accordingly.

**Version 6.3.25** - August 2026

- IoT Bridge can exchange KNX commands and values with the Node-RED Modbus package.
- Improved KNX gateway hostname lookup.

**Version 6.3.24** - August 2026

- Cerebrum's Telegram confirmation buttons now work through the normal chat connection.
- Chat memory can be viewed, edited, backed up, restored or reset. Improved recall of user preferences.
- Simplified AI settings and model selection, and improved learning of how KNX addresses are used.
- **Upgrade notice:** older chat-memory and event-history files are kept on disk but are not imported. New memory and history start with this release.

**Version 6.3.22** - August 2026

- Cerebrum runs more reliably with local AI models and shows how much conversation information it is using.
- Improved KNX state queries and prevented example addresses from being mistaken for real commands.

**Version 6.3.21** - August 2026

- Cerebrum keeps a history of events from connected integrations and can answer questions about past activity.

**Version 6.3.19** - August 2026

- Cerebrum supports routines such as bedtime or leaving home, checking KNX states before preparing commands.
- Corrected output labels in the selected language.

**Version 6.3.18** - August 2026

- Simplified Cerebrum setup and added spoken announcements through TTS Ultimate.
- Improved local AI support, including Ollama and Bionic LM Studio.

**Version 6.3.17** - August 2026

- Telegram and other chat connections can use the same home information as the web assistant.

**Version 6.3.16** - August 2026

- Cerebrum automatically discovers compatible camera integrations for snapshots and camera events.

**Version 6.3.15** - August 2026

- Cerebrum remembers conversations and user instructions after restarts and shares memory between its nodes.
- Added RedBot Telegram support.
- **Upgrade notice:** older memory files saved separately for each node are not imported into the new shared memory.

**Version 6.3.14** - August 2026

- Matter Bridge can expose KNX room air conditioners and door locks.

**Version 6.3.13** - August 2026

- Matter Controller and Matter Bridge are no longer marked as beta.
- Updated Matter node colours and icons.

**Version 6.3.12** - August 2026

- Completed HUE Controller translations in all six supported languages.

**Version 6.3.11** - August 2026

- Fixed Matter Controller hiding KNX settings or losing the displayed gateway selection when opening the editor.

**Version 6.3.10** - August 2026

- Watchdog can optionally report errors from other KNX Ultimate nodes. This is enabled by default.

**Version 6.3.9** - August 2026

- Fixed Matter nodes failing to load in the Home Assistant Node-RED add-on.

**Version 6.3.8** - August 2026

- Fixed HUE Controller hiding light settings or losing the displayed gateway selection when opening the editor.

**Version 6.3.7** - August 2026

- HUE Controller keeps saved KNX settings when gateways are changed and restores them correctly when edits are cancelled.
- Added clearer messages while the Hue Bridge is loading or offline.

**Version 6.3.6** - August 2026

- Hue light groups now show all light settings when a KNX gateway is selected.

**Version 6.3.5** - August 2026

- Fixed missing HUE light settings and misleading Locate success messages.

**Version 6.3.2** - August 2026

- Fixed stopping an upward dimming command.

**Version 6.3.1** - August 2026

- Updated components for security and fixed links to translated documentation.

**Version 6.3.0** - August 2026

- New HUE Controller combines the supported Hue devices in one node, detects the device type and converts old nodes.
- Improved Matter pairing feedback and device selection lists.

**Version 6.2.3-beta.5** - August 2026

- HUE Controller detects the selected device type automatically.
- Fixed Hue, Matter and KNX selection lists closing too early.

**Version 6.2.3-beta.4** - August 2026

- New HUE Controller combines lights, sensors, buttons, scenes and other Hue functions in one node.
- Added guided conversion of old Hue nodes, preserving their KNX settings. Donations after conversion are optional.
- Improved Hue device detection, Locate, editor layout and help.
- Matter pairing now shows progress and clearer status messages.

**Version 6.2.2** - July 2026

- Updated KNX communication and simplified Cerebrum configuration.

**Version 6.2.1** - July 2026

- Cerebrum can optionally observe the home and report useful changes, with remembered home information.
- Simplified its settings and added practical guidance.

**Version 6.2.0** - July 2026

- Cerebrum chat can read KNX states and prepare device commands, with optional confirmation before sending.
- Added easier Telegram connections and improved AI compatibility.
- Removed the KNX Debug and KNX Monitor sidebar tabs.
- Matter nodes show flow connection help when their inputs and outputs are enabled.

**Version 6.1.0** - July 2026

- Matter pairing can read QR codes from a camera or image.
- Added monitoring for low batteries across all paired Matter devices.
- Improved support for shutters, thermostats, fans, switches and locks. An offline device no longer delays other devices.
- Corrected connection status, light options and flow input help.

**Version 6.0.10** - July 2026

- Added Matter door-lock support, more device functions, and backup and restore of pairing data. Protect these backups like passwords.
- Improved stability, device naming and saved settings.
- Fixed Alexa shutter positions and duplicate light commands. Added heating/cooling thermostat support.
- **Beta upgrade notice:** the option to expose shutters as dimmable lights was removed. If you used it, you may need to remove and add the accessory again in your Matter app.

**Version 6.0.4** - July 2026

- Matter Bridge settings are easier to find, with separate mapping and advanced tabs.

**Version 6.0.3** - July 2026

- Added a temporary option to expose shutters as dimmable lights for Alexa percentage control.

**Version 6.0.2** - July 2026

- Improved Alexa shutter positioning and forwarding of repeated Matter commands to flows.

**Version 6.0.1** - July 2026

- Fixed Alexa reporting a shutter as unresponsive after a position command when controlled only through a flow.

**Version 6.0.0** - July 2026

- New Control Matter from KNX node combines the previous Matter controller nodes and shows settings for the selected device.
- Improved Matter Bridge shutter and dimmer options, pairing messages and device naming.
- **Upgrade notice:** older experimental Matter flows may need to be updated. Matter remains beta and may change before its stable release.

**Version 5.2.5** - July 2026

- Maintenance release.

**Version 5.2.4** - July 2026

- Matter Bridge uses its configuration name when no separate bridge name is entered.
- Clarified that Apple Home asks users to name accessories during setup.

**Version 5.2.3** - July 2026

- Choose how ETS device names appear in Home Assistant, with a preview before saving.

**Version 5.2.2** - July 2026

- New Matter Bridge exposes KNX lights, shutters, thermostats, sensors and other devices to Alexa, Google Home and Apple Home.
- Devices can also be controlled through flows without a KNX gateway. Pairings are kept during normal Deploys.
- Improved stability and preservation of saved group addresses.
- **For early beta users:** remove the old bridge from your Matter app and pair the new bridge configuration once.

**Version 5.1.0** - July 2026

- New Matter integration lets KNX control paired Matter devices and receive their status.
- Pair devices from the editor and link their functions to KNX group addresses. Matter support is beta.

**Version 5.0.4** - July 2026

- Fixed group-address suggestions for shutters and thermostats in IoT Bridge.

**Version 5.0.3** - July 2026

- Added a video tutorial link to every node's settings.

**Version 5.0.2** - July 2026

- IoT Bridge can expose selected KNX addresses as read-only in Home Assistant.
- Choose a direct KNX connection or connect the bridge through flow messages.

**Version 5.0.1** - June 2026

- IoT Bridge can connect directly to MQTT and automatically add selected KNX devices to Home Assistant.
- Added combined shutter and thermostat settings and improved connection handling.

**Version 5.0.0** - June 2026

- Updated KNX communication.
- Added a button to reveal passwords and keys from the loaded KNX Secure keyring.

**Version 4.3.24** - June 2026

- Fixed Hue motion and contact sensors reporting an incorrect KNX state after reconnecting.

**Version 4.3.23** - June 2026

- Restored the editor's help text for Hue nodes.

**Version 4.3.22** - June 2026

- Simplified manual Hue Bridge credential entry.

**Version 4.3.21** - June 2026

- Updated the KNX communication software.

**Version 4.3.20** - June 2026

- Cerebrum can create an importable Node-RED flow from a plain-language description. Flow Builder is beta.
- Added Claude support and improved the web page layout and translations.

**Version 4.3.19** - June 2026

- Improved troubleshooting guides and automatic connection settings for Weinzierl KNX/IP interfaces.

**Version 4.3.18** - May 2026

- Updated components and fixed security vulnerabilities.

**Version 4.3.17** - May 2026

- Added ready-to-import example flows for the KNX and Hue nodes.

**Version 4.3.16** - May 2026

- Updated DateTime help and KNX communication software.

**Version 4.3.15** - May 2026

- Fixed the datapoint selection list closing immediately after a click.

**Version 4.3.13** - May 2026

- Updated the KNX communication software.

**Version 4.3.12** - May 2026

- Corrected KNX function examples so reading a value waits for the result.

**Version 4.3.11** - May 2026

- Clarified how to read KNX values in custom functions and corrected editor suggestions.

**Version 4.3.10** - April 2026

- Custom functions can read stored KNX values without sending a bus request.
- Reduced duplicate requests for the same group address.

**Version 4.3.9** - April 2026

- Fixed umlaut characters in KNX text values.

**Version 4.3.8** - April 2026

- Cerebrum can save telegram history and use it to answer questions about past activity.
- Improved its knowledge of flows and custom functions, settings layout and chat display.
- KNX Device can receive undecoded telegrams when their datapoint is unknown.

**Version 4.3.6** - April 2026

- KNX Device hides options that do not apply to undecoded telegrams.

**Version 4.3.5** - April 2026

- KNX Device can receive and send undecoded telegrams.
- Raw sending requires the dedicated raw-write input; normal writes are not accepted in this mode.

**Version 4.3.4** - April 2026

- Improved the custom-function editor and its examples.
- Reading a KNX value can request it from the bus if no stored value is available.

**Version 4.3.3** - April 2026

- Added a toggle-with-status example and clearer group-address search in the function editor.

**Version 4.3.2** - April 2026

- Updated Cerebrum help, including the Ollama quick setup guide.

**Version 4.3.1** - April 2026

- Cerebrum opens on its overview page and uses translated question buttons correctly.
- Updated KNX communication software.

**Version 4.3.0** - April 2026

- Updated the KNX communication software.

**Version 4.2.14** - April 2026

- Fixed KNX Logger downloads when Node-RED login protection is enabled.

**Version 4.2.13** - April 2026

- Fixed Cerebrum audio with Node-RED login protection.
- Improved test progress messages and added a spoken completion notice.

**Version 4.2.12** - April 2026

- Fixed intermittent access errors in Cerebrum and KNX Viewer web pages when login protection is enabled.

**Version 4.2.11** - April 2026

- Improved Cerebrum chat layout, progress messages and error explanations.
- Added easier management of AI areas.

**Version 4.2.10** - April 2026

- Simplified Cerebrum's menus and adjusted the chat layout for different screen sizes.

**Version 4.2.7** - April 2026

- Refreshed Cerebrum's web page, settings and navigation.
- Test reports can be exported as PDF. Fixed an incorrect unsaved-changes warning.

**Version 4.2.5** - March 2026

- New Flow Bubbles show KNX device states directly on the flow workspace.
- Fixed enabling and disabling them for individual gateways.

**Version 4.2.4** - March 2026

- New KNX Viewer web page shows lights and dimmers, with search and live updates.

**Version 4.2.3** - March 2026

- Cerebrum's flow map can show or hide Universal Mode nodes; they are hidden by default.

**Version 4.2.2** - March 2026

- Replaced the old Cerebrum web page with the new dashboard and improved the flow map.

**Version 4.2.1** - March 2026

- Hue lights and groups can store a brightness setting while off, without switching on.

**Version 4.1.35** - March 2026

- Cerebrum reports when the KNX connection is lost or restored and shows connection history.

**Version 4.1.34** - March 2026

- Hue light groups apply the requested colour more reliably before switching on.

**Version 4.1.33** - March 2026

- Improved brightness and colour control of Hue groups while off.
- New Hue Light nodes update their stored state immediately after KNX commands by default.

**Version 4.1.32** - March 2026

- Updated the KNX communication software.

**Version 4.1.31** - March 2026

- Added an option for Hue Light to update its stored state immediately after KNX commands.

**Version 4.1.30** - March 2026

- Cerebrum now opens its main dashboard from the node editor, with clearer maps and chat results.
- Fixed incorrect Hue brightness feedback, including when lights are off.

**Version 4.1.29** - March 2026

- New KNX DateTime node sends date and time at startup, periodically or on request.
- Suggested group addresses make setup easier.

**Version 4.1.28** - February 2026

- Load Control can be operated entirely through flow commands instead of its automatic logic.

**Version 4.1.27** - February 2026

- Updated the KNX communication software.

**Version 4.1.26** - February 2026

- Translated Cerebrum's interface and output labels.

**Version 4.1.25** - February 2026

- Fixed periodic KNX sending after a stored value is restored on restart.

**Version 4.1.24** - February 2026

- Removed unused software components.

**Version 4.1.23** - February 2026

- Opening gateway settings no longer clears saved KNX values. Added a separate button to clear them.
- KNX Device can send its stored value periodically.

**Version 4.1.22** - February 2026

- Improved KNX routing loop prevention, address rewriting and connection diagnostics.
- Router Filter settings can be changed through flow messages.

**Version 4.1.19** - February 2026

- New Cerebrum AI assistant helps analyse KNX traffic and explain flows.
- New Multi Routing and Router Filter nodes connect and filter multiple KNX networks. Multi Routing can also act as a KNX/IP server.
- Added setup guides and example flows.

**Version 4.1.15** - January 2026

- Updated the KNX communication software.

**Version 4.1.14** - January 2026

- Improved Hue recovery after network interruptions.
- Fixed saved Hue Button settings and status updates, and prevented status errors from stopping Node-RED.

**Version 4.1.12** - January 2026

- A missing Hue device no longer blocks commands to other Hue devices.

**Version 4.1.10** - January 2026

- Choose the date and time format shown in node status messages.

**Version 4.1.9** - December 2025

- Added Hue Motion Area support for Bridge Pro MotionAware areas.

**Version 4.1.8** - December 2025

- KNX Logger now has a file download button and clearer recording settings.

**Version 4.1.7** - December 2025

- KNX Logger offers clearer file-saving options and removes the oldest records when the row limit is reached.

**Version 4.1.5** - December 2025

- Updated the KNX communication software.

**Version 4.1.4** - December 2025

- Fixed serial KNX connections failing to reconnect after Deploy.

**Version 4.1.3** - December 2025

- Improved KBerry serial reconnection after Deploy.

**Version 4.1.2** - December 2025

- Serial KNX ports are released properly when settings change, allowing reconnection.

**Version 4.1.1** - November 2025

- Added clearer serial connection settings for KBerry/BAOS and standard FT1.2 interfaces.
- The KNX Device manual command button is enabled by default for new nodes.

**Version 4.0.30** - November 2025

- Added direct serial KNX connections, including port discovery and editable connection settings.

**Version 4.0.29** - November 2025

- Hue refresh buttons now reload devices and scenes directly from the bridge.

**Version 4.0.27** - October 2025

- Fixed group-address suggestions being hidden by an empty-results message.

**Version 4.0.26** - October 2025

- Watchdog now suggests suitable group addresses during setup.

**Version 4.0.25** - October 2025

- Added ready-to-use KNX function examples for common home automations and simplified the editor.

**Version 4.0.24** - October 2025

- Hue pairing completes automatically after pressing the bridge button. Existing credentials can also be entered manually.
- Improved Hue discovery and KNX gateway selection.

**Version 4.0.23** - October 2025

- Fixed Hue Light issues introduced by recent changes.

**Version 4.0.22** - October 2025

- Fixed Hue light groups switching off immediately and improved the KNX Debug sidebar.

**Version 4.0.19** - October 2025

- Hue Locate can be started and stopped and works with light groups.
- Improved Hue reconnection, device refresh and commands while the bridge is loading.
- Added a configurable manual KNX command button and more automation examples.

**Version 4.0.16** - October 2025

- Fixed missing gateways in discovery and improved Hue device refresh.

**Version 4.0.15** - October 2025

- New KNX Monitor sidebar shows live group-address values, with filtering and on/off controls.

**Version 4.0.14** - October 2025

- New IoT Bridge connects KNX with MQTT, REST and Modbus through flow mappings.

**Version 4.0.13** - October 2025

- New Garage Door node supports timed closing, hold-open and safety controls.
- Improved Staircase and Garage settings and examples.

**Version 4.0.12** - October 2025

- New Staircase Light node supports timers, pre-warning and overrides.
- Added a limit on how often node statuses update.
- Hue's Keep brightness option now restores the last brightness when switching on.

**Version 4.0.11** - October 2025

- Added Hue smart-plug, humidity and camera-motion nodes, plus light effects.
- Improved Hue behaviour when KNX is offline and made node settings easier to use.

**Version 4.0.10** - October 2025

- Added an option to show only errors in node statuses.

**Version 4.0.9** - September 2025

- The network interface is selected automatically from the KNX gateway address.
- Debug logging now includes readable keyring details, including secrets.

**Version 4.0.7** - September 2025

- Restored missing KNX Secure settings and improved Hue export for Home Assistant.

**Version 4.0.6** - September 2025

- Fixed automatic datapoint selection from group addresses.

**Version 4.0.5** - September 2025

- Added more ways to sign in to a KNX gateway.

**Version 4.0.4** - September 2025

- KNX Secure gateways can be configured with tunnel credentials without a keyring file.

**Version 4.0.3** - September 2025

- Global Context includes the time of the last update. Improved KNX function examples and settings.

**Version 4.0.2** - September 2025

- Added KNX Secure support and improved settings, help and translations.
- **Before updating:** back up your flows.

**Version 3.3.40** - August 2025

- KNX values are saved every five seconds as well as on disconnect.
- Fixed Auto Responder failing to start with some ETS imports.

**Version 3.3.39** - July 2025

- Added more KNX Device function examples.

**Version 3.3.38** - May 2025

- Fixed group-address names containing tabs and improved KNX disconnection handling.

**Version 3.3.37** - May 2025

- Fixed saved KNX values not loading after a restart or reconnection.

**Version 3.3.36** - April 2025

- **Requires Node.js 20.18.1 or later.**

**Version 3.3.35** - May 2025

- Fixed KNX sending stopping after a telegram was not acknowledged.

**Version 3.3.34** - April 2025

- **Requires Node.js 20.1.1 or later.**

**Version 3.3.33** - April 2025

- **Requires Node.js 20 or later.** Improved detection of lost Hue connections.

**Version 3.3.30** - April 2025

- **Requires Node.js 18 or later.** Fixed undetected Hue Bridge disconnections.

**Version 3.3.25** - April 2025

- Fixed Hue reconnection after a bridge restart when no KNX gateway is configured.

**Version 3.3.24** - April 2025

- Added support for datapoint 14.1200.

**Version 3.3.23** - April 2025

- Fixed Hue nodes failing to reconnect after a disconnection.

**Version 3.3.22** - March 2025

- Fixed missed Hue Button events.

**Version 3.3.21** - March 2025

- Corrected an unclear datapoint validation error.

**Version 3.3.20** - March 2025

- Fixed Load Control commands received from flows.

**Version 3.3.19** - March 2025

- Hue Light status icons now indicate whether the light is on or off.

**Version 3.3.18** - March 2025

- Hue nodes show both Hue and KNX connection status.
- Improved Hue reconnection and reduced the KNX connection delay.

**Version 3.3.16** - February 2025

- Improved Hue connection handling and detection of disconnections.

**Version 3.3.15** - February 2025

- Added clearer warnings in Watchdog and gateway settings.

**Version 3.3.14** - January 2025

- Added all subtypes of datapoint 20.

**Version 3.3.13** - January 2025

- Hue Light now also supports Hue smart plugs.

**Version 3.3.9** - December 2024

- Fixed a Raspberry Pi network-interface error.

**Version 3.3.8** - December 2024

- Fixed a KNX software issue that stopped nodes from working.

**Version 3.3.7** - December 2024

- Corrected scene-number validation to accept scenes 1 to 64.

**Version 3.3.6** - December 2024

- Alerter reads states after Deploy, including when only one node changes.

**Version 3.3.5** - December 2024

- Alerter now works without an imported ETS file.

**Version 3.3.3** - November 2024

- Added automatic KNX gateway discovery and improved telegram timing on slower computers.

**Version 3.3.0** - November 2024

- Updated KNX connection handling in preparation for KNX Secure.

**Version 3.2.17** - October 2024

- Improved Hue colour conversion and brightness limits.

**Version 3.2.16** - October 2024

- Fixed Hue addresses missing from the ETS import and errors when setting white light.

**Version 3.2.15** - October 2024

- Fixed colour-temperature errors with older Hue Lightstrips.

**Version 3.2.14** - October 2024

- Fixed default gateway selection in Node-RED 4.

**Version 3.2.13** - October 2024

- Removed the recently added debug-log collection feature.

**Version 3.2.12** - October 2024

- Updated the KNX communication software.

**Version 3.2.11** - October 2024

- Improved node help and added diagnostic information for support requests.

**Version 3.2.10** - October 2024

- Fixed Hue Bridge disconnection during a full Deploy.

**Version 3.2.9** - October 2024

- Improved diagnostic messages.

**Version 3.2.8** - October 2024

- Restored the Read status at startup setting for older configurations.

**Version 3.2.7** - September 2024

- Flow messages now indicate when a sent KNX telegram is echoed back.

**Version 3.2.6** - September 2024

- Fixed KNX Viewer's third output.

**Version 3.2.4** - September 2024

- Corrected invalid telegram timing settings in older configurations.

**Version 3.2.2** - September 2024

- Fixed KNX telegram sending.

**Version 3.2.1-beta.0** - September 2024

- Improved diagnostic logging and telegram pacing on the KNX bus.

**Version 3.2.0** - September 2024

- Improved command pacing to avoid overloading the Hue Bridge.

**Version 3.1.9** - September 2024

- Hue Bridge can use existing credentials and display the saved credentials when requested.

**Version 3.1.8** - September 2024

- Completed node help and fixed the ignored logging-level setting.

**Version 3.1.7** - August 2024

- Fixed timing problems in custom KNX functions.

**Version 3.1.6** - August 2024

- Added helpers for toggling and setting KNX values in custom functions.
- Updated the function editor and documentation.

**Version 3.1.5** - August 2024

- KNX Function is no longer beta. Fixed settings when switching from Universal Mode.

**Version 3.1.4** - August 2024

- Added group-address search to the KNX Function editor.

**Version 3.1.3** - August 2024

- KNX Device opens the function editor when custom code is present.
- Simplified Universal Mode selection. KNX Function remains beta and may change.

**Version 3.1.2** - August 2024

- Fixed KNX Function editor issues. It remains beta and may change.

**Version 3.1.1** - August 2024

- Expanded the custom-function editor. It remains beta and may change.

**Version 3.1.0** - August 2024

- Added a function editor for custom handling of incoming and outgoing KNX messages.

**Version 3.0.10** - August 2024

- **Requires Node-RED 3.1.1 or later.**
- Fixed unused saved values in Auto Responder. The node remains beta and may change.

**Version 3.0.9** - August 2024

- **Requires Node-RED 3.1.1 or later.**
- Fixed incorrect Auto Responder replies. The node remains beta and may change.

**Version 3.0.7** - August 2024

- **Requires Node-RED 3.1.1 or later.**
- Auto Responder restores saved values at startup. The node remains beta and may change.

**Version 3.0.6** - August 2024

- **Requires Node-RED 3.1.1 or later.**
- Fixed Auto Responder without an ETS import. The node remains beta and may change.

**Version 3.0.5** - August 2024

- **Requires Node-RED 3.1.1 or later.**
- Auto Responder uses a new list format; check the updated help before editing existing settings. The node remains beta.

**Version 3.0.4** - August 2024

- **Requires Node-RED 3.1.1 or later.**
- New Auto Responder answers KNX read requests with stored values. The node is beta and may change.

**Version 3.0.3** - July 2024

- **Requires Node-RED 3.1.1 or later.**
- Fixed a crash when the KNX interface has no free connections.

**Version 3.0.2** - July 2024

- **Requires Node-RED 3.1.1 or later.**
- New Hue Bridge settings remind you to Deploy before continuing setup.

**Version 3.0.1** - July 2024

- **Requires Node-RED 3.1.1 or later.**
- New gateways automatically detect the correct KNX connection protocol.

**Version 3.0.0** - July 2024

- **Requires Node-RED 3.1.1 or later.**
- Updated the KNX communication software. If you encounter problems, version 2.5.1 remains a fallback.
- Group addresses can come from variables, with easier ETS address selection.
- KNX Viewer can report bus congestion. Added a Hue software-update status node.

**Version 3.0.0-beta3** - Juni 2024

- **Requires Node-RED 3.1.1 or later.**
- KNX Viewer can report bus congestion. Improved settings labels and Hue command handling.

**Version 3.0.0-beta2** - Juni 2024

- **Requires Node-RED 3.1.1 or later.**
- Added a Hue software-update status node.

**Version 3.0.0-beta1** - Juni 2024

- **Requires Node-RED 3.1.1 or later.**
- Beta release of the updated KNX communication software; version 2.5.1 remains a fallback.
- Group addresses can come from variables, with easier ETS address selection and automatic name/datapoint lookup.

**Version 2.5.1** - Mai 2024

- **Requires Node-RED 3.1.1 or later.**
- Quickly toggling a Hue light can temporarily switch it from night to day mode.

**Version 2.5.0** - Mai 2024

- **Requires Node-RED 3.1.1 or later.**
- Hue light groups report average colour and colour temperature.
- **Known issue:** groups may send duplicate status telegrams. Enable the KNX node's RBE filter to suppress duplicates.

**Version 2.4.27** - Mai 2024

- **Requires Node-RED 3.1.1 or later.**
- Fixed colour-temperature and brightness feedback for lights in a Hue group.
- **Known issue:** groups may send duplicate status telegrams. Enable the KNX node's RBE filter to suppress duplicates.

**Version 2.4.25** - Mai 2024

- **Requires Node-RED 3.1.1 or later.**
- Fixed replies to KNX status requests for Hue light groups.
- **Known issue:** groups may send duplicate status telegrams. Enable the KNX node's RBE filter to suppress duplicates.

**Version 2.4.24** - Mai 2024

- **Requires Node-RED 3.1.1 or later.**
- Corrected Hue colour-temperature values sent to KNX with datapoint 7.600.

**Version 2.4.23** - Mai 2024

- **Requires Node-RED 3.1.1 or later.**
- Hue Scene now supports scene numbers up to 64.

**Version 2.4.22** - April 2024

- **Requires Node-RED 3.1.1 or later.**
- Hue Button lets you choose the value and dimming direction when automatic toggling is disabled.

**Version 2.4.21** - April 2024

- **Requires Node-RED 3.1.1 or later.**
- Fixed user-defined Home Assistant Translator conversions.

**Version 2.4.20** - April 2024

- **Requires Node-RED 3.1.1 or later.**
- Numeric text is automatically converted to numbers for datapoint 9.

**Version 2.4.19** - April 2024

- **Requires Node-RED 3.1.1 or later.**
- Added links to video lessons and tutorials.

**Version 2.4.18** - April 2024

- **Requires Node-RED 3.1.1 or later.**
- Fixed KNX Device settings for older configurations.

**Version 2.4.16** - April 2024

- **Requires Node-RED 3.1.1 or later.**
- Added Home Assistant Translator and Hue Contact Sensor nodes.
- Added a group-address list for configuring KNX/IP routing filters.
- Fixed duplicate-value filtering and improved help.

**Version 2.4.9** - March 2024

- **Requires Node-RED 3.1.1 or later.**
- Fixed a reported issue.

**Version 2.4.6** - Feb 2024

- **Requires Node-RED 3.1.1 or later.**
- Improved connection compatibility with some KNX/IP interfaces.

**Version 2.4.5** - Feb 2024

- **Requires Node-RED 3.1.1 or later.**
- Added Hue Zigbee Connectivity and HSV colour controls.
- Improved dimming, colour temperature, startup status and use of multiple bridges.
- Added datapoint 275.100 support and fixed network-interface selection.

**Version 2.4.5-beta.4 PUBLIC BETA** - Feb 2024

- Maintenance release.

**Version 2.4.5-beta.3 PUBLIC BETA** - Feb 2024

- Fixed Hue startup status and added the Zigbee Connectivity node.

**Version 2.4.5-beta.2 PUBLIC BETA** - Feb 2024

- Fixed the network-interface list in gateway settings.

**Version 2.4.5-beta.1 PUBLIC BETA** - Feb 2024

- **Requires Node-RED 3.1.1 or later.**
- Added Hue HSV colour controls and improved colour conversion and dimming. Public beta.

**Version 2.4.5-beta.0** - Jan 2024

- **Requires Node-RED 3.1.1 or later.**
- Fixed Hue colour temperature, effects and dimming from off.
- Improved operation with multiple bridges and added datapoint 275.100 support. Beta release.

**Version 2.4.4** - Jan 2024

- Transition release.

**Version 2.4.0-beta.1** - Jan 2024

- Public beta with fixes for Hue colour temperature, effects, dimming and multiple bridges.

**Version 2.4.0-beta.0** - Jan 2024

- Beta for installations with multiple Hue Bridges, with fixes for colour temperature, effects and dimming.

**Version 2.3.5** - Jan 2024

- Fixed Hue settings when multiple bridges are configured.

**Version 2.3.4** - Jan 2024

- Fixed the Hue brightness tab becoming inaccessible with some status settings.

**Version 2.3.3** - Jan 2024

- Added a message while Hue device details are still loading.

**Version 2.3.2** - Jan 2024

- Minor Hue Light fixes.

**Version 2.3.0** - Jan 2024

- Fixed duplicate Hue brightness updates after a restart.

**Version 2.2.40** - Jan 2024

- Fixed incorrect Hue on/off status at startup.

**Version 2.2.39** - Jan 2024

- Fixed temperature values with many decimal places and Hue dimming at the minimum brightness.

**Version 2.2.37** - December 2023

- Hue Light lets you choose the dimming direction for tunable white lamps.

**Version 2.2.36** - December 2023

- Corrected Hue light-group behaviour when returning from night to day mode.

**Version 2.2.35** - December 2023

- Hue Light can restore the previous state of all lights in a group.

**Version 2.2.34** - December 2023

- Hue Light can generate Home Assistant light settings and restore the last daytime state.
- Hue Scene is no longer beta.

**Version 2.2.33** - December 2023

- Fixed Hue colour-temperature conversion for datapoint 7.600. Hue Scene remains beta.

**Version 2.2.32** - December 2023

- Fixed Hue colour-temperature conversion for datapoint 9.002. Hue Scene remains beta.

**Version 2.2.31** - December 2023

- Hue Scene can report whether a single scene is active. The node remains beta.

**Version 2.2.30** - December 2023

- Added multi-scene control and fixed scene-number selection.
- Hue Light is stable; Hue Scene remains beta.

**Version 2.2.29** - November 2023

- Fixed incorrect Hue Light errors. The new light options remain beta.

**Version 2.2.28** - November 2023

- Fixed incorrect brightness feedback when dimming an off light and errors in dimmable-only groups. The new options remain beta.

**Version 2.2.27** - November 2023

- Hue Light settings adapt to the lamp type. Get current colour now works for groups. The new options remain beta.

**Version 2.2.26** - November 2023

- Fixed Hue Light status errors and brightness feedback on switch-on.
- Hue battery, light-level and temperature sensors can answer KNX read requests. New light options remain beta.

**Version 2.2.25** - November 2023

- Hue Light can answer KNX status requests. Fixed saved behaviour settings and unwanted switch-off. New options remain beta.

**Version 2.2.24** - November 2023

- Added more Hue colour-temperature choices and switch-on colour/brightness settings. The new options remain beta.

**Version 2.2.20** - November 2023

- Fixed editor script loading under Home Assistant.

**Version 2.2.19** - November 2023

- Fixed Hue issues.

**Version 2.2.18** - November 2023

- Fixed Hue issues and improved bridge connection checks.

**Version 2.2.16** - November 2023

- Hue Light and Scene nodes can be controlled directly through flow inputs and outputs.

**Version 2.2.9** - November 2023

- Fixed ioBroker errors and added Hue colour-temperature control in Kelvin, initially in beta.
- Simplified Button and Scene settings.

**Version 2.2.6** - October 2023

- Fixed unwanted Hue Button telegrams at startup and added a startup-initialisation option.

**Version 2.2.5** - October 2023

- Fixed missing Hue event updates and refreshed KNX Device settings.

**Version 2.2.4** - October 2023

- Improved Hue Light status updates and bridge communication.

**Version 2.2.3** - October 2023

- Improved Hue dimming.

**Version 2.2.2** - October 2023

- Hue Motion supports camera motion events. Fixed light-group dimming and improved help.

**Version 2.2.1** - October 2023

- Added Hue dimming speed and brightness limits, with startup status reading.
- Fixed a security vulnerability.

**Version 2.1.63** - October 2023

- Improved the Hue colour-selection screen.

**Version 2.1.62** - October 2023

- Fixed Hue lights not switching on when a preset RGB colour was selected.

**Version 2.1.61** - October 2023

- Added a Hue colour picker in the editor sidebar, also useful for light groups.

**Version 2.1.58** - October 2023

- Hue Light can copy the current lamp colour into its settings.

**Version 2.1.57** - October 2023

- Added Hue brightness-status options and remembered brightness after switch-off.

**Version 2.1.56** - October 2023

- Removed the invalid Hue scene number zero.

**Version 2.1.54** - October 2023

- Hue Scene supports KNX scene buttons using datapoint 18.001.

**Version 2.1.52** - October 2023

- Fixed Hue brightness when switching on.

**Version 2.1.51** - October 2023

- Fixed Hue brightness when switching on.

**Version 2.1.50** - October 2023

- Corrected oversized text in KNX Viewer custom displays.

**Version 2.1.47** - September 2023

- Fixed handling of multiple Hue Bridges.

**Version 2.1.46** - September 2023

- Hue Bridge can fall back to unencrypted HTTP if its HTTPS connection fails.

**Version 2.1.45** - August 2023

- Fixed KNX brightness feedback when using the Hue app and improved handling of unreachable bridges.

**Version 2.1.43** - August 2023

- Reorganised Hue behaviour settings and fixed conflicting colour options.

**Version 2.1.42** - August 2023

- Fixed Hue device names with some Node.js versions.

**Version 2.1.41** - August 2023

- Hue Light can control all grouped lights together.
- Improved colour-temperature control and linked on/off brightness.

**Version 2.1.40** - August 2023

- Fixed Hue colour cycling not stopping when requested.

**Version 2.1.39** - August 2023

- Added percentage-based Hue colour-temperature control and settings that adapt to lamp capabilities.
- Corrected flow message topics and delayed Hue startup status reading until devices are ready.

**Version 2.1.38** - August 2023

- Improved Hue event updates and diagnostic logging.

**Version 2.1.37** - July 2023

- Load Control can be forced to shed or restore loads through flow messages.

**Version 2.1.36** - July 2023

- Fixed Hue updates stopping after a long idle period.

**Version 2.1.35** - July 2023

- Added video examples to Hue node settings.

**Version 2.1.34** - July 2023

- Added Hue light-group support, fixed Tap Dial percentages and reduced bridge traffic.

**Version 2.1.33** - July 2023

- Fixed Hue lights that do not report their supported colour range.

**Version 2.1.32** - July 2023

- New Hue Battery Sensor reports device battery levels. Sensors now read their values at startup.

**Version 2.1.31** - July 2023

- Fixed the datapoint used for Hue colour cycling.

**Version 2.1.29** - July 2023

- Fixed unwanted KNX switch-on feedback caused by very low Hue brightness reports.

**Version 2.1.28** - July 2023

- Fixed Hue dimming behaviour.

**Version 2.1.27** - July 2023

- Simplified settings and moved more help into Node-RED.

**Version 2.1.26** - July 2023

- Fixed Hue brightness feedback.

**Version 2.1.25** - July 2023

- Added an option to update KNX brightness feedback when a Hue light switches on or off.

**Version 2.1.24** - July 2023

- Fixed KNX on/off feedback when no Hue brightness address is configured. Use the RBE filter to suppress duplicate values.

**Version 2.1.23** - July 2023

- Hue brightness changes now update KNX on/off feedback by default.

**Version 2.1.22** - July 2023

- Hue switch-on settings can be used without enabling night lighting.

**Version 2.1.20** - July 2023

- Added optional Hue day/night behaviour and a dedicated behaviour settings tab.

**Version 2.1.19** - July 2023

- Improved Hue Light and Button nodes.

**Version 2.1.18** - July 2023

- Fixed compatibility with MDT and Weinzierl interfaces.

**Version 2.1.17** - July 2023

- Refreshed KNX Device settings, added Hue day/night inversion and clearer node statuses.

**Version 2.1.16** - June 2023

- New Hue Scene node recalls Hue scenes. Added initial KNX Virtual compatibility and improved help.
- **Upgrade notice:** gateway emulation mode was removed.

**Version 2.1.15** - June 2023

- Fixed setup of unpaired Hue Bridges. Enter the bridge IP address before clicking Connect.

**Version 2.1.14** - June 2023

- Added Hue day/night lighting behaviour.

**Version 2.1.13** - June 2023

- Corrected Hue colour-temperature feedback and brightness values on switch-on/off.

**Version 2.1.12** - June 2023

- Added Hue tunable-white control.

**Version 2.1.11** - June 2023

- Global Context lets you choose where values are stored.

**Version 2.1.10** - June 2023

- Moved gateway help into Node-RED and updated the KNX communication software.

**Version 2.1.9** - June 2023

- Started moving help into Node-RED's help panel.

**Version 2.1.8** - June 2023

- Improved Hue event updates.

**Version 2.1.7** - June 2023

- Fixed node status display for dimming, colour and other combined values.

**Version 2.1.6** - June 2023

- Fixed Hue colour-range handling.

**Version 2.1.4** - June 2023

- Added Hue random colour cycling and fixed node shutdown issues.

**Version 2.1.3** - June 2023

- Bug fix.

**Version 2.1.2** - June 2023

- Added Hue blinking control.

**Version 2.1.1** - June 2023

- Hue Tap Dial can send random KNX colours when configured for colour control.

**Version 2.1.0** - June 2023

- Hue integration is no longer beta.

**Version 2.0.21** - June 2023

- Improved Hue event updates and icons. Hue remains beta; existing configurations may need changes.

**Version 2.0.20** - June 2023

- Fixed errors when no Hue Bridges are present. Hue remains beta; existing configurations may need changes.

**Version 2.0.19** - June 2023

- Fixed initial Hue light status. Hue remains beta; existing configurations may need changes.

**Version 2.0.18** - June 2023

- Adjusted Hue command speed. Hue remains beta; existing configurations may need changes.

**Version 2.0.17** - June 2023

- Fixed status reading when creating a Hue light node. Hue remains beta; existing configurations may need changes.

**Version 2.0.16** - June 2023

- Fixed Hue Button and Tap Dial dimming. Hue remains beta; existing configurations may need changes.

**Version 2.0.15** - June 2023

- Added a Hue temperature sensor and adjusted light behaviour. Hue remains beta; existing configurations may need changes.

**Version 2.0.13** - June 2023

- Fixed missing Hue Button output events. Hue remains beta; existing configurations may need changes.

**Version 2.0.12** - June 2023

- Added a Hue light-level sensor. Hue remains beta; existing configurations may need changes.

**Version 2.0.11** - June 2023

- Fixed Hue Button saved settings and removed the unsupported Double Tap option. Hue remains beta; existing configurations may need changes.

**Version 2.0.10** - June 2023

- Redesigned Hue Button and fixed other Hue nodes. Hue remains beta; existing configurations may need changes.

**Version 2.0.9** - June 2023

- Added Hue Motion and Tap Dial nodes.

**Version 2.0.7** - June 2023

- Hue Button has a flow output and a simplified message option.

**Version 2.0.6** - June 2023

- Added Hue Button. Hue integration is beta.
- Expanded Node-RED help.

**Version 2.0.1** - June 2023

- Added more KNX group-address mappings to Hue Light.

**Version 2.0.0** - June 2023

- Added the Hue Light node.
- Global Context names now accept letters only. The interface moves to English-only for this release.

**Version 1.4.18** - Mai 2023

- ETS imports can use a file path instead of pasted content.

**Version 1.4.16** - Mai 2023

- Fixed using multiple Global Context nodes.

**Version 1.4.15** - March 2023

- Fixed international characters in ETS ESF imports and added tariff datapoint 235.001.

**Version 1.4.14** - March 2023

- Added datapoint 29 support.

**Version 1.4.13** - January 2023

- Corrected excessive decimal places in datapoint 9 values.

**Version 1.4.12** - January 2023

- Fixed Scene Controller.

**Version 1.4.11** - January 2023

- Fixed duplicate-value filtering after number formatting and corrected ETS ESF import.
- Added support for Unicode text with datapoint 28.001.

**Version 1.4.10** - December 2022

- Minor fixes and documentation updates.

**Version 1.4.9** - November 2022

- Global Context includes all group addresses from the ETS import.
- Corrected help links.

**Version 1.4.8** - November 2022

- Added datapoints 13.016, 13.1200 and 13.1201.

**Version 1.4.7** - November 2022

- Added the Griesser custom datapoint 6001.001.

**Version 1.4.6** - November 2022

- Added airflow datapoint 9.009.

**Version 1.4.5** - October 2022

- Watchdog suppresses repeated copies of the same node error.

**Version 1.4.4** - October 2022

- Fixed a long-running connection problem caused by an invalid gateway address.

**Version 1.4.3** - October 2022

- KNX Viewer shows clearer values and measurement units.

**Version 1.4.2** - October 2022

- Added datapoint 21.001.

**Version 1.4.1** - October 2022

- Added datapoint 14.077.
- Watchdog can update the ETS group-address list through flow messages.

**Version 1.4.0** - September 2022

- Maintenance update and corrected the flow-rate datapoint description.

**Version 1.3.49** - August 2022

- Fixed name validation in KNX Viewer.

**Version 1.3.48** - August 2022

- Improved compatibility with newer Node.js versions.

**Version 1.3.47** - August 2022

- Temporarily hid KNX Secure settings until support is ready.

**Version 1.3.46** - July 2022

- Gateways accept hostnames as well as IP addresses, and let you choose the connection protocol.
- Added the day/night datapoint.

**Version 1.3.45** - June 2022

- Duplicate-value filters can be reset through a flow message.

**Version 1.3.43** - Mai 2022

- Scene Controller accepts wait times in seconds, minutes or hours.

**Version 1.3.42** - Mai 2022

- Fixed gateway settings on small screens and network-interface detection.

**Version 1.3.41** - Mai 2022

- Fixed manual network-interface settings and Node.js 18 compatibility.

**Version 1.3.40** - Mai 2022

- Global Context can find a missing datapoint from the ETS import.

**Version 1.3.39** - April 2022

- Improved KNX reconnection and handling of delayed or unacknowledged telegrams.
- Corrected an Alerter settings label.

**Version 1.3.38** - April 2022

- Reduced memory use and improved handling of large flows.

**Version 1.3.37** - April 2022

- Busy KNX routers now produce a log warning instead of a disconnection.
- Improved help for loop and overload protection.

**Version 1.3.36** - February 2022

- Updated and removed unused software components.

**Version 1.3.35** - March 2022

- Improved KNX disconnection handling and memory use.
- Fixed Scene Controller statuses and number rounding.

**Version 1.3.32** - February 2022

- Fixed accented characters in KNX text values.

**Version 1.3.31** - February 2022

- KNX Viewer sorts values by group address and adds an output with the complete address list.

**Version 1.3.30** - February 2022

- KNX Viewer shows dates and times in local format.

**Version 1.3.29** - February 2022

- Fixed Load Control timing and added a warning before loads are switched off.

**Version 1.3.28** - February 2022

- New KNX Viewer displays group addresses and values in a dashboard.

**Version 1.3.27** - February 2022

- Load Control can request power readings when the meter does not send updates automatically.

**Version 1.3.26** - February 2022

- Fixed a crash in gateway emulation mode.

**Version 1.3.25** - February 2022

- Corrected Load Control's power unit and added clearer output information.

**Version 1.3.24** - February 2022

- New Load Control switches off selected loads when power use exceeds your limit.
- Fixed Alerter address checks and unnecessary startup reads.

**Version 1.3.22** - February 2022

- Fixed some undecoded values not being sent to KNX.

**Version 1.3.21** - January 2022

- Fixed KNX Logger recording.

**Version 1.3.20** - January 2022

- KNX commands can be held during a temporary disconnection and sent after reconnection.

**Version 1.3.19** - January 2022

- Added pressure datapoint 14.058 and clearer disconnection messages.

**Version 1.3.18** - January 2022

- Scene Controller works without configured Recall and Save group addresses.

**Version 1.3.16** - January 2022

- Invalid telegrams no longer cause a KNX disconnection.
- KNX Secure is not yet supported in this release.

**Version 1.3.15** - January 2022

- Improved disconnection handling with older KNX/IP interfaces. KNX Secure remains unavailable.

**Version 1.3.14** - 26 December 2021

- Improved telegram retries and handling of busy KNX routers.

**Version 1.3.13** - 25 December 2021

- Improved connection checks.
- If acknowledgement requests are disabled, use Watchdog to detect disconnections and reconnect.

**Version 1.3.12** - December 2021

- Added group-address validation, including addresses up to 31/7/255.

**Version 1.3.10** - December 2021

- Fixed unexpected disconnections and improved diagnostic messages.

**Version 1.3.5 (withdrawn)** - December 2021

- Updated the KNX communication software. This release was withdrawn because of a disconnection error.

**Version 1.3.4** - December 2021

- Temporarily restored the previous KNX communication software to resolve issues.

**Version 1.3.2** - December 2021

- Added a button to collect diagnostic information for support requests.

**Version 1.3.1** - December 2021

- Replaced the KNX communication software and improved connection settings.
- Logger records sent as well as received telegrams. Fixed replies and settings with multiple gateways.
- KNX Secure settings are hidden until support is ready.
- **If this update causes connection problems:** return to version 1.2.57.

**Version 1.2.57** - November 2021

- Added time-counter and liquid-volume datapoints.

**Version 1.2.56** - November 2021

- Restored local telegram feedback in tunnelling mode.

**Version 1.2.55** - November 2021

- Improved gateway performance and added keyring reading and indicators in preparation for KNX Secure.

**Version 1.2.54** - November 2021

- Improved KNX startup, reconnection and large-installation handling.
- Added an optional startup connection delay and clearer gateway status. Logging settings no longer require a restart.
- **If this update causes connection problems:** return to version 1.2.53.

**Version 1.2.53** - November 2021

- New nodes can read their initial KNX value after a partial Deploy.

**Version 1.2.52** - October 2021

- Corrected KNX Logger defaults.

**Version 1.2.51** - October 2021

- KNX Logger can count telegrams over a chosen time interval.
- Fixed Sunday handling in time values and improved diagnostics.

**Version 1.2.49** - October 2021

- Improved KNX connections and added an option to disable automatic connection at startup.
- Fixed Watchdog configuration changes with a manually selected network interface.

**Version 1.2.48** - October 2021

- Corrected Watchdog's status colour during its first connection test.

**Version 1.2.47** - September 2021

- Added power-factor datapoint 14.057.

**Version 1.2.46** - September 2021

- Global Context can send values using datapoints from the ETS import.

**Version 1.2.45** - September 2021

- Added Chinese translations for settings and documentation.

**Version 1.2.44** - September 2021

- Scene Controller can pause between commands. Improved links between help pages.

**Version 1.2.43** - September 2021

- Fixed Watchdog reconnect commands.

**Version 1.2.42** - August 2021

- Fixed custom message topics in gateway emulation mode.

**Version 1.2.41** - August 2021

- Fixed restoring saved KNX values other than on/off states.

**Version 1.2.40** - August 2021

- Reduced resource use and excessive reconnection attempts.

**Version 1.2.39** - August 2021

- Further improved KNX reconnection checks.

**Version 1.2.38** - August 2021

- Fixed reconnection after a network interruption.
- Saved values are kept separately for each gateway. Improved startup timing and replies when a value is unknown.

**Version 1.2.36** - July 2021

- Fixed ETS import messages and a help link.
- Added initial keyring import support; full KNX Secure support is not yet available.

**Version 1.2.34** - June 2021

- Added an option to ignore repeated telegrams from the KNX bus.

**Version 1.2.33** - May 2021

- The gateway's node overview shows more configuration details.

**Version 1.2.32** - May 2021

- Added time and volume datapoints 14.074 and 14.076.

**Version 1.2.31** - May 2021

- Fixed restoring saved values after changing a node's datapoint.

**Version 1.2.30** - May 2021

- Improved handling of invalid numeric input for datapoint 14.

**Version 1.2.29** - May 2021

- Saved values load before startup bus reads, so virtual devices can answer correctly.
- Watchdog can enable or stop a gateway's connection attempts.

**Version 1.2.28** - May 2021

- Fixed sending an on/off value to a text datapoint stopping other nodes.

**Version 1.2.27** - April 2021

- Fixed Alerter's reporting order. It can read all monitored states on connection or on request.

**Version 1.2.26** - April 2021

- Alerter has a third output for the most recently triggered device.

**Version 1.2.25** - April 2021

- Alerter can output all active alerts together and use short or long device descriptions.

**Version 1.2.23** - April 2021

- Alerter handles KNX response telegrams as well as writes. Improved list editing.

**Version 1.2.22** - April 2021

- Added the Alerter node and examples. Fixed message topics in Universal Mode emulation.

**Version 1.2.21** - April 2021

- Improved KNX multicast communication across network subnets.

**Version 1.2.20** - April 2021

- Changed the default acknowledgement setting for better compatibility with some KNX/IP interfaces.

**Version 1.2.19** - April 2021

- Added a Silent logging option to reduce disk activity.

**Version 1.2.18** - April 2021

- KNX values can be restored after reconnection or a Node-RED restart.
- Improved checks for invalid telegrams.

**Version 1.2.14** - March 2021

- KNX Logger records sent telegrams when using a KNX/IP interface, as well as a router.

**Version 1.2.13** - March 2021

- Global Context has an adjustable KNX writing interval and improved help and translations.

**Version 1.2.11** - February 2021

- Added gateway emulation for testing and teaching without sending commands to the KNX bus.

**Version 1.2.10** - February 2021

- Corrected Global Context translations and added a setup warning.

**Version 1.2.9** - February 2021

- New Global Context node makes KNX values available to flow functions.
- Added the combined date/time datapoint 19.001.

**Version 1.2.8** - January 2021

- Node settings can be changed through flow messages.

**Version 1.2.7** - January 2021

- Added DALI diagnostic datapoint 237 and an example.

**Version 1.2.6** - January 2021

- Added datapoint 213 and an example.

**Version 1.2.5** - January 2021

- A node's stored value can be updated without sending a KNX telegram.
- Fixed read-request output when no value is available yet.

**Version 1.2.4** - January 2021

- Removed KNX Virtual compatibility to fix connection problems in some Node-RED installations.

**Version 1.2.3** - 31 December 2020

- Corrected values for datapoints 249.600 and 242.600.

**Version 1.2.2** - 31 December 2020

- Added datapoint 249.600 and corrected validity indicators for colour datapoint 242.600.

**Version 1.2.1** - December 2020

- Fixed duplicate-value filtering for colour datapoint 242.600.
- **Upgrade notice:** messages for this datapoint must now indicate whether colour and brightness are valid. See the updated help.

**Version 1.2.0** - December 2020

- Added KNX Virtual compatibility and improved loop protection and examples.

**Version 1.1.99** - December 2020

- Fixed duplicate-value filtering for combined values such as colours.

**Version 1.1.98** - December 2020

- Added colour datapoint 242.600.

**Version 1.1.97** - December 2020

- Added help links and datapoint examples directly in settings.

**Version 1.1.95** - December 2020

- Flows can send undecoded telegrams to the KNX bus.

**Version 1.1.93** - December 2020

- Invalid gateway addresses are rejected before connecting.

**Version 1.1.92** - October 2020

- Fixed RGB colour control.

**Version 1.1.91** - October 2020

- Added datapoint 22.201 and more datapoint examples.

**Version 1.1.90** - October 2020

- Improved busy KNX installations using knxd.
- Fixed missing input examples and added more datapoint and automation examples.

**Version 1.1.89** - September 2020

- Fixed some knxd connection failures.

**Version 1.1.88** - September 2020

- Corrected Scene Controller output when the node is disabled.

**Version 1.1.86** - September 2020

- Scene Controller can be disabled through a flow message.

**Version 1.1.85** - September 2020

- Fixed old telegrams remaining in KNX Logger after output.

**Version 1.1.84** - September 2020

- Datapoint names now match ETS. Added more datapoints and input examples directly in settings.

**Version 1.1.83** - September 2020

- Added datapoints 222.100 and 222.201 with examples.

**Version 1.1.82** - August 2020

- Fixed diagnostic logging in datapoint handling.

**Version 1.1.81** - August 2020

- Added the fan-stage datapoint and clearer log timestamps and labels.

**Version 1.1.80** - August 2020

- Changes to logging level apply immediately without restarting Node-RED.

**Version 1.1.79** - August 2020

- Scene Controller can save a group-address value from a flow message.

**Version 1.1.76** - August 2020

- Fixed invalid Logger files that ETS could not open and a settings display issue.

**Version 1.1.75** - June 2020

- Added datapoint 7 support, including colour temperature, and corrected Italian help.

**Version 1.1.73** - Mai 2020

- ETS import no longer fails because another node has no gateway selected.

**Version 1.1.72** - Mai 2020

- Fixed Watchdog gateway changes and connection checks with older Node-RED versions.

**Version 1.1.71** - Mai 2020

- Added RGBW colour support and improved KNX connection checks.
- Watchdog's basic network check uses ping and applies to KNX/IP interfaces, not multicast routers.

**Version 1.1.70** - Mai 2020

- Added adjustable delays between telegrams, with a separate delay for read requests.

**Version 1.1.69** - Mai 2020

- Added datapoints 12.001 and 12.1201.

**Version 1.1.68** - April 2020

- Fixed unexpected KNX tunnelling disconnections.

**Version 1.1.67** - April 2020

- Restored the local-feedback option and improved recovery after network problems.

**Version 1.1.65** - April 2020

- Fixed ETS device names containing the # character.
- Enabled local telegram feedback for KNX/IP interfaces.

**Version 1.1.64** - April 2020

- Added Read as a selectable outgoing telegram type.

**Version 1.1.63** - April 2020

- Added RGB input guidance and enabled automatic local telegram feedback in tunnelling mode.

**Version 1.1.62** - April 2020 in Italy, we're crying our dead people.

- Improved gateway discovery descriptions and updated KNX communication software.

**Version 1.1.61** - April 2020 in Italy, deaths are increasing to 600 pro day.

- Fixed ESF imports with multiple group addresses for one device property.

**Version 1.1.60** - April 2020 in Italy, deaths are decresing to 500 pro day.

- Restored gateway settings translations.

**Version 1.1.59** - April 2020 in Italy, deaths are decresing to 500 pro day.

- Corrected translations and added a 10-byte datapoint.

**Version 1.1.58** - April 2020 in Italy, continue lock down Coronavirus.

- Minor fixes and translation updates.
- **Upgrade notice:** change gateway settings through Watchdog; this option was removed from KNX Device.

**Version 1.1.57** - April 2020 in Italy, continue lock down Coronavirus, but situation is better now.

- Added full KNX scene support for datapoint 18.001 and an example.

**Version 1.1.55** - March 2020 in Italy, continue lock down Coronavirus, but situation is better now.

- ETS import can skip group addresses without a datapoint.

**Version 1.1.54** - March 2020 in Italy, continue lock down Coronavirus, but situation is better now.

- Improved group-address search, date/time status display and palette organisation.
- Expanded German translations.

**Version 1.1.53** - March 2020 in Italy, continue lock down Coronavirus.

- Added an option to forward incoming flow messages through the node.

**Version 1.1.52** - March 2020 in Italy, continue lock down Coronavirus.

- New KNX Logger records telegrams in a file that ETS can read.
- Fixed international ETS imports, Scene Controller suggestions and Watchdog startup.

**Version 1.1.50** - March 2020 in Italy, continue lock down Coronavirus. Cases 25.000

- Fixed Scene Controller saved settings, dimming commands and operation without an ETS import.

**Version 1.1.48** - March 2020 in Italy, continue lock down Coronavirus. Milan index down 8%, Down Jons as well. Panic selling everywhere.

- Fixed automatic device names after copying nodes and improved Scene Controller settings.

**Version 1.1.47** - March 2020 in Italy, continue lock down. More people involved in Coronavirus

- Fixed the gateway's node list. New nodes can use ETS name suggestions before their first save.

**Version 1.1.45** - March 2020 in Italy, we're locked down for Coronavirus

- Nodes sharing a group address now receive local writes when using KNX/IP interfaces.
- Added translations. Node-RED 1.0.3 or later is needed for translated settings.

**Version 1.1.43** - March 2020 in the middle of Coronavirus emergency in Italy

- Added the Scene Controller node.

**Version 1.1.40** - March 2020

- Improved telegram handling by prioritising writes and responses.

**Version 1.1.39** - March 2020

- Fixed a possible crash when responding with a combined value.

**Version 1.1.38** - March 2020

- Forced ETS imports use on/off datapoint 1.001 when a datapoint is missing.

**Version 1.1.37** - Feb 2020

- Fixed opening settings for a new node without a gateway.

**Version 1.1.36** - Feb 2020

- Added ETS ESF imports alongside CSV.

**Version 1.1.34** - Feb 2020

- Fixed RGB values and added a colour example.

**Version 1.1.33** - Feb 2020

- Watchdog reports gateway configuration changes to the flow.
- Fixed a rare connection-related crash.

**Version 1.1.32** - Feb 2020

- Added number formatting options and improved KNX read handling.
- Fixed Universal Mode settings and device names without an ETS import.

**Version 1.1.31** - Feb 2020

- Improved reading KNX values on connection and reconnection.

**Version 1.1.30** - Feb 2020

- Watchdog can report errors from other KNX Ultimate nodes.

**Version 1.1.29** - Feb 2020

- Updated icons and colours. Added a copyable list of group addresses for KNX routing filters.
- Flow output includes readable value descriptions such as On/Off.

**Version 1.1.28** - Jan 2020

- Added message-topic settings and help for node protection.

**Version 1.1.27** - Jan 2020

- Flow output includes measurement units and datapoint descriptions.
- Added a logging-level setting.

**Version 1.1.26** - Jan 2020

- Added Watchdog and a dedicated KNX Ultimate palette category.

**Version 1.1.25** - Jan 2020

- Gateway connection settings can be changed from a flow.

**Version 1.1.24** - Jan 2020

- Fixed read requests without a value and improved invalid-input messages.

**Version 1.1.22**

- Flow output includes the previous value.

**Version 1.1.21**

- Fixed a possible crash when sending response telegrams and clarified status colours.

**Version 1.1.20**

- ETS import can stop or skip addresses with missing datapoints.
- Simplified settings and added voice-assistant examples.

**Version 1.1.19**

- Simplified node settings.

**Version 1.1.18**

- Fixed the order of sent telegrams and moved less-used settings into an Advanced section.

**Version 1.1.17**

- Fixed automatic replies to KNX read requests.

**Version 1.1.16**

- Added spacing between outgoing telegrams to avoid overloading the KNX bus.

**Version 1.1.15**

- Fixed KNX communication issues and added troubleshooting help.

**Version 1.1.14**

- Fixed duplicate-value filtering on output.

**Version 1.1.13**

- Maintenance release.

**Version 1.1.12**

- Improved Universal Mode and automatic datapoint detection.

**Version 1.1.12**

- Universal Mode can send and receive KNX telegrams without an ETS import.
- Improved settings and messages for invalid addresses.

**Version 1.1.10**

- Nodes can answer KNX read requests with their stored value.
- Fixed Universal Mode when an address is missing from the ETS import.

**Version 1.1.9**

- Improved node status options and fixed KNX/IP connections remaining occupied after Deploy.

**Version 1.1.8**

- New nodes filter repeated output values by default to help prevent loops.
- Fixed a crash after losing the KNX connection and improved log labels.

**Version 1.1.7**

- Fixed network-interface selection and allowed manual interface names.

**Version 1.1.6**

- Fixed ETS CSV descriptions containing line breaks or parentheses.

**Version 1.1.4**

- Shortened the last-update date and time shown in node status.

**Version 1.1.3**

- Node status includes the last-update date and time.

**Version 1.1.2**

- Improved read-request timing and added filtering of repeated incoming values.
- Added network-interface selection and fixed saved gateway settings.

**Version 1.1.1**

- Clarified connection status and added ETS group names to address suggestions.

**Version 1.1.0 LTS (Long term stable)**

- Nodes stopped by loop protection can be re-enabled with a partial Deploy.
- Universal Mode disables duplicate-value filtering.

**Version 1.0.19**

- Added automatic loop protection.

**Version 1.0.18**

- Added gateway settings for physical address and older KNX/IP interfaces.
- Added filtering of repeated input values.

**Version 1.0.16**

- Added protection against loops between linked nodes.
- **Upgrade notice:** the input message format changed. Check the message examples in the help before updating existing flows.

**Version 1.0.15**

- Device names are included in output even without an ETS import.

**Version 1.0.14**

- Fixed KNX component installation.

**Version 1.0.7**

- Added checks for invalid group addresses.

**Version 1.0.5**

- Corrected a problem in the previous fix.

**Version 1.0.5**

- Corrected a typing error in the software.

**Version 1.0.4**

- Fixed ETS CSV handling.

**Version 1.0.3**

- Selecting an ETS group address automatically fills in its device name and datapoint.

**Version 1.0.2**

- Fixed minor settings display issues.

**Version 1.0.1 FIRST PUBLIC RELEASE**

- First public release, with minor fixes, documentation and an ETS import video.

**Version 0.0.6 BETA**

- Fixed telegram-type selection and added read/response status colours.

**Version 0.0.5 BETA**

- Added help and fixed status reading.

**Version 0.0.3 BETA**

- Added help, examples and clearer ETS import messages.

**Version 0.0.2 BETA**

- Added beta warnings.

**Version 0.0.1 BETA**

- Initial beta release.
