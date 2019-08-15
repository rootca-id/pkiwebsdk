'use strict';
var assets = {
  checked : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAPCAYAAAACsSQRAAAABGdBTUEAAK/INwWK6QAAAAlwSFlzAAAuIwAALiMBeKU/dgAAActpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgSW1hZ2VSZWFkeTwveG1wOkNyZWF0b3JUb29sPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KsiN+8QAAAjFJREFUOBGVU89rE0EU/mY2yaYabUFU0JuoDbbaghWipRIpYv0B0VNARAwE+jf01pNe7MEfB4V60UvxZg/qwcaqKAhaQapWiFhpGywVCUmz6f6a8c1sExcEje8ws/v2e9/7vpm3wP+EHOVNuJW+icpApvne0kOYoNw/DpmWWD7yStWy1gjACSk09ntqAm08i2V3DZt4HLZ/I/JPktEQwbdDE4DMYqFuE2kcNXLHYQckMqSIQTaJVb6hYK73HiCyWLJtGMyEEAIey6Hn/d0Iwp1UtQx1DuxKzHRfI7ILWFojAphwYUGKDA5/eoKn6XU3c739mO15jJcHtmkV9wna+Ph63zDedUlMJx08S9Le6aCwd1Dj3hyMqp3pwqhfQLvRhRX3I2rGEE7MLmjQ1J6j4KwARxoQ5DKirZ7D8eIDKIK+t25A8iL5CBv5EH64q0jwBGp+EdVICt7+MjbPfKA2nagLF3EWhSfzOPP1jlZ5bNrTjWgxcHHLZ1jeALjcibJnoY1th3C7wRf76OtpVDybTiGGuryMs/NX6QwjyM03CQIlan24eyscdxKGTGFV2AQztXBbOEQaIzuTOF/KUC6Yq/ANUjnX0k4VV2h4BklJAcw3UfUclB0PvhdDxf0Ci+dULwp15b9HIMgRifKmbmO4ZMEsnUTVnYKkYsdnZFPAFnnkF39qG42ZWS/+c1NEKm7v2IDrHc8x3iEx1j6ic+ocWo4G+Ep8F8YSt3CJRjuIv/5jvwCBb9gEiJJh2gAAAABJRU5ErkJggg==",
  cross : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAADxJAAA8SQGhO2qeAAABy2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD53d3cuaW5rc2NhcGUub3JnPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoE1OjLAAAA+ElEQVQoFZ1TSw6CMBQsRBcuqRyJc+DxdCHhVrp2p4kRZ8pMLYkxKsnLtO/N9H1oQ9A3hdDBIrfAlf3ar4UNeWWM5B42wUYHsLYgocSjeLvEw4YZKbQNWNcib4Q1fPSbQ+yYlaX4xJsIR2DOjDX3FDhOfpOy63SffBXxAGxhRArtH0pRGg6CFcwZXN5JwoeQcbc0zwKOskRnuktgpD/zcnaV7eFsQTpLeBGygrbkZTEC+USsv88Mctmzh+aeXYH3Zc+vi4RDLPRU9/CxBVdi/2LaEYR//nPkJXl3w6pyOODwN7oytzDfcQR+vdt9nrayfHpVHuriVT0BN7H+//YwpRsAAAAASUVORK5CYII=",
  star : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAACO0lEQVQoFX1Sz2sTQRR+M7O7iZukSdsQrcaK9RIRBVERe7BVxIMXD/4DovUqFg8K9pAiXgQPHnpTvIsXEfTW1CKKRxWhByGUQqTVpE27SXZnd+c5b5NNiocOzL4f3/e992Z2APZY1UoutwcM/H8QERjlOp+Gx8dSsNjQluI4T368+mICaf/6ABaBAcNbiQP8tNCWYsrHHIppRV267uBbe5fJZ/P8p8GhECKsNxx1onhlpz5gdL2+eOVtPlMYCo8YZpDjgt1OWvym00GZ3scsz8dXDNVL1zWaG9titXT97w7JI3H7y+hzbskboRRpw8As0+m2i8i0g/q4doJpi+AHrGmYoaOk9caerN+Lzux/y2wllH1IsSDtuhC2PVQk7FVnFFMeNU48T/MJE3QJyXNblbsT+1lmDC9JI+ADHVF64wnkKc/m9eVUeXS2Ok86GovpiZjupDaeHp2zzzcfKzNQGDIe9SaC0JNIg3e+ZucKD6pPtJAw1F20dL7boXOhuiASqiYY41qj9IkDshRTvnW1uhAxNZ90ekcPgFPn7Y8jk8IMlwNE5AKNFDehpXxQIQt0AaZ8cXFoqvGZOhPfiCotRS9NJbKyaHImoGWBs5psbK5Zi+ZheTkz7o5ASoKvwuJuflccZQDkun3cRBM2v1svvPfpZweXfqzUpk+W/GvO/eFTckaCVwJweuyeKZe7b7z2aOLs7zulqRjFCvSLr82Upv88PHaGsJgf8/StRXcbxfha/8JeQbIUx8TdvH9W9fefO3AwcAAAAABJRU5ErkJggg==",
}
var async = require("async");
// Obtains HTML template
var html = require("../html/html-min.js");
require("uglipop");
var SignedData = require("../src/signed-data");

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
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader();
      reader.readAsText(file);
      reader.onload = function(e){
        var cert = new window.PKIWebSDK.Certificate();
        resolve(cert.parsePEM(reader.result));
      }
    } else {
      reject(new Error("Parameter should not be empty"));
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
    } else {
      reject(new Error("Parameter should not be empty"));
    }
  })
}

UI.handler.P12 = function(file) {
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      var password = document.getElementById("pkiwebsdk-p12-password").value; 
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        var cert = new window.PKIWebSDK.Certificate();
        resolve(cert.parseP12(reader.result, password));
       }
    } else {
      reject(new Error("Parameter should not be empty"));
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
    } else {
      reject(new Error("Parameter should not be empty"));
    }
  })
}

UI.handler.P12ToSign = function(file) {
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
    } else {
      reject(new Error("Parameter should not be empty"));
    }
  })
}
UI.handler.P12ToSignFile = function(file) {
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      var password = document.getElementById("pkiwebsdk-p12-password-to-sign-file").value; 
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
    } else {
      reject(new Error("Parameter should not be empty"));
    }
  })
}
UI.handler.PDFToSign = function(file) {
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        UI.PDFToSign = new window.PKIWebSDK.PDF(reader.result);
        resolve();
      }
    } else {
      reject(new Error("Parameter should not be empty"));
    }
  })
}
UI.handler.fileToSign = function(file) {
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        UI.fileToSign = reader.result;
        resolve();
      }
    } else {
      reject(new Error("Parameter should not be empty"));
    }
  })
}
UI.handler.fileToBeVerified = function(file) {
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        UI.fileToBeVerified = reader.result;
        resolve();
      }
    } else {
      reject(new Error("Parameter should not be empty"));
    }
  })
}
UI.handler.certToVerifyFile = function(file) {
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      reader.readAsText(file);
      reader.onload = function(e) {
        var cert = new window.PKIWebSDK.Certificate();
        cert.parsePEM(reader.result)
          .then(function(cert){
            UI.certToVerifyFile = cert;
            resolve();
          })
      }
    } else {
      reject(new Error("Parameter should not be empty"));
    }
  })
}
UI.handler.P7ToVerifyFile = function(file) {
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        UI.P7ToVerifyFile = window.PKIWebSDK.Utils.ab2Str(reader.result);
        resolve();
      }
    } else {
      reject(new Error("Parameter should not be empty"));
    }
  })
}
UI.handler.PDFToVerify = function(file) {
  return new Promise(function(resolve, reject){
    if (file) {
      var reader = new window.FileReader()
      reader.readAsArrayBuffer(file);
      reader.onload = function(e) {
        UI.PDFToVerify = new window.PKIWebSDK.PDF(new Uint8Array(reader.result));
        var signatures = UI.PDFToVerify.getSignatures()
          .then(function(signatures){
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
    } else {
      reject(new Error("Parameter should not be empty"));
    }
  })
}

/**
 * Generate HTML element that handle certificate PEM file
 *
 * @param {String} element - Id of the parent element. Without # symbol.
 * @returns {Certificate} cb - Callback, return a promise from Certificate.prototype.parsePEM()
 */
UI.getCertPEM = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["get-cert-pem.html"];
  document.getElementById("pkiwebsdk-get-cert-pem").addEventListener("change", function(evt){
    var files = evt.target.files;
    cb(UI.handler.PEM(files[0]));
  });
  document.getElementById("pkiwebsdk-get-cert-pem").onchange = function () {
    document.getElementById("pkiwebsdk-get-cert-pem-uploadfile").value = this.value.substring(12);
  };
}

/**
 * Generate HTML element that handle Certificate Revocation List file
 *
 * @param {String} element - Id of the parent element. Without # symbol.
 * @returns {Object} cb - Callback, return a promise from Certificate.getREvocationList()
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
 * Generate HTML element that handle P12 to sign a file
 *
 * @param {String} element - Id of the parent element. Without # symbol.
 * @returns {ParseP12Result} cb - Callback, return a promise from SignedData.prototype.sign()
 */
UI.signFile = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["sign-file.html"];
  document.getElementById("pkiwebsdk-get-p12-to-sign-file").addEventListener("change", function(evt){
    var files = evt.target.files;
    UI.handler.P12ToSignFile(files[0]);
  });
  document.getElementById("pkiwebsdk-get-file-to-sign").addEventListener("change", function(evt){
    var files = evt.target.files;
    UI.handler.fileToSign(files[0]);
  });
  document.getElementById("pkiwebsdk-get-file-to-sign-trigger").addEventListener("click", function(evt){
    cb(window.PKIWebSDK.SignedData.sign(self.P12ToSign.certificate, self.P12ToSign.privateKey, self.fileToSign));
  });
  document.getElementById("pkiwebsdk-get-p12-to-sign-file").onchange = function () {
    document.getElementById("pkiwebsdk-get-p12-to-sign-file-uploadfile").value = this.value.substring(12);
  };  
  document.getElementById("pkiwebsdk-get-file-to-sign").onchange = function () {
    document.getElementById("pkiwebsdk-get-file-to-sign-uploadfile").value = this.value.substring(12);
  };  
}

/**
 * Generate HTML element that handle P12 to sign a file
 *
 * @param {String} element - Id of the parent element. Without # symbol.
 * @returns {ParseP12Result} cb - Callback, return a promise from SignedData.prototype.sign()
 */
UI.verifyFile = function(element, cb) {
  var self = this;
  var e = document.getElementById(element);
  e.innerHTML = html["verify-file.html"];
  document.getElementById("pkiwebsdk-get-cert-to-verify-file").addEventListener("change", function(evt){
    var files = evt.target.files;
    UI.handler.certToVerifyFile(files[0]);
  });
  document.getElementById("pkiwebsdk-get-p7-to-verify-file").addEventListener("change", function(evt){
    var files = evt.target.files;
    UI.handler.P7ToVerifyFile(files[0]);
  });
  document.getElementById("pkiwebsdk-get-file-to-be-verified").addEventListener("change", function(evt){
    var files = evt.target.files;
    UI.handler.fileToBeVerified(files[0]);
  });
  document.getElementById("pkiwebsdk-get-file-to-verify-trigger").addEventListener("click", function(evt){
    cb(window.PKIWebSDK.SignedData.verify(self.certToVerifyFile, self.P7ToVerifyFile, self.fileToBeVerified));
  });
  document.getElementById("pkiwebsdk-get-p7-to-verify-file").onchange = function () {
    document.getElementById("pkiwebsdk-get-p7-to-verify-file-uploadfile").value = this.value.substring(12);
  };  
  document.getElementById("pkiwebsdk-get-cert-to-verify-file").onchange = function () {
    document.getElementById("pkiwebsdk-get-cert-to-verify-file-uploadfile").value = this.value.substring(12);
  };  
  document.getElementById("pkiwebsdk-get-file-to-be-verified").onchange = function () {
    document.getElementById("pkiwebsdk-get-file-to-be-verified-uploadfile").value = this.value.substring(12);
  };  
}

/**
 * Generate HTML element that handle P12 container file to get certificate
 *
 * @param {String} element - Id of the parent element. Without # symbol.
 * @returns {ParseP12Result} cb - Callback, return a promise from Certificate.prototype.parseP12()
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
 * @param {String} element - Id of the parent element. Without # symbol.
 * @returns {ParseP12Result} cb - Callback, return a promise from Certificate.prototype.parseP12()
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
 * @param {String} element - Id of the parent element. Without # symbol.
 * @returns {ValidateResult} cb - Callback, return a promise from Certificate.prototype.validate()
 * @returns {TrustResult} cb - Callback, return a promise from Certificate.trust()
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
 * @param {String} element - Id of the parent element. Without # symbol.
 * @returns {String} cb - Callback, return a promise from PDF.prototype.sign()
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
 * @param {String} element - Id of the parent element. Without # symbol.
 * @returns {ValidateResult} cb - Callback, return a promise from Certificate.prototype.validate()
 * @returns {TrustResult} cb - Callback, return a promise from Certificate.trust()
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

/**
 * Destroy uglipop modal
 *
 * @static
 */
UI.destroyModal = function(){
  document.getElementById('uglipop_overlay_wrapper').style.display = 'none';
  document.getElementById('uglipop_overlay').style.display = 'none';
  document.getElementById('uglipop_content_fixed').style.display = 'none';
}

/**
 * Sign a PDF document with modal
 *
 * @since 1.1.0
 * @param {ArrayBuffer} ab - Array buffer of the PDF file that will be signed
 * @param {String} filename - File name of the PDF file
 * @returns {ArrayBuffer} - Array buffer of the signed PDF, passed in cb function
 */
UI.signPDFWithModal = function(ab, filename, cb) {
  var self = this;
  var p12;
  var pdf = new PKIWebSDK.PDF(new Uint8Array(ab));
  // Show the popup modal
  uglipop({
    class:'pkiwebsdk-modal', //styling class for Modal
    source:'html',
    content: html["sign-pdf-with-modal.html"]
    // Begin of HTML modal
    // End of HTML modal
  });
  // Wait for rendered popup, then set a listerner to some element
	setTimeout(function(){
    // Get some variables
    document.getElementById("pkiwebsdk-modal-sign-pdf-file-name").innerHTML = filename;
    document.getElementById("pkiwebsdk-modal-sign-pdf-file-size").innerHTML = PKIWebSDK.Utils.humanReadableSize(ab.byteLength);
    // Event listeners
    document.getElementById('pkiwebsdk-modal-sign-p12').addEventListener('change', function(evt){
	  	var files = evt.target.files; // FileList object
	  	// files is a FileList of File objects. List some properties.
	  	// Read file as ArrayBuffer
	  	var reader = new window.FileReader()
	  	reader.readAsArrayBuffer(files[files.length-1]);
	  	reader.onload = function(e) {
        p12 = reader.result;
        document.getElementById('pkiwebsdk-modal-sign-p12-password-container').style.display = 'block';
        document.getElementById('pkiwebsdk-modal-sign-p12-file-name').innerHTML = files[files.length-1].name
	  	}
    });
    document.getElementById("pkiwebsdk-modal-sign-cancel").addEventListener("click", function(evt){
      self.destroyModal();
    })
    document.getElementById("pkiwebsdk-modal-sign-pdf").addEventListener("click", function(evt){
      var password = document.getElementById("pkiwebsdk-modal-sign-p12-password").value;
      var cert = new PKIWebSDK.Certificate();
      var result;
      var signInfo = {};
      var privKey;
      cert.parseP12(p12, password)
        .then(function(p12){
          result = p12;
          cert = result.certificate;
          return result.certificate.getSubject();
        })
        .then(function(subject){
          signInfo.date = new Date();
          signInfo.name = subject.commonName;
          signInfo.location = subject.localityName;
          return window.PKIWebSDK.Key.parsePEM(result.privateKey, "SHA-256")
        })
        .then(function(privateKey){
          privKey = privateKey;
          return pdf.sign(cert, privKey, signInfo)
        })
        .then(function(signed){
          self.destroyModal();
          cb(signed);
        })
        .catch(function(err){
          console.log(err.message);
          if (err.message == "PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.") {
            return alert("Failed to open P12 container. Wrong password?");
          }
          if (err.message == "Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.") {
            return alert("Not a valid P12 container");
          }
        })
    })
  }, 500)
}

/**
 * Sign any data with modal
 *
 * @since 1.1.0
 * @param {ArrayBuffer} ab - Array buffer of the file that will be signed
 * @param {String} filename - File name of the file
 * @returns {ArrayBuffer} - Array buffer of the signed file, passed in cb function
 */
UI.signAnyWithModal = function(ab, filename, cb) {
  var self = this;
  var p12;
  // Show the popup modal
  uglipop({
    class:'pkiwebsdk-modal', //styling class for Modal
    source:'html',
    content: html["sign-any-with-modal.html"]
    // Begin of HTML modal
    // End of HTML modal
  });
  // Wait for rendered popup, then set a listerner to some element
	setTimeout(function(){
    // Get some variables
    document.getElementById("pkiwebsdk-modal-sign-any-file-name").innerHTML = filename;
    document.getElementById("pkiwebsdk-modal-sign-any-file-size").innerHTML = PKIWebSDK.Utils.humanReadableSize(ab.byteLength);
    // Event listeners
    document.getElementById('pkiwebsdk-modal-sign-any-p12').addEventListener('change', function(evt){
	  	var files = evt.target.files; // FileList object
	  	// files is a FileList of File objects. List some properties.
	  	// Read file as ArrayBuffer
	  	var reader = new window.FileReader()
	  	reader.readAsArrayBuffer(files[files.length-1]);
	  	reader.onload = function(e) {
        p12 = reader.result;
        document.getElementById('pkiwebsdk-modal-sign-any-p12-password-container').style.display = 'block';
        document.getElementById('pkiwebsdk-modal-sign-any-p12-file-name').innerHTML = files[files.length-1].name
	  	}
    });
    document.getElementById("pkiwebsdk-modal-sign-cancel").addEventListener("click", function(evt){
      self.destroyModal();
    })
    document.getElementById("pkiwebsdk-modal-sign-any").addEventListener("click", function(evt){
      var password = document.getElementById("pkiwebsdk-modal-sign-any-p12-password").value;
      var cert = new PKIWebSDK.Certificate();
      var result;
      var signInfo = {};
      var privKey;
      cert.parseP12(p12, password)
        .then(function(p12){
          result = p12;
          cert = result.certificate;
          return result.certificate.getSubject();
        })
        .then(function(subject){
          signInfo.date = new Date();
          signInfo.name = subject.commonName;
          signInfo.location = subject.localityName;
          return window.PKIWebSDK.Key.parsePEM(result.privateKey, "SHA-256")
        })
        .then(function(privateKey){
          privKey = privateKey;
          return SignedData.sign(cert, privKey, ab)
        })
        .then(function(signed){
          self.destroyModal();
          cb(signed);
        })
        .catch(function(err){
          console.log(err.message);
          if (err.message == "PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.") {
            return alert("Failed to open P12 container. Wrong password?");
          }
          if (err.message == "Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.") {
            return alert("Not a valid P12 container");
          }
        })
    })
  }, 500)
}


/**
 * Verify a PDF document with modal
 *
 * @since 1.1.0
 * @param {ArrayBuffer} toBeVerified - Array buffer of the PDF file that will be verified
 * @param {String} [filename] - File name of the PDF file
 */
UI.verifyPDFWithModal = function(toBeVerified, filename) {
  var self = this;
  var filename = filename || "signed.pdf";
  var ab,base64, result;
  var signer = {};
  if (!toBeVerified) {
    return alert("PDF file not found");
  }
  if (typeof toBeVerified === "string") {
    ab = PKIWebSDK.Utils.base642Ab(toBeVerified);
    base64 = toBeVerified;
  } else {
    ab = toBeVerified;
    base64 = PKIWebSDK.Utils.ab2Base64(ab);
  }
  var pdf = new window.PKIWebSDK.PDF(new Uint8Array(ab));
  pdf.getSignatures()
    .then(function(signatures){
      if (signatures.length > 0) {
        result = {
          isVerified : signatures[0].verified,
          isValid : true,
          isTrusted : true
        }
        var certs = signatures[0].signedData.data.certificates;
        certs[0].validate()
          .then(function(validationResult){
            result.isValid = validationResult.isValid ? "<img style='margin-bottom:-2px;' height='15' src='" + assets.checked + "'>" : "<img style='margin-bottom:-2px;' height='15' src='" + assets.cross + "'>";
            result.isTrusted = validationResult.isTrusted ? "<img style='margin-bottom:-2px;' height='15' src='" + assets.star + "'>" : "<img style='margin-bottom:-2px;' height='15' src='" + assets.cross + "'>";
            result.isVerified = result.isVerified ? "<img style='margin-bottom:-2px;' height='15' src='" + assets.checked + "'>" : "<img style='margin-bottom:-2px;' height='15' src='" + assets.cross + "'>";
            return certs[0].getSubject();
          })
          .then(function(subject){
            return showVerificationResult(base64, result, subject);
          })
          .catch(function(err){
            alert(err.message);
          })
      } else {
        showVerificationResult(base64,{
          isValid : "<img style='margin-bottom:-2px;' height='15' src='" + assets.cross + "'>",
          isTrusted : "<img style='margin-bottom:-2px;' height='15' src='" + assets.cross + "'>",
        });
      }
    })
    .catch(function(err){
      alert("The PDF file can't be verified\n" + err);
    })
  var showVerificationResult = function(base64, result, signer){
    if (!base64 || (base64 && base64.length == 0)) {
      return alert("PDF file not found");
    }
    signer.organizationName = signer.organizationName || "-";
    signer.emailAddress = signer.emailAddress || "-";
    uglipop({
      class:'pkiwebsdk-modal', //styling class for Modal
      source:'html',
      content:html["verify-pdf-with-modal.html"]
    });
    // Give a bit time for modal to be loaded
    setTimeout(function(){
      // Load the variable to UI
      document.getElementById("pkiwebsdk-modal-signer-commonName").innerHTML = signer.commonName;
      document.getElementById("pkiwebsdk-modal-signer-emailAddress").innerHTML = signer.emailAddress;
      document.getElementById("pkiwebsdk-modal-signer-organizationName").innerHTML = signer.organizationName;
      document.getElementById("pkiwebsdk-modal-result-isVerified").innerHTML = result.isVerified;
      document.getElementById("pkiwebsdk-modal-result-isValid").innerHTML = result.isValid;
      document.getElementById("pkiwebsdk-modal-result-isTrusted").innerHTML = result.isTrusted;
      document.getElementById("pkiwebsdk-modal-verify-cancel").addEventListener("click", function(evt){
        self.destroyModal();
      })
      document.getElementById("pkiwebsdk-modal-verify-download").addEventListener("click", function(evt){
        var ab = PKIWebSDK.Utils.base642Ab(base64);
        if (filename.split(".").slice(-1)[0].toLowerCase() !== "pdf") {
          filename += ".pdf";
        }
        PKIWebSDK.Utils.toFile(ab, filename, "application/pdf");
      })
    }, 500)
  }
}

module.exports = UI;
