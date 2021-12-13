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
import { callApi, regexAmount } from '../Utils/utils';

export const RequestFundsModal = ({requestModal, setRequestModal, accountInfo, reload, setReload}) => {
    const [form, setForm] = useState({memo: '', responder: '', amount: '', privacySetting: 'PRIVATE'});
    const [privacyDropDown, setPrivacyDropDown] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidAmount, setInvalidAmount] = useState(false);
    const [invalidButton, setInvalidButton] = useState(true);
    const [privateActive, setPrivateActive] = useState(false);
    const [publicActive, setPublicActive] = useState(false);

    const createRequestTransaction = (memo, responder, amount, privacySetting) => {
        callApi(
            'request',
            'POST',
            JSON.stringify({memo, responder, amount, privacySetting})).then(result => {
            if (result.status === 201) {
                setReload(!reload)
                setRequestModal(!requestModal);
                setForm({memo: '', responder: '', amount: '', privacySetting: 'PRIVATE'});
                cogoToast.success('Request successfully sent to ' + responder);
            } else {
                result.text().then(data => {
                    cogoToast.error(`Error ${data ? `: ${data}` : ''}`);
                });
            }
        });
    };

    const toggle = () => {
        setPrivacyDropDown(!privacyDropDown);
        privacySetting();
    }

    const privacySetting = () => {
        if (form.privacySetting === 'PRIVATE') {
            setPrivateActive(true);
        } else {
            setPrivateActive(false);
        }
        if (form.privacySetting === 'PUBLIC') {
            setPublicActive(true);
        } else {
            setPublicActive(false);
        }
    }

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
        const val = value;
        if (name === 'amount'){
            if (val === '' || val.match(regexAmount)){
                setForm({...form, amount: val})
            }
            if (val <= 0 || val[0] === "-" || val > 10000 || val === null){
                setInvalidAmount(true);
            } else {
                if (invalidAmount === true) {
                    setInvalidAmount(false);
                }
            }
        } else {
            setForm({...form, [name]: val});
        }
        if (name === "responder"){
            if (value.toLowerCase() === accountInfo.documentId.substring(5).toLowerCase()){
                setInvalidEmail(true);
            } else {
                if (invalidEmail === true) {
                    setInvalidEmail(false);
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
                setForm({memo: '', responder: '', amount: '', privacySetting: 'PRIVATE'});
            }} />

            <Container>
                <h1 className="text-center">Request Funds</h1>
                <br/>
                <Dropdown
                    direction="end"
                    toggle={() => toggle()}
                    isOpen={privacyDropDown}
                    className="text-end"
                    >
                    <DropdownToggle caret>
                        Privacy
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>
                            Privacy Level for Request
                        </DropdownItem>
                        <DropdownItem className="text-center" active={privateActive} onClick={() => setForm({...form, privacySetting: 'PRIVATE'})}>
                            Private
                        </DropdownItem>
                        <DropdownItem className="text-center" active={publicActive} onClick={() => setForm({...form, privacySetting: 'PUBLIC'})}>
                            Public
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
                            <Input type="text" name="amount" invalid={invalidAmount} value={form.amount} bsSize="lg" inputMode="numeric"
                                   onChange={e => onChange(e.target.name, e.target.value)} required/>
                            {showInvalidAmountFeedback()}
                        </InputGroup>
                    </FormGroup>

                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" disabled={invalidEmail || invalidAmount || invalidButton || form.memo === '' || form.amount === ''} onClick={() => createRequestTransaction(
                    form.memo,
                    form.responder.toLowerCase(),
                    form.amount,
                    form.privacySetting)}>Request Funds</Button>
                <br/>

            </Container>


        </Modal>

    )
};
