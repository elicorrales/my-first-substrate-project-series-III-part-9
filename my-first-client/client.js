const { WsProvider, ApiPromise, Keyring } = require('@polkadot/api');
const { ContractPromise } = require('@polkadot/api-contract');
const wsUrl = 'ws://localhost:9944';
const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const contractAddress = '5CYucUyRWKQxSbtEtK7KsYYGTLHNYKhZeqhPJa1Um29Yxgtp';
const metadataPath = '../my-first-smart-contracts/counter/target/ink/metadata.json';
const metadata = require(metadataPath);

let theInstruction = undefined;
if (process.argv.length > 2) {
    theInstruction = process.argv[2];
}

(async () => {
    const ws = new WsProvider(wsUrl);
    const wsApi = await ApiPromise.create({ provider: ws });
    const contract = new ContractPromise(wsApi, metadata, contractAddress);

    let keyring = new Keyring({ type: 'sr25519' });
    let aliceKeypair = keyring.addFromUri('//Alice');//has everything

    let gasLimit = 74999922688;

    // get payer's balance before any transactions
    let rtn = await wsApi.query.system.account(aliceAddress);
    console.log('Alice\'s Balance:', rtn['data'].free.toHuman());

    // running this WILL appear to change the count ('increment', 'decrement', 'reset')
    // but it isn't persisted. you need a transaction
    //let { result, output } = await contract.query[theInstruction](aliceAddress, { gasLimit });
    //console.log('result:', result.toHuman());
    //console.log('output:', output.toHuman());

    if (theInstruction != undefined) {
        //aliceAddress will not work here - doesnt have all the info required for transactions
        await contract.tx[theInstruction]({ gasLimit }).signAndSend(aliceKeypair);
    }

    let { result, output } = await contract.query['get'](aliceAddress, { gasLimit });
    console.log('result:', result.toHuman());
    console.log('output:', output.toHuman());

    // get payer's balance after any transactions
    rtn = await wsApi.query.system.account(aliceAddress);
    console.log('Alice\'s Balance:', rtn['data'].free.toHuman());

    wsApi.disconnect()


})();
