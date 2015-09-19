'use strict';

// Obtains HTML template
var html = require("../html/html-min.js");

/**
 * Represents a UI object
 * @constructor
 */
var UI = function() {
  var self = this;
}

// Declare empty certificate object
UI.certChain = {};


// Handle input file
UI.handler = {}
UI.handler.PEM = function(file) {
  console.log(file);
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader();
      reader.readAsText(file);
      reader.onload = function(e){
        var cert = new window.PKIWebSDK.Certificate();
        resolve(cert.parsePEM(reader.result));
      }
    }
  })
}
UI.handler.CRL = function(file) {
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        resolve(window.PKIWebSDK.Certificate.getRevocationList(reader.result));
       }
    }
  })
}

UI.handler.P12 = function(file) {
  console.log(file);
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      var password = document.getElementById("pkiwebsdk-p12-password").value; 
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        var cert = new window.PKIWebSDK.Certificate();
        resolve(cert.parseP12(reader.result, password));
       }
    }
  })
}

UI.handler.certChain = function(file) {
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      reader.readAsText(file);
      reader.onload = function(e) {
        var cert = new window.PKIWebSDK.Certificate();
        cert.parsePEM(reader.result)
          .then(function(){
            UI.certChain.certData.push(cert.certData[0]);
            var list = document.getElementById("pkiwebsdk-cert-chain-list");
            list.innerHTML += "<br> - " + file.name;
          })
      }
    }
  })
}

/**
 * Generate HTML element that handle certificate PEM file
 *
 * @params {String} element - Id of the parent element. Without # symbol.
 * @returns {Object} cb - Return a promise from Certificate.prototype.parsePEM()
 */
UI.getCertPEM = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["get-cert-pem.html"];
  document.getElementById("pkiwebsdk-get-cert-pem").addEventListener("change", function(evt){
    var files = evt.target.files;
    console.log(files);
    cb(UI.handler.PEM(files[0]));
  });
}

/**
 * Generate HTML element that handle Certificate Revocation List file
 *
 * @params {String} element - Id of the parent element. Without # symbol.
 * @returns {Object} cb - Return a promise from Certificate.getREvocationList()
 */
UI.getCRL = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["get-crl.html"];
  document.getElementById("pkiwebsdk-get-crl").addEventListener("change", function(evt){
    var files = evt.target.files; 
    cb(UI.handler.CRL(files[0]));
  });
}

/**
 * Generate HTML element that handle P12 container file to get certificate
 *
 * @params {String} element - Id of the parent element. Without # symbol.
 * @returns {Object} cb - Return a promise from Certificate.prototype.parseP12()
 */
UI.getP12 = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["get-p12.html"];
  document.getElementById("pkiwebsdk-get-p12").addEventListener("change", function(evt){
    var files = evt.target.files;
    cb(UI.handler.P12(files[0]));
  });
}

/**
 * Generate HTML element that handle P12 container file to get private key
 *
 * @params {String} element - Id of the parent element. Without # symbol.
 * @returns {Object} cb - Return a promise from Certificate.prototype.validate() or Certificate.trust()
 */
UI.getCertChain = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["get-cert-chain.html"];
  document.getElementById("pkiwebsdk-get-cert-chain").addEventListener("change", function(evt){
    var files = evt.target.files;
    if (!UI.certChain.certData) {
      UI.certChain = new window.PKIWebSDK.Certificate();
    }
    cb(UI.handler.certChain(files[files.length-1]));
  });
  document.getElementById("pkiwebsdk-get-cert-chain-validate").addEventListener("click", function(evt){
    cb(UI.certChain.validate());
  });
  document.getElementById("pkiwebsdk-get-cert-chain-trust").addEventListener("click", function(evt){
    cb(window.PKIWebSDK.Certificate.trust(certChain.certData));
  });
  document.getElementById("pkiwebsdk-clear-cert-chain").addEventListener("click", function(evt){
    UI.certChain.certData = [];              
    var list = document.getElementById("pkiwebsdk-cert-chain-list");
    list.innerHTML = "Chain list :";
  });
}

module.exports = UI;
