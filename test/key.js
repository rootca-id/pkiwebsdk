"use strict";

var cryptoSubtle = window.crypto.subtle || window.crypto.webkitSubtle || window.msCrypto.subtle;
var Key = require("../src/key");
var keyPair = {};
var pem = {};
var invalidKeyPair;

// convert string to ArrayBuffer
var string2Ab = function(str, cb) {
  var buf = new ArrayBuffer(str.length*2);
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return cb(buf);
}

xdescribe("Key", function() {
  beforeEach(function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    Key.generatePair("SHA-256")
      .then(function(newKeyPair){
        newKeyPair.privateKey.keyData = undefined;
        newKeyPair.publicKey.keyData = undefined;
        invalidKeyPair = newKeyPair;
        done();
      })
  }); 
  describe("Pairkey generation", function() {
    it("should be able to generate a key pair with SHA-256 algorithm", function(done) {
      Key.generatePair("SHA-256")
        .then(function(newKeyPair){
          expect(newKeyPair.privateKey.keyData.algorithm.hash.name).toEqual("SHA-256");
          expect(newKeyPair.publicKey.keyData.algorithm.hash.name).toEqual("SHA-256");
          keyPair = newKeyPair;
          done();
        })
    });
    it("should fail to generate a key pair with invalid algorithm string", function(done) {
      Key.generatePair("somestring")
        .then(function(newKeyPair){
        })
        .catch(function(err){
          done();
        })
    });
    it("should be able to create object instance of Key", function(done) {
      Key.generatePair("SHA-256")
        .then(function(newKeyPair){
          var k = new Key(newKeyPair.privateKey.keyData)
          expect(k.keyData.algorithm.hash.name).toEqual("SHA-256");
          done();
        })
    });
    it("should fail to create object instance of Key because of empty argument", function(done) {
      var createInstance = function(){
        k = new Key();
      }
      expect(createInstance).toThrow();
      done();
    });
    it("should generate PEM string format from CryptoKey public key", function(done) {
      keyPair.publicKey.toPEM().then(function(pemString){
        var arr = pemString.split("-----");
        expect(arr[1]).toEqual("BEGIN RSA PUBLIC KEY");
        expect(arr[3]).toEqual("END RSA PUBLIC KEY");
        pem.publicKey = pemString;
        done();
      })
    });
    it("should generate PEM string format from CryptoKey private key", function(done) {
      keyPair.privateKey.toPEM().then(function(pemString){
        var arr = pemString.split("-----");
        expect(arr[1]).toEqual("BEGIN RSA PRIVATE KEY");
        expect(arr[3]).toEqual("END RSA PRIVATE KEY");
        pem.privateKey = pemString;
        done();
      })
    });
    it("should fail to generate PEM string format from CryptoKey private key", function(done) {
      invalidKeyPair.privateKey.toPEM()
        .then(function(pemString){
        })
        .catch(function(err){
          done();
        })
    });
    it("should generate JWK format from CryptoKey public key", function(done) {
      keyPair.publicKey.toJwk().then(function(jwk){
        cryptoSubtle.importKey(
          "jwk", 
          jwk, 
          { name : "RSASSA-PKCS1-v1_5", hash : { name : "SHA-256" }},
          true,
          ["verify"]
        ).then(function(keyData){
          expect(keyData).toEqual(keyPair.publicKey.keyData); 
          done();
        })
      })
    });
    it("should parse PEM string (public) to key object", function(done) {
      Key.parsePEM(pem.publicKey, "SHA-256").then(function(obj){
        expect(obj.keyData.algorithm.hash.name).toEqual(keyPair.publicKey.keyData.algorithm.hash.name);
        expect(obj.keyData.type).toEqual(keyPair.publicKey.keyData.type);
        done();
      })
    });
    it("should parse PEM string (private) to key object", function(done) {
      Key.parsePEM(pem.privateKey, "SHA-256").then(function(obj){
        expect(obj.keyData.algorithm.hash.name).toEqual(keyPair.privateKey.keyData.algorithm.hash.name);
        expect(obj.keyData.type).toEqual(keyPair.privateKey.keyData.type);
        done();
      })
    });
    it("should fail to parse PEM string (private) to key object", function(done) {
      var invalidPEM = pem.privateKey.replace("PRIVATE","INVALID");
      Key.parsePEM(invalidPEM, "invalidAlgo")
        .then(function(obj){
        })
        .catch(function(err){
          done();
        })
    });

    it("should sign and verify a data, the result is valid", function(done) {
      string2Ab("hello world", function(data){
        keyPair.privateKey.sign(data)
          .then(function(signature){
            keyPair.publicKey.verify(signature, data)
              .then(function(isValid){
              expect(isValid).toBe(true);
              done();
            })
          })
      });
    });
    it("should sign and verify a data, the result is invalid", function(done) {
      string2Ab("hello world", function(data){
        keyPair.privateKey.sign(data)
          .then(function(signature){
            // Add a ! character to the arrayBuffer;
            string2Ab("hello world!", function(data){
              keyPair.publicKey.verify(signature, data)
                .then(function(isValid){
                expect(isValid).toBe(false);
                done();
              })
            })
          })
      });
    });
    it("should fail to sign because of invalid keyData", function(done) {
      string2Ab("hello world", function(data){
        invalidKeyPair.privateKey.sign(data)
          .then(function(signature){
          })
          .catch(function(err){
            done();
          })
      });
    });
    it("should fail to verify because of invalid keyData", function(done) {
      string2Ab("hello world", function(data){
        keyPair.privateKey.sign(data)
          .then(function(signature){
            invalidKeyPair.publicKey.verify(signature, data)
              .then(function(isValid){
              })
              .catch(function(err){
                done();
              })
          })
      });
    });
    it("should faild to sign because of incorrect key type", function(done) {
      string2Ab("hello world", function(data){
        keyPair.publicKey.sign(data)
          .then(function(signature){
          })
          .catch(function(reason){
            var err = new Error("Must be a private key");
            expect(function(){
              throw reason;
            }).toThrow(err);
            done();
          })
      });
    });
    it("should sign a data and fail to verify because of incorrect key type", function(done) {
      string2Ab("hello world", function(data){
        keyPair.privateKey.sign(data)
          .then(function(signature){
            keyPair.privateKey.verify(signature, data)
              .then(function(isValid){
              })
              .catch(function(reason){
                var err = new Error("Must be a public key");
                expect(function(){
                  throw reason;
                }).toThrow(err);
                done();
              })
            })
      });
    });
    it("should return true if the key is a private key", function(done) {
      expect(keyPair.privateKey.isPrivate()).toBe(true);
      done();
    });
    it("should return false if the key is a public key", function(done) {
      expect(keyPair.publicKey.isPrivate()).toBe(false);
      done();
    });
    it("should return true if the key is a public key", function(done) {
      expect(keyPair.publicKey.isPublic()).toBe(true);
      done();
    });
    it("should return false if the key is a private key", function(done) {
      expect(keyPair.privateKey.isPublic()).toBe(false);
      done();
    });
  });
});
