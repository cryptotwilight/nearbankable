import {u128, VMContext} from 'near-sdk-as';
import {NearBankableContract} from '../index';

let contract: NearBankableContract;
let owner = "memadrifttest1.testnet";
//const ONE_NEAR = u128.from("1000000000000000000000000");
//const XCC_GAS: Gas = 20_000_000_000_000;

beforeEach(() => {
    VMContext.setCurrent_account_id("contract");
    //VMContext.setAccount_balance(ONE_NEAR); // resolves HostError(BalanceExceeded)
    contract = new NearBankableContract(owner);
})

describe("Basics, Deposits, Withdrawals", () => {

    it("should initialise correctly", () => {
        expect(contract).not.toBeNull();
    });

    it("owner should be set correctly", () => {
        expect(contract.owner).toBe(owner);
    });

    it("balance should be initialised correctly", () => {
        expect(contract.getBalance()).toBe(u128.Zero);
    });
});
