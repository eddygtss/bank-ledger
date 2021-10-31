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
    Jumbotron,
} from "reactstrap";
import { callApi } from "./utils";
import "./App.css";
import { store } from "react-notifications-component";
import "animate.css";
import "react-notifications-component/dist/theme.css";

const AccountCreate = () => {
    const createAccount = (username, password, firstName, lastName, address, ssn) => {
        callApi("create", "POST",
            JSON.stringify({
                username,
                password,
                firstName,
                lastName,
                address,
                ssn
            })).then(
            (result) => {
                if (result.status === 201) {
                    setMessage("Successfully created account.");
                    store.addNotification({
                        title: "Account Created",
                        message: "Successfully created account",
                        type: "success",
                        container: "top-right",

                        insert: "top",
                        dismiss: {
                            duration: 2000,
                            showIcon: true,
                        },
                    });
                } else {
                    result.json().then((data) => {
                        setMessage(
                            `Error creating account${data.message ? `: ${data.message}` : ''}`
                        );
                        store.addNotification({
                            title: "Error",
                            message: "Account Creation Failed",
                            type: "danger",
                            container: "top-right",
                            insert: "top",
                            dismiss: {
                                duration: 2000,
                                showIcon: true,
                            },
                        });
                    });
                }
            }
        );
    };

    const [form, setForm] = useState({ username: '', password: '', confirm_password: '', firstName: '', lastName: '', address: '', ssn: '' });

    const [isValid, setIsValid] = useState(false)

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
            setMessage("Please enter your first name.");
        }

        if (!input["email"]) {
            isValid = false;
            errors["email"] = "Please enter your email Address.";
        }

        if (typeof input["email"] !== "undefined") {

            const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(input["email"])) {
                isValid = false;
                errors["email"] = "Please enter valid email address.";
            }
        }

        if (!input["password"]) {
            isValid = false;
            errors["password"] = "Please enter your password.";
        }

        if (!input["confirm_password"]) {
            isValid = false;
            errors["confirm_password"] = "Please enter your confirm password.";
        }

        if (typeof input["password"] !== "undefined" && typeof input["confirm_password"] !== "undefined") {

            if (input["password"] !== input["confirm_password"]) {
                isValid = false;
                errors["password"] = "Passwords don't match.";
            }
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if(this.validate()){
            console.log(this.state);

            let input = {};
            input["name"] = "";
            input["email"] = "";
            input["password"] = "";
            input["confirm_password"] = "";
            this.setState({input:input});
        }
    }

    return (
        <div className="myBackGround">
            <Jumbotron>
                <div className="logo"> GEM BANK</div>
                {message || "\u00A0"}
                <Container fluid>
                    <h3>Hi, what’s your name?</h3>
                    <p>Let’s start with some basic information</p>
                    <Form>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={form.firstName}
                                        bsSize="lg"
                                        onChange={(e) => onChange(e.target.name, e.target.value)}
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
                                        onChange={(e) => onChange(e.target.name, e.target.value)}
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
                            <Col>
                                <FormGroup>
                                    <Input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Enter Password"
                                        bsSize="lg"
                                        onChange={(e) => onChange(e.target.name, e.target.value)}
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
                                        onChange={(e) => onChange(e.target.name, e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
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
                                        onChange={(e) => onChange(e.target.name, e.target.value)}
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
                                        onChange={(e) => onChange(e.target.name, e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Button
                                className="SignUpButton"
                                value="Submit"
                                disabled={!form.firstName || !form.lastName || !form.username || !form.password || !form.address || !form.ssn}
                                onClick={() => createAccount(form.username, form.password, form.firstName, form.lastName, form.address, form.ssn)}
                            >
                                Create Account
                            </Button>
                        </Row>
                    </Form>
                </Container>
            </Jumbotron>
        </div>
    );
};
export default withRouter(AccountCreate);