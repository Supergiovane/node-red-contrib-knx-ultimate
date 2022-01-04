'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPDU = void 0;
const CEMIConstants = require("./CEMIConstants");
const KNXDataBuffer = require("../KNXDataBuffer");
const sysLogger = require("./../../KnxLog.js").get(); // 08/04/2021 new logger to adhere to the loglevel selected in the config-window            


class NPDU {
    constructor(_tpci = 0x0, _apci = 0x0, _data = null) {
        this._tpci = _tpci;
        this._apci = _apci;
        this._data = _data;
    }
    set tpci(tpci) {
        if (isNaN(tpci) || (tpci < 0 && tpci > 0xFF)) {
            throw new Error('Invalid TPCI');
        }
        this._tpci = tpci;
    }
    get tpci() {
        return this._tpci;
    }
    set apci(apci) {
        if (isNaN(apci) || (apci < 0 && apci > 0xFF)) {
            throw new Error('Invalid APCI');
        }
        this._apci = apci;
    }
    get apci() {
        return this._apci;
    }
    get dataBuffer() {
        return this._data;
    }
    get dataValue() {
        if (this._data == null) {
            const val = this.apci & 0x3F;
            return Buffer.alloc(1, val);
        }
        return this._data.value;
    }
    set data(data) {
        if (data == null) {
            this._data = null;
            return;
        }
        if (!(data instanceof KNXDataBuffer.KNXDataBuffer)) {
            throw new Error('Invalid data Buffer');
        }

        if (data.sixBits() && data.length === 1 && data.value.readUInt8(0) < 0x3F) {
            this.apci = (this.apci & 0xC0) | data.value.readUInt8(0);
            this._data = null;
            return;
        }

        this._data = data;
    }
    get length() {
        if (this._data === null) {
            return 3;
        }
        return 3 + this._data.length;
    }
    get action() {
        return ((this.apci & 0xC0) >> 6) | ((this.tpci & 0x3) << 2);
    }
    set action(action) {
        this.tpci = (action & 0xC) << 4;
        if (this.action === NPDU.GROUP_READ || this.action >= NPDU.INDIVIDUAL_WRITE) {
            this.apci = (action & 0x3) << 6;
        }
        else {
            this.apci = ((action & 0x3) << 6) | (this.apci & 0x3F);
        }
    }
    get isGroupRead() {
        return this.action === NPDU.GROUP_READ;
    }
    get isGroupWrite() {
        return this.action === NPDU.GROUP_WRITE;
    }
    get isGroupResponse() {
        return this.action === NPDU.GROUP_RESPONSE;
    }
    static get GROUP_READ() {
        return CEMIConstants.CEMIConstants.GROUP_READ;
    }
    static get GROUP_RESPONSE() {
        return CEMIConstants.CEMIConstants.GROUP_RESPONSE;
    }
    static get GROUP_WRITE() {
        return CEMIConstants.CEMIConstants.GROUP_WRITE;
    }
    static get INDIVIDUAL_WRITE() {
        return CEMIConstants.CEMIConstants.INDIVIDUAL_WRITE;
    }
    static get INDIVIDUAL_READ() {
        return CEMIConstants.CEMIConstants.INDIVIDUAL_READ;
    }
    static get INDIVIDUAL_RESPONSE() {
        return CEMIConstants.CEMIConstants.INDIVIDUAL_RESPONSE;
    }
    static get TPCI_UNUMBERED_PACKET() {
        return CEMIConstants.CEMIConstants.TPCI_UNUMBERED_PACKET;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset > buffer.length) {
            if (sysLogger !== undefined && sysLogger !== null) sysLogger.error("NPDU: createFromBuffer: offset out of buffer range ");
            throw new Error(`offset ${offset}  out of buffer range ${buffer.length}`);
        }
        let npduLength = null;
        let tpci = null;
        let apci = null;
        let data = null;

        try {
            npduLength = buffer.readUInt8(offset++);
        } catch (error) {
            if (sysLogger !== undefined && sysLogger !== null) sysLogger.error("NPDU: createFromBuffer: error npduLength: " + error.message);
        }
        try {
            tpci = buffer.readUInt8(offset++);
        } catch (error) {
            if (sysLogger !== undefined && sysLogger !== null) sysLogger.error("NPDU: createFromBuffer: error tpci: " + error.message);
        }
        try {
            apci = buffer.readUInt8(offset++);
        } catch (error) {
            if (sysLogger !== undefined && sysLogger !== null) sysLogger.error("NPDU: createFromBuffer: error apci: " + error.message);
        }
        try {
            data = npduLength > 1 ? buffer.slice(offset, offset + npduLength - 1) : null;
        } catch (error) {
            if (sysLogger !== undefined && sysLogger !== null) sysLogger.error("NPDU: createFromBuffer: error data: " + error.message);
        }
        return new NPDU(tpci, apci, data == null ? null : new KNXDataBuffer.KNXDataBuffer(data));
    }
    toBuffer() {
        const length = this._data == null ? 1 : this._data.length + 1;
        const buffer = Buffer.alloc(3);
        buffer.writeUInt8(length, 0);
        buffer.writeUInt8(this.tpci, 1);
        buffer.writeUInt8(this.apci, 2);
        if (length === 1) {
            return buffer;
        }
        return Buffer.concat([buffer, this._data.value]);
    }
}
exports.NPDU = NPDU;
//# sourceMappingURL=NPDU.js.map