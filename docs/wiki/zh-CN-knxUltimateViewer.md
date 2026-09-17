---
layout: wiki
title: "knxUltimateViewer"
lang: zh-CN
permalink: /wiki/zh-CN-knxUltimateViewer
translation_key: "knxUltimateViewer"
---
# KNX Viewer

KNX Viewer 使用简单表格显示组地址（GA）的状态变化，类似于精简版 ETS 监视器。

## 配置

选择 **KNX 网关**并设置节点**名称**。部署流程后，重新打开节点，点击**打开 KNX Viewer 监视器**。页面会在新标签页中打开，并使用与 Node-RED 编辑器相同的身份验证和读取权限。

## 网页监视器

每行显示时间、报文类型（Read、Write、Response 等）、源地址、GA、名称、DPT、上一个值和新值，最新记录排在最上方。对于 Write 和 Response 报文，监视器会记录每个 GA 首次观察到的值及后续变化；值未变化的报文不会新增记录。

Read 请求也会保存在 24 小时历史记录中，但不显示上一个值或新值，也不会改变该 GA 最后已知的值。

可以选择 Viewer、搜索列表或翻页查看较早的变化。**暂停**仅冻结显示，方便查看；**实时**恢复更新。暂停显示或关闭浏览器页面时，记录仍会继续。

## 24 小时历史记录

运行中的 Viewer 节点会自动将历史记录保存到 `userDir/knxultimatestorage/viewer` 目录下的文件中，并按 Viewer 和网关分别存储。超过 24 小时的变化记录会自动清除。Node-RED 重启后，Viewer 会恢复仍在此时间范围内的历史记录。

更新后的 Viewer 部署并运行后才会开始记录，不会补录此前的总线流量。

## 流程输出

节点保留现有的三个输出：

1. **组地址当前值** — `msg.payload` 包含 HTML 表格，可连接仪表板的 Template 节点。
2. **组地址数组** — `msg.payload` 包含 GA 数据数组，供流程进一步处理或记录。
3. **报文队列** — `msg.payload` 包含网关发送队列的 HTML 表格。

无需连接这些输出也可使用网页监视器。
