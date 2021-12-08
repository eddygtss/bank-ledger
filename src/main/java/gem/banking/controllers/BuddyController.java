package gem.banking.controllers;

import gem.banking.enums.PrivacyLevel;
import gem.banking.exceptions.AccountInvalidException;
import gem.banking.models.Account;
import gem.banking.models.Buddy;
import gem.banking.models.Profile;
import gem.banking.models.Request;
import gem.banking.services.AccountService;
import gem.banking.services.AuthenticationService;
import gem.banking.services.BuddyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class BuddyController {
    @Autowired
    public AccountService accountService;
    @Autowired
    public BuddyService buddyService;
    @Autowired
    public AuthenticationService authenticationService;

    @GetMapping("/buddies")
    public Buddy getBuddyInfo() throws InterruptedException, ExecutionException, AccountInvalidException {
        return accountService.getBuddy(authenticationService.getCurrentUser());
    }

//    @PutMapping("/update-buddies")
//    public ResponseEntity<String> updateAccountsBuddies() throws Exception {
//        List<String> allAccounts = accountService.getAllDocumentIds();
//        int num = 0;
//
//        for (String documentId: allAccounts) {
//            accountService.updateBuddy(
//                    new Buddy(
//                    documentId,
//                    PrivacyLevel.PRIVATE,
//                    new ArrayList<>(),
//                    new ArrayList<>(),
//                    new ArrayList<>()
//            ));
//            num += 1;
//        }
//
//        return ResponseEntity.ok("Updated " + num + " accounts.");
//    }

    @PostMapping("/add-buddy")
    public ResponseEntity<String> addBuddy(@RequestBody Request buddyRequest) throws Exception {
        String requester = authenticationService.getCurrentUser();
        String responder = buddyRequest.getResponder().toLowerCase();
        buddyRequest.setResponder(responder);

        if (requester.substring(5).equals(buddyRequest.getResponder())){
            return ResponseEntity.badRequest().body("You cannot add yourself as a buddy.");
        }

        Buddy requesterBuddyInfo = accountService.getBuddy(requester);
        buddyRequest.setRequester(requester.substring(5));

        try {
            Buddy responderBuddyInfo = accountService.getBuddy("user_" + buddyRequest.getResponder());

            List<Buddy> updatedBuddies =
                    buddyService.requestBuddy(requesterBuddyInfo, responderBuddyInfo, buddyRequest);

            for (Buddy buddy: updatedBuddies) {
                accountService.updateBuddy(buddy);
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

        return new ResponseEntity<>("Successfully sent " + buddyRequest.getResponder() + " a buddy request.", HttpStatus.CREATED);
    }

    @PostMapping("/approve-buddy")
    public ResponseEntity<String> approveBuddy(@RequestBody String id) throws Exception {
        String currentUser = authenticationService.getCurrentUser();
        Buddy responderBuddyInfo = accountService.getBuddy(currentUser);
        Profile responderProfile = accountService.getProfile(currentUser);
        List<Request> responderRequests = responderBuddyInfo.getBuddyRequests();

        Request parsed = new Request(id);

        for (Request request: responderRequests) {
            if (request.getId().equals(parsed.getId())) {
                String requester = "user_" + request.getRequester();
                Profile requesterProfile = accountService.getProfile(requester);
                Buddy requesterBuddyInfo = accountService.getBuddy(requester);

                List<Buddy> updatedBuddies =
                        buddyService.approveBuddyRequest(
                                requesterBuddyInfo,
                                responderBuddyInfo,
                                requesterProfile,
                                responderProfile,
                                request
                        );

                for (Buddy buddy: updatedBuddies) {
                    accountService.updateBuddy(buddy);
                }

                return ResponseEntity.ok("You are now buddies with " + requesterProfile.getFirstName() + " " + requesterProfile.getLastName());
            }
        }

        return ResponseEntity.badRequest().body("There was an error approving this request.");
    }

    @PostMapping("/deny-buddy")
    public ResponseEntity<String> denyBuddy(@RequestBody String id) throws Exception {
        Buddy responderBuddyInfo = accountService.getBuddy(authenticationService.getCurrentUser());
        List<Request> responderBuddyRequests = responderBuddyInfo.getBuddyRequests();

        Request parsed = new Request(id);

        for (Request request: responderBuddyRequests) {
            if (request.getId().equals(parsed.getId())) {
                String requester = "user_" + request.getRequester();
                Account requesterAccount = accountService.getAccount(requester);
                Buddy requesterBuddyInfo = accountService.getBuddy(requester);

                List<Buddy> updatedBuddies =
                        buddyService.denyBuddyRequest(requesterBuddyInfo, responderBuddyInfo, request);

                for (Buddy buddy: updatedBuddies) {
                    accountService.updateBuddy(buddy);
                }

                return ResponseEntity.ok("Denied buddy request from " + requesterAccount.getFirstName() + " " + requesterAccount.getLastName());
            }
        }

        return ResponseEntity.badRequest().body("There was an error denying this request.");
    }
}
