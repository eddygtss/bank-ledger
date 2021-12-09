import React, { useState } from 'react';
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
} from 'reactstrap';
import './Modal.css';
import cogoToast from 'cogo-toast';
import {callApi, regexAmount} from '../Utils/utils';

export const SendFundsModal = ({sendModal, setSendModal, accountInfo, reload, setReload}) => {
    const [form, setForm] = useState({memo: '', recipient: '', amount: '', transactionType: 'SEND'});
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidAmount, setInvalidAmount] = useState(false);

    const createSendTransaction = (memo, recipient, amount, transactionType) => {
        callApi('send', 'POST', JSON.stringify({memo, recipient, amount, transactionType})).then(result => {
            if (result.status === 201) {
                setReload(!reload)
                setSendModal(!sendModal)
                setForm({memo: '', recipient: '', amount: '', transactionType: 'SEND'});
                cogoToast.success('Successfully sent $' + amount + ' to ' + recipient);
            } else {
                result.text().then(data => {
                    cogoToast.error('Error: ' + data);
                    }
                )
            }
        });
    };

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
                    Your amount must be more than $0 and less than $10,000.
                </FormFeedback>
            )
        }
    }

    const onChange = (name, value) => {
        if (name === 'amount'){
            const val = value;
            if (val === '' || regexAmount.test(val)){
                setForm({...form, amount: val})
            }
        } else {
            setForm({...form, [name]: value});
        }
        if (name === "recipient"){
            if (value.toLowerCase() === accountInfo.documentId.substring(5).toLowerCase()){
                setInvalidEmail(!invalidEmail);
            } else {
                if (invalidEmail === true) {
                    setInvalidEmail(!invalidEmail);
                }
            }
        }
        if (name === "amount"){
            if (value <= 0 || value[0] === "-" || value > 10000){
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
                setForm({memo: '', recipient: '', amount: '', transactionType: 'SEND'});
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
                            <Input type="text" name="amount" invalid={invalidAmount} value={form.amount} bsSize="lg" inputMode="numeric"
                                   onChange={e => onChange(e.target.name, e.target.value)} required/>
                            {showInvalidAmountFeedback()}
                        </InputGroup>
                    </FormGroup>
                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" disabled={invalidEmail || invalidAmount || form.memo === '' || form.amount === ''}
                        onClick={() =>
                            createSendTransaction(
                                form.memo,
                                form.recipient.toLowerCase(),
                                form.amount,
                    "SEND")}>Send Funds</Button>
                <br/>
            </Container>

        </Modal>
    )
};
