package gem.banking.services;

import gem.banking.exceptions.InsufficientFundsException;
import gem.banking.exceptions.InvalidTransactionException;
import gem.banking.models.AccountInfo;
import gem.banking.models.Transaction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class AccountInfoService {

    public AccountInfo recordTransaction(Transaction transaction, AccountInfo accountInfo) throws InsufficientFundsException, InvalidTransactionException {
        List<Transaction> transactions = accountInfo.getTransactionHistory();
        double balance = accountInfo.getBalance();

        if (transaction.getAmount() <= 0.0) throw new InvalidTransactionException("Amount must be a positive value.");


        if (transaction.getDate() == null) {
            transaction.setDate(new Date());
        }

        if (transaction.getTransactionType() == Transaction.TransactionType.DEPOSIT) {
            transactions.add(transaction);
            balance += transaction.getAmount();
        } else if (transaction.getTransactionType() == Transaction.TransactionType.WITHDRAWAL) {
            if (balance - transaction.getAmount() < 0.0) {
                throw new InsufficientFundsException(String.format("Insufficient funds. Current balance is $%.2f", balance));
            }
            transactions.add(transaction);
            balance -= transaction.getAmount();
        } else {
            throw new InvalidTransactionException("Invalid or missing transaction type");
        }

        accountInfo.setTransactionHistory(transactions);
        accountInfo.setBalance(balance);

        log.debug("Transaction memo:" + transaction.getMemo() + " - Amount: " + transaction.getTransactionType() + " - New Balance: " + balance);

        return accountInfo;
    }
}
