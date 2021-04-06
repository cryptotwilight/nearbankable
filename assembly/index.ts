import { ContractPromiseBatch, PersistentSet, Context, base58, u128, env, PersistentVector, PersistentMap, logging } from 'near-sdk-as'
import { AccountId, Balance, Duration, TransactionId } from './types'
import { Deposit, Withdrawal, NearBankableContract, Refund, DepositInput } from './models'
import { assert } from 'node:console'
import { domainToASCII } from 'node:url'

const MAX_DESCRIPTION_LENGTH: u32 = 280

let bankContract: NearBankableContract
let txIdCounter: u128 = u128.Zero
export function init(
    authorisedWithdrawAccounts: PersistentVector<AccountId>
): NearBankableContract {
  bankContract = new NearBankableContract (authorisedWithdrawAccounts)
  return bankContract
}

export function depositFunds(depositParams:Deposit) : u128 {
    assert(depositParams.amount > u128.Zero)
    let txId = txIdCounter
    txIdCounter = u128.add(txIdCounter, u128.One)
    //Add balance
    bankContract.storedTokens = u128.add(bankContract.storedTokens, depositParams.amount)
    //Store Deposit
    bankContract.deposits.set(txId, depositParams)
    return txId
}

export function requestRefund(refundParams: Refund): void {
    //Todo logic
}

export function withdrawFunds(withdrawParams: Withdrawal): u128 {
    assert(withdrawParams.amount > u128.Zero)
    assert(u128.sub(bankContract.storedTokens, withdrawParams.amount) > u128.Zero) //If we don't allow overdraw
    let txId = txIdCounter
    txIdCounter = u128.add(txIdCounter, u128.One)
    //Remove balance
    bankContract.storedTokens = u128.sub(bankContract.storedTokens, withdrawParams.amount)
    //Store Deposit
    bankContract.withdrawals.set(txId, withdrawParams)
    return txId
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