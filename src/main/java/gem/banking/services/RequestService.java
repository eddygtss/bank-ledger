package gem.banking.services;

import gem.banking.enums.Status;
import gem.banking.enums.TransactionType;
import gem.banking.exceptions.InsufficientFundsException;
import gem.banking.exceptions.InvalidRequesteeException;
import gem.banking.exceptions.InvalidTransactionException;
import gem.banking.models.AccountInfo;
import gem.banking.models.Request;
import gem.banking.models.Transaction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class RequestService {
    public List<AccountInfo> Request(
            Request request,
            AccountInfo requesterAccountInfo,
            AccountInfo responderAccountInfo
    ) throws InsufficientFundsException, InvalidTransactionException {
        if (request.getRequester().equals(responderAccountInfo.getDocumentId().substring(5))) {
            throw new InvalidRequesteeException("Error: Unable to request money from yourself.");
        }
        if (request.getAmount() <= 0.0) throw new InvalidTransactionException("Amount must be a positive value.");

        List<AccountInfo> updatedAccounts = new ArrayList<>();

        List<Request> requesterRequests = requesterAccountInfo.getRequestHistory();
        List<Request> responderRequests = responderAccountInfo.getRequestHistory();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        String currentTime = LocalDateTime.now().format(formatter);
        request.setDate(currentTime);


        // RequestStatus for the responder so they see PENDING for a request in their requests list
        request.setRequestStatus(Status.PENDING);

        responderRequests.add(request);
        responderAccountInfo.setRequestHistory(responderRequests);

        // RequestStatus for the requester so they see SENT for their request
        Request requesterRequest = new Request(request);
        requesterRequest.setRequestStatus(Status.SENT);

        requesterRequests.add(requesterRequest);
        requesterAccountInfo.setRequestHistory(requesterRequests);

        // Adding the requester and responder account infos into the updated accounts list to return
        updatedAccounts.add(requesterAccountInfo);
        updatedAccounts.add(responderAccountInfo);

        return updatedAccounts;
    }

    public List<AccountInfo> approveRequest(Request request,
                                            AccountInfo responderAccountInfo,
                                            AccountInfo requesterAccountInfo)
            throws InsufficientFundsException, InvalidRequesteeException {
        List<AccountInfo> updatedAccounts = new ArrayList<>();

        List<Transaction> responderTransactions = responderAccountInfo.getTransactionHistory();
        List<Transaction> requesterTransactions = requesterAccountInfo.getTransactionHistory();

        List<Request> responderRequests = responderAccountInfo.getRequestHistory();
        List<Request> requesterRequests = requesterAccountInfo.getRequestHistory();

        double responderBalance = responderAccountInfo.getBalance();
        double requesterBalance = requesterAccountInfo.getBalance();

        // We check if the person approving is equal to the responder of the request
        if (responderAccountInfo.getDocumentId().substring(5).equals(request.getResponder())) {
            if (responderBalance - request.getAmount() < 0.0) {
                throw new InsufficientFundsException(String.format("Insufficient funds. Current balance is $%.2f", responderBalance));
            }
            // We want to delete the old request information from both the requester and the responder
            responderRequests.remove(request);
            requesterRequests.removeIf(requesterRequest -> requesterRequest.getId().equals(request.getId()));

            request.setRequestStatus(Status.APPROVED);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            String currentTime = LocalDateTime.now().format(formatter);
            request.setDate(currentTime);

            Transaction approvedTransaction =
                    new Transaction(
                            UUID.randomUUID().toString(),
                            request.getMemo(),
                            request.getResponder(),
                            request.getRequester(),
                            request.getAmount(),
                            request.getDate(),
                            TransactionType.REQUEST,
                            Status.SENT,
                            request.getPrivacySetting()
                    );

            responderTransactions.add(approvedTransaction);
            responderRequests.add(request);
            responderBalance -= request.getAmount();

            // Updating the senders account
            responderAccountInfo.setTransactionHistory(responderTransactions);
            responderAccountInfo.setRequestHistory(responderRequests);
            responderAccountInfo.setBalance(responderBalance);

            // New Transaction object for the requester so we can change status.
            Transaction requesterTransaction = new Transaction(approvedTransaction);
            requesterTransaction.setStatus(Status.RECEIVED);

            requesterTransactions.add(requesterTransaction);
            requesterRequests.add(request);
            requesterBalance += request.getAmount();

            // Updating the requesters account
            requesterAccountInfo.setTransactionHistory(requesterTransactions);
            requesterAccountInfo.setRequestHistory(requesterRequests);
            requesterAccountInfo.setBalance(requesterBalance);
        } else {
            throw new InvalidRequesteeException("Error: Unable to send yourself money.");
        }

        // Adding the sender and recipient account infos into the updated accounts list to return
        updatedAccounts.add(responderAccountInfo);
        updatedAccounts.add(requesterAccountInfo);

        return updatedAccounts;
    }

    public List<AccountInfo> denyRequest(Request request,
                                         AccountInfo responderAccountInfo,
                                         AccountInfo requesterAccountInfo)
            throws InsufficientFundsException, InvalidTransactionException {
        List<AccountInfo> updatedAccounts = new ArrayList<>();

        List<Request> responderRequests = responderAccountInfo.getRequestHistory();
        List<Request> requesterRequests = requesterAccountInfo.getRequestHistory();

        // We check if the person denying is equal to the original responder of the request
        if (responderAccountInfo.getDocumentId().substring(5).equals(request.getResponder())) {
            responderRequests.remove(request);
            requesterRequests.removeIf(requesterRequest -> requesterRequest.getId().equals(request.getId()));

            // We updated the time and status for when the request was denied.
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
            String currentTime = LocalDateTime.now().format(formatter);
            request.setDate(currentTime);
            request.setRequestStatus(Status.DENIED);

            // Adding the new request to requests list and updating the account info with the updated requests list
            requesterRequests.add(request);
            requesterAccountInfo.setRequestHistory(requesterRequests);

            responderRequests.add(request);
            responderAccountInfo.setRequestHistory(responderRequests);
        } else {
            throw new InvalidTransactionException("Invalid or missing transaction type");
        }

        // Adding the requester and responder account infos into the updated accounts list to return
        updatedAccounts.add(responderAccountInfo);
        updatedAccounts.add(requesterAccountInfo);

        return updatedAccounts;
    }
}
