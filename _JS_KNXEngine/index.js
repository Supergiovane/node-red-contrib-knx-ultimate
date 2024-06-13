const { KNXClient, KNXClientEvents, getDecodedKeyring, appendPropertyToDecodedKeyring } = require("./src/KNXClient.js");
//const KNXSecureKeyring = require('./.knxultimate/KNXsecureKeyring.js');    
//exports.KNXSecureKeyring = KNXSecureKeyring;    

//exports.KNXClientEvents = KNXClient.KNXClientEvents;
try {
    exports.KNXClient = KNXClient;
    exports.KNXClient.KNXClientEvents = KNXClientEvents;
    exports.getDecodedKeyring = getDecodedKeyring;
    exports.appendPropertyToDecodedKeyring = appendPropertyToDecodedKeyring;
} catch (error) {
    console.log("index", error)
}


//exports.KNXClientEvents = KNXClientEvents;
