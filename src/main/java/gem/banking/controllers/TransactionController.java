package gem.banking.controllers;

import gem.banking.models.AccountInfo;
import gem.banking.models.Transaction;
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

    // This controller defines all of our API endpoints for Transactions.
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

        if (sender.substring(5).equals(sendFundsTransaction.getRecipient())){
            return ResponseEntity.badRequest().body("You cannot send money to yourself.");
        }

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
}
