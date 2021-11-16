import React, {useEffect, useState} from 'react';
import {Alert, Button, Col, Container, Offcanvas, OffcanvasBody, OffcanvasHeader, Row, Table} from 'reactstrap';
import {callApi, formatCurrency} from "./utils";
import {DepositFundsModal} from "./Components/Modal/DepositFundsModal";
import {RequestFundsModal} from "./Components/Modal/RequestFundsModal";
import {WithdrawFundsModal} from "./Components/Modal/WithdrawFundsModal";
import {SendFundsModal} from "./Components/Modal/SendFundsModal";
import TransactionEntries from "./Components/Transactions/TransactionEntries";

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
              <TransactionEntries accountInfo={accountInfo} transType={'request'} setMessage={setMessage}/>
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
              <TransactionEntries accountInfo={accountInfo} transType={'moneyIn'} setMessage={setMessage}/>
            }
          </Col>
          <Col className="border moneyTables bdr pl-4">
            <h4>Money Out</h4>
            <Button className="modalRedButton" onClick={() => toggle('sendModal')}>Send</Button>
            <SendFundsModal sendModal={sendModal} setSendModal={setSendModal}/>

            <Button className="modalRedButton requestBtn" onClick={() => toggle('withdrawModal')}>Withdraw</Button>
            <WithdrawFundsModal withdrawModal={withdrawModal} setWithdrawModal={setWithdrawModal}/>
            {accountInfo.accountName &&
              <TransactionEntries accountInfo={accountInfo} transType={'moneyOut'} setMessage={setMessage}/>
            }
          </Col>
          </Row>
        </Container>
      </>
  );
};

export default AccountSummary;