package gem.banking.services;

import gem.banking.enums.Status;
import gem.banking.enums.TransactionType;
import gem.banking.exceptions.InsufficientFundsException;
import gem.banking.exceptions.InvalidTransactionException;
import gem.banking.models.AccountInfo;
import gem.banking.models.Buddy;
import gem.banking.models.Transaction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class TransactionService {
    public AccountInfo recordTransaction(Transaction transaction, AccountInfo accountInfo) throws InsufficientFundsException, InvalidTransactionException {
        List<Transaction> transactions = accountInfo.getTransactionHistory();
        double balance = accountInfo.getBalance();
        TransactionType transactionType = transaction.getTransactionType();

        if (transaction.getAmount() <= 0.0) throw new InvalidTransactionException("Amount must be a positive value.");


        if (transaction.getDate() == null || transaction.getDate().equals("")) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            String currentTime = LocalDateTime.now().format(formatter);
            transaction.setDate(currentTime);
        }

        if (transactionType == TransactionType.DEPOSIT) {
            transaction.setTransactionStatus(Status.PROCESSED);
            transactions.add(transaction);
            balance += transaction.getAmount();
        } else if (transactionType == TransactionType.WITHDRAWAL) {
            if (balance - transaction.getAmount() < 0.0) {
                throw new InsufficientFundsException(String.format("Insufficient funds. Current balance is $%.2f", balance));
            }
            transaction.setTransactionStatus(Status.PROCESSED);
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

    public List<Object> sendTransaction(Transaction transaction,
                                             AccountInfo senderAccountInfo,
                                             AccountInfo recipientAccountInfo,
                                             Buddy senderBuddies,
                                             Buddy recipientBuddies,
                                             String type)
            throws InsufficientFundsException, InvalidTransactionException {
        if (type.equals("account")){
            List<Object> updatedAccounts = new ArrayList<>();

            List<Transaction> senderTransactions = senderAccountInfo.getTransactionHistory();
            List<Transaction> recipientTransactions = recipientAccountInfo.getTransactionHistory();

            double senderBalance = senderAccountInfo.getBalance();
            double recipientBalance = recipientAccountInfo.getBalance();

            // TransactionType for the sender
            TransactionType transactionType = transaction.getTransactionType();

            if (transaction.getAmount() <= 0.0) throw new InvalidTransactionException("Amount must be a positive value.");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            String currentTime = LocalDateTime.now().format(formatter);
            transaction.setDate(currentTime);

            // We check if the transaction type is SEND because we are subtracting money from the account balance
            if (transactionType == TransactionType.SEND) {
                if (senderBalance - transaction.getAmount() < 0.0) {
                    throw new InsufficientFundsException(String.format("Insufficient funds. Current balance is $%.2f", senderBalance));
                }
                transaction.setTransactionStatus(Status.SENT);
                senderTransactions.add(transaction);
                senderBalance -= transaction.getAmount();

                // Updating the sender's account
                senderAccountInfo.setTransactionHistory(senderTransactions);
                senderAccountInfo.setBalance(senderBalance);

                // New Transaction object for the recipient so we can change status and type.
                Transaction recipient = new Transaction(transaction);
                recipient.setTransactionStatus(Status.RECEIVED);
                recipient.setTransactionType(TransactionType.TRANSFER);

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

            return updatedAccounts;
        } else {
            List<Object> updatedBuddies = new ArrayList<>();

            List<Transaction> senderBuddyTransactions = senderBuddies.getBuddyTransactions();
            List<Transaction> recipientBuddyTransactions = recipientBuddies.getBuddyTransactions();

            // TransactionType for the sender
            TransactionType transactionType = transaction.getTransactionType();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            String currentTime = LocalDateTime.now().format(formatter);
            transaction.setDate(currentTime);

            // We check if the transaction type is SEND because we are subtracting money from the account balance
            if (transactionType == TransactionType.SEND) {
                transaction.setTransactionStatus(Status.SENT);
                senderBuddyTransactions.add(transaction);

                // Updating the sender's account
                senderBuddies.setBuddyTransactions(senderBuddyTransactions);

                // New Transaction object for the recipient so we can change status and type.
                Transaction recipient = new Transaction(transaction);
                recipient.setTransactionStatus(Status.RECEIVED);
                recipient.setTransactionType(TransactionType.TRANSFER);

                recipientBuddyTransactions.add(recipient);

                // Updating the recipient's account
                recipientBuddies.setBuddyTransactions(recipientBuddyTransactions);
            } else {
                throw new InvalidTransactionException("Invalid or missing transaction type");
            }

            // Adding the sender and recipient account infos into the updated accounts list to return
            updatedBuddies.add(senderBuddies);
            updatedBuddies.add(recipientBuddies);

            return updatedBuddies;
        }
    }
}
