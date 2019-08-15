"use strict";
var Key = require("../src/key");
var Certificate = require("../src/certificate");
var caStore = require("../src/castore");
window.PKIWebSDK = {};
window.PKIWebSDK.private = {}
window.PKIWebSDK.private.caStore = forge.pki.createCaStore(caStore);
var certSample;
var certChainSample;
var certPemSample;
var csrPemSample;
var csrSample;
var p12Sample;
var brokenPath = new Certificate();
var subject = {
  commonName : "blankon.in",
  countryName : "ID",
  stateName : "Jabodetabek",
  localityName : "Bojong",
  organizationName : "Uji coba",
  organizationUnit : "Uji coba"
}
var record = {
  issuer : {
    commonName : "blankon.in",
    countryName : "ID",
    stateName : "Jabodetabek",
    localityName : "Bojong",
    organizationName : "Uji coba",
    organizationUnit : "Uji coba"
  },
  subject : {
    commonName : "blankon.in",
    countryName : "ID",
    stateName : "Jabodetabek",
    localityName : "Bojong",
    organizationName : "Uji coba",
    organizationUnit : "Uji coba"
  },
  notBefore: new Date(2019, 5, 1),
  notAfter: new Date(2024, 8, 1),
}
var recordExpired = {
  issuer : {
    commonName : "blankon.in",
    countryName : "ID",
    stateName : "Jabodetabek",
    localityName : "Bojong",
    organizationName : "Uji coba",
    organizationUnit : "Uji coba"
  },
  subject : {
    commonName : "blankon.in",
    countryName : "ID",
    stateName : "Jabodetabek",
    localityName : "Bojong",
    organizationName : "Uji coba",
    organizationUnit : "Uji coba"
  },
  notBefore: new Date(2017, 8, 1),
  notAfter: new Date(2018, 8, 1),
}
var recordWithoutDate = {
  issuer : {
    commonName : "blankon.in",
    countryName : "ID",
    stateName : "Jabodetabek",
    localityName : "Bojong",
    organizationName : "Uji coba",
    organizationUnit : "Uji coba"
  },
  subject : {
    commonName : "blankon.in",
    countryName : "ID",
    stateName : "Jabodetabek",
    localityName : "Bojong",
    organizationName : "Uji coba",
    organizationUnit : "Uji coba"
  },
}

var p12Base64 = "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";

var p12OpenSSLBase64 = "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";

var certPemSample = "-----BEGIN CERTIFICATE-----\n"
+ "MIID5zCCAs+gAwIBAgIBATANBgkqhkiG9w0BAQUFADBvMRMwEQYDVQQDEwpibGFu\n"
+ "a29uLmluMQswCQYDVQQGEwJJRDEUMBIGA1UECBMLSmFib2RldGFiZWsxDzANBgNV\n"
+ "BAcTBkJvam9uZzERMA8GA1UEChMIVWppIGNvYmExETAPBgNVBAsTCFVqaSBjb2Jh\n"
+ "MB4XDTE0MDkxODA4MDk0OVoXDTE0MDkxODA4MDk0OVowbzETMBEGA1UEAxMKYmxh\n"
+ "bmtvbi5pbjELMAkGA1UEBhMCSUQxFDASBgNVBAgTC0phYm9kZXRhYmVrMQ8wDQYD\n"
+ "VQQHEwZCb2pvbmcxETAPBgNVBAoTCFVqaSBjb2JhMREwDwYDVQQLEwhVamkgY29i\n"
+ "YTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANJ0uIEFUO994Ea9a30/\n"
+ "bjIvsS4TRddluEwLSYUPwtwvWA5PzN6P4MzJ6expSUBGeogjnIe6BQWqGBL1BC0t\n"
+ "RubxkdZF3HaNkCJBuuL4bBPjpLQjmFdzLr34NCAfkhF4OsyNlP+a8LSK/Eda5HZr\n"
+ "fFix+x1b1dEl1WBNl+9HBj2PSkndJaudID8ul8cVxXtbDSCZiuLR2N6WyBAHOn39\n"
+ "jAnJuc3sM2hl9jeYUovZaDXG5DCIf7OLlRw5e21YhFrDqSYbfwEbEeC7T0LT/wy3\n"
+ "NQWXSBs/sHJ1jGCUgXxJ0YiB25ZNmTtwOq4fdpfz1j+GuXhMkYdmrmj6LDGabA7U\n"
+ "lg8CAwEAAaOBjTCBijAMBgNVHRMEBTADAQH/MAsGA1UdDwQEAwIC9DA7BgNVHSUE\n"
+ "NDAyBggrBgEFBQcDAQYIKwYBBQUHAwIGCCsGAQUFBwMDBggrBgEFBQcDBAYIKwYB\n"
+ "BQUHAwgwEQYJYIZIAYb4QgEBBAQDAgD3MB0GA1UdDgQWBBRCN27ex505paMrG07J\n"
+ "cMSW0BRcwTANBgkqhkiG9w0BAQUFAAOCAQEAV6/HX8JYhpGeuDs/eF7v33CfpRfh\n"
+ "Nubgrb5QFQ+hqqBlpCAoaPR1JOh9J1gqnObiquHcQwyJcMRPzRfznLascpBNLjFQ\n"
+ "ESmFFS54FRORhSO4TA4yy7MsEhnpCzqFMHCmchLOR3f43gd9HRoanV4hWjdYnmYZ\n"
+ "a4CK4LRp/+rIOxeQddjFRW2FUcMVpY8SBucgdId1VFU5X3R0BncoKQH5JIJNcVTZ\n"
+ "WzX+NPafpY1XbV54DynddnunNBcrqrU3gjn0QceV5/+nksFtZMP8kGMScJgWXLtw\n"
+ "V8akVZGiXdTn0M7upFc5T2Yb8J4ZohyIllfwLXaqsv0mhaWSeoTZu6nvHg==\n"
+ "-----END CERTIFICATE-----\n"



var csrPemSample = "-----BEGIN CERTIFICATE REQUEST-----\n"
+ "MIICxTCCAa0CAQAwbzETMBEGA1UEAxMKYmxhbmtvbi5pbjELMAkGA1UEBhMCSUQx\n"
+ "FDASBgNVBAgTC0phYm9kZXRhYmVrMQ8wDQYDVQQHEwZCb2pvbmcxETAPBgNVBAoT\n"
+ "CFVqaSBjb2JhMREwDwYDVQQLEwhVamkgY29iYTCCASIwDQYJKoZIhvcNAQEBBQAD\n"
+ "ggEPADCCAQoCggEBANz4dsUgNFoXbV6TbJpH7jeSfYvFwRuQCEJ6bZCNcRtLHDg+\n"
+ "wjubYltauwvz/xp0hmEQCAOcgbXibsK1QppOxK9j6AjoXIffdybaoH4rs/1dlPt+\n"
+ "+A61YI1mX9VHtStuAy7oJcQsrEd9nKwI0CTUfpgKrQNF7bqp85AEc2sV33fuS1z5\n"
+ "8bb+8B1s66/gdJH3ZKY5AhrTeGiRYYkEr+wtbfL+RcfO2gXm1VvXduy8755/frbP\n"
+ "mwtBVWJz1wGghCeDDCXvCDfcespEUNn+uUO/UZL4RvqXDP0lxRY3aBdSo80HMlJS\n"
+ "54js+63PilttSs0g4H37GfHpbcQdsruPB6oAoM0CAwEAAaARMA8GCSqGSIb3DQEJ\n"
+ "BzECDAAwDQYJKoZIhvcNAQEFBQADggEBAIgTLyj0LtuLWnttMB6YpEBHA9gs22yP\n"
+ "3C7n/zkOk5eDtuEc7GLOXGgiTZiYqnkqkDIKSOePtegrCg1bhzy4DcF6uWnaY3kE\n"
+ "dP+eq7r+OT36TrpZSHxRvi6hFt2pHkUglxu2QP6BD2ApXK1QxRsSBAr67Ml1lD1Z\n"
+ "1uev+emqcnriW9RyYJyRIy7q1mGUH10TU15BH68npYtoc3GFqo6CIeoe88m4WUB9\n"
+ "G4XGBItdhkQ3rruz/8DY1DFVtDU2mSm9uD9VZo888Cn3g5jNTKBRetPkPiCLV21o\n"
+ "rcQFlNUp0WWUSkzfE1ZJRfFNOrVtaW/loLfDqP+nGp0/d6xiz52I/+o=\n"
+ "-----END CERTIFICATE REQUEST-----\n"



var invalidCertSample = "-----BEGIN CERTIFICATE REQUEST INVALID-----\r\n"
+ "MIICzzCCAbcCAQAwgYkxCzAJBgNVBAYTAklEMRMwEQYDVQQIDApKYXdhIEJhcmF0\r\n"
+ "MQ4wDAYDVQQHDAVCb2dvcjESMBAGA1UECgwJcGRmdCwgaW5jMQwwCgYDVQQLDANS\r\n"
+ "JkQxETAPBgNVBAMMCHBkZnQubmV0MSAwHgYJKoZIhvcNAQkBFhFoZXJwaWtvQGdt\r\n"
+ "YWlsLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMTERKpRMrIC\r\n"
+ "My267fwL1zvURUbDxMUIWTpXGkZEqg/bQPDBwBvFTgERRwPoZYCDIyrf/yElV6Sz\r\n"
+ "SymhR1d8uaItRqRvE27ObGsqQo8T91dnJUncZPRbA22WMIRSdsVo6N3DkGEeO40j\r\n"
+ "Ohj62pO+mdRUx5fuXtJ5BzEsdXQercdEZPyBXfFcGIX8nYPQw4hPezXDXKzn3DLY\r\n"
+ "Wbrj7oQk7xg6vWBhyQ2bHQkj0mf64BO/632YYNR0lhT9h26I+OmQywVHPZbjQp3i\r\n"
+ "SnuF7CZAyBsPzo/Bxi0n1kZegGqou/f7s3q6JW38qe038fZ91M/OXeN1kTOF2vfT\r\n"
+ "cxcJWhB4h/sCAwEAAaAAMA0GCSqGSIb3DQEBCwUAA4IBAQArQakshcpX+R0EtSYv\r\n"
+ "FoXS1CeXyzzlBVBv0shNWK6sggbZxO0T0pWP/unnoBH8O5s5JEWGQxSoDAL4T0a3\r\n"
+ "84gAJfGz1iHiAohdxP8avOrWkM+LW0aYsIwOOoNLFLG+Jqsp4tIusKDQPYfJjyn3\r\n"
+ "U8yI8bpFLjfLqkr6UwkczVxvo9rDIOIQA3quVMQvFOl1wb4hZmNveAc50r7jQs0E\r\n"
+ "1OYF484zEklE+/LlxlJKNngwkaRzYeAsUOn18qtymqZLty2hBYYkrM5rekDk53hX\r\n"
+ "vzLuiNVIbX/Xwx0HdNN51TngqFw++yEhrcpE6L/YVMPxMN5VSfW3EJ6dBWlb3xA4\r\n"
+ "F3f5\r\n"
+ "-----END CERTIFICATE REQUEST INVALID-----\r\n";

var crlBase64Sample = "MIIDMDCCARgCAQEwDQYJKoZIhvcNAQELBQAwgagxCzAJBgNVBAYTAklEMRMwEQYDVQQIDApKYXdhIEJhcmF0MQ4wDAYDVQQHDAVCb2dvcjEkMCIGA1UECgwbQ2ltYW5nZ3UgU2VydGlmaWthdCBEaWdpdGFsMRcwFQYDVQQLDA5UYW1hbiBDaW1hbmdndTEUMBIGA1UEAwwLY2ltYW5nZ3UuaWQxHzAdBgkqhkiG9w0BCQEWEGNlcnRAY2ltYW5nZ3UuaWQXDTE1MDkwNjEzMTUyM1oXDTE2MDkwNTEzMTUyM1owKjATAgIQARcNMTUwOTA2MTMxMjE0WjATAgIQAxcNMTUwOTA2MTMxNTAxWqAPMA0wCwYDVR0UBAQCAhACMA0GCSqGSIb3DQEBCwUAA4ICAQA4Xo/syzkTvjjskMXoBa8AGVuGRsxU8oIZ2tSnlYIEem5DU2IuUEONTTCB7BfX61Qg6AxWLtpPf7VKXyRDxl7OoZn/R+VMgmAXJhAExIaowuTVEl7lwmufiWdfKp/LnNbTKieErlBfCK/KG/k1E4ceNG+uPw4bjCAq8+TWBZs3poHJMCIo0LVpf2C1U/rvefuWrFyFnsd0zMXdxy8Rz+ICszAPaOExiass0oVW+Nq4c4TI5jYNX0OpUZivJDdKJuMyNKilF4GY8PRDJT+NHuNF+RxJIZXw0+uqaF+W9RkTJZ2kbvdeB2uYZRKnRiH87ZK8wbqa8RwBYP7hwAawxN3aRMt2XiMB0yyKh5YCo43AcKcqF4WIU4mxidX+KGPxm5KTB1LLaAVLG2rg3oAqK8Syyp3h5WerkyG+3IoN3oqLUhm5T5kgr0UXb+zlH85ER9meWUBYO87G7I+CxTY1NhX7PujvRu/03qWoSFzE1fb3AusKDBTGcHSftatCcpRY9HM5uHh21+1CIR4iE6KFtwzaVpEIE75Ksf7nJYn3VORkxc6CJU0g0fQ8xpuKbS9IIa2qjUGLbjIUQxtfRouzrnscR5aeC5LeNVtWkI+n1nml/bsycCcBwFqnnl40Fv5QgX3Bk42m/wWNPi2U6fqtVPYpdV0HJq7d5leUzZbAnqExow==";

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


var bundledPEM = "-----BEGIN CERTIFICATE-----\n"
+ "MIIGcDCCBFigAwIBAgIIGe+fRp/vsmcwDQYJKoZIhvcNAQELBQAwZzEZMBcGA1UE\n"
+ "AwwQSW50IENBIFB1cndhcnVwYTE9MDsGA1UECgw0TWluaXN0cnkgb2YgQ29tbXVu\n"
+ "aWNhdGlvbiBhbmQgSW5mb3JtYXRpb24gVGVjaG5vbG9neTELMAkGA1UEBhMCSUQw\n"
+ "HhcNMTQxMjAxMDcxNjAyWhcNMTkxMjAxMDcxNjAyWjBVMRUwEwYDVQQDDAxQU3JF\n"
+ "IEtvbWluZm8xLzAtBgNVBAoMJktlbWVudGVyaWFuIEtvbXVuaWthc2kgZGFuIElu\n"
+ "Zm9ybWF0aWthMQswCQYDVQQGEwJJRDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCC\n"
+ "AgoCggIBAK/wnRUqa10tc21uOutmRepT0+n2K6KFBLrgI3Skn+YqPQe4w3J31ZUd\n"
+ "e/xROWjePbTTAbRdRAt+q2C2Wc+aQKS6sf4UE45PCVNC4//J9EQEq4/BC6MvFKdJ\n"
+ "9CC9AdBHhLe5tPnC9+KjpkNE2pQ1e/RM3tPmyUSme0coct2sdrdVNvM88ePHanYR\n"
+ "z4T2aeSmzHAnRqNxC7atD4aLp2ur3VtIzg/s1A6VHFdG1olXd2C62Z7OlibAxM1c\n"
+ "wwYqdZ9otFYKfi4g6/OzNiEQR9E6MxrTu4fXXRXDeRmPyVJ9rSNsBFXhMOKvulAB\n"
+ "dv5DsbSUD60XwsdVm3nTtufDUer03hKuJ8mk2GzK4XXtysiXKwH5V6sTTZb9X3rm\n"
+ "byHc+XI9SeKEfzNrD2RXd+ZryC5kkKs5n2uFRqnpdQbxBFJuTUUN2Rb3F1X5yG+8\n"
+ "LgsALnXSfg8L2YJ1myH2p0HAlfvG5Ojirs5g/f2Gqcyg4bSekG6LIx9aqFmF7NnG\n"
+ "Acq8pAoIRKlrZJXRivmQOOG30Sg4GtefUFaR/KLKbFcSL4HUSANhRNZpPbrYrqfU\n"
+ "nyId2gz/NgnEwtqIj3e+hSbqohHhdQlfv91y39XLfeIPkKUCKuMa+66y2Cor8FEp\n"
+ "hgJUUq+sWmrRAbT4qwVQSWWelWqlztf4gmU2Eq3n5tgEr+lt3KeXAgMBAAGjggEw\n"
+ "MIIBLDAdBgNVHQ4EFgQUfeNICO6lM6vYrySahecEDylcfiMwDwYDVR0TAQH/BAUw\n"
+ "AwEB/zAfBgNVHSMEGDAWgBRU92GkD8/qyIpYK9mpfLBj1LUUKjAZBgNVHSAEEjAQ\n"
+ "MA4GDGCCaAEBAQEBAgMEAjCBrQYDVR0fBIGlMIGiMIGfoDCgLoYsaHR0cDovL3d3\n"
+ "dy5yb290Y2Eub3IuaWQvY3JsL3BzcmVpbnRwdXJ3YS5jcmyia6RpMGcxGTAXBgNV\n"
+ "BAMMEEludCBDQSBQdXJ3YXJ1cGExPTA7BgNVBAoMNE1pbmlzdHJ5IG9mIENvbW11\n"
+ "bmljYXRpb24gYW5kIEluZm9ybWF0aW9uIFRlY2hub2xvZ3kxCzAJBgNVBAYTAklE\n"
+ "MA4GA1UdDwEB/wQEAwIBhjANBgkqhkiG9w0BAQsFAAOCAgEAQNZqEBILwNZLJl/M\n"
+ "T4fGAC/AEz9dfjOn1hwNOvv/wA0uZFjLQ4+hv2OQ53lc3YqnjVvI3l0rqm5OpUFn\n"
+ "NjEBTgwEYOSu54KHuD/8evip9oagDVpMLYF3jnpY3NQz0XMvdbSQmSGGdjH663cR\n"
+ "+j9r1ll1nysiY4H69hPkOc8Il5pmkeWCLGzoSeG0G/fPJ/Pup3DH2h9d+2hvqa26\n"
+ "PNH1sM73MQua2aVPCQhIkHS9NhyRbOVQ/5XBMOiGvA36HEROwiI5n8LjVAt18rfs\n"
+ "Od2Zzf8o3kW5uiDV66rogWX4syspPMM1ragfkgmFDC7lkxqxphRgTlChahQe1xWQ\n"
+ "NUthUKzmvqcJL42g0Nmz/HBg7MsUwbuQwfo2BRTVXEc+TpvI7BzY6SnFKdD+cKTT\n"
+ "l45Vk6Y3ogJ+4APjyN1BO97avNy7lAYBv+BLBbOoBtIkhxaLhqE27WbahfvhoqQh\n"
+ "5YObY7+UVECBf2jRQ+vssiTgo0xWPLlOB7XVRVJZoLBkgG+G0VcuSMxOtPGO2C55\n"
+ "U/0DT0OJ7umv+wt4j2Hd+H1OStqA/IKMX66FCJsHt/ekOXjM4UJsy1V5x8NL8Sl2\n"
+ "IM6w7Wz8F8atTpxCa9FuEUdiKFGUGSEbjzslYIsoF5/nxOZ68j35uEB8xDrL35+T\n"
+ "a06t9F/6PIVuMSGVtc1622I1cUI=\n"
+ "-----END CERTIFICATE-----\n"
+ "-----BEGIN CERTIFICATE-----\n"
+ "MIIFzTCCA7WgAwIBAgIIclMDFanvos4wDQYJKoZIhvcNAQELBQAwaDEaMBgGA1UE\n"
+ "AwwRUm9vdCBDQSBJbmRvbmVzaWExPTA7BgNVBAoMNE1pbmlzdHJ5IG9mIENvbW11\n"
+ "bmljYXRpb24gYW5kIEluZm9ybWF0aW9uIFRlY2hub2xvZ3kxCzAJBgNVBAYTAklE\n"
+ "MB4XDTE0MTIwMTA2NTc1MFoXDTIyMTIwMTA2NTc1MFowZzEZMBcGA1UEAwwQSW50\n"
+ "IENBIFB1cndhcnVwYTE9MDsGA1UECgw0TWluaXN0cnkgb2YgQ29tbXVuaWNhdGlv\n"
+ "biBhbmQgSW5mb3JtYXRpb24gVGVjaG5vbG9neTELMAkGA1UEBhMCSUQwggIiMA0G\n"
+ "CSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDGUmMjoHmkx+/1crLlY3U35ItnKi5d\n"
+ "/2cMQYtlruipcEpOIWBFXnZEHYTXNfdMRVNkiFm/GM+j74h/yNIoCnJShSvG2BaO\n"
+ "O669BFMxJhDNE93HcmvwvXH8Kk25paZL55JlcVtcGF7SPLpWyhhVJ+U/zKP0JwDf\n"
+ "PG5qppDxinVzQQJn3zQmdFzDHDtYDCx+M72+5nVNut+afe3Ady/ZuLgobjZ5Yguz\n"
+ "2l7Jtya81X/fJEhjBTcjsHOOgbnVneksBtdvV+z1Z/n8SXoZnWuESNE0QTBJRiEx\n"
+ "NcY4OiNxNkh66D7e4CtFsb5K6Qsl+V7pmpIXy17M3TbKDBXb3Gcd/U+ihTnkrW7G\n"
+ "cS4qPWM5J2DeSSKIY2JEhtt7SNvufPgcRPao/uH0KyLp56XEaBMsFAv95e6oEjNC\n"
+ "6uGcI44dhPwsxcKCk1TLnBLUZY3TwMF+h/VJjuPmGkVGxtTTzPyfmxhmhpwjgmYX\n"
+ "ArZrAwztQoW174BbpI/+KK+mPRLIPuPiql0kqwt7dk/C6mlH4rBLlZrfAcO0Nq+N\n"
+ "87TzpEYAiYFyoMmELgksFzh3UmOLhSFVkxAfZeShuaNu12plVqXZy6tDmF3HBk35\n"
+ "kGDUS49nri5d3Bt/Camo1Zt10AT+M5BAUyP49kaa3WsXugZ+CBxCn6v3qH2tGuct\n"
+ "5GDwV+Pw0jHDPwIDAQABo3wwejAdBgNVHQ4EFgQUVPdhpA/P6siKWCvZqXywY9S1\n"
+ "FCowDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTT5WcUOE8Ep+lomeXjJsi8\n"
+ "RGCQ1TAXBgNVHSAEEDAOMAwGCmCCaAEBAQECAwIwDgYDVR0PAQH/BAQDAgGGMA0G\n"
+ "CSqGSIb3DQEBCwUAA4ICAQB478kfrWtEwHX7GE9L+JEGO14Xr5TZV5nbrQpgFNJ8\n"
+ "NWICT+goEOVdOMXh2Fn4eLK7urQWyogkUP8lVI46Es9w+JuPpZSSk1KD14YIqoNZ\n"
+ "VuYOYbmKu/WzDsV9yWckNOPtbT96VSEVFJq3I68IApYdcr6YRyhIfX21YO5+u9YW\n"
+ "pdLzws12FwKS/yhhwW0UK/T07E1K2fIBcBrbbYD67OOuXYJeNMZ4WZ9CxX5sOnek\n"
+ "DM18e6nQpC0cmXsBLNOAYxj4U73Xe6zjPpvnVbJW8yXSDgRK5MtPl69g70+XURbi\n"
+ "npgSOiwwhpGSp16nTX3bYZ3Thi7DPzZC2skvz2EtvbP9N9V1k+xDewb7UmTKnYZo\n"
+ "W1WV4N6GbakpwZcw1vF0ApMEThxNUejssmQERnyEpOFRhbasl+lJSsCpZlcf6S/5\n"
+ "zuk6mJi+hzQksGxy0Bn3PkTGQa1YL7ob8vYuN/5FtheAv+3ABojnD3KMV0zbmpR0\n"
+ "6RcjF/iYiXCxVdb0HeBAEGFv6utWvbb+iNCKMznZ4X7kr2gtEJ/xbv8qKILTsYx/\n"
+ "SulNdmnYuRVFmECS01zHkQ3sP2Zzaxh4aZfjX4mtL7TQJsl6O1Ax+Z2mUqHjQK8W\n"
+ "aJVIpjqOS/1xxZzrko6UMEmJQepL1ppITGT5rPQQiPnxGad72ccVdqBonUhroWLr\n"
+ "gA==\n"
+ "-----END CERTIFICATE-----\n"
+ "-----BEGIN CERTIFICATE-----\n"
+ "MIIGCTCCA/GgAwIBAgIICi6gYftB7m8wDQYJKoZIhvcNAQELBQAwaDEaMBgGA1UE\n"
+ "AwwRUm9vdCBDQSBJbmRvbmVzaWExPTA7BgNVBAoMNE1pbmlzdHJ5IG9mIENvbW11\n"
+ "bmljYXRpb24gYW5kIEluZm9ybWF0aW9uIFRlY2hub2xvZ3kxCzAJBgNVBAYTAklE\n"
+ "MB4XDTE0MTExMDAzNDg1MloXDTI0MTExMDAzNDg1MlowaDEaMBgGA1UEAwwRUm9v\n"
+ "dCBDQSBJbmRvbmVzaWExPTA7BgNVBAoMNE1pbmlzdHJ5IG9mIENvbW11bmljYXRp\n"
+ "b24gYW5kIEluZm9ybWF0aW9uIFRlY2hub2xvZ3kxCzAJBgNVBAYTAklEMIICIjAN\n"
+ "BgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAthHkQIHCK5IMTJGsUumuYIx+X8qn\n"
+ "uGlUSHcvL4qUvIs7pw/a/ysjNO1sWN6SZ3ErysZWWDUV79lJzyzrmhPxpC8zXscH\n"
+ "KVDsiJxjQAhQhJKg4Jy4BCy/zMZuht6LCrDiRyv7/ctaFFt3RpTcF3VzzLsLj72z\n"
+ "nJUir4OxYXMHTu4XAzGAXrtDen1UvXCUdoknWdXNN5nRa/XJuNEWePsO+2EBmHoQ\n"
+ "jWu6/f/sTtg335ffWgp6qXto+i1daN9veV0VKmdh1d6qXQOVpi0dhBlQMyx9OuS5\n"
+ "I6mEx4v9/B7XOQ2uKiBZsCZ3LhB5DctaQVMCtQbU8b9uELxBeLw/9lHljZ63oDwe\n"
+ "DhWnPU41FrbRCzNM1B0R+w4NYj0SO6WpxOAn6AupYyKh4vSjtLyMeaFwFp9vYyV1\n"
+ "qVNZDmuEfDO0ato0w5kAV5LcCgI4Ezt55rB/HCoS1j6x00xRNXG8jJs2B/aiJZbj\n"
+ "cMgFdITDnDd4ZGtamRhqfUnXOCaSxamSlLIPW/VAUHkoc/illdlfsfVS0P0V5H5c\n"
+ "caqMGBI0PbyU18VviqIaYv3POZQ+FpxWg7j/Y2I8OlNpRYZ/74QXok2fbHO4OkIw\n"
+ "mPHxlt4EnCqMYTAAr9LfvI/kI1Qgtw35kn8kllVU7lGy8jA9qqwW5TClnbY0aZdO\n"
+ "DgvBEr1Yfm2kpckCAwEAAaOBtjCBszAdBgNVHQ4EFgQU0+VnFDhPBKfpaJnl4ybI\n"
+ "vERgkNUwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTT5WcUOE8Ep+lomeXj\n"
+ "Jsi8RGCQ1TBQBgNVHSAESTBHMEUGCGCCaAEBAQEBMDkwNwYIKwYBBQUHAgEWK2h0\n"
+ "dHA6Ly8vd3d3LnJvb3RjYS5vci5pZC9DUC9wc3JlSW5kdWtjcC5wZGYwDgYDVR0P\n"
+ "AQH/BAQDAgGGMA0GCSqGSIb3DQEBCwUAA4ICAQBBBLzQhP/NaR7/S1jvm/3stqWz\n"
+ "NPLobbahQ1LrD2jQWpemlnflhf25RAv/5ED22u+w0F4M9U92RmHlM3cJrJyDHEui\n"
+ "6EAIFmA+MUeCo4wRGg5KHx8zIWjjo2O1VN+QyfOsBUdnycPojTNsL/Y1tPl8b9Yj\n"
+ "XIl9EK9Uo5x5U6pmWGQSgzhTnY9ii0s2SYQcJSoT0/SlTVL+/nT9k/XK5VmBcpIs\n"
+ "xxeL8yO3uu9r1uwzBggRV+9HD89er7oqC3m+xQo86+izpiPYMneVC8R1Ukr/h3zC\n"
+ "i3G5pUIE4TMrdPe3jL7c5VeA/97NUW8gZJPlP8yj9FQ+2SPg3ddJ1tPtpn2KirVw\n"
+ "XPezfB6cGoZAIRd6aPhXZsOYuuY9MJMDVEphoEBy5e9C7uy9s/vekZ87qSSS+9s5\n"
+ "xC404z0YXvE9WY8Ar+Pz0jR1ZL343DlgfWGmiPVolWoyQQsmkhXUBF1fMdYriOTQ\n"
+ "GiiuDJvh3+bsYKwdihnzFN74eeO+Qdq+ewacfJaSUwwV5yS5l1SFemjMns2b8swy\n"
+ "banq7DgcMRg6PauDb4nHm7zTmruEr02fMuLw+uzSToeHWd9LWx4tmhhOJ6lYO3B2\n"
+ "XW2ebYPDtYGVoYv1QybZmcCE9dwh2Hdu0GLD9fYB7/DAV0rsKEdWYbf+xNrq6ngo\n"
+ "mKI3tpvJtlLMduW0JA==\n"
+ "-----END CERTIFICATE-----\n";


var ab2Base64 = function(arrayBuffer) {
  var base64    = "";
  var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder
  var a, b, c, d
  var chunk
  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1
    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }
  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]
    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1
    base64 += encodings[a] + encodings[b] + "=="
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4
    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
    base64 += encodings[a] + encodings[b] + encodings[c] + "="
  }
  return base64
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
var base642Ab = function(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++ ) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
describe("Certificate suite", function() {
  describe("Certificate generation", function() {
    beforeEach(function(){
      jasmine.getEnv().defaultTimeoutInterval = 100000;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    })
    it("should be able to generate a certificate", function(done) {
      Key.generatePair("SHA-256")
        .then(function(keys){
          Certificate.create(record, keys).then(function(cert){
            certSample = cert;
            expect(cert.certData[0].issuer.attributes[0].value).toBe("blankon.in");
            expect(cert.certData[0].issuer.attributes[1].value).toBe("ID");
            expect(cert.certData[0].issuer.attributes[2].value).toBe("Jabodetabek");
            expect(cert.certData[0].issuer.attributes[3].value).toBe("Bojong");
            expect(cert.certData[0].issuer.attributes[4].value).toBe("Uji coba");
            expect(cert.certData[0].issuer.attributes[5].value).toBe("Uji coba");
            expect(cert.certData[0].subject.attributes[0].value).toBe("blankon.in");
            expect(cert.certData[0].subject.attributes[1].value).toBe("ID");
            expect(cert.certData[0].subject.attributes[2].value).toBe("Jabodetabek");
            expect(cert.certData[0].subject.attributes[3].value).toBe("Bojong");
            expect(cert.certData[0].subject.attributes[4].value).toBe("Uji coba");
            expect(cert.certData[0].subject.attributes[5].value).toBe("Uji coba");
            done();
          })
          .catch(function(err){
            if (err) {
              console.log(err.message);
            }
            expect(1).toBe(2);
            done();
          })
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to generate a certificate without specific Date", function(done) {
      Key.generatePair("SHA-256")
        .then(function(keys){
          Certificate.create(recordWithoutDate, keys).then(function(cert){
            expect(cert.certData[0].issuer.attributes[0].value).toBe("blankon.in");
            expect(cert.certData[0].issuer.attributes[1].value).toBe("ID");
            expect(cert.certData[0].issuer.attributes[2].value).toBe("Jabodetabek");
            expect(cert.certData[0].issuer.attributes[3].value).toBe("Bojong");
            expect(cert.certData[0].issuer.attributes[4].value).toBe("Uji coba");
            expect(cert.certData[0].issuer.attributes[5].value).toBe("Uji coba");
            expect(cert.certData[0].subject.attributes[0].value).toBe("blankon.in");
            expect(cert.certData[0].subject.attributes[1].value).toBe("ID");
            expect(cert.certData[0].subject.attributes[2].value).toBe("Jabodetabek");
            expect(cert.certData[0].subject.attributes[3].value).toBe("Bojong");
            expect(cert.certData[0].subject.attributes[4].value).toBe("Uji coba");
            expect(cert.certData[0].subject.attributes[5].value).toBe("Uji coba");
            done();
          })
          .catch(function(err){
            if (err) {
              console.log(err.message);
            }
            expect(1).toBe(2);
            done();
          })
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to generate a certificate request", function(done) {
      Key.generatePair("SHA-256")
        .then(function(keys){
          Certificate.createRequest(subject, keys, "katasandi").then(function(cert1){
            csrSample = cert1;
            expect(cert1.certData[0].subject.attributes[0].value).toBe("blankon.in");
            expect(cert1.certData[0].subject.attributes[1].value).toBe("ID");
            expect(cert1.certData[0].subject.attributes[2].value).toBe("Jabodetabek");
            expect(cert1.certData[0].subject.attributes[3].value).toBe("Bojong");
            expect(cert1.certData[0].subject.attributes[4].value).toBe("Uji coba");
            expect(cert1.certData[0].subject.attributes[5].value).toBe("Uji coba");
            expect(cert1.certData[0].attributes[0].name).toBe("challengePassword");
            expect(cert1.certData[0].attributes[0].value).toBe("katasandi");
            done();
          });
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to convert certificate to Pem", function(done) {
      certSample.toPEM().then(function(pem){
        var arr = pem.split("-----");
        expect(arr[1]).toEqual("BEGIN CERTIFICATE");
        expect(arr[3]).toEqual("END CERTIFICATE");
        done();
      })
      .catch(function(err){
        if (err) {
          console.log(err.message);
        }
        expect(1).toBe(2);
        done();
      })
    });
    it("should be able to convert certification request to pem", function(done) {
      csrSample.toPEM().then(function(pem){
        var arr = pem.split("-----");
        expect(arr[1]).toEqual("BEGIN CERTIFICATE REQUEST");
        expect(arr[3]).toEqual("END CERTIFICATE REQUEST");
        done();
      })
      .catch(function(err){
        if (err) {
          console.log(err.message);
        }
        expect(1).toBe(2);
        done();
      })
    });
    it("should be able to get issuer from a certificate", function(done) {
      certSample.getIssuer()
        .then(function(issuer){
          expect(issuer.commonName).toBe("blankon.in");
          expect(issuer.countryName).toBe("ID");
          expect(issuer.stateOrProvinceName).toBe("Jabodetabek");
          expect(issuer.localityName).toBe("Bojong");
          expect(issuer.organizationName).toBe("Uji coba");
          expect(issuer.organizationalUnitName).toBe("Uji coba");
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to get subject from a certificate", function(done) {
      certSample.getSubject()
        .then(function(subject){
          expect(subject.commonName).toBe("blankon.in");
          expect(subject.countryName).toBe("ID");
          expect(subject.stateOrProvinceName).toBe("Jabodetabek");
          expect(subject.localityName).toBe("Bojong");
          expect(subject.organizationName).toBe("Uji coba");
          expect(subject.organizationalUnitName).toBe("Uji coba");
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to get version number from a certificate", function(done) {
      certSample.getVersionNumber()
        .then(function(vn){
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to get serial number from a certificate", function(done) {
      certSample.getSerialNumber()
        .then(function(sn){
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to get publicKey algorithm from a certificate", function(done) {
      certSample.getPublicKeyAlgorithm()
        .then(function(alg){
          expect(alg).toBe("sha1WithRSAEncryption");
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to get publicKey from a certificate", function(done) {
      certSample.getPublicKey()
        .then(function(publicKey){
          var arr = publicKey.split("-----");
          expect(arr[1]).toEqual("BEGIN PUBLIC KEY");
          expect(arr[3]).toEqual("END PUBLIC KEY");
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to convert a p12 array buffer to p12 container object", function(done) {
      var newCert = new Certificate();
      var data = base642Ab(p12Base64);
      newCert.parseP12(data, "password")
        .then(function(result){
          expect(result.privateKey.substr(0, 31)).toBe("-----BEGIN RSA PRIVATE KEY-----");
          Key.parsePEM(result.privateKey, "SHA-256")
            .then(function(privateKey){
              expect(result.certificate.certData[0].subject.attributes[0].value).toBe("blankon.in");
              expect(result.certificate.certData[0].subject.attributes[1].value).toBe("ID");
              expect(result.certificate.certData[0].subject.attributes[2].value).toBe("Jabodetabek");
              expect(result.certificate.certData[0].subject.attributes[3].value).toBe("Republik Bojong");
              expect(result.certificate.certData[0].subject.attributes[4].value).toBe("Test");
              expect(result.certificate.certData[0].subject.attributes[5].value).toBe("Test");
              Key.parsePEM(result.privateKey, "SHA-256")
                .then(function(privateKey){
                  string2Ab("hello world", function(dataToBeSigned){
                    privateKey.sign(dataToBeSigned)
                      .then(function(sig){
                        expect(sig).toBeDefined();
                        done();
                      })
                      .catch(function(err){
                        console.log(err.message);
                        expect(1).toBe(2);
                        done();
                      })
                    })
                })
                .catch(function(err){
                  console.log(err.message);
                  expect(1).toBe(2);
                  done();
                })
            })
            .catch(function(err){
              expect(1).toBe(2);
              done();
            })
        })
        .catch(function(err){
          console.log(err.message);
          expect(1).toBe(2);
          done();
        })
    })
    it("should be able to convert a p12 version of openSSL, from array buffer to p12 container object", function(done) {
      var newCert = new Certificate();
      var data = base642Ab(p12OpenSSLBase64);
      newCert.parseP12(data, "homhai")
        .then(function(result){
          expect(result.privateKey.substr(0, 31)).toBe("-----BEGIN RSA PRIVATE KEY-----");
          Key.parsePEM(result.privateKey, "SHA-256")
            .then(function(privateKey){
              expect(result.certificate.certData[0].subject.attributes[0].value).toBe("ID");
              expect(result.certificate.certData[0].subject.attributes[1].value).toBe("Depok");
              expect(result.certificate.certData[0].subject.attributes[2].value).toBe("Depok");
              expect(result.certificate.certData[0].subject.attributes[3].value).toBe("Depok Baru");
              expect(result.certificate.certData[0].subject.attributes[4].value).toBe("Simpangan Depok");
              expect(result.certificate.certData[0].subject.attributes[5].value).toBe("Cimanggis");
              Key.parsePEM(result.privateKey, "SHA-256")
                .then(function(privateKey){
                  string2Ab("hello world", function(dataToBeSigned){
                    privateKey.sign(dataToBeSigned)
                      .then(function(sig){
                        expect(sig).toBeDefined();
                        done();
                      })
                      .catch(function(err){
                        console.log(err.message);
                        expect(1).toBe(2);
                        done();
                      })
                    })
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
        })
        .catch(function(err){
          console.log(err.message);
          expect(1).toBe(2);
          done();
        })
    })
    it("should be able to convert certificate from Pem", function(done) {
      var cert = new Certificate();
      cert.parsePEM(certPemSample)
        .then(function(cert){
          expect(cert).toBeDefined();
          expect(cert.certData.length).toEqual(1);
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to convert certificate from bundled Pem (3 certificate)", function(done) {
      var cert = new Certificate();
      cert.parsePEM(bundledPEM)
        .then(function(cert){
          expect(cert).toBeDefined();
          expect(cert.certData.length).toEqual(3);
          certChainSample = cert;
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to convert certificate request from Pem", function(done) {
      var cert2 = new Certificate();
      cert2.parsePEM(csrPemSample)
        .then(function(cert){
          expect(cert).toBeDefined();
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should failed to convert an invalid certificate", function(done) {
      var cert = new Certificate();
      cert.parsePEM(invalidCertSample)
        .then(function(cert){
          expect(1).toBe(2);
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          done();
        })
    });
    it("should be able to get revocation list from a crl file", function(done) {
      Certificate.getRevocationList(base642Ab(crlBase64Sample))
        .then(function(obj){
          expect(obj[0]).toBe("1001");
          expect(obj[1]).toBe("1003");
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(err).not.toExist();
          done();
        })
    });
    it("should be able to convert a certificate to p12", function(done) {
      certSample.toP12(privateKeyPEM, "katasandi")
        .then(function(result){
          expect(result).toBeDefined();
          p12Sample = result;
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should fail to convert a certificate to p12 because of invalid parameter : privateKey", function(done) {
      var invalidPem = "some string";
      certSample.toP12(invalidPem, "katasandi")
        .then(function(result){
          expect(1).toBe(2);
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          done();
        })
    });
    it("should fail to convert a certificate to p12 because of invalid parameter : password", function(done) {
      var invalidPem = "some string";
      certSample.toP12(privateKeyPEM)
        .then(function(result){
          expect(1).toBe(2);
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          done();
        })
    });
    it("should be able to check validity of a certificate", function(done) {
      certSample.validate()
        .then(function(result){
          expect(result.isValid).toBe(true);
          expect(result.isTrusted).toBe(false);
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to check validity of certificate chain (1)", function(done) {
      certChainSample.validate()
        .then(function(result){
          expect(result.isValid).toBe(true);
          expect(result.isTrusted).toBe(true);
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err);
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be fail to validate certificate chain because of empty certChain", function(done) {
      var emptyCert = new Certificate();
      emptyCert.validate()
        .then(function(result){
          expect(1).toBe(2);
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          done();
        })
    });
    it("should be fail to validate certificate chain because of broken path", function(done) {
      brokenPath.certData[0] = certChainSample.certData[1];
      brokenPath.certData[1] = certChainSample.certData[0];
      brokenPath.certData[2] = certChainSample.certData[2];

      brokenPath.validate()
        .then(function(result){
          expect(result.isValid).toBe(true);
          expect(result.isTrusted).toBe(false);
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should trust a certificate chain", function(done) {
      var certs = new Certificate();
      certs.parsePEM(certChainSample);
      var certChain = certs.certData;
      certChainSample.validate()
        .then(function(result){
          expect(result.isValid).toBe(true);
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to check validity of certificate chain (2)", function(done) {
      certChainSample.validate()
        .then(function(result){
          expect(result.isValid).toBe(true);
          done();
        })
        .catch(function(err){
          console.log(err);
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to check validity of certificate chain that does not have top self-signed", function(done) {
      var certs = new Certificate();
      certs.parsePEM(bundledPEM)
        .then(function(certs){
          var certChain = certs.certData;
          var certChainIntermediate = new Certificate();
          certChainIntermediate.certData[0] = certChain[0];
          certChainIntermediate.validate()
            .then(function(result){
              expect(result.isValid).toBe(true);
              done();
            })
            .catch(function(err){
              if (err) {
                console.log(err.message);
              }
              expect(1).toBe(2);
              done();
            })
        
        })
    });
    it("should trust a certificate chain", function(done) {
      var certs = new Certificate();
      certs.parsePEM(bundledPEM)
        .then(function(certs){
          var certChain = certs.certData;
          Certificate.trust(certChain)
            .then(function(result){
              expect(result.isValid).toBe(true);
              expect(Object.keys(window.PKIWebSDK.private.caStore.certs).length).toEqual(3);
              done();
            })
            .catch(function(err){
              if (err) {
                console.log(err.message);
              }
              expect(1).toBe(2);
              done();
            })
        })
    });
    it("should fail trust a certificate chain because of broken path in certificate chain", function(done) {
      var certs = new Certificate();
      certs.parsePEM(bundledPEM)
        .then(function(certs){
          var brokenPath = new Certificate();
          brokenPath.certData[0] = certs.certData[1];
          brokenPath.certData[1] = certs.certData[0];
          brokenPath.certData[2] = certs.certData[2];
          Certificate.trust(brokenPath.certData)
            .then(function(result){
              expect(result.isValid).toBe(true);
              expect(result.isTrusted).toBe(false);
              done();
            })
            .catch(function(err){
              if (err) {
                console.log(err.message);
              }
              expect(1).toBe(2);
              done();
            })
        })
    });
    it("should get signature from a certificate", function(done) {
      certSample.getSignature()
        .then(function(signature){
          expect(signature).toBeDefined();
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should get key usage from a certificate", function(done) {
      certSample.getUsage()
        .then(function(usage){
          //  ['keyCertSign', 'digitalSignature', 'nonRepudiation', 'keyEncipherment', 'dataEncipherment', 'serverAuth', 'clientAuth', 'codeSigning', 'emailProtection', 'timeStamping']
          expect(usage.length).toEqual(10);
          expect(usage.indexOf("keyCertSign")>=0).toBeTruthy();
          done();
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
    it("should be able to check validity of a certificate, return false because of expired date", function(done) {
      Key.generatePair("SHA-256")
        .then(function(expiredKeys){
          Certificate.create(recordExpired, expiredKeys).then(function(expiredCert){
            expect(expiredCert.certData[0].issuer.attributes[0].value).toBe("blankon.in");
            expect(expiredCert.certData[0].issuer.attributes[1].value).toBe("ID");
            expect(expiredCert.certData[0].issuer.attributes[2].value).toBe("Jabodetabek");
            expect(expiredCert.certData[0].issuer.attributes[3].value).toBe("Bojong");
            expect(expiredCert.certData[0].issuer.attributes[4].value).toBe("Uji coba");
            expect(expiredCert.certData[0].issuer.attributes[5].value).toBe("Uji coba");
            expect(expiredCert.certData[0].subject.attributes[0].value).toBe("blankon.in");
            expect(expiredCert.certData[0].subject.attributes[1].value).toBe("ID");
            expect(expiredCert.certData[0].subject.attributes[2].value).toBe("Jabodetabek");
            expect(expiredCert.certData[0].subject.attributes[3].value).toBe("Bojong");
            expect(expiredCert.certData[0].subject.attributes[4].value).toBe("Uji coba");
            expect(expiredCert.certData[0].subject.attributes[5].value).toBe("Uji coba");
            expiredCert.validate()
              .then(function(result){
                expect(result.isValid).toBe(false);
                done();
              })
              .catch(function(err){
                if (err) {
                  console.log(err.message);
                }
                expect(1).toBe(2);
                done();
              })
          })
          .catch(function(err){
            if (err) {
              console.log(err.message);
            }
            expect(1).toBe(2);
            done();
          })
        })
        .catch(function(err){
          if (err) {
            console.log(err.message);
          }
          expect(1).toBe(2);
          done();
        })
    });
/*
*/
  });
});
