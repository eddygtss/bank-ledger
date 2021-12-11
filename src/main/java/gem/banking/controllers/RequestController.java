package gem.banking.controllers;

import gem.banking.models.AccountInfo;
import gem.banking.models.Buddy;
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
        String responder = requestFundsTransaction.getResponder().toLowerCase();
        requestFundsTransaction.setResponder(responder);

        if (requester.substring(5).equals(responder)){
            return ResponseEntity.badRequest().body("You cannot request money from yourself.");
        }

        AccountInfo requesterUserAccount = accountService.getAccountInfo(requester);
        requestFundsTransaction.setRequester(requester.substring(5));

        try {
            AccountInfo recipientUserAccount = accountService.getAccountInfo("user_" + responder);

            List<AccountInfo> updatedAccounts =
                    requestService.Request(requestFundsTransaction, requesterUserAccount, recipientUserAccount);

            // Looping for each AccountInfo object in the updatedAccounts list and update the accounts on the database.
            for (AccountInfo account: updatedAccounts) {
                accountService.updateAccountInfo(account);
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

        return new ResponseEntity<>("Successfully sent " + responder + " a request for $" + requestFundsTransaction.getAmount(), HttpStatus.CREATED);
    }

    @PostMapping("/approve-request")
    public ResponseEntity<String> approveRequestedFunds(@RequestBody String id) throws Exception {
        AccountInfo responderAccountInfo = accountService.getAccountInfo(authenticationService.getCurrentUser());
        Buddy responderBuddies = accountService.getBuddy(authenticationService.getCurrentUser());
        List<Request> responderRequests = responderAccountInfo.getRequestHistory();

        Request parsed = new Request(id);

        // Loop through each request in responderRequest and locate the correct request object by requestId
        for (Request request: responderRequests) {
            if (request.getId().equals(parsed.getId())){
                String requester = "user_" + request.getRequester();
                AccountInfo requesterAccountInfo = accountService.getAccountInfo(requester);
                Buddy requesterBuddies = accountService.getBuddy(requester);

                List<Object> updatedAccounts =
                        requestService.approveRequest(
                                request,
                                responderAccountInfo,
                                requesterAccountInfo,
                                responderBuddies,
                                requesterBuddies,
                                "account"
                        );

                List<Object> updatedBuddies =
                        requestService.approveRequest(
                                request,
                                responderAccountInfo,
                                requesterAccountInfo,
                                responderBuddies,
                                requesterBuddies,
                                "buddy"
                        );

                // Looping for each AccountInfo object in the updatedAccounts list and update the accounts on the database.
                for (Object account: updatedAccounts) {
                    accountService.updateAccountInfo((AccountInfo) account);
                }
                for (Object buddies: updatedBuddies) {
                    accountService.updateBuddy((Buddy) buddies);
                }

                return ResponseEntity.ok("Sent " + requester.substring(5) + " $" + request.getAmount());
            }
        }

        return ResponseEntity.badRequest().body("There was an error approving this request.");
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

                return ResponseEntity.ok("Denied request from " + requester.substring(5) + " for $" + request.getAmount());
            }
        }

        return ResponseEntity.badRequest().body("There was an error denying this request.");
    }
}
