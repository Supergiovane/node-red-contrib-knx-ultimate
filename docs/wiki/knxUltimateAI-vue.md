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

## 5) Cerebrum (BETA)

- Ask questions about current traffic and anomalies in natural language.
- Rendered responses support Markdown for clear explanations and action points.
- Prompt context can include KNX events, project inventory, and docs snippets (node settings dependent).

## 6) Flow Builder (BETA)

- Describe an automation in plain language and generate an importable Node-RED flow (JSON).
- Uses KNX Ultimate nodes, the Philips Hue nodes and native Function/logic nodes, wired to your imported group addresses.
- Generated node ids, wiring and config-node references (KNX server, Hue bridge) are validated and rewired server-side before output.
- Copy the JSON and paste it in Node-RED via **Menu > Import**. Review the result before deploying (it is BETA).
- Works with any configured LLM provider: OpenAI-compatible, Anthropic (Claude), Ollama, or Bionic LM Studio.

The Cerebrum page groups **Conversation**, **AI Chat Learning** and **Cerebrum Memory** in dedicated submenus.

## 7) Settings and operations

- Select the target `knxUltimateAI` node and manage runtime options.
- Configure node-level options exposed by the backend settings APIs.
- Settings contains only **Import / Export**. Its strict version-1 backup includes the persisted KNX AI configuration plus AI Chat Learning, home memory, schedules and their readable mirror; older exports are rejected.
- The Web UI is bound to the deployed KNX AI node that opened it. It has no separate node selector and does not fall back to another instance.
- Open **Cerebrum → AI Chat Learning** to switch between the editable authoritative **Native file** and a localized read-only **Simplified text** view of conversations, learned instructions and camera watches. Copy follows the selected view; download and restore always preserve the complete shared `knxai-chat-context.knxctx`. Saving updates every KNX AI node on the same storage immediately. Previous Markdown/JSON V2 and Base64 V1 files are not read, imported or migrated.
- The **Open AI Chat Learning** shortcut under **Cerebrum (BETA)** in the Node-RED node configuration opens this Cerebrum submenu directly for the current node.
- Open **Cerebrum → Cerebrum Memory** to inspect and edit the authoritative JSON plus readable Markdown in `knxai-home-memory.md`: learned/pending/confirmed habits, occupant decisions, current-state cache and reconciler diagnostics. Save validates the file; copy, backup, restore and explicit reset are available with concurrent-revision protection.
- The **Open Cerebrum memory** shortcut under **Cerebrum (BETA)** opens this Cerebrum submenu directly.

## 8) UI behavior

- Responsive sidebar layout (desktop + mobile).
- Persistent local preferences (active Cerebrum submenu and panel state). The node identity always comes from the KNX AI node that opened the page.
- Served directly by Node-RED and aligned with its authentication model.

## Typical use cases

- Investigate loops/spam on specific group addresses.
- Validate area behavior with repeatable active tests.
- Accelerate commissioning and post-deploy verification with AI-guided diagnostics.
- Scaffold automations quickly by generating a Node-RED flow from a plain-language description (Flow Builder).
