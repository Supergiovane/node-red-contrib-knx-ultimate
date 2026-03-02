---
layout: wiki
title: "DateTime-Configuration"
lang: zh-CN
permalink: /wiki/zh-CN-DateTime-Configuration
---
# 日期/时间配置

**KNX DateTime** 节点用于把当前日期/时间写入一个或多个 KNX 组地址。

支持：
- **DPT 19.001**（日期/时间）– 推荐
- **DPT 11.001**（日期）– 可选
- **DPT 10.001**（时间）– 可选

## 组地址

|用途|属性|DPT|
|--|--|--|
| 日期/时间 | `日期/时间 GA`（`gaDateTime`） | `19.001` |
| 日期 | `日期 GA`（`gaDate`） | `11.001` |
| 时间 | `时间 GA`（`gaTime`） | `10.001` |

## 发送时机

- 部署/启动时（可选，可设置延时）
- 周期发送（可选，秒/分钟）
- 输入触发（每次输入都会发送）
- 编辑器按钮（立即发送）

## 输入 payload

如果 `msg.payload` 为空，则发送当前系统日期/时间。

支持：
- `Date`（`new Date()`）
- 时间戳（毫秒）
- `new Date("...")` 可解析的字符串
- `"now"`

## 节点输出

每次发送输出一条消息：
- `msg.payload`：发送的 `Date`
- `msg.sent`：`{ ga, dpt, name }` 数组
- `msg.reason`：`input` / `startup` / `periodic` / `button`

## ETS 自动填充

添加全新节点时，可自动选择第一个已导入 ETS 的 KNX 网关，并预填充匹配的组地址。

