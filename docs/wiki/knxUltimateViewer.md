---
layout: wiki
title: "knxUltimateViewer"
lang: en
permalink: /wiki/knxUltimateViewer
translation_key: "knxUltimateViewer"
---
# KNX Viewer

KNX Viewer shows group address (GA) state changes in a simple table, similar to a minimal ETS monitor.

## Configuration

Select the **KNX gateway** and give the node a **name**. Deploy the flow, then reopen the node and click **Open KNX Viewer Monitor**. The page opens in a new tab and uses the same authentication and read permissions as the Node-RED editor.

## Web monitor

Each row shows the time, telegram type (Read, Write, Response, etc.), source address, GA, name, DPT, previous value and new value. The latest entries appear first. For Write and Response telegrams, the first value observed for a GA and subsequent changes are recorded; unchanged values do not add rows.

Read requests are also recorded in the 24-hour history, without previous or new values. They do not change the last known value of the GA.

Select a Viewer, search the list or use the pages to browse older changes. **Pause** freezes the display so you can inspect it; **Live** resumes updates. Recording continues while paused and when the browser page is closed.

## 24-hour history

The active Viewer node saves its history automatically in files under `userDir/knxultimatestorage/viewer`, separately for each Viewer and gateway. Changes older than 24 hours are removed automatically. After a Node-RED restart, the Viewer restores the history still within that window.

Recording starts when the updated Viewer is deployed and running. It does not reconstruct earlier bus traffic.

## Flow outputs

The node keeps its three existing outputs:

1. **Current group address values** — `msg.payload` contains an HTML table for a dashboard Template node.
2. **Group address array** — `msg.payload` contains the GA data as an array for processing or recording in your flow.
3. **Telegram queue** — `msg.payload` contains an HTML table of the gateway transmission queue.

The web monitor can be used without connecting these outputs.
