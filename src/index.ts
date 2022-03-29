import {IonNetwork, IonSdkConfig,} from '@decentralized-identity/ion-sdk';
import {DIDRecord} from './models/types';
import {addUserKey, createDid, deactivateDid, recoverDid, updateDid} from './operations';
import {Operation} from './models/constants';

const fs = require('fs');

IonSdkConfig.network = IonNetwork.Testnet;

async function main(args: string[]) {
    const argv = args.slice(2);
    console.log(`input args ${argv[0]}, ${argv[1]}\n`);

    if (argv.length === 0) {
        console.log('please provide the operation.');
        return;
    }

    let jsonFilePath = 'did.json';
    if (!fs.existsSync(jsonFilePath)) {
        fs.appendFileSync(jsonFilePath, '[]');
    }

    const content = fs.readFileSync(jsonFilePath) || [] as DIDRecord[];
    let records = JSON.parse(content) as DIDRecord[];
    let originRecordIndex = -1;
    let originRecord: DIDRecord;
    const operation = argv[0] as string;

    switch (operation) {
        case Operation.create:
            let didCount = 1;
            if (!isNaN(parseFloat(argv[1]))) {
                didCount = parseFloat(argv[1]);
            }

            const didRecords = await createDid(didCount);
            records = records.concat(didRecords);
            console.log(records);
            break;
        case Operation.update:
            if (argv.length === 1) {
                console.log('please provide did');
                return;
            }

            originRecordIndex = records.findIndex(i => i.did === argv[1]);
            if (originRecordIndex === -1) {
                console.log('did not exist');
                return;
            }

            originRecord = records[originRecordIndex];
            const updatedRecord = await updateDid(originRecord.did, originRecord);
            records[originRecordIndex] = updatedRecord;
            break;
        case Operation.deactivate:
            if (argv.length === 1) {
                console.log('please provide did');
                return;
            }

            originRecordIndex = records.findIndex(i => i.did === argv[1]);
            if (originRecordIndex === -1) {
                console.log('did not exist');
                return;
            }

            originRecord = records[originRecordIndex];
            const deactivatedRecord = await deactivateDid(originRecord.did, originRecord);
            records[originRecordIndex] = deactivatedRecord;
            break;
        case Operation.recover:

            if (argv.length === 1) {
                console.log('please provide did');
                return;
            }

            originRecordIndex = records.findIndex(i => i.did === argv[1]);
            if (originRecordIndex === -1) {
                console.log('did not exist');
                return;
            }

            originRecord = records[originRecordIndex];
            const recoveredRecord = await recoverDid(originRecord.did, originRecord);
            records[originRecordIndex] = recoveredRecord;
            break;
        case Operation.addUserKey:
            if (argv.length === 1) {
                console.log('please provide did');
                return;
            }

            originRecordIndex = records.findIndex(i => i.did === argv[1]);
            if (originRecordIndex === -1) {
                console.log('did not exist');
                return;
            }

            originRecord = records[originRecordIndex];
            const addedKeyRecord = await addUserKey(originRecord.did, originRecord);
            records[originRecordIndex] = addedKeyRecord;
            break;
        default:
            console.log('unsupported operation');
            return;
    }

    fs.writeFileSync(jsonFilePath, JSON.stringify(records));
}

main(process.argv).then(() => {
});