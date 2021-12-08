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
import { callApi } from '../../utils';

export const WithdrawFundsModal = ({withdrawModal, setWithdrawModal, reload, setReload}) => {
    const [form, setForm] = useState({memo: '', recipient: '', amount: 0.00, transactionType: 'WITHDRAWAL'});
    const [invalidAmount, setInvalidAmount] = useState(false);

    const createTransaction = (memo, amount, transactionType) => {
        callApi('transactions', 'POST', JSON.stringify({memo, amount, transactionType})).then(result => {
            if (result.status === 201) {
                setReload(!reload)
                setWithdrawModal(!withdrawModal);
                setForm({memo: '', recipient: '', amount: 0.00, transactionType: 'WITHDRAWAL'});
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
                    Your amount must be more than $0 and less than $100,000.
                </FormFeedback>
            )
        }
    }

    const onChange = (name, value) => {
        setForm({...form, [name]: value});
        if (name === "amount"){
            if (value <= 0 || value[0] === "-" || value > 100000){
                setInvalidAmount(true);
            } else {
                if (invalidAmount === true) {
                    setInvalidAmount(false);
                }
            }
        }
    };

    return (
        <Modal className="Modal" isOpen={withdrawModal}>

            <Button className="btn-close align-self-end m-2" onClick={() => {
                setWithdrawModal(!withdrawModal);
                setInvalidAmount(false);
                setForm({memo: '', recipient: '', amount: 0.00, transactionType: 'WITHDRAWAL'});
            }} />

            <Container>
                <h1 className="text-center">Withdraw Funds</h1>
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
                            <Input type="number" name="amount" value={form.amount} bsSize="lg" invalid={invalidAmount}
                                   onChange={e => onChange(e.target.name, e.target.value)} required/>
                            {showInvalidAmountFeedback()}
                        </InputGroup>
                    </FormGroup>
                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" disabled={invalidAmount || !form.amount} onClick={() => createTransaction(
                    form.memo,
                    form.amount,
                    "WITHDRAWAL")}>Withdraw Funds</Button>
                <br/>
            </Container>

        </Modal>
    )
};
