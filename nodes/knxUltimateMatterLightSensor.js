const { createMatterSensorNode } = require('./utils/matterSimpleNodeFactory')
const { CLUSTER } = require('./utils/matterKnxConverter')

module.exports = function (RED) {
  createMatterSensorNode(RED, 'knxUltimateMatterLightSensor', {
    defaultName: 'Matter Light Sensor',
    eventName: 'illuminance',
    clusterId: CLUSTER.ILLUMINANCE,
    attributeName: 'measuredValue',
    defaultDpt: '9.004'
  })
}
