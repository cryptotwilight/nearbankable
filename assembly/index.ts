import {ContractPromiseBatch, context, PersistentSet, Context, base58, u128, env, PersistentVector, PersistentMap, logging} from 'near-sdk-as'
import {AccountId, Balance, Duration, TransactionId} from './types'
import {Deposit, Withdrawal, NearBankableContract, Refund} from './models'
//import { assert } from 'assert' FIXME: Fix this import!

const MAX_DESCRIPTION_LENGTH: u32 = 280

let bankContract: NearBankableContract
let bankTxIdCounter: u128 = u128.Zero
export function init(
    authorisedWithdrawAccounts: PersistentVector<AccountId>,
    deposits: PersistentMap<TransactionId, Deposit>,
    withdrawals: PersistentMap<TransactionId, Withdrawal>,
    pendingRefunds: PersistentMap<TransactionId, Refund>,
    approvedRefunds: PersistentMap<TransactionId, Refund>
): NearBankableContract {
    bankContract = new NearBankableContract(authorisedWithdrawAccounts, deposits, withdrawals, pendingRefunds, approvedRefunds)
    return bankContract
}

export function depositFunds(depositParams: Deposit): u128 {
    assert(depositParams.amount > u128.Zero)
    let bankTxId = bankTxIdCounter
    bankTxIdCounter = u128.add(bankTxIdCounter, u128.One)
    depositParams.amount = context.attachedDeposit; // Amount can be deduced from the sent tokens, in fact we should be doing this!
    //Add balance
    bankContract.storedTokens = u128.add(bankContract.storedTokens, depositParams.amount)
    //Store Deposit
    bankContract.deposits.set(bankTxId, depositParams)
    return bankTxId
}

export function requestRefund(refundParams: Refund): void {
    //Todo logic
}


export function withdrawFunds(withdrawParams: Withdrawal): u128 {
    assert(withdrawParams.amount > u128.Zero)
    assert(u128.sub(bankContract.storedTokens, withdrawParams.amount) > u128.Zero) //If we don't allow overdraw
    let bankTxId = bankTxIdCounter
    bankTxIdCounter = u128.add(bankTxIdCounter, u128.One)
    //Remove balance
    bankContract.storedTokens = u128.sub(bankContract.storedTokens, withdrawParams.amount)
    //Store Deposit
    bankContract.withdrawals.set(bankTxId, withdrawParams)
    // Check withdrawer is authorised
    let authorised = false;
    for (let i = 0; i < bankContract.authorisedWithdrawAccounts.length; i++) {
        if (bankContract.authorisedWithdrawAccounts[i] == context.sender) {
            authorised = true;
        }
    }
    assert(authorised == true);
    // Transfer funds to withdrawee
    ContractPromiseBatch.create(context.sender).transfer(withdrawParams.amount);

    return bankTxId
}
export function approveRefund(refundParams: Refund): void {
    //Todo logic
}

/*
TODO: we probably want something like this down the line
export function addAuthorisedWithdrawer(who: AccountId): void {
    assert(context.sender == this.owner);

    this.authorisedWithdrawAccounts.push(who);
}
*/

/******************/
/* View Functions */
/******************/

export function getBalance(): Balance {
    return bankContract.getBalance();
}

export function getDeposits(): PersistentMap<TransactionId, Deposit> {
    return bankContract.getDeposits();
}

export function getWithdrawals(): PersistentMap<TransactionId, Withdrawal> {
    return bankContract.getWithdrawals();
}

export function getRefundRequestList(): PersistentMap<TransactionId, Refund> {
    return bankContract.getRefundRequestList();
}

export function getRefunds(): PersistentMap<TransactionId, Refund> {
    return bankContract.getRefunds();
}
