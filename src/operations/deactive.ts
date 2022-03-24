import {IonRequest, LocalSigner} from '@decentralized-identity/ion-sdk';
import {operationApi} from '../api';
import {AxiosResponse} from 'axios';
import {DIDRecord} from '../models/types';

export async function deactivateDid(did: string, originDidRecord: DIDRecord): Promise<DIDRecord> {
    let deactivateRequest = await IonRequest.createDeactivateRequest(
        {
            didSuffix: originDidRecord.didSuffix,
            recoveryPublicKey: originDidRecord.recover.publicKey,
            signer: LocalSigner.create(originDidRecord.recover.privateKey),
        }
    )

    console.log(JSON.stringify(deactivateRequest));

    let result: DIDRecord = originDidRecord;
    await operationApi(deactivateRequest).then((response: AxiosResponse) => {
        console.log(response.status);
        if (response.status === 200) {
            console.log(JSON.stringify(response.data));
            result = {
                ...originDidRecord,
                docKeys: [],
                isActive: false,
                updatedAt: new Date().toLocaleString()
            }
        }
    });

    return result;
}