---
layout: wiki
title: "HATranslator"
lang: es
permalink: /wiki/es-HATranslator
---

<!-- KNX_UTILITY_LEGACY_NOTICE -->
> Este nodo dedicado sigue siendo compatible con los flujos existentes. Para los nuevos flujos usa [KNX Utility](/node-red-contrib-knx-ultimate/wiki/es-KNX-Utility) y selecciona **Home Assistant Translator**. Su editor convierte todas las utilidades antiguas compatibles en todos los flujos y subflujos, con una sola operación Deshacer y Deploy manual.

Home Assistant Translator tiene una entrada y una salida y no necesita una pasarela KNX. Elige la propiedad del mensaje que se traducirá (por ejemplo `payload` o `data.new_state.state`) y edita las correspondencias `origen:true` / `origen:false`, como `open:true` y `closed:false`. Envía el valor booleano traducido en `msg.payload`; conecta la salida a KNX Device cuando necesites escribir en el bus.

Este nodo traduce el msg de entrada a valores válidos verdaderos/falsos. 

Puede traducir una carga útil de entrada, a valores booleanos verdaderos /falsos. 

Cada fila en el cuadro de texto representa un comando de traducción.

Puede agregar su propia fila de traducción. 

| Propiedad | Descripción |
|-|-|
|Nombre |El nombre del nodo.|
|Entrada |La propiedad de MSG de entrada a evaluar y traducir.|
|Traducir |Agregue, elimine o edite su propio comando de traducción.El comando de traducción de la fila debe ser **cadena de entrada de HA: valor KNX** (_knx value_ como verdadero o falso).Por ejemplo: <code> Open: true </code> <code> cerrado: falso </code>.|
