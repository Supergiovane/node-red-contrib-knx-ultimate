---
layout: wiki
title: "FAQ-Troubleshoot"
lang: es
permalink: /wiki/es-FAQ-Troubleshoot
---
---
# Preguntas frecuentes y solución de problemas
¡Gracias por usar mis nodos de Node-RED! Si estás aquí probablemente tengas un problema: no te preocupes, lo resolvemos. KNX-Ultimate es estable y se usa ampliamente. Sigue los puntos de abajo; al final tienes cómo contactarme.
Requisito mínimo: **Node.js >= 16**
## El nodo no funciona
- ¿Has creado el [Gateway configuration node](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) con la IP/puerto correctos hacia tu KNX/IP Router o Interface?
- KNX/IP **Router ** : en**Host** pon la dirección multicast KNX `224.0.23.12`, puerto `3671`.
- KNX/IP **Interface ** : en**Host** pon la IP del interface (p. ej. `192.168.1.22`), puerto `3671`.
- Si tienes **varias tarjetas de red ** (Ethernet/Wi-Fi), indica cuál usar en el Gateway o deshabilita el Wi-Fi. Después,**reinicia Node-RED** .
- Usa solo routers/interfaces KNX/IP "puros” y certificados. Evita dispositivos "all-in-one” o proxies no dedicados al routing KNX/IP.
- Con un interface IP, prueba a deshabilitar el ACK seleccionando "Suppress ACK request” en el Gateway.
- Consulta también "Solo puedo recibir / no enviar”.
- Si Node-RED corre en un contenedor, retrasa unos segundos su arranque: a veces la tarjeta de red aún no está lista.
## Después de un tiempo deja de funcionar
- Relee "El nodo no funciona”.
- Deshabilita la protección DDOS/UDP flood en switches/routers (puede bloquear el UDP de KNX).
- Prueba una conexión directa entre el PC y el KNX/IP.
- Evita interfaces baratos/all-in-one: mejor un **KNX/IP Router** .
- Con interfaces IP, vigila el límite de conexiones simultáneas (manual del fabricante). Los routers no tienen ese límite.
## Configuración de knxd
- knxd en la misma máquina que Node-RED: usa `127.0.0.1` como interfaz.
- Revisa las tablas de filtrado y ajusta la dirección física del config-node.
## Veo el telegrama en ETS pero el actuador no reacciona
Puede que tengas otros plug-ins KNX para Node-RED instalados.
- Quita todos los plug-ins KNX de la paleta y deja solo KNX-Ultimate (elimina también los config-nodes ocultos).
- Con interfaces IP, prueba "Suppress ACK request” en el Gateway.
## Solo puedo recibir telegramas, no enviar (o viceversa)
Puede haber filtrado activo en el Router/Interface.
- En ETS habilita el **forwarding** en todas las páginas del router, o cambia la dirección física del config-node según las tablas de filtro.
- Con knxd, revisa las tablas de filtrado y ajusta la dirección física.
## No puedo escribir en el bus con un interface KNX/IP Weinzierl (o similar)
Algunos **interfaces ** KNX/IP, como la serie**Weinzierl KNX IP Interface 73x** , pueden no devolver el ACK del `L_Data.req` en el tiempo esperado, sobre todo a través de**enlaces VPN o de alta latencia** . En ese caso recibes telegramas pero la escritura en el bus falla en silencio.
- Activa **Suppress ACK request ** en el [Gateway configuration node](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration). En una Weinzierl 732 conectada a través de VPN, esto resolvió la escritura.
## Valores incorrectos del nodo
- Usa el Datapoint correcto (temperatura: `9.001`).
- Si puedes, importa el CSV de ETS en el Gateway: tendrás siempre los DPT correctos.
- Evita tener dos nodos con **el mismo GA ** pero**distinto DPT** .
## Mensajes entre nodos con el mismo GA no se propagan
Ocurre con conexiones tunneling/unicast (KNX/IP Interface o knxd).
- En las versiones actuales, las escrituras locales ya se reflejan automáticamente en los nodos KNX Device con el mismo GA. Si aún ves incoherencias, verifica que los nodos usen el mismo gateway config-node y el mismo Group Address.
## Secure KNX Router/Interfaces
En modo secure no funcionan; funcionan si permites conexiones no seguras.
- Desactiva el routing secure o permite conexiones no seguras.
- Para mayor aislamiento, conecta una segunda tarjeta de red dedicada entre Node-RED y el Router KNX, y configura "Bind to local interface” en el Gateway.
- La conexión secure podrá implementarse en el futuro.
## Flood protection
Evita saturar la UI y el BUS limitando los msg de entrada al nodo a un máximo de 120/segundo (ventana de 1s).
- Usa un nodo **delay** para repartir los mensajes.
- Usa el filtro **RBE** para descartar valores sin cambios.
  [Detalles](/node-red-contrib-knx-ultimate/wiki/Protections)
## Avisos sobre Datapoints tras importar ETS
- En ETS completa los DPT (incluido el subtipo, p. ej. `5.001`).
- O al importar elige "Import with a fake 1.001 datapoint (Not recommended)” o salta los GA afectados.
## Protección de referencias circulares
Evita bucles cuando dos nodos con el mismo GA se conectan directamente salida→entrada.
- Revisa el flujo: separa los dos nodos o pon un "moderador” en medio.
- Activa RBE para evitar rebotes.
  [Detalles](/node-red-contrib-knx-ultimate/wiki/Protections)
## Sigo teniendo problemas
- Abre una issue en [GitHub](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues) (preferido).
- O envíame un PM en [KNX-User-Forum](https://knx-user-forum.de) (usuario: TheMax74; escribe en inglés).
