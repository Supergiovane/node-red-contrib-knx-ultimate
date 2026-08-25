---
layout: wiki
title: "KNX AI"
lang: en
permalink: /wiki/KNX%20AI
---
This node listens to **all KNX telegrams** from the selected KNX Ultimate gateway, builds traffic statistics, detects anomalies, and can optionally query an LLM.

The editor uses two horizontal tabs: **AI assistant** contains setup, knowledge/context and provider limits; **Conversations & home** contains chat channels, proactive home and bounded memory.

## Outputs
1. **Summary/Stats** (`msg.payload` JSON)
2. **Anomalies** (`msg.payload` JSON)
3. **AI Assistant** (`msg.payload` text, with `msg.summary`)
4. **KNX operations** (one Universal Mode message per validated read or write)

Every message emitted by outputs 3 and 4 also contains a clone of the original input message in `msg.inputMessage`. This preserves the original payload, topic, chat metadata, and any other input properties for downstream nodes. Cloning and output errors are contained and reported instead of escaping into the Node-RED runtime.

## Commands (input)
Send `msg.topic`:
- `summary` (or empty): emit summary immediately
- `reset`: clear internal history, counters, learned home memory, and every persisted chat context; AI Education remains unchanged
- `ask`: send a question to the configured LLM
- `confirm` / `cancel`: confirm or cancel pending KNX commands without calling the LLM
- `clear_chat`: clear recent turns, persistent instructions, and pending commands for the current session

For `ask`, provide the question in `msg.prompt` (preferred), `msg.payload` (string), or the common Telegram fields `msg.payload.content` / `msg.payload.text`.

If processing takes longer than 1.2 seconds, output 3 emits the localized intermediate message “I’m thinking…” with `msg.knxAi.type = "thinking"` and `msg.knxAi.transient = true`. The chat adapter sends it immediately to the same user, while the final answer follows normally. This progress message is never stored in conversation context or learned memory.

Ollama and Bionic LM Studio requests automatically use a minimum timeout of 10 minutes; cloud providers retain a 2-minute minimum. There is no timeout field to maintain in the editor. If even the local limit is reached, KNX AI reports that the model did not finish and suggests retrying or reducing the prompt context.

The node's canvas status is deliberately reserved for the latest incoming request and the localized “I’m thinking…” state while the LLM is running. KNX telegrams, gateway updates, traffic rates, ready messages and technical results never overwrite it; they remain available through the node outputs, logs and Assistant data.

Every Ask/chat session keeps its last 8 turns and up to 20 explicit long-term instructions, separated by `msg.knxAi.sessionId`, `msg.sessionId`, or a detected Telegram chat ID. Requests such as “Remember not to use the term unknown” become durable instructions. All KNX AI nodes using the same storage share this live context and reload it after Node-RED restarts from `knxultimatestorage/knxai/memory/knxai-chat-context.md`. The atomically written file is bounded to 50 sessions and 512 KB. When KNX control is enabled, wire output 3 back to the chat sender and output 4 to a KNX Ultimate node configured in **Universal mode**. With confirmation enabled, the first reply previews every write GA, DPT, and payload without emitting writes; the same session must then reply `CONFIRM`/`CANCEL` (localized equivalents are accepted) within 5 minutes. A new request replaces any older pending plan. Each confirmed command has `msg.destination`, `msg.dpt`, `msg.payload`, and `msg.event = "GroupValue_Write"`.
For DPT 1.xxx writes, safe AI equivalents `true`/`false`, `1`/`0`, and `on`/`off` are normalized to a real boolean before local validation and output.

### Fresh KNX reads
When the user explicitly asks for a fresh/current state, the AI may query exact objects from the imported ETS catalog, including status and other read-only objects. Output 4 emits `msg.destination`, `msg.dpt`, `msg.event = "GroupValue_Read"`, and `msg.readstatus = true`. The node waits up to 6 seconds for each `GroupValue_Response` or fresh write, then returns the decoded values on output 3 and exposes details in `msg.knxAi.readResults`. Reads never require confirmation and never become writes.

### Conversational multi-step routines
Requests such as “I’m leaving”, “Good night”, or “Cinema mode” can coordinate a state-aware routine without a new editor option. In the first LLM pass, only exact ETS reads are accepted (up to 20); KNX AI sends them and supplies the fresh GA/DPT/value results to a second isolated planning pass. That pass may prepare up to 12 validated writes, but cannot request another read cycle. With confirmation enabled, the complete plan has one localized confirmation and no write or requested TTS announcement is emitted beforehand. After confirmation every write is revalidated, forwarded in order, and observed for up to 4 seconds for matching immediate bus feedback. The final reply distinguishes observed feedback from operations without immediate feedback—absence of feedback is not reported as device failure. Routine details are exposed in `msg.knxAi.routine`, `readResults`, `verifiedCount`, and `unverifiedCount`.

### Confirmation request for chat buttons
While a plan is pending, output 3 contains `msg.knxAi.confirmationRequest`. The object includes `required`, `status`, `sessionId`, `expiresAt`, `commandCount`, and two entries in `actions`. Use `action.label` as the Telegram button text, `action.callbackData` as its callback, and send `action.message` back to KNX AI to confirm or cancel without typed text.

### Chat adapter presets
The **Chat adapters** tab loads its selectable mappings from `resources/KNXAIChatAdapterMappings.js`. Selecting a preset installs two predefined synchronous JavaScript mappings internally: one before KNX AI processes an input and one before output 3 is emitted. The mappings remain hidden in the editor. Syntax and execution failures are caught and reported without stopping Node-RED.

The included **windkh/node-red-contrib-telegrambot** preset follows the package's receiver/sender contract. Connect a `telegram receiver` directly to KNX AI, output 3 directly to a `telegram sender`, and—when inline confirmation buttons are required—connect a `telegram event` configured for `callback_query` to the same KNX AI input. The input mapping extracts `msg.payload.content`, `msg.payload.chatId`, and the Telegram language. The output mapping creates the required `msg.payload.chatId`, `type`, and `content`, adding `options.reply_markup` from `msg.knxAi.confirmationRequest` when writes await confirmation. The Telegram package remains a separate optional dependency.

The included **RedBot / node-red-contrib-chatbot (Telegram)** preset follows RedBot's common message contract. Connect `chatbot-telegram-receive` directly to KNX AI and output 3 directly to `chatbot-telegram-send`; no separate callback node is needed because RedBot converts inline-button postbacks into normal inbound messages. The input mapping reads `transport`, `chatId`, `type`, `content`, and the Telegram language. The output mapping preserves RedBot's `originalMessage`, `chat`, `api`, and `client` tracking data, then emits either a `message` payload or an `inline-buttons` payload containing `postback` actions for confirmation. RedBot remains a separate optional dependency.

### Automatically detected camera adapters
Installed camera packages can publish a camera adapter to KNX AI at runtime. There is no selector and no camera node to wire to KNX AI: available adapters, controllers and cameras are detected automatically and included in the chat context. `node-red-contrib-unifi-ultimate` is the first supported provider; other packages, such as `hikvision-ultimate`, can register through the same vendor-neutral contract.

The user can ask for a current snapshot or ask the vision model what is visible. Telegram and RedBot presets emit the returned image as a native photo with a caption. The user can also create persistent notifications for motion, a smart line crossing or entry into an intrusion/loiter zone, optionally limited to detected people and to an exact named line or zone. These rules are stored in the same `knxai-chat-context.md` file and are restored after Node-RED restarts. UniFi event subscriptions and snapshot requests are made directly through the detected provider; KNX AI output 4 is not involved and no intermediate flow wiring is required.

### TTS Ultimate announcements
When the optional `node-red-contrib-tts-ultimate` package is installed, it appears among the automatically detected adapters. The selector lists every `ttsultimate` node in all project flows, with its flow, node name and configured player. Choose the node that must handle chat announcements and deploy the flow.

Only an explicit request in the current chat message can create an announcement. KNX AI sends the exact text directly to the selected node as `msg.payload`, with `msg.topic = "knx_ai_announcement"`; no intermediate flow wiring is required. TTS Ultimate then handles the configured Sonos player, voice, volume, hailing and queue. Persistent context, AI Education, camera content and inferred events never trigger speech by themselves.

### Chat context overview
The node editor shows a compact card summarizing the sources available to the chat: live KNX traffic, ETS semantics and the Node-RED project, session and home memory, AI Education, detected cameras and relevant documentation. It also lists `knxai-chat-context.md`, `knxai-home-memory.md` and `knxai-config-<node-id>.json`, together with the absolute KNX telegram archive root, the node-specific archive directory and the `YYYY-MM-DD.jsonl` daily-file pattern. The paths are resolved at runtime from the data directory actually used by the configured gateway.

## Education-driven proactive home intelligence and bounded memory
From ETS hierarchy, names, roles and DPTs, the node builds a deterministic semantic model for covers, windows, doors, lights, temperature, climate, occupancy and alarms using Italian, English, German, French, Spanish and Chinese terms. Its proactive detector watches only reliably recognized non-command cover/window/door states.

There is no separate switch or advanced proactive configuration. A candidate is evaluated only when the LLM is enabled and **AI Education** explicitly requests that notification. Education is the sole policy for conditions, open duration, quiet hours and repetition. The AI receives the current duration, local date/time and recent notification history; it decides whether to notify and when to reconsider the same open condition. Without an explicit Education rule, or when the LLM cannot evaluate it, no notification is sent.

The most recent chat session is remembered as the owner and receives spontaneous messages. Output 3 emits a localized message with `msg.knxAi.type = "proactive_notification"`; a synthetic `msg.inputMessage` preserves the session for the chat adapter. A hard safety limit of three proactive messages per hour prevents flooding. The node never emits output 4 or changes KNX autonomously; a subsequent user request still uses the normal validation and confirmation workflow.

The shared learned reference is loaded at startup from `<userDir>/knxai/memory/knxai-home-memory.md`, rewritten atomically every 15 minutes and always hard-capped at 5 MB. It stores at most 120 significant observations, 80 aggregate habits, 80 notifications and 300 semantic ETS objects—never a raw unlimited telegram stream. Older low-priority entries are removed first. **AI Education** is limited to 16,000 characters and always comes from the node configuration: the AI can read it as authoritative guidance but cannot modify or overwrite it.

## Practical configuration example
Put the complete notification policy in **AI Education** (`aiEducation`):

```text
Call me Alex and answer in the same language I use.
Keep replies short unless I ask for technical details.
Notify my most recent chat when a cover, window, or door remains open for at least 120 minutes.
Do not notify me between 23:00 and 07:00 and do not repeat the same alert within six hours.
The office cover may remain open during the day: do not notify me about it.
When "living-room light" is ambiguous, ask which light I mean.
Never say that an actuator changed until a KNX status object confirms it.
```

With this Education:

1. If the living-room cover status remains open for 120 minutes outside the stated quiet hours, output 3 can emit a localized `proactive_notification` to the most recent chat session.
2. If the office cover remains open, the LLM reads Education and suppresses that candidate notification.
3. If Alex later asks to close the living-room cover, KNX AI prepares the exact ETS command and still follows normal validation and confirmation before output 4.

Use descriptive ETS hierarchy/object names and correct status/command roles. Education can personalize decisions and wording, but it cannot authorize an invented group address, change a DPT, or bypass KNX validation.

## Quick workflow: KNX control
1. Import the ETS CSV into the gateway and configure the LLM provider, model, and credentials.
2. Enable **LLM assistant** and **KNX state reads and actuator control**; leave confirmation enabled.
3. Connect the chat input to KNX AI while preserving a stable session/chat ID.
4. Connect output 3 to the chat reply and output 4 to KNX Ultimate in **Universal mode**.
5. The user sends a request; fresh state requests are read immediately, while writes first show the proposed GA, DPT, and value without writing to the bus.
6. Within 5 minutes, the same chat replies exactly `CONFIRM` or `CANCEL`.
7. Only `CONFIRM` revalidates and emits commands on output 4; verify execution through a KNX status GA.

## Configuration fields
All fields exposed in the KNX AI editor are listed below.

### General
- **Gateway**: KNX Ultimate gateway/config node used as telegram source.
- **Name**: Node label and dashboard header name.
- **Topic**: Base topic used in node outputs.
- **Open KNX AI Web** button: Opens the full KNX AI web dashboard (`/knxUltimateAI/sidebar/page`).

### AI Assistant
- **Enable LLM assistant**: Enable Ask/chat assistant features.
- **Provider**: Select the LLM backend (OpenAI-compatible, Anthropic, Ollama or Bionic LM Studio).
- **Endpoint URL**: Chat/completions endpoint URL.
- **API key**: API key (not required for local Ollama; optional for Bionic LM Studio unless server authentication is enabled).
- **Model**: Model ID/name.
- **Chat model compatibility**: The selected model must support the configured Chat Completions endpoint. Legacy completion-only models such as `gpt-3.5-turbo-instruct` are excluded when the model list is refreshed. If the provider rejects a custom temperature or token-limit parameter, KNX AI retries after removing or replacing only that incompatible field.
- **Allow AI to read KNX states and control actuators**: Enables output 4 and is off by default. Exact ETS catalog objects may be read; writes are accepted only for objects classified as `command`. Unknown, DPT-mismatched, invalid, or excessive operations and writes to status/neutral objects are rejected locally.
- **Ask for confirmation before sending KNX commands**: Enabled by default. Shows the validated changes first and emits no KNX command until the same chat session confirms them. Whenever commands are awaiting confirmation, the response always appends the exact confirmation/cancellation instructions in the language of the current request. Commands are validated again immediately before output.
- **Adapter preset**: Defaults to **No adapter**. Selecting a preset loads its predefined input/output mapping pair; both mappings remain hidden in the editor.
- **AI Education**: User-only, authoritative guidance read by the AI and never modified by it. It is also the sole place to request proactive notifications and define their conditions, duration, quiet hours and repetition.
- Relevant help, README, and example snippets are always included automatically; their language is selected from the user request, with automatic fallbacks across all supported languages.
- **Refresh** button: Queries the provider and loads available model IDs. Its icon spins while loading; successful completion is intentionally silent.

### Ollama quick setup (local)
- Choose **Provider = Ollama**.
- Default endpoint: `http://localhost:11434/api/chat`.
- If no local models are found, use:
  - **1) Download model**: opens the **Model library** page.
  - **2) Install it**: downloads and installs the model locally (for example `llama3.1`).
- During model refresh/install, KNX AI also tries to auto-start the Ollama server when possible.
- If install fails with connection errors, ensure Ollama is running (desktop app or `ollama serve`).
- If Node-RED runs in Docker, use `host.docker.internal` instead of `localhost` in the endpoint URL.

### Bionic LM Studio quick setup (local)
- Choose **Provider = Bionic LM Studio**.
- Start the LM Studio API server from the **Developer** page or with `lms server start`.
- Default endpoint: `http://localhost:1234/v1/chat/completions`.
- Click **Refresh** to load all models exposed by `/v1/models`; the first model is selected when none is configured.
- An API key is optional unless authentication is enabled in the LM Studio server settings. In Docker, replace `localhost` with `host.docker.internal`.

## Security note
If LLM is enabled, KNX traffic context can be sent to the configured endpoint. Use local providers if you need strict on-prem data handling. A command emitted on output 4 passed local validation and was forwarded to the flow; it is not proof that the actuator executed it. Use a KNX status GA when confirmation is required.
