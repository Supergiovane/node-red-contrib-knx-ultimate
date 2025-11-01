---
layout: wiki
title: "KNXAutoResponder"
lang: en
permalink: /wiki/KNXAutoResponder/
---
This node will respond to read requests from the KNX BUS.  

The node records all telegrams transmitted to the KNX BUS and store the values in memory.\
It then responds to read requests by sending such memorized value back to the BUS as request.\
If the group address to be read has no value yet, the node will respond with a default value.\
The node will respond only to group addresses specified in the **Respond to** JSON field.\
By default, there is a pre-compiled **sample ** "Respond to" JSON text, where you can simply change/delete things. Please make sure**not to use it as is ** !!!**Configuration**

|Property|Description|
|--|--|
| Gateway | Select the KNX gateway to be used |
| Respond to | The node will respond to read requests coming from the group addresses specified in this JSON array. The format is specified below. |

**JSON format ** The JSON is**always** an array of object, containing each one directive. Each directive, tells to the node what do do.

|Property|Description|
|--|--|
| note | **Optional** note key, for reminders. It will not be used anywhere. |
| ga | The group address. You can also use the ".." wildchars, to specity a range of group addresses. The ".." can only be used with the third ga's level, ex: **1/1/0..257** . See the samples below. |
| dpt | The group address data point, in the format "1.001". It's **optional** if the ETS CSV file has been imported. |
| default | The value sent to the BUS in response to a read request, when the group address value has not yet been memorized by the node. |

**Let's start with one directive**

The AutoResponder node will respond to read requests for the group address 2/7/1. If no value is yet in memory, it will reply with _true_.\
The ETS CSV file must have been imported, otherwise you must add the **"dpt":"1.001"** key as well.

```json

[
    {
        "ga": "2/7/1",
        "default": true
    }
]
```

**A bit more complete directive**

The AutoResponder node will respond to read requests for the group address starting from 3/1/1, to 3/1/22 included. If no value is yet in memory, it will reply with _false_.\
There is also a **note** key, merely as a reminder note. It will not be used anywhere.

```json

[
    {
        "note": "Virtual sensors coming from Hikvision AX-Pro",
        "ga": "3/1/1..22",
        "dpt": "1.001",
        "default": false
    }
]
```

**Concatenating directives**

The AutoResponder node will respond to read requests for the group address starting from 2/2/5, to 2/2/21 included. If no value is yet in memory, it will reply with a value of 25.\
The AutoResponder node will also respond to read requests for the group address 2/4/22. If no value is yet in memory, it will reply with the string _Unknown status!_.\
Please note the **comma** between each directive's JSON object.

```json

[
    {
        "note": "DALI garden virtual brightness %",
        "ga": "2/2/5..21"
        "default": 25
    },
    {
        "note": "Alarm armed status text",
        "ga": "2/4/22",
        "dpt": "16.001",
        "default": "Unknown status!"
    }
]
```
