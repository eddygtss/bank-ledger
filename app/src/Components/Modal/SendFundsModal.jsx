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
    Label
} from "reactstrap";
import "./Modal.css";
import {callApi} from "../../utils";
import cogoToast from "cogo-toast";
import {XSquare} from "react-feather";

export const SendFundsModal = ({sendModal, setSendModal}) => {
    const createSendTransaction = (memo, recipient, amount, transactionType) => {
        callApi('send', 'POST', JSON.stringify({memo, recipient, amount, transactionType})).then(result => {
            if (result.status === 201) {
                cogoToast.success('Successfully sent $' + amount + ' to ' + recipient);
                setSendModal(!sendModal)
                setForm({memo: '', recipient: '', amount: 0.00, transactionType: 'SEND'});
            } else {
                result.json().then(data => {
                    cogoToast.error(`Error ${data.message ? `: ${data.message}` : ''}`);
                });
            }
        });
    };

    const [form, setForm] = useState({memo: '', recipient: '', amount: 0.00, transactionType: 'DEPOSIT'});


    const onChange = (name, value) => {
        setForm({...form, [name]: value});
    };
    return (

        <Modal className="Modal" isOpen={sendModal}>

            <Button className="btn-close align-self-end m-2" onClick={() => setSendModal(!sendModal)} />

            <Container>
                <h1 className="text-center">Send Funds</h1>
                <br/>
                <Form className="formText">
                    <FormGroup>
                        <Label for="recipient">Recipient</Label>
                        <Input name="recipient"
                               placeholder="GemBank Member Email"
                               bsSize="lg"
                               type="email"
                               onChange={e => onChange(e.target.name, e.target.value)} required/>
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
                            <Input type="number" name="amount" value={form.amount} bsSize="lg"
                                   onChange={e => onChange(e.target.name, e.target.value)} required/>
                        </InputGroup>
                    </FormGroup>
                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" onClick={() => createSendTransaction(
                    form.memo,
                    form.recipient,
                    form.amount,
                    "SEND")}>Send Funds</Button>
                <br/>

            </Container>


        </Modal>

    )
};
