'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CEMIFactory = void 0;
const CEMIConstants = require("./CEMIConstants");
const LDataInd = require("./LDataInd");
const LDataCon = require("./LDataCon");
const LDataReq = require("./LDataReq");
const ControlField = require("./ControlField");
const NPDU = require("./NPDU");
class CEMIFactory {
    static createFromBuffer(type, buffer, offset) {
        switch (type) {
            case CEMIConstants.CEMIConstants.L_DATA_IND:
                return LDataInd.LDataInd.createFromBuffer(buffer, offset);
            case CEMIConstants.CEMIConstants.L_DATA_CON:
                return LDataCon.LDataCon.createFromBuffer(buffer, offset);
            case CEMIConstants.CEMIConstants.L_DATA_REQ:
                return LDataReq.LDataReq.createFromBuffer(buffer, offset);
            default:
                throw new Error(`Unsupported type cEMI message type ${type}`);
        }
    }
    static newLDataRequestMessage(requestType, srcAddress, dstAddress, data) {
 
        const controlField = new ControlField.ControlField();
       
        const npdu = new NPDU.NPDU();
        npdu.tpci = NPDU.NPDU.TPCI_UNUMBERED_PACKET;

        // 06/12/2021
        if (requestType === "write") npdu.action = NPDU.NPDU.GROUP_WRITE; // 2
        if (requestType === "response") npdu.action = NPDU.NPDU.GROUP_RESPONSE; // 1
        if (requestType === "read") npdu.action = NPDU.NPDU.GROUP_READ; // 0

        npdu.data = data;
        return new LDataReq.LDataReq(null, controlField, srcAddress, dstAddress, npdu);
    }
    
    // 18/12/2021 New
    static newLDataIndicationMessage(requestType, srcAddress, dstAddress, data) {
 
        const controlField = new ControlField.ControlField();
       
        const npdu = new NPDU.NPDU();
        npdu.tpci = NPDU.NPDU.TPCI_UNUMBERED_PACKET;

        // 06/12/2021
        if (requestType === "write") npdu.action = NPDU.NPDU.GROUP_WRITE; // 2
        if (requestType === "response") npdu.action = NPDU.NPDU.GROUP_RESPONSE; // 1
        if (requestType === "read") npdu.action = NPDU.NPDU.GROUP_READ; // 0

        npdu.data = data;
        return new LDataInd.LDataInd(null, controlField, srcAddress, dstAddress, npdu);
    }

}
exports.CEMIFactory = CEMIFactory;
//# sourceMappingURL=CEMIFactory.js.map