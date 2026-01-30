---
layout: wiki
title: "KNX Router Filter"
lang: zh-CN
permalink: /wiki/zh-CN-KNX%20Router%20Filter
---
在将 RAW 电报对象（通常由 **KNX Multi Routing** 产生）转发到其它网关之前，对其进行过滤。

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/sample-knx-router-filter.svg" width="95%"><br/>

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

在重写时，节点也会更新 `knx.cemi.hex` 以匹配重写后的 `knx.source`/`knx.destination`（当 `knx.cemi.hex` 存在时）。

规则自上而下匹配（先匹配先执行）。

示例：
- 通配：`0/0/* => 2/0/*`（`*` 会被捕获并复用）
- 正则：`re:^1/2/(\\d+)$ => 3/2/$1`

## 元数据
节点会在输出中添加 `msg.payload.knxRouterFilter`：
- 丢弃：`{ dropped: true, reason: 'event'|'ga'|'source', ... }`
- 通过：`{ dropped: false, rewritten: <bool>, cemiSynced: <bool>, rewrite: { ... }, original: { ... } }`

## msg.setConfig
你可以通过向输入端发送 `msg.setConfig` 对象来在运行时修改节点配置。
支持的键：`allowWrite`, `allowResponse`, `allowRead`, `gaMode`, `gaPatterns`, `srcMode`, `srcPatterns`, `rewriteGA`, `gaRewriteRules`, `rewriteSource`, `srcRewriteRules`。
新配置会保持到下一次 `msg.setConfig` 或 redeploy/重启。配置消息不会被转发。

各属性含义：
- `allowWrite`：允许 `GroupValue_Write` 电报。
- `allowResponse`：允许 `GroupValue_Response` 电报。
- `allowRead`：允许 `GroupValue_Read` 电报。
- `gaMode`：目的组地址过滤模式（`off`=不启用过滤，`allow`=仅放行匹配项，`block`=丢弃匹配项）。
- `gaPatterns`：`gaMode` 使用的目的 GA pattern（每行一个，支持 `*` 和 `re:<regex>`）。
- `srcMode`：源物理地址过滤模式（`off`/`allow`/`block`）。
- `srcPatterns`：`srcMode` 使用的 source pattern（每行一个，支持 `*` 和 `re:<regex>`）。
- `rewriteGA`：对通过的电报启用 `knx.destination` 重写。
- `gaRewriteRules`：目的 GA 重写规则（`from => to`，先匹配先执行；支持 `*` 和 `re:<regex>`）。
- `rewriteSource`：对通过的电报启用 `knx.source` 重写。
- `srcRewriteRules`：源 PA 重写规则（`from => to`，先匹配先执行；支持 `*` 和 `re:<regex>`）。

示例：
```js
msg.setConfig = {
  allowWrite: true,
  allowResponse: true,
  allowRead: true,
  gaMode: "allow",
  gaPatterns: "1/1/*\n1/2/3",
  srcMode: "off",
  srcPatterns: "",
  rewriteGA: true,
  gaRewriteRules: "5/5/1 => 1/1/1",
  rewriteSource: true,
  srcRewriteRules: "15.*.* => 1.1.254"
};
return msg;
```
