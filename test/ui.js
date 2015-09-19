"use strict";

require("../src/index");

var base642Ab = function(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++ ) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

var pem = "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUZ6VENDQTdXZ0F3SUJBZ0lJY2xNREZhbnZv"
+ "czR3RFFZSktvWklodmNOQVFFTEJRQXdhREVhTUJnR0ExVUUKQXd3UlVtOXZkQ0JEUVNCSmJtUnZi"
+ "bVZ6YVdFeFBUQTdCZ05WQkFvTU5FMXBibWx6ZEhKNUlHOW1JRU52YlcxMQpibWxqWVhScGIyNGdZ"
+ "VzVrSUVsdVptOXliV0YwYVc5dUlGUmxZMmh1YjJ4dloza3hDekFKQmdOVkJBWVRBa2xFCk1CNFhE"
+ "VEUwTVRJd01UQTJOVGMxTUZvWERUSXlNVEl3TVRBMk5UYzFNRm93WnpFWk1CY0dBMVVFQXd3UVNX"
+ "NTAKSUVOQklGQjFjbmRoY25Wd1lURTlNRHNHQTFVRUNndzBUV2x1YVhOMGNua2diMllnUTI5dGJY"
+ "VnVhV05oZEdsdgpiaUJoYm1RZ1NXNW1iM0p0WVhScGIyNGdWR1ZqYUc1dmJHOW5lVEVMTUFrR0Ex"
+ "VUVCaE1DU1VRd2dnSWlNQTBHCkNTcUdTSWIzRFFFQkFRVUFBNElDRHdBd2dnSUtBb0lDQVFER1Vt"
+ "TWpvSG1reCsvMWNyTGxZM1UzNUl0bktpNWQKLzJjTVFZdGxydWlwY0VwT0lXQkZYblpFSFlUWE5m"
+ "ZE1SVk5raUZtL0dNK2o3NGgveU5Jb0NuSlNoU3ZHMkJhTwpPNjY5QkZNeEpoRE5FOTNIY212d3ZY"
+ "SDhLazI1cGFaTDU1SmxjVnRjR0Y3U1BMcFd5aGhWSitVL3pLUDBKd0RmClBHNXFwcER4aW5WelFR"
+ "Sm4zelFtZEZ6REhEdFlEQ3grTTcyKzVuVk51dCthZmUzQWR5L1p1TGdvYmpaNVlndXoKMmw3SnR5"
+ "YTgxWC9mSkVoakJUY2pzSE9PZ2JuVm5la3NCdGR2Vit6MVovbjhTWG9abld1RVNORTBRVEJKUmlF"
+ "eApOY1k0T2lOeE5raDY2RDdlNEN0RnNiNUs2UXNsK1Y3cG1wSVh5MTdNM1RiS0RCWGIzR2NkL1Ur"
+ "aWhUbmtyVzdHCmNTNHFQV001SjJEZVNTS0lZMkpFaHR0N1NOdnVmUGdjUlBhby91SDBLeUxwNTZY"
+ "RWFCTXNGQXY5NWU2b0VqTkMKNnVHY0k0NGRoUHdzeGNLQ2sxVExuQkxVWlkzVHdNRitoL1ZKanVQ"
+ "bUdrVkd4dFRUelB5Zm14aG1ocHdqZ21ZWApBclpyQXd6dFFvVzE3NEJicEkvK0tLK21QUkxJUHVQ"
+ "aXFsMGtxd3Q3ZGsvQzZtbEg0ckJMbFpyZkFjTzBOcStOCjg3VHpwRVlBaVlGeW9NbUVMZ2tzRnpo"
+ "M1VtT0xoU0ZWa3hBZlplU2h1YU51MTJwbFZxWFp5NnREbUYzSEJrMzUKa0dEVVM0OW5yaTVkM0J0"
+ "L0NhbW8xWnQxMEFUK001QkFVeVA0OWthYTNXc1h1Z1orQ0J4Q242djNxSDJ0R3VjdAo1R0R3VitQ"
+ "dzBqSERQd0lEQVFBQm8zd3dlakFkQmdOVkhRNEVGZ1FVVlBkaHBBL1A2c2lLV0N2WnFYeXdZOVMx"
+ "CkZDb3dEd1lEVlIwVEFRSC9CQVV3QXdFQi96QWZCZ05WSFNNRUdEQVdnQlRUNVdjVU9FOEVwK2xv"
+ "bWVYakpzaTgKUkdDUTFUQVhCZ05WSFNBRUVEQU9NQXdHQ21DQ2FBRUJBUUVDQXdJd0RnWURWUjBQ"
+ "QVFIL0JBUURBZ0dHTUEwRwpDU3FHU0liM0RRRUJDd1VBQTRJQ0FRQjQ3OGtmcld0RXdIWDdHRTlM"
+ "K0pFR08xNFhyNVRaVjVuYnJRcGdGTko4Ck5XSUNUK2dvRU9WZE9NWGgyRm40ZUxLN3VyUVd5b2dr"
+ "VVA4bFZJNDZFczl3K0p1UHBaU1NrMUtEMTRZSXFvTloKVnVZT1libUt1L1d6RHNWOXlXY2tOT1B0"
+ "YlQ5NlZTRVZGSnEzSTY4SUFwWWRjcjZZUnloSWZYMjFZTzUrdTlZVwpwZEx6d3MxMkZ3S1MveWho"
+ "d1cwVUsvVDA3RTFLMmZJQmNCcmJiWUQ2N09PdVhZSmVOTVo0V1o5Q3hYNXNPbmVrCkRNMThlNm5R"
+ "cEMwY21Yc0JMTk9BWXhqNFU3M1hlNnpqUHB2blZiSlc4eVhTRGdSSzVNdFBsNjlnNzArWFVSYmkK"
+ "bnBnU09pd3docEdTcDE2blRYM2JZWjNUaGk3RFB6WkMyc2t2ejJFdHZiUDlOOVYxayt4RGV3YjdV"
+ "bVRLbllabwpXMVdWNE42R2Jha3B3WmN3MXZGMEFwTUVUaHhOVWVqc3NtUUVSbnlFcE9GUmhiYXNs"
+ "K2xKU3NDcFpsY2Y2Uy81Cnp1azZtSmkraHpRa3NHeHkwQm4zUGtUR1FhMVlMN29iOHZZdU4vNUZ0"
+ "aGVBdiszQUJvam5EM0tNVjB6Ym1wUjAKNlJjakYvaVlpWEN4VmRiMEhlQkFFR0Z2NnV0V3ZiYitp"
+ "TkNLTXpuWjRYN2tyMmd0RUoveGJ2OHFLSUxUc1l4LwpTdWxOZG1uWXVSVkZtRUNTMDF6SGtRM3NQ"
+ "Mlp6YXhoNGFaZmpYNG10TDdUUUpzbDZPMUF4K1oybVVxSGpRSzhXCmFKVklwanFPUy8xeHhaenJr"
+ "bzZVTUVtSlFlcEwxcHBJVEdUNXJQUVFpUG54R2FkNzJjY1ZkcUJvblVocm9XTHIKZ0E9PQotLS0t"
+ "LUVORCBDRVJUSUZJQ0FURS0tLS0tCg==";

var crl = "MIICZDCCAUwCAQEwDQYJKoZIhvcNAQELBQAwgccxCzAJBgNVBAYTAklEMRQwEgYDVQQIDAtES0kg"
+ "SmFrYXJ0YTEWMBQGA1UEBwwNSmFrYXJ0YSBQdXNhdDEqMCgGA1UECgwhQmFkYW4gT3Rvcml0YXMg"
+ "U2VydGlmaWthdCBEaWdpdGFsMSMwIQYDVQQLDBpVbml0IFBlbmVyYml0YW4gU2VydGlmaWthdDEW"
+ "MBQGA1UEAwwNc2VydGlmaWthdC5pZDEhMB8GCSqGSIb3DQEJARYSY2VydEBzZXJ0aWZpa2F0Lmlk"
+ "Fw0xNTA5MDYwOTU3MjBaFw0xNjA5MDUwOTU3MjBaMD8wEwICEAAXDTE1MDkwMzA1MzEwMFowEwIC"
+ "EAIXDTE1MDkwNjA5NTQxNlowEwICEAMXDTE1MDkwNjA5NTQ0OFqgDzANMAsGA1UdFAQEAgIQBjAN"
+ "BgkqhkiG9w0BAQsFAAOCAQEARKdZiCnA3FNj8sTxkq897k+6CNfeiD3zkM2niMVMFt1bcrDQF8DC"
+ "RIJlPfVfclm2btDIkwfY6nBHBM30x0LEANfmZ4OGDxT2vG+sn7xWUyAPspzyKViWHQu7zHg6dnUN"
+ "yWEMEmDTvMWd/wb0jpC7b9+f9KLkvK3+N7y/spAp/jrQDTSTfFmnUAH2Nahn02H3ZtjkZBDx5qjB"
+ "Bsosu7yVhraNVDqlMjTGFjdJIEsvwWJZRm/O+YVh7rxjw1ejJQrb4niuH/wPxA+sPEc/geYTRBDD"
+ "rx/h3ezJ5kbM+XepUk8EruwoiJgO/2JhH8Ah9VsF64z9XqX7KzgQBLsc5J3kKg==";

var p12 = "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";

var caSample = "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUdDVENDQS9HZ0F3SUJBZ0lJQ2k2Z1lmdEI3"
+ "bTh3RFFZSktvWklodmNOQVFFTEJRQXdhREVhTUJnR0ExVUUKQXd3UlVtOXZkQ0JEUVNCSmJtUnZi"
+ "bVZ6YVdFeFBUQTdCZ05WQkFvTU5FMXBibWx6ZEhKNUlHOW1JRU52YlcxMQpibWxqWVhScGIyNGdZ"
+ "VzVrSUVsdVptOXliV0YwYVc5dUlGUmxZMmh1YjJ4dloza3hDekFKQmdOVkJBWVRBa2xFCk1CNFhE"
+ "VEUwTVRFeE1EQXpORGcxTWxvWERUSTBNVEV4TURBek5EZzFNbG93YURFYU1CZ0dBMVVFQXd3UlVt"
+ "OXYKZENCRFFTQkpibVJ2Ym1WemFXRXhQVEE3QmdOVkJBb01ORTFwYm1semRISjVJRzltSUVOdmJX"
+ "MTFibWxqWVhScApiMjRnWVc1a0lFbHVabTl5YldGMGFXOXVJRlJsWTJodWIyeHZaM2t4Q3pBSkJn"
+ "TlZCQVlUQWtsRU1JSUNJakFOCkJna3Foa2lHOXcwQkFRRUZBQU9DQWc4QU1JSUNDZ0tDQWdFQXRo"
+ "SGtRSUhDSzVJTVRKR3NVdW11WUl4K1g4cW4KdUdsVVNIY3ZMNHFVdklzN3B3L2EveXNqTk8xc1dO"
+ "NlNaM0VyeXNaV1dEVVY3OWxKenl6cm1oUHhwQzh6WHNjSApLVkRzaUp4alFBaFFoSktnNEp5NEJD"
+ "eS96TVp1aHQ2TENyRGlSeXY3L2N0YUZGdDNScFRjRjNWenpMc0xqNzJ6Cm5KVWlyNE94WVhNSFR1"
+ "NFhBekdBWHJ0RGVuMVV2WENVZG9rbldkWE5ONW5SYS9YSnVORVdlUHNPKzJFQm1Ib1EKald1Ni9m"
+ "L3NUdGczMzVmZldncDZxWHRvK2kxZGFOOXZlVjBWS21kaDFkNnFYUU9WcGkwZGhCbFFNeXg5T3VT"
+ "NQpJNm1FeDR2OS9CN1hPUTJ1S2lCWnNDWjNMaEI1RGN0YVFWTUN0UWJVOGI5dUVMeEJlTHcvOWxI"
+ "bGpaNjNvRHdlCkRoV25QVTQxRnJiUkN6Tk0xQjBSK3c0TllqMFNPNldweE9BbjZBdXBZeUtoNHZT"
+ "anRMeU1lYUZ3RnA5dll5VjEKcVZOWkRtdUVmRE8wYXRvMHc1a0FWNUxjQ2dJNEV6dDU1ckIvSENv"
+ "UzFqNngwMHhSTlhHOGpKczJCL2FpSlpiagpjTWdGZElURG5EZDRaR3RhbVJocWZVblhPQ2FTeGFt"
+ "U2xMSVBXL1ZBVUhrb2MvaWxsZGxmc2ZWUzBQMFY1SDVjCmNhcU1HQkkwUGJ5VTE4VnZpcUlhWXYz"
+ "UE9aUStGcHhXZzdqL1kySThPbE5wUllaLzc0UVhvazJmYkhPNE9rSXcKbVBIeGx0NEVuQ3FNWVRB"
+ "QXI5TGZ2SS9rSTFRZ3R3MzVrbjhrbGxWVTdsR3k4akE5cXF3VzVUQ2xuYlkwYVpkTwpEZ3ZCRXIx"
+ "WWZtMmtwY2tDQXdFQUFhT0J0akNCc3pBZEJnTlZIUTRFRmdRVTArVm5GRGhQQktmcGFKbmw0eWJJ"
+ "CnZFUmdrTlV3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFmQmdOVkhTTUVHREFXZ0JUVDVXY1VPRThF"
+ "cCtsb21lWGoKSnNpOFJHQ1ExVEJRQmdOVkhTQUVTVEJITUVVR0NHQ0NhQUVCQVFFQk1Ea3dOd1lJ"
+ "S3dZQkJRVUhBZ0VXSzJoMApkSEE2THk4dmQzZDNMbkp2YjNSallTNXZjaTVwWkM5RFVDOXdjM0ps"
+ "U1c1a2RXdGpjQzV3WkdZd0RnWURWUjBQCkFRSC9CQVFEQWdHR01BMEdDU3FHU0liM0RRRUJDd1VB"
+ "QTRJQ0FRQkJCTHpRaFAvTmFSNy9TMWp2bS8zc3RxV3oKTlBMb2JiYWhRMUxyRDJqUVdwZW1sbmZs"
+ "aGYyNVJBdi81RUQyMnUrdzBGNE05VTkyUm1IbE0zY0pySnlESEV1aQo2RUFJRm1BK01VZUNvNHdS"
+ "R2c1S0h4OHpJV2pqbzJPMVZOK1F5Zk9zQlVkbnljUG9qVE5zTC9ZMXRQbDhiOVlqClhJbDlFSzlV"
+ "bzV4NVU2cG1XR1FTZ3poVG5ZOWlpMHMyU1lRY0pTb1QwL1NsVFZMKy9uVDlrL1hLNVZtQmNwSXMK"
+ "eHhlTDh5TzN1dTlyMXV3ekJnZ1JWKzlIRDg5ZXI3b3FDM20reFFvODYraXpwaVBZTW5lVkM4UjFV"
+ "a3IvaDN6QwppM0c1cFVJRTRUTXJkUGUzakw3YzVWZUEvOTdOVVc4Z1pKUGxQOHlqOUZRKzJTUGcz"
+ "ZGRKMXRQdHBuMktpclZ3ClhQZXpmQjZjR29aQUlSZDZhUGhYWnNPWXV1WTlNSk1EVkVwaG9FQnk1"
+ "ZTlDN3V5OXMvdmVrWjg3cVNTUys5czUKeEM0MDR6MFlYdkU5V1k4QXIrUHowalIxWkwzNDNEbGdm"
+ "V0dtaVBWb2xXb3lRUXNta2hYVUJGMWZNZFlyaU9UUQpHaWl1REp2aDMrYnNZS3dkaWhuekZONzRl"
+ "ZU8rUWRxK2V3YWNmSmFTVXd3VjV5UzVsMVNGZW1qTW5zMmI4c3d5CmJhbnE3RGdjTVJnNlBhdURi"
+ "NG5IbTd6VG1ydUVyMDJmTXVMdyt1elNUb2VIV2Q5TFd4NHRtaGhPSjZsWU8zQjIKWFcyZWJZUER0"
+ "WUdWb1l2MVF5YlptY0NFOWR3aDJIZHUwR0xEOWZZQjcvREFWMHJzS0VkV1liZit4TnJxNm5nbwpt"
+ "S0kzdHB2SnRsTE1kdVcwSkE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg=="

var UI = require("../src/ui");
describe("UI Class", function() {
  describe("Render Element", function() {
    it("Render element to get certificate PEM", function(done) {
      document.body.innerHTML += "<div id='parse-pem'></div>";
      var file = new File([base642Ab(pem)], "pem.txt", {lastModified : new Date(0), type: "text/plain"})
      UI.getCertPEM("parse-pem", function(promise){
        // Do nothing
      })
      UI.handler.PEM(file)
        .then(function(cert){
          console.log(cert);
          expect(cert.certData.length).toBe(1);
          cert.getSubject()
            .then(function(subject){
              expect(subject.commonName).toBe("Int CA Purwarupa");
              done();
            })
            .catch(function(err){
              console.log(err.message);
              expect(1).toBe(2);
              done();
            })
        })
        .catch(function(err){
          console.log(err.message);
          expect(1).toBe(2);
          done();
        })
    });
    it("Render element to get CRL", function(done) {
      document.body.innerHTML += "<div id='parse-crl'></div>";
      var file = new File([base642Ab(crl)], "crl.crl", {lastModified : new Date(0), type: "text/plain"})
      UI.getCRL("parse-pem", function(promise){
        // Do nothing
      })
      UI.handler.CRL(file)
        .then(function(revocationList){
          console.log(revocationList);
          expect(revocationList.length).toBe(3);
          expect(revocationList[0]).toBe("1000");
          expect(revocationList[1]).toBe("1002");
          expect(revocationList[2]).toBe("1003");
          done();
        })
        .catch(function(err){
          console.log(err.message);
          expect(1).toBe(2);
          done();
        })
    });
    it("Render element to get P12", function(done) {
      document.body.innerHTML += "<div id='parse-p12'></div>";
      UI.getP12("parse-p12", function(promise){
        // Do nothing
      })
      document.getElementById("pkiwebsdk-p12-password").value = "password";
      var file = new File([base642Ab(p12)], "cert.p12", {lastModified : new Date(0), type: "application/x-pkcs12"})
      UI.handler.P12(file)
        .then(function(result){
          result.certificate.getSubject()
            .then(function(subject){
              expect(subject.commonName).toBe("blankon.in");
              expect(result.privateKey.substr(0,31)).toBe("-----BEGIN RSA PRIVATE KEY-----");
              done();
            })
            .catch(function(err){
              console.log(err.message);
              expect(1).toBe(2);
              done();
            })
        })
        .catch(function(err){
          console.log(err.message);
          expect(1).toBe(2);
          done();
        })
    });
    it("Render element to get Certificate Chain", function(done) {
      document.body.innerHTML += "<div id='parse-cert-chain'></div>";
      UI.certChain = new window.PKIWebSDK.Certificate();
      UI.getCertChain("parse-cert-chain", function(promise){
        // Do nothing
      })
      var file = new File([base642Ab(caSample)], "cert.p12", {lastModified : new Date(0), type: "application/x-pkcs12"})
      UI.handler.certChain(file);
      setTimeout(function(){
        document.getElementById("pkiwebsdk-get-cert-chain-validate").click();
        expect(UI.certChain.certData.length).toBe(1);
        UI.certChain.validate()
          .then(function(isValid){
            expect(isValid).toBe(true);
            done();
          })
      }, 1000);
    });
  });
});
