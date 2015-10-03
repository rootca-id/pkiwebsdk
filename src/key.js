"use strict";

var pem2Jwk = require("pem-jwk").pem2jwk;
var jwk2Pem = require("pem-jwk").jwk2pem;
var Utils = require("./utils");

// Wrapping webcrypto api
var cryptoSubtle = window.crypto.subtle || window.crypto.webkitSubtle || window.msCrypto.subtle;

/**
 * RSA key management
 *
 * @constructor
 */
var Key = function(key) {
  if (!key || key == undefined) {
   var err = new Error("Not a valid crypto key");
   throw err;
  } else {
    this.keyData = key;
  }
}

/**
 * @typedef GeneratePairResult
 * @type Object
 * @property {Key} privateKey - An object containing both private and public keys
 * @property {Key} publicKey - An object containing both private and public keys
 *
 *
 */

/**
 * Generates a key pair
 *
 * @param {String} algorithm - The algorithm used to generate the key pair
 * @returns {GeneratePairResult} - An object containing both private and public keys
 * @static
 */
Key.generatePair = function(algorithm) {
  return new Promise(function(resolve, reject){
    cryptoSubtle.generateKey({
      name:"RSASSA-PKCS1-v1_5", 
      modulusLength:2048, 
      publicExponent : new Uint8Array([1,0,1]), 
      hash : { name : algorithm}}, 
      true, 
      ["sign" ,"verify"]
    )
    .then(function(newKeyPair){
      var keyPair = {
        privateKey : new Key(newKeyPair.privateKey),
        publicKey : new Key(newKeyPair.publicKey)
      }
      resolve(keyPair);
    })
    .catch(function(err){
      reject(err);
    });
  })
}

/**
 * Encrypt private key to PKCS8
 *
 * @param {String} password - password to encrypt PKCS8
 * @returns {String} - PEM string of PKCS8
 * 
 */

 Key.prototype.toPKCS8 = function(password){
  var self = this;
  return new Promise(function(resolve, reject){
    if (self.keyData.type != "private") {
      reject(new Error("Must be a private key"));
    }
    cryptoSubtle.exportKey("jwk", self.keyData)
      .then(function(jwk){
        try {
          var privateKey = forge.pki.privateKeyFromPem(jwk2Pem(jwk));
          var rsaPrivateKey = forge.pki.privateKeyToAsn1(privateKey);
          var privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey);
          var encryptedPrivateKeyInfo = forge.pki.encryptPrivateKeyInfo(privateKeyInfo, password, {algorithm : "aes256"});
          var pem = forge.pki.encryptedPrivateKeyInfo = forge.pki.encryptedPrivateKeyToPem(encryptedPrivateKeyInfo);
          resolve(pem);
        }
        catch(err) {
          reject(err);
        }
      })
  })
 }

/** 
 * Decrypt PKCS8 PEM
 * 
 * @param {String} pem - PEM string of PKCS8.
 * @param {String} password - Password to decrypt the PKCS8.
 * @returns {Key} - Key object of decrypted private key.
 * @static
 */

Key.decryptPKCS8 = function(pkcs8, password) {
  return new Promise(function(resolve, reject){
    var wrapError = function(err){
      if (err.message == "Cannot read encrypted PBE data block. Unsupported OID.") {
        err.message += " The algorithm used in this PKCS8 is no longer supported.";
      } else {
        err.message += ". Invalid PKCS8 PEM or wrong password?";
      }
      return err
    }
    try {
      var encryptedPrivateKeyInfo = forge.pki.encryptedPrivateKeyFromPem(pkcs8);
    }
    catch(err) {
      reject(wrapError(err));
    }
    try {
      var privateKeyInfo = forge.pki.decryptPrivateKeyInfo(encryptedPrivateKeyInfo, password);
    }
    catch(err) {
      reject(wrapError(err));
    }
    try {
      var pem = forge.pki.privateKeyInfoToPem(privateKeyInfo);
      Key.parsePEM(pem, "SHA-256")
        .then(function(privateKey){
          resolve(privateKey);
        })
        .catch(function(err){
          reject(wrapErr(err));
        })
    }
    catch(err) {
      reject(wrapError(err));
    }
  })  
}

/**
 * Parse PEM string to key object.
 *
 * @param {String} pem - the PEM string that will be parsed
 * @param {string} algorithm - the algorithm used in this PEM string
 * @returns {Key} - A Key object
 * @static
 */
Key.parsePEM = function(pem, algorithm) {
  var arr = pem.split("-----");
  var usage = (arr[1] == "BEGIN RSA PRIVATE KEY" || arr[1] == "BEGIN PRIVATE KEY") ? "sign" : "verify";
  var self = this;
  return new Promise(function(resolve, reject){
    var jwk;
    try {
      jwk = pem2Jwk(pem);
    } 
    catch (err) {
      if (err.message === "Failed to match tag: \"bitstr\" at: [\"privateKey\"]") {
        if (arr[1] == "BEGIN RSA PRIVATE KEY" || arr[1] == "BEGIN PRIVATE KEY") {
          var key = forge.pki.privateKeyFromPem(pem);
          pem = forge.pki.privateKeyToPem(key);
        } else if (arr[1] == "BEGIN RSA PUBLIC KEY" || arr[1] == "BEGIN PUBLIC KEY") {
          var key = forge.pki.publicKeyFromPem(pem);
          pem = forge.pki.publicKeyToPem(key);
        } else {
          var err = new Error();
          err.message = "Invalid Key PEM";
          return reject(err);
        }
        jwk = pem2Jwk(pem);
      } else {
        var err = new Error();
        err.message = "Invalid Key PEM";
        return reject(err);
      }
    }
    cryptoSubtle.importKey(
      "jwk", 
      jwk, 
      { name : "RSASSA-PKCS1-v1_5", hash : { name : algorithm }},
      true,
      [usage]
    ).then(function(keyData){
      resolve(new Key(keyData));
    })
    .catch(function(err){
      reject(err);
    })
  })
};

/**
 * Gets string representation of the key in PEM format
 *
 * @returns {String} - A PEM string
 */
Key.prototype.toPEM = function() {
  var self = this;
  return new Promise(function(resolve, reject){
    if (!self.keyData || self.keyData == undefined) {
      reject(new Error("Not a valid crypto key"));
    }
    cryptoSubtle.exportKey("jwk", self.keyData)
      .then(function(jwk){
        resolve(jwk2Pem(jwk));
      })
  })
};

/**
 * Gets JSON web key representation of the key
 *
 * @returns {Object} - A JSON web key object
 */
Key.prototype.toJwk = function() {
  var self = this;
  return new Promise(function(resolve, reject){
    cryptoSubtle.exportKey("jwk", self.keyData)
      .then(function(jwk){
        resolve(jwk);
      })
  })
};


/**
 * Signs data using the key
 *
 * @param {ArrayBuffer} data - the data to be signed
 * @returns {ArrayBuffer} - An ArrayBuffer of signature
 */
Key.prototype.sign = function(data) {
  var self = this;
  return new Promise(function(resolve, reject){
    if (self.keyData == undefined) {
      reject(new Error("Not a valid crypto key"));
    }
    if (self.keyData.type != "private") {
      reject(new Error("Must be a private key"));
    }
    cryptoSubtle.sign(
      { name :"RSASSA-PKCS1-v1_5" }, 
      self.keyData, 
      data
    )
    .then(function(signature){
      resolve(signature);
    })
    .catch(function(reason){
      reject(reason);
    })
  })
}

/**
 * Verify data using the key
 *
 * @param {ArrayBuffer} signature - The signature
 * @param {ArrayBuffer} data - The data to be checked
 * @returns {Boolean} - A boolean value that represents whether the signature is valid
 */
Key.prototype.verify = function(signature, data) {
  var self = this;
  return new Promise(function(resolve, reject){
    if (self.keyData == undefined) {
      reject(new Error("Not a valid crypto key"));
    }
    if (self.keyData.type != "public") {
      reject(new Error("Must be a public key"));
    }
    cryptoSubtle.verify(
      { name :"RSASSA-PKCS1-v1_5" }, 
      self.keyData,
      signature,
      data
    )
    .then(function(isValid){
      resolve(isValid);
    })
    .catch(function(reason){
      reject(reason);
    })
  })
}

/**
 * Gets information whether the key is a private key
 *
 * @returns {Boolean} - A boolean value that represents whether the ky is a private key
 */
Key.prototype.isPrivate = function() {
  var self = this;
  return (self.keyData.type == "private" ? true : false);
}

/**
 * Gets information whether the key is a public key 
 *
 * @returns {Boolean} - A boolean value that represents whether the ky is a public key
 */
Key.prototype.isPublic = function() {
  var self = this;
  return (self.keyData.type == "public" ? true : false);
}

/**
 * Encrypt data using public key
 *
 * @param {ArrayBuffer} data - Array buffer of the data. The data's size must be less than public's key k-11 octet
 * @returns {ArrayBuffer} - Array buffer of encrypted data
 */

Key.prototype.encrypt = function(arrayBuffer) {
  var self = this;
  console.log(self.keyData)
  return new Promise(function(resolve, reject){
    if (self.keyData.type != "public") {
      reject("Public key does not exist in this key object");
    }
    // Convert publicKey to forge's key object
    self.toPEM()
      .then(function(pem){
        var publicKey = forge.pki.publicKeyFromPem(pem);
        var limit = Math.ceil(publicKey.n.bitLength() / 8) - 11;
        if (arrayBuffer.byteLength > limit) {
          var err = new Error();
          err.message = "The data to be encrypted must be less than " + (limit + 1) + " bytes";
          return reject(err);
        }
        // Encrypt
        try {
          var encrypted = publicKey.encrypt(Utils.ab2Str(arrayBuffer));
        } 
        catch(err){
          return reject(err);
        }
        resolve(Utils.str2Ab(encrypted));
      })
  })
}

/** 
 * Decrypt data using private Key
 *
 * @param {ArrayBuffer} data - Array buffer of decrypted data
 * @returns {ArrayBuffer} - Array buffer of decrypted data
 */

Key.prototype.decrypt = function(arrayBuffer){
  var self = this;
  return new Promise(function(resolve, reject){
    if (self.keyData.type != "private") {
      reject("Private key does not exist in this key object");
    }
    self.toPEM()
      .then(function(pem){
        var privateKey = forge.pki.privateKeyFromPem(pem);
        var base64Data = Utils.ab2Base64(arrayBuffer);
        var data = forge.util.decode64(base64Data);
        try {
          var decrypted = privateKey.decrypt(data);
        } 
        catch(err){
          return reject(err);
        }
        resolve(Utils.str2Ab(decrypted));
      })
  })
}

module.exports = Key;
