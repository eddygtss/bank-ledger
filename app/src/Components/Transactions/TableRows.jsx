import {formatCurrency} from "../../utils";
import React from "react";

const TableRows = transactions => {
    let prevDate = null;

    return(
        <>
        {
            transactions.reverse().map((transaction) => {
                if (transaction.date !== prevDate) {
                    prevDate = transaction.date;
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
                                    ? '[' + transaction.transactionType + ' FROM ' + transaction.sender + ']\n' + transaction.memo
                                    : '[' + transaction.transactionType + ']\n' + transaction.memo}</td>
                                <td>{formatCurrency(
                                    transaction.transactionType === 'DEPOSIT'
                                    || transaction.transactionStatus === 'RECEIVED'
                                    || (transaction.transactionStatus === 'SENT' && transaction.transactionType === 'REQUEST') ? transaction.amount : transaction.amount * -1)}</td>
                            </tr>
                        </>
                    )
                } else {
                    return (
                        <tr style={{
                            whiteSpace: 'break-spaces',
                            textAlign: 'center'
                        }}>
                            <td>{transaction.sender
                                ? '[' + transaction.transactionType + ' FROM ' + transaction.sender + ']\n' + transaction.memo
                                : '[' + transaction.transactionType + ']\n' + transaction.memo}</td>
                            <td>{formatCurrency(
                                transaction.transactionType === 'DEPOSIT'
                                || transaction.transactionStatus === 'RECEIVED'
                                || (transaction.transactionStatus === 'SENT' && transaction.transactionType === 'REQUEST') ? transaction.amount : transaction.amount * -1)}</td>
                        </tr>
                    )
                }
            })
        }
        </>

    )

}
export default TableRows;