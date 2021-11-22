package gem.banking.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Transaction {
    private String id = UUID.randomUUID().toString();
    private String memo = "";
    private String sender = "";
    private String recipient = "";
    private double  amount;
    private String date;
    private TransactionType transactionType;
    private TransactionStatus transactionStatus;

    public enum TransactionType {
        WITHDRAWAL, DEPOSIT, SEND, REQUEST, TRANSFER;
    }

    public enum TransactionStatus {
        PENDING, APPROVED, DENIED, SENT, RECEIVED, PROCESSED;
    }

    public Transaction(Transaction copy) {
        this.id = copy.id;
        this.memo = copy.memo;
        this.sender = copy.sender;
        this.recipient = copy.recipient;
        this.amount = copy.amount;
        this.date = copy.date;
        this.transactionType = copy.transactionType;
        this.transactionStatus = copy.transactionStatus;
    }
}
