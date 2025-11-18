---
layout: wiki
title: "SceneController-Configuration"
lang: de
permalink: /wiki/de-SceneController-Configuration
---
# Scene Controller

Der Scene‑Controller‑Node verhält sich wie ein KNX‑Szenencontroller: Szenen speichern und abrufen.

## Node‑Einstellungen

| Property | Beschreibung |
|--|--|
| Gateway | Gewähltes KNX‑Gateway. |
| Scene Recall | **Datapoint ** und**Trigger Value** . Gruppenadresse zum Abrufen (z. B. `0/0/1`). Reagiert auf Telegramme an dieser GA, um die Szene abzurufen. DPT ist der Datentyp der Recall‑GA. Trigger Value ist der Wert, der das Abrufen auslöst. Hinweis: Für DIM‑Befehle als Trigger den passenden Dimm‑Objektwert setzen (`{decr_incr:1,data:5}` hoch, `{decr_incr:0,data:5}` runter). |
| Scene Save | **Datapoint ** und**Trigger Value** . Gruppenadresse zum Speichern (z. B. `0/0/2`). Speichert die aktuellen Werte aller Geräte in der Szene in nichtflüchtigem Speicher. DPT ist der Datentyp der Save‑GA. Trigger Value löst das Speichern aus (DIM wie oben). |
| Node name | Anzeigename (z. B. "Recall: … / Save: …"). |
| Topic | Topic des Nodes. |

## Szenenkonfiguration

Füge Geräte wie bei einem echten KNX‑Szenencontroller hinzu. Jede Zeile entspricht einem Gerät.

Der Node speichert automatisch aktualisierte Werte aller Aktoren der Szene, sobald sie vom BUS eintreffen.

| Property | Beschreibung |
|--|--|
| ADD | Zeile hinzufügen. |
| Zeilenfelder | 1) Gruppenadresse 2) Datapoint 3) Default‑Wert in der Szene (durch Scene Save überschreibbar). Darunter: Gerätename.
 Eine Pause einfügen: **wait ** im ersten Feld und eine Zahl im letzten Feld (Millisekunden), z. B. `2000`.
**wait** akzeptiert auch Sekunden/Minuten/Stunden: `12s`, `5m`, `1h`. |
| Remove | Gerät/Zeile entfernen. |

## Ausgaben

```javascript

msg = {
  topic: "Scene Controller",
  recallscene: true|false,
  savescene: true|false,
  savevalue: true|false,
  disabled: true|false
}
```

---

## Eingänge (INPUT)

Primär reagiert der Node auf KNX‑Telegramme, kann aber auch per Nachricht gesteuert werden. Eingänge vom BUS lassen sich deaktivieren, sodass nur Flow‑Nachrichten wirken.

**Szene abrufen**

```javascript

msg.recallscene = true; return msg;
```

**Szene speichern**

```javascript

msg.savescene = true; return msg;
```

**Aktuellen Wert einer GA speichern**

Obwohl die Szene Aktor‑Werte automatisch mitführt, kann es sinnvoll sein, als "wahren Szenenwert" den Ist‑Wert einer anderen GA (z. B. Status statt Befehl) zu speichern.

Beispiel Rolladen: absolute Positions‑Status‑GA liefert den exakten Wert. Damit können Befehls‑GAs der in der Szene enthaltenen Aktoren aktualisiert werden.

```javascript

msg.savevalue = true;
msg.topic = "0/1/1"; // GA
msg.payload = 70; // zu speichernder Wert
return msg;
```

**Scene Controller deaktivieren**

Deaktiviert BUS‑Kommandos (Flow‑Nachrichten bleiben aktiv). Praktisch z. B. nachts.

```javascript

msg.disabled = true; // false = reaktivieren
return msg;
```

## Siehe auch

[Sample Scene Controller](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node)
