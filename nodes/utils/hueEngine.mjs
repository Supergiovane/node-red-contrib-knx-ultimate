import { EventEmitter } from 'events';
import { fetch, Agent } from 'undici';
import { setTimeout as pleaseWait } from 'timers/promises';
import * as http from './http.js';

class classHUE extends EventEmitter {
  constructor(_hueBridgeIP, _username, _clientkey, _bridgeid, _sysLogger) {
    super();
    this.HUEBridgeConnectionStatus = "disconnected";
    this.exitAllQueues = false;
    this.hueBridgeIP = _hueBridgeIP;
    this.username = _username;
    this.clientkey = _clientkey;
    this.bridgeid = _bridgeid;
    this.commandQueue = [];
    this.sysLogger = _sysLogger;
    this.timerCheckConnected = null;
    this.restartSSECounter = 0;
    this.handleQueue();
    this.eventStreamAbort = null;
  }

  Connect = async () => {
    if (this.timerCheckConnected !== null) clearInterval(this.timerCheckConnected);
    if (this.eventStreamAbort) this.eventStreamAbort.abort();

    this.hueApiV2 = http.use({
      key: this.username,
      prefix: `https://${this.hueBridgeIP}/clip/v2`
    });

    const agent = new Agent({
      connect: { rejectUnauthorized: false }
    });

    const headers = {
      'hue-application-key': this.username,
      'Accept': 'text/event-stream',
      'Cache-control': 'no-cache'
    };

    this.eventStreamAbort = new AbortController();

    const url = `https://${this.hueBridgeIP}/eventstream/clip/v2`;

    try {
      const res = await fetch(url, {
        headers,
        dispatcher: agent,
        signal: this.eventStreamAbort.signal
      });

      if (res.status !== 200) {
        this.emit('error', new Error(`Status ${res.status}`));
        return;
      }

      this.emit("connected");
      this.HUEBridgeConnectionStatus = "connected";
      this.sysLogger?.info(`classHUE: connected to SSE`);

      this.timerCheckConnected = setInterval(() => {
        (async () => {
          try {
            this.restartSSECounter += 1;
            if (this.restartSSECounter >= 2) {
              this.sysLogger?.debug(`Restarted SSE Client, per sicurezza, altrimenti potrebbe addormentarsi`);
              this.restartSSECounter = 0;
              this.eventStreamAbort.abort();
              await this.Connect();
              return;
            }
            const jReturn = await this.hueApiV2.get('/resource/bridge');
            if (!Array.isArray(jReturn) || jReturn.length < 1) throw new Error("Bridge not found");
            this.HUEBridgeConnectionStatus = "connected";
          } catch (error) {
            this.sysLogger?.error(`Ping ERROR: ${error.message}`);
            if (this.timerCheckConnected !== null) clearInterval(this.timerCheckConnected);
            this.commandQueue = [];
            try { await this.close(); } catch (error) { }
            this.restartSSECounter = 0;
            this.emit("disconnected");
          }
        })();
      }, 12000);

      let buffer = '';
      const textDecoder = new TextDecoder();
      for await (const chunk of res.body) {
        buffer += textDecoder.decode(chunk, { stream: true });
        let parts = buffer.split(/\r?\n\r?\n/);
        if (parts.length > 1) {
          buffer = parts.pop();
        } else {
          buffer = parts[0];
          parts = [];
        }

        for (const block of parts) {
          const parsed = this._parseEvent(block);
          if (parsed?.data && Array.isArray(parsed.data)) {
            parsed.data.forEach(ev => {
              for (let index = 0; index < ev.data.length; index++) {
                const element = ev.data[index];
                this.emit("event", element)
              }
            });
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError' && this.sysLogger) {
        this.sysLogger.error(`EventStream error: ${err.message}`)
        this.commandQueue = [];
        try { await this.close(); } catch (error) { }
        this.restartSSECounter = 0;
        this.emit("disconnected");
      };
    }
  };

  _parseEvent = (block) => {
    const lines = block.split(/\r?\n/);
    let data = '';
    let event = 'message';

    for (const line of lines) {
      if (line.startsWith('data:')) {
        data += line.slice(5).trim();
      } else if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      }
    }

    try {
      return {
        type: event,
        data: data ? JSON.parse(data) : null
      };
    } catch (e) {
      return {
        type: event,
        data: data || null
      };
    }
  };

  processQueueItem = async () => {
    try {
      const jRet = this.commandQueue.pop();
      switch (jRet._operation) {
        case "setLight":
          await this.hueApiV2.put(`/resource/light/${jRet._lightID}`, jRet._state);
          break;
        case "setGroupedLight":
          await this.hueApiV2.put(`/resource/grouped_light/${jRet._lightID}`, jRet._state);
          break;
        case "setScene":
          await this.hueApiV2.put(`/resource/scene/${jRet._lightID}`, jRet._state);
          break;
        case "stopScene":
          const allResources = await this.hueApiV2.get("/resource");
          const jScene = allResources.find((res) => res.id === jRet._lightID);
          const linkedLight = allResources.find((res) => res.id === jScene.group.rid).children || [];
          linkedLight.forEach((light) => {
            this.writeHueQueueAdd(light.rid, jRet._state, "setLight");
          });
          break;
        default:
          break;
      }
    } catch (error) {
      this.sysLogger?.error(`processQueueItem: ${error.message}`);
    }
  };

  handleQueue = async () => {
    do {
      if (this.commandQueue && this.commandQueue.length > 0) {
        try {
          await this.processQueueItem();
        } catch (error) { }
      }
      await pleaseWait(150);
    } while (!this.exitAllQueues);
  };

  writeHueQueueAdd = async (_lightID, _state, _operation) => {
    this.commandQueue.unshift({ _lightID, _state, _operation });
  };

  deleteHueQueue = async (_lightID) => {
    this.commandQueue = this.commandQueue.filter((el) => el._lightID !== _lightID);
  };

  close = async () =>
    new Promise((resolve, reject) => {
      if (this.timerCheckConnected !== null) clearInterval(this.timerCheckConnected);
      try {
        this.exitAllQueues = true;
        this.restartSSECounter = 0;
        try {
          if (this.eventStreamAbort) this.eventStreamAbort.abort();
        } catch (error) { }
        this.HUEBridgeConnectionStatus = "disconnected";
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
}

export { classHUE };
