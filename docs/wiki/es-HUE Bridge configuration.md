---
layout: wiki
title: "HUE Bridge configuration"
lang: es
permalink: /wiki/es-HUE%20Bridge%20configuration
---
<h1>  Philips Hue Nodos 

 </h1>

 <img src = 'https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/huehub.jpg' width = '40%'> 

Este nodo registra Node-RED en el puente Hue y ahora realiza automáticamente el proceso de emparejamiento.

Introduce la IP del puente (o elige una de las detectadas automáticamente) y pulsa **CONNECT**. El editor seguirá consultando el puente y cerrará la ventana de espera en cuanto pulses el botón físico de enlace. Usa **CANCEL** si necesitas cancelar la espera y probar más tarde. Los campos de Nombre de usuario y Client Key permanecen editables para que puedas copiar o pegar las credenciales en cualquier momento.

¿Ya tienes las credenciales? Haz clic en **YA TENGO LAS CREDENCIALES** para mostrar los campos al instante e introducirlas manualmente sin esperar al botón del puente.

**General**

| Propiedad | Descripción |
|-|-|
| IP | Introduce la IP fija de tu puente Hue o selecciona uno de los puentes detectados automáticamente. |
| CONNECT | Inicia el registro y espera al botón de enlace del puente. La ventana se cierra automáticamente cuando lo pulsas; utiliza **CANCEL** para detener la espera. |
| Nombre | Nombre del puente leído desde la Hue Bridge después de una conexión correcta. |
| Username / Client Key | Credenciales devueltas por la Hue Bridge tras el emparejamiento. Permanecen editables para poder copiar, pegar o escribir valores manualmente. |

![Image.png](../ img/hude-config.png)
