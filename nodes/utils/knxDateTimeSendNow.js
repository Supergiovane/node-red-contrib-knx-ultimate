'use strict'

const registeredRuntimes = new WeakMap()

module.exports = function registerSendNowEndpoint (RED, kind = 'legacy') {
  const route = kind === 'utility' ? '/knxUltimateUtility/sendNow' : '/knxUltimateDateTime/sendNow'
  const permission = kind === 'utility' ? 'knxUltimateUtility.write' : 'knxUltimate-config.write'
  let registeredRoutes = registeredRuntimes.get(RED)
  if (!registeredRoutes) {
    registeredRoutes = new Set()
    registeredRuntimes.set(RED, registeredRoutes)
  }
  if (registeredRoutes.has(route)) return
  RED.httpAdmin.post(route, RED.auth.needsPermission(permission), (req, res) => {
    try {
      const { id } = req.body || {}
      if (!id) return res.status(400).json({ error: 'Missing node id' })
      const targetNode = RED.nodes.getNode(id)
      if (!targetNode) return res.status(404).json({ error: 'KNX DateTime node not found' })
      if (typeof targetNode.triggerSend !== 'function') {
        return res.status(400).json({ error: 'Node does not support sendNow' })
      }
      const result = targetNode.triggerSend({ reason: 'button' })
      res.json({ status: 'ok', queued: result && result.queued === true })
    } catch (error) {
      res.status(500).json({ error: error.message || 'KNX DateTime send failed' })
    }
  })
  registeredRoutes.add(route)
}
