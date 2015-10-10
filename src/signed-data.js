'use strict';

require("../lib/forge/asn1.js");
require("../lib/forge/util.js");
require("../lib/forge/pkcs7.js");
require("../lib/forge/pkcs7asn1.js");
require('../lib/pdfjs/pdf.combined');
var Certificate = require("./certificate");
var Utils = require("./utils");
var forge = window.forge;

/**
 * Represents a PKCS#7 signed data
 * @constructor
 * @param {SignedDataObject} data - The data of the PKCS#7 signed data. Should not be used by user.
 */
var SignedData = function(data) {
  var self = this;

  self.data = data || null;
}

// Mappings of distinguished names
var dnMap = {
  '2.5.4.3': 'CN',
  '2.5.4.6': 'C',
  '2.5.4.7': 'L',
  '2.5.4.8': 'S',
  '2.5.4.10': 'O',
  '2.5.4.11': 'OU',
  '1.2.840.113549.1.9.1': 'EMAIL',

}

// resolve issuer dn
var resolveIssuer = function (d) {
  var data = d.value;
  var issuer = { }
  for (var i = 0; i < data.length; i ++) {
    var set = data[i].value[0];
    var id = set.value[0];
    var type = forge.asn1.derToOid(id.value);
    var value = set.value[1].value;
    var dn = dnMap[type];
    if (!dn) dn = type;
    issuer[dn] = value;
  }
  return issuer;
}

// resolve attributes
var resolveAttributes = function (d) {
  var attributes = {};

  for (var i = 0; i < d.length ; i ++) {
    var entry = d[i].value;
    var attr = forge.asn1.derToOid(entry[0].value);
    var value = entry[1];
    if (attr === '1.2.840.113549.1.9.3') {
      attr = 'content-type';
      value = forge.asn1.derToOid(entry[1].value[0].value);
    } else if (attr === '1.2.840.113549.1.9.4') {
      attr = 'digest';
      value = forge.util.createBuffer(entry[1].value[0].value).toHex(); 
    }
    attributes[attr]  = value;

  }
  return attributes;
}

// convert asn1 to signer info
var signerInfoFromASN1 = function(asn1) {
  var valid = false;
  var data;

  if (asn1.tagClass === 0 && 
      asn1.type === 17 && 
      asn1.value &&
      asn1.value[0].tagClass === 0 && 
      asn1.value[0].type === 16) {
    valid = true;
  }

  function error() {
    throw new Error('SignerInfo ASN1 is not valid');
  }

  function parseEntry(data) {
    var capture = {};
    var errors = [];
    if(!forge.asn1.validate(data, forge.pkcs7.asn1.signerValidator, capture, errors)) {
      return throwError();
    }

    var issuer = resolveIssuer(capture.issuer);
    var serialNumber = forge.util.createBuffer(capture.serial).toHex();
    var digestAlgorithm = forge.asn1.derToOid(capture.digestAlgorithm);
    var authenticatedAttributes = resolveAttributes(capture.authenticatedAttributes);

    var signerInfo = {
      issuer: issuer,
      serialNumber: serialNumber,
      digestAlgorithm: digestAlgorithm,
      authenticatedAttributes: authenticatedAttributes
    }
    return signerInfo;
  }

  if (!valid) {
    return throwError();
  }
  
  var signerInfo = [];
  for (var i = 0; i < asn1.value.length; i ++) {
    var info = parseEntry(asn1.value[i]);
    signerInfo.push(info);
  }

  return signerInfo;
}

/* @typedef Attribute
 * @type Object
 * @property {String} key - the key of the attribute
 * @property {Object|String|Uint8Array} value - the value of the attribute
 */

/* @typedef SignerInfo
 * @type Object
 * @property {Object} issuer - the object holding the information about the issuer
 * @property {String} serialNumber - the serial number of the certificate being used to sign
 * @property {String} digestAlgorithm - the algorithm used to sign
 * @property {Attribute} authenticatedAttributes - the signed attributes of this signer information
 */

/* @typedef SignedDataObject
 * @description An object representing PKCS#7 signed data
 * @type Object
 * @property {Certificate[]} certificates - the certificates embedded in the signed data
 * @property {SignerInfo} signerInfo - the array holding the signers information
 */

/*
 * Creates a new SignedData object from a DER formatted data
 * @param {String} rawData - The raw data of the PKCS#7 signed data in DER format
 * @returns {SignedDataObject}
 */
SignedData.parseDER = function parseDER(rawData) {
  var asn1 = forge.asn1.fromDer(rawData);
  var signedData = forge.pkcs7.messageFromAsn1(asn1); 
  var signedDataASN1 = asn1.value[1].value[0];
  // SignedData has 6 contents
  // 2 of which are optionals
  var pos = 3;
  if (signedDataASN1.value[pos].tagClass === 128 &&
      signedDataASN1.value[pos].type === 0) {
    pos ++;
  }
  if (signedDataASN1.value[pos].tagClass === 128 &&
      signedDataASN1.value[pos].type === 1) {
    pos ++;
  }
  var signerInfoASN1 = signedDataASN1.value[pos];

  signedData.signerInfo = signerInfoFromASN1(signerInfoASN1);
  delete(signedData.signerInfos);

  var certs = [];
  for (var i = 0; i < signedData.certificates.length; i ++) {
    var cert = new Certificate([signedData.certificates[i]]);
    certs.push(cert);
  }
  signedData.certificates = certs;

  return new SignedData(signedData);
}

/**
 * Returns the data of SignedData
 * @return {SignedDataObject} - the signed data object
 */
SignedData.prototype.getData = function getData() {
  return this.data;
}

/**
 * Verify detached PKCS#7 DER, certificate and a file together
 * @param {Certificate} cert - Certificate object
 * @param {rawData} der - Detached PKCS#7 in DER 
 * @param {ArrayBuffer} data - Array buffer of data that you want to verify
 * @returns {Boolean} - Boolean value that represents whether the file is verified or not
 */
 
SignedData.verify = function verify(cert, der, data) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var isVerified = true;
    var p = self.parseDER(der);
    var d = p.getData().signerInfo[0];
    var signedDataHash = d.authenticatedAttributes.digest;
    var hash = forge.md.sha256.create();
    var dataHash = hash.update(Utils.ab2Str(data)).digest().toHex();
    console.log(signedDataHash);
    console.log(dataHash);
    cert.getIssuer()
      .then(function(issuer){
        // Verify
        if (dataHash != signedDataHash) {
          isVerified = false;
        }
        if (issuer.countryName != d.issuer.C
          || issuer.commonName != d.issuer.CN
          || issuer.emailAddress != d.issuer.EMAIL
          || issuer.localityName != d.issuer.L
          || issuer.organizationName != d.issuer.O
          || issuer.stateOrProvinceName != d.issuer.S) {
          isVerified = false;  
        }
        resolve(isVerified);
      })
      .catch(function(err){
        reject(err);
      })

  })
 }

/**
 * Sign a data using certificate and private key, returns detached PKCS#7 in DER format
 *
 * @param {Certificate} cert - Certificate object
 * @param {Key} key - Private key to sign 
 * @param {ArrayBuffer} data - Array buffer of data that to be signed
 * @returns {ArrayBuffer} - Array buffer of detached PKCS#7 in DER
 */

SignedData.sign = function sign(cert, key, data) {
  return new Promise(function(resolve, reject) {
    var forgeKey;
    key.toPEM().then(function(keyInPem) {
      forgeKey = forge.pki.privateKeyFromPem(keyInPem);
      return cert.toPEM(); 
    }).then(function(certInPem) {
      var cert = forge.pki.certificateFromPem(certInPem);
      var p7 = forge.pkcs7.createSignedData();
      if (data instanceof Uint8Array) {
        p7.content = data;
      } else {
        p7.content = new Uint8Array(data); 
      }
      p7.addCertificate(cert);
      p7.addSigner({
        key: forgeKey,
        certificate: cert,
        digestAlgorithm: forge.pki.oids.sha256,
        authenticatedAttributes: [{
          type: forge.pki.oids.contentType,
          value: forge.pki.oids.data
        }, {
          type: forge.pki.oids.messageDigest
        }, {
          type: forge.pki.oids.signingTime,
          value: new Date()
        }]
      });
      try {
      p7.signDetached();
      } catch (e) {
        console.log(e.stack);
      }
      var asn1 = p7.toAsn1();
      var raw = forge.asn1.toDer(asn1).getBytes();
      var buffer = new Uint8Array(raw.length);
      for (var i = 0; i < raw.length; i ++) {
        buffer[i] = raw.charCodeAt(i);
      }
      resolve(buffer);
    });
  });
}

module.exports = SignedData;
