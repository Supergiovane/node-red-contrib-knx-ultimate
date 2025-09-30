const loggerClass = require('./utils/sysLogger');

module.exports = function (RED) {
  function knxUltimateStaircase(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.serverKNX = RED.nodes.getNode(config.server) || undefined;

    const pushStatus = (status) => {
      if (!status) return;
      const provider = node.serverKNX;
      if (provider && typeof provider.applyStatusUpdate === 'function') {
        provider.applyStatusUpdate(node, status);
      } else {
        node.status(status);
      }
    };

    if (node.serverKNX === undefined) {
      pushStatus({ fill: 'red', shape: 'dot', text: '[THE GATEWAY NODE HAS BEEN DISABLED]' });
      return;
    }

    node.name = config.name || 'KNX Staircase';
    node.outputtopic = config.outputtopic || '';

    node.listenallga = true;
    node.notifyreadrequest = true;
    node.notifyresponse = true;
    node.notifywrite = true;
    node.initialread = false;
    node.outputtype = 'write';
    node.outputRBE = 'false';
    node.inputRBE = 'false';

    try {
      const baseLogLevel = (node.serverKNX && node.serverKNX.loglevel) ? node.serverKNX.loglevel : 'error';
      node.sysLogger = new loggerClass({ loglevel: baseLogLevel, setPrefix: node.type + ' <' + (node.name || node.id || '') + '>' });
    } catch (error) { console.log(error.stack); }

    node.setNodeStatus = ({ fill = 'grey', shape = 'ring', text: statusText = '', payload = '', GA = '', dpt = '', devicename = '' }) => {
      try {
        if (!node.serverKNX) {
          pushStatus({ fill: 'red', shape: 'dot', text: '[NO GATEWAY SELECTED]' });
          return;
        }
        const dDate = new Date();
        const gaLabel = GA ? `(${GA}) ` : '';
        const deviceLabel = devicename ? ` ${devicename}` : '';
        const dptLabel = dpt ? ` DPT${dpt}` : '';
        let payloadLabel = '';
        if (payload !== undefined && payload !== null && payload !== '') {
          payloadLabel = typeof payload === 'object' ? JSON.stringify(payload) : `${payload}`;
        }
        const composed = `${gaLabel}${payloadLabel}${deviceLabel}${dptLabel} (day ${dDate.getDate()}, ${dDate.toLocaleTimeString()}) ${statusText}`.trim();
        pushStatus({ fill, shape, text: composed });
        if (fill && fill.toUpperCase() === 'RED' && node.serverKNX && typeof node.serverKNX.reportToWatchdogCalledByKNXUltimateNode === 'function') {
          node.serverKNX.reportToWatchdogCalledByKNXUltimateNode({ nodeid: node.id, topic: node.outputtopic, devicename, GA, text: statusText });
        }
      } catch (error) {
        if (node.sysLogger) node.sysLogger.error(`Status update failed: ${error.message}`);
      }
    };

    const boolFromConfig = (value) => (value === true || value === 'true');

    node.gaTrigger = (config.gaTrigger || '').trim();
    node.dptTrigger = config.dptTrigger || '1.001';
    node.gaOutput = (config.gaOutput || '').trim();
    node.dptOutput = config.dptOutput || '1.001';
    node.gaStatus = (config.gaStatus || '').trim();
    node.dptStatus = config.dptStatus || '1.001';
    node.gaOverride = (config.gaOverride || '').trim();
    node.dptOverride = config.dptOverride || '1.001';
    node.gaBlock = (config.gaBlock || '').trim();
    node.dptBlock = config.dptBlock || '1.001';

    node.nameTriggerGA = config.nameTrigger || '';
    node.nameOutputGA = config.nameOutput || '';
    node.nameStatusGA = config.nameStatus || '';
    node.nameOverrideGA = config.nameOverride || '';
    node.nameBlockGA = config.nameBlock || '';

    node.timerDurationMs = Math.max(1000, Number(config.timerSeconds || 0) * 1000 || 60000);
    node.extendMode = config.extendMode || 'restart';
    node.triggerOffCancels = config.triggerOffCancels || 'yes';

    node.preWarnEnabled = boolFromConfig(config.preWarnEnable);
    node.preWarnMs = node.preWarnEnabled ? Math.max(0, Number(config.preWarnSeconds || 0) * 1000) : 0;
    node.preWarnMode = config.preWarnMode || 'status';
    node.preWarnFlashMs = Math.max(100, Number(config.preWarnFlashMs || 0) || 300);
    node.blockAction = config.blockAction || 'off';
    node.emitEvents = boolFromConfig(config.emitEvents);

    node.overrideActive = false;
    node.blocked = false;
    node.active = false;
    node.outputState = false;
    node.timer = null;
    node.preWarnTimer = null;
    node.statusTicker = null;
    node.timerDeadline = 0;
    node.preWarned = false;

    const safeSendToKNX = (telegram, context = 'write') => {
      try {
        if (!node.serverKNX) return;
        node.serverKNX.sendKNXTelegramToKNXEngine({ ...telegram, nodecallerid: node.id });
      } catch (error) {
        if (node.sysLogger) {
          node.sysLogger.error(`Staircase send failed (${context}): ${error.message}`);
        } else {
          RED.log.error(`knxUltimateStaircase send failed (${context}): ${error.message}`);
        }
      }
    };

    const emitEvent = (event, payload = {}) => {
      if (!node.emitEvents) return;
      const remaining = Math.max(0, Math.round((node.timerDeadline - Date.now()) / 1000));
      node.send([{
        topic: node.outputtopic || node.gaOutput || node.name,
        event,
        payload,
        remaining,
        active: node.active,
        override: node.overrideActive,
        blocked: node.blocked,
      }]);
    };

    const formatPayloadForDpt = (value, dpt) => {
      if (!dpt || dpt === '') return value;
      const prefix = dpt.split('.')[0];
      switch (prefix) {
        case '1':
        case '2':
          return value ? true : false;
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '12':
        case '13':
        case '14':
        case '20': {
          const num = Number(value);
          return Number.isNaN(num) ? 0 : num;
        }
        default:
          return value;
      }
    };

    const sendOutput = (value, context = 'write') => {
      if (!node.gaOutput) return;
      node.outputState = !!value;
      const payload = formatPayloadForDpt(value, node.dptOutput);
      const outputType = context === 'response' ? 'response' : 'write';
      safeSendToKNX({ grpaddr: node.gaOutput, payload, dpt: node.dptOutput, outputtype: outputType }, context);
    };

    const sendStatusValue = (value, context = 'write') => {
      if (!node.gaStatus) return;
      const payload = formatPayloadForDpt(value, node.dptStatus);
      const outputType = context === 'response' ? 'response' : 'write';
      safeSendToKNX({ grpaddr: node.gaStatus, payload, dpt: node.dptStatus, outputtype: outputType }, context);
    };

    const boolFromPayload = (value) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number') return value !== 0;
      if (typeof value === 'string') {
        const trimmed = value.trim().toLowerCase();
        if (trimmed === '1' || trimmed === 'true' || trimmed === 'on') return true;
        if (trimmed === '0' || trimmed === 'false' || trimmed === 'off') return false;
      }
      if (value && typeof value === 'object') {
        if (Object.prototype.hasOwnProperty.call(value, 'value')) return boolFromPayload(value.value);
        if (Object.prototype.hasOwnProperty.call(value, 'state')) return boolFromPayload(value.state);
      }
      return false;
    };

    const stopStatusTicker = () => {
      if (node.statusTicker) {
        clearInterval(node.statusTicker);
        node.statusTicker = null;
      }
    };

    const updateStatus = (overrideStatus = null) => {
      if (overrideStatus) {
        node.setNodeStatus(overrideStatus);
        return;
      }
      if (node.overrideActive) {
        node.setNodeStatus({ fill: 'blue', shape: 'dot', text: 'Override ON', payload: true, GA: node.gaOverride, dpt: node.dptOverride, devicename: node.nameOverrideGA });
        return;
      }
      if (node.blocked) {
        node.setNodeStatus({ fill: 'yellow', shape: 'ring', text: 'Blocked', payload: true, GA: node.gaBlock, dpt: node.dptBlock, devicename: node.nameBlockGA });
        return;
      }
      if (node.active) {
        const remaining = Math.max(0, Math.round((node.timerDeadline - Date.now()) / 1000));
        node.setNodeStatus({ fill: 'green', shape: 'dot', text: `Active ${remaining}s`, payload: true, GA: node.gaOutput, dpt: node.dptOutput, devicename: node.nameOutputGA });
        return;
      }
      node.setNodeStatus({ fill: 'grey', shape: 'ring', text: 'Idle', payload: node.outputState, GA: node.gaOutput, dpt: node.dptOutput, devicename: node.nameOutputGA });
    };

    const startStatusTicker = () => {
      if (node.statusTicker) return;
      node.statusTicker = setInterval(() => {
        if (!node.active || node.overrideActive || node.blocked) {
          stopStatusTicker();
          updateStatus();
          return;
        }
        updateStatus();
      }, 1000);
    };

    const cancelTimers = () => {
      if (node.timer) {
        clearTimeout(node.timer);
        node.timer = null;
      }
      if (node.preWarnTimer) {
        clearTimeout(node.preWarnTimer);
        node.preWarnTimer = null;
      }
      node.preWarned = false;
      stopStatusTicker();
    };

    const triggerPreWarning = () => {
      if (!node.active || node.preWarned) return;
      node.preWarned = true;
      if (node.preWarnMode === 'flash' && node.gaOutput) {
        const restore = node.outputState;
        sendOutput(false, 'write');
        setTimeout(() => {
          if (node.active && !node.overrideActive && !node.blocked) sendOutput(restore || true, 'write');
        }, node.preWarnFlashMs);
      } else {
        sendStatusValue(true, 'write');
      }
      updateStatus({ fill: 'yellow', shape: 'dot', text: 'Pre-warning', GA: node.gaStatus, dpt: node.dptStatus, devicename: node.nameStatusGA, payload: true });
      emitEvent('prewarn', { active: true });
    };

    const scheduleTimers = () => {
      cancelTimers();
      const remaining = node.timerDeadline - Date.now();
      if (remaining <= 0) {
        finishCycle('timeout');
        return;
      }
      node.timer = setTimeout(() => finishCycle('timeout'), remaining);
      if (node.preWarnEnabled && node.preWarnMs > 0 && remaining > node.preWarnMs) {
        node.preWarnTimer = setTimeout(triggerPreWarning, remaining - node.preWarnMs);
        node.preWarned = false;
      }
      startStatusTicker();
      updateStatus();
    };

    const startCycle = (source = 'trigger') => {
      const now = Date.now();
      const baseDuration = node.timerDurationMs;
      if (!node.active) {
        node.active = true;
        node.timerDeadline = now + baseDuration;
        node.preWarned = false;
        sendOutput(true, 'write');
        sendStatusValue(true, 'write');
        emitEvent(source, { started: true });
      } else {
        if (node.extendMode === 'restart') {
          node.timerDeadline = now + baseDuration;
        } else if (node.extendMode === 'extend') {
          node.timerDeadline += baseDuration;
        }
        emitEvent('extend', { restarted: node.extendMode === 'restart' });
      }
      scheduleTimers();
    };

    const finishCycle = (reason = 'timeout') => {
      cancelTimers();
      if (node.overrideActive) {
        updateStatus();
        emitEvent(reason, { active: true, override: true });
        return;
      }
      node.active = false;
      node.preWarned = false;
      sendOutput(false, 'write');
      sendStatusValue(false, 'write');
      updateStatus({ fill: reason === 'manual-off' ? 'grey' : 'green', shape: 'ring', text: reason === 'manual-off' ? 'Stopped' : 'Finished', GA: node.gaOutput, dpt: node.dptOutput, devicename: node.nameOutputGA, payload: node.outputState });
      emitEvent(reason, { active: false });
    };

    const handleBlock = (value) => {
      const newState = !!value;
      if (node.blocked === newState) {
        updateStatus();
        return;
      }
      node.blocked = newState;
      if (node.blocked) {
        cancelTimers();
        if (!node.overrideActive && node.blockAction === 'off') {
          node.active = false;
          sendOutput(false, 'write');
          sendStatusValue(false, 'write');
        }
        updateStatus({ fill: 'yellow', shape: 'ring', text: 'Blocked', GA: node.gaBlock, dpt: node.dptBlock, devicename: node.nameBlockGA, payload: true });
      } else {
        updateStatus();
      }
      emitEvent('block', { value: node.blocked });
    };

    const handleOverride = (value) => {
      const newState = !!value;
      if (node.overrideActive === newState) {
        updateStatus();
        return;
      }
      node.overrideActive = newState;
      if (node.overrideActive) {
        cancelTimers();
        node.active = false;
        sendOutput(true, 'write');
        sendStatusValue(true, 'write');
        updateStatus({ fill: 'blue', shape: 'dot', text: 'Override ON', GA: node.gaOverride, dpt: node.dptOverride, devicename: node.nameOverrideGA, payload: node.overrideActive });
      } else {
        updateStatus();
      }
      emitEvent('override', { value: node.overrideActive });
    };

    const handleTrigger = (value) => {
      if (!value) {
        if (node.triggerOffCancels === 'yes') {
          if (node.active || node.outputState) {
            finishCycle('manual-off');
          }
        }
        return;
      }
      if (node.overrideActive) {
        sendOutput(true, 'write');
        updateStatus();
        emitEvent('trigger', { ignored: true, reason: 'override' });
        return;
      }
      if (node.blocked) {
        updateStatus({ fill: 'yellow', shape: 'ring', text: 'Blocked', GA: node.gaBlock, dpt: node.dptBlock, devicename: node.nameBlockGA, payload: true });
        emitEvent('trigger', { ignored: true, reason: 'blocked' });
        return;
      }
      startCycle('trigger');
    };

    const handleRead = (destination) => {
      if (node.gaOutput && destination === node.gaOutput) {
        sendOutput(node.overrideActive || node.active ? true : node.outputState, 'response');
        return;
      }
      if (node.gaStatus && destination === node.gaStatus) {
        sendStatusValue(node.overrideActive || node.active, 'response');
        return;
      }
      if (node.gaOverride && destination === node.gaOverride) {
        const payload = formatPayloadForDpt(node.overrideActive, node.dptOverride);
        safeSendToKNX({ grpaddr: node.gaOverride, payload, dpt: node.dptOverride, outputtype: 'response' }, 'response');
        return;
      }
      if (node.gaBlock && destination === node.gaBlock) {
        const payload = formatPayloadForDpt(node.blocked, node.dptBlock);
        safeSendToKNX({ grpaddr: node.gaBlock, payload, dpt: node.dptBlock, outputtype: 'response' }, 'response');
      }
    };


    node.on('input', (msg, send, done) => {
      try {
        if (!msg) { if (done) done(); return; }
        let processed = false;
        if (typeof msg.payload === 'string') {
          const command = msg.payload.trim().toLowerCase();
          if (command === 'trigger' || command === 'start' || command === 'on' || command === 'open') {
            handleTrigger(true);
            processed = true;
          } else if (command === 'cancel' || command === 'stop' || command === 'off' || command === 'close') {
            handleTrigger(false);
            processed = true;
          } else if (command === 'toggle') {
            handleTrigger(true);
            processed = true;
          }
        }
        if (!processed) {
          handleTrigger(boolFromPayload(msg.payload));
        }
        if (done) done();
      } catch (error) {
        if (node.sysLogger) {
          node.sysLogger.error(`Staircase flow input error: ${error.message}`);
        } else {
          RED.log.error(`knxUltimateStaircase flow input error: ${error.message}`);
        }
        if (done) done(error);
      }
    });

    node.handleSend = (msg) => {
      try {
        if (!msg || !msg.knx || !msg.knx.destination) return;
        const dest = msg.knx.destination;
        if (msg.knx.event === 'GroupValue_Read') {
          handleRead(dest);
          return;
        }
        if (dest === node.gaTrigger) {
          handleTrigger(boolFromPayload(msg.payload));
          return;
        }
        if (dest === node.gaBlock) {
          handleBlock(boolFromPayload(msg.payload));
          return;
        }
        if (dest === node.gaOverride) {
          handleOverride(boolFromPayload(msg.payload));
        }
      } catch (error) {
        if (node.sysLogger) {
          node.sysLogger.error(`Staircase handleSend error: ${error.message}`);
        } else {
          RED.log.error(`knxUltimateStaircase handleSend error: ${error.message}`);
        }
      }
    };

    updateStatus();

    node.on('close', (done) => {
      cancelTimers();
      stopStatusTicker();
      done();
    });
  }

  RED.nodes.registerType('knxUltimateStaircase', knxUltimateStaircase);
};
