describe("Certificate suite", function() {
  describe("Certificate generation", function() {
    it("should be able to generate a certificate", function() {

      var Certificate = require("../src/certificate");
      var c = new Certificate();
      var record = {
        issuer: {
          countryName: "ID",
          commonName: "Opapa"
        },
        subject: {
          countryName: "ID",
          commonName: "Omama"
        },
        notBefore: new Date(2015, 8, 1),
        notAfter: new Date(2018, 8, 1),
      }
      var cert = c.create(record);
    });
  });
});
