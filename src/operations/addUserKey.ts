import {IonKey, IonPublicKeyPurpose, IonRequest, LocalSigner} from '@decentralized-identity/ion-sdk';
import IonPublicKeyModel from '@decentralized-identity/ion-sdk/lib/models/IonPublicKeyModel';
import {operationApi} from '../api';
import {AxiosResponse} from 'axios';
import {DIDRecord} from '../models/types';
import {v4 as uuidv4} from 'uuid';

export async function addUserKey(did: string, originDidRecord: DIDRecord): Promise<DIDRecord> {
    const newDocKey = await IonKey.generateEs256kDidDocumentKeyPair({
        id: `added-${uuidv4()}`,
        purposes: [IonPublicKeyPurpose.AssertionMethod]
    });

    const nextUpdateKeyPair = await IonKey.generateEs256kOperationKeyPair();
    let addUserKeyRequest = await IonRequest.createUpdateRequest(
        {
            didSuffix: originDidRecord.didSuffix,
            updatePublicKey: originDidRecord.update.publicKey,
            nextUpdatePublicKey: nextUpdateKeyPair[0],
            signer: LocalSigner.create(originDidRecord.update.privateKey),
            publicKeysToAdd: [
                newDocKey[0]
            ] as IonPublicKeyModel[]
        }
    )

    console.log(JSON.stringify(addUserKeyRequest));

    let result: DIDRecord = originDidRecord;
    await operationApi(addUserKeyRequest).then((response: AxiosResponse) => {
        console.log(response.status);
        if (response.status === 200) {
            console.log(JSON.stringify(response.data));
            result = {
                ...originDidRecord,
                updatedAt: new Date().toLocaleString(),
                update: {privateKey: nextUpdateKeyPair[1], publicKey: nextUpdateKeyPair[0]},
                docKeys: [
                    ...originDidRecord.docKeys,
                    {
                        id: newDocKey[0].id,
                        type: newDocKey[0].type,
                        purpose: newDocKey[0].purposes,
                        privateKey: newDocKey[1],
                        publicKey: newDocKey[0].publicKeyJwk
                    }]
            }
        }
    });

    return result;
}