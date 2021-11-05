package gem.banking.services;

import gem.banking.exceptions.InsufficientFundsException;
import gem.banking.exceptions.InvalidTransactionException;
import gem.banking.models.AccountInfo;
import gem.banking.models.Transaction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class TransactionService {

    public AccountInfo recordTransaction(Transaction transaction, AccountInfo accountInfo) throws InsufficientFundsException, InvalidTransactionException {
        List<Transaction> transactions = accountInfo.getTransactionHistory();
        double balance = accountInfo.getBalance();
        Transaction.TransactionType transactionType = transaction.getTransactionType();

        if (transaction.getAmount() <= 0.0) throw new InvalidTransactionException("Amount must be a positive value.");


        if (transaction.getDate() == null) {
            transaction.setDate(new Date());
        }

        if (transactionType == Transaction.TransactionType.DEPOSIT) {
            transaction.setTransactionStatus(Transaction.TransactionStatus.PROCESSED);
            transactions.add(transaction);
            balance += transaction.getAmount();
        } else if (transactionType == Transaction.TransactionType.WITHDRAWAL) {
            if (balance - transaction.getAmount() < 0.0) {
                throw new InsufficientFundsException(String.format("Insufficient funds. Current balance is $%.2f", balance));
            }
            transaction.setTransactionStatus(Transaction.TransactionStatus.PROCESSED);
            transactions.add(transaction);
            balance -= transaction.getAmount();
        } else {
            throw new InvalidTransactionException("Invalid or missing transaction type");
        }

        accountInfo.setTransactionHistory(transactions);
        accountInfo.setBalance(balance);

        log.debug("Transaction memo:" + transaction.getMemo() + " - Amount: " + transactionType + " - New Balance: " + balance);

        return accountInfo;
    }

    public List<AccountInfo> sendTransaction(Transaction transaction,
                                             AccountInfo senderAccountInfo,
                                             AccountInfo recipientAccountInfo)
            throws InsufficientFundsException, InvalidTransactionException {
        List<AccountInfo> updatedAccounts = new ArrayList<>();

        List<Transaction> senderTransactions = senderAccountInfo.getTransactionHistory();
        List<Transaction> recipientTransactions = recipientAccountInfo.getTransactionHistory();

        double senderBalance = senderAccountInfo.getBalance();
        double recipientBalance = recipientAccountInfo.getBalance();

        // TransactionType for the sender
        Transaction.TransactionType transactionType = transaction.getTransactionType();

        if (transaction.getAmount() <= 0.0) throw new InvalidTransactionException("Amount must be a positive value.");


        if (transaction.getDate() == null) {
            transaction.setDate(new Date());
        }

        // We check if the transaction type is SEND because we are subtracting money from the account balance
        if (transactionType == Transaction.TransactionType.SEND) {
            if (senderBalance - transaction.getAmount() < 0.0) {
                throw new InsufficientFundsException(String.format("Insufficient funds. Current balance is $%.2f", senderBalance));
            }
            transaction.setTransactionStatus(Transaction.TransactionStatus.SENT);
            senderTransactions.add(transaction);
            senderBalance -= transaction.getAmount();

            // Updating the sender's account
            senderAccountInfo.setTransactionHistory(senderTransactions);
            senderAccountInfo.setBalance(senderBalance);

            // New Transaction object for the recipient so we can change status and type.
            Transaction recipient = new Transaction(transaction);
            recipient.setTransactionStatus(Transaction.TransactionStatus.RECEIVED);
            recipient.setTransactionType(Transaction.TransactionType.TRANSFER);

            recipientTransactions.add(recipient);
            recipientBalance += transaction.getAmount();

            // Updating the recipient's account
            recipientAccountInfo.setTransactionHistory(recipientTransactions);
            recipientAccountInfo.setBalance(recipientBalance);
        } else {
            throw new InvalidTransactionException("Invalid or missing transaction type");
        }

        // Adding the sender and recipient account infos into the updated accounts list to return
        updatedAccounts.add(senderAccountInfo);
        updatedAccounts.add(recipientAccountInfo);

        log.debug("Transaction memo:" + transaction.getMemo() + " - Amount: " + transactionType + " - New Balance: " + senderBalance);

        return updatedAccounts;
    }

    public List<AccountInfo> requestTransaction(Transaction transaction,
                                                AccountInfo requesterAccountInfo,
                                                AccountInfo recipientAccountInfo)
            throws InsufficientFundsException, InvalidTransactionException {
        List<AccountInfo> updatedAccounts = new ArrayList<>();

        List<Transaction> requesterTransactions = requesterAccountInfo.getTransactionHistory();
        List<Transaction> recipientTransactions = recipientAccountInfo.getTransactionHistory();

        // TransactionType for the sender
        Transaction.TransactionType transactionType = transaction.getTransactionType();

        if (transaction.getAmount() <= 0.0) throw new InvalidTransactionException("Amount must be a positive value.");


        if (transaction.getDate() == null) {
            transaction.setDate(new Date());
        }

        // We check if the transaction status is REQUEST
        if (transactionType == Transaction.TransactionType.REQUEST) {
            // TransactionStatus for the recipient so they see PENDING for a request in their transactions
            transaction.setTransactionStatus(Transaction.TransactionStatus.PENDING);

            recipientTransactions.add(transaction);
            recipientAccountInfo.setTransactionHistory(recipientTransactions);


            // TransactionStatus for the requester so they see SENT for their request
            Transaction request = new Transaction(transaction);
            request.setTransactionStatus(Transaction.TransactionStatus.SENT);

            requesterTransactions.add(request);
            requesterAccountInfo.setTransactionHistory(requesterTransactions);
        } else {
            throw new InvalidTransactionException("Invalid or missing transaction type");
        }

        // Adding the requester and recipient account infos into the updated accounts list to return
        updatedAccounts.add(requesterAccountInfo);
        updatedAccounts.add(recipientAccountInfo);

        log.debug("Transaction memo:" + transaction.getMemo() + " - Amount: " + transactionType);

        return updatedAccounts;
    }

    public List<AccountInfo> approveTransaction(Transaction transaction,
                                                AccountInfo senderAccountInfo,
                                                AccountInfo recipientAccountInfo)
            throws InsufficientFundsException, InvalidTransactionException {
        //TODO logic for moving money due to approval of request

        return new ArrayList<>();
    }

    public List<AccountInfo> denyTransaction(Transaction transaction,
                                             AccountInfo senderAccountInfo,
                                             AccountInfo recipientAccountInfo)
            throws InsufficientFundsException, InvalidTransactionException {
        //TODO logic for denying request

        return new ArrayList<>();
    }
}
