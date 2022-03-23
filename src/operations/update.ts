import {IonKey, IonPublicKeyPurpose, IonRequest, LocalSigner} from "@decentralized-identity/ion-sdk";
import IonPublicKeyModel from "@decentralized-identity/ion-sdk/lib/models/IonPublicKeyModel";
import {contants} from "../models/constants";
import IonServiceModel from "@decentralized-identity/ion-sdk/lib/models/IonServiceModel";
import {operationApi} from "../api";
import {AxiosResponse} from "axios";
import {DIDRecord} from "../models/types";

export async function updateDid(did: string, originDidRecord: DIDRecord): Promise<DIDRecord> {
    let nextUpdateKey = await IonKey.generateEs256kOperationKeyPair();
    let updateRequest = await IonRequest.createUpdateRequest(
        {
            didSuffix: originDidRecord.didSuffix,
            updatePublicKey: originDidRecord.update.publicKey,
            nextUpdatePublicKey: nextUpdateKey[0],
            signer: LocalSigner.create(originDidRecord.update.privateKey),
            publicKeysToAdd: [{
                id: "updateKeyId2",
                type: "EcdsaSecp256k1VerificationKey2019",
                publicKeyJwk: nextUpdateKey[0],
                purposes: [IonPublicKeyPurpose.AssertionMethod]
            }] as IonPublicKeyModel[],
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
                update: {publicKey: nextUpdateKey[0], privateKey: nextUpdateKey[1]},
                updatedAt: new Date().toLocaleString()
            }
        }
    });

    return result;
}