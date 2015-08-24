var PKIWebSDK = function() {
  this.PDF = require('./pdf')
  this.sample = require('../test/assets/no-signature.pdf.js')
  this.Key = require('./key')
}

window.PKIWebSDK = new PKIWebSDK();
module.exports = PKIWebSDK;
