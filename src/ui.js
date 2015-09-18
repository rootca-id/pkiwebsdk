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
    var reader = new window.FileReader()
    reader.readAsText(files[0]);
    reader.onload = function(e) {
      var cert = new window.PKIWebSDK.Certificate();
      cb(cert.parsePEM(reader.result));
     }
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
    var reader = new window.FileReader()
    reader.readAsArrayBuffer(files[0]);
    reader.onload = function(e) {
      cb(window.PKIWebSDK.Certificate.getRevocationList(reader.result));
     }
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
    var reader = new window.FileReader()
    var password = document.getElementById("pkiwebsdk-p12-password").value; 
    reader.readAsArrayBuffer(files[0]);
    reader.onload = function(e) {
      var cert = new window.PKIWebSDK.Certificate();
      cb(cert.parseP12(reader.result, password));
     }
  });
}

/**
 * Generate HTML element that handle P12 container file to get private key
 *
 * @params {String} element - Id of the parent element. Without # symbol.
 * @returns {Object} cb - Return a promise from Certificate.getPrivateKey()
 */
UI.getP12PrivateKey = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["get-p12-private-key.html"];
  document.getElementById("pkiwebsdk-get-p12-private-key").addEventListener("change", function(evt){
    var files = evt.target.files; 
    var reader = new window.FileReader()
    var password = document.getElementById("pkiwebsdk-p12-password-private-key").value; 
    reader.readAsArrayBuffer(files[0]);
    reader.onload = function(e) {
      cb(window.PKIWebSDK.Certificate.getPrivateKey(reader.result, password));
     }
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
  var certChain = new window.PKIWebSDK.Certificate();
  var e = document.getElementById(element);
  e.innerHTML = html["get-cert-chain.html"];
  document.getElementById("pkiwebsdk-get-cert-chain").addEventListener("change", function(evt){
    var files = evt.target.files; 
    var reader = new window.FileReader()
    reader.readAsText(files[files.length-1]);
    reader.onload = function(e) {
      var cert = new window.PKIWebSDK.Certificate();
      cert.parsePEM(reader.result)
        .then(function(){
          certChain.certData.push(cert.certData[0]);
          var list = document.getElementById("pkiwebsdk-cert-chain-list");
          list.innerHTML += "<br> - " + files[files.length-1].name;
        })
     }
  });
  document.getElementById("pkiwebsdk-get-cert-chain-validate").addEventListener("click", function(evt){
    cb(certChain.validate());
  });
  document.getElementById("pkiwebsdk-get-cert-chain-trust").addEventListener("click", function(evt){
    cb(window.PKIWebSDK.Certificate.trust(certChain.certData));
  });
  document.getElementById("pkiwebsdk-clear-cert-chain").addEventListener("click", function(evt){
    certChain.certData = [];              
    var list = document.getElementById("pkiwebsdk-cert-chain-list");
    list.innerHTML = "Chain list :";
  });
}

module.exports = UI;
