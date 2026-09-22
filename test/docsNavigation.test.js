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

  it('links the version 8 migration video from package and localized documentation', () => {
    const projectRoot = path.join(__dirname, '..')
    const videoUrl = 'https://youtu.be/fpNNi1jZZSc'
    const migrationPages = [
      'README.md',
      'MIGRATION.md',
      'docs/wiki/Migration-8.md',
      'docs/wiki/it-Migration-8.md',
      'docs/wiki/de-Migration-8.md',
      'docs/wiki/fr-Migration-8.md',
      'docs/wiki/es-Migration-8.md',
      'docs/wiki/zh-CN-Migration-8.md'
    ]

    for (const file of migrationPages) {
      const content = fs.readFileSync(path.join(projectRoot, file), 'utf8')
      expect(content, file).to.include(videoUrl)
    }

    const homepageTemplate = fs.readFileSync(
      path.join(projectRoot, 'docs', '_includes', 'homepage', 'content.html'),
      'utf8'
    )
    expect(homepageTemplate).to.include(videoUrl)
    expect(homepageTemplate).to.include('t.migrationVideo')

    const homepageCopy = JSON.parse(fs.readFileSync(
      path.join(projectRoot, 'docs', '_data', 'knx8.json'),
      'utf8'
    ))
    for (const [language, copy] of Object.entries(homepageCopy)) {
      expect(copy.migrationVideo, `${language} migration video label`).to.be.a('string').and.not.equal('')
    }
  })
})
