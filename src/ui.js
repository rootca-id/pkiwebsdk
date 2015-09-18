'use strict';

var html = require("../html/html.js");
console.log(html);
/**
 * Represents a UI object
 * @constructor
 */
var UI = function() {
  var self = this;
}

UI.getCertPEM = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["get-cert-pem.html"];
  document.getElementById("get-cert-pem").addEventListener("change", function(evt){
    var files = evt.target.files; 
    var reader = new window.FileReader()
    reader.readAsText(files[0]);
    reader.onload = function(e) {
      var cert = new window.PKIWebSDK.Certificate();
      cb(cert.parsePEM(reader.result));
     }
  });
}

UI.getCRL = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["get-crl.html"];
  document.getElementById("get-crl").addEventListener("change", function(evt){
    var files = evt.target.files; 
    var reader = new window.FileReader()
    reader.readAsArrayBuffer(files[0]);
    reader.onload = function(e) {
      cb(window.PKIWebSDK.Certificate.getRevocationList(reader.result));
     }
  });
}

UI.getP12 = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["get-p12.html"];
  document.getElementById("get-p12").addEventListener("change", function(evt){
    var files = evt.target.files; 
    var reader = new window.FileReader()
    var password = document.getElementById("p12-password").value; 
    reader.readAsArrayBuffer(files[0]);
    reader.onload = function(e) {
      var cert = new window.PKIWebSDK.Certificate();
      cb(cert.parseP12(reader.result, password));
     }
  });
}
UI.getP12PrivateKey = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["get-p12-private-key.html"];
  document.getElementById("get-p12-private-key").addEventListener("change", function(evt){
    var files = evt.target.files; 
    var reader = new window.FileReader()
    var password = document.getElementById("p12-password-private-key").value; 
    reader.readAsArrayBuffer(files[0]);
    reader.onload = function(e) {
      cb(window.PKIWebSDK.Certificate.getPrivateKey(reader.result, password));
     }
  });
}

UI.getCertChain = function(element, cb) {
  var self = this;
  var certChain = new window.PKIWebSDK.Certificate();
  var e = document.getElementById(element);
  e.innerHTML = html["get-cert-chain.html"];
  document.getElementById("get-cert-chain").addEventListener("change", function(evt){
    var files = evt.target.files; 
    var reader = new window.FileReader()
    var password = document.getElementById("p12-password-private-key").value; 
    reader.readAsText(files[files.length-1]);
    reader.onload = function(e) {
      /* cb(window.PKIWebSDK.Certificate.getPrivateKey(reader.result, password)); */
      var cert = new window.PKIWebSDK.Certificate();
      cert.parsePEM(reader.result)
        .then(function(){
          certChain.certData.push(cert.certData[0]);
          var list = document.getElementById("cert-chain-list");
          list.innerHTML += "<br> - " + files[files.length-1].name;
        })
     }
  });
  document.getElementById("get-cert-chain-validate").addEventListener("click", function(evt){
    console.log("validating");
    cb(certChain.validate());
  });
  document.getElementById("get-cert-chain-trust").addEventListener("click", function(evt){
    console.log("trusting");
    cb(window.PKIWebSDK.Certificate.trust(certChain.certData));
  });
  document.getElementById("clear-cert-chain").addEventListener("click", function(evt){
    console.log("clear");
    certChain.certData = [];              
    var list = document.getElementById("cert-chain-list");
    list.innerHTML = "Chain list :";
  });
}

module.exports = UI;
