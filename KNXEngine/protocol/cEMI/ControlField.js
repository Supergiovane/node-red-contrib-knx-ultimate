"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlField = exports.Priority = exports.OnOff = exports.FrameType = void 0;
const CONTROL_LENGTH = 2;
var FrameType;
(function (FrameType) {
    FrameType[FrameType["type0"] = 0] = "type0";
    FrameType[FrameType["type1"] = 1] = "type1";
})(FrameType = exports.FrameType || (exports.FrameType = {}));
var OnOff;
(function (OnOff) {
    OnOff[OnOff["off"] = 0] = "off";
    OnOff[OnOff["on"] = 1] = "on";
})(OnOff = exports.OnOff || (exports.OnOff = {}));
var Priority;
(function (Priority) {
    Priority[Priority["Prio0"] = 0] = "Prio0";
    Priority[Priority["Prio1"] = 1] = "Prio1";
    Priority[Priority["Prio2"] = 2] = "Prio2";
    Priority[Priority["Prio3"] = 3] = "Prio3";
})(Priority = exports.Priority || (exports.Priority = {}));
class ControlField {
    constructor(control1 = ControlField.DEFAULT_CONTROL1, control2 = ControlField.DEFAULT_CONTROL2) {
        this.control1 = control1;
        this.control2 = control2;
        this.length = CONTROL_LENGTH;
    }
    set frameType(frameType) {
        this.control1 = (this.control1 & 0x7F) | (Number(frameType) << 7);
    }
    get frameType() {
        return (this.control1 & 0x80) >> 7;
    }
    set repeat(repeat) {
        this.control1 = (this.control1 & 0xDF) | (Number(repeat) << 5);
    }
    get repeat() {
        return (this.control1 & 0x20) >> 5;
    }
    set broadcast(broadcast) {
        this.control1 = (this.control1 & 0xEF) | (Number(broadcast) << 4);
    }
    get broadcast() {
        return (this.control1 & 0x10) >> 4;
    }
    set priority(priority) {
        this.control1 = (this.control1 & 0xF3) | (Number(priority) << 2);
    }
    get priority() {
        return (this.control1 & 0x0C) >> 2;
    }
    set ack(ack) {
        this.control1 = (this.control1 & 0xFD) | (Number(ack) << 1);
    }
    get ack() {
        return (this.control1 & 0x02) >> 1;
    }
    set error(error) {
        this.control1 = (this.control1 & 0xFE) | Number(error);
    }
    get error() {
        return this.control1 & 0x01;
    }
    set addressType(type) {
        this.control2 = (this.control2 & 0x7F) | (Number(type) << 7);
    }
    get addressType() {
        return (this.control2 & 0x80) >> 7;
    }
    set hopCount(hopCount) {
        if (isNaN(hopCount) || (hopCount < 0 && hopCount > 7)) {
            throw new Error('Invalid hop count');
        }
        this.control2 = (this.control2 & 0x8F) | (Number(hopCount) << 4);
    }
    get hopCount() {
        return (this.control2 & 0x70) >> 4;
    }
    set frameFormat(format) {
        if (isNaN(format) || (format < 0 && format > 15)) {
            throw new Error('Invalid frame format');
        }
        this.control2 = (this.control2 & 0xF0) | Number(format);
    }
    get frameFormat() {
        return this.control2 & 0xF;
    }
    static get DEFAULT_CONTROL1() {
        return 0xBE;
    }
    static get DEFAULT_CONTROL2() {
        return 0xE0;
    }
    static createFromBuffer(buffer, offset = 0) {
        if (offset + CONTROL_LENGTH >= buffer.length) {
            throw new Error(`offset ${offset} out of buffer range ${buffer.length}`);
        }
        const control1 = buffer.readUInt8(offset++);
        const control2 = buffer.readUInt8(offset);
        return new ControlField(control1, control2);
    }
    toBuffer() {
        const buffer = Buffer.alloc(this.length);
        buffer.writeUInt8(this.control1, 0);
        buffer.writeUInt8(this.control2, 1);
        return buffer;
    }
}
exports.ControlField = ControlField;
//# sourceMappingURL=ControlField.js.map