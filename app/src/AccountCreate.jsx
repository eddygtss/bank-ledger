import { withRouter } from 'react-router-dom';
import React, { useState } from 'react';
import {Container, Button, Form, FormGroup, Label, Input, Row, Col, Jumbotron} from 'reactstrap';
import {callApi} from "./utils";

import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
import "animate.css"
import 'react-notifications-component/dist/theme.css'

const AccountCreate = () => {
    const createAccount = (username, password) => {
        callApi('create', 'POST', JSON.stringify({ username, password })).then(result => {
            if (result.status === 201) {
                setMessage('Successfully created account.')
                store.addNotification(
                    {
                        title:"Account Created",
                        message:"Successfully created account",
                        type:"success",
                        container:"top-right",

                        insert: "top",
                        dismiss:{
                            duration: 2000,
                            showIcon: true
                        }
                    });
            } else {
                result.json().then(data => {
                    setMessage(`Error creating account${data.message ? `: ${data.message}` : ''}`);
                    store.addNotification(
                        {
                            title: "Error",
                            message: "Account Creation Failed",
                            type: "danger",
                            container: "top-right",
                            insert: "top",
                            dismiss:{
                                duration: 2000,
                                showIcon: true
                            }
                        });
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
          <Row>
              { message || '\u00A0' }
          </Row>
          <Jumbotron>
              <h3>Create New Account</h3>

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
                      <Button onClick={() => createAccount(form.username, form.password)}>Create Account</Button>
                  </Col>
              </Row>
          </Jumbotron>

      </Container>
    )
};
export default withRouter(AccountCreate);
