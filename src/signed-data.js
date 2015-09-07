'use strict';

require('../lib/pdfjs/pdf.combined');
var Certificate = require("./certificate");
var forge = window.PKIWebSDK.private.forge;

/**
 * Represents a PKCS#7 signed data
 * @constructor
 * @param {Object} data - The data of the PKCS#7 signed data. Should not be used by user.
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
    data = asn1.value[0];
  }

  var capture = {};
  var errors = [];
  if(!forge.asn1.validate(data, forge.pkcs7.asn1.signerValidator, capture, errors)) {
    throw new Error('SignerInfo ASN1 is not valid');
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

/*
 * Creates a new SignedData object from a DER formatted data
 * @param {String} rawData - The raw data of the PKCS#7 signed data in DER format
 * @returns {SignedData}
 */
SignedData.fromDER = function fromDER(rawData) {
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

  return new SignedData(signedData);
}

/**
 * Returns the data of SignedData
 * @return {Object}
 */
SignedData.prototype.getData = function getData() {
  return this.data;
}

module.exports = SignedData;
