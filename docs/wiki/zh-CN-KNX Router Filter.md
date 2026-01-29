---
layout: wiki
title: "KNX Router Filter"
lang: zh-CN
permalink: /wiki/zh-CN-KNX%20Router%20Filter
---
在将 RAW 电报对象（通常由 **KNX Multi Routing** 产生）转发到其它网关之前，对其进行过滤。

## Pattern 语法
- 组地址（GA）支持每级 `*`：
  - `0/0/*` 匹配 `0/0` 下的所有组地址
  - `0` 等同于 `0/*/*`
- 源物理地址（Source）支持每级 `*`：
  - `1.1.*` 匹配区域 `1`、线路 `1` 下的所有设备
  - `1` 等同于 `1.*.*`
- 高级：`re:<regex>` 直接使用正则表达式。

## 模式（GA / Source）
- **Off**：不启用过滤
- **Allow only matching**：仅放行匹配项
- **Block matching**：阻止匹配项

## 输出
1. **通过**（用于转发）
2. **丢弃**（可选调试）

## 重写（Rewrite）
可选重写：
- 目的组地址 `knx.destination`
- 源物理地址 `knx.source`

规则自上而下匹配（先匹配先执行）。

示例：
- 通配：`0/0/* => 2/0/*`（`*` 会被捕获并复用）
- 正则：`re:^1/2/(\\d+)$ => 3/2/$1`

## 元数据
节点会在输出中添加 `msg.payload.knxRouterFilter`：
- 丢弃：`{ dropped: true, reason: 'event'|'ga'|'source', ... }`
- 通过：`{ dropped: false, rewritten: <bool>, rewrite: { ... }, original: { ... } }`
