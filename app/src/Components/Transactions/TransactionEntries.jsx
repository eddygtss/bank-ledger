import { Table } from "reactstrap";
import React from "react";
import TableRows from "./TableRows";

const TransactionEntries = ({accountInfo, transType, setMessage}) => {
    const getRequestTransactions = () => {
        return accountInfo.accountName && accountInfo.requestHistory;
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
            return type.includes('withdrawal') ||
                ((status.includes('sent') || status.includes('approved')) && (type.includes('send') || type.includes('request')));
        });
    }


    if(transType === 'moneyOut') {
        return (
            <Table
                className="bdr table-danger p-3">
                <tbody className="text-center">
                    {TableRows(getMoneyOutTransactions(), false, accountInfo, {setMessage})}
                    {!getMoneyOutTransactions().length && 'No transactions recorded.'}
                </tbody>
            </Table>
        )
    } else if(transType === 'moneyIn') {
        return(
            <Table
                className="bdr table-success p-3">
                <tbody className="text-center">
                    {TableRows(getMoneyInTransactions(), false, accountInfo, {setMessage})}
                    {!getMoneyInTransactions().length && 'No transactions recorded.'}
                </tbody>
            </Table>
        )
    } else if (transType === 'request') {
        return (
            <Table
                className="bdr table-info">
                <tbody className="text-center">
                    {TableRows(getRequestTransactions(), true, accountInfo, {setMessage})}
                    {!accountInfo.requestHistory.length && 'No requests recorded.'}
                </tbody>
            </Table>
        )
    }
}
export default TransactionEntries;