---
layout: wiki
title: "FAQ-Troubleshoot"
lang: es
permalink: /wiki/es-FAQ-Troubleshoot/
---
---
# Preguntas frecuentes y solución de problemas
¡Primero de todo, gracias por usar uno de mis nodos de nodo-rojo! Trabajé mucho en este nodo y espero que disfruten de mis esfuerzos para ofrecer mi trabajo a todos los usuarios. <br/>
Si estás aquí, puedes tener algunos problemas. Lo siento por eso. <br/> **No te preocupes y te relajes ** , encontraremos cuál es tu problema, porque el nodo ultimate**KNX funciona** , tiene alrededor de mil instalaciones en todo el mundo y también lo tengo instalado para mi hogar. Así que por favor siga las preguntas frecuentes y si "todavía estoy teniendo problemas", contácteme._
Tenga en cuenta que la versión mínima **NodeJS es 16** o superior.
## El nodo no funciona
-¿Ha creado el [nodo de configuración de la puerta de enlace](/node-red-contrib-knx-ultimate/wiki/gateway-configuration) con la IP y el puerto apuntando a su enrutador/interfaz KNX/IP?
- Si tiene un enrutador KNX/IP * ***, debe poner en el campo** host **, la dirección IP de multidifusión KNX** 224.0.23.12 **y puerto** 3671 **- Si tiene una interfaz KNX/IP** **, debe poner en el campo ** host** , la dirección IP de la interfaz, por ejemplo **192.168.1.22** y puerto **3671** -Si tiene **dos o más interfaces de Ehternet** (como Raspberry Pi), especifique la interfaz Ethernet para usar en el nodo de configuración [Gateway](/node-red-contrib-knx-ultimate/wiki/gateway-configuration), o totalmente en la intervención de wiffi. ¡Recuerde **reiniciar el nodo-rojo** !
- Use solo el enrutador KNX/IP Pure Certified (preferible) o interfaces KNX/IP puras. No use dispositivos "todos en uno", o proxies, o dispositivos que, además de otras funciones, también realicen enrutamiento KNX/IP. Una conexión estable entre ** lan y knx es lo más importante** , y debe funcionar. Gaste dinero en eso y lo configurará y lo olvidará.
-Si tiene ** una interfaz IP** , intente deshabilitar el ACK seleccionando _supress ACK request_ en el [nodo de configuración de la puerta de enlace](/node-red-contrib-knx-ultimate/wiki/gateway-configuration).
- Siga el ** Solo puedo recibir telegramas, no enviar, o viceversa** Lista de verificación
-Si está ejecutando nodo-rojo en un contenedor, ** retrase el inicio del nodo-rojo después de que el contenedor arranca** . Algunos usuarios informan que la tarjeta Ethernet todavía está baja cuando el nodo-rojo comienza. Puede probarlo deteniendo manualmente el nodo-rojo, deshabilitando el inicio automático de Noder-Red en el arranque, reiniciar el contenedor, esperar 2-3 minutos e iniciar manualmente el nodo-rojo. Si KNX Ulimate funciona, el problema es que.
## Después de un tiempo, el nodo deja de funcionar
- Lea el ** El nodo no funciona** Preguntas frecuentes.
- Verifique y eventualmente ** Desactive** Protección DDoS o protección contra inundaciones UDP en sus interruptores/enrutadores. Esto como regla general. Los paquetes UDP KNX se pueden bloquear de otra manera.
- Intente conectar directamente su enrutador/interfaz KNX/IP y su PC roja de nodo.
- Si tiene una interfaz KNX/IP barata, especialmente si es un dispositivo "All in Onde", puede colgar. Ve a comprar un enrutador REAL KNX/IP.
- Si usa una interfaz KNX/IP, asegúrese de no haber alcanzado el límite de conexión máximo (consulte el manual de usuario de su interfaz KNX/IP). ** Los enrutadores KNX/IP** son preferibles, en su lugar, no tienen límites de conexión.
## Configuración KNXD
- Si está ejecutando ** KNXD** en la misma máquina de nodo-rojo, use 127.0.0.1 como dirección de interfaz, de lo contrario KNXD tendrá problemas.
- Si está utilizando ** KNXD** , verifique las tablas de filtrado y cambie la dirección fisycal del nodo de configuración KNX en consecuencia.
- Habilite el mensaje ** Echo enviado a todos los nodos con la misma dirección de grupo** en el nodo de configuración de la puerta de enlace, en opciones con aviso.
## Veo el telegrama en ETS, pero mi actuador no reacciona
Es posible que tenga otros complementos KNX Red Node-Red instalados.
- Retire todo el complemento KNX de la paleta de nodo-rojo. Deja solo knx-ultimate. Recuerde eliminar los nodos de configuración también, están ocultos.
-Si tiene ** una interfaz IP** , intente deshabilitar el ACK seleccionando _supress ACK request_ en el [nodo de configuración de la puerta de enlace](/node-red-contrib-knx-ultimate/wiki/gateway-configuration).
## Solo puedo recibir telegramas, no enviar, o viceversa
Su enrutador/interfaz KNX/IP puede tener un filtrado activo.
- Verifique ETS si el enrutador tiene filtrado habilitado. En caso afirmativo, permita ** reenvío** en todas las páginas de configuración de su enrutador KNX, o cambie la dirección física del nodo de configuración Uldimador KNX de acuerdo con las tablas de filtro de su enrutador.
- Si está utilizando ** KNXD** , verifique las tablas de filtrado y cambie la dirección de fisycal del nodo de configuración KNX en consecuencia.
## Valores incorrectos desde el nodo
- Asegúrese de usar el punto de datos correcto. Por ejemplo, para la temperatura, use 9.001
- Cuando sea posible, importe el archivo CSV ETS en el nodo de configuración de la puerta de enlace. ¡Siempre tendrás los puntos de datos correctos!
- Asegúrese de no tener dos o más nodos ultimados KNX, teniendo ** la misma dirección de grupo ** pero**punto de datos diferente** .
## Si envío un mensaje a un nodo desde nodo-rojo, otros nodos en los flujos que tienen la misma dirección de grupo, no reciben/no reaccionan a este mensaje
### Esto sucede si usa una conexión de túnel/unidifusión, como las interfaces KNX/IP o KNXD lo hace.
- Habilite el mensaje ** Echo enviado a todos los nodos con la misma dirección de grupo** en el nodo de configuración de la puerta de enlace, en opciones con aviso.
## ¿Funciona con un enrutador/interfaces KNX seguro?
El enrutador/interfaces IP seguro no funciona si se establece para asegurar. Funciona, en cambio, si permite conexiones no seguras con su enrutador.
- Asegúrese de deshabilitar el enrutamiento seguro o permitir conexiones no seguras.
- Si cree que puede ser pirateado, puede usar una segunda tarjeta Ethernet, conectando rectamente la máquina roja de nodo a su enrutador KNX/Inteface con un cable LAN dedicado. En el nodo de configuración KNX-Uultimate ** BIND a la opción Local Interface** , puede establecer esta interfaz para que sea la interfaz KNX/IP predeterminada.
- La conexión segura se implementará algún día.
## La protección contra inundaciones entra. ¿Qué diablos es eso?
La protección contra inundaciones evita que su interfaz de usuario roja-roja no responda, debido a una cantidad demasiado alta de mensajes enviados al pin de entrada del nodo en un marco de tiempo específico de 1 segundo. <br/>
El número máximo de MSG que puede enviar a un nodo es 120 cada segundo. Si necesita enviar un montón de mensajes al nodo, considere un nodo de "retraso" para retrasar un poco cada mensaje. <br/>
[Ver aquí](/node-red-contrib-knx-ultimate/wiki/protections)
- Revise su flujo. Envíe menos mensajes al nodo o use un nodo ** Retraso** .
- Use el filtro RBE para descartar mensajes que tengan la carga útil igual a la carga útil del nodo actual.
## He importado archivo ETS, pero hay advertencias sobre los puntos de datos
En una instalación de ETS, la configuración de DataPoints es obligatoria, al menos para profesional. <br/>
Con DataPoints, todos los dispositivos de visualización y control de YoUD saben cómo manejar el telegrama y cómo realizar una declación correcta de valores. <br/>
Verá que todos los dispositivos, software de control, sistemas de visualización y todo el mundo de KNX necesitan puntos de datos, así que ¿por qué no agradecer a KNX-Ulimate, para obligarlo a fijar finalmente su instalación de ETS, esa espera tanto para ser solucionada? :-) <br/>
- Pon un auricular en la cabeza, con buena música, abre ETS y comience a agregar puntos de datos.
- o ... Importar el archivo ETS seleccionando la opción "Si la dirección de grupo no tiene punto de datos", para "importar con un punto de datos falso 1.001 (no recomendado)", o para omitir el punto de datos afectado.
- Recuerde establecer el punto de datos completo (tipo principal + subtipo), de lo contrario, el importador establecerá un subtipo .001 predeterminado. ¡Consulte esta imagen![Picada de Subtype](https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/subtype.png)
## Protección de referencia circular en acción. ¿Qué diablos es eso?
La protección de referencia circular evita que su interfaz de usuario roja-roja no responda y que se inunde la instalación de KNX, deshabilitando dos nodos con el mismo enlace de dirección de grupo. <br/>
Por ejemplo, si vincula la salida * ***Pin de un nodo que tiene la dirección de grupo 0/1/1, a la entrada** ** Ping de otro nodo que tiene la misma dirección de grupo 0/1/1, la protección se activará. <br/>
[Ver aquí](/node-red-contrib-knx-ultimate/wiki/protections)
- Revise su flujo. Separe los dos nodos idénticos o fuera algo intermedio, actuando como "moderador".
- Use el filtro RBE para descartar mensajes que tengan la carga útil igual a la carga útil del nodo actual.
## sigo teniendo problemas
### Use uno de los canales a continuación para llegar a mí (alguna vez prefiero GitHub)
-Abra un problema en [GitHub](https://github.com/supergiovane/node-red-contrib-knx-ultimate/issues). Cada vez que abre un problema, recibo un correo electrónico y puedo solucionarlo de inmediato.
-Envíeme un PM en [KNX-USER-FORUM](https://knx-user-forum.de). Estoy aquí como Themax74. Mein Deutsch ist nicht So Gut, Daher Bitte Auf Englisch Schreiben!
