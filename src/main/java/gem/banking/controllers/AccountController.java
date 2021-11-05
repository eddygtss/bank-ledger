package gem.banking.controllers;

import gem.banking.exceptions.AccountInvalidException;
import gem.banking.models.Account;
import gem.banking.models.AccountInfo;
import gem.banking.models.Transaction;
import gem.banking.services.TransactionService;
import gem.banking.services.AccountService;
import gem.banking.services.AuthenticationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class AccountController {
    @Autowired
    public AccountService accountService;
    @Autowired
    public TransactionService transactionService;
    @Autowired
    public AuthenticationService authenticationService;

    // This controller defines all of our API endpoints for Accounts.
    public AccountController(AccountService accountService){
        this.accountService = accountService;
    }

    // Create new user account API endpoint (POST/Create)
    @PostMapping("/create")
    public ResponseEntity<Void> createAccount(@RequestBody Account createAccountRequest) throws InterruptedException, ExecutionException {
        authenticationService.createUser(createAccountRequest);

        return new ResponseEntity<>(HttpStatus.CREATED);
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

        return ResponseEntity.ok("Successfully sent " + sendFundsTransaction.getRecipient() + " $" + sendFundsTransaction.getAmount());
    }

    @PostMapping("/request")
    public ResponseEntity<String> requestFunds(@RequestBody Transaction requestFundsTransaction) throws Exception {
        String requester = authenticationService.getCurrentUser();

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

        return ResponseEntity.ok("Successfully sent " + requestFundsTransaction.getRecipient() + " a request for $" + requestFundsTransaction.getAmount());
    }

    @PostMapping("/approveRequest")
    public ResponseEntity<String> approveRequestedFunds(@RequestBody int approvedTransactionRequest) throws Exception {
        //TODO get the correct transaction by getting accountInfo and getting transaction by index number
        // then set the transactionStatus to RECEIVED for the requester and SENT for the recipient of the request

        return ResponseEntity.ok("TODO");
    }

    @PostMapping("/denyRequest")
    public ResponseEntity<String> denyRequestedFunds(@RequestBody int deniedTransactionRequest) throws Exception {
        //TODO get the correct transaction by getting accountInfo and getting transaction by index number
        // then set the transactionStatus to DENIED for the requester and DENIED for the recipient of the request

        return ResponseEntity.ok("TODO");
    }

    // Get Account API endpoint (GET/Read)
    @GetMapping("/account")
    public AccountInfo getAccount() throws InterruptedException, ExecutionException, AccountInvalidException {
        return accountService.getAccountInfo(authenticationService.getCurrentUser());
    }

    // Update Account API endpoint (PUT/Update)
    @PutMapping("/update")
    public String updateAccount(@RequestBody Account account) throws InterruptedException, ExecutionException {
        return accountService.updateAccount(account);
    }

    // Delete Account API endpoint (Delete)
    @DeleteMapping("/delete")
    public String deleteAccount(@RequestParam String documentId) throws InterruptedException, ExecutionException {
        return accountService.deleteAccount(documentId);
    }

    @PostMapping(value = "/login")
    public ResponseEntity<Void> login(@RequestBody Account loginAccountRequest, final HttpServletRequest request) {
        authenticationService.login(request, loginAccountRequest.getUsername(), loginAccountRequest.getPassword());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout() {
        authenticationService.logout();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // This is a test endpoint, if you send a GET request to localhost:port the server is running on it will return
    // a 200 status for OK and the text "Test Get Endpoint is Working!"
    @GetMapping("/test")
    public ResponseEntity<String> testGetEndpoint() { return ResponseEntity.ok("Test Get Endpoint is Working!"); }

}
