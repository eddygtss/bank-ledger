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
import "./MyModal.css";
import {callApi} from "../../utils";
import cogoToast from "cogo-toast";
import {XSquare} from "react-feather";

export const WithdrawFundsModal = ({withdrawModal, setWithdrawModal}) => {
    const createTransaction = (memo, amount, date, transactionType) => {
        callApi('transactions', 'POST', JSON.stringify({memo, amount, date, transactionType})).then(result => {
            if (result.status === 201) {
                cogoToast.success('Transaction created.');
                setWithdrawModal(!withdrawModal);
                setForm({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'DEPOSIT'});
            } else {
                result.json().then(data => {
                    cogoToast.error(`Error creating account${data.message ? `: ${data.message}` : ''}`);
                });
            }
        });
    };
    const [form, setForm] = useState({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'DEPOSIT'});


    const onChange = (name, value) => {
        setForm({...form, [name]: value});
    };
    return (

        <Modal className="Modal" isOpen={withdrawModal}>


            <div className="titleCloseBtn" onClick={() => setWithdrawModal(!withdrawModal)}>
                <XSquare color="red" size={48}/>
            </div>

            <Container>
                <h1>Withdraw Funds</h1>
                <br/>
                <Form className="formText">
                    <FormGroup>
                        <Label for="memo">Memo</Label>
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
                    <FormGroup>
                        <Label for="date">Date</Label>
                        <Input type="date" name="date" bsSize="lg"
                               onChange={e => onChange(e.target.name, e.target.value)}
                               required/>
                    </FormGroup>

                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" onClick={() => createTransaction(
                    form.memo,
                    form.amount,
                    form.date,
                    "WITHDRAWAL")}>Withdraw Funds</Button>
                <br/>

            </Container>


        </Modal>

    )
};
