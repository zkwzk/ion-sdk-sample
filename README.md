# ION-SDK-TEST

this is a project which are testing the invocation of the ION node and ION-SDK.

## Setup
```bash
npm install

```
change the `baseURL` in the `api.ts` to the ion node endpoint, then build

```bash
npm run build
```
## Usage

```bash

npm start -- [operation] [extra param]
```

### create did
```bash
npm start -- start [count]
e.g. npm start -- start 1
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