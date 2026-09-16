const KNX_AI_SEMANTIC_CONTEXT_VERSION = 2

const CLOUD_SCHEMA = [
  'id',
  'ga',
  'name',
  'path',
  'aliases',
  'area',
  'kind',
  'capability',
  'access',
  'dpt',
  'values',
  'refs'
]

const MANIFEST_SCHEMA = [
  'id',
  'ga',
  'name',
  'aliases',
  'path',
  'area',
  'kind',
  'capability',
  'access'
]

const cleanText = (value) => String(value === undefined || value === null ? '' : value)
  .normalize('NFC')
  .replace(/[\u0000-\u001f\u007f]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const normalizeIdentity = (value) => cleanText(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()

const compareText = (left, right) => {
  const normalizedLeft = normalizeIdentity(left)
  const normalizedRight = normalizeIdentity(right)
  if (normalizedLeft < normalizedRight) return -1
  if (normalizedLeft > normalizedRight) return 1
  const rawLeft = cleanText(left)
  const rawRight = cleanText(right)
  if (rawLeft < rawRight) return -1
  if (rawLeft > rawRight) return 1
  return 0
}

const asPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {}

const flattenValues = (value) => {
  if (Array.isArray(value)) return value.flatMap(flattenValues)
  return [value]
}

const uniqueSortedText = (values, excludedValues = []) => {
  const excluded = new Set(flattenValues(excludedValues).map(normalizeIdentity).filter(Boolean))
  const byIdentity = new Map()
  flattenValues(values).forEach(value => {
    const text = cleanText(value)
    const identity = normalizeIdentity(text)
    if (!identity || excluded.has(identity)) return
    const previous = byIdentity.get(identity)
    if (!previous || compareText(text, previous) < 0) byIdentity.set(identity, text)
  })
  return Array.from(byIdentity.values()).sort(compareText)
}

const pickText = (records, selectors, fallback = '') => {
  for (const selector of selectors) {
    const candidates = uniqueSortedText(records.flatMap(record => flattenValues(selector(record))))
    if (candidates.length > 0) return candidates[0]
  }
  return cleanText(fallback)
}

const normalizeGa = (value) => {
  const raw = cleanText(value).replace(/\s*\/\s*/g, '/')
  const parts = raw.split('/')
  if (parts.length >= 2 && parts.length <= 3 && parts.every(part => /^\d+$/.test(part))) {
    return parts.map(part => String(Number(part))).join('/')
  }
  return raw
}

const compareGa = (left, right) => {
  const leftParts = String(left || '').split('/')
  const rightParts = String(right || '').split('/')
  const leftNumeric = leftParts.length >= 2 && leftParts.every(part => /^\d+$/.test(part))
  const rightNumeric = rightParts.length >= 2 && rightParts.every(part => /^\d+$/.test(part))
  if (leftNumeric && rightNumeric) {
    const maxLength = Math.max(leftParts.length, rightParts.length)
    for (let index = 0; index < maxLength; index += 1) {
      if (index >= leftParts.length) return -1
      if (index >= rightParts.length) return 1
      const difference = Number(leftParts[index]) - Number(rightParts[index])
      if (difference !== 0) return difference
    }
    return 0
  }
  if (leftNumeric !== rightNumeric) return leftNumeric ? -1 : 1
  return compareText(left, right)
}

const fnv1a64 = (value) => {
  let hash = 0xcbf29ce484222325n
  const bytes = Buffer.from(String(value || ''), 'utf8')
  for (const byte of bytes) {
    hash ^= BigInt(byte)
    hash = BigInt.asUintN(64, hash * 0x100000001b3n)
  }
  return hash.toString(36)
}

const buildShortId = (ga) => {
  const parts = String(ga || '').split('/')
  if (parts.length >= 2 && parts.length <= 3 && parts.every(part => /^\d+$/.test(part))) {
    return `g${parts.map(part => Number(part).toString(36)).join('.')}`
  }
  return `g${fnv1a64(ga)}`
}

const normalizeDpt = (value) => cleanText(value).replace(/^dpt\s*/i, '')

const normalizeAccess = (value) => {
  const access = normalizeIdentity(value).replace(/[\s_-]+/g, '')
  if (['ro', 'readonly', 'read'].includes(access)) return 'ro'
  if (['rw', 'readwrite', 'writeread'].includes(access)) return 'rw'
  if (['wo', 'writeonly', 'write'].includes(access)) return 'wo'
  return ''
}

const pickAccess = (records) => {
  const candidates = new Set()
  records.forEach(record => {
    const explicit = normalizeAccess(record.access)
    if (explicit) candidates.add(explicit)
    if (record.readOnly === true) candidates.add('ro')
    if (record.readOnly === false) candidates.add('rw')
    if (record.writeOnly === true) candidates.add('wo')
  })
  if (candidates.has('ro')) return 'ro'
  if (candidates.has('wo')) return 'wo'
  if (candidates.has('rw')) return 'rw'
  return '?'
}

const pickSemanticKind = (records) => {
  const candidates = records.flatMap(record => {
    const semantic = asPlainObject(record.semantic)
    const confidence = Number(semantic.confidence)
    return [
      { value: semantic.kind, confidence: Number.isFinite(confidence) ? confidence : 0 },
      { value: record.semanticKind, confidence: 0 },
      { value: record.kind, confidence: 0 }
    ]
  }).map(candidate => ({
    value: cleanText(candidate.value).toLowerCase().replace(/[\s_]+/g, '-'),
    confidence: candidate.confidence
  })).filter(candidate => candidate.value && candidate.value !== 'unknown')

  candidates.sort((left, right) => {
    if (left.confidence !== right.confidence) return right.confidence - left.confidence
    return compareText(left.value, right.value)
  })
  return candidates.length > 0 ? candidates[0].value : 'unknown'
}

const stableScalar = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number' && Number.isFinite(value)) return value
  return cleanText(value)
}

const compareScalars = (left, right) => {
  if (typeof left === 'number' && typeof right === 'number') return left - right
  if (typeof left === 'boolean' && typeof right === 'boolean') return Number(left) - Number(right)
  return compareText(String(left), String(right))
}

const normalizeValueOptions = (records) => {
  const byKey = new Map()
  records.flatMap(record => {
    const semantic = asPlainObject(record.semantic)
    return [record.valueOptions, record.values, semantic.valueOptions]
  }).flatMap(flattenValues).forEach(option => {
    const source = asPlainObject(option)
    const isObject = Object.keys(source).length > 0
    const value = stableScalar(isObject
      ? source.value !== undefined
        ? source.value
        : source.id !== undefined
          ? source.id
          : source.key
      : option)
    const label = cleanText(isObject
      ? source.label !== undefined
        ? source.label
        : source.name !== undefined
          ? source.name
          : source.text
      : option)
    if (value === '' && label === '') return
    const normalized = { value, label }
    const key = JSON.stringify([value, normalizeIdentity(label)])
    const previous = byKey.get(key)
    if (!previous || compareText(label, previous.label) < 0) byKey.set(key, normalized)
  })

  return Array.from(byKey.values()).sort((left, right) => {
    const valueDifference = compareScalars(left.value, right.value)
    if (valueDifference !== 0) return valueDifference
    return compareText(left.label, right.label)
  })
}

const extractReferenceValues = (value) => flattenValues(value).flatMap(candidate => {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return [candidate]
  return [candidate.id, candidate.ga, candidate.destination, candidate.groupAddress, candidate.reference]
})

const collectReferences = (records, ga) => {
  const candidates = records.flatMap(record => {
    const semantic = asPlainObject(record.semantic)
    return extractReferenceValues([
      record.references,
      record.refs,
      record.relatedGAs,
      record.commandGA,
      record.statusGA,
      record.stateGA,
      record.feedbackGA,
      semantic.references
    ])
  })
  return uniqueSortedText(candidates, [ga])
}

const buildCapability = ({ records, semanticKind, dpt }) => {
  const explicit = pickText(records, [
    record => record.capability,
    record => record.capabilities,
    record => asPlainObject(record.semantic).capability,
    record => asPlainObject(record.semantic).capabilities
  ])
  const tag = pickText(records, [record => record.tags])
  const dptFamily = String(dpt || '').split('.')[0]
  return explicit || (semanticKind !== 'unknown' ? semanticKind : '') || tag || (dptFamily ? `dpt:${dptFamily}` : 'unknown')
}

const canonicalizeGroup = (normalizedGa, records, id) => {
  const ga = cleanText(records
    .map(record => record.ga || record.groupAddress || record.destination || record.address)
    .find(Boolean)) || normalizedGa
  const semanticKind = pickSemanticKind(records)
  const dpt = pickText(records, [record => record.dpt, record => asPlainObject(record.semantic).dpt])
  const path = pickText(records, [
    record => record.hierarchyPath,
    record => record.path,
    record => [record.mainGroup, record.middleGroup].map(cleanText).filter(Boolean).join(' / ')
  ])
  const name = pickText(records, [
    record => record.label,
    record => record.name,
    record => record.deviceLabel,
    record => asPlainObject(record.semantic).originalLabel,
    record => record.etsName
  ], ga)
  const area = pickText(records, [
    record => asPlainObject(record.semantic).area,
    record => record.area,
    record => record.middleGroup,
    record => record.mainGroup
  ])
  const aliasCandidates = records.flatMap(record => [
    record.aliases,
    record.names,
    record.alternativeNames,
    record.etsName,
    record.label,
    record.name,
    record.deviceLabel,
    asPlainObject(record.semantic).originalLabel
  ])
  const normalizedDpt = normalizeDpt(dpt)
  return {
    id,
    ga,
    name,
    path,
    aliases: uniqueSortedText(aliasCandidates, [ga, name, path]),
    area,
    semanticKind,
    capability: buildCapability({ records, semanticKind, dpt: normalizedDpt }),
    access: pickAccess(records),
    dpt: normalizedDpt,
    valueOptions: normalizeValueOptions(records),
    references: collectReferences(records, ga)
  }
}

const canonicalizeKnxAiCatalog = (catalog) => {
  const byGa = new Map()
  ;(Array.isArray(catalog) ? catalog : []).forEach(candidate => {
    const record = asPlainObject(candidate)
    const ga = normalizeGa(record.ga || record.groupAddress || record.destination || record.address)
    if (!ga) return
    if (!byGa.has(ga)) byGa.set(ga, [])
    byGa.get(ga).push(record)
  })

  const usedIds = new Map()
  return Array.from(byGa.keys()).sort(compareGa).map(ga => {
    const baseId = buildShortId(ga)
    const occurrence = Number(usedIds.get(baseId) || 0) + 1
    usedIds.set(baseId, occurrence)
    const id = occurrence === 1 ? baseId : `${baseId}~${occurrence.toString(36)}`
    return canonicalizeGroup(ga, byGa.get(ga), id)
  })
}

const toCloudRow = (record) => [
  record.id,
  record.ga,
  record.name,
  record.path,
  record.aliases,
  record.area,
  record.semanticKind,
  record.capability,
  record.access,
  record.dpt,
  record.valueOptions.map(option => [option.value, option.label]),
  record.references
]

const toManifestRow = (record) => [
  record.id,
  record.ga,
  record.name,
  record.aliases,
  record.path,
  record.area,
  record.semanticKind,
  record.capability,
  record.access
]

const serializeRows = ({ section, schema, rows }) => [
  `${section}/${KNX_AI_SEMANTIC_CONTEXT_VERSION}|${schema.join(',')}`,
  ...rows.map(row => JSON.stringify(row))
].join('\n')

const serializeCloudFromCanonical = (records, section = 'KNX-CATALOG') => serializeRows({
  section,
  schema: CLOUD_SCHEMA,
  rows: records.map(toCloudRow)
})

const serializeManifestFromCanonical = (records) => serializeRows({
  section: 'KNX-MANIFEST',
  schema: MANIFEST_SCHEMA,
  rows: records.map(toManifestRow)
})

const serializeKnxAiCloudCatalog = (catalog) => serializeCloudFromCanonical(canonicalizeKnxAiCatalog(catalog))

const byteLength = (value) => Buffer.byteLength(String(value || ''), 'utf8')

const countBy = (records, selector, emptyKey = 'unknown') => {
  const counts = new Map()
  records.forEach(record => {
    const key = cleanText(selector(record)) || emptyKey
    counts.set(key, Number(counts.get(key) || 0) + 1)
  })
  return Object.fromEntries(Array.from(counts.entries()).sort((left, right) => compareText(left[0], right[0])))
}

const buildKnxAiSemanticContextStats = ({ source, canonical, cloudText, manifestText }) => {
  const validSourceRecords = source.filter(candidate => {
    const record = asPlainObject(candidate)
    return normalizeGa(record.ga || record.groupAddress || record.destination || record.address) !== ''
  }).length
  return {
    formatVersion: KNX_AI_SEMANTIC_CONTEXT_VERSION,
    sourceRecords: source.length,
    validSourceRecords,
    invalidSourceRecords: source.length - validSourceRecords,
    canonicalRecords: canonical.length,
    duplicateRecords: Math.max(0, validSourceRecords - canonical.length),
    aliases: canonical.reduce((total, record) => total + record.aliases.length, 0),
    valueOptions: canonical.reduce((total, record) => total + record.valueOptions.length, 0),
    references: canonical.reduce((total, record) => total + record.references.length, 0),
    uniqueAreas: new Set(canonical.map(record => record.area).filter(Boolean)).size,
    uniqueSemanticKinds: new Set(canonical.map(record => record.semanticKind).filter(kind => kind && kind !== 'unknown')).size,
    uniqueDpts: new Set(canonical.map(record => record.dpt).filter(Boolean)).size,
    access: countBy(canonical, record => record.access),
    semanticKinds: countBy(canonical, record => record.semanticKind),
    bytes: {
      cloudCatalog: typeof cloudText === 'string' ? byteLength(cloudText) : null,
      localManifest: byteLength(manifestText),
      allDetails: typeof cloudText === 'string'
        ? byteLength(cloudText) + byteLength('KNX-DETAILS') - byteLength('KNX-CATALOG')
        : null
    }
  }
}

const normalizeDetailReference = (candidate) => {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return cleanText(candidate)
  return cleanText(candidate.id || candidate.ga || candidate.reference || candidate.destination || candidate.groupAddress)
}

const selectDetailRecords = (canonical, detailReferences) => {
  if (detailReferences === undefined || detailReferences === null) return canonical.slice()
  const byReference = new Map()
  canonical.forEach(record => {
    ;[record.id, record.ga].forEach(reference => {
      const key = normalizeIdentity(reference)
      if (key && !byReference.has(key)) byReference.set(key, record)
    })
  })
  canonical.forEach(record => {
    record.references.forEach(reference => {
      const key = normalizeIdentity(reference)
      if (key && !byReference.has(key)) byReference.set(key, record)
    })
  })
  const selected = []
  const selectedIds = new Set()
  ;(Array.isArray(detailReferences) ? detailReferences : [detailReferences]).forEach(candidate => {
    const record = byReference.get(normalizeIdentity(normalizeDetailReference(candidate)))
    if (!record || selectedIds.has(record.id)) return
    selectedIds.add(record.id)
    selected.push(record)
  })
  return selected
}

const resolveByteBudget = (value) => {
  if (value === undefined || value === null || value === '') return Number.POSITIVE_INFINITY
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return Number.POSITIVE_INFINITY
  return Math.max(0, Math.floor(parsed))
}

const pickOverflowDeclaration = ({ byteBudget, manifestBytes, recordCount, includedCount = 0 }) => {
  const candidates = [
    `KNX-MANIFEST/${KNX_AI_SEMANTIC_CONTEXT_VERSION}|PARTIAL|included=${includedCount}|records=${recordCount}|bytes=${manifestBytes}|budget=${Number.isFinite(byteBudget) ? byteBudget : 'unlimited'}`,
    `KNX-MANIFEST/${KNX_AI_SEMANTIC_CONTEXT_VERSION}|PARTIAL|${includedCount}/${recordCount}`,
    `KNX-MANIFEST/${KNX_AI_SEMANTIC_CONTEXT_VERSION}|OVERFLOW`,
    'OVERFLOW',
    '!'
  ]
  return candidates.find(candidate => byteLength(candidate) <= byteBudget) || ''
}

const packKnxAiSemanticContext = ({ catalog, byteBudget, detailReferences } = {}) => {
  const source = Array.isArray(catalog) ? catalog : []
  const canonical = canonicalizeKnxAiCatalog(source)
  const explicitDetails = detailReferences !== undefined && detailReferences !== null
  const cloudText = explicitDetails ? null : serializeCloudFromCanonical(canonical)
  const manifestText = serializeManifestFromCanonical(canonical)
  const manifestBytes = byteLength(manifestText)
  const budget = resolveByteBudget(byteBudget)
  const selectedDetails = selectDetailRecords(canonical, detailReferences)

  const createAtomicBuffer = (maxBytes) => {
    const lines = []
    let usedBytes = 0
    const appendAtomic = (value) => {
      const text = String(value || '')
      if (!text) return false
      const separatorBytes = lines.length > 0 ? 1 : 0
      const requiredBytes = separatorBytes + byteLength(text)
      if (usedBytes + requiredBytes > maxBytes) return false
      lines.push(text)
      usedBytes += requiredBytes
      return true
    }
    return {
      lines,
      appendAtomic,
      usedBytes: () => usedBytes
    }
  }

  const packDetails = (maxBytes, records) => {
    const buffer = createAtomicBuffer(maxBytes)
    const included = []
    if (records.length > 0) {
      const detailHeader = `KNX-DETAILS/${KNX_AI_SEMANTIC_CONTEXT_VERSION}|${CLOUD_SCHEMA.join(',')}`
      if (buffer.appendAtomic(detailHeader)) {
        records.forEach(record => {
          if (buffer.appendAtomic(JSON.stringify(toCloudRow(record)))) included.push(record)
        })
      }
    }
    if (included.length === 0) return { lines: [], bytes: 0, included: [] }
    return { lines: buffer.lines, bytes: buffer.usedBytes(), included }
  }

  const packManifest = (maxBytes, records = canonical) => {
    if (records.length === 0) {
      return {
        lines: [],
        bytes: 0,
        complete: true,
        includedCount: 0,
        overflowDeclaration: '',
        totalCount: 0
      }
    }
    const packedManifestText = records === canonical ? manifestText : serializeManifestFromCanonical(records)
    const packedManifestBytes = byteLength(packedManifestText)
    if (packedManifestBytes <= maxBytes) {
      return {
        lines: packedManifestText ? packedManifestText.split('\n') : [],
        bytes: packedManifestBytes,
        complete: true,
        includedCount: records.length,
        overflowDeclaration: '',
        totalCount: records.length
      }
    }
    const buffer = createAtomicBuffer(maxBytes)
    const header = `KNX-MANIFEST/${KNX_AI_SEMANTIC_CONTEXT_VERSION}|${MANIFEST_SCHEMA.join(',')}`
    if (!buffer.appendAtomic(header)) {
      const overflowDeclaration = pickOverflowDeclaration({
        byteBudget: maxBytes,
        manifestBytes: packedManifestBytes,
        recordCount: records.length,
        includedCount: 0
      })
      const fallback = createAtomicBuffer(maxBytes)
      fallback.appendAtomic(overflowDeclaration)
      return {
        lines: fallback.lines,
        bytes: fallback.usedBytes(),
        complete: false,
        includedCount: 0,
        overflowDeclaration,
        totalCount: records.length
      }
    }
    let includedCount = 0
    let omittedCount = 0
    const rows = records.map(record => JSON.stringify(toManifestRow(record)))
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index]
      const wouldCompleteManifest = omittedCount === 0 && index === rows.length - 1
      const marker = pickOverflowDeclaration({
        byteBudget: Math.max(0, maxBytes - buffer.usedBytes() - 1),
        manifestBytes: packedManifestBytes,
        recordCount: records.length,
        includedCount
      })
      const reserveBytes = wouldCompleteManifest ? 0 : (marker ? byteLength(marker) + 1 : 2)
      if (buffer.usedBytes() + byteLength(row) + 1 + reserveBytes > maxBytes) {
        omittedCount += 1
        continue
      }
      if (!buffer.appendAtomic(row)) {
        omittedCount += 1
        continue
      }
      includedCount += 1
    }
    const complete = omittedCount === 0 && includedCount === records.length
    const overflowDeclaration = complete
      ? ''
      : pickOverflowDeclaration({
        byteBudget: Math.max(0, maxBytes - buffer.usedBytes() - 1),
        manifestBytes: packedManifestBytes,
        recordCount: records.length,
        includedCount
      })
    if (overflowDeclaration) buffer.appendAtomic(overflowDeclaration)
    return {
      lines: buffer.lines,
      bytes: buffer.usedBytes(),
      complete,
      includedCount,
      overflowDeclaration,
      totalCount: records.length
    }
  }

  let manifestPack
  let detailPack
  if (explicitDetails) {
    detailPack = packDetails(budget, selectedDetails)
    const detailIds = new Set(detailPack.included.map(record => record.id))
    const manifestRecords = canonical.filter(record => !detailIds.has(record.id))
    const separatorBytes = detailPack.lines.length > 0 ? 1 : 0
    const manifestBudget = Number.isFinite(budget)
      ? Math.max(0, budget - detailPack.bytes - separatorBytes)
      : budget
    manifestPack = packManifest(manifestBudget, manifestRecords)
  } else {
    const cloudBytes = byteLength(cloudText)
    if (cloudBytes <= budget) {
      detailPack = {
        lines: cloudText ? cloudText.split('\n') : [],
        bytes: cloudBytes,
        included: canonical.slice()
      }
      manifestPack = { lines: [], bytes: 0, complete: true, includedCount: 0, overflowDeclaration: '', totalCount: 0 }
    } else {
      manifestPack = packManifest(budget)
      detailPack = { lines: [], bytes: 0, included: [] }
    }
  }

  const lines = [...manifestPack.lines, ...detailPack.lines]
  const text = lines.join('\n')
  const includedDetailIds = detailPack.included.map(record => record.id)
  const includedDetailGAs = detailPack.included.map(record => record.ga)
  const omittedDetailCount = selectedDetails.length - includedDetailIds.length
  const coveredCount = Math.min(canonical.length, manifestPack.includedCount + includedDetailIds.length)
  const manifestOmittedCount = Math.max(0, canonical.length - coveredCount)
  const manifestStatus = !explicitDetails && includedDetailIds.length === canonical.length
    ? 'full-details'
    : manifestOmittedCount === 0
      ? 'complete'
      : (manifestPack.includedCount > 0 || includedDetailIds.length > 0 ? 'partial' : 'overflow')
  return {
    text,
    byteLength: byteLength(text),
    byteBudget: Number.isFinite(budget) ? budget : null,
    manifestStatus,
    manifestBytes,
    manifestIncludedCount: manifestPack.includedCount,
    manifestOmittedCount,
    overflowDeclaration: manifestPack.overflowDeclaration,
    requestedDetailCount: selectedDetails.length,
    includedDetailCount: includedDetailIds.length,
    omittedDetailCount,
    includedDetailIds,
    includedDetailGAs,
    stats: Object.assign({}, buildKnxAiSemanticContextStats({ source, canonical, cloudText, manifestText }), {
      packedBytes: byteLength(text),
      manifestStatus,
      manifestIncluded: manifestPack.includedCount,
      manifestOmitted: manifestOmittedCount,
      requestedDetails: selectedDetails.length,
      includedDetails: includedDetailIds.length,
      omittedDetails: omittedDetailCount
    })
  }
}

module.exports = {
  KNX_AI_SEMANTIC_CONTEXT_VERSION,
  canonicalizeKnxAiCatalog,
  serializeKnxAiCloudCatalog,
  packKnxAiSemanticContext
}
