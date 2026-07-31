# Private HUE Controller editor sources

This directory is the canonical, build-time source for the HUE Controller browser bundle. It is deliberately separate from `nodes/knxUltimateHue*.html`: those public legacy editors are frozen compatibility surfaces and are no longer read by the Controller build.

For every value persisted in `hueControllerType` there are three private inputs:

- `editors/<type>.js`: the captured Node-RED editor definition and lifecycle.
- `templates/<type>.html`: the form fragment mounted inside HUE Controller.
- `locales/<locale>/<type>.json`: the complete private translation dictionary.

`npm run hue-controller:generate` combines these files into `resources/hueControllerProfiles.js`. The generated bundle is committed because Node-RED serves it directly to the browser. `npm run hue-controller:check` rebuilds it in memory and fails when the committed bundle is stale.

Runtime implementations are canonical separately under `nodes/utils/hueControllerProfiles/runtime/`; the generator never overwrites them.

The old node type names in `catalog.js` are private namespace identifiers. They let us preserve existing translation keys and capture `RED.nodes.registerType(...)` without registering anything in the real Node-RED registry. They are not imports and do not create a dependency on a legacy node.

When changing a profile, edit the private source here, regenerate the bundle, update its private runtime if necessary, then run `npm test`. Do not copy changes back into the frozen legacy nodes.
