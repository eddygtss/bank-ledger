import { withRouter } from 'react-router-dom';
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
  InputGroup,
  InputGroupText
} from 'reactstrap';
import { callApi } from "./utils";
import cogoToast from 'cogo-toast';

const TransactionCreate = ({ history }) => {
  const createTransaction = (memo, amount, date, transactionType) => {
    callApi('transactions', 'POST', JSON.stringify({memo, amount, date, transactionType})).then(result => {
      if (result.status === 201) {
        cogoToast.success('Transaction created.');
        setForm({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'DEPOSIT'});
        redirectToHistory();
      } else {
        result.json().then(data => {
          cogoToast.error(`Error creating account${data.message ? `: ${data.message}` : ''}`);
        });
      }
    });
  };

  const createSendTransaction = (memo, recipient, amount, date, transactionType) => {
    callApi('send', 'POST', JSON.stringify({memo, recipient, amount, date, transactionType})).then(result => {
      if (result.status === 201) {
        cogoToast.success('Successfully sent $' + amount + ' to ' + recipient);
        setForm({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'SEND'});
        redirectToHistory();
      } else {
        result.json().then(data => {
          cogoToast.error(`Error ${data.message ? `: ${data.message}` : ''}`);
        });
      }
    });
  };

  const createRequestTransaction = (memo, recipient, amount, date, transactionType) => {
    callApi('request', 'POST', JSON.stringify({memo, recipient, amount, date, transactionType})).then(result => {
      if (result.status === 201) {
        cogoToast.success('Request successfully sent to ' + recipient);
        setForm({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'SEND'});
        redirectToHistory();
      } else {
        result.json().then(data => {
          cogoToast.error(`Error ${data.message ? `: ${data.message}` : ''}`);
        });
      }
    });
  };

  const [form, setForm] = useState({memo: '', recipient: '', amount: 0.00, date: '', transactionType: 'DEPOSIT'});

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

  const redirectToHistory = () => {
    history.replace('/transaction-history')
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
      <div className="rounded px-3 px-sm-4 py-3 py-sm-5">
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
                  <InputGroupText>$</InputGroupText>
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
      </div>
    </Container>
  )
};
export default withRouter(TransactionCreate);
