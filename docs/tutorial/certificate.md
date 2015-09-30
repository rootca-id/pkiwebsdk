## Example Usage

### Generate Certificate Request

- Open examples/certificate/index.html.
- In the ``Generate certificate request`` section, fill the requested subject information and a password to protect your CSR.
- Then click ``generatePairKey and create a certificate request`` button which would trigger action to generate a pair key then create a certificate using the gnerated pair key.
- On the ``Output``, a private key and a certificate, both in PEM format, should be printed in the textarea input.

### Import

Switch to ``Import`` section . This section performs functions to import various external data, such as P12 file, Certificate PEM file, CRL (both in DER and PEM format) and so on.

#### Parse a P12 file

-  Choose a P12 file.
- Fill the password to open the P12 container.
- Then click ``parse P12 to cert`` button.
- You should alerted by a popup that contains some certificate information from P12 container.

#### Parse a Certificate (PEM)

- Choose a certificate file in PEM format
- Click ``parse`` button.
- You should alerted by a popup that contains some certificate information.

#### Parse a CRL (in PEM or DER format)

- Choose a CRL file in PEM or DER format.
- Click ``parse`` button then you should alerted by a popup that presents revoked certificate's serial number.

#### Verify Cert Chain (PEM)

The PKIWebSDK has built-in CA Store, wich contains : PSrE Induk Indonesia and PSrE Intermediate Purwarupa Induk Indonesia. (see http://rootca.or.id). You could try this example by verify PSrE Kominfo certificate OR prepare a certificate chain that ends with root CA certificate.

- Choose the certificate(s). Add the bottom level certificate first.
- Then click ``Verify``.
- You should alerted by a popup that contains information whether the certificate chain is valid or not, and trusted or not.
- ``Trust`` should return same result as ``Verify`` with one additional functionality : if the certificate chain is trusted, add them to CA Store.

#### Get property of

This section provides functionalities to extract some information from a certificate, like subject, issuer, serial number, etc.

- Choose your certificate PEM file then click ``Parse`` button. You will be alerted by a popup if the certificate has been successfully parsed.
- Click a button from the button row bellow. You may try to get issuer information of the certificate, then click ``Get issuer`` button.

## OpenSSL Compatibility

