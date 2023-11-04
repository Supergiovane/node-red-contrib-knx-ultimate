/* eslint-disable max-len */
const { EventEmitter } = require("events");
const EventSource = require("eventsource");
const http = require("./http");

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
    this.timerwriteQueueAdd = setTimeout(this.handleQueue, 15000); // First start. Allow the KNX to connect
    this.sysLogger = _sysLogger;
  }

  Connect = async () => {
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
      prefix: `https://${this.hueBridgeIP}/clip/v2`,
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
    }, 300000);
  };

  // Handle the send queue
  // ######################################
  handleQueue = async () => {
    if (this.commandQueue.length > 0) {
      // const jRet = { ...this.commandQueue.shift() } //Clone the object by value
      const jRet = this.commandQueue.shift();
      // jRet is ({ _lightID, _state, _operation });;
      switch (jRet._operation) {
        case "setLight":
          // It can be a light or a grouped light
          try {
            const ok = await this.hueApiV2.put(`/resource/light/${jRet._lightID}`, jRet._state);
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null)
              this.sysLogger.info(`KNXUltimatehueEngine: classHUE: handleQueue: setLight light: ${error.message}`);
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
            if (this.sysLogger !== undefined && this.sysLogger !== null)
              this.sysLogger.error(`KNXUltimatehueEngine: classHUE: handleQueue: stopScene: ${error.message}`);
          }
          break;
        case "getBattery":
          try {
            const jReturn = await this.hueApiV2.get(`/resource/device_power/${jRet._lightID}`);
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null)
              this.sysLogger.error(`KNXUltimatehueEngine: classHUE: handleQueue: getBattery: ${error.message}`);
          }
          break;
        case "getLightLevel":
          try {
            const jReturn = await this.hueApiV2.get(`/resource/light_level/${jRet._lightID}`);
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null)
              this.sysLogger.error(`KNXUltimatehueEngine: classHUE: handleQueue: getLightLevel: ${error.message}`);
          }
          break;
        case "getTemperature":
          try {
            const jReturn = await this.hueApiV2.get(`/resource/temperature/${jRet._lightID}`);
          } catch (error) {
            if (this.sysLogger !== undefined && this.sysLogger !== null)
              this.sysLogger.error(`KNXUltimatehueEngine: classHUE: handleQueue: getTemperature: ${error.message}`);
          }
          break;
        default:
          break;
      }
    }
    // The Hue bridge allows about 10 telegram per second, so i need to make a queue manager
    this.timerwriteQueueAdd = setTimeout(this.handleQueue, 200);
  };

  writeHueQueueAdd = async (_lightID, _state, _operation) => {
    // Add the new item
    this.commandQueue.push({ _lightID, _state, _operation });
  };
  // ######################################

  isConnected = async () => {
    try {
      await this.hueApiV2.get('/resource/bridge');
      return true;
    } catch (error) {
      console.log("hueEngine: isConnected: " + error.message)
      return false;
    }
  };

  close = async () =>
    new Promise((resolve, reject) => {
      try {
        if (this.timerReconnect !== undefined) clearInterval(this.timerReconnect);
        this.closePushEventStream = true;
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
