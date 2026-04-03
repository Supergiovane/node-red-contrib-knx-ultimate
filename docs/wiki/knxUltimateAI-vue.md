---
layout: wiki
title: "knxUltimateAI-vue"
lang: en
permalink: /wiki/knxUltimateAI-vue
---
This page describes the main features of the **KNX AI Vue Web Dashboard** (`/knxUltimateAI/sidebar/page`).

It is the modern web UI for live KNX traffic analysis, AI-assisted diagnostics, and deterministic field testing.

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/knx-ai-sidebar.svg" alt="KNX AI Vue dashboard" style="width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,0.18);" />

## Main functionality

## 1) Overview

- Live summary of KNX traffic, counters, rates, repeats, and unknown DPT values.
- Fast diagnostics widgets for top activity and current bus behavior.
- Automatic refresh to keep metrics updated while monitoring.

## 2) Areas

- Browse and edit installer-friendly **areas** built from ETS group address structure.
- Refine each area manually: add/remove GA, adjust metadata, and set GA test roles.
- Optional AI-assisted area suggestions when LLM is enabled.

## 3) Tests and test planning

- Create and maintain reusable **test plans** for selected areas.
- Use AI to generate plan drafts from natural-language prompts.
- Edit steps manually (write, verify, wait, payload/DPT fine tuning).
- Run plans once or in repeat mode for soak/continuous validation.

## 4) Test results

- View live and saved reports with per-step outcomes and overall status.
- Open source test plan from a result and iterate quickly.
- Keep historical reports for installer documentation and troubleshooting.

## 5) Assistant (chat)

- Ask questions about current traffic and anomalies in natural language.
- Rendered responses support Markdown for clear explanations and action points.
- Prompt context can include KNX events, flow inventory, and docs snippets (node settings dependent).

## 6) Settings and operations

- Select the target `knxUltimateAI` node and manage runtime options.
- Configure node-level options exposed by the backend settings APIs.
- Import/export configuration bundles for backup and migration workflows.

## 7) UI behavior

- Responsive sidebar layout (desktop + mobile).
- Persistent local preferences (selected node, active tab, refresh mode, panel state).
- Served directly by Node-RED and aligned with its authentication model.

## Typical use cases

- Investigate loops/spam on specific group addresses.
- Validate area behavior with repeatable active tests.
- Accelerate commissioning and post-deploy verification with AI-guided diagnostics.
