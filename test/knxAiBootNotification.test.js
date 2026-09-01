const { expect } = require('chai')
const fs = require('fs')
const path = require('path')

const { getKnxAiBootFallbackCopy } = require('../nodes/knxUltimateAI').__test

describe('Cerebrum Ultimate startup assistant notification', () => {
  it('provides a Cerebrum fallback in every supported language', () => {
    const languages = ['en', 'it', 'de', 'fr', 'es', 'zh-CN']
    languages.forEach(language => {
      const message = getKnxAiBootFallbackCopy({ language })
      expect(message, language).to.be.a('string').with.length.greaterThan(40)
      expect(message, language).to.include('Cerebrum')
      expect(message, language).to.match(/\.$/)
    })
  })

  it('keeps fallback diagnostics short and on one line', () => {
    const message = getKnxAiBootFallbackCopy({
      language: 'it',
      reason: ` provider\n unavailable ${'x'.repeat(500)} `
    })
    expect(message).not.to.include('\n')
    expect(message.length).to.be.lessThan(500)
    expect(message).to.include('provider unavailable')
  })

  it('wires the generated message only to the assistant output with the boot marker', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'nodes', 'knxUltimateAI.js'), 'utf8')
    expect(source).to.include("name: 'knx_ai_boot_notification'")
    expect(source).to.include('replyMessage.boot = true')
    expect(source).to.include('message.boot === true')
    expect(source).to.include('sendKnxAiOutputs([null, null, replyMessage, null, null], syntheticInputMessage)')
    expect(source).to.include('if (node._bootAssistantTimer) clearTimeout(node._bootAssistantTimer)')
    expect(source).to.include("llmTest = 'passed'")
  })
})
