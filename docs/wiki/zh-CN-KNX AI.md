---
layout: wiki
title: "KNX AI"
lang: zh-CN
permalink: /wiki/zh-CN-KNX%20AI
---
此节点会监听所选 KNX Ultimate 网关上的**所有 KNX 电报**，生成流量统计、检测异常，并可选调用 LLM。

编辑器各部分使用与 Matter 节点相同的左侧垂直选项卡。**快速配置**仅包含常用 AI 选项（启用、提供商、凭据、模型、KNX 状态读取/执行器控制和确认）；技术参数按主题归入其他选项卡。

## 输出
1. **摘要/统计**（`msg.payload` 为 JSON）
2. **异常**（`msg.payload` 为 JSON）
3. **AI 助手**（`msg.payload` 为文本，包含 `msg.summary`）
4. **KNX 操作**（每个通过验证的读取或写入输出一条 Universal Mode 消息）

输出 3 和输出 4 发出的每条消息还会在 `msg.inputMessage` 中包含原始输入消息的副本。因此，原始 payload、topic、聊天元数据及其他输入属性都可供后续节点使用。克隆或输出错误会被捕获并报告，不会传播到 Node-RED 运行时。

## 命令（输入）
发送 `msg.topic`：
- `summary`（或空）：立即输出摘要
- `reset`：清空内部历史与计数器
- `ask`：向已配置的 LLM 提问
- `confirm` / `cancel`：无需再次调用 LLM，即可确认或取消待处理的 KNX 命令
- `clear_chat`：清除当前会话的对话记忆

`ask` 的问题建议放在 `msg.prompt`，也可放在 `msg.payload`（字符串）或常见 Telegram 字段 `msg.payload.content` / `msg.payload.text`。

启用 KNX 控制后，最近的对话会按 `msg.knxAi.sessionId`、`msg.sessionId` 或检测到的 Telegram 聊天 ID 保存在 RAM 中。将输出 3 连接到聊天发送节点，将输出 4 连接到配置为**通用模式**的 KNX Ultimate 节点。启用确认后，第一条回复会显示 GA、DPT 和 payload，但不会发送写入；同一会话必须在 5 分钟内回复“确认”或“取消”。新请求会替换旧的待处理计划。每条已确认命令都包含 `msg.destination`、`msg.dpt`、`msg.payload` 和 `msg.event = "GroupValue_Write"`。
对于 DPT 1.xxx 写入，AI 生成的安全等价值 `true`/`false`、`1`/`0` 和 `on`/`off` 会在本地校验和输出前统一转换为真正的布尔值。

### 最新 KNX 读取
当用户明确要求当前或最新状态时，AI 可以查询已导入 ETS 目录中的精确对象，包括状态对象和其他只读对象。输出 4 会发送 `msg.destination`、`msg.dpt`、`msg.event = "GroupValue_Read"` 和 `msg.readstatus = true`。节点会为每个 `GroupValue_Response` 或最新写入等待最多 6 秒，然后在输出 3 返回解码值，并在 `msg.knxAi.readResults` 中提供详细信息。读取从不需要确认，也绝不会转换为写入。

### 用于聊天按钮的确认请求
计划等待确认时，输出 3 包含 `msg.knxAi.confirmationRequest`。该对象包括 `required`、`status`、`sessionId`、`expiresAt`、`commandCount`，以及 `actions` 中的两个项目。使用 `action.label` 作为 Telegram 按钮文本，使用 `action.callbackData` 作为回调，并将 `action.message` 发送回 KNX AI，即可在无需输入文本的情况下确认或取消。

### 聊天适配器预设
**聊天适配器**选项卡从 `resources/KNXAIChatAdapterMappings.js` 加载可选映射。选择预设会在全宽文本框中插入两段可编辑的同步 JavaScript 映射：一段在 KNX AI 处理输入前运行，另一段在输出 3 发出消息前运行。返回 `msg` 以继续，或不返回值以丢弃消息。语法和执行错误会被捕获并报告，不会停止 Node-RED。

随附的 **windkh/node-red-contrib-telegrambot** 预设遵循该包的 receiver/sender 消息约定。把 `telegram receiver` 直接连接到 KNX AI，并把输出 3 直接连接到 `telegram sender`。如需内联确认按钮，还要把配置为 `callback_query` 的 `telegram event` 连接到同一个 KNX AI 输入。输入映射会提取 `msg.payload.content`、`msg.payload.chatId` 和 Telegram 语言；输出映射会创建所需的 `msg.payload.chatId`、`type` 和 `content`，并在写入等待确认时从 `msg.knxAi.confirmationRequest` 添加 `options.reply_markup`。Telegram 包仍是独立的可选依赖项。

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

### Capture
- **Capture GroupValue_Write**：抓取 Write 电报。
- **Capture GroupValue_Response**：抓取 Response 电报。
- **Capture GroupValue_Read**：抓取 Read 电报。

### Analysis
- **Analysis window (seconds)**：摘要/速率统计主窗口。
- **History window (seconds)**：内部历史保留窗口。
- **同时将捕获的报文归档到磁盘**：除了 RAM，还会把报文保存到 `knxultimatestorage/knxai/history/<node-id>/YYYY-MM-DD.jsonl`。
- **磁盘归档保留天数**：归档文件在磁盘上保留的天数，超期后旧文件会自动删除。
- **Max stored events**：内存中保留的最大电报数量。
- **Auto emit summary (seconds, 0=off)**：周期性输出摘要间隔。
- **Top list size**：摘要中 top 组地址/来源数量。
- **Detect simple patterns (A -> B)**：启用组地址转移/模式检测。
- **Pattern max lag (ms)**：模式关联允许的最大时间差。
- **Pattern min occurrences**：报告模式前的最小出现次数。

### Anomalies
- **Rate window (seconds)**：异常速率检查滑动窗口。
- **Max overall telegrams/sec (0=off)**：全总线 telegram/s 阈值。
- **Max telegrams/sec per GA (0=off)**：单组地址 telegram/s 阈值。
- **Flap window (seconds)**：抖动/快速变化检测窗口。
- **Max changes per GA in window (0=off)**：窗口内允许的最大变化次数。

### AI 助手
- **Enable LLM assistant**：启用 Ask/chat 功能。
- **Provider**：LLM 后端（OpenAI-compatible 或 Ollama）。
- **Endpoint URL**：chat/completions 接口 URL。
- **API key**：API Key（本地 Ollama 可不填）。
- **Model**：模型 ID/名称。
- **聊天模型兼容性**：所选模型必须支持已配置的 Chat Completions 端点。刷新模型列表时，会排除仅支持旧版 completions 的模型，例如 `gpt-3.5-turbo-instruct`。如果提供商拒绝自定义 temperature 值或令牌限制参数，KNX AI 会仅移除或替换不兼容字段后重试。
- **System prompt**：KNX 分析全局系统提示词（Advanced）。
- **允许 AI 读取 KNX 状态并控制执行器**：启用输出 4，默认关闭。可以读取 ETS 目录中的精确对象；仅接受写入明确标记为 `command` 的对象。未知、DPT 不匹配、无效或数量过多的操作，以及向状态或中性对象的写入，都会在本地被拒绝。
- **发送 KNX 命令前请求确认**：默认启用。先显示已验证的修改，在同一聊天会话确认前不会发送任何 KNX 命令。有命令等待确认时，回复始终会使用当前请求的语言附加准确的确认或取消说明。命令会在输出前再次验证。
- **适配器预设**：从随附的聊天适配器文件加载一对输入/输出映射。选择预设会有意替换两个文本框，之后仍可编辑代码。
- **输入映射（聊天 → KNX AI）**：在处理输入命令前运行的同步 JavaScript。
- **输出映射（KNX AI → 聊天）**：仅应用于输出 3 消息的同步 JavaScript。
- 如果启用了磁盘归档，**Ask** 默认会查询该归档：若问题里写了明确日期/时间范围就按其查询，否则默认查询最近 24 小时并补上当前 RAM 事件。
- **Include raw payload hex**：在提示词中包含原始十六进制 payload。
- **包含 Node-RED 项目清单**：在提示词中加入整个 Node-RED 项目的节点清单，不仅包含 KNX 节点，也包含 function/change/inject/template 等在内且带有 KNX 逻辑或组地址的有用节点。
- **Include documentation snippets (help/README/examples)**：在提示词中包含文档片段。
- **Docs language**：文档片段优先语言。
- **Refresh** 按钮：请求 provider 并加载可用模型 ID。

### Advanced
- **Analysis window (seconds)**：摘要/速率统计主窗口。
- **Max stored events**：内存中保留的最大电报数量。
- **Top list size**：摘要中 top 组地址/来源数量。
- **Pattern max lag (ms)**：模式关联允许的最大时间差。
- **Pattern min occurrences**：报告模式前的最小出现次数。
- **Rate window (seconds)**：异常速率检查滑动窗口。
- **Max overall telegrams/sec (0=off)**：全总线 telegram/s 阈值。
- **Max telegrams/sec per GA (0=off)**：单组地址 telegram/s 阈值。
- **Flap window (seconds)**：抖动/快速变化检测窗口。
- **Max changes per GA in window (0=off)**：窗口内允许的最大变化次数。

### Ollama 快速配置（本地）
- 选择 **Provider = Ollama**。
- 默认 endpoint：`http://localhost:11434/api/chat`。
- 若未发现本地模型：
  - **1) Download model**：打开 **Model library** 页面。
  - **2) Install it**：在本机下载并安装模型（例如 `llama3.1`）。
- 在刷新/安装模型时，KNX AI 也会在可能情况下尝试自动启动 Ollama 服务。
- 若安装因连接错误失败，请确认 Ollama 已运行（桌面应用或 `ollama serve`）。
- 若 Node-RED 运行在 Docker 中，endpoint 请使用 `host.docker.internal` 替代 `localhost`。

## 安全说明
启用 LLM 后，KNX 流量上下文可能发送到所配置的 endpoint。若需严格本地化，请使用本地 provider。输出 4 上的命令仅表示已通过本地验证并转发到 flow，并不能证明执行器已执行；需要确认时请使用 KNX 状态 GA。
