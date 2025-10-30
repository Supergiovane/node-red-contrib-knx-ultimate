🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) | [IT](/node-red-contrib-knx-ultimate/wiki/it-HUE+Scene) | [DE](/node-red-contrib-knx-ultimate/wiki/de-HUE+Scene) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-HUE+Scene) | [ES](/node-red-contrib-knx-ultimate/wiki/es-HUE+Scene) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE+Scene)
<!-- NAV START -->
Navigation: [Startseite](/node-red-contrib-knx-ultimate/wiki/de-Home)  
Übersicht: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/de-FAQ-Troubleshoot) • [Sicherheit](/node-red-contrib-knx-ultimate/wiki/de-SECURITY) • [Doku: Sprachleiste](/node-red-contrib-knx-ultimate/wiki/de-Docs-Language-Bar)  
KNX Geräteknoten: [Gateway](/node-red-contrib-knx-ultimate/wiki/de-Gateway-configuration) • [Gerät](/node-red-contrib-knx-ultimate/wiki/de-Device) • [Knotenschutz](/node-red-contrib-knx-ultimate/wiki/de-Protections)  
Weitere KNX‑Knoten: [Szenencontroller](/node-red-contrib-knx-ultimate/wiki/de-SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/de-WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/de-Alerter-Configuration) • [Laststeuerung](/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/de-knxUltimateViewer) • [Auto‑Responder](/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) • [HA‑Übersetzer](/node-red-contrib-knx-ultimate/wiki/de-HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/de-IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/de-HUE+Bridge+configuration) • [Licht](/node-red-contrib-knx-ultimate/wiki/de-HUE+Light) • [Batterie](/node-red-contrib-knx-ultimate/wiki/de-HUE+Battery) • [Taster](/node-red-contrib-knx-ultimate/wiki/de-HUE+Button) • [Kontakt](/node-red-contrib-knx-ultimate/wiki/de-HUE+Contact+sensor) • [Geräte‑SW‑Update](/node-red-contrib-knx-ultimate/wiki/de-HUE+Device+software+update) • [Lichtsensor](/node-red-contrib-knx-ultimate/wiki/de-HUE+Light+sensor) • [Bewegung](/node-red-contrib-knx-ultimate/wiki/de-HUE+Motion) • [Szene](/node-red-contrib-knx-ultimate/wiki/de-HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/de-HUE+Tapdial) • [Temperatur](/node-red-contrib-knx-ultimate/wiki/de-HUE+Temperature+sensor) • [Zigbee‑Konnektivität](/node-red-contrib-knx-ultimate/wiki/de-HUE+Zigbee+connectivity)  
Beispiele: [Logger](/node-red-contrib-knx-ultimate/wiki/de-Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/de-Manage-Wiki)
<!-- NAV END -->
---

Die **Hue-Szene** Knoten veröffentlicht die Hue-Szene an KNX und kann die Originalereignisse von HUE an den Knoten-Red-Prozess senden. Szenenfelder unterstützen die automatische Fertigstellung;Nachdem Sie der Brücke neue Szenen hinzugefügt haben, klicken Sie bitte auf das Symbol für Aktualisierung, um die Liste zu aktualisieren.

### Registerkarte Übersicht

- **Mapping** - Verbinden Sie die KNX -Gruppenadresse mit der ausgewählten Hue -Szene.DPT 1.XXX wird für die Boolesche Steuerung verwendet, und DPT 18.xxx wird zum Senden von KNX -Szenennummern verwendet.
- **Mehrere Szenarien** - Erstellen Sie eine Liste von Regeln, kartieren Sie verschiedene KNX -Szenennummern in Farbton -Szenen und wählen Sie die Anrufmethode von _active_ / _dynamic \ _palette_ / _static_.
- **Verhalten** - steuert, ob der Knoten -rot -Ausgangspin angezeigt wird.Wenn das KNX -Gateway nicht konfiguriert ist, bleibt der PIN aktiviert, so dass das Brückenereignis weiterhin den Prozess eingeht.

### Allgemeine Einstellungen

| Eigenschaften | Beschreibung |
|-|-|
| KNX GW | Ein KNX -Gateway, das ein automatisches Verzeichnis der Abschlussadresse bietet.|
| Hue Bridge | Hue Bridge, in der die Szene stattfindet. |
| Hue -Szene |Szene, die aufgerufen werden soll (Autokompetenz wird unterstützt; Aktualisierungstaste wird die Liste wiedererlangen).|

### Mapping -Registerkarte

| Eigenschaften | Beschreibung |
|-|-|
| Recall Ga | Rufen Sie die KNX -Gruppenadresse der Szene an.Verwenden Sie DPT 1.XXX, um einen booleschen Wert zu senden, oder verwenden Sie DPT 18.xxx, um eine KNX -Szenennummer zu senden.|
| DPT | Die Art des Datenpunkts, der mit einem Rückruf -GA (1.xxx oder 18.001) verwendet wird.|
| Name | Anweisungsname für das Erinnern von Ga. |
| # | Angezeigt, wenn die KNX -Szene DPT ausgewählt ist, wird die Sendungsnummer ausgewählt.|
| Status ga | Optional Boolean GA, um Feedback zu erhalten, ob die Szene aktiv ist.|

### Multi-Szene-Registerkarte

| Eigenschaften | Beschreibung |
|-|-|
| Recall Ga | Verwenden Sie die GA von DPT 18.001, um eine Szene nach KNX -Szenennummer auszuwählen. |
| Szenenliste |Bearbeitbare Liste, um der KNX -Szenennummer der Hue -Szene und des Anrufmodus zu entsprechen.Ziehen Sie Balken zum Nachbestellen. |

> ℹ️ KNX-bezogene Steuerelemente werden erst nach Auswahl des KNX-Gateways angezeigt. Die Registerkarte Mapping bleibt versteckt, bis sowohl die Hue -Brücke als auch das KNX -Gateway konfiguriert sind.