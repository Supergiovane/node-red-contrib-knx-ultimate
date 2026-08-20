(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateHueControllerEditorSelection = api
}(typeof window !== 'undefined' ? window : globalThis, function () {
  const DEFAULT_EMPTY_VALUES = new Set(['', 'none', '_add_', '__none__'])

  function normalizeSelection (value, emptyValues = DEFAULT_EMPTY_VALUES) {
    const normalized = value === undefined || value === null ? '' : String(value).trim()
    const normalizedEmptyValues = emptyValues instanceof Set
      ? emptyValues
      : new Set(Array.isArray(emptyValues) ? emptyValues : DEFAULT_EMPTY_VALUES)
    return normalizedEmptyValues.has(normalized.toLowerCase()) ? '' : normalized
  }

  function shouldPreserveStoredSelection (event, nextValue, storedValue, emptyValues = DEFAULT_EMPTY_VALUES) {
    const programmaticChange = !event || !event.originalEvent
    return programmaticChange &&
      normalizeSelection(nextValue, emptyValues) === '' &&
      normalizeSelection(storedValue, emptyValues) !== ''
  }

  function resolveSelectedOrStoredSelection (selectedValue, storedValue, emptyValues = DEFAULT_EMPTY_VALUES) {
    return normalizeSelection(selectedValue, emptyValues) || normalizeSelection(storedValue, emptyValues)
  }

  return {
    normalizeSelection,
    resolveSelectedOrStoredSelection,
    shouldPreserveStoredSelection
  }
}))
