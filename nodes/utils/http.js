const simpleget = require('simple-get')

/**
* Parameters.
*
* @param config.key the credentualskey.
* @param config.prefix the bridge's URL
* @param config.url the resource url
*/
module.exports.use = (config) => {
  const http = {}

  const logError = (message) => {
    try {
      const logger = config?.logger || config?.sysLogger
      if (logger?.error) logger.error(message)
      else console.error(message)
    } catch (error) {
      try { console.error(message) } catch (err) { /* empty */ }
    }
  }

  /**
     * Make a http call.
     *
     * @param opt  Used as options for simple get.
     */
  http.call = async (opt) => {
    return new Promise((resolve, reject) => {
      const requestOptions = { ...opt }
      requestOptions.rejectUnauthorized = false
      requestOptions.headers = {
        ...(opt.headers || {}),
        'hue-application-key': config.key
      }
      if (requestOptions.body && !requestOptions.headers['Content-Type'] && !requestOptions.headers['content-type']) {
        requestOptions.headers['Content-Type'] = 'application/json'
      }
      requestOptions.url = config.prefix + requestOptions.url
      // log.trace('http ' + opt.method + ' ' + opt.url);
      simpleget.concat(requestOptions, (err, res, data) => {
        if (err) return reject(err)

        const statusCode = res?.statusCode ?? 0
        const statusMessage = res?.statusMessage || ''
        const responseText = Buffer.isBuffer(data) ? data.toString('utf8') : String(data ?? '')

        if (statusCode >= 100 && statusCode < 400) {
          let result
          try {
            result = JSON.parse(responseText)
          } catch (error) {
            logError(`utils.http: Invalid JSON response from ${requestOptions.url}: ${error.message}`)
            return reject(new Error(`Invalid JSON response for ${requestOptions.url}: ${error.message}`))
          }

          if (result?.errors && Array.isArray(result.errors) && result.errors.length > 0) {
            return reject(new Error('The response for ' + requestOptions.url + ' returned errors ' + JSON.stringify(result.errors)))
          }
          if (!Object.prototype.hasOwnProperty.call(result || {}, 'data')) {
            return reject(new Error('Unexpected result with no data. ' + JSON.stringify(result)))
          }
          return resolve(result.data)
        }

        logError(`utils.http: Error response from ${requestOptions.url}: ${statusCode} ${statusMessage}`)
        const bodySnippet = responseText ? ` ${responseText}` : ''
        return reject(new Error(`Error response for ${requestOptions.url} with status ${statusCode} ${statusMessage}${bodySnippet}`))
      })
    })
  }

  /**
     * Make a POST call.
     *
     * @param url The target url.
     * @param data The body data.
     */
  http.post = async (url, data) => {
    return await http.call({
      method: 'POST',
      url,
      body: JSON.stringify(data)
    })
  }

  /**
     * Makes a put call.
     *
     * @param url The target url.
     */
  http.put = async (url, data) => {
    return await http.call({
      method: 'PUT',
      url,
      body: JSON.stringify(data)
    })
  }

  /**
     * Makes a get call.
     *
     * @param url The target url.
     */
  http.get = async (url) => {
    return await http.call({
      method: 'GET',
      url
    })
  }
  /**
      * Makes a delete call.
      *
      * @param url The target url.
      */
  http.delete = async (url) => {
    return await http.call({
      method: 'DELETE',
      url
    })
  }

  return http
}

/**
* Get Bridgedetails
*
* @param _ip The target ip.
*/
module.exports.getBridgeDetails = async (_ip) => {
  return new Promise((resolve, reject) => {
    const opt = {}
    opt.method = 'GET'
    opt.rejectUnauthorized = false
    opt.url = 'https://' + _ip + '/api/0/config'
    simpleget.concat(opt, (err, res, data) => {
      if (err) return reject(new Error(err.message || 'getBridgeDetails general error'))

      const statusCode = res?.statusCode ?? 0
      const statusMessage = res?.statusMessage || ''
      const responseText = Buffer.isBuffer(data) ? data.toString('utf8') : String(data ?? '')

      if (statusCode < 200 || statusCode >= 400) {
        return reject(new Error('Error response for ' + opt.url + ' with status ' + statusCode + ' ' + statusMessage))
      }

      try {
        const result = JSON.parse(responseText)
        if (result?.errors && Array.isArray(result.errors) && result.errors.length > 0) {
          return reject(new Error('The response for ' + opt.url + ' returned errors ' + JSON.stringify(result.errors)))
        }
        if (!result) {
          return reject(new Error('Unexpected result with no data. ' + JSON.stringify(result)))
        }
        return resolve(result)
      } catch (error) {
        return reject(new Error(`Invalid Hue bridge configuration response: ${error.message}`))
      }
    })
  })
}

/**
* Register a new application user on the Hue bridge.
*
* @param {string} ip Bridge IP address.
* @param {string} appName Application name (used for devicetype).
* @param {string} deviceName Device name (used for devicetype).
* @returns {Promise<{bridge: object, user: {username: string, clientkey?: string}}>}
*/
module.exports.registerBridgeUser = async (ip, appName = 'KNXUltimate', deviceName = 'Node-RED') => {
  const deviceType = `${appName}#${deviceName}`.substring(0, 40)
  const payload = JSON.stringify({
    devicetype: deviceType,
    generateclientkey: true
  })

  const postOptions = {
    method: 'POST',
    url: `https://${ip}/api`,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload
  }

  const postResponse = await new Promise((resolve, reject) => {
    simpleget.concat(postOptions, (err, res, data) => {
      if (err) {
        return reject(new Error(err.message || 'Hue registration request failed'))
      }
      if (!res || res.statusCode < 200 || res.statusCode >= 400) {
        return reject(new Error(`Hue registration request failed with status ${res?.statusCode ?? 'unknown'}`))
      }
      try {
        const parsed = JSON.parse(data)
        resolve(parsed)
      } catch (parseError) {
        reject(new Error(`Invalid Hue registration response: ${parseError.message}`))
      }
    })
  })

  if (!Array.isArray(postResponse) || postResponse.length === 0) {
    throw new Error('Unexpected Hue registration response')
  }
  const firstEntry = postResponse[0]
  if (firstEntry.error) {
    throw new Error(firstEntry.error.description || 'Hue Bridge rejected the registration request. Press the link button and try again.')
  }
  const success = firstEntry.success || {}
  if (!success.username) {
    throw new Error('Hue Bridge did not return a username.')
  }

  const username = success.username
  const clientkey = success.clientkey

  const configOptions = {
    method: 'GET',
    url: `https://${ip}/api/${username}/config`,
    rejectUnauthorized: false
  }

  const bridgeConfig = await new Promise((resolve, reject) => {
    simpleget.concat(configOptions, (err, res, data) => {
      if (err) return reject(new Error(err.message || 'Unable to read Hue bridge configuration'))
      if (!res || res.statusCode < 200 || res.statusCode >= 400) {
        return reject(new Error(`Hue bridge configuration request failed with status ${res?.statusCode ?? 'unknown'}`))
      }
      try {
        const parsed = JSON.parse(data)
        resolve(parsed)
      } catch (parseError) {
        reject(new Error(`Invalid Hue bridge configuration response: ${parseError.message}`))
      }
    })
  })

  return {
    bridge: bridgeConfig,
    user: { username, clientkey }
  }
}

/**
* Discover Hue bridges using the public discovery service.
* @returns {Promise<Array<{id?: string, internalipaddress?: string}>>}
*/
module.exports.discoverHueBridges = async () => {
  return await new Promise((resolve, reject) => {
    const opt = {
      method: 'GET',
      url: 'https://discovery.meethue.com',
      rejectUnauthorized: false
    }
    simpleget.concat(opt, (err, res, data) => {
      if (err) {
        return reject(new Error(err.message || 'Unable to reach discovery.meethue.com'))
      }
      if (!res || res.statusCode < 200 || res.statusCode >= 400) {
        return reject(new Error(`Discovery request failed with status ${res?.statusCode ?? 'unknown'}`))
      }
      try {
        const parsed = JSON.parse(data)
        if (!Array.isArray(parsed)) {
          return reject(new Error('Unexpected discovery response'))
        }
        resolve(parsed)
      } catch (parseError) {
        reject(new Error(`Invalid discovery response: ${parseError.message}`))
      }
    })
  })
}
