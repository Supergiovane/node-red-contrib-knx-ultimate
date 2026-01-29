---
layout: wiki
title: "knxUltimateViewer"
lang: de
permalink: /wiki/de-knxUltimateViewer
---
Dieser Node arbeitet zusammen mit dem Dashboard-<b>ui_template</b> von Node-RED.

Zeigt alle Gruppenadressen und deren Werte in einem Dashboard-Widget an.

# KNX VIEWER

| Eigenschaft | Beschreibung |
|-|-|
| Gateway | KNX-Gateway. |
| Name | Node-Name. |

# AUSGÄNGE

1. Gruppenadressen (Dashboard)
   : payload (html): direkt mit Dashboard-<b>Template</b> verbinden; erzeugt eine Tabelle mit allen GAs und Werten.
2. Einfaches Array zur Aufzeichnung
   : payload (array): enthält alle GAs; für eigene Formatierung/Sortierung.
3. Telegramm-Warteschlange (Dashboard)
   : payload (html): mit <b>Template</b> verbinden; zeigt die KNX-Sendequeue zur BUS-Überwachung.

# BEISPIEL

<img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/viewer2.png" width="90%">

Setze einen Viewer-Node in den Flow und verbinde ihn mit einem Dashboard-<b>Template</b>.
Der <b>Template</b>-Node enthält nur diesen Text:

```

<div ng-bind-html="msg.payload"></div>

```

Ausgabe: <img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/viewer1.png" width="90%">

**Diesen Code in den Flow kopieren**

> Knoten an die eigene Umgebung anpassen

`

```json

[{"id":"6736561775d8ee88","type":"knxUltimateViewer","z":"54c299048a6c5b6b","server":"a01c5d80.1bbb78","name":"KNXViewer","x":260,"y":240,"wires":[["b239b31adb87d250"],["aafd0f4cde22f225"]]},{"id":"b239b31adb87d250","type":"ui_template","z":"54c299048a6c5b6b","group":"6cbdc633e478e65a","name":"","order":0,"width":"12","height":"6","format":"
<div ng-bind-html=\"msg.payload\"></div>
","storeOutMessages":true,"fwdInMessages":true,"resendOnRefresh":true,"templateScope":"local","x":460,"y":220,"wires":[[]]},{"id":"7fe6d46036fe5fc2","type":"comment","z":"54c299048a6c5b6b","name":"KNX
UI
Viewer","info":"","x":280,"y":200,"wires":[]},{"id":"aafd0f4cde22f225","type":"debug","z":"54c299048a6c5b6b","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":470,"y":260,"wires":[]},{"id":"a01c5d80.1bbb78","type":"knxUltimate-config","host":"224.0.23.12","port":"3671","physAddr":"1.1.99","hostProtocol":"Multicast","suppressACKRequest":false,"csv":"\"Group
name\"\t\"Address\"\t\"Central\"\t\"Unfiltered\"\t\"Description\"\t\"DatapointType\"\t\"Security\"\n\"Attuatori
luci\"\t\"0/-/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Luci primo
piano\"\t\"0/0/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Luce camera da
letto\"\t\"0/0/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-8\"\t\"Auto\"\n\"Luce loggia camera da
letto\"\t\"0/0/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce camera
armadi\"\t\"0/0/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce bagno grande
(switch)\"\t\"0/0/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce loggia bagno
grande\"\t\"0/0/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce specchio bagno grande
(switch)\"\t\"0/0/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce
lavanderia\"\t\"0/0/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce specchio lavanderia
(switch)\"\t\"0/0/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce
studio\"\t\"0/0/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Plafoniera soggiorno
(switch)\"\t\"0/0/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Applique soggiorno
(switch)\"\t\"0/0/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce loggia soggiorno
cucina\"\t\"0/0/12\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce
cucina\"\t\"0/0/13\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Pensili
cucina\"\t\"0/0/14\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Luce
corridoio\"\t\"0/0/15\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"LED
scala\"\t\"0/0/16\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Applique soggiorno brightness
value\"\t\"0/0/17\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Luce specchio bagno
grande(dim)\"\t\"0/0/18\"\t\"\"\t\"\"\t\"\"\t\"DPST-3-7\"\t\"Auto\"\n\"Plafoniera soggiorno brightness
value\"\t\"0/0/19\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Luce specchio lavanderia
(dim)\"\t\"0/0/20\"\t\"\"\t\"\"\t\"\"\t\"DPST-3-7\"\t\"Auto\"\n\"LED cambiacolori RGB
scala\"\t\"0/0/21\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce specchio bagno grande brightness
value\"\t\"0/0/22\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Plafoniera soggiorno
(dim)\"\t\"0/0/23\"\t\"\"\t\"\"\t\"\"\t\"DPST-3-7\"\t\"Auto\"\n\"Applique soggiorno
(dim)\"\t\"0/0/24\"\t\"\"\t\"\"\t\"\"\t\"DPST-3-7\"\t\"Auto\"\n\"Luce specchio lavanderia brightness
value\"\t\"0/0/25\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Plafoniera soggiorno switch
Stato\"\t\"0/0/26\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Applique soggiorno switch
Stato\"\t\"0/0/27\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce camera armadi
Stato\"\t\"0/0/28\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce bagno grande (switch)
Stato\"\t\"0/0/29\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce specchio bagno grande
Stato\"\t\"0/0/30\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Luce specchio lavanderia
Stato\"\t\"0/0/31\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Luce lavanderia
Stato\"\t\"0/0/32\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Plafoniera soggiorno
(colore)\"\t\"0/0/33\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Plafoniera soggiorno brightness value
Stato\"\t\"0/0/34\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Applique soggiorno brightness value
Stato\"\t\"0/0/35\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Luce bagno grande (brightness
value)\"\t\"0/0/36\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Luce bagno grande (brightness value)
Stato\"\t\"0/0/37\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Luce bagno grande
(dim)\"\t\"0/0/38\"\t\"\"\t\"\"\t\"\"\t\"DPST-3-7\"\t\"Auto\"\n\"Luce bagno grande
(color)\"\t\"0/0/39\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Luce bagno grande (color)
Stato\"\t\"0/0/40\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Applique soggiorno
(color)\"\t\"0/0/41\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Applique soggiorno (color)
Stato\"\t\"0/0/42\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Luci piano terra\"\t\"0/1/-\"\t\"\"\t\"\"\t\"Luci
piano terra\"\t\"\"\t\"Auto\"\n\"Luce corridoio e scala\"\t\"0/1/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce
tavolo taverna\"\t\"0/1/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Applique
taverna\"\t\"0/1/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce
cameretta\"\t\"0/1/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce bagno piano
terra\"\t\"0/1/4\"\t\"\"\t\"\"\t\"Bagno piano terra Luce\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce timer garage
(ON)\"\t\"0/1/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luci marciapiedi
giardino\"\t\"0/1/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Fari allarme
giardino\"\t\"0/1/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Controsoffitto taverna
(switch)\"\t\"0/1/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Controsoffitto taverna
(dim)\"\t\"0/1/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-3-7\"\t\"Auto\"\n\"Controsoffitto scena cambio colori taverna
(ON/OFF)\"\t\"0/1/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"IR Luci taverna
(ON/OFF)\"\t\"0/1/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Taverna color set
1\"\t\"0/1/12\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Taverna color set
2\"\t\"0/1/13\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Taverna color set
3\"\t\"0/1/14\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Taverna color set
4\"\t\"0/1/15\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Taverna color state
1\"\t\"0/1/16\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Taverna color state
2\"\t\"0/1/17\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Taverna color state
3\"\t\"0/1/18\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Taverna color state
4\"\t\"0/1/19\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n\"Luce tavolo taverna
(dim)\"\t\"0/1/20\"\t\"\"\t\"\"\t\"\"\t\"DPST-3-7\"\t\"Auto\"\n\"Luce permanente garage
(ON/OFF)\"\t\"0/1/21\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Controsoffitto taverna brightness
value\"\t\"0/1/22\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Controsoffitto taverna (switch)
Stato\"\t\"0/1/23\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Controsoffitto taverna brightness value
Stato\"\t\"0/1/24\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Luce tavolo taverna
Stato\"\t\"0/1/25\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce sala
tecnica\"\t\"0/1/26\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Luce sala tecnica
Stato\"\t\"0/1/27\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Heating\"\t\"1/-/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Termostato
lavanderia\"\t\"1/0/-\"\t\"\"\t\"\"\t\"Termostato lavanderia\"\t\"\"\t\"Auto\"\n\"Grandezza regolatrice costante
lavanderia\"\t\"1/0/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Temperatura
lavanderia\"\t\"1/0/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Modo operativo
lavanderia\"\t\"1/0/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-105\"\t\"Auto\"\n\"Umiditï¿½
lavanderia\"\t\"1/0/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-7\"\t\"Auto\"\n\"Temperatura di rugiada
lavanderia\"\t\"1/0/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Indicazione attivazione caldaia
lavanderia\"\t\"1/0/5\"\t\"\"\t\"\"\t\"Indicazione attivazione caldaia\"\t\"DPST-1-1\"\t\"Auto\"\n\"Setpoint lavanderia
Stato\"\t\"1/0/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Backlight
lavanderia\"\t\"1/0/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"RTC Status
lavanderia\"\t\"1/0/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"TestoDiagnosticoMDTLavanderia\"\t\"1/0/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"Setpoint
lavanderia\"\t\"1/0/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Termostato
studio\"\t\"1/1/-\"\t\"\"\t\"\"\t\"Termostato studio\"\t\"\"\t\"Auto\"\n\"Grandezza regolatrice costante
studio\"\t\"1/1/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Temperatura
studio\"\t\"1/1/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Modo operativo
studio\"\t\"1/1/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"Umiditï¿½
studio\"\t\"1/1/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-7\"\t\"Auto\"\n\"Temperatura di rugiada
studio\"\t\"1/1/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Indicazione attivazione caldaia
studio\"\t\"1/1/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Setpoint studio
Stato\"\t\"1/1/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Backlight
studio\"\t\"1/1/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"RTC Status
studio\"\t\"1/1/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"TestoDiagnosticoMDTStudio\"\t\"1/1/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"Setpoint
studio\"\t\"1/1/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Termostato camera da
letto\"\t\"1/2/-\"\t\"\"\t\"\"\t\"Termostato camera da letto\"\t\"\"\t\"Auto\"\n\"Grandezza regolatrice costante camera
da letto\"\t\"1/2/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Temperatura camera da
letto\"\t\"1/2/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Modo operativo camera da
letto\"\t\"1/2/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"Temperatura di rugiada camera da
letto\"\t\"1/2/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Umiditï¿½ camera da
letto\"\t\"1/2/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-7\"\t\"Auto\"\n\"Indicazione attivazione caldaia camera da
letto\"\t\"1/2/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Setpoint camera da letto
Stato\"\t\"1/2/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Backlight camera da
letto\"\t\"1/2/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"RTC Status camera da
letto\"\t\"1/2/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"TestoDiagnosticoMDTCameraDaLetto\"\t\"1/2/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"Setpoint
camera da
letto\"\t\"1/2/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"TestoDiagnosticoMDTTaverna\"\t\"1/2/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"Termostato
camera armadi\"\t\"1/3/-\"\t\"\"\t\"\"\t\"Termostato camera armadi\"\t\"\"\t\"Auto\"\n\"Grandezza regolatrice costante
camera armadi\"\t\"1/3/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Temperatura camera
armadi\"\t\"1/3/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Modo operativo camera
armadi\"\t\"1/3/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"Temperatura di rugiada camera
armadi\"\t\"1/3/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Umiditï¿½ camera
armadi\"\t\"1/3/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-7\"\t\"Auto\"\n\"Indicazione attivazione caldaia camera
armadi\"\t\"1/3/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Setpoint camera armadi
Stato\"\t\"1/3/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Backlight camera
armadi\"\t\"1/3/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"RTC Status camera
armadi\"\t\"1/3/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"TestoDiagnosticoMDTCameraArmadi\"\t\"1/3/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"Setpoint
camera armadi\"\t\"1/3/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Termostato bagno
grande\"\t\"1/4/-\"\t\"\"\t\"\"\t\"Termostato bagno grande\"\t\"\"\t\"Auto\"\n\"Grandezza regolatrice costante bagno
grande\"\t\"1/4/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Temperatura bagno
grande\"\t\"1/4/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Modo operativo bagno
grande\"\t\"1/4/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"Temperatura di rugiada bagno
grande\"\t\"1/4/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Umiditï¿½ bagno
grande\"\t\"1/4/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-7\"\t\"Auto\"\n\"Indicazione attivazione caldaia bagno
grande\"\t\"1/4/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Setpoint bagno grande
Stato\"\t\"1/4/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Backlight bagno
grande\"\t\"1/4/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"RTC Status bagno
grande\"\t\"1/4/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"TestoDiagnosticoMDTBagnoGrande\"\t\"1/4/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"Setpoint
bagno grande\"\t\"1/4/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Termostato soggiorno-garage e funzioni generali
termostati\"\t\"1/5/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Grandezza regolatrice costante
soggiorno\"\t\"1/5/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Temperatura
soggiorno\"\t\"1/5/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Modo operativo
soggiorno\"\t\"1/5/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"RTC Status
soggiorno\"\t\"1/5/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"Setpoint
soggiorno\"\t\"1/5/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Indicazione attivazione caldaia
soggiorno\"\t\"1/5/5\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Setpoint soggiorno
Stato\"\t\"1/5/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Temperatura di rugiada
soggiorno\"\t\"1/5/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Umiditï¿½
soggiorno\"\t\"1/5/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-7\"\t\"Auto\"\n\"Backlight
soggiorno\"\t\"1/5/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Modo Operativo Termostati Generale
(Virtual)\"\t\"1/5/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"TestoDiagnosticoMDTSoggiorno\"\t\"1/5/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"Temperatura
garage\"\t\"1/5/12\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Termostato
cucina\"\t\"1/6/-\"\t\"\"\t\"\"\t\"Termostato cucina\"\t\"\"\t\"Auto\"\n\"Grandezza regolatrice costante
cucina\"\t\"1/6/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Temperatura
cucina\"\t\"1/6/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Modo operativo
cucina\"\t\"1/6/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"Temperatura di rugiada
cucina\"\t\"1/6/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Umiditï¿½
cucina\"\t\"1/6/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-7\"\t\"Auto\"\n\"Indicazione attivazione caldaia
cucina\"\t\"1/6/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Setpoint cucina
Stato\"\t\"1/6/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Backlight
cucina\"\t\"1/6/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"RTC Status
cucina\"\t\"1/6/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"TestoDiagnosticoMDTCucina\"\t\"1/6/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"Setpoint
cucina\"\t\"1/6/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Termostato
taverna\"\t\"1/7/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Grandezza regolatrice costante
taverna\"\t\"1/7/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Temperatura
taverna\"\t\"1/7/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Modo operativo
taverna\"\t\"1/7/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"Temperatura di rugiada
taverna\"\t\"1/7/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Umiditï¿½
taverna\"\t\"1/7/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-7\"\t\"Auto\"\n\"Indicazione attivazione caldaia
taverna\"\t\"1/7/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Setpoint taverna
Stato\"\t\"1/7/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Backlight
taverna\"\t\"1/7/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"RTC Status
taverna\"\t\"1/7/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-102\"\t\"Auto\"\n\"Setpoint
taverna\"\t\"1/7/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-1\"\t\"Auto\"\n\"Ingressi
logici\"\t\"2/-/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Comandi\"\t\"2/1/-\"\t\"\"\t\"\"\t\"Comandi\"\t\"\"\t\"Auto\"\n\"Pala
soggiorno (VIRTUAL ON/OFF)\"\t\"2/1/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Richiedi assistenza medica
(ON/OFF)\"\t\"2/1/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Telecomando porta blindata e cancelletto (VIRTUAL
ON)\"\t\"2/1/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Telecomando garage piccolo (VIRTUAL
ON/OFF)\"\t\"2/1/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Telecomando garage grande (VIRTUAL
ON/OFF)\"\t\"2/1/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Telecomando sbarre (VIRTUAL
ON/OFF)\"\t\"2/1/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Comando ventilazione 1 (VIRTUAL
ON/OFF)\"\t\"2/1/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Comando ventilazione 2 (VIRTUAL
ON/OFF)\"\t\"2/1/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Spegni tutto tranne soggiorno e cucina Switch (VIRTUAL
ON)\"\t\"2/1/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Scenari
Soggiorno\"\t\"2/1/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-18-1\"\t\"Auto\"\n\"Simulazione Presenza (VIRTUAL
ON/OFF)\"\t\"2/1/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Pala soggiorno Speed (VIRTUAL
0/1/2)\"\t\"2/1/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-100\"\t\"Auto\"\n\"Pala soggiorno busy Stato (VIRTUAL
0/1/2)\"\t\"2/1/12\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-100\"\t\"Auto\"\n\"Richiusura automatica Garage e Sbarre dopo transito
(ON/OFF)\"\t\"2/1/13\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Apertura garage piccolo + sbarre con richiusura
automatica (ON)\"\t\"2/1/14\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Apertura garage grande + sbarre con
richiusura automatica (ON)\"\t\"2/1/15\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"RF Cucina luce
(ON)\"\t\"2/1/16\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"RF Cucina pensili
(ON)\"\t\"2/1/17\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"RF Cucina corrente
(ON)\"\t\"2/1/18\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"RF Cucina acqua logge
(ON)\"\t\"2/1/19\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"RF Cucina persiana finestra
(ON)\"\t\"2/1/20\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Spegni tutto DIM (VIRTUAL
ON)\"\t\"2/1/21\"\t\"\"\t\"\"\t\"\"\t\"DPST-3-7\"\t\"Auto\"\n\"Telecomando RF Jung Plafoniera Soggiorno (VIRTUAL
ON)\"\t\"2/1/22\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Comando prepara telo proiettore e taverna per proiezione
(VIRTUAL ON/OFF)\"\t\"2/1/23\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Comando pala camera letto (VIRTUAL
ON/OFF)\"\t\"2/1/24\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Posta
presente\"\t\"2/1/25\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"RF Comando pala timer camera
letto\"\t\"2/1/26\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-4\"\t\"Auto\"\n\"Comando pala camera letto (VIRTUAL OFF BY
DIM)\"\t\"2/1/27\"\t\"\"\t\"\"\t\"\"\t\"DPST-3-7\"\t\"Auto\"\n\"Pala camera da letto Speed (VIRTUAL
0/1/2)\"\t\"2/1/28\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-100\"\t\"Auto\"\n\"_Pala Soggiorno
(ON/OFF)\"\t\"2/1/29\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Multimedia\"\t\"2/2/-\"\t\"\"\t\"\"\t\"Multimedia\"\t\"\"\t\"Auto\"\n\"Massimo
arrivato/partito da casa (ON/OFF)\"\t\"2/2/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Zona1 Volume
(DIM)\"\t\"2/2/1\"\t\"\"\t\"\"\t\"Zona2 Volume\"\t\"DPST-3-7\"\t\"Auto\"\n\"Track +\"\t\"2/2/2\"\t\"\"\t\"\"\t\"iTunes
Track +\"\t\"DPST-1-1\"\t\"Auto\"\n\"Zona 1 Play/Pause
(ON/OFF)\"\t\"2/2/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Stato
casa\"\t\"2/2/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Chiara arrivata/partita da casa
(ON/OFF)\"\t\"2/2/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Track
-\"\t\"2/2/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-3-7\"\t\"Auto\"\n\"Zona1 Playlist + (ON)\"\t\"2/2/9\"\t\"\"\t\"\"\t\"Zona2
Source\"\t\"DPST-1-1\"\t\"Auto\"\n\"Messaggio di testo 1\"\t\"2/2/10\"\t\"\"\t\"\"\t\"Messaggio di testo
1\"\t\"DPST-16-1\"\t\"Auto\"\n\"Messaggio di testo 2\"\t\"2/2/11\"\t\"\"\t\"\"\t\"Messaggio di testo
2\"\t\"DPST-16-0\"\t\"Auto\"\n\"Data\"\t\"2/2/12\"\t\"\"\t\"\"\t\"Data\"\t\"DPST-11-1\"\t\"Auto\"\n\"Ora\"\t\"2/2/13\"\t\"\"\t\"\"\t\"Ora\"\t\"DPT-10\"\t\"Auto\"\n\"Meteo\"\t\"2/3/-\"\t\"\"\t\"\"\t\"Meteo\"\t\"\"\t\"Auto\"\n\"Pioggia
(ON/OFF)\"\t\"2/3/0\"\t\"\"\t\"\"\t\"Pioggia\"\t\"DPST-1-1\"\t\"Auto\"\n\"Temperatura
esterna\"\t\"2/3/1\"\t\"\"\t\"\"\t\"Temperatura esterna\"\t\"DPST-9-1\"\t\"Auto\"\n\"Luminositï¿½
esterna\"\t\"2/3/2\"\t\"\"\t\"\"\t\"Luminositï¿½ esterna\"\t\"DPST-7-13\"\t\"Auto\"\n\"Velocitï¿½
vento\"\t\"2/3/3\"\t\"\"\t\"\"\t\"Velocitï¿½ vento\"\t\"DPT-9\"\t\"Auto\"\n\"Tramonto
(ON/OFF)\"\t\"2/3/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Vento forte
(ON/OFF)\"\t\"2/3/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Vibrazione tendone
(ON/OFF)\"\t\"2/3/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Power metering\"\t\"2/4/-\"\t\"\"\t\"\"\t\"Power
metering\"\t\"\"\t\"Auto\"\n\"Wh Lavatrice primo piano\"\t\"2/4/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-14-56\"\t\"Auto\"\n\"Wh
Active Power Total 1.1.50 Energy actuator primo piano\"\t\"2/4/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-14-56\"\t\"Auto\"\n\"Wh
Consumo TOTALE (NodeRed)\"\t\"2/4/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-14-56\"\t\"Auto\"\n\"Wh
Forno\"\t\"2/4/3\"\t\"\"\t\"\"\t\"mAh Forno\"\t\"DPST-14-56\"\t\"Auto\"\n\"Wh
Lavastoviglie\"\t\"2/4/4\"\t\"\"\t\"\"\t\"mAh Lavastoviglie\"\t\"DPST-14-56\"\t\"Auto\"\n\"Wh Active Power Total 1.1.49
Energy actuator piano terra\"\t\"2/4/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-14-56\"\t\"Auto\"\n\"Tensione 220v presente Stato
(ON/OFF)\"\t\"2/4/6\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Wh Active Power Total 1.1.53 Energy actuator primo
piano\"\t\"2/4/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-14-56\"\t\"Auto\"\n\"Wh AC Essential
BUS\"\t\"2/4/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-14-56\"\t\"Auto\"\n\"Wh Prese e Luci Primo
Piano\"\t\"2/4/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-14-56\"\t\"Auto\"\n\"Wh Prese e Luci Piano
Terra\"\t\"2/4/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-14-56\"\t\"Auto\"\n\"Wh Lavatrice piano
terra\"\t\"2/4/12\"\t\"\"\t\"\"\t\"\"\t\"DPST-14-56\"\t\"Auto\"\n\"Solare Kw produzione istantanea inverter
(NodeRed)\"\t\"2/4/13\"\t\"\"\t\"\"\t\"\"\t\"DPST-14-56\"\t\"Auto\"\n\"Solare % vendita istantanea a gestore
(NodeRed)\"\t\"2/4/14\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Solare % autoconsumo
(NodeRed)\"\t\"2/4/15\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Solare % acquisto istantaneo da gestore
(NodeRed)\"\t\"2/4/16\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Sensori\"\t\"2/5/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Camera
armadi lux\"\t\"2/5/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-4\"\t\"Auto\"\n\"Bagno grande output -
light\"\t\"2/5/1\"\t\"\"\t\"\"\t\"A seconda della modalitï¿½ del sistema di allarme, accendo la luce o l'aplque dello
specchio.\"\t\"DPST-1-1\"\t\"Auto\"\n\"Lavanderit output -
light\"\t\"2/5/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera da letto IR
LOCK\"\t\"2/5/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera armadi IR
LOCK\"\t\"2/5/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande IR
LOCK\"\t\"2/5/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Lavanderia IR
LOCK\"\t\"2/5/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Studio IR
LOCK\"\t\"2/5/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Soggiorno IR
LOCK\"\t\"2/5/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Cucina IR
LOCK\"\t\"2/5/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Corridoio primo piano IR
LOCK\"\t\"2/5/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Taverna IR
LOCK\"\t\"2/5/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Cameretta IR
LOCK\"\t\"2/5/12\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno piano terra IR
LOCK\"\t\"2/5/13\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Corridoio piano terra IR
LOCK\"\t\"2/5/14\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Sala tecnica
presenza\"\t\"2/5/15\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera letto
lux\"\t\"2/5/16\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-4\"\t\"Auto\"\n\"Bagno grande
lux\"\t\"2/5/17\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-4\"\t\"Auto\"\n\"Lavanderia
lux\"\t\"2/5/18\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-4\"\t\"Auto\"\n\"Studio
lux\"\t\"2/5/19\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-4\"\t\"Auto\"\n\"Soggiorno
lux\"\t\"2/5/20\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-4\"\t\"Auto\"\n\"Cucina
lux\"\t\"2/5/21\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-4\"\t\"Auto\"\n\"Taverna
lux\"\t\"2/5/22\"\t\"\"\t\"\"\t\"\"\t\"DPST-9-4\"\t\"Auto\"\n\"Camera da letto
presenza\"\t\"2/5/49\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Camera armadi
presenza\"\t\"2/5/50\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Studio
presenza\"\t\"2/5/51\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno grande
presenza\"\t\"2/5/52\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Lavanderia
presenza\"\t\"2/5/53\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Cucina
presenza\"\t\"2/5/54\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Soggiorno
presenza\"\t\"2/5/55\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Corridoio primo piano
presenza\"\t\"2/5/56\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Taverna
presenza\"\t\"2/5/57\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Cameretta
presenza\"\t\"2/5/58\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Bagno piano terra
presenza\"\t\"2/5/59\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Garage
presenza\"\t\"2/5/60\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Corridoio giu
presenza\"\t\"2/5/61\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Antifurto\"\t\"2/6/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"AJAX
ALLARME INCENDIO Stato (ON)\"\t\"2/6/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"Antifurto Stop Telefonate
(ON)\"\t\"2/6/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"Timer AutoArm attivo
(ON/OFF)\"\t\"2/6/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Antifurto Internal Set
(ON/OFF)\"\t\"2/6/3\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Antifurto Internal Set
Stato\"\t\"2/6/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"AJAX Set Arm Away
(ON)\"\t\"2/6/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"AJAX Arm Away Stato
(ON/OFF)\"\t\"2/6/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"Elenco persiane
aperte\"\t\"2/6/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"Elenco finestre
aperte\"\t\"2/6/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"AJAX ALARM AWAY Stato
(ON)\"\t\"2/6/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Elenco ingressi
aperti\"\t\"2/6/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-0\"\t\"Auto\"\n\"Antifurto ALARM NIGHT
Stato\"\t\"2/6/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"AJAX Set Disarm
(ON)\"\t\"2/6/13\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"GM/A 8.1 In Operation
Stato\"\t\"2/6/15\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"Antifurto
Zone\"\t\"2/7/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Microonde Nord
(A)\"\t\"2/7/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Microonde Est
(A)\"\t\"2/7/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Microonde Sud
(A)\"\t\"2/7/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Microonde Ovest
(A)\"\t\"2/7/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Sbarre
(N)\"\t\"2/7/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Cancello
(N)\"\t\"2/7/12\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Garage grande (N)\"\t\"2/7/13\"\t\"\"\t\"\"\t\"Garage
grande\"\t\"DPST-1-1\"\t\"Auto\"\n\"Garage piccolo (N)\"\t\"2/7/14\"\t\"\"\t\"\"\t\"Garage
piccolo\"\t\"DPST-1-1\"\t\"Auto\"\n\"Porta REI garage (N)\"\t\"2/7/15\"\t\"\"\t\"\"\t\"Porta REI
garage\"\t\"DPST-1-1\"\t\"Auto\"\n\"Porta blindata (N)\"\t\"2/7/16\"\t\"\"\t\"\"\t\"Porta
blindata\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestre garage (A)\"\t\"2/7/17\"\t\"\"\t\"\"\t\"Finestre
garage\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana finestra camera da letto (N)\"\t\"2/7/18\"\t\"\"\t\"\"\t\"Persiana finestra
camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana bagno piano terra (N)\"\t\"2/7/19\"\t\"\"\t\"\"\t\"Persiana bagno
piano terra\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana balcone camera da letto (N)\"\t\"2/7/20\"\t\"\"\t\"\"\t\"Persiana
loggia camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestra bagno piano terra (A)\"\t\"2/7/21\"\t\"\"\t\"\"\t\"Finestra
bagno piano terra\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana cameretta piano terra
(N)\"\t\"2/7/22\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestra camera armadi
(A)\"\t\"2/7/23\"\t\"\"\t\"\"\t\"Finestra camera armadi\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana camera armadi
(N)\"\t\"2/7/24\"\t\"\"\t\"\"\t\"Finestra camera armadi\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestra bagno grande
(A)\"\t\"2/7/25\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana bagno grande
(N)\"\t\"2/7/26\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestra lavanderia
(A)\"\t\"2/7/27\"\t\"\"\t\"\"\t\"Finestra lavanderia\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana lavanderia
(N)\"\t\"2/7/28\"\t\"\"\t\"\"\t\"Persiana lavanderia\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestra studio
(A)\"\t\"2/7/29\"\t\"\"\t\"\"\t\"Finestra studio\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana studio
(N)\"\t\"2/7/30\"\t\"\"\t\"\"\t\"Persiana studio\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestre soggiorno
(A)\"\t\"2/7/31\"\t\"\"\t\"\"\t\"Finestre soggiorno\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestra cameretta piano terra
(A)\"\t\"2/7/33\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiane taverna
(N)\"\t\"2/7/34\"\t\"\"\t\"\"\t\"Persiane tavernetta\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana balcone soggiorno
(N)\"\t\"2/7/35\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestre cucina (A)\"\t\"2/7/36\"\t\"\"\t\"\"\t\"Finestre
cucina\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana finestra cucina
(N)\"\t\"2/7/37\"\t\"\"\t\"\"\t\"\n\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestre taverna
(A)\"\t\"2/7/38\"\t\"\"\t\"\"\t\"Finestre tavernetta\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana balcone cucina
(N)\"\t\"2/7/39\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Finestra ingresso (A)\"\t\"2/7/40\"\t\"\"\t\"\"\t\"Finestra
ingresso\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana ingresso
(N)\"\t\"2/7/41\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Finestre camera da letto
(A)\"\t\"2/7/42\"\t\"\"\t\"\"\t\"Finestre camera da letto\"\t\"DPST-1-1\"\t\"Auto\"\n\"Perimetro loggia ingresso
(A)\"\t\"2/7/47\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Sportello Caldaia
(N)\"\t\"2/7/48\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Attuatori
carichi\"\t\"3/-/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Prese/Utenze\"\t\"3/0/-\"\t\"\"\t\"\"\t\"Prese/Utenze\"\t\"\"\t\"Auto\"\n\"Generale
220V piano terra e primo
piano\"\t\"3/0/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Forno\"\t\"3/0/1\"\t\"\"\t\"\"\t\"Forno\"\t\"DPST-1-1\"\t\"Auto\"\n\"Lavastoviglie\"\t\"3/0/2\"\t\"\"\t\"\"\t\"Lavastoviglie\"\t\"DPST-1-1\"\t\"Auto\"\n\"Lavatrice
primo piano\"\t\"3/0/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"UPS
Output\"\t\"3/0/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Prese spente in modalita notte + Comandate Sala Tecnica
+ Proiettore + TV Camera da letto +
Antenna\"\t\"3/0/5\"\t\"\"\t\"\"\t\"Antenna)\"\t\"DPST-1-1\"\t\"Auto\"\n\"_Ventilazione centralizzata
1\"\t\"3/0/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Studio\"\t\"3/0/7\"\t\"\"\t\"\"\t\"Studio\"\t\"DPST-1-1\"\t\"Auto\"\n\"Corrente
soggiorno\"\t\"3/0/8\"\t\"\"\t\"\"\t\"Soggiorno\"\t\"DPST-1-1\"\t\"Auto\"\n\"Corrente
cucina\"\t\"3/0/9\"\t\"\"\t\"\"\t\"Cucina\"\t\"DPT-1\"\t\"Auto\"\n\"_Richiesta accensione pompa caldaia da MDT
AKH-0800.02\"\t\"3/0/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"_Ventilazione centralizzata
2\"\t\"3/0/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Utenza GAS
(OPEN/CLOSE)\"\t\"3/0/12\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Utenza
Acqua\"\t\"3/0/13\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Irrigazione
logge\"\t\"3/0/14\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Ventilazione Fan Speed
(0/1/2)\"\t\"3/0/15\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-100\"\t\"Auto\"\n\"Pompa ricircolo acqua calda sanitaria caldaia
(ON/OFF)\"\t\"3/0/16\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"AC Essential BUS (Frigo, allarme, bus
KNX)\"\t\"3/0/17\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Lavatrice piano
terra\"\t\"3/0/18\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Ventilazione automatica
(ON/OFF)\"\t\"3/0/19\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"Ventilazione Fan Speed Status
(0/1/2)\"\t\"3/0/20\"\t\"\"\t\"\"\t\"\"\t\"DPST-20-111\"\t\"Auto\"\n\"Ventilazione Fan Status
(ON/OFF)\"\t\"3/0/21\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Prese comandate soffitta
(ON/OFF)\"\t\"3/0/22\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Prese comandate soffitta Stato
(ON/OFF)\"\t\"3/0/23\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Generale 220V piano terra e primo piano
Stato\"\t\"3/0/24\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Corrente
taverna\"\t\"3/0/25\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"_Pala soggiorno (ON/OFF Impulso On-Off <0,5s=accendi
    pala,>0,5s = spegni pala)\"\t\"3/0/26\"\t\"\"\t\"\"\t\"Vedere istruzioni
    Luceplan.\"\t\"DPST-1-1\"\t\"Auto\"\n\"Accessi\"\t\"3/1/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"_Sbarre\"\t\"3/1/0\"\t\"\"\t\"\"\t\"Sbarre\"\t\"DPST-1-1\"\t\"Auto\"\n\"_Garage
    piccolo\"\t\"3/1/1\"\t\"\"\t\"\"\t\"Garage piccolo\"\t\"DPST-1-1\"\t\"Auto\"\n\"_Garage
    grande\"\t\"3/1/2\"\t\"\"\t\"\"\t\"Garage grande\"\t\"DPST-1-1\"\t\"Auto\"\n\"_Cancello
    [ON]\"\t\"3/1/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Tapparella soggiorno
    move\"\t\"3/1/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-8\"\t\"Auto\"\n\"Persiana finestra cucina
    move\"\t\"3/1/5\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Tapparella soggiorno
    step\"\t\"3/1/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-7\"\t\"Auto\"\n\"Tapparella soggiorno %
    apertura\"\t\"3/1/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Persiana finestra cucina %
    apertura\"\t\"3/1/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Persiana finestra cucina
    step\"\t\"3/1/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-8\"\t\"Auto\"\n\"Tendone balcone soggiorno
    move\"\t\"3/1/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Tendone balcone soggiorno
    step\"\t\"3/1/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Tendone balcone soggiorno %
    apertura\"\t\"3/1/12\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Tenda rullo finestra soggiorno
    move\"\t\"3/1/13\"\t\"\"\t\"\"\t\"\"\t\"DPT-1\"\t\"Auto\"\n\"Tenda rullo finestra soggiorno
    step\"\t\"3/1/14\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-7\"\t\"Auto\"\n\"Tenda rullo finestra soggiorno %
    apertura\"\t\"3/1/15\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"_Porta blindata
    [ON]\"\t\"3/1/19\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Persiana finestra cucina % apertura
    Stato\"\t\"3/1/20\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Tenda rullo finestra soggiorno % apertura
    Stato\"\t\"3/1/22\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Tendone balcone soggiorno % apertura
    Stato\"\t\"3/1/23\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Tapparella soggiorno % apertura
    Stato\"\t\"3/1/24\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Basso
    voltaggio\"\t\"3/2/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Uscite
    logiche\"\t\"4/-/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Antifurto\"\t\"4/0/-\"\t\"\"\t\"\"\t\"SEC\"\t\"\"\t\"Auto\"\n\"Sirena
    esterna stato impianto TC (ON/OFF)\"\t\"4/0/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Sirena esterna allarme
    (ON/OFF)\"\t\"4/0/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Sirena esterna allarme
    Stato\"\t\"4/0/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"Lampeggianti blu
    Stato\"\t\"4/0/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"Sirena carabinieri
    Stato\"\t\"4/0/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"Sirena interna
    Stato\"\t\"4/0/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-2\"\t\"Auto\"\n\"Sirena interna
    (ON/OFF)\"\t\"4/0/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Sirena interna stato impianto TC
    (ON/OFF)\"\t\"4/0/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Lampeggianti blu
    (ON/OFF)\"\t\"4/0/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Sirena carabinieri
    (ON/OFF)\"\t\"4/0/12\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-1\"\t\"Auto\"\n\"Altre uscite
    logiche\"\t\"4/2/-\"\t\"\"\t\"\"\t\"\"\t\"\"\t\"Auto\"\n\"Play/Pause
    (ON/OFF)\"\t\"4/2/0\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-10\"\t\"Auto\"\n\"Shuffle
    (ON/OFF)\"\t\"4/2/1\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-3\"\t\"Auto\"\n\"Playlist Next/Prev
    (ON/OFF)\"\t\"4/2/2\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-7\"\t\"Auto\"\n\"Titolo\"\t\"4/2/3\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-1\"\t\"Auto\"\n\"Interprete\"\t\"4/2/4\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-1\"\t\"Auto\"\n\"Selezione
    diretta Playlist (0-255)\"\t\"4/2/5\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-10\"\t\"Auto\"\n\"Volume assoluto
    (0-100)\"\t\"4/2/6\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"Stato Play/Stop
    (ON/OFF)\"\t\"4/2/7\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-10\"\t\"Auto\"\n\"Nome Playlist
    corrente\"\t\"4/2/8\"\t\"\"\t\"\"\t\"\"\t\"DPST-16-1\"\t\"Auto\"\n\"Brano Prev/Next
    (ON/OFF)\"\t\"4/2/9\"\t\"\"\t\"\"\t\"\"\t\"DPST-1-7\"\t\"Auto\"\n\"Livello sale garage (Virtual
    percent)\"\t\"4/2/10\"\t\"\"\t\"\"\t\"\"\t\"DPST-5-1\"\t\"Auto\"\n\"RGB Colore Abmient Led
    Corlo\"\t\"4/2/11\"\t\"\"\t\"\"\t\"\"\t\"DPST-232-600\"\t\"Auto\"\n","KNXEthInterface":"Auto","KNXEthInterfaceManuallyInput":"","statusDisplayLastUpdate":true,"statusDisplayDeviceNameWhenALL":true,"statusDisplayDataPoint":false,"stopETSImportIfNoDatapoint":"fake","loglevel":"warn","name":"Enertex
    Unicast","localEchoInTunneling":true,"delaybetweentelegrams":"50","delaybetweentelegramsfurtherdelayREAD":"1","ignoreTelegramsWithRepeatedFlag":true,"keyringFileXML":"","autoReconnect":"yes"},{"id":"6cbdc633e478e65a","type":"ui_group","name":"KNX-Ultimate
    Viewer","tab":"02c465fe930c0e1c","order":1,"disp":true,"width":"12","collapse":false},{"id":"02c465fe930c0e1c","type":"ui_tab","name":"Home","icon":"dashboard","disabled":false,"hidden":false}]

    

```

`

```
