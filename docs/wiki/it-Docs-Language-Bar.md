---
layout: wiki
title: "Docs-Language-Bar"
lang: it
permalink: /wiki/it-Docs-Language-Bar
---
🌐 Language: [EN](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/Docs-Language-Bar) | [IT](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/it-Docs-Language-Bar) | [DE](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/de-Docs-Language-Bar) | [FR](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/fr-Docs-Language-Bar) | [ES](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/es-Docs-Language-Bar) | [简体中文](https://supergiovane.github.io/node-red-contrib-knx-ultimate/wiki/zh-CN-Docs-Language-Bar)
---
<h1> <P align = 'Center'> Barra linguistica wiki - Come </p> </h1>
Usa questo modello per aggiungere l'interruttore linguistico alle pagine wiki e mantenere la denominazione coerente tra le traduzioni.
Linee guida
-FILINAMES: base en pagina, quindi prefisso per altre lingue: `it-`,` de-`,` zh-cn-` (ad esempio, `hue light.md`,` it-hue light.md`).
- Prima riga (richiesta): aggiungi la barra linguistica con l'icona del globo e collegamenti alle quattro varianti.
  -Separatore: aggiungi `---` Nella riga successiva, quindi una riga vuota, quindi il contenuto della pagina.
- Link: usa URL wiki assoluti.Gli spazi diventano `+` negli URL (ad es. `Hue Light` →` Hue+Light`).
- Nuove pagine: se una traduzione non è ancora disponibile, è possibile conservare temporaneamente solo la pagina EN pubblicata;Aggiungi altri file quando sono pronti.
Frammento
- Mettilo in cima a ogni pagina, sostituendo il titolo di pagina "con il nome file wiki senza estensione:
- `🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Page+Title) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Page+Title) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Page+Title) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Page+Title)`
  -`---`
Convenzioni
- Pagine del nodo Hue: le sezioni dovrebbero seguire `General`,` mapping`, `outputs`,` dettagli`.
- Utilizzare nozioni DPT coerenti (ad es. `Dpt 3.007`,` dpt 5.001`, `dpt 9.001`).
- Mantieni invariati nomi di prodotti e marchi (ad es. Hue, KNX).
Manutentori
- Convalida tutte le pagine: `npm run wiki: validate`
  -barre linguistiche automatiche su URL assoluti: `npm run wiki: fix-langbar`
- Note: `_sidebar.md`,` _footer.md` e le pagine in `campioni/` sono esclusi dalla convalida.
