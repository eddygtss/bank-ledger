import { withRouter } from 'react-router-dom';
import React, { useState } from 'react';
import {
    Container,
    Button,
    Form,
    FormGroup,
    Input,
    Row,
    Col
} from 'reactstrap';
import { callApi } from './utils';
import './App.css';
import 'animate.css';
import StepWizard from 'react-step-wizard';
import cogoToast from 'cogo-toast';

const AccountCreate = () => {
    const createAccount = (
        username,
        password,
        firstName,
        lastName,
        address,
        ssn
    ) => {
        callApi(
            'create',
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
                setMessage('Successfully created account.');
                cogoToast.success(message)
            } else {
                result.json().then((data) => {
                    setMessage(
                        `Error creating account${data.message ? `: ${data.message}` : ''}`
                    );
                    cogoToast.error(message)
                });
            }
        });
    };

    const [form, setForm] = useState({
        username: '',
        password: '',
        confirm_password: '',
        firstName: '',
        lastName: '',
        address: '',
        ssn: '',
    });

    const [isValid, setIsValid] = useState(false);

    const [message, setMessage] = useState('');

    const onChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const validate = () => {
        let input = this.state.form;
        let errors = {};
        let isValid = true;

        if (!input['firstName']) {
            isValid = false;
            setMessage('Please enter your first name.');
        }

        if (!input['email']) {
            isValid = false;
            errors['email'] = 'Please enter your email Address.';
        }

        if (typeof input['email'] !== 'undefined') {
            const pattern = new RegExp(
                /^(('[\w-\s]+')|([\w-]+(?:\.[\w-]+)*)|('[\w-\s]+')([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
            );
            if (!pattern.test(input['email'])) {
                isValid = false;
                errors['email'] = "Please enter valid email address.";
            }
        }

        if (!input['password']) {
            isValid = false;
            errors['password'] = "Please enter your password.";
        }

        if (!input['confirm_password']) {
            isValid = false;
            errors['confirm_password'] = "Please enter your confirm password.";
        }

        if (
            typeof input['password'] !== "undefined" &&
            typeof input['confirm_password'] !== "undefined"
        ) {
            if (input['password'] !== input["confirm_password"]) {
                isValid = false;
                errors['password'] = 'Passwords don\'t match.';
            }
        }

        this.setState({
            errors: errors,
        });

        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (this.validate()) {
            console.log(this.state);

            let input = {};
            input["name"] = "";
            input["email"] = "";
            input["password"] = "";
            input["confirm_password"] = "";
            this.setState({ input: input });
        }
    };
    const [formStep, setFormStep] = useState(0);
    return (
        <div className="myBackGround">
            <div className="rounded px-3 px-sm-4 py-3 py-sm-5">
                <div className="logo"> GEM BANK</div>
                <Container fluid>
                    <h3>Hi, welcome to Gem Bank!</h3>
                    <p>Let’s start with some basic information</p>
                    <StepWizard>
                        <Form>
                            {formStep === 0 && (
                                <section>
                                    <Row>
                                        <Col>
                                            <FormGroup>
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
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Input
                                                    type="text"
                                                    name="lastName"
                                                    placeholder="Last Name"
                                                    bsSize="lg"
                                                    onChange={(e) =>
                                                        onChange(e.target.name, e.target.value)
                                                    }
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="username"
                                            placeholder="Your Email"
                                            bsSize="lg"
                                            onChange={(e) => onChange(e.target.name, e.target.value)}
                                        />
                                    </FormGroup>
                                    <Row>
                                        <Button
                                            className="SignUpButton"
                                            onClick={() => setFormStep(1)}
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
                                            <FormGroup>
                                                <Input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    placeholder="Enter Password"
                                                    bsSize="lg"
                                                    onChange={(e) =>
                                                        onChange(e.target.name, e.target.value)
                                                    }
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Input
                                                    type="password"
                                                    name="confirm_password"
                                                    placeholder="Confirm password"
                                                    bsSize="lg"
                                                    onChange={(e) =>
                                                        onChange(e.target.name, e.target.value)
                                                    }
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Button
                                            className="SignUpButton"
                                            onClick={() => setFormStep(2)}
                                            disabled={!form.password || !form.confirm_password}
                                        >
                                            Next
                                        </Button>
                                    </Row>
                                </section>
                            )}
                            {formStep === 2 && (
                                <section>
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="address"
                                            id="address"
                                            placeholder="Your Address"
                                            bsSize="lg"
                                            onChange={(e) => onChange(e.target.name, e.target.value)}
                                        />
                                    </FormGroup>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Input
                                                    type="password"
                                                    name="ssn"
                                                    placeholder="Enter SSN"
                                                    bsSize="lg"
                                                    onChange={(e) =>
                                                        onChange(e.target.name, e.target.value)
                                                    }
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <Input
                                                    type="password"
                                                    name="confirm_SSN"
                                                    placeholder="Confirm ssn"
                                                    bsSize="lg"
                                                    onChange={(e) =>
                                                        onChange(e.target.name, e.target.value)
                                                    }
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Button
                                            className="SignUpButton"
                                            value="Submit"
                                            disabled={!form.address || !form.ssn}
                                            onClick={() =>
                                                createAccount(
                                                    form.username,
                                                    form.password,
                                                    form.firstName,
                                                    form.lastName,
                                                    form.address,
                                                    form.ssn
                                                )
                                            }
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
        </div>
    );
};
export default withRouter(AccountCreate);