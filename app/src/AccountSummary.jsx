import React, {useEffect, useState} from 'react';
import {Alert, Button, Col, Container, Offcanvas, OffcanvasBody, OffcanvasHeader, Row, Table} from 'reactstrap';
import {callApi, formatCurrency} from "./utils";
import {CheckSquare, XSquare} from "react-feather";
import cogoToast from 'cogo-toast';
import {DepositFundsModal} from "./Components/Modal/DepositFundsModal";
import {RequestFundsModal} from "./Components/Modal/RequestFundsModal";
import {WithdrawFundsModal} from "./Components/Modal/WithdrawFundsModal";
import {SendFundsModal} from "./Components/Modal/SendFundsModal";

const AccountSummary = () => {
  const [accountInfo, setInfo] = useState({});
  const [message, setMessage] = useState('');
  const [sendModal, setSendModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [offCanvas, setOffCanvas] = useState(false);

  const toggle = (component) => {
    switch (component) {
      case 'offCanvas':
        setOffCanvas(!offCanvas);
        break;
      case 'sendModal':
        setSendModal(!sendModal);
        break;
      case 'requestModal':
        setRequestModal(!requestModal);
        break;
      case 'depositModal':
        setDepositModal(!depositModal);
        break;
      case 'withdrawModal':
        setWithdrawModal(!withdrawModal);
        break;
    }
  }

  useEffect(() => {
    callApi('account').then(result => {
      if (result.status === 200) {
        result.json().then(data => {
          setInfo(data);
        });
      }
    });
  }, [message, depositModal, requestModal, sendModal, withdrawModal]);

  const approveTransaction = (transactionId) => {
    callApi('approveRequest', 'POST', JSON.stringify({transactionId})).then(result => {
      if (result.status === 200) {
        setMessage('Request approved.');
        cogoToast.success('Request approved.');
      } else {
        result.json().then(data => {
          setMessage(`Error approving request account: ${data.message}`);
          cogoToast.error(`Error approving request account: ${data.message}`);
        });
      }
    });
  };

  const denyTransaction = (transactionId) => {
    callApi('denyRequest', 'POST', JSON.stringify({transactionId})).then(result => {
      if (result.status === 200) {
        setMessage('Request denied.');
        cogoToast.success('Request denied.');
      } else {
        result.json().then(data => {
          setMessage(`Error denying request account: ${data.message}`);
          cogoToast.error(`Error denying request account: ${data.message}`);
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

  const getMoneyInTransactions = () => {
    return accountInfo.transactionHistory.filter(transaction => {
      const type = transaction.transactionType.toLowerCase();
      const status = transaction.transactionStatus.toLowerCase();
      return type.includes('deposit') || status.includes('received');
    });
  }

  const getMoneyOutTransactions = () => {
    return accountInfo.transactionHistory.filter(transaction => {
      const type = transaction.transactionType.toLowerCase();
      const status = transaction.transactionStatus.toLowerCase();
      return type.includes('withdrawal') || (status.includes('sent') && type.includes('send') || status.includes('approved'));
    });
  }

  const getRequestTransactions = () => {
    return accountInfo.accountName && accountInfo.transactionHistory.filter(transaction => {
      const type = transaction.transactionType.toLowerCase();
      return type.includes('request');
    });
  }

  const getPendingRequests = () => {
    return accountInfo.accountName && accountInfo.transactionHistory.filter(transaction => {
      const status = transaction.transactionStatus.toLowerCase();
      return status.includes('pending');
    }).length;
  }

  const showPendingRequestAlert = () => {
    if (getPendingRequests() > 0){
      return (
          <Alert color="primary">
            You have {getPendingRequests()} pending request(s) waiting, click the View Requests button to see all current pending requests.
          </Alert>
      )
    }
  }

  return (
      <>
        <Offcanvas toggle={() => toggle('offCanvas')} isOpen={offCanvas} direction="end">
          <OffcanvasHeader toggle={() => toggle('offCanvas')}>
            Requests
          </OffcanvasHeader>
          <OffcanvasBody>
            {accountInfo.accountName &&
            <div>
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
                  getRequestTransactions().map((transaction,index) => (
                      <tr>
                        <td>{transaction.date}</td>
                        <td>{transaction.memo}</td>
                        <td>{transaction.transactionType}</td>
                        <td>
                          {transaction.transactionStatus}
                          {approveButton(transaction,index)}
                          {denyButton(transaction,index)}
                        </td>
                        <td>{transaction.transactionStatus === 'PENDING' || transaction.transactionStatus === 'APPROVED' || transaction.transactionStatus === 'RECEIVED' ? transaction.sender : transaction.recipient}</td>
                        <td>{formatCurrency(
                            transaction.transactionType === 'DEPOSIT'
                            || transaction.transactionStatus === 'RECEIVED'
                            || (transaction.transactionStatus === 'SENT' && transaction.transactionType === 'REQUEST') ? transaction.amount : transaction.amount * -1)}</td>
                      </tr>))
                }
                {!accountInfo.transactionHistory.length && 'No transactions recorded.'}
                </tbody>
              </Table>
            </div>
            }
          </OffcanvasBody>
        </Offcanvas>
        <Container fluid className="px-4">
          {accountInfo.accountName &&
          <div>
            <h3>Account Name: {accountInfo.accountName}</h3>
            <Button className="requestBtn btn-info" onClick={() => toggle('offCanvas')}>View Requests</Button>
            <h4>Balance: {formatCurrency(accountInfo.balance)}</h4>

            <br/>
          </div>
          }
          {showPendingRequestAlert()}
          <br/>
          <Row lg="2" md="1" sm="1" xs="1" className="gx-2">
          <Col className="border moneyTables bdr pr-4">
            <h4>Money In</h4>
            <Button className="modalGreenButton" onClick={() => toggle('requestModal')}>Request</Button>
            <RequestFundsModal requestModal={requestModal} setRequestModal={setRequestModal}/>

            <Button className="modalGreenButton requestBtn" onClick={() => toggle('depositModal')}>Deposit</Button>
            <DepositFundsModal depositModal={depositModal} setDepositModal={setDepositModal}/>
            {accountInfo.accountName &&
              <Table responsive
                     size="sm" striped className="bdr table-success">
                <thead className="table-light">
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
                  getMoneyInTransactions().map((transaction,index) => (
                      <tr>
                        <td>{transaction.date}</td>
                        <td>{transaction.memo}</td>
                        <td>{transaction.transactionType}</td>
                        <td>
                          {transaction.transactionStatus}
                          {approveButton(transaction,index)}
                          {denyButton(transaction,index)}
                        </td>
                        <td>{transaction.transactionStatus === 'PENDING' || transaction.transactionStatus === 'APPROVED' || transaction.transactionStatus === 'RECEIVED' ? transaction.sender : transaction.recipient}</td>
                        <td>{formatCurrency(
                            transaction.transactionType === 'DEPOSIT'
                            || transaction.transactionStatus === 'RECEIVED'
                            || (transaction.transactionStatus === 'SENT' && transaction.transactionType === 'REQUEST') ? transaction.amount : transaction.amount * -1)}</td>
                      </tr>))
                }
                {!accountInfo.transactionHistory.length && 'No transactions recorded.'}
                </tbody>
              </Table>
            }
          </Col>
          <Col className="border moneyTables bdr pl-4">
            <h4>Money Out</h4>
            <Button className="modalRedButton" onClick={() => toggle('sendModal')}>Send</Button>
            <SendFundsModal sendModal={sendModal} setSendModal={setSendModal}/>

            <Button className="modalRedButton requestBtn" onClick={() => toggle('withdrawModal')}>Withdraw</Button>
            <WithdrawFundsModal withdrawModal={withdrawModal} setWithdrawModal={setWithdrawModal}/>
            {accountInfo.accountName &&
              <Table responsive
                     size="sm" striped className="bdr table-danger">
                <thead className="table-light">
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
                  getMoneyOutTransactions().map((t,index) => (
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
            }
          </Col>
          </Row>
        </Container>
      </>
  );
};

export default AccountSummary;