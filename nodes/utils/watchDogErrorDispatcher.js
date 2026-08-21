module.exports = function dispatchWatchDogNodeError (configNode, nodeError) {
  const clients = Array.isArray(configNode && configNode.nodeClients) ? configNode.nodeClients : []

  clients
    .filter(client => client && client.isWatchDog === true && client.listenToKnxUltimateNodeErrors !== false && client.listenToKnxUltimateNodeErrors !== 'false')
    .forEach(client => {
      try {
        if (typeof client.signalNodeErrorCalledByConfigNode === 'function') {
          client.signalNodeErrorCalledByConfigNode(nodeError)
        }
      } catch (error) {
        try {
          configNode.sysLogger?.error(`Unable to report KNX-Ultimate node error to Watchdog ${client.id}: ${error.message || error}`)
        } catch {
          // Error reporting must not prevent delivery to the remaining Watchdogs.
        }
      }
    })
}
