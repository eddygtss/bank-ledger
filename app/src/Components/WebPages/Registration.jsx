import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import {
    Container,
    Button,
    Form,
    FormGroup,
    Input,
    Row,
    Col, FormFeedback, Label
} from 'reactstrap';
import '../../App.css';
import StepWizard from 'react-step-wizard';
import cogoToast from 'cogo-toast';
import { callApi } from '../Utils/utils';

const Registration = ({ history, setLogin }) => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPass: '',
        firstName: '',
        lastName: '',
        address: '',
        ssn: '',
        confirmSsn: ''
    });
    const [formStep, setFormStep] = useState(0);
    const [passwordInvalid, setPasswordInvalid] = useState(false);

    const regexPass = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;

    const onChange = (name, value) => {
        setForm({ ...form, [name]: value });
        if (name === "password"){
            if (regexPass.test(value) === false) {
                setPasswordInvalid(true);
            } else {
                if (passwordInvalid === true) {
                    setPasswordInvalid(false);
                }
            }
        }
    };

    const createAccount = (
        username,
        password,
        firstName,
        lastName,
        address,
        ssn
    ) => {
        callApi(
            'register',
            'POST',
            JSON.stringify({
                username,
                password,
                firstName,
                lastName,
                address,
                ssn,
            })
        ).then((result) => {
            if (result.status === 201) {
                cogoToast.success('Successfully created account.');
                callApi('login', 'POST', JSON.stringify({ username, password })).then(
                    result => {
                        if (result.status === 200) {
                            sessionStorage.setItem("isLoggedIn", "true");
                            setLogin(true);
                            history.replace("/account-home");
                        } else {
                            cogoToast.error('Something went wrong while authenticating.')
                        }
                    }
                );
            } else {
                result.json().then((data) => {
                    cogoToast.error(`Error creating account${data.message ? `: ${data.message}` : ''}`);
                    setFormStep(0);
                });
            }
        });
    };

    const isStep0Valid = (firstName, lastName, email) => {
        const regexName = /^[a-zA-Z ]{2,30}$/;
        const regexEmail =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (
            regexName.test(firstName) === false ||
            regexName.test(lastName) === false
        ) {
            cogoToast.error('Invalid First or Last Name');
        } else if (regexEmail.test(email) === false) {
            cogoToast.error('Invalid Email');
        } else {
            cogoToast.success('Great! Let set password for your account');
            setFormStep(1);
        }
    };

    const showInvalidPasswordFeedback = () => {
        if (passwordInvalid){
            return (
                <FormFeedback className="position-relative d-inline-block">
                    Password must contain 1 number (0-9)<br />
                    Password must contain 1 uppercase letters<br />
                    Password must contain 1 lowercase letters<br />
                    Password must contain 1 special character (*?!$#)<br />
                    Password must be 8-16 characters with no space
                </FormFeedback>
            )
        }
    }

    const isStep1Valid = (pass, confirmPass) => {
        if (pass !== confirmPass) {
            cogoToast.error('Passwords don\'t match');
        } else if (
            regexPass.test(pass) === false ||
            regexPass.test(confirmPass) === false
        ) {
            cogoToast.error('Invalid password! Make sure your password contains at least 8 characters.');
        } else {
            cogoToast.success('Awesome! Tell us where you live!');
            setFormStep(2);
        }
    };

    const isStep2Valid = (ssn, confirmSsn) => {
        const regSnn = /^[0-9]{9}$/;
        if (ssn !== confirmSsn) {
            cogoToast.error('SSN doesn\'t Match');
        } else if (regSnn.test(ssn) === false || regSnn.test(confirmSsn) === false) {
            cogoToast.error('Please enter only the 9 digits of SSN');
        } else {
            cogoToast.loading('It will take few seconds!');
            createAccount(
                form.username.toLowerCase(),
                form.password,
                form.firstName,
                form.lastName,
                form.address,
                form.ssn
            );
        }
    };

    return (
        <div className="rounded px-3 px-sm-4 py-3 py-sm-5">
            <div className="logo"> GEM BANK</div>
            <Container fluid>
                <h3>Hi, welcome to Gem Bank!</h3>
                <p>Let’s start with some basic information</p>
                <StepWizard>
                    <Form autoComplete="new-off">
                        {formStep === 0 && (
                            <section>
                                <Row>
                                    <Col>
                                        <FormGroup floating>
                                            <Input
                                                type="text"
                                                name="firstName"
                                                placeholder="First Name"
                                                value={form.firstName}
                                                bsSize="lg"
                                                onChange={(e) =>
                                                    onChange(e.target.name, e.target.value)
                                                }
                                            />
                                            <Label for="firstName">First Name</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup floating>
                                            <Input
                                                type="text"
                                                name="lastName"
                                                placeholder="Last Name"
                                                bsSize="lg"
                                                onChange={(e) =>
                                                    onChange(e.target.name, e.target.value)
                                                }
                                            />
                                            <Label for="lastName">Last Name</Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup floating>
                                    <Input
                                        type="email"
                                        name="username"
                                        placeholder="Email"
                                        bsSize="lg"
                                        onChange={(e) => onChange(e.target.name, e.target.value)}
                                    />
                                    <Label for="username">Email</Label>
                                </FormGroup>
                                <Row className="rowCenter">
                                    <Button
                                        className="SignUpButton"
                                        onClick={() =>
                                            isStep0Valid(
                                                form.firstName,
                                                form.lastName,
                                                form.username
                                            )
                                        }
                                        disabled={
                                            !form.firstName || !form.lastName || !form.username
                                        }
                                    >
                                        Next
                                    </Button>
                                </Row>
                            </section>
                        )}
                        {formStep === 1 && (
                            <section>
                                <Row>
                                    <Col>
                                        <FormGroup floating>
                                            <Input
                                                type="password"
                                                name="password"
                                                id="password"
                                                placeholder="Password"
                                                autoComplete="new-password"
                                                bsSize="lg"
                                                value={form.password}
                                                onChange={(e) =>
                                                    onChange(e.target.name, e.target.value)
                                                }
                                            />
                                            <Label for="password">Password</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup floating>
                                            <Input
                                                type="password"
                                                name="confirmPass"
                                                placeholder="Confirm Password"
                                                autoComplete="new-password"
                                                bsSize="lg"
                                                onChange={(e) =>
                                                    onChange(e.target.name, e.target.value)
                                                }
                                            />
                                            <Label for="confirmPass">Confirm Password</Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                {showInvalidPasswordFeedback()}
                                <Row className="rowCenter">
                                    <Button
                                        className="SignUpButton"
                                        onClick={() =>
                                            isStep1Valid(form.password, form.confirmPass)
                                        }
                                        disabled={!form.password || !form.confirmPass || passwordInvalid}
                                    >
                                        Next
                                    </Button>
                                </Row>
                            </section>
                        )}
                        {formStep === 2 && (
                            <section>
                                <FormGroup floating>
                                    <Input
                                        type="text"
                                        name="address"
                                        id="address"
                                        placeholder="Your Address"
                                        bsSize="lg"
                                        onChange={(e) => onChange(e.target.name, e.target.value)}
                                    />
                                    <Label for="address">Your Address</Label>
                                </FormGroup>
                                <Row>
                                    <Col>
                                        <FormGroup floating>
                                            <Input
                                                maxLength="9"
                                                type="password"
                                                name="ssn"
                                                placeholder="Social Security Number"
                                                bsSize="lg"
                                                onChange={(e) =>
                                                    onChange(e.target.name, e.target.value)
                                                }
                                            />
                                            <Label for="ssn">Social Security Number</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup floating>
                                            <Input
                                                maxLength="9"
                                                type="password"
                                                name="confirmSsn"
                                                placeholder="Confirm SSN"
                                                bsSize="lg"
                                                onChange={(e) =>
                                                    onChange(e.target.name, e.target.value)
                                                }
                                            />
                                            <Label for="confirmSsn">Confirm SSN</Label>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="rowCenter">
                                    <Button
                                        className="SignUpButton"
                                        value="Submit"
                                        disabled={!form.address || !form.ssn || !form.confirmSsn}
                                        onClick={() => isStep2Valid(form.ssn, form.confirmSsn)}
                                    >
                                        Create Account
                                    </Button>
                                </Row>
                            </section>
                        )}
                    </Form>
                </StepWizard>
            </Container>
        </div>
    );
};
export default withRouter(Registration);
