---
layout: wiki
title: "Matter-Controller-Configuration"
lang: es
permalink: /wiki/es-Matter-Controller-Configuration
---
# Controlador Matter

<div data-matter-controller-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#241047 0%,#5531a7 55%,#8b5cf6 100%);box-shadow:0 14px 30px rgba(36,16,71,0.25);color:#faf7ff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#e3d7ff;">Fabric Matter · Comisionado · KNX</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Tu fabric Matter, bajo tu control.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#faf7ff;">Comisiona dispositivos por la red IP y ofrece sus endpoints a KNX y Node-RED. Empareja, supervisa, respalda y elimina desde un único nodo de configuración.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Fabric local</strong><span style="font-size:0.76rem;color:#eee7ff;">credenciales privadas</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">QR + manual</strong><span style="font-size:0.76rem;color:#eee7ff;">códigos de emparejado</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Exportar / Importar</strong><span style="font-size:0.76rem;color:#eee7ff;">copia protegida</span></div>
  </div>
</div>

## Un controlador para todo el ciclo de vida

| Área | Funcionalidades |
|---|---|
| **Comisionado** | Payload QR Matter, escaneo con webcam o imagen, código manual y emparejado multi-fabric por WiFi, Ethernet o Thread. |
| **Gestión de dispositivos** | Inventario, estado de conexión, eliminación segura y colas de comandos independientes por dispositivo. |
| **KNX y Node-RED** | Mapeo de endpoints, Modo universal, comandos dinámicos y monitor universal de baterías. |
| **Resiliencia y almacenamiento** | Fabric persistente, copia/restauración, bloqueo de dispositivos no disponibles y recuperación automática. |

## Primeros pasos en cuatro movimientos

1. Añade Matter Controller y haz **deploy**.
2. Ábrelo de nuevo y comisiona un dispositivo con el payload QR Matter o el código manual.
3. Añade **Control Matter from KNX** y elige el dispositivo y su perfil.
4. Mapea las direcciones de grupo KNX o habilita los PINes de Node-RED y despliega.

> **Consejo:** prefiere el payload QR `MT:...`: contiene el discriminador completo; el código manual de 11 cifras solo contiene el corto.

## Vista técnica

Este nodo de configuración es un **controlador Matter** completo: crea su propia *fabric* Matter y empareja (comisiona) tus dispositivos Matter. Los dispositivos emparejados quedan disponibles para los nodos **Matter Device**, que los mapean a direcciones de grupo KNX.

El controlador se comunica con los dispositivos a través de la **red IP** (WiFi, Ethernet o Thread mediante un border router). El emparejamiento por Bluetooth no está soportado: el dispositivo debe estar ya accesible en la red.

## Emparejar un dispositivo

1. Haz primero el **deploy** de este nodo de configuración (el controlador debe estar en ejecución).
2. Vuelve a abrir el nodo e introduce el **código de emparejamiento**: el código manual de 11 dígitos (p.ej. `3497-011-2332`) o el contenido del código QR (`MT:....`).
3. Para un código escrito manualmente, pulsa **EMPAREJAR**. Un QR leído con **Webcam** o **Imagen** inicia automáticamente el emparejamiento. El comisionado puede tardar hasta un minuto.

En lugar de escribir el payload QR, pulsa **Webcam** para escanearlo en directo o **Imagen** para leerlo desde una foto local. Se admiten tanto los códigos QR estándar oscuros sobre fondo claro como los invertidos blancos sobre fondo oscuro. La decodificación se realiza íntegramente en el navegador; tras leer un QR Matter válido, el editor rellena el campo del código e inicia inmediatamente el emparejamiento. Introduce antes el nombre opcional del dispositivo si lo deseas. Un código escrito manualmente sigue iniciándose solo al pulsar **EMPAREJAR**. El acceso en directo a la webcam requiere que el editor se abra mediante HTTPS o desde `localhost`; si no es posible, el editor explica la limitación y la carga de imágenes sigue disponible.

Durante el comisionado, un panel de espera bloqueante cubre el editor e impide más clics hasta que la operación finaliza correctamente o con un error.

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

La lista contiene una fila por cada nodo almacenado actualmente en la fabric Matter de este controlador. Los Node ID son únicos dentro de esa fabric; los endpoints expuestos por un único bridge comisionado no se muestran como dispositivos separados. La columna de estado indica si cada nodo está conectado, desconectado, reconectando o esperando ser descubierto.

El controlador conserva por separado el orden de comandos de cada dispositivo emparejado. Un dispositivo lento, sin conexión o eliminado no puede bloquear los comandos destinados a otros dispositivos. Los nodos Controller que aún referencian un Node ID eliminado rechazan inmediatamente los nuevos comandos y muestran **Device no longer commissioned**.

Cuando un dispositivo deja de estar disponible, sus nodos Controller permanecen bloqueados e ignoran los comandos posteriores hasta que ese dispositivo vuelve a informar `connected`. La recuperación es automática; abrir el editor del nodo de dispositivo también libera el bloqueo para un reintento manual.

En el monitor universal, las salidas KNX opcionales publican la alarma global como DPT 1.005 y alternan cada 2 segundos los dispositivos como texto DPT 16.001 de 14 bytes.
