---
layout: wiki
title: "zh-CN-FAQ-Troubleshoot"
lang: es
permalink: /wiki/es-zh-CN-FAQ-Troubleshoot/
---
---
#Faq y solución de problemas
¡Gracias por usar mi nodo de nodo -rojo!Si tiene problemas, no se preocupe: simplemente siga la lista a continuación para verificar el elemento por elemento.KNX -Ulimate ha sido ampliamente utilizado y es estable y confiable.
Requisitos mínimos: **node.js> = 16**
## El nodo no funciona
- ¿El [nodo de configuración de la puerta de enlace](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) (apuntando a su enrutador KNX/IP o el IP/puerto de interfaz) creado y configurado correctamente?
- KNX/IP **Router ** :**Host** Complete `224.0.23.12`, puerto` 3671`.
- Interfaz KNX/IP * ***:** Host**Complete la IP del dispositivo (como `192.168.1.22`), puerto` 3671`.
- Cuando existan múltiples NIC ** (Ethernet/Wireless), especifique las NIC para usar en la puerta de enlace o deshabilitar Wi-Fi.Después de la modificación, asegúrese de reiniciar el nodo -rojo** .
- Use solo el enrutador KNX/IP certificado o la interfaz KNX/IP para evitar dispositivos "All -In -One/Agent".
- Al usar la interfaz, puede habilitar la prueba de "Suprimir la solicitud ACK" en la puerta de enlace.
- Consulte "Recibir solo / no puede enviar" a continuación.
- Si se ejecuta en un contenedor, retrase el nodo inicial -rojo** ligeramente (a veces la tarjeta de red no está lista).
## pare después de correr por un tiempo
- Consulte la sección anterior "Los nodos no pueden funcionar".
- Temporalmente **Apague la protección de inundación DDOS/UDP en el interruptor/enrutador** (puede interceptar los paquetes UDP de KNX).
- Conecte directamente los dispositivos KNX/IP a la prueba de host de nodo -rojo.
- Evite las interfaces baratas o totales, y da prioridad al enrutador **KNX/IP** .
- Tenga en cuenta el límite de conexión concurrente cuando se usa la interfaz (consulte el manual del producto).El enrutador generalmente no tiene tal limitación.
## Configuración KNXD
- **KNXD** Cuando está en el mismo host que el nodo -rojo, se recomienda usar la interfaz para usar `127.0.0.1`.
- Verifique las tablas de filtro y ajuste la dirección física del nodo de configuración en consecuencia.
- Habilitar "Mensaje enviado a Echo a todos los nodos con la misma dirección de grupo" en Gateway.
## ETS puede ver mensajes, pero el ejecutor no tiene respuesta
Puede entrar en conflicto con otros complementos KNX.
- Retire otros complementos KNX de la paleta roja de nodo, manteniendo solo KNX-Ulimate (y también elimine los nodos de configuración ocultos).
- Encienda la prueba de "Suprimir la solicitud ACK" en la puerta de enlace cuando use la interfaz.
## solo puede recibir, no enviar (o viceversa)
Su enrutador/interfaz puede tener un filtrado habilitado.
- Permitir **reenvío** en ETS; o ajuste la dirección física del nodo de configuración en función de la tabla de filtro del enrutador.
- Cuando use **KNXD** , verifique la tabla del filtro y ajuste la dirección física en consecuencia.
## Error en el valor
- Use el punto de datos correcto (temperatura: `9.001`).
- Importar ETS CSV en la puerta de enlace para obtener el DPT correcto.
- Evite dos nodos usando el mismo ga **pero diferente dpt** .
## No "intercomunicación" entre nodos de la misma GA
Comúnmente encontrado en túneles/unidifusión (interfaz, KNXD).
- Habilitar "Mensaje enviado a Echo a todos los nodos con la misma dirección de grupo" en Gateway.
## SEGUS KNX Router/Interfaces
No es compatible cuando el modo seguro está habilitado; Si se permiten conexiones no seguras, puede funcionar correctamente.
- Cierre el enrutamiento seguro o permita conexiones inseguras.
- Opcional: agregue una tarjeta de red dedicada directamente conectada al enrutador KNX a nodo -rojo y configure "BIND a la interfaz local" en la puerta de enlace.
- Las conexiones seguras pueden ser compatibles en el futuro.
## Protección contra inundaciones (protección límite actual)
Para evitar la UI y la sobrecarga de bus: cada nodo predeterminado recibe hasta 120 mensajes dentro de una ventana de 1 segundo.
- Use el nodo **Retraso** para dispersar los mensajes.
- Filtrar valores duplicados usando **rbe** .
[Detalles](/node-red-contrib-knx-ultimate/wiki/Protections)
## La advertencia de DataPoint aparece después de importar ETS
- Complete ETS (subtipos, como `5.001`).
- o seleccione "Importar con un punto de datos FALSO 1.001 (no recomendado)" al importar o omitir la GA relacionada.
## Protección de referencia circular
Cuando dos nodos están conectados directamente con la misma GA → In, el sistema lo deshabilitará para evitar el bucleback.
- Proceso de ajuste: divida estos dos nodos, o agregue los nodos de "mediación/búfer".
- Habilitar **rbe** para evitar loopback.
[Detalles](/node-red-contrib-knx-ultimate/wiki/Protections)
## ¿Todavía tienes problemas?
- Se recomienda hacer un problema (prioridad) en [GitHub](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues).
- O envíeme un mensaje privado a [KNX -USER - FORUM](https://knx-user-forum.de) (Usuario: Themax74; por favor en inglés).
