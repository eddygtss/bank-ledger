import React, { useState } from 'react';
import {
    Modal,
    Button,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    FormFeedback
} from 'reactstrap';
import './Modal.css';
import cogoToast from 'cogo-toast';
import { callApi } from '../../utils';

export const AddBuddyModal = ({ addBuddyModal, setAddBuddyModal, buddyInfo }) => {
    const [form, setForm] = useState({memo: '', responder: '', privacySetting: 'PRIVATE'});
    const [invalidEmail, setInvalidEmail] = useState(false);

    const createAddBuddyTransaction = (memo, responder, privacySetting) => {
        callApi('add-buddy','POST', JSON.stringify({memo, responder, privacySetting})).then(result => {
            if (result.status === 201) {
                cogoToast.success('Buddy request successfully sent to ' + responder);
                setAddBuddyModal(!addBuddyModal);
                setForm({memo: '', responder: '', privacySetting: 'PRIVATE'});
            } else {
                result.text().then(data => {
                    cogoToast.error(`Error ${data ? `: ${data}` : ''}`);
                });
            }
        })
    };

    const showInvalidEmailFeedback = () => {
        if (invalidEmail){
            return (
                <FormFeedback className="position-relative">
                    You cannot add yourself.
                </FormFeedback>
            )
        }
    }

    const onChange = (name, value) => {
        setForm({...form, [name]: value});
        if (name === "responder"){
            if (value === buddyInfo.documentId.substring(5)){
                setInvalidEmail(!invalidEmail);
            } else {
                if (invalidEmail === true) {
                    setInvalidEmail(!invalidEmail);
                }
            }
        }
    };

    return (
        <Modal className="Modal" isOpen={addBuddyModal}>
            <Button className="btn-close align-self-end m-2" onClick={() => {
                setAddBuddyModal(!addBuddyModal);
                setInvalidEmail(false);
                setForm({memo: '', responder: '', privacySetting: 'PRIVATE'});
            }} />

            <Container>
                <h1 className="text-center">Add Gem Buddy</h1>
                <br/>
                <Form className="formText">
                    <FormGroup>
                        <Label for="responder">Gem Buddy Email</Label>
                        <Input name="responder"
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
                </Form>
                <br/>
                <Button className="createTransactionSubmitBtn" disabled={invalidEmail || form.memo === ""} onClick={() => createAddBuddyTransaction(
                    form.memo,
                    form.responder,
                    form.privacySetting
                )}>Add Gem Buddy</Button>
                <br/>
            </Container>

        </Modal>
    )
};
