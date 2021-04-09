import {u128} from 'near-sdk-as';

export type AccountId = string;

export type Amount = u128;
export type Balance = Amount;
export type Duration = u128;
export type BlockchainTransactionId = string;
export type TransactionId = u128;

export class Deposit {
    blockchainTxId: BlockchainTransactionId;
    depositor : AccountId; 
    amount: Amount;
    reasoncode: u128;
    text: string;
}

export class Withdrawal {
    blockchainTxId: BlockchainTransactionId;
    amount: u128;
    reasoncode: u128;
    text: string;
}

export class Refund {
    blockchainTxId: BlockchainTransactionId;
    bankTxId : u128;
    reasoncode: u128;
    text: string;
}
