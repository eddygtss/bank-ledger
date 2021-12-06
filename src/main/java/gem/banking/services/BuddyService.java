package gem.banking.services;

import gem.banking.enums.Status;
import gem.banking.exceptions.BuddyExistsException;
import gem.banking.models.Buddy;
import gem.banking.models.Request;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class BuddyService {
    public List<Buddy> requestBuddy(
            Buddy requesterBuddy,
            Buddy responderBuddy,
            Request buddyRequest
    ) throws BuddyExistsException {
        List<Buddy> updatedAccounts = new ArrayList<>();
        List<String> buddyList = requesterBuddy.getBuddyList();
        List<Request> requestersRequestList = requesterBuddy.getBuddyRequests();
        List<Request> respondersRequestList = responderBuddy.getBuddyRequests();
        String responder = buddyRequest.getResponder();

        for (String buddy:buddyList) {
            if (buddy.equals(responder)) {
                throw new BuddyExistsException("You are already buddies with " + responder);
            }
        }

        for (Request request:requestersRequestList) {
            if (buddyRequest.getId().equals(request.getId())) {
                throw new BuddyExistsException("You have already added this buddy and the request is pending, please wait until the request is approved or denied.");
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        String currentTime = LocalDateTime.now().format(formatter);
        buddyRequest.setDate(currentTime);

        buddyRequest.setRequestStatus(Status.PENDING);

        respondersRequestList.add(buddyRequest);
        responderBuddy.setBuddyRequests(respondersRequestList);

        Request requesterRequest = new Request(buddyRequest);
        requesterRequest.setRequestStatus(Status.SENT);

        requestersRequestList.add(requesterRequest);
        requesterBuddy.setBuddyRequests(requestersRequestList);

        updatedAccounts.add(requesterBuddy);
        updatedAccounts.add(responderBuddy);

        return updatedAccounts;
    }

    public List<Buddy> approveBuddyRequest(
            Buddy requesterBuddy,
            Buddy responderBuddy,
            Request buddyRequest
    ) throws BuddyExistsException {
        List<Buddy> updatedBuddies = new ArrayList<>();
        List<String> requesterBuddyList = requesterBuddy.getBuddyList();
        List<String> responderBuddyList = responderBuddy.getBuddyList();

        List<Request> requestersRequestList = requesterBuddy.getBuddyRequests();
        List<Request> respondersRequestList = responderBuddy.getBuddyRequests();

        respondersRequestList.remove(buddyRequest);
        requestersRequestList.removeIf(requesterRequest -> requesterRequest.getId().equals(buddyRequest.getId()));

        buddyRequest.setRequestStatus(Status.APPROVED);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        String currentTime = LocalDateTime.now().format(formatter);
        buddyRequest.setDate(currentTime);

        requestersRequestList.add(buddyRequest);
        respondersRequestList.add(buddyRequest);

        requesterBuddyList.add(buddyRequest.getResponder());
        requesterBuddy.setBuddyList(requesterBuddyList);

        responderBuddyList.add(buddyRequest.getRequester());
        responderBuddy.setBuddyList(responderBuddyList);

        updatedBuddies.add(requesterBuddy);
        updatedBuddies.add(responderBuddy);

        return updatedBuddies;
    }

    public List<Buddy> denyBuddyRequest(
            Buddy requesterBuddy,
            Buddy responderBuddy,
            Request buddyRequest
    ) {
        List<Buddy> updatedBuddies = new ArrayList<>();
        List<Request> requestersRequestList = requesterBuddy.getBuddyRequests();
        List<Request> respondersRequestList = responderBuddy.getBuddyRequests();

        respondersRequestList.remove(buddyRequest);
        requestersRequestList.removeIf(requesterRequest -> requesterRequest.getId().equals(buddyRequest.getId()));

        buddyRequest.setRequestStatus(Status.DENIED);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        String currentTime = LocalDateTime.now().format(formatter);
        buddyRequest.setDate(currentTime);

        requestersRequestList.add(buddyRequest);
        respondersRequestList.add(buddyRequest);

        updatedBuddies.add(requesterBuddy);
        updatedBuddies.add(responderBuddy);

        return updatedBuddies;
    }
}
