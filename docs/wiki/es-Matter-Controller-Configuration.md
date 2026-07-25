---
layout: wiki
title: "Matter-Controller-Configuration"
lang: es
permalink: /wiki/es-Matter-Controller-Configuration
---
# Controlador Matter

## Descripción general

Este nodo de configuración es un **controlador Matter** completo: crea su propia *fabric* Matter y empareja (comisiona) tus dispositivos Matter. Los dispositivos emparejados quedan disponibles para los nodos **Matter Device**, que los mapean a direcciones de grupo KNX.

El controlador se comunica con los dispositivos a través de la **red IP** (WiFi, Ethernet o Thread mediante un border router). El emparejamiento por Bluetooth no está soportado: el dispositivo debe estar ya accesible en la red.

## Emparejar un dispositivo

1. Haz primero el **deploy** de este nodo de configuración (el controlador debe estar en ejecución).
2. Vuelve a abrir el nodo e introduce el **código de emparejamiento**: el código manual de 11 dígitos (p.ej. `3497-011-2332`) o el contenido del código QR (`MT:....`).
3. Pulsa **EMPAREJAR**. El comisionado puede tardar hasta un minuto.

Si el dispositivo es nuevo de fábrica y solo admite emparejamiento por Bluetooth, emparéjalo primero con la app del fabricante o con otro controlador Matter (Alexa, Google Home, Apple Home) y usa después su función **"compartir / emparejar con otro hub"** para generar un nuevo código para KNX-Ultimate. Así el dispositivo se une a varias fabrics a la vez.

Prefiere el payload QR (`MT:...`): contiene el discriminador completo. El código manual solo contiene el discriminador corto y puede seleccionar el dispositivo equivocado si hay varios modelos idénticos en modo de emparejamiento. Empareja un dispositivo cada vez.

## Modo universal

En **Control Matter from KNX**, elige **Modo universal** para supervisar todos los dispositivos. El gateway KNX es opcional y solo se utiliza para las GA de alarma/texto del monitor.

El **Monitor universal de baterías** analiza todos los nodos y endpoints emparejados buscando Power Source, emite una instantánea inicial y conserva el estado normalizado completo. Puede emitir solo baterías bajo el umbral o cada actualización. `{payload:{action:"getAllBatteries"}}` devuelve el inventario en caché; los metadatos Matter raw están en `msg.matter`.

Las entradas requieren `nodeId`, `endpointId`, `clusterId` y `command` o `attribute` (directamente o bajo `msg.matter`):

- Encender: `{nodeId:"100", endpointId:1, clusterId:6, command:"on", args:{}}`
- Leer: `{nodeId:"100", endpointId:1, clusterId:47, attribute:"batPercentRemaining"}`
- Escribir: `{nodeId:"100", endpointId:1, clusterId:513, attribute:"occupiedHeatingSetpoint", value:2100}`

## Almacenamiento

Las credenciales de la fabric y los dispositivos emparejados se guardan en la carpeta `knxultimatestorage/matter` dentro del directorio de usuario de Node-RED. Borrar esa carpeta elimina todos los emparejamientos.

Usa **Exportar** para descargar una copia completa de esta instancia del controlador. Incluye la fabric, credenciales privadas, sesiones y datos de dispositivos vinculados. **Protege el archivo como una contraseña.** La importación reemplaza el almacenamiento Matter de esta instancia y reinicia brevemente el controlador. Una copia de controlador no se puede importar en un bridge.

## Eliminar un dispositivo

Usa el botón de la papelera en la lista de dispositivos emparejados. El controlador intenta retirar el dispositivo correctamente; si no está accesible, se elimina igualmente de la fabric (puede ser necesario un reset de fábrica del dispositivo).

En el monitor universal, las salidas KNX opcionales publican la alarma global como DPT 1.005 y alternan cada 2 segundos los dispositivos como texto DPT 16.001 de 14 bytes.
