import React from 'react';
import cogoToast from 'cogo-toast';
import { CheckSquare, XSquare } from 'react-feather';
import './Table.scss';
import { callApi, formatCurrency } from '../../utils';

const TableRows = (transactions, request, accountInfo, {reload, setReload}) => {
    const approveRequest = (request) => {
        callApi('approve-request', 'POST', request).then(result => {
            if (result.status === 200) {
                setReload(!reload)
                cogoToast.success('Request approved.');
            } else {
                result.json().then(data => {
                    cogoToast.error(`Error approving request account: ${data.message}`);
                });
            }
        });
    };

    const denyRequest = (request) => {
        callApi('deny-request', 'POST', request).then(result => {
            if (result.status === 200) {
                setReload(!reload)
                cogoToast.success('Request denied.');
            } else {
                result.json().then(data => {
                    cogoToast.error(`Error denying request account: ${data.message}`);
                });
            }
        });
    };

    const approveButton = (request) => {
        if (request.requestStatus === 'PENDING') {
            return (
                <CheckSquare style={{cursor: "pointer"}} color='green' onClick={() => approveRequest(request.id)}/>
            )
        }
    }
    const denyButton = (request) => {
        if (request.requestStatus === 'PENDING') {
            return (
                <XSquare color='red' style={{cursor: "pointer"}} onClick={() => denyRequest(request.id)}/>
            )
        }
    }

    let currentUser = accountInfo.documentId.substring(5);
    let prevDate = null;

    if (request === false) {
        return (
            <>
                {
                    transactions.reverse().map((transaction) => {
                        if (transaction.date !== prevDate) {
                            prevDate = transaction.date;
                            if (transaction.recipient === currentUser) {
                                return (
                                    <>
                                        <tr className='text-center tableDateHeadings'>
                                            {transaction.date}
                                        </tr>
                                        <tr className='tableRows'>
                                            <td>{transaction.sender
                                                ? '[RECEIVED FROM ' + transaction.sender.toUpperCase() + ']\n' + transaction.memo
                                                : '[' + transaction.transactionType + ']\n' + transaction.memo}</td>
                                            <td className="align-middle text-start" style={{width: "100px"}}>{formatCurrency(transaction.amount)}</td>
                                        </tr>
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <tr className='text-center tableDateHeadings'>
                                            {transaction.date}
                                        </tr>
                                        <tr className='tableRows'>
                                            <td>{transaction.sender
                                                ? '[' + transaction.transactionStatus + ' TO ' + transaction.recipient.toUpperCase() + ']\n' + transaction.memo
                                                : '[' + transaction.transactionType + ']\n' + transaction.memo}</td>
                                            <td className="align-middle text-start" style={{width: "100px"}}>{formatCurrency(transaction.amount)}</td>
                                        </tr>
                                    </>
                                )
                            }
                        } else {
                            if (transaction.recipient === currentUser) {
                                return (
                                    <tr className='tableRows'>
                                        <td>{transaction.sender
                                            ? '[RECEIVED FROM ' + transaction.sender.toUpperCase() + ']\n' + transaction.memo
                                            : '[' + transaction.transactionType + ']\n' + transaction.memo}</td>
                                        <td className="align-middle text-start" style={{width: "100px"}}>{formatCurrency(transaction.amount)}</td>
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr className='tableRows'>
                                        <td>{transaction.sender
                                            ? '[' + transaction.transactionStatus + ' TO ' + transaction.recipient.toUpperCase() + ']\n' + transaction.memo
                                            : '[' + transaction.transactionType + ']\n' + transaction.memo}</td>
                                        <td className="align-middle text-start" style={{width: "100px"}}>{formatCurrency(transaction.amount)}</td>
                                    </tr>
                                )
                            }
                        }
                    })
                }
            </>

        )
    } else {
        return (
            <>
                {
                    transactions.reverse().map((request) => {
                        if (request.date !== prevDate) {
                            prevDate = request.date;

                            if (request.requester === currentUser) {
                                return (
                                    <>
                                        <tr className='text-center tableDateHeadings'>
                                            {request.date}
                                        </tr>
                                        <tr className='tableRows'>
                                            <td>{'[REQUEST SENT TO ' + request.responder.toUpperCase() + ']\n' + request.memo}</td>
                                            <td className="align-middle">{formatCurrency(request.amount) + '\n' + request.requestStatus}</td>
                                            <td className="align-middle">{approveButton(request)}</td>
                                            <td className="align-middle">{denyButton(request)}</td>
                                        </tr>
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <tr className='text-center tableDateHeadings'>
                                            {request.date}
                                        </tr>
                                        <tr className='tableRows'>
                                            <td>{'[REQUEST FROM ' + request.requester.toUpperCase() + ']\n' + request.memo}</td>
                                            <td className="align-middle">{formatCurrency(request.amount) + '\n' + request.requestStatus}</td>
                                            <td className="align-middle">{approveButton(request)}</td>
                                            <td className="align-middle">{denyButton(request)}</td>
                                        </tr>
                                    </>
                                )
                            }
                        } else {
                            if (request.requester === currentUser) {
                                return (
                                    <tr className='tableRows'>
                                        <td>{'[REQUEST SENT TO ' + request.responder.toUpperCase() + ']\n' + request.memo}</td>
                                        <td className="align-middle">{formatCurrency(request.amount) + '\n' + request.requestStatus}</td>
                                        <td className="align-middle">{approveButton(request)}</td>
                                        <td className="align-middle">{denyButton(request)}</td>
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr className='tableRows'>
                                        <td>{'[REQUEST FROM ' + request.requester.toUpperCase() + ']\n' + request.memo}</td>
                                        <td className="align-middle">{formatCurrency(request.amount) + '\n' + request.requestStatus}</td>
                                        <td className="align-middle">{approveButton(request)}</td>
                                        <td className="align-middle">{denyButton(request)}</td>
                                    </tr>
                                )
                            }
                        }
                    })
                }
            </>

        )
    }
}
export default TableRows;
