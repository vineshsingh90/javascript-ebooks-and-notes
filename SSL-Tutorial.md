# SSL tutorial

*For both web and email certificates*.

There are two options to create SSL certificates: signed and self-signed, but
in general none of those would be recognized by the browser or email client.
However we can add the certificate authority to the list of trusted authorities
(in browser or email settings) and make them recognize subsequent certificates
signed by our CA.

Note: Email requires certificates in PKCS12 format (see below).

**Step 1**: Create CA (Certificate Authority):
```
openssl req -x509 -new -nodes -days 365 -keyout ./certs/ca.key -out ./certs/ca.crt \
-subj "/C=PL/ST=Mazovia/L=Warsaw/O=Mithy CA/CN=Mithy CA"
```
This options would create the CA alongside with its key. There are examples on
the internet to create the key first, but I prefer one-liners.

`-nodes` stands for "no DES", which means leave the key on the disc
unencrypted.

`-days` sets the expiration period in days.

If you omit the `-subj` option the command utility will ask you to provide thos
values, but this is good for automation.

**Step 2**: Create CSR (Certificate Signing Request):
```
openssl req -new -nodes -keyout ./certs/local.key -out ./certs/local.csr \
 -subj "/C=PL/ST=Mazovia/L=Warsaw/O=Mithy org/CN=themithy/emailAddress=themithy@example.com"
```
Note: For web certificate fill the *CN* field with domain name.

Note 2: For email certificate fill the *emailAddress* field with correct email.

In real world the CSR would be now sent to a recognized CA (one of those listed
by default in your browser or operating system), but for the purpose of this
tutorial we sign it by ourselves.

**Step 3**: Sign CSR with CA:
```
openssl x509 -req -days 365 -in ./certs/local.csr -CA ./certs/ca.crt -CAkey ./certs/ca.key -CAcreateserial -out ./certs/local.crt
```

For web certificate you are ready now, just upload certificates to you web
server. For email certificate there is one last step below.

Remember to add the CA to the list of trusted authorities in the browser.

**Step 4**: Convert certificate to PKCS12 (email only):
```
openssl pkcs12 -export -out ./certs/local.p12 -inkey ./certs/local.key -in ./certs/local.crt
```

Nowadays if you want to aim for secure email communication you have to get your
friends involved. Create one CA which everyone should add to their email
program.  Then create and sign certificates for each party. Make sure you trust
the admin holding the CA, however while he will be able to fake certificates,
he would not be able to decrypt existing communication (this applies to trusted
CA's too). This is off course only possible with a offline email program.

---

You can generate web certificate using this one-liner, but you would
have accept such certificate per each case.

**Option**: Create self-signed cert (skip all previous steps):
```
openssl req -x509 -new -nodes -keyout ./certs/local.key -out ./certs/local.crt \
-subj "/C=PL/ST=Mazovia/L=Warsaw/O=Mithy org/CN=localhost"
```
Note: This example does not involve creating either the CSR or CA.

View certificate:
```
openssl x509 -in ./certs/local.crt -noout -text
```

Bonus: Generate random password:
```
openssl rand -base64 32
```
