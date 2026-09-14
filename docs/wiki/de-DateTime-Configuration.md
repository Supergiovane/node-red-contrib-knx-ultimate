---
layout: wiki
title: "DateTime-Configuration"
lang: de
permalink: /wiki/de-DateTime-Configuration
---

<!-- KNX_UTILITY_LEGACY_NOTICE -->
> Dieser Einzelknoten bleibt mit bestehenden Flows kompatibel. Verwenden Sie für neue Flows [KNX Utility](/node-red-contrib-knx-ultimate/wiki/de-KNX-Utility) und wählen Sie **DateTime**. Sein Editor konvertiert alle kompatiblen bisherigen Hilfsknoten in allen Flows und Subflows gemeinsam, mit einmaligem Rückgängig und manuellem Deploy.

# Datum/Uhrzeit Konfiguration

Der **KNX DateTime** Node schreibt das aktuelle Datum/die aktuelle Uhrzeit auf eine oder mehrere KNX-Gruppenadressen.

Unterstützt:
- **DPT 19.001** (Datum/Uhrzeit) – empfohlen
- **DPT 11.001** (Datum) – optional
- **DPT 10.001** (Uhrzeit) – optional

## Gruppenadressen

|Zweck|Eigenschaft|DPT|
|--|--|--|
| Datum/Uhrzeit | `DateTime GA` (`gaDateTime`) | `19.001` |
| Datum | `Date GA` (`gaDate`) | `11.001` |
| Uhrzeit | `Time GA` (`gaTime`) | `10.001` |

## Wann gesendet wird

- Beim Deploy/Start (optional, mit Verzögerung)
- Periodisch (optional, Sekunden/Minuten)
- Bei Input (immer)
- Editor-Button (Sofort senden)

## Eingabe-Payload

Wenn `msg.payload` leer ist, wird die aktuelle Systemzeit gesendet.

Unterstützt:
- `Date` (`new Date()`)
- Timestamp (ms)
- String für `new Date("...")`
- `"now"`

## Node-Output

Pro Versand wird eine Nachricht ausgegeben:
- `msg.payload`: gesendete `Date`
- `msg.sent`: Array `{ ga, dpt, name }`
- `msg.reason`: `input`, `startup`, `periodic` oder `button`

## Auto-Auswahl (ETS)

Bei einem neuen Node kann automatisch das erste KNX-Gateway mit ETS-Import gewählt und passende GAs vorausgefüllt werden.

