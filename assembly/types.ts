import {u128} from 'near-sdk-as';

export type AccountId = string;

export type Amount = u128;
export type Balance = Amount;
export type Duration = u128;
export type BlockchainTransactionId = string;
export type TransactionId = u128;

@nearBindgen
export class Deposit {
    blockchainTxId: BlockchainTransactionId;
    amount: Amount;
    reasoncode: u128;
    text: string;
}

@nearBindgen
export class Withdrawal {
    blockchainTxId: BlockchainTransactionId;
    amount: u128;
    reasoncode: u128;
    text: string;
}

@nearBindgen
export class Refund {
    blockchainTxId: BlockchainTransactionId;
    reasoncode: u128;
    text: string;
}
