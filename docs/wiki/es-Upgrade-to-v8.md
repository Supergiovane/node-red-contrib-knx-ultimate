---
layout: wiki
title: "Actualizar a KNX Ultimate 8"
lang: es
permalink: /wiki/es-Upgrade-to-v8
---
# Actualizar a KNX Ultimate 8

La versión 7 muestra un pequeño botón **Actualizar a v8** en la parte superior del editor de cada nodo KNX Ultimate. Una única operación guiada realiza la migración; no instales manualmente la versión 8 antes de usarla.

## Qué hace el botón

1. Descarga una copia JSON de todos los flujos presentes en el editor. Como en la exportación estándar de Node-RED, el archivo no incluye las credenciales protegidas, que permanecen guardadas en Node-RED.
2. Instala HUE Ultimate y/o Matter Ultimate solo cuando los flujos contienen nodos que necesitan esos paquetes.
3. Convierte en el mismo lugar los nodos KNX Utility, HUE y Matter compatibles, conservando ID, conexiones, grupos, referencias de configuración y datos de Matter.
4. Realiza un Deploy completo y vuelve a leer los flujos guardados en Node-RED. KNX Ultimate 8 solo se instala si no queda ningún tipo de nodo eliminado.
5. Solicita reiniciar el servicio Node-RED. Este reinicio es obligatorio; recargar únicamente el navegador no es suficiente.

El formulario del nodo actual se cierra al comenzar, por lo que debes guardar primero cualquier cambio realizado en ese formulario. La cuenta debe poder leer y desplegar flujos e instalar/actualizar módulos de la paleta.

Si ya está instalada una versión antigua del paquete independiente HUE Ultimate o Matter Ultimate, el botón prepara primero su actualización y solicita un reinicio preliminar del servicio. Vuelve a cargar el editor y pulsa otra vez el botón; durante ese paso preliminar no se modifica ningún flujo. Una instalación normal de la versión 7 no necesita este reinicio adicional.

## Paradas de seguridad

La operación se detiene antes de modificar nada si encuentra un flujo bloqueado, un nodo desconocido o no válido ajeno a la migración, o un nodo antiguo KNX AI / KNX AI Home Assistant. La configuración de AI no se puede convertir de forma segura a Cerebrum Ultimate; sustituye o elimina manualmente esos pocos nodos y vuelve a pulsar el botón.

Si la instalación de un paquete falla antes del Deploy, se deshace la conversión del editor. Si el flujo convertido ya se ha desplegado pero falla la instalación de KNX Ultimate 8, la versión 7 y los paquetes separados siguen funcionando: corrige el error indicado y ejecuta de nuevo el botón.

Si una solicitud de paquete agota el tiempo y puede seguir en curso, no realices ningún Deploy: reinicia el servicio Node-RED, vuelve a cargar el editor y pulsa de nuevo el botón.

Si una interrupción de la conexión impide verificar el resultado del Deploy, la operación no presupone el resultado ni aplica una reversión automática. Vuelve a cargar el editor y revisa los flujos guardados antes de intentarlo de nuevo. Si otro editor cambió la revisión de los flujos, solo se revierte localmente la conversión automática; revisa o exporta los cambios locales previos y vuelve a cargar el editor.

Node-RED puede ejecutarse como servicio del sistema, contenedor Docker, complemento de Home Assistant u otro supervisor; por eso el editor no puede emitir un único comando de reinicio seguro para todos los entornos.
