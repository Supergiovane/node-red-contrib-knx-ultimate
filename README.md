<p align="center">
  <img src="img/logo-supervibe.png" alt="KNX Ultimate - Max Supervibe" width="200">
</p>

![Logo](img/logo-big.png)

## The most popular KNX node for Node-RED

KNX Ultimate is the most advanced KNX integration for Node-RED, providing secure KNX/IP communication, routing, ETS project import, Philips Hue, Matter Controller and Matter Bridge (control matter device via KNX and expose KNX GA via Matter), MQTT, diagnostics, virtual devices, and powerful automation nodes. Build professional, reliable, and scalable smart home and building automation projects with minimal effort.

**KNX Utility** brings eleven functions into one palette node: Alerter, AutoResponder, DateTime, WatchDog, GlobalContext, Logger, Staircase, Garage, SceneController, LoadControl and Home Assistant Translator. Select a function to get its editor, icon and ports; KNX Device remains the main node. Home Assistant Translator converts message values to booleans without requiring a KNX gateway. Existing dedicated nodes continue to work. The migration button converts all compatible nodes in every flow and subflow, preserving IDs, settings, connections, saved scenes and values. Before KNX or HUE conversion, the browser automatically starts downloading a dated JSON backup of all current editor flows using the standard Node-RED export format, without declared credentials. Conversion supports a single Undo and waits for you to Deploy. See the [KNX Utility guide](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/KNX-Utility), localized node help and the [example flow with all eleven functions](examples/KNX%20Utility%20-%20All%20functions.json).

When the editor opens, a migration reminder appears only if its flows or subflows contain legacy HUE or KNX utility nodes. It shows a migration button for each family present; **Later** dismisses the reminder for the current editor session. Existing nodes continue to work, and each migration keeps its backup, confirmation and manual Deploy steps.

Starting with **7.1.1**, HUE and Matter nodes are hidden from the palette. All their runtimes, configuration nodes and dependencies remain included, so existing flows can still be edited and deployed.

**KNX Viewer** opens a simple ETS-style list of group address state changes, with time, telegram type (Read, Write, Response), source, GA, name, DPT, previous value and new value. Read requests are also recorded, without changing the last known GA value. Search the history or pause the live view; the node keeps recording to local files and retains the last 24 hours across Node-RED restarts. See the [KNX Viewer guide](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer).

The AI assistant is available in the standalone [Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate) package, with KNX Ultimate as an optional compatible integration. Starting with **7.1.0-beta.0**, the legacy `knxUltimateAI` and `knxUltimateAIHomeAssistant` nodes and their bundled web dashboard have been removed. Existing flows containing these types will show unknown nodes: migrate them to standalone Cerebrum Ultimate before upgrading. There is no automatic conversion; saved AI data on disk is left untouched.

<br/>
<br/>
<br/>

[![NPM version][npm-version-image]][npm-url]
[![Node.js version][node-version-image]][npm-url]
[![Node-RED Flow Library][flows-image]][flows-url]
[![Docs][docs-image]][docs-url]
[![Commit activity][commit-activity-image]][commit-activity-url]
[![Last commit][last-commit-image]][last-commit-url]
[![NPM downloads per month][npm-downloads-month-image]][npm-url]
[![NPM downloads total][npm-downloads-total-image]][npm-url]
[![MIT License][license-image]][license-url]
[![JavaScript Style Guide][standard-image]][standard-url]
[![Youtube][youtube-image]][youtube-url]

<p align="center">
  <img src="img/readmemain.png" alt="Sample Node" width="70%">
</p>

<p align="left" style="font-size:2.25rem;font-weight:700;line-height:1.9;">
  <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Home" target="_blank">📘 Go to documentation (English)</a><br/>
  <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Home" target="_blank">📘 Vai alla documentazione (Italiano)</a><br/>
  <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Home" target="_blank">📘 Zur Dokumentation (Deutch)</a><br/>
  <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Home" target="_blank">📘 Accéder à la documentation (Français)</a><br/>
  <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Home" target="_blank">📘 Ir a la documentación (Español)</a><br/>
  <a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Home" target="_blank">📘 前往文档 (中文)</a><br/>
</p>

<p align="left" style="font-size:2.25rem;font-weight:700;line-height:1.9;">
<a href="https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md"
      style="display:inline-flex;align-items:center;gap:10px;padding:12px 24px;border-radius:999px;background:#ffc439;color:#111;font-weight:700;text-decoration:none;box-shadow:0 16px 30px rgba(255,196,57,0.32);">
      CHANGELOG
    </a>
</p>

</br>

[license-image]: https://img.shields.io/github/license/Supergiovane/node-red-contrib-knx-ultimate?color=blue
[license-url]: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/LICENSE
[npm-url]: https://npmjs.org/package/node-red-contrib-knx-ultimate
[npm-version-image]: https://img.shields.io/npm/v/node-red-contrib-knx-ultimate.svg
[node-version-image]: https://img.shields.io/node/v/node-red-contrib-knx-ultimate?logo=node.js&logoColor=white
[npm-downloads-month-image]: https://img.shields.io/npm/dm/node-red-contrib-knx-ultimate.svg
[npm-downloads-total-image]: https://img.shields.io/npm/dt/node-red-contrib-knx-ultimate.svg
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com
[youtube-image]: https://img.shields.io/badge/YouTube-Playlists-red?logo=youtube&logoColor=white
[youtube-url]: https://www.youtube.com/channel/UCA9RsLps1IthT7fDSeUbRZw/playlists
[docs-image]: https://img.shields.io/badge/Docs-GitHub%20Pages-2ea44f
[docs-url]: https://supergiovane.github.io/node-red-contrib-knx-ultimate/
[commit-activity-image]: https://img.shields.io/github/commit-activity/m/Supergiovane/node-red-contrib-knx-ultimate?logo=github
[commit-activity-url]: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/commits/master
[last-commit-image]: https://img.shields.io/github/last-commit/Supergiovane/node-red-contrib-knx-ultimate?logo=github
[last-commit-url]: https://github.com/Supergiovane/node-red-contrib-knx-ultimate/commits/master
[github-image]: https://img.shields.io/badge/GitHub-Repository-000000
[github-url]: https://github.com/Supergiovane/node-red-contrib-knx-ultimate
[flows-image]: https://img.shields.io/badge/Node--RED-Flow%20Library-white?logo=nodered&logoColor=8F0000
[flows-url]: https://flows.nodered.org/node/node-red-contrib-knx-ultimate
[paypal-image]: https://img.shields.io/badge/Support-PayPal-blue
[paypal-url]: https://www.paypal.com/donate/?hosted_button_id=S8SKPUBSPK758
[docs-button-image]: https://img.shields.io/badge/Docs-Open%20Documentation-0d4c70?style=for-the-badge&logo=book&logoColor=f4fbff
