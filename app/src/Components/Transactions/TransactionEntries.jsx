import React from 'react';
import { Table } from 'reactstrap';
import TableRows from './TableRows';

const TransactionEntries = ({accountInfo, transType, reload, setReload}) => {
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
                <tbody className="text-center d-block" style={{height: "500px", overflowY: "scroll"}}>
                    {TableRows(getMoneyOutTransactions(), false, accountInfo, {reload, setReload})}
                    {!getMoneyOutTransactions().length && 'No transactions recorded.'}
                </tbody>
            </Table>
        )
    } else if(transType === 'moneyIn') {
        return(
            <Table
                className="bdr table-success p-3">
                <tbody className="text-center d-block" style={{height: "500px", overflowY: "scroll"}}>
                    {TableRows(getMoneyInTransactions(), false, accountInfo, {reload, setReload})}
                    {!getMoneyInTransactions().length && 'No transactions recorded.'}
                </tbody>
            </Table>
        )
    } else if (transType === 'request') {
        return (
            <Table
                className="bdr table-info m-auto">
                <tbody className="text-center d-block" style={{height: "85vh", overflowY: "scroll"}}>
                    {TableRows(getRequestTransactions(), true, accountInfo, {reload, setReload})}
                    {!accountInfo.requestHistory.length && 'No requests recorded.'}
                </tbody>
            </Table>
        )
    }
}
export default TransactionEntries;