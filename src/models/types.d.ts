import IonCreateRequestModel from '@decentralized-identity/ion-sdk/dist/lib/models/IonCreateRequestModel';
import IonUpdateRequestModel from '@decentralized-identity/ion-sdk/dist/lib/models/IonUpdateRequestModel';
import IonRecoverRequestModel from '@decentralized-identity/ion-sdk/dist/lib/models/IonRecoverRequestModel';
import IonDeactivateRequestModel from '@decentralized-identity/ion-sdk/dist/lib/models/IonDeactivateRequestModel';
import {JwkEs256k} from '@decentralized-identity/ion-sdk';

export type KeyPair = {
    publicKey: JwkEs256k;
    privateKey: JwkEs256k;
}

export type DocKeyPair = {
    id: string;
    type: string;
    publicKey: object;
    purpose?: string[];
    privateKey: JwkEs256k;
}

export type DIDRecord = {
    did: string;
    didSuffix: string;
    update: KeyPair;
    recover: KeyPair;
    docKeys: DocKeyPair[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type OperationRequest =
    IonCreateRequestModel
    | IonUpdateRequestModel
    | IonRecoverRequestModel
    | IonDeactivateRequestModel;