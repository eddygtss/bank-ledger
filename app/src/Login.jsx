import { withRouter } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { Container, Button, Form, FormGroup, Label, Input, Row, Col, Jumbotron } from 'reactstrap';
import { callApi } from "./utils";
import { LoginContext} from "./loginContext";
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
import 'animate.css'
import 'react-notifications-component/dist/theme.css'


const Login = ({history, setLogin}) => {

    const loginContext = useContext(LoginContext);
    const checkCredentials = (username, password) => {
        callApi('login', 'POST', JSON.stringify({ username, password })).then(result => {
            if (result.status === 200) {
                loginContext.setLogin(true);
                history.replace('/transaction-history');

                store.addNotification(
                    {
                        title:"Congratulations",
                        message:"Login Successful",
                        type:"success",
                        container:"top-right",
                        insert: "top",
                        dismiss:{
                            duration: 2000,
                            showIcon: true
                        }
                    });


            } else {
                setMessage('Invalid Login');
                store.addNotification(
                    {
                        title: "Error",
                        message: "Login Failed",
                        type: "danger",
                        container: "top-right",
                        insert: "top",
                        dismiss:{
                            duration: 2000,
                            showIcon: true
                        }
                    });

            }
        });
    };




    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const onChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    return (
        <Container>
            <ReactNotification />
            <Jumbotron>
                <h3>Login</h3>
                <Row>
                    { message || '\u00A0' }
                </Row>
                <Row>
                    <Col className="col-3" />
                    <Col className="col-3 col-auto">
                        <Form>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" name="username" onChange={e => onChange(e.target.name, e.target.value)}  />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" id="password" onChange={e => onChange(e.target.name, e.target.value)} />
                            </FormGroup>
                        </Form>
                        <Button onClick={() => checkCredentials(form.username, form.password)}>Login</Button>
                    </Col>
                </Row>
            </Jumbotron>

        </Container>
    )
};
export default withRouter(Login);