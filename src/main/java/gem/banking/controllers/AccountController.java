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

    // Post Transactions API endpoint (POST/Create)
    @PostMapping("/transactions")
    public ResponseEntity<Void> createTransaction(@RequestBody Transaction createTransactionRequest) throws Exception {
        AccountInfo accountInfo = accountService.getAccountInfo(authenticationService.getCurrentUser());

        accountService.updateAccountInfo(transactionService.recordTransaction(createTransactionRequest, accountInfo));

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // Send Transaction API endpoint (POST/Create)
    @PostMapping("/send")
    public ResponseEntity<String> sendFunds(@RequestBody Transaction createTransactionRequest) throws Exception {
        String currentUser = authenticationService.getCurrentUser();
        AccountInfo currentUserAccount = accountService.getAccountInfo(currentUser);

        try {
            AccountInfo recipientUserAccount = accountService.getAccountInfo("user_" + createTransactionRequest.getGemUser());
            accountService.updateAccountInfo(transactionService.recordTransaction(createTransactionRequest, currentUserAccount));

            createTransactionRequest.setTransactionType(Transaction.TransactionType.RECEIVED);
            createTransactionRequest.setGemUser(currentUser.substring(5));

            accountService.updateAccountInfo(transactionService.recordTransaction(createTransactionRequest, recipientUserAccount));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

        return ResponseEntity.ok("Successfully sent " + createTransactionRequest.getGemUser() + " $" + createTransactionRequest.getAmount());
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
