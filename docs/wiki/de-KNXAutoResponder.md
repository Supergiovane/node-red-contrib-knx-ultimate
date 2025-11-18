---
layout: wiki
title: "KNXAutoResponder"
lang: de
permalink: /wiki/de-KNXAutoResponder
---
Dieser Knoten antwortet auf Leseanfragen aus dem KNX -Bus.

Der Knoten zeichnet alle an den KNX -Bus übertragenen Telegramme auf und speichert die Werte im Speicher.
Anschließend werden Anfragen gelesen, indem ein solcher auswendigerer Wert als Anfrage an den Bus zurücksendet wird.
Wenn die zu gelesene Gruppenadresse noch keinen Wert hat, antwortet der Knoten mit einem Standardwert.
Der Knoten reagiert nur auf Gruppenadressen, die im Feld \*\* antworten auf \*\* json.
Standardmäßig gibt es einen vorkompilierten \*\* Beispiel \*\* "auf" JSON-Text antworten, in dem Sie einfach ändern/löschen können.Bitte stellen Sie sicher, dass \*\* es nicht wie \*\* verwenden !!!

**Konfiguration**

| Eigenschaft | Beschreibung |
|-|-|
|Gateway |Wählen Sie das zu verwendende KNX -Gateway |
|Antworten auf |Der Knoten antwortet auf Leseanfragen aus den in diesem JSON -Array angegebenen Gruppenadressen.Das Format ist unten angegeben.|

\*\* JSON -Format \*\*

Der JSON ist \*\* immer \*\* ein Array von Objekten, das jede Richtlinie enthält.Jede Richtlinie sagt dem Knoten, was tun.

| Eigenschaft | Beschreibung |
|-|-|
|Anmerkung |\*\* Optional \*\* Hinweisschlüssel für Erinnerungen.Es wird nirgendwo verwendet.|
|ga |Die Gruppenadresse.Sie können auch die ".." Wildchars verwenden, um eine Reihe von Gruppenadressen zu fassen.Das ".." kann nur mit dem dritten GA -Level verwendet werden, z. B. \*\* 1/1/0..257 \*\*.Siehe die Stichproben unten.|
|DPT |Der Gruppenaddatenpunkt im Format "1.001".Es ist \*\* optional \*\* Wenn die ETS -CSV -Datei importiert wurde.|
|Standard |Der Wert, der als Antwort auf eine Leseanforderung an den Bus gesendet wurde, wenn der Gruppenadressenwert noch nicht vom Knoten auswendig gelernt wurde.|

\*\* Beginnen wir mit einer Richtlinie \*\*

Der Autoresponder -Knoten antwortet auf Leseanfragen für die Gruppenadresse 2/7/1.Wenn noch kein Wert im Speicher ist, antwortet er mit \*True \*.
Die ETS -CSV -Datei muss importiert worden sein, andernfalls müssen Sie die \*\* "DPT": "1.001" \*\* Key hinzufügen.

```json

[
    {
        "ga": "2/7/1",
        "default": true
    }
]
```

\*\* Ein bisschen vollständiger Richtlinie \*\*

Der Autoresponder -Knoten antwortet auf Leseanfragen für die Gruppenadresse ab dem 01.03.1 bis zum 01.03.22.Wenn noch kein Wert im Speicher ist, antwortet er mit \*Falsch \*.
Es gibt auch einen \*\* Hinweis \*\* Taste, lediglich als Erinnerungsnotiz.Es wird nirgendwo verwendet.

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

\*\* Verkettungsanweisungen \*\*

Der Autoresponder -Knoten antwortet auf Leseanfragen für die Gruppenadresse ab dem 2/2/5 bis 2/2/21 enthalten.Wenn noch kein Wert im Speicher ist, wird mit einem Wert von 25 geantwortet.
Der Autoresponder -Knoten antwortet auch auf Leseanforderungen für die Gruppenadresse 2/4/22.Wenn noch kein Wert im Speicher liegt, wird mit dem Zeichenfolge \*unbekannter Status! \*Antworten.
Bitte beachten Sie das JSON -Objekt jeder Richtlinie.

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
