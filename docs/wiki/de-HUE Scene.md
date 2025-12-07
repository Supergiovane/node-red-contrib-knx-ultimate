---
layout: wiki
title: "HUE Scene"
lang: de
permalink: /wiki/de-HUE%20Scene
---
Der **Hue Scene** -Node stellt Hue-Szenen per KNX bereit und kann die Rohereignisse an Ihren Node-RED-Flow weitergeben. Das Feld "Hue Szene" besitzt Autovervollständigung; verwenden Sie nach dem Anlegen neuer Szenen das Aktualisierungssymbol, damit die Liste aktuell bleibt.

### Überblick über die Reiter

- **Zuordnung** - Verknüpft KNX-Gruppenadressen mit der ausgewählten Hue-Szene. DPT 1.xxx sendet boolesche Werte, DPT 18.xxx überträgt eine KNX-Szenennummer.
- **Mehrfachszene** - Erstellt eine Liste von Regeln, die KNX-Szenennummern verschiedenen Hue-Szenen und Abrufarten (active, dynamic\_palette, static) zuordnet.
- **Verhalten** - Blendet den Node-RED-Ausgang ein oder aus. Ohne konfiguriertes KNX-Gateway bleibt der Ausgang aktiv, damit Bridge-Ereignisse weiterhin im Flow landen.

### Allgemeine Einstellungen

| Eigenschaft | Beschreibung |
|--|--|
| KNX-Gateway | KNX-Gateway mit dem Adresskatalog für das Autocomplete. |
| HUE-Bridge | Hue-Bridge, die die Szenen bereitstellt. |
| HUE Szene | Szene, die aufgerufen wird (Autocomplete; Refresh lädt den Bridge-Katalog neu). |

### Reiter Zuordnung

| Eigenschaft | Beschreibung |
|--|--|
| Abrufen | KNX-GA zum Abrufen der Szene. Verwenden Sie DPT 1.xxx für boolsche Steuerung oder DPT 18.xxx für KNX-Szenennummern. |
| DPT | Datapoint, der zusammen mit der Aufruf-GA genutzt wird (1.xxx oder 18.001). |
| Name | Bezeichnung für die Aufruf-GA. |
| # | Wird angezeigt, wenn ein KNX-Szenen-DPT gewählt ist; wählen Sie die zu sendende Szenennummer. |
| Status-GA | Optionale boolsche GA, die anzeigt, ob die Szene aktiv ist. |

### Reiter Mehrfachszene

| Eigenschaft | Beschreibung |
|--|--|
| Abrufen | KNX-GA (DPT 18.001), um Szenen anhand ihrer KNX-Nummer auszuwählen. |
| Szenenwähler | Bearbeitbare Liste, die KNX-Szenennummern Hue-Szenen und Abrufmodi zuordnet. Ziehen Sie die Griffe zum Umordnen. |

> ℹ️ KNX-spezifische Bedienelemente erscheinen erst nach Auswahl eines KNX-Gateways. Die Mapping-Reiter bleiben verborgen, bis sowohl Bridge als auch Gateway konfiguriert sind.
