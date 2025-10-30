🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) | [IT](/node-red-contrib-knx-ultimate/wiki/it-FAQ-Troubleshoot) | [DE](/node-red-contrib-knx-ultimate/wiki/de-FAQ-Troubleshoot) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-FAQ-Troubleshoot) | [ES](/node-red-contrib-knx-ultimate/wiki/es-FAQ-Troubleshoot) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-FAQ-Troubleshoot)
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

#Faq & Fehlerbehebung

Danke, dass du meinen Knoten -Red -Knoten benutzt hast!Wenn Sie Probleme haben, machen Sie sich keine Sorgen: Befolgen Sie einfach die folgende Liste, um den Artikel nach Element zu überprüfen.KNX -Ultimate wurde weit verbreitet und ist stabil und zuverlässig.

Mindestanforderungen: **node.js> = 16**

## Knoten funktioniert nicht

- Ist der [Gateway -Konfigurationsknoten](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) (auf IP/Port von KNX/IP -Router oder Schnittstelle hingewiesen) erstellt und korrekt konfiguriert?
- KNX/IP **Router ** :**Host** Füllen Sie `224.0.23.12`, Port` 3671` aus.
- KNX/IP **Schnittstelle ** :**Host** Füllen Sie die Geräte -IP aus (z. B. 192.168.1.22`), Port `3671`.
- Wenn mehrere NICs **(Ethernet/Wireless) vorhanden sind, geben Sie die NICs an, die im Gateway verwendet werden sollen, oder deaktivieren Sie Wi-Fi.Achten Sie nach der Änderung unbedingt ** starten Sie die Node -Red** neu.
- Verwenden Sie nur formale, zertifizierte KNX/IP -Router oder KNX/IP -Schnittstelle, um "All -in -One/Agent" -Verrichtungen zu vermeiden.
- Wenn Sie die Schnittstelle verwenden, können Sie den Test "ACK -Anforderung unterdrücken" im Gateway aktivieren.
- Siehe unten "Nur empfangen / kann nicht senden".
- Wenn Sie in einem Container ausgeführt werden, verzögern Sie bitte die Startknoten -Red** geringfügig (manchmal ist die Netzwerkkarte nicht fertig).

## Halten Sie an, nachdem Sie eine Weile gelaufen sind

- Siehe den vorherigen Abschnitt "Knoten können nicht funktionieren".
- vorübergehend **Schalten Sie den DDOS/UDP -Hochwasserschutz auf den Schalter/den Router aus** (kann die UDP -Pakete von KNX abfangen).
- Schließen Sie die KNX/IP -Geräte direkt an einen Knoten -Red -Host -Test an.
- Vermeiden Sie billige oder all -ein -Schnittstellen und geben Sie **KNX/IP -Router** Priorität.
- Beachten Sie die gleichzeitige Verbindungsgrenze bei Verwendung der Schnittstelle (siehe Produkthandbuch).Router hat normalerweise keine solche Einschränkung.

## KNXD -Konfiguration

- **KNXD** Auf demselben Host wie Knoten -Red wird die Schnittstelle empfohlen, 127.0.0.1` zu verwenden.
- Überprüfen Sie den Filtertabellen und passen Sie die physische Adresse von config -node entsprechend an.
- Aktivieren Sie in Gateway "Echo Send Message an alle Knoten mit derselben Gruppenadresse".

## ETs können Nachrichten sehen, aber der Testamentsvollstrecker hat keine Antwort

Kann mit anderen KNX -Plugins in Konflikt stehen.

- Entfernen Sie andere KNX-Plug-Ins aus der Knoten-Red-Palette, wobei Sie nur KNX-Ultimate halten (und auch versteckte Konfigurationsnoten entfernen).
- Schalten Sie den Test "ACK Request" im Gateway ein, wenn Sie die Schnittstelle verwenden.

## kann nur empfangen, nicht senden (oder umgekehrt)

Ihr Router/Ihre Schnittstelle kann Filterung aktiviert.

- Erlauben Sie **Weiterleiten** in ETS; oder passen Sie die physische Adresse der Konfiguration an, basierend auf der Filtertabelle des Routers.
- Wenn Sie **kNXD** verwenden, überprüfen Sie bitte die Filtertabelle und passen Sie die physische Adresse entsprechend an.

## Wertfehler

- Verwenden Sie den richtigen Datenpunkt (Temperatur: `9.001`).
- Importieren Sie ETS CSV in Gateway, um den richtigen DPT zu erhalten.
- Vermeiden Sie zwei Knoten mit demselben GA **, aber unterschiedlichem DPT** .

## Nein "Interkommunikation" zwischen Knoten derselben GA

Häufig in Tunneling/Unicast (Schnittstelle, KNXD) gefunden.

- Aktivieren Sie in Gateway "Echo Send Message an alle Knoten mit derselben Gruppenadresse".

## sichern KNX -Router/Schnittstellen

Nicht unterstützt, wenn der sichere Modus aktiviert ist;Wenn nicht sichere Verbindungen zulässig sind, kann dies ordnungsgemäß funktionieren.

- Sicheres Routing schließen oder unsichere Verbindungen zulassen.
.
- Sicherere Verbindungen können in Zukunft unterstützt werden.

## Hochwasserschutz (Stromgrenzschutz)

Um die UI- und Bus -Überladung zu vermeiden: Jeder Knoten empfängt bis zu 120 Nachrichten innerhalb eines 1 -Sekunden -Fensters.

- Verwenden Sie den Knoten **Delay** , um Nachrichten zu zerstreuen.
- Filter -Duplikatwerte mit **rbe** .
[Details](/node-red-contrib-knx-ultimate/wiki/Protections)

## DataPoint -Warnung erscheint nach dem Importieren von ETs

- Füllen Sie ETS aus (Subtypen wie `5.001`).
- oder wählen Sie "mit einem gefälschten 1.001 -Datenpunkt (nicht empfohlen)", wenn Sie die zugehörige GA importieren oder überspringen.

## Rundschreibenschutzschutz

Wenn zwei Knoten direkt mit demselben GA -Out → in verbunden sind, deaktiviert das System es, um Loopback zu verhindern.

- Anpassungsprozess: Teilen Sie diese beiden Knoten oder fügen Sie "Mediation/Puffer" -Knoten dazu auf.
- Aktivieren Sie **rbe** , um Loopback zu vermeiden.
[Details](/node-red-contrib-knx-ultimate/wiki/Protections)

## haben noch Probleme?

- Es wird empfohlen, ein Problem (Priorität) in [GitHub](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues) zu machen.
- oder senden Sie mir eine private Nachricht unter [kNX -Benutzer -Forum](https://knx-user-forum.de) (Benutzer: themaX74; bitte auf Englisch).