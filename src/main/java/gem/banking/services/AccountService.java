package gem.banking.services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import gem.banking.exceptions.AccountInvalidException;
import gem.banking.models.Account;
import gem.banking.models.AccountInfo;
import gem.banking.models.Buddy;
import gem.banking.models.Profile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class AccountService {
    public static final String COL_USERS ="users";
    public static final String COL_BANK_ACCOUNTS ="bank_accounts";
    public static final String COL_BUDDIES ="buddies";
    public static final String COL_PROFILES ="profiles";

    public String createAccount(Account account, AccountInfo accountInfo, Buddy buddies, Profile profile) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(COL_USERS).document(account.getDocumentId()).set(account);
        dbFirestore.collection(COL_BANK_ACCOUNTS).document(accountInfo.getDocumentId()).set(accountInfo);
        dbFirestore.collection(COL_BUDDIES).document(buddies.getDocumentId()).set(buddies);
        dbFirestore.collection(COL_PROFILES).document(profile.getDocumentId()).set(profile);
        return "Successfully created account at " + collectionsApiFuture.get().getUpdateTime().toString();
    }

    public Account getAccount(String documentId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference userDocumentReference = dbFirestore.collection(COL_USERS).document(documentId);
        ApiFuture<DocumentSnapshot> userFuture = userDocumentReference.get();
        DocumentSnapshot userDocument = userFuture.get();
        Account account;

        if (userDocument.exists()) {
            account = userDocument.toObject(Account.class);
            return account;
        }
        return null;
    }

    public List<String> getAllDocumentIds() throws ExecutionException, InterruptedException {
        List<String> allAccounts = new ArrayList<>();
        Firestore dbFirestore = FirestoreClient.getFirestore();
        Iterable<DocumentReference> userDocumentReferences = dbFirestore.collection(COL_USERS).listDocuments();

        for (DocumentReference documentReference: userDocumentReferences) {
            ApiFuture<DocumentSnapshot> userFuture = documentReference.get();
            DocumentSnapshot userDocument = userFuture.get();
            Account account = userDocument.toObject(Account.class);

            assert account != null;
            allAccounts.add(account.getDocumentId());
        }

        return allAccounts;
    }

    public List<Account> getAllAccounts() throws ExecutionException, InterruptedException {
        List<Account> allAccounts = new ArrayList<>();
        Firestore dbFirestore = FirestoreClient.getFirestore();
        Iterable<DocumentReference> userDocumentReferences = dbFirestore.collection(COL_USERS).listDocuments();

        for (DocumentReference documentReference: userDocumentReferences) {
            ApiFuture<DocumentSnapshot> userFuture = documentReference.get();
            DocumentSnapshot userDocument = userFuture.get();
            Account account = userDocument.toObject(Account.class);

            assert account != null;
            allAccounts.add(account);
        }

        return allAccounts;
    }

    public AccountInfo getAccountInfo(String documentId) throws ExecutionException, InterruptedException, AccountInvalidException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference bankAccDocumentReference = dbFirestore.collection(COL_BANK_ACCOUNTS).document(documentId);
        ApiFuture<DocumentSnapshot> bankAccFuture = bankAccDocumentReference.get();
        DocumentSnapshot bankAccDocument = bankAccFuture.get();
        AccountInfo accountInfo;

        if (bankAccDocument.exists()) {
            accountInfo = bankAccDocument.toObject(AccountInfo.class);
            return accountInfo;
        } else {
            throw new AccountInvalidException("The account " + documentId.substring(5) + " is not valid.");
        }
    }

    public Buddy getBuddy(String documentId) throws ExecutionException, InterruptedException, AccountInvalidException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference buddiesDocumentReference = dbFirestore.collection(COL_BUDDIES).document(documentId);
        ApiFuture<DocumentSnapshot> buddiesFuture = buddiesDocumentReference.get();
        DocumentSnapshot buddiesDocument = buddiesFuture.get();
        Buddy buddies;

        if (buddiesDocument.exists()) {
            buddies = buddiesDocument.toObject(Buddy.class);
            assert buddies != null;
            if (buddies.getBuddyList().size() > 0) {
                List<Profile> profiles = buddies.getBuddyList();
                for (Profile profile: profiles) {
                    Profile updated = getProfile(profile.getDocumentId());
                    profile.setStatus(updated.getStatus());
                }
                buddies.setBuddyList(profiles);
            }

            return buddies;
        } else {
            throw new AccountInvalidException("The account " + documentId.substring(5) + " is not valid.");
        }
    }

    public Profile getProfile(String documentId) throws ExecutionException, InterruptedException, AccountInvalidException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference profileDocumentReference = dbFirestore.collection(COL_PROFILES).document(documentId);
        ApiFuture<DocumentSnapshot> buddiesFuture = profileDocumentReference.get();
        DocumentSnapshot profileDocument = buddiesFuture.get();
        Profile profile;

        if (profileDocument.exists()) {
            profile = profileDocument.toObject(Profile.class);
            return profile;
        } else {
            throw new AccountInvalidException("The account " + documentId.substring(5) + " is not valid.");
        }
    }

    public String updateAccount(Account account) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(COL_USERS).document(account.getDocumentId()).set(account);
        return "Account successfully updated at " + collectionsApiFuture.get().getUpdateTime().toString();
    }

    public void updateAccountInfo(AccountInfo account) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(COL_BANK_ACCOUNTS).document(account.getDocumentId()).set(account);
        collectionsApiFuture.get();
    }

    public void updateBuddy(Buddy buddies) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(COL_BUDDIES).document(buddies.getDocumentId()).set(buddies);
        collectionsApiFuture.get();
    }

    public void updateProfile(Profile profile) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(COL_PROFILES).document(profile.getDocumentId()).set(profile);
        collectionsApiFuture.get();
    }

    public String deleteAccount(String documentId) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        dbFirestore.collection(COL_USERS).document(documentId).delete();
        dbFirestore.collection(COL_BANK_ACCOUNTS).document(documentId).delete();
        dbFirestore.collection(COL_BUDDIES).document(documentId).delete();
        return "Successfully deleted " + documentId;
    }

}
