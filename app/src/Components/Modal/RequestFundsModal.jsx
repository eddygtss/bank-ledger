import React, {useState} from "react";
import "./Modal.css";
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
    Label, FormFeedback
} from "reactstrap";
import cogoToast from "cogo-toast";

export const RequestFundsModal = ({requestModal, setRequestModal, accountInfo}) => {
    const createRequestTransaction = (memo, responder, amount) => {
        callApi('request', 'POST', JSON.stringify({memo, responder, amount})).then(result => {
            if (result.status === 201) {
                cogoToast.success('Request successfully sent to ' + responder);
                setRequestModal(!requestModal);
                setForm({memo: '', responder: '', amount: 0.00});
            } else {
                result.json().then(data => {
                    cogoToast.error(`Error ${data.message ? `: ${data.message}` : ''}`);
                });
            }
        });
    };

    const [form, setForm] = useState({memo: '', responder: '', amount: 0.00});
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidAmount, setInvalidAmount] = useState(false);

    const showInvalidEmailLabel = () => {
        if (invalidEmail){
            return (
                <FormFeedback className="position-relative">
                    You cannot request money from yourself.
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
        if (name === "responder"){
            if (value === accountInfo.documentId.substring(5)){
                setInvalidEmail(true);
            } else {
                if (invalidEmail === true) {
                    setInvalidEmail(false);
                }
            }
        }
        if (name === "amount"){
            if (value <= 0 || value[0] === "-"){
                setInvalidAmount(true);
            } else {
                if (invalidAmount === true) {
                    setInvalidAmount(false);
                }
            }
        }
    };
    return (

        <Modal className="Modal" isOpen={requestModal}>

            <Button className="btn-close align-self-end m-2" onClick={() => {
                setRequestModal(!requestModal);
                setInvalidEmail(false);
                setInvalidAmount(false);
                setForm({memo: '', responder: '', amount: 0.00});
            }} />

            <Container>
                <h1 className="text-center">Request Funds</h1>
                <br/>
                <Form className="formText">
                    <FormGroup>
                        <Label for="responder">Send Request To</Label>
                        <Input name="responder"
                               bsSize="lg"
                               placeholder="GemBank Member Email"
                               invalid={invalidEmail}
                               inputMode="email"
                               onChange={e => onChange(e.target.name, e.target.value)} required/>
                        {showInvalidEmailLabel()}
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
                <Button className="createTransactionSubmitBtn" disabled={invalidEmail || invalidAmount || form.memo === ""} onClick={() => createRequestTransaction(
                    form.memo,
                    form.responder,
                    form.amount)}>Request Funds</Button>
                <br/>

            </Container>


        </Modal>

    )
};
