/**
  * @param {object} [_oNode]
  * @param {any} [jsValue]
  */
exports.Manipulate = function roundPayload(_oNode, jsValue) {
    // 19/01/2023 FORMATTING THE OUTPUT PAYLOAD BASED ON SINGLE NODE SETUP
    //*********************************************************
    // Formatting the msg output value
    try {
        if (_oNode !== null && jsValue !== null) {
            if (typeof jsValue === 'number' && _oNode.formatmultiplyvalue !== undefined && _oNode.formatdecimalsvalue !== undefined && _oNode.formatnegativevalue !== undefined) {
                // multiplier
                jsValue = jsValue * _oNode.formatmultiplyvalue
                // Number of decimals
                if (_oNode.formatdecimalsvalue == 999) {
                    // Leave as is
                } else {
                    // Round
                    // jsValue = +(Math.round(jsValue + "e+" + _oNode.formatdecimalsvalue) + "e-" + _oNode.formatdecimalsvalue);
                    const iMigliaia = parseInt('1' + '0'.repeat(_oNode.formatdecimalsvalue))
                    jsValue = Math.round(jsValue * iMigliaia) / iMigliaia
                }
                // leave, zero or abs
                if (jsValue < 0) {
                    if (_oNode.formatnegativevalue == 'zero') {
                        jsValue = 0
                    } else if (_oNode.formatnegativevalue == 'abs') {
                        jsValue = Math.abs(jsValue)
                    }
                }
            }
            return jsValue
        } else {
            return null
        }
    } catch (error) {
        return jsValue
    }
    //*********************************************************
}