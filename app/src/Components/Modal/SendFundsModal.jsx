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
    Label, FormFeedback, Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import './Modal.css';
import cogoToast from 'cogo-toast';
import {callApi, regexAmount} from '../Utils/utils';

export const SendFundsModal = ({sendModal, setSendModal, accountInfo, reload, setReload}) => {
    const [form, setForm] = useState({memo: '', recipient: '', amount: '', transactionType: 'SEND', privacySetting: 'PRIVATE'});
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [privacyDropDown, setPrivacyDropDown] = useState(false);
    const [invalidAmount, setInvalidAmount] = useState(false);
    const [privateActive, setPrivateActive] = useState(false);
    const [publicActive, setPublicActive] = useState(false);

    const createSendTransaction = (memo, recipient, amount, transactionType, privacySetting) => {
        callApi(
            'send',
            'POST',
            JSON.stringify({memo, recipient, amount, transactionType, privacySetting})).then(result => {
            if (result.status === 201) {
                setReload(!reload)
                setSendModal(!sendModal)
                setForm({memo: '', recipient: '', amount: '', transactionType: 'SEND', privacySetting: 'PRIVATE'});
                cogoToast.success('Successfully sent $' + amount + ' to ' + recipient);
            } else {
                result.text().then(data => {
                    cogoToast.error('Error: ' + data);
                    }
                )
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
        const val = value;
        if (name === 'amount'){
            if (val === '' || val.match(regexAmount)){
                setForm({...form, amount: val})
            }
            if (val <= 0 || val[0] === "-" || val > 10000 || val === null){
                setInvalidAmount(!invalidAmount);
            } else {
                if (invalidAmount === true) {
                    setInvalidAmount(!invalidAmount);
                }
            }
        } else {
            setForm({...form, [name]: val});
        }
        if (name === "recipient"){
            if (val.toLowerCase() === accountInfo.documentId.substring(5).toLowerCase()){
                setInvalidEmail(!invalidEmail);
            } else {
                if (invalidEmail === true) {
                    setInvalidEmail(!invalidEmail);
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
                setForm({memo: '', recipient: '', amount: '', transactionType: 'SEND', privateSetting: 'PRIVATE'});
            }} />

            <Container>
                <h1 className="text-center">Send Funds</h1>
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
                    "SEND",
                                form.privacySetting)}>Send Funds</Button>
                <br/>
            </Container>

        </Modal>
    )
};
