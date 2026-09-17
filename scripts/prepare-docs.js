#!/usr/bin/env node
'use strict'

// Copy the maintained examples so the documentation downloads match the package.
const fs = require('fs')
const path = require('path')
const root = path.join(__dirname, '..')
const source = path.join(root, 'examples')
const destination = path.join(root, 'docs', 'examples')
fs.mkdirSync(destination, { recursive: true })
const names = fs.readdirSync(source).filter(name => name.endsWith('.json'))
for (const name of fs.readdirSync(destination)) {
  if (name.endsWith('.json') && !names.includes(name)) fs.unlinkSync(path.join(destination, name))
}
for (const name of names) fs.copyFileSync(path.join(source, name), path.join(destination, name))
console.log(`Prepared ${names.length} downloadable examples.`)
