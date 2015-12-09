'use strict';

/**
 * Represents utils object
 * @constructor
 */
var Utils = function() {
  var self = this;
}

/**
 * Transfer an array buffer data to client as file download
 *
 * @param {ArrayBuffer} arrayBuffer - An array buffer
 * @param {ArrayBuffer} filename - File name with extension
 * @param {ArrayBuffer} type - File type, ex : "application/pdf"
 */

Utils.toFile = function(arrayBuffer, filename, type){
  var blob = new Blob([arrayBuffer], { type: type });
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var URL = window.URL || window.webkitURL;
    var downloadUrl = URL.createObjectURL(blob);
    if (filename) {
      var a = document.createElement("a");
      if (typeof a.download === 'undefined') {
        window.location = downloadUrl;
      } else {
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
      }
    } else {
      window.location = downloadUrl;
    }
    setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
  }
}

/**
 * Convert array buffer to string
 *
 * @param {ArrayBuffer} arrayBuffer - An array buffer of data
 * @returns {String} - String
 *
 */
Utils.ab2Str = function (buffer) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return binary;
}

/**
 * Convert string to array buffer
 *
 * @param {String} - String
 * @returns {ArrayBuffer} arrayBuffer - An array buffer of data
 *
 */
Utils.str2Ab = function (string) {
  var buf = new ArrayBuffer(string.length);
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=string.length; i<strLen; i++) {
    bufView[i] = string.charCodeAt(i);
  }
  return buf;
}

/** 
 * Convert base64 string to array buffer
 *
 * @param {String} - Base64 string
 * @returns {ArrayBuffer} arrayBuffer - An array buffer of data
 *
 */
Utils.base642Ab = function(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++ ) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Convert array buffer to base64 string
 *
 * @param {ArrayBuffer} arrayBuffer - An array buffer of data
 * @returns {String} - Base64 string
 *
 */
Utils.ab2Base64 = function(arrayBuffer) {
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
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4
    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
    base64 += encodings[a] + encodings[b] + encodings[c] + "="
  }
  return base64
}

/**
 * Convert bytes to human readable size
 *
 * @param {Integer} bytes - integer of size in byte
 * @returns {Integer} - Converted human readable size
 *
 */
Utils.humanReadableSize = function(bytes) {
  if(bytes < 1024) return parseInt(bytes).toLocaleString("id") + " Bytes";
  else if(bytes < 1048576) return parseInt((bytes / 1024).toFixed(0)).toLocaleString("id") + " KB";
  else if(bytes < 1073741824) return parseInt((bytes / 1048576).toFixed(0)).toLocaleString("id") + " MB";
  else return parseInt((bytes / 1073741824).toFixed(0)).toLocaleString("id") + " GB";
}

module.exports = Utils;
