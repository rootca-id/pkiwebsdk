'use strict';

// Obtains HTML template
var async = require("async");
var html = require("../html/html-min.js");

/**
 * Represents a UI object
 * @constructor
 */
var UI = function() {
  var self = this;
}

// Declare empty object
UI.certChain = {};
UI.P12ToSign = {};
UI.signInfo = {};


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

UI.handler.P12ToSign = function(file) {
  console.log(file);
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      var password = document.getElementById("pkiwebsdk-p12-password-to-sign").value; 
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        var cert = new window.PKIWebSDK.Certificate();
        var result;
        cert.parseP12(reader.result, password)
          .then(function(p12){
            result = p12;
            UI.P12ToSign.certificate = result.certificate;
            return result.certificate.getSubject();
          })
          .then(function(subject){
            return window.PKIWebSDK.Key.parsePEM(result.privateKey, "SHA-256")
          })
          .then(function(privateKey){
            UI.P12ToSign.privateKey = privateKey;
            resolve();
          })
       }
    }
  })
}
UI.handler.PDFToSign = function(file) {
  console.log(file);
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        UI.PDFToSign = new window.PKIWebSDK.PDF(reader.result);
        resolve();
      }
    }
  })
}
UI.handler.PDFToVerify = function(file) {
  console.log(file);
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        UI.PDFToVerify = new window.PKIWebSDK.PDF(new Uint8Array(reader.result));
        var signatures = UI.PDFToVerify.getSignatures()
          .then(function(signatures){
            console.log(signatures);
            if (signatures.length > 0) {
              var result = {
                isVerified : signatures[0].verified,
                isValid : true,
                isTrusted : true
              }
              var certs = signatures[0].signedData.data.certificates;
              async.eachSeries(certs, function iterator(item, cb){
                if (result.isValid && result.isTrusted) {
                  certs[0].validate()
                    .then(function(validationResult){
                      result.isValid = validationResult.isValid;
                      result.isTrusted = validationResult.isTrusted;
                      cb();
                    })
                    .catch(function(err){
                      reject(err);
                    })
                } else {
                  cb();
                }
              }, function(done){
                resolve(result);
              })
            } else {
              resolve(false);
            }
          })
          .catch(function(err){
            reject(err);
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
  document.getElementById("pkiwebsdk-get-cert-pem").onchange = function () {
    document.getElementById("pkiwebsdk-get-cert-pem-uploadfile").value = this.value.substring(12);
  };
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
  document.getElementById("pkiwebsdk-get-crl").onchange = function () {
    document.getElementById("pkiwebsdk-get-crl-uploadfile").value = this.value.substring(12);
  };
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
  document.getElementById("pkiwebsdk-get-p12").onchange = function () {
    document.getElementById("pkiwebsdk-get-p12-uploadfile").value = this.value.substring(12);
  };  
}

/**
 * Generate HTML element that handle P12 container file in purpose of signing a document
 *
 * @params {String} element - Id of the parent element. Without # symbol.
 * @returns {Object} cb - Return a promise from Certificate.prototype.parseP12()
 */
UI.getP12ToSign = function(element, cb) {
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
    cb(window.PKIWebSDK.Certificate.trust(UI.certChain.certData));
  });
  document.getElementById("pkiwebsdk-clear-cert-chain").addEventListener("click", function(evt){
    UI.certChain.certData = [];              
    var list = document.getElementById("pkiwebsdk-cert-chain-list");
    list.innerHTML = "Chain list :";
  });
  document.getElementById("pkiwebsdk-get-cert-chain").onchange = function () {
    document.getElementById("pkiwebsdk-get-cert-chain-uploadfile").value = this.value.substring(12);
  };  
}

/**
 * Generate HTML element that handle P12 and PDF file, in purpose of signing the PDF.
 *
 * @params {String} element - Id of the parent element. Without # symbol.
 * @returns {Object} cb - Return a promise from PDF.prototype.sign()
 */
UI.signPDF = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["sign-pdf.html"];
  document.getElementById("pkiwebsdk-get-p12-to-sign").addEventListener("change", function(evt){
    var files = evt.target.files;
    UI.handler.P12ToSign(files[0]);
  });
  document.getElementById("pkiwebsdk-get-pdf-to-sign").addEventListener("change", function(evt){
    var files = evt.target.files;
    UI.handler.PDFToSign(files[0]);
  });
  document.getElementById("pkiwebsdk-get-pdf-to-sign-trigger").addEventListener("click", function(evt){
    UI.P12ToSign.certificate.getSubject()
      .then(function(subject){
        UI.signInfo.date = new Date();
        UI.signInfo.name = subject.commonName;
        UI.signInfo.location = subject.localityName;
        UI.signInfo.reason = document.getElementById("pkiwebsdk-p12-to-sign-info-reason").value;
        UI.signInfo.contactInfo = document.getElementById("pkiwebsdk-p12-to-sign-info-contact-info").value;
        cb(UI.PDFToSign.sign(UI.P12ToSign.certificate, UI.P12ToSign.privateKey, UI.signInfo));
      })
  });
  document.getElementById("pkiwebsdk-get-p12-to-sign").onchange = function () {
    document.getElementById("pkiwebsdk-get-p12-to-sign-uploadfile").value = this.value.substring(12);
  };  
  document.getElementById("pkiwebsdk-get-pdf-to-sign").onchange = function () {
    document.getElementById("pkiwebsdk-get-pdf-to-sign-uploadfile").value = this.value.substring(12);
  };    
}

/**
 * Generate HTML element that handle PDF file, in purpose of verifying the PDF.
 *
 * @params {String} element - Id of the parent element. Without # symbol.
 * @returns {Object} cb - Return a promise from PDF.prototype.verify()
 */
UI.verifyPDF = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["verify-pdf.html"];
  document.getElementById("pkiwebsdk-get-pdf-to-verify").addEventListener("change", function(evt){
    var files = evt.target.files;
    cb(UI.handler.PDFToVerify(files[0]));
  });
  document.getElementById("pkiwebsdk-get-pdf-to-verify").onchange = function () {
    document.getElementById("pkiwebsdk-get-pdf-to-verify-uploadfile").value = this.value.substring(12);
  };    
}

module.exports = UI;
