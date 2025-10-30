---
layout: wiki
title: "zh-CN-GlobalVariable"
lang: zh-CN
permalink: /wiki/zh-CN-zh-CN-GlobalVariable
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/GlobalVariable) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-GlobalVariable) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-GlobalVariable) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-GlobalVariable) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-GlobalVariable) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-GlobalVariable)
---


# KNX 全局变量

该节点将从总线收到的组地址映射到全局上下文变量，\
并允许通过该变量向 KNX 总线写入。

## 概览

- 将 Global Context 节点加入流程并命名；该名称作为全局变量的基础名。
- 读取使用后缀 `_READ`（如 `MyVar_READ`）。
- 写入使用后缀 `_WRITE`（如 `MyVar_WRITE`）。
- 可在配置中将变量暴露为只读或读/写。
- 出于安全考虑，请修改默认名称。

注意：写入执行后，`<Name>_WRITE` 会被自动清空，避免反复写入。

## 设置

| 属性 | 说明 |
|--|--|
| Gateway | KNX 网关。|
| Variable Name | 全局变量基础名。会创建 `<Name>_READ`（读取）与 `<Name>_WRITE`（写入）。为安全起见不要使用默认名。|
| Expose as Global variable | 选择是否以及如何暴露全局变量。若不需写入，建议设置为只读。|
| BUS write interval | 轮询 `<Name>_WRITE` 并向总线写入的时间间隔。|

## 变量中的 msg 对象```javascript
{
  address: "0/0/1",
  dpt: "1.001",
  payload: true,
  devicename: "Dinning Room->Table Light"
}
```## 快速用法

### 读取变量```javascript
const list = global.get("KNXContextBanana_READ") || [];
node.send({ payload: list });

const ga = list.find(a => a.address === "0/0/10");
if (ga && ga.payload === true) return { payload: "FOUND AND TRUE" };
if (ga && ga.payload === false) return { payload: "FOUND AND FALSE" };
```### 通过变量写入总线```javascript
const toSend = [];
toSend.push({ address: "0/0/10", dpt: "1.001", payload: msg.payload });
// 如果已导入 ETS，可省略 dpt，由系统据 payload 推断
toSend.push({ address: "0/0/11", payload: msg.payload });

global.set("KNXContextBanana_WRITE", toSend);
```## 完整示例

<a href="/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode" target="_blank"><i class="fa fa-info-circle"></i> 查看示例</a>
