---
layout: wiki
title: "KNX Utility"
lang: es
permalink: /wiki/es-KNX-Utility
---
## Actualizar a KNX Ultimate 8

La versión 7 añade un pequeño botón **Actualizar a v8** en la parte superior de cada editor de nodo. Crea una copia de los flujos, instala los paquetes HUE/Matter necesarios, convierte los nodos compatibles, realiza un Deploy completo, verifica los flujos guardados e instala la versión 8. Reinicia después el servicio Node-RED cuando se indique; recargar solo el navegador no es suficiente. Los nodos antiguos KNX AI detienen la operación automática.

[Leer la guía completa de actualización](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Upgrade-to-v8)

# KNX Utility

**KNX Utility** reúne once funciones auxiliares KNX en un solo nodo de la paleta. Selecciona una **Función** para mostrar sus ajustes, icono y puertos. **KNX Device (KNXUltimate)** sigue siendo el nodo principal para enviar y recibir telegramas KNX.

## Once funciones, un nodo

| Función y referencia de ajustes | Uso | Entradas / salidas |
|---|---|---|
| [Alerter](/node-red-contrib-knx-ultimate/wiki/es-Alerter-Configuration) | Informa de dispositivos en alerta individualmente, juntos o como última alerta. | 1 / 3 |
| [AutoResponder](/node-red-contrib-knx-ultimate/wiki/es-KNXAutoResponder) | Responde a lecturas KNX con valores configurados o recibidos anteriormente. | 0 / 0 |
| [DateTime](/node-red-contrib-knx-ultimate/wiki/es-DateTime-Configuration) | Envía fecha y hora con DPT 19.001, 11.001 y 10.001. | 0 / 0 |
| [WatchDog](/node-red-contrib-knx-ultimate/wiki/es-WatchDog-Configuration) | Supervisa la pasarela o un dispositivo KNX e informa de problemas de conexión. | 1 / 1 |
| [Global Context](/node-red-contrib-knx-ultimate/wiki/es-GlobalVariable) | Comparte valores KNX en el almacenamiento del contexto global Node-RED elegido. | 0 / 0 |
| [Logger](/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | Registra telegramas en XML compatible con ETS y cuenta el tráfico. | 1 / 2 |
| [Staircase](/node-red-contrib-knx-ultimate/wiki/es-Staircase-Configuration) | Controla la iluminación temporizada de escalera con estado, forzado y preaviso. | 1 / 1 |
| [Garage](/node-red-contrib-knx-ultimate/wiki/es-Garage-Configuration) | Gestiona órdenes de garaje, impulsos, entradas de seguridad y cierre automático. | 1 / 1 |
| [Scene Controller](/node-red-contrib-knx-ultimate/wiki/es-SceneController-Configuration) | Recupera, aprende y guarda escenas con direcciones de grupo y valores configurables. | 1 / 1 |
| [Load Control](/node-red-contrib-knx-ultimate/wiki/es-LoadControl-Configuration) | Desconecta y restablece cargas según el consumo y los límites de potencia. | 1 / 1 |
| [Home Assistant Translator](/node-red-contrib-knx-ultimate/wiki/es-HATranslator) | Traduce estados de Home Assistant a valores booleanos con una propiedad de entrada y una tabla configurables. | 1 / 1 |

La tabla muestra los puertos de cada función. AutoResponder y Global Context trabajan directamente con el bus y el contexto. DateTime utiliza envíos programados y el botón del nodo; no tiene puertos de entrada ni salida.

Home Assistant Translator tiene una entrada y una salida y no necesita una pasarela KNX. Elige la propiedad del mensaje que se traducirá (por ejemplo `payload` o `data.new_state.state`) y edita las correspondencias `origen:true` / `origen:false`, como `open:true` y `closed:false`. Envía el valor booleano traducido en `msg.payload`; conecta la salida a KNX Device cuando necesites escribir en el bus.

## Configurar un nodo Utility

1. Arrastra **KNX Utility** desde la paleta al flujo.
2. Elige la **Función**, selecciona la pasarela KNX cuando sea necesaria y completa los ajustes mostrados.
3. Guarda el nodo y comprueba sus conexiones. Pulsa **Deploy** para activarlo.

Cambiar la función en el editor muestra una vista previa de sus ajustes. **Cancelar** conserva la configuración guardada. Los enlaces de la tabla abren los ajustes y ejemplos de cada función; las páginas anteriores siguen disponibles como referencia de los nodos dedicados.

## Convertir todos los nodos antiguos compatibles

Abre **KNX Utility** o un nodo antiguo compatible, pulsa **Convertir todos los nodos KNX antiguos compatibles** y confirma. La conversión incluye cada instancia de las once funciones en **todos los flujos y subflujos** del editor, independientemente de la pestaña activa o la selección.

Tras confirmar y antes de modificar los nodos, el navegador inicia automáticamente la descarga de una copia JSON con fecha y hora de todos los flujos presentes en el editor, incluidas pestañas, subflujos, nodos de configuración, grupos y conexiones. El archivo usa el formato de exportación estándar de Node-RED y puede volver a importarse. Se excluyen las credenciales declaradas por los nodos, como en la exportación estándar. El navegador puede preguntar dónde guardar el archivo. Si no es posible preparar la copia o iniciar su descarga, no se convierte ningún nodo.

La conversión se realiza localmente en el navegador. Conserva ID, ajustes guardados, referencias de pasarela, conexiones, posiciones y grupos. Los ID conservados mantienen los archivos de valores de AutoResponder y las escenas grabadas de Scene Controller. Global Context conserva el nombre de variable y el almacenamiento; Logger conserva sus ajustes de archivo. Home Assistant Translator conserva su propiedad de entrada y la tabla de traducción personalizada, incluso cuando se deja vacía intencionadamente.

La confirmación cierra el editor del nodo actual y descarta los cambios sin guardar. Toda la conversión constituye una sola operación **Deshacer** y también permite **Rehacer**. Revisa los nodos convertidos y pulsa **Deploy** para activar los cambios. La migración no despliega automáticamente. Un flujo bloqueado impide la conversión hasta que se desbloquee.

Los nodos dedicados existentes siguen cargándose y funcionando. Están ocultos en la paleta y marcados con `(deprecated)` en los flujos existentes, donde sus ajustes siguen siendo editables. KNX Device, Viewer y los demás nodos de integración y enrutamiento conservan sus funciones.
