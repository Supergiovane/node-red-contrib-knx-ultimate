---
layout: wiki
title: "FAQ-Troubleshoot"
lang: de
permalink: /wiki/de-FAQ-Troubleshoot/
---
---

# FAQ und Troubleshooting

Vielen Dank, dass du meine Node‑RED‑Nodes verwendest! Wenn du hier bist, gibt es wahrscheinlich ein Problem - kein Stress, wir bekommen es gelöst. KNX‑Ultimate ist stabil und weit verbreitet. Folge den Punkten unten; am Ende stehen die Kontaktwege.

Mindestvoraussetzung: **Node.js >= 16**

## Der Node funktioniert nicht

- [Gateway‑Konfigurations‑Node](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) mit korrekter IP/Port zu KNX/IP‑Router bzw. ‑Interface angelegt?
- KNX/IP‑ **Router ** :**Host** = `224.0.23.12`, Port `3671`.
- KNX/IP‑ **Interface ** :**Host** = Geräte‑IP (z. B. `192.168.1.22`), Port `3671`.
- **Mehrere NICs ** (Ethernet/WLAN): richtige NIC im Gateway wählen oder WLAN deaktivieren. Danach**Node‑RED neu starten** .
- Nur echte zertifizierte KNX/IP‑Router/Interfaces nutzen; "all‑in‑one"/Proxy‑Geräte vermeiden.
- Mit Interfaces ggf. "Suppress ACK request" im Gateway aktivieren.
- Sieh auch "Ich kann nur empfangen / nicht senden".
- In Containern: Start von Node‑RED etwas verzögern (NIC evtl. noch down).

## Nach einiger Zeit Aussetzer

- Obige Checkliste erneut prüfen.
- DDOS/UDP‑Flood‑Schutz auf Switch/Router testweise deaktivieren (kann KNX‑UDP blockieren).
- Direktverbindung KNX/IP ↔ Node‑RED‑Rechner testen.
- Billige/all‑in‑one‑Interfaces meiden; besser **KNX/IP‑Router** .
- Bei Interfaces auf Verbindungs‑Limits achten (Handbuch). Router haben diese Limits nicht.

## knxd‑Konfiguration

- Läuft **knxd** auf derselben Maschine: `127.0.0.1` als Interface verwenden.
- Filtertabellen prüfen und physikalische Adresse des Config‑Nodes anpassen.
- Im Gateway (Erweitert) "Echo sent message to all node with same Group Address" aktivieren.

## ETS zeigt Telegramm, Aktor reagiert nicht

Andere KNX‑Plugins in Node‑RED könnten interferieren.

- Alle anderen KNX‑Plugins aus der Palette entfernen; nur KNX‑Ultimate lassen (auch versteckte Config‑Nodes löschen).
- Mit Interfaces "Suppress ACK request" im Gateway aktivieren.

## Ich kann nur empfangen, nicht senden (oder umgekehrt)

Eventuell ist Filtering im Router/Interface aktiv.

- In ETS **Forwarding** erlauben oder physikalische Adresse des Config‑Nodes nach Filtertabellen anpassen.
- Mit **knxd** : Filtertabellen prüfen und physikalische Adresse anpassen.

## Falsche Werte

- Passenden Datapoint nutzen (Temperatur: `9.001`).
- ETS‑CSV im Gateway importieren → korrekte DPTs.
- Keine zwei Nodes mit **gleicher GA ** und**unterschiedlichem DPT** verwenden.

## Nachrichten propagieren nicht zwischen Nodes mit gleicher GA

Passiert bei Tunneling/Unicast (Interfaces, knxd).

- Im Gateway "Echo sent message to all node with same Group Address" aktivieren.

## Secure KNX Router/Interfaces

Im Secure‑Modus nicht unterstützt; funktioniert nur, wenn unsichere Verbindungen erlaubt sind.

- Secure‑Routing deaktivieren oder unsichere Verbindungen zulassen.
- Optional zweite dedizierte NIC direkt zum KNX‑Router; im Gateway "Bind to local interface" setzen.
- Secure‑Support kann zukünftig kommen.

## Flood‑Protection

Schützt UI/BUS vor Überlast (max. 120 Nachrichten/Sek. pro Node; 1‑s‑Fenster).

- **delay** ‑Node einsetzen.
- **RBE** nutzen, um unveränderte Werte zu verwerfen.
  [Details](/node-red-contrib-knx-ultimate/wiki/Protections)

## Warnungen zu Datapoints nach ETS‑Import

- In ETS vollständige DPTs inkl. Subtyp pflegen (z. B. `5.001`).
- Alternativ beim Import "Import with a fake 1.001 datapoint (Not recommended)" wählen oder betroffene GAs überspringen.

## Schutz vor zyklischen Referenzen

Verhindert Loops, wenn zwei Nodes mit gleicher GA direkt Out→In verbunden sind.

- Flow anpassen; Knoten entkoppeln oder "Moderator" dazwischen setzen.
- **RBE** aktivieren.
  [Details](/node-red-contrib-knx-ultimate/wiki/Protections)

## Noch Probleme?

- Issue auf [GitHub](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues) erstellen (bevorzugt).
- PM im [KNX‑User‑Forum](https://knx-user-forum.de) (User: TheMax74; bitte auf Englisch).
