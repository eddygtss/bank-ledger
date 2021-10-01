package gem.banking.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@Getter @Setter
public class Account {
    @Id
    private String documentId;

    private String username;

    private String password;

    public Account(String documentId, String username, String password) {
        this.documentId = documentId;
        this.username = username;
        this.password = password;
    }
}
