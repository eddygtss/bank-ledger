package gem.banking.models;

import gem.banking.enums.PrivacyLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Getter
@Setter
@RequiredArgsConstructor
public class Buddy {
    private String documentId;
    private PrivacyLevel privacySetting;
    private List<Profile> buddyList;
    private List<Request> buddyRequests;
    private List<Transaction> buddyTransactions;

    public Buddy(String documentId, PrivacyLevel privacySetting, List<Profile> buddyList, List<Request> buddyRequests, List<Transaction> buddyTransactions) {
        this.documentId = documentId;
        this.privacySetting = privacySetting;
        this.buddyList = buddyList;
        this.buddyRequests = buddyRequests;
        this.buddyTransactions = buddyTransactions;
    }

    public List<Transaction> getBuddyTransactions() {
        return buddyTransactions;
    }
    public List<Profile> getBuddyList() {
        return buddyList;
    }
    public List<Request> getBuddyRequests() {
        return buddyRequests;
    }
}
