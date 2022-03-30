import {DIDRecord} from '../models/types';
import {IonKey, IonPublicKeyPurpose, IonRequest, LocalSigner} from '@decentralized-identity/ion-sdk';
import {operationApi} from '../api';
import {AxiosResponse} from 'axios';
import {v4 as uuidv4} from 'uuid';

export async function recoverDid(did: string, originDidRecord: DIDRecord): Promise<DIDRecord> {
    const docKeyPair = await IonKey.generateEs256kDidDocumentKeyPair({
        id: `r-${uuidv4()}`,
        purposes: [IonPublicKeyPurpose.Authentication]
    });
    const nextUpdateKeyPair = await IonKey.generateEs256kOperationKeyPair();
    const nextRecoverKeyPair = await IonKey.generateEs256kOperationKeyPair();

    let recoverRequest = await IonRequest.createRecoverRequest(
        {
            didSuffix: originDidRecord.didSuffix,
            recoveryPublicKey: originDidRecord.recover.publicKey,
            signer: LocalSigner.create(originDidRecord.recover.privateKey),
            nextRecoveryPublicKey: nextRecoverKeyPair[0],
            nextUpdatePublicKey: nextUpdateKeyPair[0],
            document: {
                publicKeys: [
                    docKeyPair[0]
                ],
                services: [
                    {
                        id: 'local-node-recover',
                        type: 'website',
                        serviceEndpoint: 'http://localhost:3000'
                    },
                ],
            },
        }
    )

    console.log(JSON.stringify(recoverRequest));

    let result: DIDRecord = originDidRecord;
    await operationApi(recoverRequest).then((response: AxiosResponse) => {
        console.log(response.status);
        if (response.status === 200) {
            console.log(JSON.stringify(response.data));
            result = {
                ...originDidRecord,
                docKeys: [
                    {
                        id: docKeyPair[0].id,
                        type: docKeyPair[0].type,
                        purpose: docKeyPair[0].purposes,
                        privateKey: docKeyPair[1],
                        publicKey: docKeyPair[0].publicKeyJwk
                    }
                ],
                isActive: true,
                updatedAt: new Date().toISOString(),
                update: {
                    publicKey: nextUpdateKeyPair[0],
                    privateKey: nextUpdateKeyPair[1]
                },
                recover: {
                    publicKey: nextRecoverKeyPair[0],
                    privateKey: nextRecoverKeyPair[1]
                }
            }
        }
    });

    return result;
}