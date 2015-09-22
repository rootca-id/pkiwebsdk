var Pdf = require('../src/pdf');
var Certificate = require('../src/certificate');
var Key = require('../src/key');

var certSample, keyPair;

var record = {
  issuer : {
    commonName : "blankon.in",
    countryName : "ID",
    stateName : "Jabodetabek",
    localityName : "Republik Bojong",
    organizationName : "Test",
    organizationUnit : "Test"
  },
  subject : {
    commonName : "blankon.in",
    countryName : "ID",
    stateName : "Jabodetabek",
    localityName : "Republik Bojong",
    organizationName : "Test",
    organizationUnit : "Test"
  },
  notBefore: new Date(2015, 8, 1),
  notAfter: new Date(2018, 8, 1),
}

describe("PDF suite", function() {
  beforeEach(function (done) {
    var cert = new Certificate();
    if (certSample && keyPair) return done();
    Key.generatePair("SHA-256").then(function(keys) {
      keyPair = keys;
      return keys.privateKey.toPEM();
    }).then(function(pem) {
      console.log(pem);
      return Certificate.create(record, keyPair);
    }).then(function(cert) {
      certSample = cert;
      return cert.toPEM();
    }).then(function(pem) {
      console.log(pem);
      done();
    });
  });


  describe("Verification", function() {
    it("should know that this pdf doesn't have any signatures", function(done) {
      var file = require('./assets/no-signature.pdf.js');

      var p = new Pdf(new Uint8Array(file));
      var signatures = p.getSignatures().then(function(signatures) {
        expect(signatures.length).toBe(0);
        done();
      });
    });

    it("should know that this pdf has only one signature", function(done) {
      var file = require('./assets/simple-signature.pdf.js');

      var p = new Pdf(new Uint8Array(file));
      var signatures = p.getSignatures().then(function(signatures) {
        expect(signatures.length).toBe(1);
        expect(signatures[0].verified).toBe(true);
        done();
      }).catch(function(e) {
        console.log(e.stack);
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
      p.getSignatures().then(function(signatures) {
        expect(signatures.length).toBe(2);
        expect(signatures[0].verified).toBe(true);
        expect(signatures[1].verified).toBe(true);
        done();
      });
    });

  });

  describe('Signing', function() {

    it('should be able to sign a minimal file', function(done) {
      var file = require('./assets/minimal.pdf.js');
      var key = keyPair.privateKey; 
      var password = '';
      var info = {
        date: new Date(),
        name: 'test1',
        reason: 'reason1',
        'location': 'location1',
        contactInfo: 'contactInfo1'
      };

      var p = new Pdf(new Uint8Array(file));
      p.sign(certSample, key, info).then(function(doc) {
var uint = new Uint8Array(doc);

    var uint = new Uint8Array(doc);
        var a = '[';
        for (var i = 0; i < uint.length; i ++) {
          a += uint[i] + ','; 
        }
        a += ']';
        //console.log(a);



        var p = new Pdf(new Uint8Array(doc));
        var signatures = p.getSignatures().then(function(signatures) {
          expect(signatures.length).toBe(1);
          expect(signatures[0].verified).toBe(true);
          done();
        }).catch(function(e) {
          console.log(e.stack);
        });
      }).catch(function(e) {
        console.log(e.message);
      });
    });


    var Key = require('../src/key');
    it('should be able to sign a just previously signed file', function(done) {
      var file = require('./assets/no-signature.pdf.js');
      var key = keyPair.privateKey; 
      var password = '';
      var info = {
        name: 'test1',
        reason: 'signed 1',
        'location': 'location1',
        contactInfo: 'contactInfo1'
      };

      var p = new Pdf(new Uint8Array(file));
      var signed1;
      p.sign(certSample, key, info).then(function(doc) {
        signed1 = doc;
        var p = new Pdf(new Uint8Array(doc));
        return p.getSignatures();
      }).then(function(signatures) {
        expect(signatures.length).toBe(1);
        expect(signatures[0].verified).toBe(true);

        info.reason = 'signed 2';
        var p = new Pdf(new Uint8Array(signed1));
        return p.sign(certSample, key, info);
      }).then(function(doc) {
        var p = new Pdf(new Uint8Array(doc));
        return p.getSignatures();
      }).then(function(signatures) {
        expect(signatures.length).toBe(2);
        expect(signatures[0].verified).toBe(true);
        expect(signatures[1].verified).toBe(true);
        done();
      }).catch(function(e) {
        console.log(e.message);
      });
    });


    var Key = require('../src/key');
    it('should be able to sign a previously unsigned file', function(done) {
      var file = require('./assets/no-signature.pdf.js');
      var key = keyPair.privateKey; 
      var password = '';
      var info = {
        name: 'test1',
        reason: 'reason1',
        'location': 'location1',
        contactInfo: 'contactInfo1'
      };

      var p = new Pdf(new Uint8Array(file));

      p.sign(certSample, key, info).then(function(doc) {
        var p = new Pdf(new Uint8Array(doc));
        var signatures = p.getSignatures().then(function(signatures) {
          expect(signatures.length).toBe(1);
          expect(signatures[0].verified).toBe(true);
          done();
        });
 
      }, function(e) {
        console.log(e);
      }).catch(function(e) {
        console.log(e.message);
      });
    });

    var Key = require('../src/key');
    it('should be able to sign a previously signed file', function(done) {
      var file = require('./assets/simple-signature.pdf.js');
      var key = keyPair.privateKey; 
      var password = '';
      var info = {
        name: 'test1',
        reason: 'reason1',
        'location': 'location1',
        contactInfo: 'contactInfo1'
      };

      file[0] = 37;
      var p = new Pdf(new Uint8Array(file));
      p.sign(certSample, key, info).then(function(doc) {
        var uint = new Uint8Array(doc);
        var a = '[';
        for (var i = 0; i < uint.length; i ++) {
          a += uint[i] + ','; 
        }
        a += ']';
        //console.log(a);


        var p = new Pdf(new Uint8Array(doc));
        p.getSignatures().then(function(signatures) {
          console.log(signatures.length);
          done();
        });
      }).catch(function(e) {
        console.log(e.message);
      });
    });

    var Key = require('../src/key');
    it('should be able to sign a previously multiple signed file', function(done) {
      var file = require('./assets/two-signatures.pdf.js');
      var key = keyPair.privateKey; 
      var password = '';
      var info = {
        name: 'test1',
        reason: 'reason1',
        'location': 'location1',
        contactInfo: 'contactInfo1'
      };

      var p = new Pdf(new Uint8Array(file));
      p.sign(certSample, key, info).then(function(doc) {
        var uint = new Uint8Array(doc);
        var a = '[';
        for (var i = 0; i < uint.length; i ++) {
          a += uint[i] + ','; 
        }
        a += ']';


        var p = new Pdf(new Uint8Array(doc));
        var signatures = p.getSignatures().then(function(signatures) {
          expect(signatures.length).toBe(3);
          expect(signatures[0].verified).toBe(true);
          done();
        });
      }).catch(function(e) {
        console.log(e.message);
      });
    });
  });
  describe('Signing visually', function() {


    it('should be able to sign a minimal file', function(done) {
      var sig1 = new Uint8Array(require('./assets/Louis-xiv-signature.jpg.js'));
      var file = require('./assets/minimal.pdf.js');
      var key = keyPair.privateKey; 
      var password = '';
      var info = {
        name: 'test1',
        reason: 'reason1',
        'location': 'location1',
        contactInfo: 'contactInfo1',
        page: 0,
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        image: sig1
      };

      var p = new Pdf(new Uint8Array(file));
      p.sign(certSample, key, info).then(function(doc) {
        var uint = new Uint8Array(doc);
        var a = '[';
        for (var i = 0; i < uint.length; i ++) {
          a += uint[i] + ','; 
        }
        a += ']';
        //console.log(a);


        var p = new Pdf(new Uint8Array(doc));
        var signatures = p.getSignatures().then(function(signatures) {
          expect(signatures.length).toBe(1);
          expect(signatures[0].verified).toBe(true);
          done();
        }).catch(function(e) {
          console.log(e.stack);
        });
      }).catch(function(e) {
        console.log(e.message);
      });
    });



  });
});
