---
layout: wiki
title: "KNX AI"
lang: zh-CN
permalink: /wiki/zh-CN-KNX%20AI
---
此节点会监听所选 KNX Ultimate 网关上的**所有 KNX 电报**，生成流量统计、检测异常，并可选调用 LLM。

编辑器使用三个主要折叠面板：**AI 助手**包含配置、知识/上下文以及提供商限制；**对话与家庭**包含聊天渠道、主动家庭和受限记忆；**KNX 总线流量分析**包含总线报文、历史/摘要以及异常/模式。打开一个主要面板即可同时看到其中全部相关选项。已保存字段的 ID 和值保持不变。

## 输出
1. **摘要/统计**（`msg.payload` 为 JSON）
2. **异常**（`msg.payload` 为 JSON）
3. **AI 助手**（`msg.payload` 为文本，包含 `msg.summary`）
4. **KNX 操作**（每个通过验证的读取或写入输出一条 Universal Mode 消息）

输出 3 和输出 4 发出的每条消息还会在 `msg.inputMessage` 中包含原始输入消息的副本。因此，原始 payload、topic、聊天元数据及其他输入属性都可供后续节点使用。克隆或输出错误会被捕获并报告，不会传播到 Node-RED 运行时。

## 命令（输入）
发送 `msg.topic`：
- `summary`（或空）：立即输出摘要
- `reset`：清空内部历史、计数器和已学习的家庭记忆；AI 教育保持不变
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

## 主动家庭智能与有限记忆
**对话与家庭**中的**主动家庭与记忆**子部分以可选方式启用主动通知。节点会根据 ETS 层级、名称、角色和 DPT，使用意大利语、英语、德语、法语、西班牙语和中文术语，为卷帘、窗户、门、照明、温度、气候、占用和报警建立确定性的语义模型。首个主动检测器只监视可靠识别且非命令的卷帘/窗户/门状态。超过配置的打开时间且当前不在静默时段时，输出 3 会发送本地化消息，并设置 `msg.knxAi.type = "proactive_notification"`。节点绝不会主动使用输出 4，也不会自行修改 KNX；用户之后提出的任何操作仍须经过正常的校验与确认。

最近一次聊天会话会被记为主人，也可以通过**主要接收者 / 聊天 ID**明确指定。合成的 `msg.inputMessage` 会保留接收者，使 Telegram 适配器能够发送主动通知。冷却时间和每小时最多三条主动通知可防止消息泛滥。

学习到的参考文件会在启动时从 `<userDir>/knxai/memory/knxai-home-memory-<node-id>.md` 加载，每 15 分钟以原子方式重写，并严格限制在可配置的 64–1,024 KB（默认 256 KB）。最多保留 120 条重要观察、80 条聚合习惯、80 条通知和 300 个 ETS 语义对象，绝不会保存无限的原始报文流。较旧且优先级较低的项目会先被删除。**AI 教育**最多 16,000 个字符，并且始终来自节点配置：AI 可以将其作为权威指导读取，但不能修改或覆盖。如果已填写 AI 教育但 LLM 无法进行评估，候选通知会被抑制，以免违反用户指导。

## 实用配置示例
此示例创建一个简洁的助手：它会报告重要的长时间开启状态，但允许书房卷帘保持开启。

| 编辑器字段 | 示例值 | 结果 |
|---|---|---|
| **启用主动家庭通知** (`proactiveEnabled`) | 启用 | 节点评估可靠识别的卷帘、窗户和门开启状态。 |
| **主要接收者 / 聊天 ID** (`proactiveRecipient`) | `123456789` | 主动消息发送到该聊天；留空则记住最近一次 Ask 会话。 |
| **开启多久后通知** (`proactiveOpenMinutes`) | `120` | 开启两小时后评估是否需要通知。 |
| **静默时间开始 / 结束** | `23:00` / `07:00` | 夜间不会发送主动消息。 |
| **重复冷却时间** (`proactiveCooldownMinutes`) | `360` | 同一对象六小时内不会再次通知。 |
| **家庭记忆文件上限** (`homeMemoryMaxKb`) | `256` | 此节点的 Markdown 参考文件始终小于 256 KB。 |

**AI 教育** (`aiEducation`) 示例：

```text
称呼我为 Alex，并使用与我相同的语言回答。
除非我要求技术细节，否则回答要简短。
书房卷帘白天可以保持开启：不要因此通知我。
其他卷帘、窗户或门异常长时间开启时请通知我。
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

KNX AI 会自动监听 `GroupValue_Write`、`GroupValue_Response` 和 `GroupValue_Read` 报文。模式和异常分析始终使用内置默认值初始化，无需配置总线事件或检测参数。

### Analysis
- **Analysis window (seconds)**：摘要/速率统计主窗口。
- **History window (seconds)**：内部历史保留窗口。
- **同时将捕获的报文归档到磁盘**：除了 RAM，还会把报文保存到 `knxultimatestorage/knxai/history/<node-id>/YYYY-MM-DD.jsonl`。
- **磁盘归档保留天数**：归档文件在磁盘上保留的天数，超期后旧文件会自动删除。
- **Max stored events**：内存中保留的最大电报数量。
- **Auto emit summary (seconds, 0=off)**：周期性输出摘要间隔。
- **Top list size**：摘要中 top 组地址/来源数量。

### AI 助手
- **Enable LLM assistant**：启用 Ask/chat 功能。
- **Provider**：LLM 后端（OpenAI-compatible 或 Ollama）。
- **Endpoint URL**：chat/completions 接口 URL。
- **API key**：API Key（本地 Ollama 可不填）。
- **Model**：模型 ID/名称。
- **聊天模型兼容性**：所选模型必须支持已配置的 Chat Completions 端点。刷新模型列表时，会排除仅支持旧版 completions 的模型，例如 `gpt-3.5-turbo-instruct`。如果提供商拒绝自定义 temperature 值或令牌限制参数，KNX AI 会仅移除或替换不兼容字段后重试。
- **允许 AI 读取 KNX 状态并控制执行器**：启用输出 4，默认关闭。可以读取 ETS 目录中的精确对象；仅接受写入明确标记为 `command` 的对象。未知、DPT 不匹配、无效或数量过多的操作，以及向状态或中性对象的写入，都会在本地被拒绝。
- **发送 KNX 命令前请求确认**：默认启用。先显示已验证的修改，在同一聊天会话确认前不会发送任何 KNX 命令。有命令等待确认时，回复始终会使用当前请求的语言附加准确的确认或取消说明。命令会在输出前再次验证。
- **适配器预设**：默认为**无适配器**。选择适配器前会隐藏 JavaScript 编辑器；选择后会加载并显示可编辑的输入和输出映射。
- **输入映射（聊天 → KNX AI）**：在处理输入命令前运行的同步 JavaScript，使用绿色 JavaScript 编辑器。
- **输出映射（KNX AI → 聊天）**：仅应用于输出 3 消息的同步 JavaScript，使用黄色 JavaScript 编辑器。
- **启用主动家庭通知**：可选检测器，仅处理可靠识别的卷帘、窗户和门开启状态；绝不会自主写入 KNX。
- **主要接收者 / 聊天 ID**：主动消息的可选目标；未填写时记住最近一次 Ask 会话。
- **开启多久后通知（分钟）**：考虑发送主动通知前的开启时长阈值；默认 120 分钟。
- **静默时间开始 / 结束**：每天禁止主动消息的时间段。
- **AI 教育**：仅由用户管理的权威指导，AI 可以读取但永远不能修改。
- **重复冷却时间（分钟）**：同一对象再次通知前的最短间隔；默认 360 分钟。
- **家庭记忆文件上限（KB）**：64 到 1,024 KB 的硬限制；默认 256 KB。
- 如果启用了磁盘归档，**Ask** 默认会查询该归档：若问题里写了明确日期/时间范围就按其查询，否则默认查询最近 24 小时并补上当前 RAM 事件。
- **包含 Node-RED 项目清单**：在提示词中加入整个 Node-RED 项目的节点清单，不仅包含 KNX 节点，也包含 function/change/inject/template 等在内且带有 KNX 逻辑或组地址的有用节点。
- 相关的帮助、README 和示例片段始终会自动包含。
- **Docs language**：自动包含的文档片段所使用的首选语言。
- **Refresh** 按钮：请求 provider 并加载可用模型 ID。加载期间图标会旋转；成功完成时不会显示额外消息。

### Advanced
- **Analysis window (seconds)**：摘要/速率统计主窗口。
- **Max stored events**：内存中保留的最大电报数量。
- **Top list size**：摘要中 top 组地址/来源数量。

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
