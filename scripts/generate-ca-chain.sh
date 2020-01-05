#!/bin/bash
rm -rf /tmp/ca
echo ""
echo "========================ROOT CERTIFICATE AUTHORITY========================"
echo ""
mkdir /tmp/ca
pushd /tmp/ca
mkdir -p certs crl newcerts private
touch index.txt
touch index.txt.attr
echo 1000 > serial
wget https://gist.githubusercontent.com/herpiko/e949a99864014759cb29e9d42aa15301/raw/a5d7365860d4cc8a400faad5d1da8c172a78e5e6/openssl.cnf
openssl genrsa -aes256 -out private/ca.key.pem 4096
openssl req -config openssl.cnf -key private/ca.key.pem -new -x509 -days 7300 -sha256 -extensions v3_ca -out certs/ca.cert.pem
openssl x509 -noout -text -in certs/ca.cert.pem
popd
echo ""
echo "========================INTERMEDIATE CERTIFICATE AUTHORITY========================"
echo ""
mkdir /tmp/ca/intermediate
pushd /tmp/ca/intermediate
mkdir -p certs crl csr newcerts private
touch index.txt
echo 1000 > serial
wget https://gist.githubusercontent.com/herpiko/8064026087a87ed0a26fa26796d3059f/raw/c306ae6e985287ee9d1b37ef781c435dea562bf2/openssl.cnf
popd
pushd /tmp/ca
openssl genrsa -aes256 -out intermediate/private/intermediate.key.pem 4096
openssl req -config intermediate/openssl.cnf -new -sha256 -key intermediate/private/intermediate.key.pem -out intermediate/csr/intermediate.csr.pem
openssl ca -config openssl.cnf -extensions v3_intermediate_ca -days 3650 -notext -md sha256 -in intermediate/csr/intermediate.csr.pem -out intermediate/certs/intermediate.cert.pem
openssl x509 -noout -text -in intermediate/certs/intermediate.cert.pem
cat intermediate/certs/intermediate.cert.pem certs/ca.cert.pem > intermediate/certs/ca-chain.cert.pem
echo ""
echo "========================ENTITY CERTIFICATE========================"
echo ""
openssl genrsa -aes256 -out intermediate/private/pkiwebsdk-entity-1.key.pem 2048
openssl req -config intermediate/openssl.cnf -key intermediate/private/pkiwebsdk-entity-1.key.pem -new -sha256 -out intermediate/csr/pkiwebsdk-entity-1.csr.pem
openssl ca -config intermediate/openssl.cnf -extensions server_cert -days 375 -notext -md sha256 -in intermediate/csr/pkiwebsdk-entity-1.csr.pem -out intermediate/certs/pkiwebsdk-entity-1.cert.pem
openssl x509 -noout -text -in intermediate/certs/pkiwebsdk-entity-1.cert.pem
popd
