---
layout: wiki
title: "SECURITY"
lang: es
permalink: /wiki/es-SECURITY
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/SECURITY) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-SECURITY) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-SECURITY) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-SECURITY) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-SECURITY) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-SECURITY)
---
# Política de seguridad
La automatización del hogar no es una broma.Considere todos los peligros que involucran el uso de este repositorio para controlar su hogar o edificio.
Una sola luz que permanece encendida mientras no está en casa, por ejemplo, **puede convertirse en un grave peligro de fuego** . <br/>
Todos los dispositivos desatendidos ponen en riesgo su edificio. <br/>
Sin mencionar si, por su culpa o para un insecto en el repositorio de Uldlate KNX, una puertas de garaje se cierra mientras un niño está sentado en el medio.
La seguridad de la construcción **** debe ser su principal preocupación. <br/>
Utilice KNX-Ulimate (pero generalmente es lo mismo para todos los repositorios) solo para controlar los actuadores que han sido asegurados por otros medios certificados. <br/>
Para el ejemplo anterior, la puerta del garaje debe estar asegurada por un sistema mecánico o electrónico certificado****, evitando daños a las personas, animales o cosas.
El desarrollador del repositorio de Ulx-Ulimado y todos los desarrolladores involucrados en este proyecto, no son responsables de ninguna manera por ningún daño, como se indica en la licencia del MIT que puede encontrar [aquí](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/blob/master/LICENSE). <br/>
## Reglas de automatización del hogar
En mi experiencia, desarrollé algunas ** mejores prácticas** para asegurar mi hogar de incendios, daños y riesgos para tercera persona. <br/>
Algunas cosas interesantes están debajo, para ti.Espero que lo aprecien. <br/>
- Instale uno o más interruptores de alimentación principales, que cortan la alimentación de toda su casa mientras está fuera, dejando solo el número mínimo de dispositivos necesarios (como refirgerador, panel de alarma, enrutador de Internet, etc.).Si necesita algo de automatización mientras está fuera, puede encender temporalmente el interruptor de alimentación principal y recuperar el acceso completo.Esto vale la pena evitar la posible piratería de su hogar al alguien que tiene acceso, por ejemplo, a un dispositivo IoT de alimentación inadecuado y siempre alimentado.
- Instale un enrutador de Internet redundante usando otra línea WAN, por ejemplo, una conexión LTE.En caso de que haya perdido una WAN, tiene otra a quien confiar.
- Encuentre una forma de ** Ingresar** en su hogar, incluso en caso de cortes de energía (por ejemplo, una llave mecánica fisical en algún lugar del jardín).
- Encuentre una forma de ** Salir** su hogar, incluso en caso de cortes de energía (por ejemplo, una llave mecánica fisical en algún lugar cerca de su puerta principal).
- Encuentre una forma de ** escapar** de su hogar en caso de bulgary o alarma de incendio (por ejemplo, por medio de una escalera extensible de un balcón).
- Use solo un sistema de seguridad bulgary/incendio profesional y certificado y comínelo por KNX.Tenga en cuenta que la parte KNX de su sistema de seguridad se convierte en una puerta trasera para posibles problemas.Nunca permita que el nodo KNX desarme su sistema de seguridad sin una contraseña.Si usa una pantalla táctil, evite la capacidad de desarme ** de un solo botón ** .Cree botones que simulen un panel de seguridad**Keypad** Pression en su lugar.
- Instale un botón de empuje ** de emergencia médica ** KNX y colóquelo, por ejemplo, cerca de su cama.En caso de emergencia, notifique automáticamente a su familia o alguien que pueda ayudarlo, encienda todas las luces significativas, cree un**patrón de entrada visible ** para paramédicos, puertas de desbloqueo y el camino para permitirles comunicarse con usted incluso en caso de que se vuelva inconsciente.Repita un mensaje de audio para ayudar a**paramédicos Equipe ** , usando, por ejemplo, sus altavoces de Sonos, diciendo**cómo encontrarlo ** en su hogar,**a quién los padres llamar ** , qué enfermedades preexistentes****tiene.Incluso puede usar Alexa, Siri o Google Home para activar este botón KNX (ver en la sección Ejemplo del wiki), en caso de que tenga un derrame cerebral y no pueda moverse.
- Instale un bote de pánico****knx
- Tenga en cuenta esto: nunca ingrese a su hogar en el caso de alguien y lo amenazan para que lo haga, especialmente si su familia está dentro.Una vez que estás dentro, ** el delincuente puede hacer lo que quiera ** y a nadie afuera puede preocuparse por ti.Instale un botón**Panic** en algún lugar cerca de sus puertas y garajes externas.
- Si ha instalado sensores perimetrales externos, ilumine la hora en casa por medio de al menos 4 (uno para cada ángulo de su hogar) Proyector LEDS potente tan pronto como alguien ingrese al perímetro al anochecer o a la noche.
- Haga un anuncio a través de teclados de alarma tan pronto como alguien abra una ventana, puerta externa o ciega, incluso si está en casa.
## Recuerde: usted es el único responsable de la seguridad de su propiedad.Siga la ley, considere este nodo ultimatizado KNX solo como ayuda de automatización, confíe solo en dispositivos de automatización certificados y mecánicos o electrónicamente asegurados.Piensa en tu seguridad.Piense que algo puede salir mal o fallar, así que tenga una copia de seguridad y, para los riesgos de sanidad y seguridad, tenga una doble copia de seguridad de seguridad.¡Solo entonces, puede disfrutar de su vida con la ayuda y la diversión de la automatización del hogar!
