const { createMatterSensorNode } = require('./utils/matterSimpleNodeFactory')
const { CLUSTER } = require('./utils/matterKnxConverter')

module.exports = function (RED) {
  createMatterSensorNode(RED, 'knxUltimateMatterBattery', {
    defaultName: 'Matter Battery Sensor',
    eventName: 'battery',
    clusterId: CLUSTER.POWER_SOURCE,
    attributeName: 'batPercentRemaining',
    defaultDpt: '5.001'
  })
}
