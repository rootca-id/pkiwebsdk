'use strict';

require('../lib/pdfjs/pdf.combined');

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

/**
 * Gets signatures embedded in the PDF file 
 * @returns {Object} - the signatures with embedded certificates. One can then validate the certificates using the method in {Certificate} class
 */
PDF.prototype.getSignatures = function(cb) {
  var self = this;

  return new Promise(function(resolve, reject) {
    PDFJS.getDocument({ data: self.data}).then(function(doc) {
      resolve(doc.pdfInfo.signatures); 
    });
  });
}
module.exports = PDF;
