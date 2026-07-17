const fs = require('fs/promises')
const path = require('path')

const BACKUP_FORMAT = 'knx-ultimate-matter-storage'
const BACKUP_VERSION = 1
const MAX_BACKUP_BYTES = 64 * 1024 * 1024

const instancePath = (storagePath, instanceId) => path.join(storagePath, instanceId)

const listFiles = async (root, current = root) => {
  const entries = await fs.readdir(current, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (entry.isSymbolicLink()) throw new Error('Matter storage contains an unsupported symbolic link')
    const absolute = path.join(current, entry.name)
    if (entry.isDirectory()) files.push(...await listFiles(root, absolute))
    else if (entry.isFile()) files.push(path.relative(root, absolute).split(path.sep).join('/'))
  }
  return files.sort()
}

const exportMatterStorage = async ({ storagePath, instanceId, kind, protocolVersion, packageVersion }) => {
  const root = instancePath(storagePath, instanceId)
  let names
  try {
    names = await listFiles(root)
  } catch (error) {
    if (error.code === 'ENOENT') names = []
    else throw error
  }
  const files = []
  let totalBytes = 0
  for (const name of names) {
    const content = await fs.readFile(path.join(root, ...name.split('/')))
    totalBytes += content.length
    if (totalBytes > MAX_BACKUP_BYTES) throw new Error('Matter backup exceeds the 64 MB safety limit')
    files.push({ path: name, content: content.toString('base64') })
  }
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    kind,
    createdAt: new Date().toISOString(),
    sourceInstanceId: instanceId,
    matterProtocolVersion: protocolVersion,
    matterPackageVersion: packageVersion,
    files
  }
}

const validateRelativePath = (name) => {
  if (typeof name !== 'string' || name === '' || name.includes('\\')) return false
  const normalized = path.posix.normalize(name)
  return normalized === name && !path.posix.isAbsolute(name) && name !== '..' && !name.startsWith('../')
}

const importMatterStorage = async ({ storagePath, instanceId, kind, backup }) => {
  if (!backup || backup.format !== BACKUP_FORMAT || backup.version !== BACKUP_VERSION) throw new Error('Unsupported Matter backup file')
  if (backup.kind !== kind) throw new Error(`This is a Matter ${backup.kind || 'unknown'} backup, not a ${kind} backup`)
  if (!Array.isArray(backup.files)) throw new Error('Invalid Matter backup: files are missing')

  const decoded = []
  const seen = new Set()
  let totalBytes = 0
  for (const file of backup.files) {
    if (!file || !validateRelativePath(file.path) || seen.has(file.path) || typeof file.content !== 'string') throw new Error('Invalid Matter backup file entry')
    const content = Buffer.from(file.content, 'base64')
    totalBytes += content.length
    if (totalBytes > MAX_BACKUP_BYTES) throw new Error('Matter backup exceeds the 64 MB safety limit')
    seen.add(file.path)
    decoded.push({ path: file.path, content })
  }

  await fs.mkdir(storagePath, { recursive: true })
  const target = instancePath(storagePath, instanceId)
  const temporary = `${target}.import-${process.pid}-${Date.now()}`
  const previous = `${target}.previous-${process.pid}-${Date.now()}`
  await fs.mkdir(temporary, { recursive: true })
  try {
    for (const file of decoded) {
      const destination = path.join(temporary, ...file.path.split('/'))
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.writeFile(destination, file.content, { mode: 0o600 })
    }
    let hadTarget = true
    try { await fs.rename(target, previous) } catch (error) { if (error.code === 'ENOENT') hadTarget = false; else throw error }
    try {
      await fs.rename(temporary, target)
    } catch (error) {
      if (hadTarget) await fs.rename(previous, target)
      throw error
    }
    if (hadTarget) await fs.rm(previous, { recursive: true, force: true })
  } catch (error) {
    await fs.rm(temporary, { recursive: true, force: true })
    throw error
  }
}

module.exports = { exportMatterStorage, importMatterStorage, BACKUP_FORMAT, BACKUP_VERSION, MAX_BACKUP_BYTES }
