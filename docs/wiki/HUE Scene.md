---
layout: wiki
title: "HUE Scene"
lang: en
permalink: /wiki/HUE%20Scene
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Scene) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Scene) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Scene) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Scene) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Scene) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Scene)

The **Hue Scene** node exposes Hue scenes to KNX and can forward the raw Hue events to a Node-RED flow. The scene field supports autocomplete; use the refresh icon after adding scenes on the bridge so the list stays up to date.

### Tabs at a glance

- **Mapping** - link KNX group addresses to the selected Hue scene. DPT 1.xxx performs boolean recall, while DPT 18.xxx sends a KNX scene number.
- **Multi scene** - build a rule list that associates KNX scene numbers with different Hue scenes and chooses whether each scene is recalled as _active_, _dynamic\_palette_ or _static_.
- **Behaviour** - toggle the Node-RED output pin. When no KNX gateway is configured the pin remains enabled so bridge events still reach the flow.

### General settings

|Property|Description|
|--|--|
| KNX GW | KNX gateway supplying the address catalogue used for autocomplete. |
| HUE Bridge | Hue bridge that hosts the scenes. |
| Hue Scene | Scene to recall (autocomplete; refresh button reloads the bridge catalogue). |

### Mapping tab

|Property|Description|
|--|--|
| Recall GA | KNX group address that recalls the scene. Use DPT 1.xxx for boolean control or DPT 18.xxx to transmit a KNX scene number. |
| DPT | Datapoint used with the recall GA (1.xxx or 18.001). |
| Name | Friendly label for the recall GA. |
| # | Appears when a KNX scene DPT is chosen; select the KNX scene number to send. |
| Status GA | Optional boolean GA that mirrors whether the scene is currently active. |

### Multi scene tab

|Property|Description|
|--|--|
| Recall GA | KNX GA (DPT 18.001) that selects scenes by number. |
| Scene selector | Editable list that maps KNX scene numbers to Hue scenes with the desired recall mode. Drag handles reorder entries. |

> ℹ️ KNX-specific widgets only appear after a KNX gateway is selected. The Mapping tabs remain hidden until both the bridge and the gateway are configured.
