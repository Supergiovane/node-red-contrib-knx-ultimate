import { EventEmitter } from 'events';
import { fetch, Agent } from 'undici';
import { setTimeout as delay } from 'timers/promises';

class HueEventStream extends EventEmitter {
  constructor(url, { headers = {}, reconnectInterval = 5000 } = {}) {
    super();
    this.url = url;
    this.headers = headers;
    this.reconnectInterval = reconnectInterval;
    this.abortController = null;
    this.agent = new Agent({
      connect: {
        rejectUnauthorized: false
      }
    });
    this.connected = false;
    this._start();
  }

  async _start() {
    while (true) {
      try {
        this.abortController = new AbortController();
        const res = await fetch(this.url, {
          headers: this.headers,
          dispatcher: this.agent,
          signal: this.abortController.signal
        });

        if (res.status !== 200) {
          this.emit('error', new Error(`Unexpected status: ${res.status}`));
          await delay(this.reconnectInterval);
          continue;
        }

        this.emit('open');
        this.connected = true;

        let buffer = '';
        for await (const chunk of res.body) {
          buffer += chunk.toString();

          const lines = buffer.split(/\r?\n\r?\n/);
          buffer = lines.pop(); // l'ultima parte potrebbe essere incompleta

          for (const block of lines) {
            const event = this._parseEvent(block);
            if (event) this.emit('message', event);
          }
        }

        this.emit('close');
        this.connected = false;
        await delay(this.reconnectInterval);
      } catch (err) {
        if (err.name !== 'AbortError') {
          this.emit('error', err);
          await delay(this.reconnectInterval);
        }
      }
    }
  }

  _parseEvent(block) {
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
  }

  close() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.connected = false;
  }
}

export { HueEventStream };
