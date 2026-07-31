---
layout: wiki
title: "Matter-Controller-Configuration"
lang: en
permalink: /wiki/Matter-Controller-Configuration
---
# Matter Controller

<div data-matter-controller-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#241047 0%,#5531a7 55%,#8b5cf6 100%);box-shadow:0 14px 30px rgba(36,16,71,0.25);color:#faf7ff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#e3d7ff;">Matter fabric · Commissioning · KNX</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Your Matter fabric, under your control.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#faf7ff;">Commission devices over the IP network and make their endpoints available to KNX and Node-RED. Pair, monitor, back up and remove devices from one configuration node.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Local fabric</strong><span style="font-size:0.76rem;color:#eee7ff;">private credentials</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">QR + manual</strong><span style="font-size:0.76rem;color:#eee7ff;">commissioning codes</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Export / Import</strong><span style="font-size:0.76rem;color:#eee7ff;">protected backup</span></div>
  </div>
</div>

## One controller, the complete lifecycle

| Area | What it covers |
|---|---|
| **Commissioning** | Matter QR payload, webcam or image scan, manual code and multi-fabric pairing over WiFi, Ethernet or Thread. |
| **Device management** | Device inventory, connection state, safe removal and independent per-device command queues. |
| **KNX & Node-RED** | Endpoint mappings, Universal Mode, dynamic commands and the universal battery monitor. |
| **Resilience & storage** | Persistent fabric, instance backup/restore, unavailable-device gate and automatic recovery. |

## Start in four steps

1. Add and **deploy** Matter Controller.
2. Reopen it and commission one device with its Matter QR payload or manual code.
3. Add **Control Matter from KNX**, then choose the device and its profile.
4. Map the KNX group addresses or enable the Node-RED flow pins, then deploy.

> **Tip:** prefer the `MT:...` QR payload: it contains the full discriminator, while the 11-digit manual code contains only the short discriminator.

## Technical overview

This configuration node is a full **Matter controller**: it creates its own Matter *fabric* and commissions (pairs) your Matter devices into it. The paired devices are then available to the **Matter Device** nodes, which map them to KNX group addresses.

The controller talks to the devices over the **IP network** (WiFi, Ethernet, or Thread through a border router). Bluetooth commissioning is not supported: the device must already be reachable on the network.

## Pairing a device

1. **Deploy** this configuration node first (the controller must be running).
2. Open the node again and enter the **pairing code**: either the 11-digit manual code (e.g. `3497-011-2332`) or the QR code content (`MT:....`).
3. For a manually entered code, click **PAIR**. A QR read with **Webcam** or **Image** starts pairing automatically. Commissioning can take up to a minute.

Instead of typing the QR payload, click **Webcam** to scan it live or **Image** to read it from a local picture. Both standard dark-on-light and inverted white-on-dark QR codes are supported. Decoding takes place entirely in the browser; after a valid Matter QR is read, the editor fills the pairing-code field and immediately starts pairing. Enter the optional device name before scanning if desired. A manually typed code still starts only when you click **PAIR**. Live webcam access requires the editor to be opened over HTTPS or from `localhost`; when that is not possible, the editor explains the limitation and image loading remains available.

While commissioning is in progress, a blocking wait panel covers the editor and prevents further clicks until the operation succeeds or fails.

If the device is brand new and only supports Bluetooth commissioning, first pair it with its vendor app or another Matter controller (Alexa, Google Home, Apple Home), then use that controller's **"share / pair with another hub"** function to generate a new pairing code for KNX-Ultimate. This way the device joins multiple fabrics at once.

Prefer the QR payload (`MT:...`): it contains the full discriminator. A manual code contains only the short discriminator and may select the wrong device when several identical models are in commissioning mode. Pair one device at a time.

## Universal Mode

In **Control Matter from KNX**, choose **Universal Mode** to observe every commissioned device through one flow node. It always exposes one input and one output and does not use endpoint mappings. A KNX gateway is optional and is used only by the Battery Monitor alarm/text GAs.

The **Universal Battery Monitor** scans all commissioned nodes and endpoints for Power Source clusters, emits an initial snapshot and caches complete normalized battery state. It can emit only batteries below a percentage threshold or every update. Output includes percent, raw percent, charge level, replacement state, replaceability, voltage and device identity; raw Matter metadata is in `msg.matter`. Send `{payload:{action:"getAllBatteries"}}` to retrieve the cached inventory.

Dynamic inputs require `nodeId`, `endpointId`, `clusterId`, plus `command` or `attribute` (top-level or under `msg.matter`):

- On: `{nodeId:"100", endpointId:1, clusterId:6, command:"on", args:{}}`
- Read: `{nodeId:"100", endpointId:1, clusterId:47, attribute:"batPercentRemaining"}`
- Write: `{nodeId:"100", endpointId:1, clusterId:513, attribute:"occupiedHeatingSetpoint", value:2100}`

## Storage

The fabric credentials and the paired devices are stored in the `knxultimatestorage/matter` folder inside your Node-RED user directory. Deleting that folder unpairs everything.

Use **Export** to download a complete backup of this controller instance. It includes the fabric, private credentials, sessions and commissioned-device data. **Protect the file like a password.** Import replaces this instance's current Matter storage and briefly restarts the controller. A controller backup cannot be imported into a bridge.

## Removing a device

Use the trash button in the commissioned devices list. The controller tries to decommission the device properly; if it is unreachable, it is removed from the fabric anyway (a factory reset of the device may then be needed).

The list contains one row for every node currently stored in this controller's Matter fabric. Node IDs are unique within that fabric; endpoints exposed by one commissioned bridge are not listed as separate devices. The state column reports whether each node is connected, disconnected, reconnecting or waiting for discovery.

The controller keeps command order separately for each commissioned device. A slow, offline or removed device cannot block commands for other devices. Controller device nodes that still reference a removed Node ID reject new commands immediately and display **Device no longer commissioned**.

When a device becomes unavailable, its Controller nodes stay blocked and ignore further commands until that device reports `connected` again. Recovery is automatic; opening the device-node editor also clears the block for a manual retry.

In Universal Battery Monitor mode, optional KNX outputs publish the aggregate alarm as DPT 1.005 and cycle low-battery device names every 2 seconds as 14-byte DPT 16.001 text.
