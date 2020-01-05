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

var bundledPEM = "-----BEGIN CERTIFICATE-----\n" +
"MIIF+zCCA+OgAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwgY0xCzAJBgNVBAYTAklE\n" +
"MRAwDgYDVQQIDAdKYWthcnRhMRIwEAYDVQQKDAlQS0lXZWJTREsxEjAQBgNVBAsM\n" +
"CVBLSVdlYlNESzEiMCAGA1UEAwwZUEtJV2ViU0RLIEludGVybWVkaWF0ZSBDQTEg\n" +
"MB4GCSqGSIb3DQEJARYRcGtpd2Vic2RrQHJvb3QuY2EwHhcNMjAwMTAyMTY0MjAw\n" +
"WhcNMjEwMTExMTY0MjAwWjCBizELMAkGA1UEBhMCSUQxEDAOBgNVBAgMB0pha2Fy\n" +
"dGExEDAOBgNVBAcMB0pha2FydGExEjAQBgNVBAoMCVBLSVdlYlNESzESMBAGA1UE\n" +
"CwwJUEtJV2ViU0RLMRAwDgYDVQQDDAdIZXJwaWtvMR4wHAYJKoZIhvcNAQkBFg9o\n" +
"ZXJwaWtvQHJvb3QuY2EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDX\n" +
"8Deer3KiJ7yI3Z7kwr76MxrPbIRZ8VWzvQ0i7ZB4OKcTWuOmatv/IWquBKJu2LIP\n" +
"xqwJGpYfdpTqas/buTB5HTl7ysffmUfrAYoqnAhT8dbp3asLu/MaGzM3fDBhcdhH\n" +
"0sh/MBKWisNbyijiRdxy3qq2wuS8i6Y7cfZFllaCIr0rwaQ9/ZP+/xq+z/tedMga\n" +
"hgBZYT0/LNXCcxWjsjQfzKMyV38I32AKQQoHTA49hrojPYsmipC3c5ZgpIjING6k\n" +
"OX2IWvXajlpY0/MvhT4To+4Yi2SjmZDk2E8IYFuxnIc/YSLj8AYNrtYn1EKXe1tc\n" +
"B2E98NI3kdLcquTtK/qXAgMBAAGjggFjMIIBXzAJBgNVHRMEAjAAMBEGCWCGSAGG\n" +
"+EIBAQQEAwIGQDAzBglghkgBhvhCAQ0EJhYkT3BlblNTTCBHZW5lcmF0ZWQgU2Vy\n" +
"dmVyIENlcnRpZmljYXRlMB0GA1UdDgQWBBS3TVawAwCdaEqH5S14VEDfdruntDCB\n" +
"xQYDVR0jBIG9MIG6gBRAGvhT1GftY78gv3lnPRppYKzTyaGBnaSBmjCBlzELMAkG\n" +
"A1UEBhMCSUQxEDAOBgNVBAgMB0pha2FydGExEDAOBgNVBAcMB0pha2FydGExEjAQ\n" +
"BgNVBAoMCVBLSVdlYlNESzESMBAGA1UECwwJUEtJV2ViU0RLMRowGAYDVQQDDBFQ\n" +
"S0lXZWJTREsgUm9vdCBDQTEgMB4GCSqGSIb3DQEJARYRcGtpd2Vic2RrQHJvb3Qu\n" +
"Y2GCAhAAMA4GA1UdDwEB/wQEAwIFoDATBgNVHSUEDDAKBggrBgEFBQcDATANBgkq\n" +
"hkiG9w0BAQsFAAOCAgEAUPExRRVsnbwet0xU+V9L/NyFqydnQ+c8Oz2ZflLf8T/w\n" +
"emWYWmV6Ih+3ir8Zt7I92HOP1U2LwedlRybg+nDcoT+f0XquKvYkzO2Aha9RAjk2\n" +
"1I50E7yvLmK5YHUAIDfirUlyk8k6q/0/WAMSOBVdVw6HT7kDe5PQLfYNZu6b1mu1\n" +
"OxMN3QPm6HoclyEbl41h0rweXl60vA/TIHBO+9feKa1HGufyosnTsbHN1/zf/7MX\n" +
"nqqyBa/eViPKJyuikqt+C2rUIlTF1qN7YEJom0sxSw6mq2HWm87pFz4QHQcLcM+c\n" +
"88Q+Ys/KP/RDVwHA+/UqeQ/aiwQmgH+HMAe7BImlOPNsGconjlaLvEt+e4mOOQPG\n" +
"B4rWyuaQOSthv4hpbvtAPI1/BQPmiHzzon7IEuHrqSC/ovXnjrFDx6m7yzks+qpu\n" +
"070edUdkrskOd+sg2oH1v1jN28qDBUscosk0wmWGi08TcLziX3is+2kDUU8kJ3xY\n" +
"LhMpPlgFryjeyu/xlYYshTF8fsLM9m+ZD7ZnyDSo3W7dAbPuhCo9eFX3V+3Im2UV\n" +
"p0OHUwoKRMDpNHHw60dZTelI0TtIgQHlJ5dblTH2THsLxs5aZVW205fcKI+HlMK2\n" +
"5ErpOCGotNLPj9g/yN+pcoxUBa9E9vv8iAJTI3RpxDNeq7oiAedhWqZiFysHTqU=\n" +
"-----END CERTIFICATE-----\n" +
"-----BEGIN CERTIFICATE-----" +
"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\n" +
"7dSLlGaFjRV/N4zA\n" +
"-----END CERTIFICATE-----\n" +
"-----BEGIN CERTIFICATE-----\n" +
"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\n" +
"-----END CERTIFICATE-----\n"

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
  });
});
