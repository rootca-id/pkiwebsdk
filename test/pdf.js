var Pdf = require('../src/pdf');
var Certificate = require('../src/certificate');
var Key = require('../src/key');

var certPemSample = "-----BEGIN CERTIFICATE-----\r\n"
+ "MIICxTCCAqagAwIBAgIBATANBgkqhkiG9w0BAQUFADBwMRMwEQYDVQQDEwpibGFu\r\n"
+ "a29uLmluMQswCQYDVQQGEwJJRDEUMBIGA1UECBMLSmFib2RldGFiZWsxGDAWBgNV\r\n"
+ "BAcTD1JlcHVibGlrIEJvam9uZzENMAsGA1UEChMEVGVzdDENMAsGA1UECxMEVGVz\r\n"
+ "dDAeFw0xNTA5MDgxMTE3MDlaFw0xNjA5MDgxMTE3MDNaMHAxEzARBgNVBAMTCmJs\r\n"
+ "YW5rb24uaW4xCzAJBgNVBAYTAklEMRQwEgYDVQQIEwtKYWJvZGV0YWJlazEYMBYG\r\n"
+ "A1UEBxMPUmVwdWJsaWsgQm9qb25nMQ0wCwYDVQQKEwRUZXN0MQ0wCwYDVQQLEwRU\r\n"
+ "ZXN0MIHKMA0GCSqGSIb3DQEBAQUAA4G4ADCBtAKBrAAACw0AAAAA3wALqwK8AAwE\r\n"
+ "AAAAAwDdAAAAHgAAAAAOsQAAAAAAAAsAAA//5GkMAAAAAAIAAAAEAAAEALwAAAAA\r\n"
+ "AAAMDQAPAAAAAAAPAAD8AMsAAAAAUwAAAAAAAAsAAF8ADQANAAAAjwANDgAABgcO\r\n"
+ "AA4LAAAAAK0AABMAAAC8AAANAAIAAAAAAFz+rAAADQ0AAAAAAAcADwD+DQAAAA8A\r\n"
+ "AAsAAAAACQAIAAACAwAKq6OBuzCBuDAMBgNVHRMEBTADAQH/MAsGA1UdDwQEAwIC\r\n"
+ "9DA7BgNVHSUENDAyBggrBgEFBQcDAQYIKwYBBQUHAwIGCCsGAQUFBwMDBggrBgEF\r\n"
+ "BQcDBAYIKwYBBQUHAwgwEQYJYIZIAYb4QgEBBAQDAgD3MCwGA1UdEQQlMCOGG2h0\r\n"
+ "dHA6Ly9leGFtcGxlLm9yZy93ZWJpZCNtZYcEfwAAATAdBgNVHQ4EFgQUMiPQu33W\r\n"
+ "eqa0pgWcxDlvAp11I1QwDQYJKoZIhvcNAQEFBQADCgB1bmRlZmluZWQ=\r\n"
+ "-----END CERTIFICATE-----";

var privateKeyPEM = "-----BEGIN RSA PRIVATE KEY-----\r\n" +
"MIIEpAIBAAKCAQEAnzhNtWy1YPUXtM5Rqzbk3v5FMijb/jhMx93Pgsoft8HD5T3i\r\n" +
"w72g8HjeO6UzOLdJmKwPZ0mw5sLmbsKt87MnuIymXOe0SVKQDC7ub6joxtuZpYmd\r\n" +
"QvX9YhK0Hb9Xdq0zqanhCfF3IFNaCYBKU4Wx3o1VI602oSDZ3lfH4coiB9F2h8m5\r\n" +
"CQrQszaobNaf+ZkrKE6wk600UJvVwQXda0PIFrCg1+mZZeqEJridOpiWIrLx1BzI\r\n" +
"KaDBkzbDtesRe7ifEfTWkAQ8gIiLJlo5S7Zo6bjzK7RlpkVqVi9r6XW4Xihs2/8+\r\n" +
"3FmxsMfPIQoxBiPfJsCpIhrdumfotxujxTrF6wIDAQABAoIBAQCD9/bw2Rm9M2hi\r\n" +
"xF+MugMZkUdpO9Sb8a4yOvc0QLPpawEjkRfThelPZ99LMLIz4DdwA60Av2OQ4Rp9\r\n" +
"036671OM84cwmhwkafpbHssiYa4OpRXEzzs5tQo/r6D6xw2HoCeiCNwtkaZbdLq8\r\n" +
"BUmV0MqM3DglSfxtsPzj/X3+97sdHoGWr2rKj4UvYpXLmXim36ibosfLyjtFqTsY\r\n" +
"C48t4m/eK+e07w3e3pH0RowZ1mbZtg6IQDgzTQpDxZU2CZYpad4t5rk01KvOdkrN\r\n" +
"7CV03AeaYO4KMoRcaxNHcMnKkkmZDXHrpr+rwJ3uyvYlegPbXAseOomTJHGY8VyA\r\n" +
"l48gH/ABAoGBAM0/feQwXxxu/YM1eLtXBbbd4FxbBdv87+s1Tuem+gLqSr82Fiqb\r\n" +
"DJevChVj3SoT9C9QtOP14ZWBC+QFtm7mJ7BGz7Klf9FV57rhtFyVZ4Ueu0aSqjOD\r\n" +
"7rmfQaY22dfIgvQoTIgdZrgpF3KAXWDFOI37AJEfT8Hfkk8z5i1dGhhrAoGBAMaX\r\n" +
"KkTtNSsvc0Ia3fx2H48oOAVuB+fStS/83cJyZAWRAhfE23znKRk+orC03Qyrc4rM\r\n" +
"BtfRshAq01yUYwbvJavMGixOlvcae0sokIGxjPb9ssHijp0jjDqxoZt+JT7c3vQs\r\n" +
"J4nK7+myoLrOcfQe/MfPWkKgLEiVEh/MtacBu2iBAoGBALIm2yoXBmdSu3+JCTtr\r\n" +
"BI2+tsDTTRmuybzaL5wJJlcjcC/aTZE7tclvaIw6ezzLxxbOscRwpxayxVRt1PUb\r\n" +
"lvV98Uf6OSDFtPdUc84s7IbyrtFJ+qvuZ2b9IemZEKso4un0lMFM690L5ctAOk0F\r\n" +
"wtoSNWLBz+PTIFbZEIDtn/nzAoGAEqgu+2zBmv4JOQOnKUm7q0pfAPuWWIwuI4UB\r\n" +
"HHx8sx0tcig3aqOY89szk6BaSA9venGyjuIPdX9gfgkeyI79Hge9yb3UZwCg5q23\r\n" +
"7cdNdALfoWF0foTRbs4zXZVbUG2VsKDZUhOzuGPkv8gXYpTqsKblVu8PWf5PRpeH\r\n" +
"1VnPToECgYBB0yFWKyDCxV7rtWpdhJuXIXZpb9wKDBE76ML7jG/aHGRExXNbNm/V\r\n" +
"qhoIQO64/TOayCq6XD5xmRCFqrJCasvQQL+XbnY07aUte1TVk+sp5W6tANnzqYue\r\n" +
"dSM3Ih9m4tv+7y46qtdODuFWvVnZwsPy2E4JRvS0vumbElUffs2p2g==\r\n" +
"-----END RSA PRIVATE KEY-----\r\n";




describe("PDF suite", function() {
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
      console.log(1);
      var signatures = p.getSignatures().then(function(signatures) {
      console.log(2);
        expect(signatures.length).toBe(1);
        expect(signatures[0].verified).toBe(true);
        done();
      }).catch(function(e) {
      console.log(3);
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
    var keyPair;
    var certSample;

    beforeEach(function (done) {
      var cert = new Certificate();
      cert.fromPEM(certPemSample).then(function(c) {
        certSample = c;
        return Key.parsePEM(privateKeyPEM, "SHA-256"); 
      }).then(function(k) {
        keyPair = k;
        done();
      });
    });

    afterEach(function () {
      console.log('>>>>>>---------------------');
    });

    it('should be able to sign a minimal file', function(done) {
      var file = require('./assets/minimal.pdf.js');
      var key = keyPair; 
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
        console.log(a);

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
    it('should be able to sign a previously unsigned file', function(done) {
      var file = require('./assets/no-signature.pdf.js');
      var key = keyPair; 
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
        done();
      }, function(e) {
        console.log(e);
      }).catch(function(e) {
        console.log(e.message);
      });
    });

    var Key = require('../src/key');
    it('should be able to sign a previously signed file', function(done) {
      var file = require('./assets/simple-signature.pdf.js');
      var key = keyPair; 
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
      var key = keyPair; 
      var password = '';
      var info = {
        name: 'test1',
        reason: 'reason1',
        'location': 'location1',
        contactInfo: 'contactInfo1'
      };

      var p = new Pdf(new Uint8Array(file));
      p.sign(certSample, key, info).then(function(doc) {
        done();
      }).catch(function(e) {
        console.log(e.message);
      });
    });
  });
});
