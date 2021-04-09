# nearbankable
This is the repository for the NEAR certified developer banksable project

The purpose of this project is to create a banking component that can be added to any NEAR protocol dApp providing banking facilities to secure and manage funds. 

This project enables the contract owner to store their funds away from their main dApp 

The interface exposted is described below: 

// this returns the balance currently held in the NearBankable contract 
getBalance(): Balance 

// this returns a map of all the current deposits that have been made into this contract. This call includes deposits that have been refunded
getDeposits(): PersistentMap<TransactionId, Deposit> {

// this returns a map containing all the withdrawals that have been made into this contract
getWithdrawals(): PersistentMap<TransactionId, Withdrawal> 

// this returns a map of all the refunds that have yet to be approved / declined 
getPendingRefunds(): PersistentMap<TransactionId, Refund> 

// Alias for getPendingRefunds
getRefundRequestList(): PersistentMap<TransactionId, Refund> 

// this returns a map of all the refunds that have been issued from the NearBankable contract
getRefunds(): PersistentMap<TransactionId, Refund>

// this returns a map of all the refunds that have been declined by the owner of the NearBankable contract 
getDeclinedRefunds(): PersistentMap<TransactionId, Refund>

// this deposits the funds sent into the NearBankable contract
depositFunds(depositParams: Deposit): u128

// this withdraws the funds sent into the NearBankable contract
withdrawFunds(withdrawParams: Withdrawal): u128

// this requests a refund from the Near Bankable contract. The request has to be approved by the NearBankable contract owner
requestRefund(refundParams: Refund): String 

// this approves the refund request and credits the depositor
approvedRefund(bankTxId: u128): String

// this declines the refund request 
declinedRefund(bankTxId: u128): String
