import React, {useState, useEffect, useContext} from 'react';
import {Container, Table} from 'reactstrap';
import {formatCurrency, callApi} from "./utils";

const TransactionHistory = () => {
  const [accountInfo, setInfo] = useState({});

  useEffect(() => {
    callApi('account').then(result => {
      if (result.status === 200) {
        result.json().then(data => {
          setInfo(data);
        });
      }
    });
  }, {});

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
              accountInfo.transactionHistory.map(t => (
                  <tr>
                      <td>{t.date}</td>
                      <td>{t.memo}</td>
                      <td>{t.transactionType}</td>
                      <td>{t.transactionStatus}</td>
                      <td>{t.transactionStatus === 'PENDING' || t.transactionStatus === 'APPROVED' || t.transactionStatus === 'RECEIVED' ? t.sender : t.recipient}</td>
                      <td>{formatCurrency(t.transactionType === 'DEPOSIT' || t.transactionStatus === 'RECEIVED' ? t.amount : t.amount * -1)}</td>
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