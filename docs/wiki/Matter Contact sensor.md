---
layout: wiki
title: "Matter Contact sensor"
lang: en
permalink: /wiki/Matter%20Contact%20sensor
---
# Matter Contact Sensor (BETA)

> This node is in **BETA**: behaviour can change while the Matter implementation is refined.

This node maps a Matter contact endpoint to KNX and, optionally, to a Node-RED output.

## Configuration

|Field|Description|
|--|--|
| KNX GW | KNX gateway used to write and answer the configured group addresses. It can be left empty when only Node-RED output is needed. |
| Matter controller | Matter controller configuration node where the device has been commissioned. |
| Matter Contact Sensor | Matter contact endpoint selected from the commissioned devices. The picker is filtered to endpoints exposing `BooleanState`. |
| Contact GA | Contact GA receiving the converted value. Default DPT: `1.019`. |
| Read at startup | Publishes the cached Matter value at deploy/startup or when the device reconnects. |
| Node output | Shows a Node-RED output pin and emits every Matter update. |

## Behaviour

The node reads `BooleanState.stateValue`, converts it to boolean contact state, writes it to the configured KNX GA, and answers KNX read requests with the last known value.
