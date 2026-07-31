---
layout: wiki
title: "Matter-Bridge-Configuration"
lang: es
permalink: /wiki/es-Matter-Bridge-Configuration
---
# Bridge Matter (BETA)

<div data-matter-bridge-config-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0d314f 0%,#176b91 55%,#27a9c7 100%);box-shadow:0 14px 30px rgba(13,49,79,0.25);color:#f3fbff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#d1f3ff;">Servidor Matter · Multi-fabric · Identidad persistente</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Empareja un bridge. Expón todos los dispositivos KNX.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f3fbff;">Este nodo de configuración posee el servidor Matter, la identidad del bridge y las sesiones de los controladores. Alexa, Google Home, Apple Home y otros controladores lo emparejan una vez; los nodos device aparecen después como endpoints live.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Empareja una vez</strong><span style="font-size:0.76rem;color:#e0f7ff;">QR + código manual</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Multi-fabric</strong><span style="font-size:0.76rem;color:#e0f7ff;">varios controladores</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Conciliación live</strong><span style="font-size:0.76rem;color:#e0f7ff;">endpoints en segundos</span></div>
  </div>
</div>

## El bridge de un vistazo

| Área | Funcionalidades |
|---|---|
| **Emparejamiento** | QR y código manual, varias fabrics Matter y restablecimiento explícito. |
| **Identidad** | Identidad estable durante deploys normales, cambios de nombre y conciliación de endpoints. |
| **Escala** | Varios bridges independientes en puertos UDP distintos y cualquier número de nodos device. |
| **Protección** | Exportación/importación de fabrics, credenciales privadas, sesiones y datos de emparejado. |

> **BETA:** el bridge está operativo, pero algunos detalles pueden evolucionar. Protege la copia como una contraseña y usa **Restablecer emparejamiento** solo para eliminar todos los controladores.

## Vista técnica

Este nodo de configuración es el **bridge Matter en sí**: ejecuta el servidor Matter que Alexa, Google Home, Apple Home (o cualquier controlador Matter) emparejan **una sola vez**. Cada nodo **Matter Bridge device** de tus flows apunta aquí y aparece en las apps como un dispositivo del bridge.

Los editores de dispositivos Matter Bridge muestran **Mapeos** y **Opciones avanzadas** como pestañas verticales a la izquierda, igual que Matter Controller.

El selector **Pines de entrada/salida del nodo** está fuera de esas pestañas. Al activarlo aparece justo debajo una sección contextual **Entrada/salida del flow**, con ejemplos copiables Flow → Matter y Matter → Flow filtrados según el tipo de dispositivo.

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
