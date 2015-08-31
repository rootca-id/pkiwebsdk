require("../lib/forge/jsbn.js");
require("../lib/forge/asn1.js");
require("../lib/forge/oids.js");
require("../lib/forge/util.js");
require("../lib/forge/cipher");
require("../lib/forge/pem");
require("../lib/forge/cipherModes.js");
require("../lib/forge/md.js");
require("../lib/forge/md5.js");
require("../lib/forge/mgf.js");
require("../lib/forge/mgf1.js");
require("../lib/forge/pem.js");
require("../lib/forge/pkcs1.js");
require("../lib/forge/prime.js");
require("../lib/forge/prng.js");
require("../lib/forge/random.js");
rsa = require("../lib/forge/rsa.js");
require("../lib/forge/sha1.js");
require("../lib/forge/sha256.js");
require("../lib/forge/x509.js");

var PKIWebSDK;
if (!window.PKIWebSDK) {
  PKIWebSDK = function() {
    this.PDF = require('./pdf')
    this.sample = require('../test/assets/no-signature.pdf.js')
    this.Key = require('./key')
    this.Certificate = require('./certificate')
    this.private = {};
    this.private.forge = {}
  }
  window.PKIWebSDK = new PKIWebSDK();
} else {
  window.PKIWebSDK.PDF = require('./pdf');
  window.PKIWebSDK.sample = require('../test/assets/no-signature.pdf.js');
  window.PKIWebSDK.Key = require('./key');
  window.PKIWebSDK.Certificate = require('./certificate');
}
module.exports = PKIWebSDK;
