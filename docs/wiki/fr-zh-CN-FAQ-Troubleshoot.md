---
layout: wiki
title: "zh-CN-FAQ-Troubleshoot"
lang: fr
permalink: /wiki/fr-zh-CN-FAQ-Troubleshoot
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/FAQ-Troubleshoot) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-FAQ-Troubleshoot) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-FAQ-Troubleshoot) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-FAQ-Troubleshoot) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-FAQ-Troubleshoot) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-FAQ-Troubleshoot)
---
#Faq & dépannage
Merci d'utiliser mon nœud rouge de nœud!Si vous avez des problèmes, ne vous inquiétez pas: suivez simplement la liste ci-dessous pour vérifier l'article par article.KNX-ultimate a été largement utilisé et est stable et fiable.
Exigences minimales: **node.js> = 16**
## Le nœud ne fonctionne pas
- Le nœud de configuration de la passerelle](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration) (pointant-il vers votre routeur KNX / IP ou le port IP / Port de votre interface) est-il créé et correctement configuré?
- KNX / IP **ROUTER ** :**HOST** FILL EN `224.0.23.12`, port` 3671`.
- KNX / IP **Interface ** :**hôte** Remplissez le périphérique IP (tel que `192.168.1.22`), port` 3671`.
- Lorsque plusieurs NICS **existent (Ethernet / Wireless), spécifiez les NICS à utiliser dans la passerelle ou désactivez le Wi-Fi. Après modification, assurez-vous de ** redémarrer le nœud - rouge** .
- Utilisez uniquement l'interface KNX / IP Certifiée et certifiée ou KNX / IP pour éviter les périphériques "All-in-One / Agent".
- Lorsque vous utilisez l'interface, vous pouvez activer le test "Supprimer la demande ACK" dans la passerelle.
- Voir "Recevoir uniquement / ne peut pas envoyer" ci-dessous.
- Si vous exécutez dans un conteneur, veuillez retarder légèrement le nœud de démarrage** (parfois la carte réseau n'est pas prête).
## Arrêtez après avoir couru pendant un moment
- Reportez-vous à la section précédente "Les nœuds ne peuvent pas fonctionner".
- Temporairement **Éteignez la protection des inondations DDOS / UDP sur le commutateur / routeur** (peut intercepter les paquets UDP de KNX).
- Connectez directement les périphériques KNX / IP au test hôte rouge-rouge.
- Évitez les interfaces bon marché ou entièrement one et donnez la priorité au routeur **knx / ip** .
- Soyez conscient de la limite de connexion simultanée lors de l'utilisation de l'interface (voir Manuel du produit).Le routeur n'a généralement pas une telle limitation.
Configuration ## KNXD
- **KNXD** Lorsque sur le même hôte que Node - Red, l'interface est recommandée d'utiliser `127.0.0.1`.
- Vérifiez les tables de filtre et ajustez l'adresse physique de la configuration en conséquence.
- Activer "Echo Send Message à tous les nœuds avec la même adresse de groupe" dans Gateway.
## ETS peut voir des messages, mais l'exécuteur testamentaire n'a aucune réponse
Peut entrer en conflit avec d'autres plugins KNX.
- Supprimez les autres plug-ins KNX de la palette rouge du nœud, en gardant uniquement KNX-ultimate (et supprimez également les codes de configuration cachés).
- Allumez le test "Supprimer la demande ACK" dans la passerelle lors de l'utilisation de l'interface.
## ne peut recevoir que, pas d'envoyer (ou vice versa)
Votre routeur / interface peut avoir le filtrage activé.
- Autoriser **Transfert** dans ETS; ou ajustez l'adresse physique du nœud de configuration en fonction de la table de filtre du routeur.
- Lorsque vous utilisez **KNXD** , veuillez vérifier la table de filtre et ajuster l'adresse physique en conséquence.
## Erreur de valeur
- Utilisez le point de données correct (température: `9.001`).
- Importer ETS CSV dans Gateway pour obtenir le DPT correct.
- Évitez deux nœuds en utilisant le même ga **mais différent DPT** .
## pas "intercommunication" entre les nœuds du même GA
Tourné couramment dans le tunneling / unicast (interface, KNXD).
- Activer "Echo Send Message à tous les nœuds avec la même adresse de groupe" dans Gateway.
## Routeur / interfaces KNX sécurisées
Non pris en charge lorsque le mode sécurisé est activé;Si des connexions non sécurisées sont autorisées, elle peut fonctionner correctement.
- Fermez le routage sécurisé ou permettez des connexions dangereuses.
- Facultatif: Ajoutez une carte réseau dédiée directement connectée au routeur KNX à Node - Red, et définissez "Bind to Interface Local" sur la passerelle.
- Les connexions sécurisées peuvent être prises en charge à l'avenir.
## Protection des inondations (protection des limites de courant)
Pour éviter la surcharge d'interface utilisateur et de bus: chaque nœud par défaut pour recevoir jusqu'à 120 messages dans une fenêtre de 1 seconde.
- Utilisez le nœud **Delay** pour disperser les messages.
- Filtrez des valeurs en double utilisant **rbe** .
[Détails](/node-red-contrib-knx-ultimate/wiki/Protections)
## Un avertissement de point de données apparaît après l'importation d'ETS
- Remplissez les ETS (sous-types, tels que `5.001`).
- ou sélectionnez "Importer avec un faux point de données 1.001 (non recommandé)" lors de l'importation ou de la sauts de l'AG associée.
## Protection de référence circulaire
Lorsque deux nœuds sont connectés directement avec le même GA Out → IN, le système le désactivera pour empêcher le bouclage.
- Processus de réglage: divisez ces deux nœuds ou ajoutez-y des nœuds "médiation / tampon".
- Activer **rbe** pour éviter le bouclage.
[Détails](/node-red-contrib-knx-ultimate/wiki/Protections)
## Vous avez encore des problèmes?
- Il est recommandé de faire un problème (priorité) dans [GitHub](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues).
- ou envoyez-moi un message privé à [knx-user-forum](https://knx-user-forum.de) (utilisateur: theax74; s'il vous plaît en anglais).
