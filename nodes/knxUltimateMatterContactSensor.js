const { createMatterSensorNode } = require('./utils/matterSimpleNodeFactory')
const { CLUSTER } = require('./utils/matterKnxConverter')

module.exports = function (RED) {
  createMatterSensorNode(RED, 'knxUltimateMatterContactSensor', {
    defaultName: 'Matter Contact Sensor',
    eventName: 'contact',
    clusterId: CLUSTER.BOOLEAN_STATE,
    attributeName: 'stateValue',
    defaultDpt: '1.019'
  })
}
