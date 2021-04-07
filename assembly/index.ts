import {ContractPromiseBatch, context, PersistentSet, Context, base58, u128, env, PersistentVector, PersistentMap, logging} from 'near-sdk-as'
import {AccountId, Balance, Duration, TransactionId} from './types'
import {Deposit, Withdrawal, NearBankableContract, Refund} from './models'
//import { * } from 'assert'

const MAX_DESCRIPTION_LENGTH: u32 = 280

let bankContract: NearBankableContract
let bankTxIdCounter: u128 = u128.Zero
export function init(
    authorisedWithdrawAccounts: PersistentVector<AccountId>
): NearBankableContract {
    bankContract = new NearBankableContract(authorisedWithdrawAccounts)
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

function _transferFunds(to: AccountId, amount: Balance): void {
    const beneficiary = ContractPromiseBatch.create(to).transfer(amount);
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
    // Transfer funds to withdrawee
    // TODO: Add assert checks to see context.sender is authorised
    _transferFunds(context.sender, withdrawParams.amount);

    return bankTxId
}
export function approveRefund(refundParams: Refund): void {
    //Todo logic
}

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
