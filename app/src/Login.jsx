import { withRouter } from "react-router-dom";
import React, { useState, useContext } from "react";
import {
    Container,
    Button,
    Form,
    FormGroup,
    Input,
    Row,
    Jumbotron,
} from "reactstrap";
import { callApi } from "./utils";
import { LoginContext } from "./loginContext";
import "./App.css";

import { store } from "react-notifications-component";
import "animate.css";
import "react-notifications-component/dist/theme.css";

const Login = ({ history, setLogin }) => {
    const loginContext = useContext(LoginContext);
    const checkCredentials = (username, password) => {
        callApi("login", "POST", JSON.stringify({ username, password })).then(
            result => {
                if (result.status === 200) {
                    loginContext.setLogin(true);
                    history.replace("/transaction-history");

                    store.addNotification({
                        title: "Congratulations",
                        message: "Login Successful",
                        type: "success",
                        container: "bottom-center",
                        insert: "top",
                        dismiss: {
                            duration: 2000,
                            showIcon: true,
                        },
                    });
                } else {
                    setMessage("Invalid Login");
                    store.addNotification({
                        title: "Error",
                        message: "Login Failed",
                        type: "success",
                        container: "bottom-center",
                        insert: "top",
                        dismiss: {
                            duration: 2000,
                            showIcon: true,
                        },
                    });
                }
            }
        );
    };

    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const onChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    return (
        <div className="myBackGround">
            <Jumbotron>
                <div className="logo"> GEM BANK</div>
                {message || "\u00A0"}
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
                        <Row>
                            <Button
                                className="SignUpButton"
                                onClick={() => checkCredentials(form.username, form.password)}
                            >
                                Login
                            </Button>
                        </Row>
                    </Form>
                </Container>
            </Jumbotron>
        </div>
    );
};
export default withRouter(Login);