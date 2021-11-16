import { Table } from "reactstrap";
import {callApi, formatCurrency} from "../../utils";
import React, {useState} from "react";
import cogoToast from "cogo-toast";
import {CheckSquare, XSquare} from "react-feather";
import TableRows from "./TableRows";

const TransactionEntries = ({accountInfo, transType, setMessage}) => {
    const getRequestTransactions = () => {
        return accountInfo.accountName && accountInfo.transactionHistory.filter(transaction => {
            const type = transaction.transactionType.toLowerCase();
            return type.includes('request');
        });
    }

    const getMoneyInTransactions = () => {
        return accountInfo.accountName && accountInfo.transactionHistory.filter(transaction => {
            const type = transaction.transactionType.toLowerCase();
            const status = transaction.transactionStatus.toLowerCase();
            return type.includes('deposit') || status.includes('received');
        });
    }

    const getMoneyOutTransactions = () => {
        return accountInfo.accountName && accountInfo.transactionHistory.filter(transaction => {
            const type = transaction.transactionType.toLowerCase();
            const status = transaction.transactionStatus.toLowerCase();
            return type.includes('withdrawal') || (status.includes('sent') && type.includes('send') || status.includes('approved'));
        });
    }

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


    if(transType === 'moneyOut') {
        return (
            <Table
                className="bdr table-danger p-3">
                <tbody>
                    {accountInfo.accountName &&
                        TableRows(getMoneyOutTransactions())
                    }
                    {!accountInfo.transactionHistory.length && 'No transactions recorded.'}
                </tbody>
            </Table>
        )
    } else if(transType === 'moneyIn') {
        return(
            <Table
                className="bdr table-success p-3">
                <tbody>
                    {accountInfo.accountName &&
                        TableRows(getMoneyInTransactions())
                    }
                    {!accountInfo.transactionHistory.length && 'No transactions recorded.'}
                </tbody>
            </Table>
        )
    } else if (transType === 'request') {
        return (
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
        )
    }
}
export default TransactionEntries;