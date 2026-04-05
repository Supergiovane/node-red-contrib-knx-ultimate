---
layout: wiki
title: "KNX-AI-Sidebar"
lang: en
permalink: /wiki/KNX-AI-Sidebar
---
The **KNX AI Dashboard** helps you monitor your KNX system in a simple way.
You can see what is happening, find anomalies, run tests, and ask questions in plain language.
This page keeps the historical name `KNX-AI-Sidebar` for compatibility.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI sidebar" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## What you can do

- Check the system status at a glance.
- See which group addresses are most active.
- Create and manage areas with AI support.
- Run guided tests and read clear results.
- Ask the assistant "what is wrong?" and get quick suggestions.

## Open it quickly

1. Open it from the KNX AI node editor with **Open Web Page**.
2. Select your KNX AI node from the list.
3. Press **Refresh** if needed.

## Main sections (simple guide)

- **Overview**: live summary and activity.
- **Areas**: rooms/zones and related group addresses.
- **Tests**: prepare and run checks.
- **Test Results**: pass/warn/fail history.
- **Ask**: type a question in natural language.
- **Settings**: node selection and import/export.

## First guided workflow

1. Start in **Overview** and check if the system looks stable.
2. Open **Areas** and verify rooms/zones are meaningful.
3. If needed, use **Regenerate AI Areas** to rebuild suggestions.
4. Open **Tests**, run one test, then check **Test Results**.
5. In **Ask**, describe the issue in one sentence and follow the suggested checks.

## Buttons you will use most

- **Refresh**: update data immediately.
- **Regenerate AI Areas**: rebuild AI area suggestions from ETS addresses.
- **Delete AI Areas**: remove all AI-generated areas at once.
- **New Area**: create one area manually.

## While AI is working

When areas are being generated or deleted, a centered waiting screen appears.
This is normal: the page blocks clicks until the operation ends, to prevent accidental changes.

## Requirements

- At least one configured KNX AI node.
- A gateway connected and running.
- For chat answers: LLM enabled and API key configured in the KNX AI node.
