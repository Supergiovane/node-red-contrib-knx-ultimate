---
layout: wiki
title: "Home"
lang: es
permalink: /wiki/es-Home
---
# Presentación profesional de los nodos KNX Ultimate
## knxUltimate-config
**Para qué sirve**: definir los parámetros del gateway KNX/IP y compartirlos con el resto de nodos.
**Funciones clave**: soporte tunnelling/Secure, importación ETS CSV con autocompletado, diagnóstico de conexión y monitor de bus.
**Cómo se configura**: introduce host y puerto, elige la NIC, importa el fichero ETS y activa las opciones Secure o de monitor si hacen falta.
## hueConfig
**Para qué sirve**: gestionar la autenticación con el bridge Philips Hue y distribuir el token entre los nodos Hue.
**Funciones clave**: asistente de emparejamiento, tokens persistentes, EventStream, fallback REST, gestión de TLS/reloj.
**Cómo se configura**: pulsa el botón link del bridge, sigue el asistente, selecciona EventStream o polling y guarda el nombre de configuración.
## knxUltimate
**Para qué sirve**: leer y escribir telegramas KNX con conversión automática de DPT.
**Funciones clave**: autocompletado de GA, filtros ETS, gestión de prioridades, estadísticas runtime, Node Pins opcionales.
**Cómo se configura**: selecciona el gateway, ajusta el DPT correcto, decide ACK/reintentos y habilita pins o filtros según la lógica del flujo.
## knxUltimateSceneController
**Para qué sirve**: orquestar escenas KNX de varios pasos con condiciones y override manual.
**Funciones clave**: secuencias programables, disparadores condicionales, memoria de escenas, controles manuales.
**Cómo se configura**: define las escenas destino, configura retrasos y condiciones y cablea los disparadores mediante Node Pins.
## knxUltimateWatchDog
**Para qué sirve**: vigilar gateways, dispositivos y GA y avisar si hay timeouts.
**Funciones clave**: pings cíclicos, registro de latencia, acciones de recuperación automáticas, métricas de estado.
**Cómo se configura**: indica las GA a vigilar, fija intervalos/timeouts y conecta las salidas a logs o alarmas.
## knxUltimateLogger
**Para qué sirve**: registrar telegramas y valores KNX para auditoría, diagnóstico o exportación.
**Funciones clave**: buffer circular, filtros por GA/DPT, exportación CSV/JSON, integración con contextos.
**Cómo se configura**: elige carpeta de salida, define retención y umbrales y activa las notificaciones o exportaciones necesarias.
## knxUltimateGlobalContext
**Para qué sirve**: sincronizar valores KNX con el contexto global de Node-RED.
**Funciones clave**: binding GA→context, sincronización bidireccional opcional, filtrado por DPT.
**Cómo se configura**: especifica el nombre de contexto, selecciona dirección de sincronización y configura Node Pins para actualizaciones externas.
## knxUltimateAlerter
**Para qué sirve**: generar alertas cuando los valores KNX cumplen reglas o superan umbrales.
**Funciones clave**: múltiples comparadores, histéresis, reset automático, salidas a email/MQTT/log.
**Cómo se configura**: define condiciones y mensajes y conecta las salidas con los canales deseados.
## knxUltimateLoadControl
**Para qué sirve**: equilibrar cargas eléctricas KNX y desconectar consumos no críticos al superar límites.
**Funciones clave**: grupos de carga, prioridades dinámicas, ciclos de shed/restore, buffer de eventos.
**Cómo se configura**: mapea las GA de medida, asigna prioridades a cada carga y establece tiempos de corte y recuperación.
## knxUltimateViewer
**Para qué sirve**: ofrecer dashboards HTML/JSON para monitorizar en vivo los telegramas KNX.
**Funciones clave**: tablas en tiempo real, tarjetas responsivas, exportación JSON, análisis de colas.
**Cómo se configura**: selecciona las GA a mostrar, personaliza etiquetas y frecuencia de refresco y publica el dashboard requerido.
## knxUltimateAutoResponder
**Para qué sirve**: responder automáticamente a lecturas KNX con el último valor disponible.
**Funciones clave**: caché de valores, mapeo multi-GA, actualizaciones externas via Node Pins, registro de actividad.
**Cómo se configura**: define las GA de escucha/respuesta, ajusta la retención de caché y conecta entradas externas si se necesitan.
## knxUltimateStaircase
**Para qué sirve**: controlar iluminación temporizada con aviso previo, override y reset automático.
**Funciones clave**: temporizadores múltiples, pulsos de preaviso, forzado manual, lectura al arranque.
**Cómo se configura**: configura GA de mando/estado, duración del temporizador y pins de override o reset según la instalación.
## knxUltimateGarage
**Para qué sirve**: gestionar puertas de garaje con impulsos, feedback y funciones de seguridad.
**Funciones clave**: comando por impulso, monitorización de estado, bloqueo de seguridad, lógica de fotocélulas, auto cierre.
**Cómo se configura**: asigna GA de mando/estado/alarma, define tiempos de carrera y ajusta las reglas de bloqueo o reapertura.
## knxUltimateIoTBridge
**Para qué sirve**: enlazar KNX con MQTT/REST/Modbus de forma bidireccional.
**Funciones clave**: tabla de mapeo, escalado de valores, acknowledgements a medida, buffer offline.
**Cómo se configura**: rellena la tabla de mapeo, configura los endpoints externos y define la estrategia de ack/reintentos.
## Panel KNX Monitor
**Para qué sirve**: mostrar en la barra lateral derecha de Node-RED, donde están las pestañas, el tráfico KNX en tiempo real.
**Funciones clave**: refresco cada segundo, resaltado de telegramas nuevos, toggles booleanos rápidos, reordenación opcional.
**Cómo se configura**: selecciona el gateway, activa/desactiva auto-refresh o reordenación y filtra las GA de interés.
## Panel KNX Debug
**Para qué sirve**: inspeccionar cada línea del log KNX en tiempo real desde la barra lateral sin abrir la consola del servidor.
**Funciones clave**: buffer circular de 5 000 líneas, colores por severidad, refresco automático/manual, copia con un clic al portapapeles.
**Cómo se configura**: abre la pestaña, deja activado el auto refresh (o pulsa Actualizar cuando lo necesites) y usa el icono de copiar para exportar el snapshot actual.
## knxUltimateHATranslator
**Para qué sirve**: traducir mensajes KNX a payloads de Home Assistant y al revés.
**Funciones clave**: mapeo DPT→entidad, asistentes de discovery, normalización booleana/numérica, ack opcionales.
**Cómo se configura**: define las entidades destino, ajusta conversiones y plantillas y conecta Node Pins para feedback.
## knxUltimateHueLight
**Para qué sirve**: controlar luces Hue desde KNX con encendido, dim, color y escenas dinámicas.
**Funciones clave**: mapeo multi-GA, perfiles día/noche, feedback de estado, Node Pins.
**Cómo se configura**: asigna GA para switch/estado/dimmer/color, configura rampas y modos de escena y habilita EventStream en el bridge.
## knxUltimateHueButton
**Para qué sirve**: recibir eventos de botones Hue y convertirlos en telegramas KNX.
**Funciones clave**: detección corto/largo, soporte multi recurso, mapeo DPT 1.xxx/18.xxx, debounce.
**Cómo se configura**: selecciona la dirección Hue, vincula GA por evento y ajusta filtros de rebote y feedback.
## knxUltimateHueMotion
**Para qué sirve**: integrar sensores de movimiento Hue dentro de KNX.
**Funciones clave**: salida booleana, filtros DPT, temporizaciones, Node Pins configurables.
**Cómo se configura**: define GA de movimiento/estado, establece timeout y gestiona la visibilidad de pins desde Behaviour.
## knxUltimateHueTapDial
**Para qué sirve**: usar Hue Tap Dial como controlador rotativo o selector de escenas en KNX.
**Funciones clave**: pasos incrementales/decrementales, mapeo DPT 3.007/5.001/personalizado, feedback opcional.
**Cómo se configura**: elige la recurso Hue, fija GA objetivo y sensibilidad y activa los pins necesarios.
## knxUltimateHueLightSensor
**Para qué sirve**: llevar al bus KNX los lux medidos por sensores Hue.
**Funciones clave**: conversión automática a DPT 9.004, suavizado, lectura inicial.
**Cómo se configura**: asigna GA de luminosidad, define filtros u offsets y decide si exponer Node Pins.
## knxUltimateHueTemperatureSensor
**Para qué sirve**: publicar en KNX las temperaturas de sensores Hue.
**Funciones clave**: conversión DPT 9.001, offset, sincronización inicial, Node Pins.
**Cómo se configura**: configura GA de temperatura, corrige si es necesario y habilita salidas para otros flujos.
## knxUltimateHueScene
**Para qué sirve**: disparar escenas Hue desde eventos KNX simples o múltiples.
**Funciones clave**: soporte DPT 1.xxx/18.xxx, reglas multi escena, feedback opcional.
**Cómo se configura**: selecciona las escenas Hue, asigna GA de disparo/estado y define mapeos avanzados si se requieren.
## knxUltimateHueBattery
**Para qué sirve**: supervisar el nivel de batería de dispositivos Hue dentro de KNX.
**Funciones clave**: conversión device_power→DPT 5.001, lectura al arranque, alertas por umbral, Node Pins.
**Cómo se configura**: define GA de porcentaje, ajusta umbrales de aviso y conecta notificaciones o registros.
## knxUltimateHueZigbeeConnectivity
**Para qué sirve**: informar en KNX del estado de conectividad Zigbee de los equipos Hue.
**Funciones clave**: mapeo booleano, lectura inicial, estrategias de fallback.
**Cómo se configura**: establece GA booleana y DPT, planifica acciones ante pérdida de enlace y conecta alarmas pertinentes.
## knxUltimateHueCameraMotion
**Para qué sirve**: exponer en KNX los eventos de movimiento de las cámaras Hue Secure.
**Funciones clave**: EventStream en tiempo real, mapeo booleano, anti falsos positivos, buffer inicial.
**Cómo se configura**: elige la cámara, configura GA/DPT, ajusta filtros y conecta salidas a lógicas de seguridad.
## knxUltimateContactSensor
**Para qué sirve**: sincronizar sensores magnéticos Hue (abierto/cerrado) con direcciones KNX.
**Funciones clave**: filtro de recurso `contact`, mapeo DPT 1.019, inversión lógica opcional, etiquetas ETS.
**Cómo se configura**: selecciona el sensor, mapea GA de estado/alarma y define alertas o retardos.
## knxUltimateHueHumiditySensor
**Para qué sirve**: enviar al bus KNX la humedad relativa medida por Hue.
**Funciones clave**: escalado DPT 9.007, suavizado opcional, lectura inicial, Node Pins.
**Cómo se configura**: asigna GA de humedad, establece filtros o umbrales y conecta las salidas necesarias.
## knxUltimateHuePlug
**Para qué sirve**: controlar enchufes Hue y recibir estado y potencia.
**Funciones clave**: comandos on/off, canales de estado/potencia, power availability, Node Pins.
**Cómo se configura**: mapea GA de mando/estado/potencia, elige DPT adecuado y activa lecturas automáticas al arranque.
## knxUltimateHuedevice_software_update
**Para qué sirve**: notificar por KNX la disponibilidad de actualizaciones de firmware Hue.
**Funciones clave**: interpretación de `up_to_date/available/required`, registro de eventos, alertas planificables.
**Cómo se configura**: fija la GA de alerta, define la política de notificación y enlaza dashboards o sistemas de tickets.
