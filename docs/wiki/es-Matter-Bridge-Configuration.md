---
layout: wiki
title: "Matter-Bridge-Configuration"
lang: es
permalink: /wiki/es-Matter-Bridge-Configuration
---
# Bridge Matter (BETA)

> Este nodo está en **BETA**: funciona, pero algunos detalles pueden cambiar entre versiones.

## Descripción general

Este nodo de configuración es el **bridge Matter en sí**: ejecuta el servidor Matter que Alexa, Google Home, Apple Home (o cualquier controlador Matter) emparejan **una sola vez**. Cada nodo **Matter Bridge device** de tus flows apunta aquí y aparece en las apps como un dispositivo del bridge.

Los editores de dispositivos Matter Bridge muestran **Mapeos** y **Opciones avanzadas** como pestañas verticales a la izquierda, igual que Matter Controller.

## Configuración

|Campo|Descripción|
|--|--|
| Nombre | El nombre de este nodo de configuración en Node-RED |
| Nombre del bridge Matter | Cómo se llama el bridge en las apps Matter. **Déjalo vacío para reutilizar el Nombre de este nodo.** |
| Puerto | Puerto UDP del servidor Matter (por defecto 5540). Cada bridge necesita su propio puerto, por lo que puedes ejecutar **varios bridges independientes** |

## Emparejamiento

1. Haz **deploy**, espera unos segundos y vuelve a abrir este nodo.
2. El panel de emparejamiento muestra el **código QR** y el **código manual**: escanéalo o escríbelo en Alexa / Google Home / Apple Home ("añadir dispositivo Matter").
3. Se pueden emparejar varios controladores con el mismo bridge (multi-fabric Matter).

Para añadir otro controlador cuando el código QR está oculto, abre el modo de emparejamiento desde un controlador ya vinculado y añade un dispositivo Matter en el nuevo controlador. Usa **Restablecer emparejamiento** solo para eliminar todos los controladores existentes y empezar de nuevo.

El botón **Restablecer emparejamiento** elimina todos los controladores emparejados y reinicia el anuncio de emparejamiento.

## Identidad y almacenamiento

La identidad del bridge está ligada a este nodo de configuración y se guarda en `knxultimatestorage/matter` dentro del directorio de usuario de Node-RED: los re-deploys (incluso cambiando puerto o nombre) **NO** requieren un nuevo emparejamiento. Solo borrar este nodo de configuración y crear uno nuevo cambia la identidad — en ese caso elimina el bridge antiguo de la app Matter y vuelve a emparejar.

Usa **Exportar** para descargar una copia completa de esta instancia del bridge, con fabrics, credenciales privadas, sesiones y datos de vinculación. **Protege el archivo como una contraseña.** La importación reemplaza el almacenamiento de esta instancia y reinicia brevemente el bridge. Una copia de bridge no se puede importar en un controlador.

## Notas

- El host de Node-RED debe tener **IPv6 link-local** habilitado (requisito estándar de Matter) y ser accesible desde los controladores en la red local.
- Los nodos de dispositivo añadidos/renombrados/eliminados se detectan en pocos segundos, sin volver a emparejar.
- **Nombres:** Alexa y Google Home respetan los nombres que pongas aquí (nombre del bridge y nombres de los nodos de dispositivo). **Apple Home los ignora y te pide nombrar cada accesorio manualmente durante la configuración** — es una limitación de Apple, no del bridge.
