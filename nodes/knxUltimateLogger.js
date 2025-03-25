module.exports = function (RED) {
  function knxUltimateLogger(config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.serverKNX = RED.nodes.getNode(config.server) || undefined
    node.notifyreadrequestalsorespondtobus = 'false'
    node.notifyreadrequestalsorespondtobusdefaultvalueifnotinitialized = ''
    node.notifyreadrequest = true
    node.notifyresponse = true
    node.notifywrite = true
    node.initialread = false
    node.listenallga = true
    node.outputtype = 'write'
    node.outputRBE = 'false'
    node.inputRBE = 'false'
    node.currentPayload = ''
    node.topic = config.topic !== undefined ? config.topic : ''
    node.autoStartTimerCreateETSXML = config.autoStartTimerCreateETSXML !== undefined ? config.autoStartTimerCreateETSXML : true
    node.intervalCreateETSXML = config.intervalCreateETSXML !== undefined ? (config.intervalCreateETSXML * 1000) * 60 : 900000
    node.maxRowsInETSXML = config.maxRowsInETSXML !== undefined ? config.maxRowsInETSXML : 0
    node.timerCreateETSXML = null
    node.isLogger = true
    node.etsXMLRow = []
    node.autoStartTimerTelegramCounter = config.autoStartTimerTelegramCounter !== undefined ? config.autoStartTimerTelegramCounter : false
    node.intervalTelegramCount = config.intervalTelegramCount !== undefined ? (config.intervalTelegramCount * 1000) : 60000
    node.telegramCount = 0
    node.timerTelegramCount = null

    // Used to call the status update from the config node.
    node.setNodeStatus = ({ fill, shape, text, payload, GA, dpt, devicename }) => {
      try {
        if (node.serverKNX === null) { node.status({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' }); return }
        const dDate = new Date()
        // 30/08/2019 Display only the things selected in the config
        GA = (typeof GA === 'undefined' || GA == '') ? '' : '(' + GA + ') '
        devicename = devicename || ''
        dpt = (typeof dpt === 'undefined' || dpt == '') ? '' : ' DPT' + dpt
        payload = typeof payload === 'object' ? JSON.stringify(payload) : payload
        node.status({ fill, shape, text: GA + payload + (node.listenallga === true ? ' ' + devicename : '') + ' (' + dDate.getDate() + ', ' + dDate.toLocaleTimeString() + ' ' + text })
      } catch (error) {
      }
    }

    if (!node.serverKNX) return

    // 26/03/2020 Create and output the XML for ETS bus monitor
    function createETSXML() {
      let sFile = '<CommunicationLog xmlns="http://knx.org/xml/telegrams/01">\n'
      for (let index = 0; index < node.etsXMLRow.length; index++) {
        const element = node.etsXMLRow[index]
        sFile += element
      }
      sFile += '<RecordStop Timestamp="' + new Date().toISOString() + '" />\n'
      sFile += '</CommunicationLog>'
      node.send([{ topic: node.topic, payload: sFile }, null])
      node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'Payload ETS sent.', payload: '', GA: '', dpt: '', devicename: '' })
      node.etsXMLRow = []
    };

    // 25/10/2021 Count Telegrams. Requested by RicharddeCrep https://github.com/Supergiovane/node-red-contrib-knx-ultimate/issues/149#issue-1034644956
    function countTelegrams() {
      node.send([null, { topic: node.topic, payload: node.telegramCount, countIntervalInSeconds: node.intervalTelegramCount / 1000, currentTime: new Date().toLocaleString() }])
      node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'Payload Telegram counter sent.', payload: node.telegramCount, GA: '', dpt: '', devicename: '' })
      node.telegramCount = 0
    };

    // This function is called by the knx-ultimate config node.
    node.handleSend = _cemiETS => {
      // 25/10/2021 Telegram counter - Increase telegram count
      node.telegramCount += 1

      // Receiving every message
      if (_cemiETS !== undefined) {
        // If too much, delete the oldest
        if (node.maxRowsInETSXML > 0 && (node.etsXMLRow.length > node.maxRowsInETSXML)) {
          // Shift (remove) the first row (the oldest)
          try {
            node.etsXMLRow.shift()
          } catch (error) { }
        }
        // Add row to XML ETS
        node.etsXMLRow.push(' <Telegram Timestamp="' + new Date().toISOString() + '" Service="L_Data.ind" FrameFormat="CommonEmi" RawData="' + _cemiETS + '" />\n')
      }
    }

    node.StartETSXMLTimer = () => {
      if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML)
      node.timerCreateETSXML = setInterval(createETSXML, node.intervalCreateETSXML) // 02/01/2020 Start the timer that handles the queue of telegrams
      // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
      const t = setTimeout(function () { node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'ETS timer started.', payload: '', GA: '', dpt: '', devicename: '' }) }, 5000)
    }

    node.StartTelegramCounterTimer = () => {
      if (node.timerTelegramCount !== null) clearInterval(node.timerTelegramCount)
      node.timerTelegramCount = setInterval(countTelegrams, node.intervalTelegramCount)
      // 21/03/2022 fixed possible memory leak. Previously was setTimeout without "let t = ".
      const t = setTimeout(function () { node.setNodeStatus({ fill: 'green', shape: 'dot', text: 'Telegram counter timer started.', payload: '', GA: '', dpt: '', devicename: '' }) }, 5000)
    }

    node.on('input', function (msg) {
      if (typeof msg === 'undefined') return

      if (msg.hasOwnProperty('etsstarttimer')) {
        if (Boolean(msg.startetstimer) === true) {
          node.StartETSXMLTimer()
        } else {
          if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML)
          node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'ETS timer stopped.', payload: '', GA: '', dpt: '', devicename: '' })
        };
      };
      if (msg.hasOwnProperty('etsoutputnow')) {
        if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML)
        createETSXML()
        if (node.autoStartTimerCreateETSXML) node.StartETSXMLTimer() // autoStartTimerCreateETSXML ETS timer
      };

      if (msg.hasOwnProperty('telegramcounterstarttimer')) {
        if (Boolean(msg.telegramcounterstarttimer) === true) {
          node.StartTelegramCounterTimer()
        } else {
          if (node.timerTelegramCount !== null) clearInterval(node.timerTelegramCount)
          node.telegramCount = 0
          node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Telegram counter timer stopped.', payload: '', GA: '', dpt: '', devicename: '' })
        };
      };
      if (msg.hasOwnProperty('telegramcounteroutputnow')) {
        if (node.timerTelegramCount !== null) clearInterval(node.timerTelegramCount)
        countTelegrams()
        if (node.autoStartTimerTelegramCounter) node.StartTelegramCounterTimer()
      };
    })

    node.on('close', function (done) {
      if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML)
      if (node.timerTelegramCount !== null) clearInterval(node.timerTelegramCount)
      if (node.serverKNX) {
        node.serverKNX.removeClient(node)
      };
      done()
    })

    // On each deploy, unsubscribe+resubscribe
    // Unsubscribe(Subscribe)
    if (node.serverKNX) {
      if (node.timerCreateETSXML !== null) clearInterval(node.timerCreateETSXML)
      if (node.timerTelegramCount !== null) clearInterval(node.timerTelegramCount)
      node.serverKNX.removeClient(node)
      node.serverKNX.addClient(node)
      if (node.autoStartTimerCreateETSXML) node.StartETSXMLTimer() // autoStartTimerCreateETSXML ETS timer
      if (node.autoStartTimerTelegramCounter) node.StartTelegramCounterTimer()
    }
  }
  RED.nodes.registerType('knxUltimateLogger', knxUltimateLogger)
}
