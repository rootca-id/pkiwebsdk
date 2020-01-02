PKI WebSDK is a JavaScript library to simplify programming PKI-aware applications in pure JavaScript. The library
is designed to create web based PKI application fully on the client side.

## Features:
* X509 Certificates: CSR, export/import (PEM/P12/DER), path verification, information query, CRL parsing
* RSA Keys: Pair generators, sign, verify, crypt, and decrypt
* Signed Data (PKCS#7): Signing and verification
* PDF signature: Signing and verification

## Requirements
* Modern web browser with WebCrypto features enabled. Please check http://caniuse.com/#search=cryptography
* NodeJS v10.x

## Usage

```
require('pkiwebsdk');

// Set your own CA store
const rootCA = '-----CERTIFICATE-----...';
const intermediateCA = '-----CERTIFICATE-----...';
window.PKIWebSDK.setCaStore([rootCA, intermediateCA]);
```

## License
GPLv3
