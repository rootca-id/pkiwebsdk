"use strict";
var forge = window.PKIWebSDK.private.forge;
var Key = require("./key");

/**
 * X509 certificate management
 *
 * @constructor
 */
var Certificate = function(cert) {
  if (!cert || cert == undefined) {
    this.certData = {}
  } else {
    this.certData = cert;
  }
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
Certificate.create = function(record, keys) {
  return new Promise(function(resolve, reject){

    // add sign prototype from rsa module to key pair
    keys.privateKey.sign = function(md){
      forge.rsa.setPrivateKey(md);
    }

    var cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    // alternatively set public key from a csr
    //cert.publicKey = csr.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    var issuerAttrs = [{
      name: 'commonName',
      value: record.subject.commonName,
    }, {
      name: 'countryName',
      value: record.subject.countryName
    }, {
      shortName: 'ST',
      value: record.subject.stateName
    }, {
      name: 'localityName',
      value: record.subject.localityName
    }, {
      name: 'organizationName',
      value: record.subject.organizationName
    }, {
      shortName: 'OU',
      value: record.subject.organizationUnit
    }];
    var subjectAttrs = [{
      name: 'commonName',
      value: record.subject.commonName,
    }, {
      name: 'countryName',
      value: record.subject.countryName
    }, {
      shortName: 'ST',
      value: record.subject.stateName
    }, {
      name: 'localityName',
      value: record.subject.localityName
    }, {
      name: 'organizationName',
      value: record.subject.organizationName
    }, {
      shortName: 'OU',
      value: record.subject.organizationUnit
    }];
    cert.setSubject(subjectAttrs);
    cert.setIssuer(issuerAttrs);
    cert.setExtensions([{
      name: 'basicConstraints',
      cA: true
    }, {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    }, {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true
    }, {
      name: 'nsCertType',
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: true,
      emailCA: true,
      objCA: true
    }, {
      name: 'subjectAltName',
      altNames: [{
        type: 6, // URI
        value: 'http://example.org/webid#me'
      }, {
        type: 7, // IP
        ip: '127.0.0.1'
      }]
    }, {
      name: 'subjectKeyIdentifier'
    }]);
  
    cert.sign(keys.privateKey);
    var certificate = new Certificate(cert);
    resolve(certificate);
  })
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
Certificate.createRequest = function(subject, keys, password, extensions) {
  return new Promise(function(resolve, reject){
    // add sign prototype from rsa module to key pair
    keys.privateKey.sign = function(md){
      forge.rsa.setPrivateKey(md);
    }
  
    var csr = forge.pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;
    csr.setSubject([{
      name : "commonName",
      value : subject.commonName
    }, {
      name : "countryName",
      value : subject.countryName
    }, {
      shortName : "ST",
      value : subject.stateName
    }, {
      name : "localityName",
      value : subject.localityName
    }, {
      name : "organizationName",
      value : subject.organizationName
    }, {
      shortName : "OU",
      value : subject.organizationUnit
    }]);
    var csrAttrs = [{
      name: 'challengePassword',
      value: password
    }]
    if (extensions || extensions != undefined) {
      csrAttrs.push({
        name : "extensionRequest",
        extensions : extensions
      });
    }
    csr.setAttributes(csrAttrs);
    csr.sign(keys.privateKey);
    var certificateRequest = new Certificate(csr);
    resolve(certificateRequest);
  })
}

/**
 * Gets string representation of the certificate in PEM format
 * @returns {string}
 */
Certificate.prototype.toPEM = function() {
  var cert = this.certData;
  return new Promise(function(resolve, reject){
    if (cert.certificationRequestInfo) {
      resolve(forge.pki.certificationRequestToPem(cert));
    } else {
      resolve(forge.pki.certificateToPem(cert));
    }
  })
};

/**
 * Gets byte array representation of the certificate in p12 format
 * @returns {string}
 */
Certificate.prototype.toP12 = function(privateKey, password, opt) {
  var cert = this.certData;
  return new Promise(function(resolve, reject){
    if (!privateKey) {
      reject("No private key defined");
    }
    if (!password) {
      reject("No password defined");
    }
    // Web crypto generated key has different jwk structure name with forge's.
    // Make it compatible so the key can be procceed by forge's lib.
    privateKey.dP = privateKey.dp;
    privateKey.dQ = privateKey.dq;
    privateKey.qInv = privateKey.qi;
  
    // create P12 ASN1 object
    var p12Asn1 = forge.pkcs12.toPkcs12Asn1(privateKey, cert, password, opt);
    // encode
    var p12Der = forge.asn1.toDer(p12Asn1).getBytes();
    var p12b64 = forge.util.encode64(p12Der);
    resolve(p12b64);
  })
};


/**
 * Build a new certificate object from a PEM format
 *
 * @param {string} pem - Text containing the certificate in PEM format
 * @returns {Object} - a forge certificate object
 * @static
 */
Certificate.fromPEM = function(pem) {
  var arr = pem.split("-----");
  return new Promise(function(resolve, reject) {
    if (arr[1] == "BEGIN CERTIFICATE REQUEST") {
      var cert = forge.pki.certificationRequestFromPem(pem);
      resolve(cert);
    } else if (arr[1] == "BEGIN CERTIFICATE") {
      var cert = forge.pki.certificateFromPem(pem);
      resolve(cert);
    } else {
      reject("Not a valid PEM string");
    }
  })
}

/**
 * Build a new certificate object from a p12 format
 *
 * @param {ArrayBuffer} p12 - Text containing the certificate in p12 format
 */
Certificate.prototype.fromP12 = function(p12, password) {
  var self = this;
  console.log("Certificate.fromP12");
  console.log(p12);
  console.log(password);
  return new Promise(function(resolve, reject){

    // 
    /* var p12Der = forge.util.binary.raw.encode(new Uint8Array(p12)); */
  
    //
    /* var p12Der = forge.util.binary.base64.encode(p12); */
    
    //
    /* var p12Der = forge.util.decode64(p12); */
    
    var p12Asn1 = forge.asn1.fromDer(p12, false);
    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
    resolve(p12);
  })
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
  var cert = this.certData;
  return new Promise(function(resolve, reject){
    resolve(cert.issuer.attributes);
  })
}

/**
 * Gets the subject information
 *
 * @returns {Object}
 */
Certificate.prototype.getSubject = function() {
  var cert = this.certData;
  return new Promise(function(resolve, reject){
    resolve(cert.subject.attributes);
  })
}

/**
 * Gets the version number of the certificate
 *
 * @returns {Number}
 */ 
Certificate.prototype.getVersionNumber = function() {
  var cert = this.certData;
  return new Promise(function(resolve, reject){
    resolve(cert.version);
  })
}

/**
 * Gets the serial number of the certificate
 *
 * @returns {Number}
 */ 
Certificate.prototype.getSerialNumber = function() {
  var cert = this.certData;
  return new Promise(function(resolve, reject){
    resolve(cert.serialNumber);
  })
}

/**
 * Gets the algorithm used to create the public key
 *
 * @returns {string}
 */
Certificate.prototype.getPublicKeyAlgorithm = function() {
  var cert = this.certData;
  return new Promise(function(resolve, reject){
    resolve(cert.publicKey.alg);
  })
}

/**
 * Gets the public key of the subject which signed the certificate
 *
 * @returns {Key}
 */
Certificate.prototype.getPublicKey = function() {
  var cert = this.certData;
  return new Promise(function(resolve, reject){
    resolve(cert.publicKey);
  })
}

/**
 * Gets the private key of the subject which signed the certificate
 *
 * @returns {Key}
 */
Certificate.prototype.getPrivateKey = function(p12b64, password) {
  var self = this;
  return new Promise(function(resolve, reject){
    // decode from base64
    var p12Der = forge.util.decode64(p12b64);
    // get p12 as ASN.1 object
    var p12Asn1 = forge.asn1.fromDer(p12Der);
    // decrypt p12 using the password 'password'
    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
    var keyBags = p12.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
    console.log("keybags");
    console.log(keyBags);
    var bag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
    console.log("bag");
    console.log(bag);
    var privateKey = bag.key;
    console.log("privateKey");
    console.log(privateKey);
    var asn1 = forge.pki.privateKeyToAsn1(privateKey);
    var der = forge.asn1.toDer(asn1);
    var b64key = forge.util.encode64(der.getBytes());
    resolve(b64key);
  });
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
