package gem.banking.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Request {
    private String id = UUID.randomUUID().toString();
    private String memo = "";
    private String requester = "";
    private String responder = "";
    private double amount;
    @JsonFormat(pattern="MM-dd-yyyy")
    private Date date;
    private RequestStatus requestStatus;

    public enum RequestStatus {
        PENDING, APPROVED, DENIED, SENT, RECEIVED;
    }

    public Request (String id) {
        this.id = id;
    }

    public Request(Request copy) {
        this.id = copy.id;
        this.memo = copy.memo;
        this.requester = copy.requester;
        this.responder = copy.responder;
        this.amount = copy.amount;
        this.date = copy.date;
        this.requestStatus = copy.requestStatus;
    }
}
