/* eslint-disable max-len */
const { EventEmitter } = require("events");
const EventSource = require("eventsource");
const http = require("./http");
// const pleaseWait = t => new Promise((resolve, reject) => setTimeout(resolve, t))
const { RateLimiter } = require('limiter');
//const { forEach } = require("lodash");
// Configura il rate limiter
const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 150 }); // HUE telegram interval

class classHUE extends EventEmitter {

  constructor(_hueBridgeIP, _username, _clientkey, _bridgeid, _sysLogger) {
    super();
    this.hueBridgeIP = _hueBridgeIP;
    this.username = _username;
    this.clientkey = _clientkey;
    this.bridgeid = _bridgeid;
    this.commandQueue = [];
    this.closePushEventStream = false;
    // eslint-disable-next-line max-len
    setTimeout(this.handleQueue, 10000); // First start. Allow the KNX to connect
    this.sysLogger = _sysLogger;
    this.timerCheckConnected = null;
  }

  Connect = () => {

    const options = {
      headers: {
        "hue-application-key": this.username,
        pragma: "no-cache",
        "cache-control": "no-cache,no-store, must-revalidate",
      },
      https: {
        rejectUnauthorized: false,
      },
    };

    // Init the http to use the username and bridge ip
    this.hueApiV2 = http.use({
      key: this.username,
      prefix: `https://${this.hueBridgeIP}/clip/v2`
    });

    try {
      this.es.close();
      this.es = null;
    } catch (error) {
      /* empty */
    }

    try {
      this.es = new EventSource(`https://${this.hueBridgeIP}/eventstream/clip/v2`, options);
    } catch (error) {
      console.log("hue-config: ew EventSource:" + error.message);
    }


    this.es.onmessage = (event) => {
      try {
        if (event && event.type === "message" && event.data) {
          const data = JSON.parse(event.data);
          data.forEach((element) => {
            if (element.type === "update") {
              element.data.forEach((ev) => {
                this.emit("event", ev);
              });
            }
          });
        }
      } catch (error) {
        if (this.sysLogger !== undefined && this.sysLogger !== null)
          this.sysLogger.error(`KNXUltimatehueEngine: classHUE: this.es.onmessage: ${error.message}`);
      }
    };

    this.es.onopen = () => {
      // if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error('KNXUltimatehueEngine: classHUE: SSE-Connected')
      this.emit("connected");

      // Check wether the hue bridge is connected or not
      if (this.timerCheckConnected !== null) clearInterval(this.timerCheckConnected);
      this.timerCheckConnected = setInterval(() => {
        this.writeHueQueueAdd(null, null, "Ping");
      }, 30000);
    };

    // this.es.onerror = (error) => {
    // 29/08/2023 NON riattivare, perchè alla disconnessione, va in loop e consuma tutto il pool di risorse.
    //   try {
    //     this.es.close();
    //     this.es = null;
    //     if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error(`KNXUltimatehueEngine: classHUE: request.on(error): ${error.message}`);
    //   } catch (err) { /* empty */ }
    //   this.Connect();
    //   // this.emit('error', error)
    // };

    // 31/07/2023 Every now and then, restart the connection to the eventsource, because it can goes down without knowing that
    if (this.timerReconnect !== undefined) clearInterval(this.timerReconnect);
    this.timerReconnect = setInterval(() => {
      try {
        this.es.close();
        this.es = null;
      } catch (error) {
        /* empty */
      }
      try {
        this.Connect();
      } catch (error) { }
    }, 10 * (60 * 1000)); // 10 minutes
  };

  // Process single item in the queue
  processQueueItem = async () => {
    try {
      const jRet = this.commandQueue.pop();
      // jRet is ({ _lightID, _state, _operation });;
      switch (jRet._operation) {
        case "setLight":
          // It can be a light or a grouped light
          try {
            const ok = await this.hueApiV2.put(`/resource/light/${jRet._lightID}`, jRet._state);
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) {
              this.sysLogger.info(`KNXUltimatehueEngine: classHUE: handleQueue: setLight light: ${error.message}. CHECK WETHER THE DEVICE IS POWERED ON`);
            }
          }
          break;
        case "setGroupedLight":
          try {
            await this.hueApiV2.put(`/resource/grouped_light/${jRet._lightID}`, jRet._state);
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null)
              this.sysLogger.info(`KNXUltimatehueEngine: classHUE: handleQueue: setLight grouped_light: ${error.message}`);
          }
          break;
        case "setScene":
          try {
            const sceneID = jRet._lightID;
            await this.hueApiV2.put(`/resource/scene/${sceneID}`, jRet._state);
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null)
              this.sysLogger.info(`KNXUltimatehueEngine: classHUE: handleQueue: setScene: ${error.message}`);
          }
          break;
        case "stopScene":
          try {
            const allResources = await this.hueApiV2.get("/resource");
            const sceneID = jRet._lightID;
            const jScene = allResources.find((res) => res.id === sceneID) || "";
            const linkedLight = allResources.find((res) => res.id === jScene.group.rid).children || "";
            linkedLight.forEach((light) => {
              this.writeHueQueueAdd(light.rid, jRet._state, "setLight");
            });
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error(`KNXUltimatehueEngine: classHUE: handleQueue: stopScene: ${error.message}`);
          }
          break;
        case "Ping":
          try {
            const jReturn = await this.hueApiV2.get('/resource/bridge');
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error(`KNXUltimatehueEngine: classHUE: handleQueue: Ping: ${error.message}`);
            if (this.timerCheckConnected !== null) clearInterval(this.timerCheckConnected);
            this.commandQueue = [];
            this.emit("disconnected");
            this.close();
          }
          break;
        default:
          break;
      }
    } catch (error) {
      if (this.sysLogger !== undefined && this.sysLogger !== null) this.sysLogger.error(`KNXUltimatehueEngine: classHUE: processQueueItem: ${error.trace}`);
    }
  };

  // // Handle the send queue
  // // ######################################
  handleQueue = async () => {
    // Verifica se è possibile eseguire una nuova richiesta
    do {
      try {
        const remainingRequests = await limiter.removeTokens(1);
      } catch (error) {
      }
      if (this.commandQueue !== undefined && this.commandQueue.length > 0) {
        //if (remainingRequests >= 0) {
        // OK, i can send
        //console.log("\x1b[32m Messaggio. remainingRequests=" + remainingRequests + "\x1b[0m " + new Date().toTimeString(), this.commandQueue.length, "remainingRequests " + remainingRequests);
        try {
          await this.processQueueItem();
        } catch (error) {
        }
        //} else {
        // Limit reached, skip this round.
        //console.log("\x1b[41m HO DETTO SPETA. remainingRequests=" + remainingRequests + "\x1b[0m " + new Date().toTimeString(), this.commandQueue.length, "remainingRequests " + remainingRequests);
        //}
      }
    } while (this.closePushEventStream === false);
    //console.log("\x1b[42m End processing commandQueue \x1b[0m " + new Date().toTimeString(), this.commandQueue.length);
  };

  writeHueQueueAdd = async (_lightID, _state, _operation) => {
    // Add the new item
    this.commandQueue.unshift({ _lightID, _state, _operation });
  };

  /**
  * Clears all items fo _lightID from the HUE sending queue. Useful to clear unwanted dimming commands
  * @param {string} _lightID HUE Light ID
  * @returns {}
  */
  deleteHueQueue = async (_lightID) => {
    // Add the new item
    this.commandQueue = this.commandQueue.filter((el) => el._lightID !== _lightID);
  };
  // ######################################

  close = async () =>
    new Promise((resolve, reject) => {
      try {
        if (this.timerReconnect !== undefined) clearInterval(this.timerReconnect);
        this.closePushEventStream = true; // Signal to exit all loops
        try {
          if (this.es !== null && this.es !== undefined) this.es.close();
        } catch (error) { }
        this.es = null;
        setTimeout(() => {
          resolve(true);
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
}
module.exports.classHUE = classHUE;
