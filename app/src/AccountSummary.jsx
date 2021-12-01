import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Row
} from 'reactstrap';
import { DepositFundsModal } from './Components/Modal/DepositFundsModal';
import { RequestFundsModal } from './Components/Modal/RequestFundsModal';
import { WithdrawFundsModal } from './Components/Modal/WithdrawFundsModal';
import { SendFundsModal } from './Components/Modal/SendFundsModal';
import TransactionEntries from './Components/Transactions/TransactionEntries';
import cogoToast from 'cogo-toast';
import { callApi, formatCurrency } from './utils';

export const AccountSummary = ({ setLogin }) => {
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
      } else {
        setLogin(false);
        sessionStorage.setItem("isLoggedIn", "false");
        cogoToast.error('You have been logged out.')
      }
    });
  }, [message, depositModal, requestModal, sendModal, withdrawModal]);

  const getPendingRequests = () => {
    return accountInfo.accountName && accountInfo.requestHistory.filter(request => {
      const status = request.requestStatus.toLowerCase();
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
            <h1 className="text-center">Requests</h1>
          </OffcanvasHeader>
          <OffcanvasBody>
            {accountInfo.accountName &&
              <TransactionEntries accountInfo={accountInfo} transType={'request'} setMessage={setMessage}/>
            }
          </OffcanvasBody>
        </Offcanvas>
          {accountInfo.accountName &&
          <div>
            <h3>{accountInfo.accountName}</h3>
            <Button className="requestBtn btn-info" onClick={() => toggle('offCanvas')}>View Requests</Button>
            <h4>Balance: {formatCurrency(accountInfo.balance)}</h4>

            <br/>
          </div>
          }
          {showPendingRequestAlert()}
          <br/>
          <Row lg="2" md="1" sm="1" xs="1" className="gx-2" style={{
            alignContent: "space-evenly"
          }}>
          <Col className="border table-light moneyTables bdr p-3 mb-2">
            <h4 className="text-center">Money In</h4>
            <Button className="modalGreenButton mb-3" onClick={() => toggle('requestModal')}>Request</Button>
            <RequestFundsModal requestModal={requestModal} setRequestModal={setRequestModal} accountInfo={accountInfo}/>

            <Button className="modalGreenButton requestBtn mb-3" onClick={() => toggle('depositModal')}>Deposit</Button>
            <DepositFundsModal depositModal={depositModal} setDepositModal={setDepositModal}/>
            <br />
            {accountInfo.accountName &&
              <TransactionEntries accountInfo={accountInfo} transType={'moneyIn'} setMessage={setMessage}/>
            }
          </Col>
          <Col className="border table-light moneyTables bdr p-3 mb-2">
            <h4 className="text-center">Money Out</h4>
            <Button className="modalRedButton mb-3" onClick={() => toggle('sendModal')}>Send</Button>
            <SendFundsModal sendModal={sendModal} setSendModal={setSendModal} accountInfo={accountInfo}/>

            <Button className="modalRedButton requestBtn mb-3" onClick={() => toggle('withdrawModal')}>Withdraw</Button>
            <WithdrawFundsModal withdrawModal={withdrawModal} setWithdrawModal={setWithdrawModal}/>
            {accountInfo.accountName &&
              <TransactionEntries accountInfo={accountInfo} transType={'moneyOut'} setMessage={setMessage}/>
            }
          </Col>
          </Row>
      </>
  );
};
