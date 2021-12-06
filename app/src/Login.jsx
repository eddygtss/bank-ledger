import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import {
    Container,
    Button,
    Form,
    FormGroup,
    Input,
    Row
} from 'reactstrap';
import './App.css';
import cogoToast from 'cogo-toast';
import { callApi } from './utils';

const Login = ({ history, setLogin }) => {
    const [form, setForm] = useState({ username: '', password: '' });

    const onChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const checkCredentials = (username, password) => {
        callApi('login', 'POST', JSON.stringify({ username, password })).then(
            result => {
                if (result.status === 200) {
                    sessionStorage.setItem("isLoggedIn", "true")
                    setLogin(true);
                    history.replace("/account-home");
                    cogoToast.success('Login Successful')
                } else {
                    setLogin(false);
                    history.replace("/login")
                    cogoToast.error('Login Invalid')
                }
            }
        );
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
                                onClick={() => checkCredentials(form.username.toLowerCase(), form.password)}
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