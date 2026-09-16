---
layout: wiki
title: "Cerebrum Ultimate"
lang: en
permalink: /wiki/Cerebrum-Ultimate
---

# Cerebrum Ultimate

The legacy AI node bundled with KNX Ultimate has been replaced by the standalone **Cerebrum Ultimate** package.

Cerebrum Ultimate treats KNX Ultimate as an optional compatible integration, alongside Home Assistant, HUE, Matter, UniFi Protect and other registered adapters. New installations should use [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate).

Since **7.1.1**, the legacy `knxUltimateAI` and `knxUltimateAIHomeAssistant` nodes and their web dashboard are included again for compatibility with existing flows. The nodes are hidden from the palette; existing configurations and saved AI data remain supported. Migration to standalone Cerebrum Ultimate is optional and there is no automatic conversion.

The complete English documentation lives in the [Cerebrum Ultimate README](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
