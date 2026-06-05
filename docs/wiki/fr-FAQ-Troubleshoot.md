---
layout: wiki
title: "FAQ-Troubleshoot"
lang: fr
permalink: /wiki/fr-FAQ-Troubleshoot
---
---
# FAQ et dépannage
Merci d'utiliser mes nœuds Node-RED ! Si tu es ici, tu as probablement un problème : pas de panique, on va le résoudre. KNX-Ultimate est stable et largement utilisé. Suis les points ci-dessous ; en fin de page tu trouveras comment me contacter.
Prérequis minimum : **Node.js >= 16**
## Le nœud ne fonctionne pas
- As-tu créé le [Gateway configuration node](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) avec l'IP/le port corrects vers ton KNX/IP Router ou Interface ?
- KNX/IP **Router ** : dans**Host** , mets l'adresse multicast KNX `224.0.23.12`, port `3671`.
- KNX/IP **Interface ** : dans**Host** , mets l'IP de l'interface (ex. `192.168.1.22`), port `3671`.
- Si tu as **plusieurs cartes réseau ** (Ethernet/Wi-Fi), indique laquelle utiliser dans le Gateway ou désactive le Wi-Fi. Ensuite,**redémarre Node-RED** .
- Utilise uniquement des routeurs/interfaces KNX/IP "purs” et certifiés. Évite les appareils "all-in-one” ou les proxys non dédiés au routage KNX/IP.
- Avec une interface IP, essaie de désactiver l'ACK en sélectionnant "Suppress ACK request” dans le Gateway.
- Vois aussi "Je ne peux que recevoir / pas envoyer”.
- Si Node-RED tourne dans un conteneur, retarde son démarrage de quelques secondes : parfois la carte réseau n'est pas encore prête.
## Au bout d'un moment, ça cesse de fonctionner
- Relis "Le nœud ne fonctionne pas”.
- Désactive la protection DDOS/UDP flood sur les switchs/routeurs (elle peut bloquer l'UDP KNX).
- Teste une connexion directe entre le PC et le KNX/IP.
- Évite les interfaces bon marché/all-in-one : préfère un **KNX/IP Router** .
- Avec les interfaces IP, surveille la limite de connexions simultanées (manuel du fabricant). Les routeurs n'ont pas cette limite.
## Configuration de knxd
- knxd sur la même machine que Node-RED : utilise `127.0.0.1` comme interface.
- Vérifie les tables de filtrage et ajuste l'adresse physique du config-node.
## Je vois le télégramme dans ETS mais l'actionneur ne réagit pas
Tu as peut-être d'autres plug-ins KNX pour Node-RED installés.
- Retire tous les plug-ins KNX de la palette et ne laisse que KNX-Ultimate (supprime aussi les config-nodes cachés).
- Avec les interfaces IP, essaie "Suppress ACK request” dans le Gateway.
## Je ne peux que recevoir les télégrammes, pas envoyer (ou vice versa)
Il peut y avoir un filtrage actif dans le Router/Interface.
- Dans ETS, autorise le **forwarding** sur toutes les pages du routeur, ou change l'adresse physique du config-node selon les tables de filtre.
- Avec knxd, vérifie les tables de filtrage et ajuste l'adresse physique.
## Je n'arrive pas à écrire sur le bus avec une interface KNX/IP Weinzierl (ou similaire)
Certaines **interfaces ** KNX/IP, comme la série**Weinzierl KNX IP Interface 73x** , peuvent ne pas renvoyer l'ACK du `L_Data.req` dans le délai attendu, surtout via**des liaisons VPN ou à forte latence** . Dans ce cas, tu reçois les télégrammes mais l'écriture sur le bus échoue silencieusement.
- Active **Suppress ACK request ** dans le [Gateway configuration node](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration). Sur une Weinzierl 732 atteinte via VPN, cela a corrigé l'écriture.
## Mauvaises valeurs depuis le nœud
- Utilise le bon Datapoint (température : `9.001`).
- Si possible, importe le CSV ETS dans le Gateway : tu auras toujours les bons DPT.
- Évite d'avoir deux nœuds avec **le même GA ** mais un**DPT différent** .
## Les messages entre nœuds ayant le même GA ne se propagent pas
Cela arrive avec les connexions tunneling/unicast (KNX/IP Interface ou knxd).
- Dans les versions actuelles, les écritures locales sont déjà répercutées automatiquement vers les nœuds KNX Device ayant le même GA. Si tu vois encore des incohérences, vérifie que les nœuds utilisent le même gateway config-node et le même Group Address.
## Secure KNX Router/Interfaces
En mode secure, ils ne fonctionnent pas ; ils fonctionnent si tu autorises les connexions non sécurisées.
- Désactive le routage secure ou autorise les connexions non sécurisées.
- Pour plus d'isolation, relie une seconde carte réseau dédiée entre Node-RED et le Router KNX, et configure "Bind to local interface” dans le Gateway.
- La connexion secure pourra être implémentée à l'avenir.
## Flood protection
Évite de saturer l'UI et le BUS en limitant les msg en entrée du nœud à 120/seconde max (fenêtre de 1s).
- Utilise un nœud **delay** pour étaler les messages.
- Utilise le filtre **RBE** pour écarter les valeurs inchangées.
  [Détails](/node-red-contrib-knx-ultimate/wiki/Protections)
## Avertissements sur les Datapoints après import ETS
- Dans ETS, complète les DPT (sous-type inclus, ex. `5.001`).
- Ou à l'import, choisis "Import with a fake 1.001 datapoint (Not recommended)” ou saute les GA concernés.
## Protection contre les références circulaires
Évite les boucles quand deux nœuds avec le même GA sont reliés directement sortie→entrée.
- Revois le flow : sépare les deux nœuds ou place un "modérateur” entre les deux.
- Active RBE pour éviter les rebonds.
  [Détails](/node-red-contrib-knx-ultimate/wiki/Protections)
## J'ai toujours un problème
- Ouvre une issue sur [GitHub](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues) (préféré).
- Ou envoie-moi un PM sur [KNX-User-Forum](https://knx-user-forum.de) (utilisateur : TheMax74 ; écris en anglais).
