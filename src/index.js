var PKIWebSDK = function() {
  this.PDF = require('./pdf')
  this.sample = require('../test/assets/no-signature.pdf.js')
}

window.PKIWebSDK = new PKIWebSDK();
module.exports = PKIWebSDK;
