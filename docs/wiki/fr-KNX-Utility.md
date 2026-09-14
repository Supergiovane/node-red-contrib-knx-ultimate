---
layout: wiki
title: "KNX Utility"
lang: fr
permalink: /wiki/fr-KNX-Utility
---
# KNX Utility

**KNX Utility** regroupe onze fonctions auxiliaires KNX dans un seul nœud de la palette. Sélectionnez une **Fonction** pour afficher ses paramètres, son icône et ses ports. **KNX Device (KNXUltimate)** reste le nœud principal pour envoyer et recevoir les télégrammes KNX.

## Onze fonctions, un nœud

| Fonction et référence des paramètres | Rôle | Entrées / sorties |
|---|---|---|
| [Alerter](/node-red-contrib-knx-ultimate/wiki/fr-Alerter-Configuration) | Signale les appareils en alerte individuellement, ensemble ou comme dernière alerte. | 1 / 3 |
| [AutoResponder](/node-red-contrib-knx-ultimate/wiki/fr-KNXAutoResponder) | Répond aux lectures KNX avec les valeurs configurées ou précédemment reçues. | 0 / 0 |
| [DateTime](/node-red-contrib-knx-ultimate/wiki/fr-DateTime-Configuration) | Envoie la date et l’heure avec les DPT 19.001, 11.001 et 10.001. | 0 / 0 |
| [WatchDog](/node-red-contrib-knx-ultimate/wiki/fr-WatchDog-Configuration) | Surveille la passerelle ou un appareil KNX et signale les problèmes de connexion. | 1 / 1 |
| [Global Context](/node-red-contrib-knx-ultimate/wiki/fr-GlobalVariable) | Partage les valeurs KNX dans le stockage du contexte global Node-RED choisi. | 0 / 0 |
| [Logger](/node-red-contrib-knx-ultimate/wiki/fr-Logger-Configuration) | Enregistre les télégrammes en XML compatible ETS et compte le trafic. | 1 / 2 |
| [Staircase](/node-red-contrib-knx-ultimate/wiki/fr-Staircase-Configuration) | Commande l’éclairage temporisé d’escalier avec état, forçage et préavis. | 1 / 1 |
| [Garage](/node-red-contrib-knx-ultimate/wiki/fr-Garage-Configuration) | Gère les commandes de garage, les impulsions, les entrées de sécurité et la fermeture automatique. | 1 / 1 |
| [Scene Controller](/node-red-contrib-knx-ultimate/wiki/fr-SceneController-Configuration) | Rappelle, apprend et mémorise les scènes avec des adresses de groupe et valeurs configurables. | 1 / 1 |
| [Load Control](/node-red-contrib-knx-ultimate/wiki/fr-LoadControl-Configuration) | Coupe et rétablit les charges configurées selon la consommation et les limites de puissance. | 1 / 1 |
| [Home Assistant Translator](/node-red-contrib-knx-ultimate/wiki/fr-HATranslator) | Traduit les états Home Assistant en valeurs booléennes avec une propriété d’entrée et une table configurables. | 1 / 1 |

Le tableau indique les ports de chaque fonction. AutoResponder et Global Context travaillent directement avec le bus et le contexte. DateTime utilise les envois programmés et son bouton sur le nœud ; il n’a aucun port d’entrée ou de sortie.

Home Assistant Translator dispose d’une entrée et d’une sortie et ne nécessite pas de passerelle KNX. Choisissez la propriété du message à traduire (par exemple `payload` ou `data.new_state.state`) et modifiez les correspondances `source:true` / `source:false`, comme `open:true` et `closed:false`. La valeur booléenne traduite est envoyée dans `msg.payload` ; reliez la sortie à KNX Device pour écrire sur le bus.

## Configurer un nœud Utility

1. Glissez **KNX Utility** de la palette vers le flux.
2. Choisissez la **Fonction**, la passerelle KNX si nécessaire, puis renseignez les paramètres affichés.
3. Enregistrez le nœud et vérifiez ses connexions. Cliquez sur **Deploy** pour l’activer.

Changer de fonction dans l’éditeur affiche un aperçu de ses paramètres. **Annuler** conserve la configuration précédemment enregistrée. Les liens du tableau ouvrent les paramètres et exemples propres à chaque fonction ; les anciennes pages restent disponibles comme référence des nœuds dédiés.

## Convertir tous les anciens nœuds compatibles

Ouvrez **KNX Utility** ou un ancien nœud compatible, cliquez sur **Convertir tous les anciens nœuds KNX compatibles**, puis confirmez. La conversion comprend chaque instance des onze fonctions dans **tous les flux et sous-flux** de l’éditeur, quels que soient l’onglet actif et la sélection.

Après confirmation et avant toute modification des nœuds, le navigateur démarre automatiquement le téléchargement d’une sauvegarde JSON datée de tous les flux actuellement dans l’éditeur, y compris les onglets, sous-flux, nœuds de configuration, groupes et connexions. Le fichier utilise le format d’export standard de Node-RED et peut être réimporté. Les identifiants déclarés par les nœuds sont exclus, comme dans l’export standard. Le navigateur peut demander où enregistrer le fichier. Si la sauvegarde ne peut pas être préparée ou son téléchargement ne peut pas démarrer, aucun nœud n’est converti.

La conversion se déroule localement dans le navigateur. Elle conserve les identifiants, paramètres enregistrés, références de passerelle, connexions, positions et groupes. Les identifiants préservés conservent les fichiers de valeurs AutoResponder et les scènes enregistrées par Scene Controller. Global Context conserve le nom de variable et le stockage ; Logger conserve ses paramètres de fichier. Home Assistant Translator conserve sa propriété d’entrée et sa table de traduction personnalisée, même lorsqu’elle est volontairement vide.

La confirmation ferme l’éditeur du nœud actuel et abandonne les modifications non enregistrées. Toute la conversion constitue une seule opération **Annuler**, également compatible avec **Rétablir**. Vérifiez les nœuds convertis puis cliquez vous-même sur **Deploy**. La migration ne déploie pas automatiquement. Un flux verrouillé empêche la conversion jusqu’à son déverrouillage.

Les nœuds dédiés existants continuent de se charger et de fonctionner. Ils sont masqués dans la palette et portent `(deprecated)` dans les flux existants, où leurs paramètres restent modifiables. KNX Device, Viewer et les autres nœuds d’intégration et de routage conservent leurs rôles.
