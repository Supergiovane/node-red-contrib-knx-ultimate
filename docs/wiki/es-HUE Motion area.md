---
layout: wiki
title: "HUE Motion area"
lang: es
permalink: /wiki/es-HUE%20Motion%20area
---
> **Obsoleto:** este nodo HUE dedicado sigue disponible para los flujos existentes. Usa **HUE Controller** para proyectos nuevos. Aparece marcado con `(deprecated)` en la paleta y en el lienzo, usa un color más claro que HUE Controller y su editor muestra arriba un aviso de migración. El botón naranja de migración convierte localmente todos los nodos HUE legacy; después abre un borrador de correo editable y la página de donación en una ventana nueva del navegador. El correo nunca se envía automáticamente. Al finalizar el proceso, un mensaje fijo de Node-RED permanece visible hasta que pulses OK.

El nodo Hue Motion Area escucha los eventos de movimiento agregados de un área MotionAware (Hue Bridge Pro) y refleja el estado detectado/no detectado hacia KNX o hacia su flujo de Node-RED.

Empiece a escribir en el campo GA (nombre o dirección de grupo) para vincular la GA KNX; las sugerencias aparecen mientras escribe.

**General**

|Propiedad|Descripción|
|--|--|
| KNX GW | Pasarela KNX que recibe el estado de movimiento del área. |
| HUE Bridge | Puente Hue Pro que se utilizará. |
| HUE Area | Área MotionAware (convenience o security) que se va a supervisar (autocompletar al escribir). |
| Leer estado al inicio | Al iniciar o reconectar lee el valor actual y lo envía a KNX (por defecto: sí). |

**Mapeo**

|Propiedad|Descripción|
|--|--|
| Movimiento | GA KNX para el estado de movimiento del área (booleano). DPT recomendado: <b>1.001</b>. |

**Comportamiento**

|Propiedad|Descripción|
|--|--|
| Pin de salida del nodo | Muestra u oculta la salida de Node-RED. Sin pasarela KNX el pin permanece activo para que los eventos MotionAware sigan llegando al flujo. |

### Salida

1. Salida estándar  
   : `msg.payload` (booleano): `true` cuando se detecta movimiento en el área, `false` en caso contrario.

### Detalles

`msg.payload` contiene el último estado de movimiento agregado que proporciona el servicio MotionAware del área seleccionada.
