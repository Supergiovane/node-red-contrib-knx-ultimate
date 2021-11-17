/**
* KNX Secure protocol stack in pure Javascript (C) 2021 Supergiovane
*/


//
// The function returns this JSON (with ETS Keyring password "banana"):
//
// retJson {
//     ETSProjectName: 'KNX Secure',
//     ETSCreated: '2021-11-17T07:43:08',
//     ETSCreatedBy: 'ETS 5.7.6 (Build 1398)',
//     HASHkeyringPasswordBase64: '08qj3lhCDI1zINbqanGlaQ==',
//     HASHCreatedBase64: 'bX2hbMK6AR9l/U9ATjbwlA==',
//     backbone: {
//       multicastAddress: '224.0.23.12',
//       latency: '2000',
//       key: '28bd8f6fb56881eb8b4b3e3aec960f13'
//     },
//     interfaces: [
//       {
//         individualAddress: '3.1.2',
//         type: 'Tunneling',
//         host: '3.1.1',
//         userID: '2',
//         managementPassword: '.!Pea332',
//         authenticationPassword: 'autenticazione'
//       },
//       {
//         individualAddress: '3.1.3',
//         type: 'Tunneling',
//         host: '3.1.1',
//         userID: '3',
//         managementPassword: '6Y*xu2QN',
//         authenticationPassword: 'autenticazione'
//       },
//       {
//         individualAddress: '3.1.4',
//         type: 'Tunneling',
//         host: '3.1.1',
//         userID: '4',
//         managementPassword: '7e#qfoGG',
//         authenticationPassword: 'autenticazione'
//       },
//       {
//         individualAddress: '3.1.5',
//         type: 'Tunneling',
//         host: '3.1.1',
//         userID: '5',
//         managementPassword: 'WC@rJrl*',
//         authenticationPassword: 'autenticazione'
//       },
//       {
//         individualAddress: '3.1.6',
//         type: 'Tunneling',
//         host: '3.1.1',
//         userID: '6',
//         managementPassword: '."M1Cmjr',
//         authenticationPassword: 'autenticazione'
//       },
//       {
//         individualAddress: '3.1.7',
//         type: 'Tunneling',
//         host: '3.1.1',
//         userID: '7',
//         managementPassword: '+-Ikuj y',
//         authenticationPassword: 'autenticazione'
//       },
//       {
//         individualAddress: '3.1.8',
//         type: 'Tunneling',
//         host: '3.1.1',
//         userID: '8',
//         managementPassword: '4NV@Xp=(',
//         authenticationPassword: 'autenticazione'
//       },
//       {
//         individualAddress: '3.1.9',
//         type: 'Tunneling',
//         host: '3.1.1',
//         userID: '9',
//         managementPassword: '"3CDfNH3',
//         authenticationPassword: 'autenticazione'
//       }
//     ],
//     groupAddresses: [
//       { address: '8/0/0', key: '313681939762ff36fdcd774efec56d1b' },
//       { address: '8/0/1', key: 'e990d57b3630bc4940a40d0c7caa3698' },
//       { address: '8/0/2', key: 'cc0e1a6204d5c4623626b1ccc1069b63' }
//     ],
//     Devices: [
//       {
//         individualAddress: '3.1.1',
//         sequenceNumber: '121960556295',
//         toolKey: '51b52bef0f8d5b83f7975fb3c1d67f96',
//         managementPassword: 'commissione',
//         authenticationPassword: 'autenticazione'
//       },
//       {
//         individualAddress: '3.1.10',
//         sequenceNumber: '121960675276',
//         toolKey: 'db580560e32dc040d062e4f91bbf1182',
//         managementPassword: null,
//         authenticationPassword: null
//       },
//       {
//         individualAddress: '3.1.11',
//         sequenceNumber: '121960725775',
//         toolKey: 'f03ca86237705ed9d7014627fb16f88a',
//         managementPassword: null,
//         authenticationPassword: null
//       }
//     ]
//   }

// https://support.knx.org/hc/it/articles/360001582259-Usare-keyring-al-di-fuori-di-ETS-Falcon-SDK
const KnxLog = require('./KnxLog');
const xml2js = require("xml2js");
const CryptoJS = require('crypto-js');
const { debug } = require('console');
const KnxConstants = require('./KnxConstants.js')
const Address = require('./Address.js')

const keyringSalt = "1.keyring.ets.knx.org";

// Class returned by the keyring function after the load
var _retJson = {};

var signature = "";
var createdHash = "";
var passwordHash = "";
var jSonXMLKeyringFile = {};// Holds the Keyring XML in JSON Format
var XMLKeyringFileString = ""; // Holds the Keyring XML in string Format

async function xml2json(_sXML) {

    return new Promise((resolve, reject) => {
        try {
            xml2js.Parser({ explicitArray: false }).parseString(_sXML, function (err, json) {
                if (err)
                    reject(err);
                else
                    resolve(json);
            });
        } catch (error) {
            reject(error)
        }

    });
}


var keyring = (function () {



    // Return byte, input char[] password, byte[] salt
    async function pbkdf2WithHmacSha256(password, salt) {
        const iterations = 65536;
        const keyLength = 4;
        if ((password == null) || (password.length === 0)) {
            password = "\0";
        }
        try {
            //password = CryptoJS.enc.Base64.parse(key);
            var secretKey = CryptoJS.PBKDF2(password, salt, {
                keySize: keyLength,
                iterations: iterations,
                hasher: CryptoJS.algo.SHA256,
                padding: CryptoJS.pad.NoPadding
            });
            return secretKey.toString(CryptoJS.enc.Base64)
        }
        catch (error) {
            KnxLog.get().error("pbkdf2WithHmacSha256 " + error.message);
            throw error;
        }
    }

    // Return bytes
    async function sha256(_input) {
        return new Promise((resolve, reject) => {
            try {
                let hash = CryptoJS.SHA256(_input);
                let buffer = Buffer.from(hash.toString(CryptoJS.enc.Hex), 'hex');
                buffer = buffer.slice(0, 16);
                resolve(buffer.toString("base64"));
            } catch (error) {
                reject(error);
            }
        });
    }

    // Return byte, input char[]
    async function hashKeyringPwd(keyringPwd) {
        try {
            return pbkdf2WithHmacSha256(keyringPwd, keyringSalt);
        }
        catch (error) {
            KnxLog.get().error("hashKeyringPwd " + error.message);
            throw error;
        }
    }



    // private static byte[] aes128Cbc(final byte[] input, final byte[] key, final byte[] iv)
    // 		throws GeneralSecurityException {

    // 	final var cipher = Cipher.getInstance("AES/CBC/NoPadding");
    // 	final var keySpec = new SecretKeySpec(key, "AES");
    // 	final var params = new IvParameterSpec(iv);

    // 	cipher.init(Cipher.DECRYPT_MODE, keySpec, params);
    // 	return cipher.doFinal(input);
    // }
    async function aes128Cbc(_inputBase64, _pwdKeyringHashBase64, _createdHashBase64) {
        //var decrypted = CryptoJS.AES.decrypt(_input,_pwdKeyringHash,{iv:iv,padding:CryptoJS.pad.ZeroPadding});
        return new Promise((resolve, reject) => {
            try {
                var decrypted = CryptoJS.AES.decrypt(_inputBase64,
                    CryptoJS.enc.Base64.parse(_pwdKeyringHashBase64),
                    { iv: CryptoJS.enc.Base64.parse(_createdHashBase64), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });

                //resolve(CryptoJS.enc.Base64.stringify(decrypted));
                resolve(CryptoJS.enc.Hex.stringify(decrypted));
            } catch (error) {
                KnxLog.get().error("aes128Cbc " + error)
                reject(error);
            }
        });

    }
    async function verifySignature(passwordHash) {
        let sRows = XMLKeyringFileString.split(">")
        let aFiltered = [];

        try {
            for (let index = 0; index < sRows.length; index++) {
                let sRow = sRows[index] + ">";
                let bEndElement = false;
                sRow = sRow.trim();
                // Clean close tags
                if (sRow !== "" && !sRow.startsWith("<?xml")) {
                    if (sRow.startsWith("<\/") || sRow.endsWith("\/>")) {
                        bEndElement = true;
                    }
                    if (sRow.startsWith("<") && !sRow.startsWith("<\/")) {
                        // START_ELEMENT
                        aFiltered.push(Uint8Array.from([1]));
                    }
                    if (!sRow.startsWith("<\/")) {
                        sRow = sRow.replace(/</g, '');
                        sRow = sRow.replace(/\/>/g, '');
                        sRow = sRow.replace(/>/g, '');
                        sRow = sRow.trim();
                        // sRow is something like this: Backbone MulticastAddress="224.0.23.12" Latency="1000" Key="VGnz2DbdiMqN5EE4I7tqLw=="

                        // Get the TAG
                        let sTag = "";
                        let sTemp = "";
                        let sAttribute = "";
                        let sValue = "";
                        // Find the TAG
                        for (let index = 0; index < sRow.length; index++) {
                            const _char = sRow[index];
                            if (_char !== " ") {
                                sTemp += _char;
                            } else {
                                // Got the tag
                                sTag = sTemp;
                                break;
                            }
                        }
                        if (sTag === "") sTag = sTemp; // In case of TAG without attributes
                        sTemp = "";
                        sRow = sRow.substring(sTag.length + 1); // Purge TAG

                        // Attributes and values MulticastAddress="224.0.23.12" Banana="22sdsf02312=="
                        let aAttribs = [];
                        do {
                            sAttribute = sRow.substring(0, sRow.indexOf("=")); // Get attribute
                            sRow = sRow.substring(sRow.indexOf("=") + 1).trim(); // Purge attribute
                            sValue = sRow.substring(0, sRow.indexOf("\"", 1) + 1); // Get value
                            sRow = sRow.substring(sValue.length + 1).trim(); // Purge value
                            sValue = sValue.replace(/\"/g, '');
                            if (sAttribute !== "xmlns" && sAttribute !== "Signature") {
                                aAttribs.push({ attlen: sAttribute.length, att: sAttribute, vallen: sValue.length, val: sValue });
                            }
                            sAttribute = "";
                            sValue = "";

                        } while (sRow.length > 0);

                        if (sTag.length > 0) {
                            aFiltered.push(Uint8Array.from([sTag.length]));
                            aFiltered.push(new TextEncoder().encode(sTag));
                        }

                        // Order the attribute array
                        let aAttribsSorted = aAttribs.sort((a, b) => (a.att > b.att) ? 1 : ((b.att > a.att) ? -1 : 0))
                        // Put all togheddder
                        for (let index = 0; index < aAttribsSorted.length; index++) {
                            const element = aAttribsSorted[index];
                            if (element.attlen > 0) {
                                aFiltered.push(Uint8Array.from([element.attlen]));
                                aFiltered.push(new TextEncoder().encode(element.att));
                                aFiltered.push(Uint8Array.from([element.vallen]));
                                aFiltered.push(new TextEncoder().encode(element.val));
                            }
                        }
                        // Add the end element tag.
                        if (bEndElement) {
                            // END_ELEMENT
                            aFiltered.push(Uint8Array.from([2]));
                            bEndElement = false;
                        }
                    } else {
                        // END_ELEMENT
                        aFiltered.push(Uint8Array.from([2]));
                    }

                }
            }

            // Add the has password
            aFiltered.push(Uint8Array.from([passwordHash.length]));
            aFiltered.push(new TextEncoder().encode(passwordHash))

            let buffKeyringFileForHashing = Buffer.concat(aFiltered);
            //KnxLog.get().error(Buffer.from(keyringFileForHashing).toString("hex"));
            let keyringFileForHashing = Buffer.from(buffKeyringFileForHashing).toString();

            let outputHash = await sha256(keyringFileForHashing);
            if (outputHash === signature) {
                return true;
            } else {
                throw (new Error("verifySignature failed"));
            }

        } catch (error) {
            throw (new Error("verifySignature ") + error.message)
        }

    }

    /**
     * Decrypts a backbone key, tool key, or group address key using the keyring
     * password.
     *
     * @param _inputBase64           encrypted key
     * @param _pwdKeyringHashBase64 the password hash of this keyring
     * @param _createdHashBase64 the keyring created datetime hash
     * @return decrypted key base64
     */
    async function decryptKey(_inputBase64, _pwdKeyringHashBase64, _createdHashBase64) {
        try {
            return await aes128Cbc(_inputBase64, _pwdKeyringHashBase64, _createdHashBase64);
        } catch (error) {
            throw new Error("decryptKey " + error.message);
        } finally {
            //Arrays.fill(_pwdKeyringHash, (byte) 0);
        }
    }

    /**
     * Decrypts a user password, device authentication code, or commissioning password using the keyring password.
     *
     * @param _inputBase64           encrypted password
     * @param _pwdKeyringHashBase64 the password of this keyring
     * @param _createdHashBase64 the created hash
     * @return decrypted password in plain text
     */
    async function decryptPassword(_inputBase64, _pwdKeyringHashBase64, _createdHashBase64) {
        try {
            let pwdData = await extractPassword(await decryptKey(_inputBase64, _pwdKeyringHashBase64, _createdHashBase64));
            let ret = [];
            for (let index = 0; index < pwdData.length; index++) {
                const element = pwdData[index];
                ret += String.fromCharCode(pwdData[index] & 0xff);
            }
            return ret;
        } catch (error) {
            throw new Error("decrypting password data", error);
        }
    }

    // 18/11/2021 Estraggo la password smanettando sul range.
    async function extractPassword(data) {
        data = Buffer.from(data.toString("hex"), "hex");
        let b = data[data.length - 1] & 0xff;
        let range = await copyOfRange(data, 8, data.length - b);
        return range;
    }

    // 18/11/2021 Copy of array range. If _to is > _arr.length, append 0
    async function copyOfRange(_arr, _start, _to) {
        let ret = [];
        for (let index = _start; index < _to; index++) {
            try {
                ret.push(_arr[index]);
            } catch (error) {
                ret.push(0);
            }
        }
        return ret;
    }

    // Read the XML text
    // Returns an object with all necessary info, or error if the keyring password is wrong or something is going bad
    async function load(_sXML, _keyringPassword) {

        if (_keyringPassword === undefined) _keyringPassword = "";
        if (_sXML === undefined) _sXML = "";

        // All returned key are in base64 per comodità.
        try {
            jSonXMLKeyringFile = await xml2json(_sXML);
            XMLKeyringFileString = _sXML;
            _retJson.ETSProjectName = jSonXMLKeyringFile.Keyring.$.Project;
            var createdBy = jSonXMLKeyringFile.Keyring.$.CreatedBy;
            _retJson.ETSCreatedBy = createdBy;
            var created = jSonXMLKeyringFile.Keyring.$.Created;
            _retJson.ETSCreated = created;
        } catch (error) {
            KnxLog.get().error("load " + error.message);
            throw (error);
        }

        try {
            // Get the hash from the keyring password
            passwordHash = await hashKeyringPwd(_keyringPassword);
            _retJson.HASHkeyringPasswordBase64 = passwordHash;
            //KnxLog.get().debug("passwordHash", passwordHash, "keyringPassword", _keyringPassword) // OK !!!!
        } catch (error) {
            KnxLog.get().error("passwordHash " + error.message)
            throw (new Error("passwordHash " + error.message));
        }
        // Get the hash from the created tac
        createdHash = await sha256(created);
        _retJson.HASHCreatedBase64 = createdHash;
        KnxLog.get().debug("createdHash " + createdHash); // OK !!!

        // Get the signature from the KEYRING attribute
        signature = jSonXMLKeyringFile.Keyring.$.Signature.toString("base64");
        KnxLog.get().debug("signature " + signature); // OK !!!

        if (_keyringPassword.length > 0) {
            try {
                await verifySignature(passwordHash);
                KnxLog.get().debug("verifySignature OK");
            } catch (error) {
                KnxLog.get().error("signature verification failed for keyring " + _keyringPassword);
                throw (new Error("The password is wrong"));
            }
        }

        // Get the BACKBONE details OK !!!!!
        try {
            _retJson.backbone = {
                multicastAddress: jSonXMLKeyringFile.Keyring.Backbone.$.MulticastAddress,
                latency: jSonXMLKeyringFile.Keyring.Backbone.$.Latency,
                key: await decryptKey(jSonXMLKeyringFile.Keyring.Backbone.$.Key, passwordHash, createdHash)
            }
        } catch (error) {
            KnxLog.get().error("KNX-Secure: Backbone details " + error.message);
            throw (new Error("KNX-Secure: Backbone details " + error.message));
        }

        // Get the INTERFACES details
        // <Interface IndividualAddress="3.1.2" Type="Tunneling" Host="3.1.1" UserID="2" Password="gF8N8lKGU9cD3TNMLEvu50SbI48qI5EeC8WeciL53Zg=" Authentication="jHW6k+R/b+GOfdaNzXXildWI4BrqHkAoa6lUtWCGGDI=" />
        // this.interfaces = [{
        //     individualAddress: "",
        //     type: "",
        //     host: "",
        //     userID: "",
        //     managementPassword: "",
        //     authenticationPassword: ""
        // }];
        try {
            _retJson.interfaces = [];
            if (jSonXMLKeyringFile.Keyring.hasOwnProperty("Interface")) {
                for (let index = 0; index < jSonXMLKeyringFile.Keyring.Interface.length; index++) {
                    const element = jSonXMLKeyringFile.Keyring.Interface[index];
                    _retJson.interfaces.push({
                        individualAddress: element.$.IndividualAddress,
                        type: element.$.Type,
                        host: element.$.Host,
                        userID: element.$.UserID,
                        managementPassword: element.$.hasOwnProperty("Password") ? await decryptPassword(element.$.Password, passwordHash, createdHash) : null,
                        authenticationPassword: element.$.hasOwnProperty("Authentication") ? await decryptPassword(element.$.Authentication, passwordHash, createdHash) : null
                    })
                }
            }
        } catch (error) {
            KnxLog.get().error("KNX-Secure: Interfaces details " + error.message);
            throw (new Error("KNX-Secure: Interfaces details " + error.message));
        }


        // Get the GROUP ADDRESSES details
        // <Group Address="16384" Key="CreHKeXp+5U2qMLVU0XWxw==" />
        // this.groupAddresses = [{
        //     address: "",
        //     key: ""
        // }];
        try {
            _retJson.groupAddresses = [];
            if (jSonXMLKeyringFile.Keyring.hasOwnProperty("GroupAddresses")) {
                for (let index = 0; index < jSonXMLKeyringFile.Keyring.GroupAddresses.Group.length; index++) {
                    const element = jSonXMLKeyringFile.Keyring.GroupAddresses.Group[index];
                    _retJson.groupAddresses.push({
                        address: await getKNXAddressfromXML(element.$.Address),
                        key: element.$.hasOwnProperty("Key") ? await decryptKey(element.$.Key, passwordHash, createdHash) : null
                    })
                }
            }
        } catch (error) {
            KnxLog.get().error("KNX-Secure: GroupAddres details " + error.message);
            throw (new Error("KNX-Secure: GroupAddres details " + error.message));
        }

        // 18/11/2021 Recupero il gruppo dall'XML
        async function getKNXAddressfromXML(_rawAddress) {
            const digits = [];
            if (_rawAddress > 0x7FF) {
                digits.push((_rawAddress >> 11) & 0x1F);
            }
            digits.push((_rawAddress >> 8) & 0x07);
            digits.push(_rawAddress & 0xFF);
            return digits.join('/');
        }

        // Get the DEVICES details
        //  <Device IndividualAddress="3.1.1" ToolKey="T770+Sebf2zpx3X3A0S64A==" ManagementPassword="6LPLJeu+XxuGpn6tOqt9fw4NuSa/jIQCYXzFVDwPUiU=" Authentication="rywptqDB0/UNF/5VmlTs5YnrIqO9FJ3YGGEIm08Z1UQ=" SequenceNumber="121960556295" />
        // Devices:
        // this.devices = [{
        //     individualAddress: "",
        //     sequenceNumber: "",
        //     toolKey: "",
        //     managementPassword: "",
        //     authenticationPassword: ""
        // }];
        try {
            _retJson.Devices = [];
            if (jSonXMLKeyringFile.Keyring.hasOwnProperty("Devices")) {
                for (let index = 0; index < jSonXMLKeyringFile.Keyring.Devices.Device.length; index++) {
                    const element = jSonXMLKeyringFile.Keyring.Devices.Device[index];
                    _retJson.Devices.push({
                        individualAddress: element.$.IndividualAddress,
                        sequenceNumber: element.$.SequenceNumber,
                        toolKey: element.$.hasOwnProperty("ToolKey") ? await decryptKey(element.$.ToolKey, passwordHash, createdHash) : null,
                        managementPassword: element.$.hasOwnProperty("ManagementPassword") ? await decryptPassword(element.$.ManagementPassword, passwordHash, createdHash) : null,
                        authenticationPassword: element.$.hasOwnProperty("Authentication") ? await decryptPassword(element.$.Authentication, passwordHash, createdHash) : null
                    })
                }
            }
        } catch (error) {
            KnxLog.get().error("KNX-Secure: Devices details " + error.message);
            throw (new Error("KNX-Secure: Devices details " + error.message));
        }
        return _retJson;
    }




    return {

        load: load
    };

})();

module.exports = keyring;