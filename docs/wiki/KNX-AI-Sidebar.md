---
layout: wiki
title: "KNX-AI-Sidebar"
lang: en
permalink: /wiki/KNX-AI-Sidebar
---
The **KNX AI** sidebar tab provides a live view of your **KNX AI nodes**: summary, anomalies, and a chat to ask questions about KNX traffic.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## What it is for

- Quickly browse the summary produced by a selected `knxUltimateAI` node.
- Inspect detected anomalies and spot suspicious behaviour (spam, flapping, bursts).
- Ask questions in the chat (answers are rendered in Markdown) to speed up troubleshooting.

## How to use it

1. Select the `knxUltimateAI` node from the dropdown.
2. Click **Refresh Summary** (or enable **Auto**) to update the snapshot.
3. Use the chat to ask “why” and “what to check next”.

## Make the AI smarter (extra context)

In the selected `knxUltimateAI` node you can include additional context in the LLM prompt:

- **Flow inventory:** lets the AI “see” which KNX Ultimate nodes (and gateways) are present in your flows, so it can relate telegrams to your logic.
- **Documentation snippets:** adds relevant excerpts from built-in help/README/examples (and `docs/wiki` when available) so the AI can explain node behaviour and suggest the right configuration.

## Example usage (human scenarios)

- **Loop / duplicated telegrams:** ask what could generate repeated writes on the same GA and how to isolate the source.
- **Noisy GA:** ask why a GA is the top talker and which devices/nodes are involved.
- **Unexpected behaviour after deploy:** ask what changed in the last minutes and which patterns appeared.
- **Routing bridge issues:** ask how to filter/rewrite routed telegrams to avoid storms or feedback loops.

## Example questions to paste in chat

- “Why is `2/4/2` so active? What are the most likely causes?”
- “Do you see any loop pattern between two group addresses?”
- “Which physical sources are writing to `x/y/z` and how often?”
- “What should I filter in Router Filter to stop the spam but keep normal traffic?”

## Requirements

- At least one `knxUltimateAI` node in your flows.
- The selected `knxUltimateAI` node must be connected to a `knxUltimate-config` gateway.
- To use chat LLM answers: enable LLM in the `knxUltimateAI` node and configure its credentials (API key) there.
