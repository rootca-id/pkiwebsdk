"use strict";

require("../src/index");

var wrongPrivateKeyPem = "-----BEGIN RSA PRIVATE KEY-----\n"
+ "MIIEpAIBAAKCAQEA3HT1Yb8TU+L3hB7UEXWagufpV9IStXH0SSheUwE/IS+xsPPw\n"
+ "Xu6xjSlJONyuIWEGXBBeA1LsYkRjG7cWKxK2c9A9VIcpBR8ewGVLh+ZHrkN/w7Wf\n"
+ "0/khHrtk5sUI2/vzRXXZ2fxj6BlSccFdBXwlZ5wg5FaEdO737GeYPE3g+HYJ5kml\n"
+ "WYoLP8ngdSESrLKZNarBn77TeJBDODZTfYaUn+RxANSjNHivZh/XDxYUKJBir+Rt\n"
+ "cagQkHc/toL2dIBOz+npP9I7wwR6IZBMicRO45zgN7x25K9Vsw3NzKJ89Nbb8Yr/\n"
+ "GnEBBvmo3/RJqhYCm1UPx/mnG/dG6d8C2P5OZwIDAQABAoIBAQCjFhrY/qNrsUHu\n"
+ "CWhUqi1tneZvQ0b3158h560vtoJfKItJHoy5jdbnWJ2EZSykIMS1op4J03RvlavD\n"
+ "uwO5RZSXxHs6ZuqfkVAMgGMJ2/83GVQREfF0vJ4VwAd6+FP/eTmULwTEUAQQlXr6\n"
+ "EFOiVR7OsR9cC+zdHFNoHZLvOaWt5zSLVeUkq/Y5+7XPgCB1tjNGBEQ+VvS+g6bF\n"
+ "0SVvovQk96D/hEyGdMV1HOUhbfZ8zGwcGetbVtWOutkYoxbFEiiDgnH1LLx6HD9d\n"
+ "BBQ26GNHtYBukP918727KbUuZyZnribdyyjWLJ4kmCFPVMGz2HWDlyivmliqIR70\n"
+ "0bWJ3FXxAoGBAPtWktQwdCBhJcwX2HP7ZElsRAN90S72FWP5+grLEQrOh4p02u+S\n"
+ "UcSF2ueDHuSa4uTJH31Y6/5Yq4FEdhYGYGxzLDDXEDWMbPLI9+9xH6liZT7MTrSE\n"
+ "LNPWO+WZ5W6nRWzNeMYGHlwrnw99W8Ea+xL9vrvZxX/SJu+4/SQBE2xdAoGBAOCL\n"
+ "wGdO8z4A0MCHHVe54K0517q6k2LFypD1xNjop3hZ2XwBVCc3JRyw7JWUP/hRPror\n"
+ "CyXSiYX285cOnv8eVYuAv2xlV9mBc8tZjG8pB7GNzSsOTDKOtMcKWYkGeikfYjGP\n"
+ "7TnNEAlVsn7m5iCeQkRiqnyTBJOTDYidbnDmKhmTAoGBAJlzwQ+2SaBfT+FtCaW+\n"
+ "bft6E4iCL85ZRrQUsnoWg2AyuoRpViaBElVHWGCTKLBwdGk09nnkaamP3557+xD1\n"
+ "cbelFez30ZiwFPCijOXvDmKvhZsyyDbkoC3yFf3X2UGW9Qc56CwXHkAuDd46LmQX\n"
+ "IgX1UJeGnVOuLkGck0mBMqetAoGATYMQfNj9EJc5eGxrzZ+llkaUWKoVPJBod5fP\n"
+ "Rs0xGlNxxuOyiAL6NahBUvUlC/QHwj4fkAPYYz03Ixrx+cEf6JMeAS4OoE+WiEi2\n"
+ "OJ0iQcFgZI9/8Cfg8aB5/doVi2KBA/jZ/Az0jzRc9H+CSxo2Z+LjVTNu7f5iOpmV\n"
+ "yTU6rS8CgYAi7DDtBKwk0I6Gnow76biIKrHeyHTuiLOaWU9i7hY15UM0RRVtwuWv\n"
+ "JXbYi5iJLjD35d/jaCSq8H2Vf1mB2fkHJ4xO4Q1oxaexPISL2e/twfW2JltLoto4\n"
+ "x/5h/9OBizYIcG8E7wByNjYDsS3UjgCNgMLCTvPL9WJ/E88XMsONKw==\n"
+ "-----END RSA PRIVATE KEY-----\n";

var privateKeyPem = "-----BEGIN RSA PRIVATE KEY-----\n"
+ "MIIEowIBAAKCAQEAx9BzDbEtjCx6dDudlss0sJm1B+hd/UR+ZyKqpCz2lLFuHEwj\n"
+ "EmAEIGUOVnQDAASyZ/njoP6nQfkmaE7ymoNhqL0RfmCIj4GnZ0LmyR43Veln2mOy\n"
+ "PLiGNX5ePV9B4L9kJStZI8gn9JdiUbq1SpartLw70UgsZ7kzTN8DrovHHQIDMYdn\n"
+ "MGhpm3ZSL+LfsscXdX1vliC6K2UvK8pZhlFi3jQeXpa3SN9WdrODmgWt65Th7NME\n"
+ "EoTWopgMhfmvjkWRB0IUd9LZ7QE2Q6OXlrt4rP1JBbryEHw+o77ByRthGh9yhZeK\n"
+ "KxA1Skz72QbKQhGQpGc1nlEck4b6V5KzGUbWRQIDAQABAoIBAHRg8ZIo/wlkopHu\n"
+ "YxQAGRk+/VS0v4GTEjhJ1a+3zIrAaQysP8UlDWI82cP64ABzu+GZhz4u9AYV8ovQ\n"
+ "Z7cdDJV2Qakk2oUTFAity7OaGMq+HlHxvU9mfizMBGGkiL85Wj/X5pxTqQnp3kcS\n"
+ "AyOFbE7hT8nOSqbDFKESR5ezK+61QwbjyynZ9f5szbrgOziZIhcTUe17Zvh3dPjz\n"
+ "KlGIWt/h3QTIkyNktUpr3h7BgJbb52aRd7HJFxA+HxgPJzzro5wekv/NTv/ZGuPI\n"
+ "+ZcvU9UNzFLXUSZGLDLIwelgqpa9Q2anGWjHYti6RFDuCoc7U/LDcMuzcsjRA/KJ\n"
+ "bimGBaECgYEA/s6iS3mTWYl8mUMa/jx5Ts8JQDpG4yP8F6HmZU3QEDncXrO5vK86\n"
+ "VRa1JyhtOhrq5EqCnHxKfMURDDm+D47U4GosqOkkudxxnlNPWS45I/VuaCS5ecn6\n"
+ "VYpNy+435hHgL2qkscrEirYcgBtEV17kd33/QDLtQ9IE4DefCnuWXAkCgYEAyL/p\n"
+ "LcjJAVb9BxfdWRww1U3ldeMrRqKpAOTrRp7sv1XSq0gTqKpDwsmb6sZpFm+RgMQo\n"
+ "ItXLjSD7UbqW4Wu6DqY69pczyJ2PorC3oJYDrO1ch2vSmNbJJUIoXpeR6F5C1EIU\n"
+ "IUWM/5k0iK1VIkIR11ZBaWdPjJEByPop9uqj710CgYB1t3bJEZieY+MZVyQwUjXk\n"
+ "z8dBUesP4r8DF/u9z24RIPoLElL7taRoTP5R4d5cWrUr1LR0oQM0k0Jl+IMy4tS7\n"
+ "/LE3M8aQyyP+dhSRacZiM2/XUygQ+NvbCvMYBKz0cEu2/DisHrYgMzQFhxNSnfdE\n"
+ "sQPsX9q3W15/S5MBH8l+KQKBgQC1YNfAmzIpeLwCxagjVBo3DztsKQU3u82w1iRR\n"
+ "WVQUh+lhAi1o7fVtMBUkqYHXWJSBYDnXR42zBIKt1EVwhJHFnKGXnQOXlexqFPrE\n"
+ "J+ZIPumkHWJY3287r6uj05Rr+4asGsvvR9TeN0FE4D8URdey1Oci4cn4+ic/u+9g\n"
+ "fZ4CrQKBgCPH+BjXOz8qyAco9olBcxlAm1woGRJ9TqPqr89vmIpujLeXhkwd6/0h\n"
+ "2ED/Unl9hE1fytdxCee1Y4Vu2DiQRyrb8B6PyedUzDvA7kLR42j0sA4xRlGc9ged\n"
+ "1IidujXFhMiuAjN+aM9yf9/zome5/GS/odNLGizqyxAiXW3S3nxN\n"
+ "-----END RSA PRIVATE KEY-----\n";

var publicKeyPem = "-----BEGIN RSA PUBLIC KEY-----\n"
+ "MIIBCgKCAQEA3HT1Yb8TU+L3hB7UEXWagufpV9IStXH0SSheUwE/IS+xsPPwXu6x\n"
+ "jSlJONyuIWEGXBBeA1LsYkRjG7cWKxK2c9A9VIcpBR8ewGVLh+ZHrkN/w7Wf0/kh\n"
+ "Hrtk5sUI2/vzRXXZ2fxj6BlSccFdBXwlZ5wg5FaEdO737GeYPE3g+HYJ5kmlWYoL\n"
+ "P8ngdSESrLKZNarBn77TeJBDODZTfYaUn+RxANSjNHivZh/XDxYUKJBir+RtcagQ\n"
+ "kHc/toL2dIBOz+npP9I7wwR6IZBMicRO45zgN7x25K9Vsw3NzKJ89Nbb8Yr/GnEB\n"
+ "Bvmo3/RJqhYCm1UPx/mnG/dG6d8C2P5OZwIDAQAB\n"
+ "-----END RSA PUBLIC KEY-----\n";


var certPem = "-----BEGIN CERTIFICATE-----\n"
+ "MIID5zCCAs+gAwIBAgIBATANBgkqhkiG9w0BAQUFADBvMRMwEQYDVQQDEwpibGFu\n"
+ "a29uLmluMQswCQYDVQQGEwJJRDEUMBIGA1UECBMLSmFib2RldGFiZWsxDzANBgNV\n"
+ "BAcTBkJvam9uZzERMA8GA1UEChMIVWppIGNvYmExETAPBgNVBAsTCFVqaSBjb2Jh\n"
+ "MB4XDTE0MDkyNzE0MTYwNVoXDTE0MDkyNzE0MTYwNVowbzETMBEGA1UEAxMKYmxh\n"
+ "bmtvbi5pbjELMAkGA1UEBhMCSUQxFDASBgNVBAgTC0phYm9kZXRhYmVrMQ8wDQYD\n"
+ "VQQHEwZCb2pvbmcxETAPBgNVBAoTCFVqaSBjb2JhMREwDwYDVQQLEwhVamkgY29i\n"
+ "YTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMfQcw2xLYwsenQ7nZbL\n"
+ "NLCZtQfoXf1EfmciqqQs9pSxbhxMIxJgBCBlDlZ0AwAEsmf546D+p0H5JmhO8pqD\n"
+ "Yai9EX5giI+Bp2dC5skeN1XpZ9pjsjy4hjV+Xj1fQeC/ZCUrWSPIJ/SXYlG6tUqW\n"
+ "q7S8O9FILGe5M0zfA66Lxx0CAzGHZzBoaZt2Ui/i37LHF3V9b5YguitlLyvKWYZR\n"
+ "Yt40Hl6Wt0jfVnazg5oFreuU4ezTBBKE1qKYDIX5r45FkQdCFHfS2e0BNkOjl5a7\n"
+ "eKz9SQW68hB8PqO+wckbYRofcoWXiisQNUpM+9kGykIRkKRnNZ5RHJOG+leSsxlG\n"
+ "1kUCAwEAAaOBjTCBijAMBgNVHRMEBTADAQH/MAsGA1UdDwQEAwIC9DA7BgNVHSUE\n"
+ "NDAyBggrBgEFBQcDAQYIKwYBBQUHAwIGCCsGAQUFBwMDBggrBgEFBQcDBAYIKwYB\n"
+ "BQUHAwgwEQYJYIZIAYb4QgEBBAQDAgD3MB0GA1UdDgQWBBS9t/Qz9slDamhJbIdo\n"
+ "bwDlvVTXNzANBgkqhkiG9w0BAQUFAAOCAQEAczUWuTTOj2HUt+iemvFP522BkELX\n"
+ "/cgiwzWBKK1Fj3aPdFF/R9UvrkEtG1aldMf2WPJ8dvpudRx43ypzAkN9f+AlkP7P\n"
+ "fX3vmcoLRc1c5Vkzz1zUjalsGD36H/tHbT7Z03kHzf/gv8MudsQWzOZWqOmUeOQa\n"
+ "wANFCVy3us5LjbyeyOi6cM2IEc0mytCd6Oqn5UWNetWcmhF/6bW4KYM3hFG4/mwm\n"
+ "F/o5KZZ35ca/y5ow5oirld0264xi20MXomG83/5e1oLNHCM/l3DSwjEE2Avdd+YP\n"
+ "cwuO6TBeVm8LZRjh4q6X2DceNwmYXWhtsf3VwPlBEn48HB9Zl7Iur/HUFg==\n"
+ "-----END CERTIFICATE-----\n";

var ab = window.PKIWebSDK.Utils.base642Ab("/9j/4AAQSkZJRgABAQAASABIAAD/4QBARXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAFKADAAQAAAABAAAAFAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IH6ElDQ19QUk9GSUxFAAEBAAAH2GFwcGwCIAAAbW50clJHQiBYWVogB9kAAgAZAAsAGgALYWNzcEFQUEwAAAAAYXBwbAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1hcHBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALZGVzYwAAAQgAAABvZHNjbQAAAXgAAAWcY3BydAAABxQAAAA4d3RwdAAAB0wAAAAUclhZWgAAB2AAAAAUZ1hZWgAAB3QAAAAUYlhZWgAAB4gAAAAUclRSQwAAB5wAAAAOY2hhZAAAB6wAAAAsYlRSQwAAB5wAAAAOZ1RSQwAAB5wAAAAOZGVzYwAAAAAAAAAUR2VuZXJpYyBSR0IgUHJvZmlsZQAAAAAAAAAAAAAAFEdlbmVyaWMgUkdCIFByb2ZpbGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG1sdWMAAAAAAAAAHwAAAAxza1NLAAAAKAAAAYRkYURLAAAALgAAAaxjYUVTAAAAJAAAAdp2aVZOAAAAJAAAAf5wdEJSAAAAJgAAAiJ1a1VBAAAAKgAAAkhmckZVAAAAKAAAAnJodUhVAAAAKAAAApp6aFRXAAAAFgAAAsJuYk5PAAAAJgAAAthjc0NaAAAAIgAAAv5oZUlMAAAAHgAAAyBpdElUAAAAKAAAAz5yb1JPAAAAJAAAA2ZkZURFAAAALAAAA4prb0tSAAAAFgAAA7ZzdlNFAAAAJgAAAth6aENOAAAAFgAAA8xqYUpQAAAAGgAAA+JlbEdSAAAAIgAAA/xwdFBPAAAAJgAABB5ubE5MAAAAKAAABERlc0VTAAAAJgAABB50aFRIAAAAJAAABGx0clRSAAAAIgAABJBmaUZJAAAAKAAABLJockhSAAAAKAAABNpwbFBMAAAALAAABQJydVJVAAAAIgAABS5hckVHAAAAJgAABVBlblVTAAAAJgAABXYAVgFhAGUAbwBiAGUAYwBuAP0AIABSAEcAQgAgAHAAcgBvAGYAaQBsAEcAZQBuAGUAcgBlAGwAIABSAEcAQgAtAGIAZQBzAGsAcgBpAHYAZQBsAHMAZQBQAGUAcgBmAGkAbAAgAFIARwBCACAAZwBlAG4A6AByAGkAYwBDHqUAdQAgAGgA7ABuAGgAIABSAEcAQgAgAEMAaAB1AG4AZwBQAGUAcgBmAGkAbAAgAFIARwBCACAARwBlAG4A6QByAGkAYwBvBBcEMAQzBDAEOwRMBD0EOAQ5ACAEPwRABD4ERAQwBDkEOwAgAFIARwBCAFAAcgBvAGYAaQBsACAAZwDpAG4A6QByAGkAcQB1AGUAIABSAFYAQgDBAGwAdABhAGwA4QBuAG8AcwAgAFIARwBCACAAcAByAG8AZgBpAGyQGnUoACAAUgBHAEIAIIJyX2ljz4/wAEcAZQBuAGUAcgBpAHMAawAgAFIARwBCAC0AcAByAG8AZgBpAGwATwBiAGUAYwBuAP0AIABSAEcAQgAgAHAAcgBvAGYAaQBsBeQF6AXVBeQF2QXcACAAUgBHAEIAIAXbBdwF3AXZAFAAcgBvAGYAaQBsAG8AIABSAEcAQgAgAGcAZQBuAGUAcgBpAGMAbwBQAHIAbwBmAGkAbAAgAFIARwBCACAAZwBlAG4AZQByAGkAYwBBAGwAbABnAGUAbQBlAGkAbgBlAHMAIABSAEcAQgAtAFAAcgBvAGYAaQBsx3y8GAAgAFIARwBCACDVBLhc0wzHfGZukBoAIABSAEcAQgAgY8+P8GWHTvZOAIIsACAAUgBHAEIAIDDXMO0w1TChMKQw6wOTA7UDvQO5A7oDzAAgA8ADwQO/A8YDrwO7ACAAUgBHAEIAUABlAHIAZgBpAGwAIABSAEcAQgAgAGcAZQBuAOkAcgBpAGMAbwBBAGwAZwBlAG0AZQBlAG4AIABSAEcAQgAtAHAAcgBvAGYAaQBlAGwOQg4bDiMORA4fDiUOTAAgAFIARwBCACAOFw4xDkgOJw5EDhsARwBlAG4AZQBsACAAUgBHAEIAIABQAHIAbwBmAGkAbABpAFkAbABlAGkAbgBlAG4AIABSAEcAQgAtAHAAcgBvAGYAaQBpAGwAaQBHAGUAbgBlAHIAaQENAGsAaQAgAFIARwBCACAAcAByAG8AZgBpAGwAVQBuAGkAdwBlAHIAcwBhAGwAbgB5ACAAcAByAG8AZgBpAGwAIABSAEcAQgQeBDEESQQ4BDkAIAQ/BEAEPgREBDgEOwRMACAAUgBHAEIGRQZEBkEAIAYqBjkGMQZKBkEAIABSAEcAQgAgBicGRAY5BicGRQBHAGUAbgBlAHIAaQBjACAAUgBHAEIAIABQAHIAbwBmAGkAbABldGV4dAAAAABDb3B5cmlnaHQgMjAwNyBBcHBsZSBJbmMuLCBhbGwgcmlnaHRzIHJlc2VydmVkLgBYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAAB0TQAAPe4AAAPQWFlaIAAAAAAAAFp1AACscwAAFzRYWVogAAAAAAAAKBoAABWfAAC4NmN1cnYAAAAAAAAAAQHNAABzZjMyAAAAAAABDEIAAAXe///zJgAAB5IAAP2R///7ov///aMAAAPcAADAbP/AABEIABQAFAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgMCAgMEAwMDBAUEBAQEBQcFBQUFBQcIBwcHBwcHCAgICAgICAgKCgoKCgoLCwsLCw0NDQ0NDQ0NDQ3/2wBDAQICAgMDAwYDAwYNCQcJDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ3/3QAEAAL/2gAMAwEAAhEDEQA/APi+iiiv5TP9/AooooA//9D4vooor+Uz/fwKKKKAP//Z");
var certificate, privateKey;

describe("Encrypted Data", function() {
  describe("Encrypt and decrypt", function() {
    it("should be able to encrypt a data using pkcs7 container then decrypt it back", function(done) {
      var cert = new window.PKIWebSDK.Certificate();
      // Get hash of file which is being encrypted
      var hash = forge.md5.create();
      hash.update(ab);
      var originalHash = hash.digest().data;
      console.log("original hash : " + originalHash);
      cert.parsePEM(certPem)
        .then(function(cert){
          certificate = cert;
          return window.PKIWebSDK.Key.parsePEM(privateKeyPem, "SHA-256")
        })
        .then(function(key){
          privateKey = key;
          return window.PKIWebSDK.EncryptedData.encrypt(certificate, ab)
        })
        .then(function(arrayBufferDER){
          return window.PKIWebSDK.EncryptedData.parseDER(arrayBufferDER);
        })
        .then(function(pkcs7){
          return pkcs7.decrypt(privateKey)
        })
        .then(function(content){
          var hash = forge.md5.create();
          hash.update(content);
          var decryptedHash = hash.digest().data;
          console.log("decrypted hash : " + decryptedHash);
          expect(originalHash).toBe(decryptedHash);
          done(); 
        })
        .catch(function(err){
          expect(1).toBe(2);
          done();
        })
    });
    it("should fail to decrypt using public key", function(done) {
      var cert = new window.PKIWebSDK.Certificate();
      // Get hash of file which is being encrypted
      var hash = forge.md5.create();
      hash.update(ab);
      var originalHash = hash.digest().data;
      console.log("original hash : " + originalHash);
      cert.parsePEM(certPem)
        .then(function(cert){
          certificate = cert;
          return window.PKIWebSDK.Key.parsePEM(publicKeyPem, "SHA-256")
        })
        .then(function(key){
          privateKey = key;
          return window.PKIWebSDK.EncryptedData.encrypt(certificate, ab)
        })
        .then(function(arrayBufferDER){
          return window.PKIWebSDK.EncryptedData.parseDER(arrayBufferDER);
        })
        .then(function(pkcs7){
          return pkcs7.decrypt(privateKey)
        })
        .then(function(content){
          expect(1).toBe(2);
          done(); 
        })
        .catch(function(err){
          console.log(err.message);
          done();
        })
    });
    it("should fail to decrypt because of wrong private key", function(done) {
      var cert = new window.PKIWebSDK.Certificate();
      // Get hash of file which is being encrypted
      var hash = forge.md5.create();
      hash.update(ab);
      var originalHash = hash.digest().data;
      console.log("original hash : " + originalHash);
      cert.parsePEM(certPem)
        .then(function(cert){
          certificate = cert;
          return window.PKIWebSDK.Key.parsePEM(wrongPrivateKeyPem, "SHA-256")
        })
        .then(function(key){
          privateKey = key;
          return window.PKIWebSDK.EncryptedData.encrypt(certificate, ab)
        })
        .then(function(arrayBufferDER){
          return window.PKIWebSDK.EncryptedData.parseDER(arrayBufferDER);
        })
        .then(function(pkcs7){
          return pkcs7.decrypt(privateKey)
        })
        .then(function(content){
          expect(1).toBe(2);
          done(); 
        })
        .catch(function(err){
          console.log(err.message);
          done();
        })
    });
  });
});
