---
layout: wiki
title: "zh-CN-Docs-Language-Bar"
lang: fr
permalink: /wiki/fr-zh-CN-Docs-Language-Bar
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Docs-Language-Bar) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Docs-Language-Bar) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Docs-Language-Bar) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Docs-Language-Bar) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Docs-Language-Bar)
---
<h1> <p align = 'Center'> Bar de langue wiki - Comment </p> </h1>
Utilisez ce mode pour ajouter des commutateurs linguistiques à la page Wiki et maintenez la dénomination cohérente dans la traduction.
guide
- Nom du fichier: page de base, puis préfixes pour d'autres langues: `` it- ', `de-,` zh-cn-- (par exemple, `` Hue Light.md.md \ `, it-hue Light Light.md' ').
- Première ligne (requise): Ajoutez la barre de langue avec l'icône de la Terre et lien vers quatre variantes.
- Segmenteur: ajoutez `---` sur la ligne suivante, puis la ligne vierge, puis la page Contenu.
- Lien: utilisez l'URL wiki absolu.Changer de l'espace en '+ `+` dans l'URL
- Nouvelle page: si vous n'avez pas traduit, vous pouvez temporairement conserver la page en;Ajoutez d'autres fichiers lorsque vous êtes prêt.
Fragment
- Placez-le en haut de chaque page, en remplaçant le "titre de la page" par le nom du fichier Wiki sans extension:
- `🌐Language: [EN](/node-red-contrib-knx-ultimate/wiki/Page+Title) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Page+Title) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Page+Title) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Page+Title)`
- `---`
Réunion
- Page de nœud de teinte: les parties doivent suivre \ `\` germal ', \ `\` \ `map', 'uptuffs', \`
- Utilisez une notation DPT cohérente (par exemple, `DPT 3.007`,` DPT 5.001`, `DPT 9.001`).
- Gardez le nom du produit et la marque inchangés (par exemple, Hue, KNX).
Maintienneur
- Vérifiez toutes les pages: \ `NPM Run Wiki: valider '
- barre de langage fixe automatique pour URL absolue: \ `NPM Run Wiki: Fix-Langbar \` \ `
- Remarque: les pages sous `_sidebar.md`, '\ _footer.md \`, \ `\` Les échantillons /' sont exclues de la vérification.
