package gem.banking.models;

import gem.banking.enums.PrivacyLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class Profile {
    private String documentId;
    private String username;
    private String firstName;
    private String lastName;
    private PrivacyLevel privacySetting;
    private String status;

    public Profile(String documentId, String username, String firstName, String lastName, PrivacyLevel privacySetting, String status) {
        this.documentId = documentId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.privacySetting = privacySetting;
        this.status = status;
    }
}
