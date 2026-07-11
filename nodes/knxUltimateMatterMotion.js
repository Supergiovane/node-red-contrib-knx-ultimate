const { createMatterSensorNode } = require('./utils/matterSimpleNodeFactory')
const { CLUSTER } = require('./utils/matterKnxConverter')

module.exports = function (RED) {
  createMatterSensorNode(RED, 'knxUltimateMatterMotion', {
    defaultName: 'Matter Motion Sensor',
    eventName: 'motion',
    clusterId: CLUSTER.OCCUPANCY,
    attributeName: 'occupancy',
    defaultDpt: '1.001'
  })
}
