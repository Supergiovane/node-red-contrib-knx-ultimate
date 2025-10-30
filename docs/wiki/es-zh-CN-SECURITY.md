---
layout: wiki
title: "zh-CN-SECURITY"
lang: es
permalink: /wiki/es-zh-CN-SECURITY
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SECURITY) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-SECURITY) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-SECURITY) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-SECURITY) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-SECURITY) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-SECURITY)
---
# Política de seguridad
La automatización del hogar no es broma.Considere todos los peligros involucrados en el uso de este repositorio para controlar su hogar o edificio.
Por ejemplo, cuando no está en casa, una luz está encendida y **puede convertirse en un grave peligro para disparar** .<br/>
Todos los equipos desatendidos ponen en riesgo su edificio.<br/>
Sin mencionar si es por su culpa o un error en el repositorio de KNX-Utim, la puerta del garaje está cerrada mientras el niño está sentado en el medio.
**Seguridad de la construcción** Debe ser su principal problema.<br/>
Utilice KNX-Ulimate (pero generalmente lo mismo para todos los repositorios) para controlar solo los actuadores asegurados por otros medios certificados.<br/> <br/>
En el ejemplo anterior, la puerta del garaje debe ser asegurada por un sistema mecánico o electrónico certificado para evitar daños a las personas, los animales o las cosas.
El desarrollador del repositorio de KNX-Utilate y todos los desarrolladores involucrados en el proyecto no son responsables de ningún daño, como se indica en la licencia MIT, puede encontrar \ [aquí](§URL0§).<br/> <br/>
## Reglas de automatización del hogar
En mi experiencia, he desarrollado algunas mejores prácticas para proteger mi hogar de los riesgos de incendio, daños y riesgos en tercera persona.<br/>
Aquí hay algunas cosas interesantes para ti.Espero que aprecies esto.<br/>
- Instale uno o más interruptores de encendido principales para cortar toda la casa cuando no esté allí, dejando solo un número mínimo de equipos necesarios (como cubretos, paneles de alarma, enrutadores de Internet, etc.).Si necesita algo de automatización cuando se va, puede activar temporalmente el interruptor de alimentación principal y recuperar el acceso completo.Vale la pena evitar piratear su hogar a través de personas con acceso, como dispositivos IoT inadecuadamente seguros, siempre capaces.
- Use otra línea WAN para instalar un enrutador de Internet redundante, como la conexión LTE.Si pierdes una WAN, tienes otra en la que confiar.
- Incluso en un corte de energía (por ejemplo, la llave de mecánica fisical en algún lugar del jardín), incluso en su hogar, encuentre una manera.
- Incluso en el caso de un corte de energía, puede encontrar una manera de \*\* salir de su casa (por ejemplo, en algún lugar cerca de su puerta, una clave mecánica fisical).
- Encuentre una manera de escapar de su hogar cuando ocurra una espuma o alarma de incendio (por ejemplo, a través de una escalera expandible en el balcón).
- Use solo sistemas de seguridad de bloques/bomberos profesionales y certificados y luego comandado por KNX.Tenga en cuenta que la parte KNX del sistema de seguridad se convierte en la puerta trasera de posibles problemas.Nunca permita que los nodos KNX no seguren el sistema de seguridad sin contraseña.Si usa una pantalla táctil, evite usar la función **Single Button ** .Cree botones que simulen paneles de seguridad**Teclado** Atserpion.
- Instale **Emergencia médica ** Knx Pushtton, por ejemplo, colóquelo cerca de la cama.En una emergencia, su familia o alguien que pueda ayudarlo a notificar automáticamente, encenderá todas las luces importantes, cree un modo de entrada**visible para cuidadores, desbloqueará las puertas y les permitirá conectarse con usted, incluso si se siente abrumado.Repita un mensaje de audio para ayudar al cuidador Equipe, como usar altavoces Sonos, explicar cómo encontrarlo en casa, los padres llaman ** , su enfermedad**enfermedad \*\*qué enfermedad tiene.Incluso puede activar este botón KNX con Alexa, Siri o Google Home (consulte la sección Ejemplo del wiki) en caso de que tenga un derrame cerebral y no pueda moverse.
- Instale un botón de push de ** Pank** Knx
- Con eso en mente: no ingrese a su hogar si alguien lo obliga y lo amenaza a hacerlo, especialmente si su familia está dentro.Una vez que entra, el criminal puede hacer lo que quiera y nadie afuera puede preocuparse por usted.Instale un botón \*\* Panic \*\* cerca del departamento exterior y el garaje.
- Si tiene sensores periféricos periféricos instalados, una vez que alguien ingresa al perímetro al anochecer o a la noche, puede iluminar la hora al menos 4 (cada ángulo de su casa) para irse a casa.
- Incluso si está en casa, haga un anuncio a través del teclado de alerta cuando alguien abre una ventana, puerta exterior o ventana ciega.
## Recuerde: usted es responsabilidad exclusiva de la seguridad de la propiedad.Siga la ley, considere este nodo de estilo KNX solo con ayuda de automatización, confiando únicamente en equipos de automatización certificados, mecánicos o electrónicamente fijos.Considere su seguridad.Piense en que algo puede ser problemático o fallado, así que tenga una copia de seguridad y, en aras de los riesgos de curación y seguridad, tenga una respaldo de doble seguridad.¡Solo de esta manera puedes disfrutar de la vida con la ayuda y la diversión de la automatización del hogar!
