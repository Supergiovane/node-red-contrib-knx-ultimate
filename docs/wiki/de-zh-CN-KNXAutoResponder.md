---
layout: wiki
title: "zh-CN-KNXAutoResponder"
lang: de
permalink: /wiki/de-zh-CN-KNXAutoResponder/
---
---

<p> Dieser Knoten antwortet auf die Leseanforderung des KNX -Busses.

Der Knoten zeichnet alle Telegramme auf, die in den KNX -Bus übertragen werden und die Werte im Speicher speichern.
Anschließend wird auf die Leseanforderung geantwortet, indem solche gemerkten Werte anhand der Anfrage an den Bus zurücksendet werden.
Wenn die zu gelesene Gruppenadresse noch keinen Wert hat, antwortet der Knoten mit dem Standardwert.
Dieser Knoten reagiert nur auf die im Feld **Antwort** JSON angegebene Gruppenadresse.
Standardmäßig gibt es einen vorkompilierten **Beispiel ** "Antwort" JSON -Text, den Sie einfach ändern/löschen können.Bitte stellen Sie sicher, dass**nicht drücken ** , um es zu verwenden!!!**Konfiguration**

| Eigenschaften | Beschreibung |
|-|-|
| Gateway | Wählen Sie das zu verwendende KNX -Portal aus |
| Antwort | Der Knoten antwortet auf eine Leseanforderung aus der in diesem JSON -Array angegebenen Gruppenadresse.Das Format ist unten angegeben.|

<br/>

\*\*json Format \*\*

JSON ist immer eine Reihe von Objekten, die jede Anweisung enthalten. Jede Anweisung zeigt dem Knoten an, was zu tun ist.

| Eigenschaften |Beschreibung |
|-|-|
| Hinweis | **Optional** Hinweisschlüssel, um Erinnerungen zu erhalten. Es wird nirgendwo verwendet.|
| Ga |Gruppenadresse.Sie können auch ".." wilde Münzen zu bestimmten Gruppen von Adressen verwenden.".." kann nur mit der dritten GA -Ebene verwendet werden, zum Beispiel: \*\*1/1/0..257 **. Bitte beachten Sie das Beispiel unten.|
| DPT | Gruppenaddatenpunkt, Format "1.001".Wenn die ETS -CSV -Datei importiert wurde,** optional \*\*. |
| Standard |Wenn der Knoten nicht an den Wert des Komponentenadresses erinnert wurde, wird er in einer Read -Request -Antwort an den Bus gesendet.|

**Beginnen wir mit einem Befehl**

Der Autoresponder -Knoten antwortet auf eine Leseanforderung unter Gruppenadresse 2/7/1.Wenn es noch nicht im Speicher ist, wird es mit _True _ antworten.
Die ETS -CSV -Datei muss importiert werden, andernfalls müssen Sie auch die __"DPT" hinzufügen: "1.001" \*\* Key.

```json

[
    {
        "ga": "2/7/1",
        "default": true
    }
]
```

**Vollständige Anweisungen**

Der Auto-Responder-Knoten antwortet auf Leseanforderungen ab dem 01.03.1, einschließlich 01.03.22.Wenn der Speicher noch keinen Wert hat, antwortet er mit _False _.
Es gibt auch einen__ Hinweis \*\* Schlüssel, der nur als Erinnerungsnotiz verwendet wird.Es wird nirgendwo verwendet.

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

**Angeschlossener Befehl**

Von 2/2/5 bis 2/2/21 antwortet der Autoresponder -Knoten auf eine Leseanforderung an die Gruppenadresse.Wenn es noch keinen Wert im Speicher gibt, antwortet es mit einem Wert von 25.
Der Autoresponder -Knoten antwortet auch auf Leseanforderungen von Komponenten 2/4/22.Wenn noch kein Wert im Speicher enthält, wird der unbekannte String \*unbekannte Zustand verwendet!\*Antwort.
Beachten Sie das **comma** zwischen den JSON -Objekten jeder Richtlinie.

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

<br/>
