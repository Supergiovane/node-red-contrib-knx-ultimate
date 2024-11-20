module.exports.ToBoolean = function ToBoolean(value, _configTranslationNode) {
  let res = false;
  let decimal = /^\s*[+-]{0,1}\s*([\d]+(\.[\d]*)*)\s*$/;

  if (typeof value === "boolean") {
    return value;
  } else if (typeof value === "string") {
    try {
      let translationTable = [];
      if (_configTranslationNode === null) {
        translationTable = DEFAULTTRANSLATIONINPUT.split("\n");
      } else {
        translationTable = _configTranslationNode.commandText.split("\n");
      }
      for (let index = 0; index < translationTable.length; index++) {
        let inputPayloadToBeTranslated = translationTable[index].split(":")[0];
        let outputBoolean = Boolean(translationTable[index].split(":")[1]);
        if (
          value.toLowerCase() === inputPayloadToBeTranslated.toLowerCase() &&
          inputPayloadToBeTranslated.toLowerCase() !== ""
        ) {
          return translationTable[index].split(":")[1] === "true"
            ? true
            : false;
        }
      }
    } catch (error) {
      console.log("Boolean-Logic-Ultimate:utils:toBoolean: " + error.message);
    }
  } else if (typeof value === "number") {
    // Is it formated as a decimal number?
    if (decimal.test(value)) {
      res = parseFloat(value) != 0;
    } else {
      res = value.toLowerCase() === "true";
    }
    return res;
  }
};

module.exports.fetchFromObject = function fetchFromObject(
  _msg,
  _payloadPropName
) {
  // The output cannot be an oblect. In case, return undefined.
  var _index = _payloadPropName.indexOf(".");
  if (_index > -1) {
    return fetchFromObject(
      _msg[_payloadPropName.substring(0, _index)],
      _payloadPropName.substr(_index + 1)
    );
  }
  if (typeof _msg[_payloadPropName] === "object") return undefined;
  return _msg[_payloadPropName];
};


const DEFAULTTRANSLATIONINPUT =
  "on:true\noff:false\nactive:true\ninactive:false\nopen:true\nclosed:false\nclose:false\n1:true\n0:false\ntrue:true\nfalse:false\nhome:true\nnot_home:false\nnormal:false\nviolated:true";

// 14/08/2019 Endpoint for retrieving the ethernet interfaces

module.exports.DiscoverKNXGateways = async function DiscoverKNXGateways() {
  if (bDiscoverKNXGatewaysRunning) return;
  bDiscoverKNXGatewaysRunning = true;
  const KNXClient = require('knxultimate');
  try {
    if (this.aDiscoveredknxGateways === undefined) {
      this.aDiscoveredknxGateways = await KNXClient.KNXClient.discover(2000);
      this.aDiscoveredknxGateways.push('224.0.23.12:3671:Multicast Address:15.15.199')
      bDiscoverKNXGatewaysRunning = false;
      return this.aDiscoveredknxGateways;
    } else {
      bDiscoverKNXGatewaysRunning = false;
      return this.aDiscoveredknxGateways;
    }
  } catch (error) { bDiscoverKNXGatewaysRunning = false; this.aDiscoveredknxGateways = []; return this.aDiscoveredknxGateways; }
}
let bDiscoverKNXGatewaysRunning = false;
module.exports.aDiscoveredknxGateways;

module.exports.getDiscoveredknxGateways = function () {
  return module.exports.aDiscoveredknxGateways;
};

module.exports.setDiscoveredknxGateways = function (value) {
  module.exports.aDiscoveredknxGateways = value;
};
