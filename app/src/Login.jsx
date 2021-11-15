import { withRouter } from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
    Container,
    Button,
    Form,
    FormGroup,
    Input,
    Row
} from "reactstrap";
import { callApi } from "./utils";
import { LoginContext } from "./loginContext";
import "./App.css";

import cogoToast from 'cogo-toast';
import "animate.css";
import axios from "axios";

const Login = ({ history, loginContext }) => {
    const checkCredentials = (username, password) => {
        callApi("login", "POST", JSON.stringify({ username, password })).then(
            result => {
                if (result.status === 200) {
                    loginContext.setLogin(true);
                    history.replace("/account-summary");
                    cogoToast.success('Login Successful')
                } else {
                    cogoToast.error('Login Invalid')
                }
            }
        );
    };

    const [form, setForm] = useState({ username: '', password: '' });

    const onChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    return (
        <div className="myBackGround">
            <div className="rounded px-3 px-sm-4 py-3 py-sm-5">
                <div className="logo"> GEM BANK</div>
                <Container fluid>
                    <h3>Welcome Back</h3>
                    <p>Don't miss your next opportunity.</p>
                    <Form>
                        <FormGroup>
                            <Input
                                type="text"
                                name="username"
                                placeholder="Your Email"
                                bsSize="lg"
                                onChange={(e) => onChange(e.target.name, e.target.value)}
                            />
                        </FormGroup>
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
                        <Row className="rowCenter">
                            <Button
                                className="SignUpButton"
                                onClick={() => checkCredentials(form.username, form.password)}
                            >
                                Login
                            </Button>
                        </Row>
                    </Form>
                </Container>
            </div>
        </div>
    );
};
export default withRouter(Login);