# ION-SDK-TEST

This project is a command line tool which using the [ION-SDK](https://github.com/decentralized-identity/ion-sdk) to test the local sidetree node([ION node](https://github.com/decentralized-identity/ion) or [sidetreejs node](https://github.com/transmute-industries/sidetree.js)).

## Setup
```bash
npm install
```
change the `baseURL` and `operationURI` in the `api.ts` to the sidetree node endpoint, then build

### ION node(did:ion:test:)
```bash
npm run build:ion
```

### Sidetreejs(did:elem:) node
```bash
npm run build:elem
```
## Usage

```bash

npm start -- [operation] [extra param]
```

### create did
```bash
npm start -- create [count]
e.g. npm start -- create 1
```
 
it will save all the generated did in to `did.json` in the root folder of the project
### update did
```bash
npm start -- update [did]
e.g. npm start -- update did:ion:test:EiBoImStfIE3FVIsRM4L2CGGWTLrpiKMsxmKvk78-wdLDQ
```

it will look for the specific did from the `did.json`, and use the private key and public key under the `update` field to update the origin did,
it will add a service node `added-local-node` and a new public key to the did doc, and update the `updatedAt` field in the `did.json`

### deactivate did
```bash
npm start -- deactivate [did]
e.g. npm start -- deactivate did:ion:test:EiBoImStfIE3FVIsRM4L2CGGWTLrpiKMsxmKvk78-wdLDQ
```

it will look for the specific did from the `did.json`, and use the private key and public key under the `recover` field to deactivate the origin did

### recover did(seems not work now, created an [issue](https://github.com/decentralized-identity/ion-sdk/issues/24) at ION-SDK project)
```bash
npm start -- recover [did]
e.g. npm start -- recover did:ion:test:EiBoImStfIE3FVIsRM4L2CGGWTLrpiKMsxmKvk78-wdLDQ
```

it will look for the specific did from the `did.json`, and use the private key and public key under the `recover` field to recover the origin did