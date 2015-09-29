## Example Usage

### Generate Pair

- Open example/generate.html.
- Enter a valid hash algorithm string (ex: SHA-256) then click "generate".
- You should receive two key in PEM format, private key and public key. Keep these two keys. You may save them on different file.

### Sign

- Prepare a file to be signed. For example, a hello.text that containts "hello world".
- In new tab, open example/sign.html.
- Choose the hello.txt file.
- Copy the private key from example/generate.html and paste in the textarea input.
- Click "sign".
- You should receive a signature.txt file that contains the signature.

### Verify

- Open example/verify.html.
- Choose the signature.txt file as "Signature" and hello.txt file as "Data".
- Copy the public key from example/generate.html and paste in the textarea input.
- Click "verify".
- You should alerted about whether the signature is valid or not.
- You may try again with modified hello.txt file or different file and expecting invalid result.

### Encrypt
- Prepare a file to be decrypted. The file size should less than or eiqual to the modulus k-11 octets. 245 byte for 2048 bit key or 501 byte for 4096 bit key.
- Open example/key/encrypt-decrypt.html.
- On ``Encrypt`` section, paste public key PEM to the textarea input.
- Then choose the prepared file
- Click ``Encrypt`` button. You should receive an encrypted file

### Decrypt
- Open example/key/encrypt-decrypt.html.
- On ``Decrypt`` section, paste the private key (the pair of public key that used to encrypt the original file) to the text area input.
- Choose an encrypted file, then click ``Decrypt`` button.
- You should receive a decrypted file which is same as the original file.

## OpenSSL Compatibility Check

### PKI-WebSDK -> OpenSSL

#### Generate, Sign, Verify

- You have already sign a file using PKI-WebSDK. Now you have : key pair, hello.txt, signature.txt

<pre>
$ ls
private.pem     public.pem     hello.txt     signature.txt
</pre>

- Now in the terminal, check if the private key is readable for openSSL

<pre>
$ openssl rsa -in private.pem -text -noout
</pre>

The commands should return some string in hexa like this :

<pre>
Private-Key: (2048 bit)
modulus:
    00:cb:ce:c4:66:0d:49:bf:c9:9c:4c:3f:6e:eb:85:
    db:16:f9:64:a8:10:58:93:cf:fe:fb:eb:28:8a:24:
    44:98:66:52:0f:ba:a3:00:39:1a:74:db:8e:c8:bf:
    f2:a0:c3:a9:1f:ea:72:a8:46:6d:17:da:44:46:18:
    a2:c1:36:21:9d:f3:24:02:3f:d8:71:4d:79:fa:03:
    15:c0:24:bd:bf:d9:f5:a4:2a:62:c7:61:ac:64:1b:
    db:67:ef:9d:5b:b7:42:60 ...
</pre>

- Verify the signature by using openSSL

<pre>
$ openssl rsa -in private.pem -pubout -out public-by-openssl.pem
$ openssl dgst -verify public-by-openssl.pem -signature signature.txt hello.txt
Verified OK
</pre>

- You may extract RSA public key from private.pem using openSSL and compare it to the original public.pem from PKI-WebSDK.

<pre>
$ openssl rsa -in private.pem -RSAPublicKey_out -out public-by-openssl-rsa.pem
</pre>

Then compare public.pem and public-by-openssl-rsa.pem, apart from their header and footer.

#### Encrypt & Decrypt

### OpenSSL -> PKI-WebSDK

#### Generate, Sign, Verify

- Remove the existing key and signature. You only have hello.txt to be signed.
- Generate RSA private key using openSSL

<pre>
$ openssl genrsa -out private.pem 2048
</pre>

- Then extract the public key from it.

<pre>
$ openssl rsa -in priv.pem -RSAPublicKey_out -out public.pem
</pre>

- Now you have both private and public key. Open example/sign.html. Choose the hello.txt file and paste the private key in the provided textarea. Then, click "sign".
- You should receive a signature.txt file that contains the signature. Open example/verify.html, choose the signature.txt file as Signature and hello.txt file as Data. Paste the public key in the provided textarea. Then, click "verify".
- You should alerted that the signature is valid.

#### Encrypt & Decrypt
