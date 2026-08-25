---
layout: wiki
title: "KNX AI"
lang: zh-CN
permalink: /wiki/zh-CN-KNX%20AI
---
此节点会监听所选 KNX Ultimate 网关上的**所有 KNX 电报**，生成流量统计、检测异常，并可选调用 LLM。

编辑器使用两个水平标签页：**AI 助手**包含配置、知识/上下文以及提供商限制；**对话与家庭**包含聊天渠道、主动家庭和受限记忆。

## 输出
1. **摘要/统计**（`msg.payload` 为 JSON）
2. **异常**（`msg.payload` 为 JSON）
3. **AI 助手**（`msg.payload` 为文本，包含 `msg.summary`）
4. **KNX 操作**（每个通过验证的读取或写入输出一条 Universal Mode 消息）

输出 3 和输出 4 发出的每条消息还会在 `msg.inputMessage` 中包含原始输入消息的副本。因此，原始 payload、topic、聊天元数据及其他输入属性都可供后续节点使用。克隆或输出错误会被捕获并报告，不会传播到 Node-RED 运行时。

## 命令（输入）
发送 `msg.topic`：
- `summary`（或空）：立即输出摘要
- `reset`：清空内部历史、计数器、已学习的家庭记忆和所有持久聊天上下文；AI 教育保持不变
- `ask`：向已配置的 LLM 提问
- `confirm` / `cancel`：无需再次调用 LLM，即可确认或取消待处理的 KNX 命令
- `clear_chat`：清除当前会话的最近对话、持久指令和待处理命令

`ask` 的问题建议放在 `msg.prompt`，也可放在 `msg.payload`（字符串）或常见 Telegram 字段 `msg.payload.content` / `msg.payload.text`。

如果处理时间超过 1.2 秒，输出 3 会立即发送本地化的中间消息“我正在思考…”，并设置 `msg.knxAi.type = "thinking"` 和 `msg.knxAi.transient = true`。聊天适配器会将其发送给同一用户，最终答案准备好后仍会正常送达。此进度消息绝不会写入对话上下文或学习记忆。

Ollama 和 Bionic LM Studio 请求会自动使用至少 10 分钟的超时时间；云端提供商仍使用至少 2 分钟。编辑器中无需维护超时字段。即使达到本地模型限制，KNX AI 也会说明模型未完成响应，并建议重试或缩减提示上下文。

Canvas 上的节点状态专门用于显示最近收到的请求，以及 LLM 运行期间本地化的“我正在思考…”状态。KNX 报文、网关更新、流量速率、ready 消息和技术结果绝不会覆盖该状态；这些信息仍可通过节点输出、日志和助手数据查看。

每个 Ask/聊天会话都会保留最近 8 轮对话和最多 20 条明确的长期指令，并按 `msg.knxAi.sessionId`、`msg.sessionId` 或检测到的 Telegram 聊天 ID 隔离。像“请记住不要在回答中使用 unknown 这个词”这样的请求会成为持久指令。使用相同存储的所有 KNX AI 节点实时共享此上下文，并在 Node-RED 重启后从 `knxultimatestorage/knxai/memory/knxai-chat-context.md` 重新加载。该文件采用原子写入，最多保存 50 个会话且不超过 512 KB。启用 KNX 控制后，将输出 3 连接到聊天发送节点，将输出 4 连接到配置为**通用模式**的 KNX Ultimate 节点。启用确认后，第一条回复会显示 GA、DPT 和 payload，但不会发送写入；同一会话必须在 5 分钟内回复“确认”或“取消”。新请求会替换旧的待处理计划。每条已确认命令都包含 `msg.destination`、`msg.dpt`、`msg.payload` 和 `msg.event = "GroupValue_Write"`。
对于 DPT 1.xxx 写入，AI 生成的安全等价值 `true`/`false`、`1`/`0` 和 `on`/`off` 会在本地校验和输出前统一转换为真正的布尔值。

### 最新 KNX 读取
当用户明确要求当前或最新状态时，AI 可以查询已导入 ETS 目录中的精确对象，包括状态对象和其他只读对象。输出 4 会发送 `msg.destination`、`msg.dpt`、`msg.event = "GroupValue_Read"` 和 `msg.readstatus = true`。节点会为每个 `GroupValue_Response` 或最新写入等待最多 6 秒，然后在输出 3 返回解码值，并在 `msg.knxAi.readResults` 中提供详细信息。读取从不需要确认，也绝不会转换为写入。

### 多步骤对话例行程序
“我要离家”“晚安”或“影院模式”等请求可以在不增加编辑器选项的情况下，根据当前状态协调例行程序。第一次 LLM 处理仅接受精确的 ETS 读取（最多 20 个）；KNX AI 发送读取，并把最新的 GA/DPT/值结果交给隔离的第二次规划处理。第二次处理最多可准备 12 个已验证写入，但不能再次发起读取循环。启用确认时，整个计划只需一次本地化确认；确认前不会发送任何写入或所请求的 TTS 播报。确认后，每个写入都会重新验证、按顺序转发，并在最多 4 秒内观察总线上匹配的即时反馈。最终回复会区分已观察到反馈的操作与没有即时反馈的操作，但不会把后者报告为设备故障。详细信息位于 `msg.knxAi.routine`、`readResults`、`verifiedCount` 和 `unverifiedCount`。

### 用于聊天按钮的确认请求
计划等待确认时，输出 3 包含 `msg.knxAi.confirmationRequest`。该对象包括 `required`、`status`、`sessionId`、`expiresAt`、`commandCount`，以及 `actions` 中的两个项目。使用 `action.label` 作为 Telegram 按钮文本，使用 `action.callbackData` 作为回调，并将 `action.message` 发送回 KNX AI，即可在无需输入文本的情况下确认或取消。

### 聊天适配器预设
**聊天适配器**选项卡从 `resources/KNXAIChatAdapterMappings.js` 加载可选映射。选择预设会在内部安装两段预定义的同步 JavaScript 映射：一段在 KNX AI 处理输入前运行，另一段在输出 3 发出消息前运行。这些映射在编辑器中始终保持隐藏。语法和执行错误会被捕获并报告，不会停止 Node-RED。

随附的 **windkh/node-red-contrib-telegrambot** 预设遵循该包的 receiver/sender 消息约定。把 `telegram receiver` 直接连接到 KNX AI，并把输出 3 直接连接到 `telegram sender`。如需内联确认按钮，还要把配置为 `callback_query` 的 `telegram event` 连接到同一个 KNX AI 输入。输入映射会提取 `msg.payload.content`、`msg.payload.chatId` 和 Telegram 语言；输出映射会创建所需的 `msg.payload.chatId`、`type` 和 `content`，并在写入等待确认时从 `msg.knxAi.confirmationRequest` 添加 `options.reply_markup`。Telegram 包仍是独立的可选依赖项。

随附的 **RedBot / node-red-contrib-chatbot (Telegram)** 预设遵循 RedBot 的通用消息格式。将 `chatbot-telegram-receive` 直接连接到 KNX AI，并将输出 3 直接连接到 `chatbot-telegram-send`；无需单独的 callback 节点，因为 RedBot 会把内联按钮的 postback 转换成普通入站消息。输入映射读取 `transport`、`chatId`、`type`、`content` 和 Telegram 语言。输出映射保留 RedBot 的 `originalMessage`、`chat`、`api` 和 `client` 跟踪数据，然后发送 `message` payload，或发送带有确认 `postback` 操作的 `inline-buttons` payload。RedBot 仍是独立的可选依赖项。

### 自动检测的摄像机适配器
已安装的摄像机软件包可以在运行时向 KNX AI 发布适配器。无需选择器，也无需将摄像机节点连接到 KNX AI：可用的适配器、控制器和摄像机会被自动检测并加入聊天上下文。`node-red-contrib-unifi-ultimate` 是首个受支持的提供方；`hikvision-ultimate` 等其他软件包可通过同一套厂商无关协议注册。

用户可以请求当前快照，或询问视觉模型画面中可见的内容。Telegram 和 RedBot 预设会把图像作为带说明文字的原生照片发送。用户还可以为移动、智能越线或进入入侵/徘徊区域创建持久通知，并可按检测到的人员以及指定名称的线或区域进行限制。这些规则保存在同一个 `knxai-chat-context.md` 文件中，并在 Node-RED 重启后恢复。UniFi 事件订阅和快照请求直接通过检测到的提供方完成；不会使用 KNX AI 输出 4，也不需要中间 Flow 连线。

自动检测到的适配器发布的每个事件都会被标准化，并追加到 `knxultimatestorage/knxai/adapter-history/<节点ID>/` 下的每日 `YYYY-MM-DD.jsonl` 文件。存档保留 10 天，保证超过 24 小时的历史，只保存事件元数据，不保存图像。Web 助手和所有 CHAT 渠道会同时查询它与每日 KNX 报文存档。总数涵盖所请求区间内的全部存档行；选出的详情仅是相关样本。

### 使用 TTS Ultimate 播报
安装可选软件包 `node-red-contrib-tts-ultimate` 后，它会显示在自动检测的适配器中。选择器会列出项目所有 Flow 中的全部 `ttsultimate` 节点，并显示 Flow、节点名称和已配置的播放器。请选择负责聊天播报的节点，然后部署 Flow。

只有当前聊天消息中的明确请求才能创建播报。KNX AI 会将准确文本作为 `msg.payload` 直接发送到所选节点，并设置 `msg.topic = "knx_ai_announcement"`；无需在 Flow 中增加中间连线。之后由 TTS Ultimate 处理已配置的 Sonos 播放器、语音、音量、提示音和队列。持久上下文、AI 教育、摄像机内容和推断事件绝不会自行触发语音。

### 聊天上下文概览
节点编辑器会显示一张紧凑卡片，汇总聊天可用的来源：当前 KNX 流量、ETS 语义与 Node-RED 项目、会话和家庭记忆、AI 教育、检测到的摄像机及相关文档。卡片还会列出 `knxai-chat-context.md`、`knxai-home-memory.md` 和 `knxai-config-<节点-id>.json`，以及 KNX 报文归档的绝对根目录、该节点专用目录和每日文件模式 `YYYY-MM-DD.jsonl`。这些路径会在运行时根据已配置网关实际使用的数据目录解析。

## 由 AI 教育驱动的主动家庭智能与有限记忆
节点会根据 ETS 层级、名称、角色和 DPT 建立确定性的语义模型。不再提供单独的开关或高级主动通知设置。只有启用 LLM 且 **AI 教育**明确要求时，系统才会评估通知。条件、持续时间、静默时段和重复频率完全由 AI 教育定义。没有明确规则或 LLM 无法评估时，不会发送任何消息。

最近一次聊天会话会被记为主人并接收主动消息。输出 3 会设置 `msg.knxAi.type = "proactive_notification"`，`msg.inputMessage` 为聊天适配器保留该会话。每小时最多三条主动通知可防止消息泛滥。节点绝不会主动使用输出 4，也不会自行修改 KNX。

共享的学习参考文件会在启动时从 `<userDir>/knxai/memory/knxai-home-memory.md` 加载，每 15 分钟以原子方式重写，并始终严格限制为 5 MB。最多保留 120 条重要观察、80 条聚合习惯、80 条通知和 300 个 ETS 语义对象，绝不会保存无限的原始报文流。较旧且优先级较低的项目会先被删除。**AI 教育**最多 16,000 个字符，并且始终来自节点配置：AI 可以将其作为权威指导读取，但不能修改或覆盖。如果已填写 AI 教育但 LLM 无法进行评估，候选通知会被抑制，以免违反用户指导。

## 实用配置示例
请将完整的通知策略写入 **AI 教育** (`aiEducation`)：

```text
称呼我为 Alex，并使用与我相同的语言回答。
除非我要求技术细节，否则回答要简短。
卷帘、窗户或门保持打开至少 120 分钟时，通知我最近的聊天。
23:00 到 07:00 之间不要通知，同一提醒在六小时内不要重复。
书房卷帘白天可以保持开启：不要因此通知我。
如果“客厅灯”指向多个灯，请先询问我具体是哪一个。
在 KNX 状态对象确认之前，绝不要声称执行器已经改变。
```

使用这些设置后，客厅卷帘开启 120 分钟时，输出 3 可以发送本地化的 `proactive_notification`；而书房卷帘的候选通知会根据 AI 教育被抑制。如果 Alex 随后要求关闭客厅卷帘，KNX AI 会准备准确的 ETS 命令，但在输出 4 前仍执行正常的验证与确认。

请使用清晰的 ETS 层级和对象名称，并正确设置状态/命令角色。AI 教育可以个性化决策和措辞，但不能虚构组地址、更改 DPT 或绕过 KNX 验证。

## 快速工作流程：KNX 控制
1. 将 ETS CSV 导入网关，并配置 LLM 提供商、模型和凭据。
2. 启用 **LLM 助手**和 **读取 KNX 状态并控制执行器**；保持确认选项启用。
3. 将聊天输入连接到 KNX AI，并保留稳定的会话/聊天 ID。
4. 将输出 3 连接到聊天回复，将输出 4 连接到处于**通用模式**的 KNX Ultimate。
5. 用户发送请求；当前状态会立即读取，而写入会先显示 GA、DPT 和值，不会立即写入总线。
6. 同一聊天必须在 5 分钟内准确回复“确认”或“取消”。
7. 只有“确认”会重新验证并在输出 4 发送命令；请通过 KNX 状态 GA 验证执行结果。

## 配置字段
以下是编辑器里用户可见的全部字段名称。

### 通用
- **Gateway**：作为电报来源的 KNX Ultimate 网关/配置节点。
- **Name**：节点名称与仪表板标题。
- **Topic**：节点输出使用的基础 topic。
- **Open KNX AI Web** 按钮：打开网页仪表板（`/knxUltimateAI/sidebar/page`）。

### AI 助手
- **Enable LLM assistant**：启用 Ask/chat 功能。
- **Provider**：LLM 后端（OpenAI-compatible、Anthropic、Ollama 或 Bionic LM Studio）。
- **Endpoint URL**：chat/completions 接口 URL。
- **API key**：API Key（本地 Ollama 可不填；Bionic LM Studio 在未启用服务器身份验证时也可不填）。
- **Model**：模型 ID/名称。
- **聊天模型兼容性**：所选模型必须支持已配置的 Chat Completions 端点。刷新模型列表时，会排除仅支持旧版 completions 的模型，例如 `gpt-3.5-turbo-instruct`。如果提供商拒绝自定义 temperature 值或令牌限制参数，KNX AI 会仅移除或替换不兼容字段后重试。
- **允许 AI 读取 KNX 状态并控制执行器**：启用输出 4，默认关闭。可以读取 ETS 目录中的精确对象；仅接受写入明确标记为 `command` 的对象。未知、DPT 不匹配、无效或数量过多的操作，以及向状态或中性对象的写入，都会在本地被拒绝。
- **发送 KNX 命令前请求确认**：默认启用。先显示已验证的修改，在同一聊天会话确认前不会发送任何 KNX 命令。有命令等待确认时，回复始终会使用当前请求的语言附加准确的确认或取消说明。命令会在输出前再次验证。
- **适配器预设**：默认为**无适配器**。选择后会加载预定义的输入和输出映射；两者在编辑器中始终保持隐藏。
- **AI 教育**：仅由用户管理的权威指导，AI 可以读取但永远不能修改。主动通知及其条件、持续时间、静默时段和重复频率只能在这里定义。
- 相关的帮助、README 和示例片段始终会自动包含；系统会从用户请求中自动识别语言，并在所有受支持语言之间自动回退。
- **Refresh** 按钮：请求 provider 并加载可用模型 ID。加载期间图标会旋转；成功完成时不会显示额外消息。

### Ollama 快速配置（本地）
- 选择 **Provider = Ollama**。
- 默认 endpoint：`http://localhost:11434/api/chat`。
- 若未发现本地模型：
  - **1) Download model**：打开 **Model library** 页面。
  - **2) Install it**：在本机下载并安装模型（例如 `llama3.1`）。
- 在刷新/安装模型时，KNX AI 也会在可能情况下尝试自动启动 Ollama 服务。
- 若安装因连接错误失败，请确认 Ollama 已运行（桌面应用或 `ollama serve`）。
- 若 Node-RED 运行在 Docker 中，endpoint 请使用 `host.docker.internal` 替代 `localhost`。

### Bionic LM Studio 快速配置（本地）
- 选择 **Provider = Bionic LM Studio**。
- 在 LM Studio 的 **Developer** 页面启动 API 服务，或运行 `lms server start`。
- 默认 endpoint：`http://localhost:1234/v1/chat/completions`。
- 点击 **Refresh** 加载 `/v1/models` 提供的全部模型；未配置模型时会自动选择第一个。
- 除非在 LM Studio 服务设置中启用了身份验证，否则 API Key 可留空。在 Docker 中请将 `localhost` 替换为 `host.docker.internal`。

## 安全说明
启用 LLM 后，KNX 流量上下文可能发送到所配置的 endpoint。若需严格本地化，请使用本地 provider。输出 4 上的命令仅表示已通过本地验证并转发到 flow，并不能证明执行器已执行；需要确认时请使用 KNX 状态 GA。
