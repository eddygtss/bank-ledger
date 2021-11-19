import {callApi, formatCurrency} from "../../utils";
import React from "react";
import cogoToast from "cogo-toast";
import {CheckSquare, XSquare} from "react-feather";

const TableRows = (transactions, request, accountInfo, {setMessage}) => {
    const approveRequest = (request) => {
        callApi('approve-request', 'POST', request).then(result => {
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

    const denyRequest = (request) => {
        callApi('deny-request', 'POST', request).then(result => {
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

    const approveButton = (request) => {
        if (request.requestStatus === 'PENDING') {
            return (
                <CheckSquare color='green' onClick={() => approveRequest(request.id)}/>
            )
        }
    }
    const denyButton = (request) => {
        if (request.requestStatus === 'PENDING') {
            return (
                <XSquare color='red' onClick={() => denyRequest(request.id)}/>
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
                                        <tr className='text-center'>
                                            {transaction.date}
                                        </tr>
                                        <tr style={{
                                            whiteSpace: 'break-spaces',
                                            textAlign: 'center'
                                        }}>
                                            <td>{transaction.sender
                                                ? '[' + transaction.transactionType + ' SENT TO ' + transaction.sender.toUpperCase() + ']\n' + transaction.memo
                                                : '[' + transaction.transactionType + ']\n' + transaction.memo}</td>
                                            <td className="align-middle">{formatCurrency(transaction.amount)}</td>
                                        </tr>
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <tr className='text-center'>
                                            {transaction.date}
                                        </tr>
                                        <tr style={{
                                            whiteSpace: 'break-spaces',
                                            textAlign: 'center'
                                        }}>
                                            <td>{transaction.sender
                                                ? '[' + transaction.transactionType + ' FROM ' + transaction.recipient.toUpperCase() + ']\n' + transaction.memo
                                                : '[' + transaction.transactionType + ']\n' + transaction.memo}</td>
                                            <td className="align-middle">{formatCurrency(transaction.amount)}</td>
                                        </tr>
                                    </>
                                )
                            }
                        } else {
                            if (transaction.recipient === currentUser) {
                                return (
                                    <tr style={{
                                        whiteSpace: 'break-spaces',
                                        textAlign: 'center'
                                    }}>
                                        <td>{transaction.sender
                                            ? '[' + transaction.transactionType + ' SENT TO ' + transaction.sender.toUpperCase() + ']\n' + transaction.memo
                                            : '[' + transaction.transactionType + ']\n' + transaction.memo}</td>
                                        <td className="align-middle">{formatCurrency(transaction.amount)}</td>
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr style={{
                                        whiteSpace: 'break-spaces',
                                        textAlign: 'center'
                                    }}>
                                        <td>{transaction.sender
                                            ? '[' + transaction.transactionType + ' FROM ' + transaction.recipient.toUpperCase() + ']\n' + transaction.memo
                                            : '[' + transaction.transactionType + ']\n' + transaction.memo}</td>
                                        <td className="align-middle">{formatCurrency(transaction.amount)}</td>
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
                                        <tr className='text-center'>
                                            {request.date}
                                        </tr>
                                        <tr style={{
                                            whiteSpace: 'break-spaces',
                                            textAlign: 'center'
                                        }}>
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
                                        <tr className='text-center'>
                                            {request.date}
                                        </tr>
                                        <tr style={{
                                            whiteSpace: 'break-spaces',
                                            textAlign: 'center'
                                        }}>
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
                                    <tr style={{
                                        whiteSpace: 'break-spaces',
                                        textAlign: 'center'
                                    }}>
                                        <td>{'[REQUEST SENT TO ' + request.responder.toUpperCase() + ']\n' + request.memo}</td>
                                        <td className="align-middle">{formatCurrency(request.amount) + '\n' + request.requestStatus}</td>
                                        <td className="align-middle">{approveButton(request)}</td>
                                        <td className="align-middle">{denyButton(request)}</td>
                                    </tr>
                                )
                            } else {
                                return (
                                    <tr style={{
                                        whiteSpace: 'break-spaces',
                                        textAlign: 'center'
                                    }}>
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