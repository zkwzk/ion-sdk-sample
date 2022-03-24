import {IonKey, IonPublicKeyPurpose, IonRequest, LocalSigner} from '@decentralized-identity/ion-sdk';
import IonPublicKeyModel from '@decentralized-identity/ion-sdk/lib/models/IonPublicKeyModel';
import {contants} from '../models/constants';
import IonServiceModel from '@decentralized-identity/ion-sdk/lib/models/IonServiceModel';
import {operationApi} from '../api';
import {AxiosResponse} from 'axios';
import {DIDRecord} from '../models/types';

export async function updateDid(did: string, originDidRecord: DIDRecord): Promise<DIDRecord> {
    const newDocKey = await IonKey.generateEs256kDidDocumentKeyPair({
        id: 'updateKeyId2',
        purposes: [IonPublicKeyPurpose.AssertionMethod]
    });
    let updateRequest = await IonRequest.createUpdateRequest(
        {
            didSuffix: originDidRecord.didSuffix,
            updatePublicKey: originDidRecord.update.publicKey,
            nextUpdatePublicKey: originDidRecord.update.publicKey,
            signer: LocalSigner.create(originDidRecord.update.privateKey),
            publicKeysToAdd: [
                newDocKey[0]
            ] as IonPublicKeyModel[],
            servicesToAdd: [
                contants.serviceToAdd
            ] as IonServiceModel[]
        }
    )

    console.log(JSON.stringify(updateRequest));

    let result: DIDRecord = originDidRecord;
    await operationApi(updateRequest).then((response: AxiosResponse) => {
        console.log(response.status);
        if (response.status === 200) {
            console.log(JSON.stringify(response.data));
            result = {
                ...originDidRecord,
                updatedAt: new Date().toLocaleString(),
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