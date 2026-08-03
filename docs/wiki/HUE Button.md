---
layout: wiki
title: "HUE Button"
lang: en
permalink: /wiki/HUE%20Button
---
> **Deprecated:** this dedicated HUE node remains available for existing flows. Use **HUE Controller** for new work. It is marked `(deprecated)` in the palette and on the canvas, uses a lighter color than HUE Controller, and its editor opens with a migration notice. The high-contrast orange migration button with white text converts all legacy HUE nodes locally; afterwards it opens only an editable email draft. The email is never sent automatically. When the process finishes, a fixed Node-RED message remains visible until you click OK and offers an optional support button; the donation page opens only when that button is clicked. [Watch the explanatory video on YouTube](https://youtu.be/f0Evf2QFI7c) before starting.

The Hue Button node maps Hue button events to KNX group addresses and exposes the same events on its flow output via <code>button.button_report.event</code>.

Start typing in the GA field (name or Group Address) to link the KNX GA; devices appear while you type.

**General**

|Property|Description|
|--|--|
| KNX GW | Select the KNX gateway to be used |
| Hue Bridge | Select the Hue Bridge to be used |
| Hue Button | Hue button to be used (autocomplete while typing) |

**Switch**

|Property|Description|
|--|--|
| Switch | GA triggered by <code>short\_release</code> (quick press/release). |
| Status GA | Optional feedback GA when <em>Toggle values</em> is enabled to keep the internal toggle state aligned with other actuators. |

**Dim**

|Property|Description|
|--|--|
| Dim | GA used during <code>long\_press</code>/<code>repeat</code> events for dimming (typically DPT 3.007). |

**Behaviour**

|Property|Description|
|--|--|
| Toggle values on each event | If enabled, the node alternates between <code>true/false</code> and up/down dimming payloads. |
| Switch payload | Payload sent to KNX/flow when Toggle values is disabled. |
| Dim payload | Direction sent to KNX/flow when Toggle values is disabled. |

### Outputs

1. Standard output
   : `msg.payload` carries the boolean (or dim object) sent to KNX; `msg.event` is the Hue event string (e.g. `short_release`, `repeat`).

### Details

`msg.event` mirrors `button.button_report.event`. The original Hue event is exposed in `msg.rawEvent`. Use the optional Status GA to keep the toggle state in sync with wall switches or other controllers.
