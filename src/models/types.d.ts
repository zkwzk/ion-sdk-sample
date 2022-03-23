import IonCreateRequestModel from "@decentralized-identity/ion-sdk/dist/lib/models/IonCreateRequestModel";
import IonUpdateRequestModel from "@decentralized-identity/ion-sdk/dist/lib/models/IonUpdateRequestModel";
import IonRecoverRequestModel from "@decentralized-identity/ion-sdk/dist/lib/models/IonRecoverRequestModel";
import IonDeactivateRequestModel from "@decentralized-identity/ion-sdk/dist/lib/models/IonDeactivateRequestModel";
import {JwkEs256k} from "@decentralized-identity/ion-sdk";

export type DIDRecord = {
    did: string;
    didSuffix: string;
    update: {
        publicKey: JwkEs256k;
        privateKey: JwkEs256k;
    };
    recover: {
        privateKey: JwkEs256k;
        publicKey: JwkEs256k;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type OperationRequest =
    IonCreateRequestModel
    | IonUpdateRequestModel
    | IonRecoverRequestModel
    | IonDeactivateRequestModel;