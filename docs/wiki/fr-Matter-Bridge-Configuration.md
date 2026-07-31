---
layout: wiki
title: "Matter-Bridge-Configuration"
lang: fr
permalink: /wiki/fr-Matter-Bridge-Configuration
---
# Bridge Matter (BETA)

<div data-matter-bridge-config-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0d314f 0%,#176b91 55%,#27a9c7 100%);box-shadow:0 14px 30px rgba(13,49,79,0.25);color:#f3fbff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#d1f3ff;">Serveur Matter · Multi-fabric · Identité persistante</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Appairez un bridge. Exposez tous les appareils KNX.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f3fbff;">Ce nœud de configuration possède le serveur Matter, l’identité du bridge et les sessions des contrôleurs. Alexa, Google Home, Apple Home et les autres contrôleurs l’appairent une fois ; les nœuds device apparaissent ensuite comme endpoints live.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Un seul appairage</strong><span style="font-size:0.76rem;color:#e0f7ff;">QR + code manuel</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Multi-fabric</strong><span style="font-size:0.76rem;color:#e0f7ff;">plusieurs contrôleurs</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.13);"><strong style="display:block;font-size:1.05rem;color:#fff;">Réconciliation live</strong><span style="font-size:0.76rem;color:#e0f7ff;">endpoints en quelques secondes</span></div>
  </div>
</div>

## Le bridge en un coup d’œil

| Domaine | Fonctionnalités |
|---|---|
| **Appairage** | QR et code manuel, plusieurs fabrics Matter et réinitialisation explicite. |
| **Identité** | Identité stable lors des déploiements ordinaires, changements de nom et réconciliation des endpoints. |
| **Échelle** | Plusieurs bridges indépendants sur des ports UDP distincts et autant de nœuds device que nécessaire. |
| **Protection** | Export/import des fabrics, identifiants privés, sessions et données d’appairage. |

> **BETA :** le bridge est opérationnel, mais certains détails peuvent évoluer. Protégez la sauvegarde comme un mot de passe et utilisez **Réinitialiser l’appairage** uniquement pour supprimer tous les contrôleurs.

## Vue technique

Ce nœud de configuration est le **bridge Matter lui-même** : il exécute le serveur Matter qu'Alexa, Google Home, Apple Home (ou tout contrôleur Matter) appairent **une seule fois**. Chaque nœud **Matter Bridge device** de vos flux pointe ici et apparaît dans les apps comme un appareil du bridge.

Les éditeurs des périphériques Matter Bridge présentent **Mappages** et **Options avancées** sous forme d'onglets verticaux à gauche, comme Matter Controller.

Le sélecteur **Broches d'entrée / sortie du nœud** se trouve hors de ces onglets. Son activation affiche juste dessous une section contextuelle **Entrée/sortie du flow**, avec des exemples copiables Flow → Matter et Matter → Flow filtrés selon le type d'appareil.

## Configuration

|Champ|Description|
|--|--|
| Nom | Le nom de ce nœud de configuration dans Node-RED |
| Nom du bridge Matter | Le nom du bridge lui-même dans les apps Matter. **Laissez vide pour réutiliser le Nom de ce nœud.** |
| Port | Port UDP du serveur Matter (5540 par défaut). Chaque bridge a besoin de son propre port, vous pouvez donc exécuter **plusieurs bridges indépendants** |

## Appairage

1. **Déployez**, attendez quelques secondes, puis rouvrez ce nœud.
2. Le panneau d'appairage montre le **QR code** et le **code manuel** : scannez ou saisissez-le dans Alexa / Google Home / Apple Home (« ajouter un appareil Matter »).
3. Plusieurs contrôleurs peuvent être appairés au même bridge (multi-fabric Matter).

Pour ajouter un contrôleur lorsque le QR code est masqué, ouvrez le mode d'appairage depuis un contrôleur déjà associé, puis ajoutez un appareil Matter dans le nouveau contrôleur. Utilisez **Réinitialiser l'appairage** uniquement pour supprimer tous les contrôleurs et recommencer.

Le bouton **Réinitialiser l'appairage** supprime tous les contrôleurs appairés et relance l'annonce d'appairage.

## Identité et stockage

L'identité du bridge est liée à ce nœud de configuration et enregistrée dans `knxultimatestorage/matter` du répertoire utilisateur de Node-RED : les re-deploys (même en changeant port ou nom) ne nécessitent **PAS** de nouvel appairage. Seule la suppression de ce nœud de configuration et la création d'un nouveau changent l'identité — dans ce cas supprimez l'ancien bridge de l'app Matter et appairez de nouveau.

Utilisez **Exporter** pour télécharger une sauvegarde complète de cette instance du bridge, avec fabrics, identifiants privés, sessions et données d'association. **Protégez le fichier comme un mot de passe.** L'import remplace le stockage de cette instance et redémarre brièvement le bridge. Une sauvegarde de bridge ne peut pas être importée dans un contrôleur.

## Notes

- L'hôte Node-RED doit avoir **IPv6 link-local** activé (exigence standard de Matter) et être joignable par les contrôleurs sur le réseau local.
- Les nœuds d'appareil ajoutés/renommés/supprimés sont pris en compte en quelques secondes, sans nouvel appairage.
- **Noms :** Alexa et Google Home respectent les noms définis ici (nom du bridge et noms des nœuds d'appareil). **Apple Home les ignore et vous demande de nommer chaque accessoire manuellement lors de la configuration** — c'est une limite d'Apple, pas du bridge.
