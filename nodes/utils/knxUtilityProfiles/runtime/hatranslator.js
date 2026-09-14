// Private KNX Utility profile. Independent of the legacy palette entry point.
/* eslint-disable prefer-arrow-callback */
const DEFAULT_TRANSLATION_TABLE = 'on:true\noff:false\nactive:true\ninactive:false\nopen:true\nclosed:false\nclose:false\n1:true\n0:false\ntrue:true\nfalse:false\nhome:true\nnot_home:false'
module.exports = function (RED) {
  function knxUltimateHATranslator (config) {
    RED.nodes.createNode(this, config)
    // commandText belongs to AutoResponder in the shared Utility schema.
    // Adapt only the dedicated HA mapping to the existing conversion helper.
    this.config = {
      ...config,
      commandText: config.haTranslationTable === undefined
        ? DEFAULT_TRANSLATION_TABLE
        : config.haTranslationTable
    }
    const node = this

    function setNodeStatus ({ fill, shape, text }) {
      const dDate = new Date()
      node.status({
        fill,
        shape,
        text:
          text +
          ' (' +
          dDate.getDate() +
          ', ' +
          dDate.toLocaleTimeString() +
          ')'
      })
    }

    setNodeStatus({ fill: 'grey', shape: 'dot', text: 'Waiting' })

    this.on('input', function (msg) {
      // 11/11/2021 Clone input message and replace only relevant topics
      const utils = require('../../utils.js')
      let sPayload
      try {
        sPayload = utils.fetchFromObject(msg, config.payloadPropName || 'payload')
      } catch (error) {
        // A missing nested property is an invalid payload, just like an absent
        // top-level property. Do not let malformed HA events escape the node.
      }

      // 15/11/2021 inform user about undefined topic or payload
      if (sPayload === undefined) {
        setNodeStatus({
          fill: 'red',
          shape: 'dot',
          text: 'Received invalid payload from ' + (msg.topic || '')
        })
        return
      }

      let bRes = null
      try {
        bRes = utils.ToBoolean(
          sPayload,
          node.config
        )
      } catch (error) { }
      if (bRes === undefined || bRes === null) {
        setNodeStatus({
          fill: 'red',
          shape: 'dot',
          text:
            'Received non convertible boolean value ' +
            sPayload +
            ' from ' +
            msg.topic
        })
        return
      }

      const msgOUt = RED.util.cloneMessage(msg)
      try {
        msgOUt.payload = bRes
        setNodeStatus({
          fill: 'green',
          shape: 'dot',
          text: '(Send) ' + msgOUt.payload
        })
        node.send(msgOUt)
      } catch (error) {
        setNodeStatus({
          fill: 'red',
          shape: 'dot',
          text: 'Unable to invert the input payload ' + bRes
        })
      }
    })
  }

  RED.nodes.registerType('knxUltimateHATranslator', knxUltimateHATranslator)
}
