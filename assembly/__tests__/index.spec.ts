import {PersistentVector, PersistentMap} from 'near-sdk-as';
import {init} from '../index';
import {AccountId, Balance, Duration, TransactionId} from '../types';
import {Deposit, Withdrawal, Refund} from '../models';

describe("should initialise contract", () => {
    it("should initialise correctly", () => {
        let contract = init("owner", new PersistentMap<TransactionId, Deposit>("deposits"),
            new PersistentMap<TransactionId, Withdrawal>("withdrawals"), new PersistentMap<TransactionId, Refund>("pending-refunds"),
            new PersistentMap<TransactionId, Refund>("approved-refunds"));
        expect(contract).not.toBeNull();
    });
});
