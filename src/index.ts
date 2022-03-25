import {
    IonNetwork, IonSdkConfig,
} from '@decentralized-identity/ion-sdk';
import {DIDRecord} from './models/types';
import {createDid, deactivateDid, updateDid, recoverDid} from './operations';

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
    switch (argv[0] as string) {
        case 'create':
            let didCount = 1;
            if (!isNaN(parseFloat(argv[1]))) {
                didCount = parseFloat(argv[1]);
            }

            const didRecords = await createDid(didCount);
            records = records.concat(didRecords);
            console.log(records);
            break;
        case 'update':
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
        case 'deactivate':
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
        case 'recover':
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
        default:
            console.log('error');
            return;
    }


    fs.writeFileSync(jsonFilePath, JSON.stringify(records));
}

main(process.argv).then(() => {
});