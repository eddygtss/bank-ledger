package gem.banking.controllers;

import gem.banking.models.AccountInfo;
import gem.banking.models.Request;
import gem.banking.services.AccountService;
import gem.banking.services.AuthenticationService;
import gem.banking.services.RequestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class RequestController {
    @Autowired
    public AccountService accountService;
    @Autowired
    public RequestService requestService;
    @Autowired
    public AuthenticationService authenticationService;

    @PostMapping("/request")
    public ResponseEntity<String> requestFunds(@RequestBody Request requestFundsTransaction) throws Exception {
        String requester = authenticationService.getCurrentUser();

        if (requester.substring(5).equals(requestFundsTransaction.getResponder())){
            return ResponseEntity.badRequest().body("You cannot request money from yourself.");
        }

        AccountInfo requesterUserAccount = accountService.getAccountInfo(requester);
        requestFundsTransaction.setRequester(requester.substring(5));


        try {
            AccountInfo recipientUserAccount = accountService.getAccountInfo("user_" + requestFundsTransaction.getResponder());

            List<AccountInfo> updatedAccounts =
                    requestService.Request(requestFundsTransaction, requesterUserAccount, recipientUserAccount);

            // Looping for each AccountInfo object in the updatedAccounts list and update the accounts on the database.
            for (AccountInfo account: updatedAccounts) {
                accountService.updateAccountInfo(account);
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

        return new ResponseEntity<>("Successfully sent " + requestFundsTransaction.getResponder() + " a request for $" + requestFundsTransaction.getAmount(), HttpStatus.CREATED);
    }

    @PostMapping("/approve-request")
    public ResponseEntity<String> approveRequestedFunds(@RequestBody String id) throws Exception {
        AccountInfo responderAccountInfo = accountService.getAccountInfo(authenticationService.getCurrentUser());
        List<Request> responderRequests = responderAccountInfo.getRequestHistory();

        Request parsed = new Request(id);

        // Loop through each request in responderRequest and locate the correct request object by requestId
        for (Request request: responderRequests) {
            if (request.getId().equals(parsed.getId())){
                String requester = "user_" + request.getRequester();
                AccountInfo requesterAccountInfo = accountService.getAccountInfo(requester);

                List<AccountInfo> updatedAccounts =
                        requestService.approveRequest(request, responderAccountInfo, requesterAccountInfo);

                // Looping for each AccountInfo object in the updatedAccounts list and update the accounts on the database.
                for (AccountInfo account: updatedAccounts) {
                    accountService.updateAccountInfo(account);
                }

                return ResponseEntity.ok("Sent " + requester.substring(5) + " $" + request.getAmount());
            }
        }

        return ResponseEntity.badRequest().body("The request approved was not found in the database.");
    }

    @PostMapping("/deny-request")
    public ResponseEntity<String> denyRequestedFunds(@RequestBody String id) throws Exception {
        AccountInfo responderAccountInfo = accountService.getAccountInfo(authenticationService.getCurrentUser());
        List<Request> responderRequests = responderAccountInfo.getRequestHistory();

        Request parsed = new Request(id);

        for (Request request: responderRequests) {
            if (request.getId().equals(parsed.getId())){
                String requester = "user_" + request.getRequester();
                AccountInfo requesterAccountInfo = accountService.getAccountInfo(requester);

                List<AccountInfo> updatedAccounts =
                        requestService.denyRequest(request, responderAccountInfo, requesterAccountInfo);

                // Looping for each AccountInfo object in the updatedAccounts list and update the accounts on the database.
                for (AccountInfo account: updatedAccounts) {
                    accountService.updateAccountInfo(account);
                }

                return ResponseEntity.ok("Sent " + requester.substring(5) + " $" + request.getAmount());
            }
        }

        return ResponseEntity.badRequest().body("The request denied was not found in the database.");
    }
}
