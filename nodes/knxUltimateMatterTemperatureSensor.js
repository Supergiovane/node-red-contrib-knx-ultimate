const { createMatterSensorNode } = require('./utils/matterSimpleNodeFactory')
const { CLUSTER } = require('./utils/matterKnxConverter')

module.exports = function (RED) {
  createMatterSensorNode(RED, 'knxUltimateMatterTemperatureSensor', {
    defaultName: 'Matter Temperature Sensor',
    eventName: 'temperature',
    clusterId: CLUSTER.TEMPERATURE,
    attributeName: 'measuredValue',
    defaultDpt: '9.001'
  })
}
