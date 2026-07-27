'use strict'

const COMMAND_TIMER_KEYS = [
  'timerBlink',
  'timerColorCycle',
  'timerStepDim',
  'timerStepDimHSV_H',
  'timerStepDimHSV_S',
  'timerStepDimTunableWhite'
]

const setupMatterControllerCommandGate = (node) => {
  node.matterCommandBlocked = false
  node.matterCommandBlockReason = ''

  node.isMatterCommandBlocked = () => node.matterCommandBlocked === true

  node.blockMatterCommands = (reason = 'Matter device unavailable') => {
    node.matterCommandBlocked = true
    node.matterCommandBlockReason = String(reason || 'Matter device unavailable')
    COMMAND_TIMER_KEYS.forEach((key) => {
      if (node[key] !== undefined && node[key] !== null) clearInterval(node[key])
      node[key] = undefined
    })
    node.status({
      fill: 'red',
      shape: 'ring',
      text: node.matterCommandBlockReason
    })
  }

  node.clearMatterCommandBlock = (source = 'editor') => {
    if (node.matterCommandBlocked !== true) return false
    node.matterCommandBlocked = false
    node.matterCommandBlockReason = ''
    node.status({
      fill: source === 'connected' ? 'green' : 'yellow',
      shape: 'ring',
      text: source === 'connected' ? 'Matter device reconnected' : 'Matter retry enabled'
    })
    return true
  }

  return node
}

module.exports = { setupMatterControllerCommandGate }
