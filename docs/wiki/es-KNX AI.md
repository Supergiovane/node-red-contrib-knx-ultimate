---
layout: wiki
title: "KNX AI"
lang: es
permalink: /wiki/es-KNX%20AI
---
Este nodo escucha **todos los telegramas KNX** del gateway KNX Ultimate seleccionado, genera estadísticas de tráfico, detecta anomalías y puede consultar opcionalmente un LLM.

El editor utiliza dos pestañas horizontales: **Asistente IA** contiene configuración, conocimiento/contexto y límites del proveedor; **Conversaciones y hogar** contiene canales de chat, hogar proactivo y memoria limitada.

## Salidas
1. **Resumen/Estadísticas** (`msg.payload` JSON)
2. **Anomalías** (`msg.payload` JSON)
3. **Asistente IA** (`msg.payload` texto, con `msg.summary`)
4. **Operaciones KNX** (un mensaje Universal Mode por cada lectura o escritura validada)

Cada mensaje emitido por las salidas 3 y 4 también contiene una copia del mensaje de entrada original en `msg.inputMessage`. Así, el payload, el topic, los metadatos del chat y cualquier otra propiedad de entrada permanecen disponibles para los nodos posteriores. Los errores de clonación o envío se interceptan y notifican sin propagarse al runtime de Node-RED.

## Comandos (entrada)
Envía `msg.topic`:
- `summary` (o vacío): emite el resumen inmediatamente
- `reset`: borra el historial, los contadores, la memoria del hogar aprendida y todos los contextos de chat persistentes; la Educación de la IA permanece sin cambios
- `ask`: envía una pregunta al LLM configurado
- `confirm` / `cancel`: confirma o cancela los comandos KNX pendientes sin volver a llamar al LLM
- `clear_chat`: borra los turnos recientes, las instrucciones persistentes y los comandos pendientes de la sesión actual

Para `ask`, envía la pregunta en `msg.prompt` (recomendado), `msg.payload` (string), o los campos comunes de Telegram `msg.payload.content` / `msg.payload.text`.

Si el procesamiento tarda más de 1,2 segundos, la salida 3 emite inmediatamente el mensaje intermedio localizado «Estoy pensando…», con `msg.knxAi.type = "thinking"` y `msg.knxAi.transient = true`. El adaptador de chat lo envía al mismo usuario y la respuesta final llega normalmente en cuanto está lista. Este mensaje de progreso nunca se guarda en el contexto de conversación ni en la memoria aprendida.

Las solicitudes de Ollama y Bionic LM Studio usan automáticamente un tiempo de espera mínimo de 10 minutos; los proveedores cloud mantienen un mínimo de 2 minutos. No hay ningún campo de tiempo de espera que gestionar en el editor. Si también se alcanza el límite local, KNX AI indica que el modelo no terminó y recomienda volver a intentarlo o reducir el contexto del prompt.

Para los proveedores locales, **Cantidad de contexto del chat** permite elegir explícitamente 4K, 8K o 16K; 16K sigue siendo el valor predeterminado. La selección limita proporcionalmente los datos KNX, de memoria, del proyecto Node-RED y de los adaptadores enviados al modelo, manteniendo completo el contrato de herramientas del agente. Ninguna capacidad se activa o desactiva según frases, palabras clave o intents lingüísticos.

El estado del nodo en el canvas está reservado deliberadamente para la última solicitud recibida y el mensaje localizado «Estoy pensando…» mientras se ejecuta el LLM. Los telegramas KNX, las actualizaciones del gateway, las tasas de tráfico, los mensajes ready y los resultados técnicos nunca lo sobrescriben; siguen disponibles mediante las salidas, los registros y los datos del Asistente.

Cada sesión Ask/chat conserva sus últimos 8 turnos y hasta 20 instrucciones a largo plazo elegidas por el modelo, separadas por `msg.knxAi.sessionId`, `msg.sessionId` o el ID de chat Telegram detectado. El modelo decide semánticamente, mediante la herramienta de memoria estructurada, qué significado de una conversación debe recordar u olvidar; no se utiliza ninguna lista de palabras clave ni intents lingüísticos. Todos los nodos KNX AI que usan el mismo almacenamiento comparten este contexto en tiempo real y lo recargan tras reiniciar Node-RED desde `knxultimatestorage/knxai/memory/knxai-chat-context.knxctx`. El archivo se escribe de forma atómica y está limitado a 50 sesiones y 512 KB. Cuando el control KNX está habilitado, conecta la salida 3 al nodo emisor del chat y la salida 4 a un nodo KNX Ultimate en **modo universal**. Con la confirmación activa, la primera respuesta muestra GA, DPT y payload sin emitir escrituras; la misma sesión debe responder `CONFIRMAR` o `CANCELAR` en 5 minutos. Una solicitud nueva sustituye cualquier plan anterior. Cada comando confirmado contiene `msg.destination`, `msg.dpt`, `msg.payload` y `msg.event = "GroupValue_Write"`.
La memoria reciente de la sesión se coloca inmediatamente junto a la solicitud actual para que los modelos locales conserven los datos proporcionados por el usuario, como su nombre preferido o idioma, incluso dentro de un prompt KNX grande. El modelo puede hacer persistentes los datos, preferencias e instrucciones duraderas mediante `memoryActions`; sigue siendo una elección semántica de herramienta, sin clasificadores de frases ni routing por intents. Las credenciales, códigos de seguridad y claves API nunca deben aprenderse.

Para las escrituras DPT 1.xxx, los equivalentes seguros producidos por la IA `true`/`false`, `1`/`0` y `on`/`off` se normalizan a booleanos reales antes de la validación local y la salida.

### Lecturas KNX actualizadas
Cuando el usuario solicita explícitamente un estado actual o actualizado, la IA puede consultar objetos exactos del catálogo ETS importado, incluidos objetos de estado y otros objetos de solo lectura. La salida 4 emite `msg.destination`, `msg.dpt`, `msg.event = "GroupValue_Read"` y `msg.readstatus = true`. El nodo espera hasta 6 segundos cada `GroupValue_Response` o escritura reciente, devuelve los valores decodificados por la salida 3 y expone los detalles en `msg.knxAi.readResults`. Las lecturas nunca requieren confirmación ni se convierten en escrituras. Si un modelo local pequeño omite el tipo de operación y el payload, los objetos ETS exactos se normalizan de forma segura como lecturas; un elemento con payload sigue siendo una escritura validada.

### Rutinas conversacionales de varios pasos
Solicitudes como «Me voy», «Buenas noches» o «Modo cine» pueden coordinar una rutina basada en el estado actual sin añadir opciones al editor. En la primera pasada del LLM solo se aceptan lecturas ETS exactas (hasta 20); KNX AI las envía y proporciona los resultados actualizados de GA/DPT/valor a una segunda pasada de planificación aislada. Esta puede preparar hasta 12 escrituras validadas, pero no iniciar otro ciclo de lecturas. Con la confirmación activa, todo el plan requiere una sola confirmación localizada y antes no se emite ninguna escritura ni anuncio TTS solicitado. Tras confirmar, cada escritura se vuelve a validar, se envía en orden y se observa hasta 4 segundos para detectar una respuesta inmediata coincidente en el bus. La respuesta final distingue las respuestas observadas de las operaciones sin respuesta inmediata, sin declarar por ello un fallo del dispositivo. Los detalles están disponibles en `msg.knxAi.routine`, `readResults`, `verifiedCount` y `unverifiedCount`.

### Solicitud de confirmación para botones de chat
Mientras un plan está pendiente, la salida 3 contiene `msg.knxAi.confirmationRequest`. El objeto incluye `required`, `status`, `sessionId`, `expiresAt`, `commandCount` y dos elementos en `actions`. Usa `action.label` como texto del botón de Telegram, `action.callbackData` como callback y devuelve `action.message` a KNX AI para confirmar o cancelar sin escribir texto.

### Preajustes del adaptador de chat
La pestaña **Adaptadores de chat** carga sus mapeos seleccionables desde `resources/KNXAIChatAdapterMappings.js`. Al elegir un preajuste se instalan internamente dos mapeos JavaScript síncronos predefinidos: uno antes de que KNX AI procese la entrada y otro antes de emitir por la salida 3. Los mapeos permanecen ocultos en el editor. Los errores de sintaxis y ejecución se capturan y notifican sin detener Node-RED.

El preajuste incluido **windkh/node-red-contrib-telegrambot** sigue el contrato receiver/sender del paquete. Conecta directamente un `telegram receiver` a KNX AI y la salida 3 a un `telegram sender`. La confirmación usa un teclado de respuesta temporal de Telegram: al pulsar **Confirmar** o **Cancelar** se devuelve un mensaje localizado normal por el mismo receiver, por lo que no hacen falta un `telegram event` ni cableado callback. Los mensajes `callback_query` antiguos siguen siendo compatibles. El mapeo de entrada extrae `msg.payload.content`, `msg.payload.chatId` y el idioma de Telegram. El mapeo de salida crea `msg.payload.chatId`, `type` y `content`, y añade `options.reply_markup` desde `msg.knxAi.confirmationRequest` cuando una escritura espera confirmación. El paquete Telegram sigue siendo una dependencia opcional separada.

El preajuste incluido **RedBot / node-red-contrib-chatbot (Telegram)** sigue el formato común de mensajes de RedBot. Conecta directamente `chatbot-telegram-receive` a KNX AI y la salida 3 a `chatbot-telegram-send`; no hace falta un nodo callback separado porque RedBot convierte los postbacks de los botones inline en mensajes de entrada normales. El mapeo de entrada lee `transport`, `chatId`, `type`, `content` y el idioma de Telegram. El mapeo de salida conserva los datos de seguimiento RedBot `originalMessage`, `chat`, `api` y `client`, y después emite un payload `message` o un payload `inline-buttons` con acciones `postback` de confirmación. RedBot sigue siendo una dependencia opcional separada.

### Adaptadores de cámara detectados automáticamente
Los paquetes de cámaras instalados pueden publicar en tiempo de ejecución un adaptador para KNX AI. No hay selector ni nodo de cámara que conectar a KNX AI: los adaptadores, controladores y cámaras disponibles se detectan automáticamente y se incorporan al contexto del chat. `node-red-contrib-unifi-ultimate` es el primer proveedor compatible; otros paquetes, como `hikvision-ultimate`, pueden registrarse mediante el mismo contrato independiente del fabricante.

El usuario puede pedir una captura actual o preguntar al modelo de visión qué se ve. Los preajustes de Telegram y RedBot envían la imagen como foto nativa con pie. También se pueden crear notificaciones persistentes por movimiento, cruce de una línea inteligente o entrada en una zona de intrusión/merodeo, limitadas opcionalmente a personas detectadas y a una línea o zona concreta por nombre. Estas reglas se guardan en el mismo archivo `knxai-chat-context.knxctx` y se restauran después de reiniciar Node-RED. Las suscripciones a eventos UniFi y las solicitudes de captura se realizan directamente a través del proveedor detectado; no interviene la salida 4 de KNX AI ni hace falta cableado intermedio en el flujo.

Cada evento publicado por un adaptador detectado automáticamente se normaliza y se añade directamente, en el formato nativo compacto por filas de KNX AI, a un archivo diario `YYYY-MM-DD.knxctx` bajo `knxultimatestorage/knxai/adapter-history/<id-nodo>/`. El archivo de telegramas KNX usa el mismo formato compacto, sin serialización JSON intermedia. El archivo conserva 10 días, garantiza más de 24 horas de historial y guarda metadatos, pero no imágenes. Los archivos JSONL existentes no se leen ni se migran. Los totales abarcan todas las filas almacenadas; los detalles seleccionados son solo una muestra relevante.

### Anuncios con TTS Ultimate
Cuando está instalado el paquete opcional `node-red-contrib-tts-ultimate`, aparece entre los adaptadores detectados automáticamente. El selector muestra todos los nodos `ttsultimate` de todos los flows del proyecto, con el flow, el nombre del nodo y el reproductor configurado. Elige el nodo que gestionará los anuncios del chat y despliega el flow.

El modelo decide si usa este adaptador razonando sobre la solicitud actual, las instrucciones persistentes del chat y la Educación IA gestionada por el usuario; no existe un intent de anuncio ni una lista de frases activadoras. Los valores KNX, eventos de adaptadores, imágenes y archivos siguen siendo datos y no instrucciones, aunque las indicaciones fiables del usuario pueden enseñar al modelo cómo actuar sobre ellos. KNX AI envía el texto elegido directamente al nodo como `msg.payload`, con `msg.topic = "knx_ai_announcement"`; no hace falta cableado intermedio. TTS Ultimate gestiona después Sonos, voz, volumen, aviso inicial y cola.

### Resumen del contexto del chat
El editor del nodo muestra una tarjeta compacta con las fuentes disponibles para el chat: tráfico KNX actual, semántica ETS y proyecto Node-RED, memoria de sesión y del hogar, Educación IA y cámaras detectadas. También muestra el contexto operativo máximo elegido por el usuario y el tamaño UTF-8 real del último prompt del chat; se usan los tokens de entrada exactos cuando el proveedor los informa y, de lo contrario, el recuento se marca como estimado. También enumera `knxai-chat-context.knxctx`, `knxai-home-memory.md` y `knxai-config-<id-nodo>.json`, junto con la raíz absoluta del archivo de telegramas KNX, la carpeta específica del nodo y el patrón diario `YYYY-MM-DD.knxctx`. Las rutas se resuelven en tiempo de ejecución desde el directorio de datos que usa realmente la pasarela configurada.

El modelo recibe lecturas/escrituras KNX, adaptadores de cámara, anuncios TTS y memoria persistente como herramientas estructuradas. Puede seleccionarlas y combinarlas semánticamente a partir de la solicitud actual y de las indicaciones fiables aprendidas, sin routing por intents lingüísticos. El runtime solo valida argumentos, disponibilidad de adaptadores y límites de seguridad; las escrituras KNX conservan la validación ETS/DPT local y la confirmación configurada.

### Edición y copia del aprendizaje CHAT
La pestaña **Conversaciones y hogar** de la configuración Node-RED de KNX AI incluye el botón **Abrir aprendizaje del chat IA**, que abre la interfaz web Vue directamente en este editor para el nodo actual.

En la interfaz web Vue, abre **Ajustes → Aprendizaje del chat IA** para ver y editar el archivo compartido exacto `knxai-chat-context.knxctx` y su ruta absoluta. El archivo se puede copiar, descargar como copia de seguridad o restaurar desde otro archivo `.knxctx`. **Reinicializar memoria**, protegido por una confirmación explícita, lo sustituye por un contexto nuevo y vacío y elimina las sesiones, instrucciones, vigilancias de cámara y confirmaciones de chat pendientes en todos los nodos KNX AI que usan el mismo almacenamiento. Los registros nativos separados por tabulaciones `KNXAI_CHAT_CONTEXT 3` son la referencia y se pueden editar directamente: `SESSION` contiene registros `INSTRUCTION`, `TURN` y `CAMERA_WATCH` hasta `END_SESSION`. Al guardar se validan y limitan estos registros, se reescribe el archivo de forma atómica y se actualiza el contexto activo de todos los nodos KNX AI que usan el mismo almacenamiento. Una comprobación de revisión evita sobrescribir o reinicializar aprendizaje modificado después de cargarlo en el editor.

Solo se admite el formato nativo V3. Los archivos Markdown/JSON V2 y Base64 V1 anteriores no se leen, importan ni migran deliberadamente; el archivo `.md` antiguo se deja intacto y KNX AI inicia un contexto `.knxctx` nuevo. Se mantienen los límites de 50 sesiones y 512 KB.

### Roles aprendidos de las direcciones de grupo KNX
El rol `neutral` expresa una incertidumbre inicial, no una prohibición permanente de control. El modelo puede usar la herramienta estructurada `gaRoleActions` para aprender que una dirección de grupo ETS exacta es un objeto de comando, estado o neutro a partir de una enseñanza fiable del usuario, instrucciones persistentes del chat, Educación IA o una semántica inequívoca del proyecto ETS. No se requiere ninguna palabra clave ni intent de rol; si las pruebas son ambiguas, el modelo pide una aclaración en vez de aprender.

El rol, el motivo y la prueba aprendidos se guardan por nodo en `<userDir>/knxai/config/knxai-config-<id-nodo>.json` y se sincronizan en la memoria semántica doméstica limitada. Un rol aprendido como `command` puede validar una escritura en la misma respuesta y permanece disponible después de reiniciar; el modelo también puede olvidarlo y restaurar la clasificación automática. El aprendizaje no puede inventar una GA, cambiar su DPT ETS, eludir la validación del payload ni omitir la confirmación de escritura configurada.

## Inteligencia doméstica proactiva guiada por Educación y memoria limitada
A partir de la jerarquía ETS, nombres, roles y DPT, el nodo crea un modelo semántico determinista. No existe un interruptor separado ni ajustes proactivos avanzados. Una notificación solo se evalúa si el LLM está activo y **Educación IA** la solicita explícitamente. Educación es la única política para condiciones, duración, horas silenciosas y repetición. Sin una regla explícita, o si el LLM no puede evaluarla, no se envía ningún mensaje.

La última sesión de chat se recuerda como propietario y recibe los mensajes espontáneos. La salida 3 emite `msg.knxAi.type = "proactive_notification"` y `msg.inputMessage` conserva la sesión para el adaptador de chat. Un límite estricto de tres notificaciones proactivas por hora evita inundar el chat. La salida 4 nunca se usa de forma proactiva y KNX no se modifica de manera autónoma.

La referencia aprendida compartida se carga al arrancar desde `<userDir>/knxai/memory/knxai-home-memory.md`, se reescribe atómicamente cada 15 minutos y siempre queda estrictamente limitada a 5 MB. Conserva como máximo 120 observaciones importantes, 80 hábitos agregados, 80 notificaciones y 300 objetos ETS semánticos, nunca un flujo ilimitado de telegramas raw. Los elementos antiguos y de menor prioridad se eliminan primero. **Educación IA** está limitada a 16.000 caracteres y siempre procede de la configuración del nodo: la IA puede leerla como instrucción autoritativa, pero no modificarla ni sobrescribirla. Si existe Educación pero el LLM no puede evaluarla, la notificación candidata se suprime en lugar de arriesgarse a contradecirla.

## Ejemplo práctico de configuración
Escribe toda la política de notificación en **Educación IA** (`aiEducation`):

```text
Llámame Alex y responde en el mismo idioma que uso.
Responde brevemente, salvo que pida detalles técnicos.
Avisa a mi último chat si una persiana, ventana o puerta sigue abierta al menos 120 minutos.
No me avises entre las 23:00 y las 07:00 ni repitas la misma alerta antes de seis horas.
La persiana del despacho puede permanecer abierta durante el día: no me avises.
Si «luz del salón» es ambiguo, pregúntame a qué luz me refiero.
Nunca afirmes que un actuador cambió hasta que lo confirme un objeto de estado KNX.
```

Con estos ajustes, la salida 3 puede emitir una `proactive_notification` localizada después de 120 minutos para la persiana del salón, mientras que Educación suprime el aviso de la persiana del despacho. Si Alex pide después cerrar la persiana del salón, KNX AI prepara el comando ETS exacto, pero mantiene la validación y confirmación normales antes de la salida 4.

Usa jerarquías y nombres de objetos ETS descriptivos, con roles de estado/comando correctos. Educación personaliza decisiones y texto, pero no puede inventar una dirección de grupo, cambiar un DPT ni evitar la validación KNX.

## Flujo rápido: control KNX
1. Importa el CSV de ETS en el gateway y configura el proveedor, el modelo y las credenciales LLM.
2. Activa **Asistente LLM** y **lectura de estados KNX y control de actuadores**; deja activada la confirmación.
3. Conecta la entrada del chat a KNX AI manteniendo un ID de sesión/chat estable.
4. Conecta la salida 3 a la respuesta del chat y la salida 4 a KNX Ultimate en **modo universal**.
5. El usuario envía una solicitud; los estados actuales se leen inmediatamente, mientras que las escrituras muestran primero GA, DPT y valor sin escribir en el bus.
6. En un plazo de 5 minutos, el mismo chat responde exactamente `CONFIRMAR` o `CANCELAR`.
7. Solo `CONFIRMAR` vuelve a validar y emite los comandos por la salida 4; verifica la ejecución mediante una GA de estado KNX.

## Campos de configuración
Aquí tienes todos los campos tal como se muestran en el editor de KNX AI.

### General
- **Gateway**: gateway/config node KNX Ultimate usado como fuente de telegramas.
- **Name**: nombre del nodo y título del dashboard.
- **Topic**: topic base usado en las salidas del nodo.
- Botón **Open KNX AI Web**: abre el dashboard web (`/knxUltimateAI/sidebar/page`).

### Asistente IA
- **Enable LLM assistant**: habilita funciones Ask/chat.
- **Provider**: backend LLM (OpenAI-compatible, Anthropic, Ollama o Bionic LM Studio).
- **Endpoint URL**: URL endpoint chat/completions.
- **API key**: clave API (no requerida con Ollama local; opcional para Bionic LM Studio salvo que la autenticación del servidor esté activada).
- **Model**: ID/nombre de modelo.
- **Compatibilidad del modelo de chat**: el modelo seleccionado debe admitir el endpoint Chat Completions configurado. Los modelos antiguos disponibles solo mediante completions, como `gpt-3.5-turbo-instruct`, se excluyen al actualizar la lista. Si el proveedor rechaza un valor personalizado de temperatura o el parámetro de límite de tokens, KNX AI vuelve a intentarlo eliminando o sustituyendo únicamente el campo incompatible.
- **Permitir que la IA lea estados KNX y controle actuadores**: habilita la salida 4 y está desactivado por defecto. Los objetos exactos del catálogo ETS se pueden leer; solo se aceptan escrituras hacia objetos clasificados como `command`. Las operaciones desconocidas, con DPT distinto, inválidas o excesivas, y las escrituras hacia objetos de estado o neutrales, se rechazan localmente.
- **Pedir confirmación antes de enviar comandos KNX**: activado por defecto. Muestra primero los cambios validados y no emite comandos hasta que la misma sesión de chat los confirme. Cuando hay comandos pendientes, la respuesta añade siempre las instrucciones exactas para confirmar o cancelar en el idioma de la solicitud actual. Los comandos se validan de nuevo justo antes de la salida.
- **Preajuste del adaptador**: usa **Sin adaptador** por defecto. La selección carga el par predefinido de mapeos de entrada y salida; ambos permanecen ocultos en el editor.
- **Educación de la IA**: instrucciones vinculantes gestionadas solo por el usuario, leídas por la IA y nunca modificadas. Es el único lugar donde solicitar notificaciones proactivas y definir sus condiciones, duración, horas silenciosas y repetición.
- Los fragmentos incluidos con el paquete procedentes de la ayuda, README, changelog, wiki y ejemplos no se añaden a los prompts de Telegram, RedBot ni CHAT personalizados. Solo permanecen disponibles para el Asistente web en preguntas técnicas sobre el paquete.
- Botón **Refresh**: consulta el provider y carga los modelos disponibles. El icono gira durante la carga; una finalización correcta no muestra ningún mensaje.

### Configuración rápida de Ollama (local)
- Selecciona **Provider = Ollama**.
- Endpoint por defecto: `http://localhost:11434/api/chat`.
- Si no hay modelos locales:
  - **1) Download model**: abre la página **Model library**.
  - **2) Install it**: descarga e instala el modelo localmente (p. ej. `llama3.1`).
- Durante refresh/instalación, KNX AI también intenta iniciar automáticamente el servidor Ollama.
- Si la instalación falla con error de conexión, verifica que Ollama esté ejecutándose (app de escritorio o `ollama serve`).
- El contexto máximo declarado por `/api/show` queda solo como información. KNX AI envía como `num_ctx` el presupuesto elegido de 4K, 8K o 16K (o el máximo del modelo si es menor) y limita proporcionalmente cada fuente de contexto sin eliminar capacidades del agente.
- Si Node-RED se ejecuta en Docker, usa `host.docker.internal` en lugar de `localhost` en el endpoint.

### Configuración rápida de Bionic LM Studio (local)
- Selecciona **Provider = Bionic LM Studio**.
- Inicia el servidor API de LM Studio desde la página **Developer** o con `lms server start`.
- Endpoint por defecto: `http://localhost:1234/v1/chat/completions`.
- Pulsa **Refresh** para cargar todos los modelos expuestos por `/v1/models`; si no hay un modelo configurado se selecciona el primero.
- Si un modelo ya está cargado, KNX AI conserva la longitud de contexto activa. KNX AI nunca carga un modelo Bionic inactivo mediante la API de gestión: la primera solicitud de chat permite que Bionic lo cargue mediante JIT con los valores predeterminados guardados para el modelo. Independientemente del contexto declarado por Bionic, KNX AI usa el presupuesto de prompt elegido de 4K, 8K o 16K y mantiene disponibles el razonamiento, KNX, las rutinas, las cámaras y TTS.
- La clave API es opcional salvo que la autenticación esté activada en los ajustes del servidor LM Studio. En Docker, sustituye `localhost` por `host.docker.internal`.

## Nota de seguridad
Si el LLM está habilitado, el contexto de tráfico KNX puede enviarse al endpoint configurado. Para privacidad on-premise, usa proveedores locales. Un comando emitido por la salida 4 superó la validación local y fue enviado al flow, pero no confirma que el actuador lo ejecutara. Usa una GA de estado KNX para confirmarlo.
