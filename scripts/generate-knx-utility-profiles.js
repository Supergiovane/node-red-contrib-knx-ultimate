#!/usr/bin/env node
'use strict'

/**
 * Build the browser-side KNX Utility profile bundle.
 *
 * Important architectural boundary
 * --------------------------------
 * This script MUST read only `scripts/knx-utility-profiles/`. The files in
 * public Alerter, AutoResponder and DateTime nodes are compatibility surfaces.
 * Reading them here would silently reintroduce a build dependency and make their
 * eventual deletion break `npm test` or bundle regeneration.
 *
 * Runtime profiles are intentionally not generated here. Their canonical files
 * live under `nodes/utils/knxUtilityProfiles/runtime/` and are shipped as
 * private CommonJS modules. This script deals only with the browser editor:
 * definitions, templates and translation dictionaries.
 */

const fs = require('fs')
const path = require('path')
const { profiles, locales } = require('./knx-utility-profiles/catalog')

const projectRoot = path.resolve(__dirname, '..')
const privateSourceRoot = path.join(__dirname, 'knx-utility-profiles')
const editorOutputPath = path.join(projectRoot, 'resources/knxUtilityProfiles.js')
const checkMode = process.argv.includes('--check')

const readPrivateProfile = (utilityType) => ({
  script: fs.readFileSync(path.join(privateSourceRoot, 'editors', `${utilityType}.js`), 'utf8').trim(),
  template: fs.readFileSync(path.join(privateSourceRoot, 'templates', `${utilityType}.html`), 'utf8').trim()
})

const readPrivateTranslations = () => {
  const translations = {}
  locales.forEach((locale) => {
    translations[locale] = {}
    Object.entries(profiles).forEach(([utilityType, nodeType]) => {
      const localePath = path.join(privateSourceRoot, 'locales', locale, `${utilityType}.json`)
      // Keep dictionaries indexed by the historical namespace. Existing editor
      // code uses keys such as `knxUltimateDateTime.gaDate`; the name is now only
      // an internal namespace and does not require that node type to be loaded.
      translations[locale][nodeType] = JSON.parse(fs.readFileSync(localePath, 'utf8'))
    })
  })
  return translations
}

const indent = (source, spaces) => {
  const prefix = ' '.repeat(spaces)
  // Do not indent empty source lines. Besides producing a smaller, cleaner
  // bundle, this keeps the generated artifact free from trailing whitespace.
  return String(source).split('\n').map((line) => (line ? `${prefix}${line}` : '')).join('\n')
}

const createEditorBundle = () => {
  const editorParts = {}
  Object.keys(profiles).forEach((utilityType) => {
    editorParts[utilityType] = readPrivateProfile(utilityType)
  })

  // Each source still calls RED.nodes.registerType because that is the editor
  // contract the mature implementations were designed around. At runtime the
  // bundle executes the source against a RED facade; its registerType method
  // captures the definition instead of touching Node-RED's real registry.
  const factoryEntries = Object.entries(editorParts).map(([utilityType, profile]) => (
    `    ${JSON.stringify(utilityType)}: function (RED) {\n${indent(profile.script, 6)}\n    }`
  )).join(',\n')

  // JSON stringification is deliberate. Templates contain quotes, newlines and
  // inline SVG/base64 data; serializing them avoids executable inline HTML and
  // makes the generated JavaScript deterministic for `--check`.
  const templateEntries = Object.entries(editorParts).map(([utilityType, profile]) => (
    `    ${JSON.stringify(utilityType)}: ${JSON.stringify(profile.template)}`
  )).join(',\n')

  return `/* eslint-disable */
// GENERATED FILE — do not edit directly.
// Canonical sources: scripts/knx-utility-profiles/
// Rebuild with: npm run knx-utility:generate
//
// This bundle is deliberately self-contained. It does not import, query or
// require any deprecated KNX node, editor template or localization namespace.
(function (root, factory) {
  // UMD-style export: Node-RED receives the browser global, while unit tests can
  // require the same artifact through CommonJS without maintaining a test copy.
  const api = factory(root)
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateUtilityProfiles = api
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict'

  // Values on the left are persisted in utilityType. Values on the
  // right are private editor/translation namespace identifiers, not registry
  // lookups. Keeping them preserves all existing field and i18n contracts.
  const PROFILE_TYPES = Object.freeze(${JSON.stringify(profiles, null, 2).replace(/^/gm, '  ')})

  // Factories are the private copies of the mature editor definitions. They are
  // inert until getDefinition() asks for one of them.
  const PROFILE_FACTORIES = {
${factoryEntries}
  }

  // Form fragments are mounted inside #knx-utility-profile-editor. The gateway
  // and name fields remain owned by the outer Utility template.
  const PROFILE_TEMPLATES = {
${templateEntries}
  }

  // All supported locales travel with the Utility. The bundle therefore
  // keeps working after the legacy locale files and node types are removed.
  const PROFILE_TRANSLATIONS = ${JSON.stringify(readPrivateTranslations())}

  // Editor definitions contain closure state. Cache one definition per profile
  // and RED editor instance, matching Node-RED's normal registration lifetime.
  // WeakMap prevents a discarded test/editor RED object from being retained.
  const definitionCaches = new WeakMap()

  const normalizeUtilityType = (utilityType) => (
    Object.prototype.hasOwnProperty.call(PROFILE_TYPES, utilityType) ? utilityType : 'alerter'
  )

  const normalizeLocale = (locale) => {
    const value = String(locale || '').trim()
    if (!value) return 'en'
    if (/^zh(?:[-_]|$)/i.test(value)) return 'zh-CN'
    const shortLocale = value.split(/[-_]/)[0].toLowerCase()
    return Object.prototype.hasOwnProperty.call(PROFILE_TRANSLATIONS, shortLocale) ? shortLocale : 'en'
  }

  const UTILITY_LOCALE_KEY = 'node-red-contrib-knx-ultimate/knxUltimateUtility:knxUltimateUtility.locale'

  const nodeRedLocale = (RED) => {
    try {
      if (RED && typeof RED._ === 'function') {
        const translated = RED._(UTILITY_LOCALE_KEY)
        if (translated && translated !== UTILITY_LOCALE_KEY) return translated
      }
    } catch (error) { /* use the compatibility fallbacks below */ }
    return undefined
  }

  const currentLocale = (RED) => {
    // Ask Node-RED's active catalog first. documentElement.lang can remain
    // English even while the editor has loaded another locale.
    const candidates = [
      nodeRedLocale(RED),
      RED && RED.settings && RED.settings.lang,
      root && root.document && root.document.documentElement && root.document.documentElement.lang,
      root && root.navigator && root.navigator.language
    ]
    return normalizeLocale(candidates.find((candidate) => candidate))
  }

  const nestedValue = (object, key) => String(key || '').split('.').reduce((value, part) => (
    value && Object.prototype.hasOwnProperty.call(value, part) ? value[part] : undefined
  ), object)

  const interpolate = (value, replacements) => {
    if (typeof value !== 'string' || !replacements || typeof replacements !== 'object') return value
    return value.replace(/{{\\s*([^{}]+?)\\s*}}/g, (match, key) => (
      Object.prototype.hasOwnProperty.call(replacements, key) ? String(replacements[key]) : match
    ))
  }

  const translationLookup = (utilityType, key, RED, replacements) => {
    let selectedType = normalizeUtilityType(utilityType)
    let localKey = String(key || '')
    const separatorIndex = localKey.lastIndexOf(':')
    if (separatorIndex >= 0) {
      // Fully qualified keys may name a different private profile. Resolve that
      // namespace locally instead of delegating to a legacy Node-RED node type.
      const namespace = localKey.slice(0, separatorIndex)
      localKey = localKey.slice(separatorIndex + 1)
      const namespaceNodeType = namespace.split('/').pop()
      const matchedType = Object.keys(PROFILE_TYPES).find((type) => PROFILE_TYPES[type] === namespaceNodeType)
      if (matchedType) selectedType = matchedType
    }

    const nodeType = PROFILE_TYPES[selectedType]
    const locale = currentLocale(RED)
    const localized = nestedValue(PROFILE_TRANSLATIONS[locale] && PROFILE_TRANSLATIONS[locale][nodeType], localKey)
    const fallback = nestedValue(PROFILE_TRANSLATIONS.en && PROFILE_TRANSLATIONS.en[nodeType], localKey)
    return interpolate(localized === undefined ? fallback : localized, replacements)
  }

  const translate = (utilityType, key, RED, replacements) => {
    const translated = translationLookup(utilityType, key, RED, replacements)
    if (translated !== undefined) return translated
    // Unknown keys may belong to Node-RED itself or the outer Utility. Only
    // those keys are allowed to fall through to the real editor translator.
    if (RED && typeof RED._ === 'function') {
      try { return RED._(key, replacements) } catch (error) { /* use the key below */ }
    }
    return key
  }

  const createDefinition = (utilityType, RED) => {
    const selectedType = normalizeUtilityType(utilityType)
    let capturedDefinition

    // Object.create keeps every real RED editor service available (nodes.node,
    // sidebar, events, notify, and so on) while replacing only the registration
    // boundary and translation resolver used by the private editor source.
    const redFacade = Object.create(RED)
    redFacade.nodes = Object.create((RED && RED.nodes) || null)
    redFacade.nodes.registerType = (nodeType, definition) => {
      if (nodeType === PROFILE_TYPES[selectedType]) capturedDefinition = definition
    }
    redFacade._ = (key, replacements) => translate(selectedType, key, RED, replacements)

    PROFILE_FACTORIES[selectedType](redFacade)
    if (!capturedDefinition) throw new Error('Unable to load KNX Utility editor profile: ' + selectedType)

    // Node-RED normally attaches a scoped translator while registering a type.
    // Because registration is captured, attach the equivalent private resolver.
    capturedDefinition._ = (key, replacements) => translate(selectedType, key, RED, replacements)
    return capturedDefinition
  }

  const getDefinition = (utilityType, RED) => {
    const selectedType = normalizeUtilityType(utilityType)
    let cache = definitionCaches.get(RED)
    if (!cache) {
      cache = new Map()
      definitionCaches.set(RED, cache)
    }
    if (!cache.has(selectedType)) cache.set(selectedType, createDefinition(selectedType, RED))
    return cache.get(selectedType)
  }

  const getTemplate = (utilityType) => PROFILE_TEMPLATES[normalizeUtilityType(utilityType)]

  // Expose only the narrow API consumed by knxUltimateUtility.html and
  // tests. The implementation tables remain private and cannot be mutated.
  return Object.freeze({
    PROFILE_TYPES,
    createDefinition,
    getDefinition,
    getTemplate,
    normalizeUtilityType,
    normalizeLocale,
    currentLocale,
    translate
  })
}))
`
}

const expectedBundle = createEditorBundle()

if (checkMode) {
  if (!fs.existsSync(editorOutputPath) || fs.readFileSync(editorOutputPath, 'utf8') !== expectedBundle) {
    console.error(`KNX Utility editor bundle is stale: ${path.relative(projectRoot, editorOutputPath)}`)
    console.error('Run: npm run knx-utility:generate')
    process.exit(1)
  }
  console.log('KNX Utility private editor bundle is current (no legacy sources read)')
} else {
  fs.writeFileSync(editorOutputPath, expectedBundle)
  console.log(`Generated self-contained KNX Utility editor bundle: ${path.relative(projectRoot, editorOutputPath)}`)
}
