---
layout: wiki
title: "zh-CN-HUE Plug"
lang: es
permalink: /wiki/es-zh-CN-HUE%20Plug/
---
---
# Enchufe / enchufe de tono
## Descripción general
Los mapas de nodo Hue Plug Philips Hue Smart Sockets a las direcciones del grupo KNX para implementar:
- Control de encendido/apagado en el bus;
- Comentarios de estado de la plataforma HUE;
- Monitoreo opcional `power_state` (On/Standby).
## Configuración
|Campos | Descripción |
|-|-|
| KNX GW | Puertas de enlace KNX utilizadas |
| Puente Hue | Puente de tono utilizado |
| Nombre | Hue Socket para controlar (aviso automático) |
| Control | Enviar/apagar la dirección del grupo KNX (Bolean DPT) |
| Estado | Dirección de recepción de estado de Informe de Hue Informe |
| Estado de potencia | Dirección de grupo opcional para mapear tono `power_state` |
| Leer el estado al inicio | Envíe el estado actual inmediatamente durante la implementación |
| Pin | Habilite el pin de entrada/salida de Node-Red Red para control avanzado o reenvío de eventos |
## Recomendaciones KNX
- Se recomienda el control y el estado para usar DPT 1.xxx.
- `power_state` se puede asignar a un valor booleano (true = on, false = standby), o usar la clase de texto DPT para mostrar la cadena original.
- Cuando se recibe una lectura KNX (`GroupValue_read`), el nodo vuelve al estado de tono en caché.
## Integración de flujo
Cuando los pines están habilitados:
- **Entrada** : Enviar carga útil de Hue V2 (como `{on: {on: true}}`).
- **Salida** : salida `{carga útil, ON, power_state, rawevent}` CADA TIEMPO HUE EVENT.
## API HUE
El nodo llama `/recurse/plug/{id}`.Las transmisiones de eventos de HUE se utilizan para capturar los cambios de estado y sincronizar a KNX.
