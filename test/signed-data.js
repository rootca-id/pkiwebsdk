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



var SignedData = require('../src/signed-data');
var Certificate = require('../src/certificate');


describe("SignedData", function() {
  describe("parseDER", function() {
    var Key = require('../src/key');
    var keyPair;
    var certSample;
    beforeEach(function (done) {
      var cert = new Certificate();
      cert.parsePEM(certPemSample).then(function(c) {
        certSample = c;
        return Key.parsePEM(privateKeyPEM, "SHA-256"); 
      }).then(function(k) {
        keyPair = k;
        done();
      });
    });


    it("should return proper data", function(done) {

      var file = require('./assets/signed-data.1.der.js');

      var raw = String.fromCharCode.apply(null, new Uint8Array(file));
      var p = SignedData.parseDER(raw);
      var d = p.getData().signerInfo[0];
      expect(d.issuer.C).toBe('ID');
      expect(d.authenticatedAttributes.digest).toBe('1acce136db22f9100d4a0c1e1521e6f1448d2a8da4e828e29f8f41079f0241c5');
      //{issuer: Object{C: 'ID', S: 'DKI Jakarta', L: 'Jakarta Pusat', O: 'Badan Otoritas Sertifikat Digital', OU: 'Unit Penerbitan Sertifikat', CN: 'sertifikat.id', EMAIL: 'cert@sertifikat.id'}, serialNumber: '1002', digestAlgorithm: '2.16.840.1.101.3.4.2.1', authenticatedAttributes: Object{1.2.840.113583.1.1.8: Object{tagClass: ..., type: ..., constructed: ..., composed: ..., value: ...}, content-type: '1.2.840.113549.1.7.1', digest: '1acce136db22f9100d4a0c1e1521e6f1448d2a8da4e828e29f8f41079f0241c5'}}

      done();
    });
    it('should be able to validate the data', function(done) {
      var data = new Uint8Array([0x61, 0x62, 0x63, 0x0a ]) 

      // sign the message
      var s = SignedData.sign(certSample, keyPair, data).then(function(signedMessage) {
        // read back the signed message
        var raw = String.fromCharCode.apply(null, signedMessage);
        SignedData.verify(certSample, raw, data)
          .then(function(result){
            console.log(result);
            expect(result).toBe(true);
            done();
          })
      });
    });
  });
});

 
