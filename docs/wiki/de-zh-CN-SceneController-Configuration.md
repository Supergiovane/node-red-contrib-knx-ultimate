---
layout: wiki
title: "zh-CN-SceneController-Configuration"
lang: de
permalink: /wiki/de-zh-CN-SceneController-Configuration
---
---

# Szenencontroller

Dieser Knoten steht im Einklang mit dem KNX -Szenencontroller: Die Szene kann gespeichert und zurückgerufen werden.

## Knoteneinstellungen

| Eigenschaften | Beschreibung |
|-|-|
| Gateway | Ausgewähltes KNX -Gateway. |
| Szenenrückruf | **DataPoint ** und**Triggerwert** . Die Gruppenadresse, mit der das Szenario abgerufen wurde (z. B. 0/0/1`).Der Knoten erinnert an die Szene, wenn die Nachricht von dieser GA empfangen wird.DPT ist die Art von Rückruf -GA;Triggerwert ist der Wert, der zum Auslösen des Rückrufs erforderlich ist.Tipp: Wenn Sie im Dim-Modus ausgelöst werden, legen Sie bitte den richtigen Wert des Dimmobjekts fest (Up-Anpassungsanpassung durch {Decr_incr: 1, Daten: 5} `und herunteranstellungen durch {Decr_incr: 0, Daten: 5}`).|
| Szene retten | **DataPoint ** und**Triggerwert** . Die Gruppenadresse zum Speichern der Szene (z. B. 0/0/2`).Wenn ein Knoten eine Nachricht empfängt, speichert er den aktuellen Wert aller Geräte in der Szene (nichtflüchtiger Speicher).DPT ist der Typ zum Speichern von GA; Auslöser des Triggerwerts speichern (Dim Supra).|
| Knotenname | Knotenname (schreiben Sie "Rückruf: ... / Speichern: ...").|
| Thema | Das Thema des Knotens. |

## Szenario -Konfiguration

Fügen Sie wie ein echter KNX -Szenencontroller Geräte zur Szene hinzu. Jede Zeile repräsentiert ein Gerät.

Sobald ein neuer Wert aus dem Bus eingeht, zeichnet der Knoten automatisch den neuesten Wert des Aktuators in der Szene auf.

| Eigenschaften | Beschreibung |
|-|-|
| Taste hinzufügen | Fügen Sie eine neue Zeile hinzu.|
| Reihenfeld | 1) Gruppenadresse 2) DataPoint 3) Standard -Szenenwert (kann durch Szene speichern).Der Gerätename ist unten.<br/> Pause einfügen: Füllen Sie **Warten Sie ** in der ersten Spalte und füllen Sie die letzte Spalte für die Dauer (Millisekunden) wie "2000" aus.<br/>**Warte** unterstützt auch Sekunden/Minute/Stunde: `12s`,` 5m`, `1H`.|
| Entfernen | Entfernen Sie diese Gerätelinie.|

## Knotenausgabe```javascript
msg = {
  topic: "Scene Controller",
  recallscene: true|false,
  savescene: true|false,
  savevalue: true|false,
  disabled: true|false
}
```---

## Eingabenachricht (Eingabe)

Der Knoten stützt sich hauptsächlich auf KNX -Nachrichten, um die Szene abzurufen/zu speichern. Es kann auch über Nachrichten gesteuert werden.Befehle aus dem Bus können deaktiviert und nur verarbeitete Nachrichten akzeptiert werden.

**Rückrufszenario** ```javascript
msg.recallscene = true; return msg;
``` **Szene speichern** ```javascript
msg.savescene = true; return msg;
``` **Speichern Sie den aktuellen Wert eines GA**

Obwohl die Szene den Wert des Testamentsausführenden automatisch verfolgt, ist es in einigen Fällen erforderlich, den aktuellen Wert eines anderen GA (wie den Status und nicht den Befehl) mit einem "echten Szenenwert" aufzuzeichnen.

Zum Beispiel spiegelt der Roller -Verschluss: Der Zustand der absoluten Höhe spiegelt die genaue Position wider.Dieser Status GA wird verwendet, um den Befehl GA des relevanten Testamentsanbieters in der Szene zu aktualisieren.```javascript
msg.savevalue = true;
msg.topic = "0/1/1"; // GA
msg.payload = 70; // 要保存的值
return msg;
``` **Szenencontroller deaktivieren**

Deaktivieren Sie Befehle aus dem KNX -Bus (Akzeptieren Sie immer noch Prozessmeldungen).Zum Beispiel ist es nützlich, wenn Sie sich nachts nicht an eine Szene aus der Entitätstaste erinnern/speichern möchten.```javascript
msg.disabled = true; // false 重新启用
return msg;
```## Sehen

[Szenen -Szenen -Controller](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)
