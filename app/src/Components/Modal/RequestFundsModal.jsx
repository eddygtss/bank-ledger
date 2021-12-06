import React, { useState } from 'react';
import './Modal.css';
import {
    Modal,
    Button,
    Container,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label, FormFeedback, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import cogoToast from 'cogo-toast';
import { callApi } from '../../utils';

export const RequestFundsModal = ({requestModal, setRequestModal, accountInfo}) => {
    const [form, setForm] = useState({memo: '', responder: '', amount: 0.00, privacy: ''});
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidAmount, setInvalidAmount] = useState(false);
    const [invalidButton, setInvalidButton] = useState(true);

    const createRequestTransaction = (memo, responder, amount, privacy) => {
        callApi('request', 'POST', JSON.stringify({memo, responder, amount, privacy})).then(result => {
            if (result.status === 201) {
                cogoToast.success('Request successfully sent to ' + responder);
                setRequestModal(!requestModal);
                setForm({memo: '', responder: '', amount: 0.00, privacy: ''});
            } else {
                result.text().then(data => {
                    cogoToast.error(`Error ${data ? `: ${data}` : ''}`);
                });
            }
        });
    };

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
                    Your amount must be more than $0 and less than $10,000.
                </FormFeedback>
            )
        }
    }

    const validateButton = () => {
        if (form.amount && form.responder){
            setInvalidButton(false)
        } else {
            setInvalidButton(true);
        }
    }

    const onChange = (name, value) => {
        setForm({...form, [name]: value});
        if (name === "responder"){
            if (value.toLowerCase() === accountInfo.documentId.substring(5).toLowerCase()){
                setInvalidEmail(true);
            } else {
                if (invalidEmail === true) {
                    setInvalidEmail(false);
                }
            }
        }
        if (name === "amount"){
            if (value < 0.01 || value[0] === "-" || value > 10000){
                setInvalidAmount(true);
            } else {
                if (invalidAmount === true) {
                    setInvalidAmount(false);
                }
            }
        }
        validateButton();
    };
    return (

        <Modal className="Modal" isOpen={requestModal}>

            <Button className="btn-close align-self-end m-2" onClick={() => {
                setRequestModal(!requestModal);
                setInvalidEmail(false);
                setInvalidAmount(false);
                setForm({memo: '', responder: '', amount: 0.00, privacy: ''});
            }} />

            <Container>
                <h1 className="text-center">Request Funds</h1>
                <br/>
                <Dropdown
                    direction="end"
                    toggle={}
                    >
                    <DropdownToggle caret>
                        Privacy
                    </DropdownToggle>
                    <DropdownMenu
                        dark>
                        <DropdownItem header>
                            Privacy Level for Request
                        </DropdownItem>
                        <DropdownItem onClick={setForm}>
                            Private
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
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
                <Button className="createTransactionSubmitBtn" disabled={invalidEmail || invalidAmount || invalidButton} onClick={() => createRequestTransaction(
                    form.memo,
                    form.responder.toLowerCase(),
                    form.amount)}>Request Funds</Button>
                <br/>

            </Container>


        </Modal>

    )
};
