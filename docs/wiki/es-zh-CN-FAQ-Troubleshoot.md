🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) | [IT](/node-red-contrib-knx-ultimate/wiki/it-FAQ-Troubleshoot) | [DE](/node-red-contrib-knx-ultimate/wiki/de-FAQ-Troubleshoot) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-FAQ-Troubleshoot) | [ES](/node-red-contrib-knx-ultimate/wiki/es-FAQ-Troubleshoot) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-FAQ-Troubleshoot)
<!-- NAV START -->
Navigation: [Home](/node-red-contrib-knx-ultimate/wiki/Home)  
Overview: [Changelog](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/CHANGELOG.md) • [FAQ](/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) • [Security](/node-red-contrib-knx-ultimate/wiki/SECURITY) • [Docs: Language bar](/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar)  
KNX Device: [Gateway](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) • [Device](/node-red-contrib-knx-ultimate/wiki/Device) • [Protections](/node-red-contrib-knx-ultimate/wiki/Protections)  
Other KNX Nodes: [Scene Controller](/node-red-contrib-knx-ultimate/wiki/SceneController-Configuration) • [WatchDog](/node-red-contrib-knx-ultimate/wiki/WatchDog-Configuration) • [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) • [Global Context](/node-red-contrib-knx-ultimate/wiki/GlobalVariable) • [Alerter](/node-red-contrib-knx-ultimate/wiki/Alerter-Configuration) • [Load Control](/node-red-contrib-knx-ultimate/wiki/LoadControl-Configuration) • [Viewer](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [Auto Responder](/node-red-contrib-knx-ultimate/wiki/KNXAutoResponder) • [HA Translator](/node-red-contrib-knx-ultimate/wiki/HATranslator) • [IoT Bridge](/node-red-contrib-knx-ultimate/wiki/IoT-Bridge-Configuration)  
HUE: [Bridge](/node-red-contrib-knx-ultimate/wiki/HUE+Bridge+configuration) • [Light](/node-red-contrib-knx-ultimate/wiki/HUE+Light) • [Battery](/node-red-contrib-knx-ultimate/wiki/HUE+Battery) • [Button](/node-red-contrib-knx-ultimate/wiki/HUE+Button) • [Contact](/node-red-contrib-knx-ultimate/wiki/HUE+Contact+sensor) • [Device SW update](/node-red-contrib-knx-ultimate/wiki/HUE+Device+software+update) • [Light sensor](/node-red-contrib-knx-ultimate/wiki/HUE+Light+sensor) • [Motion](/node-red-contrib-knx-ultimate/wiki/HUE+Motion) • [Scene](/node-red-contrib-knx-ultimate/wiki/HUE+Scene) • [Tap Dial](/node-red-contrib-knx-ultimate/wiki/HUE+Tapdial) • [Temperature](/node-red-contrib-knx-ultimate/wiki/HUE+Temperature+sensor) • [Zigbee connectivity](/node-red-contrib-knx-ultimate/wiki/HUE+Zigbee+connectivity)  
Samples: [Logger](/node-red-contrib-knx-ultimate/wiki/Logger-Sample) • [Switch Light](/node-red-contrib-knx-ultimate/wiki/-Sample---Switch-light) • [Dimming](/node-red-contrib-knx-ultimate/wiki/-Sample---Dimming) • [RGB color](/node-red-contrib-knx-ultimate/wiki/-Sample---RGB-Color) • [RGBW color + White](/node-red-contrib-knx-ultimate/wiki/-Sample---RGBW-Color-plus-White) • [Command a scene actuator](/node-red-contrib-knx-ultimate/wiki/-Sample---Control-a-scene-actuator) • [Datapoint 213.x 4x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT213) • [Datapoint 222.x 3x Setpoint](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT222) • [Datapoint 237.x DALI diags](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT237) • [Datapoint 2.x 1 bit proprity](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT2) • [Datapoint 22.x RCHH Status](/node-red-contrib-knx-ultimate/wiki/-Sample---DPT22) • [Datetime to BUS](/node-red-contrib-knx-ultimate/wiki/-Sample---DateTime-to-BUS) • [Read Status](/node-red-contrib-knx-ultimate/wiki/-Sample---Read-value-from-Device) • [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device) • [Subtype decoded](/node-red-contrib-knx-ultimate/wiki/-Sample---Subtype) • [Alexa](/node-red-contrib-knx-ultimate/wiki/-Sample---Alexa) • [Apple Homekit](/node-red-contrib-knx-ultimate/wiki/-Sample---Apple-Homekit) • [Google Home](/node-red-contrib-knx-ultimate/wiki/-Sample---Google-Assistant) • [Switch on/off POE port of Unifi switch](/node-red-contrib-knx-ultimate/wiki/-Sample---UnifiPOE) • [Set configuration by msg](/node-red-contrib-knx-ultimate/wiki/-Sample-setConfig) • [Scene Controller node](/node-red-contrib-knx-ultimate/wiki/Sample-Scene-Node) • [WatchDog node](/node-red-contrib-knx-ultimate/wiki/-Sample---WatchDog) • [Global Context node](/node-red-contrib-knx-ultimate/wiki/SampleGlobalContextNode) • [Alerter node](/node-red-contrib-knx-ultimate/wiki/SampleAlerter) • [Load control node](/node-red-contrib-knx-ultimate/wiki/SampleLoadControl) • [Viewer node](/node-red-contrib-knx-ultimate/wiki/knxUltimateViewer) • [MySQL, InfluxDB, MQTT Sample](/node-red-contrib-knx-ultimate/wiki/Sample-KNX2MQTT-KNX2MySQL-KNX2InfluxDB)  
Contribute to Wiki: [Link](/node-red-contrib-knx-ultimate/wiki/Manage-Wiki)
<!-- NAV END -->
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