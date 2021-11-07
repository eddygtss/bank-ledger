import React, { useState, useEffect } from 'react';
import { Container, Table } from 'reactstrap';
import { formatCurrency, callApi } from "./utils";
import { CheckSquare, XSquare } from "react-feather";

const TransactionHistory = () => {
  const [accountInfo, setInfo] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    callApi('account').then(result => {
      if (result.status === 200) {
        result.json().then(data => {
          setInfo(data);
        });
      }
    });
  }, [message]);

  const approveTransaction = (transactionId) => {
    callApi('approveRequest', 'POST', JSON.stringify({transactionId})).then(result => {
      if (result.status === 200) {
        setMessage('Request approved.');
      } else {
        result.json().then(data => {
          setMessage(`Error approving request account: ${data.message}`);
        });
      }
    });
  };

  const denyTransaction = (transactionId) => {
    callApi('denyRequest', 'POST', JSON.stringify({transactionId})).then(result => {
      if (result.status === 200) {
        setMessage('Request denied.');
      } else {
        result.json().then(data => {
          setMessage(`Error denying request account: ${data.message}`);
        });
      }
    });
  };

  const approveButton = (t,transactionId) => {
    if (t.transactionStatus === 'PENDING') {
      return (
        <CheckSquare color='green' onClick={() => approveTransaction(transactionId)}/>
      )
    }
  }
  const denyButton = (t,transactionId) => {
    if (t.transactionStatus === 'PENDING') {
      return (
          <XSquare color='red' onClick={() => denyTransaction(transactionId)}/>
      )
    }
  }

  return (
    <Container>
      {accountInfo.accountName &&
      <div>
        <h3>Account Name: {accountInfo.accountName}</h3>
        <h4>Balance: {formatCurrency(accountInfo.balance)}</h4><br/>
        <Table>
          <thead>
          <tr>
            <th>Date</th>
            <th>Message</th>
            <th>Type</th>
            <th>Status</th>
            <th>Account</th>
            <th>Amount</th>
          </tr>
          </thead>
          <tbody>
          {
              accountInfo.transactionHistory.map((t,index) => (
                  <tr>
                      <td>{t.date}</td>
                      <td>{t.memo}</td>
                      <td>{t.transactionType}</td>
                      <td>
                        {t.transactionStatus}
                        {approveButton(t,index)}
                        {denyButton(t,index)}
                      </td>
                      <td>{t.transactionStatus === 'PENDING' || t.transactionStatus === 'APPROVED' || t.transactionStatus === 'RECEIVED' ? t.sender : t.recipient}</td>
                      <td>{formatCurrency(
                          t.transactionType === 'DEPOSIT'
                          || t.transactionStatus === 'RECEIVED'
                          || (t.transactionStatus === 'SENT' && t.transactionType === 'REQUEST') ? t.amount : t.amount * -1)}</td>
                  </tr>))
          }
          {!accountInfo.transactionHistory.length && 'No transactions recorded.'}
          </tbody>
        </Table>
      </div>
      }
    </Container>
  );
};

export default TransactionHistory;