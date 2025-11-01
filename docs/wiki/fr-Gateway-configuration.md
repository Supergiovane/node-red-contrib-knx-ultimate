---
layout: wiki
title: "Gateway-configuration"
lang: fr
permalink: /wiki/fr-Gateway-configuration/
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
| Adresse physique KNX | L'adresse physique KNX, exemple 1.1.200. La valeur par défaut est "15.15.22". |
| Se lier à l'interface locale | Le nœud utilisera cette interface locale pour les communications. Laissez "Auto" pour la sélection automatique. Si vous avez plus d'une connexion LAN, par exemple Ethernet et WiFi, il est fortement recommandé de sélectionner manuellement l'interface, sinon tout le télégramme UDP n'atteindra pas votre ordinateur, donc le nœud peut ne pas fonctionner comme prévu. La valeur par défaut est "Auto". |
| Connectez-vous automatiquement au bus KNX au démarrage | Connectez-vous automatiquement au bus au départ. La valeur par défaut est "oui". |
| Secure d'identification sécurisée | Choisissez comment les données sécurisées KNX sont fournies: **ETS Fichier de clés ** (Données Secure Keys - et les informations d'identification de tunneling si elles sont présentes - proviennent de la clés),**Indementiels manuels ** (Seul KNX IP Tunneling Secure avec un utilisateur saisi manuellement), ou**Clémentiel + Mot de passe du tunnel manuel** Utilisateur manuel). N'oubliez pas que les télégrammes Secure Data KNX nécessitent toujours un fichier de clés. |
| Interface tunnel Adresse individuelle | Visible chaque fois que le mode sélectionné comprend des informations d'identification manuelles (manuel ou clés + mot de passe du tunnel manuel). Adresse individuelle KNX facultative pour l'interface du tunnel sécurisé (par exemple `1.1.1`); Laissez vide pour laisser KNX Ultimate le négocier automatiquement. |
| ID utilisateur du tunnel | Visible lorsque des références manuelles sont utilisées. Identificateur d'utilisateur de tunnel Secure KNX en option défini dans ETS. |
| Mot de passe utilisateur du tunnel | Visible lorsque des références manuelles sont utilisées. Mot de passe de l'utilisateur de tunneling Secure KNX configuré dans ETS. |

> **KNX Secure Essentials** \
> • _KNX Data Secure_ protège les télégrammes d'adresses de groupe et **toujours** a besoin d'un fichier de clés contenant les touches de groupe. \
> • _KNX IP Tunneling Secure_ protège la poignée de main de connexion avec un mot de passe de mise en service. Selon le mode sélectionné, le mot de passe peut provenir du clés ou être entré manuellement.

**Avancé**

| Propriété | Description |
|-|-|
| Echo envoyé un message à tous les nœuds avec la même adresse de groupe | Envoyez l'entrée MSG provenant du flux, à tous les nœuds ayant la même adresse de groupe. Les nœuds recevront le nouveau MSG comme s'il provenait du bus KNX. Ceci est utile en cas d'utilisation de l'émulation KNX et au cas où la connexion au bus KNX n'est pas établie. **Cette option sera obsolète dans la version suivante et par défaut est vérifiée.** La valeur par défaut est vérifiée. |
| Supprimez les télégrammes répétés (R-FLAG) FOM BUS | Ignorez des télégrammes KNX répétés provenant du bus. La valeur par défaut n'est pas contrôlée. |
| Supprimez la demande ACK en mode tunnel | Activez-le si vous avez une très ancienne passerelle KNX / IP. Il ignore la procédure ACK et accepte tous les télégrammes. La valeur par défaut n'est pas contrôlée. |
| Retard entre chaque télégramme (en millisecondes) | KNX Specs indique que la vitesse d'envoi de télégramme maximum est de 50 télégrammes par seconde. Une vitesse comprise entre 25 et 50 ms devrait être bien, sauf si vous vous connectez à une passerelle KNX distante via une connexion Internet lente (dans ce cas, vous devez augmenter la valeur, par exemple, 200 à 500 ms ou plus). |
| Loglevel | Niveau de journal, au cas où vous auriez besoin de déboguer quelque chose avec le développement. La valeur par défaut est "erreur", |
| Temporisation de l'état du nœud | Définissez la fréquence de mise à jour des badges de statut. Avec un délai actif, les changements intermédiaires sont ignorés et seul le dernier est affiché après l'intervalle choisi. Sélectionnez **Immédiat** pour conserver le comportement en temps réel. |

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

<a href="https://youtu.be/egRbR_KwP9I"><img src='https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/yt.png'></a>

### Importer la liste d’adresses de groupe au format CSV

**Attention.** Le nom d’une adresse de groupe ne doit contenir aucune tabulation. Si un GA n’a pas de datapoint dans ETS, vous pouvez interrompre l’import, ignorer cette adresse ou l’ajouter avec un datapoint temporaire `1.001` et poursuivre.

**Exporter le CSV depuis ETS**

1. Dans ETS, ouvrez la vue *Adresses de groupe*, faites un clic droit dans la liste puis choisissez **Exporter les adresses de groupe**.
2. Dans la fenêtre d’export, sélectionnez :
   - **Format de sortie :** CSV
   - **Format CSV :** 1/1 Name/Address
   - **Exporter avec ligne d’en-tête :** activé
   - **Séparateur CSV :** Tabulator
3. Exporte z le fichier puis copiez son contenu dans le champ **ETS group address list** (ou indiquez directement le chemin du fichier).

**Ce qu’il faut surveiller pendant l’import**

- Le fichier CSV doit contenir un datapoint pour chaque adresse de groupe.
- Le nœud analyse le fichier et affiche le résultat dans le panneau debug de Node-RED :
  - **ERROR** – datapoint manquant : l’import est arrêté.
  - **WARNING** – sous-type manquant : un sous-type par défaut est appliqué mais il est recommandé de le vérifier (le sous-type correspond au nombre après le point, ex. `5.001`).
- Les champs doivent être entourés de guillemets, par exemple :

  

```

"Attuatori luci"	"0/-/-"	""	""	""	""	"Auto"
  

```

### Importer la liste d’adresses de groupe au format ESF

1. Dans ETS, sélectionnez votre projet, cliquez sur l’icône d’export (flèche vers le haut) puis choisissez le format **ESF** (et non `.knxprod`).
2. Copiez le contenu du fichier ou indiquez son chemin dans le champ **ETS group address list** du gateway.

<table style="font-size:12px">
  <tr><th colspan="2" style="font-size:14px">Signification des couleurs d’état du nœud</th></tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greendot.png" alt="Point vert" /></td>
    <td>Réagit aux télégrammes d’écriture.</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greenring.png" alt="Anneau vert" /></td>
    <td>Protection contre les références circulaires (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki" target="_blank">voir la page dédiée</a>).</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluedot.png" alt="Point bleu" /></td>
    <td>Réagit aux télégrammes de réponse.</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/bluering.png" alt="Anneau bleu" /></td>
    <td>Envoie automatiquement la valeur du nœud comme réponse au bus (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/-Sample---Virtual-Device" target="_blank">exemple de périphérique virtuel</a>).</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greudot.png" alt="Point gris" /></td>
    <td>Réagit aux télégrammes de lecture.</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/greyring.png" alt="Anneau gris" /></td>
    <td>Filtre RBE : aucun télégramme envoyé.</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/reddot.png" alt="Point rouge" /></td>
    <td>Erreur ou passerelle déconnectée.</td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/Supergiovane/node-red-contrib-knx-ultimate/master/img/redring.png" alt="Anneau rouge" /></td>
    <td>Nœud désactivé à cause d’une référence circulaire (<a href="https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki" target="_blank">voir la page dédiée</a>).</td>
  </tr>
</table>
