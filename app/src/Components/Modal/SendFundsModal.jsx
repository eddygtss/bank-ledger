import React, {useState} from "react";
import {
    Modal,
    Button,
    Container,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label, FormFeedback
} from "reactstrap";
import "./Modal.css";
import {callApi} from "../../utils";
import cogoToast from "cogo-toast";

export const SendFundsModal = ({sendModal, setSendModal, accountInfo}) => {
    const createSendTransaction = (memo, recipient, amount, transactionType) => {
        callApi('send', 'POST', JSON.stringify({memo, recipient, amount, transactionType})).then(result => {
            if (result.status === 201) {
                cogoToast.success('Successfully sent $' + amount + ' to ' + recipient);
                setSendModal(!sendModal)
                setForm({memo: '', recipient: '', amount: 0.00, transactionType: 'SEND'});
            } else {
                console.log(result)
                cogoToast.error(result);
            }
        });
    };

    const [form, setForm] = useState({memo: '', recipient: '', amount: 0.00, transactionType: 'SEND'});
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidAmount, setInvalidAmount] = useState(false);

    const showInvalidEmailFeedback = () => {
        if (invalidEmail){
            return (
                <FormFeedback className="position-relative">
                    You cannot send money to yourself.
                </FormFeedback>
            )
        }
    }

    const showInvalidAmountFeedback = () => {
        if (invalidAmount){
            return (
                <FormFeedback className="position-relative">
                    Your amount must be more than $0.
                </FormFeedback>
            )
        }
    }

    const onChange = (name, value) => {
        setForm({...form, [name]: value});
        if (name === "recipient"){
            if (value === accountInfo.documentId.substring(5)){
                setInvalidEmail(!invalidEmail);
            } else {
                if (invalidEmail === true) {
                    setInvalidEmail(!invalidEmail);
                }
            }
        }
        if (name === "amount"){
            if (value <= 0){
                setInvalidAmount(!invalidAmount);
            } else {
                if (invalidAmount === true) {
                    setInvalidAmount(!invalidAmount);
                }
            }
        }
    };
    return (

        <Modal className="Modal" isOpen={sendModal}>

            <Button className="btn-close align-self-end m-2" onClick={() => {
                setSendModal(!sendModal);
                setInvalidAmount(false);
                setInvalidEmail(false);
                setForm({memo: '', recipient: '', amount: 0.00, transactionType: 'SEND'});
            }} />

            <Container>
                <h1 className="text-center">Send Funds</h1>
                <br/>
                <Form className="formText">
                    <FormGroup>
                        <Label for="recipient">Recipient</Label>
                        <Input name="recipient"
                               placeholder="GemBank Member Email"
                               bsSize="lg"
                               invalid={invalidEmail}
                               type="email"
                               onChange={e => onChange(e.target.name, e.target.value)} required/>
                        {showInvalidEmailFeedback()}
                    </FormGroup>
                    <FormGroup>
                        <Label for="memo">Message</Label>
                        <Input name="memo" bsSize="lg" onChange={e => onChange(e.target.name, e.target.value)}
                               required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="amount">Amount</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input type="number" name="amount" invalid={invalidAmount} value={form.amount} bsSize="lg"
                                   onChange={e => onChange(e.target.name, e.target.value)} required/>
                            {showInvalidAmountFeedback()}
                        </InputGroup>
                    </FormGroup>
                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" disabled={invalidEmail || invalidAmount || form.memo === ""} onClick={() => createSendTransaction(
                    form.memo,
                    form.recipient,
                    form.amount,
                    "SEND")}>Send Funds</Button>
                <br/>

            </Container>


        </Modal>

    )
};
