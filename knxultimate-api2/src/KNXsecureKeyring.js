/**
* KNX Secure protocol stack in pure Javascript
* (C) 2021 Supergiovane
*/

// https://support.knx.org/hc/it/articles/360001582259-Usare-keyring-al-di-f//uori-di-ETS-Falcon-SDK
const KnxLog = require('./KnxLog');
const xml2js = require("xml2js");
const CryptoJS = require('crypto-js');
const keyringSalt = "1.keyring.ets.knx.org";
class retJson {
    constructor() {
        this.ETSProjectName = "";
        this.ETSCreated = "";
        this.ETSCreatedBy = "";
        this.HASHkeyringPasswordBase64 = "";
        this.HASHCreatedBase64 = "";

        // Backbone:
        this.BACKBONEmulticastAddress = "";
        this.BACKBONElatency = 0;
        this.BACKBONEkeyBase64 = "";

    }
}
// Class returned by the keyring function after the load
var _retJson = new retJson();

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

                resolve(CryptoJS.enc.Base64.stringify(decrypted));
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

    // Read the XML text
    // Returns an object with all necessary info, or error if the keyring password is wrong or something is going bad
    async function load(_sXML, keyringPassword) {

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


        KnxLog.get().info("Keyring for ETS proj " + _retJson.ETSProjectName + ", created by " + createdBy + " on " + created);
        try {
            // Get the hash from the keyring password
            passwordHash = await hashKeyringPwd(keyringPassword);
            _retJson.HASHkeyringPasswordBase64 = passwordHash;
            KnxLog.get().debug("passwordHash", passwordHash, "keyringPassword", keyringPassword) // OK !!!!
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

        if (keyringPassword.length > 0) {
            try {
                await verifySignature(passwordHash);
                KnxLog.get().debug("verifySignature OK");
            } catch (error) {
                KnxLog.get().error("signature verification failed for keyring " + keyringPassword);
                throw (new Error("The password is wrong"));
            }
        }

        // Get the BACKBONE details OK !!!!!
        try {
            _retJson.BACKBONEmulticastAddress = jSonXMLKeyringFile.Keyring.Backbone.$.MulticastAddress;
            _retJson.BACKBONElatency = jSonXMLKeyringFile.Keyring.Backbone.$.Latency;
            _retJson.BACKBONEkeyBase64 = await decryptKey(jSonXMLKeyringFile.Keyring.Backbone.$.Key, passwordHash, createdHash);
        } catch (error) {
            KnxLog.get().error("Backbone details " + error.message);
            throw (new Error("Backbone details " + error.message));
        }


        return _retJson;

    }




    return {

        load: load
    };

})();

module.exports = keyring;