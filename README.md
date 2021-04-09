# NEARBankable
This is the repository for the NEAR certified developer banksable project

The purpose of this project is to create a banking component that can be added to any NEAR protocol dApp providing banking facilities to secure and manage funds. 

This project enables the contract owner to store their funds away from their main dApp 

# Deployment guide
Run the following commands in order, substituting `CONTRACT_ACCOUNT` for the dev-XXXX-YYYY account and `OWNER_ACCOUNT` for your account.
```
yarn
yarn asb
near dev-deploy build/release/nearbankable.wasm
near call DEV_ACCOUNT init '{"owner":"'OWNER_ACCOUNT'"}' --accountId DEV_ACCOUNT
near call --accountId "OWNER_ACCOUNT" DEV_ACCOUNT getBalance
```
## Deploying on Windows
On Windows, replace all the files without the `-windows` affix with the files with the `-windows` affix and run the following:
```
yarn
yarn start
near dev-deploy out/main.wasm
near call DEV_ACCOUNT init '{"owner":"'OWNER_ACCOUNT'"}' --accountId DEV_ACCOUNT
near call --accountId "OWNER_ACCOUNT" DEV_ACCOUNT getBalance
```

# Contract Interface

This returns the balance currently held in the NearBankable contract 
```
getBalance(): Balance 
```
This returns a map of all the current deposits that have been made into this contract. This call includes deposits that have been refunded
```
getDeposits(): PersistentMap<TransactionId, Deposit> 
```

This returns a map containing all the withdrawals that have been made into this contract
```
getWithdrawals(): PersistentMap<TransactionId, Withdrawal> 
```

This returns a map of all the refunds that have yet to be approved / declined 
```
getPendingRefunds(): PersistentMap<TransactionId, Refund> 
```
Alias for getPendingRefunds
```
getRefundRequestList(): PersistentMap<TransactionId, Refund>
```

This returns a map of all the refunds that have been issued from the NearBankable contract
```
getRefunds(): PersistentMap<TransactionId, Refund>
```

This returns a map of all the refunds that have been declined by the owner of the NearBankable contract 
```
getDeclinedRefunds(): PersistentMap<TransactionId, Refund>
```

This deposits the funds sent into the NearBankable contract
```
depositFunds(depositParams: Deposit): u128
```

This withdraws the funds sent into the NearBankable contract
```
withdrawFunds(withdrawParams: Withdrawal): u128
```
This requests a refund from the Near Bankable contract. The request has to be approved by the NearBankable contract owner
```
requestRefund(refundParams: Refund): String
```

This approves the refund request and credits the depositor
```
approvedRefund(bankTxId: u128): String
```

This declines the refund request 
```
declinedRefund(bankTxId: u128): String
```
