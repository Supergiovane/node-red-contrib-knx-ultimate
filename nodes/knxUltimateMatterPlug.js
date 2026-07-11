const { createMatterOnOffNode } = require('./utils/matterSimpleNodeFactory')

module.exports = function (RED) {
  createMatterOnOffNode(RED, 'knxUltimateMatterPlug', {
    defaultName: 'Matter Plug'
  })
}
