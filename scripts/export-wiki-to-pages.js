#!/usr/bin/env node
/**
 * Synchronise the GitHub wiki into the docs/wiki folder so it can be published
 * via GitHub Pages. The script rewrites absolute wiki URLs to point to the
 * generated site while keeping the original structure intact.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const WIKI_DIR = path.resolve(ROOT, '..', 'node-red-contrib-knx-ultimate.wiki')
const DOCS_DIR = path.join(ROOT, 'docs')
const TARGET_DIR = path.join(DOCS_DIR, 'wiki')
const PAGES_BASE = '/node-red-contrib-knx-ultimate/wiki/'

if (!fs.existsSync(WIKI_DIR)) {
  console.error('Wiki repository not found:', WIKI_DIR)
  process.exit(1)
}

function ensureDir (dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function cleanDir (dir) {
  if (fs.existsSync(dir)) {
    for (const entry of fs.readdirSync(dir)) {
      const entryPath = path.join(dir, entry)
      const stat = fs.statSync(entryPath)
      if (stat.isDirectory()) {
        cleanDir(entryPath)
        fs.rmdirSync(entryPath)
      } else {
        fs.unlinkSync(entryPath)
      }
    }
  } else {
    ensureDir(dir)
  }
}

function rewriteLinks (content) {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/https:\/\/github\.com\/supergiovane\/node-red-contrib-knx-ultimate\/wiki\//gi, PAGES_BASE)
}

function copyRecursive (src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    ensureDir(dest)
    for (const entry of fs.readdirSync(src)) {
      if (entry === '.git') continue
      copyRecursive(path.join(src, entry), path.join(dest, entry))
    }
    return
  }

  if (src.endsWith('.md')) {
    const data = fs.readFileSync(src, 'utf8')
    fs.writeFileSync(dest, rewriteLinks(data), 'utf8')
  } else {
    fs.copyFileSync(src, dest)
  }
}

ensureDir(DOCS_DIR)
cleanDir(TARGET_DIR)
copyRecursive(WIKI_DIR, TARGET_DIR)
console.log('Wiki exported to', TARGET_DIR)
