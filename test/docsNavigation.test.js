const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const yaml = require('js-yaml')

describe('documentation language navigation', () => {
  it('links every language homepage to its published permalink', () => {
    const projectRoot = path.join(__dirname, '..')
    const languages = yaml.load(fs.readFileSync(
      path.join(projectRoot, 'docs', '_data', 'languages.yml'),
      'utf8'
    ))

    for (const [language, info] of Object.entries(languages)) {
      expect(info.homepage, `${language} homepage must not use a trailing slash`)
        .not.to.match(/\/$/)

      const prefix = info.prefix || ''
      const pagePath = path.join(projectRoot, 'docs', 'wiki', `${prefix}Home.md`)
      const page = fs.readFileSync(pagePath, 'utf8')
      const frontMatterMatch = page.match(/^---\n([\s\S]*?)\n---/)

      expect(frontMatterMatch, `${language} homepage front matter`).not.to.equal(null)
      const frontMatter = yaml.load(frontMatterMatch[1])
      expect(info.homepage, `${language} homepage URL`).to.equal(frontMatter.permalink)
    }
  })
})
