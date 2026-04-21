---
layout: wiki
title: "KNX AI"
lang: de
permalink: /wiki/de-KNX%20AI
---
Dieser Node überwacht **alle KNX-Telegramme** des ausgewählten KNX-Ultimate-Gateways, erstellt Verkehrsstatistiken, erkennt Anomalien und kann optional ein LLM befragen.

## Ausgänge
1. **Zusammenfassung/Statistik** (`msg.payload` JSON)
2. **Anomalien** (`msg.payload` JSON)
3. **KI-Assistent** (`msg.payload` Text, mit `msg.summary`)

## Befehle (Eingang)
Sende `msg.topic`:
- `summary` (oder leer): Summary sofort senden
- `reset`: internen Verlauf/Zähler zurücksetzen
- `ask`: Frage an das konfigurierte LLM senden

Für `ask` die Frage in `msg.prompt` (empfohlen) oder `msg.payload` (String) übergeben.

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

### LLM Assistant
- Der Tab **LLM Assistant** steht im Editor jetzt an erster Stelle für eine schnellere Einrichtung.
- **Enable LLM assistant**: Aktiviert Ask/Chat-Funktionen.
- **Provider**: LLM-Backend (OpenAI-compatible oder Ollama).
- **Endpoint URL**: URL des Chat/Completions-Endpunkts.
- **API key**: API-Schlüssel (für lokales Ollama nicht erforderlich).
- **Model**: Modell-ID/Name.
- **System prompt**: Globale Instruktion für KNX-Analyse.
- **Temperature**: Sampling-Temperatur.
- **Max tokens**: Maximalzahl Completion-Tokens.
- **Timeout (ms)**: HTTP-Timeout für LLM-Anfragen.
- **Recent events included**: Max. Anzahl aktueller Events im Prompt.
- **Include raw payload hex**: Rohe Hex-Payload im Prompt einfügen.
- **Include Node-RED KNX node inventory**: Flow-Inventar im Prompt einfügen.
- **Max flow nodes included**: Limit der inkludierten Flow-Nodes.
- **Include documentation snippets (help/README/examples)**: Doku-Kontext einfügen.
- **Docs language**: Bevorzugte Sprache der Doku-Snippets.
- **Max docs snippets**: Max. Anzahl Doku-Snippets.
- **Max docs chars**: Max. Gesamtzeichen aus Doku.
- Button **Refresh**: Provider abfragen und verfügbare Modelle laden.

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
Bei aktiviertem LLM kann KNX-Traffic-Kontext an den konfigurierten Endpoint gesendet werden. Für striktes On-Premise lokale Provider verwenden.
