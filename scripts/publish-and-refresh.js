#!/usr/bin/env node
'use strict'

const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const flowLibraryOrigin = 'https://flows.nodered.org'
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const colours = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
}

const log = {
  step: (message) => console.log(`${colours.cyan}▶${colours.reset} ${message}`),
  ok: (message) => console.log(`${colours.green}✔${colours.reset} ${message}`),
  warn: (message) => console.warn(`${colours.yellow}⚠${colours.reset} ${message}`),
  fail: (message) => console.error(`${colours.red}✖${colours.reset} ${message}`)
}

const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))

function parseArgs (argv) {
  const options = {
    allowDirty: false,
    dryRun: false,
    help: false,
    refreshOnly: false,
    skipTests: false,
    tag: null
  }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--allow-dirty') {
      options.allowDirty = true
    } else if (argument === '--dry-run') {
      options.dryRun = true
    } else if (argument === '--help' || argument === '-h') {
      options.help = true
    } else if (argument === '--refresh-only') {
      options.refreshOnly = true
    } else if (argument === '--skip-tests') {
      options.skipTests = true
    } else if (argument === '--tag') {
      index += 1
      if (!argv[index] || argv[index].startsWith('-')) {
        throw new Error('--tag requires a value')
      }
      options.tag = argv[index]
    } else {
      throw new Error(`Unknown option: ${argument}`)
    }
  }

  if (options.dryRun && options.refreshOnly) {
    throw new Error('--dry-run and --refresh-only cannot be used together')
  }

  return options
}

function defaultDistTag (version) {
  return version.includes('-') ? 'beta' : 'latest'
}

function extractCsrfToken (html) {
  const inputs = String(html || '').match(/<input\b[^>]*>/gi) || []
  const csrfInput = inputs.find(input => /\bname=["']_csrf["']/i.test(input))
  if (!csrfInput) return null
  const value = /\bvalue=["']([^"']+)["']/i.exec(csrfInput)
  return value ? value[1] : null
}

function cookieHeaderFromResponse (response) {
  const headers = response && response.headers
  if (!headers) return ''

  let setCookies = []
  if (typeof headers.getSetCookie === 'function') {
    setCookies = headers.getSetCookie()
  } else if (typeof headers.get === 'function') {
    const singleHeader = headers.get('set-cookie')
    if (singleHeader) setCookies = [singleHeader]
  }

  return setCookies
    .map(value => String(value).split(';', 1)[0].trim())
    .filter(Boolean)
    .join('; ')
}

function flowPageHasVersion (html, packageName, version) {
  const normalized = String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
  return normalized.includes(`${packageName} ${version}`) &&
    normalized.includes(`Version: ${version}`)
}

function runCommand (command, args, options = {}) {
  const capture = options.capture === true
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit'
  })

  if (result.error) throw result.error
  if (result.status !== 0 && options.allowFailure !== true) {
    const details = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
    throw new Error(`${command} ${args.join(' ')} failed${details ? `:\n${details}` : ''}`)
  }
  return result
}

function assertCleanWorktree () {
  const result = runCommand('git', ['status', '--porcelain'], { capture: true })
  if (result.stdout.trim() !== '') {
    throw new Error('The Git worktree is not clean. Commit the release first or pass --allow-dirty explicitly.')
  }
}

function readPackage () {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'))
}

function readPublishedVersion (packageName, version) {
  const result = runCommand(npmCommand, ['view', `${packageName}@${version}`, 'version', '--json'], {
    allowFailure: true,
    capture: true
  })

  if (result.status !== 0) {
    const details = `${result.stdout || ''}\n${result.stderr || ''}`
    if (/\bE404\b|No match found for version/i.test(details)) return null
    throw new Error(`Unable to query npm for ${packageName}@${version}:\n${details.trim()}`)
  }

  try {
    return JSON.parse(result.stdout)
  } catch (error) {
    throw new Error(`npm returned an invalid version response for ${packageName}@${version}`)
  }
}

function readDistTags (packageName) {
  const result = runCommand(npmCommand, ['view', packageName, 'dist-tags', '--json'], { capture: true })
  try {
    return JSON.parse(result.stdout)
  } catch (error) {
    throw new Error(`npm returned invalid dist-tags for ${packageName}`)
  }
}

async function waitForPublishedVersion (packageName, version, attempts = 10, intervalMs = 2000) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const publishedVersion = readPublishedVersion(packageName, version)
    if (publishedVersion === version) return
    if (attempt < attempts) await delay(intervalMs)
  }
  throw new Error(`npm did not expose ${packageName}@${version} within the expected time`)
}

async function verifyFlowLibraryVersion ({ fetchImpl, packageName, version, attempts = 10, intervalMs = 2000 }) {
  const packageUrl = `${flowLibraryOrigin}/node/${encodeURIComponent(packageName)}`
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const separator = packageUrl.includes('?') ? '&' : '?'
    const response = await fetchImpl(`${packageUrl}${separator}_=${Date.now()}`, {
      headers: { 'user-agent': `${packageName}-release-script/${version}` },
      signal: AbortSignal.timeout(15000)
    })
    const html = await response.text()
    if (response.ok && flowPageHasVersion(html, packageName, version)) return packageUrl
    if (attempt < attempts) await delay(intervalMs)
  }
  throw new Error(`Flow Library did not expose ${packageName} ${version} within the expected time`)
}

async function refreshFlowLibrary ({ fetchImpl = fetch, packageName, version }) {
  const setupResponse = await fetchImpl(`${flowLibraryOrigin}/add/node`, {
    headers: { 'user-agent': `${packageName}-release-script/${version}` },
    redirect: 'manual',
    signal: AbortSignal.timeout(15000)
  })
  const setupHtml = await setupResponse.text()
  if (!setupResponse.ok) {
    throw new Error(`Unable to open the Flow Library update form: HTTP ${setupResponse.status}`)
  }

  const csrfToken = extractCsrfToken(setupHtml)
  const cookie = cookieHeaderFromResponse(setupResponse)
  if (!csrfToken || !cookie) {
    throw new Error('Flow Library did not provide the temporary CSRF session required for refresh')
  }

  const body = new URLSearchParams({
    _csrf: csrfToken,
    module: packageName
  })
  const refreshResponse = await fetchImpl(`${flowLibraryOrigin}/add/node`, {
    body,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      cookie,
      origin: flowLibraryOrigin,
      referer: `${flowLibraryOrigin}/add/node`,
      'user-agent': `${packageName}-release-script/${version}`
    },
    method: 'POST',
    redirect: 'manual',
    signal: AbortSignal.timeout(60000)
  })
  const refreshMessage = (await refreshResponse.text()).trim()
  const alreadyCurrent = refreshResponse.status === 400 && /already at latest version/i.test(refreshMessage)
  if (!refreshResponse.ok && !alreadyCurrent) {
    throw new Error(`Flow Library refresh failed (HTTP ${refreshResponse.status}): ${refreshMessage || 'empty response'}`)
  }

  const packageUrl = await verifyFlowLibraryVersion({ fetchImpl, packageName, version })
  return { alreadyCurrent, packageUrl, refreshMessage }
}

function printHelp () {
  console.log(`Publish the package to npm and refresh its Node-RED Flow Library entry.

Usage:
  npm run release:publish
  npm run release:publish -- --tag beta
  npm run release:publish -- --dry-run
  npm run release:refresh-flows

Options:
  --tag <name>     npm dist-tag (default: beta for prereleases, latest otherwise)
  --dry-run        run npm publish --dry-run and do not refresh flows.nodered.org
  --skip-tests     skip npm test before publishing
  --refresh-only   skip npm publish and only verify npm + refresh Flow Library
  --allow-dirty    allow publishing from a dirty Git worktree
  --help           show this help
`)
}

async function main () {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    printHelp()
    return
  }

  const pkg = readPackage()
  const packageName = pkg.name
  const version = pkg.version
  const tag = options.tag || defaultDistTag(version)

  if (version.includes('-') && tag === 'latest') {
    throw new Error('Refusing to publish a prerelease with the latest dist-tag. Use --tag beta.')
  }

  console.log(`\nRelease target: ${packageName}@${version} (${tag})\n`)

  if (!options.refreshOnly) {
    if (!options.allowDirty) assertCleanWorktree()

    if (!options.skipTests) {
      log.step('Running the complete test suite')
      runCommand(npmCommand, ['test'])
      log.ok('Tests passed')
      if (!options.allowDirty) assertCleanWorktree()
    }

    if (!options.dryRun && readPublishedVersion(packageName, version) !== null) {
      throw new Error(`${packageName}@${version} already exists on npm. Bump the version or use --refresh-only.`)
    }

    log.step(options.dryRun ? 'Simulating npm publication' : `Publishing to npm with dist-tag ${tag}`)
    const publishArgs = ['publish', '--tag', tag]
    if (options.dryRun) publishArgs.push('--dry-run')
    runCommand(npmCommand, publishArgs)
    log.ok(options.dryRun ? 'npm publication simulation completed' : 'npm publication completed')

    if (options.dryRun) return
  }

  log.step(`Verifying ${packageName}@${version} on npm`)
  await waitForPublishedVersion(packageName, version)
  const distTags = readDistTags(packageName)
  if (!options.refreshOnly && distTags[tag] !== version) {
    throw new Error(`npm dist-tag ${tag} points to ${distTags[tag] || 'nothing'}, expected ${version}`)
  }
  log.ok(`npm exposes ${packageName}@${version}`)

  log.step('Refreshing flows.nodered.org')
  const flowResult = await refreshFlowLibrary({ packageName, version })
  if (flowResult.alreadyCurrent) {
    log.warn('Flow Library was already at the latest npm version')
  }
  log.ok(`Flow Library exposes ${packageName} ${version}`)
  console.log(flowResult.packageUrl)
}

if (require.main === module) {
  main().catch(error => {
    log.fail(error && error.message ? error.message : String(error))
    process.exitCode = 1
  })
}

module.exports = {
  cookieHeaderFromResponse,
  defaultDistTag,
  extractCsrfToken,
  flowPageHasVersion,
  parseArgs,
  refreshFlowLibrary,
  verifyFlowLibraryVersion
}
