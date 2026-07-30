---
layout: wiki
title: "KNX AI"
lang: de
permalink: /wiki/de-KNX%20AI
---
Dieser Node überwacht **alle KNX-Telegramme** des ausgewählten KNX-Ultimate-Gateways, erstellt Verkehrsstatistiken, erkennt Anomalien und kann optional ein LLM befragen.

Der Editor verwendet drei Hauptbereiche als Akkordeon: **KI-Assistent** enthält Einrichtung, Wissen/Kontext und Anbietergrenzen; **Gespräche & Zuhause** enthält Chat-Kanäle, proaktives Zuhause und begrenztes Gedächtnis; **KNX-Verkehrsanalyse** enthält Bus-Telegramme, Verlauf/Zusammenfassungen und Anomalien/Muster. Beim Öffnen eines Hauptbereichs werden alle zugehörigen Optionen gemeinsam angezeigt. Gespeicherte Feld-IDs und Werte bleiben unverändert.

## Ausgänge
1. **Zusammenfassung/Statistik** (`msg.payload` JSON)
2. **Anomalien** (`msg.payload` JSON)
3. **KI-Assistent** (`msg.payload` Text, mit `msg.summary`)
4. **KNX-Operationen** (eine Universal-Mode-Nachricht je validierter Lese- oder Schreiboperation)

Jede an den Ausgängen 3 und 4 ausgegebene Nachricht enthält außerdem eine Kopie der ursprünglichen Eingangsnachricht in `msg.inputMessage`. Dadurch bleiben der ursprüngliche Payload, das Topic, die Chat-Metadaten und alle weiteren Eingangseigenschaften für nachfolgende Nodes verfügbar. Fehler beim Klonen oder Ausgeben werden abgefangen und gemeldet, statt in die Node-RED-Laufzeit zu gelangen.

## Befehle (Eingang)
Sende `msg.topic`:
- `summary` (oder leer): Summary sofort senden
- `reset`: internen Verlauf, Zähler und gelerntes Hausgedächtnis löschen; die KI-Erziehung bleibt unverändert
- `ask`: Frage an das konfigurierte LLM senden
- `confirm` / `cancel`: ausstehende KNX-Befehle ohne erneuten LLM-Aufruf bestätigen oder abbrechen
- `clear_chat`: Gesprächsspeicher der aktuellen Sitzung löschen

Für `ask` die Frage in `msg.prompt` (empfohlen), `msg.payload` (String) oder den üblichen Telegram-Feldern `msg.payload.content` / `msg.payload.text` übergeben.

Bei aktiviertem KNX-Steuern werden die letzten Gesprächsschritte im RAM nach `msg.knxAi.sessionId`, `msg.sessionId` oder erkannter Telegram-Chat-ID getrennt. Ausgang 3 mit dem Chat-Sender und Ausgang 4 mit einem KNX-Ultimate-Node im **Universalmodus** verbinden. Bei aktiver Bestätigung zeigt die erste Antwort GA, DPT und Payload, ohne Schreiboperationen auszugeben; dieselbe Sitzung muss innerhalb von 5 Minuten `BESTÄTIGEN` oder `ABBRECHEN` antworten. Eine neue Anfrage ersetzt einen älteren Plan. Jeder bestätigte Befehl enthält `msg.destination`, `msg.dpt`, `msg.payload` und `msg.event = "GroupValue_Write"`.
Bei DPT-1.xxx-Schreibvorgängen werden die sicheren KI-Entsprechungen `true`/`false`, `1`/`0` und `on`/`off` vor der lokalen Validierung und Ausgabe in echte Boolesche Werte normalisiert.

### Aktuelle KNX-Lesewerte
Wenn der Benutzer ausdrücklich einen aktuellen oder aktualisierten Zustand anfordert, kann die KI exakte Objekte aus dem importierten ETS-Katalog abfragen, einschließlich Status- und anderer schreibgeschützter Objekte. Ausgang 4 gibt `msg.destination`, `msg.dpt`, `msg.event = "GroupValue_Read"` und `msg.readstatus = true` aus. Der Node wartet bis zu 6 Sekunden auf jede `GroupValue_Response` oder ein aktuelles Write-Telegramm, gibt anschließend die dekodierten Werte an Ausgang 3 zurück und stellt Details in `msg.knxAi.readResults` bereit. Leseoperationen erfordern keine Bestätigung und werden niemals in Schreiboperationen umgewandelt.

### Bestätigungsanfrage für Chat-Schaltflächen
Solange ein Plan aussteht, enthält Ausgang 3 `msg.knxAi.confirmationRequest`. Das Objekt enthält `required`, `status`, `sessionId`, `expiresAt`, `commandCount` und zwei Einträge in `actions`. Verwenden Sie `action.label` als Text der Telegram-Schaltfläche, `action.callbackData` als Callback und senden Sie `action.message` an KNX AI zurück, um ohne Texteingabe zu bestätigen oder abzubrechen.

### Chat-Adapter-Vorlagen
Der Tab **Chat-Adapter** lädt seine auswählbaren Zuordnungen aus `resources/KNXAIChatAdapterMappings.js`. Die Auswahl einer Vorlage fügt zwei bearbeitbare synchrone JavaScript-Zuordnungen in Textfeldern über die volle Breite ein: eine vor der Verarbeitung des Eingangs durch KNX AI und eine vor der Ausgabe an Ausgang 3. Geben Sie `msg` zurück, um fortzufahren, oder keinen Wert, um die Nachricht zu verwerfen. Syntax- und Laufzeitfehler werden abgefangen und gemeldet, ohne Node-RED anzuhalten.

Die enthaltene Vorlage **windkh/node-red-contrib-telegrambot** folgt dem Receiver-/Sender-Vertrag des Pakets. Verbinden Sie einen `telegram receiver` direkt mit KNX AI und Ausgang 3 direkt mit einem `telegram sender`. Für Inline-Bestätigungsschaltflächen verbinden Sie zusätzlich einen als `callback_query` konfigurierten `telegram event` mit demselben KNX-AI-Eingang. Die Eingangszuordnung liest `msg.payload.content`, `msg.payload.chatId` und die Telegram-Sprache. Die Ausgangszuordnung erstellt `msg.payload.chatId`, `type` und `content` und ergänzt bei ausstehender Schreibbestätigung `options.reply_markup` aus `msg.knxAi.confirmationRequest`. Das Telegram-Paket bleibt eine separate optionale Abhängigkeit.

## Proaktive Hausintelligenz und begrenztes Gedächtnis
Der Unterbereich **Proaktives Zuhause & Gedächtnis** in **Gespräche & Zuhause** aktiviert proaktive Benachrichtigungen auf Wunsch des Benutzers. Aus ETS-Hierarchie, Namen, Rollen und DPTs erstellt der Node ein deterministisches semantisches Modell für Rollläden, Fenster, Türen, Licht, Temperatur, Klima, Anwesenheit und Alarme mit italienischen, englischen, deutschen, französischen, spanischen und chinesischen Begriffen. Der erste proaktive Detektor überwacht nur zuverlässig erkannte Nicht-Befehlszustände von Rollläden/Fenstern/Türen. Nach der konfigurierten Offenzeit und außerhalb der Ruhezeiten gibt Ausgang 3 eine lokalisierte Nachricht mit `msg.knxAi.type = "proactive_notification"` aus. Ausgang 4 wird niemals proaktiv verwendet und KNX wird nicht selbstständig verändert; eine spätere Benutzeranfrage durchläuft weiterhin die normale Validierung und Bestätigung.

Die letzte Chat-Sitzung wird als Eigentümer gespeichert; alternativ kann **Hauptempfänger / Chat-ID** sie ausdrücklich festlegen. Ein synthetisches `msg.inputMessage` bewahrt den Empfänger, damit der Telegram-Adapter eine spontane Nachricht senden kann. Cooldown und höchstens drei proaktive Nachrichten pro Stunde verhindern eine Nachrichtenflut.

Die gelernte Referenz wird beim Start aus `<userDir>/knxai/memory/knxai-home-memory-<node-id>.md` geladen, alle 15 Minuten atomar neu geschrieben und strikt auf konfigurierbare 64–1.024 KB begrenzt (standardmäßig 256 KB). Sie enthält höchstens 120 wichtige Beobachtungen, 80 aggregierte Gewohnheiten, 80 Benachrichtigungen und 300 semantische ETS-Objekte, niemals einen unbegrenzten Rohtelegrammstrom. Alte Einträge mit niedriger Priorität werden zuerst entfernt. **KI-Erziehung** ist auf 16.000 Zeichen begrenzt und stammt immer aus der Node-Konfiguration: Die KI darf sie als verbindliche Vorgabe lesen, aber weder ändern noch überschreiben. Ist eine Erziehung vorhanden, kann das LLM sie aber nicht auswerten, wird die mögliche Benachrichtigung unterdrückt, statt ihr möglicherweise zu widersprechen.

## Praktisches Konfigurationsbeispiel
Dieses Beispiel erstellt einen knappen Assistenten, der wichtige Öffnungen meldet, aber akzeptiert, dass der Rollladen im Büro offen bleiben darf:

| Editor-Feld | Beispielwert | Wirkung |
|---|---|---|
| **Proaktive Hausbenachrichtigungen aktivieren** (`proactiveEnabled`) | aktiv | Zuverlässig erkannte offene Rollladen-/Fenster-/Türzustände werden bewertet. |
| **Hauptempfänger / Chat-ID** (`proactiveRecipient`) | `123456789` | Spontane Nachrichten gehen an diesen Chat; leer bedeutet: letzte Ask-Sitzung merken. |
| **Nach offener Dauer benachrichtigen** (`proactiveOpenMinutes`) | `120` | Nach zwei Stunden wird eine mögliche Meldung bewertet. |
| **Ruhezeit Beginn / Ende** | `23:00` / `07:00` | Nachts werden keine proaktiven Nachrichten ausgegeben. |
| **Wiederholungs-Cooldown** (`proactiveCooldownMinutes`) | `360` | Dasselbe Objekt meldet sich sechs Stunden lang nicht erneut. |
| **Maximale Hausgedächtnis-Datei** (`homeMemoryMaxKb`) | `256` | Die Markdown-Referenz dieses Nodes bleibt unter 256 KB. |

Beispiel für **KI-Erziehung** (`aiEducation`):

```text
Nenne mich Alex und antworte in derselben Sprache wie ich.
Antworte kurz, außer ich bitte um technische Einzelheiten.
Der Büro-Rollladen darf tagsüber offen bleiben: benachrichtige mich nicht.
Melde andere Rollläden, Fenster oder Türen, die ungewöhnlich lange offen bleiben.
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

### Capture
- **Capture GroupValue_Write**: Erfasst Write-Telegramme.
- **Capture GroupValue_Response**: Erfasst Response-Telegramme.
- **Capture GroupValue_Read**: Erfasst Read-Telegramme.

### Analysis
- **Analysis window (seconds)**: Hauptfenster für Summary/Rate-Berechnung.
- **History window (seconds)**: Aufbewahrungsfenster der internen Telegramm-Historie.
- **Captured telegrams also on disk archivieren**: Speichert Telegramme zusätzlich zu RAM in `knxultimatestorage/knxai/history/<node-id>/YYYY-MM-DD.jsonl`.
- **Aufbewahrung des Festplattenarchivs (Tage)**: Anzahl Tage, die Archivdateien auf Platte behalten werden, bevor sie automatisch gelöscht werden.
- **Max stored events**: Maximale Anzahl Telegramme im Speicher.
- **Auto emit summary (seconds, 0=off)**: Periodisches Summary-Intervall.
- **Top list size**: Anzahl Top-Gruppenadressen/Quellen in der Summary.
- **Detect simple patterns (A -> B)**: Aktiviert Übergangs-/Pattern-Erkennung.
- **Pattern max lag (ms)**: Maximaler Zeitabstand für Pattern-Korrelation.
- **Pattern min occurrences**: Mindestanzahl, bevor ein Pattern gemeldet wird.

### Anomalies
- **Rate window (seconds)**: Gleitendes Zeitfenster für Rate-Prüfungen.
- **Max overall telegrams/sec (0=off)**: Schwellwert für gesamten Bus.
- **Max telegrams/sec per GA (0=off)**: Schwellwert pro Gruppenadresse.
- **Flap window (seconds)**: Zeitfenster für Flapping-/Wechselraten-Erkennung.
- **Max changes per GA in window (0=off)**: Maximal erlaubte Änderungen im Fenster.

### KI-Assistent
- **Enable LLM assistant**: Aktiviert Ask/Chat-Funktionen.
- **Provider**: LLM-Backend (OpenAI-compatible oder Ollama).
- **Endpoint URL**: URL des Chat/Completions-Endpunkts.
- **API key**: API-Schlüssel (für lokales Ollama nicht erforderlich).
- **Model**: Modell-ID/Name.
- **Chatmodell-Kompatibilität**: Das ausgewählte Modell muss den konfigurierten Chat-Completions-Endpunkt unterstützen. Ältere reine Completions-Modelle wie `gpt-3.5-turbo-instruct` werden beim Aktualisieren der Modellliste ausgeschlossen. Lehnt der Anbieter einen benutzerdefinierten Temperaturwert oder den Token-Limit-Parameter ab, wiederholt KNX AI die Anfrage und entfernt oder ersetzt nur das inkompatible Feld.
- **System prompt**: Globale Instruktion für KNX-Analyse (Advanced).
- **KI darf KNX-Zustände lesen und Aktoren steuern**: Aktiviert Ausgang 4 und ist standardmäßig aus. Exakte ETS-Katalogobjekte dürfen gelesen werden; Schreiboperationen werden ausschließlich für Objekte mit Rolle `command` akzeptiert. Unbekannte, DPT-falsche, ungültige oder überzählige Operationen sowie Schreiboperationen auf Status-/Neutralobjekte werden lokal abgewiesen.
- **Vor dem Senden von KNX-Befehlen bestätigen lassen**: Standardmäßig aktiv. Zeigt zuerst die validierten Änderungen und sendet nichts, bis dieselbe Chat-Sitzung bestätigt. Wenn Befehle auf Bestätigung warten, fügt die Antwort immer die genauen Anweisungen zum Bestätigen oder Abbrechen in der Sprache der aktuellen Anfrage hinzu. Vor der Ausgabe werden die Befehle erneut validiert.
- **Adapter-Vorlage**: Lädt ein Paar aus Ein- und Ausgangszuordnung aus der mitgelieferten Chat-Adapter-Datei. Die Auswahl ersetzt bewusst beide Textfelder; der Code bleibt danach bearbeitbar.
- **Eingangszuordnung (Chat → KNX AI)**: Synchrones JavaScript vor der Verarbeitung des Eingangsbefehls.
- **Ausgangszuordnung (KNX AI → Chat)**: Synchrones JavaScript ausschließlich für Nachrichten an Ausgang 3.
- **Proaktive Hausbenachrichtigungen aktivieren**: Optionaler Detektor für zuverlässig erkannte offene Rollladen-/Fenster-/Türzustände; er schreibt nie selbstständig auf KNX.
- **Hauptempfänger / Chat-ID**: Optionales Ziel für unaufgeforderte Chatnachrichten; andernfalls wird die letzte Ask-Sitzung gespeichert.
- **Nach offener Dauer benachrichtigen (Minuten)**: Schwelle, bevor eine proaktive Nachricht erwogen wird.
- **Ruhezeit Beginn / Ende**: Täglicher Zeitraum, in dem proaktive Nachrichten unterdrückt werden.
- **KI-Erziehung**: Verbindliche, ausschließlich vom Benutzer verwaltete Hinweise, die die KI lesen, aber nie ändern darf.
- **Wiederholungs-Cooldown (Minuten)**: Mindestintervall vor einer weiteren Meldung desselben Objekts.
- **Maximale Hausgedächtnis-Datei (KB)**: Harte Grenze von 64 bis 1.024 KB; standardmäßig 256 KB.
- Wenn das Festplattenarchiv aktiv ist, nutzt **Ask** standardmäßig dieses Archiv: explizite Datumsangaben/Zeitbereiche werden beachtet, sonst durchsucht der Assistent die letzten 24 Stunden plus aktuelle RAM-Events.
- **Include raw payload hex**: Rohe Hex-Payload im Prompt einfügen.
- **Node-RED-Projektinventar einbeziehen**: Nimmt das gesamte Node-RED-Projektinventar in den Prompt auf, einschließlich KNX-Nodes und anderer hilfreicher Nodes wie function/change/inject/template, wenn sie KNX-Logik oder Gruppenadressen enthalten.
- **Include documentation snippets (help/README/examples)**: Doku-Kontext einfügen.
- **Docs language**: Bevorzugte Sprache der Doku-Snippets.
- Button **Refresh**: Provider abfragen und verfügbare Modelle laden.

### Advanced
- **Analysis window (seconds)**: Hauptfenster für Summary/Rate-Berechnung.
- **Max stored events**: Maximale Anzahl Telegramme im Speicher.
- **Top list size**: Anzahl Top-Gruppenadressen/Quellen in der Summary.
- **Pattern max lag (ms)**: Maximaler Zeitabstand für Pattern-Korrelation.
- **Pattern min occurrences**: Mindestanzahl, bevor ein Pattern gemeldet wird.
- **Rate window (seconds)**: Gleitendes Zeitfenster für Rate-Prüfungen.
- **Max overall telegrams/sec (0=off)**: Schwellwert für gesamten Bus.
- **Max telegrams/sec per GA (0=off)**: Schwellwert pro Gruppenadresse.
- **Flap window (seconds)**: Zeitfenster für Flapping-/Wechselraten-Erkennung.
- **Max changes per GA in window (0=off)**: Maximal erlaubte Änderungen im Fenster.

### Ollama Schnellstart (lokal)
- **Provider = Ollama** auswählen.
- Standard-Endpoint: `http://localhost:11434/api/chat`.
- Wenn keine lokalen Modelle gefunden werden:
  - **1) Download model**: öffnet die Seite **Model library**.
  - **2) Install it**: lädt und installiert das Modell lokal (z. B. `llama3.1`).
- Beim Refresh/Install versucht KNX AI zusätzlich, den Ollama-Server automatisch zu starten.
- Bei Installationsfehlern mit Verbindungsproblem prüfen, ob Ollama läuft (Desktop-App oder `ollama serve`).
- Wenn Node-RED in Docker läuft, im Endpoint `host.docker.internal` statt `localhost` verwenden.

## Sicherheitshinweis
Bei aktiviertem LLM kann KNX-Traffic-Kontext an den konfigurierten Endpoint gesendet werden. Für striktes On-Premise lokale Provider verwenden. Ein Befehl an Ausgang 4 hat die lokale Validierung bestanden und wurde an den Flow weitergegeben; dies bestätigt nicht die Ausführung durch den Aktor. Dafür eine KNX-Status-GA verwenden.
