---
layout: wiki
title: "Home"
lang: de
permalink: /wiki/de-Home
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Home) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Home) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Home) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Home) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Home) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Home)
# Professionelle Übersicht über die KNX Ultimate Nodes
## knxUltimate-config
**Einsatzgebiet**: legt Gateway-Parameter für KNX/IP fest und stellt sie den übrigen Nodes bereit.
**Kernfunktionen**: Tunnelling und KNX Secure, ETS-CSV-Import mit Autovervollständigung, Verbindungsdiagnose und Busmonitor.
**Konfiguration**: Host und Port eintragen, NIC wählen, ETS-Datei importieren und optional Secure- oder Monitor-Optionen aktivieren.
## hueConfig
**Einsatzgebiet**: verwaltet die Anmeldung am Philips-Hue-Bridge und teilt das Token mit allen Hue-Nodes.
**Kernfunktionen**: Geführtes Pairing, persistente Tokens, EventStream, REST-Fallback, TLS- und Zeitsynchronisation.
**Konfiguration**: Link-Taste am Bridge drücken, Pairing-Assistent starten, EventStream oder Polling wählen und die Konfigurationsinstanz benennen.
## knxUltimate
**Einsatzgebiet**: liest und schreibt KNX-Telegramme mit automatischer DPT-Konvertierung.
**Kernfunktionen**: GA-Autocomplete, ETS-Filter, Prioritätensteuerung, Laufzeitstatistiken, optionale Node Pins.
**Konfiguration**: Gateway wählen, passenden DPT setzen, Ack/Retry-Verhalten definieren und bei Bedarf Pins oder Filter aktivieren.
## knxUltimateSceneController
**Einsatzgebiet**: spielt mehrstufige KNX-Szenen mit Bedingungen und manuellen Overrides ab.
**Kernfunktionen**: Programmierbare Schritte, Triggerbedingungen, Szenenspeicher, manuelle Bedienelemente.
**Konfiguration**: Ziel-Szenen festlegen, Verzögerungen und Bedingungen einstellen und Trigger über Node Pins verdrahten.
## knxUltimateWatchDog
**Einsatzgebiet**: überwacht Gateways, Geräte und GA auf Zeitüberschreitungen.
**Kernfunktionen**: Zyklische Pings, Latenzprotokoll, automatische Recovery-Aktionen, Health-Metriken.
**Konfiguration**: Zu prüfende GA eintragen, Intervalle/Timeouts setzen und Ausgänge mit Loggern oder Alarmen verbinden.
## knxUltimateLogger
**Einsatzgebiet**: protokolliert KNX-Telegramme und Werte für Analyse oder Export.
**Kernfunktionen**: Ringpuffer, Filter nach GA/DPT, CSV/JSON-Export, Context-Anbindung.
**Konfiguration**: Zielordner wählen, Aufbewahrungsdauer und Schwellen definieren und optionale Benachrichtigungen aktivieren.
## knxUltimateGlobalContext
**Einsatzgebiet**: synchronisiert KNX-Werte mit dem globalen Context von Node-RED.
**Kernfunktionen**: GA→Context-Bindings, optional bidirektional, DPT-Filterung.
**Konfiguration**: Context-Namen festlegen, Synchronisationsrichtung bestimmen und externe Updates über Node Pins konfigurieren.
## knxUltimateAlerter
**Einsatzgebiet**: sendet Benachrichtigungen, wenn KNX-Werte Regeln oder Schwellen verletzen.
**Kernfunktionen**: Mehrere Vergleichstypen, Hysterese, automatischer Reset, Ausgänge für E-Mail/MQTT/Log.
**Konfiguration**: Bedingungen definieren, Meldungstexte festlegen und die Ausgänge mit den gewünschten Kanälen verbinden.
## knxUltimateLoadControl
**Einsatzgebiet**: steuert elektrische Lasten und schaltet unkritische Verbraucher bei Überlast ab.
**Kernfunktionen**: Lastgruppen, dynamische Prioritäten, Shed/Restore-Zyklen, Ereignispuffer.
**Konfiguration**: Mess-GA zuordnen, Verbraucher Prioritäten geben und Zeitparameter für Abschaltung/Rückkehr setzen.
## knxUltimateViewer
**Einsatzgebiet**: stellt HTML- und JSON-Dashboards für KNX-Monitoring bereit.
**Kernfunktionen**: Live-Tabellen, Karten-Layouts, JSON-Ausgabe, Queue-Analyse.
**Konfiguration**: Anzuzeigende GA wählen, Labels und Aktualisierungsintervall festlegen und gewünschtes Dashboard aktivieren.
## knxUltimateAutoResponder
**Einsatzgebiet**: beantwortet KNX-Lesetelegramme automatisch mit dem letzten bekannten Wert.
**Kernfunktionen**: Wertcache, Multi-GA-Mapping, externe Updates via Node Pins, Aktivitätslog.
**Konfiguration**: Hör- und Antwort-GA definieren, Cache-Lebensdauer festlegen und externe Quellen anschließen.
## knxUltimateStaircase
**Einsatzgebiet**: steuert Treppenlicht-Timer mit Vorwarnung, Override und Reset.
**Kernfunktionen**: Mehrere Timer, Vorwarnimpulse, manuelle Übersteuerung, Start-Lesevorgang.
**Konfiguration**: GA für Befehl/Status setzen, Timerlaufzeit bestimmen und optionale Override-Pins konfigurieren.
## knxUltimateGarage
**Einsatzgebiet**: automatisiert Garagentore mit Impulssteuerung, Statusfeedback und Sicherheit.
**Kernfunktionen**: Impulsbefehl, Zustandsüberwachung, Sicherheitsverriegelung, Lichtschrankenlogik, Auto-Close.
**Konfiguration**: GA für Befehl/Status/Alarm vergeben, Fahrzeiten einstellen und Sicherheitslogik aktivieren.
## knxUltimateIoTBridge
**Einsatzgebiet**: verbindet KNX bidirektional mit MQTT/REST/Modbus.
**Kernfunktionen**: Tabellenbasiertes Mapping, Skalierung, individuelle Acks, Offline-Puffer.
**Konfiguration**: Mapping-Tabelle pflegen, externe Endpunkte konfigurieren und Ack-Strategie definieren.
## KNX Monitor Seitenleiste
**Einsatzgebiet**: zeigt KNX-Verkehr live in der rechten Node-RED-Seitenleiste bei den Tabs.
**Kernfunktionen**: 1-s-Aktualisierung, Hervorhebung neuer Telegramme, Schnell-Toggles, optionales Sortieren.
**Konfiguration**: Gateway auswählen, Auto-Refresh oder Sortierung schalten und GA-Filter setzen.
## KNX Debug Seitenleiste
**Einsatzgebiet**: alle KNX-Logzeilen in Echtzeit direkt in der Sidebar ansehen, ohne auf die Serverkonsole zu wechseln.
**Kernfunktionen**: rollierender 5 000-Zeilen-Puffer, farbliche Kennzeichnung nach Schweregrad, Auto/Manuell-Refresh, Kopieren per Klick in die Zwischenablage.
**Konfiguration**: Tab öffnen, Auto-Refresh aktiv lassen (oder bei Bedarf auf „Aktualisieren“ klicken) und das Kopiersymbol nutzen, um den aktuellen Log-Snapshot zu exportieren.
## knxUltimateHATranslator
**Einsatzgebiet**: übersetzt KNX-Telegramme in Home-Assistant-Payloads und zurück.
**Kernfunktionen**: DPT→Entity-Mapping, Discovery-Helfer, Normalisierung von Bool/Number, optionale Acks.
**Konfiguration**: Ziel-Entities definieren, Konvertierungen und Templates einstellen und Node Pins für Feedback anschließen.
## knxUltimateHueLight
**Einsatzgebiet**: steuert Hue-Leuchten aus KNX mit Schalten, Dimmen, Farbe und Szenen.
**Kernfunktionen**: Multi-GA-Mapping, Tag/Nacht-Profile, Statusfeedback, Node Pins.
**Konfiguration**: GA für Schalten/Status/Dimmer/Farbe zuweisen, Rampen konfigurieren und EventStream am Bridge aktivieren.
## knxUltimateHueButton
**Einsatzgebiet**: wandelt Hue-Tastendrücke in KNX-Telegramme um.
**Kernfunktionen**: Kurz/Lang-Erkennung, mehrere Ressourcen, DPT 1.xxx/18.xxx, Entprellung.
**Konfiguration**: Hue-Ressource wählen, GA pro Ereignis zuordnen und Debounce sowie Feedback einstellen.
## knxUltimateHueMotion
**Einsatzgebiet**: bindet Hue-Bewegungsmelder ins KNX-System ein.
**Kernfunktionen**: Bool-Ausgang, DPT-Filter, Timing-Optionen, konfigurierbare Node Pins.
**Konfiguration**: Bewegungs- und Status-GA setzen, Zeitparameter definieren und Pin-Sichtbarkeit im Behaviour-Tab steuern.
## knxUltimateHueTapDial
**Einsatzgebiet**: nutzt den Hue Tap Dial als Drehregler oder Szenenwähler im KNX.
**Kernfunktionen**: Inkrement/Dekrement, DPT 3.007/5.001/Custom, optionales Feedback.
**Konfiguration**: Hue-Ressource festlegen, Ziel-GA und Sensitivität definieren und benötigte Pins aktivieren.
## knxUltimateHueLightSensor
**Einsatzgebiet**: liefert Hue-Luxwerte an den KNX-Bus.
**Kernfunktionen**: Automatische Umrechnung in DPT 9.004, Glättung, Start-Lesevorgang.
**Konfiguration**: Lux-GA zuweisen, Filter/Offsets bestimmen und Node Pins bei Bedarf anzeigen.
## knxUltimateHueTemperatureSensor
**Einsatzgebiet**: bringt Hue-Temperaturen als KNX-DPT 9.001 ins System.
**Kernfunktionen**: Initiale Synchronisation, Offset, optionale Pins.
**Konfiguration**: Temperatur-GA setzen, Korrekturen definieren und Ausgänge für weitere Flows aktivieren.
## knxUltimateHueScene
**Einsatzgebiet**: startet Hue-Szenen über KNX-Ereignisse.
**Kernfunktionen**: Unterstützung DPT 1.xxx/18.xxx, Multi-Szenen-Regeln, optionales Statusfeedback.
**Konfiguration**: Hue-Szenen auswählen, Trigger- und Status-GA zuordnen und erweiterte Regeln konfigurieren.
## knxUltimateHueBattery
**Einsatzgebiet**: überwacht Hue-Batteriestände innerhalb von KNX.
**Kernfunktionen**: device_power→DPT 5.001, Start-Lesen, Schwellenalarme, Node Pins.
**Konfiguration**: Prozent-GA vergeben, Alarmgrenzen definieren und Benachrichtigung/Logging anbinden.
## knxUltimateHueZigbeeConnectivity
**Einsatzgebiet**: meldet Zigbee-Verbindungsstatus der Hue-Geräte im KNX.
**Kernfunktionen**: Bool-Mapping, Start-Lesen, Fallback-Strategien.
**Konfiguration**: Bool-GA und DPT festlegen, Reaktionsregeln bei Verbindungsverlust planen und Alarme anschließen.
## knxUltimateHueCameraMotion
**Einsatzgebiet**: gibt Bewegungsereignisse der Hue Secure Cams an KNX weiter.
**Kernfunktionen**: Echtzeit-EventStream, Bool-Mapping, Schutz vor Fehlalarmen, Initialpuffer.
**Konfiguration**: Kamera auswählen, GA/DPT setzen, Filter anpassen und Ausgänge in Sicherheitslogik integrieren.
## knxUltimateContactSensor
**Einsatzgebiet**: synchronisiert Hue-Kontaktsensoren (offen/geschlossen) mit KNX-Adressen.
**Kernfunktionen**: Ressourcenfilter `contact`, DPT 1.019, optionale Logikinvertierung, ETS-Beschriftungen.
**Konfiguration**: Sensor wählen, Status- und Alarm-GA zuordnen und Alarm-/Verzögerungsregeln setzen.
## knxUltimateHueHumiditySensor
**Einsatzgebiet**: sendet die relative Luftfeuchte aus Hue-Sensoren ins KNX-Netz.
**Kernfunktionen**: Skalierung auf DPT 9.007, optionales Glätten, Start-Lesen, Node Pins.
**Konfiguration**: Feuchte-GA vergeben, Filter/Sollwerte definieren und Ausgänge nach Bedarf verschalten.
## knxUltimateHuePlug
**Einsatzgebiet**: steuert Hue-Steckdosen und liest Status sowie Leistung aus.
**Kernfunktionen**: Ein/Aus, Status- und Leistungskanäle, Power-Availability, Node Pins.
**Konfiguration**: GA für Befehl/Status/Leistung mappen, passenden DPT wählen und automatische Start-Lesung aktivieren.
## knxUltimateHuedevice_software_update
**Einsatzgebiet**: informiert KNX-Systeme über verfügbare Hue-Firmwareupdates.
**Kernfunktionen**: Interpretation von `up_to_date/available/required`, Ereignislogs, planbare Alarme.
**Konfiguration**: Alarm-GA festlegen, Benachrichtigungspolitik definieren und Dashboards oder Ticketsysteme anbinden.
