🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) | [IT](/node-red-contrib-knx-ultimate/wiki/it-KNXAutoResponder) | [DE](/node-red-contrib-knx-ultimate/wiki/de-KNXAutoResponder) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-KNXAutoResponder) | [ES](/node-red-contrib-knx-ultimate/wiki/es-KNXAutoResponder) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-KNXAutoResponder)
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

<p> Dieser Knoten antwortet auf die Leseanforderung des KNX -Busses.

Der Knoten zeichnet alle Telegramme auf, die in den KNX -Bus übertragen werden und die Werte im Speicher speichern.
Anschließend wird auf die Leseanforderung geantwortet, indem solche gemerkten Werte anhand der Anfrage an den Bus zurücksendet werden.
Wenn die zu gelesene Gruppenadresse noch keinen Wert hat, antwortet der Knoten mit dem Standardwert.
Dieser Knoten reagiert nur auf die im Feld **Antwort** JSON angegebene Gruppenadresse.
Standardmäßig gibt es einen vorkompilierten **Beispiel ** "Antwort" JSON -Text, den Sie einfach ändern/löschen können.Bitte stellen Sie sicher, dass**nicht drücken ** , um es zu verwenden!!!**Konfiguration**

| Eigenschaften | Beschreibung |
|-|-|
| Gateway | Wählen Sie das zu verwendende KNX -Portal aus |
| Antwort | Der Knoten antwortet auf eine Leseanforderung aus der in diesem JSON -Array angegebenen Gruppenadresse.Das Format ist unten angegeben.|

<br/>

\*\*json Format \*\*

JSON ist immer eine Reihe von Objekten, die jede Anweisung enthalten. Jede Anweisung zeigt dem Knoten an, was zu tun ist.

| Eigenschaften |Beschreibung |
|-|-|
| Hinweis | **Optional** Hinweisschlüssel, um Erinnerungen zu erhalten. Es wird nirgendwo verwendet.|
| Ga |Gruppenadresse.Sie können auch ".." wilde Münzen zu bestimmten Gruppen von Adressen verwenden.".." kann nur mit der dritten GA -Ebene verwendet werden, zum Beispiel: \*\*1/1/0..257 **. Bitte beachten Sie das Beispiel unten.|
| DPT | Gruppenaddatenpunkt, Format "1.001".Wenn die ETS -CSV -Datei importiert wurde,** optional \*\*. |
| Standard |Wenn der Knoten nicht an den Wert des Komponentenadresses erinnert wurde, wird er in einer Read -Request -Antwort an den Bus gesendet.|

**Beginnen wir mit einem Befehl**

Der Autoresponder -Knoten antwortet auf eine Leseanforderung unter Gruppenadresse 2/7/1.Wenn es noch nicht im Speicher ist, wird es mit _True _ antworten.
Die ETS -CSV -Datei muss importiert werden, andernfalls müssen Sie auch die __"DPT" hinzufügen: "1.001" \*\* Key.```json
[
    {
        "ga": "2/7/1",
        "default": true
    }
]
``` **Vollständige Anweisungen**

Der Auto-Responder-Knoten antwortet auf Leseanforderungen ab dem 01.03.1, einschließlich 01.03.22.Wenn der Speicher noch keinen Wert hat, antwortet er mit _False _.
Es gibt auch einen__ Hinweis \*\* Schlüssel, der nur als Erinnerungsnotiz verwendet wird.Es wird nirgendwo verwendet.```json
[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
``` **Angeschlossener Befehl**

Von 2/2/5 bis 2/2/21 antwortet der Autoresponder -Knoten auf eine Leseanforderung an die Gruppenadresse.Wenn es noch keinen Wert im Speicher gibt, antwortet es mit einem Wert von 25.
Der Autoresponder -Knoten antwortet auch auf Leseanforderungen von Komponenten 2/4/22.Wenn noch kein Wert im Speicher enthält, wird der unbekannte String \*unbekannte Zustand verwendet!\*Antwort.
Beachten Sie das **comma** zwischen den JSON -Objekten jeder Richtlinie.```json
[
    {
        "note": "DALI garden virtual brightness %",
        "ga": "2/2/5..21"
        "default": 25
    },
    {
        "note": "Alarm armed status text",
        "ga": "2/4/22",
        "dpt": "16.001",
        "default": "Unknown status!"
    }
]
```<br/>