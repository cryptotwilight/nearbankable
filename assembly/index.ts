import {ContractPromiseBatch, context, Context, u128, PersistentVector, PersistentMap, logging} from 'near-sdk-as'
import {AccountId, Balance, TransactionId, Deposit, Withdrawal, Refund} from './types'
// TODO: Add logging? what does logging do?

const MAX_DESCRIPTION_LENGTH: u32 = 280

@nearBindgen
export class NearBankableContract {
    storedTokens: Balance;
    owner: AccountId;
    bankTxIdCounter: u128 = u128.Zero;

    constructor(
        owner: AccountId,
    ) {
        this.storedTokens = u128.Zero;
        this.owner = owner;
    };

    /******************/
    /* View Functions */
    /******************/

    getBalance(): Balance {
        return this.storedTokens;
    }

    getDeposits(): PersistentMap<TransactionId, Deposit> {
        return deposits;
    }

    getWithdrawals(): PersistentMap<TransactionId, Withdrawal> {
        return withdrawals;
    }

    getPendingRefunds(): PersistentMap<TransactionId, Refund> {
        return pendingRefunds;
    }

    // Alias for getPendingRefunds
    getRefundRequestList(): PersistentMap<TransactionId, Refund> {
        return pendingRefunds;
    }

    getRefunds(): PersistentMap<TransactionId, Refund> {
        return approvedRefunds;
    }

    @mutateState()
    depositFunds(depositParams: Deposit): u128 {
        assert(depositParams.amount > u128.Zero);
        let bankTxId = this.bankTxIdCounter;
        this.bankTxIdCounter = u128.add(this.bankTxIdCounter, u128.One);
        // FIXME: remove amount param from the deposit params?
        //depositParams.amount = context.attachedDeposit; // Amount can be deduced from the sent tokens, in fact we should be doing this!
        // Add balance
        this.storedTokens = u128.add(this.storedTokens, depositParams.amount);
        // Store Deposit
        deposits.set(bankTxId, depositParams);
        return bankTxId;
    }

    @mutateState()
    withdrawFunds(withdrawParams: Withdrawal): u128 {
        assert(this.owner == context.sender);
        assert(withdrawParams.amount > u128.Zero);
        assert(u128.sub(this.storedTokens, withdrawParams.amount) > u128.Zero); // If we don't allow overdraw
        let bankTxId = this.bankTxIdCounter;
        this.bankTxIdCounter = u128.add(this.bankTxIdCounter, u128.One);
        // Remove balance
        this.storedTokens = u128.sub(this.storedTokens, withdrawParams.amount);
        // Store Deposit
        withdrawals.set(bankTxId, withdrawParams);
        // Check withdrawer is authorised
        // Transfer funds to withdrawee
        // FIXME: Check with thanks / lottery!
        ContractPromiseBatch.create(context.sender).transfer(withdrawParams.amount);

        return bankTxId
    }

    @mutateState()
    requestRefund(refundParams: Refund): void {
        // TODO: logic
    }

    @mutateState()
    approveRefund(refundParams: Refund): void {
        // TODO: logic
    }

}

/***********/
/* Storage */
/***********/
export const deposits = new PersistentMap<TransactionId, Deposit>("d");
export const withdrawals = new PersistentMap<TransactionId, Withdrawal>("w");
export const pendingRefunds = new PersistentMap<TransactionId, Refund>("p");
export const approvedRefunds = new PersistentMap<TransactionId, Refund>("a");
export const refundedTxs = new PersistentVector<TransactionId>("r");
