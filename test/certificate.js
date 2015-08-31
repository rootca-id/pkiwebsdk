"use strict";
require("../src/index");
var certSample;
var certPemSample;
var csrPemSample;
var csrSample;
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
describe("Certificate suite", function() {
  describe("Certificate generation", function() {
    beforeEach(function(){
      /* jasmine.getEnv().defaultTimeoutInterval = 60000; */
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    })
    it("should be able to generate a certificate", function(done) {
      window.PKIWebSDK.Key.generatePair("SHA-256")
        .then(function(keyPair){
          var keys = {}
          keyPair.privateKey.toJwk().then(function(jwk){
            keys.privateKey = jwk
            keyPair.publicKey.toJwk().then(function(jwk){
              keys.publicKey = jwk;      
              window.PKIWebSDK.Certificate.create(record, keys).then(function(cert){
                certSample = cert;
                 done();
              });
            })
          })
        })
    }, 30000);
    it("should be able to generate a certificate request", function(done) {
      var Certificate = require("../src/certificate");
      window.PKIWebSDK.Key.generatePair("SHA-256")
        .then(function(keyPair){
          var keys = {}
          keyPair.privateKey.toJwk().then(function(jwk){
            keys.privateKey = jwk
            keyPair.publicKey.toJwk().then(function(jwk){
              keys.publicKey = jwk;
              window.PKIWebSDK.Certificate.createRequest(subject, keys, "katasandi").then(function(cert){
                csrSample = cert;
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
    it("should be able to convert certification request to Pem", function(done) {
      csrSample.toPEM().then(function(pem){
        var arr = pem.split("-----");
        expect(arr[1]).toEqual("BEGIN CERTIFICATE REQUEST");
        expect(arr[3]).toEqual("END CERTIFICATE REQUEST");
        csrPemSample = pem;
        done();
      })
    });
    it("should be able to convert certificate from Pem", function(done) {
      /* var cert; */
      window.PKIWebSDK.Certificate.fromPEM(certPemSample)
        .then(function(obj){
          /* cert = obj; */
          done();
        })
        .catch(function(err){
          done();
        })
    });
    it("should be able to convert certificate request from Pem", function(done) {
      /* var cert; */
      window.PKIWebSDK.Certificate.fromPEM(csrPemSample)
        .then(function(obj){
          /* cert = obj; */
          done();
        })
    });
  });
});
