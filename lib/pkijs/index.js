"use strict";
exports = window;
var PkiJs = function() {
  var _ = require("node.extend");
  var org = {}; 
  
  var module = require("./asn1_common");
  org = _(true, org, module);
  
  module = require("./asn1");
  var asn1 = _(true, module, org);

  module = require("./x509_schema");
  var x509schema = _(true, module, asn1);

  module = require("./x509_simpl");
  var _pkijs = _(true, module, asn1);
  var pkijs = _(true, _pkijs, x509schema);

  pkijs.org.pkijs.getCrypto = function() {
    if (window && window.crypto) {
      if (window.crypto.webkitSubtle) return window.crypto.webkitSubtle;
      if (window.crypto.subtle) return window.crypto.subtle;
    }
    return;
  }

  return pkijs;
}

module.exports = new PkiJs();
