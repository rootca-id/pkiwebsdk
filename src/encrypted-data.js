"use strict";

/**
 * PKCS7
 *
 * @constructor
 */
var EncryptedData = function() {
}

/**
 * Encrypt data using PKCS7
 *
 * @param {Certificate} cert - Certificate object
 * @param {ArrayBuffer} content - Array buffer of data that will be encrypted
 * @returns {ArrayBuffer} - Array buffer of PKCS7 DER
 */

EncryptedData.encrypt = function (cert, content) {
  var self = this;
  return new Promise(function(resolve, reject){
    var envelope = forge.pkcs7.createEnvelopedData();
    envelope.addRecipient(cert.certData[0]);
    envelope.content = forge.util.createBuffer(content);
    try {
      envelope.encrypt();
    }
    catch (err) {
      return reject(err);
    }
    var asn1Envelope = envelope.toAsn1();
    var der = forge.asn1.toDer(asn1Envelope);
    var b64 = btoa(der.data);
    resolve(window.PKIWebSDK.Utils.base642Ab(b64));
  })
}

/**
 * Parse PKCS7 DER
 *
 * @params {String} arrayBuffer - Array buffer of PKCS7 DER
 * @returns {EncryptedData} - EncryptedData object
 * @static
 */

EncryptedData.parseDER = function(arrayBuffer){
  var self = this;
  return new Promise(function(resolve, reject){
    var b64 = window.PKIWebSDK.Utils.ab2Base64(new Uint8Array(arrayBuffer));
    var der = forge.util.decode64(b64);
    
    // Convert to PEM
    var msg = {
      type : "PKCS7",
      body : der 
    }
    var pem = forge.pem.encode(msg);
    var p7 = new EncryptedData();
    try {
      p7.envelope = forge.pkcs7.messageFromPem(pem);
    }
    catch (err) {
      return reject(err);
    }
    resolve(p7);
  })
}

/**
 * Decrypt PKCS7
 *
 * @params {Key} privateKey - Private key
 * @returns {ArrayBuffer} - Array buffer of the decrypted content
 */

EncryptedData.prototype.decrypt = function(privateKey) {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (!privateKey.isPrivate()) {
      var err = new Error();
      err.message = "The key you provide is not a private key";
      return reject(err);
    }
    // Convert Key object to forge's privateKey
    privateKey.toPEM()
      .then(function(pem){
        var privateKey = forge.pki.privateKeyFromPem(pem);
        // Decrypting
        try {
          self.envelope.decrypt(self.envelope.recipients[0], privateKey);
        }
        catch (err) {
          return reject(err);
        }
        var b64 = btoa(self.envelope.content.data);
        var content = window.PKIWebSDK.Utils.base642Ab(b64);
        resolve(content);
      })
  })
}

module.exports = EncryptedData;
