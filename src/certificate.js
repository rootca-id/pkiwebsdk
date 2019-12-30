'use strict';
require('../lib/forge/jsbn.js');
require('../lib/forge/asn1.js');
require('../lib/forge/oids.js');
require('../lib/forge/util.js');
require('../lib/forge/rc2');
require('../lib/forge/cipher');
require('../lib/forge/pem');
require('../lib/forge/cipherModes.js');
require('../lib/forge/des.js');
require('../lib/forge/md.js');
require('../lib/forge/md5.js');
require('../lib/forge/mgf.js');
require('../lib/forge/mgf1.js');
require('../lib/forge/pem.js');
require('../lib/forge/pkcs1.js');
require('../lib/forge/hmac.js');
require('../lib/forge/pbkdf2.js');
require('../lib/forge/prime.js');
require('../lib/forge/sha1.js');
require('../lib/forge/sha256.js');
require('../lib/forge/prng.js');
require('../lib/forge/aes.js');
require('../lib/forge/random.js');
require('../lib/forge/rsa.js');
require('../lib/forge/pbe.js');
require('../lib/forge/pkcs12.js');
require('../lib/forge/pki.js');
require('../lib/forge/x509.js');
require('../lib/forge/pkcs7.js');
require('../lib/forge/pkcs7asn1.js');

var forge = window.forge;
var Key = require('./key');
var Utils = require('./utils');
var jwk2Pem = require('pem-jwk-browser').jwk2pem;

/**
 * X509 certificate management
 *
 * @constructor
 */
var Certificate = function(certs) {
  if (!certs || certs == undefined) {
    this.certData = [];
  } else {
    this.certData = certs;
  }
};

/**
 * Get a revocated certificate's serial number from a CRL file
 *
 * @param {ArrayBuffer} data - Array buffer of CRL file, in PEM or DER format
 * @returns {Array} - An array of serial number string
 * @static
 *
 */
Certificate.getRevocationList = function(data) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var b64 = Utils.ab2Base64(data);
    var decoded = forge.util.decode64(b64);
    if (decoded.substr(0, 5) == '-----') {
      decoded = forge.pem.decode(decoded)[0].body;
    }
    var crlAsn1 = forge.asn1.fromDer(decoded, false);
    var rl = crlAsn1.value[0].value[5].value;
    var revocationList = [];
    for (var i = 0; i < rl.length; i++) {
      var hex = forge.asn1.derToInteger(rl[i].value[0].value);
      revocationList.push(hex.toString(16));
    }
    resolve(revocationList);
  });
};

/**
 * Creates a new X509 certificate
 *
 * @param {Object} record - The identity records
 * @param {Object} record.issuer - The issuer identity
 * @param {String} record.issuer.commonName - The common name of the issuer
 * @param {String} record.issuer.countryName - The country name of the issuer
 * @param {String} record.issuer.stateName - The state name of the issuer
 * @param {String} record.issuer.localityName - The locality name of the issuer
 * @param {String} record.issuer.organizationName - The organization name of the issuer
 * @param {String} record.issuer.organizationUnit - The organization unit of the issuer
 * @param {Object} record.subject - The subject identity
 * @param {String} record.subject.commonName - The common name of the subject
 * @param {String} record.subject.countryName - The country name of the subject
 * @param {String} record.subject.stateName - The state name of the subject
 * @param {String} record.subject.localityName - The locality name of the subject
 * @param {String} record.subject.organizationName - The organization name of the subject
 * @param {String} record.subject.organizationUnit - The organization unit of the subject
 * @param {Date} record.notAfter - The expiration date
 * @param {Date} record.notBefore - The start active date
 * @param {Object} keyPair - Key pair
 * @param {Object} keyPair.publicKey - public key in Key object
 * @param {Object} keyPair.privateKey - private kye in Key object
 * @returns {Object} - Certificate object
 * @static
 */
Certificate.create = function(record, keyPair) {
  return new Promise(function(resolve, reject) {
    // Convert keyPair to PEM format
    var keys = {};
    keyPair.publicKey
      .toPEM()
      .then(function(pem) {
        keys.publicKey = pem;
        return keyPair.privateKey.toPEM();
      })
      .then(function(pem) {
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
          cert.validity.notAfter.setFullYear(
            cert.validity.notBefore.getFullYear() + 1,
          );
        }
        var issuerAttrs = [
          {
            name: 'commonName',
            value: record.subject.commonName,
          },
          {
            name: 'countryName',
            value: record.subject.countryName,
          },
          {
            shortName: 'ST',
            value: record.subject.stateName,
          },
          {
            name: 'localityName',
            value: record.subject.localityName,
          },
          {
            name: 'organizationName',
            value: record.subject.organizationName,
          },
          {
            shortName: 'OU',
            value: record.subject.organizationUnit,
          },
        ];
        var subjectAttrs = [
          {
            name: 'commonName',
            value: record.subject.commonName,
          },
          {
            name: 'countryName',
            value: record.subject.countryName,
          },
          {
            shortName: 'ST',
            value: record.subject.stateName,
          },
          {
            name: 'localityName',
            value: record.subject.localityName,
          },
          {
            name: 'organizationName',
            value: record.subject.organizationName,
          },
          {
            shortName: 'OU',
            value: record.subject.organizationUnit,
          },
        ];
        cert.setSubject(subjectAttrs);
        cert.setIssuer(issuerAttrs);
        cert.setExtensions([
          {
            name: 'basicConstraints',
            cA: true,
          },
          {
            name: 'keyUsage',
            keyCertSign: true,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true,
          },
          {
            name: 'extKeyUsage',
            serverAuth: true,
            clientAuth: true,
            codeSigning: true,
            emailProtection: true,
            timeStamping: true,
          },
          {
            name: 'nsCertType',
            client: true,
            server: true,
            email: true,
            objsign: true,
            sslCA: true,
            emailCA: true,
            objCA: true,
          },
          {
            name: 'subjectKeyIdentifier',
          },
        ]);

        // Convert privateKey to forge's privateKey
        cert.sign(forge.pki.privateKeyFromPem(keys.privateKey));
        var certificate = new Certificate([cert]);
        resolve(certificate);
      });
  });
};

/**
 * Creates a new X509 certificate request (CSR)
 *
 * @param {Object} subject - The subject DN
 * @param {String} subject.commonName - The common name of the subject
 * @param {String} subject.countryName - The country name of the subject
 * @param {String} subject.stateName - The state name of the subject
 * @param {String} subject.localityName - The locality name of the subject
 * @param {String} subject.organizationName - The organization name of the subject
 * @param {String} subject.organizationUnit - The organization unit of the subject
 * @param {Object} extension - The extension request
 * @param {Object} keyPair - Key pair
 * @param {Object} keyPair.publicKey - public key in Key object
 * @param {Object} keyPair.privateKey - private kye in Key object
 * @param {String} password - The challenge password
 * @returns {Object} - The CSR object
 * @static
 */
Certificate.createRequest = function(subject, keyPair, password) {
  return new Promise(function(resolve, reject) {
    // Convert keyPair to PEM format
    var keys = {};
    keyPair.publicKey
      .toPEM()
      .then(function(pem) {
        keys.publicKey = pem;
        return keyPair.privateKey.toPEM();
      })
      .then(function(pem) {
        keys.privateKey = pem;
        // Generate CSR
        var csr = forge.pki.createCertificationRequest();
        csr.publicKey = forge.pki.publicKeyFromPem(keys.publicKey);
        var subjects = [
          {
            name: 'commonName',
            value: subject.commonName,
          },
          {
            name: 'countryName',
            value: subject.countryName,
          },
          {
            shortName: 'ST',
            value: subject.stateOrProvinceName || subject.stateName,
          },
          {
            name: 'localityName',
            value: subject.localityName,
          },
          {
            name: 'organizationName',
            value: subject.organizationName,
          },
          {
            shortName: 'OU',
            value: subject.organizationalUnit || subject.organizationUnit,
          },
        ];

        if (subject.description || subject['2.5.4.13']) {
          subjects.push({
            name: 'description',
            value: subject.description || subject['2.5.4.13'],
          });
        }
        if (subject.subjectAltName || subject['2.5.25.17']) {
          subjects.push({
            name: 'subjectAltName',
            value: subject.subjectAltName || subject['2.5.25.17'],
          });
        }
        if (subject.emailAddress) {
          subjects.push({
            name: 'emailAddress',
            value: subject.emailAddress,
          });
        }
        console.log(subjects);
        csr.setSubject(subjects);
        if (password && password.length > 0) {
          var csrAttrs = [
            {
              name: 'challengePassword',
              value: password,
            },
          ];
          csr.setAttributes(csrAttrs);
        }
        csr.sign(forge.pki.privateKeyFromPem(keys.privateKey));
        var certificateRequest = new Certificate([csr]);
        resolve(certificateRequest);
      });
  });
};

/**
 * Gets string representation of the certificate in PEM format
 *
 * @returns {String}
 */
Certificate.prototype.toPEM = function() {
  var certs = this.certData;
  var pem = '';
  return new Promise(function(resolve, reject) {
    for (var i = 0; i < certs.length; i++) {
      if (certs[i].certificationRequestInfo) {
        pem += forge.pki.certificationRequestToPem(certs[i]);
      } else {
        pem += forge.pki.certificateToPem(certs[i]);
      }
    }
    resolve(pem);
  });
};

/**
 * Gets byte array representation of the certificate in p12 format
 * @param {String} privateKeyPem - Private Key in PEM format
 * @param {String} password - Password to encrypt the p12
 * @param {Object} opt - Optional configuration
 * @returns {String}
 */
Certificate.prototype.toP12 = function(privateKeyPem, password) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var arr = privateKeyPem.split('-----');
    if (!(arr[1] == 'BEGIN PRIVATE KEY' || arr[1] == 'BEGIN RSA PRIVATE KEY')) {
      return reject('Invalid private key');
    }
    if (!password) {
      return reject('No password defined');
    }
    var series = Promise.resolve();
    var privateKey, p12Asn1, p12Der, p12b64;
    series = series.then(function() {
      privateKey = window.forge.pki.privateKeyFromPem(privateKeyPem);
    });
    series = series.then(function() {
      // create P12 ASN1 object
      p12Asn1 = forge.pkcs12.toPkcs12Asn1(privateKey, self.certData, password);
    });
    series = series.then(function() {
      // encode
      p12Der = forge.asn1.toDer(p12Asn1).getBytes();
    });
    series = series.then(function() {
      p12b64 = forge.util.encode64(p12Der);
      resolve(p12b64);
    });
  });
};

/**
 * Build a new certificate object from PEM format
 *
 * @param {String} pem - PEM string of certificate(s)
 * @returns {Object} - A forge certificate object, passed to Certificate object itself
 */
Certificate.prototype.parsePEM = function(pemString) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var separatedPem = pemString.split('-\n-');
    for (var i = 0; i < separatedPem.length; i++) {
      if (i == 0) {
        separatedPem[i] += '-';
      } else if (i == separatedPem.length - 1) {
        separatedPem[i] = '-' + separatedPem[i];
      } else {
        separatedPem[i] = '-' + separatedPem[i] + '-';
      }
    }
    for (var i = 0; i < separatedPem.length; i++) {
      var pem = separatedPem[i];
      var arr = pem.split('-----');
      if (arr[1] == 'BEGIN CERTIFICATE REQUEST') {
        var cert = forge.pki.certificationRequestFromPem(pem);
        self.certData.push(cert);
      } else if (arr[1] == 'BEGIN CERTIFICATE') {
        var cert = forge.pki.certificateFromPem(pem);
        self.certData.push(cert);
      } else {
        reject('Not a valid PEM string');
      }
    }
    resolve(self);
  });
};

/**
 * @typedef ParseP12Result
 * @type Object
 * @property {String} privateKey - Private key in PEM format.
 * @property {Object} certificate - The certificate objVdect, will be passed to Certificate object itself too.
 */

/**
 * Build a new certificate object from a p12 format
 *
 * @param {ArrayBuffer} data - An array buffer of .p12 file
 * @param {String} [password] - Password to open P12 container
 * @returns {ParseP12Result} - An object that contains certificate and private key
 *.
 */
Certificate.prototype.parseP12 = function(data, password) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var p12Der = forge.util.decode64(Utils.ab2Base64(data));
    var p12Asn1 = forge.asn1.fromDer(p12Der);
    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
    var certBags = p12.getBags({bagType: forge.pki.oids.certBag});
    var cert = certBags[forge.pki.oids.certBag][0].cert;
    var certs = certBags[forge.pki.oids.certBag];

    var keyBags = p12.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
    var bag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
    var privateKey = forge.pki.privateKeyToPem(bag.key);

    for (var i = 0; i < certs.length; i++) {
      self.certData.push(certs[i].cert);
    }
    var result = {
      certificate: self,
      privateKey: privateKey,
    };
    resolve(result);
  });
};

/**
 * @typedef RealValidateResult
 * @property {Boolean} isValid - Whether the certificate valid or not
 * @property {Boolean} isTrusted - Whether the certificate trusted or not
 */

/**
 * Real validate function to check expirate date, verify cert, verify cert path
 *
 * @param {Array} chain - An array of certs. Sorted by certificate level. The parent/top level certificate is the last item in array.
 * @returns {RealValidateResult} - The result of validation
 * @static
 */
Certificate.realValidate = function(chain) {
  return new Promise(function(resolve, reject) {
    if (!chain || chain.length == 0) {
      error = {
        message: 'No certificate chain defined.',
      };
      return reject(error);
    }
    var result = {
      isValid: true,
      isTrusted: true,
    };
    var caStoreCerts = [];
    for (var x in PKIWebSDK.private.caStore.certs) {
      caStoreCerts.push(PKIWebSDK.private.caStore.certs[x]);
    }
    var rootCa = caStoreCerts[0];
    var isTop = false;
    var hasError = false;
    var i = 0;
    while (!isTop) {
      var error = null;
      var cert = chain[i];
      if (i < chain.length - 1) {
        var parent = chain[i + 1];
      } else {
        var parent = cert;
        isTop = true;
      }
      // Check expiry
      var now = new Date();
      if (
        cert.validity.notAfter.getTime() < now.getTime() ||
        cert.validity.notBefore.getTime() > now.getTime()
      ) {
        error = {
          message: 'Certificate is not valid yet or has expired.',
          error: forge.pki.certificateError.certificate_expired,
          notBefore: cert.validity.notBefore,
          notAfter: cert.validity.notAfter,
          now: now,
        };
      }
      // Check if issuer matched
      if (!cert.isIssuer(parent)) {
        // If it is the last cert in chain and not a self-signed, add caStore's certs to the chain
        // and redo the loop 1 step
        if (isTop) {
          chain = chain.concat(caStoreCerts.reverse());
          i--;
          isTop = false;
        } else {
          result.isTrusted = false;
          if (hasError) {
            result.isValid = false;
          }
        }
      } else {
        if (isTop && cert.isIssuer(parent)) {
          if (!cert.isIssuer(rootCa)) {
            result.isTrusted = false;
          }
          if (hasError) {
            result.isValid = false;
          }
        }
        // Verify certificate signature
        if (!parent.verify(cert)) {
          error = {
            message: 'Certificate signature is invalid.',
            error: forge.pki.certificateError.bad_certificate,
          };
        }
      }

      // Set isValid to be false if there is any error
      if (error != null) {
        if (
          error.message &&
          error.message === 'Certificate is not valid yet or has expired.'
        ) {
          result.isValid = false;
        }
        hasError = true;
      }
      if (isTop) {
        resolve(result);
      }
      i++;
    } // End of while
  });
};

/**
 * @typedef ValidateResult
 * @type Object
 * @property {Boolean} isValid - Whether the certificate valid or not
 * @property {Boolean} isTrusted - Whether the certificate trusted or not
 */

/**
 * Validates the certificate
 *
 * @param {Array} chain - An array of cert chain in forge cert object format. Sorted by certificate level. The parent/top level certificate is the last item in array.
 * @returns {ValidateResult} - The result of validation
 */
Certificate.prototype.validate = function() {
  var self = this;
  var chain = self.certData;
  return new Promise(function(resolve, reject) {
    Certificate.realValidate(chain)
      .then(function(result) {
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

/**
 * @typedef TrustResult
 * @type Object
 * @property {Boolean} isValid - Whether the certificate valid or not
 * @property {Boolean} isTrusted - Whether the certificate trusted or not
 */

/**
 * Trust the certificate
 *
 * @description - If valid, the certificate(s) will be merged to CA Store
 * @param {Array} chain - An array of cert chain in forge cert object format. Sorted by certificate level. The parent/top level certificate is the last item in array.
 * @returns {TrustResult} - The result of validation
 */
Certificate.trust = function(chain) {
  var self = this;
  return new Promise(function(resolve, reject) {
    Certificate.realValidate(chain)
      .then(function(result) {
        if (result.isValid && result.isTrusted) {
          for (var i = 0; i < chain.length; i++) {
            window.PKIWebSDK.private.caStore.addCertificate(chain[i]);
          }
        }
        resolve(result);
      })
      .catch(function(err) {
        reject(err);
      });
  });
};

/**
 * Gets the issuer information
 *
 * @returns {Object} - Object that contains certificate's issuer detail
 */
Certificate.prototype.getIssuer = function() {
  var cert = this.certData[0];
  return new Promise(function(resolve, reject) {
    var issuer = cert.issuer.attributes;
    var wrap = {};
    for (var i = 0; i < issuer.length; i++) {
      wrap[issuer[i].name] = issuer[i].value;
    }
    resolve(wrap);
  });
};

/**
 * Gets the subject information
 *
 * @returns {Object} - Object that contains certificate's subject detail
 */
Certificate.prototype.getSubject = function() {
  var cert = this.certData[0];
  return new Promise(function(resolve, reject) {
    var subject = cert.subject.attributes;
    var wrap = {};
    for (var i = 0; i < subject.length; i++) {
      wrap[subject[i].name] = subject[i].value;
    }
    resolve(wrap);
  });
};

/**
 * Gets the version number of the certificate
 *
 * @returns {Number} - Version number of certificate
 */
Certificate.prototype.getVersionNumber = function() {
  var cert = this.certData[0];
  return new Promise(function(resolve, reject) {
    resolve(cert.version);
  });
};

/**
 * Gets the serial number of the certificate
 *
 * @returns {String} - Serial number of certificate
 */
Certificate.prototype.getSerialNumber = function() {
  var cert = this.certData[0];
  return new Promise(function(resolve, reject) {
    resolve(cert.serialNumber);
  });
};

/**
 * Gets the algorithm used to create the public key
 *
 * @returns {String} - Algorithm of certificate's public key
 */
Certificate.prototype.getPublicKeyAlgorithm = function() {
  var cert = this.certData[0];
  return new Promise(function(resolve, reject) {
    var alg = forge.oids[cert.signatureOid];
    resolve(alg);
  });
};

/**
 * Gets the public key of the subject which signed the certificate
 *
 * @returns {Key} - Public key of certificate
 */
Certificate.prototype.getPublicKey = function() {
  var cert = this.certData[0];
  return new Promise(function(resolve, reject) {
    var pem = forge.pki.publicKeyToPem(cert.publicKey);
    resolve(pem);
  });
};

/**
 * Gets the signature of the certificate
 *
 * @returns {ArrayBuffer} - An array buffer of the certificate's signature
 */
Certificate.prototype.getSignature = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var signature = Utils.str2Ab(self.certData[0].signature);
    resolve(signature);
  });
};

/**
 * Gets the usage of the certificate
 *
 * @returns {string[]} - Array of string that represents the usage of certificate
 */
Certificate.prototype.getUsage = function() {
  var extensions = this.certData[0].extensions;
  var usage = [];
  return new Promise(function(resolve, reject) {
    for (var i = 0; i < extensions.length; i++) {
      if (extensions[i].id == '2.5.29.15' || extensions[i].id == '2.5.29.37') {
        for (var child in extensions[i]) {
          if (extensions[i][child] == true) {
            usage.push(child);
          }
        }
      }
    }
    resolve(usage);
  });
};

module.exports = Certificate;
