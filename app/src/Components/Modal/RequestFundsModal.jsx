import React, {useState} from "react";
import "./MyModal.css";
import {callApi} from "../../utils";
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
import cogoToast from "cogo-toast";
import {XSquare} from "react-feather";

export const RequestFundsModal = ({requestModal, setRequestModal}) => {
    const createRequestTransaction = (memo, recipient, amount, date, transactionType) => {
        callApi('request', 'POST', JSON.stringify({memo, recipient, amount, date, transactionType})).then(result => {
            if (result.status === 201) {
                cogoToast.success('Request successfully sent to ' + recipient);
                setRequestModal(!requestModal);
                setForm({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'SEND'});
            } else {
                result.json().then(data => {
                    cogoToast.error(`Error ${data.message ? `: ${data.message}` : ''}`);
                });
            }
        });
    };

    const [form, setForm] = useState({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'DEPOSIT'});

    const onChange = (name, value) => {
        setForm({...form, [name]: value});
    };
    return (

        <Modal className="Modal" isOpen={requestModal}>

            <div className="titleCloseBtn" onClick={() => setRequestModal(!requestModal)}>
                <XSquare color="red" size={48}/>
            </div>

            <Container>
                <h1>Request Funds</h1>
                <br/>
                <Form className="formText">
                    <FormGroup>
                        <Label for="memo">Memo</Label>
                        <Input name="memo" bsSize="lg" onChange={e => onChange(e.target.name, e.target.value)}
                               required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="recipient">Recipient</Label>
                        <Input name="recipient" onChange={e => onChange(e.target.name, e.target.value)} required/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="amount">Amount</Label>
                        <InputGroup>
                            <InputGroupText>$</InputGroupText>
                            <Input type="number" name="amount" value={form.amount} bsSize="lg"
                                   onChange={e => onChange(e.target.name, e.target.value)} required/>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <Label for="date">Date</Label>
                        <Input type="date" name="date" bsSize="lg"
                               onChange={e => onChange(e.target.name, e.target.value)}
                               required/>
                    </FormGroup>

                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" onClick={() => createRequestTransaction(
                    form.memo,
                    form.recipient,
                    form.amount,
                    form.date,
                    "REQUEST")}>Request Funds</Button>
                <br/>

            </Container>


        </Modal>

    )
};
