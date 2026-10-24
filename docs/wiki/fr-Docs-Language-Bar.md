---
layout: wiki
title: "Docs-Language-Bar"
lang: fr
permalink: /wiki/fr-Docs-Language-Bar
translation_key: "Docs-Language-Bar"
---

# Traductions du wiki — Mode d'emploi

Le site de la documentation affiche chaque page en six langues : anglais, italien, allemand, français, espagnol et chinois simplifié. Le menu des langues de la barre de navigation relie automatiquement les traductions d'une même page.

## Noms de fichiers

- La page anglaise n'a pas de préfixe (par exemple `Device.md`).
- Les traductions utilisent les préfixes `it-`, `de-`, `fr-`, `es-` et `zh-CN-` (par exemple `it-Device.md`).

## Front matter

Chaque page commence par un bloc de front matter :

```yaml
---
layout: wiki
title: "Device"
lang: it
permalink: /wiki/it-Device
translation_key: "Device"
---
```

- `lang` doit correspondre au préfixe du fichier (`en` sans préfixe).
- `translation_key` est identique dans toutes les traductions d'une page : la barre de navigation l'utilise pour les relier.
- `npm run wiki:refresh` crée le front matter des nouvelles pages.

## Vérifications

- `npm run wiki:validate` signale les pages sans front matter, avec un `lang` erroné ou sans `translation_key`, les pages qui ont encore l'ancienne barre "🌐 Language:" et les pages auxquelles il manque des traductions.
- `npm run wiki:fix-langbar` corrige `lang` et `translation_key` et supprime l'ancienne barre. Les traductions manquantes doivent être écrites à la main.
- `_Sidebar.md`, `_Footer.md` et les pages sous `samples/` ne sont pas vérifiés.
