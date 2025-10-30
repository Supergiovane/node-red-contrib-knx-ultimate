---
layout: wiki
title: "Logger-Configuration"
lang: fr
permalink: /wiki/fr-Logger-Configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Logger-Configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Logger-Configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Logger-Configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Logger-Configuration)

# Enregistreur

 Le nœud d'enregistrement enregistre tous les télégrammes et les sortira dans un fichier compatible XML moniteur de bus ETS. 

Vous pouvez enregistrer le fichier sur le disque ou l'envoyer à un serveur FTP, par exemple.Le fichier peut ensuite être lu par votre ETS, par exemple pour le diagnostic ou pour une rediffusion des télégrammes.

Le nœud peut également compter les télégrammes par seconde (ou tout intervalle que vous souhaitez).

 <a href = "https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-sample" Target = "_ Blank"> Les exemples sont ici. </a>

## PARAMÈTRES

| Propriété | Description |
|-|-|
|Passerelle |La passerelle KNX.|
|Sujet |Le sujet du nœud.|
|Nom |Nom du nœud.|

## fichier de diagnostic de bus compatible ETS

| Propriété | Description |
|-|-|
|Timer de démarrage automatique |Démarre automatiquement la minuterie sur le déploiement ou sur le démarrage du rouge-rouge.|
|Sortir de nouveaux XML chaque (en minutes) |L'heure, en quelques minutes, que le journaliste sortira le fichier compatible du moniteur de bus XML ETS XML.|
|Nombre maximum de lignes dans XML (0 = aucune limite) |Démarre automatiquement la minuterie sur le déploiement ou sur le démarrage du rouge-rouge.|
|Timer de démarrage automatique |Cela représente le nombre maximum de ligne, que le fichier XML peut contenir dans l'intervalle spécifié ci-dessus.Mettez 0 pour ne pas limiter le nombre de lignes dans le fichier.|
|Nombre maximum de lignes dans XML (0 = aucune limite) |Cela représente le nombre maximum de ligne, que le fichier XML peut contenir dans l'intervalle spécifié ci-dessus.Mettez 0 pour ne pas limiter le nombre de lignes dans le fichier.|

## KNX TELEGRAM COMPTER

| Propriété | Description |
|-|-|
|Timer de démarrage automatique |Démarre automatiquement la minuterie sur le déploiement ou sur le démarrage du rouge-rouge.|
|Intervalle de comptage (en quelques secondes) |À quelle fréquence émettent un MSG à l'écoulement, contenant le nombre de télégrammes KNX.En quelques secondes.|

---

# Sortie du message de l'enregistreur

**broche 1: fichier de fichier compatible du moniteur de bus XML ETS**

Vous pouvez utiliser un nœud de fichier pour enregistrer la charge utile au système de fichiers, ou vous pouvez l'envoyer, par exemple, à un serveur FTP.```javascript

msg = {
        topic:"MyLogger" 
        payload: "CommunicationLog xmlns=http://knx.org/xml/telegrams/01 Telegram Timestamp=2020-03-27T07:32:39.470Z Service=L_Data.ind...." (A String containing the XML file)
    } 

```
 

**PIN 2: COMPRESSION DE TÉLÉGRAM KNX**

Chaque nombre, le nœud émettra un télégramme comme celui-ci:```javascript

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

``` **Arrêtez la minuterie** 
```javascript

// Start the timer
msg.etsstarttimer = false;
return msg;

``` **Sortie immédiatement une charge utile avec le fichier ETS** 
```javascript

// Output payload. Restart timer as well (in case the timer was active)
msg.etsoutputnow = true;
return msg;

```## KNX TELEGRAM COMPTER

**Démarrer la minuterie** 
```javascript

// Start the timer
msg.telegramcounterstarttimer = true;
return msg;

``` **Arrêtez la minuterie** 
```javascript

// Start the timer
msg.telegramcounterstarttimer = false;
return msg;

``` **Message de compte télégramme de sortie immédiatement** 
```javascript

// Output payload. 
msg.telegramcounteroutputnow = true;
return msg;

```## Voir aussi

- _Sample_
- [Exemple d'enregistreur](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Logger-Sample)
