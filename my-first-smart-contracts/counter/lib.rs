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
            //Self {} // missing 'counter'
            Self { counter: 0 } // missing 'counter'
        }

        #[ink(message)]
        pub fn increment(&mut self) -> i32 {
            self.counter += 1;
            //ink_env::debug_message("\n\nincrement: {}\n\n", self.counter); //<----can not handle multiple args

            //do this instead
            let message = ink_env::format!("\n\n{}: {}\n\n", "increment", self.counter);
            ink_env::debug_message(&message);

            //or just use this
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
