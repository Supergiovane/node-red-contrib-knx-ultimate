---
layout: wiki
title: "Docs-Language-Bar"
lang: fr
permalink: /wiki/fr-Docs-Language-Bar
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Docs-Language-Bar) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Docs-Language-Bar) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Docs-Language-Bar) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Docs-Language-Bar) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Docs-Language-Bar)
---
<h1> <p align = 'Center'> Bar de langue wiki - Comment </p> </h1>
Utilisez ce modèle pour ajouter le commutateur de langue aux pages wiki et continuez à nommer cohérent entre les traductions.
Lignes directrices
- Noms de fichiers: Page de base en, puis préfixe pour d'autres langues: `it-`, `de-`, `zh-cn-` (par exemple, `Hue Light.md`,` it-hue light.md`).
- Première ligne (requise): Ajoutez la barre de langue avec l'icône Globe et lie aux quatre variantes.
- séparateur: ajoutez `---` sur la ligne suivante, puis une ligne vierge, puis la page contenu.
- Liens: utilisez des URL wiki absolues.Les espaces deviennent `+` dans les URL (par exemple, «Hue Light» → «Hue + Light»).
- Nouvelles pages: si une traduction n'est pas encore disponible, vous pouvez temporairement garder uniquement la page EN publiée;Ajoutez d'autres fichiers lorsque vous êtes prêt.
Fragment
- Mettez ceci en haut de chaque page, en remplaçant le «titre de la page» par le nom de fichier Wiki sans extension:
- `🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Page+Title) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Page+Title) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Page+Title) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Page+Title)`
- `---`
Conventions
- Pages de nœuds de toile: les sections doivent suivre `` Général ', «mapping», «sorties», «détails».
- Utilisez des notations DPT cohérentes (par exemple, `DPT 3.007`,` DPT 5.001`, `DPT 9.001`).
- Gardez les noms de produits et les marques inchangées (par exemple, Hue, KNX).
Maintient
- Valider toutes les pages: `NPM Run Wiki: Valider`
- Barres de langue automatique à URL absolues: `NPM Run Wiki: Fix-Langbar`
- Remarques: `_sidebar.md`,` _footer.md`, et les pages sous `Les échantillons /` sont exclues de la validation.
