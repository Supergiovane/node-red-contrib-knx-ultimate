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
- Inspect detected anomalies.
- Ask questions in the chat (answers are rendered in Markdown).

## Requirements

- At least one `knxUltimateAI` node in your flows.
- The selected `knxUltimateAI` node must be connected to a `knxUltimate-config` gateway.
- To use chat LLM answers: enable LLM in the `knxUltimateAI` node and configure its credentials (API key) there.

## Enabled by

This tab is provided by the Node-RED plugin:

- `package.json` → `node-red.plugins.knxUltimateAISidebar`
- File: `nodes/plugins/knxUltimateAI-sidebar-plugin.html`

