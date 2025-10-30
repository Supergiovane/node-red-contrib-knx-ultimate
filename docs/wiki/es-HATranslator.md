---
layout: wiki
title: "HATranslator"
lang: es
permalink: /wiki/es-HATranslator
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HATranslator) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HATranslator) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HATranslator) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HATranslator) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HATranslator) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator)

Este nodo traduce el msg de entrada a valores válidos verdaderos/falsos. 

Puede traducir una carga útil de entrada, a valores booleanos verdaderos /falsos. 

Cada fila en el cuadro de texto representa un comando de traducción.

Puede agregar su propia fila de traducción. 

| Propiedad | Descripción |
|-|-|
|Nombre |El nombre del nodo.|
|Entrada |La propiedad de MSG de entrada a evaluar y traducir.|
|Traducir |Agregue, elimine o edite su propio comando de traducción.El comando de traducción de la fila debe ser **cadena de entrada de HA: valor KNX** (_knx value_ como verdadero o falso).Por ejemplo: <code> Open: true </code> <code> cerrado: falso </code>.|
