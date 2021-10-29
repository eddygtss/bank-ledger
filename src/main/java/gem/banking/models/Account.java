package gem.banking.models;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.util.List;

@Getter @Setter
@RequiredArgsConstructor
public class Account implements Serializable {
    private static final long serialVersionUID = -1764970284520387975L;

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
