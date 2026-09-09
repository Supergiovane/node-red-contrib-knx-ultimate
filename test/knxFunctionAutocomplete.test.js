const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const vm = require('vm')
const { getContext, getEntries, attach, pruneUnusedGaComments } = require('../resources/knxFunctionAutocomplete')

const addresses = [
  { ga: '1/1/1', devicename: '(Attuatori luci->Luci primo piano) Luce cucina', dpt: '1.001' },
  { ga: '1/1/2', devicename: 'Luce soggiorno', dpt: '1.001' },
  { ga: '2/0/1', devicename: 'Temperatura cucina', dpt: '9.001' }
]
const kitchenComment = '// 1/1/1 (Attuatori luci->Luci primo piano) Luce cucina'
const marked = text => ({ source: text.replace('|', ''), offset: text.indexOf('|') })
const contextAt = text => {
  const { source, offset } = marked(text)
  return getContext(source, offset)
}

describe('KNX Function group address autocomplete', () => {
  it('recognizes the first argument of both helpers, including multiline calls and comments', () => {
    for (const helper of ['getGAValue', 'setGAValue']) {
      for (const quote of ["'", '"', '`']) {
        const context = contextAt(`await ${helper}(\n /* group */ ${quote}cuc|ina${quote}, true);`)
        expect(context).to.include({ query: 'cuc', quote, closed: true })
      }
      expect(contextAt(`${helper}(|)`)).to.include({ query: '', quote: '' })
      expect(contextAt(`${helper}('1/|`)).to.include({ query: '1/', closed: false })
    }
  })

  it('does not offer addresses in other arguments, expressions, strings or comments', () => {
    const cases = [
      "getGAValue('1/1/1', '|')", "setGAValue('1/1/1', '|', '1.001')",
      "setGAValue('1/1/1', true, '|')", "otherFunction('|')", "obj.getGAValue('|')",
      "getGAValue(address + '|')", "// getGAValue('|')", "/* getGAValue('|') */",
      'const example = "getGAValue(\'|\')"', 'const example = `example\ngetGAValue(\'|\')`',
      'getGAValue(`1/${group}/|`)', "const mygetGAValue = '|';"
    ]
    cases.forEach(text => expect(contextAt(text), text).to.equal(null))
  })

  it('searches addresses, ETS names and DPTs case-insensitively with multiple terms', () => {
    expect(getEntries(addresses, '1/1/').map(item => item.ga)).to.deep.equal(['1/1/1', '1/1/2'])
    expect(getEntries(addresses, 'CUCINA luce').map(item => item.ga)).to.deep.equal(['1/1/1'])
    expect(getEntries(addresses, '9.001')[0].label).to.equal('2/0/1 # Temperatura cucina # 9.001')
    expect(getEntries(addresses, 'missing')).to.deep.equal([])
  })

  it('handles missing ETS data and duplicate or malformed entries', () => {
    for (const data of [null, '', undefined, {}]) expect(getEntries(data, '')).to.deep.equal([])
    expect(getEntries([null, {}, ...addresses, addresses[0]], '')).to.have.length(3)
  })
})

function monacoFixture (text) {
  const { source, offset } = marked(text)
  const model = {
    getValue: () => source,
    getOffsetAt: position => source.split('\n').slice(0, position.lineNumber - 1).reduce((sum, line) => sum + line.length + 1, 0) + position.column - 1,
    getPositionAt: index => {
      const lines = source.slice(0, index).split('\n')
      return { lineNumber: lines.length, column: lines[lines.length - 1].length + 1 }
    },
    isDisposed: () => false
  }
  const providers = []
  const monaco = {
    Range: class {
      constructor (startLineNumber, startColumn, endLineNumber, endColumn) {
        Object.assign(this, { startLineNumber, startColumn, endLineNumber, endColumn })
      }
    },
    languages: {
      CompletionItemKind: { Value: 1 },
      registerCompletionItemProvider (_language, provider) {
        providers.push(provider)
        return { dispose: () => providers.splice(providers.indexOf(provider), 1) }
      }
    }
  }
  const editor = { getModel: () => model, updateOptions: () => {} }
  const apply = item => {
    const edits = [{ range: item.range, text: item.insertText }, ...(item.additionalTextEdits || [])].map(edit => ({
      start: model.getOffsetAt({ lineNumber: edit.range.startLineNumber, column: edit.range.startColumn }),
      end: model.getOffsetAt({ lineNumber: edit.range.endLineNumber, column: edit.range.endColumn }),
      text: edit.text
    })).sort((a, b) => b.start - a.start)
    return edits.reduce((text, edit) => text.slice(0, edit.start) + edit.text + text.slice(edit.end), source)
  }
  return { monaco, editor, model, providers, apply, position: model.getPositionAt(offset) }
}

describe('KNX Function Monaco completions', () => {
  for (const [before, after] of [
    ["setGAValue('1/1/|2 old description', true, '1.001');", `${kitchenComment}\nsetGAValue('1/1/1', true, '1.001');`],
    ['await getGAValue(\n  "cuc|ina", false);', `${kitchenComment}\nawait getGAValue(\n  "1/1/1", false);`],
    ['setGAValue(|)', `${kitchenComment}\nsetGAValue('1/1/1')`],
    ["getGAValue('1/1/|", `${kitchenComment}\ngetGAValue('1/1/1'`],
    ['getGAValue(`1/1/|2`)', `${kitchenComment}\ngetGAValue(\`1/1/1\`)`],
    ['getGAValue(\n|)', `${kitchenComment}\ngetGAValue(\n'1/1/1')`],
    ['if (msg.payload) {\r\n\tsetGAValue("cuc|", true)\r\n}', `${kitchenComment}\r\nif (msg.payload) {\r\n\tsetGAValue("1/1/1", true)\r\n}`],
    [`${kitchenComment}\n  getGAValue('1/1/|1')`, `${kitchenComment}\n  getGAValue('1/1/1')`],
    ['// 2/0/1 Temperatura cucina\nif (msg.payload) {\n  setGAValue("cuc|", true)\n}', `// 2/0/1 Temperatura cucina\n${kitchenComment}\nif (msg.payload) {\n  setGAValue("1/1/1", true)\n}`],
    ['// 1/1/1 Old ETS name\ngetGAValue("1/1/|1")', `${kitchenComment}\ngetGAValue("1/1/1")`]
  ]) {
    it(`adds the GA comment and preserves surrounding code in ${before}`, async () => {
      const f = monacoFixture(before)
      attach(f.editor, { monaco: f.monaco, loadGroupAddresses: async () => addresses, helperItems: [] })
      const result = await f.providers[0].provideCompletionItems(f.model, f.position)
      expect(f.model.getValue()).to.equal(before.replace('|', ''))
      expect(f.apply(result.suggestions[0])).to.equal(after)
    })
  }

  it('keeps line breaks in ETS names inside the generated comment', async () => {
    const f = monacoFixture("setGAValue('|', true);")
    attach(f.editor, {
      monaco: f.monaco,
      loadGroupAddresses: async () => [{ ga: '0/0/1', devicename: '(Attuatori luci->Luci primo piano)\r\nLuce camera da letto\u2028return null;', dpt: '1.001' }],
      helperItems: []
    })
    const result = await f.providers[0].provideCompletionItems(f.model, f.position)
    expect(f.apply(result.suggestions[0])).to.equal("// 0/0/1 (Attuatori luci->Luci primo piano) Luce camera da letto return null;\nsetGAValue('0/0/1', true);")
  })

  it('isolates completions per editor and disposes registrations on dialog close', async () => {
    const f = monacoFixture("getGAValue('1/|')")
    const registration = attach(f.editor, { monaco: f.monaco, loadGroupAddresses: async () => addresses, helperItems: [] })
    expect((await f.providers[0].provideCompletionItems({}, f.position)).suggestions).to.deep.equal([])
    expect((await f.providers[0].provideCompletionItems(f.model, f.position, {}, { isCancellationRequested: true })).suggestions).to.deep.equal([])
    registration.dispose()
    expect(f.providers).to.have.length(0)
  })

  it('reads the currently selected gateway data for each completion request', async () => {
    const f = monacoFixture("getGAValue('|')")
    let currentAddresses = addresses
    attach(f.editor, { monaco: f.monaco, loadGroupAddresses: async () => currentAddresses, helperItems: [] })
    expect((await f.providers[0].provideCompletionItems(f.model, f.position)).suggestions).to.have.length(3)
    currentAddresses = [{ ga: '4/5/6', devicename: 'Other gateway', dpt: '1.001' }]
    const result = await f.providers[0].provideCompletionItems(f.model, f.position)
    expect(result.suggestions).to.have.length(1)
    expect(f.apply(result.suggestions[0])).to.equal("// 4/5/6 Other gateway\ngetGAValue('4/5/6')")
  })
})

describe('KNX Function Ace completions', () => {
  it('inserts one full ETS comment, preserves other arguments and leaves the cursor on the code line', async () => {
    let { source, offset } = marked('setGAValue("cuc|ina old description", true, "1.001")')
    const sharedCompleters = []
    const positionToIndex = position => source.split('\n').slice(0, position.row).reduce((sum, line) => sum + line.length + 1, 0) + position.column
    const indexToPosition = index => {
      const lines = source.slice(0, index).split('\n')
      return { row: lines.length - 1, column: lines[lines.length - 1].length }
    }
    const session = {
      getValue: () => source,
      getDocument: () => ({
        positionToIndex,
        indexToPosition
      }),
      replace: (range, text) => { source = source.slice(0, positionToIndex(range.start)) + text + source.slice(positionToIndex(range.end)) }
    }
    const editor = {
      session,
      completers: sharedCompleters,
      commands: { on () {}, off () {} },
      getCursorPosition: () => indexToPosition(offset),
      clearSelection () {},
      moveCursorToPosition: position => { offset = positionToIndex(position) }
    }
    const ace = {
      require: () => ({
        Range: class {
          constructor (row, column, endRow, endColumn) {
            this.start = { row, column }
            this.end = { row: endRow, column: endColumn }
          }
        }
      })
    }
    const registration = attach(editor, { ace, loadGroupAddresses: async () => addresses, helperItems: [] })
    expect(sharedCompleters).to.have.length(0)
    const completer = editor.completers[1]
    const suggestions = await new Promise(resolve => completer.getCompletions(editor, session, editor.getCursorPosition(), 'cuc', (_error, items) => resolve(items)))
    // Older Ace versions require each result to explicitly reference its custom insertion handler.
    suggestions[0].completer.insertMatch(editor, suggestions[0])
    expect(source).to.equal(`${kitchenComment}\nsetGAValue("1/1/1", true, "1.001")`)
    expect(editor.getCursorPosition()).to.deep.equal({ row: 1, column: 17 })
    completer.insertMatch(editor, suggestions[0])
    expect(source).to.equal(`${kitchenComment}\nsetGAValue("1/1/1", true, "1.001")`)
    registration.dispose()
    expect(editor.completers).to.have.length(0)
  })
})

describe('KNX Function GA comment cleanup on Done', () => {
  const header = `${kitchenComment}\n// 1/1/2 Luce soggiorno\n// 2/0/1 Temperatura cucina\n`

  it('keeps addresses used directly or through variables and removes unused ones', () => {
    const body = 'const statusGA = "1/1/1";\nmsg.payload = await getGAValue(statusGA);\nsetGAValue("2/0/1 Temperatura cucina", 20);\nreturn msg;'
    expect(pruneUnusedGaComments(header + body)).to.equal(`${kitchenComment}\n// 2/0/1 Temperatura cucina\n${body}`)
  })

  it('ignores addresses used only in line comments or block comments', () => {
    const body = '// getGAValue("1/1/1");\n/* setGAValue("1/1/2", true); */\nreturn msg;'
    expect(pruneUnusedGaComments(header + body)).to.equal(body)
  })

  it('matches complete addresses without confusing longer addresses or longer paths', () => {
    const body = 'setGAValue("1/1/10", true);\nconst path = "2/0/1/2";\ngetGAValue("11/1/2");'
    expect(pruneUnusedGaComments(header + body)).to.equal(body)
  })

  it('preserves strings containing comment delimiters, template literals and escaped slashes', () => {
    const body = 'const url = "https://example.test";\ngetGAValue(`1/1/1`);\nsetGAValue("1\\/1\\/2", true);'
    expect(pruneUnusedGaComments(header + body)).to.equal(`${kitchenComment}\n// 1/1/2 Luce soggiorno\n${body}`)
  })

  it('preserves code, user comments and CRLF endings while removing duplicate header entries', () => {
    const body = '// A user comment\r\nif (msg.payload) {\r\n  getGAValue("1/1/1");\r\n}\r\n'
    expect(pruneUnusedGaComments(`${kitchenComment}\r\n${kitchenComment}\r\n// 1/1/2 Luce soggiorno\r\n${body}`)).to.equal(`${kitchenComment}\r\n${body}`)
    expect(pruneUnusedGaComments(body)).to.equal(body)
    expect(pruneUnusedGaComments(header)).to.equal('')
  })

  it('cleans both editors independently before saving their code', () => {
    const html = fs.readFileSync(path.join(__dirname, '../nodes/knxUltimate.html'), 'utf8')
    const script = html.match(/<script type="text\/javascript">([\s\S]*?)<\/script>/)[1]
    let definition
    vm.runInNewContext(script, {
      RED: { nodes: { registerType: (_type, config) => { definition = config } }, sidebar: { show () {} } },
      window: { KNXUltimateFunctionAutocomplete: { pruneUnusedGaComments } },
      $: () => ({ val: () => '' })
    })
    const input = 'setGAValue("1/1/1", true);\nreturn msg;'
    const output = 'msg.payload = await getGAValue("2/0/1");\nreturn msg;'
    let disposed = false
    const node = {
      sendMsgToKNXCodeEditor: { getValue: () => header + input },
      receiveMsgFromKNXCodeEditor: { getValue: () => header + output },
      disposeKnxFunctionEditors: () => { disposed = true }
    }
    definition.oneditsave.call(node)
    expect(node.sendMsgToKNXCode).to.equal(`${kitchenComment}\n${input}`)
    expect(node.receiveMsgFromKNXCode).to.equal(`// 2/0/1 Temperatura cucina\n${output}`)
    expect(disposed).to.equal(true)
  })
})
