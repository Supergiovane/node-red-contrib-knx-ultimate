---
layout: wiki
title: "zh-CN-LoadControl-Configuration"
lang: de
permalink: /wiki/de-zh-CN-LoadControl-Configuration
---
---

# KNX -Laststeuerungsknoten

<p> Verwenden des Laststeuerungsknotens können Sie die Trennung der Last (Waschmaschine, Ofen usw.) automatisch verwalten, wenn der aktuelle Verbrauch einen bestimmten Schwellenwert überschreitet.

Das Gerät wird intelligent heruntergefahren und überprüft den möglichen Verbrauch des Geräts, um festzustellen, ob es mit anderen Geräten ausgeschaltet ist.<br/>
Der Knoten kann die Last automatisch reaktivieren.<br/>
Dieser Knoten schaltet ein Gerät (oder Geräte) gleichzeitig gemäß der gewählten Bestellung ab. <br/>

**Allgemein**

| Eigenschaften |Beschreibung |
|-|-|
| Gateway |KNX Portal. Es ist auch möglich, kein Gateway auszuwählen.In diesem Fall werden nur in den Knoten eingegebene Nachrichten berücksichtigt. |
|Überwachung WH | Die Gruppenadresse repräsentiert den Gesamtverbrauch Ihres Gebäudes. |
| Begrenzen Sie WH | Maximale Schwelle, die das Messgerät standhalten kann.Wenn dieser Schwellenwert überschritten wird, beginnt der Knoten damit, das Gerät abzuschalten. |
| Verzögert (s) |Zeigt in Sekunden an, was darauf hinweist, dass der Knoten die Häufigkeit des Verbrauchs bewertet und jedes Gerät abschaltet. |
| Verzögerung der (s) |zeigt in Sekunden an, was darauf hinweist, dass der Knoten die verbrauchte Frequenz bewertet und auf jedem geschlossenen Gerät eingeschaltet wird.|

<br/>

**Laststeuerung**

Hier können Sie das Gerät zum Herunterladen bei Überladung hinzufügen.<br/>
Wählen Sie das ausgeschaltete Gerät aus.Geben Sie den Gerätenamen oder seine Gruppenadresse ein.<br/>
Geben Sie eine Gruppenadresse ein, die das von dem in der ersten Zeile ausgewählte Gerät verbrauchte angeben. **Dies ist ein optionaler Parameter** . Wenn das Gerät mehr als eine bestimmte Anzahl von Watts verbraucht, bedeutet dies, dass es verwendet wird.Wenn weniger verbraucht wird, wird das Gerät als "nicht verwendet" und das Gerät sofort ausgeschaltet. <br/>
Wenn \*autoreCovery \* aktiviert ist, wird das Gerät automatisch reaktiviert, wenn die Reset -Verzögerung abläuft.

## Eingeben

| Eigenschaften | Beschreibung |
|-|-|
| `msg.readstatus = true` | Erzwingen Sie den KNX -Bus jedes Geräts in der Liste, um den Wert zu lesen._ **Der Knoten selbst hat alle Operationen ausgeführt** _, aber bei Bedarf können Sie diesen Befehl verwenden, um einen erneuten Lesen des aktuellen Wertes in Watt zu erzwingen.| | |
| `msg.enable = true` | Lastkontrolle aktivieren. |
| `msg.disable = true` | Deaktivieren Sie die Lastkontrolle. |
| `msg.reset = true` |den Knotenstatus zurücksetzen und alle Geräte wieder eröffnen. |
| `msg.shedding` | String._ """"" Sog "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" " "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" Verwenden Sie diese Nachricht, um den Falloff -Timer zu erzwingen, um den \*\* -Monitor zu ignorieren |

## Ausgabe

1. Standardausgang
: Payload (Zeichenfolge | Objekt): Standardausgabe des Befehls.

## Detail

```javascript

msg = {
  "topic": "Home Total Consumption", // Node Name
  "operation": "Increase Shedding" or "Decrease Shedding" or operation reflecting the input message (disable, enable, reset), // Operation
  "device": "Washing machine", // Device shedded
  "ga": "", // Group address of the shedded device
  "totalPowerConsumption": 3100, // Current power consumption
  "wattLimit": 3000, // Limit you set in the config window
  "payload": 1, // Current shedding stage
}

```

# Probe

\ <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SampleLoadControl"> Klicken Sie hier hier </a> hier </a>

<br/>
