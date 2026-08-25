---
layout: wiki
title: "KNX AI"
lang: de
permalink: /wiki/de-KNX%20AI
---
Dieser Node überwacht **alle KNX-Telegramme** des ausgewählten KNX-Ultimate-Gateways, erstellt Verkehrsstatistiken, erkennt Anomalien und kann optional ein LLM befragen.

Der Editor verwendet zwei horizontale Registerkarten: **KI-Assistent** enthält Einrichtung, Wissen/Kontext und Anbietergrenzen; **Gespräche & Zuhause** enthält Chat-Kanäle, proaktives Zuhause und begrenztes Gedächtnis.

## Ausgänge
1. **Zusammenfassung/Statistik** (`msg.payload` JSON)
2. **Anomalien** (`msg.payload` JSON)
3. **KI-Assistent** (`msg.payload` Text, mit `msg.summary`)
4. **KNX-Operationen** (eine Universal-Mode-Nachricht je validierter Lese- oder Schreiboperation)

Jede an den Ausgängen 3 und 4 ausgegebene Nachricht enthält außerdem eine Kopie der ursprünglichen Eingangsnachricht in `msg.inputMessage`. Dadurch bleiben der ursprüngliche Payload, das Topic, die Chat-Metadaten und alle weiteren Eingangseigenschaften für nachfolgende Nodes verfügbar. Fehler beim Klonen oder Ausgeben werden abgefangen und gemeldet, statt in die Node-RED-Laufzeit zu gelangen.

## Befehle (Eingang)
Sende `msg.topic`:
- `summary` (oder leer): Summary sofort senden
- `reset`: internen Verlauf, Zähler, gelerntes Hausgedächtnis und alle gespeicherten Chat-Kontexte löschen; die KI-Erziehung bleibt unverändert
- `ask`: Frage an das konfigurierte LLM senden
- `confirm` / `cancel`: ausstehende KNX-Befehle ohne erneuten LLM-Aufruf bestätigen oder abbrechen
- `clear_chat`: letzte Gesprächsschritte, dauerhafte Anweisungen und ausstehende Befehle der aktuellen Sitzung löschen

Für `ask` die Frage in `msg.prompt` (empfohlen), `msg.payload` (String) oder den üblichen Telegram-Feldern `msg.payload.content` / `msg.payload.text` übergeben.

Dauert die Verarbeitung länger als 1,2 Sekunden, sendet Ausgang 3 sofort die lokalisierte Zwischenmeldung „Ich denke nach…“ mit `msg.knxAi.type = "thinking"` und `msg.knxAi.transient = true`. Der Chat-Adapter übermittelt sie an denselben Benutzer; die endgültige Antwort folgt wie gewohnt, sobald sie bereit ist. Diese Fortschrittsmeldung wird weder im Gesprächskontext noch im gelernten Gedächtnis gespeichert.

Anfragen an Ollama und Bionic LM Studio verwenden automatisch ein Mindest-Timeout von 10 Minuten; Cloud-Anbieter behalten mindestens 2 Minuten. Im Editor muss kein Timeout-Feld gepflegt werden. Wird selbst das lokale Limit erreicht, meldet KNX AI, dass das Modell die Antwort nicht abgeschlossen hat, und empfiehlt einen neuen Versuch oder einen kleineren Prompt-Kontext.

Der Node-Status im Canvas ist bewusst ausschließlich für die letzte eingehende Anfrage und den lokalisierten Zustand „Ich denke nach…“ während der LLM-Ausführung reserviert. KNX-Telegramme, Gateway-Aktualisierungen, Verkehrsraten, Bereitschaftsmeldungen und technische Ergebnisse überschreiben ihn nie; sie bleiben über Ausgänge, Logs und Assistentendaten verfügbar.

Jede Ask-/Chat-Sitzung speichert ihre letzten 8 Gesprächsschritte und bis zu 20 ausdrücklich langfristige Anweisungen, getrennt nach `msg.knxAi.sessionId`, `msg.sessionId` oder erkannter Telegram-Chat-ID. Aufforderungen wie „Merk dir, den Begriff unknown nicht zu verwenden“ werden dauerhaft gespeichert. Alle KNX-AI-Nodes mit demselben Speicher teilen diesen Kontext live und laden ihn nach einem Node-RED-Neustart aus `knxultimatestorage/knxai/memory/knxai-chat-context.md`. Die atomar geschriebene Datei ist auf 50 Sitzungen und 512 KB begrenzt. Bei aktiviertem KNX-Steuern Ausgang 3 mit dem Chat-Sender und Ausgang 4 mit einem KNX-Ultimate-Node im **Universalmodus** verbinden. Bei aktiver Bestätigung zeigt die erste Antwort GA, DPT und Payload, ohne Schreiboperationen auszugeben; dieselbe Sitzung muss innerhalb von 5 Minuten `BESTÄTIGEN` oder `ABBRECHEN` antworten. Eine neue Anfrage ersetzt einen älteren Plan. Jeder bestätigte Befehl enthält `msg.destination`, `msg.dpt`, `msg.payload` und `msg.event = "GroupValue_Write"`.
Bei DPT-1.xxx-Schreibvorgängen werden die sicheren KI-Entsprechungen `true`/`false`, `1`/`0` und `on`/`off` vor der lokalen Validierung und Ausgabe in echte Boolesche Werte normalisiert.

### Aktuelle KNX-Lesewerte
Wenn der Benutzer ausdrücklich einen aktuellen oder aktualisierten Zustand anfordert, kann die KI exakte Objekte aus dem importierten ETS-Katalog abfragen, einschließlich Status- und anderer schreibgeschützter Objekte. Ausgang 4 gibt `msg.destination`, `msg.dpt`, `msg.event = "GroupValue_Read"` und `msg.readstatus = true` aus. Der Node wartet bis zu 6 Sekunden auf jede `GroupValue_Response` oder ein aktuelles Write-Telegramm, gibt anschließend die dekodierten Werte an Ausgang 3 zurück und stellt Details in `msg.knxAi.readResults` bereit. Leseoperationen erfordern keine Bestätigung und werden niemals in Schreiboperationen umgewandelt. Lässt ein kleines lokales Modell Vorgangstyp und Payload weg, werden exakte ETS-Objekte sicher als Leseoperationen normalisiert; ein Element mit Payload bleibt eine validierte Schreiboperation.

### Mehrstufige Gesprächsroutinen
Anfragen wie „Ich gehe“, „Gute Nacht“ oder „Kinomodus“ können ohne neue Editor-Option eine zustandsabhängige Routine koordinieren. Im ersten LLM-Durchlauf werden ausschließlich exakte ETS-Leseoperationen akzeptiert (maximal 20); KNX AI sendet sie und übergibt die aktuellen GA-/DPT-/Wert-Ergebnisse an einen zweiten isolierten Planungsdurchlauf. Dieser darf bis zu 12 validierte Schreiboperationen vorbereiten, aber keinen weiteren Lesezyklus starten. Bei aktivierter Bestätigung benötigt der gesamte Plan eine einzige lokalisierte Bestätigung; vorher werden weder Schreiboperationen noch angeforderte TTS-Ansagen ausgegeben. Nach der Bestätigung wird jede Schreiboperation erneut validiert, in Reihenfolge weitergegeben und bis zu 4 Sekunden auf eine passende unmittelbare Bus-Rückmeldung beobachtet. Die Abschlussmeldung unterscheidet beobachtete Rückmeldungen von Vorgängen ohne unmittelbare Rückmeldung, ohne daraus einen Gerätefehler abzuleiten. Details stehen in `msg.knxAi.routine`, `readResults`, `verifiedCount` und `unverifiedCount`.

### Bestätigungsanfrage für Chat-Schaltflächen
Solange ein Plan aussteht, enthält Ausgang 3 `msg.knxAi.confirmationRequest`. Das Objekt enthält `required`, `status`, `sessionId`, `expiresAt`, `commandCount` und zwei Einträge in `actions`. Verwenden Sie `action.label` als Text der Telegram-Schaltfläche, `action.callbackData` als Callback und senden Sie `action.message` an KNX AI zurück, um ohne Texteingabe zu bestätigen oder abzubrechen.

### Chat-Adapter-Vorlagen
Der Tab **Chat-Adapter** lädt seine auswählbaren Zuordnungen aus `resources/KNXAIChatAdapterMappings.js`. Die Auswahl einer Vorlage installiert intern zwei vordefinierte synchrone JavaScript-Zuordnungen: eine vor der Verarbeitung des Eingangs durch KNX AI und eine vor der Ausgabe an Ausgang 3. Die Zuordnungen bleiben im Editor verborgen. Syntax- und Laufzeitfehler werden abgefangen und gemeldet, ohne Node-RED anzuhalten.

Die enthaltene Vorlage **windkh/node-red-contrib-telegrambot** folgt dem Receiver-/Sender-Vertrag des Pakets. Verbinden Sie einen `telegram receiver` direkt mit KNX AI und Ausgang 3 direkt mit einem `telegram sender`. Für Inline-Bestätigungsschaltflächen verbinden Sie zusätzlich einen als `callback_query` konfigurierten `telegram event` mit demselben KNX-AI-Eingang. Die Eingangszuordnung liest `msg.payload.content`, `msg.payload.chatId` und die Telegram-Sprache. Die Ausgangszuordnung erstellt `msg.payload.chatId`, `type` und `content` und ergänzt bei ausstehender Schreibbestätigung `options.reply_markup` aus `msg.knxAi.confirmationRequest`. Das Telegram-Paket bleibt eine separate optionale Abhängigkeit.

Die enthaltene Vorlage **RedBot / node-red-contrib-chatbot (Telegram)** folgt dem gemeinsamen RedBot-Nachrichtenformat. Verbinden Sie `chatbot-telegram-receive` direkt mit KNX AI und Ausgang 3 direkt mit `chatbot-telegram-send`; ein separater Callback-Node ist nicht erforderlich, da RedBot Postbacks von Inline-Schaltflächen in normale Eingangsnachrichten umwandelt. Die Eingangszuordnung liest `transport`, `chatId`, `type`, `content` und die Telegram-Sprache. Die Ausgangszuordnung bewahrt die RedBot-Trackingdaten `originalMessage`, `chat`, `api` und `client` und erzeugt anschließend entweder einen `message`-Payload oder einen `inline-buttons`-Payload mit `postback`-Aktionen zur Bestätigung. RedBot bleibt eine separate optionale Abhängigkeit.

### Automatisch erkannte Kamera-Adapter
Installierte Kamerapakete können KNX AI zur Laufzeit einen Kamera-Adapter bereitstellen. Es gibt weder eine Auswahl noch einen Kamera-Node, der mit KNX AI verbunden werden muss: verfügbare Adapter, Controller und Kameras werden automatisch erkannt und in den Chat-Kontext aufgenommen. `node-red-contrib-unifi-ultimate` ist der erste unterstützte Anbieter; weitere Pakete wie `hikvision-ultimate` können sich über denselben herstellerneutralen Vertrag registrieren.

Der Benutzer kann einen aktuellen Snapshot anfordern oder das Vision-Modell nach dem sichtbaren Inhalt fragen. Die Telegram- und RedBot-Vorlagen senden das Bild als natives Foto mit Bildunterschrift. Außerdem lassen sich dauerhafte Benachrichtigungen für Bewegung, das Überqueren einer intelligenten Linie oder das Betreten einer Einbruchs-/Verweilzone erstellen, optional auf erkannte Personen und eine genau benannte Linie oder Zone begrenzt. Diese Regeln werden in derselben Datei `knxai-chat-context.md` gespeichert und nach einem Neustart von Node-RED wiederhergestellt. UniFi-Ereignisse und Snapshot-Anfragen laufen direkt über den erkannten Anbieter; Ausgang 4 von KNX AI und zusätzliche Flow-Verkabelung sind nicht erforderlich.

Jedes von einem automatisch erkannten Adapter veröffentlichte Ereignis wird normalisiert und in eine tägliche Datei `YYYY-MM-DD.jsonl` unter `knxultimatestorage/knxai/adapter-history/<node-id>/` geschrieben. Das Archiv bewahrt 10 Tage auf, garantiert mehr als 24 Stunden Historie und speichert Ereignismetadaten, jedoch keine Snapshot-Bilder. Web-Assistent und alle CHAT-Kanäle fragen es zusammen mit dem täglichen KNX-Telegrammarchiv ab. Summen umfassen alle gespeicherten Zeilen; ausgewählte Details sind nur eine relevante Stichprobe.

### Ansagen mit TTS Ultimate
Wenn das optionale Paket `node-red-contrib-tts-ultimate` installiert ist, erscheint es unter den automatisch erkannten Adaptern. Die Auswahl listet alle `ttsultimate`-Nodes in sämtlichen Projekt-Flows mit Flow, Node-Name und konfiguriertem Player auf. Wählen Sie den Node für Chat-Ansagen aus und deployen Sie den Flow.

Nur eine ausdrückliche Anfrage in der aktuellen Chat-Nachricht kann eine Ansage erzeugen. KNX AI sendet den exakten Text direkt als `msg.payload` mit `msg.topic = "knx_ai_announcement"` an den ausgewählten Node; eine Zwischenverkabelung im Flow ist nicht erforderlich. TTS Ultimate verwaltet anschließend den konfigurierten Sonos-Player, Stimme, Lautstärke, Hailing und Warteschlange. Persistenter Kontext, KI-Erziehung, Kamerainhalte und abgeleitete Ereignisse lösen niemals selbstständig Sprache aus.

### Übersicht des Chat-Kontexts
Der Node-Editor zeigt eine kompakte Karte mit den für den Chat verfügbaren Quellen: aktuellem KNX-Verkehr, ETS-Semantik und Node-RED-Projekt, Sitzungs- und Hausgedächtnis, KI-Erziehung und erkannten Kameras. Sie zeigt außerdem den maximalen operativen Kontext und die tatsächliche UTF-8-Größe des letzten Chat-Prompts; gemeldete Eingabe-Token des Anbieters werden exakt verwendet, andernfalls wird der Tokenwert als Schätzung gekennzeichnet. Außerdem werden `knxai-chat-context.md`, `knxai-home-memory.md` und `knxai-config-<node-id>.json` sowie das absolute Stammverzeichnis des KNX-Telegrammarchivs, das Node-spezifische Verzeichnis und das Tagesdateimuster `YYYY-MM-DD.jsonl` aufgeführt. Die Pfade werden zur Laufzeit aus dem tatsächlich verwendeten Datenverzeichnis des konfigurierten Gateways ermittelt.

## Durch KI-Erziehung gesteuerte proaktive Hausintelligenz und begrenztes Gedächtnis
Aus ETS-Hierarchie, Namen, Rollen und DPTs erstellt der Node ein deterministisches semantisches Modell. Es gibt keinen separaten Schalter und keine erweiterten proaktiven Einstellungen. Eine Benachrichtigung wird nur bewertet, wenn das LLM aktiv ist und die **KI-Erziehung** sie ausdrücklich verlangt. Ausschließlich die Erziehung bestimmt Bedingungen, Offenzeit, Ruhezeiten und Wiederholung. Ohne eine ausdrückliche Regel oder bei fehlgeschlagener LLM-Auswertung wird nichts gesendet.

Die letzte Chat-Sitzung wird als Eigentümer gespeichert und empfängt spontane Nachrichten. Ausgang 3 gibt `msg.knxAi.type = "proactive_notification"` aus; `msg.inputMessage` bewahrt die Sitzung für den Chat-Adapter. Höchstens drei proaktive Nachrichten pro Stunde verhindern eine Nachrichtenflut. Ausgang 4 wird niemals proaktiv verwendet und KNX wird nicht selbstständig verändert.

Die gemeinsame gelernte Referenz wird beim Start aus `<userDir>/knxai/memory/knxai-home-memory.md` geladen, alle 15 Minuten atomar neu geschrieben und immer strikt auf 5 MB begrenzt. Sie enthält höchstens 120 wichtige Beobachtungen, 80 aggregierte Gewohnheiten, 80 Benachrichtigungen und 300 semantische ETS-Objekte, niemals einen unbegrenzten Rohtelegrammstrom. Alte Einträge mit niedriger Priorität werden zuerst entfernt. **KI-Erziehung** ist auf 16.000 Zeichen begrenzt und stammt immer aus der Node-Konfiguration: Die KI darf sie als verbindliche Vorgabe lesen, aber weder ändern noch überschreiben. Ist eine Erziehung vorhanden, kann das LLM sie aber nicht auswerten, wird die mögliche Benachrichtigung unterdrückt, statt ihr möglicherweise zu widersprechen.

## Praktisches Konfigurationsbeispiel
Schreiben Sie die vollständige Benachrichtigungsrichtlinie in die **KI-Erziehung** (`aiEducation`):

```text
Nenne mich Alex und antworte in derselben Sprache wie ich.
Antworte kurz, außer ich bitte um technische Einzelheiten.
Benachrichtige meinen letzten Chat, wenn ein Rollladen, Fenster oder eine Tür mindestens 120 Minuten offen bleibt.
Zwischen 23:00 und 07:00 keine Meldungen; dieselbe Meldung frühestens nach sechs Stunden wiederholen.
Der Büro-Rollladen darf tagsüber offen bleiben: benachrichtige mich nicht.
Wenn „Wohnzimmerlicht“ mehrdeutig ist, frage nach der gemeinten Leuchte.
Behaupte nie eine Aktoränderung, bevor ein KNX-Statusobjekt sie bestätigt.
```

Damit kann Ausgang 3 nach 120 Minuten eine lokalisierte `proactive_notification` für den Wohnzimmer-Rollladen ausgeben, während eine Meldung für den Büro-Rollladen durch die Erziehung unterdrückt wird. Bittet Alex danach um das Schließen, erstellt KNX AI den exakten ETS-Befehl, behält aber Validierung und Bestätigung vor Ausgang 4 bei.

Verwenden Sie aussagekräftige ETS-Hierarchien und Objektnamen sowie korrekte Status-/Befehlsrollen. Die Erziehung personalisiert Entscheidungen und Formulierungen, kann aber keine Gruppenadresse erfinden, keinen DPT ändern und die KNX-Validierung nicht umgehen.

## Kurzer Ablauf: KNX-Steuerung
1. Importieren Sie die ETS-CSV in das Gateway und konfigurieren Sie LLM-Anbieter, Modell und Zugangsdaten.
2. Aktivieren Sie **LLM-Assistent** und **KNX-Zustände lesen und Aktoren steuern**; lassen Sie die Bestätigung aktiviert.
3. Verbinden Sie den Chat-Eingang mit KNX AI und behalten Sie eine stabile Sitzungs-/Chat-ID bei.
4. Verbinden Sie Ausgang 3 mit der Chat-Antwort und Ausgang 4 mit KNX Ultimate im **Universalmodus**.
5. Der Benutzer sendet eine Anfrage; aktuelle Zustandsabfragen werden sofort gelesen, während Schreiboperationen zuerst GA, DPT und Wert ohne Bus-Schreibzugriff anzeigen.
6. Innerhalb von 5 Minuten antwortet derselbe Chat exakt mit `BESTÄTIGEN` oder `ABBRECHEN`.
7. Nur `BESTÄTIGEN` validiert erneut und gibt Befehle an Ausgang 4 aus; prüfen Sie die Ausführung über eine KNX-Status-GA.

## Konfigurationsfelder
Hier sind alle Felder aufgeführt, wie sie im KNX-AI-Editor sichtbar sind.

### Allgemein
- **Gateway**: KNX-Ultimate Gateway/Config-Node als Telegrammquelle.
- **Name**: Node-Name und Dashboard-Titel.
- **Topic**: Basis-Topic der Node-Ausgänge.
- Button **Open KNX AI Web**: Öffnet das Web-Dashboard (`/knxUltimateAI/sidebar/page`).

### KI-Assistent
- **Enable LLM assistant**: Aktiviert Ask/Chat-Funktionen.
- **Provider**: LLM-Backend (OpenAI-compatible, Anthropic, Ollama oder Bionic LM Studio).
- **Endpoint URL**: URL des Chat/Completions-Endpunkts.
- **API key**: API-Schlüssel (für lokales Ollama nicht erforderlich; für Bionic LM Studio optional, sofern die Serverauthentifizierung deaktiviert ist).
- **Model**: Modell-ID/Name.
- **Chatmodell-Kompatibilität**: Das ausgewählte Modell muss den konfigurierten Chat-Completions-Endpunkt unterstützen. Ältere reine Completions-Modelle wie `gpt-3.5-turbo-instruct` werden beim Aktualisieren der Modellliste ausgeschlossen. Lehnt der Anbieter einen benutzerdefinierten Temperaturwert oder den Token-Limit-Parameter ab, wiederholt KNX AI die Anfrage und entfernt oder ersetzt nur das inkompatible Feld.
- **KI darf KNX-Zustände lesen und Aktoren steuern**: Aktiviert Ausgang 4 und ist standardmäßig aus. Exakte ETS-Katalogobjekte dürfen gelesen werden; Schreiboperationen werden ausschließlich für Objekte mit Rolle `command` akzeptiert. Unbekannte, DPT-falsche, ungültige oder überzählige Operationen sowie Schreiboperationen auf Status-/Neutralobjekte werden lokal abgewiesen.
- **Vor dem Senden von KNX-Befehlen bestätigen lassen**: Standardmäßig aktiv. Zeigt zuerst die validierten Änderungen und sendet nichts, bis dieselbe Chat-Sitzung bestätigt. Wenn Befehle auf Bestätigung warten, fügt die Antwort immer die genauen Anweisungen zum Bestätigen oder Abbrechen in der Sprache der aktuellen Anfrage hinzu. Vor der Ausgabe werden die Befehle erneut validiert.
- **Adapter-Vorlage**: Standardmäßig ist **Kein Adapter** gewählt. Die Auswahl lädt das vordefinierte Paar aus Ein- und Ausgangszuordnung; beide bleiben im Editor verborgen.
- **KI-Erziehung**: Verbindliche, ausschließlich vom Benutzer verwaltete Hinweise, die die KI lesen, aber nie ändern darf. Nur hier werden proaktive Benachrichtigungen mit Bedingungen, Dauer, Ruhezeiten und Wiederholung angefordert.
- Mitgelieferte Auszüge aus Hilfe, README, Changelog, Wiki und Beispielen werden nicht in Prompts von Telegram, RedBot oder benutzerdefinierten CHAT-Adaptern aufgenommen. Sie bleiben nur dem Web-Assistenten für technische Fragen zum Paket verfügbar.
- Button **Refresh**: Fragt den Provider ab und lädt verfügbare Modelle. Währenddessen dreht sich das Symbol; ein erfolgreicher Abschluss bleibt absichtlich ohne Meldung.

### Ollama Schnellstart (lokal)
- **Provider = Ollama** auswählen.
- Standard-Endpoint: `http://localhost:11434/api/chat`.
- Wenn keine lokalen Modelle gefunden werden:
  - **1) Download model**: öffnet die Seite **Model library**.
  - **2) Install it**: lädt und installiert das Modell lokal (z. B. `llama3.1`).
- Beim Refresh/Install versucht KNX AI zusätzlich, den Ollama-Server automatisch zu starten.
- Bei Installationsfehlern mit Verbindungsproblem prüfen, ob Ollama läuft (Desktop-App oder `ollama serve`).
- Der von `/api/show` gemeldete maximale Kontext dient nur zur Information. KNX AI sendet immer `num_ctx = 16384` (oder das kleinere Modellmaximum) und verwendet dieselbe relevanzbasierte semantische 16K-Ansicht. So wird keine übergroße KV-Cache-Zuweisung erzeugt, ohne Agentenfunktionen zu entfernen.
- Wenn Node-RED in Docker läuft, im Endpoint `host.docker.internal` statt `localhost` verwenden.

### Bionic LM Studio Schnellstart (lokal)
- **Provider = Bionic LM Studio** auswählen.
- Den LM-Studio-API-Server auf der Seite **Developer** oder mit `lms server start` starten.
- Standard-Endpoint: `http://localhost:1234/v1/chat/completions`.
- Mit **Refresh** alle von `/v1/models` bereitgestellten Modelle laden; ist kein Modell konfiguriert, wird das erste ausgewählt.
- Ist ein Modell bereits geladen, behält KNX AI dessen aktive Kontextlänge bei. KNX AI lädt ein inaktives Bionic-Modell niemals über die Verwaltungs-API: Die erste Chat-Anfrage lässt Bionic das Modell per JIT mit den gespeicherten modellspezifischen Standardwerten laden. Unabhängig vom von Bionic gemeldeten Kontext begrenzt KNX AI den eigenen Prompt immer auf eine nach Relevanz ausgewählte semantische 16K-Ansicht; dadurch wird nicht der gesamte 131K-Datensatz gesendet, ohne Denk-, KNX-, Routinen-, Kamera- oder TTS-Funktionen zu entfernen.
- Der API-Schlüssel ist optional, sofern die Authentifizierung in den LM-Studio-Servereinstellungen nicht aktiviert ist. In Docker `localhost` durch `host.docker.internal` ersetzen.

## Sicherheitshinweis
Bei aktiviertem LLM kann KNX-Traffic-Kontext an den konfigurierten Endpoint gesendet werden. Für striktes On-Premise lokale Provider verwenden. Ein Befehl an Ausgang 4 hat die lokale Validierung bestanden und wurde an den Flow weitergegeben; dies bestätigt nicht die Ausführung durch den Aktor. Dafür eine KNX-Status-GA verwenden.
