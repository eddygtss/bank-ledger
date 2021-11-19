import React, {useState} from "react";
import {
    Button,
    Container,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Modal
} from "reactstrap";
import "./Modal.css";
import {callApi} from "../../utils";
import cogoToast from "cogo-toast";
import {XSquare} from "react-feather";

export const DepositFundsModal = ({depositModal, setDepositModal}) => {
    const createTransaction = (memo, amount, transactionType) => {
        callApi('transactions', 'POST', JSON.stringify({memo, amount, transactionType})).then(result => {
            if (result.status === 201) {
                cogoToast.success('Transaction created.');
                setDepositModal(!depositModal);
                setForm({memo: '', amount: 0.00, transactionType: 'DEPOSIT'});
            } else {
                result.json().then(data => {
                    cogoToast.error(`Error creating account${data.message ? `: ${data.message}` : ''}`);
                });
            }
        });
    };

    const [form, setForm] = useState({memo: '', amount: 0.00, transactionType: 'DEPOSIT'});

    const onChange = (name, value) => {
        setForm({...form, [name]: value});
    };
    return (

        <Modal className="Modal" isOpen={depositModal}>

            <Button className="btn-close align-self-end m-2" onClick={() => setDepositModal(!depositModal)} />

            <Container>
                <h1 className="text-center">Deposit Funds</h1>
                <br/>
                <Form className="formText">
                    <FormGroup>
                        <Label for="memo">Memo</Label>
                        <Input name="memo" bsSize="lg" onChange={e => onChange(e.target.name, e.target.value)} required/>
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
                <Button className="createTransactionSubmitBtn" onClick={() => createTransaction(
                    form.memo,
                    form.amount,
                    "DEPOSIT")}>Deposit Funds</Button>
                <br/>

            </Container>

        </Modal>

    )
};
