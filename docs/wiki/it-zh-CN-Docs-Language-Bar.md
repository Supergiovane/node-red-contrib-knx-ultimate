---
layout: wiki
title: "zh-CN-Docs-Language-Bar"
lang: it
permalink: /wiki/it-zh-CN-Docs-Language-Bar/
---
---
<h1> <P align = 'Center'> Barra linguistica wiki - Come </p> </h1>
Utilizzare questa modalità per aggiungere interruttori linguistici alla pagina wiki e mantenere una denominazione coerente nella traduzione.
guida
-Nome file: pagina di base, quindi prefissi per altre lingue: `` it- ', `de-,` zh-cn-- (per esempio, `` hue light.md.md \ `, it-hue light.md' ').
- Prima riga (richiesta): aggiungi la barra linguistica con l'icona della Terra e collega a quattro varianti.
-Segmentar: Aggiungi `---` Nella riga successiva, quindi la riga vuota, quindi il contenuto della pagina.
- Link: usa l'URL wiki assoluto.Cambia spazio in '+`+` in URL
- Nuova pagina: se non hai tradotto, è possibile mantenere temporaneamente la pagina en;Aggiungi altri file quando sei pronto.
Frammento
- Posizionarlo nella parte superiore di ogni pagina, sostituendo il "titolo della pagina" con il nome del file wiki senza estensione:
- `🌐 Language: [EN](/node-red-contrib-knx-ultimate/wiki/Page+Title) | [IT](/node-red-contrib-knx-ultimate/wiki/it-Page+Title) | [DE](/node-red-contrib-knx-ultimate/wiki/de-Page+Title) | [简体中文](/node-red-contrib-knx-ultimate/wiki/zh-CN-Page+Title)`
-`---`
Incontro
- Pagina del nodo Hue: le parti dovrebbero seguire \ `\` germal ', \ `\` \ `mappa', 'uptuffs', \`
- Usa notazione DPT coerente (ad es. `Dpt 3.007`,` dpt 5.001`, `dpt 9.001`).
- Mantieni il nome del prodotto e il marchio invariati (ad es. Hue, KNX).
Manutentore
- Verifica tutte le pagine: \ `npm run wiki: validate '
- Barra linguistica fissa automatica per URL assoluto: \ `npm run wiki: fix-langbar \` \ `
- Nota: le pagine sotto `_sidebar.md`, '\ _footer.md \`, \ `\` campioni/' sono escluse dalla verifica.
