---
layout: wiki
title: "zh-CN-HATranslator"
lang: es
permalink: /wiki/es-zh-CN-HATranslator
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HATranslator) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HATranslator) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HATranslator) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HATranslator) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HATranslator) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HATranslator)
---
<p> Este nodo convierte el mensaje de entrada a un valor válido verdadero/falso.<p>
Puede convertir la carga útil de entrada a verdadero /falso booleano.<Br />
Cada línea en el cuadro de texto representa un comando de traducción.<br/>
Puede agregar sus propias líneas de traducción.<br/>
| Propiedades | Descripción |
|-|-|
| Nombre | Nombre del nodo. |
|Entrada de las propiedades de MSG de entrada para evaluar y traducir.|
| Traducción | Agregar, eliminar o editar sus propios comandos de traducción.El comando de traducción para esta línea debe ser la cadena de entrada \*\*, desde HA: valor KNX \*\* (_knx valu _ &#x4e3a; verdadero o falso).Por ejemplo: <code> Open: true </code> <code> cerrado: falso </code>. |
<br/>
