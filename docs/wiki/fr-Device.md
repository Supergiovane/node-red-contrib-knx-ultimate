🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Device) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Device) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Device) | [FR](/node-red-contrib-knx-ultimate/wiki/fr-Device) | [ES](/node-red-contrib-knx-ultimate/wiki/es-Device) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Device)
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
## Paramètres de nœud de périphérique KNX-ultimate

 Ce nœud vous permet de contrôler une adresse de groupe KNX, c'est le nœud le plus utilisé.

[<i class="fa fa-code"> </i> Ici, vous trouverez quelques échantillons](/node-red-contrib-knx-ultimate/wiki/-Sampleshome)

**Configuration**

| Propriété | Description |
|-|-|
| Passerelle | Sélectionnez la passerelle KNX à utiliser |
| Liste déroulante de type GA | Le type d'adresse de groupe. **3 niveaux** est la valeur par défaut, où vous pouvez saisir l'adresse du groupe de niveau _3 ou le nom d'adresse _group (si vous avez téléchargé le fichier ETS), ou **global**, pour lire le GA au démarrage à partir d'une variable globale, ou **flux** qui font la même chose que le _Global_, mais au niveau du flux. Sélectionnez **$ Env Variable** Pour lire l'adresse de groupe à partir d'une variable d'environnement. Sélectionnez **Mode universel (écoutez toutes les adresses de groupe)** pour réagir à toutes les adresses de groupe. |
| Groupe addr. | L'adresse du groupe KNX que vous souhaitez contrôler. Si vous avez importé le fichier d'adresses du groupe ETS, vous pouvez simplement commencer à saisir le nom de votre appareil. Vous pouvez le laisser vide si vous souhaitez le définir avec le message d'entrée _msg.setConfig_. |
| DataPoint | Le point de données appartenant à votre nœud. |

### Bouton de commande manuelle

L’éditeur peut afficher, pour chaque nœud, un petit bouton permettant d’envoyer un télégramme KNX sans ajouter de nœud Inject supplémentaire.

| Propriété | Description |
|--|--|
| Afficher le bouton manuel | Affiche ou masque le bouton dans l’espace de travail et dans la palette de nœuds. |
| Action du bouton | Définit l’opération effectuée au clic. **Envoyer une lecture KNX** envoie un télégramme de lecture standard. **Basculer le booléen (écriture)** est disponible pour les datapoints 1.x et alterne les valeurs _true_/_false_. **Écrire une valeur personnalisée** envoie la valeur saisie (elle doit être compatible avec le datapoint configuré). |
| État initial du basculement | (Datapoints booléens uniquement) Définit la valeur initiale utilisée par le mode bascule. L’état est automatiquement synchronisé avec les télégrammes reçus du BUS. |
| Valeur personnalisée | Payload utilisé par le mode « Écrire une valeur personnalisée ». Vous pouvez saisir n’importe quel littéral JSON, par exemple `42`, `true`, `"texte"` ou `{ "red": 255 }`. |

Le bouton n’est visible que si l’option est activée. En mode universel, l’action de lecture est désactivée car l’adresse de groupe ne serait pas connue.

## OPP OPTIONS AVANCES

| Propriété | Description |
|-|-|
|| **Propriétés générales** |
| Nom du nœud | Explication de soi. |
| Sujet | Le sujet de sortie MSG. Laissez-le vide pour le faire régler sur l'adresse de votre groupe. |
| Passthrough | Si vous êtes défini, vous pouvez passer les MG d'entrée au msg de sortie. |
|| **De la broche d'entrée du nœud au bus KNX** |
| Type de télégramme | _WRITE_ Pour envoyer un télégramme d'écriture (généralement, vous le souhaitez), sinon vous pouvez choisir le type du télégramme auquel réagir. |
| Filtre RBE | _Report par filtre change_. S'il est défini, seule l'entrée MSG (du débit) ayant des valeurs différentes à chaque fois, sera envoyée au bus KNX. Si vous avez l'intention d'envoyer à chaque fois la même valeur, éteignez-la. Si vous êtes activé, l'indication "RBE" sera ajoutée au nom du nœud. |
|| **De KNX BUS à la broche ouput de Node** |
| Lire l'état au début | Lisez l'état de l'adresse du groupe, chaque fois que le Node-Red démarre et à chaque reconnexion à la passerelle KNX. Le nœud stocke toutes les valeurs d'adresse de groupe dans un fichier, afin que vous puissiez choisir wether à lire dans le fichier ou dans le bus KNX. |
| Filtre RBE | _Report par filtre change_. S'il est défini, seule la sortie MSG (dans le bus KNX) ayant des valeurs différentes à chaque fois, sera envoyée au flux de la sortie MSG. Si vous avez l'intention d'envoyer à chaque fois la même valeur, laissez-la éteindre. Si vous êtes activé, l'indication "RBE" sera ajoutée au nom du nœud. |
| Réagir aux télégrammes d'écriture | Le nœud réagira (enverra un msg au flux) chaque fois qu'il reçoit un télégramme _Write_ du bus KNX. Habituellement, vous voulez cela. |
| Réagir aux télégrammes de réponse | Le nœud réagira (enverra un msg au flux) chaque fois qu'il reçoit un télégramme _Response_ du bus KNX. Habituellement, vous voulez cela pour des scénarios particuliers. |
| Réagir aux télégrammes de lecture | Le nœud réagira (enverra un msg au flux) chaque fois qu'il reçoit un télégramme _read_ du bus KNX. Habituellement, vous voulez cela si vous souhaitez envoyer une valeur personnalisée au bus KNX. |
| Multiplier | Multiplie ou divise la valeur de charge utile. Ne fonctionne que si la valeur est un nombre. |
| Décimales | Des décimales rondes ou manipulées de quelque manière que ce soit. Ne fonctionne que si la valeur est un nombre. |
| Négatifs | Gère les valeurs négatives. Ne fonctionne que si la valeur est un nombre. |

Fonction ## Tab KNX

Vous pouvez utiliser JavaScript pour modifier le comportement du msg d'entrée provenant du flux et du télégramme de sortie envoyé au bus KNX. \
L'éditeur de code intégré fournit des objets et des fonctions utiles pour récupérer la valeur de toutes les adresses de groupe, à la fois avec le fichier ETS importé et sans (spécifiant le point de données). \
Le script s'appelle à chaque fois que le nœud reçoit un msg du flux ou un télégramme du bus KNX. \
S'il est activé, l'indication "f (x)" sera ajoutée au nom du nœud.

| Propriété | Description |
|-|-|
| Recherche GA | C'est un assistant uniquement si le fichier ETS a été importé. Commencez à taper et sélectionnez l'adresse de groupe que vous souhaitez ajouter au code. Copiez ensuite le champ complet et collez-le dans la fonction GetGavalue. **getGavalue ('0/0/1 Table Nord Lamp')** |

### Liste d'objets et de fonctions communes que vous pouvez utiliser dans le code

| Objet ou fonction | Description |
|-|-|
| msg (objet) | L'objet MSG actuel reçu par le nœud. |
| getGavalue (String GA, String facultatif DPT) | Obtenez la valeur de GA spécifiée, par exemple **'1/0/1'**, ou aussi **'1/0/1 light light'** (tout le texte après un espace vierge sera ignoré par la fonction. Ceci est utile si vous souhaitez ajouter le nom GA et un rappel. Avec le fichier ETS importé, vous pouvez également copier et coller le nom GA et GA directement dans le champ **Recherche GA**. **DPT** est facultatif si vous avez importé le fichier ETS, sinon vous devez le spécifier, par exemple «1.001». |
| setGavalue (String ga, n'importe quelle valeur, chaîne facultative dpt) | Définissez la valeur de GA spécifiée. Le GA Con doit être écrit par exemple **'1/0/1'**, ou aussi **'1/0/1 light light'** (tout le texte après un espace vide sera ignoré par la fonction. Ceci est utile si vous souhaitez ajouter le nom GA et un rappel. Avec le fichier ETS importé, vous pouvez également copier et coller le nom GA et GA directement à partir du champ GA **GA**.). La valeur ** **est obligatoire, peut être un booléen ou un numéro ou une chaîne,** dpt **est facultatif si vous avez importé le fichier ETS, sinon vous devez le spécifier, par exemple «1.001». |
| self (toute valeur) | Définissez la valeur du nœud Currend et envoie également la valeur au bus KNX. Par exemple, _self (false) _. ATTENTION UTILISATION** Self **Fonction dans le code Pin_ de sortie du bus KNX _From pour le nœud, car le code sera exécuté à chaque fois qu'un télégramme KNX est reçu, vous avez donc Coud ayant des boucles de récurrence. |
| basculer (rien) | Basculez la valeur du nœud Currend et envoie également la valeur au bus KNX. Par exemple, _toggle () _. ATTENTION en utilisant** Toggle **Fonction dans le code Pin_ de sortie du bus KNX _From à la sortie du nœud, car le code sera exécuté à chaque fois qu'un télégramme KNX est reçu, de sorte que vous avez des boucles de récurrence. |
| Node (objet) | L'objet nœud. |
| Red (objet Node-Red) | L'objet rouge du nœud-rouge. |
| return (msg) | `Retour MSG obligatoire;`, si vous souhaitez émettre le message. Sinon, l'utilisation de `retour; 'n'émettra aucun message. |

### du bus KNX à la broche de sortie du nœud

Dans cet échantillon, nous enverrons le msg d'entrée au bus KNX uniquement si un autre GA a une valeur opposée. \
Nous allons allumer la lumière uniquement si son statut GA est éteint, et vice versa.

```javascript
const statusGA = getGAValue('0/0/09','1.001');
if (msg.payload !== statusGA){ // "!==" means "not equal"
 return msg;
}else{
 // Both values are identical, so i don't send the msg.
 return;
}
```

Ici, si quelqu'un allume la lumière, nous allumons une autre lumière 0/1/8 et après 2 secondes, nous éteignons la lampe connectée au nœud.

```javascript
if (msg.payload){ 
 setGAValue('0/1/8',true)
 setTimeout(function() {
 self(off);
 }, 2000);
}
return msg;
```

### De KNX Bus à la broche ouput de Node

Dans cet échantillon, nous émettons l'objet MSG à l'écoulement, en ajoutant la valeur d'un autre GA à la sortie msg. \
Le msg ouput au flux aura également la température externe dans la propriété «msg.externaltemperature»

```javascript
// The current msg contains the internal temperature in the "msg.payload" property, but we want to emit the external temperature as well.
msg.externalTemperature = getGAValue('0/0/10'); // In case the ETS file is missing, you must specify the dpt as well: getGAValue('0/0/10','9.001')
return msg;
```

Dans cet autre échantillon, nous n'émettons pas de msg au flux, au cas où msg.payload et une autre valeur GA sont tous deux faux.

```javascript
if (msg.payload === false && getGAValue('0/0/11','1.001') === false){
 // Both false, don't emit the msg to the flow.
 return;
}else{
 // Ok, emit it.
 return msg;
}
```

## onglet Échantillon de charge utile

| Propriété | Description |
|-|-|
| Échantillon | Cela lui donnera un indice sur ce qu'il faut écrire dans un nœud de fonction externe, si vous souhaitez contrôler le nœud via un nœud de fonction Node-Red. |

### entrées** destination (chaîne) **: l'adresse du groupe de destination, par exemple 1/1/0. Seul le niveau 3 est autorisé.** charge utile (any) **: La charge utile à envoyer. Peut être par exemple vrai ou faux, ou un objet.** Événement (chaîne) **: Peut être _GroupValue \ _Write_ pour écrire le télégramme dans le bus KNX, _GroupValue \ _Response_ pour envoyer un télégramme de réponse au bus KNX, _update \ _nowrite_. _Update \ _nowrite_ envoie des rien au bus KNX, met à jour la valeur interne du nœud KNX-ultime. Ceci est utile si vous voulez seulement stocker la valeur dans le nœud et le lire plus tard avec une demande de lecture.** readStatus (boolean) **: émettez une demande de lecture au bus KNX. Passer _true_ à chaque fois (msg.readstatus = true).** DPT (String) **: Par exemple "1.001". Définit le point de données.** Writeraw (tampon) **: est utilisé pour envoyer une valeur au bus KNX, en tant que tampon. Utilisez en conjonction avec _Bitlenght_.** bitlenght (int) **: Spécifie le long du tampon _writeraw_. Utilisez en conjonction avec _WriteRaw_.** restrbe (boolean) **: réinitialise les filtres RBE internes (_USE msg.resetrbe = true_).** SetConfig (JSON) **: Modifiez par programme l'adresse de groupe de nœuds de périphérique KNX-ultimate et DataPoint. Voir les détails.

### Détails

`msg.setConfig`: Il est possible de modifier par programme la configuration du nœud KNX-ultime, en envoyant l'objet msg.setConfig au nœud.
La nouvelle configuration sera conservée jusqu'au prochain msg.setconfig ou jusqu'à redémarrage / redéployer.
Toutes les propriétés (_setGroupAddress_ et _setDpt_)** sont obligatoires **.. \
Utilisez-le comme ça, dans un nœud Functon:** Définissez GA et DPT **```javascript
// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to** auto **, the datapoint will be read from the ETS file (if present).
var config= {
 setGroupAddress: "0/1/2",
 setDPT: "1.001"
};
msg.setConfig = config;
return msg;
```** Définissez GA et lisez le point de données à partir du fichier ETS **```javascript
// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to "auto", the datapoint will be read from the ETS file (if present).
var config= {
 setGroupAddress: "0/1/2",
 setDPT: "auto"
};
msg.setConfig = config;
return msg;
```

### sorties

1. Sortie standard
 : charge utile (chaîne | numéro | objet) \ *\*: la broche 1 est la sortie standard de la commande.

2. Erreurs
 : erreur (objet) \ *\*: PIN 2 contient le message d'erreur détaillé.

### Détails

`msg.payload` est utilisé comme charge utile de l'adresse du groupe (la valeur d'adresse du groupe).
Il s'agit plutôt d'un exemple de l'objet MSG complet.

```json
msg = {
 topic: "0/1/2" // (Contains the node's topic, for example "MyTopic". If the node's topic is not set, contains the Group Address, for example "0/1/2")
 payload: false 
 previouspayload: true // Previous node payload value.
 payloadmeasureunit: "%" // Payload's measure unit.
 payloadsubtypevalue: "Start" // Subtype's decoded value, for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm
 devicename: "Dinning table lamp" // If the node is in **universal mode**, it contains the full path (main, middle,name) of the group address name, otherwise, the node name.
 gainfo: { // Contains the details about the group address name and number. This object is only present if the node is set in **universal mode** and with the **ETS file** been imported. If something wrong, it contains the string **unknown**.
 maingroupname:"Light actuators"
 middlegroupname:"First flow lights"
 ganame:"Table Light"
 maingroupnumber:"1"
 middlegroupnumber:"1"
 ganumber:"0"
 },
 echoed:true, // True if the msg is coming from the input PIN, otherwise false if the msg is coming form the KNX BUS.
 knx: { // This is a representation of the KNX BUS telegram, coming from BUS
 event: "GroupValue_Write" // (or "GroupValue_Response", or "GroupValue_Read")
 dpt: "1.001"
 dptdesc: "Humidity" // Payload's measure unit description
 source: "15.15.22"
 destination: "0/1/2" // Contains the Group Address
 rawValue: buffer[1]raw // (or null, if "GroupValue_Read")
 0: 0x0 // (This is the RAW undecoded value)
 }
}
``` **Exemple de charge utile** | Propriété | Description |

|-|-|
| Échantillon | Cela lui donnera un indice sur ce qu'il faut écrire dans un nœud de fonction externe, si vous souhaitez contrôler le nœud via un nœud de fonction Node-Red. |

### entrées

: destination (chaîne) \ *\*: l'adresse du groupe de destination, par exemple le 1/1/0. Seul le niveau 3 est autorisé. \
: charge utile (any) \ *\*: la charge utile à envoyer. Peut être par exemple vrai ou faux, ou un objet.
: événement (String) \ *\*: peut être _GroupValue \ _Write_ pour écrire le télégramme dans le bus KNX, _GroupValue \ _Response_ pour envoyer un télégramme de réponse au bus KNX, _update \ _NowRite_. _Update \ _nowrite_ envoie des rien au bus KNX, met à jour la valeur interne du nœud KNX-ultime. Ceci est utile si vous voulez seulement stocker la valeur dans le nœud et le lire plus tard avec une demande de lecture.
: ReadStatus (booléen) \ *\*: émettez une demande de lecture au bus KNX. Passer _true_ à chaque fois (msg.readstatus = true).
: dpt (String) \ *\*: Par exemple "1.001". Définit le point de données.
: Writeraw (tampon): est utilisé pour envoyer une valeur au bus KNX, en tant que tampon. Utilisez en conjonction avec _Bitlenght_.
: bitlenght (int): spécifie le long du tampon _writeraw_. Utilisez en conjonction avec _WriteRaw_.
: ressetrbe (boolean) \ *\*: réinitialise les filtres RBE internes (_USE msg.resetrbe = true_).
: setConfig (JSON) \ *\*: modifier par programme l'adresse de groupe de nœuds de périphérique KNX-ultimate et le point de données. Voir les détails.

### Détails

`msg.setConfig`: Il est possible de modifier par programme la configuration du nœud KNX-ultime, en envoyant l'objet msg.setConfig au nœud.
La nouvelle configuration sera conservée jusqu'au prochain msg.setconfig ou jusqu'à redémarrage / redéployer.
Toutes les propriétés (_setGroupAddress_ et _setDpt_) **sont obligatoires**.. \
Utilisez-le comme ça, dans un nœud Functon: **Définissez GA et DPT** ```javascript
// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to **auto**, the datapoint will be read from the ETS file (if present).
var config= {
 setGroupAddress: "0/1/2",
 setDPT: "1.001"
};
msg.setConfig = config;
return msg;
``` **Définissez GA et lisez le point de données à partir du fichier ETS** ```javascript
// Change the node properties as follows:
// setGroupAddress: set the new group address.
// setDPT: set the new Datapoint, as you can see in the dropdown list (the numeric part, for example "1.001", "237.600", etc...). If set to "auto", the datapoint will be read from the ETS file (if present).
var config= {
 setGroupAddress: "0/1/2",
 setDPT: "auto"
};
msg.setConfig = config;
return msg;
```

### sorties

1. Sortie standard
 : charge utile (chaîne | numéro | objet) \ *\*: la broche 1 est la sortie standard de la commande.

2. Erreurs
 : erreur (objet) \ *\*: PIN 2 contient le message d'erreur détaillé.

### Détails

`msg.payload` est utilisé comme charge utile de l'adresse du groupe (la valeur d'adresse du groupe).
Il s'agit plutôt d'un exemple de l'objet MSG complet.

```json
msg = {
 topic: "0/1/2" // (Contains the node's topic, for example "MyTopic". If the node's topic is not set, contains the Group Address, for example "0/1/2")
 payload: false 
 previouspayload: true // Previous node payload value.
 payloadmeasureunit: "%" // Payload's measure unit.
 payloadsubtypevalue: "Start" // Subtype's decoded value, for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm
 devicename: "Dinning table lamp" // If the node is in **universal mode**, it contains the full path (main, middle,name) of the group address name, otherwise, the node name.
 gainfo: { // Contains the details about the group address name and number. This object is only present if the node is set in **universal mode** and with the **ETS file** been imported. If something wrong, it contains the string **unknown**.
 maingroupname:"Light actuators"
 middlegroupname:"First flow lights"
 ganame:"Table Light"
 maingroupnumber:"1"
 middlegroupnumber:"1"
 ganumber:"0"
 }
 knx: { // This is a representation of the KNX BUS telegram, coming from BUS
 event: "GroupValue_Write" // (or "GroupValue_Response", or "GroupValue_Read")
 dpt: "1.001"
 dptdesc: "Humidity" // Payload's measure unit description
 source: "15.15.22"
 destination: "0/1/2" // Contains the Group Address
 rawValue: buffer[1]raw // (or null, if "GroupValue_Read")
 0: 0x0 // (This is the RAW undecoded value)
 }
}
```

## Sortie du message de l'ensemble de nœuds comme "Mode universel (écoutez toutes les adresses de groupe)"

Ici, vous avez 2 options: Importer le fichier CVS ETS ou non. 

L'importation de votre fichier ETS est la méthode <b> Aboslute suggérée </b>. Si vous importez votre fichier ETS, le nœud fera automatiquement le décodage de points de données et vous donnera également le nom de l'appareil. 

Si vous n'importez pas l'ETS, le nœud sortira le télégramme brut et il essaie également de le décoder. 

```javascript

msg = {
 topic: "0/1/2" // (Contains the Group Address of the incoming telegram)
 payload: false // (Automatically decoded telegram. If you've <b>not imported the ETS file</b>, the node will try to decode the telegram <b>but you can obtain an erroneus value</b>)
 payloadmeasureunit: "%" // (payload's measure unit)
 payloadsubtypevalue: "Start" // (Subtype's decoded value, for exampe, On/Off, Ramp/NoRamp, Start/Stop, Alarm/NoAlarm.)
 devicename: "(First Floor->Dinning Room) Dinning table lamp" // (the node will output the complete path of your house, including the device name, or the node's name in case you've <b>not imported the ETS file</b> )) 
 knx: 
 event: "GroupValue_Write" // (or "GroupValue_Response", or "GroupValue_Read")
 dpt: "1.001" // (If you've <b>not imported the ETS file</b>, this represents the datapoint used to try to decode the telegram)
 dptdesc: "Humidity" // (payload's measure unit description)
 source: "15.15.22"
 destination: "0/1/2" // (Contains the Group Address of the incoming telegram, same as topic)
 rawValue: buffer[1]raw // (or null, if "GroupValue_Read")
 0: 0x0 // (This is the RAW undecoded value)
 }}
 
```

## Message de sortie dans l'appareil virtuel

Ici, vous trouverez un échantillon de [Virtual Device](/node-red-contrib-knx-ultimate/wiki/-sample---virtual-device)

```javascript

 {
 topic: '5/0/1',
 payload: true,
 devicename: 'Light Status',
 event: 'Update_NoWrite',
 eventdesc: "The value has been updated from another node and hasn't been received from KNX BUS",
 previouspayload: true
 }
 
```

---

# Message de flux d'entrée

## Contrôle des appareils KNX

Le nœud accepte le MSG de l'écoulement à envoyer au bus KNX et envoie MSG au flux dès que le message KNX arrive du bus. 

En supposant que vous avez fourni une adresse de groupe et un point de données au nœud, soit manuellement ou avec des champs de population automatique en sélectionnant votre appareil dans la liste de l'appareil après avoir importé le fichier ETS. 

Vous pouvez également remplacer un ou plusieurs paramètres définis dans la fenêtre de configuration KNX-ultimate. 

Toutes les propriétés ci-dessous sont facultatives, à l'exception de la charge utile. **msg.Destination** Par exemple, "0/0/1". Définissez l'adresse de groupe à 3 niveaux que vous voulez mettre à jour. **msg.payload** Par exemple, true / false / 21 / "Bonjour". Définissez la charge utile que vous souhaitez envoyer au bus KNX. **msg.event** "GroupValue \ _Write": écrit le télégramme au bus KNX. 

"GroupValue \ _Response": envoie un télégramme de réponse au bus KNX. 

"Update \ _Nowrite": envoie des rien au bus KNX, met à jour la valeur interne du nœud KNX-ultime. Ceci est utile si vous ne voulez stocker la valeur que dans le nœud et le lire plus tard avec une demande de lecture. 

ATTENTION: Dans le cas de _msg.event = "Update \ _Nowrite" _ Tous les nœuds avec la même adresse de groupe émettra à l'écoulement un msg comme ceci:

```javascript

{
 topic: '5/0/1',
 payload: true,
 devicename: 'Light Status',
 event: 'Update_NoWrite',
 eventdesc: "The value has been updated from another node and hasn't been received from KNX BUS",
 previouspayload: true
}

```

Si vous souhaitez émettre une commande "lire", veuillez utiliser "ReadStatus" à la place (voir ci-dessous). **msg.readstatus = true** Émettez une commande "lire" au bus. **msg.dpt** Par exemple "1.001". Définit le <b> datapoint </b>. (Vous pouvez l'écrire dans ces formats: 9, "9", "9.001" ou "DPT9.001") **msg.writeraw**  **msg.bitlenght** Écrit des données brutes au bus KNX. Veuillez voir ci-dessous un exemple. **MSG.RESETRBE** PASS MSG.RESETRBE = VRAI À un nœud de périphérique, pour réinitialiser à la fois l'entrée et la sortie du filtre RBE sur ce nœud particulier. 

## modifier par programme la configuration du nœud via MSG

Il est possible de modifier par programme la configuration du nœud KNX-ultimate, en envoyant un objet msg.setConfig au nœud. 

[Veuillez consulter ici l'exemple de page.](/node-red-contrib-knx-ultimate/wiki/-sample-setconfig)

# Quick comment faire

Vous pouvez plus d'échantillons [ici](/node-red-contrib-knx-ultimate/wiki/-sampleshome) **Allumez une lampe** ```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.payload = true; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

``` **Absolute dim a lampe** ```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.payload = 30; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

``` **Envoyer du texte à un affichage** ```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.payload = "Output Tem. 35°C"; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

``` **Lisez l'état de la machine à laver** ```javascript

// Example of a function that sends a read status message to the KNX-Ultimate
// Issues a read request to the KNX bus. You'll expect a 'response' from the bus. You need to select the **React to response telegrams** option.
// The node will react to the KNX Response telegram coming from the BUS.
msg.readstatus = true; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

``` **Envoyez la valeur brute au bus** Pour envoyer une valeur de tampon brute au bus KNX, utilisez les propriétés _ **writerraw** _ et _ **bitlenght** _ de l'entrée msg. 

Dans ce cas, le _datapoint_ que vous définissez dans la fenêtre de propriété sera ignoré. 

Grapez un nœud de fonction devant KNX-ultime et collez son code:

```javascript

// If you encode the values by yourself, you can write raw buffers with writeraw.
// The bitlenght is necessary for datapoint types where the bitlenght does not equal the buffers bytelenght * 8. This is the case for dpt 1 (bitlength 1), 2 (bitlenght 2) and 3 (bitlenght 4).
// Write raw buffer to a groupaddress with dpt 1 (e.g light on = value true = Buffer<01>) with a bitlength of 1
msg.writeraw = Buffer.from('01', 'hex'); // Put '00' instead of '01' to switch off the light.
msg.bitlenght = 1;
return msg;

// Temperature sample (uncomment below and comment above)
// Write raw buffer to a groupaddress with dpt 9 (e.g temperature 18.4 °C = Buffer<0730>) without bitlength
// msg.writeraw = Buffer.from('0730', 'hex');
// msg.bitlenght = 1;
// return msg;

``` **Mettez à jour la valeur du nœud sans l'envoyer au bus** ```javascript

msg.event = "Update_NoWrite";
msg.payload = true;
return msg;

```

## Contrôle des périphériques KNX avec le nœud réglé sur "Mode universel (écoutez toutes les adresses de groupe)"

Ici, vous avez 2 options: Importer le fichier CVS ETS ou non. 

L'importation de votre fichier ETS est la méthode <b> Aboslute suggérée </b>. Si vous importez votre fichier ETS, il vous suffit de définir la charge utile pour être transmise. Le nœud fera automatiquement le codage de DataPoint. 

Si vous n'importez pas l'ETS CSV, vous devez également passer le type de point de données au nœud. **Éteignez une lampe <u> avec le fichier </u> ets importé** ```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.event = "GroupValue_Write";
msg.destination = "0/0/1"; // Set the destination 
msg.payload = false; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

``` **Éteignez une lampe <u> sans </u> ets Fichier importé** ```javascript

// Example of a function that sends a message to the KNX-Ultimate
msg.event = "GroupValue_Write";
msg.destination = "0/0/1"; // Set the destination 
msg.dpt = "1.001"; 
msg.payload = false; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

``` **Lisez l'état de tous les périphériques KNX <u> avec </u> ets Fichier importé** Vous ne pouvez pas émettre une demande de lecture à tous les groupes si vous n'importez pas votre fichier ETS, car le nœud ne peut pas savoir sur les appareils pour envoyer la demande de lecture.

```javascript

// Example of a function that sends a read status message to the KNX-Ultimate
// Issues a read request to the KNX bus. You'll expect a 'response' from the bus. You need to select the **React to response telegrams** option.
// The node will react to the KNX Response telegram coming from the BUS.
msg.readstatus = true; // issues a write or response (based on the options <b>Telegram type</b> above) to the KNX bus
return msg;

```

## Voir aussi

- [Configuration de la passerelle](/node-red-contrib-knx-ultimate/wiki/gateway-configuration)
- [Protection des références circulaires et protection contre les inondations](/node-red-contrib-knx-ultimate/wiki/protections)
- _Sample_
 - [Échantillons](https://github.com/supergiovane/node-red-constrib-knx-ultimate/wiki/-samplehome)

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
 <TD> Protection de référence circulaire. <a href = "/node-red-contrib-knx-ultimate/wiki/Protections" Target = "_ Blank"> Voir cette page. </a> </ td>
 </tr>
 <tr>
<td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluedot.png" alt="Blue status dot" /></td>
 <TD> réagir aux télégrammes de réponse. </td>
 </tr>
 <tr>
 <td> <img src = "https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/bluering.png"> </img> </td>
 <TD> Auto Envoi de la valeur du nœud comme réponse au bus. <a href = "/node-red-contrib-knx-ultimate/wiki/-sample---virtual-device" cible = "_ Blank"> Voir le périphérique virtuel. </a> </ td>
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
 <TD> Node désactivé en raison d'une référence circulare. <a href = "/node-red-contrib-knx-ultimate/wiki/Protections" Target = "_ Blank"> Voir cette page. </a> </ td>
 </tr>
 </ table>
