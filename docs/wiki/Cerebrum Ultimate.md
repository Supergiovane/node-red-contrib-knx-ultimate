---
layout: wiki
title: "Cerebrum Ultimate"
lang: en
permalink: /wiki/Cerebrum-Ultimate
---

# Cerebrum Ultimate

The legacy AI node bundled with KNX Ultimate has been replaced by the standalone **Cerebrum Ultimate** package.

Cerebrum Ultimate treats KNX Ultimate as an optional compatible integration, alongside Home Assistant, HUE, Matter, UniFi Protect and other registered adapters. New installations should use [`node-red-contrib-cerebrum-ultimate`](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate).

Starting with **7.1.0-beta.0**, `knxUltimateAI` and `knxUltimateAIHomeAssistant` and their bundled web dashboard have been removed from KNX Ultimate. Existing flows containing these types will show unknown nodes. Migrate those flows to standalone Cerebrum Ultimate before upgrading; there is no automatic conversion. Saved AI data on disk is left untouched.

The complete English documentation lives in the [Cerebrum Ultimate README](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme).
