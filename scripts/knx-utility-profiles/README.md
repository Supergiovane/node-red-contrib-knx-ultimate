# Private KNX Utility editor sources

This directory is the canonical source of the KNX Utility browser bundle. Its eleven private profiles are independent of the public compatibility editors: Alerter, AutoResponder, DateTime, WatchDog, GlobalContext, Logger, Staircase, Garage, SceneController, LoadControl and Home Assistant Translator.

Each value persisted in `utilityType` has an `editors/<type>.js` definition, a `templates/<type>.html` form fragment and a `locales/<locale>/<type>.json` translation dictionary. Gateway and name fields belong to the outer Utility editor and are omitted from the fragments.

`editor-field-contracts.json` records the controls captured from the original legacy forms. Tests check that each remains present exactly once in its private form, including LoadControl's five complete control and monitor address rows. Shared gateway/name controls and DateTime's intentionally removed output topic are excluded. This snapshot keeps the checks independent of legacy files at build/test time.

Run `npm run knx-utility:generate` after changing these sources. Commit the generated `resources/knxUtilityProfiles.js`, which Node-RED serves directly. `npm run knx-utility:check` checks that the committed bundle is current. The generator reads only this directory; runtime implementations live separately in `nodes/utils/knxUtilityProfiles/runtime/`.

The browser API is `KNXUltimateUtilityProfiles`. `getDefinition(type, RED)` captures a private editor registration without registering a legacy node. `getTemplate(type)` supplies the matching form. `translate(type, key, RED, replacements)` uses embedded translations, including fully qualified historical namespaces. `currentLocale(RED)` first checks the active Utility catalog, then editor settings and browser language.

The wrapper must load `htmlUtils.js`, preserve the profile lifecycle context and call `oneditcancel` when unmounting a form. Profiles namespace handlers on shared gateway controls with `.knxUtilityProfile`. DateTime keeps its ETS address suggestions inside the private factory and invalidates pending editor work during cleanup, so a late response cannot change a newly selected profile. Its send button uses the Utility-owned `knxUltimateUtility/sendNow` endpoint.

The remaining KNX autocomplete profiles also invalidate pending requests when the editor closes or the gateway changes. SceneController and LoadControl retain persisted DPT selections immediately, share one catalog request per gateway and preserve user selections when it resolves. Scene editing never deletes persisted scenes: invalidating saved scenes belongs to the runtime at Deploy, so Cancel remains reversible.

Logger's download button uses the shared plugin's `knxUltimateUtility/logger/download` route and keeps the configured admin root and authentication token handling. GlobalContext's `name` is its functional global-variable prefix; the outer wrapper must preserve its profile-specific default and validation. Profile input/output counts and Logger's output label array are part of each captured definition.

New AutoResponder nodes start with an empty address list. Existing configurations, including migrated JSON, retain their original `commandText`.

Home Assistant Translator has no gateway configuration. It keeps the legacy `payloadPropName` property path and uses `haTranslationTable` for translations, avoiding AutoResponder's different `commandText` format. Migration copies the existing translator mappings into that private field. The Ace editor remains alive while collecting drafts and is destroyed only on unmount, so switching profiles preserves edits and Cancel leaves the saved node untouched. Its form and editor text are translated independently in all six locales.
