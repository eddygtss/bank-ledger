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
import { DepositFundsModal } from '../../Modal/DepositFundsModal';
import { RequestFundsModal } from '../../Modal/RequestFundsModal';
import { WithdrawFundsModal } from '../../Modal/WithdrawFundsModal';
import { SendFundsModal } from '../../Modal/SendFundsModal';
import TransactionEntries from '../../Transactions/TransactionEntries';
import cogoToast from 'cogo-toast';
import { callApi, formatCurrency } from '../../Utils/utils';

export const AccountSummary = ({ accountInfo, reload, setReload }) => {
  const [sendModal, setSendModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);

  const toggle = (component) => {
    switch (component) {
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

  return (
      <>
          <Row lg="2" md="1" sm="1" xs="1" className="gx-2" style={{
            alignContent: "space-evenly"
          }}>
          <Col className="border table-light moneyTables bdr p-3 mb-2">
            <h4 className="text-center">Money In</h4>
            <Button className="modalGreenButton mb-3" onClick={() => toggle('requestModal')}>Request</Button>
            <RequestFundsModal
                requestModal={requestModal}
                setRequestModal={setRequestModal}
                accountInfo={accountInfo}
                reload={reload}
                setReload={setReload}
            />

            <Button className="modalGreenButton requestBtn mb-3" onClick={() => toggle('depositModal')}>Deposit</Button>
            <DepositFundsModal
                depositModal={depositModal}
                setDepositModal={setDepositModal}
                reload={reload}
                setReload={setReload}
            />
            <br />
            {accountInfo.accountName &&
              <TransactionEntries
                  accountInfo={accountInfo}
                  transType={'moneyIn'}
                  reload={reload}
                  setReload={setReload}
              />
            }
          </Col>
          <Col className="border table-light moneyTables bdr p-3 mb-2">
            <h4 className="text-center">Money Out</h4>
            <Button className="modalRedButton mb-3" onClick={() => toggle('sendModal')}>Send</Button>
            <SendFundsModal
                sendModal={sendModal}
                setSendModal={setSendModal}
                accountInfo={accountInfo}
                reload={reload}
                setReload={setReload}
            />

            <Button className="modalRedButton requestBtn mb-3" onClick={() => toggle('withdrawModal')}>Withdraw</Button>
            <WithdrawFundsModal
                withdrawModal={withdrawModal}
                setWithdrawModal={setWithdrawModal}
                reload={reload}
                setReload={setReload}
            />
            {accountInfo.accountName &&
              <TransactionEntries
                  accountInfo={accountInfo}
                  transType={'moneyOut'}
                  reload={reload}
                  setReload={setReload}
              />
            }
          </Col>
          </Row>
      </>
  );
};
