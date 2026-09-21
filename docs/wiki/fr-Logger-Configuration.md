---
layout: wiki
title: "Logger-Configuration"
lang: fr
permalink: /wiki/fr-Logger-Configuration
---
## Mise à jour vers KNX Ultimate 8

La version 7 ajoute un petit bouton **Mettre à jour vers v8** en haut de chaque éditeur de nœud. Il sauvegarde les flux, installe les packages HUE/Matter requis, convertit les nœuds compatibles, effectue un Deploy complet, vérifie les flux enregistrés et installe la version 8. Redémarrez ensuite le service Node-RED comme demandé ; recharger uniquement le navigateur ne suffit pas. Les anciens nœuds KNX AI arrêtent l’opération automatique.

[Lire le guide complet de mise à jour](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Upgrade-to-v8)


<!-- KNX_UTILITY_LEGACY_NOTICE -->
> Ce nœud dédié reste compatible avec les flux existants. Pour les nouveaux flux, utilisez [KNX Utility](/node-red-contrib-knx-ultimate/wiki/fr-KNX-Utility) et sélectionnez **Logger**. Son éditeur convertit tous les anciens utilitaires compatibles dans tous les flux et sous-flux, avec une seule opération Annuler et un Deploy manuel.

# Enregistreur

 Le nœud d'enregistrement enregistre tous les télégrammes et les sortira dans un fichier compatible XML moniteur de bus ETS. 

Vous pouvez enregistrer le fichier sur le disque ou l'envoyer à un serveur FTP, par exemple.Le fichier peut ensuite être lu par votre ETS, par exemple pour le diagnostic ou pour une rediffusion des télégrammes.

Le nœud peut également compter les télégrammes par seconde (ou tout intervalle que vous souhaitez).

 <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample" Target = "_ Blank"> Les exemples sont ici. </a>

## PARAMÈTRES

| Propriété | Description |
|-|-|
|Porte |La passerelle KNX.|
|Sujet |Le sujet du nœud.|
|Nom de nœud |Nom du nœud.|

## fichier de diagnostic de bus compatible ETS

| Propriété | Description |
|-|-|
|Minuterie de démarrage automatique |Démarre automatiquement la minuterie sur le déploiement ou au démarrage de Node-RED.|
| Nouveau payload toutes les (en minutes) | Intervalle d’émission du payload et/ou de sauvegarde dans un fichier. En cas de sauvegarde dans un fichier, lorsque la limite de lignes configurée est atteinte, un mécanisme de **rotation** est appliqué, supprimant progressivement les lignes les plus anciennes.|
|Nombre maximum de lignes (0 = pas de limite) |Nombre maxi de lignes dans l’XML; les plus anciennes sont supprimées en premier. 0 = pas de limite. Lorsque la sauvegarde sur fichier est également activée, cette valeur représente le nombre maximal de lignes du fichier; à l’atteinte de cette limite, le fichier est **tourné**, en supprimant progressivement les lignes les plus anciennes.|
|Action |Émettre seulement le payload, ou émettre et sauvegarder dans un fichier.|
|Chemin de fichier (absolu ou relatif) |Où sauvegarder l’XML quand l’option de sauvegarde est choisie.|

## KNX TELEGRAM COMPTER

| Propriété | Description |
|-|-|
|Minuterie de démarrage automatique |Démarre automatiquement la minuterie sur le déploiement ou au démarrage de Node-RED.|
|Compter l'intervalle (en quelques secondes) |À quelle fréquence émettre un msg dans le flow, contenant le nombre de télégrammes KNX (en secondes).|

---

# Sortie du message de l'enregistreur

**broche 1: fichier de fichier compatible du moniteur de bus XML ETS**

Vous pouvez utiliser un nœud de fichier pour enregistrer la charge utile au système de fichiers, ou vous pouvez l'envoyer, par exemple, à un serveur FTP.

```javascript

msg = {
        topic:"MyLogger" 
        payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." (A String containing the XML file)
    } 

```

 

**PIN 2: COMPRESSION DE TÉLÉGRAM KNX**

Chaque nombre, le nœud émettra un télégramme comme celui-ci:

```javascript

msg = {
        topic:"",
        payload:10,
        countIntervalInSeconds:5,
        currentTime:"25/10/2021, 11:11:44"
    } 

```

---

# Message de flux d'entrée

Vous pouvez contrôler l'enregistreur à certains égards.

## fichier de moniteur de bus compatible ETS XML

**Démarrer la minuterie** 

```javascript

// Start the timer
msg.etsstarttimer = true;
return msg;

```

**Arrêtez la minuterie** 

```javascript

// Start the timer
msg.etsstarttimer = false;
return msg;

```

**Sortie immédiatement une charge utile avec le fichier ETS** 

```javascript

// Output payload. Restart timer as well (in case the timer was active)
msg.etsoutputnow = true;
return msg;

```

## KNX TELEGRAM COMPTER

**Démarrer la minuterie** 

```javascript

// Start the timer
msg.telegramcounterstarttimer = true;
return msg;

```

**Arrêtez la minuterie** 

```javascript

// Start the timer
msg.telegramcounterstarttimer = false;
return msg;

```

**Message de compte télégramme de sortie immédiatement** 

```javascript

// Output payload. 
msg.telegramcounteroutputnow = true;
return msg;

```

## Voir aussi

- _Sample_
- [Exemple d'enregistreur](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
