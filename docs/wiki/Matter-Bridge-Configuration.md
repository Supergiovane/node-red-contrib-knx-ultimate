---
layout: wiki
title: "Matter-Bridge-Configuration"
lang: en
permalink: /wiki/Matter-Bridge-Configuration
---
# Matter Bridge (BETA)

> This node is in **BETA**: it works, but details may still change between releases.

## Overview

This configuration node is the **Matter bridge itself**: it runs the Matter server that Alexa, Google Home, Apple Home (or any Matter controller) commission **once**. Every **Matter Bridge device** node in your flows points here and appears in the apps as one bridged device.

## Configuration

|Field|Description|
|--|--|
| Name | The name of this configuration node in Node-RED |
| Matter bridge name | How the bridge itself is named in the Matter apps. **Leave it empty to reuse this node's Name.** |
| Port | UDP port of the Matter server (default 5540). Each bridge needs its own port, so you can run **multiple independent bridges** |

## Pairing

1. **Deploy**, wait a few seconds, then open this node again.
2. The pairing panel shows the **QR code** and the **manual pairing code**: scan or type it in Alexa / Google Home / Apple Home ("add Matter device").
3. Multiple controllers can be paired with the same bridge (Matter multi-fabric).

To add another controller after the QR code is hidden, open pairing mode from an already paired controller, then add a Matter device in the new controller. Use **Reset pairing** only to remove every existing controller and start over.

The **Reset pairing** button removes all paired controllers and restarts the pairing advertising.

## Identity and storage

The bridge identity is tied to this configuration node and stored in `knxultimatestorage/matter` inside the Node-RED user directory: re-deploys (even changing port or name) do **NOT** require a new pairing. Only deleting this configuration node and creating a new one changes the identity — in that case remove the old bridge from the Matter app and pair again.

Use **Export** to download a complete backup of this bridge instance, including fabrics, private credentials, sessions and pairing data. **Protect the file like a password.** Import replaces this instance's storage and briefly restarts the bridge. A bridge backup cannot be imported into a controller.

## Notes

- The Node-RED host must have **IPv6 link-local** enabled (standard Matter requirement) and be reachable from the controllers on the local network.
- Device nodes added/renamed/removed are picked up by the paired controllers within seconds, without re-pairing.
- **Naming:** Alexa and Google Home honor the names you set here (bridge name and device node names). **Apple Home ignores them and asks you to name each accessory manually during setup** — this is an Apple limitation, not a bridge issue.
