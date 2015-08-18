"use strict";

var PkiJs = require("../lib/pkijs").org.pkijs;

/**
 * X509 certificate management
 *
 * @constructor
 */
var Certificate = function() {
}

/**
 * Creates a new X509 certificate
 *
 * @param {Object} record - The identity records
 * @param {Object} record.issuer - The issuer identity 
 * @param {string} record.issuer.commonName - The common name of the issuer
 * @param {string} record.issuer.countryName - The country name of the issuer
 * @param {string} record.issuer.stateName - The state name of the issuer
 * @param {string} record.issuer.localityName - The locality name of the issuer
 * @param {string} record.issuer.organizationName - The organization name of the issuer
 * @param {string} record.issuer.organizationUnit - The organization unit of the issuer
 * @param {Object} record.subject - The subject identity 
 * @param {string} record.subject.commonName - The common name of the subject
 * @param {string} record.subject.countryName - The country name of the subject
 * @param {string} record.subject.stateName - The state name of the subject
 * @param {string} record.subject.localityName - The locality name of the subject
 * @param {string} record.subject.organizationName - The organization name of the subject
 * @param {string} record.subject.organizationUnit - The organization unit of the subject
 * @param {Date} record.notAfter - The expiration date
 * @param {Date} record.notBefore - The start active date
 * @param {Key} key - The private key used to sign the certificate
 */
Certificate.prototype.create = function(record, key) {
  var cert = new PkiJs.simpl.CERT();
  var crypto = PkiJs.getCrypto();
  cert.serialNumber = new PkiJs.asn1.INTEGER({ value: 1 });
  cert.issuer.types_and_values.push(new PkiJs.simpl.ATTR_TYPE_AND_VALUE({
    type: "2.5.4.6", // Country name
    value: new PkiJs.asn1.PRINTABLESTRING({ value: record.issuer.countryName })
  }));
  cert.issuer.types_and_values.push(new PkiJs.simpl.ATTR_TYPE_AND_VALUE({
    type: "2.5.4.3", // Common name
    value: new PkiJs.asn1.PRINTABLESTRING({ value: record.issuer.commonName })
  }));

  cert.subject.types_and_values.push(new PkiJs.simpl.ATTR_TYPE_AND_VALUE({
    type: "2.5.4.6", // Country name
    value: new PkiJs.asn1.PRINTABLESTRING({ value: record.subject.countryName })
  }));
  cert.subject.types_and_values.push(new PkiJs.simpl.ATTR_TYPE_AND_VALUE({
    type: "2.5.4.3", // Common name
    value: new PkiJs.asn1.PRINTABLESTRING({ value: record.subject.commonName })
  }));

  cert.notBefore.value = new Date(record.notBefore);
  cert.notAfter.value = new Date(record.notAfter);

  return cert;
}

/**
 * Creates a new X509 certificate request (CSR)
 *
 * @param {Object} subject - The subject DN
 * @param {string} subject.commonName - The common name of the subject
 * @param {string} subject.countryName - The country name of the subject
 * @param {string} subject.stateName - The state name of the subject
 * @param {string} subject.localityName - The locality name of the subject
 * @param {string} subject.organizationName - The organization name of the subject
 * @param {string} subject.organizationUnit - The organization unit of the subject
 * @param {Object} extension - The extension request
 * @param {Key} key - The private key used to sign the certificate
 * @param {string} password - The challenge password
 * @returns {string} - The CSR in PEM format
 */
Certificate.prototype.createRequest = function(subject, extensions, key, password) {
}

/**
 * Gets string representation of the certificate in PEM format
 * @returns {string}
 */
Certificate.prototype.toPEM = function() {
};

/**
 * Gets byte array representation of the certificate in p12 format
 * @returns {string}
 */
Certificate.prototype.toP12 = function() {
};


/**
 * Build a new certificate object from a PEM format
 *
 * @param {string} pem - Text containing the certificate in PEM format
 */
Certificate.prototype.fromPEM = function(pem) {
}

/**
 * Build a new certificate object from a p12 format
 *
 * @param {ArrayBuffer} p12 - Text containing the certificate in p12 format
 */
Certificate.prototype.fromP12 = function(p12) {
}

/**
 * Validates the certificate 
 *
 * @returns {boolean}
 */
Certificate.prototype.validate = function() {
}

/**
 * Trust the certificate 
 *
 * @returns {boolean}
 */
Certificate.prototype.trust = function() {
}


/**
 * Gets the issuer information
 *
 * @returns {Object}
 */
Certificate.prototype.getIssuer = function() {
}

/**
 * Gets the subject information
 *
 * @returns {Object}
 */
Certificate.prototype.getSubject = function() {
}

/**
 * Gets the version number of the certificate
 *
 * @returns {Number}
 */ 
Certificate.prototype.getVersionNumber = function() {
}

/**
 * Gets the serial number of the certificate
 *
 * @returns {Number}
 */ 
Certificate.prototype.getSerialNumber = function() {
}

/**
 * Gets the algorithm used to create the public key
 *
 * @returns {string}
 */
Certificate.prototype.getPublicKeyAlgorithm = function() {
}

/**
 * Gets the public key of the subject which signed the certificate
 *
 * @returns {Key}
 */
Certificate.prototype.getPublicKey = function() {
}

/**
 * Gets the private key of the subject which signed the certificate
 *
 * @returns {Key}
 */
Certificate.prototype.getPrivateKey = function() {
}

/**
 * Gets the signature of the certificate
 *
 * @returns {ArrayBuffer}
 */
Certificate.prototype.getSignature = function() {
}

/**
 * Gets the usage of the certificate
 *
 * @returns {string[]} 
 */
Certificate.prototype.getUsage = function() {
}

module.exports = Certificate;
