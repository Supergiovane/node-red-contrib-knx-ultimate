const { createMatterSensorNode } = require('./utils/matterSimpleNodeFactory')
const { CLUSTER } = require('./utils/matterKnxConverter')

module.exports = function (RED) {
  createMatterSensorNode(RED, 'knxUltimateMatterHumiditySensor', {
    defaultName: 'Matter Humidity Sensor',
    eventName: 'humidity',
    clusterId: CLUSTER.HUMIDITY,
    attributeName: 'measuredValue',
    defaultDpt: '9.007'
  })
}
