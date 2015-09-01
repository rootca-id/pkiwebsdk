"use strict";
/* require("../src/index"); */
var certSample;
var certPemSample;
var csrPemSample;
var csrSample;
var p12Sample;
var privateKey;
var subject = {
  commonName : "blankon.in",
  countryName : "ID",
  stateName : "Jabodetabek",
  localityName : "Republik Bojong",
  organizationName : "Test",
  organizationUnit : "Test"
}
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
// convert string to ArrayBuffer
var string2Ab = function(str, cb) {
  var buf = new ArrayBuffer(str.length*2);
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return cb(buf);
}
describe("Certificate suite", function() {
  describe("Certificate generation", function() {
    beforeEach(function(){
      /* jasmine.getEnv().defaultTimeoutInterval = 60000; */
      /* jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000; */
    })
    it("should be able to generate a certificate", function(done) {
      window.PKIWebSDK.Key.generatePair("SHA-256")
        .then(function(keyPair){
          var keys = {}
          keyPair.privateKey.toJwk().then(function(jwk){
            keys.privateKey = jwk
            privateKey = jwk
            keyPair.publicKey.toJwk().then(function(jwk){
              keys.publicKey = jwk;      
              window.PKIWebSDK.Certificate.create(record, keys).then(function(cert){
                certSample = cert;
                expect(cert.certData.issuer.attributes[0].value).toBe("blankon.in");
                expect(cert.certData.issuer.attributes[1].value).toBe("ID");
                expect(cert.certData.issuer.attributes[2].value).toBe("Jabodetabek");
                expect(cert.certData.issuer.attributes[3].value).toBe("Republik Bojong");
                expect(cert.certData.issuer.attributes[4].value).toBe("Test");
                expect(cert.certData.issuer.attributes[5].value).toBe("Test");
                expect(cert.certData.subject.attributes[0].value).toBe("blankon.in");
                expect(cert.certData.subject.attributes[1].value).toBe("ID");
                expect(cert.certData.subject.attributes[2].value).toBe("Jabodetabek");
                expect(cert.certData.subject.attributes[3].value).toBe("Republik Bojong");
                expect(cert.certData.subject.attributes[4].value).toBe("Test");
                expect(cert.certData.subject.attributes[5].value).toBe("Test");
                done();
              });
            })
          })
        })
    });
    it("should be able to generate a certificate request", function(done) {
      var Certificate = require("../src/certificate");
      window.PKIWebSDK.Key.generatePair("SHA-256")
        .then(function(keyPair){
          var keys = {}
          keyPair.privateKey.toJwk().then(function(jwk){
            keys.privateKey = jwk
            // save to global
            keyPair.publicKey.toJwk().then(function(jwk){
              keys.publicKey = jwk;
              window.PKIWebSDK.Certificate.createRequest(subject, keys, "katasandi").then(function(cert){
                csrSample = cert;
                expect(cert.certData.subject.attributes[0].value).toBe("blankon.in");
                expect(cert.certData.subject.attributes[1].value).toBe("ID");
               expect(cert.certData.subject.attributes[2].value).toBe("Jabodetabek");
                expect(cert.certData.subject.attributes[3].value).toBe("Republik Bojong");
                expect(cert.certData.subject.attributes[4].value).toBe("Test");
                expect(cert.certData.subject.attributes[5].value).toBe("Test");
                expect(cert.certData.attributes[0].name).toBe("challengePassword");
                expect(cert.certData.attributes[0].value).toBe("katasandi");
                done();
              });
            })
          })
        })
    });
    it("should be able to convert certificate to Pem", function(done) {
      certSample.toPEM().then(function(pem){
        var arr = pem.split("-----");
        expect(arr[1]).toEqual("BEGIN CERTIFICATE");
        expect(arr[3]).toEqual("END CERTIFICATE");
        certPemSample = pem;
        done();
      })
    });
    it("should be able to convert certification request to pem", function(done) {
      csrSample.toPEM().then(function(pem){
        var arr = pem.split("-----");
        expect(arr[1]).toEqual("BEGIN CERTIFICATE REQUEST");
        expect(arr[3]).toEqual("END CERTIFICATE REQUEST");
        csrPemSample = pem;
        done();
      })
    });
    it("should be able to get issuer from a certificate", function(done) {
      certSample.getIssuer()
        .then(function(issuer){
          expect(issuer[0].value).toBe("blankon.in");
          expect(issuer[1].value).toBe("ID");
          expect(issuer[2].value).toBe("Jabodetabek");
          expect(issuer[3].value).toBe("Republik Bojong");
          expect(issuer[4].value).toBe("Test");
          expect(issuer[5].value).toBe("Test");
          done();
        })
    });
    it("should be able to get subject from a certificate", function(done) {
      certSample.getSubject()
        .then(function(subject){
          expect(subject[0].value).toBe("blankon.in");
          expect(subject[1].value).toBe("ID");
          expect(subject[2].value).toBe("Jabodetabek");
          expect(subject[3].value).toBe("Republik Bojong");
          expect(subject[4].value).toBe("Test");
          expect(subject[5].value).toBe("Test");
          done();
        })
    });
    it("should be able to get version number from a certificate", function(done) {
      certSample.getVersionNumber()
        .then(function(vn){
          expect(vn).toBe(2);
          done();
        })
    });
    it("should be able to get serial number from a certificate", function(done) {
      certSample.getSerialNumber()
        .then(function(sn){
          done();
        })
    });
    it("should be able to get publicKey algorithm from a certificate", function(done) {
      certSample.getPublicKeyAlgorithm()
        .then(function(alg){
          expect(alg).toBe("RS256");
          done();
        })
    });
    it("should be able to get publicKey from a certificate", function(done) {
      certSample.getPublicKey()
        .then(function(publicKey){
          expect(publicKey.key_ops[0]).toBe("verify");
          done();
        })
    });
    it("should be able to convert a certificate to p12", function(done) {
      certSample.toP12(privateKey, "katasandi")
        .then(function(p12){
          console.log(p12);
          p12Sample = p12;
          done();
        })
    });
    // XXX
    /* it("should be able to convert a p12 string to p12 container object", function(done) { */
    /*   var newCert = new window.PKIWebSDK.Certificate(); */
    /*   newCert.fromP12(p12Sample, "katasandi") */
    /*     .then(function(p12Container){ */
    /*       console.log(p12Container.safeContents[0].safeBags[0].cert); */
    /*       console.log(p12Container.safeContents[1].safeBags[0].key); */
    /*       done(); */
    /*     }) */
    /* }) */
    /* it("should be able to sign a file using private key which has included in the p12 container object", function(done) { */
    /*   var cert = new window.PKIWebSDK.Certificate(); */
    /*   cert.fromP12(p12Sample, "katasandi") */
    /*     .then(function(p12Container){ */
    /*       console.log(p12Container.safeContents[0].safeBags[0].cert); */
    /*       console.log(p12Container.safeContents[1].safeBags[0].key); */
    /*       var privateKey = p12Container.safeContents[1].safeBags[0].key; */
    /*       string2Ab("hello world", function(data){ */
    /*         privateKey.sign(data) */
    /*           .then(function(signature){ */
    /*             consolelog(signature); */              
    /*           }) */
    /*       }); */
    /*       done(); */
    /*     }) */
    /* }) */
    /* it("should be able to convert certificate from Pem", function(done) { */
    /*   window.PKIWebSDK.Certificate.fromPEM(certPemSample) */
    /*     .then(function(obj){ */
    /*       done(); */
    /*     }) */
    /* }); */
    /* it("should be able to convert certificate request from Pem", function(done) { */
    /*   window.PKIWebSDK.Certificate.fromPEM(csrPemSample) */
    /*     .then(function(obj){ */
    /*       done(); */
    /*     }) */
    /* }); */
  });
});
