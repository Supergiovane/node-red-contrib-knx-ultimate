

const http2 = require('node:http2');
//import http2, { ClientHttp2Session, IncomingHttpHeaders, IncomingHttpStatusHeader } from "http2";

class Http2Client {
    /**
    * Parameters.
    *
    * @param config.key the credentualskey.
    * @param config.url the bridge's URL
    * @param config.path the resource url
    * @param options the standard http2 options
    */
    constructor(config, options) {
        options.rejectUnauthorized = false;
        options.headers = {
            'hue-application-key': config.key,
        };
        this.bridgeKey = config.key;
        this.http2Connection = http2.connect(config.url, options);
        this.http2Connection.on('error', (err) => {
            console.error(err);
            this.http2Connection.close();
        });
    }

    async get(path, headers) {
        await this.executeRequest({ ":method": "GET", ':path': path, ...headers });
    }


    async put(path, headers, body) {
        await this.executeRequest({ ":method": "PUT", ':path': path, ...headers }, body);
    }

    async post(path, headers, body) {
        await this.executeRequest({ ":method": "POST", ':path': path, ...headers }, body);
    }

    async delete(path, headers) {
        await this.executeRequest({ ":method": "DELETE", ':path': path, ...headers });
    }

    executeRequest(headers, body) {
        headers['headers'] = {
            'hue-application-key': this.bridgeKey
        };
        return new Promise((resolve, reject) => {
            const stream = this.http2Connection.request(headers);
            if (body !== undefined) {
                stream.write(JSON.stringify(body), 'utf8');
            }

            stream.setEncoding('utf8');
            let response = {
                headers: {},
                data: ""
            }
            stream.on('response', (responseHeaders) => {
                response.headers = responseHeaders;
            });

            stream.on('data', (chunk) => {
                response.data += chunk;
            });

            stream.on('end', () => {
                stream.close();
                resolve(response.data);
            });

            stream.on('error', (e) => {
                reject(e);
            });

            stream.end();
        });
    }


    createEventSource(path, headers, onData, onClose) {
        const stream = this.http2Connection.request({ ":method": "GET", ':path': path, "Accept": "text/event-stream", ...headers });
        stream.setEncoding('utf8');

        // Each data event will contain a single event from the Hue bridge.
        stream.on('data', (data) => {
            onData(data);
        });
        stream.on('end', () => {
            stream.close();
            onClose();
        });
        stream.on('error', (error) => {
            console.error(error);
            stream.close();
            onClose(error);
        });
        stream.end();
    }

}
module.exports = Http2Client