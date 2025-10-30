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

<p> Dieser Knoten antwortet auf Leseanfragen aus dem KNX -Bus.

Der Knoten zeichnet alle an den KNX -Bus übertragenen Telegramme auf und speichert die Werte im Speicher.
Anschließend werden Anfragen gelesen, indem ein solcher auswendigerer Wert als Anfrage an den Bus zurücksendet wird.
Wenn die zu gelesene Gruppenadresse noch keinen Wert hat, antwortet der Knoten mit einem Standardwert.
Der Knoten reagiert nur auf Gruppenadressen, die im Feld \*\* antworten auf \*\* json.
Standardmäßig gibt es einen vorkompilierten \*\* Beispiel \*\* "auf" JSON-Text antworten, in dem Sie einfach ändern/löschen können.Bitte stellen Sie sicher, dass \*\* es nicht wie \*\* verwenden !!!

**Konfiguration**

| Eigenschaft | Beschreibung |
|-|-|
|Gateway |Wählen Sie das zu verwendende KNX -Gateway |
|Antworten auf |Der Knoten antwortet auf Leseanfragen aus den in diesem JSON -Array angegebenen Gruppenadressen.Das Format ist unten angegeben.|

<br/>

\*\* JSON -Format \*\*

Der JSON ist \*\* immer \*\* ein Array von Objekten, das jede Richtlinie enthält.Jede Richtlinie sagt dem Knoten, was tun.

| Eigenschaft | Beschreibung |
|-|-|
|Anmerkung |\*\* Optional \*\* Hinweisschlüssel für Erinnerungen.Es wird nirgendwo verwendet.|
|ga |Die Gruppenadresse.Sie können auch die ".." Wildchars verwenden, um eine Reihe von Gruppenadressen zu fassen.Das ".." kann nur mit dem dritten GA -Level verwendet werden, z. B. \*\* 1/1/0..257 \*\*.Siehe die Stichproben unten.|
|DPT |Der Gruppenaddatenpunkt im Format "1.001".Es ist \*\* optional \*\* Wenn die ETS -CSV -Datei importiert wurde.|
|Standard |Der Wert, der als Antwort auf eine Leseanforderung an den Bus gesendet wurde, wenn der Gruppenadressenwert noch nicht vom Knoten auswendig gelernt wurde.|

\*\* Beginnen wir mit einer Richtlinie \*\*

Der Autoresponder -Knoten antwortet auf Leseanfragen für die Gruppenadresse 2/7/1.Wenn noch kein Wert im Speicher ist, antwortet er mit \*True \*.
Die ETS -CSV -Datei muss importiert worden sein, andernfalls müssen Sie die \*\* "DPT": "1.001" \*\* Key hinzufügen.

```json
[
    {
        "ga": "2/7/1",
        "default": true
    }
]
```

\*\* Ein bisschen vollständiger Richtlinie \*\*

Der Autoresponder -Knoten antwortet auf Leseanfragen für die Gruppenadresse ab dem 01.03.1 bis zum 01.03.22.Wenn noch kein Wert im Speicher ist, antwortet er mit \*Falsch \*.
Es gibt auch einen \*\* Hinweis \*\* Taste, lediglich als Erinnerungsnotiz.Es wird nirgendwo verwendet.

```json
[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
```

\*\* Verkettungsanweisungen \*\*

Der Autoresponder -Knoten antwortet auf Leseanfragen für die Gruppenadresse ab dem 2/2/5 bis 2/2/21 enthalten.Wenn noch kein Wert im Speicher ist, wird mit einem Wert von 25 geantwortet.
Der Autoresponder -Knoten antwortet auch auf Leseanforderungen für die Gruppenadresse 2/4/22.Wenn noch kein Wert im Speicher liegt, wird mit dem Zeichenfolge \*unbekannter Status! \*Antworten.
Bitte beachten Sie das JSON -Objekt jeder Richtlinie.

```json
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
```

<br/>
