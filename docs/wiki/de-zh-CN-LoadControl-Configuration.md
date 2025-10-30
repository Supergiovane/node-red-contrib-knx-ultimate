🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) | [IT](/node-red-contrib-knx-ultimate/wiki/it-LoadControl-Configuration) | [DE](/node-red-contrib-knx-ultimate/wiki/de-LoadControl-Configuration) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | [ES](/node-red-contrib-knx-ultimate/wiki/es-LoadControl-Configuration) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-LoadControl-Configuration)
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

# KNX -Laststeuerungsknoten

<p> Verwenden des Laststeuerungsknotens können Sie die Trennung der Last (Waschmaschine, Ofen usw.) automatisch verwalten, wenn der aktuelle Verbrauch einen bestimmten Schwellenwert überschreitet.

Das Gerät wird intelligent heruntergefahren und überprüft den möglichen Verbrauch des Geräts, um festzustellen, ob es mit anderen Geräten ausgeschaltet ist.<br/>
Der Knoten kann die Last automatisch reaktivieren.<br/>
Dieser Knoten schaltet ein Gerät (oder Geräte) gleichzeitig gemäß der gewählten Bestellung ab. <br/>

**Allgemein**

| Eigenschaften |Beschreibung |
|-|-|
| Gateway |KNX Portal. Es ist auch möglich, kein Gateway auszuwählen.In diesem Fall werden nur in den Knoten eingegebene Nachrichten berücksichtigt. |
|Überwachung WH | Die Gruppenadresse repräsentiert den Gesamtverbrauch Ihres Gebäudes. |
| Begrenzen Sie WH | Maximale Schwelle, die das Messgerät standhalten kann.Wenn dieser Schwellenwert überschritten wird, beginnt der Knoten damit, das Gerät abzuschalten. |
| Verzögert (s) |Zeigt in Sekunden an, was darauf hinweist, dass der Knoten die Häufigkeit des Verbrauchs bewertet und jedes Gerät abschaltet. |
| Verzögerung der (s) |zeigt in Sekunden an, was darauf hinweist, dass der Knoten die verbrauchte Frequenz bewertet und auf jedem geschlossenen Gerät eingeschaltet wird.|

<br/>

**Laststeuerung**

Hier können Sie das Gerät zum Herunterladen bei Überladung hinzufügen.<br/>
Wählen Sie das ausgeschaltete Gerät aus.Geben Sie den Gerätenamen oder seine Gruppenadresse ein.<br/>
Geben Sie eine Gruppenadresse ein, die das von dem in der ersten Zeile ausgewählte Gerät verbrauchte angeben. **Dies ist ein optionaler Parameter** . Wenn das Gerät mehr als eine bestimmte Anzahl von Watts verbraucht, bedeutet dies, dass es verwendet wird.Wenn weniger verbraucht wird, wird das Gerät als "nicht verwendet" und das Gerät sofort ausgeschaltet. <br/>
Wenn \*autoreCovery \* aktiviert ist, wird das Gerät automatisch reaktiviert, wenn die Reset -Verzögerung abläuft.

## Eingeben

| Eigenschaften | Beschreibung |
|-|-|
| `msg.readstatus = true` | Erzwingen Sie den KNX -Bus jedes Geräts in der Liste, um den Wert zu lesen._ **Der Knoten selbst hat alle Operationen ausgeführt** _, aber bei Bedarf können Sie diesen Befehl verwenden, um einen erneuten Lesen des aktuellen Wertes in Watt zu erzwingen.| | |
| `msg.enable = true` | Lastkontrolle aktivieren. |
| `msg.disable = true` | Deaktivieren Sie die Lastkontrolle. |
| `msg.reset = true` |den Knotenstatus zurücksetzen und alle Geräte wieder eröffnen. |
| `msg.shedding` | String._ """"" Sog "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" " "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" Verwenden Sie diese Nachricht, um den Falloff -Timer zu erzwingen, um den \*\* -Monitor zu ignorieren |

## Ausgabe

1. Standardausgang
: Payload (Zeichenfolge | Objekt): Standardausgabe des Befehls.

## Detail```javascript

msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}

```# Probe

\ <a href = "https://github.com/supergiovane/node-red-contrib-nx-ultimate/wiki/sampleloadcontrol"> Klicken Sie hier hier </a> hier </a>

<br/>