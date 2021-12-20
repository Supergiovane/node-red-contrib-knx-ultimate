
class KNXDataBuffer {
    constructor(_data, _info) {
        this._data = _data;
        this._info = _info;
    }
    get length() {
        return this._data == null ? 0 : this._data.length;
    }
    get value() {
        return this._data;
    }
    get info() {
        return this._info;
    }
    sixBits() {
        if (this.info == null) {
            return true;
        }
        //return !(this.info.type.type === '1');
        return this.info.type.type;
    }
}
exports.KNXDataBuffer = KNXDataBuffer;
