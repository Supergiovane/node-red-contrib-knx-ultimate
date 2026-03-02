---
layout: wiki
title: "DateTime-Configuration"
lang: en
permalink: /wiki/DateTime-Configuration
---
# Date/Time configuration

The **KNX DateTime** node writes the current date/time to one or more KNX group addresses.

It supports:
- **DPT 19.001** (DateTime) – recommended
- **DPT 11.001** (Date) – optional
- **DPT 10.001** (Time) – optional

## Group addresses

|Purpose|Property|DPT|
|--|--|--|
| DateTime | `DateTime GA` (`gaDateTime`) | `19.001` |
| Date | `Date GA` (`gaDate`) | `11.001` |
| Time | `Time GA` (`gaTime`) | `10.001` |

You can configure just one GA (typical) or multiple GAs (the node writes to all configured destinations).

## When it sends

- **On deploy/startup** (optional) with a configurable delay.
- **Periodic send** (optional) with seconds/minutes interval.
- **On input** (always): each incoming message triggers a write.
- **Editor button**: send-now.

## Input payload

If `msg.payload` is missing/empty, the node sends the current system date/time.

Supported values:
- `Date` object (`new Date()`)
- timestamp number (milliseconds since epoch)
- string accepted by `new Date("...")`
- `"now"`

## Node output

The node emits one message per send:
- `msg.payload`: the `Date` written
- `msg.sent`: array of `{ ga, dpt, name }`
- `msg.reason`: `input`, `startup`, `periodic` or `button`

## Editor auto-fill (ETS)

When you add a brand new node, it can auto-select the first KNX Gateway that has an ETS import and pre-fill coherent group addresses.

