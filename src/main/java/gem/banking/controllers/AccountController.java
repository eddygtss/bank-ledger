package gem.banking.controllers;

import gem.banking.models.*;
import gem.banking.services.AccountService;
import gem.banking.services.AuthenticationService;
import gem.banking.services.UserService;
import gem.banking.utililty.JWTUtility;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class AccountController {

    @Autowired
    public AccountService accountService;

    @Autowired
    public AuthenticationService authenticationService;

    @Autowired
    private JWTUtility jwtUtility;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    // This controller defines all of our API endpoints for Accounts.
    public AccountController(AccountService accountService){
        this.accountService = accountService;
    }

    @PostMapping("/authenticate")
    public JwtResponse authenticate(@RequestBody JwtRequest jwtRequest) throws Exception {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            jwtRequest.getUsername(),
                            jwtRequest.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            e.printStackTrace();
        }

        final UserDetails userDetails
                = userService.loadUserByUsername(jwtRequest.getUsername());

        final String token =
                jwtUtility.generateToken(userDetails);

        return new JwtResponse(token);
    }

    // Create new user account API endpoint (POST/Create)
    @PostMapping("/create")
    public ResponseEntity<Void> createAccount(@RequestBody Account createAccountRequest) throws InterruptedException, ExecutionException {
        authenticationService.createUser("user_" + createAccountRequest.getUsername(), createAccountRequest.getUsername(), createAccountRequest.getPassword());

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

//     Get Transactions API endpoint (GET/Read)
//    @GetMapping("/transactions")
//    public List<Transaction> retrieveTransactionHistory() throws Exception  {
//        return accountService.getAccount(authenticationService.getCurrentUser()).getTransactionHistory();
//    }

    // Get Account API endpoint (GET/Read)
    @GetMapping("/account")
    public Account getAccount(@RequestParam String documentId) throws InterruptedException, ExecutionException {
        return accountService.getAccount(documentId);
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

    // This is a test endpoint, if you send a GET request to localhost:port the server is running on it will return
    // a 200 status for OK and the text "Test Get Endpoint is Working!"
    @GetMapping("/test")
    public ResponseEntity<String> testGetEndpoint() { return ResponseEntity.ok("Test Get Endpoint is Working!"); }

}
