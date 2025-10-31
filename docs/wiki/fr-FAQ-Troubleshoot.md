---
layout: wiki
title: "FAQ-Troubleshoot"
lang: fr
permalink: /wiki/fr-FAQ-Troubleshoot
---
---
# FAQ et dépannage
_ Premier de tous, merci d'utiliser l'un de mes nœuds rouge de nœud! J'ai beaucoup travaillé sur ce nœud et j'espère que vous apprécierez mes efforts pour offrir mon travail à tous les utilisateurs. <br/>
Si vous êtes ici, vous pouvez avoir des problèmes. Je suis désolé pour cela. <br/> **Ne vous inquiétez pas et ne vous détendez pas ** , nous trouverons votre problème, car le nœud**KNX-ultimate fonctionne** , il a environ milliers d'installations dans le monde et je l'ai également installée pour ma maison. Alors, suivez la FAQ et si vous "j'ai toujours un problème", contactez-moi._
Sachez que la version minimale **NodeJS est 16** ou plus.
## Le nœud ne fonctionne pas
- Avez-vous créé le [Node de configuration de Gateway](/node-red-contrib-knx-ultimate/wiki/gateway-configuration) avec l'IP et le port pointant vers votre KNX / Router / IP Router / Interface?
- Si vous avez un routeur KNX / IP * ***, vous devez mettre dans le champ** hôte **, l'adresse IP KNX de multidiffusion** 224.0.23.12 **et port** 3671 **- Si vous avez une interface KNX / IP** **, vous devez mettre le champ ** hôte** , l'adresse IP de l'interface, par exemple **192.168.1.22** et port **3671** - Si vous avez **deux interfaces Ehternet ou plus** (comme Raspberry Pi), spécifiez l'interface Ethernet à utiliser dans le [Node de configuration de Gateway](/node-red-contrib-knx-ultimate/wiki/Gateway-configuration), ou en désactivant totalement l'interface WIFI. N'oubliez pas de **Redémarrer Node-Red** !
- Utilisez uniquement des interfaces KNX / IP pur KNX / IP certifiées (préférables) ou pures. N'utilisez pas les périphériques "all in One", les proxys, ou les appareils qui, outre d'autres fonctions, font également le routage KNX / IP. Une connexion stable entre ** LAN et KNX est la chose la plus importante** , et elle doit fonctionner. Dépensez de l'argent là-dessus et vous l'installerez et l'oublierez.
- Si vous avez ** une interface IP** Essayez de désactiver l'ACK en sélectionnant _Suppress ACK Request_ dans le [Node de configuration de la passerelle](https://github.com/supergiovane/Node-red-Contrib-kx-ultimate/wiki/Gateway-Configuration).
- Suivez la ** Je ne peux recevoir que des télégrammes, pas d'envoyer - ou vice versa** Liste de contrôle
- Si vous exécutez Node-Red dans un conteneur, ** retardez le début du Node-Red après le récipient enraciné** . Certains utilisateurs signalent que la carte Ethernet est toujours en baisse lorsque le RED Node démarre. Vous pouvez l'essayer en arrêtant manuellement le nœud-rouge, en désactivant le début automatique de Noded-Red au démarrage, en redémarrant le conteneur, en attendant 2-3 minutes et en démarrant manuellement le nœud-rouge. Si KNX-ultime fonctionne, le problème est que.
## Après un certain temps, le nœud cesse de fonctionner
- Lisez le ** le nœud ne fonctionne pas** FAQ.
- Vérifiez et éventuellement ** Désactiver** Protection DDOS ou protection contre les inondations UDP sur vos commutateurs / routeurs. Ceci comme règle générale. Les paquets UDP KNX peuvent être bloqués autrement.
- Essayez de connecter directement votre routeur / interface KNX / IP et votre PC Node-Red.
- Si vous avez une interface KNX / IP bon marché, spécialement si c'est un appareil "All in ONDE", il peut être suspendu. Allez acheter un vrai routeur KNX / IP.
- Si vous utilisez une interface KNX / IP, assurez-vous que vous n'avez pas atteint la limite de connexion maximale (consultez le manuel d'utilisation de votre interface KNX / IP). ** Les routeurs KNX / IP** sont préférables à la place, ils n'ont pas de limites de connexion.
Configuration ## KNXD
- Si vous utilisez ** KNXD** sur la même machine de Node-Red, veuillez utiliser 127.0.0.1 comme adresse d'interface, sinon KNXD aura des problèmes.
- Si vous utilisez ** KNXD** , veuillez vérifier les tables de filtrage et modifier l'adresse physicale du nœud de configuration KNX en conséquence.
- Activez le message envoyé ** Echo à tous les nœuds avec la même adresse de groupe** dans le nœud de configuration de la passerelle, sous les options Advanded.
## Je vois le télégramme dans ETS, mais mon actionneur ne réagira pas
Vous pouvez être installé d'autres plug-ins KNX de nœud-rouge.
- Retirez tout le plugin KNX de la palette Node-Red. Laissez uniquement KNX-ultimate. N'oubliez pas de supprimer également les nœuds de configuration, ils sont cachés.
- Si vous avez ** une interface IP** Essayez de désactiver l'ACK en sélectionnant _Suppress ACK Request_ dans le [Node de configuration de la passerelle](https://github.com/supergiovane/Node-red-Contrib-kx-ultimate/wiki/Gateway-Configuration).
## Je ne peux recevoir que des télégrammes, pas d'envoyer - ou vice versa
Votre routeur / interface KNX / IP peut avoir un filtrage actif.
- Vérifiez les ETS si le routeur a activé le filtrage. Si oui, permettez ** le transfert** dans toutes les pages de configuration de votre routeur KNX, soit modifier l'adresse physique du nœud de configuration KNX-ultimate en fonction des tables de filtre de votre routeur.
- Si vous utilisez ** KNXD** , veuillez vérifier les tables de filtrage et modifier l'adresse physique du nœud de configuration KNX en conséquence.
## Mauvaise valeurs du nœud
- Assurez-vous d'utiliser le bon point de données. Par exemple, pour la température, utilisez 9.001
- Lorsque cela est possible, importez le fichier ETS CSV dans le nœud de configuration de la passerelle. Vous aurez toujours les bons points de données!
- Assurez-vous de ne pas avoir deux ou plusieurs nœuds KNX-ultime, ayant ** la même adresse de groupe ** mais**DataPoint différent** .
# Al
### Cela se produit si vous utilisez une connexion tunnel / unicast, comme les interfaces KNX / IP ou KNXD.
- Activez le message envoyé ** Echo à tous les nœuds avec la même adresse de groupe** dans le nœud de configuration de la passerelle, sous les options Advanded.
## Cela fonctionne-t-il avec le routeur / interfaces KNX sécurisé?
Le routeur IP sécurisé / les interfaces ne fonctionne pas s'il est défini pour sécuriser. Cela fonctionne à la place, si vous autorisez les connexions non sécurisées au routeur.
- Assurez-vous de désactiver le routage sécurisé ou de permettre des connexions non sécurisées.
- Si vous pensez que vous pouvez être piraté, vous pouvez utiliser une deuxième carte Ethernet, la machine à rouge nœud de connexion directe à votre routeur KNX / Inteface avec un câble LAN dédié. Dans le nœud de configuration KNX-ultimate ** Bind to Interface** Option, vous pouvez ensuite définir cette interface pour être l'interface KNX / IP par défaut.
- La connexion sécurisée sera mise en œuvre un jour.
## La protection contre les inondations entre en jeu. Qu'est-ce que c'est?
La protection contre les inondations évite que votre interface utilisateur rouge de nœud ne soit pas réactive, en raison d'une quantité trop élevée de messages envoyés à la broche d'entrée du nœud dans un délai spécifié de 1 seconde. <br/>
Le nombre maximum de MSG que vous pouvez envoyer à un nœud est de 120 chaque seconde. Si vous devez envoyer beaucoup de MSG au nœud, veuillez considérer un nœud "Delay", pour retarder un peu chaque message. <br/>
[Voir ici](/node-red-contrib-knx-ultimate/wiki/protections)
- Passez en revue votre flux. Envoyez moins de messages au nœud ou utilisez un nœud ** de retard** .
- Utilisez le filtre RBE, pour éliminer les messages ayant la charge utile égale à la charge utile du nœud actuel.
## J'ai importé un fichier ETS mais il y a des avertissements sur les points de données
Dans une installation ETS, la définition de points de données est obligatoire, du moins pour un professionnel. <br/>
Avec des points de données, tous les périphériques de visualisation et de contrôle vous savent comment gérer le télégramme et comment effectuer un décontelier droit de valeurs. <br/>
Vous verrez que tous les appareils, les logiciels de contrôle, les systèmes de visualisation et tout le monde KNX ont besoin de points de données, alors pourquoi ne pas remercier KNX-ultimate, pour vous forcer à fixer enfin votre installation ETS, qui attend si longtemps pour être corrigé? :-) <br/>
- Mettez un casque sur votre tête, avec de la bonne musique, ouvrez ETS et commencez à ajouter des points de données.
- ou ... Importer le fichier ETS en sélectionnant l'option "Si l'adresse de groupe n'a pas de point de données", pour "importer avec un faux 1.001 dataPoint (non recommandé)", ou pour sauter le point de données affecté.
- N'oubliez pas de définir le point de données complet (Type principal + sous-type), sinon l'importateur définira un sous-type .001 par défaut. S'il vous plaît voir cette image![Pic de sous-type](https://raw.githubusercontent.com/supergiovane/node-red-ctrenib-kx-ultimate/master/img/wiki/subtype.png)
## La protection de référence circulaire entre en jeu. Qu'est-ce que c'est?
La protection de la référence circulaire évite que votre interface utilisateur rouge nœud ne soit pas réactive et que votre installation KNX soit inondé, en désactivant deux nœuds avec le même lien d'adresse de groupe. <br/>
Par exemple, si vous liez la broche ** sortie ** d'un nœud ayant une adresse de groupe 0/1/1, à la**entrée** Ping d'un autre nœud ayant la même adresse de groupe 0/1/1, la protection va lancer. <br/>
[Voir ici](/node-red-contrib-knx-ultimate/wiki/protections)
- Passez en revue votre flux. Détachez les deux nœuds identiques ou hors de quelque chose entre les deux, agissant comme "modérateur".
- Utilisez le filtre RBE, pour éliminer les messages ayant la charge utile égale à la charge utile du nœud actuel.
## J'ai toujours des problèmes
### Utilisez l'un des canaux ci-dessous pour me joindre (je préfère jamais Github)
- Ouvrez un problème sur [github](https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues). Chaque fois que vous ouvrez un problème, je reçois un e-mail et je peux le régler immédiatement.
- Envoyez-moi un PM sur [KNX-USER-FORUM](https://knx-user-forum.de). Je suis ici en tant que Theax74. Mein Deutsch ist Nicht So Gut, Daher Bitte auf Englisch Schreiben!
