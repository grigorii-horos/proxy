# Simple HTTP Caching Proxy

## Generate ROOT certificate

```sh
npm i -g anyproxy
anyproxy-ca
```

## Import certificate to in Firefox

Open __Settings__ -> __Certificates__ -> __View Certificates__ -> __Authorites__ -> __Import__ -> Select `~/.anyproxy/certificates/rootCA.crt`

## Change Firefox Proxy

Open __Settings__ -> __Network Settings__ -> __Manual proxy configuration__

HTTP Proxy -> 127.0.0.1 10000

Also use this proxy for HTTPS -> Select

## Run Proxy

```sh
cd <repo>
node index.js
```

## Try to open some site in Firefox
