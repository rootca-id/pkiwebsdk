"use strict";

var pem2Jwk = require("pem-jwk").pem2jwk;
var jwk2Pem = require("pem-jwk").jwk2pem;

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
 * Generates a key pair
 *
 * @param {string} algorithm - The algorithm used to generate the key pair
 * @returns {Promise} result
 * @resolves {Object} - An object containing both private and public keys
 * @rejects {Error} - Information about the error that occurs.
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
 * Parse PEM string to key object.
 * @param {String} pem - the PEM string that will be parsed
 * @param {string} algorithm - the algorithm used in this PEM string
 * @returns {Promise} result
 * @resolves {Object} - A Key object
 * @rejects {Error} - Information about the error that occurs.
 * @static
 */
Key.parsePEM = function(pem, algorithm) {
  var arr = pem.split("-----");
  var usage = (arr[1] == "BEGIN RSA PRIVATE KEY") ? "sign" : "verify";
  var self = this;
  return new Promise(function(resolve, reject){
    var jwk = pem2Jwk(pem);
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
 * @returns {Promise} result
 * @resolves {String} - A PEM string
 * @rejects {Error} - Information about the error that occurs.
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
 * @returns {Promise} result
 * @resolves {Object} - A JSON web key object
 * @rejects {Error} - Information about the error that occurs.
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
 * @param {ArrayBuffer} data - the data to be signed
 * @returns {Promise} result
 * @resolves {ArrayBuffer} - An ArrayBuffer of signature
 * @rejects {Error} - Information about the error that occurs.
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
 * @param {ArrayBuffer} signature - the signature
 * @param {ArrayBuffer} data - the data to be checked
 * @returns {Promise} result
 * @resolves {Boolean} - A boolean value that represents whether the signature is valid
 * @rejects {Error} - Information about the error that occurs.
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
 * @returns {Boolean} - A boolean value that represents whether the ky is a private key
 */
Key.prototype.isPrivate = function() {
  var self = this;
  return (self.keyData.type == "private" ? true : false);
}

/**
 * Gets information whether the key is a public key 
 * @returns {Boolean} - A boolean value that represents whether the ky is a public key
 */
Key.prototype.isPublic = function() {
  var self = this;
  return (self.keyData.type == "public" ? true : false);
}

module.exports = Key;
