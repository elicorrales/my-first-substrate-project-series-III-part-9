# my-first-substrate-project-series-III-part-9

### This project is part of a series and includes a video.

See [Here](https://github.com/elicorrales/blockchain-tutorials/blob/main/README.md) for the overall document that
refers to all the series.  
  
# We Code, Deploy, Interact With A Counter Using The Javascript Client

## The Rust Counter Contract : ```lib.rs```:  
  
```
#![cfg_attr(not(feature = "std"), no_std)]
use ink_lang as ink;

#[ink::contract]
mod counter {

    #[ink(storage)]
    pub struct Counter {
        counter: i32,
    }

    impl Counter {
        #[ink(constructor)]
        pub fn new() -> Self {
            //Self {} // try it like this; the compiler will complain - missing 'counter'
            Self { counter: 0 } 
        }

        #[ink(message)]
        pub fn increment(&mut self) -> i32 {
            self.counter += 1;

            //ink_env::debug_message("\n\nincrement: {}\n\n", self.counter); //can not handle multiple args

            let message = ink_env::format!("\n\n{}: {}\n\n", "increment", self.counter);

            ink_env::debug_message(&message);

            ink_env::debug_println!("\n\nincrement: {}\n\n", self.counter);

            self.counter
        }

        #[ink(message)]
        pub fn decrement(&mut self) -> i32 {
            self.counter -= 1;
            ink_env::debug_println!("\n\ndecrement: {}\n\n", self.counter);
            self.counter
        }

        #[ink(message)]
        pub fn reset(&mut self) -> i32 {
            self.counter = 0;
            ink_env::debug_println!("\n\nreset: {}\n\n", self.counter);
            self.counter
        }

        #[ink(message)]
        pub fn get(&mut self) -> i32 {
            ink_env::debug_println!("\n\nvalue: {}\n\n", self.counter);
            self.counter
        }
    }
}
```
  
## The Javascript Client ```client.js```:
  
```
const { WsProvider, ApiPromise, Keyring } = require('@polkadot/api');
const { ContractPromise } = require('@polkadot/api-contract');
const wsUrl = 'ws://localhost:9944';
const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const contractAddress = '5CYucUyRWKQxSbtEtK7KsYYGTLHNYKhZeqhPJa1Um29Yxgtp';
const metadataPath = '../my-first-smart-contracts/counter/target/ink/metadata.json';
const metadata = require(metadataPath);

if (process.argv.length < 3) {
    console.log('\n\n Need an instruction to execute.\n\n');
    return;
}
let theInstruction = process.argv[2];

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

    let { result, output } = await contract.query[theInstruction](aliceAddress, { gasLimit });

    //aliceAddress will not work here - doesnt have all the info required for transactions
    await contract.tx[theInstruction]({ gasLimit }).signAndSend(aliceKeypair);

    console.log('result:', result.toHuman());
    console.log('output:', output.toHuman());

    // get payer's balance after any transactions
    rtn = await wsApi.query.system.account(aliceAddress);
    console.log('Alice\'s Balance:', rtn['data'].free.toHuman());


    wsApi.disconnect()


})();
```



