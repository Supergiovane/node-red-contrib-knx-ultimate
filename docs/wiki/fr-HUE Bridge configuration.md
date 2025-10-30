---
layout: wiki
title: "HUE Bridge configuration"
lang: fr
permalink: /wiki/fr-HUE%20Bridge%20configuration
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/HUE%20Bridge%20configuration) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-HUE%20Bridge%20configuration) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-HUE%20Bridge%20configuration) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-HUE%20Bridge%20configuration) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-HUE%20Bridge%20configuration) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-HUE%20Bridge%20configuration)

<h1>  NODES DE CHEUS PHILIPS 

 </h1>

 <img src = 'https://raw.githubusercontent.com/supergiovane/node-red-contrib-knx-ultimate/master/img/huehub.jpg' width = '40% '> 

Ce nœud enregistre Node-RED auprès du pont Hue et gère désormais automatiquement la procédure d'appairage.

Saisissez l'adresse IP du pont (ou sélectionnez l'un des ponts découverts automatiquement) puis cliquez sur **CONNECT**. L'éditeur interroge la passerelle en continu et ferme la fenêtre d'attente dès que vous appuyez sur le bouton physique de liaison. Utilisez **CANCEL** pour annuler l'attente et réessayer plus tard. Les champs Nom d'utilisateur et Client Key restent modifiables afin de pouvoir copier ou coller les identifiants quand vous le souhaitez.

Vous avez déjà les identifiants ? Cliquez sur **JE POSSÈDE DÉJÀ LES IDENTIFIANTS** pour afficher immédiatement les champs et les saisir manuellement sans attendre le bouton du pont.

**Général**

| Propriété | Description |
|-|-|
| IP | Indiquez l'adresse IP fixe de votre pont Hue ou choisissez un pont détecté automatiquement. |
| CONNECT | Lance l'enregistrement et attend l'appui sur le bouton de liaison du pont. La boîte de dialogue se ferme automatiquement après l'appui ; utilisez **CANCEL** pour arrêter l'attente. |
| Nom | Nom du pont lu sur le Hue Bridge après une connexion réussie. |
| Username / Client Key | Identifiants renvoyés par le Hue Bridge après l'appairage. Les champs restent modifiables pour faciliter le copier/coller ou la saisie manuelle. |

![image.png](../ img / hude-config.png)
