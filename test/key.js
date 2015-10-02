"use strict";
require("../src/index");
var cryptoSubtle = window.crypto.subtle || window.crypto.webkitSubtle || window.msCrypto.subtle;
var Key = require("../src/key");
var Utils = require("../src/utils");
var keyPair = {};
var pem = {};
var invalidKeyPair;
var encryptedPrivateKey;

// convert string to ArrayBuffer
var string2Ab = function(str, cb) {
  var buf = new ArrayBuffer(str.length*2);
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return cb(buf);
}

var unsupportedPKCS8 = "-----BEGIN ENCRYPTED PRIVATE KEY-----\n"
+ "MIIE6TAbBgkqhkiG9w0BBQMwDgQIWp+2EfGr7gACAggABIIEyKArdVDP5y6FNpUD\n"
+ "1TTJRR07voPu1Qy1Ubt95pK4Gus63HIFz0P7xyAozTT111LbTypCQLN7SV4u3c3j\n"
+ "Ga4uY63himjRkYIva+2IHjc4cgpOl9UVJssrc63uhp+D165OnIBBq8MB7jFkYDl8\n"
+ "J5RBDJCkY9BsvCukH/QDjz6pPsjZ4HeUg6f+wlT1O8GwTYgKvhuVO7h1q7Fztfju\n"
+ "q4mBbZ1Yejl2uJFpMvMfVMaz5T60ANFgtlchM4Zrsz93+iSOXVWVqZ31qg+wkQyF\n"
+ "RT/UKg3NoVR0+q/IcIPLD46TnZyZpbTlGlN5xzDf/ErcQrKaHkBnh2Q+T/m6m9SH\n"
+ "vFbCXYv5pc6ZovJA9XTwhxKKdwrJfRUdjz72+OVoCjSU85IXASNkUwmnTfFs4Bv+\n"
+ "VbjWvHHDGyjgkTtk++QVYaJxdhOf9Zvfj/hFK0OR7CLn+niSyUp8nji/5AmrhcHC\n"
+ "ZmtY0cWD/CcBKF9IoSJqUWtCnGYkyHqTGUyh+klO2GfeZcWU6ESnq43L0uOdoFRN\n"
+ "z0b3Ivsb+nBaydk/0FceTLwSfTmV97vhBrUeR1C2Q3ICy3cc6fMuJxlE9hrnd+c3\n"
+ "s4ozAsX2OX6Xx/e88WbQYHudhxILnwTIium6xl5+HBBry6J1+xPeIMQDNwrYh1eA\n"
+ "YNOQ9eGmBumlzwgzMlyWI99CtURYvDzhCMQ7qWchEPrDa5iMFCNkXWgBb1b9o3A1\n"
+ "CcRc6hW+/av5sTgAN0qlXuKylCO/q5Z83t7fTlcR8gMynifWsBfBcKhsELHleSks\n"
+ "hs8oGn4gZaX/dEYAd2fc/k5Ufw2uaSIdI0HUtCj88lgNi9gTuvdwhstn2IOCbATw\n"
+ "3LCMEOBGKRb0r0GfQb7MH37YPkpT8XgYWum8oMNdH9rUhw7M2+RXTrP2tRfbPmx1\n"
+ "OfEiMg8xPkBz6er7XFWiPHUd8HAPbITAQLo5LUJiDRv9yLTkL+fl6AE96u1kKv/u\n"
+ "c8Ij8j3UZt82Wx9SLlzMBGgRTBjoJjyoDLUvyDPxhAaQ9AWrPcEF3R/sPQOZGNIF\n"
+ "IsBoipm5Rm+npPT+9jEHvC65majhfQXVmezllpfYJ5666wxhcXHL9F7uLX29/kZ6\n"
+ "w3X7pPNDaTwvq9hk60iLPsM5ppTFcRiP36HBuzOBN9hZB5Krhu6FAb9QZQP59Vw9\n"
+ "NzEVQFg01CpOFU1eHeb7GK+ql9SmhA1sJl2v4iLLxahPoFNlfKT818C/wtWdTQzh\n"
+ "hUgGB9ng8caBkMfwdp24kLmfMcvXqIS4iQbmxfk6hicOtVb2ag8oXpn3JgNuCRos\n"
+ "4co1dVoIkM0Tk92w7cQA2uVVELO+Cjrus4EIIemRXlJuIJTdD67xs696T8UM88KQ\n"
+ "gTAbZ18LWOnHymVzHvXGJOXL/HmLTsXCgbOQiL2OCWX/VY51I4YCW83/P2HiroGp\n"
+ "eqr4rRDu9etNmcCOmFgLtFvqs0o7B+fTG3pt0eC3TWdWlpuHkM/DfVVHC3UMSA9J\n"
+ "D5ANcDRmJ7giYbD5T+7yuZ2h7qhL8F3htdAlgBOOi8mTg1J615qDpwD8IAS0b6V5\n"
+ "m+41H2lrwtfD+6UUzQA9IrjP3a/5c4rQ1NzLKdP4WVBHKalb/X4TRVtn2FBUJxim\n"
+ "xNu9QsCaEnuBOWyVkQ==\n"
+ "-----END ENCRYPTED PRIVATE KEY-----\n";

var openSSLPrivateKey = "-----BEGIN PRIVATE KEY-----\n"
+ "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDtKQttB3u1Nesn\n"
+ "OPzeXELo7z2hy14d2IH9B0866JICiJ4IEr3TwsGecjk2e9gWG5HP8DNr4Kgksgdx\n"
+ "5VZItim8csjs1ZyTK7DxGxhiZWOB9J1gBQd5hUHXOjSj/Cg03A6WXQIOD9XSLcQR\n"
+ "t5cawpcopTPxjr16qLjrQuIWvMMU0RsjxoR6IvOWBuDJiIWMIi7gxuZhvrgGmkEG\n"
+ "xa3ILda6LxHFji+23OKT8JusSW4Yh7cmCU9toPfMy4Y79f/tYlKK2fiNtSEH/p7W\n"
+ "XBMc6Nbr0QjO4HDH8sn+SgBqZdL3rqdl0Lep+CoufBSSF91QF2rfMtJPX6l5/uXA\n"
+ "vO0D6valAgMBAAECggEBAI+EwzFb0fU7h+7Ygc5eru8fuIBs/au6Fg/1mHDhxVpb\n"
+ "KqdgEBhSR7GHFjBuibn3PSpFBhlGfvqV8gNu8eRWuLMeE5GfQ32cdxuxdfQ1vx4p\n"
+ "1gMBiCB2D/4bbze9pOc4NGuyJUg1NQRYRcsi+wJqt+cU8nZAF1JfQGi+tOtll/jD\n"
+ "2Bc1MqljhEAGt2HuCmtfm5H0xEKe28kg0y7f5vgZO07NHJaqX1OodKDVy7J8ruR2\n"
+ "XAXmPiGep7qrAfYlrtyAtXWVtrPemdskHtpGjciood+tmE+N/+9UApn1lOU8+jc2\n"
+ "7Cs1fq2R/592ZoilwOmWfZgExBB9WW5c7b3yphxAMYECgYEA+OourjXTaZ8y+9DF\n"
+ "3J6FYmVnkKYg86yiSZkh+tVDE4riNxq/IQCHrghBUo65L5GybRi95+bwHWlCAFAo\n"
+ "ulRpwat1gB6ffCTty+6oMTFO0Ud2sOJRekQvT/enDbhagxG+B2joL/yU1SAKkemO\n"
+ "mjV8EExEmUrscJCSRm9qIYbGuS0CgYEA8+k1c+dfVHGArp4ZXAC7TGGnbzHgB7BO\n"
+ "Eopogkd5eG/scr7MvyY8XXYO5ENIgkUC4iB9VsvHVUfrJHiSZaAZk4sFEM9ol0TU\n"
+ "znl4ZOG5F6Lb2p1hjL/lwKEjlocRicIllawVKN/PHu3scyWhL8uTy0J82VKE3tRd\n"
+ "v+i56t3YrlkCgYAIq8fCg9eAh240PXqXC+KjodqwvEjLlEj2/WGkpkc26BCnUMQ1\n"
+ "txoC4wC7ioNC9/VaPZFoAbB9pcwJzMEOdKBWgc2PEAIIRhUOlJrBU/Fl8vJciRXD\n"
+ "h5qKU5s7LB/jDvwqr+neuhLJNduIZ7VzA8f1nWKKYITKCw89auYsktBbZQKBgDPb\n"
+ "y5+e++fKUh/OQXoMNcZhpOXBZu57j73la573b14p/c3Pv1yM1pzQcw4ZOBtqbNiD\n"
+ "K+L+ZJ0/M0GH2Sh+R7HVBviyAHzZB532uaBJVb8uwyvR9mGkk0bHe/ePNC1j9/XA\n"
+ "pqcQHstmrrU0tPaihAPdWQojv1hZMq2Q36aOEHnRAoGAPASy342k7F0LnYyyw3cY\n"
+ "DAluhzJg0ayU/6W+tWEXwpfesY6WryshFES4IaxdzHlrX0Gp6JyNxKs/tFOga6z9\n"
+ "WAjT6KWHVmKLX0mGsCo/EYwgbr2VUUrCs7ZViLvpt90g215e1M8n2+dupybocTot\n"
+ "nZHDe4Hnz6SIbqUwenlbJyc=\n"
+ "-----END PRIVATE KEY-----\n";

var openSSLPublicKey = "-----BEGIN PUBLIC KEY-----\n"
+ "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7SkLbQd7tTXrJzj83lxC\n"
+ "6O89octeHdiB/QdPOuiSAoieCBK908LBnnI5NnvYFhuRz/Aza+CoJLIHceVWSLYp\n"
+ "vHLI7NWckyuw8RsYYmVjgfSdYAUHeYVB1zo0o/woNNwOll0CDg/V0i3EEbeXGsKX\n"
+ "KKUz8Y69eqi460LiFrzDFNEbI8aEeiLzlgbgyYiFjCIu4MbmYb64BppBBsWtyC3W\n"
+ "ui8RxY4vttzik/CbrEluGIe3JglPbaD3zMuGO/X/7WJSitn4jbUhB/6e1lwTHOjW\n"
+ "69EIzuBwx/LJ/koAamXS966nZdC3qfgqLnwUkhfdUBdq3zLST1+pef7lwLztA+r2\n"
+ "pQIDAQAB\n"
+ "-----END PUBLIC KEY-----\n";

var invalidOpenSSLPublicKey = "-----BEGIN PUBLIC KEY-----\n"
+ "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7SkLbQd7tTXrJzj83lxC\n"
+ "6O89octeHdiB/QdPOuiSAoieCBK908LBnnI5NnvYFhuRz/Aza+CoJLIHceVWSLYp\n"
+ "vHLI7NWckyuw8RsYYmVjgfSdYAUHeYVB1zo0o/woNNwOll0CDg/V0i3EEbeXGsKX\n"
+ "KKUz8Y69eqi460LiFrzDFNEbI8aEeiLzlgbgyYiFjCIu4MbmYb64BppBBsWtyC3W\n"
+ "ui8RxY4vttzik/CbrEluGIe3JglPbaD3zMuGO/X/7WJSitn4jbUhB/6e1lwTHOjW\n"
+ "69EIzuBwx/LJ/koAamXS966nZdC3qfgqLnwUkhfdUBdq3zLST1+pef7lwLztA+r2\n"
+ "QIDAQA\n"
+ "-----END PUBLIC KEY-----\n";


var publicKeyPem = "-----BEGIN RSA PUBLIC KEY-----\n"
  + "MIIBCgKCAQEA0DtRP6gWQhH1IpRzpAdSPiManyPOIxcv0Wh2WLQouS07sk7zd4Cg\n"
  + "CmMRQ7KTY7T+10eAl0WkLxg1DASJtqt4V+6OpdmgrXSxGspQgqqxooDW8Sy8PBAx\n"
  + "WIlnidapHNcrzRLbMhpR1tjygcUNRxvpb7PEPpsMU1mqvhsHDpoLWm7HeJTmQiGf\n"
  + "kBfrZF0OlB93ZEh+NQugzZEKnP4rBzRGSPBzX6RaFeiOk4Qey5VBkNuPKiJ/jqXd\n"
  + "u84u0YX5rfrW1t1y918FQ+ZyaRnlzU0hQoZl1E1NGi2Ly1UnnCxxOFOCVf/1Rgu+\n"
  + "4ZJTh1lz+5X0s1g9M7/QDYyejwXcmAs7SQIDAQAB\n"
  + "-----END RSA PUBLIC KEY-----\n";
var privateKeyPem = "-----BEGIN RSA PRIVATE KEY-----\n"
  + "MIIEpAIBAAKCAQEA0DtRP6gWQhH1IpRzpAdSPiManyPOIxcv0Wh2WLQouS07sk7z\n"
  + "d4CgCmMRQ7KTY7T+10eAl0WkLxg1DASJtqt4V+6OpdmgrXSxGspQgqqxooDW8Sy8\n"
  + "PBAxWIlnidapHNcrzRLbMhpR1tjygcUNRxvpb7PEPpsMU1mqvhsHDpoLWm7HeJTm\n"
  + "QiGfkBfrZF0OlB93ZEh+NQugzZEKnP4rBzRGSPBzX6RaFeiOk4Qey5VBkNuPKiJ/\n"
  + "jqXdu84u0YX5rfrW1t1y918FQ+ZyaRnlzU0hQoZl1E1NGi2Ly1UnnCxxOFOCVf/1\n"
  + "Rgu+4ZJTh1lz+5X0s1g9M7/QDYyejwXcmAs7SQIDAQABAoIBAQCVwnOW0q7facbh\n"
  + "zd61k8Zkhh65Yaj5t81eUED9XuUC+TM79GhKBCoWDlX2WFKEnUHDVtt28FE6xbAx\n"
  + "KnpY9E2jACF7yl8zIP/XAraQo28KLptn7QKcOBElWf0rN0V9Rotr/CnFiQRe/ry6\n"
  + "9BuujrZ+7c0wMZbVw2F3RDz5FXUg3cp+vO8f2gCJymT0orV/jksMlO2YfBccQrc2\n"
  + "iMKIku3NzxaPxzUtGI8Cj1N4DlyUrU4wGa6+sKs8Q4/9aCTFl5L/KaemoL9qWVx9\n"
  + "JDK84BBuh5Mms5achV4A6drKef0HHbqEAZ8rSWvJUEJlGa03v0BZB8RWxdLd1M/a\n"
  + "t/Mjp195AoGBAPhZqEdSBSk40Gysv+ZP4QXHIDRTTQoAcA85vCK9eCYWJkybgCFT\n"
  + "wcMcFbBYC06+jGcdy2ax0XjWTdQ5TzI+MgSGcY68LZm41/b2DtVQ7WfH4yG49MTz\n"
  + "6DX3rLHkPQ5+4TLoYbW2NW41usAvP0srGeqBPIf3bUO/cSqfHw/rMsFTAoGBANal\n"
  + "Tygbb6g79GRFn4OFsUfJt1Dsiy2o6elF3R+aVrA2G9juPEnEhWLaaPTee4fDtd5y\n"
  + "Nfjp3jbgk4Zri8oF/cNMR3yDXMA+gNbxVuh2Ro896l/p5+lhZXbQq+03eB3RDsyv\n"
  + "00MyJ40QRyLzqm91EqOYtI9HU093HY/bTpqOnLFzAoGBAMGjTnUFe6aveLszWpDd\n"
  + "+WrC3tZNmQTSYI1Oi+Vea77uiEA1Aot5vds+G58alv53zgtcjMpunRAlsBtn79sR\n"
  + "6Xfjx8jt6nQwTpttMRWb+u9vSCZ0Cs1CC+2ARrORbRXPUhGaZQ0Em9ZpqEnOzP/0\n"
  + "BEn3KFYvUo9/RmJgHR0RWsqnAoGASv+Zx+bGPd8tBng5QyhMiEvYDKOKAds6V/K8\n"
  + "T5WK4qkVU9fyIshS3vZ3o8+1E/vzKRV4/E8jAMO5aEddoao0P7AAbmYr21Q7il7r\n"
  + "QfBJuTUmFntRN/97B2fkGs+93ZU1eZmZ1KnKngRpBrJjA+zBJX5u4H1Ig8SYBLLZ\n"
  + "JTHdWDcCgYB5G6MM1DQxFOBtFbNmmTwZFW0d8Nj+GnIgRHqlOPJe8wL0L665tL2+\n"
  + "cUaviZri0huhWn4cwMCGtn+NYM6tsVrEP2mu8uODJ/xXd6lmk6gu8y8btjY1Umu6\n"
  + "Tbjp7Hgns+UAtdcA8o7LjFleztMjC7VLVbwJmKKNT9uTgWpdZdwfeQ==\n"
  + "-----END RSA PRIVATE KEY-----\n";

var unmatchedPrivateKeyPem = "-----BEGIN RSA PRIVATE KEY-----\n"
  + "MIIEpAIBAAKCAQEAzPJp4c1eFvV8z0FgmfAyTt3QV8YPyAOeuViqgYeLtUNmXu6/\n"
  + "kDkKOpcbJqDcQVDjMgg5yV0iH5Mq2ym2fMVxYvGGsYD/2d7LdOxWlSdA975AWqlB\n"
  + "5hLH+21dQem26msoGoGNiYEXOAtu9b0vBKf59CCns08r9awG/X5ciGPAof1+96hx\n"
  + "WSnXv993X24heR1xpAVj6uBoTuRghpC7wVd70/jLedSBId0kFb/JwzRL9tyW1/1w\n"
  + "mHnNdHqF2zagS51tRfmZefCpRYyqX3Zi+gbdlRnaFKojhon+gRjzrrnTo1hPmhPU\n"
  + "Ll3MWuTMmaMDZSEBPee9tc9JMzmlZaOMFAcETQIDAQABAoIBAQC3hpDYem46QwTM\n"
  + "F7BoyVZTl4BdSWiSZON6+HJfYcDyxfNjKYrznJCTXQMcOUpjVwrMn98XecX33nKv\n"
  + "JZBb9PcPcld6lpkGQeORxZ3XHPqpn33DcfQoEkNw3EN5pc995g1YhxD2xFnFfz+S\n"
  + "4SG8mqtTOPbTtB8adT0hPUmhfSpgI6STj2ndzxK1pMfu5pZCfV5INWaVjobMKDYa\n"
  + "IDLgduuE/WW/7RpkbvtXiais8qY52RZwtY0U+uN7C+ttZPWTzP5jBXzBeJAmOrn3\n"
  + "yBnSB6B0rI6j/O5Gu+5Tyxyps0RYqKKy+x9qF1/ca8hZSWOk5jWaIQ21QODkOTeb\n"
  + "Y4xlFq1hAoGBAPWyuf6WHxYWwRHT4dfxdBn9cSrXa7NVdifP+IqFvW1FZJDljZkK\n"
  + "IM3RSF0c7jBteI6UmNnxWWD8prk4PL/CV7vLhc34nKmnhM5i5iiSFqTWkzKg5nJX\n"
  + "aiFMr/hCUHHTtnbw9y5Skz/ezTAQLPtfTuwP+HM+V0J0RK8MvRiqsBSpAoGBANWK\n"
  + "RZWP22u6XmmlmuUxJ0lhMkkSdNup1Jl2tbpujESsggbdZCUAyg6NRlPoxMdOZn7h\n"
  + "CArlkzButFMWye7gJVRxYBMixNpJgr5uU8nNMuLJilEh0cWb5/5kmdX/TVi0CZkP\n"
  + "/2yeKf4ExbEYaLWvtoMNGAMURGigj6X49GAr9tUFAoGAJ8fXS3wc7mOiwPMwZtlG\n"
  + "NgsN7qTQYEnfBpUqpar/v5hzru4r3fKA2zIeaE0N17NxyIwQr4DfOs/NYsHTPC0I\n"
  + "LXTHZlDxdJqV6yCiKUF1/xxq2tCoXyz+FwQmnaiHA9cGfP2I1+wwwS+ew0BrOAv3\n"
  + "aEsxq98VG8JdeIY0e7DvL3kCgYEArEReGmfxdZjl7Yihyt+6d+IndPekukjpr9wq\n"
  + "gvoHwqcARpV34roeR1sFL1AK31aKLTVRDali8qF8a8NoqIK+2r6T6RwVfpvrE8Fh\n"
  + "at1VfctlAEquNiKuJ3X0/MR3G2Yyj/5t6qw16CzlZxbv8hKMxHBdvK4u+dD90cFj\n"
  + "M+qDuBkCgYBaVaCXWuFfSHRdx1eFPe739YmF5rBLg8sYjVr4egKpqVjJ/32RAqis\n"
  + "hWMfJQO+q1yKlSZrjouTmO6UW4xyNaMI85UHfTyw2s+Po9B8+0nBC+iq6MaJPdJF\n"
  + "yeRLWPvINOzV9+y0u6ogcJYUPUKYB9UTBZEg1hFxBX4inCE35OQPWg==\n"
  + "-----END RSA PRIVATE KEY-----\n";


describe("Key", function() {
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
    it("should parse OpenSSL-generated PEM string (private) to key object", function(done) {
      Key.parsePEM(openSSLPrivateKey, "SHA-256").then(function(obj){
        expect(obj.keyData.type).toEqual("private");
        done();
      })
      .catch(function(err){
        console.log(err.message);
        expect(1).toBe(2);
        done();
      })
    });
    it("should parse OpenSSL-generated PEM string (public) to key object", function(done) {
      Key.parsePEM(openSSLPublicKey, "SHA-256").then(function(obj){
        expect(obj.keyData.type).toEqual("public");
        done();
      })
      .catch(function(err){
        console.log(err.message);
        expect(1).toBe(2);
        done();
      })
    });
    it("should fail to parse OpenSSL-generated PEM  because of invalid PEM string", function(done) {
      Key.parsePEM(invalidOpenSSLPublicKey, "SHA-256").then(function(obj){
        expect(1).toBe(2);
        done();
      })
      .catch(function(err){
        console.log(err.message);
        expect(err.message).toBe("Invalid Key PEM");
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
    it("should be able to encrypt and decrypt again", function(done){
      var publicKey, privateKey;
      var file = "aGVsbG8gYm9pIQ==";
      var arrayBuffer = Utils.base642Ab(file);
      Key.parsePEM(publicKeyPem, "SHA-256")
        .then(function(key){
          publicKey = key;
          return Key.parsePEM(privateKeyPem, "SHA-256");
        })
        .then(function(key){
          privateKey = key;
          return publicKey.encrypt(arrayBuffer);        
        })
        .then(function(encrypted){
          return privateKey.decrypt(encrypted);
        })
        .then(function(result){
          var decrypted = Utils.ab2Base64(result);
          expect(decrypted).toBe(file);
          done();
        })
        .catch(function(err){
          console.log(err.message);
          expect(1).toBe(2);
          done();
        })
    })
    it("should fail to decrypt using unmatched privateKey", function(done){
      var publicKey, privateKey;
      var file = "aGVsbG8gYm9pIQ==";
      var arrayBuffer = Utils.base642Ab(file);
      Key.parsePEM(publicKeyPem, "SHA-256")
        .then(function(key){
          publicKey = key;
          return Key.parsePEM(unmatchedPrivateKeyPem, "SHA-256");
        })
        .then(function(key){
          privateKey = key;
          return publicKey.encrypt(arrayBuffer);        
        })
        .then(function(encrypted){
          return privateKey.decrypt(encrypted);
        })
        .then(function(result){
          expect(1).toBe(2);
          done();
        })
        .catch(function(err){
          console.log(err.message);
          done();
        })
    })
    it("should fail to encrypt because of wrong key type", function(done){
      var publicKey, privateKey;
      var file = "aGVsbG8gYm9pIQ==";
      var arrayBuffer = Utils.base642Ab(file);
      Key.parsePEM(publicKeyPem, "SHA-256")
        .then(function(key){
          publicKey = key;
          return Key.parsePEM(unmatchedPrivateKeyPem, "SHA-256");
        })
        .then(function(key){
          privateKey = key;
          return privateKey.encrypt(arrayBuffer);        
        })
        .then(function(encrypted){
          expect(1).toBe(2);
          done();
        })
        .catch(function(err){
          console.log(err.message);
          done();
        })
    })
    it("should fail to decrypt because of wrong key type", function(done){
      var publicKey, privateKey;
      var file = "aGVsbG8gYm9pIQ==";
      var arrayBuffer = Utils.base642Ab(file);
      Key.parsePEM(publicKeyPem, "SHA-256")
        .then(function(key){
          publicKey = key;
          return Key.parsePEM(unmatchedPrivateKeyPem, "SHA-256");
        })
        .then(function(key){
          privateKey = key;
          return publicKey.encrypt(arrayBuffer);        
        })
        .then(function(encrypted){
          return publicKey.decrypt(encrypted);
        })
        .then(function(result){
          expect(1).toBe(2);
          done();
        })
        .catch(function(err){
          console.log(err.message);
          done();
        })
    })
    it("should fail to encrypt because of file size is bigger than k length of modulus minus 11 (see rfc2313)", function(done){
      var publicKey, privateKey;
      var file = "aGVsbG8KYXJlc3RuaWFyc2Vyc2VuIHRvaXJhcyBudG9pYXJuIHN0aWFlcm5zIHRvYWllcm50b2FyaWVuc3Qgb2lhcm5zdCBvYWlyZXN0biBhaXJlbnN0b2lhcmVudGF5b3dmdXRuYSd1dG5hdXl3Zid0bmFpcnNldGtpZndla3Rudy95J2Z1dGthdy8nZnlraXNldGtmdWhueTMndWhwYXd5b3V0aGEgaXJzZXRvYWlyc2VuaXJhZXNudG9yZW50IGFveXV0bmFvc3J5dW50YW9pdW50Znl3dWFpcnNlbnRhaW9yZXNudCBvYXJpZXNuZWluaWVl";
      var arrayBuffer = Utils.base642Ab(file);
      Key.parsePEM(publicKeyPem, "SHA-256")
        .then(function(key){
          publicKey = key;
          return Key.parsePEM(unmatchedPrivateKeyPem, "SHA-256");
        })
        .then(function(key){
          privateKey = key;
          return publicKey.encrypt(arrayBuffer); 
        })
        .then(function(encrypted){
          expect(1).toBe(2);
          done();
        })
        .catch(function(err){
          console.log(err.message);
          done();
        })
    })
    it("Encrypt private key to PKCS8", function(done){
      Key.parsePEM(privateKeyPem, "SHA-256")
        .then(function(key){
          key.toPKCS8("katasandi")
            .then(function(pemString){
              console.log(pemString);
              expect(pemString.split("-----")[1]).toBe("BEGIN ENCRYPTED PRIVATE KEY");
              encryptedPrivateKey = pemString;
              done();
            })
            .catch(function(err){
              ecpect(1).toBe(2);
              done();
            })
        })
        .catch(function(err){
          ecpect(1).toBe(2);
          done();
        })
    })
    it("Should fail to encrypt private key to PKCS8 if it is not a private key", function(done){
      Key.parsePEM(publicKeyPem, "SHA-256")
        .then(function(key){
          key.toPKCS8("katasandi")
            .then(function(pemString){
              ecpect(1).toBe(2);
              done();
            })
            .catch(function(err){
              expect(err.message).toBe("Must be a private key");
              done();
            })
        })
        .catch(function(err){
          ecpect(1).toBe(2);
          done();
        })
    })
    it("Decrypt an encrypted private key", function(done){
      Key.decryptPKCS8(encryptedPrivateKey, "katasandi")
        .then(function(privateKey){
          privateKey.toPEM()
            .then(function(pemString){
              expect(pemString).toBe(privateKeyPem);
              done();
            })
            .catch(function(err){
              expect(1).toBe(2);
              done();
            })
        })
        .catch(function(err){
          expect(1).toBe(2);
          done();
        })
    })
    it("Should fail to decrypt an encrypted private key because of wrong password", function(done){
      Key.decryptPKCS8(encryptedPrivateKey, "wrongpassword")
        .then(function(privateKey){
          expect(1).toBe(2);
          done();
        })
        .catch(function(err){
          expect(err.message.substr(-36)).toBe("Invalid PKCS8 PEM or wrong password?");
          done();
        })
    })
    // A PKCS8 that generated by command `openssl pkcs8 -in key.pem -topk8 -out enckey.pem`
    it("Should fail to decrypt an encrypted private key because of unsupported algorithm", function(done){
      Key.decryptPKCS8(unsupportedPKCS8, "12345")
        .then(function(privateKey){
          expect(1).toBe(2);
          done();
        })
        .catch(function(err){
          expect(err.message).toBe("Cannot read encrypted PBE data block. Unsupported OID. The algorithm used in this PKCS8 is no longer supported.");
          done();
        })
    })
  });
});
