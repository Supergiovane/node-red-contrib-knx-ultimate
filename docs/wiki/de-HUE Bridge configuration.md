---
layout: wiki
title: "HUE Bridge configuration"
lang: de
permalink: /wiki/de-HUE%20Bridge%20configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Bridge%20configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Bridge%20configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Bridge%20configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Bridge%20configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Bridge%20configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Bridge%20configuration)

<h1>PHILIPS HUE NODES

</h1>

  <img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/huehub.jpg' width='40%'>

Dieser Node registriert Node-RED an der Hue Bridge und führt den Kopplungsvorgang jetzt automatisch aus.

Gib die IP des Bridge ein (oder wähle eine automatisch erkannte Bridge) und klicke auf **CONNECT**. Der Editor fragt die Bridge weiter an und schließt den Warte-Dialog automatisch, sobald du die physische Link-Taste gedrückt hast. Mit **CANCEL** kannst du den Vorgang jederzeit stoppen und später erneut versuchen. Die Felder für Benutzername und Client Key bleiben bearbeitbar, damit du die Zugangsdaten jederzeit kopieren oder manuell einfügen kannst.

Du hast die Zugangsdaten bereits? Klicke auf **ICH HABE BEREITS DIE ZUGANGSDATEN**, um die Felder sofort einzublenden und sie manuell einzugeben, ohne auf den Bridge-Button zu warten.

**Allgemein**

| Eigenschaft | Beschreibung |
|--|--|
| IP | Gib die feste IP deiner Hue Bridge ein oder wähle einen automatisch gefundenen Eintrag aus der Liste. |
| CONNECT | Startet die Registrierung und wartet auf den Tastendruck an der Bridge. Der Dialog schließt sich automatisch nach dem Tastendruck; mit **CANCEL** kannst du das Warten beenden. |
| Name | Name der Bridge, der nach erfolgreicher Verbindung von der Hue Bridge gelesen wird. |
| Username / Client Key | Von der Hue Bridge nach der Kopplung zurückgegebene Zugangsdaten. Die Felder bleiben editierbar für Copy & Paste oder manuelle Eingaben. |

![image.png](../img/hude-config.png)
