var PKIJSSimpl = require("pkijs").org.pkijs.x509_simple;

var Certificate = function() {
}

Certificate.prototype.create = function() {
  var cert = new PKIJSSimpl.CERT();
}

module.exports = Certificate;
