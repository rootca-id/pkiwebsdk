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
        var hashPromises = [];
        var signaturePromises = [];
        for (var i = 0; i < signatures.length; i ++) {
          var str = signatures[i].der;
          var signedData = SignedData.fromDER(signatures[i].der);
          delete(signatures[i].der);

          signatures[i].signedData = signedData;
          var signerInfo = signedData.getData().signerInfo;

          var algo = digestAlgorithmMap[signerInfo.digestAlgorithm];
          if (!algo) {
            throw new Error('algorithm is unknown:' + signerInfo.digestAlgorithm);
          }

          var first = signatures[i].byteRange[1];
          var second = signatures[i].byteRange[3];
          var secondPos = signatures[i].byteRange[2];
          var length = first + second;
          var hashed = new Uint8Array(length);

          for (var k = 0, pos = 0; k < first; k ++, pos++) {
            hashed[pos] = self.data[k];
          }
          
          for (var k = 0; k < second; k ++, pos++) {
            hashed[pos] = self.data[k + secondPos];
          }

          var hashPromise = window.crypto.subtle.digest({
            name: algo,
          }, hashed)
          hashPromises.push(hashPromise);
        }
        Promise.all(hashPromises).then(function(hashes) {
          for (var i = 0; i < hashes.length; i ++) {
            var hash = forge.util.binary.hex.encode(hashes[i]);
            signatures[i].signedData = signedData;
            var signerInfo = signedData.getData().signerInfo;
            var digest = signerInfo.authenticatedAttributes.digest;
            if (digest === hash) {
              signatures[i].integrityBreached = false;
            } else {
              signatures[i].integrityBreached = true;
            }
          }
          hashed = null;
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
