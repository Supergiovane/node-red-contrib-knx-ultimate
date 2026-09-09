(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.KNXUltimateFunctionAutocomplete = api
}(typeof window !== 'undefined' ? window : globalThis, function () {
  const firstArgument = /(?:^|[^\w$.])(?:getGAValue|setGAValue)\s*\(\s*$/

  // Scan strings and comments so helper names in examples/comments cannot trigger a GA edit.
  function getContext (source, offset) {
    let code = ''
    let index = 0
    while (index < offset) {
      const char = source[index]
      if (source.slice(index, index + 2) === '//') {
        const end = source.indexOf('\n', index + 2)
        if (end < 0 || end >= offset) return null
        code += ' '
        index = end
      } else if (source.slice(index, index + 2) === '/*') {
        const end = source.indexOf('*/', index + 2)
        if (end < 0 || end + 2 > offset) return null
        code += ' '
        index = end + 2
      } else if (char === "'" || char === '"' || char === '`') {
        const start = index + 1
        let end = start
        while (end < source.length && source[end] !== char && source[end] !== '\n') {
          if (source[end] === '\\') end++
          end++
        }
        if (offset <= end) {
          if (!firstArgument.test(code) || (char === '`' && source.slice(start, end).includes('${'))) return null
          return { start, end, query: source.slice(start, offset), quote: char, closed: source[end] === char }
        }
        code += ' literal '
        index = end + 1
        // Template literals can span lines; skip the rest rather than treating their text as code.
        if (char === '`' && source[end] !== char) {
          while (index < source.length && source[index] !== '`') {
            if (source[index] === '\\') index++
            index++
          }
          if (index >= offset) return null
          index++
        }
      } else {
        code += char
        index++
      }
    }
    return firstArgument.test(code) ? { start: offset, end: offset, query: '', quote: '', closed: false } : null
  }

  function getEntries (data, query) {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    const seen = new Set()
    return (Array.isArray(data) ? data : []).filter(entry => {
      if (!entry || typeof entry.ga !== 'string' || !entry.ga || seen.has(entry.ga)) return false
      seen.add(entry.ga)
      return terms.every(term => `${entry.ga} ${entry.devicename || ''} ${entry.dpt || ''}`.toLowerCase().includes(term))
    }).map(entry => ({
      ga: entry.ga,
      comment: '// ' + `${entry.ga} ${entry.devicename || ''}`.replace(/[\r\n\u2028\u2029]+/g, ' ').trim(),
      label: `${entry.ga} # ${entry.devicename || ''} # ${entry.dpt || ''}`
    }))
  }

  function replacement (context, ga) {
    return context.quote ? ga + (context.closed ? '' : context.quote) : "'" + ga + "'"
  }

  function getGaHeader (source) {
    const entries = []
    let end = 0
    let match
    const line = /^[\t ]*\/\/[\t ]+(\d+(?:\/\d+){0,2})(?:[\t ]+[^\r\n]*)?(?:\r?\n|$)/
    while ((match = source.slice(end).match(line))) {
      entries.push({ ga: match[1], comment: match[0].trim(), start: end, end: end + match[0].length })
      end += match[0].length
    }
    return { entries, end }
  }

  function getCommentEdit (source, entry) {
    const header = getGaHeader(source)
    const existing = header.entries.find(item => item.ga === entry.ga)
    if (existing && existing.comment === entry.comment) return null
    const eol = source.includes('\r\n') ? '\r\n' : '\n'
    return { start: existing ? existing.start : header.end, end: existing ? existing.end : header.end, text: entry.comment + eol }
  }

  function pruneUnusedGaComments (source) {
    const header = getGaHeader(source)
    if (!header.entries.length) return source
    const body = source.slice(header.end)
    // Preserve quoted strings while removing disabled code and explanatory comments.
    const code = body.replace(/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|\/\/[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$)/g, token => {
      return token.startsWith('//') || token.startsWith('/*') ? ' ' : token
    }).replace(/\\\//g, '/')
    const seen = new Set()
    const kept = header.entries.filter(entry => {
      if (seen.has(entry.ga) || !new RegExp('(^|[^\\w/])' + entry.ga + '(?![\\w/])').test(code)) return false
      seen.add(entry.ga)
      return true
    })
    const eol = source.includes('\r\n') ? '\r\n' : '\n'
    return kept.map(entry => entry.comment + eol).join('') + body
  }

  function attach (editor, { monaco, ace, loadGroupAddresses, helperItems }) {
    if (monaco && typeof editor.getModel === 'function') {
      editor.updateOptions({ quickSuggestions: { other: true, comments: false, strings: true }, suggestOnTriggerCharacters: true })
      return monaco.languages.registerCompletionItemProvider('javascript', {
        triggerCharacters: ['(', "'", '"', '`', '/'],
        provideCompletionItems: async (model, position, _context, token) => {
          if (model !== editor.getModel()) return { suggestions: [] }
          const context = getContext(model.getValue(), model.getOffsetAt(position))
          if (!context) {
            const word = model.getWordUntilPosition(position)
            return {
              suggestions: helperItems.map(item => ({
                label: item.label,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: item.snippet,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: item.doc,
                range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn)
              }))
            }
          }
          const entries = getEntries(await loadGroupAddresses(), context.query)
          if ((token && token.isCancellationRequested) || model.isDisposed() || model !== editor.getModel()) return { suggestions: [] }
          const start = model.getPositionAt(context.start)
          const end = model.getPositionAt(context.end)
          return {
            incomplete: true,
            suggestions: entries.map(entry => {
              const comment = getCommentEdit(model.getValue(), entry)
              const suggestion = {
                label: entry.label,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: replacement(context, entry.ga),
                // The list is already filtered by every search term, including ETS names.
                filterText: context.query + ' ' + entry.label,
                detail: 'KNX group address',
                range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column)
              }
              if (comment) {
                const position = model.getPositionAt(comment.start)
                const end = model.getPositionAt(comment.end)
                suggestion.additionalTextEdits = [{
                  range: new monaco.Range(position.lineNumber, position.column, end.lineNumber, end.column),
                  text: comment.text
                }]
              }
              return suggestion
            })
          }
        }
      })
    }

    if (!ace || !ace.require) return { dispose () {} }
    const Range = ace.require('ace/range').Range
    const getAceContext = (session, position) => getContext(session.getValue(), session.getDocument().positionToIndex(position))
    const helpers = {
      getCompletions (_editor, session, position, prefix, callback) {
        if (getAceContext(session, position)) return callback(null, [])
        const search = (prefix || '').toLowerCase()
        callback(null, helperItems.filter(item => item.id.toLowerCase().startsWith(search)).map(item => ({
          caption: item.label, value: item.aceValue, snippet: item.snippet, meta: 'KNX helper', docText: item.doc
        })))
      }
    }
    const addresses = {
      identifierRegexps: [/[a-zA-Z0-9_$\/\u00A2-\uFFFF]/],
      getCompletions (_editor, session, position, _prefix, callback) {
        const context = getAceContext(session, position)
        if (!context) return callback(null, [])
        loadGroupAddresses().then(data => callback(null, getEntries(data, context.query).map(entry => ({
          caption: entry.label, value: entry.ga, comment: entry.comment, meta: 'KNX GA', score: 1000, completer: addresses
        }))), () => callback(null, []))
      },
      insertMatch (target, item) {
        const context = getAceContext(target.session, target.getCursorPosition())
        if (!context) return
        const doc = target.session.getDocument()
        const start = doc.indexToPosition(context.start)
        const end = doc.indexToPosition(context.end)
        const text = replacement(context, item.value)
        const comment = getCommentEdit(target.session.getValue(), { ga: item.value, comment: item.comment })
        target.session.replace(new Range(start.row, start.column, end.row, end.column), text)
        if (comment) {
          const position = doc.indexToPosition(comment.start)
          const end = doc.indexToPosition(comment.end)
          target.session.replace(new Range(position.row, position.column, end.row, end.column), comment.text)
        }
        target.clearSelection()
        target.moveCursorToPosition(doc.indexToPosition(context.start + text.length + (comment ? comment.text.length - (comment.end - comment.start) : 0)))
      }
    }
    // Ace's default completer array is shared across editor instances.
    editor.completers = (editor.completers || []).concat(helpers, addresses)
    const afterExec = event => {
      if (event.command.name !== 'insertstring' || !['(', "'", '"', '`', '/', ' '].includes(event.args)) return
      if (!getAceContext(editor.session, editor.getCursorPosition())) return
      const Autocomplete = ace.require('ace/autocomplete').Autocomplete
      const completer = editor.completer || new Autocomplete()
      editor.completer = completer
      completer.autoInsert = false
      completer.showPopup(editor)
    }
    editor.commands.on('afterExec', afterExec)
    return {
      dispose () {
        editor.commands.off('afterExec', afterExec)
        editor.completers = editor.completers.filter(item => item !== helpers && item !== addresses)
      }
    }
  }

  return { getContext, getEntries, attach, pruneUnusedGaComments }
}))
