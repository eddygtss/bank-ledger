import { withRouter } from "react-router-dom";
import React, { useState } from "react";
import {
    Container,
    Button,
    Form,
    FormGroup,
    Input,
    Row,
    Col,
} from "reactstrap";
import { callApi } from "./utils";
import "./App.css";
import "animate.css";
import StepWizard from "react-step-wizard";
import cogoToast from "cogo-toast";
import { FolderPlus } from "react-feather";

const AccountCreate = ({ history, setLogin }) => {
    const createAccount = (
        username,
        password,
        firstName,
        lastName,
        address,
        ssn
    ) => {
        callApi(
            "create",
            "POST",
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
                callApi("login", "POST", JSON.stringify({ username, password })).then(
                    result => {
                        if (result.status === 200) {
                            sessionStorage.setItem("isLoggedIn", "true");
                            setLogin(true);
                            history.replace("/account-summary");
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

    const [form, setForm] = useState({
        username: "",
        password: "",
        confirm_password: "",
        firstName: "",
        lastName: "",
        address: "",
        ssn: "",
    });

    const onChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const isStep0Valid = (firstName, lastName, email) => {
        const regexName = /^[a-zA-Z ]{2,30}$/;
        const regexEmail =
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

    const isStep1Valid = (pass, c_pass) => {
        const regexPass = /^[0-9a-zA-Z]{8,}$/;
        if (pass !== c_pass) {
            cogoToast.error('Password doesn\'t Match');
        } else if (
            regexPass.test(pass) === false ||
            regexPass.test(c_pass) === false
        ) {
            cogoToast.error('Invalid Contain at least 8 character');
        } else {
            cogoToast.success('Awesome! Tell us where you live!');
            setFormStep(2);
        }
    };

    const isStep2Valid = (ssn, c_ssn) => {
        const regSnn = /^[0-9]{9,9}$/;
        if (ssn !== c_ssn) {
            cogoToast.error('SSN doesn\'t Match');
        } else if (regSnn.test(ssn) === false || regSnn.test(c_ssn) === false) {
            cogoToast.error('Please enter only the 9 digits of SSN');
        } else {
            cogoToast.loading('It will take few seconds!');
            createAccount(
                form.username,
                form.password,
                form.firstName,
                form.lastName,
                form.address,
                form.ssn
            );
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
                                            type="email"
                                            name="username"
                                            placeholder="Your Email"
                                            bsSize="lg"
                                            onChange={(e) => onChange(e.target.name, e.target.value)}
                                        />
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
                                    <Row className="rowCenter">
                                        <Button
                                            className="SignUpButton"
                                            onClick={() =>
                                                isStep1Valid(form.password, form.confirm_password)
                                            }
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
                                                    maxLength="9"
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
                                                    maxLength="9"
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
                                    <Row className="rowCenter">
                                        <Button
                                            className="SignUpButton"
                                            value="Submit"
                                            disabled={!form.address || !form.ssn || !form.confirm_SSN}
                                            onClick={() => isStep2Valid(form.ssn, form.confirm_SSN)}
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
