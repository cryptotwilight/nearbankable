import {u128, VMContext} from 'near-sdk-as';
import {NearBankableContract} from '../index';
import {Refund} from '../types';

let contract: NearBankableContract;
let owner = "memadrifttest1.testnet";
const ONE_NEAR = u128.from("1000000000000000000000000");
//const XCC_GAS: Gas = 20_000_000_000_000;

beforeEach(() => {
    VMContext.setCurrent_account_id("contract");
    //VMContext.setAccount_balance(ONE_NEAR); // resolves HostError(BalanceExceeded)
    contract = new NearBankableContract(owner);
})

describe("Basics", () => {

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

describe("Depositing, Withdrawing", () => {

    it("Can't deposit less than 0 funds", () => {
        expect(() => {
            contract.depositFunds({
                blockchainTxId: "test1",
                depositor: owner,
                amount: u128.from(0),
                reasoncode: u128.One,
                text: "A zero deposit, invalid"
            })
        }).toThrow();
    });

    it("Can deposit funds", () => {
        expect(() => {
            contract.depositFunds({
                blockchainTxId: "test1",
                amount: ONE_NEAR,
                depositor: owner,
                reasoncode: u128.One,
                text: "A proper deposit"
            })
        }).not.toThrow();
    });

    it("Funds added to balance", () => {
        contract.depositFunds({
            blockchainTxId: "test1",
            amount: ONE_NEAR,
            depositor: owner,
            reasoncode: u128.One,
            text: "A proper deposit"
        })
        expect(contract.getBalance()).toBe(ONE_NEAR);
    });

    it("Deposits appended", () => {
        contract.depositFunds({
            blockchainTxId: "test1",
            amount: ONE_NEAR,
            depositor: owner,
            reasoncode: u128.One,
            text: "A proper deposit"
        })
        expect(contract.getDeposits().contains(u128.Zero)).toBeTruthy();
    });

    /*
     This test can be activated by removing the assert for context.sender
     and removing the fund transfer
    it("Withdrawing", () => {
        contract.depositFunds({
            blockchainTxId: "test1",
            amount: u128.mul(ONE_NEAR, u128.from("2")),
            depositor: owner,
            reasoncode: u128.One,
            text: "A proper deposit"
        });

        contract.withdrawFunds({
            blockchainTxId: "test1",
            amount: ONE_NEAR,
            reasoncode: u128.One,
            text: "A proper withdrawal"
        });

        expect(contract.getBalance()).toBe(ONE_NEAR);
    });
    */
});
