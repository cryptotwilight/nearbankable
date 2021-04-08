import {u128} from 'near-sdk-as';
import {NearBankableContract} from '../index';

describe("Basics, Deposits, Withdrawals", () => {

    it("should initialise correctly", () => {
        let contract = new NearBankableContract("memadrifttest1.testnet")
        expect(contract).not.toBeNull();
    });

    it("owner should be set correctly", () => {
        let contract = new NearBankableContract("memadrifttest1.testnet")
        expect(contract.owner).toBe("memadrifttest1.testnet");
    });

    it("balance should be initialised correctly", () => {
        let contract = new NearBankableContract("memadrifttest1.testnet")
        expect(contract.getBalance()).toBe(u128.Zero);
    });

    // Transferring funds has to be tested via simulation testing in Rust
});
