import {IonKey, IonPublicKeyPurpose, IonRequest} from "@decentralized-identity/ion-sdk";
import {AxiosResponse} from "axios";
import {operationApi} from "../api";
import {DIDRecord} from "../models/types";

export async function createDid(didCount: number = 1): Promise<DIDRecord[]> {
    console.log(`generating ${didCount} dids.\n`)
    const didRecords = [] as DIDRecord[];
    for (let i = 0; i < didCount; i++) {
        console.log(`generate for id ${i} \n`);
        let updateKeyPair = await IonKey.generateEs256kOperationKeyPair();
        let recoverKeyPair = await IonKey.generateEs256kOperationKeyPair();
        const input = {
            recoveryKey: recoverKeyPair[0],
            updateKey: updateKeyPair[0],
            document: {
                publicKeys: [
                    {
                        id: "updateKeyId1",
                        type: "EcdsaSecp256k1VerificationKey2019",
                        publicKeyJwk: updateKeyPair[0],
                        purposes: [IonPublicKeyPurpose.Authentication],
                    },
                ],
                services: [
                    {
                        id: "local-node",
                        type: "local-type",
                        serviceEndpoint: "http://localhost:3000"
                    },
                ],
            },
        };

        let requestBody = IonRequest.createCreateRequest(input);
        const didRecord = await operationApi(requestBody).then((response: AxiosResponse) => {
            console.log(response.status);
            if (response.status == 200) {
                let did = response.data.didDocument.id;
                const testPrefix = "test:"
                console.log(did);
                return {
                    did: did,
                    didSuffix: did.substr(did.indexOf(testPrefix) + testPrefix.length),
                    update: {privateKey: updateKeyPair[1], publicKey: updateKeyPair[0]},
                    recover: {privateKey: recoverKeyPair[1], publicKey: recoverKeyPair[0]},
                    isActive: true,
                    createdAt: new Date().toLocaleString(),
                    updatedAt: new Date().toLocaleString()
                } as DIDRecord;
            } else {
                console.log(JSON.stringify(response.data) + '\n');
                return null;
            }
        });

        if (didRecords !== null) {
            didRecords.push(didRecord as DIDRecord);
        }
    }

    return didRecords;
}