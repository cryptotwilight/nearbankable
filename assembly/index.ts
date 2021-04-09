import {ContractPromiseBatch, context, Context, u128, PersistentVector, PersistentMap, logging} from 'near-sdk-as'
import {AccountId, Balance, TransactionId, Deposit, Withdrawal, Refund} from './types'

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

    getDeclinedRefunds(): PersistentMap<TransactionId, Refund> {
        return declinedRefunds;
    }

    @mutateState()
    depositFunds(depositParams: Deposit): u128 {
        assert(depositParams.amount > u128.Zero);
        let bankTxId = this.bankTxIdCounter;
        this.bankTxIdCounter = u128.add(this.bankTxIdCounter, u128.One);
        // TODO: remove amount param from the deposit params?
        // TODO: depositor should equal context sender in shipment version
        // depositParams.amount = context.attachedDeposit; // Amount can be deduced from the sent tokens, in fact we should be doing this!
        // depositParams.depositor = context.sender; 
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
        ContractPromiseBatch.create(context.sender).transfer(withdrawParams.amount);

        return bankTxId
    }

    @mutateState()
    requestRefund(refundParams: Refund): String {
        // make sure that the refund requestor is the holder of the deposit
        // assert(context.sender == deposit.depositor, 'refund can only be requested by depositor'); FIXME: activate this for deployment
        // make sure that there is a deposit
        let deposit: Deposit = deposits.getSome(refundParams.bankTxId);
        assert(deposits.contains(refundParams.bankTxId) == true, 'no matching deposit found');
        // add the refund request to the queue 
        pendingRefunds.set(refundParams.bankTxId, refundParams);
        // let the requestor know
        return "Refund request added to pending queue";
    }

    @mutateState()
    approvedRefund(bankTxId: u128): String {
        // make sure it's the contract owner making the call
        assert(context.sender == this.owner, "only owner can call this");
        assert(pendingRefunds.contains(bankTxId) == true);
        assert(deposits.contains(bankTxId) == true);
        // pull out the refund
        let refund = pendingRefunds.getSome(bankTxId);
        // pull out the deposit
        let deposit = deposits.getSome(bankTxId);
        // transfer the deposit amount
        ContractPromiseBatch.create(deposit.depositor).transfer(deposit.amount);

        // add the refund to the approved refunds
        approvedRefunds.set(bankTxId, refund);
        // add the bank transaction to the refunded list
        refundedTxs.push(bankTxId);
        // remove the refund from the pending list 
        pendingRefunds.delete(bankTxId);
        let msg = `refund approved: ${bankTxId}`;

        return msg;
    }

    @mutateState()
    declinedRefund(bankTxId: u128): String {
        // make sure it's the contract owner making the call
        assert(context.sender == this.owner, "only administrator can call this");
        assert(pendingRefunds.contains(bankTxId) == true);

        // pull out the refund
        let refund = pendingRefunds.getSome(bankTxId);
        // add the refund to the approved refunds
        declinedRefunds.set(bankTxId, refund);
        // remove the refund from the pending list 
        pendingRefunds.delete(bankTxId);

        let msg = `refund approved: ${bankTxId}`;

        return msg;
    }

    // Alias for approvedRefund
    @mutateState()
    approveRefund(bankTxId: u128): String {
        return this.approvedRefund(bankTxId);
    }

    // Alias for declinedRefund
    @mutateState()
    declineRefund(bankTxId: u128): String {
        return this.declinedRefund(bankTxId);
    }
}

/***********/
/* Storage */
/***********/
export const deposits = new PersistentMap<TransactionId, Deposit>("d");
export const withdrawals = new PersistentMap<TransactionId, Withdrawal>("w");
export const pendingRefunds = new PersistentMap<TransactionId, Refund>("p");
export const approvedRefunds = new PersistentMap<TransactionId, Refund>("a");
export const declinedRefunds = new PersistentMap<TransactionId, Refund>("d");
export const refundedTxs = new PersistentVector<TransactionId>("r");
