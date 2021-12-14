'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HPAI = exports.KnxProtocol = void 0;
const KNXConstants = require("./KNXConstants");
const HPAI_STRUCTURE_LENGTH = 8;
var KnxProtocol;
(function (KnxProtocol) {
    KnxProtocol[KnxProtocol["IPV4_UDP"] = KNXConstants.KNX_CONSTANTS.IPV4_UDP] = "IPV4_UDP";
    KnxProtocol[KnxProtocol["IPV4_TCP"] = KNXConstants.KNX_CONSTANTS.IPV4_TCP] = "IPV4_TCP";
})(KnxProtocol = exports.KnxProtocol || (exports.KnxProtocol = {}));
class HPAI {
    constructor(_host, _port = KNXConstants.KNX_CONSTANTS.KNX_PORT, _protocol = KNXConstants.KNX_CONSTANTS.IPV4_UDP) {
        this._port = _port;
        this._protocol = _protocol;
        this.host = _host;
    }
    set protocol(proto) {
        this._protocol = proto;
    }
    get protocol() {
        return this._protocol;
    }
    set port(port) {
        if (isNaN(port) || typeof (port) !== 'number' || port < 0 || port > 65535) {
            throw new Error(`Invalid port ${port}`);
        }
        this._port = port;
    }
    get port() {
        return this._port;
    }
    get header() {
        return this._header;
    }
    set host(host) {
        if (host == null) {
            throw new Error('Host undefined');
        }
        const m = host.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
        if (m === null) {
            throw new Error(`Invalid host format - ${host}`);
        }
        this._host = host;
        this._splitHost = m;
    }
    get host() {
        return this._host;
    }
    get length() {
        return HPAI_STRUCTURE_LENGTH;
    }
    static get NULLHPAI() {
        const NULLHPAI = new HPAI('0.0.0.0', 0);
        return NULLHPAI;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const structureLength = buffer.readUInt8(offset);
        if (offset + structureLength > buffer.length) {
            throw new Error(`offset ${offset} block length: ${structureLength} out of buffer range ${buffer.length}`);
        }
        offset++;
        const protocol = buffer.readUInt8(offset);
        offset += 1;
        const ip = [];
        for (let i = 1; i <= 4; i++) {
            ip.push(buffer.readUInt8(offset));
            offset += 1;
        }
        const port = buffer.readUInt8(offset);
        const host = ip.join('.');
        return new HPAI(host, port, protocol);
    }
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        let offset = 0;
        buffer.writeUInt8(this.length, offset);
        offset += 1;
        buffer.writeUInt8(this.protocol, offset);
        offset += 1;
        for (let i = 1; i <= KNXConstants.KNX_CONSTANTS.IPV4_ADDRESS_LENGTH; i++) {
            buffer.writeUInt8(Number(this._splitHost[i]), offset);
            offset += 1;
        }
        buffer.writeUInt16BE(this.port, offset);
        return buffer;
    }
}
exports.HPAI = HPAI;
//# sourceMappingURL=HPAI.js.map