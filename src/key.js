"use strict";
var PkiJs = require("../lib/pkijs").org.pkijs;

/**
 * RSA key management
 *
 * @constructor
 */
var Key = function() {
}

/**
 * Generates a key pair
 *
 * @param {string} algorithm - The algorithm used to generate the key pair
 * @returns {Object} - An object containing both private and public keys
 */
Key.prototype.generatePair = function(algorithm) {
}

/**
 * Gets string representation of the key in PEM format
 * @returns {string}
 */
Key.prototype.toPEM = function() {
};

/**
 * Signs data using the key
 * @param {ArrayBuffer} data - the data to be signed
 * @returns {ArrayBuffer}
 */
Key.prototype.sign = function(data) {
}

/**
 * Gets information whether the key is a private key 
 */
Key.prototype.isPrivate = function() {
}

/**
 * Gets information whether the key is a public key 
 */
Key.prototype.isPublic = function() {
}

