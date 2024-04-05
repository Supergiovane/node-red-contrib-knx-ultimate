/**
 * Promise wrapper around simple get. 
 * Modified code based on: https://github.com/rodney42/node-hue/blob/main/lib/http.js
 * Thank you rodney42
 */
const simpleget = require('simple-get');

module.exports.use = (config) => {
    let http = {};

    /**
     * Make a http call.
     * 
     * @param opt  Used as options for simple get.
     */
    http.call = async (opt) => {
        return new Promise((resolve, reject) => {
            opt.rejectUnauthorized = false;
            opt.headers = {
                'hue-application-key': config.key,
            };
            opt.url = config.prefix + opt.url;
            // log.trace('http ' + opt.method + ' ' + opt.url);
            simpleget.concat(opt, (err, res, data) => {
                try {
                    if (err) {
                        reject(err);
                    } else {
                        // log.trace('http data ' + data);
                        if (res.statusCode >= 100 && res.statusCode < 400) {
                            try {
                                let result = JSON.parse(data);
                                if (result.errors && result.errors.length > 0) {
                                    reject(new Error("The response for " + opt.url + " returned errors " + JSON.stringify(result.errors)));
                                }
                                if (!result.data) {
                                    reject(new Error("Unexpected result with no data. " + JSON.stringify(result)));
                                }
                                resolve(result.data);
                            } catch (error) {
                                RED.log.error(`utils.https: config.http.call: let result = JSON.parse(data); =: ${error.message} : ${error.stack || ""} `);
                            }
                        } else {
                            reject(new Error("Error response for " + opt.url + " with status " + res.statusCode + " " + res.statusMessage));
                        }
                    }
                } catch (error) { }
            });
        });
    };

    /**
     * Make a POST call.
     *
     * @param url The target url.
     * @param data The body data.
     */
    http.post = async (url, data) => {
        return await http.call({
            method: 'POST',
            url: url,
            body: JSON.stringify(data),
        });
    };

    /**
     * Makes a put call.
     *
     * @param url The target url.
     */
    http.put = async (url, data) => {
        return await http.call({
            method: 'PUT',
            url: url,
            body: JSON.stringify(data),
        });
    };

    /**
     * Makes a get call.
     *
     * @param url The target url.
     */
    http.get = async (url) => {
        return await http.call({
            method: 'GET',
            url: url,
        });
    };
    /**
      * Makes a delete call.
      * 
      * @param url The target url.
      */
    http.delete = async (url) => {
        return await http.call({
            method: 'DELETE',
            url: url,
        });
    };

    return http;
};