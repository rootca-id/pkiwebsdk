describe("SignedData", function() {
  describe("fromDER", function() {
    it("should return proper data", function(done) {

      var file = require('./assets/signed-data.1.der.js');
      var SignedData = require('../src/signed-data');

      var raw = String.fromCharCode.apply(null, new Uint8Array(file));
      var p = SignedData.fromDER(raw);
      var d = p.getData().signerInfo;
      expect(d.issuer.C).toBe('ID');
      expect(d.authenticatedAttributes.digest).toBe('1acce136db22f9100d4a0c1e1521e6f1448d2a8da4e828e29f8f41079f0241c5');
      //{issuer: Object{C: 'ID', S: 'DKI Jakarta', L: 'Jakarta Pusat', O: 'Badan Otoritas Sertifikat Digital', OU: 'Unit Penerbitan Sertifikat', CN: 'sertifikat.id', EMAIL: 'cert@sertifikat.id'}, serialNumber: '1002', digestAlgorithm: '2.16.840.1.101.3.4.2.1', authenticatedAttributes: Object{1.2.840.113583.1.1.8: Object{tagClass: ..., type: ..., constructed: ..., composed: ..., value: ...}, content-type: '1.2.840.113549.1.7.1', digest: '1acce136db22f9100d4a0c1e1521e6f1448d2a8da4e828e29f8f41079f0241c5'}}

      done();
    });
  });
});

 
