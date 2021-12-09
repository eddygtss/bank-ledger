import React, { useState } from 'react';
import {
    Button,
    Container,
    Form, FormFeedback,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Modal
} from 'reactstrap';
import './Modal.css';
import cogoToast from 'cogo-toast';
import { callApi, regexAmount } from '../Utils/utils';

export const DepositFundsModal = ({depositModal, setDepositModal, reload, setReload}) => {
    const [form, setForm] = useState({memo: '', amount: '', transactionType: 'DEPOSIT'});
    const [invalidAmount, setInvalidAmount] = useState(false);

    const createTransaction = (memo, amount, transactionType) => {
        callApi('transactions', 'POST', JSON.stringify({memo, amount, transactionType})).then(result => {
            if (result.status === 201) {
                setReload(!reload)
                setDepositModal(!depositModal);
                setForm({memo: '', amount: '', transactionType: 'DEPOSIT'});
                cogoToast.success('Transaction created.');
            } else {
                result.json().then(data => {
                    cogoToast.error(`Error ${data.message ? `: ${data.message}` : ''}`);
                });
            }
        });
    };

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
        if (name === "amount"){
            if (value <= 0 || value[0] === "-" || value > 10000){
                setInvalidAmount(true);
            } else {
                if (invalidAmount === true) {
                    setInvalidAmount(false);
                }
            }
        }
    };
    return (

        <Modal className="Modal" isOpen={depositModal}>

            <Button className="btn-close align-self-end m-2" onClick={() => {
                setDepositModal(!depositModal)
                setInvalidAmount(false);
                setForm({memo: '', amount: '', transactionType: 'DEPOSIT'});
            }} />

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
                            <Input type="text" name="amount" value={form.amount} bsSize="lg" invalid={invalidAmount} inputMode="decimal"
                                   onChange={e => onChange(e.target.name, e.target.value)} required/>
                            {showInvalidAmountFeedback()}
                        </InputGroup>
                    </FormGroup>
                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn"
                        disabled={invalidAmount || form.amount === '' || form.memo === ''}
                        onClick={() =>
                            createTransaction(
                                form.memo,
                                form.amount,
                                "DEPOSIT")}
                >
                    Deposit Funds
                </Button>
                <br/>

            </Container>

        </Modal>

    )
};
