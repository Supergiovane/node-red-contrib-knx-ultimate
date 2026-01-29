---
layout: wiki
title: "KNX AI"
lang: en
permalink: /wiki/KNX%20AI
---
This node listens to **all KNX telegrams** from the selected KNX Ultimate gateway and builds statistics, detects simple anomalies, and (optionally) can ask an LLM to produce a human-friendly analysis.

## What it does
- Keeps a rolling history of KNX telegrams (decoded by KNX Ultimate).
- Outputs periodic or on-demand **traffic summaries** (top group addresses, event types, rate).
- Emits **anomaly events** (bus rate too high, group address spam, flapping).
- Optionally calls an LLM (OpenAI-compatible or Ollama) when you send an `ask` command.

## Outputs
1. **Summary/Stats** (`msg.payload` is JSON)
2. **Anomalies** (`msg.payload` is JSON describing the anomaly)
3. **AI Assistant** (`msg.payload` is the assistant answer as text; includes `msg.summary`)

## Commands (input pin)
Send a message with `msg.topic`:
- `summary` (or empty topic): emits a summary immediately
- `reset`: clears internal history and counters
- `ask`: asks the LLM using recent traffic + summary

For `ask`, provide the question in `msg.prompt` (preferred) or in `msg.payload` (string).

## Notes
- If you enable the LLM, bus information will be sent to the configured endpoint. Use a local provider (e.g. Ollama) if you want to keep data on-premise.
- For OpenAI, paste **only** the API key (it starts with `sk-`). Do **not** paste `Bearer ...` or the whole `Authorization:` header.
