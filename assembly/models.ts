import {
  u128,
  u256,
  PersistentVector,
  PersistentMap
} from 'near-sdk-as';
import {AccountId, TransactionId, Amount, Balance, BlockchainTransactionId} from './types';

@nearBindgen
export class Deposit {
  blockchainTxId: BlockchainTransactionId;
  amount: Amount;
  reasoncode: u128;
  text: String;
}
@nearBindgen
export class Withdrawal {
  blockchainTxId: BlockchainTransactionId;
  amount: u128;
  reasoncode: u128;
  text: String;
}

@nearBindgen
export class Refund {
  blockchainTxId: BlockchainTransactionId;
  reasoncode: u128;
  text: String;
}

@nearBindgen
export class NearBankableContract {
  storedTokens: Balance;
  refundedTxs: PersistentVector<TransactionId>;
  // I'm not sure Map is the best data type to use here
  // however, I feel like simply keeping a list without keeping track of
  // the tx would be kind of pointless. Map with K = Tx allows
  // quick lookup for purposeof refunding for example
  authorisedWithdrawAccounts: PersistentVector<AccountId>;
  deposits: PersistentMap<TransactionId, Deposit>;
  withdrawals: PersistentMap<TransactionId, Withdrawal>;
  pendingRefunds: PersistentMap<TransactionId, Refund>;
  approvedRefunds: PersistentMap<TransactionId, Refund>;

  constructor(
    authorisedWithdrawAccounts: PersistentVector<AccountId>,
  ) {
    authorisedWithdrawAccounts = this.authorisedWithdrawAccounts;

    // We need to initialise these with a unique arg in brackets as per
    // https://docs.near.org/docs/develop/contracts/as/intro#collections
    this.deposits = new PersistentMap<TransactionId, Deposit>("deposits_unique_string")
    this.withdrawals = new PersistentMap<TransactionId, Withdrawal>("withdrawals_unique_string")
    this.pendingRefunds = new PersistentMap<TransactionId, Refund>("pendingRefunds_unique_string")
    this.approvedRefunds = new PersistentMap<TransactionId, Refund>("approvedRefunds_unique_string")
  };

  getBalance(): Balance {
    return this.storedTokens;
  }

  getDeposits(): PersistentMap<TransactionId, Deposit> {
    return this.deposits;
  }

  getWithdrawals(): PersistentMap<TransactionId, Withdrawal> {
    return this.withdrawals;
  }

  getRefundRequestList(): PersistentMap<TransactionId, Refund> {
    return this.pendingRefunds;
  }

  getRefunds(): PersistentMap<TransactionId, Refund> {
    return this.approvedRefunds;
  }
}
