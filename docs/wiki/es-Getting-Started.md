---
layout: wiki
title: "Primeros pasos"
lang: es
permalink: /wiki/es-Getting-Started
translation_key: "Getting-Started"
---

# Primeros pasos

Para una nueva instalación, sigue estos pasos. Si tus flujos ya usan KNX Ultimate 7, completa primero la guía de actualización.

> [Actualizar desde la versión 7]({{ '/wiki/es-Migration-8' | relative_url }})

Requiere Node.js 20.18.1 o posterior y Node-RED 3.1.1 o posterior.

1. Abre **Gestionar paleta → Instalar** e instala `node-red-contrib-knx-ultimate`. Reinicia Node-RED.

2. Arrastra **KNX Device** al flow. Añade un gateway con la dirección y los parámetros de conexión de tu interfaz KNX. Importa las direcciones ETS si están disponibles.

3. Elige una dirección de grupo de tu instalación y su datapoint. Para encendido/apagado, usa el datapoint booleano previsto, por ejemplo `1.001`.

4. Conecta un nodo **Inject** con `msg.payload` booleano (`true` o `false`) a KNX Device. Conecta su salida a **Debug** para ver los telegramas recibidos.

5. Revisa la dirección y pulsa **Deploy**. Usa Inject para enviar el comando. Activa **React to response** para ver las respuestas a las solicitudes de lectura.

## El primer flow, paso a paso

La animación de abajo construye un primer flow: un nodo **KNX Device** para la dirección de grupo `1/1/0` con el datapoint `1.001`, su configuración de pasarela y un nodo **Debug**.

1. Arrastra **KNX DEVICE** desde la paleta al flow y haz doble clic.
2. Junto a **Gateway**, pulsa **+**. La configuración de la pasarela busca las interfaces KNX/IP de la red: escribe la dirección de la tuya (aquí `192.168.1.117`) y elígela en la lista. La dirección, el puerto y el protocolo se rellenan. Pulsa **Add**.
3. En **Group Addr.** escribe `1/1/0`, ponle un nombre al nodo y deja el datapoint `1.001 Switch`. Pulsa **Done**.
4. Arrastra un nodo **Debug** al flow, conecta la salida de KNX Device y pulsa **Deploy**.

Cuando el nodo muestra **Connected. On duty.**, cada telegrama enviado a `1/1/0` en el bus aparece en la barra lateral **Debug**.

![Creación de un nodo KNX Device para la dirección de grupo 1/1/0, de su configuración de pasarela y de un nodo Debug](/node-red-contrib-knx-ultimate/assets/getting-started/first-flow.gif)

## Leer un valor del bus

Activa el botón manual de KNX Device. Las acciones son **Toggle boolean**, **Enviar KNX Read** (segunda opción) y **Escribir valor personalizado**. Elige Read y pulsa el botón para consultar la dirección configurada. Esta acción no está disponible en modo universal. Desde un flow también puedes enviar `msg.readstatus = true`.

[KNX Device]({{ '/wiki/es-Device' | relative_url }}) · [KNX Gateway]({{ '/wiki/es-Gateway-configuration' | relative_url }}) · [Ejemplos]({{ '/wiki/es--SamplesHome' | relative_url }})

## Tutoriales en vídeo

[Max Supervibe — YouTube](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)
