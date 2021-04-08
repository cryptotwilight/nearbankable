import {PersistentVector, PersistentMap, u128} from 'near-sdk-as';
import {init, depositFunds} from '../index';
import {AccountId, Balance, Duration, TransactionId} from '../types';
import {Deposit, Withdrawal, Refund} from '../models';

describe("Basics, Deposits, Withdrawals", () => {
    it("should initialise correctly", () => {
        let contract = init("owner", new PersistentMap<TransactionId, Deposit>("deposits"),
            new PersistentMap<TransactionId, Withdrawal>("withdrawals"), new PersistentMap<TransactionId, Refund>("pending-refunds"),
            new PersistentMap<TransactionId, Refund>("approved-refunds"));
        expect(contract).not.toBeNull();
    });

    it("should be able to get balance", () => {
        let contract = init("owner", new PersistentMap<TransactionId, Deposit>("deposits"),
            new PersistentMap<TransactionId, Withdrawal>("withdrawals"), new PersistentMap<TransactionId, Refund>("pending-refunds"),
            new PersistentMap<TransactionId, Refund>("approved-refunds"));
        expect(contract.getBalance()).toBe(u128.Zero);
    });

    /*
     FIXME: How do we test this?
    it("should be able to deposit", () => {
        let contract = init("owner", new PersistentMap<TransactionId, Deposit>("deposits"),
            new PersistentMap<TransactionId, Withdrawal>("withdrawals"), new PersistentMap<TransactionId, Refund>("pending-refunds"),
            new PersistentMap<TransactionId, Refund>("approved-refunds"));
        depositFunds({
            blockchainTxId: "txid1",
            amount: u128.One,
            reasoncode: u128.One,
            text: "test"
        });
        expect(contract.getDeposits().get(u128.One)).not.toBeNull();
    });
    */
});
