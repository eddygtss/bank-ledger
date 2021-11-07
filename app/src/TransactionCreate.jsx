import { withRouter, Link } from 'react-router-dom';
import React, { useState } from 'react';
import {
  Container,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Jumbotron,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import {callApi} from "./utils";

const TransactionCreate = () => {
  const createTransaction = (memo, amount, date, transactionType) => {
    callApi('transactions', 'POST', JSON.stringify({memo, amount, date, transactionType})).then(result => {
      if (result.status === 201) {
        setMessage('Transaction created.');
        setForm({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'DEPOSIT'});
      } else {
        result.json().then(data => {
          setMessage(`Error creating account${data.message ? `: ${data.message}` : ''}`);
        });
      }
    });
  };

  const createSendTransaction = (memo, recipient, amount, date, transactionType) => {
    callApi('send', 'POST', JSON.stringify({memo, recipient, amount, date, transactionType})).then(result => {
      if (result.status === 201) {
        setMessage('Successfully sent $' + amount + ' to ' + recipient);
        setForm({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'SEND'});
      } else {
        result.json().then(data => {
          setMessage(`Error ${data.message ? `: ${data.message}` : ''}`);
        });
      }
    });
  };

  const createRequestTransaction = (memo, recipient, amount, date, transactionType) => {
    callApi('request', 'POST', JSON.stringify({memo, recipient, amount, date, transactionType})).then(result => {
      if (result.status === 201) {
        setMessage('Request successfully sent to ' + recipient);
        setForm({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'SEND'});
      } else {
        result.json().then(data => {
          setMessage(`Error ${data.message ? `: ${data.message}` : ''}`);
        });
      }
    });
  };

  const [form, setForm] = useState({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'DEPOSIT'});
  const [message, setMessage] = useState('');

  const recipientField = () => {
    if(form.transactionType === 'SEND' || form.transactionType === 'REQUEST') {
      return (
          <FormGroup>
            <Label for="recipient">Recipient</Label>
            <Input name="recipient" onChange={e => onChange(e.target.name, e.target.value)} required/>
          </FormGroup>
      )
    }
  }

  const submitButton = () => {
    if(form.transactionType === 'SEND') {
      return (
          <Button onClick={() => createSendTransaction(
              form.memo,
              form.recipient,
              form.amount,
              form.date,
              form.transactionType)}>Send Funds</Button>
      )
    } else if(form.transactionType === 'REQUEST') {
      return (
          <Button onClick={() => createRequestTransaction(
              form.memo,
              form.recipient,
              form.amount,
              form.date,
              form.transactionType)}>Request Funds</Button>
      )
    } else if(form.transactionType === 'DEPOSIT') {
      return (
          <Button onClick={() => createTransaction(
              form.memo,
              form.amount,
              form.date,
              form.transactionType)}>Deposit</Button>
      )
    } else {
      return (
          <Button onClick={() => createTransaction(
              form.memo,
              form.amount,
              form.date,
              form.transactionType)}>Withdraw</Button>
      )
    }
  }

  const onChange = (name, value) => {
    setForm({...form, [name]: value});
  };

  return (
    <Container>
      <Row>
        {message || '\u00A0'}
      </Row>
      <Jumbotron>
        <h3>Create Transaction</h3>
        <Row>
          <Col className="col-3"/>
          <Col className="col-3 col-auto">
            <Form>
              <FormGroup>
                <Label for="memo">Memo</Label>
                <Input name="memo" onChange={e => onChange(e.target.name, e.target.value)} required/>
              </FormGroup>
              {recipientField()}
              <FormGroup>
                <Label for="amount">Amount</Label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <Input type="number" name="amount" value={form.amount}
                         onChange={e => onChange(e.target.name, e.target.value)} required/>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label for="date">Date</Label>
                <Input type="date" name="date" onChange={e => onChange(e.target.name, e.target.value)} required/>
              </FormGroup>
              <FormGroup>
                <Label for="type">Type</Label>
                <Input type="select" name="transactionType" onChange={e => onChange(e.target.name, e.target.value)}
                       required>
                  <option>DEPOSIT</option>
                  <option>WITHDRAWAL</option>
                  <option>SEND</option>
                  <option>REQUEST</option>
                </Input>
              </FormGroup>
            </Form>
            {submitButton()}
          </Col>
        </Row>
      </Jumbotron>

    </Container>
  )
};
export default withRouter(TransactionCreate);
