---
layout: wiki
title: "Gateway-configuration"
lang: fr
permalink: /wiki/fr-Gateway-configuration
---
Configuration de la passerelle KNX

 Ce nœud se connecte à votre passerelle KNX / IP. 


**Général**

| Propriété | Description |
|-|-|
| Nom | Nom du nœud. |
| Ip / hostname | Adresse multidiffère du routeur ETH / KNX ou adresse IP unicast. Si vous avez une interface KNX / IP, utilisez l'adresse IP de l'interface, par exemple 1982.168.1.22, sinon, si vous avez un routeur KNX / IP, mettez l'adresse de multidiffusion 224.0.23.12. Vous pouvez également taper un **nom d'hôte** au lieu d'une IP. |

**Configuration**

| Propriété | Description |
|-|-|
| Port IP | Le port. La valeur par défaut est 3671. |
| Protocole IP | _Tunnel UDP_ est pour les interfaces KNX / IP, _Multicast UDP_ est pour les routeurs KNX / IP. Laissez **Auto** pour la détection automatique. La valeur par défaut est "Auto". |
| Mode Serial FT1.2 | Définit comment l’interface série FT1.2 est initialisée : **KBerry/BAOS** active la séquence spécifique pour les modules Weinzierl KBerry/BAOS (reset, mode Link Layer/BAOS, aucun filtre de GA), tandis que **Standard FT1.2** utilise un adaptateur FT1.2 générique sans étapes spécifiques à KBerry. La valeur par défaut est KBerry/BAOS. |
| Adresse physique KNX | L'adresse physique KNX, exemple 1.1.200. La valeur par défaut est "15.15.22". |
| Se lier à l'interface locale | Le nœud utilisera cette interface locale pour les communications. Laissez "Auto" pour la sélection automatique. Si vous avez plus d'une connexion LAN, par exemple Ethernet et WiFi, il est fortement recommandé de sélectionner manuellement l'interface, sinon tout le télégramme UDP n'atteindra pas votre ordinateur, donc le nœud peut ne pas fonctionner comme prévu. La valeur par défaut est "Auto". |
| Connectez-vous automatiquement au bus KNX au démarrage | Connectez-vous automatiquement au bus au départ. La valeur par défaut est "oui". |
| Secure d'identification sécurisée | Choisissez comment les données sécurisées KNX sont fournies: **ETS Fichier de clés ** (Données Secure Keys - et les informations d'identification de tunneling si elles sont présentes - proviennent de la clés),**Indementiels manuels ** (Seul KNX IP Tunneling Secure avec un utilisateur saisi manuellement), ou**Clémentiel + Mot de passe du tunnel manuel** Utilisateur manuel). N'oubliez pas que les télégrammes Secure Data KNX nécessitent toujours un fichier de clés. |
| Interface tunnel Adresse individuelle | Visible chaque fois que le mode sélectionné comprend des informations d'identification manuelles (manuel ou clés + mot de passe du tunnel manuel). Adresse individuelle KNX facultative pour l'interface du tunnel sécurisé (par exemple `1.1.1`); Laissez vide pour laisser KNX Ultimate le négocier automatiquement. |
| ID utilisateur du tunnel | Visible lorsque des références manuelles sont utilisées. Identificateur d'utilisateur de tunnel Secure KNX en option défini dans ETS. |
| Mot de passe utilisateur du tunnel | Visible lorsque des références manuelles sont utilisées. Mot de passe de l'utilisateur de tunneling Secure KNX configuré dans ETS. |

> **KNX Secure Essentials** \
> • _KNX Data Secure_ protège les télégrammes d'adresses de groupe et **toujours** a besoin d'un fichier de clés contenant les touches de groupe. \
> • _KNX IP Tunneling Secure_ protège la poignée de main de connexion avec un mot de passe de mise en service. Selon le mode sélectionné, le mot de passe peut provenir du clés ou être entré manuellement.\
> • KNX/IP Secure (handshake du tunnel) ne s’applique qu’aux transports IP (Tunnel TCP / routage sécurisé). KNX Data Secure protège les télégrammes d’adresses de groupe et peut être utilisé à la fois sur IP (tunneling/routage) et sur TP via Serial FT1.2 lorsqu’un fichier keyring ETS est fourni.

**Avancé**

| Propriété | Description |
|-|-|
| Echo envoyé un message à tous les nœuds avec la même adresse de groupe | Envoyez l'entrée MSG provenant du flux, à tous les nœuds ayant la même adresse de groupe. Les nœuds recevront le nouveau MSG comme s'il provenait du bus KNX. Ceci est utile en cas d'utilisation de l'émulation KNX et au cas où la connexion au bus KNX n'est pas établie. **Cette option sera obsolète dans la version suivante et par défaut est vérifiée.** La valeur par défaut est vérifiée. |
| Supprimez les télégrammes répétés (R-FLAG) FOM BUS | Ignorez des télégrammes KNX répétés provenant du bus. La valeur par défaut n'est pas contrôlée. |
| Supprimez la demande ACK en mode tunnel | Activez-le si vous avez une très ancienne passerelle KNX / IP. Il ignore la procédure ACK et accepte tous les télégrammes. La valeur par défaut n'est pas contrôlée. |
| Retard entre chaque télégramme (en millisecondes) | KNX Specs indique que la vitesse d'envoi de télégramme maximum est de 50 télégrammes par seconde. Une vitesse comprise entre 25 et 50 ms devrait être bien, sauf si vous vous connectez à une passerelle KNX distante via une connexion Internet lente (dans ce cas, vous devez augmenter la valeur, par exemple, 200 à 500 ms ou plus). |
| Loglevel | Niveau de journal, au cas où vous auriez besoin de déboguer quelque chose avec le développement. La valeur par défaut est "erreur", |
| Temporisation de l'état du nœud | Définissez la fréquence de mise à jour des badges de statut. Avec un délai actif, les changements intermédiaires sont ignorés et seul le dernier est affiché après l'intervalle choisi. Sélectionnez **Immédiat** pour conserver le comportement en temps réel. |
| Format date/heure du statut | Choisissez comment l’horodatage est affiché dans le badge de statut (utile quand le locale du système ne peut pas être configuré). |
| Format personnalisé | Utilisé quand **Personnalisé (jetons)** est sélectionné. Jetons : `YYYY`, `YY`, `MMM`, `MM`, `DD`, `HH`, `mm`, `ss`, `A`, `a`, `Z`. Utilisez `[texte]` pour les littéraux. |
| Paramètre régional (remplacer) | Locale optionnel (BCP47), par ex. `fr-FR` ou `en-GB`. Utilisé pour les noms de mois (`MMM`) avec un format personnalisé. |

**ETS Importation du fichier**

| Propriété | Description |
|-|-|
| Si l'adresse du groupe n'a pas de point de données | Si une adresse de groupe n'a pas de point de données, elle permet de choisir pour arrêter l'importation, importer Quth un faux point de données de 1,001 ou pour ignorer l'importation de cette adresse de groupe |
| Liste d'adresses du groupe ETS | Utilisez cette section pour importer votre fichier ETS CSV ou ESF. Vous pouvez soit **coller le contenu du fichier CSV ou ESF ** ou**définir le chemin du fichier** , par exemple _./pi/homecsv.csv_. Veuillez vous référer aux liens d'aide pour d'autres Infos. |

**Utilitaire**

| Propriété | Description |
|-|-|
| Rassemblez les informations de débogage pour le dépannage | Veuillez cliquer sur le bouton et l'ajouter au problème GitHub que vous souhaitez ouvrir, cela m'aidera beaucoup à vous aider. |
| Obtenez tous les GA d'occasion pour le filtre de routage KNX | Appuyez sur Read pour récupérer une liste de texte brut de toutes les adresses de groupe appartenant à cette passerelle, qui a été utilisée dans les flux. Vous pouvez utiliser cette liste pour remplir votre table de filtre de routeur KNX / IP. |

# Travailler avec le fichier ETS CSV ou ESF

Au lieu de créer un nœud KNX-ultime pour chaque adresse de groupe à contrôler, vous pouvez importer votre fichier d'adresses de groupe CSV ETS ou, à partir de V 1.1.35, un fichier ESF également (si, par exemple, vous n'avez qu'ETS à l'intérieur). Versions ETS prises en charge: ETS 4 et à partir. 

À partir de la version 1.4.18, vous pouvez également entrer simplement le chemin d'accès au fichier dans ce champ (par exemple: /home/pi/mycsv.csv). 

Grâce à cela, le nœud KNX-ultime où vous avez sélectionné **Mode universel (écoutez toutes les adresses de groupe)** , devient un nœud d'entrée / sortie universel, conscient de tous les points de données, des adresses de groupe et du nom de l'appareil (ex: lampe de salon). Envoyez simplement la charge utile au nœud KNX-ultime, et il le codera avec le bon point de données et l'enverra dans le bus. De même, lorsque le nœud KNX-ultime reçoit un télégramme du bus, il offre une charge utile décodée droite à l'aide du point de données spécifié dans le fichier ETS CSV ou ESF.

À partir de **version 1.1.11 ** , vous pouvez utiliser**Mode universel (écoutez toutes les adresses de groupe) ** Option sans avoir besoin d'un fichier ETS CSV ou ESF importé. Vous devez transmettre un message au nœud, contenant le type de point de données et une valeur. Dès que le nœud reçoit un télégramme de KNX Bus, il sortira une valeur brute et à côté, il essaiera de décoder la valeur sans connaître le type de point de données. 
**Remarque** : _ETS Adresse du groupe CSV Fichier exporté_ est la meilleure option, car il contient des points de données précis avec sous-type. _ETS ESF Exporté File_ est plus simple et il n'a pas le sous-type. 

Si vous pouvez utiliser les deux, veuillez préférer le fichier exporté de l'adresse du groupe CSV * ***, car l'ESF peut conduire à une fausse valeur de sortie. Veuillez vérifier manuellement et éventuellement ajuster les points de données chaque fois que vous importez le fichier** ESF**. 
 à partir de la version 1.4.1 Vous pouvez également importer des adresses de groupe également à l'exécution, via MSG, en utilisant le nœud de surveillance. 

> Vous pouvez travailler avec un mélange de nœuds KNX-ultime, certains avec le mode ** Universal (écoutez toutes les adresses de groupe)** Vérifié et d'autres non. Vous êtes absolument libre!

<a href = "https://youtu.be/egrbr_kwp9i"> <img src = 'https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/masmg/yt.png'> </a>

- ** ETS CSV Group Adresses List Import ** _**Attention: il ne doit pas y avoir de caractères de tabulation au nom de l'adresse du groupe ** _**Si l'adresse du groupe n'a pas de point de données ** > Si une adresse de groupe n'a pas de point de données dans l'ETS, vous pouvez sélectionner pour arrêter et interrompre l'intégralité du processus d'importation, pour sauter l'adresse du groupe affectée ou pour ajouter l'adresse du groupe affectée avec un faux point de données et continuer l'importation. 
**Comment exporter les ETS -> CSV <- Liste des adresses de groupe** > Sur ETS, cliquez sur la liste des adresses de groupe, puis cliquez avec le bouton droit, puis sélectionnez «Exporter des adresses de groupe». Dans la fenêtre d'exportation, sélectionnez ces options: 

>
> ** Format de sortie** : CSV 

>
> ** Format CSV** : 1/1 nom / adresse 

>
> ** Exportation avec ligne d'en-tête** : vérifié 

>
> ** CSV Séparateur** : Tabulator. 

>
> Collez ensuite le contenu du fichier ici. 

>
> Notez que le fichier ETS CSV doit contenir les points de données pour chaque adresse de groupe. 

>
> Le nœud analyse votre fichier CSV ETS avant de l'utiliser et vous indiquera les résultats dans l'onglet de débogage de la page Node-Red. 

>
> Le résultat peut être de deux types: ** Erreur ** et**avertissement** 

>
> ** L'erreur** se produit lorsqu'un point de données n'est pas spécifié pour une adresse de groupe. Il s'agit d'une erreur critique et arrête le processus d'importation du fichier ETS CSV. 

>
> ** L'avertissement** se produit lorsque le sous-type d'un Datapoint n'est pas spécifié. Dans ce cas, l'analyseur de nœud y ajoutera un par défaut, mais vous avertit que vous montrez et corrigez le point de données, en ajoutant un sous-type. Un sous-type est le nombre restant à droite du "." dans un point de données (ex: 5.001). 

>
> Remarque: les champs doivent être entourés de ** "** par exemple: 

>> "ACTUATEURS LIGHTS" "0 / - / -" "" "" "" "" "" Car "
 ** Comment exporter les ETS -> ESF <- Liste des adresses de groupe**

> Sur la fenêtre ETS, sélectionnez votre projet, puis cliquez sur l'icône d'exportation (l'icône avec la flèche vers le haut) 

>
> Sélectionnez pour exporter le projet au format ESF (pas le .knxprod par défaut) 

>
> Copiez ensuite le contenu du fichier et collez-le dans le champ de la liste d'adresses de groupe de passerelle "ETS".

    <Table Style = "Font-Size: 12px">
        <tr>
        <th Colspan = "2" style = "Font-Size: 14px"> Couleurs d'état du nœud Explication </th>
        </tr>
        <tr>
        <td> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greendot.png"> </ img> </ td>
        <TD> réagir aux télégrammes d'écriture </td>
        </tr>
        <tr>
            <td> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greenring.png"> </ img> </ td>
            <TD> Protection de référence circulaire. <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections" target = "_ blanc"> voir cette page. </a> </ td>
        </tr>
        <tr>
        <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluedot.png" alt="Blue status dot" /></td>
        <TD> réagir aux télégrammes de réponse. </td>
        </tr>
        <tr>
            <td> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/bluering.png"> </img> </td>
            <TD> Auto Envoi de la valeur du nœud comme réponse au bus. <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device" cible = "_ Blank"> Voir le périphérique virtuel. </a> </ td>
        </tr>
        <tr>
            <td> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greudot.png"> </ img> </ td>
            <TD> réagir aux télégrammes de lecture. </td>
        </tr>
        <tr>
            <td> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/greyring.png"> </ img> </ td>
            <TD> Filtre RBE: aucun télégramme n'a été envoyé. </td>
        </tr>
        <tr>
            <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/reddot.png" alt="Red status dot" /></td>
            <td> Erreur ou déconnecté. </td>
        </tr>
        <tr>
            <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/redring.png" alt="Red status ring" /></td>
            <TD> Node désactivé en raison d'une référence circulare. <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Protections" target = "_ blanc"> voir cette page. </a> </ td>
        </tr>
    </ table>

<div markdown="1" style="background:#e9f7e9;border:1px solid #c8e6c8;border-radius:10px;padding:14px 16px;margin:16px 0;">


### Using KNX Ultimate with kBerry on Raspberry Pi 3 (UART / FT1.2)

This guide explains how to connect a **kBerry** KNX interface directly
to a **Raspberry Pi 3** and use it with **KNX Ultimate** over the
**hardware UART** (`ttyAMA0`) using the **FT1.2 (TPUART)** protocol.

> This procedure was tested with Raspberry Pi OS Bookworm on a  
> Raspberry Pi 3 (November 25, 2025).

## 1. Prerequisites

- Raspberry Pi 3 (Model B or B+)
- Raspberry Pi OS (Bookworm recommended)
- kBerry KNX interface mounted on the GPIO header
- Node-RED with KNX Ultimate installed
- Basic terminal access (SSH or local console)

## 2. Wiring / Hardware Overview

The kBerry uses the Raspberry Pi's primary UART:

- **TX / RX**: GPIO14 (TXD) and GPIO15 (RXD)
- **GND**: Common ground between Raspberry Pi and kBerry
- **Power**: Provided via the GPIO header

Make sure the kBerry is properly seated on the Raspberry Pi GPIO header
and that no other HAT is conflicting with those pins.

## 3. Disable Bluetooth and Enable the Hardware UART

### 3.1 Edit the correct config file (Bookworm)

```bash
sudo nano /boot/firmware/config.txt
```

Add (or ensure you have):

```ini
enable_uart=1
dtoverlay=pi3-disable-bt
```

### 3.2 Disable ModemManager (if present)

```bash
sudo systemctl disable --now ModemManager
```

### 3.3 Disable Bluetooth service

```bash
sudo systemctl disable --now bluetooth.service
```

## 4. Disable Serial Login Console / Enable Hardware UART

Start the configuration tool:

```bash
sudo raspi-config
```

Then navigate through the menus:

- **Interface Options** (or **Interfacing Options** on older systems)
- **Serial Port**

You will see two questions:

- "Login shell to be accessible over serial?" → choose **No**
- "Enable serial port hardware?" → choose **Yes**

Finish and exit `raspi-config`, then reboot when asked (or manually later).

## 5. Verify UART

```bash
ls -l /dev/serial0
ls -l /dev/ttyAMA0
dmesg | grep tty
```

Expected:

```text
/dev/serial0 -> ttyAMA0
/dev/ttyAMA0 exists
```

## 6. Add Node-RED user to `dialout`

Linux uses the `dialout` group to grant access to serial ports
like `/dev/ttyAMA0` or `/dev/ttyUSB0`.  
The **user that runs Node-RED** must belong to this group, otherwise
KNX Ultimate cannot open the serial port.

If you installed Node-RED with the official script, the service user is
usually `nodered`. On some systems it may be `pi` or another user; adapt
the commands accordingly.

Check the current groups:

```bash
id nodered   # or: id pi
```

Add the user to the `dialout` group:

```bash
sudo usermod -aG dialout nodered
```

After changing group membership, log out and log in again for that user,
or simply reboot:

```bash
sudo reboot
```

This step is only needed when you use a **serial** gateway; pure KNX/IP
setups do not require `dialout`.

## 7. Configure KNX Ultimate

In the KNX Ultimate gateway node:

- **Interface type**: Serial FT1.2 / TPUART
- **Serial port**: `/dev/ttyAMA0`
- **Baud rate**: 19200
- **Data bits**: 8
- **Parity**: Even
- **Stop bits**: 1

## 8. Troubleshooting

### No `/dev/ttyAMA0`

- Check `/boot/firmware/config.txt` entries
- Reboot
- Re-check `dmesg`

### `/dev/serial0` → `ttyS0`

- `dtoverlay=pi3-disable-bt` not applied
- Re-check config file path
- Reboot

### Serial cannot be opened

- Ensure the Node-RED user is in `dialout` (`id nodered`)
- Check that no other program is using `/dev/ttyAMA0`
- Verify that the KNX Ultimate gateway node is configured for `/dev/ttyAMA0`

---

Done.
</div>
