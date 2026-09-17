# Documentation for KNX Ultimate 8

The site uses GitHub Pages/Jekyll and keeps the existing URLs and six languages: English, Italian, German, French, Spanish and Simplified Chinese.

- `docs/_data/knx8.json`: translated home-page content and version notices.
- `docs/_includes/homepage/content.html`: shared home-page structure.
- `docs/wiki/`: node reference, getting started, migration and examples. Use the same `translation_key` for translations and preserve existing `permalink` values.
- `scripts/wiki-menu.json`: navigation source. `npm run docs:prepare` regenerates `docs/_data/wiki-nav.json` and copies the package examples to `docs/examples/`.
- `examples/`: the maintained importable flows. The copies in `docs/examples/` are generated and ignored by Git.

The old HUE and Matter pages are version 7 references, marked by `legacy_package` and a visible notice linking to the new packages. Utility reference pages describe functions of **KNX Utility**, not separate palette nodes. Historical pages with duplicated language prefixes redirect to the real translated page.

## Local preview

Install the Ruby/Jekyll dependencies from `docs/Gemfile`, then run from the repository root with `jekyll` available on PATH:

```sh
npm run docs:build
npm run docs:serve
```

Open `http://127.0.0.1:4000/node-red-contrib-knx-ultimate/`. The preview uses the same Liquid templates as the real site.

`npm run wiki:refresh` imports help for the current Device, Gateway, Viewer, IoT Bridge and routing nodes. It preserves page metadata and archive notices. Getting started, migration, Utility overview/function references and examples are maintained directly in `docs/wiki/`.

The `Documentation` GitHub Actions workflow prepares the downloads and builds the site. A push to `8.0.0` only builds an artifact; it does not replace the published version 7 documentation. Publishing runs after a push to `master`/`main`, or when the workflow is explicitly started manually. When ready to deploy version 8, select **Settings → Pages → Source → GitHub Actions**. No hosting setting is changed by editing these files.

Language pages use explicit permalinks and translation keys, so no extra translation plugin is needed on GitHub Pages. For any other Pages build, run `npm run docs:prepare` before Jekyll so downloadable examples are included.
