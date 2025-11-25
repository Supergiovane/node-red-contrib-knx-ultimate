---
layout: wiki
title: "Gateway-configuration"
lang: es
permalink: /wiki/es-Gateway-configuration
---
# Configuración de la puerta de enlace KNX

 Este nodo se conecta a su puerta de enlace KNX/IP. 

<div style="background:#e9f7e9;border:1px solid #c8e6c8;border-radius:10px;padding:14px 16px;margin:16px 0;">


### Using KNX Ultimate with kBerry on Raspberry Pi 3 (UART / FT1.2)

This guide explains how to connect a **kBerry** KNX interface directly
to a **Raspberry Pi 3** and use it with **KNX Ultimate** over the
**hardware UART** (`ttyAMA0`) using the **FT1.2 (TPUART)** protocol.

> This procedure is tested with Raspberry Pi OS Bookworm on a  
> Raspberry Pi 3 and has been written on November, 25, 2025.

## 1. Prerequisites

- Raspberry Pi 3 (Model B or B+)
- Raspberry Pi OS (Bookworm recommended)
- kBerry KNX interface mounted on the GPIO header
- Node-RED with KNX Ultimate installed
- Basic terminal access (SSH or local console)

## 2. Wiring / Hardware Overview

The kBerry uses the Raspberry Pi's primary UART:

- **TX / RX**: GPIO14 (TXD) and GPIO15 (RXD)
- **GND**: A common ground between Raspberry Pi and kBerry
- **Power**: Provided via the GPIO header

Make sure the kBerry is properly seated on the Raspberry Pi GPIO header
and that no other HAT is conflicting with those pins.

## 3. Disable Bluetooth and Enable the Hardware UART

### 3.1 Edit the correct config file (Bookworm)

```bash
sudo nano /boot/firmware/config.txt
```

Add:

```ini
enable_uart=1
dtoverlay=pi3-disable-bt
```

### 3.2 Disable ModemManager

```bash
sudo systemctl disable --now ModemManager
```

### 3.3 Disable Bluetooth service

```bash
sudo systemctl disable --now bluetooth.service
```

## 4. Disable Serial Login Console / Enable Hardware UART

```bash
sudo raspi-config
```

- Disable login shell on serial → **No**
- Enable serial hardware → **Yes**

Reboot.

## 5. Verify UART

```bash
ls -l /dev/serial0
ls -l /dev/ttyAMA0
dmesg | grep tty
```

Expected:

    /dev/serial0 -> ttyAMA0
    /dev/ttyAMA0 exists

## 6. Add Node-RED User to dialout

```bash
sudo usermod -aG dialout nodered
sudo reboot
```

## 7. Configure KNX Ultimate

- **Interface type**: Serial FT1.2 / TPUART
- **Serial port**: `/dev/ttyAMA0`
- **Baud rate**: 19200
- **Data bits**: 8
- **Parity**: Even
- **Stop bits**: 1

## 9. Troubleshooting

### No `/dev/ttyAMA0`

- Check `/boot/firmware/config.txt` entries
- Reboot
- Re-check `dmesg`

### `/dev/serial0` → `ttyS0`

- `dtoverlay=pi3-disable-bt` not applied
- Re-check config file path
- Reboot

### Serial cannot be opened

- Ensure user is in `dialout`
- Check that no other program uses `/dev/ttyAMA0`

---

Done.
</div>

**General**

| Propiedad | Descripción |
|-|-|
| Nombre | Nombre del nodo. |
| Ip/hostname | Dirección de multidifusión de enrutador ETH/KNX o dirección IP de unidifusión de interfaz. Si tiene una interfaz KNX/IP, use la dirección IP de la interfaz, por ejemplo, 1982.168.1.22, de lo contrario, si tiene un enrutador KNX/IP, coloque la dirección de multicast 224.0.23.12. También puede escribir un nombre de host **** en lugar de una IP. |

**Configuración**

| Propiedad | Descripción |
|-|-|
| Puerto IP | El puerto. El valor predeterminado es 3671. |
| Protocolo IP | _Tunnel UDP_ es para interfaces KNX/IP, _Multicast UDP_ es para enrutadores KNX/IP, y _Serial FT1.2_ para adaptadores TP/FT1.2 (seleccionado automáticamente cuando eliges un puerto serie). |
| Modo Serial FT1.2 | Define cómo se inicializa la interfaz serie FT1.2: **KBerry/BAOS** habilita la secuencia específica para módulos Weinzierl KBerry/BAOS (reset, modo Link Layer/BAOS, sin filtro de GA), mientras que **Standard FT1.2** utiliza un adaptador FT1.2 genérico sin pasos específicos para KBerry. El valor predeterminado es KBerry/BAOS. |
| KNX Dirección física | La dirección física KNX, ejemplo 1.1.200. El valor predeterminado es "15.15.22". |
| Atar a la interfaz local | El nodo utilizará esta interfaz local para comunicaciones. Deje "Auto" para la selección automática. Si tiene más de una conexión LAN, por ejemplo, Ethernet y Wifi, se recomienda seleccionar manualmente la interfaz, de lo contrario, no todo UDP Telegram llegará a su computadora, por lo que el nodo puede no funcionar como se esperaba. El valor predeterminado es "Auto". |
| Conéctese automáticamente al bus KNX al inicio | Conéctese automático al bus al inicio. El valor predeterminado es "Sí". |
| Fuente de credenciales seguras | Elija cómo se suministran datos seguros KNX: ** Archivo de llaves ETS ** (claves seguras de datos - y credenciales de túnel si están presentes - provienen de la llave),**Credenciales manuales ** (solo KNX IP Tunneling Secure con un usuario ingresado manualmente) o**Contraseña de túnel manual** (Clave segura de datos de la llave mientras el túnel seguro usa el usuario manual)). Recuerde que los telegramas seguros de datos KNX siempre requieren un archivo de llaves. |
| Interfaz de túnel Dirección individual | Visible siempre que el modo seleccionado incluya credenciales manuales (contraseña manual o de túnel manual o Keyring +). Dirección individual KNX opcional para la interfaz de túnel seguro (por ejemplo `1.1.1`); Deje vacío para dejar que KNX Ultimate lo negocie automáticamente. |
| ID de usuario del túnel | Visible cuando se usan credenciales manuales. Identificador de usuario de túnel seguro de KNX opcional definido en ETS. |
| Contraseña de usuario del túnel | Visible cuando se usan credenciales manuales. Contraseña del usuario de túnel seguro KNX configurado en ETS. |

> ** KNX Secure Essentials** \
> • _knx data secure_ protege los telegramas de la dirección del grupo y ** siempre** necesita un archivo de llavero que contenga las claves de grupo. \
> • _knx Tunneling IP Secure_ protege el apretón de manos de la conexión con una contraseña de puesta en marcha. Dependiendo del modo seleccionado, la contraseña puede provenir del llavero o ingresarse manualmente.\
> • KNX/IP Secure (handshake del túnel) solo se aplica a los transportes IP (Tunnel TCP / routing seguro). KNX Data Secure protege los telegramas de direcciones de grupo y puede usarse tanto sobre IP (túnel/enrutamiento) como sobre TP vía Serial FT1.2 cuando se proporciona un archivo keyring de ETS.

 **Avanzado** | Propiedad | Descripción |

|-|-|
| Echo enviado mensaje a todos los nodos con la misma dirección de grupo | Envíe la entrada MSG que viene del flujo a todos los nodos que tienen la misma dirección de grupo. Los nodos recibirán el nuevo MSG como si viniera del autobús KNX. Esto es útil en el caso de usar la emulación KNX y en caso de que no se establezca la conexión con el bus KNX. ** Esta opción estará en desuso en la próxima versión y se predeterminó en verificación.** Se verifica el valor predeterminado. |
| Suprimir los telegramas repetidos (r-flag) FOM BUS | Ignore los repetidos telegramas de KNX que provengan del autobús. El valor predeterminado no está marcado. |
| Suprimir la solicitud ACK en el modo de túnel | Habilite si tiene una puerta de enlace KNX/IP muy antigua. Ignora el procedimiento ACK y acepta todos los telegramas. El valor predeterminado no está marcado. |
| Retraso entre cada telegrama (en milisegundos) | Las especificaciones de KNX establecen que la velocidad máxima de envío de telegrama es de 50 telegramas por segundo. Una velocidad entre 25 y 50 ms debe estar bien, a menos que se conecte a una puerta de enlace KNX remota a través de una conexión a Internet lenta (en este caso, debe aumentar el valor, por ejemplo, de 200 a 500 ms o más). |
| Loglevel | Nivel de registro, en caso de que necesite depurar algo con el desarrollo. El valor predeterminado es "error", |
| Temporización de actualizaciones de estado | Define cada cuánto se actualiza la insignia de estado de los nodos. Con un retardo activo se descartan los estados intermedios y solo se muestra el último después del intervalo elegido. Seleccione **Inmediato** para mantener el comportamiento en tiempo real. |

 ** Importación de archivos ETS** | Propiedad | Descripción |

|-|-|
| Si la dirección del grupo no tiene punto de datos | Si una dirección de grupo no tiene un punto de datos, permite elegir si detiene la importación, importar un punto de datos falso de 1.001 o omitir la importación de esa dirección de grupo |
| Lista de direcciones de grupo ETS | Use esta sección para importar su archivo CSV o ESF ETS. Puede ** Pegar el contenido del archivo CSV o ESF ** o**Establecer la ruta del archivo** , por ejemplo _./pi/homecsv.csv_. Consulte los enlaces de ayuda para obtener más infos. |

 **Utilidad** | Propiedad | Descripción |

|-|-|
| Recopilar información de depuración para la solución de problemas | Haga clic en el botón y agréguelo al problema de GitHub que desea abrir, me ayudará mucho a ayudarlo. |
| Obtenga todos los usados ​​GA para el filtro de enrutamiento KNX | Presione Leer para recuperar una lista de texto sin formato de todas las direcciones grupales que pertenecen a esta puerta de enlace, que se ha utilizado en los flujos. Puede usar esta lista para completar su tabla de filtro de enrutador KNX/IP. |

# Trabajar con el archivo CSV o ESF ETS

<img src = 'https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/wiki/etslogo.png'>>

En lugar de crear un nodo ultimatizado KNX para que cada dirección de grupo controle, puede importar su archivo de direcciones de grupo CSV ETS o, a partir de V 1.1.35, también un archivo ESF (si, por ejemplo, solo tiene ETS en el interior). Versiones ETS compatibles: ETS 4 y en adelante. 

A partir de la versión 1.4.18, también puede simplemente ingresar la ruta al archivo en este campo (por ejemplo: /home/pi/mycsv.csv). 

Gracias a eso, el nodo ultimatizado KNX donde seleccionó ** Modo universal (escuche todas las direcciones de grupo)** , se convierte en un nodo universal de entrada/salida, consciente de todos los puntos de datos, direcciones de grupo y nombre del dispositivo (ex: lámpara de sala de estar). Simplemente envíe la carga útil al nodo ultimate KNX, y la codificará con el punto de datos correcto y la enviará al bus. Del mismo modo, cuando el nodo ultimate KNX recibe un telegrama del bus, genera una carga útil decodificada derecha utilizando el punto de datos especificado en el archivo CSV o ESF ETS.

A partir de ** versión 1.1.11 ** , puede usar**Modo universal (escuche todas las direcciones de grupo) ** Opción sin la necesidad de un archivo CSV o ESF importado. Debe pasar un mensaje al nodo, que contiene el tipo de punto de datos y un valor. Tan pronto como el nodo reciba un telegrama del bus KNX, generará un valor bruto y, además de eso, intentará decodificar el valor sin conocer el tipo de punto de datos. 
**Nota** : _ETS La dirección del grupo CSV exportó archivo_ es la mejor opción, ya que contiene un punto de datos preciso con subtipo. _Ets ESF exportado File_ es más simple y no tiene el subtipo. 

Si puede usar ambos, prefiera el archivo exportado de la dirección del grupo CSV ** ETS ** , porque el ESF puede conducir a valores de salida falsos. Verifique manualmente y eventualmente ajuste los puntos de datos cada vez que importe el archivo**ESF** . 
 Desde la versión 1.4.1 Puede importar direcciones de grupo también en tiempo de ejecución, a través de MSG, utilizando el nodo WatchDog. 

> Puede trabajar con una mezcla de nodos ultimados KNX, algunos con ** Modo universal (escuche todas las direcciones de grupo)** verificados y otros no. ¡Eres absolutamente gratis!

<a href = "https://youtu.be/egrbr_kwp9i"> <img src = 'https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png'> </a>

- ** ETS CSV Group Directes List Import ** _**Atención: no debe haber caracteres de tabulación en el nombre de la dirección de grupo ** _**Si la dirección del grupo no tiene punto de datos ** > Si una dirección de grupo no tiene un punto de datos establecido en el ETS, puede seleccionar detener y abortar todo el proceso de importación, omitir la dirección de grupo afectada o agregar la dirección de grupo afectada con un punto de datos falso y continuar la importación. 
**Cómo exportar el ETS -> CSV < - Lista de direcciones del grupo** > En ETS, haga clic en la lista de direcciones de grupo, luego haga clic derecho, luego seleccione 'Exportar direcciones de grupo'. En la ventana Exportar, seleccione estas opciones: 

>
> ** Formato de salida** : CSV 

>
> ** Formato CSV** : 1/1 Nombre/dirección 

>
> ** Exportar con línea de encabezado** : marcado 

>
> ** Separador CSV** : Tabulator. 

>
> Luego pegue el contenido del archivo aquí. 

>
> Tenga en cuenta que el archivo CSV ETS debe contener los puntos de datos para cada dirección de grupo. 

>
> El nodo analiza su archivo CSV ETS antes de usarlo y le informará los resultados en la pestaña de depuración de la página de nodo-rojo. 

>
> El resultado puede ser de dos tipos: ** Error ** y**ADVERTENCIA** 

>
> ** Error** ocurre cuando no se especifica un punto de datos para una dirección de grupo. Este es un error crítico y detiene el proceso de importación del archivo CSV ETS. 

>
> ** Advertencia** ocurre cuando no se especifica el subtipo de un punto de datos. En este caso, el analizador de nodos agregará uno predeterminado, pero le advierte que se mueva y corrija el punto de datos, agregando un subtipo. Un subtipo es el número que permanece a la derecha del "." En un punto de datos (ex: 5.001). 

>
> Nota: Los campos deben estar rodeados de ** "** Por ejemplo: 

>> "Actuadores de luz" "0/-/-" "" "" "" "" "auto" 
** Cómo exportar la lista de direcciones de grupos ETS -> ESF < -

> En la ventana ETS, seleccione su proyecto, luego haga clic en el icono de exportación (el icono con la flecha hacia arriba) 

>
> Seleccione para exportar el proyecto en formato ESF (no el predeterminado .knxProd) 

>
> Luego copie el contenido del archivo y péguelo en el campo Configuración de la configuración de la puerta de enlace "Lista de direcciones de grupo ETS".

    <table style = "font-size: 12px">
        <tr>
        <th colspan = "2" style = "font-size: 14px"> Coloros de estado del nodo Explicación </th>
        </tr>
        <tr>
        <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greendot.png"> </ img> </td>
        <TD> reaccionar para escribir telegramas </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greenring.png"> </img> </td>
            <TD> Protección de referencia circular. <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections" target = "_ en blanco"> ver esta página. </a> </td>
        </tr>
        <tr>
        <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/bluedot.png"> </img> </td>
        <TD> Reaccionar a los telegramas de respuesta. </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/bluering.png"> </ img> </td>
            <TD> Auto envía el valor del nodo como respuesta al bus. <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device" target = "_ blank"> ver dispositivo virtual. </a> </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greudot.png"> </img> </td>
            <TD> Reaccionar a leer telegramas. </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greyring.png"> </img> </td>
            <TD> RBE Filtro: no se han enviado telegramas. </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/reddot.png"> </img> </td>
            <TD> Error o desconectado. </td>
        </tr>
        <tr>
            <TD> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/redring.png"> </img> </td>
            <td> Nodo discapacitado debido a una referencia circulare. <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections" target = "_ en blanco"> ver esta página. </a> </td>
        </tr>
    </table>
