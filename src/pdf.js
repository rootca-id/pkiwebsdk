'use strict';

require('../lib/pdfjs/pdf.combined');
var Certificate = require('./certificate');
var SignedData = require('./signed-data');
var forge = window.PKIWebSDK.private.forge;

/**
 * Represents a PDF object
 * @constructor
 * @param {String} rawData - The raw data of the PDF file. One can prepare this using String.fromCharCode() function.
 */
var PDF = function(rawData) {
  var self = this;

  self.data = rawData;
}

/**
 * Signs the PDF with a key
 * @param {Key} key - The private key used to sign the document
 */
PDF.prototype.sign = function(key) {
}

/**
 * Visually sign the PDF with a key
 * @param {Key} key - The private key used to sign the document
 * @param {ArrayBuffer} jpegStream - The visual image of the signature as a JPEG stream
 * @param {Number} page - The page where the signature will be located
 * @param {Number} x - The x-axis of the coordinate where the signature will be located within the page
 * @param {Number} y - The y-axis of the coordinate where the signature will be located within the page
 * @param {Number} width - The width of the image
 * @param {Number} height - The height of the image
 *
 */
PDF.prototype.signVisually = function(key, jpegStream, page, x, y, width, height) {
}


var digestAlgorithmMap = {
  '1.3.14.3.2.26': 'sha-1',
  '2.16.840.1.101.3.4.2.1': 'sha-256',
  '2.16.840.1.101.3.4.2.2': 'sha-384',
  '2.16.840.1.101.3.4.2.3': 'sha-512'
}

/**
 * Gets signatures embedded in the PDF file 
 * @returns {Object} - the signatures with embedded certificates. One can then validate the certificates using the method in {Certificate} class
 */
PDF.prototype.getSignatures = function(cb) {
  var self = this;

  return new Promise(function(resolve, reject) {
    PDFJS.getDocument({ data: self.data}).then(function(doc) {
      var signatures = doc.pdfInfo.signatures;
      if (signatures.length > 0) {
        var signaturePromises = [];
        for (var i = 0; i < signatures.length; i ++) {
          signaturePromises.push(new Promise(function(sigResolve, sigReject) {
            var signature = signatures[i];
            var str = signature.der;
            var signedData = SignedData.fromDER(signature.der);
            delete(signature.der);

            signature.signedData = signedData;
            if (!signedData.getData().signerInfo[0]) {
              throw new Error('signer info is not available');
            }
            var signerInfo = signedData.getData().signerInfo[0];

            var algo = digestAlgorithmMap[signerInfo.digestAlgorithm];
            if (!algo) {
              throw new Error('algorithm is unknown:' + signerInfo.digestAlgorithm);
            }

            var first = signature.byteRange[1];
            var second = signature.byteRange[3];
            var secondPos = signature.byteRange[2];
            var length = first + second;
            var hashed = new Uint8Array(length);

            // combine the head and tail area according the the byte range
            for (var k = 0, pos = 0; k < first; k ++, pos++) {
              hashed[pos] = self.data[k];
            }
            for (var k = 0; k < second; k ++, pos++) {
              hashed[pos] = self.data[k + secondPos];
            }

            // calculate hash specified in the byte range
            var hashPromise = window.crypto.subtle.digest({
              name: algo,
            }, hashed);
            hashPromise.then(function(hash) {
              var serialPromises = [];
              var hashHex = forge.util.binary.hex.encode(hash);
              var signerInfo = signedData.getData().signerInfo[0];
              var digest = signerInfo.authenticatedAttributes.digest;
              var certs = signedData.getData().certificates;
              var found = false;
              for (var j = 0; j < certs.length; j ++) {
                serialPromises.push(certs[j].getSerialNumber());
              }
              
              Promise.all(serialPromises).then(function(serialNumbers) {
                for (var j = 0; j < serialNumbers.length; j ++) {
                  if (serialNumbers[j] === signerInfo.serialNumber) {
                    found = true;
                  }
                }
                signature.verified = true;
                if (!found) {
                  signature.verified = false;
                }
                if (digest !== hashHex) {
                  signature.verified = false;
                }
                hashed = null;
                sigResolve(signature);
              });
            }, function(error) {
              sigReject(error);
            }).catch(function(error) {
              sigReject(error);
            });
          }));
        }
        Promise.all(signaturePromises).then(function(signatures) {
          resolve(signatures); 
        }, function(error) {
          reject(error);
        }).catch(function(error) {
          reject(error);
        });
      } else {
        resolve(signatures); 
      }
    });
  });
}
module.exports = PDF;
