package gem.banking.controllers;

import gem.banking.models.AccountInfo;
import gem.banking.models.Transaction;
import gem.banking.models.TransactionId;
import gem.banking.services.AccountService;
import gem.banking.services.AuthenticationService;
import gem.banking.services.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class TransactionController {
    @Autowired
    public AccountService accountService;
    @Autowired
    public TransactionService transactionService;
    @Autowired
    public AuthenticationService authenticationService;

    // This controller defines all of our API endpoints for Accounts.
    public TransactionController(AccountService accountService){
        this.accountService = accountService;
    }

    // Get Transactions API endpoint (GET/Read)
    @GetMapping("/transactions")
    public List<Transaction> retrieveTransactionHistory() throws Exception  {
        AccountInfo accountInfo = accountService.getAccountInfo(authenticationService.getCurrentUser());

        return accountInfo.getTransactionHistory();
    }

    // Post (DEPOSIT/WITHDRAWAL) Transactions API endpoint (POST/Create)
    @PostMapping("/transactions")
    public ResponseEntity<Void> createTransaction(@RequestBody Transaction createTransactionRequest) throws Exception {
        AccountInfo accountInfo = accountService.getAccountInfo(authenticationService.getCurrentUser());

        accountService.updateAccountInfo(transactionService.recordTransaction(createTransactionRequest, accountInfo));

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // Send Transaction API endpoint (POST/Create)
    @PostMapping("/send")
    public ResponseEntity<String> sendFunds(@RequestBody Transaction sendFundsTransaction) throws Exception {
        String sender = authenticationService.getCurrentUser();

        AccountInfo currentUserAccount = accountService.getAccountInfo(sender);
        sendFundsTransaction.setSender(sender.substring(5));

        try {
            AccountInfo recipientUserAccount = accountService.getAccountInfo("user_" + sendFundsTransaction.getRecipient());

            List<AccountInfo> updatedAccounts =
                    transactionService.sendTransaction(sendFundsTransaction, currentUserAccount, recipientUserAccount);

            // Looping for each AccountInfo object in the updatedAccounts list and update the accounts on the database.
            for (AccountInfo account: updatedAccounts) {
                accountService.updateAccountInfo(account);
            }

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

        return new ResponseEntity<>("Successfully sent " + sendFundsTransaction.getRecipient() + " $" + sendFundsTransaction.getAmount(), HttpStatus.CREATED);
    }

    @PostMapping("/request")
    public ResponseEntity<String> requestFunds(@RequestBody Transaction requestFundsTransaction) throws Exception {
        String requester = authenticationService.getCurrentUser();

        if (requester.substring(5).equals(requestFundsTransaction.getRecipient())){
            return ResponseEntity.badRequest().body("You cannot request money from yourself.");
        }

        AccountInfo requesterUserAccount = accountService.getAccountInfo(requester);
        requestFundsTransaction.setSender(requester.substring(5));


        try {
            AccountInfo recipientUserAccount = accountService.getAccountInfo("user_" + requestFundsTransaction.getRecipient());

            List<AccountInfo> updatedAccounts =
                    transactionService.requestTransaction(requestFundsTransaction, requesterUserAccount, recipientUserAccount);

            // Looping for each AccountInfo object in the updatedAccounts list and update the accounts on the database.
            for (AccountInfo account: updatedAccounts) {
                accountService.updateAccountInfo(account);
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

        return new ResponseEntity<>("Successfully sent " + requestFundsTransaction.getRecipient() + " a request for $" + requestFundsTransaction.getAmount(), HttpStatus.CREATED);
    }

    @PostMapping("/approveRequest")
    public ResponseEntity<String> approveRequestedFunds(@RequestBody TransactionId transactionId) throws Exception {
        String currentUser = authenticationService.getCurrentUser();

        AccountInfo approverAccount = accountService.getAccountInfo(currentUser);
        Transaction approvedTransaction = approverAccount.getTransactionHistory().get(transactionId.getTransactionId());

        String recipient = "user_" + approvedTransaction.getSender();
        AccountInfo recipientAccount = accountService.getAccountInfo(recipient);


        List<AccountInfo> updatedAccounts =
                transactionService.approveTransaction(approvedTransaction, approverAccount, recipientAccount);

        // Looping for each AccountInfo object in the updatedAccounts list and update the accounts on the database.
        for (AccountInfo account: updatedAccounts) {
            accountService.updateAccountInfo(account);
        }

        return ResponseEntity.ok("Sent " + recipient.substring(5) + " $" + approvedTransaction.getAmount());
    }

    @PostMapping("/denyRequest")
    public ResponseEntity<String> denyRequestedFunds(@RequestBody TransactionId transactionId) throws Exception {
        String currentUser = authenticationService.getCurrentUser();

        AccountInfo denierAccount = accountService.getAccountInfo(currentUser);
        Transaction deniedTransaction = denierAccount.getTransactionHistory().get(transactionId.getTransactionId());

        String recipient = "user_" + deniedTransaction.getSender();
        AccountInfo recipientAccount = accountService.getAccountInfo(recipient);

        List<AccountInfo> updatedAccounts =
                transactionService.denyTransaction(deniedTransaction, denierAccount, recipientAccount);

        // Looping for each AccountInfo object in the updatedAccounts list and update the accounts on the database.
        for (AccountInfo account: updatedAccounts) {
            accountService.updateAccountInfo(account);
        }

        return ResponseEntity.ok("Sent " + recipient.substring(5) + " $" + deniedTransaction.getAmount());
    }
}
