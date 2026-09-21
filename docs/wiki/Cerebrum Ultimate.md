---
layout: wiki
title: "Cerebrum Ultimate"
lang: en
permalink: /wiki/Cerebrum-Ultimate
---
### Upgrade to KNX Ultimate 8

Version 7 shows a compact **Upgrade to v8** button at the top of this editor. It downloads a flow backup, installs the required HUE/Matter packages, converts compatible nodes, performs a full Deploy, verifies the saved flows and installs version 8. Restart the Node-RED service when prompted; reloading only the browser is not enough. Legacy KNX AI nodes stop the automatic operation.

[Full upgrade guide](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Upgrade-to-v8)

<br/>

# Cerebrum Ultimate

The legacy AI node bundled with KNX Ultimate has been replaced by the standalone **Cerebrum Ultimate** package.

Cerebrum Ultimate treats KNX Ultimate as an optional compatible integration, alongside Home Assistant, HUE, Matter, UniFi Protect and other registered adapters. New installations should use [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate).

Since **7.1.1**, the legacy `knxUltimateAI` and `knxUltimateAIHomeAssistant` nodes and their web dashboard are included again for compatibility with existing flows. The nodes are hidden from the palette; existing configurations and saved AI data remain supported. Migration to standalone Cerebrum Ultimate is optional and there is no automatic conversion.

The complete English documentation lives in the [Cerebrum Ultimate README](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
