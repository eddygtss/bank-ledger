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
    Label
} from "reactstrap";
import cogoToast from "cogo-toast";

export const RequestFundsModal = ({requestModal, setRequestModal}) => {
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

    const onChange = (name, value) => {
        setForm({...form, [name]: value});
    };
    return (

        <Modal className="Modal" isOpen={requestModal}>

            <Button className="btn-close align-self-end m-2" onClick={() => setRequestModal(!requestModal)} />

            <Container>
                <h1 className="text-center">Request Funds</h1>
                <br/>
                <Form className="formText">
                    <FormGroup>
                        <Label for="responder">Send Request To</Label>
                        <Input name="responder"
                               bsSize="lg"
                               placeholder="GemBank Member Email"
                               inputMode="email"
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
                <Button className="createTransactionSubmitBtn" onClick={() => createRequestTransaction(
                    form.memo,
                    form.responder,
                    form.amount)}>Request Funds</Button>
                <br/>

            </Container>


        </Modal>

    )
};
