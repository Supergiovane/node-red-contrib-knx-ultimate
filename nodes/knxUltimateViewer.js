const fs = require('fs')
const path = require('path')
const KNXAddress = require('knxultimate').KNXAddress
const _ = require('lodash')
const { getRequestAccessToken, normalizeAuthFromAccessTokenQuery } = require('./utils/httpAdminAccessToken')

let viewerAdminEndpointsRegistered = false
const viewerRuntimeNodes = new Map()
const knxUltimateViewerVueDistDir = path.join(__dirname, 'plugins', 'knxUltimateViewer-vue')

const sendKnxUltimateViewerVueIndex = (req, res) => {
  const entryPath = path.join(knxUltimateViewerVueDistDir, 'index.html')
  fs.readFile(entryPath, 'utf8', (error, html) => {
    if (error || typeof html !== 'string') {
      res.status(503).type('text/plain').send('KNX Viewer Vue build not found. Run "npm run knx-viewer:build" in the module root.')
      return
    }
    const rawToken = getRequestAccessToken(req)
    if (!rawToken) {
      res.type('text/html').send(html)
      return
    }
    const encodedToken = encodeURIComponent(rawToken)
    const htmlWithToken = html
      .replace('./assets/app.js', `./assets/app.js?access_token=${encodedToken}`)
      .replace('./assets/app.css', `./assets/app.css?access_token=${encodedToken}`)
    res.type('text/html').send(htmlWithToken)
  })
}

const sendStaticFileSafe = ({ rootDir, relativePath, res }) => {
  const rootPath = path.resolve(rootDir)
  const requestedPath = String(relativePath || '').replace(/^\/+/, '')
  const fullPath = path.resolve(rootPath, requestedPath)
  if (!fullPath.startsWith(rootPath + path.sep) && fullPath !== rootPath) {
    res.status(403).type('text/plain').send('Forbidden')
    return
  }
  fs.stat(fullPath, (statError, stats) => {
    if (statError || !stats || !stats.isFile()) {
      res.status(404).type('text/plain').send('File not found')
      return
    }
    res.sendFile(fullPath, (sendError) => {
      if (!sendError || res.headersSent) return
      res.status(sendError.statusCode || 500).type('text/plain').send(sendError.message || String(sendError))
    })
  })
}

const normalizeDpt = (value) => String(value || '').trim().toUpperCase()

const isBooleanLikeDpt = (value) => {
  const dpt = normalizeDpt(value)
  return dpt === '1' || dpt.startsWith('1.') || dpt.includes('DPT-1') || dpt.includes('DPST-1-')
}

const isDimmerLikeDpt = (value) => {
  const dpt = normalizeDpt(value)
  return dpt === '5.001' || dpt.includes('5.001') || dpt.includes('DPST-5-1') || dpt.includes('DPT-5')
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const normalizePayloadText = (value) => {
  if (value === undefined || value === null) return ''
  if (Buffer.isBuffer(value)) return value.toString('hex')
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (error) {
      return String(value)
    }
  }
  return String(value)
}

const sortViewerEntries = (a, b) => {
  if (a.addressRAW !== undefined && b.addressRAW !== undefined) {
    return a.addressRAW > b.addressRAW ? 1 : -1
  }
  return a.addressRAW !== undefined ? 1 : -1
}

const classifyViewerEntry = (entry) => {
  const payloadNumber = Number(entry && entry.payload)
  const numericPayload = Number.isFinite(payloadNumber) ? clamp(payloadNumber, 0, 100) : null
  const dpt = String(entry && entry.dpt ? entry.dpt : '').trim()
  const isBooleanPayload = typeof (entry && entry.payload) === 'boolean'

  if (isBooleanPayload || isBooleanLikeDpt(dpt)) {
    return {
      kind: 'light',
      isOn: entry && entry.payload === true,
      level: entry && entry.payload === true ? 100 : 0
    }
  }

  if (numericPayload !== null && isDimmerLikeDpt(dpt)) {
    return {
      kind: 'dimmer',
      isOn: numericPayload > 0,
      level: Math.round(numericPayload)
    }
  }

  return {
    kind: 'other',
    isOn: false,
    level: null
  }
}

const buildViewerWebState = (node) => {
  const entries = Array.isArray(node && node.exposedGAs) ? node.exposedGAs.slice().sort(sortViewerEntries) : []
  const items = entries.map((entry) => {
    const classification = classifyViewerEntry(entry)
    const lastUpdateMs = entry && entry.lastupdate ? new Date(entry.lastupdate).getTime() : 0
    return {
      address: String(entry && entry.address ? entry.address : '').trim(),
      addressRAW: Number(entry && entry.addressRAW ? entry.addressRAW : 0),
      dpt: String(entry && entry.dpt ? entry.dpt : '').trim(),
      payload: entry ? entry.payload : undefined,
      payloadText: normalizePayloadText(entry ? entry.payload : ''),
      devicename: String(entry && entry.devicename ? entry.devicename : '').trim(),
      lastUpdate: entry && entry.lastupdate ? new Date(entry.lastupdate).toISOString() : '',
      lastUpdateMs: Number.isFinite(lastUpdateMs) ? lastUpdateMs : 0,
      rawPayload: String(entry && entry.rawPayload ? entry.rawPayload : '').trim(),
      payloadmeasureunit: String(entry && entry.payloadmeasureunit ? entry.payloadmeasureunit : '').trim(),
      kind: classification.kind,
      isOn: classification.isOn,
      level: classification.level
    }
  })

  const lights = items.filter(item => item.kind === 'light')
  const dimmers = items.filter(item => item.kind === 'dimmer')
  const others = items.filter(item => item.kind === 'other')
  const lastUpdateMs = Math.max(...items.map(item => Number(item.lastUpdateMs || 0)), 0)

  return {
    node: {
      id: node.id,
      name: node.name || 'KNXViewer',
      gatewayId: node.serverKNX ? node.serverKNX.id : '',
      gatewayName: (node.serverKNX && node.serverKNX.name) ? node.serverKNX.name : ''
    },
    summary: {
      totalItems: items.length,
      lightCount: lights.length,
      dimmerCount: dimmers.length,
      otherCount: others.length,
      lightOnCount: lights.filter(item => item.isOn).length,
      lightOffCount: lights.filter(item => !item.isOn).length,
      dimmerActiveCount: dimmers.filter(item => Number(item.level || 0) > 0).length,
      averageDimmerLevel: dimmers.length
        ? Math.round(dimmers.reduce((acc, item) => acc + Number(item.level || 0), 0) / dimmers.length)
        : 0,
      lastUpdate: lastUpdateMs > 0 ? new Date(lastUpdateMs).toISOString() : ''
    },
    items
  }
}

module.exports = function (RED) {
  if (!viewerAdminEndpointsRegistered) {
    RED.httpAdmin.use('/knxUltimateViewer', normalizeAuthFromAccessTokenQuery)

    RED.httpAdmin.get('/knxUltimateViewer/page', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      sendKnxUltimateViewerVueIndex(req, res)
    })

    RED.httpAdmin.get('/knxUltimateViewer/page/assets/:file', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      sendStaticFileSafe({
        rootDir: path.join(knxUltimateViewerVueDistDir, 'assets'),
        relativePath: req.params.file,
        res
      })
    })

    // Alias for relative asset URLs resolved from ".../page?nodeId=..."
    // which become ".../assets/<file>" in browsers.
    RED.httpAdmin.get('/knxUltimateViewer/assets/:file', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      sendStaticFileSafe({
        rootDir: path.join(knxUltimateViewerVueDistDir, 'assets'),
        relativePath: req.params.file,
        res
      })
    })

    RED.httpAdmin.get('/knxUltimateViewer/nodes', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      try {
        const nodes = Array.from(viewerRuntimeNodes.values())
          .map((node) => ({
            id: node.id,
            name: node.name || 'KNXViewer',
            gatewayId: node.serverKNX ? node.serverKNX.id : '',
            gatewayName: (node.serverKNX && node.serverKNX.name) ? node.serverKNX.name : ''
          }))
          .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
        res.json({ nodes })
      } catch (error) {
        res.status(500).json({ error: error.message || String(error) })
      }
    })

    RED.httpAdmin.get('/knxUltimateViewer/state', RED.auth.needsPermission('knxUltimate-config.read'), (req, res) => {
      try {
        const nodeId = String(req.query.nodeId || '').trim()
        let viewerNode = nodeId ? viewerRuntimeNodes.get(nodeId) : null
        if (!viewerNode) {
          viewerNode = Array.from(viewerRuntimeNodes.values())[0]
        }
        if (!viewerNode) {
          res.status(404).json({ error: 'KNX Viewer node not found' })
          return
        }
        res.json(buildViewerWebState(viewerNode))
      } catch (error) {
        res.status(500).json({ error: error.message || String(error) })
      }
    })

    viewerAdminEndpointsRegistered = true
  }

  function knxUltimateViewer (config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    const pushStatus = (status) => {
      if (!status) return
      const provider = node.serverKNX
      if (provider && typeof provider.applyStatusUpdate === 'function') {
        provider.applyStatusUpdate(node, status)
      } else {
        node.status(status)
      }
    }

    const updateStatus = (status) => {
      if (!status) return
      pushStatus(status)
    }

    if (node.serverKNX === undefined) {
      updateStatus({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' })
      return
    }
    node.topic = node.name
    node.name = config.name === undefined ? 'KNXViewer' : config.name
    node.outputtopic = node.name
    node.dpt = ''
    node.notifyreadrequest = false
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyresponse = true
    node.notifywrite = true
    node.initialread = false
    node.listenallga = true
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.currentPayload = ''
    node.passthrough = 'no'
    node.formatmultiplyvalue = 1
    node.formatnegativevalue = 'leave'
    node.formatdecimalsvalue = 2
    node.timerPIN3 = null
    node.exposedGAs = []

    viewerRuntimeNodes.set(node.id, node)

    node.setNodeStatus = ({ fill, shape, text, payload, GA }) => {
      try {
        if (node.serverKNX === null) { updateStatus({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }
        const gaValue = GA === undefined ? '' : GA
        let payloadValue = payload === undefined ? '' : payload
        payloadValue = typeof payloadValue === 'object' ? JSON.stringify(payloadValue) : payloadValue
        const dDate = new Date()
        const ts = (node.serverKNX && typeof node.serverKNX.formatStatusTimestamp === 'function')
          ? node.serverKNX.formatStatusTimestamp(dDate)
          : `${dDate.getDate()}, ${dDate.toLocaleTimeString()}`
        updateStatus({ fill, shape, text: gaValue + ' ' + payloadValue + ' ' + text + ' (' + ts + ')' })
      } catch (error) { /* empty */ }
    }

    node.handleSend = (msg) => {
      let gaEntry
      try {
        gaEntry = node.exposedGAs.find(ga => ga.address === msg.knx.destination)
      } catch (error) {
      }
      const deviceName = msg.devicename === node.name ? 'Import ETS file to view the group address name' : msg.devicename
      const addressRAW = KNXAddress.createFromString(msg.knx.destination, KNXAddress.TYPE_GROUP).get()
      if (gaEntry === undefined) {
        node.exposedGAs.push({
          address: msg.knx.destination,
          addressRAW,
          dpt: msg.knx.dpt,
          payload: msg.payload,
          devicename: deviceName,
          lastupdate: new Date(),
          rawPayload: 'HEX Raw: ' + msg.knx.rawValue.toString('hex') || '?',
          payloadmeasureunit: (msg.payloadmeasureunit !== 'unknown' ? ' ' + msg.payloadmeasureunit : '')
        })
      } else {
        gaEntry.dpt = msg.knx.dpt
        gaEntry.payload = msg.payload
        gaEntry.devicename = deviceName
        gaEntry.lastupdate = new Date()
        gaEntry.rawPayload = 'HEX Raw: ' + msg.knx.rawValue.toString('hex') || '?'
        gaEntry.payloadmeasureunit = (msg.payloadmeasureunit !== 'unknown' ? ' ' + msg.payloadmeasureunit : '')
      }

      const pin1 = node.createPayloadPIN1()
      const pin2 = node.createPayloadPIN2()
      const pin3 = node.createPayloadPIN3()
      node.send([pin1, pin2, pin3])
    }

    node.createPayloadPIN1 = () => {
      const sorted = node.exposedGAs.sort(sortViewerEntries)
      let payload = ''

      const head = `<div class="main"><table><caption>Current received KNX Group address values</caption>
            <thead>
              <tr>
                <th> GA </th>
                <th> Value </th>
                <th> DPT </th>
                <th> Last updated </th>
                <th> Group Address Name </th>
              </tr>
            </thead>
            <tbody>`
      const footer = `</tbody><tfoot>
            <tr>
              <th scope="row">Count</th>
              <td>` + sorted.length + `</td>
            </tr>
          </tfoot>
          </table></div>`

      try {
        for (let index = 0; index < sorted.length; index++) {
          const element = sorted[index]
          payload += '<tr><td>' + element.address + '</td>'
          if (typeof element.payload === 'boolean' && element.payload === true) {
            payload += '<td><b><font color=green>True</font></b></td>'
          } else if (typeof element.payload === 'boolean' && element.payload === false) {
            payload += '<td><font color=red>False</font></td>'
          } else if (typeof element.payload === 'object' && !isNaN(Date.parse(element.payload))) {
            payload += '<td>' + element.payload.toLocaleString() + '</td>'
          } else if (typeof element.payload === 'object') {
            try {
              payload += '<td><i>' + element.rawPayload + '</i></td>'
            } catch (error) {
              payload += '<td>' + element.payload + '</td>'
            }
          } else {
            payload += '<td>' + element.payload + element.payloadmeasureunit + '</td>'
          }
          payload += '<td>' + element.dpt + '</td>'
          payload += '<td>' + element.lastupdate.toLocaleString() + '</td>'
          payload += '<td><font style="font-size: smaller;">' + element.devicename + '</font></td></tr>'
        }
      } catch (error) {
      }
      return { topic: node.name, payload: head + payload + footer }
    }

    node.createPayloadPIN2 = () => {
      return { topic: node.name, payload: node.exposedGAs }
    }

    node.createPayloadPIN3 = () => {
      let head = ''
      let footer = ''
      let payload = ''
      try {
        const items = _.clone(node.serverKNX.knxConnection.commandQueue)
        if (items === undefined) return

        head = `<div class="main"><table><caption>Queue of outgoing telegrams to the KNX BUS. The more the count,</br>the more congested is the KNX BUS.</caption>
            <thead>
              <tr>
                <th> Channel ID </th>
                <th> Sequence counter </th>
                <th> Type of packet</th>
                <th> Status </th>
              </tr>
            </thead>
            <tbody>`
        footer = `</tbody><tfoot>
              <tr>
                <th scope="row">Count</th>
                <td>` + items.length + `</td>
              </tr>
            </tfoot>
            </table></div>`

        for (let index = 0; index < items.length; index++) {
          const element = items[index]
          payload += '<tr><td>' + element.knxPacket.channelID + '</td>'
          payload += '<td><b><font color=green>' + element.knxPacket.seqCounter + '</font></b></td>'
          payload += '<td>' + element.knxPacket.type + '</td>'
          payload += '<td>' + element.knxPacket.status + '</td></tr>'
        }
      } catch (error) {
      }
      return { topic: node.name, payload: head + payload + footer }
    }

    node.on('input', function () {
    })

    node.on('close', function (done) {
      if (node.timerPIN3 !== null) clearInterval(node.timerPIN3)
      viewerRuntimeNodes.delete(node.id)
      if (node.serverKNX) {
        node.serverKNX.removeClient(node)
      }
      done()
    })

    if (node.serverKNX) {
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
    }
  }

  RED.nodes.registerType('knxUltimateViewer', knxUltimateViewer)
}
