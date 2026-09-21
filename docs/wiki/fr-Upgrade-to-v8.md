---
layout: wiki
title: "Mise à jour vers KNX Ultimate 8"
lang: fr
permalink: /wiki/fr-Upgrade-to-v8
---
# Mise à jour vers KNX Ultimate 8

La version 7 affiche un petit bouton **Mettre à jour vers v8** en haut de l’éditeur de chaque nœud KNX Ultimate. Une seule opération guidée effectue la migration ; n’installez pas manuellement la version 8 au préalable.

## Fonctionnement du bouton

1. Télécharge une sauvegarde JSON de tous les flux présents dans l’éditeur. Comme pour l’export standard de Node-RED, les identifiants protégés sont exclus du fichier mais restent stockés dans Node-RED.
2. Installe HUE Ultimate et/ou Matter Ultimate uniquement si les flux contiennent les nœuds qui en ont besoin.
3. Convertit sur place les nœuds KNX Utility, HUE et Matter compatibles en conservant identifiants, connexions, groupes, références de configuration et données Matter.
4. Effectue un Deploy complet puis relit les flux enregistrés par Node-RED. KNX Ultimate 8 n’est installé que si aucun type de nœud supprimé ne subsiste.
5. Demande de redémarrer le service Node-RED. Ce redémarrage est obligatoire ; recharger uniquement le navigateur ne suffit pas.

Le formulaire du nœud actuel se ferme au démarrage : enregistrez d’abord les éventuelles modifications saisies dans ce formulaire. Le compte doit pouvoir lire et déployer les flux ainsi qu’installer/mettre à jour les modules de la palette.

Si une ancienne version du package séparé HUE Ultimate ou Matter Ultimate est déjà installée, le bouton prépare d’abord sa mise à jour et demande un redémarrage préalable du service. Rechargez l’éditeur et appuyez de nouveau sur le bouton ; aucun flux n’est modifié pendant cette étape préliminaire. Une installation normale de la version 7 ne nécessite pas ce redémarrage supplémentaire.

## Arrêts de sécurité

L’opération s’arrête avant toute modification si elle trouve un flux verrouillé, un nœud inconnu ou invalide sans rapport avec la migration, ou un ancien nœud KNX AI / KNX AI Home Assistant. Les réglages AI ne peuvent pas être convertis de façon sûre vers Cerebrum Ultimate ; remplacez ou supprimez manuellement ces rares nœuds, puis relancez le bouton.

Si l’installation d’un package échoue avant le Deploy, la conversion dans l’éditeur est annulée. Si le flux converti a déjà été déployé mais que l’installation de KNX Ultimate 8 échoue, la version 7 et les packages séparés restent utilisables : corrigez l’erreur signalée puis relancez le bouton.

Si une requête de package expire et peut encore être en cours, n’effectuez aucun Deploy : redémarrez le service Node-RED, rechargez l’éditeur et appuyez de nouveau sur le bouton.

Si une interruption de connexion empêche de vérifier le résultat du Deploy, l’opération ne suppose pas le résultat et n’effectue aucun retour arrière automatique. Rechargez l’éditeur et vérifiez les flux enregistrés avant de réessayer. Si un autre éditeur a modifié la révision des flux, seule la conversion automatique est annulée localement ; vérifiez ou exportez les modifications locales préexistantes, puis rechargez l’éditeur.

Node-RED peut fonctionner comme service système, conteneur Docker, module complémentaire Home Assistant ou sous un autre superviseur. L’éditeur ne peut donc pas exécuter une commande de redémarrage universelle et sûre.
