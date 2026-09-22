---
layout: wiki
title: "Upgrade from version 7"
lang: en
permalink: /wiki/Migration-8
translation_key: "Migration-8"
---

# Upgrade from version 7

Version 8 removes the old HUE, Matter and AI nodes, their configuration nodes and the separate KNX utility nodes. Complete migration while KNX Ultimate 7 is still installed.

> ▶️ [Watch the KNX Ultimate 7 → 8 migration video](https://youtu.be/fpNNi1jZZSc) *(Italian)*

1. Back up the entire Node-RED user directory: flows, credentials, settings and `knxultimatestorage`. A flow JSON export alone does not save Matter pairings.

2. In KNX Ultimate 7, use **Migrate KNX** or the conversion button in KNX Utility to convert the old utility nodes. Check all flows and subflows, then Deploy.

3. Install `node-red-contrib-hue-ultimate` and/or `node-red-contrib-matter-ultimate` and restart Node-RED. Accept their migration prompt. HUE converts both the old individual nodes and the old multimode Controller.

4. Review and Deploy the converted flows. The tools preserve node IDs and configuration references. Keep the same user directory and do not delete `knxultimatestorage/matter`: it contains the Matter pairing identities and fabrics.

5. Replace or remove `knxUltimateAI` and `knxUltimateAIHomeAssistant` before upgrading. Cerebrum Ultimate is the separate AI package; there is no automatic AI conversion. Remove unused old configuration nodes too.

6. Confirm that your devices work, then install KNX Ultimate 8 and restart Node-RED. HUE and Matter nodes using KNX keep the existing gateway.

## If installation is blocked

The version 8 installer checks saved flows for old HUE and Matter nodes, including configuration nodes, disabled flows and subflows. Installing the new packages is not enough: convert and Deploy first. The check cannot cover every custom storage setup or unsaved editor change, so the migration steps remain necessary.

If you upgraded too early, reinstall KNX Ultimate 7 and restart Node-RED before migrating. Restore your full backup if necessary; do not delete unknown nodes or reset Matter pairings.

## Documentation

- [KNX Utility]({{ '/wiki/KNX-Utility' | relative_url }})
- [HUE Ultimate](https://supergiovane.github.io/node-red-contrib-hue-ultimate/en/index.html)
- [Matter Ultimate](https://supergiovane.github.io/node-red-contrib-matter-ultimate/en/index.html)
- [Cerebrum Ultimate](https://github.com/Supergiovane/node-red-contrib-cerebrum-ultimate#readme)
