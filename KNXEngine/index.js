const { KNXClient, KNXClientEvents } = require('./../KNXEngine/KNXClient.js')
const KNXSecureKeyring = require('./../KNXEngine/KNXsecureKeyring.js')
exports.KNXSecureKeyring = KNXSecureKeyring

// exports.KNXClientEvents = KNXClient.KNXClientEvents;
try {
  exports.KNXClient = KNXClient
  exports.KNXClient.KNXClientEvents = KNXClientEvents
} catch (error) {
  console.log('KNXSecureKeyring', error)
}

// exports.KNXClientEvents = KNXClientEvents;
