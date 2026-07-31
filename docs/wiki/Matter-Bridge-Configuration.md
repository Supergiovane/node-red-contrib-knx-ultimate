---
layout: wiki
title: "Matter-Bridge-Configuration"
lang: en
permalink: /wiki/Matter-Bridge-Configuration
---
# Matter Bridge (BETA)

<div data-matter-bridge-config-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0d314f 0%,#176b91 55%,#27a9c7 100%);box-shadow:0 14px 30px rgba(13,49,79,0.25);color:#f3fbff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#d1f3ff;">Matter server · Multi-fabric · Persistent identity</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Pair one bridge. Expose every KNX device.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f3fbff;">This configuration node owns the Matter server, bridge identity and paired-controller sessions. Alexa, Google Home, Apple Home and other controllers commission it once; device nodes then appear beneath it as live endpoints.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Pair once</strong><span style="font-size:0.76rem;color:#e0f7ff;">QR + manual code</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Multi-fabric</strong><span style="font-size:0.76rem;color:#e0f7ff;">multiple controllers</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Live reconcile</strong><span style="font-size:0.76rem;color:#e0f7ff;">endpoints in seconds</span></div>
  </div>
</div>

## The bridge at a glance

| Area | What it provides |
|---|---|
| **Pairing** | QR and manual code, multiple Matter fabrics and an explicit reset for starting over. |
| **Identity** | Stable bridge identity across ordinary deploys, name changes and endpoint reconciliation. |
| **Scale** | Multiple independent bridges on distinct UDP ports and any number of attached device nodes. |
| **Protection** | Export/import of fabrics, private credentials, sessions and pairing data. |

> **BETA:** the bridge is operational, but details may still evolve. Treat exported storage as a password and use **Reset pairing** only when every paired controller must be removed.

## Technical overview

This configuration node is the **Matter bridge itself**: it runs the Matter server that Alexa, Google Home, Apple Home (or any Matter controller) commission **once**. Every **Matter Bridge device** node in your flows points here and appears in the apps as one bridged device.

Matter Bridge device editors arrange **Mappings** and **Advanced** as vertical tabs on the left, consistently with Matter Controller.

The **Node Input/Output PINs** selector sits outside those tabs. Enabling it reveals a contextual **Flow input/output** section directly below, with copyable Flow → Matter and Matter → Flow examples filtered to the selected device type.

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
