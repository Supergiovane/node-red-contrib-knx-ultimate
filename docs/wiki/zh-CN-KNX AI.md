---
layout: wiki
title: "KNX AI"
lang: zh-CN
permalink: /wiki/zh-CN-KNX%20AI
---
此节点会监听所选 KNX Ultimate 网关上的**所有 KNX 电报**，生成流量统计、检测异常，并可选调用 LLM。

## 输出
1. **摘要/统计**（`msg.payload` 为 JSON）
2. **异常**（`msg.payload` 为 JSON）
3. **AI 助手**（`msg.payload` 为文本，包含 `msg.summary`）

## 命令（输入）
发送 `msg.topic`：
- `summary`（或空）：立即输出摘要
- `reset`：清空内部历史与计数器
- `ask`：向已配置的 LLM 提问

`ask` 的问题建议放在 `msg.prompt`，也可放在 `msg.payload`（字符串）。

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
- **System prompt**：KNX 分析全局系统提示词（Advanced）。
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
启用 LLM 后，KNX 流量上下文可能发送到所配置的 endpoint。若需严格本地化，请使用本地 provider。
