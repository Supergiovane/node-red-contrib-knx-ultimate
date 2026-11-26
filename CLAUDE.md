# node-red-contrib-knx-ultimate — notes for Claude

## Documentation: its home is www.maxsupervibe.com

Since 2026-11-26 the documentation of this project lives on Massimo's website, https://www.maxsupervibe.com/docs/knx-ultimate/ (six languages (en, it, de, fr, es, zh-CN)), next to the help of all his other nodes (index: https://www.maxsupervibe.com/docs/). Manage it there:

- The text is written in this repo, in docs/wiki/ (one Markdown file per page and language, menu in docs/_data/wiki-nav.json). The website (repo SaccaniLiveStudioStack/SaccaniWebsite) copies it at every deploy with `scripts/sync-docs.mjs`; after a change, publish it with `npm run deploy` in SaccaniWebsite and check the page on the site.
- The old documentation on GitHub Pages (supergiovane.github.io/node-red-contrib-knx-ultimate/) only sends visitors to the website (docs/_layouts/moved.html): do not add pages or design there.
- The README links to the site: keep documentation out of it and point to the site's pages.
- When linking to the documentation (README, node help, changelog, issues), use the www.maxsupervibe.com addresses, never supergiovane.github.io.
