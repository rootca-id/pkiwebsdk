"use strict";
require("../lib/forge/jsbn.js");
require("../lib/forge/asn1.js");
require("../lib/forge/oids.js");
require("../lib/forge/util.js");
require("../lib/forge/cipher");
require("../lib/forge/pem");
require("../lib/forge/cipherModes.js");
require("../lib/forge/md.js");
require("../lib/forge/md5.js");
require("../lib/forge/mgf.js");
require("../lib/forge/mgf1.js");
require("../lib/forge/pem.js");
require("../lib/forge/pkcs1.js");
require("../lib/forge/hmac.js");
require("../lib/forge/pbkdf2.js");
require("../lib/forge/prime.js");
require("../lib/forge/sha1.js");
require("../lib/forge/sha256.js");
require("../lib/forge/prng.js");
require("../lib/forge/aes.js");
require("../lib/forge/random.js");
require("../lib/forge/rsa.js");
require("../lib/forge/pbe.js");
require("../lib/forge/pkcs12.js");
require("../lib/forge/pki.js");
require("../lib/forge/x509.js");
require("../lib/forge/pkcs7.js");
require("../lib/forge/pkcs7asn1.js");

var forge = window.forge;
var Key = require("./key");
var jwk2Pem = require("pem-jwk").jwk2pem;

/* https://gist.github.com/jonleighton/958841
 * Convert an arrayBuffer to base64 string; 
 *
 * @param {Buffer} - an arrayBuffer
 * @results {String} - a Base64 string
 */
var ab2Base64 = function(arrayBuffer) {
  var base64    = "";
  var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder
  var a, b, c, d
  var chunk
  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1
    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }
  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]
    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1
    base64 += encodings[a] + encodings[b] + "=="
  }
  return base64
}

/* 
 * Convert string to arrayBuffer
 *
 * @param {String} - a string
 * @results {Buffer} - an arrayBuffer
 */
var string2Ab = function(str) {
  var buf = new ArrayBuffer(str.length*2);
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/**
 * X509 certificate management
 *
 * @constructor
 */
var Certificate = function(certs) {
  if (!certs || certs == undefined) {
    this.certData = []
  } else {
    this.certData = certs;
  }
}

/** 
 * Get a revocated certificate's serial number from a CRL file
 *
 * @param {ArrayBuffer} data - Array buffer of CRL file
 * @returns {Array} - An array of serial number string
 * @static
 *
 */
Certificate.getRevocationList = function(data){
  var self = this;
  return new Promise(function(resolve, reject){
    var b64 = ab2Base64(data);
    var decoded = forge.util.decode64(b64);
    var crlAsn1 = forge.asn1.fromDer(decoded, false);
    var rl = crlAsn1.value[0].value[5].value;
    var revocationList = [];
    for (var i = 0; i < rl.length; i++) {
      var hex = forge.asn1.derToInteger(rl[i].value[0].value);
      revocationList.push(hex.toString(16));
    }
    resolve(revocationList);
  })
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
 * @param {Object} keyPair - Key pair 
 * @param {Object} keyPair.publicKey - public key in Key object
 * @param {Object} keyPair.privateKey - private kye in Key object
 */
Certificate.create = function(record, keyPair) {
  return new Promise(function(resolve, reject){
    
    // Convert keyPair to PEM format
    var keys = {};
    keyPair.publicKey.toPEM()
      .then(function(pem){
        keys.publicKey = pem;
        return keyPair.privateKey.toPEM();
      }).then(function(pem){
        keys.privateKey = pem;
        // Generate cert
        var cert = forge.pki.createCertificate();
        cert.publicKey = forge.pki.publicKeyFromPem(keys.publicKey);
        cert.serialNumber = '01';
        if (record.notBefore) {
          cert.validity.notBefore = record.notBefore;
        } else {
          cert.validity.notBefore = new Date();
        }
        if (record.notAfter) {
          cert.validity.notAfter = record.notAfter;
        } else {
          cert.validity.notAfter = new Date();
          cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
        }
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
          name: 'subjectKeyIdentifier'
        }]);
    
        // Convert privateKey to forge's privateKey
        cert.sign(forge.pki.privateKeyFromPem(keys.privateKey));
        var certificate = new Certificate([cert]);
        resolve(certificate);
      })

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
 * @param {Object} keyPair - Key pair 
 * @param {Object} keyPair.publicKey - public key in Key object
 * @param {Object} keyPair.privateKey - private kye in Key object
 * @param {string} password - The challenge password
 * @returns {string} - The CSR in PEM format
 */
Certificate.createRequest = function(subject, keyPair, password) {
  return new Promise(function(resolve, reject){
    
  // Convert keyPair to PEM format
    var keys = {};
    keyPair.publicKey.toPEM()
      .then(function(pem){
        keys.publicKey = pem;
        return keyPair.privateKey.toPEM();
      }).then(function(pem){
        keys.privateKey = pem
        // Generate CSR
        var csr = forge.pki.createCertificationRequest();
        csr.publicKey = forge.pki.publicKeyFromPem(keys.publicKey);
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
        csr.setAttributes(csrAttrs);
        csr.sign(forge.pki.privateKeyFromPem(keys.privateKey));
        var certificateRequest = new Certificate([csr]);
        resolve(certificateRequest);
      })
  })
}

/**
 * Gets string representation of the certificate in PEM format
 *
 * @returns {string}
 */
Certificate.prototype.toPEM = function() {
  var certs = this.certData;
  var pem = "";
  return new Promise(function(resolve, reject){
    for (var i = 0;i < certs.length; i++) {
      if (certs[i].certificationRequestInfo) {
        pem += forge.pki.certificationRequestToPem(certs[i]);
      } else {
        pem += forge.pki.certificateToPem(certs[i]);
      }
    }
    resolve(pem);
  })
};

/**
 * Gets byte array representation of the certificate in p12 format
 * @param {String} privateKeyPem - private Key in PEM format
 * @param {String} password - password to encrypt the p12
 * @param {Object} opt - optional configuration
 * @returns {string}
 */
Certificate.prototype.toP12 = function(privateKeyPem, password) {
  var self = this;
  return new Promise(function(resolve, reject){
    
    var arr = privateKeyPem.split("-----");
    if (!(arr[1] == "BEGIN PRIVATE KEY" || arr[1] == "BEGIN RSA PRIVATE KEY")) {
      return reject("Invalid private key");
    }
    if (!password) {
      return reject("No password defined");
    }
    var series = Promise.resolve();
    var privateKey, p12Asn1, p12Der, p12b64;
    series = series.then(function(){
      privateKey = window.forge.pki.privateKeyFromPem(privateKeyPem);
    })
    series = series.then(function(){
    // create P12 ASN1 object
      p12Asn1 = forge.pkcs12.toPkcs12Asn1(privateKey, self.certData, password);
    })
    series = series.then(function(){
      // encode
      p12Der = forge.asn1.toDer(p12Asn1).getBytes();
    })
    series = series.then(function(){
      p12b64 = forge.util.encode64(p12Der);
      resolve(p12b64);
    })
  })
};


/**
 * Build a new certificate object from PEM format
 *
 * @param {string} pem - Text containing the certificate in PEM format
 * @returns {Object} - a forge certificate object, passed to Certificate object itself
 */
Certificate.prototype.fromPEM = function(pemString) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var separatedPem = pemString.split("-\n-");
    for (var i = 0;i < separatedPem.length;i++) {
      if (i==0) { separatedPem[i] += "-" }
      else if (i == separatedPem.length -1) { separatedPem[i] = "-" + separatedPem[i] }
      else { separatedPem[i] = "-" + separatedPem[i] + "-" }
    }
    for (var i = 0; i < separatedPem.length; i++) {
      var pem = separatedPem[i];
      var arr = pem.split("-----");
      if (arr[1] == "BEGIN CERTIFICATE REQUEST") {
        var cert = forge.pki.certificationRequestFromPem(pem);
        self.certData.push(cert);
      } else if (arr[1] == "BEGIN CERTIFICATE") {
        var cert = forge.pki.certificateFromPem(pem);
        self.certData.push(cert);
      } else {
        reject("Not a valid PEM string");
      }
    }
    resolve(self);
  })
}


/**
 * Build a new certificate object from a p12 format
 * 
 * @param {ArrayBuffer} data - Text containing the certificate in p12 format
 * @params {String} [password] - Password to open P12 container
 * @returns {Object} - The extracted cert will be passed to Certificate object itself
 *.
 */
Certificate.prototype.fromP12 = function(data, password) {
  var self = this;
  return new Promise(function(resolve, reject){
    var p12Der = forge.util.decode64(ab2Base64(data));
    var p12Asn1 = forge.asn1.fromDer(p12Der, false);
    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
    var certBags = p12.getBags({bagType: forge.pki.oids.certBag});
    var cert = certBags[forge.pki.oids.certBag][0].cert;
    var certs = certBags[forge.pki.oids.certBag];
    for (var i = 0;i < certs.length;i++) {
      self.certData.push(certs[i].cert);
    }
    resolve(self);
  })
}

/*
 * Real validate function : check expirate date, verify cert, verify cert path
 * @params {Array} chain - An array of certs
 * @returns {boolean} - Whether the validation valid or not
 * @static
 */

Certificate.realValidate = function(chain){
  return new Promise(function(resolve, reject) {
    if (!chain || chain.length == 0) {
      error = {
        message: "No certificate chain defined."
      };
      return reject(error);
    }
    
    var isValid = true;
    var isTop = false;
    var i = 0;
      while (!isTop) {
        if (!isValid) {
          resolve(isValid);
          break;
        }
        var error = null;
        var cert = chain[i];
        if (i < (chain.length -1)) {
          var parent = chain[i+1];
        } else {
          var parent = cert;
          isTop = true;
        }
  
        // Check expiry
        var now = new Date();
        if ( (cert.validity.notAfter.getTime() < now.getTime())
          || (cert.validity.notBefore.getTime() > now.getTime()) ) {
            error = {
              message: 'Certificate is not valid yet or has expired.',
              error: forge.pki.certificateError.certificate_expired,
              notBefore: cert.validity.notBefore,
              notAfter: cert.validity.notAfter,
              now: now
            };
          }
        // Check if issuer matched
        if (!cert.isIssuer(parent)) {
          // If it is the last cert in chain and not a self-signed, add caStore's certs to the chain
          // and redo the loop 1 step
          if (isTop) {
            var caStoreCerts = []
            for (var x in PKIWebSDK.private.caStore.certs) {
              caStoreCerts.push(PKIWebSDK.private.caStore.certs[x]);
            }
            chain = chain.concat(caStoreCerts.reverse());
            i--;
            isTop = false;
          } else {
            error = {
              message: 'Certificate is not trusted.',
              error: forge.pki.certificateError.unknown_ca
            };
          }
        } else {
          // Verify certificate signature
          if (!parent.verify(cert)) {
            error = {
              message: 'Certificate signature is invalid.',
              error: forge.pki.certificateError.bad_certificate
            };
          }
        }
        
        // Set isValid to be false if there is any error
        if (error != null) {
          isValid = false;
        }
        if (isTop) {
          resolve(isValid);  
        }
        i++
      } // End of while
  })
}

/**
 * Validates the certificate 
 *
 * @param {Array} chain - An array of cert chain in forge cert object format, the top CA is the last array item.
 * @returns {boolean} - Whether the validation valid or not
 */
Certificate.prototype.validate = function() {
  var self = this;
  var chain = self.certData;
  return new Promise(function(resolve, reject) {
    Certificate.realValidate(chain)
      .then(function(isValid){
        resolve(isValid);
      })
      .catch(function(err){
        reject(err);
      })
  })

}

/**
 * Trust the certificate 
 *
 * @param {Array} chain - An array of cert chain in forge cert object format, the top CA is the last array item.
 * @returns {boolean} - Whether the validation valid or not
 */
Certificate.trust = function(chain) {
  var self = this;
  return new Promise(function(resolve, reject) {
    Certificate.realValidate(chain)
      .then(function(isValid){
        if (isValid) {
          for (var i = 0; i < chain.length; i++) {
            window.PKIWebSDK.private.caStore.addCertificate(chain[i]);
          }
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(function(err){
        reject(err);
      })
  })
}


/**
 * Gets the issuer information
 *
 * @returns {Object}
 */
Certificate.prototype.getIssuer = function() {
  var cert = this.certData[0];
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
  var cert = this.certData[0];
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
  var cert = this.certData[0];
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
  var cert = this.certData[0];
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
  var cert = this.certData[0];
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
  var cert = this.certData[0];
  return new Promise(function(resolve, reject){
    var pem = forge.pki.publicKeyToPem(cert.publicKey);
    resolve(pem)
  })
}

/**
 * Gets the private key of the subject which signed the certificate
 *
 * @param {arrayBuffer} data - the arrayBuffer of p12 file
 * @param {String} [password] - the password to unlock p12 container
 * @returns {Key} 
 */
Certificate.prototype.getPrivateKey = function(data, password) {
  var self = this;
  return new Promise(function(resolve, reject){
    var p12Der = forge.util.decode64(ab2Base64(data));
    var p12Asn1 = forge.asn1.fromDer(p12Der);
    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
    var keyBags = p12.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
    var bag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
    var privateKey = forge.pki.privateKeyToPem(bag.key);
    resolve(privateKey);
  });
}

/**
 * Gets the signature of the certificate
 *
 * @returns {ArrayBuffer}
 */
Certificate.prototype.getSignature = function() {
  var self = this;
  return new Promise(function(resolve, reject){
    var signature = string2Ab(self.certData[0].signature);
    resolve(signature);
  })
}

/**
 * Gets the usage of the certificate
 *
 * @returns {string[]} 
 */
Certificate.prototype.getUsage = function() {
  var extensions = this.certData[0].extensions;
  var usage = [];
  return new Promise(function(resolve, reject){
    for (var i = 0; i < extensions.length; i++) {
      if (extensions[i].id == "2.5.29.15" || extensions[i].id == "2.5.29.37") {
        for (var child in extensions[i]) {
          if (extensions[i][child] == true) {
            usage.push(child);
          }
        }
      }
    }
    resolve(usage);
  })

}

module.exports = Certificate;
