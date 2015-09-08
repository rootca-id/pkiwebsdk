describe("PDF suite", function() {
  describe("Verification", function() {
    it("should know that this pdf doesn't have any signatures", function(done) {

      var file = require('./assets/no-signature.pdf.js');
      var Pdf = require('../src/pdf');

      var p = new Pdf(new Uint8Array(file));
      var signatures = p.getSignatures().then(function(signatures) {
        expect(signatures.length).toBe(0);
        done();
      });
    });

    it("should know that this pdf has only one signature", function(done) {

      var file = require('./assets/simple-signature.pdf.js');
      var Pdf = require('../src/pdf');

      var p = new Pdf(new Uint8Array(file));
      var signatures = p.getSignatures().then(function(signatures) {
        expect(signatures.length).toBe(1);
        expect(signatures[0].verified).toBe(true);
        done();
      });
    });

    it("should know that this pdf has already tampered", function(done) {

      var file = require('./assets/simple-signature.pdf.js');
      var Pdf = require('../src/pdf');

      file[0] = 1; // tamper the pdf
      var p = new Pdf(new Uint8Array(file));
      var signatures = p.getSignatures().then(function(signatures) {
        expect(signatures.length).toBe(1);
        expect(signatures[0].verified).toBe(false);
        done();
      });
    });



    it("should know that this pdf has two signatures", function(done) {
      var file = require('./assets/two-signatures.pdf.js');
      var Pdf = require('../src/pdf');

      var p = new Pdf(new Uint8Array(file));
      var signatures = p.getSignatures().then(function(signatures) {
        expect(signatures.length).toBe(2);
        expect(signatures[0].verified).toBe(true);
        expect(signatures[1].verified).toBe(true);
        done();
      });
    });

  });
});
