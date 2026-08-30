const KNX_AI_CATALOG_MAX_RESEARCH_ROUNDS = 1
const KNX_AI_CATALOG_MAX_ACTIONS_PER_ROUND = 4
const KNX_AI_CATALOG_MAX_RESULTS_PER_ACTION = 12
const KNX_AI_CATALOG_MAX_ACCUMULATED_OBJECTS = 24

const normalizeText = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^\p{L}\p{N}/]+/gu, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const normalizeGa = (value) => String(value || '').trim()

const clampLimit = (value) => Math.max(1, Math.min(
  KNX_AI_CATALOG_MAX_RESULTS_PER_ACTION,
  Math.round(Number(value) || 8)
))

const normalizeStringList = (value, maxItems = 12) => Array.from(new Set(
  (Array.isArray(value) ? value : [])
    .map(item => String(item || '').trim())
    .filter(Boolean)
)).slice(0, maxItems)

const normalizeKnxAiCatalogActions = (value, { maxActions = KNX_AI_CATALOG_MAX_ACTIONS_PER_ROUND } = {}) => {
  const accepted = []
  const allowedOperations = new Set(['search', 'get', 'list_areas', 'browse_area', 'related'])
  const allowedAccess = new Set(['any', 'read-only', 'read-write'])
  const allowedPurposes = new Set(['any', 'read', 'write', 'inspect'])
  ;(Array.isArray(value) ? value : []).slice(0, Math.max(1, Number(maxActions) || 1)).forEach(candidate => {
    const source = candidate && typeof candidate === 'object' && !Array.isArray(candidate) ? candidate : {}
    const operation = String(source.operation || '').trim().toLowerCase()
    if (!allowedOperations.has(operation)) return
    const query = String(source.query || '').trim().slice(0, 300)
    const destinations = normalizeStringList(source.destinations, 20)
    const area = String(source.area || '').trim().slice(0, 300)
    if (operation === 'search' && !query) return
    if ((operation === 'get' || operation === 'related') && !destinations.length) return
    if (operation === 'browse_area' && !area) return
    const semanticKinds = normalizeStringList(source.semanticKinds, 12)
      .map(kind => normalizeText(kind))
      .filter(Boolean)
    const requestedAccess = String(source.access || '').trim().toLowerCase()
    const requestedPurpose = String(source.purpose || '').trim().toLowerCase()
    accepted.push({
      operation,
      query,
      destinations,
      area,
      semanticKinds,
      access: allowedAccess.has(requestedAccess) ? requestedAccess : 'any',
      purpose: allowedPurposes.has(requestedPurpose) ? requestedPurpose : 'any',
      offset: Math.max(0, Math.min(100000, Math.round(Number(source.offset) || 0))),
      limit: clampLimit(source.limit),
      reason: String(source.reason || '').trim().slice(0, 1000)
    })
  })
  return accepted
}

const editDistanceAtMostTwo = (left, right) => {
  if (left === right) return 0
  if (!left || !right || Math.abs(left.length - right.length) > 2) return 3
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i]
    let rowMinimum = current[0]
    for (let j = 1; j <= right.length; j += 1) {
      const substitution = previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1)
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, substitution)
      rowMinimum = Math.min(rowMinimum, current[j])
    }
    if (rowMinimum > 2) return 3
    previous = current
  }
  return previous[right.length]
}

const tokenQuality = (queryToken, candidateToken) => {
  if (queryToken === candidateToken) return 1
  const substringMinimum = /[^\u0000-\u007f]/.test(queryToken) ? 2 : 3
  if (queryToken.length >= substringMinimum && (candidateToken.includes(queryToken) || queryToken.includes(candidateToken))) return 0.82
  if (queryToken.length < 4) return 0
  const distance = editDistanceAtMostTwo(queryToken, candidateToken)
  if (distance === 1) return 0.68
  if (distance === 2 && queryToken.length >= 7) return 0.5
  return 0
}

const buildSearchDocument = (item) => {
  const semantic = item && item.semantic && typeof item.semantic === 'object' ? item.semantic : {}
  const aliases = Array.isArray(item && item.aliases) ? item.aliases : []
  const options = Array.isArray(item && item.valueOptions) ? item.valueOptions : []
  const fields = {
    ga: normalizeText(item && item.ga),
    label: normalizeText(item && item.label),
    etsName: normalizeText(item && item.etsName),
    hierarchy: normalizeText(item && item.hierarchyPath),
    aliases: normalizeText(aliases.join(' ')),
    semantic: normalizeText([semantic.kind, semantic.area, item && item.mainGroup, item && item.middleGroup, ...(Array.isArray(item && item.tags) ? item.tags : [])].join(' ')),
    values: normalizeText(options.map(option => `${option && option.value} ${option && option.label}`).join(' ')),
    dpt: normalizeText(item && item.dpt)
  }
  const combined = Object.values(fields).join(' ').trim()
  return { fields, combined, tokens: Array.from(new Set(combined.split(' ').filter(Boolean))) }
}

const itemPassesFilters = (item, action) => {
  if (action.access === 'read-only' && item && item.readOnly !== true) return false
  if (action.access === 'read-write' && item && item.readOnly === true) return false
  if (action.purpose === 'write' && item && item.readOnly === true) return false
  const semantic = item && item.semantic && typeof item.semantic === 'object' ? item.semantic : {}
  if (action.semanticKinds.length && !action.semanticKinds.includes(normalizeText(semantic.kind))) return false
  return true
}

const purposeScore = (item, purpose) => {
  const readOnly = item && item.readOnly === true
  if (purpose === 'write') return readOnly ? -1000 : 130
  if (purpose === 'read') return readOnly ? 90 : 50
  if (purpose === 'inspect') return readOnly ? 70 : 55
  return 0
}

const scoreSearchMatch = (item, action) => {
  if (!itemPassesFilters(item, action)) return 0
  const query = normalizeText(action.query)
  if (!query) return 0
  const document = buildSearchDocument(item)
  const exactGa = normalizeGa(item && item.ga) === normalizeGa(action.query)
  if (exactGa) return 2000 + purposeScore(item, action.purpose)
  let score = 0
  if (document.fields.label === query) score += 900
  if (document.fields.etsName === query) score += 850
  if (document.fields.aliases.split(' ').includes(query)) score += 800
  if (document.fields.hierarchy === query) score += 750
  if (document.combined.includes(query)) score += 360
  const queryTokens = query.split(' ').filter(Boolean)
  let qualityTotal = 0
  let matchedTokens = 0
  let strongMatches = 0
  for (const queryToken of queryTokens) {
    let best = 0
    for (const candidateToken of document.tokens) {
      best = Math.max(best, tokenQuality(queryToken, candidateToken))
      if (best === 1) break
    }
    if (best >= 0.5) {
      matchedTokens += 1
      qualityTotal += best
      if (best >= 0.68) strongMatches += 1
    }
  }
  if (strongMatches === 0) return 0
  const missingTokens = Math.max(0, queryTokens.length - matchedTokens)
  const coverage = queryTokens.length > 0 ? matchedTokens / queryTokens.length : 0
  score += qualityTotal * 120
  score += coverage * 200
  score += Math.max(0, matchedTokens - 1) * 50
  score -= missingTokens * 18
  score += purposeScore(item, action.purpose)
  if (action.area) {
    const area = normalizeText(action.area)
    const itemArea = normalizeText([
      item && item.hierarchyPath,
      item && item.mainGroup,
      item && item.middleGroup,
      item && item.semantic && item.semantic.area
    ].join(' '))
    if (!itemArea.includes(area)) return 0
    score += 120
  }
  return score
}

const sortScoredItems = (scored) => scored
  .sort((left, right) => right.score - left.score || String(left.item && left.item.hierarchyPath || left.item && left.item.label || left.item && left.item.ga || '').localeCompare(String(right.item && right.item.hierarchyPath || right.item && right.item.label || right.item && right.item.ga || '')))
  .map(entry => entry.item)

const findSearchItems = (catalog, action) => sortScoredItems(
  catalog.map(item => ({ item, score: scoreSearchMatch(item, action) })).filter(entry => entry.score > 0)
)

const buildAreaRows = (catalog) => {
  const areas = new Map()
  catalog.forEach(item => {
    const semantic = item && item.semantic && typeof item.semantic === 'object' ? item.semantic : {}
    const candidates = [semantic.area, item && item.hierarchyPath, item && item.middleGroup, item && item.mainGroup]
      .map(value => String(value || '').trim())
      .filter(Boolean)
    const area = candidates[0] || 'Unclassified'
    const key = normalizeText(area)
    if (!key) return
    if (!areas.has(key)) areas.set(key, { area, count: 0, sampleLabels: [] })
    const row = areas.get(key)
    row.count += 1
    const label = String(item && item.label || item && item.ga || '').trim()
    if (label && row.sampleLabels.length < 3 && !row.sampleLabels.includes(label)) row.sampleLabels.push(label)
  })
  return Array.from(areas.values()).sort((left, right) => right.count - left.count || left.area.localeCompare(right.area))
}

const findAreaItems = (catalog, action) => {
  const requestedArea = normalizeText(action.area)
  return sortScoredItems(catalog
    .filter(item => itemPassesFilters(item, action))
    .map(item => {
      const semantic = item && item.semantic && typeof item.semantic === 'object' ? item.semantic : {}
      const areaText = normalizeText([semantic.area, item && item.hierarchyPath, item && item.middleGroup, item && item.mainGroup].join(' '))
      if (!areaText.includes(requestedArea)) return { item, score: 0 }
      return { item, score: 400 + purposeScore(item, action.purpose) }
    })
    .filter(entry => entry.score > 0))
}

const findRelatedItems = (catalog, action) => {
  const requested = new Set(action.destinations.map(normalizeGa))
  const seeds = catalog.filter(item => requested.has(normalizeGa(item && item.ga)))
  if (!seeds.length) return []
  const seedDocuments = seeds.map(seed => ({ seed, tokens: new Set(buildSearchDocument(seed).tokens) }))
  const scored = catalog.map(item => {
    if (!itemPassesFilters(item, action)) return { item, score: 0 }
    let best = requested.has(normalizeGa(item && item.ga)) ? 1000 : 0
    const itemTokens = buildSearchDocument(item).tokens
    seedDocuments.forEach(({ seed, tokens: seedTokens }) => {
      if (seed === item) return
      const seedSemantic = seed && seed.semantic && typeof seed.semantic === 'object' ? seed.semantic : {}
      const itemSemantic = item && item.semantic && typeof item.semantic === 'object' ? item.semantic : {}
      let relationScore = 0
      if (normalizeText(seed.hierarchyPath) && normalizeText(seed.hierarchyPath) === normalizeText(item.hierarchyPath)) relationScore += 260
      if (normalizeText(seedSemantic.area) && normalizeText(seedSemantic.area) === normalizeText(itemSemantic.area)) relationScore += 180
      if (normalizeText(seed.middleGroup) && normalizeText(seed.middleGroup) === normalizeText(item.middleGroup)) relationScore += 100
      if (normalizeText(seed.mainGroup) && normalizeText(seed.mainGroup) === normalizeText(item.mainGroup)) relationScore += 45
      if (normalizeText(seedSemantic.kind) && normalizeText(seedSemantic.kind) === normalizeText(itemSemantic.kind)) relationScore += 65
      const overlap = itemTokens.filter(token => token.length >= 4 && seedTokens.has(token)).length
      relationScore += Math.min(100, overlap * 20)
      if (relationScore <= 0) return
      const score = relationScore + purposeScore(item, action.purpose)
      best = Math.max(best, score)
    })
    return { item, score: best }
  }).filter(entry => entry.score > 0)
  return sortScoredItems(scored)
}

const actionFingerprint = (action) => JSON.stringify({
  operation: action.operation,
  query: normalizeText(action.query),
  destinations: action.destinations.map(normalizeGa).sort(),
  area: normalizeText(action.area),
  semanticKinds: action.semanticKinds.slice().sort(),
  access: action.access,
  purpose: action.purpose,
  offset: action.offset,
  limit: action.limit
})

const executeKnxAiCatalogActions = ({ actions, catalog, priorResults = [] } = {}) => {
  const safeCatalog = Array.isArray(catalog) ? catalog : []
  const normalized = normalizeKnxAiCatalogActions(actions)
  const seen = new Set((Array.isArray(priorResults) ? priorResults : []).map(result => String(result && result.fingerprint || '')).filter(Boolean))
  const results = []
  normalized.forEach(action => {
    const fingerprint = actionFingerprint(action)
    if (seen.has(fingerprint)) return
    seen.add(fingerprint)
    if (action.operation === 'list_areas') {
      const allAreas = buildAreaRows(safeCatalog.filter(item => itemPassesFilters(item, action)))
      results.push({
        action,
        fingerprint,
        ok: true,
        totalMatches: allAreas.length,
        truncated: allAreas.length > action.offset + action.limit,
        areas: allAreas.slice(action.offset, action.offset + action.limit),
        items: []
      })
      return
    }
    let matched = []
    if (action.operation === 'get') {
      const requested = new Set(action.destinations.map(normalizeGa))
      matched = safeCatalog.filter(item => requested.has(normalizeGa(item && item.ga)) && itemPassesFilters(item, action))
    } else if (action.operation === 'search') {
      matched = findSearchItems(safeCatalog, action)
    } else if (action.operation === 'browse_area') {
      matched = findAreaItems(safeCatalog, action)
    } else if (action.operation === 'related') {
      matched = findRelatedItems(safeCatalog, action)
    }
    results.push({
      action,
      fingerprint,
      ok: true,
      totalMatches: matched.length,
      truncated: matched.length > action.offset + action.limit,
      items: matched.slice(action.offset, action.offset + action.limit),
      areas: []
    })
  })
  return results
}

const collectKnxAiCatalogObjects = (results, maxItems = KNX_AI_CATALOG_MAX_ACCUMULATED_OBJECTS) => {
  const byGa = new Map()
  ;(Array.isArray(results) ? results.slice().reverse() : []).forEach(result => {
    ;(Array.isArray(result && result.items) ? result.items : []).forEach(item => {
      const ga = normalizeGa(item && item.ga)
      if (!ga || byGa.has(ga) || byGa.size >= maxItems) return
      byGa.set(ga, item)
    })
  })
  return Array.from(byGa.values())
}

const buildKnxAiCatalogResearchContext = (results) => {
  const source = Array.isArray(results) ? results : []
  if (!source.length) return ''
  const lines = ['LOCAL ETS CATALOG RETRIEVAL RESULTS:']
  source.forEach((result, index) => {
    const action = result && result.action ? result.action : {}
    const target = action.operation === 'search'
      ? ` query=${JSON.stringify(action.query)}`
      : action.operation === 'browse_area'
        ? ` area=${JSON.stringify(action.area)}`
        : (action.operation === 'get' || action.operation === 'related')
            ? ` destinations=${JSON.stringify(action.destinations)}`
            : ''
    lines.push(`[C${index + 1}] ${action.operation || 'unknown'}${target}: ${Number(result && result.totalMatches) || 0} match(es); page offset=${Math.max(0, Number(action.offset) || 0)}, limit=${Math.max(1, Number(action.limit) || 1)}${result && result.truncated ? '; more matches are available with a larger offset' : ''}.`)
    ;(Array.isArray(result && result.areas) ? result.areas : []).forEach(area => {
      lines.push(`- area ${JSON.stringify(area.area)} | ${area.count} objects | examples ${area.sampleLabels.join(', ') || '?'}`)
    })
  })
  lines.push('END LOCAL ETS CATALOG RETRIEVAL RESULTS')
  return lines.join('\n')
}

module.exports = {
  KNX_AI_CATALOG_MAX_ACCUMULATED_OBJECTS,
  KNX_AI_CATALOG_MAX_ACTIONS_PER_ROUND,
  KNX_AI_CATALOG_MAX_RESEARCH_ROUNDS,
  KNX_AI_CATALOG_MAX_RESULTS_PER_ACTION,
  buildKnxAiCatalogResearchContext,
  collectKnxAiCatalogObjects,
  executeKnxAiCatalogActions,
  normalizeKnxAiCatalogActions
}
