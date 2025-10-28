// 31/03/2020 Search Helper
function htmlUtilsfullCSVSearch (sourceText, searchString) {
  let aSearchWords = []
  if (searchString.toLowerCase().includes('exactmatch')) {
    // Find only the strict exact match of group address. For example, if the string is 0/0/2exactmatch, i return only the item in the csv having
    // group address 0/0/2 (and not also, for example 0/0/20)
    // I can have also an exact string like '0/0/1exactmatch 1.000', (GA or any text, plus the datapoint) and i must take it into consideration
    const aSearchStrings = searchString.split(' ')
    for (let index = 0; index < aSearchStrings.length; index++) {
      const element = aSearchStrings[index]
      if (element.includes('exactmatch')) {
        aSearchWords.push(element.replace('exactmatch', ' ')) // The last ' ' allow to return the exact match
      } else {
        aSearchWords.push(element) // The last ' ' allow to return the exact match
      }
    }
  } else {
    aSearchWords = searchString.toLowerCase().split(' ')
  }

  // This searches for all words in a string
  let i = 0
  for (let index = 0; index < aSearchWords.length; index++) {
    if (sourceText.toLowerCase().indexOf(aSearchWords[index]) > -1) i += 1
  }
  return i == aSearchWords.length
}

// 2025-09 Secure KNX helpers for GA autocompletes
// Cache for secure GA lists per serverId
window.__knxSecureGAsCache = window.__knxSecureGAsCache || {}

function KNX_fetchSecureGAs (serverId) {
  return new Promise((resolve) => {
    try {
      if (window.__knxSecureGAsCache[serverId] instanceof Set) {
        resolve(window.__knxSecureGAsCache[serverId])
        return
      }
      $.getJSON('knxUltimateKeyringDataSecureGAs?serverId=' + serverId + '&_=' + new Date().getTime(), (data) => {
        try {
          const set = new Set()
          if (Array.isArray(data)) data.forEach(ga => { if (typeof ga === 'string') set.add(ga) })
          window.__knxSecureGAsCache[serverId] = set
          resolve(set)
        } catch (e) { resolve(new Set()) }
      }).fail(function () { resolve(new Set()) })
    } catch (e) { resolve(new Set()) }
  })
}

function KNX_enableSecureFormatting ($input, serverId) {
  try {
    if (!$input || !$input.length) return
    try {
      $input.data('knxGaAutocomplete', true)
    } catch (e) { /* empty */ }
    KNX_fetchSecureGAs(serverId).then((secureSet) => {
      try {
        const inst = $input.autocomplete('instance')
        if (!inst) return
        inst._renderItem = function (ul, item) {
          // Try to detect GA from item.ga or from item.value string
          let ga = item.ga
          if (!ga && typeof item.value === 'string') {
            const m = item.value.match(/\b\d{1,2}\/\d{1,3}\/\d{1,3}\b/)
            if (m) ga = m[0]
          }
          const isSecure = ga ? secureSet.has(ga) : false
          const colorStyle = isSecure ? 'color: green;' : ''
          const shield = isSecure ? '<i class="fa fa-shield"></i> ' : ''
          const label = (typeof item.label === 'string') ? item.label : (item.value || '')
          return $('<li>').append(`<div style="${colorStyle}">${shield}${label}</div>`).appendTo(ul)
        }
      } catch (e) { }
    })
  } catch (e) { }
}

// Expose helpers
window.htmlUtilsfullCSVSearch = htmlUtilsfullCSVSearch
window.KNX_fetchSecureGAs = KNX_fetchSecureGAs
window.KNX_enableSecureFormatting = KNX_enableSecureFormatting

function KNX_cleanAutocompleteTerm (term) {
  if (typeof term !== 'string') return ''
  return term.replace(/exactmatch/gi, ' ').replace(/\s+/g, ' ').trim()
}

window.KNX_cleanAutocompleteTerm = KNX_cleanAutocompleteTerm

// 2025-09: Make DPT selects searchable via jQuery UI Autocomplete
function KNX_makeSelectSearchable ($select) {
  try {
    if (!($select && $select.length)) return
    const id = $select.attr('id') || ('knx-dpt-' + Math.random().toString(36).slice(2))
    $select.attr('id', id)
    const prevCount = $select.data('knx-options-count')
    const curCount = $select.find('option').length
    const already = $select.data('knx-searchable') === true
    const needsSync = already && prevCount !== curCount

    function buildSource () {
      const items = []
      $select.find('option').each(function () {
        const v = $(this).attr('value')
        const t = $(this).text()
        items.push({ label: t, value: v })
      })
      return items
    }

    function syncFromSelect ($input) {
      try {
        const val = $select.val()
        const txt = ($select.find('option:selected').text()) || ''
        if ($input) { $input.val(txt) }
        // refresh source
        if ($input && $input.data('ui-autocomplete')) {
          $input.autocomplete('option', 'source', buildSource())
        }
        $select.data('knx-options-count', curCount)
      } catch (e) { }
    }

    if (!already) {
      // Create input next to select
      const width = $select.outerWidth() || 200
      const $input = $('<input type="text" class="knx-dpt-combobox" autocomplete="off" />')
        .attr('id', id + '-search')
        .css('width', width + 'px')
      $select.after($input)
      // Hide original select but keep in DOM for value binding
      $select.hide()
      // Init autocomplete
      $input.autocomplete({
        minLength: 0,
        source: buildSource(),
        select: function (event, ui) {
          try { event.preventDefault() } catch (e) {}
          $input.val(ui.item.label)
          $select.val(ui.item.value).trigger('change')
        },
        focus: function (event, ui) {
          try { event.preventDefault() } catch (e) {}
          $input.val(ui.item.label)
        }
      }).on('focus click', function () {
        // Always show full list on click/focus
        try { $(this).autocomplete('search', '') } catch (e) {}
      })
      // Initial sync
      syncFromSelect($input)
      // When select value changes programmatically, keep input in sync
      $select.on('change', function () { syncFromSelect($input) })
      $select.data('knx-searchable', true)
    } else if (needsSync) {
      // Only refresh source and text
      const $input = $('#' + id + '-search')
      syncFromSelect($input)
    }
  } catch (e) { }
}

// Auto-enhance any select whose id contains 'dpt'
(function () {
  if (window.__knx_dptObserverSetup) return; window.__knx_dptObserverSetup = true
  function enhance (root) {
    try {
      $(root).find('select[id*="dpt"]').each(function () { KNX_makeSelectSearchable($(this)) })
    } catch (e) {}
  }
  try {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (!m.addedNodes) return
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return
          // If a select is added
          if (n.matches && n.matches('select[id*="dpt"]')) { enhance(n); return }
          // If options are added to an existing select
          if (n.matches && n.matches('option')) {
            const sel = n.closest && n.closest('select')
            if (sel && sel.id && sel.id.indexOf('dpt') > -1) { KNX_makeSelectSearchable($(sel)) }
            return
          }
          enhance(n)
        })
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })
    // Initial pass
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { enhance(document.body) })
    } else { enhance(document.body) }
  } catch (e) {}
})()

window.KNX_makeSelectSearchable = KNX_makeSelectSearchable;

// Ensure autocomplete lists open immediately on focus/click
(function ($) {
  if (!$.ui || !$.ui.autocomplete) return
  const _create = $.ui.autocomplete.prototype._create
  $.ui.autocomplete.prototype._create = function () {
    _create.call(this)
    const self = this
    const showAll = (val) => {
      if (self.options.disabled) return
      const term = (typeof val === 'string') ? val : self.element.val() || ''
      const minLen = self.options.minLength || 0
      const query = term.length >= minLen ? term : ''
      try {
        self.search(query)
      } catch (error) { }
    }
    this.element.on('focus.knxAutocomplete click.knxAutocomplete', function () {
      clearTimeout(self._knxAutoTimer)
      self._knxAutoTimer = setTimeout(function () { showAll() }, 0)
    })
    this.element.on('mousedown.knxAutocomplete', function () {
      clearTimeout(self._knxAutoTimer)
      self._knxAutoTimer = setTimeout(function () { showAll('') }, 0)
    })
  }

  const _normalize = $.ui.autocomplete.prototype._normalize
  $.ui.autocomplete.prototype._normalize = function (items) {
    let normalized
    try {
      normalized = _normalize.call(this, items)
    } catch (error) {
      normalized = []
    }
    if (Array.isArray(normalized) && normalized.length > 0) {
      return normalized
    }
    const $element = this.element
    if (!$element || !$element.length) {
      return Array.isArray(normalized) ? normalized : []
    }
    const isGaAutocomplete = !!$element.data('knxGaAutocomplete')
    if (!isGaAutocomplete) {
      return Array.isArray(normalized) ? normalized : []
    }
    const rawTerm = (typeof this.term === 'string') ? this.term : ''
    const cleanedTerm = KNX_cleanAutocompleteTerm(rawTerm)
    if (!cleanedTerm) {
      return Array.isArray(normalized) ? normalized : []
    }
    return [{
      label: `${cleanedTerm} #  # `,
      value: cleanedTerm,
      ga: cleanedTerm,
      devicename: '',
      dpt: '',
      isSecure: false,
      __knxFallback: true
    }]
  }
})(jQuery)
